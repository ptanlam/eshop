using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.ApiEndpoints;
using Ardalis.Specification;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;
using OrderingService.SharedKernel.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public class List : BaseAsyncEndpoint.WithRequest<ListOrderRequest>.WithResponse<ListOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Order> _orderRepository;

        public List(IMapper mapper, IMediator mediator,
            IRepository<Customer> customerRepository,
            IRepository<Order> orderRepository)
        {
            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));

            _mediator = mediator ??
                throw new ArgumentNullException(nameof(mediator));

            _customerRepository = customerRepository ??
                throw new ArgumentNullException(nameof(customerRepository));

            _orderRepository = orderRepository ??
                throw new ArgumentNullException(nameof(orderRepository));
        }

        [HttpGet(ListOrderRequest.Route)]
        [SwaggerOperation(
            Summary = "Gets order list",
            Description = "Gets order list of specific customer",
            OperationId = "Order.List",
            Tags = new[] { "OrderEndpoints" })]
        public override async Task<ActionResult<ListOrderResponse>> HandleAsync(
            [FromQuery] ListOrderRequest request, CancellationToken cancellationToken = default)
        {
            if (request.VendorId == null && request.Email == null ||
                request.VendorId != null && request.Email != null) return BadRequest();

            ISpecification<Order> spec = null;

            if (request.VendorId != null)
                spec = new OrdersForVendorSpec(request.VendorId);

            if (request.Email != null)
            {
                var customerIds = (await _customerRepository
                    .ListAsync(new CustomerByEmailSpec(request.Email), cancellationToken))
                    .Select(c => c.Id);
                
                if (!customerIds.Any()) return new ListOrderResponse()
                {
                    Data = new List<OrderDetailsShortenedDto>(),
                    Pagination = new { total = 0 },
                };

                spec = new OrdersForCustomerSpec(customerIds);
            }

            var (orders, total) = await _orderRepository.ListAndCountAsync(spec,
                request.Limit, request.Offset, cancellationToken);

            return Ok(new ListOrderResponse()
            {
                Data = await OrderEndpointMixins.GetVendorAndProductForOrders(orders, _mediator, _mapper),
                Pagination = new { total },
            });
        }

        
    }
}