/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2024 Volker Böhm
 */
/**
 * Calculates sunset for a given date and location.
 * @param {number} longitude - The longitude of the position to calculate.
 * @param {number} latitude - The latitude of the position to calculate.
 * @param {Date} date - The date for sunrise/sunset. Defaults to today.
 * @param {number} zenith - The zenith angle (default: 90°50', civil: 96, nautical: 102, astronomical: 108). Defaults to 90.83333333333333.
 * @return {Date} The date and time of sunset.
 */
export declare function sunset(longitude: number, latitude: number, date?: Date, zenith?: number): Date;
/**
 * Calculates sunrise for a given date and location.
 * @param {number} longitude - The longitude of the position to calculate.
 * @param {number} latitude - The latitude of the position to calculate.
 * @param {Date} date - The date for sunrise/sunset. Defaults to today.
 * @param {number} zenith - The zenith angle (default: 90°50', civil: 96, nautical: 102, astronomical: 108). Defaults to 90.83333333333333.
 * @return {Date} The date and time of sunrise.
 */
export declare function sunrise(longitude: number, latitude: number, date?: Date, zenith?: number): Date;
