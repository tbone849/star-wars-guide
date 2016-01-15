angular.module('StarWarsApp', ['lumx'])
	.controller('test', ['$scope', '$http', 'PeopleFactory', function($scope, $http, PeopleFactory){

		PeopleFactory.getPeople(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            console.log(people);
        });
         
	}]);