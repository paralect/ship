using Common.DalSql.Entities;
using Common.DalSql.Filters;

namespace Common.Services.Sql.Domain.Interfaces;

public interface ITokenService : IEntityService<Token, TokenFilter>
{
    Task<Token> CreateAccessToken(long userId);
    Task DeleteAccessTokens(long userId);
}
