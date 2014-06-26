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
        $localStorage.games = $localStorage.games.filter(function(n){ return n !== undefined });
    };
    
    return API;
});

services.factory('AuthService', function ($http) {
    return {
        register: function (newuser) {
            return $http.post('api/register', newuser);
        },
        
        login: function (credentials) {
            return $http.post('api/login', credentials);
        },
        
        logout: function () {
            return $http.get('api/logout');
        },
        
        ping: function() {
            return $http.get('api/ping');
        }
    };
});

services.service('Session', function () {
    this.create = function (username) {
        this.username = username;
    };
    
    this.destroy = function () {
        this.username = null;
    };
    
    this.isLoggedIn = function () {
        return !!this.username;
    };
    
    return this;
})