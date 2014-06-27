var controllers = angular.module('SSKControllers', []);

controllers.controller("MainCtrl", function($scope, $translate, $location, gameFactory, AuthService, Session) {
    $scope.$translate = $translate;
    $scope.Session = Session;
    
    $scope.available_langs = [
        {name:"Català", code:"ca"},
        {name:"Deutsch", code:"de"},
        {name:"Español", code:"es"},
        {name:"English", code:"en"},
        {name:"Français", code:"fr"},
    ];
    
    AuthService.ping().then(function (res) {
        Session.create(res.data.username);
    }, function (err) {
        console.log(err);
    });
    
    $scope.doLogout = function () {
        AuthService.logout().then(function (res) {
            Session.destroy();
            $location.path("/");
        });
    };
});

controllers.controller("RegisterCtrl", function($scope, AuthService, Session, $location) {
    $scope.registering = false;
    
    $scope.doRegister = function (newuser) {
        $scope.register_error = false;
        
        $scope.newuser = {
            username: '',
            password: ''
        };
        $scope.registering = true;
        
        AuthService.register(newuser).then(function (res) {
            console.log(res);
            Session.create(res.data.username);
            $location.path("/");
            $scope.registering = false;
        }, function (err) {
            $scope.registering = false;
            $scope.register_error = true;
        });
    };
});

controllers.controller("HomeCtrl", function($scope, AuthService, Session) {
    $scope.logging = false;
    
    $scope.doLogin = function (credentials) {
        $scope.login_error = false;
        $('#logging_in_modal').foundation('reveal', 'open');
        
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.logging = true;
        
        AuthService.login(credentials).then(function (res) {
            Session.create(res.data.username);
            $scope.logging = false;
            $('#logging_in_modal').foundation('reveal', 'close');
        }, function (err) {
            $scope.login_error = true;
            $scope.logging = false;
            $('#logging_in_modal').foundation('reveal', 'close');
        });
    };
});

controllers.controller("GameListCtrl", function($scope, gameFactory) {
    $scope.getGames = function () {
        gameFactory.getAllGames().then(function (res) {
            $scope.games_loaded = true;
            console.log(res);
            $scope.games = res.data;
            for (var i in $scope.games) {
                $scope.games[i].data= JSON.parse($scope.games[i].data);
            }
            $('#game_deleting_modal').foundation('reveal', 'close');
        }, function (err) {
            console.log(err);
            $('#game_deleting_modal').foundation('reveal', 'close');
        });
    };
    $scope.getGames();
    
    
    $scope.deleteGame = function (id) {
        $('#game_deleting_modal').foundation('reveal', 'open');
        gameFactory.deleteGame(id).then(function (res) {
            $scope.getGames();
        });
    };
});

controllers.controller("NewGameCtrl", function ($scope, $translate, $location, gameFactory) {
    $scope.$translate = $translate;
    
    $scope.newgame= {
        numplayers: 2,
        playernames: ["","","",""]
    };
    
    $scope.playersRange = function() {
        var ret = [];
        for (var i = 0; i < $scope.newgame.numplayers; ++i) {
            ret.push(i+1);
        }
        return ret;
    };
    
    $scope.getPlayersNames = function() {
        var ret = [];
        for (var i = 0; i < $scope.newgame.numplayers; ++i) {
            ret.push($scope.newgame.playernames[i]);
        }
        return ret;
    };
    
    $scope.startGame = function () {
        gameFactory.loadLangset($scope.newgame.language).success(function (langset) {
            var game = new Game(langset, $scope.getPlayersNames());
            gameFactory.startGame({
                misc: {
                    name: $scope.newgame.name,
                    numplayers: $scope.newgame.numplayers,
                    language: langset.name,
                    players: $scope.getPlayersNames()
                },
                game_data: game.data,
                board_data: game.data.board.data
            }).then(function (res) {
                $location.path("/games/"+res.data._id);
            }, function (err) {
                // TODO Show error
                console.log(err);
            });
        });
    };
});

controllers.controller("GameCtrl", function ($scope, $routeParams, gameFactory) {
    
    $scope.state = undefined;
    $scope.saved = true;
    
    gameFactory.getGame($routeParams.id).then(function (res) {
        $scope.state = JSON.parse(res.data.data);
        $scope.game = new Game(undefined, undefined, $scope.state);
    }, function (err) {
        // TODO Show error
        console.log(err);
    });
    
    $scope.save = function () {
        $('#game_saving_modal').foundation('reveal', 'open');
        gameFactory.updateGame($routeParams.id, $scope.state).then(function (res) {
            $scope.saved = true;
            $('#game_saving_modal').foundation('reveal', 'close');
        }, function (err) {
            console.log(err);
        });
    };
    
    $scope.showRevealTiles = function () {
        $('#letterset').foundation('reveal', 'open');
    };
    
    $scope.hideRevealTiles = function () {
        $('#letterset').foundation('reveal', 'close');
    };
});
