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
/**
 * Logs an error message or Error object with optional stack trace.
 *
 * @param {Error|string} error - The error message or Error object to be logged.
 * @param {boolean} [debug=true] - Whether or not to print the full stack trace.
 */
export declare function errorLog(error: unknown, debug?: boolean): void;
/**
 * Converts an error object to a string.
 *
 * @param {Error|string} error - The error message or Error object to be converted to a string.
 * @returns {string} The error message as a string.
 */
export declare function errorToString(error: unknown): string;
