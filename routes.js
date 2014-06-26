var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {

  /*app.get('/api', function (req, res) {
      res.render('index', { user : req.user });
  });*/

  /*app.get('/api/register', function(req, res) {
      res.render('register', { });
  });*/

  app.post('/api/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            //return res.render('register', { account : account });
            res.json({err:err});
        }

        passport.authenticate('local')(req, res, function () {
          //res.redirect('/api');
          res.json({
              message: "Register OK",
              username: req.user.username
          });
        });
    });
  });

  /*app.get('/api/login', function(req, res) {
      res.render('login', { user : req.user });
  });*/

  app.post('/api/login', passport.authenticate('local'), function(req, res) {
        res.json({
            message:"Login OK",
            username: req.user.username
        });
  });

  app.get('/api/logout', function(req, res) {
      req.logout();
      //res.redirect('/api');
      res.json({message:"Logout OK"});
  });

  app.get('/api/ping', function(req, res){
      if (req.user) {
          res.json({
              username: req.user.username
          });
      } else {
          res.send("Unauthorized", 401);
      }
  });

};