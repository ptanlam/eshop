using FluentAssertions;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.ValueObjects;
using System;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class ItemUnitTests
    {
        [Fact]
        public void Creation_ShouldReturnExpectedItem()
        {
            var productId = Guid.NewGuid();
            var price = 13_000_000;
            var priceUnit = "VND";
            var quantity = 10;

            var item = new Item(productId, new Money(price, priceUnit), quantity);

            item.ProductId.Should().Be(productId);
            item.Price.Amount.Should().Be(price);
            item.Price.Unit.Should().Be(priceUnit);
            item.Quantity.Should().Be(quantity);
        }

        [InlineData("{3B0DB724-6183-402C-B86C-0F3AD8763A23}", 12_000_000, -10, "VND", "quantity")]
        [InlineData("{00000000-0000-0000-0000-000000000000}", 12_000_000, 10, "VND", "productId")]
        [Theory]
        public void Creation_InvalidParameters_ShouldThrowArgumentException(
           Guid productId, decimal price, int quantity, string priceUnit, string paramName)
        {
            Action act = () =>
            {
                var _ = new Item(productId, new Money(price, priceUnit), quantity);
            };

            act.Should().Throw<ArgumentException>().WithParameterName(paramName);
        }

        [InlineData(5, ManipulationOperator.Plus, 15)]
        [InlineData(5, ManipulationOperator.Subtract, 5)]
        [Theory]
        public void ManipulateQuantity_ShouldReturnExpectedQuantity(
           int manipulationQuantity, ManipulationOperator @operator,
           int expectedQuantity)
        {
            var productId = Guid.NewGuid();
            var price = 13_000_000;
            var priceUnit = "VND";
            var quantity = 10;

            var item = new Item(productId, new Money(price, priceUnit), quantity);
            item.ManipulateQuantity(manipulationQuantity, @operator);

            item.Quantity.Should().Be(expectedQuantity);
        }

        [InlineData(-5, ManipulationOperator.Plus)]
        [InlineData(-15, ManipulationOperator.Subtract)]
        [Theory]
        public void ManipulateQuantity_InvalidParameter_ShouldThrowArgumentException(
            int manipulationQuantity, ManipulationOperator @operator)
        {
            var productId = Guid.NewGuid();
            var price = 13_000_000;
            var priceUnit = "VND";
            var quantity = 10;

            var item = new Item(productId, new Money(price, priceUnit), quantity);
            Action act = () => item.ManipulateQuantity(manipulationQuantity, @operator);

            act.Should().Throw<ArgumentException>();
        }

        [Fact]
        public void TryManipulateQuantity_ShouldReturnExpectedResult()
        {
            var productId = Guid.NewGuid();
            var price = 13_000_000;
            var priceUnit = "VND";
            var quantity = 10;

            var @operator = ManipulationOperator.Subtract;
            var manipulationQuantity = quantity + 1;

            var item = new Item(productId, new Money(price, priceUnit), quantity);
            var success = item.TryManipulateQuantity(manipulationQuantity, @operator);

            success.Should().BeFalse();
        }
    }
}