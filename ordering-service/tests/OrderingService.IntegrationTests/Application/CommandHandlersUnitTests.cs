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
using Xunit;

namespace OrderingService.IntegrationTests.Application
{
    public class CommandHandlersUnitTests
    {
        private readonly Mock<IRepository<Order>> _mockOrderRepository;
        private readonly Mock<IBusControl> _mockBusControl;
        private readonly Mock<IMapper> _mockMapper;

        private readonly IEnumerable<Item> _items = new List<Item>()
        {
            new(Guid.NewGuid(), new Money(13_000_000, "VND"), 10),
            new(Guid.NewGuid(), new Money(10_000_000, "VND"), 23),
            new(Guid.NewGuid(), new Money(25_000_000, "VND"), 5),
        };

        public CommandHandlersUnitTests()
        {
            _mockOrderRepository = new Mock<IRepository<Order>>();
            _mockBusControl = new Mock<IBusControl>();
            _mockMapper = new Mock<IMapper>();
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnExpectedOrder()
        {
            var request = new CreateNewOrderCommand(_items, Guid.NewGuid(),
                "example@gmail.com", Guid.NewGuid(), 1, new()
                {
                    Amount = 12_000_000,
                    Currency = "VND",
                    Id = Guid.NewGuid()
                }, "notes");

            var order = new Order(Guid.NewGuid(), Guid.NewGuid(), _items,
                1, Guid.NewGuid(), "");

            _mockOrderRepository
                .Setup(x => x.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(order);

            _mockBusControl
                .Setup(x => x.Publish<OrderCreatedIntegrationEvent>(
                    It.IsAny<object>(), It.IsAny<CancellationToken>()));

            var handler = new CreateNewOrderCommandHandler(
                _mockOrderRepository.Object,
                _mockBusControl.Object,
                _mockMapper.Object);

            var response = await handler.Handle(request, default);

            response.Should().Be(order);
            _mockOrderRepository.Verify(x => x.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()));
            _mockBusControl.Verify(x => x.Publish<OrderCreatedIntegrationEvent>(
                    It.IsAny<object>(), It.IsAny<CancellationToken>()));
        }
    }
}