using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using System;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public record AddJourneyToOrderRequest
    {
        public const string Route = "orders/{OrderId:Guid}/journeys";

        [FromRoute]
        public Guid OrderId { get; init; }

        [FromRoute]
        public int JourneyId { get; init; }

        [FromBody]
        public JourneyForCreationDto Journey { get; init; }
    }
}