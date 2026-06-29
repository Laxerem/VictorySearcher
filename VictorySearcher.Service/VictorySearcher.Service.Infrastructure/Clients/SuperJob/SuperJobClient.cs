using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Infrastructure.Clients.SuperJob.Requests;
using VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob;

public class SuperJobClient(
    HttpClient http,
    ILogger<SuperJobClient> logger) : ISuperJobClient {

    private static readonly JsonSerializerOptions _jsonOpts = new(JsonSerializerDefaults.Web);

    /// <summary>Возвращает список всех городов SuperJob. Ключ приложения не требуется.</summary>
    public async Task<Result<SjTownItem[]>> GetTownsAsync(CancellationToken ct = default) {
        var response = await http.GetAsync("towns/?all=1", ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("SJ GET /towns/ вернул {StatusCode}", response.StatusCode);
            return Result<SjTownItem[]>.Failure(AppError.Internal($"SJ /towns/: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<SjTownsResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("SJ GET /towns/: десериализация вернула null");
            return Result<SjTownItem[]>.Failure(AppError.Internal("SJ /towns/: пустой ответ"));
        }

        return Result<SjTownItem[]>.Success(result.Objects);
    }

    /// <summary>Возвращает каталог профессий SuperJob. Ключ приложения не требуется.</summary>
    public async Task<Result<SjCatalogueItem[]>> GetCataloguesAsync(CancellationToken ct = default) {
        var response = await http.GetAsync("catalogues/", ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("SJ GET /catalogues/ вернул {StatusCode}", response.StatusCode);
            return Result<SjCatalogueItem[]>.Failure(AppError.Internal($"SJ /catalogues/: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<SjCatalogueItem[]>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("SJ GET /catalogues/: десериализация вернула null");
            return Result<SjCatalogueItem[]>.Failure(AppError.Internal("SJ /catalogues/: пустой ответ"));
        }

        return Result<SjCatalogueItem[]>.Success(result);
    }

    /// <summary>
    /// Выполняет поиск вакансий по заданным параметрам.
    /// Ключ приложения передаётся через заголовок <c>X-Api-App-Id</c>, установленный в <see cref="HttpClient"/>.
    /// </summary>
    public async Task<Result<SjVacancyListResponse>> SearchVacanciesAsync(SjVacancySearchParams p, CancellationToken ct = default) {
        var response = await http.GetAsync(BuildVacanciesUrl(p), ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("SJ GET /vacancies/ вернул {StatusCode}", response.StatusCode);
            return Result<SjVacancyListResponse>.Failure(AppError.Internal($"SJ /vacancies/: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<SjVacancyListResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("SJ GET /vacancies/: десериализация вернула null");
            return Result<SjVacancyListResponse>.Failure(AppError.Internal("SJ /vacancies/: пустой ответ"));
        }

        return Result<SjVacancyListResponse>.Success(result);
    }

    private static string BuildVacanciesUrl(SjVacancySearchParams p) {
        var q = new List<string> {
            $"catalogues={p.CatalogueKey}",
            $"town={p.TownId}",
            $"count={p.Count}",
            $"page={p.Page}"
        };

        if (p.NoAgreement) q.Add("no_agreement=1");
        if (p.Experience is not null) q.Add($"experience={p.Experience}");
        if (p.DatePublishedFrom is not null) q.Add($"date_published_from={p.DatePublishedFrom.Value.ToUnixTimeSeconds()}");
        if (p.DatePublishedTo is not null) q.Add($"date_published_to={p.DatePublishedTo.Value.ToUnixTimeSeconds()}");

        return "vacancies/?" + string.Join("&", q);
    }
}
