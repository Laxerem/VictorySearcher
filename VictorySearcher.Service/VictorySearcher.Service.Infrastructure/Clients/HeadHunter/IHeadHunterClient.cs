using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Requests;
using VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter;

public interface IHeadHunterClient {
    // Справочники — без токена
    Task<Result<HhAreaItem[]>> GetAreasAsync(CancellationToken ct = default);
    Task<Result<HhProfessionalRolesResponse>> GetProfessionalRolesAsync(CancellationToken ct = default);
    Task<Result<HhDictionariesResponse>> GetDictionariesAsync(CancellationToken ct = default);

    // Поиск вакансий — требует Bearer-токен
    Task<Result<HhVacancyListResponse>> SearchVacanciesAsync(HhVacancySearchParams p, CancellationToken ct = default);

    // Детальная карточка — key_skills + description
    Task<Result<HhVacancyDetail>> GetVacancyAsync(string vacancyId, CancellationToken ct = default);

    // Профиль работодателя — open_vacancies
    Task<Result<HhEmployerResponse>> GetEmployerAsync(string employerId, CancellationToken ct = default);
}
