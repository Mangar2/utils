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
import { delay, TaskQueue, TestRun, getDirectory } from '../dist/index.js';
const VERBOSE = false;
const testrun = new TestRun(VERBOSE);

testrun.on('prepare', async (testcase) => {
    const taskQueue = new TaskQueue(100);
    taskQueue.callCount = 0;
    taskQueue.on('task', () => {
        taskQueue.callCount++;
    });
    return { taskQueue, functionName: testcase.functionName };
});

const runTest = async (test, testObject) => {
    const { taskQueue, functionName } = testObject;
    if (functionName === 'addTask') {
        for (const param of test.parameter) {
            taskQueue.addTask(param);
        }
    } else if (functionName === 'on') {
        taskQueue.on(...test.parameter);
    }
    if (test.delay) {
        await delay(test.delay);
    }
    return taskQueue;
};

testrun.on('run', runTest);

testrun.on('break', async (test, testObject) => {
    runTest(test, testObject);
});

export default () => testrun.asyncRun(['test-taskqueue-cases'], getDirectory(import.meta.url), 7, 'js');
