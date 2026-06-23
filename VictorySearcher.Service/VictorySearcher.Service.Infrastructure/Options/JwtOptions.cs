namespace VictorySearcher.Service.Infrastructure.Options;

public class JwtOptions {
    public string Secret { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
