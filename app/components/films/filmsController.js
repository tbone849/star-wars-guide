angular.module('StarWarsApp')
	.controller('filmsController', ['$scope', '$http', 'filmFactory', '_', '$routeParams', '$location', function($scope, $http, filmFactory, _, $routeParams, $location){
        
        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Films';
        $scope.currentPage = $routeParams.page;

		filmFactory.getAll($scope.currentPage, function(err, films) {
            if(err) {
                return console.log(err);
            }
            $scope.films = films;
            var numberOfPages = filmFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $location.path('/films/page=' + newPageNumber);
        };
         
	}]);