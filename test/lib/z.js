require('./../test');

var Zzz = require(libpath + '/z');

describe('Zzz Module', function() {

  describe('Constructor', function() {

    var server;

    beforeEach(function() {
      server = new Zzz();
    });

    it('Should have standard REST methods', function() {

      expect(server).to.have.property('get');
      expect(server).to.have.property('post');
      expect(server).to.have.property('put');
      expect(server).to.have.property('delete');
    });
  });

  describe('Module', function(){

    it('Should have connect middleware available', function() {

      expect(Zzz).to.have.property('logger');      
    });
  });
});