var vows	= require("vows"),
	assert	= require("assert"),
	http	= require("http"),
	z		= require("z");

function initializeServer() {
	var server = z.createServer();

	server.get("/", function(request, response) {
		response.end("");
	});

	server.get("/:variable1/static/:variable2", function(request, response) {
		response.end(request.url);
	});	

	return server;
}

vows.describe("server")
.addBatch({
	
	// Test server Constructor
	"Create Server" : {
		
		topic : function() {
			
			return z.createServer();

		},

		"Verify server object" : function(topic) {

			assert(topic);
			assert(topic instanceof http.Server);

		}

	}
		
}).addBatch({

	// Test server routing
	"Route GET /" : {
		
		topic : function() {

			var server = initializeServer();

			return server._routeRequest({
				method : "GET",
				url : "/"
			});

		},
		
		"Route should return an object" : function(topic) {
			assert.equal(typeof topic, "object");
			assert(topic.callback);
			assert(topic.variables);
		}

	},

	"Route GET /test1/test2/test3" : {

		topic : function() {

			var server = initializeServer();

			return server._routeRequest({
				method : "GET",
				url : "/test1/static/test3"
			});

		},

		"Route should return an object" : function(topic) {
			assert.equal(typeof topic, "object");
			assert(topic.callback);
			assert(topic.variables);
			assert.equal(topic.variables.variable1, "test1");
			assert.equal(topic.variables.variable2, "test3");
		}

	},

	"Route GET /does-not-exist" : {
		
		topic : function() {

			var server = initializeServer();

			return server._routeRequest({
				method : "GET",
				url : "/does-not-exist"
			});

		},
		
		"Route should return an undefined" : function(topic) {
			assert(typeof topic, false);
		}

	}

}).export(module);