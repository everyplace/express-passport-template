
/*
 * Passport Middleware for Twitter
 */

var passport = require('passport')
  , twitterstrategy = require('passport-twitter')
  , config = JSON.parse(process.env.TWITTER);

passport.use(new twitterstrategy.Strategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: config.callback_url
  },
  function(token, tokenSecret, profile, done) {
    // console.log(token, tokenSecret, profile);
    profile.oauth = {"token":token, "secret":tokenSecret};
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
  passport.authenticate('twitter')(req, res, next);
};

exports.callback = function(req, res, next){
  passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }, function(err, response){
    req.session.twitter = response;
    res.redirect('/');
  })(req, res, next);
};