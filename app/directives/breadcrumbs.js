angular.module('StarWarsApp')
	.directive('breadcrumbs', function(){
		return {
			restrict: 'E',
			templateUrl: '/directives/breadcrumbs.html',
			scope: {
				category: "=",
				subcategory: "=",
				data: "="
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});