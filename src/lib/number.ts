export class NumberFormat {
  /**
   * Clean and parse input string/number to number (remove non-numeric characters)
   */
  static clean(val: string | number): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseFloat(String(val).replace(/[^\d.-]+/g, '')) || 0;
  }

  /**
   * Format number with thousands separator (e.g. 1,234.56)
   */
  static withSeparator(val: number | string, fractionDigits = 2): string {
    const num = this.clean(val);
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }

  /**
   * Format as plain number with fixed decimals (e.g. 1234.56)
   */
  static plain(val: number | string, fractionDigits = 2): string {
    const num = this.clean(val);
    if (isNaN(num)) return '';
    return num.toFixed(fractionDigits);
  }

  /**
   * Parse string to number (remove thousand separators)
   */
  static parse(val?: string | number): number {
    return this.clean(val ?? '');
  }

  /**
   * Format percentage from 0.32 → 32.00%
   */
  static percent(val: number | string, fractionDigits = 2): string {
    const num = this.clean(val);
    return `${(num * 100).toFixed(fractionDigits)}%`;
  }

  /**
   * Format actual vs planning percentage (e.g. 80 out of 100 → 80.00%)
   */
  static ratioPercent(
    actual?: string | number,
    planning?: string | number,
    digits = 2,
  ): string {
    const a = this.clean(actual ?? 0);
    const p = this.clean(planning ?? 0);
    if (p === 0 || isNaN(a) || isNaN(p)) return '0%';
    const result = (a / p) * 100;
    return `${result.toFixed(digits)}%`;
  }

  /**
   * Format number with thousands separator as default display
   */
  static no(val: string | number = '0'): string {
    return this.clean(val).toLocaleString('en-EN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
