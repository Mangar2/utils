/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

import { Callbacks } from './callbacks.js';
import { delay } from './delay.js';
import { Types } from './types.js';

/**
 * A task that publishes messages to the MQTT broker.
 *
 * @callback Task
 * @param {any} parameter - The parameter for the task.
 */

/**
 * Class providing a queue to manage one task after another with a guaranteed delay between tasks.
 *
 * @param {number} delayInMilliseconds - The delay, in milliseconds, between two tasks.
 * @throws {TypeError} If delayInMilliseconds is not a positive number.
 * @example
 * const taskQueue = new TaskQueue(1000);
 * taskQueue.addTask({message: "Hello World"});
 */
class TaskQueue {
    private _delayInMilliseconds: number;
    private _taskQueue: unknown[];
    private _callbacks: Callbacks;
    private _running: boolean;

    constructor (delayInMilliseconds: number) {
        if (!Types.isNumber(delayInMilliseconds) || delayInMilliseconds < 0) {
            throw new TypeError(`Invalid argument: delayInMilliseconds must be a positive number. Received ${Types.getType(delayInMilliseconds)}.`);
        }
        this._delayInMilliseconds = delayInMilliseconds;
        this._taskQueue = [];
        this._callbacks = new Callbacks(['task']);
        this._running = false;
    }

    /**
     * Sets a callback for a specific event.
     *
     * @param {string} event - The name of the event (not case sensitive) for the callback. Supported events: 'task'.
     * @param {(parameter: any) => Promise<void>} callback - The function to be called when the event occurs.
     * @throws {Error} If the event is not supported.
     * @throws {Error} If the callback is not a function.
     */
    on (event: string, callback: (parameter: unknown) => Promise<void>): void {
        this._callbacks.on(event, callback);
    }

    /**
     * Runs the next task in the queue, with a delay between tasks.
     *
     * @private
     */
    private async _runTasks (): Promise<void> {
        if (this._running) {
            return;
        }
        this._running = true;
        while (this._taskQueue.length !== 0) {
            const parameter = this._taskQueue.shift();
            await this._callbacks.invokeCallbackAsync('task', parameter);
            await delay(this._delayInMilliseconds);
        }

        this._running = false;
    }

    /**
     * Adds a new task to the queue and starts processing it.
     *
     * @param {any} taskParameter - The parameter to be passed to the task function.
     */
    addTask (taskParameter: unknown): void {
        this._taskQueue.push(taskParameter);
        this._runTasks();
    }
}

export { TaskQueue };
