using OrderingService.API.Models;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public record UpdateItemInOrderResponse
    {
        public OrderDto Order { get; init; }
    }
}