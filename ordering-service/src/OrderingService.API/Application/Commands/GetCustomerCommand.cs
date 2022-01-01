using MediatR;
using System.Runtime.Serialization;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.API.Application.Commands
{
    public class GetCustomerCommand : IRequest<Customer>
    {
        [DataMember]
        public string Email { get; private set; }

        [DataMember]
        public string PhoneNumber { get; private set; }

        [DataMember]
        public string Fullname { get; private set; }

        public GetCustomerCommand(string email, string phoneNumber, string fullname)
        {
            Email = email;
            PhoneNumber = phoneNumber;
            Fullname = fullname;
        }
    }
}