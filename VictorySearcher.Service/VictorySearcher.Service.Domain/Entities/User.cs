namespace VictorySearcher.Service.Domain.Entities;

public class User {
    public Guid Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<Vacancy> Vacancies { get; set; } = [];
}
