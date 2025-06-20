import { format, isValid, parse } from 'date-fns';
import { id } from 'date-fns/locale';

export class DateFormat {
  // ========== BASIC FORMATTING ==========

  /** Format: yyyy-MM-dd */
  static toISO(input: Date | string = new Date()): string {
    return format(new Date(input), 'yyyy-MM-dd');
  }

  /** Format: dd/MM/yyyy */
  static toSheet(input: Date | string = new Date()): string {
    return format(new Date(input), 'dd/MM/yyyy');
  }

  /** Format: dd MMMM yyyy (e.g. 13 Maret 2024) */
  static toLong(input: Date | string = new Date()): string {
    return format(new Date(input), 'dd MMMM yyyy', { locale: id });
  }

  /** Format: dd-MMM-yyyy (e.g. 24-Mei-2025) */
  static toShortDash(input: Date | string = new Date()): string {
    return format(new Date(input), 'dd-MMM-yyyy', { locale: id });
  }

  /** Format: MMM yyyy (e.g. Mei 2024) */
  static toMonthYear(input: Date | string = new Date()): string {
    return format(new Date(input), 'MMM yyyy', { locale: id });
  }

  /** Format: dd-MM-yyyy, HH:mm:ss */
  static toFull(input: Date | string = new Date()): string {
    const parsed =
      typeof input === 'string'
        ? parse(input, 'dd/MM/yyyy', new Date())
        : new Date(input);

    return isValid(parsed) ? format(parsed, 'dd-MM-yyyy, HH:mm:ss') : '';
  }

  /** Format: dd/MM/yyyy HH:mm:ss */
  static timestamp(input: Date | string = new Date()): string {
    return format(new Date(input), 'dd/MM/yyyy HH:mm:ss');
  }

  // ========== DATE STRUCTURE ==========

  static getYMD(input: Date | string = new Date()) {
    const date = new Date(input);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  // ========== RANGE ==========

  static thisWeek(): { start: Date; end: Date } {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  static thisMonth(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  static thisYear(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========== PARSING ==========

  /** Parse common formats and return human-readable string */
  static normalize(input: string): string {
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'd/M/yyyy',
      'M/d/yyyy',
      'dd/MM/yyyy',
    ];

    for (const fmt of formats) {
      const parsed = parse(input, fmt, new Date());
      if (isValid(parsed))
        return format(parsed, 'EEE, dd MMM yyyy', { locale: id });
    }

    return '';
  }

  /** Convert dd/MM/yyyy to timestamp (for sorting) */
  static timestampFromSheet(val: string): number {
    const parsed = parse(val, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed.getTime() : 0;
  }

  /**
   * Convert from MM-yyyy (e.g. "06-2025") to "Juni 2025"
   */
  static monthNameFromPeriod(period: string): string {
    const parsed = parse(period, 'MM-yyyy', new Date());
    return isValid(parsed) ? format(parsed, 'MMMM yyyy', { locale: id }) : '';
  }

  static toIndonesianFullDate(input: Date | string = new Date()): string {
    const parsed =
      typeof input === 'string'
        ? parse(input, 'dd/MM/yyyy', new Date())
        : new Date(input);

    return isValid(parsed)
      ? format(parsed, 'EEEE, dd MMMM yyyy', { locale: id })
      : '';
  }
}
