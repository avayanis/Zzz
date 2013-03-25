require("./../test");

var z = require(libpath + "/server"),
    server;

describe("Zzz Server", function() {

    describe("Add Route", function() {

        beforeEach(function() {

            server = new z();

        });

        it("Should have a route for GET /", function() {

            server._addRoute("GET", "/", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET[""].should.be.a("object");
            server._routes.GET[""]._callback.should.be.a("function");
        });

        it("Should have a route for GET /static", function() {

            server._addRoute("GET", "/static", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET["static"].should.be.a("object");
            server._routes.GET["static"]._callback.should.be.a("function");

        });

        it("Should have a route for GET /:variable1", function() {

            server._addRoute("GET", "/:variable1", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET[":var"].should.be.a("object");
            server._routes.GET[":var"]._callback.should.be.a("function");

        });

        it("Should have a route for GET /:variable1/:variable2", function() {

            server._addRoute("GET", "/:variable1/:variable2", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET[":var"][":var"].should.be.a("object");
            server._routes.GET[":var"][":var"]._callback.should.be.a("function");

        });

        it("Should have a route for GET /static/:variable1/", function() {

            server._addRoute("GET", "/static/:variable1", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET["static"][":var"].should.be.a("object");
            server._routes.GET["static"][":var"]._callback.should.be.a("function");

        });

        it("Should have a route for GET /:variable1/static/:variable2/", function() {

            server._addRoute("GET", "/:variable1/static/:variable2", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET[":var"]["static"][":var"].should.be.a("object");
            server._routes.GET[":var"]["static"][":var"]._callback.should.be.a("function");

        });

        it("Should respect trailing slashes", function() {

            server._addRoute("GET", "/static", function(){});

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET["static"].should.be.a("object");
            server._routes.GET["static"]._callback.should.be.a("function");

            server.should.have.property("_routes");
            server._routes.should.have.property("GET");
            server._routes.GET["static"].should.not.have.property("");

        });

        it("Should throw a TypeError when invalid request handler is provided", function() {

            (function() {
                server._addRoute("GET", "/");
            }).should.throw("Request handler must be a Function");

        });

        it("Should throw a URIError when invalid route is provided", function() {

            (function() {
                server._addRoute("GET", {}, function(){});
            }).should.throw("Route must be a string");

        });

    });

    describe("_router", function() {

        beforeEach(function(){
            server = new z();
        });

        it("Should return 404 when route cannot be matched.", function() {

            var request = {
                    method : "GET",
                    url : "/"
                },
                response = {
                    end : function(data) {
                        data.should.equal("Page Not Found");
                    }
                };

            server._router(request, response);

            response.should.have.status(404);

        });

        it("Should return 404 when route cannot be matched.", function() {

            var request = {
                    method : "GET",
                    url : "/"
                },
                response = {
                    end : function(data) {
                        data.should.equal("Page Not Found");
                    }
                };

            server.get("/", function(req, res) {
                req.should.be.eql(request);
            });

            server._router(request, response);

        });

    });

    describe("_routeRequest", function() {

        beforeEach(function(){
            server = new z();
        });

        it("Should not accept non objects", function() {

            (function() {
                server._routeRequest();
            }).should.throw(/^Expecting object.*/);

        });

    });

});