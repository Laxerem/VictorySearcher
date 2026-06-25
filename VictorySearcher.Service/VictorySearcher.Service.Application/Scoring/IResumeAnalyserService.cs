using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Application.Scoring;

public interface IResumeAnalyserService {
    Task<LlmAnalysisDto> AnalyseAsync(string content, VacancyContextDto vacancy, CancellationToken ct = default);
}
