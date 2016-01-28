angular.module('StarWarsApp')
	.controller('planetsController', ['$scope', '$http', 'planetsFactory', '_', '$cookies', function($scope, $http, planetsFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Planets';
        
        var pageCache = $cookies.get('currentPlanetsPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		planetsFactory.getAll($scope.currentPage, function(err, planets) {
            if(err) {
                return console.log(err);
            }
            $scope.planets = planets;
            var numberOfPages = planetsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentPlanetsPage', newPageNumber);
            planetsFactory.getAll(newPageNumber, function(err, planets) {
                if(err) {
                    return console.log(err);
                }
                $scope.planets = planets;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);