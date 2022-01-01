using FluentAssertions;
using OrderingService.Core.OrderAggregateRoot;
using System;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class ShippingAddressUnitTests
    {
        [Fact]
        public void Creation_ShouldReturnExpectedAddress()
        {
            var country = "Vietnam";
            var city = "Ho Chi Minh";
            var district = "Quan 10";
            var ward = "Phuong 15";
            var street = "Su Van Hanh";
            var address = "HUFLIT";

            var addess = new ShippingAddress(Guid.NewGuid(), country, city, district, ward,
                street, address);

            addess.Country.Should().Be(country);
            addess.City.Should().Be(city);
            addess.District.Should().Be(district);
            addess.Ward.Should().Be(ward);
            addess.Street.Should().Be(street);
            addess.Details.Should().Be(address);
        }

        [InlineData("", "Ho Chi Minh", "Quan 10", "Phuong 15", "Su Van Hanh", "HUFLIT", "country")]
        [InlineData("Vietnam", "", "Quan 10", "Phuong 15", "Su Van Hanh", "HUFLIT", "city")]
        [InlineData("Vietnam", "Ho Chi Minh", "", "Phuong 15", "Su Van Hanh", "HUFLIT", "district")]
        [InlineData("Vietnam", "Ho Chi Minh", "Quan 10", "", "Su Van Hanh", "HUFLIT", "ward")]
        [InlineData("Vietnam", "Ho Chi Minh", "Quan 10", "Phuong 15", "", "HUFLIT", "street")]
        [InlineData("Vietnam", "Ho Chi Minh", "Quan 10", "Phuong 15", "Su Van Hanh", "", "details")]
        [Theory]
        public void Creation_InvalidParameters_ShouldThrowArgumentException(
            string country, string city, string district, string ward,
            string street, string details, string paramName)
        {
            Action act = () =>
            {
                var _ = new ShippingAddress(Guid.NewGuid(), country,
                    city, district, ward, street, details);
            };

            act.Should().Throw<ArgumentException>()
                .WithParameterName(paramName);
        }
    }
}