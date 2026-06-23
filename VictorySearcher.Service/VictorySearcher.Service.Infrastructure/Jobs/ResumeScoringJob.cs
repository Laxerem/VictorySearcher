using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Services.Parsers;

namespace VictorySearcher.Service.Infrastructure.Jobs;

public class ResumeScoringJob(
    IScoringRequestRepository scoringRequestRepository,
    IVacancyRepository vacancyRepository,
    IResumeRepository resumeRepository,
    ResumeParserDispatcher parserDispatcher,
    IResumeAnalyserService analyserService,
    IScoringResultRepository scoringResultRepository,
    IUnitOfWork unitOfWork) {

    public async Task ExecuteAsync(Guid requestId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetByIdAsync(requestId, ct)
            ?? throw new InvalidOperationException($"ScoringRequest {requestId} not found.");

        request.Status = ScoringStatus.InProcess;
        await unitOfWork.SaveChangesAsync(ct);

        try {
            var vacancy = await vacancyRepository.GetByIdAsync(request.VacancyId, ct)
                ?? throw new InvalidOperationException($"Vacancy {request.VacancyId} not found.");

            var resumes = await resumeRepository.GetByVacancyIdAsync(request.VacancyId, ct);

            var vacancyContext = new VacancyContextDto(
                vacancy.Title,
                vacancy.Description,
                vacancy.Requirements,
                vacancy.ExtraRequirements);

            foreach (var resume in resumes) {
                var content = await parserDispatcher.ParseAsync(resume, ct);
                var analysis = await analyserService.AnalyseAsync(content, vacancyContext, ct);

                await scoringResultRepository.AddAsync(new ScoringResult {
                    Id = Guid.NewGuid(),
                    RequestId = requestId,
                    ResumeId = resume.Id,
                    OverallScore = analysis.OverallScore,
                    ExperienceScore = analysis.ExperienceScore,
                    SkillsScore = analysis.SkillsScore,
                    ExtraScore = analysis.ExtraScore,
                    Reasoning = analysis.Reasoning,
                    Incongruity = analysis.Incongruity,
                    ScoredAt = DateTime.UtcNow
                }, ct);

                await unitOfWork.SaveChangesAsync(ct);
            }

            request.Status = ScoringStatus.Finished;
            request.FinishedAt = DateTime.UtcNow;
            await unitOfWork.SaveChangesAsync(ct);
        } catch (Exception ex) {
            request.Status = ScoringStatus.Failed;
            request.ErrorMessage = ex.Message;
            await unitOfWork.SaveChangesAsync(ct);
            throw;
        }
    }
}
