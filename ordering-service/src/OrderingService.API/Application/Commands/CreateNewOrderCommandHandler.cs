using AutoMapper;
using MassTransit;
using MediatR;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Messaging.IntegrationEvents;
using OrderingService.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class CreateNewOrderCommandHandler :
        IRequestHandler<CreateNewOrderCommand, Order>
    {
        private readonly IRepository<Order> _repository;
        private readonly IBusControl _bus;
        private readonly IMapper _mapper;

        public CreateNewOrderCommandHandler(IRepository<Order> repository,
            IBusControl bus, IMapper mapper)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _bus = bus ??
                throw new ArgumentNullException(nameof(bus));

            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Order> Handle(
            CreateNewOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order(request.CustomerId, request.VendorId,
                request.Items, request.ShippingAddressId, request.Receipt.Id, request.Notes);

            order = await _repository.AddAsync(order, cancellationToken);

            await _bus.Publish<OrderCreatedIntegrationEvent>(new
            {
                request.CustomerEmail,
                Items = _mapper.Map<IEnumerable<ItemDto>>(order.Items),
                TotalPrice = request.Receipt.Amount,
                PriceUnit = request.Receipt.Currency,
            }, cancellationToken);

            return order;
        }
    }
}