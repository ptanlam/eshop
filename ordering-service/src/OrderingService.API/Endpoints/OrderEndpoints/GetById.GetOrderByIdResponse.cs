using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public record GetOrderByIdResponse
    {
        public OrderDetailsDto Order { get; init; }
    }
}