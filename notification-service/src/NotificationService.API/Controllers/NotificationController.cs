using Microsoft.AspNetCore.Mvc;
using NotificationService.API.Models;
using NotificationService.Core.Interfaces;
using NotificationService.Core.NotificationAggregateRoot;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationService.API.Controllers
{
    [ApiController]
    [Route("notifications")]
    public class NotificationController : Controller
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository ??
                throw new ArgumentNullException(nameof(notificationRepository));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotificationsForUser(
            [FromQuery] GetNotificationsForUserDto dto)
        {
            var (data, total) = await _notificationRepository
                .GetNotificationsForUserAsync(dto.Email, dto.Limit, dto.Offset);

            return Ok(new { data, pagination = new { total } });
        }

        [HttpPatch]
        public async Task<IActionResult> MarkNotificationsToBeSeen(
            [FromQuery] string notificationIds)
        {
            var trimmedNotificationIdList = notificationIds
                .Split(',')
                .Select(nId => nId.Trim());

            var result = await _notificationRepository.
                MarkNotificationsToBeSeenAsync(trimmedNotificationIdList);

            if (!result) return BadRequest();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteNotifications(
            [FromQuery] string notificationIds)
        {
            var trimmedNotificationIdList = notificationIds
                .Split(',')
                .Select(nId => nId.Trim());

            var result = await _notificationRepository
                .DeleteNotifications(trimmedNotificationIdList);

            if (!result) return BadRequest();

            return NoContent();
        }
    }
}