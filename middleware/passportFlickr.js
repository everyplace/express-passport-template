
/*
 * Passport Middleware for Flickr
 */

var passport = require('passport')
  , flickrstrategy = require('passport-flickr')
  , config = JSON.parse(process.env.FLICKR);

passport.use(new flickrstrategy.Strategy({
    consumerKey: config.api_key,
    consumerSecret: config.api_secret,
    callbackURL: config.callback_url
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

exports.auth = function(req, res, next){
  passport.authenticate('flickr')(req, res, next);
};

exports.callback = function(req, res, next){
  passport.authenticate('flickr', { successRedirect: '/', failureRedirect: '/login' })(req, res, next);
};