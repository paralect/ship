using Common.Dal.Documents.Token;
using Common.Dal.Interfaces;
using Common.Dal.Repositories;
using Common.Enums;
using Common.Services.NoSql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using Microsoft.Extensions.Options;

namespace Common.Services.NoSql.Domain;

public class TokenService : BaseDocumentService<Token, TokenFilter>, ITokenService
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

    public async Task<Token> FindByValueAsync(string value)
    {
        return await FindOneAsync(new TokenFilter { Value = value });
    }

    public async Task<Token> CreateAccessToken(string userId, UserRole userRole)
    {
        var accessToken = new Token
        {
            Type = TokenType.Access,
            ExpireAt = DateTime.UtcNow + TimeSpan.FromHours(_tokenExpirationSettings.AccessTokenExpiresInHours),
            Value = SecurityUtils.GenerateSecureToken(Constants.TokenSecurityLength),
            UserId = userId,
            UserRole = userRole
        };

        await _tokenRepository.InsertAsync(accessToken);

        return accessToken;
    }

    public async Task DeleteAccessTokens(string userId)
    {
        await _tokenRepository.DeleteManyAsync(new TokenFilter { UserId = userId });
    }
}
