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
import assert from 'assert';
import { errorLog, Types, errorToString } from '../index.js';
/**
 * Defines a class for creating and managing unit tests.
 */
export class UnitTest {
    constructor(verbose = false, debug = false, _maxErrors = 99) {
        this._maxErrors = _maxErrors;
        this._successAmount = 0;
        this._failAmount = 0;
        this._verbose = verbose;
        this._debug = debug;
    }
    set verbose(verbose) {
        this._verbose = verbose;
    }
    get verbose() {
        return this._verbose;
    }
    set debug(debug) {
        this._debug = debug;
    }
    get debug() {
        return this._debug;
    }
    /**
     * Calculates and returns the overall test results.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     * @returns An object containing the result message and a failed status.
     */
    getResult(expectedSuccess, expectedFail = 0) {
        let resultMsg = `success: ${this._successAmount}, failed: ${this._failAmount}`;
        let failed = false;
        if (expectedSuccess !== this._successAmount) {
            resultMsg += `\nFailed! We expected ${expectedSuccess} success messages but have ${this._successAmount}`;
            failed = true;
        }
        else if (expectedFail !== this._failAmount) {
            resultMsg += `\nFailed! We expected ${expectedFail} fail messages but have ${this._failAmount}`;
            failed = true;
        }
        else {
            resultMsg += '\nPASSED!';
        }
        return {
            message: resultMsg,
            failed
        };
    }
    /**
     * Displays the test result and exits the process if there are any failures.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     */
    showResult(expectedSuccess, expectedFail = 0) {
        const result = this.getResult(expectedSuccess, expectedFail);
        console.log(result.message);
        if (result.failed) {
            process.exit(1);
        }
    }
    /**
     * Joins results from multiple test executions.
     * @param results A spread of result objects from various tests.
     * @returns A single joined result object.
     */
    static joinMultipleResults(...results) {
        let resultMsg = '';
        let failed = false;
        results.forEach(result => {
            resultMsg += `${result.message}\n`;
            failed = failed || result.failed;
        });
        return {
            message: resultMsg,
            failed
        };
    }
    /**
     * Provides access to the result functions bound to expected amounts.
     * @param expectedSuccess The expected number of successful test cases.
     * @param expectedFail The expected number of failed test cases.
     * @returns An object with bound result functions.
     */
    getResultFunctions(expectedAmount, expectedFail = 0) {
        return {
            showResult: () => this.showResult(expectedAmount, expectedFail),
            getResult: () => this.getResult(expectedAmount, expectedFail)
        };
    }
    /**
     * Registers a failure with an optional message and logs it.
     * @param message Optional message to log on failure.
     */
    fail(message = '') {
        const messageString = errorToString(message);
        this._failAmount++;
        if (this._verbose) {
            console.error(`${this._failAmount} Failed: ${messageString}`);
        }
        if (this._debug) {
            console.log(new Error().stack);
        }
        if ((this._verbose || this._debug) && this._failAmount > this._maxErrors) {
            console.error('Too many errors, terminating program');
            process.exit(1);
        }
    }
    /**
     * Registers a success with an optional message and logs it if verbose.
     * @param message Optional message to log on success.
     */
    success(message = '') {
        this._successAmount++;
        if (this._verbose) {
            console.log(`${this._successAmount} success: ${message}`);
        }
    }
    /**
     * Asserts that a value is true, logs a message if it fails.
     * @param test The value to test for truthiness.
     * @param message The message to log on success or failure.
     * @returns True if the test value is true, false otherwise.
     */
    assertTrue(test, message = '') {
        const formattedMessage = message ? `${message} - ` : '';
        if (test) {
            this.success(`${formattedMessage}Value is true`);
        }
        else {
            this.fail(`${formattedMessage}Expected true but got false.`);
        }
        return test;
    }
    /**
     * Asserts that a value is undefined.
     * @param test The value to test.
     * @param message The message to log on success or failure.
     * @returns True if the test value is undefined, false otherwise.
     */
    assertUndefined(test, message = '') {
        return this.assertEqual(test, undefined, message);
    }
    /**
     * Asserts that a value is false, logs a message if it fails.
     * @param test The value to test for falseness.
     * @param message The message to log on success or failure.
     * @returns True if the test value is false, false otherwise.
     */
    assertFalse(test, message = '') {
        const formattedMessage = message ? `${message} - ` : '';
        const result = !test;
        if (result) {
            this.success(`${formattedMessage}Value is false`);
        }
        else {
            this.fail(`${formattedMessage}Expected false but got true.`);
        }
        return result;
    }
    /**
     * Asserts that two values are equal using the "===" operator.
     * @param a The first value.
     * @param b The second value.
     * @param message The message to log on success or failure.
     * @returns True if the values are equal, false otherwise.
     */
    assertEqual(a, b, message = '') {
        const result = (a === b);
        if (result) {
            this.success(message);
        }
        else {
            this.fail(`Expected "${b}", but got "${a}" ${message}`);
        }
        return result;
    }
    /**
     * Asserts that no exceptions are thrown when executing a callback.
     * @param callback The function to execute.
     * @param message The message to log on failure.
     * @returns True if no exception is thrown, false otherwise.
     */
    assertNoException(callback, message = '') {
        try {
            callback();
            this.success(message);
            return true;
        }
        catch (err) {
            this.fail(`${message} ${err}`);
            return false;
        }
    }
    /**
     * Validates a result object against an expected object.
     * @param result The object to validate.
     * @param expected The expected object structure.
     * @param path The path used for logging.
     * @param exact If true, validates that the result object has no extra properties.
     * @returns True if the object matches the expected structure, false otherwise.
     */
    validateResult(result, expected, path, exact = false) {
        let resultStatus = true;
        if (!Types.isObject(result) || !Types.isObject(expected)) {
            this.fail(`${path}: result is not an object`);
            return false;
        }
        for (const property in expected) {
            if (result[property] !== expected[property]) {
                resultStatus = false;
                this.fail(`${path}/${property}`);
            }
        }
        if (exact) {
            for (const property in result) {
                if (expected[property] === undefined) {
                    resultStatus = false;
                    this.fail(`${path}/${property}`);
                }
            }
        }
        if (resultStatus) {
            this.success(path);
        }
        return resultStatus;
    }
    /**
     * Recursively replaces substrings in an object, array, or string.
     * @param input The input value to replace substrings in.
     * @param replacements An object containing the search and replacement strings.
     * @returns The input value with the specified substrings replaced.
     */
    replaceRec(input, replacements) {
        if (input === null || input === undefined) {
            return input;
        }
        else if (Types.isArray(input)) {
            return input.map((elem) => this.replaceRec(elem, replacements));
        }
        else if (Types.isObject(input)) {
            for (const key in input) {
                input[key] = this.replaceRec(input[key], replacements);
            }
            return input;
        }
        else {
            for (const searchValue in replacements) {
                const replaceValue = replacements[searchValue];
                if (input === searchValue) {
                    input = replaceValue;
                }
                else if (Types.isString(input) && Types.isString(replaceValue)) {
                    input = input.replace(new RegExp(searchValue, 'g'), replaceValue);
                }
            }
            return input;
        }
    }
    /**
     * Recursively validates an element against an expected specification.
     * @param toValidate Element to be validated.
     * @param expected Expected element.
     * @param path Path used for identification in messages.
     * @param exact If true, additional properties in `toValidate` are considered a mismatch.
     * @throws Throws an error message indicating the first difference between `toValidate` and `expected`.
     */
    validateRec(toValidate, expected, path, exact = false) {
        if (toValidate === expected) {
            // Do nothing
        }
        else if (toValidate === undefined) {
            throw new Error(`${path}: undefined`);
        }
        else if (Types.getType(toValidate) !== Types.getType(expected)) {
            throw new Error(`${path}: types are different ${Types.getType(toValidate)} !== ${Types.getType(expected)}`);
        }
        else if (Types.isArray(expected) && Types.isArray(toValidate)) {
            if (toValidate.length !== expected.length) {
                throw new Error(`${path}: arrays have different length`);
            }
            toValidate.forEach((item, index) => {
                this.validateRec(item, expected[index], `${path}/${index}`);
            });
        }
        else if (Types.isObject(expected) && Types.isObject(toValidate)) {
            Object.keys(expected).forEach(key => {
                this.validateRec(toValidate[key], expected[key], `${path}/${key}`);
            });
            if (exact) {
                Object.keys(toValidate).forEach(key => {
                    if (expected[key] === undefined) {
                        throw Error(`${path}: additional property ${key}`);
                    }
                });
            }
        }
        else {
            throw Error(`${path}: elements have different value: ${toValidate} !== ${expected}`);
        }
    }
    /**
     * Recursively compares two elements for equality, including nested objects and arrays.
     * @param a First element to compare.
     * @param b Second element to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    _deepEqualRec(a, b, path) {
        if (a === b) {
            return;
        }
        if (Types.getType(a) !== Types.getType(b)) {
            throw Error(`${path}: types are different ${Types.getType(a)} !== ${Types.getType(b)}`);
        }
        this._compareTypes(a, b, path);
        assert.deepStrictEqual(a, b, path);
    }
    /**
     * Compares two elements of the same type for equality.
     * @param a First element to compare.
     * @param b Second element to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    _compareTypes(a, b, path) {
        if (Types.isDate(a) && Types.isDate(b)) {
            this._compareDates(a, b, path);
        }
        else if (Types.isSet(a) && Types.isSet(b)) {
            this._compareSets(a, b, path);
        }
        else if (Types.isMap(a) && Types.isMap(b)) {
            this._compareMaps(a, b, path);
        }
        else if (Types.isArray(a) && Types.isArray(b)) {
            this._compareArrays(a, b, path);
        }
        else if (Types.isRegExp(a) && Types.isRegExp(b)) {
            this._compareRegex(a, b, path);
        }
        else if (Types.isObject(a) && Types.isObject(b)) {
            this._compareObjects(a, b, path);
        }
        else {
            throw Error(`${path}: elements have different value: ${a} !== ${b} or types ${Types.getType(a)} != ${Types.getType(b)}}`);
        }
    }
    /**
     * Compares two Date objects for equality.
     * @param a First Date object to compare.
     * @param b Second Date object to compare.
     * @param path Path to the Date objects to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    _compareDates(a, b, path) {
        if (a.getTime() !== b.getTime()) {
            throw Error(`${path}: not both dates or dates are different`);
        }
    }
    /**
     * Compares two Set objects for equality.
     * @param a First Set object to compare.
     * @param b Second Set object to compare.
     * @param path Path to the Set objects to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    _compareSets(a, b, path) {
        if (a.size !== b.size) {
            throw Error(`${path}: sets have different size`);
        }
        a.forEach(elem => {
            if (!b.has(elem)) {
                throw Error(`${path}: missing element ${elem}`);
            }
        });
    }
    /**
     * Compares two Map objects recursively.
     * @param a First map to compare.
     * @param b Second map to compare.
     * @param path Path to the element to compare.
     * @throws Throws a description of the difference including the path to the element.
     */
    _compareMaps(a, b, path) {
        if (a.size !== b.size) {
            throw Error(`${path}: maps have different size`);
        }
        a.forEach((value, key) => {
            if (!b.has(key)) {
                throw Error(`${path}: missing property ${key}`);
            }
            else {
                this._deepEqualRec(value, b.get(key), `${path}/${key}`);
            }
        });
    }
    /**
     * Compares two arrays for equality, including nested objects and arrays.
     * @param a First array to compare.
     * @param b Second array to compare.
     * @param path Path to the array to compare.
     * @throws Throws a description of the difference including the path to the array.
     */
    _compareArrays(a, b, path) {
        if (a.length !== b.length) {
            throw Error(`${path}: arrays have different length`);
        }
        a.forEach((item, index) => {
            this._deepEqualRec(item, b[index], `${path}[${index}]`);
        });
    }
    /**
     * Compares two regular expressions for equality.
     * @param a First regular expression to compare.
     * @param b Second regular expression to compare.
     * @param path Path to the regular expression to compare.
     * @throws Throws a description of the difference including the path to the regular expression.
     */
    _compareRegex(a, b, path) {
        if (a.toString() !== b.toString()) {
            throw Error(`${path}: regular expressions are different: ${a} !== ${b}`);
        }
    }
    /**
     * Compares two objects for equality, including nested objects and arrays.
     * @param a First object to compare.
     * @param b Second object to compare.
     * @param path Path to the object to compare.
     * @throws Throws a description of the difference including the path to the object.
     */
    _compareObjects(a, b, path) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            throw Error(`${path}: objects have different amount of properties`);
        }
        aKeys.forEach(key => {
            if (b[key] === undefined) {
                throw Error(`${path}: missing property ${key}`);
            }
            this._deepEqualRec(a[key], b[key], `${path}.${key}`);
        });
        if (a.constructor.name !== b.constructor.name) {
            throw Error(`${path}: objects have different constructor names: ${a.constructor.name} !== ${b.constructor.name}`);
        }
    }
    /**
    * Compares two objects deeply and logs results.
    * @param a First object to compare.
    * @param b Second object to compare.
    * @param message Optional message to display on results.
    * @returns True if objects are deeply equal, false otherwise.
    */
    assertDeepEqual(a, b, message = '') {
        let result = true;
        message = message || '';
        try {
            this._deepEqualRec(a, b, '');
            assert.deepStrictEqual(a, b, message);
            this.success(message);
        }
        catch (err) {
            this.fail(`${message} ${err}`);
            result = false;
        }
        return result;
    }
    /**
     * Asserts that two values are not deeply equal.
     *
     * @param a - The first value to compare.
     * @param b - The second value to compare.
     * @param message - An optional message to display if the assertion fails.
     * @returns `true` if the values are not deeply equal, `false` otherwise.
     */
    assertDeepNotEqual(a, b, message = '') {
        let result = true;
        message = message || '';
        try {
            this._deepEqualRec(a, b, '');
            assert.deepStrictEqual(a, b, message);
            this.fail(message);
        }
        catch (err) {
            this.success(`${message} ${err}`);
            result = false;
        }
        return result;
    }
    /**
     * Executes a function and checks for a thrown exception of a specific type.
     * @param callback The function that is expected to throw an exception.
     * @param expectedException The constructor of the expected exception type.
     * @param message Optional message to display on success or failure.
     * @returns True if the expected exception is thrown, false otherwise.
     */
    expectException(callback, expectedException, message = '') {
        try {
            callback();
        }
        catch (err) {
            const isExpectedException = expectedException === undefined ||
                err instanceof expectedException ||
                (Types.isString(err) && Types.isString(expectedException));
            if (isExpectedException) {
                if (Types.isString(err)) {
                    message = `${message}${err}`;
                }
                this.success(message);
                return true;
            }
            else {
                this.fail(`Expected exception ${expectedException.name}, but got ${err.constructor.name}. ${message}`);
            }
            return true;
        }
        this.fail(`No exception was thrown. ${message}`);
        return false;
    }
    /**
     * Logs a message if verbose mode is enabled.
     * @param message The message to log.
     */
    log(message) {
        if (this._verbose) {
            console.log(message);
        }
    }
    /**
     * Logs an error message or object if verbose mode is enabled.
     * @param error The error message or object to log.
     */
    logError(error) {
        if (this._verbose) {
            errorLog(error, this._debug);
        }
    }
}
//# sourceMappingURL=unittest.js.map