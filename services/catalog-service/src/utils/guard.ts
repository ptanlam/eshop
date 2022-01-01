import { defaultCurrency } from '../constants';

export class Guard {
  static Against = class Against {
    static FalseUnitFormat(unit: string) {
      if (!unit || unit.trim().length !== 3) {
        return defaultCurrency;
      } else {
        return unit.toUpperCase();
      }
    }
  };
}
