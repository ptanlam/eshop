using OrderingService.API.Models;
using System.Collections.Generic;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class ListOrderResponse
    {
        public IEnumerable<OrderDetailsShortenedDto> Data { get; init; }
        public object Pagination { get; init; }
    }
}