using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.API.Models
{
    public record OrderDetailsDto : OrderDetailsShortenedDto
    {
        public ShippingAddress ShippingAddress { get; set; }
        public Customer Customer { get; set; }
        public bool CanBeManipulated { get; set; }
    }
}