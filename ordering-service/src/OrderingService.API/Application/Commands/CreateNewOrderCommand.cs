using MediatR;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace OrderingService.API.Application.Commands
{
    public class CreateNewOrderCommand : IRequest<Order>
    {
        [DataMember]
        public IEnumerable<Item> Items { get; private set; }

        [DataMember]
        public Guid VendorId { get; private set; }

        [DataMember]
        public Guid CustomerId { get; private set; }

        [DataMember]
        public string CustomerEmail { get; private set; }

        [DataMember]
        public int ShippingAddressId { get; private set; }

        [DataMember]
        public ReceiptDto Receipt { get; private set; }

        [DataMember]
        public string Notes { get; private set; }

        public CreateNewOrderCommand(IEnumerable<Item> items, Guid customerId, string customerEmail,
            Guid vendorId, int shippingAddressId, ReceiptDto receipt, string notes)
        {
            Items = items;
            VendorId = vendorId;
            CustomerId = customerId;
            CustomerEmail = customerEmail;
            ShippingAddressId = shippingAddressId;
            Receipt = receipt;
            Notes = notes;
        }
    }
}