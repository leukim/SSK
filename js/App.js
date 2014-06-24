var app = angular.module("SSK", [
    'ngRoute',
    'pascalprecht.translate',
    'ngStorage',
    'SSKControllers',
    'SSKDirectives',
    'SSKServices'
]);

app.config(['$routeProvider',
    function($routeProvider) {
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