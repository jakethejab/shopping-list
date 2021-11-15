import { DateTime, Settings } from 'luxon';

Settings.defaultZone = 'utc';

/**
 * Uses Luxon to generate a unix/luxon date
 * @returns A unix/epoch date (number of milliseconds from fixed date)
 */
 export const getUnixDate = (): number => {
  // Divides by 1000, because luxon provides a unix date that is 3 digits too long
  return Math.round(DateTime.now().toMillis() / 1000);
}