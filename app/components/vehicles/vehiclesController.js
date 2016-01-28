angular.module('StarWarsApp')
	.controller('vehiclesController', ['$scope', '$http', 'vehiclesFactory', '_', '$cookies', function($scope, $http, vehiclesFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Vehicles';
        
        var pageCache = $cookies.get('currentVehiclesPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		vehiclesFactory.getAll($scope.currentPage, function(err, vehicles) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicles = vehicles;
            var numberOfPages = vehiclesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentVehiclesPage', newPageNumber);
            vehiclesFactory.getAll(newPageNumber, function(err, vehicles) {
                if(err) {
                    return console.log(err);
                }
                $scope.vehicles = vehicles;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);