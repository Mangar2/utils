<!-- This file is generated by jsmddoc version 0.1 -->

# Abstract

Pauses the execution for a while ( needs to "wait" ) for the result .

This package combines a list of utlities needed in JavaScript development . The are created in development of the yaha home automation system

- errorLog a function to write error messages to console ( including timestamp )
- types a utilit to check the types of elements
- Callbacks a utility to manage callbacks in classes
- Retry a utility to call functions in a loop with a delay inbetween

## Contents

- [Meta](#Meta)
- [Class TaskQueue](#Class-TaskQueue)
  - [Parameters](#TaskQueue-Parameters)
  - [Methods](#TaskQueue-Methods)
    - [addTask](#addTask)
    - [on](#on)

## Meta

| | |
| --- | --- |
| **File** | index.js |
| **Abstract** | This package combines a list of utlities needed in JavaScript development . The are created in development of the yaha home automation system

- errorLog a function to write error messages to console ( including timestamp )
- types a utilit to check the types of elements
- Callbacks a utility to manage callbacks in classes
- Retry a utility to call functions in a loop with a delay inbetween |
| **Author** | Volker Böhm |
| **Copyright** | Copyright ( c ) 2020 Volker Böhm |
| **License** | This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3 . It is furnished "as is" , without any support , and with no warranty , express or implied , as to its usefulness for any purpose . |

## Callback definitions

### Task

Callback to publish messages to the mqtt broker

#### Task Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `parameter` | `Any` | parameter for the task | |

## Class TaskQueue

`new TaskQueue(delayInMilliseconds)`

Creates a queue to manage one task after another with a guaranteed delay

### TaskQueue Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `delayInMilliseconds` | `number` | amount of miliseconds between two tasks | |

### TaskQueue Methods

#### addTask

`addTask (taksParameter)`

Adds a task to the queue

##### addTask Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `taksParameter` | `Any` | parameter handed over to the task | |

#### on

`on (event, callback)`

Sets a callback .

##### on Parameters

| Name | Type | Description |
| ---------- | ------------ | ----------------- |
| `event` | `string` | event name ( not case sensitive ) for the callback ( supported : 'task' ) | |
| `callback` | `Taks` | function ( . . . parameter ) | |

##### on throws

| Type | Description |
| ---- | ----------- |
| `Error` | if the event is not supported |
| `Error` | if the callback is not 'function' |