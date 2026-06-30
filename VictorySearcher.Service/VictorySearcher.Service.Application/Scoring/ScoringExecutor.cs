using Microsoft.Extensions.Logging;
using VictorySearcher.Service.Application.Extensions;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Application.Scoring;

public class ScoringExecutor(
    IScoringRequestRepository scoringRequestRepository,
    IVacancyRepository vacancyRepository,
    IResumeRepository resumeRepository,
    ResumeParserDispatcher parserDispatcher,
    IResumeAnalyserService analyserService,
    IScoringResultRepository scoringResultRepository,
    IScoringProgressChannel progressChannel,
    IUnitOfWork unitOfWork,
    ILogger<ScoringExecutor> logger) : IScoringExecutor {

    public async Task ExecuteAsync(Guid requestId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetByIdAsync(requestId, ct)
            ?? throw new InvalidOperationException($"ScoringRequest {requestId} not found.");

        request.Status = ScoringStatus.InProcess;
        await unitOfWork.SaveChangesAsync(ct);

        var scoredCount = 0;
        var total = 0;

        try {
            var vacancy = await vacancyRepository.GetByIdAsync(request.VacancyId, ct)
                ?? throw new InvalidOperationException($"Vacancy {request.VacancyId} not found.");

            var resumes = await resumeRepository.GetUnscoredByVacancyIdAsync(request.VacancyId, ct);
            total = resumes.Count;

            if (resumes.Count == 0) {
                request.Status = ScoringStatus.Finished;
                request.FinishedAt = DateTime.UtcNow;
                await unitOfWork.SaveChangesAsync(ct);
                progressChannel.TryWrite(requestId,
                    new ScoringProgressEvent(ScoringStatus.Finished, 0, 0));
                logger.LogInformation("Scoring finished: no unscored resumes for request {RequestId}", requestId);
                return;
            }

            logger.LogInformation(
                "Scoring started: request {RequestId}, vacancy \"{VacancyTitle}\", {ResumeCount} unscored resumes",
                requestId, vacancy.Title, resumes.Count);

            progressChannel.TryWrite(requestId, new ScoringProgressEvent(ScoringStatus.InProcess, 0, total));

            var vacancyContext = new VacancyContextDto(
                vacancy.Title,
                vacancy.Description,
                vacancy.Requirements,
                vacancy.ExtraRequirements);

            foreach (var resume in resumes) {
                var content = await parserDispatcher.ParseAsync(resume, ct);
                var analysis = await analyserService.AnalyseAsync(content, vacancyContext, ct);

                var scoringResultEntity = analysis.ToScoringResult(requestId, resume.Id);
                await scoringResultRepository.AddAsync(scoringResultEntity, ct);

                await unitOfWork.SaveChangesAsync(ct);

                scoredCount++;
                progressChannel.TryWrite(requestId,
                    new ScoringProgressEvent(ScoringStatus.InProcess, scoredCount, total, resume.FileName));

                logger.LogInformation(
                    "Scored resume \"{FileName}\": overall={OverallScore}, uncertain={IsUncertain}",
                    resume.FileName, analysis.OverallScore, analysis.IsUncertain);
            }

            request.Status = ScoringStatus.Finished;
            request.FinishedAt = DateTime.UtcNow;
            await unitOfWork.SaveChangesAsync(ct);

            progressChannel.TryWrite(requestId,
                new ScoringProgressEvent(ScoringStatus.Finished, total, total));

            logger.LogInformation(
                "Scoring finished: request {RequestId}, {ResumeCount} resumes processed",
                requestId, resumes.Count);
        } catch (Exception ex) {
            logger.LogError(ex, "Scoring failed: request {RequestId}", requestId);
            request.Status = ScoringStatus.Failed;
            request.ErrorMessage = ex.Message;
            await unitOfWork.SaveChangesAsync(ct);
            progressChannel.TryWrite(requestId,
                new ScoringProgressEvent(ScoringStatus.Failed, scoredCount, total, null, ex.Message));
            throw;
        } finally {
            progressChannel.Complete(requestId);
        }
    }
}
