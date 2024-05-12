/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */

'use strict';

import { sunrise, sunset, UnitTest } from '../dist/index.js';
const VERBOSE = true;
const DEBUG = true;
const unitTest = new UnitTest(VERBOSE, DEBUG);

unitTest.assertEqual(sunrise(8.203454, 49.9048667, new Date('2020-1-27')).toISOString(), new Date('2020-01-27T07:07:52.529Z').toISOString());
unitTest.assertEqual(sunset(8.203454, 49.9048667, new Date('2020-1-27')).toISOString(), new Date('2020-01-27T16:12:48.582Z').toISOString());
unitTest.assertEqual(sunset(51.1788, -1.8262, new Date('2000-1-21')).toISOString(), new Date('2000-01-21T14:52:50.954Z').toISOString());

export default () => unitTest.getResultFunctions(3);
