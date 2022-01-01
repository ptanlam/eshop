using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public record AddItemToOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}