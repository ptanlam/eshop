using AutoMapper;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;
using OrderingService.Core.ValueObjects;

namespace OrderingService.API.Profiles
{
    public class ItemProfile : Profile
    {
        public ItemProfile()
        {
            CreateMap<ItemForCreationDto, Item>()
                .ConstructUsing(src =>
                    new Item(src.ProductId, new Money(src.Price, src.PriceUnit), src.Quantity))
                .IgnoreAllPropertiesWithAnInaccessibleSetter();

            CreateMap<ItemDto, Item>()
                .ConstructUsing(src =>
                    new Item(src.ProductId, new Money(src.Price, src.PriceUnit), src.Quantity))
                .IgnoreAllPropertiesWithAnInaccessibleSetter();

            CreateMap<Item, ItemDto>()
                .ForMember(dest => dest.Price, opt =>
                    opt.MapFrom(src => src.Price.Amount))
                .ForMember(dest => dest.PriceUnit, opt =>
                    opt.MapFrom(src => src.Price.Unit));

            CreateMap<Item, ItemDetailsDto>()
                .ForMember(dest => dest.Price, opt =>
                    opt.MapFrom(src => src.Price.Amount))
                .ForMember(dest => dest.PriceUnit, opt =>
                    opt.MapFrom(src => src.Price.Unit))
                .ForMember(dest => dest.Product, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Product"]));

            CreateMap<Item, ItemForOrderApprovedIntegrationEventDto>();
            CreateMap<Item, ItemForOrderCancelledIntegrationEventDto>();
        }
    }
}