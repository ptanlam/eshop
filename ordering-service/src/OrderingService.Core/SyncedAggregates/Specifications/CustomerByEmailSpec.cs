using Ardalis.Specification;

namespace OrderingService.Core.SyncedAggregates.Specifications
{
    public class CustomerByEmailSpec : Specification<Customer>
    {
        public CustomerByEmailSpec(string email)
        {
            Query
                .Where(c => c.Email == email);
        }
    }
}