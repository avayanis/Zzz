/**
 * Zees Includes
 */
var Router	= require('./router');
var connect = require('connect');
var merge = require('merge-descriptors');

var Zzz = function() {

	var app = connect();
  var router = new Router().middleware();
  var initialized = false;

  // Define HTTP methods for adding REST routes
	var methods = ["get", "post", "put", "delete"];
  methods.forEach(function(method) {

    app[method] = function(route, callback, scope) {

      if (!initialized) {
        app.use(router.requestHandler);
        initialized = true;
      }

      router.addRoute(method.toUpperCase(), route, callback, scope);
    }
  }, this);

	return app;
}

module.exports = Zzz;

merge(module.exports, connect.middleware);