
/*
 * Passport Middleware
 */

var passport = require('passport')
  , flickrstrategy = require('passport-flickr');

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

exports.flickrauth = function(req, res, next){
  passport.authenticate('flickr')(req, res, next);
};

exports.flickrcallback = function(req, res, next){
  passport.authenticate('flickr', { successRedirect: '/', failureRedirect: '/login' })(req, res, next);
};