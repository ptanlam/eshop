using System.Collections.Generic;

namespace OrderingService.API.Models
{
    public record OrderForUpdateDto
    {
        public string Notes { get; init; }
        public string Status { get; init; }
    }
}