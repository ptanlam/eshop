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

namespace OrderingService.API.Endpoints.ItemEndpoints
{
    public class Add : BaseAsyncEndpoint
        .WithRequest<AddItemToOrderRequest>
        .WithResponse<AddItemToOrderResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;

        public Add(IRepository<Order> repository, IMapper mapper)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper)); ;
        }

        [HttpPost(AddItemToOrderRequest.Route)]
        [SwaggerOperation(
           Summary = "Adds item to existing order",
           Description = "Adds item to existing order",
           OperationId = "Item.Add",
           Tags = new[] { "ItemEndpoints" })]
        public override async Task<ActionResult<AddItemToOrderResponse>> HandleAsync(
            [FromQuery] AddItemToOrderRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.OrderId), cancellationToken);
            if (order == null) return NotFound();

            var item = _mapper.Map<Item>(request.Item);

            order.AddItem(item);
            await _repository.UpdateAsync(order, cancellationToken);

            var response = new AddItemToOrderResponse()
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