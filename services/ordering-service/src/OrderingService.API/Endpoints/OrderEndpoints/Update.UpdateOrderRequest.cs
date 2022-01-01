using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using System;
using System.Collections.Generic;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class UpdateOrderRequest
    {
        public const string Route = "orders/{Id:Guid}";

        [FromRoute]
        public Guid Id { get; init; }

        [FromBody]
        public OrderForUpdateDto Order { get; init; }
    }
}