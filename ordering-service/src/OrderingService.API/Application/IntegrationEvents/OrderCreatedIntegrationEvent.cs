using OrderingService.API.Models;
using System.Collections.Generic;

namespace OrderingService.Messaging.IntegrationEvents
{
    public interface OrderCreatedIntegrationEvent
    {
        string CustomerEmail { get; }
        decimal TotalPrice { get; }
        string PriceUnit { get; }
        public IEnumerable<ItemDto> Items { get; }
    }
}