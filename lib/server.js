/**
 * Includes
 */
var http	= require("http"),
    url 	= require("url");

var methods = ["get", "post", "put", "delete"];

/**
 * Create a new ZzzServer instance
 */
ZzzServer = function(options) {

    var httpServer = http.createServer();

    httpServer._routes = {};

    /**
     * Front controller to defined APIs
     *
     * @param  {http.ServerRequest} Request HTTP Request Object
     * @param  {http.ServerResponse} Response HTTP Response Object
     * @return {void}
     */
    httpServer._router = function(request, response) {

        var handler	= this._routeRequest({
            method : request.method,
            url : request.url
        });

        // A valid request handler could not be found return 404
        if (!handler) {

            response.statusCode = 404;
            return response.end("Page Not Found");

        }

        handler.callback(request, response, handler.variables);

    }

    /**
     * Add a new route to an http.Server routing table
     *
     * @param {string}   method   API request method
     * @param {string|regex}   route    API routing descriptor
     * @param {Function} callback API request handler
     */
    httpServer._addRoute = function(method, route, callback) {

        // Validate route input
        if (typeof route !== "string") {
            throw new URIError("Route must be a string");
        }

        if (typeof callback !== "function") {
            throw new TypeError("Request handler must be a Function");
        }

        // Initialize routing map for <method>
        if (typeof this._routes[method] === "undefined") {
            this._routes[method] = {};
        }

        var routeReference = this._routes[method],
            varMap = {};

        // Split route into a path tree
        parsePath(route).forEach(function(path, index) {

            // Store variable mapping
            if (path.charAt(0) == ":") {
                varMap[index] = path;
                path = ":var";
            }

            if (typeof routeReference[path] === "undefined") {
                routeReference[path] = {};
            }

            routeReference = routeReference[path];

        });

        // Set route callback and variable map
        routeReference._callback = callback;
        routeReference._varMap = varMap;

    }

    /**
     * Recursively search routing tree for a matching route.
     *
     * @param  {object} input Object containing request method and URL
     * @return {object|undefined} Route callback and variable map
     */
    httpServer._routeRequest = function(input) {

        if (typeof input !== "object") {
            throw new TypeError("Expecting object.  Found: " + typeof input);
        }

        // Handle initial call and begin recursion
        if (typeof input.method !== "undefined" && typeof input.url !== "undefined") {

            var path = url.parse(input.url).pathname,
                segments = parsePath(path),
                current = segments[0];

            return this._routeRequest({
                segments : segments,
                index : 0,
                route : this._routes[input.method],
                varMap : {}
            });

        }

        // Handle recursive calls
        if (typeof input.segments !== "undefined" &&
            typeof input.index !== "undefined" &&
            typeof input.route !== "undefined") {

            // All input segments have been matched, so now we check for
            // a valid callback and variable map.
            if (input.segments.length == 0) {

                if (typeof input.route._callback !== "undefined") {

                    var varMap = {};

                    for (var index in input.varMap) {
                        varMap[input.route._varMap[index].substr(1)] = input.varMap[index];
                    }

                    return {
                        callback : input.route._callback,
                        variables : varMap
                    }

                }

            } else {

                var handler,
                    varMap = input.varMap,
                    route = input.route,
                    current = input.segments[0];

                // Check if a static routing segment matches the current URI segment
                // and continue recursion.
                if (typeof route[current] !== "undefined") {

                    handler = this._routeRequest({
                        segments : input.segments.slice(1),
                        index : input.index + 1,
                        route : route[current],
                        varMap : varMap
                    });

                }

                // If we can't find a static match, check for a variable match.
                if (typeof handler === "undefined" &&
                    current.length > 0 &&
                    typeof route[":var"] !== "undefined") {

                    varMap[input.index] = current;
                    handler = this._routeRequest({
                        segments : input.segments.slice(1),
                        index : input.index + 1,
                        route : route[":var"],
                        varMap : varMap
                    });

                }

                // Return handler or false
                return handler || false;

            }

        }

    }

    // Define HTTP methods for adding REST routes
    methods.forEach(function(method) {

        httpServer[method] = function(route, callback) {

            httpServer._addRoute(method.toUpperCase(), route, callback);
        }

    }, this);

    httpServer.on("request", httpServer._router);

    return httpServer;
}

/**
 * Parse an URL path and return a representative array
 *
 * @param  {string} path URL path to parse
 * @return {array} Array of path tree
 */
parsePath = function(path) {
	return path.split("/").slice(1);
}

module.exports = ZzzServer;
