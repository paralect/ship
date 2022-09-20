using Api.NoSql.Services.Interfaces;
using AutoMapper;
using Common.Dal;
using Common.Dal.Documents.User;
using Common.Dal.Repositories;
using Common.Models.View;
using Common.Models.View.User;
using Common.Services.NoSql.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.NoSql.Controllers
{
    public class UsersController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;
        private readonly IUserService _userService;
        private readonly ISocketService _socketService;

        public UsersController(
            IMapper mapper,
            ILogger<UsersController> logger,
            IUserService userService,
            ISocketService socketService)
        {
            _mapper = mapper;
            _logger = logger;
            _userService = userService;
            _socketService = socketService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync([FromQuery] PageFilterModel model)
        {
            // This mapping exists only to handle sort values mismatch (-1 and 1 instead of 0 and 1).
            // For a new project it'd be better to update the client to send the same values.
            var sort = model.Sort != null
                ? model.Sort
                    .Select(x => (x.Key, x.Value == 1 ? SortDirection.Ascending : SortDirection.Descending))
                    .ToList()
                : null;

            var page = await _userService.FindPageAsync(
                new UserFilter { SearchValue = model.SearchValue },
                sort,
                model.Page,
                model.PerPage
            );
            var pageModel = _mapper.Map<PageModel<UserViewModel>>(page);

            return Ok(pageModel);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentAsync()
        {
            var user = await _userService.FindByIdAsync(CurrentUserId);
            var viewModel = _mapper.Map<UserViewModel>(user);

            return Ok(viewModel);
        }

        // TODO change to PUT on client side and here
        [HttpPost("current")]
        public async Task<IActionResult> UpdateCurrentAsync([FromBody] UpdateCurrentUserModel model)
        {
            await _userService.UpdatePasswordAsync(CurrentUserId, model.Password);

            var user = await _userService.FindByIdAsync(CurrentUserId);

            await NotifyWsServer(user);
            
            return Ok(new
            {
                CurrentUserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.IsEmailVerified,
                user.AvatarUrl
            });
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadAvatarAsync([FromForm] UploadAvatarModel model)
        {
            await _userService.UpdateAvatarAsync(CurrentUserId, model.File.FileName, model.File.OpenReadStream());

            var user = await _userService.FindByIdAsync(CurrentUserId);
            return Ok(new
            {
                CurrentUserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.IsEmailVerified,
                user.AvatarUrl
            });
        }

        [HttpDelete("remove-photo")]
        public async Task<IActionResult> RemoveCurrentPhoto()
        {
            await _userService.RemoveAvatarAsync(CurrentUserId);

            var user = await _userService.FindByIdAsync(CurrentUserId);
            return Ok(new
            {
                CurrentUserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.IsEmailVerified,
                user.AvatarUrl
            });
        }

        /// <summary>
        /// An example of WS server usage
        /// </summary>
        private async Task NotifyWsServer(User user)
        {
            try
            {
                await _socketService.UpdateUser(new UserViewModel
                {
                    Id = CurrentUserId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                });
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
            }
        }
    }
}