angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', function($scope, $http, characterFactory, _){

        var page = characterFactory.getPageNumber();

		characterFactory.getAll(page, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages);
            $scope.currentPage = characterFactory.getPageNumber();

        });

        $scope.getNewPage = function(newPageNumber){
            characterFactory.getAll(newPageNumber, function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.people = people;
                $scope.currentPage = characterFactory.getPageNumber();
            });
        };
         
	}]);