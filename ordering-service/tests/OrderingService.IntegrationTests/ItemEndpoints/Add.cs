using FluentAssertions;
using OrderingService.API;
using OrderingService.API.Endpoints.ItemEndpoints;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.IntegrationTests.ItemEndpoints
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
        public async Task AddItemToOrder_ShouldReturnNotFound()
        {
            var orderId = Guid.NewGuid();

            var request = new AddItemToOrderRequest()
            {
                Item = new()
                {
                    ProductId = Guid.NewGuid(),
                    Price = 12_000_000,
                    PriceUnit = "VND",
                    Quantity = 12
                }
            };

            var route = AddItemToOrderRequest.Route.Replace(
                "{OrderId:Guid}", orderId.ToString());

            var response = await _client.PostAsync(route, JsonContent.Create(request));

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}