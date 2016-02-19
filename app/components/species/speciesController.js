angular.module('StarWarsApp')
	.controller('speciesController', ['$scope', '$http', 'speciesFactory', '_', '$routeParams', function($scope, $http, speciesFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' },
        ];
        $scope.pageTitle = 'Species';
        $scope.currentPage = parseInt($routeParams.page);

		speciesFactory.getAll($scope.currentPage, function(err, species) {
            if(err) {
                return console.log(err);
            }
            $scope.species = species;
            var numberOfPages = speciesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);