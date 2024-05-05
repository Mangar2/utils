/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview This module provides a simple class to support unit tests, this is not a framework.
 * Use "testrun", as a simple uinit test framework
 */
export type TestResult = {
    showResult: () => void;
    getResult: () => {
        message: string;
        failed: boolean;
    };
};
/**
 * Defines a class for creating and managing unit tests.
 */
export declare class UnitTest {
    private _maxErrors;
    private _successAmount;
    private _failAmount;
    private _verbose;
    private _debug;
    constructor(verbose?: boolean, debug?: boolean, _maxErrors?: number);
    set verbose(verbose: boolean);
    get verbose(): boolean;
    set debug(debug: boolean);
    get debug(): boolean;
    /**
     * Calculates and returns the overall test results.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     * @returns An object containing the result message and a failed status.
     */
    getResult(expectedSuccess: number, expectedFail?: number): {
        message: string;
        failed: boolean;
    };
    /**
     * Displays the test result and exits the process if there are any failures.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     */
    showResult(expectedSuccess: number, expectedFail?: number): void;
    /**
     * Joins results from multiple test executions.
     * @param results A spread of result objects from various tests.
     * @returns A single joined result object.
     */
    static joinMultipleResults(...results: {
        message: string;
        failed: boolean;
    }[]): {
        message: string;
        failed: boolean;
    };
    /**
     * Provides access to the result functions bound to expected amounts.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     * @returns An object with bound result functions.
     */
    getResultFunctions(expectedAmount: number, expectedFail?: number): TestResult;
    /**
     * Registers a failure with an optional message and logs it.
     * @param message Optional message to log on failure.
     */
    fail(message?: unknown): void;
    /**
     * Registers a success with an optional message and logs it if verbose.
     * @param message Optional message to log on success.
     */
    success(message?: string): void;
    /**
     * Asserts that a value is true, logs a message if it fails.
     * @param test The value to test for truthiness.
     * @param message The message to log on success or failure.
     * @returns True if the test value is true, false otherwise.
     */
    assertTrue(test: boolean, message?: string): boolean;
    /**
     * Asserts that a value is undefined.
     * @param test The value to test.
     * @param message The message to log on success or failure.
     * @returns True if the test value is undefined, false otherwise.
     */
    assertUndefined(test: unknown, message?: string): boolean;
    /**
     * Asserts that a value is false, logs a message if it fails.
     * @param test The value to test for falseness.
     * @param message The message to log on success or failure.
     * @returns True if the test value is false, false otherwise.
     */
    assertFalse(test: boolean, message?: string): boolean;
    /**
     * Asserts that two values are equal using the "===" operator.
     * @param a The first value.
     * @param b The second value.
     * @param message The message to log on success or failure.
     * @returns True if the values are equal, false otherwise.
     */
    assertEqual(a: unknown, b: unknown, message?: string): boolean;
    /**
     * Asserts that no exceptions are thrown when executing a callback.
     * @param callback The function to execute.
     * @param message The message to log on failure.
     * @returns True if no exception is thrown, false otherwise.
     */
    assertNoException(callback: () => void, message?: string): boolean;
    /**
     * Validates a result object against an expected object.
     * @param result The object to validate.
     * @param expected The expected object structure.
     * @param path The path used for logging.
     * @param exact If true, validates that the result object has no extra properties.
     * @returns True if the object matches the expected structure, false otherwise.
     */
    validateResult(result: unknown, expected: unknown, path: string, exact?: boolean): boolean;
    /**
     * Recursively replaces substrings in an object, array, or string.
     * @param input The input value to replace substrings in.
     * @param replacements An object containing the search and replacement strings.
     * @returns The input value with the specified substrings replaced.
     */
    replaceRec(input: unknown, replacements: {
        [index: string]: string;
    }): unknown;
    /**
     * Recursively validates an element against an expected specification.
     * @param toValidate Element to be validated.
     * @param expected Expected element.
     * @param path Path used for identification in messages.
     * @param exact If true, additional properties in `toValidate` are considered a mismatch.
     * @throws Throws an error message indicating the first difference between `toValidate` and `expected`.
     */
    validateRec(toValidate: unknown, expected: unknown, path: string, exact?: boolean): void;
    /**
     * Recursively compares two elements for equality, including nested objects and arrays.
     * @param a First element to compare.
     * @param b Second element to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    private _deepEqualRec;
    /**
     * Compares two elements of the same type for equality.
     * @param a First element to compare.
     * @param b Second element to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    private _compareTypes;
    /**
     * Compares two Date objects for equality.
     * @param a First Date object to compare.
     * @param b Second Date object to compare.
     * @param path Path to the Date objects to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    private _compareDates;
    /**
     * Compares two Set objects for equality.
     * @param a First Set object to compare.
     * @param b Second Set object to compare.
     * @param path Path to the Set objects to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    private _compareSets;
    /**
     * Compares two Map objects recursively.
     * @param a First map to compare.
     * @param b Second map to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    private _compareMaps;
    /**
     * Compares two arrays for equality, including nested objects and arrays.
     * @param a First array to compare.
     * @param b Second array to compare.
     * @param path Path to the array to compare.
     * @throws Throws a description of the difference including the path to the array.
     */
    private _compareArrays;
    /**
     * Compares two regular expressions for equality.
     * @param a First regular expression to compare.
     * @param b Second regular expression to compare.
     * @param path Path to the regular expression to compare.
     * @throws Throws a description of the difference including the path to the regular expression.
     */
    private _compareRegex;
    /**
     * Compares two objects for equality, including nested objects and arrays.
     * @param a First object to compare.
     * @param b Second object to compare.
     * @param path Path to the object to compare.
     * @throws Throws a description of the difference including the path to the object.
     */
    private _compareObjects;
    /**
    * Compares two objects deeply and logs results.
    * @param a First object to compare.
    * @param b Second object to compare.
    * @param message Optional message to display on results.
    * @returns True if objects are deeply equal, false otherwise.
    */
    assertDeepEqual(a: unknown, b: unknown, message?: string): boolean;
    /**
     * Asserts that two values are not deeply equal.
     *
     * @param a - The first value to compare.
     * @param b - The second value to compare.
     * @param message - An optional message to display if the assertion fails.
     * @returns `true` if the values are not deeply equal, `false` otherwise.
     */
    assertDeepNotEqual(a: unknown, b: unknown, message?: string): boolean;
    /**
     * Executes a function and checks for a thrown exception of a specific type.
     * @param callback The function that is expected to throw an exception.
     * @param expectedException The constructor of the expected exception type.
     * @param message Optional message to display on success or failure.
     * @returns True if the expected exception is thrown, false otherwise.
     */
    expectException(callback: () => void, expectedException: new (...args: unknown[]) => Error, message?: string): boolean;
    /**
     * Logs a message if verbose mode is enabled.
     * @param message The message to log.
     */
    log(message: string): void;
    /**
     * Logs an error message or object if verbose mode is enabled.
     * @param error The error message or object to log.
     */
    logError(error: unknown): void;
}
