using AutoMapper;
using MassTransit;
using MediatR;
using OrderingService.API.Models;
using OrderingService.Messaging.IntegrationEvents;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class UpdateOrderStatusCommandHandler :
        IRequestHandler<UpdateOrderStatusCommand>
    {
        private readonly IBusControl _bus;
        private readonly IMapper _mapper;

        public UpdateOrderStatusCommandHandler(IBusControl bus, IMapper mapper)
        {
            _bus = bus ?? throw new ArgumentNullException(nameof(bus));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Unit> Handle(
            UpdateOrderStatusCommand request, CancellationToken cancellationToken)
        {
            await _bus.Publish<OrderApprovedIntegrationEvent>(new
            {
                Items = _mapper.Map<IEnumerable<ItemForOrderApprovedIntegrationEventDto>>(request.Items),
                request.OrderId
            }, cancellationToken);

            return Unit.Value;
        }
    }
}