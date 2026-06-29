using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Requests;
using VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter;

public class HeadHunterClient(
    HttpClient http,
    IHhTokenProvider tokenProvider,
    ILogger<HeadHunterClient> logger) : IHeadHunterClient {

    private static readonly JsonSerializerOptions _jsonOpts = new(JsonSerializerDefaults.Web);

    /// <summary>Возвращает дерево регионов HH.ru. Токен не требуется.</summary>
    public async Task<Result<HhAreaItem[]>> GetAreasAsync(CancellationToken ct = default) {
        var response = await http.GetAsync("areas?locale=RU", ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /areas вернул {StatusCode}", response.StatusCode);
            return Result<HhAreaItem[]>.Failure(AppError.Internal($"HH /areas: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhAreaItem[]>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /areas: десериализация вернула null");
            return Result<HhAreaItem[]>.Failure(AppError.Internal("HH /areas: пустой ответ"));
        }

        return Result<HhAreaItem[]>.Success(result);
    }

    /// <summary>Возвращает справочник профессиональных ролей HH.ru. Токен не требуется.</summary>
    public async Task<Result<HhProfessionalRolesResponse>> GetProfessionalRolesAsync(CancellationToken ct = default) {
        var response = await http.GetAsync("professional_roles?locale=RU", ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /professional_roles вернул {StatusCode}", response.StatusCode);
            return Result<HhProfessionalRolesResponse>.Failure(AppError.Internal($"HH /professional_roles: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhProfessionalRolesResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /professional_roles: десериализация вернула null");
            return Result<HhProfessionalRolesResponse>.Failure(AppError.Internal("HH /professional_roles: пустой ответ"));
        }

        return Result<HhProfessionalRolesResponse>.Success(result);
    }

    /// <summary>Возвращает общие справочники HH.ru: опыт, занятость, график, валюты. Токен не требуется.</summary>
    public async Task<Result<HhDictionariesResponse>> GetDictionariesAsync(CancellationToken ct = default) {
        var response = await http.GetAsync("dictionaries?locale=RU", ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /dictionaries вернул {StatusCode}", response.StatusCode);
            return Result<HhDictionariesResponse>.Failure(AppError.Internal($"HH /dictionaries: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhDictionariesResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /dictionaries: десериализация вернула null");
            return Result<HhDictionariesResponse>.Failure(AppError.Internal("HH /dictionaries: пустой ответ"));
        }

        return Result<HhDictionariesResponse>.Success(result);
    }

    /// <summary>Выполняет поиск вакансий по заданным параметрам. Требует Bearer-токен.</summary>
    public async Task<Result<HhVacancyListResponse>> SearchVacanciesAsync(HhVacancySearchParams p, CancellationToken ct = default) {
        var tokenResult = await tokenProvider.GetTokenAsync(ct);
        if (!tokenResult.IsSuccess)
            return Result<HhVacancyListResponse>.Failure(tokenResult.Error!);

        using var request = new HttpRequestMessage(HttpMethod.Get, BuildVacanciesUrl(p));
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.Value);

        var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /vacancies вернул {StatusCode}", response.StatusCode);
            return Result<HhVacancyListResponse>.Failure(AppError.Internal($"HH /vacancies: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhVacancyListResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /vacancies: десериализация вернула null");
            return Result<HhVacancyListResponse>.Failure(AppError.Internal("HH /vacancies: пустой ответ"));
        }

        return Result<HhVacancyListResponse>.Success(result);
    }

    /// <summary>
    /// Возвращает детальную карточку вакансии, включая <c>key_skills</c> и <c>description</c>.
    /// В листинге <see cref="SearchVacanciesAsync"/> эти поля не присутствуют.
    /// </summary>
    public async Task<Result<HhVacancyDetail>> GetVacancyAsync(string vacancyId, CancellationToken ct = default) {
        var tokenResult = await tokenProvider.GetTokenAsync(ct);
        if (!tokenResult.IsSuccess)
            return Result<HhVacancyDetail>.Failure(tokenResult.Error!);

        using var request = new HttpRequestMessage(HttpMethod.Get, $"vacancies/{vacancyId}?locale=RU");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.Value);

        var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /vacancies/{VacancyId} вернул {StatusCode}", vacancyId, response.StatusCode);
            return Result<HhVacancyDetail>.Failure(AppError.Internal($"HH /vacancies/{vacancyId}: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhVacancyDetail>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /vacancies/{VacancyId}: десериализация вернула null", vacancyId);
            return Result<HhVacancyDetail>.Failure(AppError.Internal($"HH /vacancies/{vacancyId}: пустой ответ"));
        }

        return Result<HhVacancyDetail>.Success(result);
    }

    /// <summary>Возвращает публичный профиль работодателя, включая <c>open_vacancies</c>.</summary>
    public async Task<Result<HhEmployerResponse>> GetEmployerAsync(string employerId, CancellationToken ct = default) {
        var tokenResult = await tokenProvider.GetTokenAsync(ct);
        if (!tokenResult.IsSuccess)
            return Result<HhEmployerResponse>.Failure(tokenResult.Error!);

        using var request = new HttpRequestMessage(HttpMethod.Get, $"employers/{employerId}?locale=RU");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenResult.Value);

        var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode) {
            logger.LogError("HH GET /employers/{EmployerId} вернул {StatusCode}", employerId, response.StatusCode);
            return Result<HhEmployerResponse>.Failure(AppError.Internal($"HH /employers/{employerId}: {(int)response.StatusCode}"));
        }

        var result = await response.Content.ReadFromJsonAsync<HhEmployerResponse>(_jsonOpts, ct);
        if (result is null) {
            logger.LogError("HH GET /employers/{EmployerId}: десериализация вернула null", employerId);
            return Result<HhEmployerResponse>.Failure(AppError.Internal($"HH /employers/{employerId}: пустой ответ"));
        }

        return Result<HhEmployerResponse>.Success(result);
    }

    private static string BuildVacanciesUrl(HhVacancySearchParams p) {
        var q = new List<string> {
            $"professional_role={p.ProfessionalRoleId}",
            $"area={p.AreaId}",
            $"per_page={p.PerPage}",
            $"page={p.Page}",
            "locale=RU"
        };

        if (p.OnlyWithSalary) q.Add("only_with_salary=true");
        if (p.Experience is not null) q.Add($"experience={p.Experience}");
        if (p.DateFrom is not null) q.Add($"date_from={p.DateFrom.Value:O}");
        if (p.DateTo is not null) q.Add($"date_to={p.DateTo.Value:O}");

        return "vacancies?" + string.Join("&", q);
    }
}
