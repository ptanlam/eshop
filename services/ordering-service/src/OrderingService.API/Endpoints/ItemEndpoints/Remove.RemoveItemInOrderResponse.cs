using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public record RemoveItemInOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}