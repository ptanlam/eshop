using AutoMapper;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Profiles
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, OrderDto>()
                .ForMember(dest =>dest.TotalPrice, opt=>
                    opt.MapFrom(src => src.TotalPrice.Amount))
                .ForMember(dest =>dest.PriceUnit, opt=>
                    opt.MapFrom(src => src.TotalPrice.Unit));
            
            CreateMap<Order, OrderDetailsShortenedDto>()
                .ForMember(dest =>dest.TotalPrice, opt=>
                    opt.MapFrom(src => src.TotalPrice.Amount))
                .ForMember(dest =>dest.PriceUnit, opt=>
                    opt.MapFrom(src => src.TotalPrice.Unit))
                .ForMember(dest => dest.Vendor, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Vendor"]))
                .ForMember(dest => dest.Receipt, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Receipt"]))
                .ForMember(dest => dest.Items, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Items"]));;

            CreateMap<Order, OrderDetailsDto>()    
                .ForMember(dest =>dest.TotalPrice, opt=>
                    opt.MapFrom(src => src.TotalPrice.Amount))
                .ForMember(dest =>dest.PriceUnit, opt=>
                    opt.MapFrom(src => src.TotalPrice.Unit))
                .ForMember(dest => dest.Customer, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Customer"]))
                .ForMember(dest => dest.ShippingAddress, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["ShippingAddress"]))
                .ForMember(dest => dest.Vendor, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Vendor"]))
                .ForMember(dest => dest.Receipt, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Receipt"]))
                .ForMember(dest => dest.Items, opt =>
                    opt.MapFrom((src, dest, arg3, ctx) => ctx.Options.Items["Items"]));
        }
    }
}