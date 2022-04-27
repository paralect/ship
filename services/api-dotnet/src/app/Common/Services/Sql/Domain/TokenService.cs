using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
using Common.Enums;
using Common.Services.Sql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using Microsoft.Extensions.Options;

namespace Common.Services.Sql.Domain;

public class TokenService : BaseEntityService<Token, TokenFilter>, ITokenService
{
    private readonly ITokenRepository _tokenRepository;
    private readonly TokenExpirationSettings _tokenExpirationSettings;
    
    public TokenService(
        ITokenRepository tokenRepository,
        IOptions<TokenExpirationSettings> tokenExpirationSettings)
        : base(tokenRepository)
    {
        _tokenRepository = tokenRepository;
        _tokenExpirationSettings = tokenExpirationSettings.Value;
    }
    
    public TokenService(ITokenRepository tokenRepository) : base(tokenRepository)
    {
    }

    public async Task<(Token accessToken, Token refreshToken)> CreateAuthTokens(long userId)
    {
        var accessToken = new Token
        {
            Type = TokenType.Access,
            ExpireAt = DateTime.UtcNow + TimeSpan.FromHours(_tokenExpirationSettings.AccessTokenExpiresInHours),
            UserId = userId,
            Value = SecurityUtils.GenerateSecureToken(Constants.TokenSecurityLength)
        };

        var refreshToken = new Token
        {
            Type = TokenType.Refresh,
            ExpireAt = DateTime.UtcNow + TimeSpan.FromHours(_tokenExpirationSettings.RefreshTokenExpiresInHours),
            UserId = userId,
            Value = SecurityUtils.GenerateSecureToken(Constants.TokenSecurityLength)
        };

        await _tokenRepository.InsertManyAsync(new List<Token> { accessToken, refreshToken });

        return (accessToken, refreshToken);
    }

    public async Task DeleteAuthTokens(long userId)
    {
        await _tokenRepository.DeleteManyAsync(new TokenFilter
        {
            UserId = userId
        });
    }
}
