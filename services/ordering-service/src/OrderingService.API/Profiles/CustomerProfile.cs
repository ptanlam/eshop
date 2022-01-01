using AutoMapper;
using OrderingService.API.Models;
using System;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.API.Profiles
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CustomerForCreationDto, Customer>()
                .ConstructUsing(src =>
                    new Customer(src.FullName, src.PhoneNumber, src.Email))
                .IgnoreAllPropertiesWithAnInaccessibleSetter();
        }
    }
}