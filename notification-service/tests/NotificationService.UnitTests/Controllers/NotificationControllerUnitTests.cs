using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NotificationService.API.Controllers;
using NotificationService.API.Models;
using NotificationService.Core.Interfaces;
using NotificationService.Core.NotificationAggregateRoot;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace NotificationService.UnitTests.Controllers
{
    public class NotificationControllerUnitTests
    {
        private readonly Mock<INotificationRepository> _mockNotificationRepository;

        public NotificationControllerUnitTests()
        {
            _mockNotificationRepository = new Mock<INotificationRepository>();
        }

        [Fact]
        public async Task GetAllNotificationForUser_ReturnsExpectedNotifications()
        {
            var userId = "some-email@gmail.com";
            var notifications = new List<Notification>
            {
                new Notification
                {
                    ReceiverEmail = userId,
                    Content = "test content",
                    Note = "test note",
                },
            };

            var expected = (notifications, notifications.Count);

            var expectedResult = new
            {
                data = notifications,
                pagination = new
                {
                    total = notifications.Count
                }
            };

            _mockNotificationRepository
                .Setup(x => x.GetNotificationsForUserAsync(It.IsAny<string>(),
                It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(expected);

            var controller = new NotificationController(_mockNotificationRepository.Object);

            var result = (await controller.GetNotificationsForUser(new GetNotificationsForUserDto
            {
                Email = "email@gmail.com",
                Limit = 10,
                Offset = 0
            }))
                .Result as ObjectResult;

            result.Value.Should().NotBeNull();
        }

        [Fact]
        public async Task MarkNotificationsToBeSeen_ReturnsOk()
        {
            var notificationIds = new List<string>
            {
                "61406808ff4a919419bce260", "614072d9f737aabc7cb646fc"
            };

            _mockNotificationRepository.Setup(
                x => x.MarkNotificationsToBeSeenAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(true);

            var controller = new NotificationController(
                _mockNotificationRepository.Object);

            var result = await controller.MarkNotificationsToBeSeen(
                string.Join(',', notificationIds));

            result.Should().BeOfType(typeof(OkResult));
        }

        [Fact]
        public async Task MarkNotificationsToBeSeen_ReturnsBadRequest()
        {
            var notificationIds = new List<string>
            {
                "61406808ff4a919419bce260", "614072d9f737aabc7cb646fc"
            };

            _mockNotificationRepository.Setup(
                x => x.MarkNotificationsToBeSeenAsync(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(false);

            var controller = new NotificationController(
                _mockNotificationRepository.Object);

            var result = await controller.MarkNotificationsToBeSeen(
                string.Join(',', notificationIds));

            result.Should().BeOfType(typeof(BadRequestResult));
        }

        [Fact]
        public async Task DeleteNotifications_ReturnsNoContent()
        {
            var notificationIds = new List<string>
            {
                "61406808ff4a919419bce260", "614072d9f737aabc7cb646fc"
            };

            _mockNotificationRepository.Setup(
                x => x.DeleteNotifications(It.IsAny<IEnumerable<string>>()))
                .ReturnsAsync(true);

            var controller = new NotificationController(
                _mockNotificationRepository.Object);

            var result = await controller.DeleteNotifications(
                string.Join(',', notificationIds));

            result.Should().BeOfType(typeof(NoContentResult));
        }
    }
}