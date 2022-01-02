export interface IStrategy {
  findOrCreateEntity(id: string);
  findOrCreateRelationship(discountId: string, id: string);
  findDiscountIdByEntityId(ids: string[]): Promise<{ discountId: string }[]>;
}
