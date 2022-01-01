using Ardalis.GuardClauses;
using OrderingService.Core.CustomGuards;
using OrderingService.Core.Enums;
using OrderingService.Core.ValueObjects;
using OrderingService.SharedKernel;
using System;

namespace OrderingService.Core.OrderAggregateRoot
{
    public class Item : BaseEntity<int>
    {
        public Guid ProductId { get; private set; }
        public Money Price { get; private set; }
        public int Quantity { get; private set; }
        public decimal TotalPrice => Price.Amount * Quantity;

        public Item()
        {
        }

        public Item(Guid productId, Money price, int quantity)
        {
            ProductId = Guard.Against.EmptyGuid(productId, nameof(productId));
            Price = price;
            Quantity = Guard.Against.NegativeOrZero(quantity, nameof(quantity));
        }

        public void ManipulateQuantity(int quantity, ManipulationOperator @operator)
        {
            Guard.Against.Negative(quantity, nameof(quantity));

            switch (@operator)
            {
                case ManipulationOperator.Plus:
                    Quantity += quantity;
                    break;

                case ManipulationOperator.Subtract:
                    var newQuantity = Quantity - quantity;
                    Quantity = Guard.Against.NegativeOrZero(newQuantity,
                        nameof(newQuantity)); ;
                    break;

                default:
                    break;
            }
        }

        public bool TryManipulateQuantity(
            int manipulationQuantity, ManipulationOperator @operator)
        {
            try
            {
                ManipulateQuantity(manipulationQuantity, @operator);
                return true;
            }
            catch (ArgumentException)
            {
                return false;
            }
        }
    }
}