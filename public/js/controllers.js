var controllers = angular.module('SSKControllers', []);

controllers.controller("MainCtrl", function($scope, $translate, gameFactory, AuthService, Session) {
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
        });
    };
});

controllers.controller("RegisterCtrl", function($scope, AuthService, Session, $location) {
    $scope.registering = false;
    
    $scope.doRegister = function (newuser) {
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
            //console.log(err);
            // TODO Show flash
        });
    };
});

controllers.controller("HomeCtrl", function($scope, AuthService, Session) {
    $scope.logging = false;
    
    $scope.doLogin = function (credentials) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.logging = true;
        
        AuthService.login(credentials).then(function (res) {
            Session.create(res.data.username);
            $scope.logging = false;
        }, function (err) {
            //console.log(err);
            // TODO Show flash
            $scope.logging = false;
        });
    };
});

controllers.controller("GameListCtrl", function($scope, gameFactory) {
    $scope.getGames = gameFactory.getAllGames;
    
    $scope.deleteGame = gameFactory.deleteGame;
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
            
            $scope.game = new Game(langset, $scope.getPlayersNames());
            var id = gameFactory.startGame({
                misc: {
                    name: $scope.newgame.name,
                    numplayers: $scope.newgame.numplayers,
                    language: langset.name,
                    players: $scope.getPlayersNames()
                },
                game_data: $scope.game.data,
                board_data: $scope.game.data.board.data
            });
            
            console.log(id);
            
            $location.path("/games/"+id);
        });
    };
});

controllers.controller("GameCtrl", function ($scope, $routeParams, gameFactory) {
    
    var state = gameFactory.getGame($routeParams.id);
    
    $scope.game = new Game(undefined, undefined, state);
    
    $scope.showRevealTiles = function () {
        $('#letterset').foundation('reveal', 'open');
    };
    
    $scope.hideRevealTiles = function () {
        $('#letterset').foundation('reveal', 'close');
    };
});
