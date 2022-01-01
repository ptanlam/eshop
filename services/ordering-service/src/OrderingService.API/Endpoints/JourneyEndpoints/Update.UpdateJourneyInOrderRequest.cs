using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using System;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public record UpdateJourneyInOrderRequest
    {
        public const string Route = "orders/{OrderId:Guid}/journeys/{JourneyId:int}";

        [FromRoute]
        public Guid OrderId { get; init; }

        [FromRoute]
        public int JourneyId { get; init; }

        [FromBody]
        public JourneyForUpdateDto Journey { get; init; }
    }
}