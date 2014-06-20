var services = angular.module("SSKServices", []);

services.factory("gameFactory", function ($http, $localStorage) {
    var API = {};
    
    //delete $localStorage.games;
    
    if(!$localStorage.games) $localStorage.games = [];
    
    API.loadLangset = function(code) {
        return $http({
            method: "GET",
            url: "langsets/"+code+".json"
        });
    };
    
    API.startGame = function (state) {
        var id = $localStorage.games.push(state) - 1;
        return id;
    };
    
    API.getAllGames = function () {
        return $localStorage.games;
    };
    
    API.getGame = function (id) {
        return $localStorage.games[id];
    };
    
    API.deleteGame = function (id) {
        delete $localStorage.games[id];
        $localStorage.games = $localStorage.games.filter(function(n){ return n != undefined });
    };
    
    return API;
});