using Ardalis.GuardClauses;
using OrderingService.Core.CustomGuards;
using OrderingService.Core.Enums;
using OrderingService.Core.OrderAggregateRoot.Guards;
using OrderingService.SharedKernel;
using OrderingService.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using OrderingService.Core.ValueObjects;

namespace OrderingService.Core.OrderAggregateRoot
{
    public class Order : BaseEntity<Guid>, IAggregateRoot
    {
        public string Notes { get; private set; }
        public OrderStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
        public DateTime? DeletedAt { get; private set; }

        public Guid VendorId { get; private set; }
        public int ShippingAddressId { get; private set; }
        public Guid CustomerId { get; private set; }
        public Guid ReceiptId { get; private set; }

        public IEnumerable<Item> Items => _items.AsReadOnly();
        private readonly List<Item> _items = new();

        public IEnumerable<Journey> Journeys => _journeys.AsReadOnly();
        private readonly List<Journey> _journeys = new();

        public bool CanBeManipulated => Status == OrderStatus.Created;
        public Money TotalPrice => _items.Aggregate(new Money(0.0M, "N/A"),
            (s, i) => new Money(s.Amount + (i.Price.Amount * i.Quantity), i.Price.Unit));

        private Order()
        {
        }

        public Order(Guid customerId, Guid vendorId, IEnumerable<Item> items,
            int shippingAddressId, Guid receiptId, string notes = "")
        {
            CustomerId = customerId;
            VendorId = vendorId;
            Notes = notes;
            ShippingAddressId = shippingAddressId;
            ReceiptId = receiptId;

            _items.AddRange(items);
            CreatedAt = DateTime.UtcNow;
            Status = OrderStatus.Created;
        }

        public void AddItem(Item item)
        {
            var itemIndex = _items.FindIndex(i => i.ProductId == item.ProductId);

            if (itemIndex != -1)
            {
                _items.ElementAt(itemIndex).ManipulateQuantity(
                    1, ManipulationOperator.Plus);
                return;
            }

            _items.Add(item);
        }

        public void AddItems(IEnumerable<Item> items)
        {
            Guard.Against.Zero(items.Count(), nameof(items),
                "Items cannot be empty.");

            items.ToList().ForEach(AddItem);

            Update();
        }

        public void RemoveItem(Item item)
        {
            Guard.Against.AgainstInExistingItem(_items, item, nameof(item));

            _items.Remove(item);
        }

        public void RemoveItems(IEnumerable<Item> items)
        {
            Guard.Against.Zero(items.Count(), nameof(items),
                "Items cannot be empty.");

            Guard.Against.AgainstInExistingItems(_items, items, nameof(items));

            var removedProductIds = items.Select(i => i.ProductId);
            _items.RemoveAll(item => removedProductIds.Contains(item.ProductId));

            Update();
        }

        public void Cancel()
        {
            DeletedAt = DateTime.UtcNow;
        }

        public void AddJourney(Journey journey)
        {
            _journeys.Add(journey);
            Update();
        }

        public void ChangeStatus(OrderStatus status)
        {
            Status = status;
            Update();
        }

        public void UpdateNotes(string updatedNotes)
        {
            Notes = updatedNotes;
            Update();
        }

        private void Update()
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }
}