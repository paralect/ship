using AutoMapper;
using Common.DalSql.Entities;
using Common.Models.View.User;

namespace Common.MappingsSql;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserViewModel>();
    }
}
