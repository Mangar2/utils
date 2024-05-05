/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

'use strict';

import { TestRun } from '../../dist/index.js';
const VERBOSE = false;

const testRun = new TestRun(VERBOSE);

testRun.on('break', () => {
    testRun.unitTest.log('break');
});

testRun.on('prepare', (testcase) => {
    return testcase.prepare;
});

testRun.on('run', (test, testObject) => {
    testRun.unitTest.log('run');
    return { testObject, result: test.result };
});

export default () => testRun.run(['testrun-testcase'], __dirname, 3);
