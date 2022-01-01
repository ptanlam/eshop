using Ardalis.GuardClauses;
using OrderingService.SharedKernel;

namespace OrderingService.Core.ValueObjects
{
    public class Money : ValueObject
    {
        public decimal Amount { get; private set; }
        public string Unit { get; private set; }

        public Money(decimal amount, string unit)
        {
            Amount = Guard.Against.Negative(amount, nameof(amount));
            Unit = Guard.Against.NullOrEmpty(unit, nameof(unit));
        }
    }
}