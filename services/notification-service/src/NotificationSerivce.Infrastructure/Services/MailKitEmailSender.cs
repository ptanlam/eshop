using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using NotificationService.Infrastructure.Settings;
using System;
using System.Threading.Tasks;

namespace NotificationSerivce.Infrastructure.Services
{
    public class MailKitEmailSender : IEmailSender
    {
        private readonly MailKitEmailSenderOptions _options;

        public MailKitEmailSender(IOptions<MailKitEmailSenderOptions> options)
        {
            _options = options.Value ??
                throw new ArgumentNullException(nameof(options));
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            return Execute(email, subject, htmlMessage);
        }

        private Task Execute(string to, string subject, string message)
        {
            // Create message
            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_options.SenderEmail)
            };

            if (!string.IsNullOrEmpty(_options.SenderName))
            {
                email.Sender.Name = _options.SenderName;
            }

            email.From.Add(email.Sender);
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = message };

            // Send email
            using (var smtp = new SmtpClient())
            {
                smtp.Connect(_options.HostAddress,
                             _options.HostPort,
                             _options.HostSecureSocketOptions);

                smtp.Authenticate(_options.HostUsername,
                                  _options.HostPassword);
                smtp.Send(email);
                smtp.Disconnect(true);
            }

            return Task.FromResult(true);
        }
    }
}