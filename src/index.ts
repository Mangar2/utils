/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview
 * This package combines a list of utlities needed in JavaScript development. The are created
 * in development of the yaha home automation system
 * - errorLog a function to write error messages to console (including timestamp)
 * - types a utilit to check the types of elements
 * - Callbacks a utility to manage callbacks in classes
 * - Retry a utility to call functions in a loop with a delay inbetween
 */

export { errorLog, errorToString } from './errorlog.js';
export { Types } from './types.js';

export { Callbacks } from './callbacks.js';
export { Retry } from './retry.js';
export { delay, delayStep } from './delay.js';
export { TaskQueue } from './taskqueue.js';
export { shutdown } from './shutdown.js';
export { sunset, sunrise } from './sun.js';
export { Persist } from './persist.js';
export { readConfiguration, selectConfiguration, getEnvironment, getCommandLineParameters } from './config.js';
export { isTimeOfDayString, stringToSeconds, timeOfDayStringToDate, dateToTimeOfDayInSeconds } from './time.js';

export { deepMerge } from './deep-merge.js';
export { UnitTest, TestResult } from './unittest/unittest.js';
export { TestRun, getDirectory } from './unittest/testrun.js';
