/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
import fs from 'fs';
import { Types } from './index.js';
import { fileURLToPath } from 'url';
import path from 'path';
export const getDirectory = () => {
    const filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(filename);
    // const dirUrl = pathToFileURL(_dirname).href;
    return _dirname;
};
/**
 * Gets the command line parameters as object (Key/value)
 * @param {Array} whiteList - List of supported arguments
 */
export function getCommandLineParameters(whiteList = ['env']) {
    const result = {};
    const args = [...process.argv];
    let argName;
    // remove executable and file
    args.shift();
    args.shift();
    if (Types.isString(args[0]) && !args[0].startsWith('--')) {
        result.configFileName = args.shift();
    }
    for (const argument of args) {
        if (argument.startsWith('--')) {
            argName = argument.substring(2);
            result[argName] = '';
        }
        else if (Types.isString(argName) && whiteList.includes(argName)) {
            result[argName] = argument;
        }
    }
    return result;
}
/**
 * Searches a file up the path to the root directory
 * with maximal 6 steps up
 * @param {string} dir - Directory path to start the search
 * @param {string} name - Name of the file (without directory)
 */
function searchUp(dir, name) {
    const MAX_LEVEL = 6;
    let result;
    for (let level = 1; level < MAX_LEVEL; level++) {
        const pathAndFile = path.join(dir, name);
        if (fs.existsSync(pathAndFile)) {
            result = pathAndFile;
            break;
        }
        dir = path.join(dir, '../');
    }
    return result;
}
/**
 * Searches a file in the current directory and then up the path to the root directory
 * with maximal 5 steps up
 * @param {string} name - Name of the file (without directory)
 */
function findFile(name) {
    let result = searchUp(getDirectory(), name);
    if (result === undefined) {
        result = searchUp('./', name);
    }
    return result;
}
/**
 * Reads a configuration file and returns the content.
 * If "filePathAndName" is specified and the file exists, it will read this file
 * Else it will search for the file with "defaultName" in the current directory and then
 * 5 levels in parent directories.
 * @param {string} defaultName - Default configuration file name
 * @param {string} [filePathAndName] - Filename including path to the configuration file name
 */
function readConfigFile(defaultName, filePathAndName) {
    if (!Types.isString(filePathAndName)) {
        filePathAndName = findFile(defaultName);
    }
    if (!Types.isString(filePathAndName)) {
        throw Error('Configuration file ' + defaultName + ' not found');
    }
    if (!fs.existsSync(filePathAndName)) {
        throw Error('Configuration file ' + filePathAndName + ' does not exist');
    }
    const configuration = fs.readFileSync(filePathAndName, 'utf8');
    const result = JSON.parse(configuration);
    return result;
}
/**
 * Gets the current environment name
 * 1. if --env or --environment is specified as parameter it takes the parameter value
 * 2. Else if NODE_ENV is specified it takes the os environment variable value
 * 3. Else the default 'development' is selected
 * @param {Array} [whiteList] - Provides a white list of supported environments.
 * @returns environment name. The environment name is limited to a white list.
 */
export function getEnvironment(whiteList = ['development', 'production', 'test', 'staging']) {
    let environment;
    const parameters = getCommandLineParameters();
    if (Types.isString(parameters.env)) {
        environment = parameters.env;
    }
    else if (Types.isString(parameters.environment)) {
        environment = parameters.environment;
    }
    else if (Types.isString(process.env.NODE_ENV)) {
        environment = process.env.NODE_ENV;
    }
    else {
        environment = 'development';
    }
    if (!whiteList.includes(environment)) {
        environment = 'production';
    }
    return environment;
}
/**
 * Select the right configuration from a configuration object based on the current environment setting
 * @param {Object} configuration - Configuration object for different environments
 */
export function selectConfiguration(configuration) {
    const environment = getEnvironment();
    if (!Types.isObject(configuration) || !Types.isObject(configuration[environment])) {
        throw Error('Configuration file does not include an environment of name: ' + environment);
    }
    return configuration[environment];
}
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
export function readConfiguration(defaultName) {
    const parameters = getCommandLineParameters();
    const filePathAndName = parameters.configFileName;
    const configuration = readConfigFile(defaultName, filePathAndName);
    return selectConfiguration(configuration);
}
//# sourceMappingURL=config.js.map