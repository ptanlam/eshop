using Ardalis.ApiEndpoints;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Endpoints.OrderEndpoints;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Endpoints.JourneyEndpoints
{
    public class Add : BaseAsyncEndpoint
        .WithRequest<AddJourneyToOrderRequest>
        .WithResponse<AddJourneyToOrderResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public Add(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
        }

        [HttpPost(AddJourneyToOrderRequest.Route)]
        [SwaggerOperation(
          Summary = "Adds journey to existing order",
          Description = "Adds journey to existing order",
          OperationId = "Journey.Add",
          Tags = new[] { "JourneyEndpoints" })]
        public override async Task<ActionResult<AddJourneyToOrderResponse>> HandleAsync(
            [FromQuery] AddJourneyToOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.OrderId), cancellationToken);

            if (order == null) return NotFound();

            var journey = _mapper.Map<Journey>(request.Journey);

            order.AddJourney(journey);
            await _repository.UpdateAsync(order, cancellationToken);

            var response = new AddJourneyToOrderResponse()
            {
                Order = _mapper.Map<OrderDto>(order)
            };

            return CreatedAtRoute(
                GetOrderByIdRequest.Name,
                new { order.Id },
                response.Order);
        }
    }
}