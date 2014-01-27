/**
 * Zees Includes
 */
var Router	= require('./router');
var connect = require('connect');

var Zzz = function() {

	var app = connect();
	var router = new Router().middleware();

  // Define HTTP methods for adding REST routes
	var methods = ["get", "post", "put", "delete"];
  methods.forEach(function(method) {

    app[method] = function(route, callback, scope) {
      router.addRoute(method.toUpperCase(), route, callback, scope);
    }
  }, this);

	app.use(router.requestHandler);

	return app;
}

module.exports = Zzz;