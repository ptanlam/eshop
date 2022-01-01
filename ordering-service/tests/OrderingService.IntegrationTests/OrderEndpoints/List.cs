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
    public class List : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public List(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetOrderListForVendor_ReturnsOk()
        {
            var vendorId = Guid.NewGuid();

            var response = await _client.GetAsync(
                $"{ListOrderRequest.Route}?vendorId={vendorId}&limit=10&offset=0");

            response.EnsureSuccessStatusCode();
        }
    }
}