using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public record UpdateJourneyInOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}