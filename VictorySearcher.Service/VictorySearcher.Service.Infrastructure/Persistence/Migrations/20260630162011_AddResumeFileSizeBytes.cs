using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VictorySearcher.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeFileSizeBytes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "FileSizeBytes",
                table: "Resumes",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileSizeBytes",
                table: "Resumes");
        }
    }
}
