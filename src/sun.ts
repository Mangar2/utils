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
 * Constants used for calculations
 * @private
 */
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const HOURS_IN_A_DAY = 24;
const ONE_DAY = HOURS_IN_A_DAY * ONE_HOUR;
const SUN_LONGITUDE_PER_HOUR = 15;
const DEGREE_TO_RADIAN = Math.PI / 180;
const RADIAN_TO_DEGREE = 180 / Math.PI;
const ZENITH = 90.83333333333333; // Default Zenith

/**
 * Calculates sine from an angle in degrees.
 * @private
 * @param {number} degree - The angle in degrees.
 * @return {number} The sine of the angle.
 */
function sinDegree (degree: number): number {
    return Math.sin(degree * DEGREE_TO_RADIAN);
}

/**
 * Calculates cosine from an angle in degrees.
 * @private
 * @param {number} degree - The angle in degrees.
 * @return {number} The cosine of the angle.
 */
function cosDegree (degree: number): number {
    return Math.cos(degree * DEGREE_TO_RADIAN);
}

/**
 * Calculates tangent from an angle in degrees.
 * @private
 * @param {number} degree - The angle in degrees.
 * @return {number} The tangent of the angle.
 */
function tanDegree (degree: number): number {
    return Math.tan(degree * DEGREE_TO_RADIAN);
}

/**
 * Calculates arctangent from an angle in degrees.
 * @private
 * @param {number} degree - The angle in degrees.
 * @return {number} The arctangent of the angle.
 */
function atanDegree (degree: number): number {
    return RADIAN_TO_DEGREE * Math.atan(degree);
}

/**
 * Calculates arccosine from an angle in degrees.
 * @private
 * @param {number} degree - The angle in degrees.
 * @return {number} The arccosine of the angle.
 */
function acosDegree (degree: number): number {
    return RADIAN_TO_DEGREE * Math.acos(degree);
}

/**
 * Calculates the day of the year from a date.
 * @private
 * @param {Date} date - The date to calculate the day of the year.
 * @return {number} The day of the year.
 */
function calcDayOfYear (date: Date): number {
    const yearBegin = new Date(date.getFullYear(), 0, 0);
    let timeDiffInMilliseconds = date.getTime() - yearBegin.getTime();
    const daylightSavingCompensationInMilliseconds = (date.getTimezoneOffset() - yearBegin.getTimezoneOffset()) * ONE_MINUTE;
    timeDiffInMilliseconds += daylightSavingCompensationInMilliseconds;
    const dayOfYear = Math.floor(timeDiffInMilliseconds / ONE_DAY);
    return dayOfYear;
}

/**
 * Calculates sunset or sunrise for a given date and location.
 * @private
 * @param {Date} date - The date for sunrise/sunset.
 * @param {number} longitude - The longitude of the position to calculate.
 * @param {number} latitude - The latitude of the position to calculate.
 * @param {number} zenith - The zenith angle (default: 90°50', civil: 96, nautical: 102, astronomical: 108).
 * @param {boolean} isSunrise - True for sunrise, false for sunset.
 * @return {Object} An object containing the 'time' of sunrise/sunset and 'info' if any is available.
 */
function calcSun (date: Date, longitude: number, latitude: number, zenith: number, isSunrise: boolean): { time: Date, info?: string } {
    const result: { time: Date, info?: string } = { time: new Date() };

    const dayOfYear = calcDayOfYear(date);
    const longitudePerHour = longitude / SUN_LONGITUDE_PER_HOUR;
    const meanTime = isSunrise ? 6 : 18;
    const approximateTime = dayOfYear + (meanTime - longitudePerHour) / HOURS_IN_A_DAY;

    const sunMeanAnomaly = (0.9856 * approximateTime) - 3.289;

    let sunTrueLongitude = sunMeanAnomaly +
        (1.916 * sinDegree(sunMeanAnomaly)) +
        (0.020 * sinDegree(2 * sunMeanAnomaly)) + 282.634;
    if (sunTrueLongitude > 360) {
        sunTrueLongitude -= 360;
    }
    if (sunTrueLongitude < 0) {
        sunTrueLongitude = 0;
    }

    let sunRightAscension = atanDegree(0.91764 * tanDegree(sunTrueLongitude));
    if (sunRightAscension > 360) {
        sunRightAscension = sunRightAscension - 360;
    } else if (sunRightAscension < 0) {
        sunRightAscension = sunRightAscension + 360;
    }

    const longitudeQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
    const rightAscensionQuadrant = Math.floor(sunRightAscension / 90) * 90;
    sunRightAscension += (longitudeQuadrant - rightAscensionQuadrant);
    sunRightAscension /= SUN_LONGITUDE_PER_HOUR;

    const sunDeclinationSin = 0.39782 * sinDegree(sunTrueLongitude);
    const sunDeclinationCos = Math.cos(Math.asin(sunDeclinationSin));
    const cosSunLocalHourAngle =
        (cosDegree(zenith) - (sunDeclinationSin * sinDegree(latitude))) /
        (sunDeclinationCos * cosDegree(latitude));
    if (cosSunLocalHourAngle > 1) {
        result.info = 'Sun never rises';
    }
    if (cosSunLocalHourAngle < -1) {
        result.info = 'Sun never sets';
    }

    let sunLocalHourAngle = acosDegree(cosSunLocalHourAngle);
    if (isSunrise) {
        sunLocalHourAngle = 360 - sunLocalHourAngle;
    }

    sunLocalHourAngle /= SUN_LONGITUDE_PER_HOUR;

    const localMeanTime = sunLocalHourAngle + sunRightAscension - (0.06571 * approximateTime) - 6.622;
    let UTCTime = localMeanTime - longitudePerHour;
    if (UTCTime > 24) {
        UTCTime = UTCTime - 24;
    } else if (UTCTime < 0) {
        UTCTime = UTCTime + 24;
    }
    const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    result.time = new Date(utcMidnight + UTCTime * ONE_HOUR);

    return result;
}

/**
 * Calculates sunset for a given date and location.
 * @param {number} longitude - The longitude of the position to calculate.
 * @param {number} latitude - The latitude of the position to calculate.
 * @param {Date} date - The date for sunrise/sunset. Defaults to today.
 * @param {number} zenith - The zenith angle (default: 90°50', civil: 96, nautical: 102, astronomical: 108). Defaults to 90.83333333333333.
 * @return {Date} The date and time of sunset.
 */
export function sunset (longitude: number, latitude: number, date: Date = new Date(), zenith: number = ZENITH): Date {
    const result = calcSun(new Date(date), longitude, latitude, zenith, false);
    return result.time;
}

/**
 * Calculates sunrise for a given date and location.
 * @param {number} longitude - The longitude of the position to calculate.
 * @param {number} latitude - The latitude of the position to calculate.
 * @param {Date} date - The date for sunrise/sunset. Defaults to today.
 * @param {number} zenith - The zenith angle (default: 90°50', civil: 96, nautical: 102, astronomical: 108). Defaults to 90.83333333333333.
 * @return {Date} The date and time of sunrise.
 */
export function sunrise (longitude: number, latitude: number, date: Date = new Date(), zenith: number = ZENITH): Date {
    const result = calcSun(new Date(date), longitude, latitude, zenith, true);
    return result.time;
}
