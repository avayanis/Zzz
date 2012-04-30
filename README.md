Zzz
===

Zzz is a Lightweight Node.js REST Framework - Currently, Zzz supports the following http request methods: GET, POST, PUT, and DELETE.

Installation
============

npm install Zzz

Getting Started
===============

	// Load Zzz module and create a server instance
	var z = require("Zzz"),
		querystring = require("querystring"),
		server = z.createServer();

	// Define request handlers
	server.get("/some/static/path", function(request, response) {
		
		// do something here
		response.end("hello world");

	});

	server.post("/some/static/path", function(request, response) {
		
		request.content = "";

		// do something with post params here
		request.on("data", function(chunk) {
			request.content += chunk;
		});

		request.on("end", function() {
			var postBody = querystring.parse(request.content);
			response.end("<pre>" + postBody + "</pre>");
		});

	});

	server.get("/some/:dynamic/path", function(request, response, uriParams){
	
		// do something here.
		response.end("hello world.  This was " + uriParams.dynamic);

	});

Routing
=======

Routes are defined by assigning a callback to a http request method and request path:

	server.[get|post|put|delete]("/some/path", callback);

Zzz will always pass http.serverRequest and http.serverResponse objects to the callback.  However, if there are dynamic path segments denoted by a ':', these will be passed via an object of key/value pairs as the third argument to the callback.