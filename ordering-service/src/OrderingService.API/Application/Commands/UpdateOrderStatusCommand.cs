using MediatR;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class UpdateOrderStatusCommand : IRequest
    {
        [DataMember]
        public OrderStatus Status { get; private set; }

        [DataMember]
        public IEnumerable<Item> Items { get; private set; }

        [DataMember]
        public Guid OrderId { get; private set; }

        public UpdateOrderStatusCommand(OrderStatus status,
            IEnumerable<Item> items, Guid orderId)
        {
            Status = status;
            OrderId = orderId;
            Items = items;
        }
    }
}