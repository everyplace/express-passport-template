var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , test = require('./routes/test')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , passport = require('passport')
  , flickrstrategy = require('passport-flickr')
  , testMiddleware = require('./models/testMiddleware');

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


passport.use(new flickrstrategy.Strategy({
    consumerKey: process.env.FLICKR_API_KEY,
    consumerSecret: process.env.FLICKR_API_SECRET,
    callbackURL: "http://localhost:5000/auth/flickr/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(token, tokenSecret, profile);
    done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});


app.get('/auth/flickr',
  passport.authenticate('flickr'),
  function(req, res){
    // The request will be redirected to Flickr for authentication, so this
    // function will not be called.
  });

app.get('/auth/flickr/callback', 
  passport.authenticate('flickr', { successRedirect: '/', failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/session', function(req, res){
  console.log(req.session);
  res.redirect('/');
});

  
app.get('/', routes.index);
app.get('/test', testMiddleware.index, test.test);
app.get('/users', user.list);

if(process.env.DEBUG == 'true') {
  console.log("DEBUG ENABLED");
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
