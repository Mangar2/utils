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

import {
    isTimeOfDayString, stringToSeconds, timeOfDayStringToDate, dateToTimeOfDayInSeconds,
    Types, TestRun, getDirectory
} from '../dist/index.js';

const VERBOSE = false;

const testRun = new TestRun(VERBOSE);

testRun.on('prepare', (testcase) => {
    return testcase.function;
});

testRun.on('run', (test, testcase) => {
    let result;
    try {
        switch (testcase) {
        case 'isTimeOfDayString': result = isTimeOfDayString(test.timeOfDay); break;
        case 'stringToSeconds': result = stringToSeconds(test.timeOfDay); break;
        case 'timeOfDayStringToDate': {
            const date = timeOfDayStringToDate(test.timeOfDay);
            if (Types.isDate(date)) result = date.getTime();
            break;
        }
        case 'dateToTimeOfDayInSeconds': {
            result = dateToTimeOfDayInSeconds(test.date);
        }
        }
    } catch (err) {
        result = err.message;
    }
    return result;
});

export default () => testRun.run(['test-time-cases'], getDirectory(import.meta.url), 36, 'js');
