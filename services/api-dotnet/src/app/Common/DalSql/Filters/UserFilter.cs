using System.Linq.Expressions;
using Common.DalSql.Entities;
using Common.Utils;

namespace Common.DalSql.Filters;

public class UserFilter : BaseFilter<User>
{
    public string Email { get; set; }
    public string SignupToken { get; set; }
    public string ResetPasswordToken { get; set; }
    public long? IdToExclude { get; set; }
    public string SearchValue { get; set; }

    public override IEnumerable<Expression<Func<User, bool>>> GetPredicates()
    {
        if (Email.HasValue())
        {
            yield return entity => entity.Email == Email;
        }

        if (SignupToken.HasValue())
        {
            yield return entity => entity.SignupToken == SignupToken;
        }

        if (ResetPasswordToken.HasValue())
        {
            yield return entity => entity.ResetPasswordToken == ResetPasswordToken;
        }

        if (IdToExclude.HasValue)
        {
            yield return entity => entity.Id != IdToExclude;
        }

        if (SearchValue.HasValue())
        {
            yield return entity => entity.FirstName.Contains(SearchValue)
                                || entity.LastName.Contains(SearchValue)
                                || entity.Email.Contains(SearchValue);
        }
    }
}
