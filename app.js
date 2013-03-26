var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , test = require('./routes/test')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , passport = require('passport')  
  , passportconfig = require('./middleware/passport');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser()); 
  app.use(express.bodyParser());
  app.use(express.session({ secret: process.env.COOKIE_SECRET }));  
  app.use(passport.initialize());
  app.use(passport.session({ secret: process.env.COOKIE_SECRET }));  
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});




app.get('/auth/flickr', passportconfig.flickrauth);
app.get('/auth/flickr/callback', passportconfig.flickrcallback);
app.get('/', routes.index);

if(process.env.DEBUG == 'true') {
  console.log("DEBUG ENABLED");
  app.get('/session', function(req, res){
    console.log(req.session);
    res.redirect('/');
  });  
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
