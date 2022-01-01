using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public record AddJourneyToOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}