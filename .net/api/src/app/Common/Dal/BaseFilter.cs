namespace Common.Dal;

public class BaseFilter
{
    public string Id { get; set; }

    // should be set to true, if we intentionally want to query all data in the collection
    public bool IsEmptyFilterAllowed { get; set; }
}
