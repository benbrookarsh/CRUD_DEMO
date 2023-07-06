using Microsoft.EntityFrameworkCore;
using Publify.Shared.Services;
using Template.Shared.Entities;

namespace Template.Database.Infrastructure.MySql
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            //TODO: Change from Dev
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }

        public DbSet<UserEntity> Users { get; set; } = null!;
        
        public DbSet<InvoiceEntity> Invoices { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}