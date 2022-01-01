using System;
using Ardalis.GuardClauses;
using OrderingService.SharedKernel;
using OrderingService.SharedKernel.Interfaces;

namespace OrderingService.Core.SyncedAggregates
{
    public class Customer : BaseEntity<Guid>, IAggregateRoot
    {
        public string FullName { get; private set; }
        public string PhoneNumber { get; private set; }
        public string Email { get; private set; }

        public Customer()
        {
        }

        public Customer(string fullname, string phoneNumber, string email)
        {
            //Id = Guard.Against.EmptyGuid(id, nameof(id));
            FullName = Guard.Against.NullOrEmpty(fullname, nameof(fullname));
            PhoneNumber = phoneNumber;
            Email = email;
        }
    }
}