using System;
using Microsoft.AspNetCore.Mvc;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public record CancelOrderRequest
    {
        public const string Route = "orders/{Id:Guid}";
        [FromRoute] public Guid Id { get; init; }
    }
}