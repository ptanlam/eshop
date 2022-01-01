using System;

namespace OrderingService.API.Models
{
    // Integration event
    public record ReceiptDto
    {
        public Guid Id { get; init; }
        public decimal Amount { get; init; }
        public string Currency { get; init; }
    }
}