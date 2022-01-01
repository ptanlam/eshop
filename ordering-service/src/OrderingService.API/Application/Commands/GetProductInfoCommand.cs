using MediatR;
using System;
using System.Runtime.Serialization;

namespace OrderingService.API.Application.Commands
{
    public class GetProductInfoCommand : IRequest<GetProductByIdResponse>
    {
        [DataMember]
        public Guid Id { get; private set; }

        public GetProductInfoCommand(Guid productId)
        {
            Id = productId;
        }
    }
}