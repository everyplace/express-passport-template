
/*
 * testMiddleware
 */

exports.index = function(req, res, next){
  req.data = {
    "list":[
      {"item":"adsf"},
      {"item":"jkl;"}
    ]
  };
  next();
};