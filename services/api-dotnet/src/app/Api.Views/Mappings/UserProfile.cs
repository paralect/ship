using Api.Views.Models.View;
using Api.Views.Models.View.User;
using AutoMapper;
using Common.Dal;
using Common.Dal.Documents.User;

namespace Api.Views.Mappings;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserViewModel>();
        CreateMap<Page<User>, PageModel<UserViewModel>>();
    }
}
