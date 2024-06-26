import { deepMerge, UnitTest } from '../dist/index.js';
const VERBOSE = false;
const unitTest = new UnitTest(VERBOSE);

export default () => {
    const testCases = [
        {
            name: 'Merge with undefined target',
            target: undefined,
            merge: { a: 1 },
            expected: { a: 1 }
        },
        {
            name: 'Merge with non-object target',
            target: 'non-object',
            merge: { a: 1 },
            expected: 'non-object'
        },
        {
            name: 'Merge with target that has existing properties',
            target: { a: 1 },
            merge: { b: 2 },
            expected: { a: 1, b: 2 }
        },
        {
            name: 'Merge with target that has conflicting properties',
            target: { a: 1 },
            merge: { a: 2 },
            expected: { a: 1 }
        },
        {
            name: 'Merge with target that has nested object',
            target: { a: { b: 1 } },
            merge: { a: { c: 2 } },
            expected: { a: { b: 1, c: 2 } }
        }
    ];

    for (const testCase of testCases) {
        const result = deepMerge(testCase.target, testCase.merge);
        unitTest.assertDeepEqual(result, testCase.expected, testCase.name);
    }

    return unitTest.getResultFunctions(5);
};
