angular.module('geekprofile.geeks').controller('GeeksCtrl', function($scope, $http, snapRemote) {
    'use strict';

    var root = 'http://localhost:4000/geeks';

    $scope.selectedGeek = null;
    $scope.geeks = [];

    snapRemote.open('left');

    $scope.updateLocation = function(location) {
        if(location) {
            $http.get(root + '?location=' + location).success(function(res) {
                $scope.geeks = res;
            });
        }
    };

    $scope.selectGeek = function(geek) {
        $scope.selectedGeek = geek;

        if(!geek._updated) {
            updateGeek(geek);
        }
    };

    function updateGeek(geek) {
        $http.get(root + '?nick=' + geek.nick).success(function(res) {
            for(var k in res) {
                geek[k] = res[k];
            }

            geek._updated = true;
        });
    }
});
