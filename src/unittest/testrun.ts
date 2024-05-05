/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

import { Types, UnitTest, TestResult, Callbacks } from '../index.js';

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

export const getDirectory = (metaUrl: string) => {
    const filename = fileURLToPath(metaUrl);
    const _dirname = dirname(filename);
    return _dirname;
};

type Test = {
    description: string;
    expected: unknown;
    [key: string]: unknown;
};

type Testcase = {
    description: string;
    [key: string]: unknown;
    tests: Test[];
};

type PrepareCallback = (testcase: Testcase, testcasePath: string) => Promise<unknown> | unknown;
type RunCallback = (test: Test, testObject: unknown) => Promise<unknown> | unknown;
type ValidateCallback = (test: Test, result: unknown, testPath: string) => Promise<void> | void;
type BreakCallback = () => Promise<void> | void;

/**
 * Manages the execution of tests based on JSON files.
 */
export class TestRun {
    private _verbose: boolean;
    private _callbacks: Callbacks;
    private _unitTest: UnitTest;
    private _testNo: number;
    private _parallel: boolean;

    constructor (verbose: boolean = false, parallel: boolean = false) {
        this._verbose = verbose;
        this._callbacks = new Callbacks(['prepare', 'run', 'validate', 'break', 'cleanup']);
        this._unitTest = new UnitTest(this._verbose, this._verbose);
        this._testNo = 0;
        this._parallel = parallel;
        this.on('prepare', () => { });
        this.on('cleanup', () => { });
    }

    on = <T extends PrepareCallback | RunCallback | ValidateCallback | BreakCallback>(event: string, callback: T) => {
        this._callbacks.on(event, callback);
    };

    get unitTest (): UnitTest {
        return this._unitTest;
    }

    get testNo (): number {
        return this._testNo;
    }

    /**
     * Asynchronously validates the test results against expected results.
     * @param test The test case being validated.
     * @param result The actual result obtained from executing the test.
     * @param testPath A string representing the path to the test, used for logging.
     * @param exact A boolean indicating whether the validation should be exact (strict).
     */
    async asyncValidate (test: Test, result: unknown, testPath: string, exact: boolean = false): Promise<void> {
        const expected = test.expected;
        try {
            this.unitTest.validateRec(result, expected, testPath, exact);
            this.unitTest.success(testPath);
        } catch (err) {
            this.unitTest.fail(err);
            console.log(`Expected: ${JSON.stringify(expected, null, 2)}`);
            console.log(`Result: ${JSON.stringify(result, null, 2)}`);
            await this.asyncRunAgain();
        }
    }

    /**
     * Synchronously validates the test results against expected results.
     * @param test The test case being validated.
     * @param result The actual result obtained from executing the test.
     * @param testPath A string representing the path to the test, used for logging.
     * @param exact A boolean indicating whether the validation should be exact (strict).
     */
    validate (test: Test, result: unknown, testPath: string, exact: boolean = false): void {
        const expected = test.expected;
        try {
            this.unitTest.validateRec(result, expected, testPath, exact);
            this.unitTest.success(testPath);
        } catch (err) {
            this.unitTest.fail(err);
            console.log(`Expected: ${JSON.stringify(expected, null, 2)}`);
            console.log(`Result: ${JSON.stringify(result, null, 2)}`);
            this.runAgain();
        }
    }

    /**
     * Asynchronously runs a single test based on the provided parameters.
     * @param test The test definition to be executed.
     * @param testPath The path to the test, used for logging and validation.
     * @param testObject The object or data prepared for the test.
     * @param validate A boolean that determines whether to validate the test results.
     * @param callBreak A boolean that indicates whether to interrupt the test execution for debugging.
     */
    private async _asyncRunTest (test: Test, testPath: string, testObject: unknown, validate: boolean, callBreak: boolean): Promise<void> {
        try {
            if (callBreak) {
                await this._callbacks.invokeCallbackAsync('break', test, testObject);
            } else {
                const result = await this._callbacks.invokeCallbackAsync('run', test, testObject);
                if (validate) {
                    if (this._callbacks.hasCallback('validate')) {
                        await this._callbacks.invokeCallbackAsync('validate', test, result, testPath);
                    } else {
                        await this.asyncValidate(test, result, testPath);
                    }
                }
            }
        } catch (err) {
            if (test.expected instanceof Error) {
                this._unitTest.success(testPath);
            } else {
                try {
                    this._callbacks.invokeCallback('break', test, testObject);
                } catch (breakErr) {
                    // do nothing
                }
                this._unitTest.fail(`${testPath} - Run test exception`);
                this._unitTest.logError(err);
            }
        }
    }

    /**
     * Synchronously runs a single test based on the provided parameters.
     * @param test The test definition to be executed.
     * @param testPath The path to the test, used for logging and validation.
     * @param testObject The object or data prepared for the test.
     * @param validate A boolean that determines whether to validate the test results.
     * @param callBreak A boolean that indicates whether to interrupt the test execution for debugging.
     */
    private _runTest (test: Test, testPath: string, testObject: unknown, validate: boolean, callBreak: boolean): void {
        try {
            if (callBreak) {
                this._callbacks.invokeCallback('break', test, testObject);
            } else {
                const result = this._callbacks.invokeCallback('run', test, testObject);
                if (validate) {
                    if (this._callbacks.hasCallback('validate')) {
                        this._callbacks.invokeCallback('validate', test, result, testPath);
                    } else {
                        this.validate(test, result, testPath);
                    }
                }
            }
        } catch (err) {
            if (test.expected instanceof Error) {
                this._unitTest.success(testPath);
            } else {
                try {
                    this._callbacks.invokeCallback('break', test, testObject);
                } catch (breakErr) {
                    // do nothing
                }
                this._unitTest.fail(`${testPath} - Run test exception`);
                this._unitTest.logError(err);
            }
        }
    }

    /**
     * Asynchronously runs all tests in a specified testcase.
     * @param testcase The testcase object containing all test definitions.
     * @param testcasePath The path to the testcase, used for identifying and logging purposes.
     * @param testNo The specific test number to run, or null to run all tests.
     */
    private async _asyncRunTestcase (testcase: Testcase, testcasePath: string, testNo: number | null): Promise<void> {
        const testObject = await this._callbacks.invokeCallbackAsync('prepare', testcase, testcasePath);
        for (const test of testcase.tests) {
            this._testNo++;
            const testPath = `${testcasePath}/${test.description} (${this._testNo})`;
            const validate = testNo === null; // Validate only if no specific test number is provided
            const doBreak = this._testNo === testNo;
            await this._asyncRunTest(test, testPath, testObject, validate, doBreak);

            if (doBreak) {
                break; // Exit the loop if it's a break condition
            }
        }
        await this._callbacks.invokeCallbackAsync('cleanup', testObject);
    }

    /**
     * Validates the test cases and their structure.
     *
     * @param content - The content to validate.
     * @returns An array of validated test cases.
     * @throws {Error} If the input is not an array of test cases, or if any test case or test has an invalid structure.
     */
    private validateTestCases (content: unknown): Testcase[] {
        if (!Types.isArray(content)) {
            throw new Error('Invalid input: Expected an array of test cases.');
        }

        content.forEach((testCase: unknown, index: number) => {
            if (!Types.isObject(testCase)) {
                throw new Error(`Invalid type for test case at index ${index}: Expected an object.`);
            }
            if (!Types.isString(testCase.description)) {
                throw new Error(`Missing or invalid 'description' for test case at index ${index}: Expected a string.`);
            }
            if (!Array.isArray(testCase.tests)) {
                throw new Error(`Invalid or missing 'tests' array for test case at index ${index}.`);
            }

            testCase.tests.forEach((test: unknown, testIndex: number) => {
                if (!Types.isObject(test)) {
                    throw new Error(`Invalid type for test at index ${testIndex} in test case ${index}: Expected an object.`);
                }
                if (!test.description || typeof test.description !== 'string') {
                    throw new Error(`Missing or invalid 'description' for test at index ${testIndex} in test case ${index}: Expected a string.`);
                }
            });
        });
        return content as Testcase[]; // Here we assert the type since we've manually validated the structure
    }

    /**
     * Synchronously runs all tests in a specified testcase.
     * @param testcase The testcase object containing all test definitions.
     * @param testcasePath The path to the testcase, used for identifying and logging purposes.
     * @param testNo The specific test number to run, or null to run all tests.
     */
    private _runTestcase (testcase: Testcase, testcasePath: string, testNo: number | null): void {
        const testObject = this._callbacks.invokeCallback('prepare', testcase, testcasePath);
        for (const test of testcase.tests) {
            this._testNo++;
            const testPath = `${testcasePath}/${test.description} (${this._testNo})`;
            const validate = testNo === null; // Validate only if no specific test number is provided
            const doBreak = this._testNo === testNo;
            this._runTest(test, testPath, testObject, validate, doBreak);

            if (doBreak) {
                break; // Exit the loop if it's a break condition
            }
        }
        this._callbacks.invokeCallback('cleanup', testObject);
    }

    /**
     * Asynchronously processes a test file, running all testcases contained within it.
     * @param fileName The full path to the test file to be executed.
     * @param testNo Optional number indicating a specific test to run and then stop; defaults to running all tests.
     */
    private async _asyncRunFile (fileName: string, testNo: number | null = null): Promise<void> {
        const fileContent = await import(fileName); // Dynamic import of the JSON or module containing tests
        this._unitTest.log('Processing ' + fileName);
        const testcases = this.validateTestCases(fileContent.default ? fileContent.default : fileContent);

        for (const testcase of testcases) {
            const testcasePath = `${fileName}/${testcase.description}`;
            await this._asyncRunTestcase(testcase, testcasePath, testNo);
            if (testNo !== null && this._testNo >= testNo) {
                break; // Stop further execution if the specific test number is reached
            }
        }
    }

    /**
     * Synchronously processes a test file, running all testcases contained within it.
     * @param fileName The full path to the test file to be executed.
     * @param testNo Optional number indicating a specific test to run and then stop; defaults to running all tests.
     */
    private async _runFile (fileName: string, testNo: number | null = null): Promise<void> {
        const fileContent = await import(fileName); // Synchronous require to load the test file
        this._unitTest.log('Processing ' + fileName);
        const testcases = this.validateTestCases(fileContent.default ? fileContent.default : fileContent);

        for (const testcase of testcases) {
            const testcasePath = `${fileName}/${testcase.description}`;
            this._runTestcase(testcase, testcasePath, testNo);
            if (testNo !== null && this._testNo >= testNo) {
                break; // Stop further execution if the specific test number is reached
            }
        }
    }

    /**
     * Asynchronously reruns the last test case, usually for debugging purposes. This method resets the test count and reruns the test file using the last test number.
     */
    async asyncRunAgain (): Promise<void> {
        const testNo = this._testNo;
        this._testNo = 0; // Reset the test number before rerun
        await this._asyncRunFile('rerun', testNo); // Assumes the test data is appropriately set to rerun the specific test case
    }

    /**
     * Synchronously reruns the last test case, typically used for debugging. It resets the test count and reruns the test file synchronously using the last test number.
     */
    runAgain (): void {
        const testNo = this._testNo;
        this._testNo = 0; // Reset the test number before rerun
        this._runFile('rerun', testNo); // Assumes the test data is appropriately set to rerun the specific test case
    }

    /**
     * Asynchronously runs tests based on JSON files specified. It handles loading of test files, execution of test cases, and aggregation of results.
     * @param files Array of file names or a single file name providing the test cases.
     * @param directory The directory containing the test files.
     * @param expectedAmount The expected number of successful test outcomes.
     * @param extension Optional file extension, defaults to 'json'.
     */
    async asyncRun (files: string[] | string, directory: string, expectedAmount: number, extension: string = 'json'): Promise<TestResult> {
        const start = new Date().getTime();
        const promises: Promise<void>[] = [];
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (const fileName of files) {
            const fullFileName = `${directory}/${fileName}${extension ? `.${extension}` : ''}`;
            const fileUrl = pathToFileURL(fullFileName).href;
            if (this._parallel) {
                promises.push(this._asyncRunFile(fileUrl));
            } else {
                await this._asyncRunFile(fileUrl);
            }
        }
        await Promise.all(promises);
        const runtime = new Date().getTime() - start;
        console.log(`Runtime: ${runtime / 1000} seconds`);
        return this._unitTest.getResultFunctions(expectedAmount);
    }

    /**
     * Synchronously runs tests based on JSON files specified. It handles loading of test files, execution of test cases, and logs the test results.
     * @param files Array of file names or a single file name providing the test cases.
     * @param directory The directory containing the test files.
     * @param expectedAmount The expected number of successful test outcomes.
     * @param extension Optional file extension, defaults to 'json'.
     */
    async run (files: string[] | string, directory: string, expectedAmount: number, extension: string = 'json'): Promise<TestResult> {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (const fileName of files) {
            const fullFileName = `${directory}\\${fileName}${extension ? '.' + extension : ''}`;
            const fileUrl = pathToFileURL(fullFileName).href;
            await this._runFile(fileUrl);
        }
        console.log('All tests completed.');
        return this._unitTest.getResultFunctions(expectedAmount);
    }
}
