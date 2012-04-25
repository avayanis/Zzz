/**
 * Zees Includes
 */
var zeeServer	= require("./lib/server");

/**
 * Globals
 */
var server;

/**
 * Wrap http createServer so that we can dynamically
 * define requestHandler
 * @return {http.Server}
 */
exports.createServer = function() {
	server = new ZeeServer();
	return server;
};

/**
 * Provides interface to http.Server.listen
 * @return {void}
 */
exports.listen = function() {
	server.listen.apply(server, arguments);
}