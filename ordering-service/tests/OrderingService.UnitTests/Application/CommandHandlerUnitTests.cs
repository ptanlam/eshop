using AutoMapper;
using FluentAssertions;
using Grpc.Core;
using MassTransit;
using Moq;
using OrderingService.API;
using OrderingService.API.Application.Commands;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;
using OrderingService.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.UnitTests.Application
{
    public class CommandHandlerUnitTests
    {
        private readonly Mock<IRepository<Order>> _mockOrderRepository;
        private readonly Mock<IRepository<Customer>> _mockCustomerRepository;
        private readonly Mock<IBusControl> _mockBus;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<PaymentsService.PaymentsServiceClient> _mockPaymentServiceClient;
        private readonly Mock<ProductsService.ProductsServiceClient> _mockProductServiceClient;

        public CommandHandlerUnitTests()
        {
            _mockOrderRepository = new Mock<IRepository<Order>>();
            _mockCustomerRepository = new Mock<IRepository<Customer>>();
            _mockBus = new Mock<IBusControl>();
            _mockMapper = new Mock<IMapper>();
            _mockPaymentServiceClient = new Mock<PaymentsService.PaymentsServiceClient>();
            _mockProductServiceClient = new Mock<ProductsService.ProductsServiceClient>();

            _mockBus.Setup(x => x.Publish(It.IsAny<object>(), default))
                .Returns(Task.CompletedTask);
        }

        [Fact]
        public async Task CreateNewOrderCommandHandler_ShouldReturnOrder()
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

            var order = new Order(customerId, vendorId, items, shippingAddressId, receiptDto.Id, notes);
            var itemDtoList = new List<ItemDto>();

            _mockOrderRepository.Setup(x => x.AddAsync(It.IsAny<Order>(), default))
                .ReturnsAsync(order);
            _mockMapper.Setup(x => x.Map<IEnumerable<ItemDto>>(It.IsAny<IEnumerable<Item>>()))
                .Returns(itemDtoList);

            var handler = new CreateNewOrderCommandHandler(
                _mockOrderRepository.Object, _mockBus.Object, _mockMapper.Object);

            var result = await handler.Handle(command, default);

            result.Should().Be(order);
            _mockOrderRepository.Verify(x => x.AddAsync(It.IsAny<Order>(), default));
            _mockMapper.Verify(x => x.Map<IEnumerable<ItemDto>>(It.IsAny<IEnumerable<Item>>()));
        }

        [Fact]
        public async Task GetCustomerByIdCommandHandler_ShouldReturnExpectedCustomer()
        {
            var id = Guid.NewGuid();

            var command = new GetCustomerByIdCommand(id);

            var customer = new Customer("Full Name",
                "09095318643", "customer@gmail.com");

            _mockCustomerRepository.Setup(x => x.GetBySpecAsync(It.IsAny<CustomerByIdSpec>(), default))
                .ReturnsAsync(customer);

            var handler = new GetCustomerByIdCommandHandler(_mockCustomerRepository.Object);

            var result = await handler.Handle(command, default);

            result.Should().Be(customer);
            _mockCustomerRepository.Verify(x => x.GetBySpecAsync(It.IsAny<CustomerByIdSpec>(), default));
        }

        [Fact]
        public async Task GetCustomerCommandHandler_ExistingCustomer_ShouldNotCallAddAsync()
        {
            var email = "customer@gmail.com";
            var phoneNumber = "0909123894";
            var fullName = "Full Name";
            var customer = new Customer(fullName, phoneNumber, email);

            var command = new GetCustomerCommand(email, phoneNumber, fullName);

            _mockCustomerRepository.Setup(x => x.GetBySpecAsync(
                It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), default))
                .ReturnsAsync(customer);

            _mockCustomerRepository.Setup(x => x.AddAsync(It.IsAny<Customer>(), default))
                .ReturnsAsync(customer);

            var handler = new GetCustomerCommandHandler(_mockCustomerRepository.Object);

            var result = await handler.Handle(command, default);

            result.Should().Be(customer);
            _mockCustomerRepository.Verify(x => x.GetBySpecAsync(
                It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), default));
            _mockCustomerRepository.Verify(
                x => x.AddAsync(It.IsAny<Customer>(), default),
                Times.Never);
        }

        [Fact]
        public async Task GetCustomerCommandHandler_ShouldAddCustomerReturnExpectedCustomer()
        {
            var email = "customer@gmail.com";
            var phoneNumber = "0909123894";
            var fullName = "Full Name";
            Customer customer = null;
            var expectedCustomer = new Customer(fullName, phoneNumber, email);

            var command = new GetCustomerCommand(email, phoneNumber, fullName);

            _mockCustomerRepository.Setup(x => x.GetBySpecAsync(
                It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), default))
                .ReturnsAsync(customer);

            _mockCustomerRepository.Setup(x => x.AddAsync(It.IsAny<Customer>(), default))
                .ReturnsAsync(expectedCustomer);

            var handler = new GetCustomerCommandHandler(_mockCustomerRepository.Object);

            var result = await handler.Handle(command, default);

            result.Id.Should().Be(expectedCustomer.Id);
            result.Email.Should().Be(email);
            result.PhoneNumber.Should().Be(phoneNumber);
            result.FullName.Should().Be(fullName);
            _mockCustomerRepository.Verify(x => x.GetBySpecAsync(
                It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), default));
            _mockCustomerRepository.Verify(x => x.AddAsync(It.IsAny<Customer>(), default));
        }

        [Fact]
        public async Task GetPaymentInfoCommandHandler_ShouldReturnExpectedReceipt()
        {
            var command = new GetPaymentInfoCommand(Guid.NewGuid());

            var receipt = new GetReceiptForOrderResponse()
            {
                Amount = 10_000_000,
                Currency = "VND",
                Paid = false,
                Type = "stripe"
            };

            var response = new AsyncUnaryCall<GetReceiptForOrderResponse>(
                Task.FromResult(receipt), null, null, null, null);

            _mockPaymentServiceClient.Setup(x => x.GetReceiptByIdAsync(
                It.IsAny<GetReceiptForOrderRequest>(), null, null, default))
                .Returns(response);

            var handler = new GetPaymentInfoCommandHandler(_mockPaymentServiceClient.Object);

            var result = await handler.Handle(command, default);

            _mockPaymentServiceClient.Verify(x => x.GetReceiptByIdAsync(
                It.IsAny<GetReceiptForOrderRequest>(), null, null, default));
        }

        [Fact]
        public async Task GetPaymentInfoCommandHandler_ErrorHappens_ShouldReturnExpectedReceipt()
        {
            var command = new GetPaymentInfoCommand(Guid.NewGuid());

            var receipt = new GetReceiptForOrderResponse()
            {
                Amount = 10_000_000,
                Currency = "VND",
                Paid = false,
                Type = "stripe"
            };

            var response = new AsyncUnaryCall<GetReceiptForOrderResponse>(
                Task.FromResult(receipt), null, null, null, null);

            _mockPaymentServiceClient.Setup(x => x.GetReceiptByIdAsync(
                It.IsAny<GetReceiptForOrderRequest>(), null, null, default))
                .Throws(new RpcException(Status.DefaultCancelled));

            var handler = new GetPaymentInfoCommandHandler(_mockPaymentServiceClient.Object);

            var result = await handler.Handle(command, default);

            result.Amount.Should().Be(0);
            result.Currency.Should().Be(string.Empty);
            result.Paid.Should().BeFalse();
            result.Type.Should().Be(string.Empty);

            _mockPaymentServiceClient.Verify(x => x.GetReceiptByIdAsync(
                It.IsAny<GetReceiptForOrderRequest>(), null, null, default));
        }

        [Fact]
        public async Task GetProductInfoCommandHandler_ShouldReturnExpectedProductInfo()
        {
            var command = new GetProductInfoCommand(Guid.NewGuid());

            var productInfo = new GetProductByIdResponse()
            {
                Id = Guid.NewGuid().ToString(),
                ImageUrl = "someimageurl",
                Name = "some name",
            };

            var response = new AsyncUnaryCall<GetProductByIdResponse>(
                Task.FromResult(productInfo), null, null, null, null);

            _mockProductServiceClient.Setup(x => x.GetProductByIdAsync(
                It.IsAny<GetProductByIdRequest>(), null, null, default))
                .Returns(response);

            var handler = new GetProductInfoCommandHandler(_mockProductServiceClient.Object);

            var result = await handler.Handle(command, default);

            result.Should().Be(productInfo);
            _mockProductServiceClient.Verify(x => x.GetProductByIdAsync(
                It.IsAny<GetProductByIdRequest>(), null, null, default));
        }
    }
}