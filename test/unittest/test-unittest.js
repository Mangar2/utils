/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 * @overview Unit tests
 */

import { UnitTest } from '../../dist/index.js';

const VERBOSE = false;
const DEBUG = false;
const unitTest = new UnitTest(VERBOSE, DEBUG);

export default () => {
    // Test for truthy values
    unitTest.assertTrue(true, 'Test for true');
    unitTest.assertTrue(1, 'Test for 1');
    unitTest.assertTrue('string', 'Test for string');
    unitTest.assertTrue({}, 'Test for object');
    unitTest.assertTrue([], 'Test for array');
    unitTest.assertTrue(new Map(), 'Test for map');
    unitTest.assertTrue(new Set(), 'Test for set');

    // Test for falsy values
    unitTest.assertFalse(false, 'Test for false');
    unitTest.assertFalse(0, 'Test for 0');
    unitTest.assertFalse('', 'Test for empty string');
    unitTest.assertFalse(null, 'Test for null');
    unitTest.assertFalse(undefined, 'Test for undefined');
    unitTest.assertFalse(NaN, 'Test for NaN');

    // testing assertEqual
    unitTest.assertEqual(1, 1, 'Numbers 1 and 1 are equal.');
    unitTest.assertEqual('hello', 'hello', 'Strings hello and hello are equal.');
    unitTest.assertEqual(true, true, 'Booleans true and true are equal.');
    unitTest.assertEqual(false, false, 'Booleans false and false are equal.');
    unitTest.assertEqual(0, 0, 'Numbers 0 and 0 are equal.');
    unitTest.assertEqual(undefined, undefined, 'undefined and undefined are equal.');
    unitTest.assertEqual(null, null, 'null and null are equal.');
    unitTest.assertEqual(Infinity, Infinity, 'Infinity and Infinity are equal.');
    unitTest.assertEqual(-Infinity, -Infinity, '-Infinity and -Infinity are equal.');

    // Test for expected exception
    unitTest.expectException(() => { throw new Error('Test error'); }, Error, 'Exception thrown as expected');

    // Test for unexpected exception
    unitTest.expectException(() => { throw new TypeError('Test error'); }, SyntaxError, 'Exception not thrown as expected');

    // Same simple object
    unitTest.assertDeepEqual({ a: 'b' }, { a: 'b' }, 'Simple object');

    // Different simple objects
    unitTest.assertDeepNotEqual({ a: 'b' }, { a: 'c' }, 'Different simple objects');
    unitTest.assertDeepNotEqual({ a: 'b' }, { b: 'c' }, 'Different simple objects');

    // Same nested object
    unitTest.assertDeepEqual({ a: { b: 'c' } }, { a: { b: 'c' } }, 'Nested object');

    // Different nested objects
    unitTest.assertDeepNotEqual({ a: { b: 'c' } }, { a: { b: 'd' } }, 'Different nested objects');
    unitTest.assertDeepNotEqual({ a: { b: 'c' } }, { a: { c: 'd' } }, 'Different nested objects');
    unitTest.assertDeepNotEqual({ a: { b: { c: 'd' } } }, { a: { b: { c: 'e' } } }, 'Different nested objects');

    // Array with same elements
    unitTest.assertDeepEqual(['a', 'b', 'c'], ['a', 'b', 'c'], 'Array with same elements');

    // Array with different elements
    unitTest.assertDeepNotEqual(['a', 'b', 'c'], ['a', 'b', 'd'], 'Array with different elements');

    // Arrays with same nested objects
    unitTest.assertDeepEqual([{ a: 'b' }, { c: 'd' }], [{ a: 'b' }, { c: 'd' }], 'Arrays with same nested objects');

    // Arrays with different nested objects
    unitTest.assertDeepNotEqual([{ a: 'b' }, { c: 'd' }], [{ a: 'b' }, { c: 'e' }], 'Arrays with different nested objects');

    // Same regexp
    unitTest.assertDeepEqual(/foo/, /foo/, 'Same regexp');

    // Different regexp
    unitTest.assertDeepNotEqual(/foo/, /bar/, 'Different regexp');

    // Same date
    unitTest.assertDeepEqual(new Date(2022, 4, 10), new Date(2022, 4, 10), 'Same date');

    // Different date
    unitTest.assertDeepNotEqual(new Date(2022, 4, 10), new Date(2022, 4, 11), 'Different date');

    // Same Map
    const mapA = new Map();
    mapA.set('a', 1);
    mapA.set('b', 2);
    const mapB = new Map();
    mapB.set('a', 1);
    mapB.set('b', 2);
    unitTest.assertDeepEqual(mapA, mapB, 'Same Map');

    // Different Map
    const mapC = new Map();
    mapC.set('a', 1);
    mapC.set('b', 2);
    const mapD = new Map();
    mapD.set('a', 1);
    mapD.set('b', 3);
    unitTest.assertDeepNotEqual(mapC, mapD, 'Different Map');

    // Same Set
    const setA = new Set([1, 2, 3]);
    const setB = new Set([1, 2, 3]);
    unitTest.assertDeepEqual(setA, setB, 'Same Set');

    // Different Set
    const setC = new Set([1, 2, 3]);
    const setD = new Set([1, 2, 4]);
    unitTest.assertDeepNotEqual(setC, setD, 'Different Set');

    // Test replacing substrings in a string
    unitTest.assertEqual(
        unitTest.replaceRec('The quick brown fox jumps over the lazy dog', { fox: 'cat', lazy: 'sleepy' }),
        'The quick brown cat jumps over the sleepy dog',
        'Replacing substrings in a string'
    );

    // Test replacing substrings in an array
    unitTest.assertDeepEqual(
        unitTest.replaceRec([1, 2, 3, 'foo'], { foo: 'bar' }),
        [1, 2, 3, 'bar'],
        'Replacing substrings in an array'
    );

    // Test replacing substrings in an object
    unitTest.assertDeepEqual(
        unitTest.replaceRec({ name: 'John Doe', age: '30', city: 'New York' }, { 30: 'thirty', 'New York': 'NYC' }),
        { name: 'John Doe', age: 'thirty', city: 'NYC' },
        'Replacing substrings in an object'
    );

    // Test replacing substrings with non-string values
    unitTest.assertDeepEqual(
        unitTest.replaceRec(['foo', { bar: 'baz' }, '42'], { 42: 'forty-two', baz: true }),
        ['foo', { bar: true }, 'forty-two'],
        'Replacing substrings with non-string values'
    );

    // Test replacing substrings with empty values
    unitTest.assertDeepEqual(
        unitTest.replaceRec(['foo', { bar: 'baz' }, 42], {}),
        ['foo', { bar: 'baz' }, 42],
        'Replacing substrings with empty values'
    );

    // Test replacing substrings in a nested object
    unitTest.assertDeepEqual(
        unitTest.replaceRec({ foo: { bar: { baz: 'hello' } } }, { hello: 'world' }),
        { foo: { bar: { baz: 'world' } } },
        'Replacing substrings in a nested object'
    );

    // Test replacing substrings in a nested array
    unitTest.assertDeepEqual(
        unitTest.replaceRec([['1', '2'], ['3', '4'], ['5', '6']], { 2: 'two', 3: 'three', 6: 'six' }),
        [['1', 'two'], ['three', '4'], ['5', 'six']],
        'Replacing substrings in a nested array'
    );

    // Test validateRec
    // Test case 1: Objects with identical properties are equal
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    unitTest.validateRec(obj1, obj2, 'objects with identical properties are equal');

    // Test case 2: Objects with different properties are not equal
    const obj3 = { a: 1, b: 2 };
    const obj4 = { a: 1, c: 3 };
    unitTest.expectException(() => unitTest.validateRec(obj3, obj4, 'objects with different properties are not equal'), Error);

    // Test case 3: Nested objects with identical properties are equal
    const obj5 = { a: { b: { c: 1 } } };
    const obj6 = { a: { b: { c: 1 } } };
    unitTest.validateRec(obj5, obj6, 'nested objects with identical properties are equal');

    // Test case 4: Nested objects with different properties are not equal
    const obj7 = { a: { b: { c: 1 } } };
    const obj8 = { a: { b: { d: 2 } } };
    unitTest.expectException(() => unitTest.validateRec(obj7, obj8, 'nested objects with different properties are not equal'), Error);

    // Test case 5: Arrays with identical values are equal
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    unitTest.validateRec(arr1, arr2, 'arrays with identical values are equal');

    // Test case 6: Arrays with different values are not equal
    const arr3 = [1, 2, 3];
    const arr4 = [1, 2, 4];
    unitTest.expectException(() => unitTest.validateRec(arr3, arr4, 'arrays with different values are not equal'), Error);

    // Test case 7: Arrays with different lengths are not equal
    const arr5 = [1, 2, 3];
    const arr6 = [1, 2];
    unitTest.expectException(() => unitTest.validateRec(arr5, arr6, 'arrays with different lengths are not equal'), Error);

    // Test case 8: Additional properties in nested objects are not allowed
    const obj9 = { a: { b: { c: 1 } } };
    const obj10 = { a: { b: { c: 1, d: 2 } } };
    unitTest.expectException(() => unitTest.validateRec(obj9, obj10, 'additional properties in nested objects are not allowed'), Error);

    // Test case 9: Additional properties in arrays are allowed
    const arr7 = [1, 2, 3];
    const arr8 = [1, 2, 3, 4];
    unitTest.expectException(() => unitTest.validateRec(arr7, arr8, 'additional properties in arrays are not allowed'), Error);

    // Test case 10: Undefined values are not allowed
    const obj11 = { a: undefined };
    const obj12 = { a: 1 };
    unitTest.expectException(() => unitTest.validateRec(obj11, obj12, 'undefined values are not allowed'), Error);

    // Test case 11: Different types are not equal
    const obj13 = { a: 1 };
    const obj14 = { a: '1' };
    unitTest.expectException(() => unitTest.validateRec(obj13, obj14, 'different types are not equal'), Error);
    return unitTest.getResultFunctions(57, 1);
};
