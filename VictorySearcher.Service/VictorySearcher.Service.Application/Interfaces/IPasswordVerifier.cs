namespace VictorySearcher.Service.Application.Interfaces;

public interface IPasswordVerifier {
    bool Verify(string password, string hash);
}
