using OrderingService.API.Models;
using System;
using System.Collections.Generic;

namespace OrderingService.Messaging.IntegrationEvents
{
    public interface OrderApprovedIntegrationEvent
    {
        Guid OrderId { get; }
        IEnumerable<ItemForOrderApprovedIntegrationEventDto> Items { get; }
    }
}