
export default [
    {
        description: 'retry',

        tests: [
            {
                functionName: 'retry',
                description: 'should call the callback function the expected number of times',

                input: [5, 500],
                expected: { callbackFunctionCallCount: 5 }
            },
            {
                functionName: 'retry',
                description: 'should wait for the expected amount of time between calls',
                input: [5, 500],
                expected: { callbackFunctionCallTimes: [500, 1000, 1500, 2000, 2500] }
            }
        ]
    },
    {
        description: 'should call global callback function 3 times with a delay of 500ms for topic "hello"',
        tests: [
            {
                description: 'should call the global callback function the expected number of times',
                functionName: 'topicRetry',
                input: ['hello', 3, 500],
                expected: { callbackFunctionCallCount: 3 }
            },
            {
                description: 'should wait for the expected amount of time between calls',
                functionName: 'topicRetry',
                input: ['hello', 3, 500],
                expected: { callbackFunctionCallTimes: [500, 1000, 1500] }
            }
        ]
    },
    {
        description: 'should call registered callback function 3 times with a delay of 500ms for topic "world"',
        tests: [
            {
                description: 'should call the registered callback function the expected number of times',
                functionName: 'topicRetry',
                input: ['world', 3, 500, null],
                expected: { callbackFunctionCallCount: 3 }
            },
            {
                description: 'should wait for the expected amount of time between calls',
                functionName: 'topicRetry',
                input: ['world', 3, 500, null],
                expected: { callbackFunctionCallTimes: [500, 1000, 1500] }
            }
        ]
    }
];
