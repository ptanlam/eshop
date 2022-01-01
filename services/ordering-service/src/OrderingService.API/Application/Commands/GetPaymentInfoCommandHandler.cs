using Grpc.Core;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class GetPaymentInfoCommandHandler :
        IRequestHandler<GetPaymentInfoCommand, GetReceiptForOrderResponse>
    {
        private readonly PaymentsService.PaymentsServiceClient _client;

        public GetPaymentInfoCommandHandler(PaymentsService.PaymentsServiceClient client)
        {
            _client = client ??
                throw new ArgumentNullException(nameof(client));
        }

        public async Task<GetReceiptForOrderResponse> Handle(
            GetPaymentInfoCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _client.GetReceiptByIdAsync(new GetReceiptForOrderRequest
                {
                    Id = request.Id.ToString()
                }, cancellationToken: cancellationToken);

                return response;
            }
            catch (RpcException)
            {
                return new GetReceiptForOrderResponse
                {
                    Amount = 0,
                    Currency = string.Empty,
                    Paid = false,
                    Type = string.Empty
                };
            }
        }
    }
}