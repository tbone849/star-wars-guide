angular.module('StarWarsApp')
	.controller('planetsController', ['$scope', '$http', 'planetsFactory', '_', '$routeParams', '$location', function($scope, $http, planetsFactory, _, $routeParams, $location){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Planets';
        $scope.currentPage = $routeParams.page;

		planetsFactory.getAll($scope.currentPage, function(err, planets) {
            if(err) {
                return console.log(err);
            }
            $scope.planets = planets;
            var numberOfPages = planetsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $location.search('page', newPageNumber);
        };
         
	}]);