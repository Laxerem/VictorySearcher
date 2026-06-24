using Microsoft.Extensions.Logging;
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
    IUnitOfWork unitOfWork,
    ILogger<ResumeScoringJob> logger) {

    public async Task ExecuteAsync(Guid requestId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetByIdAsync(requestId, ct)
            ?? throw new InvalidOperationException($"ScoringRequest {requestId} not found.");

        request.Status = ScoringStatus.InProcess;
        await unitOfWork.SaveChangesAsync(ct);

        try {
            var vacancy = await vacancyRepository.GetByIdAsync(request.VacancyId, ct)
                ?? throw new InvalidOperationException($"Vacancy {request.VacancyId} not found.");

            var resumes = await resumeRepository.GetUnscoredByVacancyIdAsync(request.VacancyId, ct);

            if (resumes.Count == 0) {
                request.Status = ScoringStatus.Finished;
                request.FinishedAt = DateTime.UtcNow;
                await unitOfWork.SaveChangesAsync(ct);
                logger.LogInformation("Scoring finished: no unscored resumes for request {RequestId}", requestId);
                return;
            }

            logger.LogInformation(
                "Scoring started: request {RequestId}, vacancy \"{VacancyTitle}\", {ResumeCount} unscored resumes",
                requestId, vacancy.Title, resumes.Count);

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
                    IsUncertain = analysis.IsUncertain,
                    RequirementsAnalysis = analysis.RequirementsAnalysis
                        .Select(r => new RequirementCoverage(r.Requirement, r.Covered, r.Evidence))
                        .ToList(),
                    ScoredAt = DateTime.UtcNow
                }, ct);

                await unitOfWork.SaveChangesAsync(ct);

                logger.LogInformation(
                    "Scored resume \"{FileName}\": overall={OverallScore}, uncertain={IsUncertain}",
                    resume.FileName, analysis.OverallScore, analysis.IsUncertain);
            }

            request.Status = ScoringStatus.Finished;
            request.FinishedAt = DateTime.UtcNow;
            await unitOfWork.SaveChangesAsync(ct);

            logger.LogInformation(
                "Scoring finished: request {RequestId}, {ResumeCount} resumes processed",
                requestId, resumes.Count);
        } catch (Exception ex) {
            logger.LogError(ex, "Scoring failed: request {RequestId}", requestId);
            request.Status = ScoringStatus.Failed;
            request.ErrorMessage = ex.Message;
            await unitOfWork.SaveChangesAsync(ct);
            throw;
        }
    }
}
