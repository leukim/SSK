var passport = require('passport');
var Account = require('./models/account');
var Game = require('./models/game');

module.exports = function (app) {
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.user)
            return next();
        
        res.send("Unauthorized", 401);
    }
    
  app.post('/api/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            res.send(err, 500);
        }

        passport.authenticate('local')(req, res, function () {
          res.json({
              message: "Register OK",
              username: req.user.username
          });
        });
    });
  });

  app.post('/api/login', passport.authenticate('local'), function(req, res) {
        res.json({
            message:"Login OK",
            username: req.user.username
        });
  });

  app.get('/api/logout', function(req, res) {
      req.logout();
      res.json({message:"Logout OK"});
  });

  app.get('/api/ping', isLoggedIn, function(req, res){
      res.json({
          username: req.user.username
      });
  });
  
    app.post('/api/newgame', isLoggedIn, function (req, res) {
        var game = new Game();
        game.owner = req.user.username;
        game.data = JSON.stringify(req.body);
        
        game.save(function (err) {
            if (err) {
                res.send(err, 500);
            }
            
            res.json(game);
        });
    });
    
    app.get('/api/mygames', isLoggedIn, function (req, res) {
        Game.find({owner: req.user.username}, function (err, games) {
            if (err) {
                res.send(err, 500);
            }
            
            res.json(games);
        });
    });
    
    app.get('/api/game/:id', isLoggedIn, function (req, res) {
        Game.findById(req.params.id, function (err, game) {
            if (err) {
                res.send(err, 500);
            }
            
            if (req.user.username != game.owner) {
                res.send('Forbbiden', 403);
            }
            
            res.json(game);
        });
    });
    
    app.put('/api/game/:id', isLoggedIn, function (req, res) {
        Game.findById(req.params.id, function (err, game) {
            if (err) {
                res.send(err, 500);
            }
            
            if (req.user.username != game.owner) {
                res.send('Forbbiden', 403);
            }
            
            game.data = JSON.stringify(req.body);
            
            game.save(function (err) {
                if (err) {
                    res.send(err, 500);
                }
                
                res.send("OK", 200);
            });
        });
    });
    
    app.delete('/api/game/:id', isLoggedIn, function (req, res) {
        Game.findById(req.params.id, function (err, game) {
            if (err) {
                res.send(err, 500);
            }
            
            if (req.user.username != game.owner) {
                res.send('Forbbiden', 403);
            }
            
            game.remove();
            
            res.send("OK", 200);
        });
    });
};