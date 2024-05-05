/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview
 * Errorlog is a small helper to log error messages (usually used in catch blocks)
 * @example
 * errorLog('hello world')
 * errorLog(new Error('hello world'), false)
 */
import { Types } from './index.js';
/**
 * Logs an error message or Error object with optional stack trace.
 *
 * @param {Error|string} error - The error message or Error object to be logged.
 * @param {boolean} [debug=true] - Whether or not to print the full stack trace.
 */
export function errorLog(error, debug = true) {
    const errorString = errorToString(error);
    console.error(`${new Date().toLocaleString()} ${errorString} `);
    if (Types.isError(error) && error.stack !== undefined && debug) {
        console.error(error.stack);
    }
}
/**
 * Converts an error object to a string.
 *
 * @param {Error|string} error - The error message or Error object to be converted to a string.
 * @returns {string} The error message as a string.
 */
export function errorToString(error) {
    if (Types.isString(error)) {
        return error;
    }
    else if (Types.isError(error)) {
        return error.message;
    }
    return '';
}
//# sourceMappingURL=errorlog.js.map