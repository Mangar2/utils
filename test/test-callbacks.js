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
import { Callbacks, TestRun, getDirectory } from '../dist/index.js';
const VERBOSE = false;
const testrun = new TestRun(VERBOSE);

testrun.on('prepare', async testcase => {
    const callbacks = new Callbacks(testcase.supportedCallbacks);
    if (testcase.callbacks) {
        for (const name in testcase.callbacks) {
            callbacks.on(name, testcase.callbacks[name]);
        }
    }
    return { callbacks, function: testcase.functionName };
});

const runTest = async (test, testobject) => {
    const result = testobject.callbacks[testobject.function](...test.input);

    return result;
};

testrun.on('run', runTest);

testrun.on('break', async (test, automation) => {
    runTest(test, automation);
});

export default async () => await testrun.asyncRun(['test-callbacks-cases'], getDirectory(import.meta.url), 10, 'js');
