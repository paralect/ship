using Api.NoSql.Controllers;
using Api.NoSql.Services.Interfaces;
using AutoMapper;
using Common.Dal.Documents.User;
using Common.Services.NoSql.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Tests.NoSql
{
    public class UsersControllerTests
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IUserService> _userService;
        private readonly Mock<ISocketService> _socketService;

        public UsersControllerTests()
        {
            _mapper = new Mock<IMapper>();
            _userService = new Mock<IUserService>();
            _socketService = new Mock<ISocketService>();
        }

        [Fact]
        public async Task GetCurrentShouldReturnOkObjectResult()
        {
            // Arrange
            var currentUserId = "test user id";
            var controller = CreateInstance(currentUserId);

            _userService.Setup(service => service.FindByIdAsync(currentUserId))
                .ReturnsAsync(new User());

            // Act
            var result = await controller.GetCurrentAsync();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        private UsersController CreateInstance(string currentUserId)
        {
            var instance = new UsersController(_mapper.Object, _userService.Object, _socketService.Object);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(context => context.User.Identity.Name).Returns(currentUserId);

            var controllerContext = new ControllerContext { HttpContext = httpContext.Object };
            instance.ControllerContext = controllerContext;

            return instance;
        }
    }
}
