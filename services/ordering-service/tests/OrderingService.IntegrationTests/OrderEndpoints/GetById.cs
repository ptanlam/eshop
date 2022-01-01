using FluentAssertions;
using OrderingService.API;
using OrderingService.API.Endpoints.OrderEndpoints;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.IntegrationTests.OrderEndpoints
{
    [Collection("Sequential")]
    public class GetById : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public GetById(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetOrderById_ReturnsNotFound()
        {
            var route = GetOrderByIdRequest.Route
                .Replace("{Id:Guid}", Guid.NewGuid().ToString());

            var response = await _client.GetAsync(route);

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}