using FluentAssertions;
using System;
using OrderingService.Core.SyncedAggregates;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class CustomerAggregateRootUnitTests
    {
        [Fact]
        public void Creation_ShouldReturnExpectedCustomer()
        {
            var fullname = "Full Name";
            var phoneNumber = "09093457878";
            var email = "example@gmail.com";

            var customer = new Customer(fullname, phoneNumber, email);

            customer.FullName.Should().Be(fullname);
            customer.PhoneNumber.Should().Be(phoneNumber);
            customer.Email.Should().Be(email);
        }

        [InlineData("", "09093457878", "example@gmail.com", "fullname")]
        [Theory]
        public void Creation_InvalidParameters_ShouldThrowArgumentException(
            string fullname, string phoneNumber, string email, string paramName)
        {
            Action act = () =>
            {
                var _ = new Customer(fullname, phoneNumber, email);
            };

            act.Should().Throw<ArgumentException>()
                .WithParameterName(paramName);
        }
    }
}