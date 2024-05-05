# Abstract

This package includes several small utilities I use in JavaScript/TypeScript development.

 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 
## Utilities

A collection of utilities

### callbacks

A class to add callbacks registered with "on" to your class

### config

A class to read configuration files for example from a file passed as command line parameter

### deep-merge

A class to deep merge two objects

### delay

A class to delay the execution of code

### errorlog

Small functions to log errors (usually in the catch block)

### persist

File io to persist data

### retry

Functions used to retry operations that might fail

### shutdown

Functions to handle shutdown (usually when pressing ^C)

### sun

Sunrise, Sunset calculation

### taskqueue

A simple queue running callbacks (tasks) with delay inbetween

### time

Some functions handling time strings that I couldn´t find in Date()

### types

Type check functions like isArray, isObject, ... that I use everywhere (because of consistent syntax). They work for typescript

## Unit Tests

Here we have two classes for unittests.

### UnitTest

A Unittest class with typical methods like assertEqual, ... It also contains helper functions to compare two objects in detail and it records all "success" and "fail" to provide a test result at the end. 
I use it for simple tests 

### TestRun

My way to run unit tests. I never found unit test libraries that I like. The concept is to provide all test cases in test case files (JSON like in .js files). The structure is Array of Testcases with initialization and Array of tests. The TestRun is able to run tests from many files and in each file many testcases and in each testcase several tests. 

- The tests can run sequentially or in parallel (e.g. if there are tests waiting for something, ...)
- The tests can be repeated automatically. If a test fails, all tests are restarted from the beginning until the failed test. The faild test is then executed by a function "runAgain". The idea is to set a breakpoint in this function. As a result you can set one breakpoint and the debugger halts there whenever a test fails and you have the situation right BEFORE the test fails. I use this often and I like it very much.
- Tests are usually producing an Object (Record<string, unknown>) as result. It will be compared to an "expectedResult" you provide with the test case defintion. Only properties in "expectedResult" are checked agains the result. The idea is to test only what is important to the current test case and not to provide the whole complexity of the current result in "expected result". This also allows you to skip things like timestamps from the test.

Overall I like it much, but it is not straight foreward and very easy to understand. 

