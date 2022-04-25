namespace Api.Views.Models.View;

public class PageFilterModel
{
    public int Page { get; set; } = 1;
    public int PerPage { get; set; } = 10;
    public IDictionary<string, int> Sort { get; set; }
    public string SearchValue { get; set; }
}
