/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
import { Types, UnitTest, Callbacks } from '../index.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
export const getDirectory = (metaUrl) => {
    const filename = fileURLToPath(metaUrl);
    const _dirname = dirname(filename);
    return _dirname;
};
/**
 * Manages the execution of tests based on JSON files.
 */
export class TestRun {
    constructor(verbose = false, parallel = false) {
        this.on = (event, callback) => {
            this._callbacks.on(event, callback);
        };
        this._verbose = verbose;
        this._callbacks = new Callbacks(['prepare', 'run', 'validate', 'break', 'cleanup']);
        this._unitTest = new UnitTest(this._verbose, this._verbose);
        this._testNo = 0;
        this._parallel = parallel;
        this.on('prepare', () => { });
        this.on('cleanup', () => { });
    }
    get unitTest() {
        return this._unitTest;
    }
    get testNo() {
        return this._testNo;
    }
    /**
     * Asynchronously validates the test results against expected results.
     * @param test The test case being validated.
     * @param result The actual result obtained from executing the test.
     * @param testPath A string representing the path to the test, used for logging.
     * @param exact A boolean indicating whether the validation should be exact (strict).
     */
    async asyncValidate(test, result, testPath, exact = false) {
        const expected = test.expected;
        try {
            this.unitTest.validateRec(result, expected, testPath, exact);
            this.unitTest.success(testPath);
        }
        catch (err) {
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
    validate(test, result, testPath, exact = false) {
        const expected = test.expected;
        try {
            this.unitTest.validateRec(result, expected, testPath, exact);
            this.unitTest.success(testPath);
        }
        catch (err) {
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
    async _asyncRunTest(test, testPath, testObject, validate, callBreak) {
        try {
            if (callBreak) {
                await this._callbacks.invokeCallbackAsync('break', test, testObject);
            }
            else {
                const result = await this._callbacks.invokeCallbackAsync('run', test, testObject);
                if (validate) {
                    if (this._callbacks.hasCallback('validate')) {
                        await this._callbacks.invokeCallbackAsync('validate', test, result, testPath);
                    }
                    else {
                        await this.asyncValidate(test, result, testPath);
                    }
                }
            }
        }
        catch (err) {
            if (test.expected instanceof Error) {
                this._unitTest.success(testPath);
            }
            else {
                try {
                    this._callbacks.invokeCallback('break', test, testObject);
                }
                catch (breakErr) {
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
    _runTest(test, testPath, testObject, validate, callBreak) {
        try {
            if (callBreak) {
                this._callbacks.invokeCallback('break', test, testObject);
            }
            else {
                const result = this._callbacks.invokeCallback('run', test, testObject);
                if (validate) {
                    if (this._callbacks.hasCallback('validate')) {
                        this._callbacks.invokeCallback('validate', test, result, testPath);
                    }
                    else {
                        this.validate(test, result, testPath);
                    }
                }
            }
        }
        catch (err) {
            if (test.expected instanceof Error) {
                this._unitTest.success(testPath);
            }
            else {
                try {
                    this._callbacks.invokeCallback('break', test, testObject);
                }
                catch (breakErr) {
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
    async _asyncRunTestcase(testcase, testcasePath, testNo) {
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
    validateTestCases(content) {
        if (!Types.isArray(content)) {
            throw new Error('Invalid input: Expected an array of test cases.');
        }
        content.forEach((testCase, index) => {
            if (!Types.isObject(testCase)) {
                throw new Error(`Invalid type for test case at index ${index}: Expected an object.`);
            }
            if (!Types.isString(testCase.description)) {
                throw new Error(`Missing or invalid 'description' for test case at index ${index}: Expected a string.`);
            }
            if (!Array.isArray(testCase.tests)) {
                throw new Error(`Invalid or missing 'tests' array for test case at index ${index}.`);
            }
            testCase.tests.forEach((test, testIndex) => {
                if (!Types.isObject(test)) {
                    throw new Error(`Invalid type for test at index ${testIndex} in test case ${index}: Expected an object.`);
                }
                if (!test.description || typeof test.description !== 'string') {
                    throw new Error(`Missing or invalid 'description' for test at index ${testIndex} in test case ${index}: Expected a string.`);
                }
            });
        });
        return content; // Here we assert the type since we've manually validated the structure
    }
    /**
     * Synchronously runs all tests in a specified testcase.
     * @param testcase The testcase object containing all test definitions.
     * @param testcasePath The path to the testcase, used for identifying and logging purposes.
     * @param testNo The specific test number to run, or null to run all tests.
     */
    _runTestcase(testcase, testcasePath, testNo) {
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
     * Synchronously processes a test file, running all testcases contained within it.
     * @param fileName The full path to the test file to be executed.
     * @param testNo Optional number indicating a specific test to run and then stop; defaults to running all tests.
     */
    async _runFile(fileName, useAsync, testNo = null) {
        if (fileName !== null) {
            this._fileContent = await import(fileName); // Dynamic import of the JSON or module containing tests
        }
        if (typeof this._fileContent !== 'object' || this._fileContent === null) {
            return;
        }
        this._unitTest.log('Processing ' + fileName);
        const testcases = this.validateTestCases('default' in this._fileContent ? this._fileContent.default : this._fileContent);
        for (const testcase of testcases) {
            const testcasePath = `${fileName}/${testcase.description}`;
            if (useAsync) {
                await this._asyncRunTestcase(testcase, testcasePath, testNo);
            }
            else {
                this._runTestcase(testcase, testcasePath, testNo);
            }
            if (testNo !== null && this._testNo >= testNo) {
                break; // Stop further execution if the specific test number is reached
            }
        }
    }
    /**
     * Asynchronously reruns the last test case, usually for debugging purposes. This method resets the test count and reruns the test file using the last test number.
     */
    async asyncRunAgain() {
        const testNo = this._testNo;
        this._testNo = 0; // Reset the test number before rerun
        await this._runFile(null, true, testNo); // Assumes the test data is appropriately set to rerun the specific test case
    }
    /**
     * Synchronously reruns the last test case, typically used for debugging. It resets the test count and reruns the test file synchronously using the last test number.
     */
    runAgain() {
        const testNo = this._testNo;
        this._testNo = 0; // Reset the test number before rerun
        this._runFile(null, false, testNo); // Assumes the test data is appropriately set to rerun the specific test case
    }
    /**
     * Asynchronously runs tests based on JSON files specified. It handles loading of test files, execution of test cases, and aggregation of results.
     * @param files Array of file names or a single file name providing the test cases.
     * @param directory The directory containing the test files.
     * @param expectedAmount The expected number of successful test outcomes.
     * @param extension Optional file extension, defaults to 'json'.
     */
    async asyncRun(files, directory, expectedAmount, extension = 'json') {
        const start = new Date().getTime();
        const promises = [];
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (const fileName of files) {
            const fullFileName = `${directory}/${fileName}${extension ? '.' + extension : ''}`;
            const fileUrl = pathToFileURL(fullFileName).href;
            if (this._parallel) {
                promises.push(this._runFile(fileUrl, true));
            }
            else {
                await this._runFile(fileUrl, true);
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
    async run(files, directory, expectedAmount, extension = 'json') {
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (const fileName of files) {
            const fullFileName = `${directory}/${fileName}${extension ? '.' + extension : ''}`;
            const fileUrl = pathToFileURL(fullFileName).href;
            await this._runFile(fileUrl, false);
        }
        console.log('All tests completed.');
        return this._unitTest.getResultFunctions(expectedAmount);
    }
}
//# sourceMappingURL=testrun.js.map