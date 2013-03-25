require("./../test");

var z = require(libpath + "/z");

describe("Zzz Module", function() {

    describe("z.createServer", function() {

        it("Should have a createServer function", function() {

            z.should.have.ownProperty("createServer");
            z.createServer.should.be.a("function");

        });

    });

});