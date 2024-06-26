export default [
    {
        description: ' test isFunction',
        functionName: 'isFunction',
        tests: [
            {
                description: 'should return true for a function',
                input: function () { console.log('hello'); },
                expected: true
            },
            {
                description: 'should return false for an object',
                input: { a: 1, b: 2, c: 3 },
                expected: false
            },
            {
                description: 'should return false for a string',
                input: 'hello',
                expected: false
            },
            {
                description: 'should return false for a number',
                input: 42,
                expected: false
            }
        ]
    },
    {
        description: ' test isAsyncFunction',
        functionName: 'isAsyncFunction',
        tests: [
            {
                description: 'should return true for an async function',
                input: async function () { console.log('hello'); },
                expected: true
            },
            {
                description: 'should return false for a regular function',
                input: function () { console.log('hello'); },
                expected: false
            },
            {
                description: 'should return false for an object',
                input: { a: 1, b: 2, c: 3 },
                expected: false
            },
            {
                description: 'should return false for a string',
                input: 'hello',
                expected: false
            },
            {
                description: 'should return false for a number',
                input: 42,
                expected: false
            }
        ]
    },
    {
        description: 'Test isAnyFunction with a synchronous function',
        functionName: 'isAnyFunction',
        tests: [
            {
                description: 'Should return true for a synchronous function',
                input: function () { return 'Hello World!'; },
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for a number',
                input: 42,
                expected: false
            }
        ]
    },
    {
        description: 'Test isArray with an array',
        functionName: 'isArray',
        tests: [
            {
                description: 'Should return true for an array of numbers',
                input: [1, 2, 3],
                expected: true
            },
            {
                description: 'Should return true for an array of strings',
                input: ['apple', 'banana', 'cherry'],
                expected: true
            },
            {
                description: 'Should return true for an empty array',
                input: [],
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            }
        ]
    },
    {
        description: 'Test isObject with an object',
        functionName: 'isObject',
        tests: [
            {
                description: 'Should return true for an object with properties',
                input: { name: 'John', age: 30 },
                expected: true
            },
            {
                description: 'Should return true for an empty object',
                input: {},
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            }
        ]
    },
    {
        description: 'Test isNull with null',
        functionName: 'isNull',
        tests: [
            {
                description: 'Should return true for null',
                input: null,
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    },
    {
        description: 'Test isUndefined with undefined',
        functionName: 'isUndefined',
        tests: [
            {
                description: 'Should return true for undefined',
                input: undefined,
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            }
        ]
    },
    {
        description: 'Test isBoolean with boolean values',
        functionName: 'isBoolean',
        tests: [
            {
                description: 'Should return true for true',
                input: true,
                expected: true
            },
            {
                description: 'Should return true for false',
                input: false,
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    },
    {
        description: 'Test isNumber with numbers',
        functionName: 'isNumber',
        tests: [
            {
                description: 'Should return true for an integer',
                input: 42,
                expected: true
            },
            {
                description: 'Should return true for a float',
                input: 3.14,
                expected: true
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    },
    {
        description: 'Test isInteger with integers',
        functionName: 'isInteger',
        tests: [
            {
                description: 'Should return true for an integer',
                input: 42,
                expected: true
            },
            {
                description: 'Should return true for 0',
                input: 0,
                expected: true
            },
            {
                description: 'Should return false for a float',
                input: 3.14,
                expected: false
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    },
    {
        description: 'Test isString with strings',
        functionName: 'isString',
        tests: [
            {
                description: 'Should return true for a string',
                input: 'Hello World!',
                expected: true
            },
            {
                description: 'Should return true for an empty string',
                input: '',
                expected: true
            },
            {
                description: 'Should return false for a number',
                input: 42,
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    },
    {
        description: 'Test isDate with dates',
        functionName: 'isDate',
        tests: [
            {
                description: 'Should return true for a valid date object',
                input: new Date('2023-04-20'),
                expected: true
            },
            {
                description: 'Should return false for an invalid date object',
                input: new Date('Invalid Date'),
                expected: false
            },
            {
                description: 'Should return false for a string',
                input: 'Hello World!',
                expected: false
            },
            {
                description: 'Should return false for an object',
                input: { name: 'John', age: 30 },
                expected: false
            },
            {
                description: 'Should return false for an array',
                input: [1, 2, 3],
                expected: false
            },
            {
                description: 'Should return false for null',
                input: null,
                expected: false
            },
            {
                description: 'Should return false for undefined',
                input: undefined,
                expected: false
            }
        ]
    }
];
