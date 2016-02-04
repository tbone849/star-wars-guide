angular.module('StarWarsApp')
	.controller('vehiclesController', ['$scope', '$http', 'vehiclesFactory', '_', '$routeParams', '$location', function($scope, $http, vehiclesFactory, _, $routeParams, $location){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Vehicles';
        $scope.currentPage = $routeParams.page;

		vehiclesFactory.getAll($scope.currentPage, function(err, vehicles) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicles = vehicles;
            var numberOfPages = vehiclesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $location.path('/vehicles/page=' + newPageNumber);
        };
         
	}]);