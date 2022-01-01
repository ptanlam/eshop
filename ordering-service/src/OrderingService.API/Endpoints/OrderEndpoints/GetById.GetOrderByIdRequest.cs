using Microsoft.AspNetCore.Mvc;
using System;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public record GetOrderByIdRequest
    {
        public const string Route = "orders/{Id:Guid}";
        public const string Name = "GetOrderById";

        [FromRoute]
        public Guid Id { get; init; }
    }
}