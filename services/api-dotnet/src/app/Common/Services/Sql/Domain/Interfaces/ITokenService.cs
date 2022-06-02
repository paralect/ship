using Common.DalSql.Entities;
using Common.DalSql.Filters;

namespace Common.Services.Sql.Domain.Interfaces;

public interface ITokenService : IEntityService<Token, TokenFilter>
{
    Task<(Token accessToken, Token refreshToken)> CreateAuthTokens(long userId);
    Task DeleteAuthTokens(long userId);
}
