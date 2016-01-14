angular.module('StarWarsApp', ['lumx'])
	.controller('test', ['$scope', '$http', 'PeopleFactory', function($scope, $http, PeopleFactory){
		$scope.name = 'Tim';

		PeopleFactory()
            .then(function(response){
                $scope.people = response.data.results;
                console.log($scope.people);
            }, function(error){
                console.log(error);
            });
	}]);