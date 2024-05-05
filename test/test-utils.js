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

import { UnitTest } from '../dist/index.js';

const tests = [
    './unittest/test-unittest.js',
    './unittest/test-testrun.js',
    './test-types.js',
    './test-persist.js',
    './test-config.js',
    './test-time.js',
    './test-sun.js',
    './test-callbacks.js',
    './test-deep-merge.js',
    './test-retry.js',
    './test-taskqueue.js',
    './test-delay.js',
    './test-shutdown.js'
];

/**
 * Executes each test function in the 'tests' array asynchronously, logs the name of the test being run, and shows the result for each test.
 * It imports the test function dynamically using `require(test)` where `test` is the string representing the path to the module.
 * The test function is expected to return an object with a `showResult` method.
 * @async
 */
export const showResult = async () => {
    await import('./test-errorLog.js');
    for (const test of tests) {
        const testModule = await import(test);
        const testFunction = testModule.default;
        console.log(`running ${test}`);
        const { showResult } = await testFunction();
        showResult();
    }
};

/**
 * Executes each test function in the 'tests' array asynchronously, logs the name of the test being run, and collects the results of all tests.
 * It imports the test function dynamically using `require(test)` where `test` is the string representing the path to the module.
 * The test function is expected to return an object with a `getResult` method which is then called to get the result of the test.
 * @async
 * @returns {Promise} A Promise that resolves with a combined result of all tests. The format of the result depends on the implementation of `UnitTest.joinMultipleResults()`.
 */
export const getResult = async () => {
    const results = [];
    for (const test of tests) {
        const testModule = await import(test);
        const testFunction = testModule.default;
        console.log(`running ${test}`);
        const { getResult } = await testFunction();
        results.push(getResult());
    }
    return UnitTest.joinMultipleResults(...results);
};
