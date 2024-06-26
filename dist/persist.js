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
import fs from 'fs';
import { errorLog } from './errorlog.js';
const ONE_SECOND_IN_MILLISECONDS = 1000;
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
export class Persist {
    /**
     * Creates a new Persist instance.
     *
     * @param {PersistConfiguration} configuration - Configuration options.
     */
    constructor(configuration = {}) {
        this.keepFiles = Number(configuration.keepFiles) || 5;
        this.writeTimestamp = Date.now();
    }
    /**
     * Checks if we are currently writing a file.
     *
     * @private
     * @returns {boolean} Whether a file is currently being written.
     */
    isWritingFile() {
        return this.writeTimestamp === undefined;
    }
    /**
     * Gets the local time as an ISO string.
     *
     * @private
     * @returns {string} The local time.
     */
    static getLocalTimeAsISOString() {
        const tzoffsetInMilliseconds = (new Date()).getTimezoneOffset() * 60 * ONE_SECOND_IN_MILLISECONDS;
        const localTime = (new Date(Date.now() - tzoffsetInMilliseconds));
        const localISOTime = localTime.toISOString().slice(0, -1);
        return localISOTime;
    }
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
    static genFileMatch(filenameStart) {
        return new RegExp('^' + filenameStart + '\\d{4}-\\d{2}-\\d{2}');
    }
    /**
    * Filters an array of file names based on whether the file name matches a specific format.
    *
    * @private
    * @param {string[]} files - Array of file names.
    * @param {string} filenameStart - String that should be at the beginning of the file name.
    * @returns {string[]} - Array of file names that match the generated file name format.
    */
    static filterFiles(files, filenameStart) {
        const fileMatch = Persist.genFileMatch(filenameStart);
        const filteredFiles = files.filter((filename) => fileMatch.exec(filename));
        return filteredFiles;
    }
    /**
     * Reads a directory and sorts it.
     *
     * @static
     * @param directory - The directory to read and sort files.
     * @returns A Promise that resolves to a sorted array of filenames.
     */
    static async readDir(directory) {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    files.sort((a, b) => a.localeCompare(b));
                    resolve(files);
                }
            });
        });
    }
    /**
     * Deletes a file at the specified path.
     *
     * @param {string} filePath - The path to the file.
     * @returns {Promise<void>} A Promise that resolves when the file is deleted.
     */
    static async deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Writes data to a file.
     *
     * @param {string} fileAndPathName - The name of the file to be written (including the path).
     * @param {string} data - The data to be saved.
     * @returns {Promise<void>} A promise that resolves when the data has been successfully written.
     */
    static async writeFile(fileAndPathName, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileAndPathName, data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Deletes old files from the data directory.
     *
     * @param {string} directory - Directory to delete file.
     * @param {string} filenameStart - Basis filename of the file.
     * @param {number} keepFiles - Amount of files to keep.
     * @returns {Promise<void>} A Promise that resolves when the old files have been deleted.
     */
    static async deleteOldFiles(directory, filenameStart, keepFiles) {
        const files = await Persist.readDir(directory);
        const filteredFiles = Persist.filterFiles(files, filenameStart);
        const filesToDelete = keepFiles > 0 ? filteredFiles.slice(0, -keepFiles) : filteredFiles;
        for (const filename of filesToDelete) {
            await Persist.deleteFile(`${directory}/${filename}`);
        }
    }
    /**
     * Stringifies a JSON object and writes it to a file. The filename will include a timestamp.
     * This method logs errors to the console instead of throwing them.
     *
     * @param {string} directory - The directory in which to save the file.
     * @param {string} filenameStart - The base filename for the file.
     * @param {Object} objectToSave - The JSON object to save.
     * @returns {Promise<void>} A Promise that resolves when the object has been saved.
     */
    async saveObjectToFile(directory, filenameStart, objectToSave) {
        const timestamp = Persist.getLocalTimeAsISOString().replace(/:/g, '');
        const filePath = `${directory}/${filenameStart}${timestamp}.json`;
        if (!this.isWritingFile()) {
            this.writeTimestamp = undefined;
            const dataString = JSON.stringify(objectToSave);
            try {
                await Persist.writeFile(filePath, dataString);
                await Persist.deleteOldFiles(directory, filenameStart, this.keepFiles);
            }
            catch (err) {
                errorLog(err);
            }
            this.writeTimestamp = Date.now();
        }
    }
    /**
     * Reads the latest data from a file in the given directory that matches the specified filename basis.
     *
     * @param {string} directory - The directory to search for the file in.
     * @param {string} filenameStart - The base name of the file to search for.
     * @returns {unknown | undefined} - The object read from the file, or undefined if an error occurred.
     */
    readData(directory, filenameStart) {
        let data;
        try {
            const files = fs.readdirSync(directory + '/');
            const filteredFiles = Persist.filterFiles(files, filenameStart);
            if (filteredFiles.length > 0) {
                const latestFile = filteredFiles[filteredFiles.length - 1];
                const fileData = fs.readFileSync(`${directory}/${latestFile}`);
                data = JSON.parse(fileData.toString());
            }
        }
        catch (err) {
            errorLog(err);
        }
        return data;
    }
}
//# sourceMappingURL=persist.js.map