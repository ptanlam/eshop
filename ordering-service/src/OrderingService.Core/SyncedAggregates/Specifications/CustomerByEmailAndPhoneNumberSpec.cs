using Ardalis.Specification;

namespace OrderingService.Core.SyncedAggregates.Specifications
{
    public class CustomerByEmailAndPhoneNumberSpec :
        Specification<Customer>, ISingleResultSpecification
    {
        public CustomerByEmailAndPhoneNumberSpec(string email, string phoneNumber)
        {
            Query
                .Where(c => c.Email == email && c.PhoneNumber == phoneNumber);
        }
    }
}