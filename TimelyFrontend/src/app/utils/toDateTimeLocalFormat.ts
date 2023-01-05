import dateFormat from 'dateformat';

export default function toDateTimeLocalFormat(date: Date): string {
  return dateFormat(date, "isoDate") + 'T' + dateFormat(date, 'isoTime');
}

