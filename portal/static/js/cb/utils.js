
module.exports.underscoredToCamelCase = function(underscored) {
    var camelCased = underscored.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    console.log('underscoredToCamelCase camelCased ', camelCased );
    return camelCased;
}