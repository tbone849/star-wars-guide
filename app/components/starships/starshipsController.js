angular.module('StarWarsApp')
	.controller('starshipsController', ['$scope', '$http', 'starshipsFactory', '_', '$routeParams', '$location', function($scope, $http, starshipsFactory, _, $routeParams, $location){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Starships';
        $scope.currentPage = $routeParams.page;

		starshipsFactory.getAll($scope.currentPage, function(err, starships) {
            if(err) {
                return console.log(err);
            }
            $scope.starships = starships;
            var numberOfPages = starshipsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $location.search('page', newPageNumber);
        };
         
	}]);