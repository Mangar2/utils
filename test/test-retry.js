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
import { Retry, TestRun, getDirectory } from '../dist/index.js';
const VERBOSE = false;
const testrun = new TestRun(VERBOSE);

testrun.on('prepare', async () => {
    const retry = new Retry(false);
    return retry;
});

const runTest = async (test, retry) => {
    test.start = Date.now();
    test.callbackFunctionCallCount = 0;
    test.callbackFunctionCallTimes = [];
    test.callbackFunction = () => {
        test.callbackFunctionCallCount++;
        test.callbackFunctionCallTimes.push(Math.floor((Date.now() - test.start) / 100) * 100);
    };
    if (test.functionName === 'retry') {
        await retry.retry(...test.input, test.callbackFunction);
    } else if (test.functionName === 'topicRetry') {
        retry.on(test.input[0], test.callbackFunction);
        if (test.input.length === 3) {
            test.input.push(test.callbackFunction);
        }
        await retry.topicRetry(...test.input);
    }
    return test;
};

testrun.on('run', runTest);

testrun.on('break', async (test, automation) => {
    runTest(test, automation);
});

export default () => {
    console.log('This test set will run 15 seconds ...');
    return testrun.asyncRun(['test-retry-cases'], getDirectory(import.meta.url), 6, 'js');
};
