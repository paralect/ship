using Common.Models.View.User;
using Refit;

namespace Api.NoSql.Services.Interfaces;

public interface ISocketService
{
    [Post("/users")]
    Task UpdateUser(UserViewModel model);
}