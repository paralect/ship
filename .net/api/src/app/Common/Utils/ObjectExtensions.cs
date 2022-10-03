using System.ComponentModel;
using System.Reflection;

namespace Common.Utils;

public static class ObjectExtensions
{
    public static string GetDescription(this object value)
    {
        if (value == null)
            return null;

        var mi = value as MemberInfo;
        var isClassMember = mi != null;

        var attribute = isClassMember
            ? mi.GetAttribute<DescriptionAttribute>()
            : value.GetAttribute<DescriptionAttribute>();

        string description;
        if (attribute == null)
        {
            description = isClassMember ? mi.Name : value.ToString();
        }
        else
        {
            description = attribute.Description;
        }

        return description;
    }

    public static T GetAttribute<T>(this MemberInfo mi) where T : Attribute
    {
        if (mi == null) return null;
        var attributes = (T[])mi.GetCustomAttributes(typeof(T), false);

        return attributes.SingleOrDefault(x => x.GetType() == typeof(T));
    }

    public static T GetAttribute<T>(this object value) where T : Attribute
    {
        var fi = value?.GetType().GetField(value.ToString());

        return fi?.GetAttribute<T>();
    }
}
