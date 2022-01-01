using FluentAssertions;
using OrderingService.Core.ValueObjects;
using System;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class MoneyUnitTests
    {
        [Fact]
        public void Creation_ShouldReturnExpectedMoneyObject()
        {
            var amount = 12_000_000;
            var unit = "VND";

            var money = new Money(amount, unit);

            money.Amount.Should().Be(amount);
            money.Unit.Should().Be(unit);
        }

        [InlineData(-12_000_000, "VND", "amount")]
        [InlineData(12_000_000, "", "unit")]
        [Theory]
        public void Creation_InvalidParameters_ShouldThrowArgumentException(
            decimal amount, string unit, string paramName)
        {
            Action act = () => { var _ = new Money(amount, unit); };

            act.Should().Throw<ArgumentException>()
                .WithParameterName(paramName);
        }
    }
}