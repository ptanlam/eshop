using System.ComponentModel.DataAnnotations;

namespace OrderingService.API.Models
{
    public record ShippingAddressForCreationDto
    {
        [DataType(DataType.Text)]
        public string Country { get; init; }

        [DataType(DataType.Text)]
        public string City { get; init; }

        public string Ward { get; init; }
        public string District { get; init; }
        public string Street { get; init; }
        public string Details { get; init; }
    }
}