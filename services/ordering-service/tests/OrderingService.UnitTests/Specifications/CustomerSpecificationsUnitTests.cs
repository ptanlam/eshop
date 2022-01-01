using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;
using Xunit;

namespace OrderingService.UnitTests.Specifications
{
    public class CustomerSpecificationsUnitTests
    {
        private readonly List<Customer> _customers = new()
        {
            new Customer("Full Name",
                "646843218184", "example@gmail.com"),
            new Customer("Full Name",
                "6846841654981", "example@gmail.com"),
            new Customer("Some Name",
                "189135417648", "example1@gmail.com"),
            new Customer("Some Another Name",
                "8769413216884", "example2@gmail.com"),
        };

        [Fact]
        public void CustomerByEmailSpec_ShouldReturnExpectedCustomers()
        {
            var expectedCustomer = _customers.First();
            var spec = new CustomerByEmailSpec(expectedCustomer.Email);

            var customers = _customers.Where(spec.WhereExpressions.First().Compile());

            customers.Count().Should().Be(2);
        }

        [Fact]
        public void CustomerByEmailSpec_InExistingEmail_ShouldReturnEmpty()
        {
            var spec = new CustomerByEmailSpec("some-email@gmail.com");

            var customers = _customers.Where(spec.WhereExpressions.First().Compile());

            customers.Count().Should().Be(0);
        }

        [Fact]
        public void CustomerByEmailAndPhoneNumberSpec_ShouldReturnExpectedCustomer()
        {
            var expectedCustomer = _customers.First();
            var spec = new CustomerByEmailAndPhoneNumberSpec(
                expectedCustomer.Email, expectedCustomer.PhoneNumber);

            var customer = _customers.Where(spec.WhereExpressions.First().Compile()).FirstOrDefault();

            customer.Should().Be(expectedCustomer);
        }

        [Fact]
        public void CustomerByEmailAndPhoneNumberSpec_InExistingCustomer_ShouldReturnNull()
        {
            var spec = new CustomerByEmailAndPhoneNumberSpec(
                "some-email@gmail.com", "5181984354681");

            var customer = _customers.Where(spec.WhereExpressions.First().Compile()).FirstOrDefault();

            customer.Should().BeNull();
        }

        [Fact]
        public void CustomerByIdSpec_ReturnExpectedCustomer()
        {
            var spec = new CustomerByIdSpec(_customers.First().Id);

            var customer = _customers
                .Where(spec.WhereExpressions.First().Compile())
                .FirstOrDefault();

            customer.Should().NotBeNull();
        }
        
        [Fact]
        public void CustomerByIdSpec_InExistingCustomer_ReturnNull()
        {
            var spec = new CustomerByIdSpec(Guid.NewGuid());

            var customer = _customers
                .Where(spec.WhereExpressions.First().Compile())
                .FirstOrDefault();

            customer.Should().BeNull();
        }
    }
}