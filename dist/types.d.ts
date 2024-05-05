/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview
 * provides safe type checking functions: isFunction, isArray, isObject, isNull, isUndefined, isBoolean, isNumber, isString, isDate
 */
export type AsyncFunction = (...args: unknown[]) => Promise<any>;
/**
 * A collection of utility functions for checking the types of values.
 *
 * @class Types
 * @example
 * Types.isFunction(text => console.log(text)) // returns true
 * Types.isBoolean('true') // returns false
 */
type function_t = (...args: unknown[]) => unknown;
export declare const Types: {
    getType: (anything: unknown) => string;
    isFunction: (anything: unknown) => anything is function_t;
    isAsyncFunction: (anything: unknown) => anything is AsyncFunction;
    isAnyFunction: (anything: unknown) => anything is function_t | AsyncFunction;
    isArray: (anything: unknown) => anything is unknown[];
    isObject: (anything: unknown) => anything is Record<string, unknown>;
    isNull: (anything: unknown) => anything is null;
    isUndefined: (anything: unknown) => anything is undefined;
    isBoolean: (anything: unknown) => anything is boolean;
    isNumber: (anything: unknown) => anything is number;
    isInteger: (anything: unknown) => anything is number;
    isString: (anything: unknown) => anything is string;
    isDate: (anything: unknown) => anything is Date;
    isRegExp: (anything: unknown) => anything is RegExp;
    isMap: (anything: unknown) => anything is Map<unknown, unknown>;
    isSet: (anything: unknown) => anything is Set<unknown>;
    isError: (anything: unknown) => anything is Error;
};
export {};
