namespace VictorySearcher.Service.Application.Common;

public class Result<T> {
    public bool IsSuccess { get; }
    public T? Value { get; }
    public AppError? Error { get; }

    private Result(bool isSuccess, T? value, AppError? error = null) {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value);
    public static Result<T> Failure(AppError error) => new(false, default, error);
}
