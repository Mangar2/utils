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
 * Converts a time string in format MM or HH:MM or HH:MM:SS to seconds
 * @param {string} timeString - Delta time.
 * @throws {Error} On incorrect date format.
 * @returns {number} Time string in seconds.
 */
export declare function stringToSeconds(timeString: string): number;
/**
 * Checks, if a string is a time of day string (HH:MM or HH:MM:SS)
 * @param {string} timeString delta time
 * @returns {boolean} true, if the string is a time of day string
 */
export declare function isTimeOfDayString(timeString: string): boolean;
/**
 * Converts a time string in format HH:MM or HH:MM:SS or MM to a date (today, same time of day)
 * @param {string} timeString time of day
 * @throws {Error} on false time format
 * @returns {Date} today, hours, minutes, seconds set to the time of day string
 */
export declare function timeOfDayStringToDate(timeString: string): Date;
/**
 * Gets the seconds since midnight of a date.
 * @param {Date} date date to concider
 * @returns {number} amount of seconds passed since midnight
 */
export declare function dateToTimeOfDayInSeconds(date: Date): number;
