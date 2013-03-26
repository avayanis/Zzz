# Zzz

Zzz is a Lightweight Node.js REST Framework - Currently, Zzz supports the following http request methods: GET, POST, PUT, and DELETE.

[![Build Status](https://travis-ci.org/avayanis/Zzz.png)](https://travis-ci.org/avayanis/Zzz)

## Installation

``` bash
$ npm install Zzz
```

## Usage

### Getting Started

``` javascript
// Load Zzz module and create a server instance
var Zzz = require("zzz");

// Create a new Zzz server
var server = new Zzz.Server();

// Define a GET request
server.get("/my/route", function(request, response) {
	response.end("Hello World, I serve GET requests!")
});

// Define a POST request
server.post("/my/route", function(request, response) {
	response.end("Hello World, I serve POST requests!")
});

// Start listening for requests
server.listen(80);
```

### Routing
Routes are defined by assigning a callback to a http request method and request path:

``` javascript
server.[get|post|put|delete]("/some/path", callback);

server.get("/some/static/path", function(request, response) {
	// do something here
	response.end("I did something.");
});

```

Zzz will always pass http.serverRequest and http.serverResponse objects to the callback.  However, if there are dynamic path segments denoted by a ':', these will be passed via an object of key/value pairs as the third argument to the callback.

``` javascript
server.post("/some/:dynamic/path", function(request, response, uriParams) {
	var body = "";
	
	// do something with post params here
	request.on("data", function(chunk) {
		body += chunk;
	});

	request.on("end", function() {
		var postBody = querystring.parse(body);
		response.write("<p>I was" + uriParams.dynamic + "</p>");
		response.end("<pre>" + postBody + "</pre>");
	});
});
```

## Run Tests

``` bash
$ make test
```

### Code Coverage Report

``` bash
$ make coverage
```

#### License: MIT
#### Author: [Andrew Vayanis](http://github.com/avayanis)