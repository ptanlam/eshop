using MediatR;
using System;
using System.Runtime.Serialization;

namespace OrderingService.API.Application.Commands
{
    public class GetVendorInfoCommand : IRequest<GetVendorInfoResponse>
    {
        [DataMember]
        public Guid VendorId { get; private set; }

        public GetVendorInfoCommand(Guid vendorId)
        {
            VendorId = vendorId;
        }
    }
}