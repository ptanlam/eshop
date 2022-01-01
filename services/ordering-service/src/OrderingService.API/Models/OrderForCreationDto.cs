using System;
using System.Collections.Generic;

namespace OrderingService.API.Models
{
    public record OrderForCreationDto
    {
        public string Notes { get; init; }
        public Guid VendorId { get; init; }
        public CustomerForCreationDto Customer { get; init; }
        public ShippingAddressForCreationDto ShippingAddress { get; init; }
        public IEnumerable<ItemForCreationDto> Items { get; init; }
    }
}