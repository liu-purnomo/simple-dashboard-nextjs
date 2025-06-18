// utils/normalize.ts
import { format, isValid, parse } from 'date-fns';

export class Normalize {
  static date = (val: string): string => {
    const parsed = parse(val, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed.toDateString() : '';
  };

  static dateToSheet = (val: string): string => {
    const parsed = parse(val, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '';
  };

  static number = (val: string | number): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
  };
}
