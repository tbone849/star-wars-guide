angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', '$routeParams', '$location', function($scope, $http, characterFactory, _, $routeParams, $location){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Characters';
        $scope.currentPage = $routeParams.page;

		characterFactory.getAll($scope.currentPage, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.characters = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $location.path('/characters/page=' + newPageNumber);
        };
         
	}]);