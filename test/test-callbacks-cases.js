export default [
    {
        description: 'Test on',
        functionName: 'on',
        supportedCallbacks: ['publish'],
        tests: [
            {
                description: 'Should register a valid callback',
                input: ['publish', () => {}],
                expected: undefined
            },
            {
                description: 'Should throw an error for an unsupported event',
                input: ['subscribe', () => {}],
                expected: new Error()
            },
            {
                description: 'Should throw an error for a non-function callback',
                input: ['publish', 'invalid'],
                expected: new Error()
            }
        ]
    },
    {
        description: 'Test hasCallback with registered callbacks',
        functionName: 'hasCallback',
        supportedCallbacks: ['publish'],
        callbacks: { publish: () => {} },
        tests: [
            {
                description: 'Should return true for a registered callback',
                input: ['publish'],
                expected: true
            },
            {
                description: 'Should return false for an unregistered callback',
                input: ['subscribe'],
                expected: false
            },
            {
                description: 'Should return false for an invalid input',
                input: [42],
                expected: false
            }
        ]
    },
    {
        description: 'Test invokeCallback with valid parameters',
        functionName: 'invokeCallback',
        supportedCallbacks: ['publish', 'invalid'],
        callbacks: { publish: () => {} },
        tests: [
            {
                description: 'Should invoke a valid callback',
                input: ['publish', 'parameter'],
                expected: undefined
            },
            {
                description: 'Should throw an error for an unsupported event',
                input: ['subscribe', 'parameter'],
                expected: new Error()
            }
        ]
    },
    {
        description: 'Test invokeCallbackAsync with valid parameters',
        functionName: 'invokeCallbackAsync',
        supportedCallbacks: ['publish'],
        callbacks: {
            publish: async (param) => {
                return `called publish with ${param}`;
            }
        },
        tests: [
            {
                description: 'Should invoke a valid callback and resolve to the correct value',
                input: ['publish', 'parameter'],
                expected: 'called publish with parameter'
            },
            {
                description: 'Should throw an error for an unsupported event',
                input: ['subscribe', 'parameter'],
                expected: new Error()
            }
        ]
    }
];
