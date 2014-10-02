var Zzz = require('./lib/z');

var app = new Zzz('foo');

// app.use(app.router);
app.use(function(request, response, next) {
    console.log('here');
    next();
});

app.use(function(request, response, next) {
    console.log('here2');
    response.write('hello');
    next();
});

app.listen(4000);