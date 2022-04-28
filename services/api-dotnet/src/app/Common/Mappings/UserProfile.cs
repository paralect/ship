using AutoMapper;
using Common.Dal;
using Common.Dal.Documents.User;
using Common.Models.View;
using Common.Models.View.User;

namespace Common.Mappings;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserViewModel>();
        CreateMap<Page<User>, PageModel<UserViewModel>>();
    }
}
