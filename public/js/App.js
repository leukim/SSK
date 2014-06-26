var app = angular.module("SSK", [
    'ngRoute',
    'pascalprecht.translate',
    'ngStorage',
    'SSKControllers',
    'SSKDirectives',
    'SSKServices'
]);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/games', {
            templateUrl: 'partials/game_list.html',
            controller: 'GameListCtrl'
        })
        .when('/new', {
            templateUrl: 'partials/new_game.html',
            controller: 'NewGameCtrl'
        })
        .when('/games/:id', {
            templateUrl: 'partials/game.html',
            controller: 'GameCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);

app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/',
      suffix: '.json'
    });
    
    $translateProvider.preferredLanguage("ca");
});