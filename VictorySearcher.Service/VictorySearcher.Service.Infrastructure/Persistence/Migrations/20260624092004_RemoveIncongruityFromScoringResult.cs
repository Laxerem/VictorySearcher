using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VictorySearcher.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIncongruityFromScoringResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Incongruity",
                table: "ScoringResults");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Incongruity",
                table: "ScoringResults",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
