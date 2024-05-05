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
export declare function shutdown(callback: () => void, forceShutdownTimeoutInMilliseconds?: number): void;
