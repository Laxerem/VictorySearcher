using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter;

public class HhOAuthTokenProvider(
    IHttpClientFactory httpClientFactory,
    IOptions<HeadHunterOptions> options,
    ILogger<HhOAuthTokenProvider> logger) : IHhTokenProvider {

    private static readonly SemaphoreSlim _lock = new(1, 1);
    private static readonly JsonSerializerOptions _jsonOpts = new(JsonSerializerDefaults.Web);

    private readonly HeadHunterOptions _opts = options.Value;

    private string? _token;
    private DateTimeOffset _expiresAt = DateTimeOffset.MinValue;

    public async Task<Result<string>> GetTokenAsync(CancellationToken ct = default) {
        if (_token is not null && DateTimeOffset.UtcNow < _expiresAt - TimeSpan.FromMinutes(1))
            return Result<string>.Success(_token);

        await _lock.WaitAsync(ct);
        try {
            // Повторная проверка внутри lock — другой поток мог уже обновить токен
            if (_token is not null && DateTimeOffset.UtcNow < _expiresAt - TimeSpan.FromMinutes(1))
                return Result<string>.Success(_token);

            logger.LogInformation("Запрашиваю новый OAuth-токен HH.ru");

            using var client = httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Add("User-Agent", _opts.UserAgent);

            var body = new FormUrlEncodedContent([
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", _opts.ClientId),
                new KeyValuePair<string, string>("client_secret", _opts.ClientSecret)
            ]);

            var response = await client.PostAsync("https://hh.ru/oauth/token", body, ct);
            if (!response.IsSuccessStatusCode) {
                logger.LogError("HH OAuth: неуспешный ответ {StatusCode}", response.StatusCode);
                return Result<string>.Failure(AppError.Internal($"HH OAuth: {(int)response.StatusCode} {response.ReasonPhrase}"));
            }

            var tokenResponse = await response.Content.ReadFromJsonAsync<HhTokenResponse>(_jsonOpts, ct);
            if (tokenResponse is null) {
                logger.LogError("HH OAuth: не удалось десериализовать ответ");
                return Result<string>.Failure(AppError.Internal("HH OAuth: пустой ответ при получении токена"));
            }

            _token = tokenResponse.AccessToken;
            _expiresAt = DateTimeOffset.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

            logger.LogInformation("OAuth-токен HH.ru получен, истекает в {ExpiresAt:O}", _expiresAt);
            return Result<string>.Success(_token);
        } finally {
            _lock.Release();
        }
    }
}
