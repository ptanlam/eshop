using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;
using OrderingService.SharedKernel.Interfaces;

namespace OrderingService.API.Application.Commands
{
    public class GetCustomerByIdCommandHandler : IRequestHandler<GetCustomerByIdCommand, Customer>
    {
        private readonly IRepository<Customer> _repository;

        public GetCustomerByIdCommandHandler(IRepository<Customer> repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }
        
        public async Task<Customer> Handle(GetCustomerByIdCommand request, CancellationToken cancellationToken)
        {
            return await _repository.GetBySpecAsync(new CustomerByIdSpec(request.Id), cancellationToken);
        }
    }
}