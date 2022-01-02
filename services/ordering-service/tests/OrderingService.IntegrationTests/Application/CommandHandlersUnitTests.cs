using AutoMapper;
using FluentAssertions;
using MassTransit;
using Moq;
using OrderingService.API.Application.Commands;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.ValueObjects;
using OrderingService.Messaging.IntegrationEvents;
using OrderingService.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Ardalis.Specification;
using Grpc.Core;
using OrderingService.API;
using OrderingService.API.Endpoints.OrderEndpoints;
using OrderingService.API.Models;
using OrderingService.Core.Enums;
using OrderingService.Core.SyncedAggregates;
using OrderingService.Core.SyncedAggregates.Specifications;
using Xunit;

namespace OrderingService.IntegrationTests.Application
{
    public class CommandHandlersUnitTests
    {
        private readonly Mock<IRepository<Order>> _mockOrderRepository;
        private readonly Mock<IRepository<Customer>> _mockCustomerRepostory;
        private readonly Mock<PaymentsService.PaymentsServiceClient> _mockPaymentsServiceClient;
        private readonly Mock<IBusControl> _mockBusControl;
        private readonly Mock<IMapper> _mockMapper;

        private readonly IEnumerable<Item> _items = new List<Item>()
        {
            new(Guid.NewGuid(), new Money(13_000_000, "VND"), 10),
            new(Guid.NewGuid(), new Money(10_000_000, "VND"), 23),
            new(Guid.NewGuid(), new Money(25_000_000, "VND"), 5)
        };

        public CommandHandlersUnitTests()
        {
            _mockOrderRepository = new Mock<IRepository<Order>>();
            _mockCustomerRepostory = new Mock<IRepository<Customer>>();
            _mockPaymentsServiceClient = new Mock<PaymentsService.PaymentsServiceClient>();
            _mockBusControl = new Mock<IBusControl>();
            _mockMapper = new Mock<IMapper>();
        }

        [Fact]
        public async Task CreateNewOrder_ShouldReturnExpectedOrder()
        {
            var request = new CreateNewOrderCommand(_items, Guid.NewGuid(),
                "example@gmail.com", Guid.NewGuid(), 1, new ReceiptDto
                {
                    Amount = 12_000_000,
                    Currency = "VND",
                    Id = Guid.NewGuid()
                }, "notes");

            var order = new Order(Guid.NewGuid(), Guid.NewGuid(), _items, 1, Guid.NewGuid());

            _mockOrderRepository.Setup(x => x.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(order);

            _mockBusControl.Setup(x =>
                x.Publish<OrderCreatedIntegrationEvent>(It.IsAny<object>(), It.IsAny<CancellationToken>()));

            var handler = new CreateNewOrderCommandHandler(_mockOrderRepository.Object, _mockBusControl.Object,
                _mockMapper.Object);

            var response = await handler.Handle(request, default);

            response.Should().Be(order);
            _mockOrderRepository.Verify(x => x.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()));
            _mockBusControl.Verify(x =>
                x.Publish<OrderCreatedIntegrationEvent>(It.IsAny<object>(), It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task GetCustomerById_ShouldReturnExpectedOrder()
        {
            var customerId = Guid.NewGuid();
            var request = new GetCustomerByIdCommand(customerId);
            var customer = new Customer("Full Name", "01823834289", "customer@gmail.com");

            _mockCustomerRepostory.Setup(x =>
                    x.GetBySpecAsync(It.IsAny<CustomerByIdSpec>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(customer);

            var handler = new GetCustomerByIdCommandHandler(_mockCustomerRepostory.Object);

            var response = await handler.Handle(request, default);

            response.Should().Be(customer);
            _mockCustomerRepostory.Verify(x =>
                x.GetBySpecAsync(It.IsAny<CustomerByIdSpec>(), It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task GetCustomer_ShouldReturnExpectedCustomer()
        {
            var customer = new Customer("Full Name", "0123124564545", "customer@gmail.com");
            var request = new GetCustomerCommand(customer.Email, customer.PhoneNumber, customer.FullName);

            _mockCustomerRepostory
                .Setup(x => x.GetBySpecAsync(It.IsAny<CustomerByEmailAndPhoneNumberSpec>(),
                    It.IsAny<CancellationToken>())).ReturnsAsync(customer);

            var handler = new GetCustomerCommandHandler(_mockCustomerRepostory.Object);

            var response = await handler.Handle(request, default);

            response.Should().Be(customer);
            _mockCustomerRepostory.Verify(x =>
                x.GetBySpecAsync(It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task GetCustomer_InExistentCustomer_ShouldReturnAddedCustomer()
        {
            var customer = new Customer("Full Name", "0123124564545", "customer@gmail.com");
            var request = new GetCustomerCommand(customer.Email, customer.PhoneNumber, customer.FullName);

            _mockCustomerRepostory
                .Setup(x => x.GetBySpecAsync(It.IsAny<CustomerByEmailAndPhoneNumberSpec>(),
                    It.IsAny<CancellationToken>())).ReturnsAsync((Customer) null);

            _mockCustomerRepostory.Setup(x => x.AddAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(customer);

            var handler = new GetCustomerCommandHandler(_mockCustomerRepostory.Object);

            var response = await handler.Handle(request, default);

            response.Email.Should().Be(customer.Email);
            response.FullName.Should().Be(customer.FullName);
            response.PhoneNumber.Should().Be(customer.PhoneNumber);
            _mockCustomerRepostory.Verify(x =>
                x.GetBySpecAsync(It.IsAny<CustomerByEmailAndPhoneNumberSpec>(), It.IsAny<CancellationToken>()));
            _mockCustomerRepostory.Verify(x => x.AddAsync(It.IsAny<Customer>(), It.IsAny<CancellationToken>()));
        }
    }
}