using System;

namespace OrderingService.API.Models
{
    public record ItemForOrderCancelledIntegrationEventDto
    {
        public Guid ProductId { get; init; }
        public int Quantity { get; init; }
    }
}