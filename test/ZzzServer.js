require("./test");

var z = require(libpath + "/z"),
    server;

describe("Zzz request router", function() {

    describe("Has a route for GET /", function() {

        before(function() {

            server = z.createServer();

            server.get("/", function(){});

        });

        it("Should route GET / to a callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/"
            });

            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({});

        });

        it("Should not route anything else", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/not-defined"
            });

            result.should.be.false;

        });

    });

    describe("Has a static route GET /static", function() {

        before(function() {

            server = z.createServer();

            server.get("/static", function(){});

        });

        it("Should route GET /static to a callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/static"
            });

            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({});

        });

        it("Should not route anything else", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/"
            });

            result.should.be.false;

            var result = server._routeRequest({
                method : "GET",
                url : "/not-defined"
            });

            result.should.be.false;

        });

    });

    describe("Has a variable route GET /:variable1", function() {

        before(function() {

            server = z.createServer();

            server.get("/:variable1", function(){});

        });

        it("Should route GET /test and provide 'test' as a parameter", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/test"
            });


            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({
                "variable1": "test"
            });

        });

        it("Should not route anything else", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/"
            });

            result.should.be.false;

            var result = server._routeRequest({
                method : "GET",
                url : "/not-defined/test/"
            });

            result.should.be.false;

        });

    });

    describe("Has a mix of static and variable routes", function() {

        before(function() {

            server = z.createServer();

            server.get("/", function(){});
            server.get("/static", function(){});
            server.get("/:variable1", function(){});
            server.get("/:variable1/static/:variable2", function(){});

        });

        it("Should route GET / to callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/"
            });

            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({});

        });

        it("Should route GET /static to callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/static"
            });


            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({});

        });

        it("Should route GET /test1 to callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/test1"
            });


            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({
                "variable1": "test1"
            });

        });

        it("Should route GET /test1/static/test3 to callback", function() {

            var result = server._routeRequest({
                method : "GET",
                url : "/test1/static/test3"
            });


            result.should.have.ownProperty("callback");
            result.callback.should.be.a("function");

            result.should.have.ownProperty("variables");
            result.variables.should.eql({
                "variable1": "test1",
                "variable2": "test3"
            });

        });

    });

});