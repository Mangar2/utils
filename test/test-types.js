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
import { Types, TestRun, getDirectory } from '../dist/index.js';
const VERBOSE = false;
const testrun = new TestRun(VERBOSE);

testrun.on('prepare', testcase => {
    return testcase.functionName;
});

const runTest = (test, functionName) => {
    return Types[functionName](test.input);
};

testrun.on('run', runTest);

testrun.on('break', (test, automation) => {
    runTest(test, automation);
});

export default () => testrun.run(['test-types-cases'], getDirectory(import.meta.url), 71, 'js');
