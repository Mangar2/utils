/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
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
declare class TaskQueue {
    private _delayInMilliseconds;
    private _taskQueue;
    private _callbacks;
    private _running;
    constructor(delayInMilliseconds: number);
    /**
     * Sets a callback for a specific event.
     *
     * @param {string} event - The name of the event (not case sensitive) for the callback. Supported events: 'task'.
     * @param {(parameter: any) => Promise<void>} callback - The function to be called when the event occurs.
     * @throws {Error} If the event is not supported.
     * @throws {Error} If the callback is not a function.
     */
    on(event: string, callback: (parameter: any) => Promise<void>): void;
    /**
     * Runs the next task in the queue, with a delay between tasks.
     *
     * @private
     */
    private _runTasks;
    /**
     * Adds a new task to the queue and starts processing it.
     *
     * @param {any} taskParameter - The parameter to be passed to the task function.
     */
    addTask(taskParameter: any): void;
}
export { TaskQueue };
