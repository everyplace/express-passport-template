
/*
 * Passport Middleware for Google
 */

var passport = require('passport')
  , googlestrategy = require('passport-google-oauth-offline').OAuth2Strategy
  , config = JSON.parse(process.env.GOOGLE).web
  , scope = JSON.parse(process.env.GOOGLE_SCOPE);

passport.use(new googlestrategy({
    clientID: config.client_id,
    clientSecret: config.client_secret,
    callbackURL: config.redirect_uris[2],
    accessType:"offline",
    approvalPrompt:"force"
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
  passport.authenticate('google', { scope: scope })(req, res, next);                                            
};

exports.callback = function(req, res, next){
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }, function(err, response){
    req.session.google = response;
    res.redirect('/');
  })(req, res, next);
};