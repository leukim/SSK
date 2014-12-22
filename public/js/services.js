var services = angular.module("SSKServices", []);

services.factory("gameFactory", function ($http) {
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

services.service('Language', function ($translate) {
    this.available_langs = {
        'ca': {name:"Català", code:"ca", flag:"catalonia"},
        'de': {name:"Deutsch", code:"de", flag:"de"},
        'es': {name:"Español", code:"es", flag:"es"},
        'en': {name:"English", code:"en", flag:"gb"},
        'fr': {name:"Français", code:"fr", flag:"fr"},
    };
    
    this.language = {
        name: this.available_langs['ca'].name,
        code: this.available_langs['ca'].code,
        flag: this.available_langs['ca'].flag
    };
    
    this.changeLanguage = function (code) {
        if (code in this.available_langs) {
            $translate.use(code);
            this.language.name = this.available_langs[code].name;
            this.language.code = this.available_langs[code].code;
            this.language.flag = this.available_langs[code].flag;
        }
    };
    
    return this;
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
        },
        
        profile: function () {
            return $http.get('api/profile');
        },
        
        setLanguage: function (code) {
            return $http.post('api/profile', {
                language: code
            })
        }
    };
});

services.service('Session', function (Language, AuthService) {
    this.create = function (data) {
        this.username = data.username;
        this.setLanguage(data.language);
    };
    
    this.destroy = function () {
        this.username = null;
        this.language = null;
    };
    
    this.isLoggedIn = function () {
        return !!this.username;
    };
    
    this.setLanguage = function (code) {
        Language.changeLanguage(code);
        AuthService.setLanguage(code);
        this.language = code;
    };
    
    return this;
})