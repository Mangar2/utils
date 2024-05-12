/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
import { UnitTest, TestResult } from '../index.js';
export declare const getDirectory: (metaUrl: string) => string;
type Test = {
    description: string;
    expected: unknown;
    [key: string]: unknown;
};
/**
 * Manages the execution of tests based on JSON files.
 */
export declare class TestRun {
    private _verbose;
    private _callbacks;
    private _unitTest;
    private _testNo;
    private _parallel;
    private _fileContent;
    constructor(verbose?: boolean, parallel?: boolean);
    on: (event: string, callback: (...args: unknown[]) => unknown) => void;
    get unitTest(): UnitTest;
    get testNo(): number;
    /**
     * Asynchronously validates the test results against expected results.
     * @param test The test case being validated.
     * @param result The actual result obtained from executing the test.
     * @param testPath A string representing the path to the test, used for logging.
     * @param exact A boolean indicating whether the validation should be exact (strict).
     */
    asyncValidate(test: Test, result: unknown, testPath: string, exact?: boolean): Promise<void>;
    /**
     * Synchronously validates the test results against expected results.
     * @param test The test case being validated.
     * @param result The actual result obtained from executing the test.
     * @param testPath A string representing the path to the test, used for logging.
     * @param exact A boolean indicating whether the validation should be exact (strict).
     */
    validate(test: Test, result: unknown, testPath: string, exact?: boolean): void;
    /**
     * Asynchronously runs a single test based on the provided parameters.
     * @param test The test definition to be executed.
     * @param testPath The path to the test, used for logging and validation.
     * @param testObject The object or data prepared for the test.
     * @param validate A boolean that determines whether to validate the test results.
     * @param callBreak A boolean that indicates whether to interrupt the test execution for debugging.
     */
    private _asyncRunTest;
    /**
     * Synchronously runs a single test based on the provided parameters.
     * @param test The test definition to be executed.
     * @param testPath The path to the test, used for logging and validation.
     * @param testObject The object or data prepared for the test.
     * @param validate A boolean that determines whether to validate the test results.
     * @param callBreak A boolean that indicates whether to interrupt the test execution for debugging.
     */
    private _runTest;
    /**
     * Asynchronously runs all tests in a specified testcase.
     * @param testcase The testcase object containing all test definitions.
     * @param testcasePath The path to the testcase, used for identifying and logging purposes.
     * @param testNo The specific test number to run, or null to run all tests.
     */
    private _asyncRunTestcase;
    /**
     * Validates the test cases and their structure.
     *
     * @param content - The content to validate.
     * @returns An array of validated test cases.
     * @throws {Error} If the input is not an array of test cases, or if any test case or test has an invalid structure.
     */
    private validateTestCases;
    /**
     * Synchronously runs all tests in a specified testcase.
     * @param testcase The testcase object containing all test definitions.
     * @param testcasePath The path to the testcase, used for identifying and logging purposes.
     * @param testNo The specific test number to run, or null to run all tests.
     */
    private _runTestcase;
    /**
     * Synchronously processes a test file, running all testcases contained within it.
     * @param fileName The full path to the test file to be executed.
     * @param testNo Optional number indicating a specific test to run and then stop; defaults to running all tests.
     */
    private _runFile;
    /**
     * Asynchronously reruns the last test case, usually for debugging purposes. This method resets the test count and reruns the test file using the last test number.
     */
    asyncRunAgain(): Promise<void>;
    /**
     * Synchronously reruns the last test case, typically used for debugging. It resets the test count and reruns the test file synchronously using the last test number.
     */
    runAgain(): void;
    /**
     * Asynchronously runs tests based on JSON files specified. It handles loading of test files, execution of test cases, and aggregation of results.
     * @param files Array of file names or a single file name providing the test cases.
     * @param directory The directory containing the test files.
     * @param expectedAmount The expected number of successful test outcomes.
     * @param extension Optional file extension, defaults to 'json'.
     */
    asyncRun(files: string[] | string, directory: string, expectedAmount: number, extension?: string): Promise<TestResult>;
    /**
     * Synchronously runs tests based on JSON files specified. It handles loading of test files, execution of test cases, and logs the test results.
     * @param files Array of file names or a single file name providing the test cases.
     * @param directory The directory containing the test files.
     * @param expectedAmount The expected number of successful test outcomes.
     * @param extension Optional file extension, defaults to 'json'.
     */
    run(files: string[] | string, directory: string, expectedAmount: number, extension?: string): Promise<TestResult>;
}
export {};
