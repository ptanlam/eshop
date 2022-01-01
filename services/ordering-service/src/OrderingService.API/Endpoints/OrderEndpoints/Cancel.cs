using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.ApiEndpoints;
using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.Messaging.IntegrationEvents;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class Cancel : BaseAsyncEndpoint
        .WithRequest<CancelOrderRequest>
        .WithoutResponse
    {
        private readonly IRepository<Order> _repository;
        private readonly IBusControl _bus;
        private readonly IMapper _mapper;

        public Cancel(IRepository<Order> repository, IBusControl bus, IMapper mapper)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _bus = bus ?? throw new ArgumentNullException(nameof(bus));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpDelete(CancelOrderRequest.Route)]
        [SwaggerOperation(
            Summary = "Cancels order",
            Description = "Cancels order",
            OperationId = "Order.Cancel",
            Tags = new[] { "OrderEndpoints" })]
        public override async Task<ActionResult> HandleAsync([FromQuery] CancelOrderRequest request,
            CancellationToken cancellationToken = new CancellationToken())
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.Id),
                cancellationToken);
            if (order == null) return NotFound();

            order.Cancel();
            await _repository.SaveChangesAsync(cancellationToken);

            await _bus.Publish<OrderCancelledIntegrationEvent>(new
            {
                order.ReceiptId,
                Items = _mapper.Map<IEnumerable<ItemForOrderCancelledIntegrationEventDto>>(order.Items)
            }, cancellationToken);

            return NoContent();
        }
    }
}