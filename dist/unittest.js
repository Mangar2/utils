"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitTest = void 0;
const assert_1 = __importDefault(require("assert"));
const index_1 = require("./index");
const errorlog_1 = require("./errorlog");
/**
 * Defines a class for creating and managing unit tests.
 */
class UnitTest {
    constructor(verbose = false, debug = false) {
        this._successAmount = 0;
        this._failAmount = 0;
        /**
         * Calculates and returns the overall test results.
         * @param expectedSuccess The expected number of successful test cases.
         * @param expectedFail The expected number of failed test cases.
         * @returns An object containing the result message and a failed status.
         */
        this.getResult = (expectedSuccess, expectedFail = 0) => {
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
        };
        /**
         * Displays the test result and exits the process if there are any failures.
         * @param expectedSuccess The expected number of successful test cases.
         * @param expectedFail The expected number of failed test cases.
         */
        this.showResult = (expectedSuccess, expectedFail = 0) => {
            const result = this.getResult(expectedSuccess, expectedFail);
            console.log(result.message);
            if (result.failed) {
                process.exit(1);
            }
        };
        /**
         * Provides access to the result functions bound to expected amounts.
         * @param expectedSuccess The expected number of successful test cases.
         * @param expectedFail The expected number of failed test cases.
         * @returns An object with bound result functions.
         */
        this.getResultFunctions = (expectedAmount, expectedFail = 0) => ({
            showResult: () => this.showResult(expectedAmount, expectedFail),
            getResult: () => this.getResult(expectedAmount, expectedFail)
        });
        /**
         * Registers a failure with an optional message and logs it.
         * @param message Optional message to log on failure.
         */
        this.fail = (message = '') => {
            const messageString = (0, errorlog_1.errorToString)(message);
            this._failAmount++;
            if (this._verbose) {
                console.error(`${this._failAmount} Failed: ${messageString}`);
            }
            if (this._debug) {
                console.log(new Error().stack);
            }
            if ((this._verbose || this._debug) && this._failAmount > 10) {
                console.error('Too many errors, terminating program');
                process.exit(1);
            }
        };
        /**
         * Registers a success with an optional message and logs it if verbose.
         * @param message Optional message to log on success.
         */
        this.success = (message = '') => {
            this._successAmount++;
            if (this._verbose) {
                console.log(`${this._successAmount} success: ${message}`);
            }
        };
        /**
      * Asserts that a value is true, logs a message if it fails.
      * @param test The value to test for truthiness.
      * @param message The message to log on success or failure.
      * @returns True if the test value is true, false otherwise.
      */
        this.assertTrue = (test, message = '') => {
            const formattedMessage = message ? `${message} - ` : '';
            if (test) {
                this.success(`${formattedMessage}Value is true`);
            }
            else {
                this.fail(`${formattedMessage}Expected true but got false.`);
            }
            return test;
        };
        /**
         * Asserts that a value is undefined.
         * @param test The value to test.
         * @param message The message to log on success or failure.
         * @returns True if the test value is undefined, false otherwise.
         */
        this.assertUndefined = (test, message = '') => {
            return this.assertEqual(test, undefined, message);
        };
        /**
         * Asserts that a value is false, logs a message if it fails.
         * @param test The value to test for falseness.
         * @param message The message to log on success or failure.
         * @returns True if the test value is false, false otherwise.
         */
        this.assertFalse = (test, message = '') => {
            const formattedMessage = message ? `${message} - ` : '';
            const result = !test;
            if (result) {
                this.success(`${formattedMessage}Value is false`);
            }
            else {
                this.fail(`${formattedMessage}Expected false but got true.`);
            }
            return result;
        };
        /**
         * Asserts that two values are equal using the "===" operator.
         * @param a The first value.
         * @param b The second value.
         * @param message The message to log on success or failure.
         * @returns True if the values are equal, false otherwise.
         */
        this.assertEqual = (a, b, message = '') => {
            const result = (a === b);
            if (result) {
                this.success(message);
            }
            else {
                this.fail(`Expected "${b}", but got "${a}" ${message}`);
            }
            return result;
        };
        /**
         * Asserts that no exceptions are thrown when executing a callback.
         * @param callback The function to execute.
         * @param message The message to log on failure.
         * @returns True if no exception is thrown, false otherwise.
         */
        this.assertNoException = (callback, message = '') => {
            try {
                callback();
                this.success(message);
                return true;
            }
            catch (err) {
                this.fail(`${message} ${err}`);
                return false;
            }
        };
        /**
         * Validates a result object against an expected object.
         * @param result The object to validate.
         * @param expected The expected object structure.
         * @param path The path used for logging.
         * @param exact If true, validates that the result object has no extra properties.
         * @returns True if the object matches the expected structure, false otherwise.
         */
        this.validateResult = (result, expected, path, exact = false) => {
            let resultStatus = true;
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
        };
        /**
         * Recursively compares two elements for equality, including nested objects and arrays.
         * @param a First element to compare.
         * @param b Second element to compare.
         * @param path Path to the element to compare.
         * @throws Throws a description of the difference including the path to the element.
         */
        this._deepEqualRec = (a, b, path) => {
            if (a === b) {
                return;
            }
            if (index_1.Types.getType(a) !== index_1.Types.getType(b)) {
                throw `${path}: types are different ${index_1.Types.getType(a)} !== ${index_1.Types.getType(b)}`;
            }
            this._compareTypes(a, b, path);
            assert_1.default.deepStrictEqual(a, b, path);
        };
        /**
         * Compares two elements of the same type for equality.
         * @param a First element to compare.
         * @param b Second element to compare.
         * @param path Path to the element to compare.
         * @throws Throws a description of the difference including the path to the element.
         */
        this._compareTypes = (a, b, path) => {
            if (index_1.Types.isDate(a)) {
                this._compareDates(a, b, path);
            }
            else if (index_1.Types.isSet(a)) {
                this._compareSets(a, b, path);
            }
            else if (index_1.Types.isMap(a)) {
                this._compareMaps(a, b, path);
            }
            else if (index_1.Types.isArray(a)) {
                this._compareArrays(a, b, path);
            }
            else if (index_1.Types.isRegExp(a)) {
                this._compareRegex(a, b, path);
            }
            else if (index_1.Types.isObject(a)) {
                this._compareObjects(a, b, path);
            }
            else {
                throw `${path}: elements have different value: ${a} !== ${b} or types ${index_1.Types.getType(a)} != ${index_1.Types.getType(b)}}`;
            }
        };
        /**
         * Compares two Date objects for equality.
         * @param a First Date object to compare.
         * @param b Second Date object to compare.
         * @param path Path to the Date objects to compare.
         * @throws Throws a description of the difference including the path to the element.
         */
        this._compareDates = (a, b, path) => {
            if (a.getTime() !== b.getTime()) {
                throw `${path}: not both dates or dates are different`;
            }
        };
        /**
         * Compares two Set objects for equality.
         * @param a First Set object to compare.
         * @param b Second Set object to compare.
         * @param path Path to the Set objects to compare.
         * @throws Throws a description of the difference including the path to the element.
         */
        this._compareSets = (a, b, path) => {
            if (a.size !== b.size) {
                throw `${path}: sets have different size`;
            }
            a.forEach(elem => {
                if (!b.has(elem)) {
                    throw `${path}: missing element ${elem}`;
                }
            });
        };
        /**
         * Compares two Map objects recursively.
         * @param a First map to compare.
         * @param b Second map to compare.
         * @param path Path to the element to compare.
         * @throws Throws a description of the difference including the path to the element.
         */
        this._compareMaps = (a, b, path) => {
            if (a.size !== b.size) {
                throw `${path}: maps have different size`;
            }
            a.forEach((value, key) => {
                if (!b.has(key)) {
                    throw `${path}: missing property ${key}`;
                }
                else {
                    this._deepEqualRec(value, b.get(key), `${path}/${key}`);
                }
            });
        };
        /**
         * Compares two arrays for equality, including nested objects and arrays.
         * @param a First array to compare.
         * @param b Second array to compare.
         * @param path Path to the array to compare.
         * @throws Throws a description of the difference including the path to the array.
         */
        this._compareArrays = (a, b, path) => {
            if (a.length !== b.length) {
                throw `${path}: arrays have different length`;
            }
            a.forEach((item, index) => {
                this._deepEqualRec(item, b[index], `${path}[${index}]`);
            });
        };
        /**
         * Compares two regular expressions for equality.
         * @param a First regular expression to compare.
         * @param b Second regular expression to compare.
         * @param path Path to the regular expression to compare.
         * @throws Throws a description of the difference including the path to the regular expression.
         */
        this._compareRegex = (a, b, path) => {
            if (a.toString() !== b.toString()) {
                throw `${path}: regular expressions are different: ${a} !== ${b}`;
            }
        };
        /**
         * Compares two objects for equality, including nested objects and arrays.
         * @param a First object to compare.
         * @param b Second object to compare.
         * @param path Path to the object to compare.
         * @throws Throws a description of the difference including the path to the object.
         */
        this._compareObjects = (a, b, path) => {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) {
                throw `${path}: objects have different amount of properties`;
            }
            aKeys.forEach(key => {
                if (!b.hasOwnProperty(key)) {
                    throw `${path}: missing property ${key}`;
                }
                this._deepEqualRec(a[key], b[key], `${path}.${key}`);
            });
            if (a.constructor.name !== b.constructor.name) {
                throw `${path}: objects have different constructor names: ${a.constructor.name} !== ${b.constructor.name}`;
            }
        };
        /**
        * Compares two objects deeply and logs results.
        * @param a First object to compare.
        * @param b Second object to compare.
        * @param message Optional message to display on results.
        * @returns True if objects are deeply equal, false otherwise.
        */
        this.assertDeepEqual = (a, b, message = '') => {
            let result = true;
            message = message || '';
            try {
                this._deepEqualRec(a, b, '');
                assert_1.default.deepStrictEqual(a, b, message);
                this.success(message);
            }
            catch (err) {
                this.fail(`${message} ${err}`);
                result = false;
            }
            return result;
        };
        /**
         * Executes a function and checks for a thrown exception of a specific type.
         * @param callback The function that is expected to throw an exception.
         * @param expectedException The constructor of the expected exception type.
         * @param message Optional message to display on success or failure.
         * @returns True if the expected exception is thrown, false otherwise.
         */
        this.expectException = (callback, expectedException, message = '') => {
            try {
                callback();
            }
            catch (err) {
                const isExpectedException = expectedException === undefined
                    || err instanceof expectedException
                    || (index_1.Types.isString(err) && index_1.Types.isString(expectedException));
                if (isExpectedException) {
                    if (index_1.Types.isString(err)) {
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
        };
        /**
         * Logs a message if verbose mode is enabled.
         * @param message The message to log.
         */
        this.log = (message) => {
            if (this._verbose) {
                console.log(message);
            }
        };
        /**
         * Logs an error message or object if verbose mode is enabled.
         * @param error The error message or object to log.
         */
        this.logError = (error) => {
            if (this._verbose) {
                (0, index_1.errorLog)(error, this._debug);
            }
        };
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
     * Recursively replaces substrings in an object, array, or string.
     * @param input The input value to replace substrings in.
     * @param replacements An object containing the search and replacement strings.
     * @returns The input value with the specified substrings replaced.
     */
    replaceRec(input, replacements) {
        if (input === null || input === undefined) {
            return input;
        }
        else if (index_1.Types.isArray(input)) {
            return input.map((elem) => this.replaceRec(elem, replacements));
        }
        else if (index_1.Types.isObject(input)) {
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
                else if (index_1.Types.isString(input) && index_1.Types.isString(replaceValue)) {
                    input = input.replace(new RegExp(searchValue, 'g'), replaceValue);
                }
            }
            return input;
        }
    }
    ;
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
            return;
        }
        else if (toValidate === undefined) {
            throw `${path}: undefined`;
        }
        else if (index_1.Types.getType(toValidate) !== index_1.Types.getType(expected)) {
            throw `${path}: types are different ${index_1.Types.getType(toValidate)} !== ${index_1.Types.getType(expected)}`;
        }
        else if (index_1.Types.isArray(expected)) {
            if (toValidate.length !== expected.length) {
                throw `${path}: arrays have different length`;
            }
            toValidate.forEach((item, index) => {
                this.validateRec(item, expected[index], `${path}/${index}`);
            });
        }
        else if (index_1.Types.isObject(expected)) {
            Object.keys(expected).forEach(key => {
                this.validateRec(toValidate[key], expected[key], `${path}/${key}`);
            });
            if (exact) {
                Object.keys(toValidate).forEach(key => {
                    if (expected[key] === undefined) {
                        throw `${path}: additional property ${key}`;
                    }
                });
            }
        }
        else {
            throw `${path}: elements have different value: ${toValidate} !== ${expected}`;
        }
    }
    ;
}
exports.UnitTest = UnitTest;
/**
 * Joins results from multiple test executions.
 * @param results A spread of result objects from various tests.
 * @returns A single joined result object.
 */
UnitTest.joinMultipleResults = (...results) => {
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
};
//# sourceMappingURL=unittest.js.map