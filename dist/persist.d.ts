/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 * @overview persists JSON objects to a file. Keeps several files and loads older files if the latest is
 * broken
 */
/**
 * Configuration options for the Persist class.
 */
interface PersistConfiguration {
    /**
     * Amount of file versions to keep (including the recently written file).
     */
    keepFiles?: number | string;
}
/**
 * Class for managing persistence of data in files.
 *
 * @example
 * const persist = new Persist({ keepFiles: 5 });
 * persist.saveObjectToFile('.', 'helloworld.json', { message: 'hello world' });
 * const dataRead = persist.readData('.', 'helloworld.json');
 * // prints 'hello world'
 * console.log(dataRead.message);
 */
export declare class Persist {
    private keepFiles;
    private writeTimestamp;
    /**
     * Creates a new Persist instance.
     *
     * @param {PersistConfiguration} configuration - Configuration options.
     */
    constructor(configuration?: PersistConfiguration);
    /**
     * Checks if we are currently writing a file.
     *
     * @private
     * @returns {boolean} Whether a file is currently being written.
     */
    private isWritingFile;
    /**
     * Gets the local time as an ISO string.
     *
     * @private
     * @returns {string} The local time.
     */
    private static getLocalTimeAsISOString;
    /**
     * Generates a regular expression to check if a filename matches a specific format.
     *
     * The generated regular expression matches filenames that start with the given `filenameStart`
     * followed by a date string in the format YYYY-MM-DD.
     *
     * @static
     * @param filenameStart - The basis filename to match.
     * @returns The generated regular expression.
     */
    static genFileMatch(filenameStart: string): RegExp;
    /**
    * Filters an array of file names based on whether the file name matches a specific format.
    *
    * @private
    * @param {string[]} files - Array of file names.
    * @param {string} filenameStart - String that should be at the beginning of the file name.
    * @returns {string[]} - Array of file names that match the generated file name format.
    */
    private static filterFiles;
    /**
     * Reads a directory and sorts it.
     *
     * @static
     * @param directory - The directory to read and sort files.
     * @returns A Promise that resolves to a sorted array of filenames.
     */
    static readDir(directory: string): Promise<string[]>;
    /**
     * Deletes a file at the specified path.
     *
     * @param {string} filePath - The path to the file.
     * @returns {Promise<void>} A Promise that resolves when the file is deleted.
     */
    static deleteFile(filePath: string): Promise<void>;
    /**
     * Writes data to a file.
     *
     * @param {string} fileAndPathName - The name of the file to be written (including the path).
     * @param {string} data - The data to be saved.
     * @returns {Promise<void>} A promise that resolves when the data has been successfully written.
     */
    static writeFile(fileAndPathName: string, data: string): Promise<void>;
    /**
     * Deletes old files from the data directory.
     *
     * @param {string} directory - Directory to delete file.
     * @param {string} filenameStart - Basis filename of the file.
     * @param {number} keepFiles - Amount of files to keep.
     * @returns {Promise<void>} A Promise that resolves when the old files have been deleted.
     */
    static deleteOldFiles(directory: string, filenameStart: string, keepFiles: number): Promise<void>;
    /**
     * Stringifies a JSON object and writes it to a file. The filename will include a timestamp.
     * This method logs errors to the console instead of throwing them.
     *
     * @param {string} directory - The directory in which to save the file.
     * @param {string} filenameStart - The base filename for the file.
     * @param {Object} objectToSave - The JSON object to save.
     * @returns {Promise<void>} A Promise that resolves when the object has been saved.
     */
    saveObjectToFile(directory: string, filenameStart: string, objectToSave: unknown): Promise<void>;
    /**
     * Reads the latest data from a file in the given directory that matches the specified filename basis.
     *
     * @param {string} directory - The directory to search for the file in.
     * @param {string} filenameStart - The base name of the file to search for.
     * @returns {unknown | undefined} - The object read from the file, or undefined if an error occurred.
     */
    readData(directory: string, filenameStart: string): unknown;
}
export {};
