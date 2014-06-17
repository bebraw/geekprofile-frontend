angular.module('geekprofile', [
    'ngRoute',
    'geekprofile.todo',
    'geekprofile-templates'
])
    .config(function($routeProvider) {
        'use strict';
        $routeProvider
            .when('/todo', {
                controller: 'TodoCtrl',
                templateUrl: '/geekprofile/todo/todo.html'
            })
            .otherwise({
                redirectTo: '/todo'
            });
    });
