/**
 * ---------------------------------------------------------------------------------------------------
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * Author:      Volker Böhm
 * Copyright:   Volker Böhm
 * ---------------------------------------------------------------------------------------------------
 */

import { shutdown, UnitTest } from '../dist/index.js';
const unitTest = new UnitTest(true);

shutdown(async () => {
    unitTest.log('SIGINT received');
    unitTest.success('shutdown');
    await delay(1000);
    unitTest.log('safe shutdown');
    process.exit(0);
});

const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export default async () => {
    console.log('Press ^C to test');
    for (let i = 0; i < 10; i++) {
        await delay(1000);
        unitTest.log('.');
    }
    return unitTest.getResultFunctions(0);
};
