export default [
    {
        description: 'first',
        prepare: {
            testcase: 'prepare'
        },
        tests: [
            {
                description: 'test 1',
                result: 'hello',
                expected: { testObject: { testcase: 'prepare' }, result: 'hello' }
            },
            {
                description: 'test 2',
                result: 'world',
                expected: {
                    result: 'world'
                }
            }
        ]
    },
    {
        description: 'second',
        prepare: [1, 2],
        tests: [
            {
                description: 'test 3',
                result: [3, 4],
                expected: {
                    testObject: [1, 2],
                    result: [3, 4]
                }
            }
        ]
    }
];
