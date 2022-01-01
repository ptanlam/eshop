using Ardalis.ApiEndpoints;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class Update : BaseAsyncEndpoint
        .WithRequest<UpdateOrderRequest>
        .WithResponse<UpdateOrderResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public Update(IRepository<Order> repository, IMapper mapper, IMediator mediator)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));

            _mediator = mediator ??
                throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPatch(UpdateOrderRequest.Route)]
        [SwaggerOperation(
         Summary = "Updates order",
         Description = "Updates order state or notes",
         OperationId = "Order.Update",
         Tags = new[] { "OrderEndpoints" })]
        public override async Task<ActionResult<UpdateOrderResponse>> HandleAsync(
            [FromQuery] UpdateOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.Id),
                cancellationToken);
            if (order == null) return NotFound();

            if (!string.IsNullOrEmpty(request.Order.Notes))
                order.UpdateNotes(request.Order.Notes);

            var statusChanged = false;
            if (!string.IsNullOrEmpty(request.Order.Status))
            {
                statusChanged = true;
                order.ChangeStatus((OrderStatus)Enum.Parse(typeof(OrderStatus), request.Order.Status));
            }

            await _repository.UpdateAsync(order, cancellationToken);

            if (statusChanged) await _mediator.Send(
               new UpdateOrderStatusCommand(order.Status, order.Items, order.Id),
               cancellationToken);

            var response = new UpdateOrderResponse()
            {
                Order = _mapper.Map<OrderDto>(order)
            };

            return Ok(response.Order);
        }
    }
}