export class DateFormat {
  /**
   * Format date into yyyy-mm-dd format
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in yyyy-mm-dd format
   * @example
   * DateFormat.Ymd(new Date()) // Output: "2024/12/03"
   */
  static Ymd(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const [day, month, year] = formattedDate.split('/');

    return `${year}-${month}-${day}`;
  }

  /**
   * Format date into dd/MM/yyyy format
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in dd/MM/yyyy format
   * @example
   * DateFormat.dmY(new Date()) // Output: "13/03/2024"
   */
  static dmY(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return formattedDate;
  }

  /**
   * Format date into dd month yyyy format (example: 13 March 2024)
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in dd month yyyy format
   * @example
   * DateFormat.dMY(new Date()) // Output: "13 March 2024"
   */
  static dMY(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return formattedDate;
  }

  static my(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });

    return formattedDate;
  }

  /**
   * Format date into dd-mm-yyyy, hh:mm:ss format
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in dd-mm-yyyy, hh:mm:ss format
   * @example
   * DateFormat.dmyhms(new Date()) // Output: "13-03-2024, 23:59:59"
   */

  static dmYhms(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formattedDate;
  }

  /**
   * Get Year, Month and Day from date
   * @param input Date to be formatted (can be Date object or date string)
   * @returns object with year, month and day
   * @example
   * DateFormat.getYearMonthDay(new Date()) // Output: { year: 2024, month: 3, day: 13 }
   */

  static getYearMonthDay(input: any = new Date()): {
    year: number;
    month: number;
    day: number;
  } {
    const date = new Date(input);
    const year = Number(
      date.toLocaleString('id-ID', {
        year: 'numeric',
      }),
    );
    const month = Number(
      date.toLocaleString('id-ID', {
        month: 'numeric',
      }),
    );
    const day = Number(
      date.toLocaleString('id-ID', {
        day: 'numeric',
      }),
    );
    return { year, month, day };
  }

  /**
   * Get the range of the current week (Monday to Sunday)
   * @returns Object with start and end dates of the week
   * @example
   * DateFormat.thisWeekRange()
   * // Output: { start: Mon, 13 Mar 2024 00:00:00 GMT+0700, end: Sun, 19 Mar 2024 23:59:59 GMT+0700 }
   */
  static thisWeekRange(): { start: Date; end: Date } {
    const now = new Date();

    // Get the current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = now.getDay();

    // Calculate the difference to get back to Monday (adjusting for Sunday being 0)
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    // Start of the week (Monday at 00:00:00)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of the week (Sunday at 23:59:59)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { start: startOfWeek, end: endOfWeek };
  }

  /**
   * Get the range of the current month
   * @returns Object with start and end dates of the month
   * @example
   * DateFormat.thisMonthRange()
   * // Output: { start: Tue, 01 Mar 2024 00:00:00 GMT+0700, end: Sun, 31 Mar 2024 23:59:59 GMT+0700 }
   */
  static thisMonthRange(): { start: Date; end: Date } {
    const now = new Date();

    // Start of the month (1st day at 00:00:00)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // End of the month (last day at 23:59:59)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return { start: startOfMonth, end: endOfMonth };
  }

  /**
   * Get the range of the current year
   * @returns Object with start and end dates of the year
   * @example
   * DateFormat.thisYearRange()
   * // Output: { start: Mon, 01 Jan 2024 00:00:00 GMT+0700, end: Tue, 31 Dec 2024 23:59:59 GMT+0700 }
   */
  static thisYearRange(): { start: Date; end: Date } {
    const now = new Date();

    // Start of the year (January 1st at 00:00:00)
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // End of the year (December 31st at 23:59:59)
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    return { start: startOfYear, end: endOfYear };
  }

  /**
   * convert from 11/2024 to November 2024
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in Month yyyy format
   *
   * @example
   * DateFormat.monthName(new Date()) // Output: "November 2024"
   */

  static monthYear(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });

    return formattedDate;
  }

  /**
   * convert from date to day-month-year format like 12-Jan-2024 or 24-Mei-2025
   * @param input Date to be formatted (can be Date object or date string)
   * @returns Date in dd-mm-yyyy format
   *
   * @example
   * DateFormat.dayMonthYear(new Date()) // Output: "12-Jan-2024"
   */

  static dayMonthYear(input: any = new Date()): string {
    const date = new Date(input);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    //replace all space with -
    const output = formattedDate.replace(/\s/g, '-');

    return output;
  }

  static timeStamp(input: any = new Date()): string {
    const date = new Date(input);
    const { day, month, year } = this.getYearMonthDay(date);

    const hour = date.toLocaleTimeString();

    const formattedDate = `${day}/${month}/${year} ${hour}`;

    return formattedDate;
  }
}
