using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OrderingService.Infrastructure.Data;
using System;

namespace OrderingService.Infrastructure
{
    public static class StartupSetup
    {
        public static IServiceCollection AddApplicationDbContext(this IServiceCollection services,
            string connectionString) => services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
                options.LogTo(Console.WriteLine, LogLevel.Information);
            });
    }
}