using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace OrderingService.API.Endpoints.OrderEndpoints
{
    public record ListOrderRequest
    {
        public const string Route = "orders";

        [DataType(DataType.EmailAddress)]
        public string Email { get; init; }

        public string VendorId { get; init; }

        [Range(1, int.MaxValue)]
        public int Limit { get; init; }

        [Range(0, int.MaxValue)]
        public int Offset { get; init; }
    }
}