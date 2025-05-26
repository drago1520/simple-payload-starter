/**
 * Formats a timestamp into a MM/DD/YYYY date string.
 *
 * @param {string} timestamp - The timestamp to format (ISO string format)
 * @returns {string} Formatted date string in MM/DD/YYYY format
 *
 * ## When to use:
 *
 * 1. **Content Display**:
 *    - For displaying dates in a consistent format across the application
 *    - For blog posts, articles, or content publication dates
 *
 * 2. **Form Values**:
 *    - When displaying dates in form fields
 *    - For date pickers that need a formatted initial value
 *
 * 3. **Data Export**:
 *    - When exporting data that includes dates
 *    - For CSV or spreadsheet exports
 *
 * Note: This function currently only formats the date portion (MM/DD/YYYY).
 * The time formatting code is commented out but available for future use.
 */
export const formatDateTime = (timestamp: string): string => {
  const now = new Date();
  let date = now;
  if (timestamp) date = new Date(timestamp);
  const months = date.getMonth();
  const days = date.getDate();
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1;
  const DD = days < 10 ? `0${days}` : days;
  const YYYY = date.getFullYear();
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`;
};
