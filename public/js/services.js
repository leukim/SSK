var services = angular.module("SSKServices", []);

services.factory("gameFactory", function ($http, $localStorage) {
    var API = {};
    
    API.loadLangset = function(code) {
        return $http({
            method: "GET",
            url: "langsets/"+code+".json"
        });
    };
    
    API.startGame = function (state) {
        return $http.post('api/newgame', state);
    };
    
    API.getAllGames = function () {
        return $http.get('api/mygames');
    };
    
    API.getGame = function (id) {
        return $http.get('api/game/'+id);
    };
    
    API.updateGame = function (id, state) {
        return $http.put('api/game/'+id, state);
    };
    
    API.deleteGame = function (id) {
        return $http.delete('api/game/'+id);
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