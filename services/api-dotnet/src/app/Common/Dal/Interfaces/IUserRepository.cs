using Common.Dal.Documents.User;
using Common.Dal.Repositories;

namespace Common.Dal.Interfaces;

public interface IUserRepository : IRepository<User, UserFilter>
{
}
