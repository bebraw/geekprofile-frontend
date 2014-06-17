angular.module('geekprofile.geeks').controller('GeeksCtrl', function($scope, $http) {
    'use strict';

    $scope.geeks = [];

    $scope.updateLocation = function() {
        $http.get('http://localhost:4000/geeks?location=demo').success(function(res) {
            $scope.geeks = res;
        });
    };
});
