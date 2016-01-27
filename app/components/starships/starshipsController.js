angular.module('StarWarsApp')
	.controller('starshipsController', ['$scope', '$http', 'starshipsFactory', '_', '$cookies', function($scope, $http, starshipsFactory, _, $cookies){

        $scope.crumbsArray = [
            { url: '#/', name: 'Home' },
            { name: 'Starships' }
        ];
        var pageCache = $cookies.get('currentStarshipsPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		starshipsFactory.getAll($scope.currentPage, function(err, starships) {
            if(err) {
                return console.log(err);
            }
            $scope.starships = starships;
            var numberOfPages = starshipsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentStarshipsPage', newPageNumber);
            starshipsFactory.getAll(newPageNumber, function(err, starships) {
                if(err) {
                    return console.log(err);
                }
                $scope.starships = starships;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);