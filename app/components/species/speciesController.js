angular.module('StarWarsApp')
	.controller('speciesController', ['$scope', '$http', 'speciesFactory', '_', '$cookies', function($scope, $http, speciesFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' },
        ];
        $scope.pageTitle = 'Species';

        var pageCache = $cookies.get('currentSpeciesPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		speciesFactory.getAll($scope.currentPage, function(err, species) {
            if(err) {
                return console.log(err);
            }
            $scope.species = species;
            var numberOfPages = speciesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentSpeciesPage', newPageNumber);
            speciesFactory.getAll(newPageNumber, function(err, species) {
                if(err) {
                    return console.log(err);
                }
                $scope.species = species;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);