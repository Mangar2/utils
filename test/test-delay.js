/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

'use strict';

// Import the delay function
import { delay, UnitTest } from '../dist/index.js';
const VERBOSE = false;
const DEBUG = false;
const unitTest = new UnitTest(VERBOSE, DEBUG);

// Define test cases
const testCases = [
    {
        input: [0],
        expected: true
    },
    {
        input: [1000],
        expected: true
    },
    {
        input: [5000],
        expected: true
    },
    {
        input: [100, true],
        expected: true
    },
    {
        input: [500, false],
        expected: true
    }
];

// Define the test function
async function testDelay () {
    // Loop through each test case
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const input = testCase.input;

        // Call the delay function with the input arguments
        try {
            // Call the delay function with the input arguments
            await delay(...input);
            // The delay function successfully resolved
            unitTest.success(`Test case ${i + 1} passed.`);
        } catch (err) {
            // The delay function threw an error
            unitTest.fail(`Test case ${i + 1} failed.`);
        }
    }
}

export default async () => {
    await testDelay();
    return unitTest.getResultFunctions(5);
};
