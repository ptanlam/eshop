using OrderingService.API.Models;
using System.Collections.Generic;

namespace OrderingService.Messaging.IntegrationEvents
{
    public interface PaymentCreatedIntegrationEvent
    {
        ReceiptDto Receipt { get; }
        IEnumerable<OrderForCreationDto> Orders { get; }
    }
}