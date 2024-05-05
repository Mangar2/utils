/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview asyncronously retries function calls several times with delay inbetween
 * Prevents parallel retry loops with the same topic.
 */
/**
 * Class providing a facility to retry a callback "count" times asynchronously with a delay in between.
 * Additionally, it provides a "topic" based retry ("topicRetry") with the following functionalities:
 * - Asynchronously calls a global callback "count" times with a delay in between.
 * - If no global callback is provided, it calls a callback registered to the topic.
 * - If topicRetry is called with an already running retry loop for the same topic, the existing one is terminated.
 *
 * @param {boolean} immediateFirstCall - true, if the first call should happen immediately, default is true.
 * @example
 * const retry = new Retry()
 * // prints "hello world" 5 times, with a delay of 1 second between each output
 * retry.retry(5, 1000, () => console.log("hello world"))
 * // prints hello1, world, hello2, world, hello2
 * retry.topicRetry('hello', 2, 1000, () => console.log("hello1"))
 * retry.topicRetry('world', 2, 1000, () => console.log("world"))
 * retry.topicRetry('hello', 2, 1000, () => console.log("hello2"))
 */
export declare class Retry {
    private _topicCalledList;
    private _callbacks;
    private _immediateFirstCall;
    constructor(immediateFirstCall?: boolean);
    /**
     * Registers a callback function for a specific topic.
     *
     * @param {string} topic - The name of the topic to register the callback for.
     * @param {() => void} callback - The function to be called when the topic is matched on retries.
     * @throws {Error} If the callback is not a function.
     */
    on(topic: string, callback: () => void): void;
    /**
     * Calls a callback function multiple times and waits between the calls.
     *
     * @param {number} count - The number of times to call the callback function.
     * @param {number} delayInMilliseconds - The amount of time, in milliseconds, to wait between each call.
     * @param {(loopNumber: number) => Promise<boolean>} callback - The function to be called on each retry.
     * @returns {Promise<void>} - A promise that resolves when all callbacks are done.
     */
    retry(count: number, delayInMilliseconds: number, callback: (loopNumber: number) => Promise<boolean>): Promise<void>;
    /**
     * Stops a retry loop for a specific topic by increasing the topic's call number.
     *
     * @param {string} topic - The name of the retry topic to stop.
     */
    stopRetry(topic: string): void;
    /**
     * Calls a callback function multiple times and waits between the calls for a specific topic.
     * If `topicRetry` is called with the same topic more than once, it will stop the running retry loop with the same topic.
     *
     * @param {string} topic - The name of the topic to retry.
     * @param {number} count - The number of times to call the callback function.
     * @param {number} delayInMilliseconds - The amount of time, in milliseconds, to wait between each call.
     * @param {(loopNumber: number) => Promise<boolean>} callback - The function to be called on each retry.
     * @returns {Promise<void>} - A promise that resolves when all callbacks are done.
     */
    topicRetry(topic: string, count: number, delayInMilliseconds: number, callback: (loopNumber: number) => Promise<boolean>): Promise<void>;
}
