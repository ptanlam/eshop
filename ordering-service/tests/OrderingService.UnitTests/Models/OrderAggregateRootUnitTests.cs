using FluentAssertions;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using OrderingService.Core.SyncedAggregates;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class OrderAggregateRootUnitTests
    {
        private readonly ShippingAddress _shippingAddress = new(Guid.NewGuid(),
            "Vietnam", "Ho Chi Minh", "Quan 10",
            "Phuong 15", "Su Van Hanh", "HUFLIT");

        private readonly Customer _customer = new("Full Name",
            "09093457878", "example@gmail.com");

        private readonly IEnumerable<Item> _items = new List<Item>()
        {
            new(Guid.NewGuid(), new Money(13_000_000, "VND"), 10),
            new(Guid.NewGuid(), new Money(10_000_000, "VND"), 23),
            new(Guid.NewGuid(), new Money(25_000_000, "VND"), 5),
        };

        private readonly Journey _journey = new(
            "130 Campus View St E, Mankato, Minnesota(MN), 56001", "order is shipping.");

        [Fact]
        public void Creation_ShouldReturnExpectedOrder()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.VendorId.Should().Be(vendorId);
            order.CustomerId.Should().Be(_customer.Id);
            order.Notes.Should().Be(notes);
            order.Journeys.Should().BeEmpty();
            order.CanBeManipulated.Should().BeTrue();
            order.ReceiptId.Should().Be(receiptId);
            order.ShippingAddressId.Should().Be(_shippingAddress.Id);
            order.CreatedAt.Should().BeBefore(DateTime.UtcNow);
            order.UpdatedAt.Should().BeNull();
            order.DeletedAt.Should().BeNull();
        }

        [Fact]
        public void AddItem_ShouldReturnExpectedNumberOfItem()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var item = new Item(
                Guid.NewGuid(), new Money(20_000_000, "VND"), 20);

            var order = new Order(_customer.Id, vendorId, _items,
                  _shippingAddress.Id, receiptId, notes);

            order.AddItem(item);

            order.Items.Count().Should().Be(_items.Count() + 1);
        }

        [Fact]
        public void AddItem_DuplicateItem_ShouldReturnExpectedNumberOfItem()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var item = _items.First();

            var order = new Order(_customer.Id, vendorId, _items,
                  _shippingAddress.Id, receiptId, notes);

            order.AddItem(item);

            order.Items.Count().Should().Be(_items.Count());
        }

        [Fact]
        public void AddItems_ShouldAddItemsToOrderAndUpdatedAtIsNotNull()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var items = new List<Item>()
            {
                new(Guid.NewGuid(), new Money(20_000_000, "VND"), 20),
                new(Guid.NewGuid(), new Money(30_000_000, "VND"), 4),
            };

            var order = new Order(_customer.Id, vendorId, _items,
                  _shippingAddress.Id, receiptId, notes);

            order.AddItems(items);

            order.Items.Count().Should().Be(_items.Count() + items.Count);
            order.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void AddItems_Duplicates_ShouldNotAddItems()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var order = new Order(_customer.Id, vendorId, _items,
                  _shippingAddress.Id, receiptId, notes);

            order.AddItems(_items);

            order.Items.Count().Should().Be(_items.Count());
            order.Items.First().Quantity.Should().Be(11);
            order.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void AddItems_EmptyList_ShouldThrowArgumentException()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var items = new List<Item>();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            Action act = () => order.AddItems(items);

            act.Should().Throw<ArgumentException>()
                 .WithParameterName(nameof(items));
            order.UpdatedAt.Should().BeNull();
        }

        [Fact]
        public void RemoveItem_ShouldRemoveItem()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var item = _items.First();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.RemoveItem(item);

            order.Items.Count().Should().Be(_items.Count() - 1);
        }

        [Fact]
        public void RemoveItem_InexistingItem_ShouldThrowError()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var item = new Item(
                Guid.NewGuid(), new Money(20_000_000, "VND"), 20);

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            Action act = () => order.RemoveItem(item);

            act.Should().Throw<ArgumentException>()
                .WithParameterName(nameof(item));
        }

        [Fact]
        public void RemoveItems_ShouldRemoveItemsInOrder()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var numberOfItemsToBeRemoved = 2;
            var items = _items.Take(numberOfItemsToBeRemoved);

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.RemoveItems(items);

            order.Items.Count().Should().Be(_items.Count() - numberOfItemsToBeRemoved);
        }

        [Fact]
        public void RemoveItems_InexistingItems_ShouldThrowArgumentException()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var items = new List<Item>()
            {
                new(Guid.NewGuid(), new Money(13_000_000, "VND"), 10),
                new(Guid.NewGuid(), new Money(10_000_000, "VND"), 23),
                new(Guid.NewGuid(), new Money(25_000_000, "VND"), 5),
            };

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            Action act = () => order.RemoveItems(items);

            act.Should().Throw<ArgumentException>()
                .WithParameterName(nameof(items));
        }

        [Fact]
        public void RemoveItems_EmptyList_ShouldThrowArgumentException()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var items = new List<Item>();

            var order = new Order(_customer.Id, vendorId, _items,
                  _shippingAddress.Id, receiptId, notes);

            Action act = () => order.RemoveItems(items);

            act.Should().Throw<ArgumentException>()
                 .WithParameterName(nameof(items));
        }

        [Fact]
        public void Remove_ShouldReturnExpectedOrder()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.Cancel();

            order.DeletedAt.Should().NotBeNull();
        }

        [Fact]
        public void AddJourney_ShouldReturnExpectedNumberOfJourneys()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.AddJourney(_journey);

            order.Journeys.Count().Should().Be(1);
            order.Journeys.ElementAt(0).Should().Be(_journey);
        }

        [Fact]
        public void ChangeStatus_ShouldReturnExpectedStatus()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.ChangeStatus(OrderStatus.Approved);

            order.Status.Should().Be(OrderStatus.Approved);
            order.CanBeManipulated.Should().BeFalse();
        }

        [Fact]
        public void UpdateNotes_ShouldReturnExpectedNotes()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var updatedNotes = "updated notes";

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.UpdateNotes(updatedNotes);

            order.Notes.Should().Be(updatedNotes);
        }

        [Fact]
        public void TotalPrice_ShouldReturnExpectedTotalPrice()
        {
            var notes = "very long notes";
            var vendorId = Guid.NewGuid();
            var receiptId = Guid.NewGuid();
            var expected = _items.Aggregate(0.0M, (sum, item) =>
                sum + (item.Price.Amount * item.Quantity));

            var order = new Order(_customer.Id, vendorId, _items,
                 _shippingAddress.Id, receiptId, notes);

            order.TotalPrice.Amount.Should().Be(expected);
        }
    }
}