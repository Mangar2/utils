/**
 * A class for managing callback functions for events.
 * This class provides methods to register, check, invoke, and asynchronously invoke callbacks for specific events.
 *
 * @class Callbacks
 * @example
 * const callbacks = new Callbacks(['publish']);
 * // register a callback
 * callbacks.on('publish', (param) => { console.log('called publish with ' + param) });
 * // invoke a callback
 * callbacks.invokeCallback('publish', 'a parameter');
 */
export declare class Callbacks {
    private _supportedEvents;
    private _callbacks;
    constructor(supportedEvents?: string[] | undefined);
    /**
     * Registers a callback function for an event.
     *
     * @param {string} event - The name of the event.
     * @param {function} callback - The callback function.
     * @throws {Error} - Throws an error if the event is not supported or if the callback is not a function.
     */
    on(event: string, callback: (...args: unknown[]) => unknown): void;
    /**
     * Checks if a callback is registered for a particular event.
     *
     * @param {string} name - The name of the callback to look for, not case sensitive.
     * @returns {boolean} - True, if the callback is registered, false otherwise.
     */
    hasCallback(name: string): boolean;
    /**
     * Invokes a callback function for an event.
     *
     * @param {string} event - The event name (not case sensitive) for the callback.
     * @param {...any} params - Any parameters to pass to the callback function.
     * @returns {any} - Returns the result of the callback function.
     * @throws {Error} - Throws an error if the event is not supported or if the callback is not a function.
     */
    invokeCallback(event: string, ...params: unknown[]): unknown;
    /**
     * Asynchronously invokes a callback function for an event.
     * This is useful when the callback function is async and you want to wait for its completion.
     *
     * @param {string} event - The event name (not case sensitive) for the callback.
     * @param {...any} params - Any parameters to pass to the callback function.
     * @returns {Promise<any>} - A Promise that resolves to the result of the callback, or null if no callback is registered.
     * @throws {Error} - If the event is not supported or if no callback is registered for the event.
     */
    invokeCallbackAsync(event: string, ...params: unknown[]): Promise<unknown>;
}
