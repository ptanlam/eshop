using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using System;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public class AddItemToOrderRequest
    {
        public const string Route = "orders/{OrderId:Guid}/items";

        [FromRoute]
        public Guid OrderId { get; init; }

        [FromBody]
        public ItemForCreationDto Item { get; init; }
    }
}