using FluentAssertions;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Collections.Generic;
using Xunit;

namespace OrderingService.UnitTests.Commands
{
    public class CommandUnitTests
    {
        [Fact]
        public void CreateNewOrder_ShouldCreateNewCommand()
        {
            var items = new List<Item>();
            var vendorId = Guid.NewGuid();
            var customerId = Guid.NewGuid();
            var customerEmail = "customer@gmail.com";
            var shippingAddressId = 1;
            var receiptDto = new ReceiptDto()
            {
                Id = Guid.NewGuid(),
                Amount = 10_000_000,
                Currency = "VND"
            };
            var notes = "notes";

            var command = new CreateNewOrderCommand(items, customerId,
                customerEmail, vendorId, shippingAddressId, receiptDto, notes);

            command.Items.Should().BeSameAs(items);
            command.VendorId.Should().Be(vendorId);
            command.CustomerEmail.Should().Be(customerEmail);
            command.ShippingAddressId.Should().Be(shippingAddressId);
            command.Receipt.Should().Be(receiptDto);
            command.Notes.Should().Be(notes);
        }

        [Fact]
        public void GetCustomerById_ShouldCreateNewCommand()
        {
            var id = Guid.NewGuid();

            var command = new GetCustomerByIdCommand(id);

            command.Id.Should().Be(id);
        }

        [Fact]
        public void GetCustomerCommand_ShouldCreateNewCommand()
        {
            var email = "customer@gmail.com";
            var phoneNumber = "0909123894";
            var fullName = "Full Name";

            var command = new GetCustomerCommand(email, phoneNumber, fullName);

            command.Email.Should().Be(email);
            command.PhoneNumber.Should().Be(phoneNumber);
            command.Fullname.Should().Be(fullName);
        }

        [Fact]
        public void GetPaymentInfoCommand_ShouldCreateNewCommand()
        {
            var id = Guid.NewGuid();

            var command = new GetPaymentInfoCommand(id);

            command.Id.Should().Be(id);
        }

        [Fact]
        public void GetProductInfoCommand_ShouldCreateNewCommand()
        {
            var id = Guid.NewGuid();

            var command = new GetProductInfoCommand(id);

            command.Id.Should().Be(id);
        }

        [Fact]
        public void GetShippingAddressByIdCommand_ShouldCreateNewCommand()
        {
            var id = 1;

            var command = new GetShippingAddressByIdCommand(id);

            command.Id.Should().Be(id);
        }

        [Fact]
        public void GetShippingAddressForCustomerCommand_ShouldCreateNewCommand()
        {
            var cusotmerId = Guid.NewGuid();
            var shippingAddress = new ShippingAddressForCreationDto()
            {
                City = "City",
                Country = "Country",
                Details = "details",
                District = "district",
                Street = "street",
                Ward = "ward"
            };

            var command = new GetShippingAddressForCustomerCommand(cusotmerId, shippingAddress);

            command.CustomerId.Should().Be(cusotmerId);
            command.ShippingAddress.Should().Be(shippingAddress);
        }

        [Fact]
        public void GetVendorInfoCommand_ShouldCreateNewCommand()
        {
            var vendorId = Guid.NewGuid();

            var command = new GetVendorInfoCommand(vendorId);

            command.VendorId.Should().Be(vendorId);
        }

        [Fact]
        public void UpdateOrderStatusCommand_ShouldCreateNewCommand()
        {
            var orderStatus = OrderStatus.Approved;
            var orderId = Guid.NewGuid();
            var items = new List<Item>();

            var command = new UpdateOrderStatusCommand(orderStatus, items, orderId);

            command.OrderId.Should().Be(orderId);
            command.Status.Should().Be(orderStatus);
            command.Items.Should().BeEquivalentTo(items);
        }
    }
}