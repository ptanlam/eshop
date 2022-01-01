using System;
using System.ComponentModel.DataAnnotations;

namespace NotificationService.API.Models
{
    public record GetNotificationsForUserDto
    {
        [EmailAddress]
        public string Email { get; init; }

        [Range(1, int.MaxValue)]
        public int Limit { get; init; }

        [Range(0, int.MaxValue)]
        public int Offset { get; init; }
    }
}