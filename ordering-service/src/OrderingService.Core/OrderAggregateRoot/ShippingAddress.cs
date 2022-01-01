using Ardalis.GuardClauses;
using OrderingService.Core.CustomGuards;
using OrderingService.SharedKernel;
using System;

namespace OrderingService.Core.OrderAggregateRoot
{
    public class ShippingAddress : BaseEntity<int>
    {
        public string Country { get; private set; }
        public string City { get; private set; }
        public string District { get; private set; }
        public string Ward { get; private set; }
        public string Street { get; private set; }
        public string Details { get; private set; }
        public Guid CustomerId { get; private set; }

        public ShippingAddress()
        {
        }

        public ShippingAddress(Guid customerId, string country, string city, string district,
            string ward, string street, string details)
        {
            Country = Guard.Against.NullOrEmpty(country, nameof(country));
            City = Guard.Against.NullOrEmpty(city, nameof(city));
            District = Guard.Against.NullOrEmpty(district, nameof(district));
            Ward = Guard.Against.NullOrEmpty(ward, nameof(ward));
            Street = Guard.Against.NullOrEmpty(street, nameof(street));
            Details = Guard.Against.NullOrEmpty(details, nameof(details));
            CustomerId = Guard.Against.EmptyGuid(customerId, nameof(customerId));
        }
    }
}