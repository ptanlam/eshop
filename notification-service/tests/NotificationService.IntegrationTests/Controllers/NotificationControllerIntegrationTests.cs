using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using NotificationService.API;
using NotificationService.Core.NotificationAggregateRoot;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace NotificationService.IntegrationTests.Controllers
{
    public class NotificationControllerIntegrationTests :
        IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        public NotificationControllerIntegrationTests(WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.WithWebHostBuilder(builder => builder.ConfigureServices(services =>
            {
                services.AddMvc(opt => opt.Filters.Add(new AllowAnonymousFilter()));
            })).CreateDefaultClient();
        }

        [Fact]
        public async Task GetNotificationsForUser_ValidUserId_ReturnExpectedRespone()
        {
            var email = "some-email@gmail.com";

            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Notification>>(
                $"notifications?email={email}");

            response.Should().NotBeNull();
            response.Should().BeEmpty();
        }

        [Fact]
        public async Task MarkNotificationsToBeSeen_ValidIds_ReturnExpectedResponse()
        {
            var notificationIds = new List<string> {
                "61406808ff4a919419bce260", "61406808ff4a919419bce260" };

            var response = await _httpClient.PatchAsync(
                $"notifications?notificationIds=" +
                $"{string.Join(',', notificationIds)}", null);

            response.StatusCode.Should()
                .BeOneOf(new List<HttpStatusCode>
                {
                    HttpStatusCode.OK,
                    HttpStatusCode.BadRequest
                });
        }

        [Fact]
        public async Task DeleteNotification_ValidIds_ReturnsNoContentStatus()
        {
            var notificationIds = new List<string> {
                "61406808ff4a919419bce260", "61406808ff4a919419bce260" };

            var response = await _httpClient.DeleteAsync(
                $"notifications?notificationIds=" +
                $"{string.Join(',', notificationIds)}");

            response.StatusCode.Should()
                .BeOneOf(new List<HttpStatusCode>
                {
                    HttpStatusCode.NoContent,
                    HttpStatusCode.BadRequest
                });
        }
    }
}