using MediatR;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Runtime.Serialization;

namespace OrderingService.API.Application.Commands
{
    public class GetShippingAddressForCustomerCommand : IRequest<ShippingAddress>
    {
        [DataMember]
        public Guid CustomerId { get; init; }

        [DataMember]
        public ShippingAddressForCreationDto ShippingAddress { get; init; }

        public GetShippingAddressForCustomerCommand(Guid customerId, ShippingAddressForCreationDto shippingAddress)
        {
            ShippingAddress = shippingAddress;
            CustomerId = customerId;
        }
    }
}