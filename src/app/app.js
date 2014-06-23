angular.module('geekprofile', [
    'ngRoute',
    'snap',
    'geekprofile.geeks',
    'geekprofile-templates'
])
    .config(function($routeProvider) {
        'use strict';
        $routeProvider
            .when('/geeks', {
                controller: 'GeeksCtrl',
                templateUrl: '/geekprofile/geeks/geeks.html'
            })
            .otherwise({
                redirectTo: '/geeks'
            });
    });
