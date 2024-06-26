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

import { Types } from './types.js';

/**
 * Converts a time string in format MM or HH:MM or HH:MM:SS to seconds
 * @param {string} timeString - Delta time.
 * @throws {Error} On incorrect date format.
 * @returns {number} Time string in seconds.
 */
export function stringToSeconds (timeString: string): number {
    const minus = timeString.startsWith('-') ? -1 : 1;
    if (minus === -1) timeString = timeString.substring(1);

    // Split the string
    const sourceChunks = timeString.trim().split(':').map(Number);

    // Error if any chunk is not a number or if there are too many or too few chunks
    if (sourceChunks.some(isNaN) || sourceChunks.length > 3 || sourceChunks.length === 0) {
        throw Error('Illegal time format: ' + timeString);
    }

    let hours = 0; let minutes = 0; let seconds = 0;
    if (sourceChunks.length === 1) {
        minutes = sourceChunks[0];
    } else if (sourceChunks.length === 2) {
        hours = sourceChunks[0];
        minutes = sourceChunks[1];
    } else {
        hours = sourceChunks[0];
        minutes = sourceChunks[1];
        seconds = sourceChunks[2];
    }

    // Error if hour, minute or second is outside of valid range
    if (hours < 0 || hours > 24 || (hours === 24 && (minutes !== 0 || seconds !== 0))) {
        throw Error('Illegal hours value: ' + hours);
    }
    if (minutes < 0 || minutes > 59) {
        throw Error('Illegal minutes value: ' + minutes);
    }
    if (seconds < 0 || seconds > 59) {
        throw Error('Illegal seconds value: ' + seconds);
    }

    // Calculate seconds
    const result = hours * 3600 + minutes * 60 + seconds;

    return result * minus;
}

/**
 * Checks, if a string is a time of day string (HH:MM or HH:MM:SS)
 * @param {string} timeString delta time
 * @returns {boolean} true, if the string is a time of day string
 */
export function isTimeOfDayString (timeString: string): boolean {
    let result = false;
    if (Types.isString(timeString)) {
        const timeChunks = timeString.trim().split(':');
        result = timeChunks.length > 1 && timeChunks.length <= 3;
        let maxInt = 23;
        for (const chunk of timeChunks) {
            const chunkAsNumber = parseInt(chunk);
            if (!Types.isInteger(chunkAsNumber) || chunkAsNumber < 0 || chunkAsNumber > maxInt) {
                result = false;
                break;
            }
            maxInt = 59;
        }
    }
    return result;
}

/**
 * Converts a time string in format HH:MM or HH:MM:SS or MM to a date (today, same time of day)
 * @param {string} timeString time of day
 * @throws {Error} on false time format
 * @returns {Date} today, hours, minutes, seconds set to the time of day string
 */
export function timeOfDayStringToDate (timeString: string): Date {
    const result = new Date();
    const seconds = timeString === undefined ? 0 : stringToSeconds(timeString);
    result.setHours(0, 0, seconds, 0);
    return result;
}

/**
 * Gets the seconds since midnight of a date.
 * @param {Date} date date to concider
 * @returns {number} amount of seconds passed since midnight
 */
export function dateToTimeOfDayInSeconds (date: Date): number {
    const midnight = new Date(date.getTime());
    midnight.setHours(0, 0, 0);
    const result: number = (date.getTime() - midnight.getTime()) / 1000;
    return result;
}
