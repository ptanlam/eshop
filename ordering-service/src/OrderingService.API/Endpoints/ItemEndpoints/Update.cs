using Ardalis.ApiEndpoints;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OrderingService.API.Models;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public class Update : BaseAsyncEndpoint
        .WithRequest<UpdateItemInOrderRequest>
        .WithResponse<UpdateItemInOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Order> _repository;

        public Update(IMapper mapper, IRepository<Order> repository)
        {
            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));

            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));
        }

        [HttpPatch(UpdateItemInOrderRequest.Route)]
        [SwaggerOperation(
           Summary = "Updates item in existing order",
           Description = "Updates item in existing order (quantity)",
           OperationId = "Item.Update",
           Tags = new[] { "ItemEndpoints" })]
        public override async Task<ActionResult<UpdateItemInOrderResponse>> HandleAsync(
            [FromQuery] UpdateItemInOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.OrderId), cancellationToken);
            if (order == null) return NotFound();

            var itemIndex = order.Items.ToList().FindIndex(item => item.Id == request.ItemId);
            if (itemIndex == -1) return NotFound();

            // parse operator from request body to enum
            var success = Enum.TryParse(typeof(ManipulationOperator),
                request.Item.Operator, out var @operator);
            if (!success) return BadRequest();

            // try manipulate item quantity
            success = order.Items.ElementAt(itemIndex).TryManipulateQuantity(request.Item.Quantity,
                    (ManipulationOperator) @operator!);
            if (!success) return BadRequest();

            await _repository.UpdateAsync(order, cancellationToken);

            var response = new UpdateItemInOrderResponse()
            {
                Order = _mapper.Map<OrderDto>(order)
            };
            
            return Ok(response.Order);
        }
    }
}