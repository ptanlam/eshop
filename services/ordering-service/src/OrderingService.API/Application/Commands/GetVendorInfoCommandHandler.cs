using Grpc.Core;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class GetVendorInfoCommandHandler :
        IRequestHandler<GetVendorInfoCommand, GetVendorInfoResponse>
    {
        private readonly VendorsService.VendorsServiceClient _client;

        public GetVendorInfoCommandHandler(VendorsService.VendorsServiceClient client)
        {
            _client = client ??
                throw new ArgumentNullException(nameof(client));
        }

        public async Task<GetVendorInfoResponse> Handle(
            GetVendorInfoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _client.GetNameAndLogoUrlAsync(new GetVendorInfoRequest
                {
                    Id = request.VendorId.ToString()
                }, cancellationToken: cancellationToken);

                return response;
            }
            catch (RpcException)
            {
                // TODO: log exception

                return new GetVendorInfoResponse
                {
                    Id = request.VendorId.ToString(),
                    LogoUrl = "",
                    Name = ""
                };
            }
        }
    }
}