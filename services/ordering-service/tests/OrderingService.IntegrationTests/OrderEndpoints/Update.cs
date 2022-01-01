using FluentAssertions;
using OrderingService.API;
using OrderingService.API.Endpoints.OrderEndpoints;
using OrderingService.API.Models;
using OrderingService.Core.Enums;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace OrderingService.IntegrationTests.OrderEndpoints
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
        public async Task UpdateOrder_ReturnsNotFound()
        {
            var route = UpdateOrderRequest.Route
                .Replace("{Id:Guid}", Guid.NewGuid().ToString());

            var request = new UpdateOrderRequest()
            {
                Order = new OrderForUpdateDto()
                {
                    Status = OrderStatus.Approved.ToString()
                }
            };

            var response = await _client.PatchAsync(route,
                JsonContent.Create(request));

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}