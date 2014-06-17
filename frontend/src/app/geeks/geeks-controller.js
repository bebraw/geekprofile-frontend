angular.module('geekprofile.geeks').controller('GeeksCtrl', function($scope, $http, snapRemote) {
    'use strict';

    $scope.selectedGeek = null;
    $scope.geeks = [];

    snapRemote.open('left');

    $scope.updateLocation = function(location) {
        if(location) {
            $http.get('http://localhost:4000/geeks?location=' + location).success(function(res) {
                $scope.geeks = res;
            });
        }
    };

    $scope.selectGeek = function(geek) {
        $scope.selectedGeek = geek;
    }
});
