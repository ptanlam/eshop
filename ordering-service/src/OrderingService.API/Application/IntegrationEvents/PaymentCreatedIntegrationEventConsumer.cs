using AutoMapper;
using MassTransit;
using MediatR;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OrderingService.Messaging.IntegrationEvents
{
    public class PaymentCreatedIntegrationEventConsumer :
        IConsumer<PaymentCreatedIntegrationEvent>
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public PaymentCreatedIntegrationEventConsumer(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));

            _mediator = mediator ??
                throw new ArgumentNullException(nameof(mediator));
        }

        public async Task Consume(ConsumeContext<PaymentCreatedIntegrationEvent> context)
        {
            // TODO: save orders to database

            var receipt = context.Message.Receipt;

            foreach (var creationDto in context.Message.Orders)
            {
                await SaveOrder(creationDto, receipt);
            }
        }

        private async Task SaveOrder(OrderForCreationDto creationDto, ReceiptDto receipt)
        {
            var customer = await _mediator.Send(new GetCustomerCommand(
                    creationDto.Customer.Email, creationDto.Customer.PhoneNumber,
                    creationDto.Customer.FullName));

            var shippingAddress = await _mediator.Send(new GetShippingAddressForCustomerCommand(
                customer.Id, creationDto.ShippingAddress));

            var items = _mapper.Map<IEnumerable<Item>>(creationDto.Items);
            await _mediator.Send(new CreateNewOrderCommand(
                items, customer.Id, customer.Email, creationDto.VendorId, shippingAddress.Id,
                receipt, creationDto.Notes));
        }
    }
}