using FluentAssertions;
using OrderingService.API;
using OrderingService.API.Endpoints.ItemEndpoints;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using OrderingService.API.Models;
using Xunit;

namespace OrderingService.IntegrationTests.ItemEndpoints
{
    [Collection("Sequential")]
    public class Update : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public Update(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task UpdateItemInOrder_ShouldReturnNotFound()
        {
            var orderId = Guid.NewGuid();

            var request = new UpdateItemInOrderRequest()
            {
                Item = new ItemForUpdateDto
                {
                    Operator = "Plus",
                    Quantity = 12
                }
            };

            var route = $"orders/{orderId}/items/{1}";

            var response = await _client.PatchAsync(route, JsonContent.Create(request));

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}