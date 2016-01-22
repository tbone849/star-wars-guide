angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', '$cookies', function($scope, $http, characterFactory, _, $cookies){
        var pageCache = $cookies.get('currentCharacterPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		characterFactory.getAll($scope.currentPage, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.characters = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentCharacterPage', newPageNumber);
            characterFactory.getAll(newPageNumber, function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.characters = people;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);