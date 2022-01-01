using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public record UpdateOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}