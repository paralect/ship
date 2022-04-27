using Common.Dal.Documents.Token;
using Common.Dal.Repositories;
using Common.Enums;

namespace Common.Services.NoSql.Domain.Interfaces;

public interface ITokenService : IDocumentService<Token, TokenFilter>
{
    Task<Token> FindByValueAsync(string value);
    Task<(Token accessToken, Token refreshToken)> CreateAuthTokens(string userId, UserRole userRole);
    Task DeleteAuthTokens(string userId);
}
