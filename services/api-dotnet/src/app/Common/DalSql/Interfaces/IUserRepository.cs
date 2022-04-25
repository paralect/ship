using Common.DalSql.Entities;
using Common.DalSql.Filters;

namespace Common.DalSql.Interfaces;

public interface IUserRepository : IRepository<User, UserFilter>
{
}
