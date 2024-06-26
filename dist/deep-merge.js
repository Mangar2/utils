/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * Overview
 * Provides a function merging one object to another by copying properties that are not already defined
 */
import { Types } from './types.js';
/**
 * Deeply merges properties from the 'merge' object into the 'target' object,
 * but only if they aren't already present in 'target'.
 *
 * Note: This function only merges properties of objects, not arrays.
 *
 * @private
 * @param target - The object to which properties will be merged.
 * @param merge - The object whose properties will be merged.
 * @returns The 'target' object after merging.
 */
export function deepMerge(target, merge) {
    if (!Types.isObject(merge)) {
        return target;
    }
    if (Types.isUndefined(target)) {
        target = {};
    }
    if (!Types.isObject(target)) {
        return target;
    }
    const result = { ...target };
    for (const mergeProperty in merge) {
        const defaultValue = merge[mergeProperty];
        const targetValue = result[mergeProperty];
        const defaultValueIsObject = Types.isObject(defaultValue);
        if (defaultValueIsObject) {
            result[mergeProperty] = deepMerge(targetValue, defaultValue);
        }
        else if (Types.isUndefined(targetValue)) {
            result[mergeProperty] = defaultValue;
        }
    }
    return result;
}
//# sourceMappingURL=deep-merge.js.map