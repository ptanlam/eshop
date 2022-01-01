using FluentAssertions;
using OrderingService.API;
using OrderingService.API.Endpoints.JourneyEndpoints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.IntegrationTests.JourneyEndpoints
{
    [Collection("Sequential")]
    public class Add : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public Add(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task AddJourneyToOrder_ShouldReturnNotFound()
        {
            var request = new AddJourneyToOrderRequest()
            {
                Journey = new()
                {
                    Location = "2364 Brookhaven Ave Far Rockaway, New York(NY), 11691",
                    Notes = "some notes"
                }
            };

            var route = $"orders/{Guid.NewGuid()}/journeys";

            var response = await _client.PostAsync(route, JsonContent.Create(request));

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}