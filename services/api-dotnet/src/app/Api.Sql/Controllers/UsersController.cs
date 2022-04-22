using System.Linq.Expressions;
using Api.Sql.Security;
using Api.Views.Models.View;
using Api.Views.Models.View.User;
using Common.DalSql;
using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.Services.Sql.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Sql.Controllers
{
    [Authorize]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync([FromQuery] PageFilterModel model)
        {
            // This mapping exists only to handle sort values mismatch (-1 and 1 instead of 0 and 1).
            // For a new project it'd be better to update the client to send the same values.
            var sort = model.Sort != null
                ? model.Sort
                    .Select(x => new SortField
                    {
                        FieldName = x.Key,
                        Direction = x.Value == 1 ? SortDirection.Ascending : SortDirection.Descending
                    })
                    .ToList()
                : null;

            var filter = new UserFilter
            {
                SearchValue = model.SearchValue,
                AsNoTracking = true
            };

            Expression<Func<User, UserViewModel>> map = x => new UserViewModel
            {
                Id = x.Id.ToString(),
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email
            };

            var page = await _userService.FindPageAsync(filter, sort, model.Page, model.PerPage, map);

            return Ok(page);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentAsync()
        {
            var user = await _userService.FindOneAsync(new UserFilter
            {
                Id = CurrentUserId!.Value,
                AsNoTracking = true
            },
            x => new UserViewModel
            {
                Id = x.Id.ToString(),
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email
            });

            return Ok(user);
        }

        // TODO change to PUT on client side and here
        [HttpPost("current")]
        public async Task<IActionResult> UpdateCurrentAsync([FromBody] UpdateCurrentUserModel model)
        {
            var userId = CurrentUserId!.Value;

            await _userService.UpdatePasswordAsync(userId, model.Password);

            var user = await _userService.FindOneAsync(new UserFilter
            {
                Id = userId,
                AsNoTracking = true
            },
            x => new
            {
                userId,
                x.FirstName,
                x.LastName,
                x.Email,
                x.IsEmailVerified
            });

            return Ok(user);
        }
    }
}