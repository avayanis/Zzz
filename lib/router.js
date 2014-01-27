var url   = require('url');

Router = function() {

  this._routes = {};
}

/**
 * Return interface for connect middleware
 */
Router.prototype.middleware = function() {

  var self = this;

  return {

    requestHandler: function(request, response, next) {
      self._requestHandler(request, response, next);
    },

    addRoute: function(method, route, callback, scope) {
      self._addRoute(method, route, callback, scope);
    }
  }
}

/**
 * Front controller to defined APIs
 *
 * @param  {Connect.request} request - Connect request object
 * @param  {Connect.response} response - Connect response object
 * @param  {Connect.next} next Connect - Callback to next middleware
 */
Router.prototype._requestHandler = function(request, response, next) {

  var handler = this._routeRequest({
    method : request.method,
    url : request.url
  });

  // A valid request handler could not be found
  if (!handler) return next();
    
  var callback = (typeof handler.scope !== 'undefined') ? handler.callback.bind(handler.scope) : handler.callback

  callback(request, response, handler.variables);
}

/**
 * Add a new route to an http.Server routing table
 *
 * @param {string} method - API request method
 * @param {string|regex} route - API routing descriptor
 * @param {Function} callback - API request handler
 * @param {object} scope - Object to use as callback scope
 */
Router.prototype._addRoute = function(method, route, callback, scope) {
  
  // Validate route input
  if (typeof route !== 'string') {
    throw new URIError('Route must be a string');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('Request handler must be a Function');
  }

  // Initialize routing map for <method>
  if (typeof this._routes[method] === 'undefined') {
    this._routes[method] = {};
  }

  var routeReference = this._routes[method];
  var varMap = {};

  // Split route into a path tree
  this._parsePath(route).forEach(function(path, index) {

    // Store variable mapping
    if (path.charAt(0) == ':') {
      varMap[index] = path;
      path = ':var';
    }

    if (typeof routeReference[path] === 'undefined') {
      routeReference[path] = {};
    }

    routeReference = routeReference[path];
  });

  // Set route callback and variable map
    routeReference._callback = callback;
    routeReference._scope = scope;
    routeReference._varMap = varMap;
}

/**
 * Recursively search routing tree for a matching route.
 *
 * @param {object} input - Object containing request method and URL
 * @return {object|undefined} Route callback and variable map
 */
Router.prototype._routeRequest = function(input) {

  if (typeof input !== 'object') {
    throw new TypeError('Expecting object.  Found: ' + typeof input);
  }

  // Handle initial call and begin recursion
  if (typeof input.method !== 'undefined' && 
      typeof input.url !== 'undefined') {

    var path = url.parse(input.url).pathname;
    var segments = this._parsePath(path);
    var current = segments[0];

    return this._routeRequest({
      segments : segments,
      index : 0,
      route : this._routes[input.method],
      varMap : {}
    });
  }

  // Handle recursive calls
  if (typeof input.segments !== 'undefined' &&
      typeof input.index !== 'undefined' &&
      typeof input.route !== 'undefined') {

    // All input segments have been matched, so now we check for
    // a valid callback and variable map.
    if (input.segments.length == 0) {

      if (typeof input.route._callback !== 'undefined') {

        var varMap = {};

        for (var index in input.varMap) {
          varMap[input.route._varMap[index].substr(1)] = input.varMap[index];
        }

        return {
          callback : input.route._callback,
          scope : input.route._scope,
          variables : varMap
        }
      }
    } else {

      var handler;
      var varMap = input.varMap;
      var route = input.route;
      var current = input.segments[0];

      // Check if a static routing segment matches the current URI segment
      // and continue recursion.
      if (typeof route[current] !== 'undefined') {
        
        handler = this._routeRequest({
          segments : input.segments.slice(1),
          index : input.index + 1,
          route : route[current],
          varMap : varMap
        });
      }

      // If we can't find a static match, check for a variable match.
      if (typeof handler === 'undefined' &&
          current.length > 0 &&
          typeof route[':var'] !== 'undefined') {

        varMap[input.index] = current;
        handler = this._routeRequest({
          segments : input.segments.slice(1),
          index : input.index + 1,
          route : route[':var'],
          varMap : varMap
        });
      }

      // Return handler or false
      return handler || false;
    }
  }
}

/**
 * Parse an URL path and return a representative array
 *
 * @param  {string} path URL path to parse
 * @return {array} Array of path tree
 */
Router.prototype._parsePath = function(path) {
  return path.split('/').slice(1);
}

module.exports = Router;