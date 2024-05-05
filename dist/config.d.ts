export declare const getDirectory: () => string;
type CommandlineParameters = {
    configFileName?: string;
    [key: string]: string | undefined;
};
/**
 * Gets the command line parameters as object (Key/value)
 * @param {Array} whiteList - List of supported arguments
 */
export declare function getCommandLineParameters(whiteList?: string[]): CommandlineParameters;
/**
 * Gets the current environment name
 * 1. if --env or --environment is specified as parameter it takes the parameter value
 * 2. Else if NODE_ENV is specified it takes the os environment variable value
 * 3. Else the default 'development' is selected
 * @param {Array} [whiteList] - Provides a white list of supported environments.
 * @returns environment name. The environment name is limited to a white list.
 */
export declare function getEnvironment(whiteList?: string[]): string;
/**
 * Select the right configuration from a configuration object based on the current environment setting
 * @param {Object} configuration - Configuration object for different environments
 */
export declare function selectConfiguration(configuration: unknown): unknown;
/**
 * Reads the current configuration from a file
 * If the file name is specified as command line parameter (first parameter) this file is read
 * If the file name is not specified, it will read the default file from the current directory or
 * up to 5 levels in parent directories
 * Then it returns the active configuration, default is 'development' from the configuration file
 * The active configuration is either specified by parameter ('--env' or '--environment') or set in
 * 'NODE_ENV'
 * @param {string} defaultName - Default configuration file name
 */
export declare function readConfiguration(defaultName: string): unknown;
export {};
