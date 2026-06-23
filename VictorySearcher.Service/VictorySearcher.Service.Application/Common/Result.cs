namespace VictorySearcher.Service.Application.Common;

public class Result<T> {
    public bool IsSuccess { get; }
    public T? Value { get; }

    private Result(bool isSuccess, T? value) {
        IsSuccess = isSuccess;
        Value = value;
    }

    public static Result<T> Success(T value) => new(true, value);
    public static Result<T> Failure() => new(false, default);
}
