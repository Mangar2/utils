
export default
[
    {
        functionName: 'addTask',
        description: 'Tests for addTask function',
        tests: [
            {
                description: 'Add task to queue',
                parameter: [],
                expected: {
                    _delayInMilliseconds: 100,
                    _taskQueue: [],
                    _running: false,
                    callCount: 0
                }
            },
            {
                description: 'Add task to queue',
                parameter: ['task 1'],
                expected: {
                    _taskQueue: [],
                    _running: true,
                    callCount: 1
                }
            },
            {
                description: 'Add multiple tasks to queue',
                parameter: ['task 2', 'task 3', 'task 4'],
                expected: {
                    _taskQueue: ['task 2', 'task 3', 'task 4'],
                    callCount: 1
                }
            },
            {
                delay: 350,
                description: 'Add task to queue after processing of previous tasks',
                parameter: ['task 5'],
                expected: {
                    _taskQueue: ['task 5'],
                    callCount: 4
                }
            },
            {
                delay: 300,
                description: 'run empty',
                parameter: [],
                expected: {
                    _taskQueue: [],
                    callCount: 5
                }
            }
        ]
    },
    {
        functionName: 'on',
        description: 'Tests for on function',
        tests: [
            {
                description: 'Add listener for unsupported event',
                parameter: ['invalid event', () => {}],
                expected: new Error()
            },
            {
                description: 'Add listener with invalid callback',
                parameter: ['task', 'invalid callback'],
                expected: new Error()
            }
        ]
    }
];
