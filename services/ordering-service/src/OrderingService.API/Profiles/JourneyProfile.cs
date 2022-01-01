using AutoMapper;
using OrderingService.API.Models;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Profiles
{
    public class JourneyProfile : Profile
    {
        public JourneyProfile()
        {
            CreateMap<JourneyForCreationDto, Journey>()
                .ConstructUsing(src => new Journey(src.Location, src.Notes));

            CreateMap<Journey, JourneyDto>();
        }
    }
}