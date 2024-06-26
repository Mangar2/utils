/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @name Shutdown
 * @description
 * Shutdown is a small helper to safely shutdown serivces on SIGINT (ctrl-C)
 * A singelton calling a callback on SIGINT and provides a timeout if the callback does not finish in a period of time.
 * @example
 * const shutdown = require('shutdown');
 *
 * shutdown(async () => {
 *    await myClass.close();
 *    process.exit(0);
 * });
 */
const FORCE_SHUTDOWN_TIMEOUT_IN_MILLISECONDS = 4000;
let sigintCallback;
let timeout;
/**
 * Registers a callback to be called on SIGINT (ctrl-C), with a timeout for forced shutdown.
 * If the process receives a SIGINT signal, the callback will be executed. If the process
 * doesn't terminate within the specified timeout, it will be forcefully shut down.
 *
 * @param {() => void} callback - The function to be called on SIGINT.
 * @param {number} forceShutdownTimeoutInMilliseconds - The amount of milliseconds until forced shutdown (defaults to 4000ms).
 * @example
 * registerShutdownCallback(() => {
 *   console.log('Shutdown initiated...');
 *   // perform cleanup actions...
 * });
 */
export function shutdown(callback, forceShutdownTimeoutInMilliseconds = FORCE_SHUTDOWN_TIMEOUT_IN_MILLISECONDS) {
    timeout = forceShutdownTimeoutInMilliseconds;
    sigintCallback = callback;
    process.on('SIGINT', () => {
        if (sigintCallback !== undefined) {
            sigintCallback();
        }
        setTimeout((err) => {
            if (err) {
                console.error(err);
            }
            process.exit(1);
        }, timeout);
    });
    process.on('SIGTERM', () => {
        process.exit(0);
    });
}
//# sourceMappingURL=shutdown.js.map