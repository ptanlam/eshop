using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using System;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public record UpdateItemInOrderRequest
    {
        public const string Route = "orders/{OrderId:Guid}/items/{ItemId:int}";

        [FromRoute]
        public Guid OrderId { get; init; }

        [FromRoute]
        public int ItemId { get; init; }

        [FromBody]
        public ItemForUpdateDto Item { get; init; }
    }
}