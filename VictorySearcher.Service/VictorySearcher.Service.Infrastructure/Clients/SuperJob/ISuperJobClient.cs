using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Infrastructure.Clients.SuperJob.Requests;
using VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob;

public interface ISuperJobClient {
    // Справочники — без ключа
    Task<Result<SjTownItem[]>> GetTownsAsync(CancellationToken ct = default);
    Task<Result<SjCatalogueItem[]>> GetCataloguesAsync(CancellationToken ct = default);

    // Поиск вакансий — X-Api-App-Id в заголовке (устанавливается через HttpClient)
    Task<Result<SjVacancyListResponse>> SearchVacanciesAsync(SjVacancySearchParams p, CancellationToken ct = default);
}
