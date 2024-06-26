/**
 * ---------------------------------------------------------------------------------------------------
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * File:        test.js
 *
 * Author:      Volker Böhm
 * Copyright:   Volker Böhm
 * ---------------------------------------------------------------------------------------------------
 */

'use strict';
import { UnitTest, Persist, delay } from '../dist/index.js';

const VERBOSE = false;
const DEBUG = false;
const unitTest = new UnitTest(VERBOSE, DEBUG);

const testData = {
    data1: { message: 'data 1' },
    data2: { message: 'data 2' },
    data3: { message: 'data 3' }
};

async function cleanFiles () {
    await Persist.deleteOldFiles('.', 'test', 0);
}

async function testPersist () {
    const persist = new Persist({ keepFiles: 5 });

    let data = { message: 'hello world' };
    await persist.saveObjectToFile('.', 'test', data);
    let result = persist.readData('.', 'test');
    unitTest.assertDeepEqual(result, data, 'should save an object to a file');
    await cleanFiles();

    data = { message: 'hello world' };
    await persist.saveObjectToFile('.', 'test', data);
    result = await persist.readData('.', 'test');
    unitTest.assertDeepEqual(result, data, 'should read data from a file');
    await cleanFiles();

    result = persist.readData('.', 'undefined.json');
    unitTest.assertUndefined(result, 'should return undefined reading a non existing file');

    await persist.saveObjectToFile('.', 'test', testData.data1);
    await delay(10);
    await persist.saveObjectToFile('.', 'test', testData.data2);
    await delay(10);
    await persist.saveObjectToFile('.', 'test', testData.data3);
    await delay(10);
    const files = await Persist.readDir('.');
    const filteredFiles = Persist.filterFiles(files, 'test');
    unitTest.assertEqual(filteredFiles.length, 3, 'should have three saved files');

    await Persist.deleteOldFiles('.', 'test', 2);
    const filesAfterDelete = await Persist.readDir('.');
    const filteredFilesAfterDelete = Persist.filterFiles(filesAfterDelete, 'test');
    unitTest.assertDeepEqual(filteredFilesAfterDelete.length, 2, 'should keep two files');

    await cleanFiles();

    let readJSON = persist.readData('.', 'test');
    unitTest.assertEqual(readJSON, undefined, 'read not existing file');

    await persist.saveObjectToFile('.', 'test', testData.data1);
    readJSON = persist.readData('.', 'test');
    unitTest.assertDeepEqual(testData.data1, readJSON, 'simple read');

    await persist.saveObjectToFile('.', 'test', testData.data1);
    await persist.saveObjectToFile('.', 'test', testData.data2);
    readJSON = persist.readData('.', 'test');
    unitTest.assertDeepEqual(testData.data2, readJSON, 'newest file');

    await cleanFiles();
}

export default async () => {
    await testPersist();
    return unitTest.getResultFunctions(8);
};
