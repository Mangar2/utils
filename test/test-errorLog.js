/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

import { errorLog } from '../dist/index.js';

// Test cases for errorLog function

// Case 1: error is a string
console.log('Test Case 1: error is a string');
const errorString = 'This is an error message';
errorLog(errorString); // should log 'current time errorString' to the console

// Case 2: error is an Error object
console.log('Test Case 2: error is an Error object');
const errorObject = new Error('This is an error object');
errorLog(errorObject); // should log 'current time errorObject.message' to the console

// Case 3: debug flag is false
console.log('Test Case 3: debug flag is false');
const debugFlag = false;
errorLog(errorObject, debugFlag); // should log 'current time errorObject.message' to the console without stack trace

// Case 4: debug flag is true
console.log('Test Case 4: debug flag is true');
errorLog(errorObject, true); // should log 'current time errorObject.message' to the console with stack trace

console.log('passed! (error messages are intended)');
