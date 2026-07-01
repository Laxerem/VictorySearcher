using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VictorySearcher.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVacancyTrend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Trend",
                table: "Vacancies",
                type: "character varying(40)",
                maxLength: 40,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Trend",
                table: "Vacancies");
        }
    }
}
