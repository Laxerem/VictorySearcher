using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VictorySearcher.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddScoringResultUncertaintyAndAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_uncertain",
                table: "ScoringResults",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "requirements_analysis",
                table: "ScoringResults",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_uncertain",
                table: "ScoringResults");

            migrationBuilder.DropColumn(
                name: "requirements_analysis",
                table: "ScoringResults");
        }
    }
}
