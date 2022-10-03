using System.Linq.Expressions;
using Common.Dal.Documents;
using Common.Dal.UpdateDocumentOperators;

namespace Common.Dal.FluentUpdater;

public static class Updater<TDocument> where TDocument : BaseDocument
{
    public static MongoFluentUpdater<TDocument> Set<TField>(Expression<Func<TDocument, TField>> field, TField value)
    {
        return new MongoFluentUpdater<TDocument>().Set(field, value);
    }

    public static MongoFluentUpdater<TDocument> Apply(IUpdateOperator<TDocument> updateOperator)
    {
        return new MongoFluentUpdater<TDocument>().Apply(updateOperator);
    }

    public static MongoFluentUpdater<TDocument> Push<TItem>(Expression<Func<TDocument, IEnumerable<TItem>>> field, TItem value)
    {
        return new MongoFluentUpdater<TDocument>().Push(field, value);
    }

    public static MongoFluentUpdater<TDocument> PushMany<TItem>(Expression<Func<TDocument, IEnumerable<TItem>>> field, IEnumerable<TItem> values)
    {
        return new MongoFluentUpdater<TDocument>().PushMany(field, values);
    }

    public static MongoFluentUpdater<TDocument> Pull<TItem>(Expression<Func<TDocument, IEnumerable<TItem>>> field, TItem item)
    {
        return new MongoFluentUpdater<TDocument>().Pull(field, item);
    }

    public static MongoFluentUpdater<TDocument> PullMany<TItem>(Expression<Func<TDocument, IEnumerable<TItem>>> field, IEnumerable<TItem> values)
    {
        return new MongoFluentUpdater<TDocument>().PullMany(field, values);
    }

    public static MongoFluentUpdater<TDocument> PullWhere<TItem>(Expression<Func<TDocument, IEnumerable<TItem>>> field, Expression<Func<TItem, bool>> condition)
    {
        return new MongoFluentUpdater<TDocument>().PullWhere(field, condition);
    }

    public static MongoFluentUpdater<TDocument> Increment<TItem>(Expression<Func<TDocument, TItem>> field, TItem incrementByValue)
    {
        return new MongoFluentUpdater<TDocument>().Increment(field, incrementByValue);
    }
}
