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

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public class Remove : BaseAsyncEndpoint
        .WithRequest<RemoveItemInOrderRequest>
        .WithResponse<RemoveItemInOrderResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public Remove(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
        }

        [HttpDelete(RemoveItemInOrderRequest.Route)]
        [SwaggerOperation(
          Summary = "Removes item in existing order",
          Description = "Removes item in existing order",
          OperationId = "Item.Remove",
          Tags = new[] { "ItemEndpoints" })]
        public override async Task<ActionResult<RemoveItemInOrderResponse>> HandleAsync(
            [FromRoute] RemoveItemInOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.OrderId), cancellationToken);
            if (order == null) return NotFound();

            var item = order.Items.FirstOrDefault(i => i.Id == request.ItemId);
            if (item == null) return NotFound();

            order.RemoveItem(item);
            await _repository.UpdateAsync(order, cancellationToken);

            return Ok(new RemoveItemInOrderResponse()
            {
                Order = _mapper.Map<OrderDto>(order)
            });
        }
    }
}