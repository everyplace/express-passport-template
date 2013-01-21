
/*
 * GET home page.
 */

exports.test = function(req, res){

  var data = req.data;
  res.render('test', { firstName: data.firstName, lastName: data.lastName, list: data.list });
};