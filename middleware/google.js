
/*
 * Google refresh token workflow
 */

var request = require('request')
  , config = JSON.parse(process.env.GOOGLE).web
  , scope = JSON.parse(process.env.GOOGLE_SCOPE)
  , oauth = JSON.parse(process.env.GOOGLE_OAUTH);

exports.refresh = function(req, res, next){
	var data = {
		'refresh_token':oauth.refreshToken,
		'client_id':config.client_id,
		'client_secret':config.client_secret,
		'grant_type':'refresh_token'
	};
	console.log(data);
	request.post(
		'https://accounts.google.com/o/oauth2/token',
		{
			form:data
		}, function (err, response, body) {
		
		// console.log(response);
		res.end(body);
  });
};
