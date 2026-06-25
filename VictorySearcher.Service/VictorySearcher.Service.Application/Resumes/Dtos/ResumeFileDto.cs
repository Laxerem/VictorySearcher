using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Resumes.Dtos;

public record ResumeFileDto(string FileName, FileFormat Format, byte[] Data);
