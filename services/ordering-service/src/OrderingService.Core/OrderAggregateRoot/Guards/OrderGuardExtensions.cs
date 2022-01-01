using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OrderingService.Core.OrderAggregateRoot.Guards
{
    public static class OrderGuardExtensions
    {
        public static void AgainstInExistingItem(this IGuardClause _,
            IEnumerable<Item> items, Item itemToCheck, string paramName)
        {
            var existed = items.Where(i => i.ProductId == itemToCheck.ProductId).Any();

            if (!existed) throw new ArgumentException(null, paramName);
        }

        public static void AgainstInExistingItems(this IGuardClause _,
            IEnumerable<Item> items, IEnumerable<Item> itemsToCheck, string paramName)
        {
            var existingProductIds = items.Select(i => i.ProductId);

            var hasInexistingProductId = itemsToCheck.Where(i => !existingProductIds.Contains(i.ProductId))
                .Any();

            if (hasInexistingProductId) throw new ArgumentException(null, paramName);
        }
    }
}