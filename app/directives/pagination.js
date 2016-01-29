angular.module('StarWarsApp')
	.directive('pagination', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/pagination.html',
			scope: {
				currentPage: "=",
				pages: "=",
				action: "&clickAction"
			},
			link: function(scope, element, attr){
				scope.isCurrentPage = function(number){
					return (number === parseInt(scope.currentPage));
				};				
			}
		};
	});