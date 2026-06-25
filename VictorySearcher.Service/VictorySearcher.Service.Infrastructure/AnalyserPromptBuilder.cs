using System.Text;
using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Infrastructure;

public class AnalyserPromptBuilder {
    public LlmMessage[] Build(string systemPrompt, VacancyContextDto vacancy, string resumeContent) {
        var userMessage = new StringBuilder()
            .AppendLine($"Vacancy: {vacancy.Title}")
            .AppendLine()
            .AppendLine($"Description: {vacancy.Description}")
            .AppendLine()
            .AppendLine($"Requirements: {vacancy.Requirements}");

        if (vacancy.ExtraRequirements is not null)
            userMessage.AppendLine().AppendLine($"Extra requirements: {vacancy.ExtraRequirements}");

        userMessage.AppendLine().AppendLine($"Resume:\n{resumeContent}");

        return [
            new(LlmMessageRole.System, systemPrompt),
            new(LlmMessageRole.User, userMessage.ToString())
        ];
    }
}
