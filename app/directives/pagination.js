angular.module('StarWarsApp')
	.directive('pagination', ['$location', function($location){
		return {
			restrict: 'E',
			templateUrl: './directives/pagination.html',
			scope: {
				currentPage: "=",
				pages: "="
			},
			link: function(scope, element, attr){
				scope.isCurrentPage = function(number){
					return (number === parseInt(scope.currentPage));
				};

				scope.getNewPage = function(newPageNumber){
					$location.search('page', newPageNumber);
				};		
			}
		};
	}]);