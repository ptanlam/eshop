using System;
using System.Collections.Generic;

namespace OrderingService.API.Models
{
    public record OrderDetailsShortenedDto : OrderBaseDto
    {
        public IEnumerable<ItemDetailsDto> Items { get; set; }
        public GetVendorInfoResponse Vendor { get; set; }
        public GetReceiptForOrderResponse Receipt { get; set; }
    }
}