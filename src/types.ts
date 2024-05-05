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

'use strict';

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
export const Types = {
    getType: (anything: unknown): string => { return {}.toString.call(anything).slice(8, -1); },
    isFunction: (anything: unknown): anything is function_t => { return typeof anything === 'function'; },
    isAsyncFunction: (anything: unknown): anything is AsyncFunction => { return Types.getType(anything) === 'AsyncFunction'; },
    isAnyFunction: (anything: unknown): anything is function_t | AsyncFunction => { return Types.isFunction(anything) || Types.isAsyncFunction(anything); },
    isArray: (anything: unknown): anything is Array<unknown> => { return Array.isArray(anything); },
    isObject: (anything: unknown): anything is Record<string, unknown> => { return Types.getType(anything) === 'Object'; },
    isNull: (anything: unknown): anything is null => { return Types.getType(anything) === 'Null'; },
    isUndefined: (anything: unknown): anything is undefined => { return Types.getType(anything) === 'Undefined'; },
    isBoolean: (anything: unknown): anything is boolean => { return Types.getType(anything) === 'Boolean'; },
    isNumber: (anything: unknown): anything is number => { return Types.getType(anything) === 'Number'; },
    isInteger: (anything: unknown): anything is number => { return Number.isInteger(anything); },
    isString: (anything: unknown): anything is string => { return Types.getType(anything) === 'String'; },
    isDate: (anything: unknown): anything is Date => { return anything instanceof Date && !isNaN(anything.getTime()); },
    isRegExp: (anything: unknown): anything is RegExp => { return Types.getType(anything) === 'RegExp'; },
    isMap: (anything: unknown): anything is Map<unknown, unknown> => { return Types.getType(anything) === 'Map'; },
    isSet: (anything: unknown): anything is Set<unknown> => { return Types.getType(anything) === 'Set'; },
    isError: (anything: unknown): anything is Error => { return anything instanceof Error; }
};
