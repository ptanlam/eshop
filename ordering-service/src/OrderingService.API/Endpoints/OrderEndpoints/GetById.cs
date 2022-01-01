using System;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.ApiEndpoints;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class GetById : BaseAsyncEndpoint.WithRequest<GetOrderByIdRequest>.WithResponse<GetOrderByIdResponse>
    {
        private readonly IRepository<Order> _repository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public GetById(IRepository<Order> repository, 
            IMapper mapper, IMediator mediator)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
            
            _mediator = mediator??
                throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet(GetOrderByIdRequest.Route, Name = GetOrderByIdRequest.Name)]
        [SwaggerOperation(
           Summary = "Gets order",
           Description = "Gets order of specific customer",
           OperationId = "Order.GetById",
           Tags = new[] { "OrderEndpoints" })]

        public override async Task<ActionResult<GetOrderByIdResponse>> HandleAsync(
            [FromQuery] GetOrderByIdRequest request, CancellationToken cancellationToken = default)
        {
            var order = await _repository.GetBySpecAsync(
                new OrderDetailsByIdSpec(request.Id), cancellationToken);
            if (order == null) return NotFound();

            var response = new GetOrderByIdResponse()
            {
                Order = await OrderEndpointMixins
                    .GetVendorAndProductForOrderDetails(order, _mediator, _mapper),
            };
            
            return Ok(response.Order);
        }
    }
}