namespace VictorySearcher.Service.Application.Common;

public class Result<T> {
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(bool isSuccess, T? value, string? error = null) {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value);
    public static Result<T> Failure(string? error = null) => new(false, default, error);
}
