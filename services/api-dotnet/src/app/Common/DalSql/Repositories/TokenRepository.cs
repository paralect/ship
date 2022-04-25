using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
namespace Common.DalSql.Repositories;

public class TokenRepository : BaseRepository<Token, TokenFilter>, ITokenRepository
{
    public TokenRepository(ShipDbContext dbContext) : base(dbContext, dbContext => dbContext.Tokens)
    {
    }
}
