import { IStrategy } from './statergy';

export class DiscountContext {
  private strategy: IStrategy;

  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IStrategy) {
    this.strategy = strategy;
  }

  public async findOrCreate(id: string) {
    const result = await this.strategy.findOrCreateEntity(id);
    return result;
  }

  public async findOrCreateRelationship(id: string, discountId: string) {
    const result = await this.strategy.findOrCreateRelationship(discountId, id);
    return result;
  }

  public async findDiscountIdByEntityId(ids: string[]): Promise<string[]> {
    const discountIds = await this.strategy.findDiscountIdByEntityId(ids);
    return discountIds.map((i) => i.discountId);
  }
}
