using FluentAssertions;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.OrderAggregateRoot.Specifications;
using OrderingService.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using OrderingService.Core.SyncedAggregates;
using Xunit;

namespace OrderingService.UnitTests.Specifications
{
    public class OrderSpecificationsUnitTests
    {
        private readonly List<Order> _orders;

        private readonly Guid _vendor = Guid.NewGuid();

        private readonly Customer _firstCustomer = new(
            "Full Name", "0939303933", "test@gmail.com");

        private readonly IEnumerable<Item> _items = new List<Item>()
        {
            new(Guid.NewGuid(), new Money(13_000_000, "VND"), 10),
            new(Guid.NewGuid(), new Money(10_000_000, "VND"), 23),
            new(Guid.NewGuid(), new Money(25_000_000, "VND"), 5),
        };

        public OrderSpecificationsUnitTests()
        {
            _orders = new List<Order>()
            {
                new(_firstCustomer.Id, _vendor,_items,1, Guid.NewGuid()),
                new(_firstCustomer.Id, _vendor,_items,3, Guid.NewGuid()),
                new(_firstCustomer.Id, _vendor,_items,2, Guid.NewGuid()),
            };
        }

        [Fact]
        public void OrdersForCustomer_ReturnsExpectedOrders()
        {
            var spec = new OrdersForCustomerSpec(new List<Guid>(){ _firstCustomer.Id });

            var clause = spec.WhereExpressions.First();

            var orders = _orders
                .Where(spec.WhereExpressions.First().Compile())
                .ToList();

            orders.Count.Should().Be(3);
        }

        [Fact]
        public void GetOrdersForCustomer_InexistingCustomer_ReturnsEmpty()
        {
            var spec = new OrdersForCustomerSpec(new List<Guid>(){ Guid.NewGuid() });

            var ordersForCustomer = _orders
               .Where(spec.WhereExpressions.First().Compile())
               .ToList();

            ordersForCustomer.Should().BeEmpty();
        }

        [Fact]
        public void GetOrderById_InexistingOrder_ReturnsNull()
        {
            var spec = new OrderDetailsByIdSpec(Guid.NewGuid());

            var ordersForCustomer = _orders
               .Where(spec.WhereExpressions.First().Compile())
               .FirstOrDefault();

            ordersForCustomer.Should().BeNull();
        }

        [Fact]
        public void GetOrdersForVendor_ReturnsExpectedOrders()
        {
            var spec = new OrdersForVendorSpec(_vendor.ToString());

            var ordersForVendor = _orders
               .Where(spec.WhereExpressions.First().Compile())
               .ToList();

            ordersForVendor.Count.Should().Be(_orders.Count);
        }

        [Fact]
        public void GetOrdersForVendor_InExistingVendor_ReturnsEmpty()
        {
            var spec = new OrdersForVendorSpec(Guid.NewGuid().ToString());

            var ordersForVendor = _orders
               .Where(spec.WhereExpressions.First().Compile())
               .ToList();

            ordersForVendor.Should().BeEmpty();
        }
    }
}