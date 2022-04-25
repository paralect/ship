using System.Linq.Expressions;
using Api.Sql.Controllers;
using Api.Views.Models.View.User;
using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.Services.Sql.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Tests.Sql
{
    public class UsersControllerTests
    {
        private readonly Mock<IUserService> _userService;

        public UsersControllerTests()
        {
            _userService = new Mock<IUserService>();
        }

        [Fact]
        public async Task GetCurrentShouldReturnOkObjectResult()
        {
            // Arrange
            var currentUserId = 1;
            var controller = CreateInstance(currentUserId);

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Id == currentUserId && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, UserViewModel>>>()))
                .ReturnsAsync(new UserViewModel());

            // Act
            var result = await controller.GetCurrentAsync();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        private UsersController CreateInstance(long currentUserId)
        {
            var instance = new UsersController(_userService.Object);

            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(context => context.User.Identity.Name).Returns(currentUserId.ToString());

            var controllerContext = new ControllerContext { HttpContext = httpContext.Object };
            instance.ControllerContext = controllerContext;

            return instance;
        }
    }
}
