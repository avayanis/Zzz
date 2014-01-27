require('./../test');

var Router = require(libpath + '/router');
var router;

describe('Zzz Router', function() {

  describe('Add Route', function() {

    beforeEach(function() {

      router = new Router();
    });

    it('Should have a route for GET /', function() {

      router._addRoute('GET', '/', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['']).to.be.a('object');
      expect(router._routes.GET['']._callback).to.be.a('function');
    });

    it('Should have a route for GET /static', function() {

      router._addRoute('GET', '/static', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static']).to.be.a('object');
      expect(router._routes.GET['static']._callback).to.be.a('function');
    });

    it('Should have a route for GET /:variable1', function() {

      router._addRoute('GET', '/:variable1', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET[':var']).to.be.a('object');
      expect(router._routes.GET[':var']._callback).to.be.a('function');
    });

    it('Should have a route for GET /:variable1/:variable2', function() {

      router._addRoute('GET', '/:variable1/:variable2', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET[':var'][':var']).to.be.a('object');
      expect(router._routes.GET[':var'][':var']._callback).to.be.a('function');
    });

    it('Should have a route for GET /static/:variable1/', function() {

      router._addRoute('GET', '/static/:variable1', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static'][':var']).to.be.a('object');
      expect(router._routes.GET['static'][':var']._callback).to.be.a('function');
    });

    it('Should have a route for GET /:variable1/static/:variable2/', function() {

      router._addRoute('GET', '/:variable1/static/:variable2', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET[':var']['static'][':var']).to.be.a('object');
      expect(router._routes.GET[':var']['static'][':var']._callback).to.be.a('function');
    });

    it('Should respect trailing slashes', function() {

      router._addRoute('GET', '/static', function(){});

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static']).to.be.a('object');
      expect(router._routes.GET['static']._callback).to.be.a('function');

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static']).to.not.have.property('');
    });

    it('Should have a scope set for route GET /', function() {

      var scope = {
          property: 'value'
      }

      router._addRoute('GET', '/static', function(){}, scope);

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static']).to.be.a('object');
      expect(router._routes.GET['static']._callback).to.be.a('function');
      expect(router._routes.GET['static']._scope).to.be.a('object');
      expect(router._routes.GET['static']._scope).to.be.eql(scope);

      expect(router).to.have.property('_routes');
      expect(router._routes).to.have.property('GET');
      expect(router._routes.GET['static']).to.not.have.property('');
    });

    it('Should throw a TypeError when invalid request handler is provided', function() {

      expect(function() {
        router._addRoute('GET', '/');
      }).to.throw('Request handler must be a Function');
    });

    it('Should throw a URIError when invalid route is provided', function() {

      expect(function() {
        router._addRoute('GET', {}, function(){});
      }).to.throw('Route must be a string');
    });
  });

  describe('_requestHandler', function() {

    beforeEach(function(){
      router = new Router();
    });

    it('Should execute callback when route is matched', function() {

      var request = {
        method : 'GET',
        url : '/'
      };

      var response = {
        end : function(data) {
          expect(data).to.equal('Page Not Found');
        }
      };

      var mockCallback = function(req, res, vars) {
        expect(req).to.be.a('object');
        expect(req).to.be.eql(request);

        expect(res).to.be.a('object');
        expect(res).to.be.eql(response);
      }

      router._routeRequest = function() {
        return {
          callback: mockCallback
        };
      }

      router._requestHandler(request, response);
    });

    it('Should execute callback within supplied when route is matched and scope is defined', function() {

      var request = {
        method : 'GET',
        url : '/'
      };

      var response = {
        end : function(data) {
          expect(data).to.equal('Page Not Found');
        }
      };

      var mockCallback = function(req, res, vars) {
        expect(req).to.be.a('object');
        expect(req).to.be.eql(request);

        expect(res).to.be.a('object');
        expect(res).to.be.eql(response);

        expect(this).to.not.have.property('ZzzServer');
        expect(this).to.have.property('key');
        expect(this.key).to.eql('value');
      }

      router._routeRequest = function() {
        return {
          scope: {
            key: 'value'
          },
          callback: mockCallback
        };
      }

      router._requestHandler(request, response);
    });

    it('Should return 404 when route cannot be matched.', function() {

      var request = {
        method : 'GET',
        url : '/'
      };

      var response = {
        end : function(data) {
          assert.ok(false);
        }
      }

      var next = function() {
        assert.ok(true);
      };

      router._requestHandler(request, response, next);
    });
  });

  describe('_routeRequest', function() {

    beforeEach(function(){
      router = new Router();
    });

    it('Should not accept non objects.', function() {

      expect(function() {
        router._routeRequest();
      }).to.throw(/^Expecting object.*/);
    });

    it('Should return a callback if static route is matched.', function() {

      var callback = function() {}

      var routes = {
        GET: {
          static: {
            _callback: callback,
            _varMap: {}
          }
        }
      }

      var request = {
        method : 'GET',
        url : '/static'
      }

      router._routes = routes;
      var route = router._routeRequest(request, {});

      expect(route).to.have.property('callback');
      expect(route.callback).to.equal(callback);
    });

    it('Should return a callback if dynamic route is matched.', function() {

      var callback = function() {}
      router._addRoute('GET', '/:variable1/:variable2', function(){});
      // console.log(router._routes.GET[':var'])
      var routes = {
        GET: {
          ':var': {
            ':var': {
              _callback: callback,
              _varMap: {
                '0': ':var1',
                '1': ':var2'
              }
            }
          }
        }
      }

      var request = {
        method : 'GET',
        url : '/test1/test2'
      }

      router._routes = routes;
      
      var route = router._routeRequest(request, {});

      expect(route).to.have.property('callback');
      expect(route.callback).to.equal(callback);
      expect(route.variables.var1).to.equal('test1');
      expect(route.variables.var2).to.equal('test2');
    });

    it('Should return false if route is not matched.', function() {

      var callback = function() {}

      var routes = {
        GET: {
          static: {
            _callback: callback,
            _varMap: {}
          }
        }
      }

      var request = {
        method : 'GET',
        url : '/'
      }

      router._routes = routes;
      var route = router._routeRequest(request, {});

      expect(route).to.equal(false);
    });
  });

  describe('middleware', function() {

    beforeEach(function(){
      router = new Router();
    });

    it('Should return an middleware interface for Router', function() {

      var middleware = router.middleware();

      expect(middleware).to.have.property('requestHandler');
      expect(middleware.requestHandler).to.be.a('function');
      expect(middleware).to.have.property('addRoute');
      expect(middleware.addRoute).to.be.a('function');
    })
  });
});