
/*
 * Passport Middleware for Twitter
 */

var passport = require('passport')
  , googlestrategy = require('passport-google-oauth-offline').OAuth2Strategy
  , config = JSON.parse(process.env.GOOGLE).web;

passport.use(new googlestrategy({
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.redirect_uris[2]
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    profile.oauth = {"accessToken":accessToken, "refreshToken":refreshToken};
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
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] })(req, res, next);
};

exports.callback = function(req, res, next){
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }, function(err, response){
    req.session.google = response;
    res.redirect('/');
  })(req, res, next);
};