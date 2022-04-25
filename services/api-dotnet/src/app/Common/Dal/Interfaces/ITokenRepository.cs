using Common.Dal.Documents.Token;
using Common.Dal.Repositories;

namespace Common.Dal.Interfaces;

public interface ITokenRepository : IRepository<Token, TokenFilter>
{
}
