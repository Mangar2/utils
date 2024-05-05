export interface StringIndexed {
    [index: string]: any;
}
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
export declare function deepMerge(target: StringIndexed | undefined, merge: StringIndexed): StringIndexed | undefined;
