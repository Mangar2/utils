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
 * Delays the execution for a specified amount of time.
 *
 * This function can be used to pause the execution of the current async function
 * and wait for a specified amount of time before it continues. This can be useful
 * when you need to wait for an asynchronous operation to complete before
 * continuing with the execution.
 *
 * @param {number} timeInMilliseconds - The delay duration in milliseconds.
 *        If this value is 0 or less, the function returns immediately.
 *
 * @param {boolean} [verbose=false] - A flag to indicate whether a log message
 *        should be printed to the console indicating the duration of the delay.
 *        This can be useful for debugging purposes. If `verbose` is true and
 *        `timeInMilliseconds` is greater than 0, a message will be printed.
 *        Otherwise, no message will be printed.
 *
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 *        The Promise doesn't carry any value (i.e., it resolves to `void`).
 *
 * @example
 * // Pause execution for 5 seconds, then log "Hello, world!"
 * delay(5000, true).then(() => {
 *   console.log('Hello, world!');
 * });
 */
export const delay = (timeInMilliseconds: number, verbose: boolean = false): Promise<void> => {
    const shouldLog = verbose && timeInMilliseconds > 0;

    if (shouldLog) {
        console.log(`Waiting for ${timeInMilliseconds / 1000} seconds...`);
    }

    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeInMilliseconds);
    });
};

/**
 * Delays the execution for a specified amount of time, in small steps. Interrups work better with this delay.
 * @param timeInMilliseconds - The total time to delay in milliseconds.
 * @param stepInMilliseconds - The step size for each iteration of the delay.
 * @param verbose - Whether to log the delay progress.
 * @returns A Promise that resolves after the delay is complete.
 */
export const delayStep = async (timeInMilliseconds: number, stepInMilliseconds: number = 100, verbose: boolean = false): Promise<void> => {
    const shouldLog = verbose && timeInMilliseconds > 0;

    if (shouldLog) {
        console.log(`Waiting for ${timeInMilliseconds / 1000} seconds...`);
    }
    for (let maxTime = timeInMilliseconds; maxTime > 0; maxTime -= stepInMilliseconds) {
        await delay(Math.min(maxTime, stepInMilliseconds), false);
    }
};
