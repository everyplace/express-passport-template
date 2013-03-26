var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , test = require('./routes/test')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , passport = require('passport')
  , testMiddleware = require('./models/testMiddleware');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(passport.initialize());
  app.use(passport.session());  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.use(new FlickrStrategy({
    consumerKey: process.env.FLICKR_API_KEY,
    consumerSecret: process.env.FLICKR_API_SECRET,
    callbackURL: "http://localhost:5000/auth/flickr/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ flickrId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

  
app.get('/', routes.index);
app.get('/test', testMiddleware.index, test.test);
app.get('/users', user.list);

if(process.env.DEBUG == 'true') {
  console.log("DEBUG ENABLED");
};

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
