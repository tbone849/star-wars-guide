angular.module('StarWarsApp')
	.directive('relatedLinks', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/relatedLinks.html',
			scope: {
				category: "@",
				data: "="
			},
			link: function(scope, element, attr){
				scope.currentPage = 1;
				var items = [];
				var slicePosition = 0;

				scope.loadNext = function(){
					scope.currentPage++;
					slicePosition += 5;
					if(scope.currentPage === scope.totalPages){
						scope.chunk = items.slice(slicePosition);
					} else {
						scope.chunk = items.slice(slicePosition, slicePosition + 5);
					}
				};

				scope.loadPrevious = function(){
					scope.currentPage--;
					slicePosition -= 5;
					scope.chunk = items.slice(slicePosition, slicePosition + 5);
				};

				scope.$watch('data', function(newValues, oldValues){
					if(newValues !== undefined){
						if(newValues.length > 0){
							element.removeClass('ng-hide');
							items = newValues;
							scope.totalPages = Math.ceil(items.length / 5);
							scope.chunk = items.slice(slicePosition, 5);
						}	
					} else {
						element.addClass('ng-hide');
					}
				});

			}
		};
	});