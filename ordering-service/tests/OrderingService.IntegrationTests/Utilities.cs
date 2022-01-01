using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Infrastructure.Data;
using System;
using System.Collections.Generic;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.IntegrationTests
{
    public static class Utilities
    {
        public static void InitializeDbForTests(AppDbContext db)
        {
            //db.Orders.AddRange(GetSeedingMessages());
            db.SaveChanges();
        }

        public static void ReinitializeDbForTests(AppDbContext db)
        {
            //db.Orders.RemoveRange(db.Orders);
            InitializeDbForTests(db);
        }

        public static List<Order> GetSeedingMessages()
        {
            var firstCustomer = new Customer("Full Name",
                "090909090", "test1@gmail.com");
            var firstOrder = new Order(firstCustomer.Id, Guid.NewGuid(),
                new List<Item>(), 1, Guid.NewGuid());

            var secondCustomer = new Customer("Full Name",
                "090909091", "test2@gmail.com");
            var secondOrder = new Order(secondCustomer.Id, Guid.NewGuid(),
                new List<Item>(), 1, Guid.NewGuid());

            return new List<Order>()
            {
                firstOrder,
                secondOrder,
            };
        }
    }
}