export class NumberFormat {
  /**
   * Format number with thousands separator (e.g. 1,234.56)
   */
  static withSeparator(val: number | string, fractionDigits = 2): string {
    const num =
      typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
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
    const num =
      typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
    if (isNaN(num)) return '';
    return num.toFixed(fractionDigits);
  }

  /**
   * Parse string to number (remove thousand separators)
   */
  static parse(val?: string | number): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
  }

  /**
   * Format percentage (e.g. 0.32 → 32.00%)
   */
  static percent(val: number | string, fractionDigits = 2): string {
    const num = this.parse(val);
    return `${(num * 100).toFixed(fractionDigits)}%`;
  }
}
