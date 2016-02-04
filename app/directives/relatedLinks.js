angular.module('StarWarsApp')
	.directive('relatedLinks', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/relatedLinks.html',
			scope: {
				header: "@",
				factory: '=',
				urls: '='
			},
			link: function(scope, element, attrs){
				scope.currentPage = 1;
				scope.hasError = false;
				scope.hasData = false;
				var factory = element.injector().get(attrs.factory);
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

				scope.$watch('urls', function(newUrls){
					factory.getByUrls(newUrls, function(err, data){
						if(err){
							scope.hasError = true;
							scope.err = 'An error occured. Please try again later.';
							return console.log(err);
						}
						if(data && data.length){
							scope.hasData = true;
							items = data;
							scope.totalPages = Math.ceil(items.length / 5);
							scope.chunk = items.slice(slicePosition, 5);
						}

					});
				});

			}
		};
	});