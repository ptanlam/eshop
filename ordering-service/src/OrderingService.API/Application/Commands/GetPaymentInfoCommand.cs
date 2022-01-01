using System;
using MediatR;

namespace OrderingService.API.Application.Commands
{
    public class GetPaymentInfoCommand : IRequest<GetReceiptForOrderResponse>
    {
        public Guid Id { get; private set; }

        public GetPaymentInfoCommand(Guid id)
        {
            Id = id;
        }
    }
}