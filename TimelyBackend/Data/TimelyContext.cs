using Azure;
using Microsoft.EntityFrameworkCore;
using TimelyBackend.Models;

namespace TimelyBackend
{
    public class TimelyContext : DbContext
    {
        public TimelyContext(DbContextOptions<TimelyContext> options) : base(options) 
        { 
        }
        public DbSet<Log> Logs { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("TimelyContext");
            optionsBuilder.UseNpgsql(connectionString);
            optionsBuilder.UseSnakeCaseNamingConvention();
            // optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
            // optionsBuilder.EnableSensitiveDataLogging();
    }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Log>()
                .Property(p => p.ID)
                .ValueGeneratedOnAdd();
        }
    }
}
