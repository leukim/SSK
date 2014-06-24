var directives = angular.module('SSKDirectives', []);

directives.directive("panel", function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/panel.html'
    }
});

directives.directive("board", function () {
    return {
        restrict: 'E',
        templateUrl:'templates/board.html',
        link: function (scope, elem, attrs) {
            
        }
    };
});

directives.directive("scoresheet", function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/scoresheet.html',
        link: function (scope, elem, attrs) {
        }
    };
});