using FluentAssertions;
using OrderingService.API;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.IntegrationTests.ItemEndpoints
{
    [Collection("Sequential")]
    public class Remove : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public Remove(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task RemoveItemInOrder_ShouldReturnNotFound()
        {
            var orderId = Guid.NewGuid();

            var route = $"orders/{orderId}/items/{1}";

            var response = await _client.DeleteAsync(route);

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}