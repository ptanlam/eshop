using Ardalis.ApiEndpoints;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public class Update : BaseAsyncEndpoint
        .WithRequest<UpdateJourneyInOrderRequest>
        .WithResponse<UpdateJourneyInOrderResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public Update(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
        }

        [HttpPatch(UpdateJourneyInOrderRequest.Route)]
        [SwaggerOperation(
         Summary = "Updates journey to existing order",
         Description = "Updates journey to existing order",
         OperationId = "Journey.Add",
         Tags = new[] { "JourneyEndpoints" })]
        public override async Task<ActionResult<UpdateJourneyInOrderResponse>> HandleAsync(
            [FromQuery] UpdateJourneyInOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.OrderId), cancellationToken);
            if (order == null) return NotFound();

            var journeyIndex = order.Journeys.ToList().FindIndex(j => j.Id == request.JourneyId);
            if (journeyIndex == -1) return NotFound();

            if (!string.IsNullOrEmpty(request.Journey.Location))
                order.Journeys.ElementAt(journeyIndex).UpdateLocation(request.Journey.Location);

            if (!string.IsNullOrEmpty(request.Journey.Notes))
                order.Journeys.ElementAt(journeyIndex).UpdateNotes(request.Journey.Notes);

            await _repository.UpdateAsync(order, cancellationToken);

            var response = new UpdateJourneyInOrderResponse()
            {
                Order = _mapper.Map<OrderDto>(order)
            };
            
            return Ok(response.Order);
        }
    }
}