using Microsoft.AspNetCore.Mvc;
using System;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public record RemoveItemInOrderRequest
    {
        public const string Route = "orders/{OrderId:Guid}/items/{ItemId:int}";

        public Guid OrderId { get; init; }
        public int ItemId { get; init; }
    }
}