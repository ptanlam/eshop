using System.Runtime.Serialization;
using MediatR;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Application.Commands
{
    public class GetShippingAddressByIdCommand : IRequest<ShippingAddress>
    {
        [DataMember]
        public int Id { get; private set; }

        public GetShippingAddressByIdCommand(int id)
        {
            Id = id;
        }
    }
}