using System;

namespace OrderingService.API.Models
{
    public record ItemForOrderApprovedIntegrationEventDto
    {
        public Guid ProductId { get; init; }
        public int Quantity { get; init; }
    }
}