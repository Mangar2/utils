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
export const Types = {
    getType: (anything) => { return {}.toString.call(anything).slice(8, -1); },
    isFunction: (anything) => { return typeof anything === 'function'; },
    isAsyncFunction: (anything) => { return Types.getType(anything) === 'AsyncFunction'; },
    isAnyFunction: (anything) => { return Types.isFunction(anything) || Types.isAsyncFunction(anything); },
    isArray: (anything) => { return Array.isArray(anything); },
    isObject: (anything) => { return Types.getType(anything) === 'Object'; },
    isNull: (anything) => { return Types.getType(anything) === 'Null'; },
    isUndefined: (anything) => { return Types.getType(anything) === 'Undefined'; },
    isBoolean: (anything) => { return Types.getType(anything) === 'Boolean'; },
    isNumber: (anything) => { return Types.getType(anything) === 'Number'; },
    isInteger: (anything) => { return Number.isInteger(anything); },
    isString: (anything) => { return Types.getType(anything) === 'String'; },
    isDate: (anything) => { return anything instanceof Date && !isNaN(anything.getTime()); },
    isRegExp: (anything) => { return Types.getType(anything) === 'RegExp'; },
    isMap: (anything) => { return Types.getType(anything) === 'Map'; },
    isSet: (anything) => { return Types.getType(anything) === 'Set'; },
    isError: (anything) => { return anything instanceof Error; }
};
//# sourceMappingURL=types.js.map