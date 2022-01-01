using System;
using System.Runtime.Serialization;
using MediatR;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.API.Application.Commands
{
    public class GetCustomerByIdCommand : IRequest<Customer>
    {
        [DataMember]
        public Guid Id { get; private set; }

        public GetCustomerByIdCommand(Guid id)
        {
            Id = id;
        }
    }
}