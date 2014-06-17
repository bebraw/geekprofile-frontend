angular.module('geekprofile.geeks').controller('GeeksCtrl', function($scope, $http) {
    'use strict';

    $scope.geeks = [];

    $scope.updateLocation = function(location) {
        if(location) {
            $http.get('http://localhost:4000/geeks?location=' + location).success(function(res) {
                $scope.geeks = res;
            });
        }
    };
});
