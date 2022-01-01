using MediatR;
using OrderingService.SharedKernel.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;

namespace OrderingService.API.Application.Commands
{
    public class GetCustomerCommandHandler :
        IRequestHandler<GetCustomerCommand, Customer>
    {
        private readonly IRepository<Customer> _repository;

        public GetCustomerCommandHandler(IRepository<Customer> repository)
        {
            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));
        }

        public async Task<Customer> Handle(
            GetCustomerCommand request, CancellationToken cancellationToken)
        {
            var spec = new CustomerByEmailAndPhoneNumberSpec(request.Email, request.PhoneNumber);
            var customer = await _repository.GetBySpecAsync(spec, cancellationToken);

            if (customer != null) return customer;

            customer = new Customer(request.Fullname, request.PhoneNumber, request.Email);
            await _repository.AddAsync(customer, cancellationToken);

            return customer;
        }
    }
}