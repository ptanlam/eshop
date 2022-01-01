using FluentAssertions;
using NotificationService.Core.NotificationAggregateRoot;
using System;
using Xunit;

namespace NotificationService.UnitTests
{
    public class NotificationTests
    {
        [Fact]
        public void CreateNotificationForUser_ValidInput_ReturnsExpectedNotification()
        {
            var expectedReceiverId = Guid.NewGuid().ToString();
            var expectedContent = "test content";
            var expectedNote = "test note";

            var notification = new Notification
            {
                ReceiverEmail = expectedReceiverId,
                Content = expectedContent,
                Note = expectedNote,
            };

            notification.ReceiverEmail.Should().Be(expectedReceiverId);
            notification.Content.Should().Be(expectedContent);
            notification.Note.Should().Be(expectedNote);
            notification.Seen.Should().BeFalse();
            notification.SentAt.Should().NotBe(null);
        }
    }
}