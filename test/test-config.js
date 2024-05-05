/**
 * ---------------------------------------------------------------------------------------------------
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * File:      test.js
 *
 * Author:      Volker Böhm
 * Copyright:   Volker Böhm
 * ---------------------------------------------------------------------------------------------------
 */

'use scrict';

import { UnitTest, readConfiguration } from '../dist/index.js';

export default () => {
    const unitTest = new UnitTest(false);
    const config = readConfiguration('./test/test-config-file.json');
    unitTest.assertEqual(config.test, 'ok');
    return unitTest.getResultFunctions(1);
};
