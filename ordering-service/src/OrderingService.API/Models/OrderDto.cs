using System.Collections.Generic;

namespace OrderingService.API.Models
{
    public record OrderDto : OrderBaseDto
    {
        public IEnumerable<ItemDto> Items { get; init; }
    }
}