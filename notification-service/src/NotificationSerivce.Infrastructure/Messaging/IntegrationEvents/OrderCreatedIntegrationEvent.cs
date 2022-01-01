using MassTransit.Topology;
using System;
using System.Collections.Generic;

namespace OrderingService.Messaging.IntegrationEvents
{
    [EntityName("order.created.notification")]
    public interface OrderCreatedIntegrationEvent
    {
        string CustomerEmail { get; }
        decimal TotalPrice { get; }
        string PriceUnit { get; }
        IEnumerable<ItemForIntegrationEvent> Items { get; }
    }

    public record ItemForIntegrationEvent(
        Guid ProductId, string Name, decimal Price, int Quantity, string PriceUnit);
}