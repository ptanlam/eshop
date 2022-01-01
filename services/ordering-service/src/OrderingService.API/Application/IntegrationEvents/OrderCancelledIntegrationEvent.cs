using OrderingService.API.Models;
using System;
using System.Collections.Generic;

namespace OrderingService.Messaging.IntegrationEvents
{
    public interface OrderCancelledIntegrationEvent
    {
        Guid ReceiptId { get; }
        IEnumerable<ItemForOrderCancelledIntegrationEventDto> Items { get; }
    }
}