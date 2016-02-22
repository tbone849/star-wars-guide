angular.module('StarWarsApp')
	.directive('pagination', ['$location', '_', function($location, _){
		return {
			restrict: 'E',
			templateUrl: './directives/pagination.html',
			scope: {
				currentPage: "=",
				pages: "="
			},
			link: function(scope, element, attr){

				scope.$watch('pages', function(newValue){
					if(newValue){
						if(scope.currentPage < 4 || scope.pages.length < 6){
							scope.start = 0;
						} else if(scope.pages.length - scope.currentPage < 3){
								scope.start = scope.pages.length - 5;
						} else {
							scope.start = scope.currentPage - 3;
						}
					}
					
				});

				scope.isCurrentPage = function(number){
					return (number === parseInt(scope.currentPage));
				};

				scope.getNewPage = function(newPageNumber){
					$location.search('page', newPageNumber);
				};


			}
		};
	}]);