using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Common.Utils;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTransientByConvention(
        this IServiceCollection services,
        Type assemblyMarkerType,
        Predicate<Type> predicate)
        => services.AddTransientByConvention(new List<Type> { assemblyMarkerType }, predicate);

    public static IServiceCollection AddTransientByConvention(
        this IServiceCollection services,
        IEnumerable<Type> assemblyMarkerTypes,
        Predicate<Type> predicate)
        => services.AddTransientByConvention(assemblyMarkerTypes, predicate, predicate);

    public static IServiceCollection AddTransientByConvention(
        this IServiceCollection services,
        IEnumerable<Type> assemblyMarkerTypes,
        Predicate<Type> interfacePredicate,
        Predicate<Type> implementationPredicate)
    {
        var assemblies = assemblyMarkerTypes.Select(Assembly.GetAssembly).ToList();

        var interfaces = assemblies.SelectMany(a => a.ExportedTypes)
            .Where(x => x.IsInterface && interfacePredicate(x))
            .ToList();

        var implementations = assemblies.SelectMany(a => a.ExportedTypes)
            .Where(x => !x.IsInterface && !x.IsAbstract && implementationPredicate(x))
            .ToList();

        foreach (var @interface in interfaces)
        {
            var interfaceImplementations = implementations
                .Where(x => @interface.IsAssignableFrom(x))
                .ToList();

            if (interfaceImplementations.Count == 1)
            {
                services.AddTransient(@interface, interfaceImplementations.First());
            }
        }

        return services;
    }

    public static TSettings AddSettings<TSettings>(this IServiceCollection services, IConfiguration configuration, string settingsName)
        where TSettings : class, new()
    {
        var settings = new TSettings();
        configuration.GetSection(settingsName).Bind(settings);

        services.AddSingleton(Options.Create(settings));

        return settings;
    }
}