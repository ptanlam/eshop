using System;
using Ardalis.Specification;

namespace OrderingService.Core.SyncedAggregates.Specifications
{
    public class CustomerByIdSpec : Specification<Customer>, ISingleResultSpecification
    {
        public CustomerByIdSpec(Guid id)
        {
            Query
                .Where(customer => customer.Id == id);
        }
    }
}