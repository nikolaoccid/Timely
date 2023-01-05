import dateFormat from 'dateformat';

export function toUTCDate(date) {
  return dateFormat(date, "isoUtcDateTime");
}
