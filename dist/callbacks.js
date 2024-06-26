/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview This module provides a class to manage callbacks. Use it in Classes to support setting
 * callbacks.
 */
import { Types } from './types.js';
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
export class Callbacks {
    constructor(supportedEvents = undefined) {
        this._supportedEvents = supportedEvents;
        this._callbacks = {};
    }
    /**
     * Registers a callback function for an event.
     *
     * @param {string} event - The name of the event.
     * @param {function} callback - The callback function.
     * @throws {Error} - Throws an error if the event is not supported or if the callback is not a function.
     */
    on(event, callback) {
        const eventLowerCase = event.toLowerCase();
        if (Array.isArray(this._supportedEvents) && !this._supportedEvents.includes(eventLowerCase)) {
            throw Error('Event not supported: ' + event);
        }
        if (!Types.isAnyFunction(callback)) {
            throw Error('Tried to register a callback that is not a function: ' + event);
        }
        this._callbacks[eventLowerCase] = callback;
    }
    /**
     * Checks if a callback is registered for a particular event.
     *
     * @param {string} name - The name of the callback to look for, not case sensitive.
     * @returns {boolean} - True, if the callback is registered, false otherwise.
     */
    hasCallback(name) {
        if (Types.isString(name)) {
            const callback = this._callbacks[name.toLowerCase()];
            return Types.isAnyFunction(callback);
        }
        else {
            return false;
        }
    }
    /**
     * Invokes a callback function for an event.
     *
     * @param {string} event - The event name (not case sensitive) for the callback.
     * @param {...any} params - Any parameters to pass to the callback function.
     * @returns {any} - Returns the result of the callback function.
     * @throws {Error} - Throws an error if the event is not supported or if the callback is not a function.
     */
    invokeCallback(event, ...params) {
        const eventLowerCase = event.toLowerCase();
        if (Array.isArray(this._supportedEvents) && !this._supportedEvents.includes(eventLowerCase)) {
            throw Error('Event not supported: ' + event);
        }
        const func = this._callbacks[eventLowerCase];
        if (!Types.isAnyFunction(func)) {
            throw Error('No callback registered for event: ' + event);
        }
        return func(...params);
    }
    /**
     * Asynchronously invokes a callback function for an event.
     * This is useful when the callback function is async and you want to wait for its completion.
     *
     * @param {string} event - The event name (not case sensitive) for the callback.
     * @param {...any} params - Any parameters to pass to the callback function.
     * @returns {Promise<any>} - A Promise that resolves to the result of the callback, or null if no callback is registered.
     * @throws {Error} - If the event is not supported or if no callback is registered for the event.
     */
    async invokeCallbackAsync(event, ...params) {
        const eventLowerCase = event.toLowerCase();
        if (Array.isArray(this._supportedEvents) && !this._supportedEvents.includes(eventLowerCase)) {
            throw Error('Event not supported: ' + event);
        }
        const func = this._callbacks[eventLowerCase];
        if (!Types.isAnyFunction(func)) {
            throw Error('No callback registered for event: ' + event);
        }
        return func ? Promise.resolve(func(...params)) : null;
    }
}
//# sourceMappingURL=callbacks.js.map