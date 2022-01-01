using System.ComponentModel.DataAnnotations;

namespace OrderingService.API.Models
{
    public record CustomerForCreationDto
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; init; }

        [Required]
        [DataType(DataType.Text)]
        public string FullName { get; init; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; init; }
    }
}