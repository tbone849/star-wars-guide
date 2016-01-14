angular.module('StarWarsApp', ['lumx'])
	.controller('hello', ['$scope', function($scope){
		$scope.name = 'Tim';
	}]);