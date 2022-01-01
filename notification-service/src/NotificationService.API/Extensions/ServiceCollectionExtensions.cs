using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NotificationSerivce.Infrastructure.Settings;
using NotificationService.Infrastructure.Settings;
using System;

namespace NotificationService.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomerSwagger(this IServiceCollection services) =>
            services.AddSwaggerGen(setupAction =>
            {
                setupAction.SwaggerDoc("Ordering Service Api Specification", new OpenApiInfo()
                {
                    Title = "Ordering API",
                    Version = "1",
                    Description = "Throught this API you can access customer's orders",
                    Contact = new OpenApiContact()
                    {
                        Email = "phanlam20033002@gmail.com",
                        Name = "Lam Phan",
                        Url = new Uri("https://github.com/ptanlam"),
                    },
                    License = new OpenApiLicense()
                    {
                        Name = "MIT License",
                        Url = new Uri("https://opensource.org/licenses/MIT"),
                    },
                });
            });

        public static IServiceCollection AddCustomAuthorization(this IServiceCollection services) =>
            services.AddAuthorization(options =>
            {
                options.AddPolicy("CanReadNotifications", policy =>
                    policy.RequireClaim("permissions", "read:notification"));
            });

        public static AuthenticationBuilder AddCustomAuthentication(this IServiceCollection services,
            IdentityProviderOptions identityProviderOptions) =>
             services.AddAuthentication(options =>
             {
                 options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
             }).AddJwtBearer(options =>
             {
                 options.Authority = identityProviderOptions.Authority;
                 options.Audience = identityProviderOptions.Audience;

                 options.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateAudience = false
                 };
             });

        public static void ConfigureMailKitEmailSender(this IServiceCollection services,
            IConfiguration configuration)
        {
            var mailKitSettings = configuration
                .GetSection(MailKitEmailSenderOptions.Name)
                .Get<MailKitEmailSenderOptions>();

            services.Configure<MailKitEmailSenderOptions>(options =>
            {
                options.HostAddress = mailKitSettings.HostAddress;
                options.HostPort = mailKitSettings.HostPort;
                options.HostUsername = mailKitSettings.HostUsername;
                options.HostPassword = mailKitSettings.HostPassword;
                options.SenderEmail = mailKitSettings.SenderEmail;
                options.SenderName = mailKitSettings.SenderName;
            });
        }
    }
}