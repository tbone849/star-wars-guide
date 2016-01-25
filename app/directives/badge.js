angular.module('StarWarsApp')
	.directive('badge', function(){
		return {
			restrict: 'E',
			templateUrl: '/directives/badge.html',
			scope: {
				category: "=",
				data: "="
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});