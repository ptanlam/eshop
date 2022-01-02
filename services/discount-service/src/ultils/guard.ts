import { BadRequestException } from '@nestjs/common';

export class Guard {
  static Against = class Against {
    static OutSide100(isFlatAmount: boolean, modifier: number) {
      if (!isFlatAmount && (modifier <= 0 || modifier >= 100)) {
        throw new BadRequestException(
          'modifier is not in 1-99 and not a flat amount',
        );
      }
      return modifier;
    }
    static LagerThan0(discountRule: number) {
      if (discountRule < 0)
        throw new BadRequestException('discount rule must be greater than 0');
      return discountRule;
    }

    static FlatValueBusinessLogic(
      isFlatAmount: boolean,
      modifier: number,
      discountRule: number,
    ) {
      if (isFlatAmount && discountRule <= modifier)
        throw new BadRequestException(
          `modifier must be greater than discountRule when discount is flat amount`,
        );
      return Against.LagerThan0(discountRule);
    }
  };
}
