export default [
    {
        description: 'time of day string',
        function: 'isTimeOfDayString',
        tests: [
            { timeOfDay: 'a', expected: false, description: 'Test with a single non-time string' },
            { timeOfDay: 'a:b', expected: false, description: 'Test with a non-time string containing a colon' },
            { timeOfDay: '10:00', expected: true, description: 'Test with a valid time string (24hr format)' },
            { timeOfDay: '10', expected: false, description: 'Test with a single non-time integer' },
            { timeOfDay: '25:00', expected: false, description: 'Test with an invalid time string (hour out of bounds)' },
            { timeOfDay: '20:59', expected: true, description: 'Test with a valid time string (24hr format)' },
            { timeOfDay: '20:60', expected: false, description: 'Test with an invalid time string (minute out of bounds)' },
            { timeOfDay: '20:59:59', expected: true, description: 'Test with a valid time string (with seconds)' },
            { timeOfDay: '20:59:60', expected: false, description: 'Test with an invalid time string (second out of bounds)' },
            { timeOfDay: '20:00:00:00', expected: false, description: 'Test with an invalid time string (extra time unit)' }
        ]
    },
    {
        description: 'time to seconds',
        function: 'stringToSeconds',
        tests: [
            { timeOfDay: '00:00', expected: 0, description: 'Midnight, start of day' },
            { timeOfDay: '01:00', expected: 3600, description: '1 hour into the day' },
            { timeOfDay: '12:00', expected: 43200, description: 'Midday' },
            { timeOfDay: '23:59', expected: 86340, description: '1 minute before next day' },
            { timeOfDay: '23:59:59', expected: 86399, description: '1 second before next day' },
            { timeOfDay: '00:01', expected: 60, description: '1 minute into the day' },
            { timeOfDay: '00:00:01', expected: 1, description: '1 second into the day' },
            { timeOfDay: '13', expected: 780, description: '13 minutes into the day' },
            { timeOfDay: '-01:00', expected: -3600, description: 'Negative time value' },
            { timeOfDay: '24:00', expected: 86400, description: 'Exactly one day' },
            { timeOfDay: 'random', expected: 'Illegal time format: random', description: 'Illegal time format: random' }
        ]
    },
    {
        description: 'time of day to date',
        function: 'timeOfDayStringToDate',
        tests: [
            {
                timeOfDay: '30',
                expected: new Date().setHours(0, 30, 0, 0),
                description: 'A single integer string should be considered as minutes'
            },
            {
                timeOfDay: '12:30',
                expected: new Date().setHours(12, 30, 0, 0),
                description: 'A two-part time string should be considered as hours and minutes'
            },
            {
                timeOfDay: '12:30:15',
                expected: new Date().setHours(12, 30, 15, 0),
                description: 'A three-part time string should be considered as hours, minutes, and seconds'
            },
            {
                timeOfDay: '-12:30:15',
                expected: new Date().setHours(-12, -30, -15, 0),
                description: 'A time string with a leading minus sign should be interpreted as negative hours, minutes, and seconds'
            },
            {
                timeOfDay: '24:00',
                expected: new Date().setHours(24, 0, 0, 0),
                description: 'A time string with hours greater than 23 should throw an Error'
            },
            {
                timeOfDay: '12:60',
                expected: 'Illegal minutes value: 60',
                description: 'A time string with minutes greater than 59 should throw an Error'
            },
            {
                timeOfDay: '12:30:60',
                expected: 'Illegal seconds value: 60',
                description: 'A time string with seconds greater than 59 should throw an Error'
            },
            {
                timeOfDay: '12:30:30:30',
                expected: 'Illegal time format: 12:30:30:30',
                description: 'A time string with more than three parts should throw an Error'
            },
            {
                timeOfDay: undefined,
                expected: new Date().setHours(0, 0, 0, 0),
                description: 'An undefined time string should return a Date object representing the start of the day'
            }
        ]
    },
    {
        description: 'date to time of day',
        function: 'dateToTimeOfDayInSeconds',
        tests: [
            {
                date: new Date(2023, 5, 20, 0, 0, 0),
                expected: 0,
                description: 'Start of the day, 00:00:00, should return 0 seconds since midnight'
            },
            {
                date: new Date(2023, 5, 20, 1, 0, 0),
                expected: 3600,
                description: 'One hour into the day, 01:00:00, should return 3600 seconds since midnight'
            },
            {
                date: new Date(2023, 5, 20, 0, 1, 0),
                expected: 60,
                description: 'One minute into the day, 00:01:00, should return 60 seconds since midnight'
            },
            {
                date: new Date(2023, 5, 20, 0, 0, 1),
                expected: 1,
                description: 'One second into the day, 00:00:01, should return 1 second since midnight'
            },
            {
                date: new Date(2023, 5, 20, 12, 0, 0),
                expected: 43200,
                description: 'Midday, 12:00:00, should return 43200 seconds since midnight'
            },
            {
                date: new Date(2023, 5, 20, 23, 59, 59),
                expected: 86399,
                description: 'One second before next day, 23:59:59, should return 86399 seconds since midnight'
            }
        ]
    }
];
