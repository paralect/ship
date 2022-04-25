using Api.Views.Models.View.User;
using AutoMapper;
using Common.DalSql.Entities;

namespace Api.Views.MappingsSql;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserViewModel>();
    }
}
