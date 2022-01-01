using Grpc.Core;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class GetProductInfoCommandHandler :
        IRequestHandler<GetProductInfoCommand, GetProductByIdResponse>
    {
        private readonly ProductsService.ProductsServiceClient _client;

        public GetProductInfoCommandHandler(ProductsService.ProductsServiceClient client)
        {
            _client = client ??
                throw new ArgumentNullException(nameof(client));
        }

        public async Task<GetProductByIdResponse> Handle(
            GetProductInfoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _client.GetProductByIdAsync(new GetProductByIdRequest
                {
                    Id = request.Id.ToString()
                }, cancellationToken: cancellationToken);

                return response;
            }
            catch (RpcException)
            {
                return new GetProductByIdResponse
                {
                    Id = Guid.Empty.ToString(),
                    ImageUrl = string.Empty,
                    Name = string.Empty,
                };
            }
        }
    }
}