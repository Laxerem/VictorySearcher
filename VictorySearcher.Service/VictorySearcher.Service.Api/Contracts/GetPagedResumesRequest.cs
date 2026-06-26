namespace VictorySearcher.Service.Api.Contracts;

public record GetPagedResumesRequest(int Page = 1, int PageSize = 20);
