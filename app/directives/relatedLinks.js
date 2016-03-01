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
				scope.loaded = false;
				console.log(scope.loaded);
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

				var getByUrls = function(urls){
					factory.getByUrls(urls, function(err, data){
						if(err){
							scope.loaded = true;
							scope.hasError = true;
							scope.err = 'An error occured. Please try again later.';
							return console.log(err);
						} else if(data && data.length){
							scope.loaded = true;
							scope.hasData = true;
							items = data;
							scope.totalPages = Math.ceil(items.length / 5);
							scope.chunk = items.slice(slicePosition, 5);
						} else if(urls.length === 0) {
							scope.loaded = true;
						}
					});
				};

				scope.$watch('urls', function(newUrls, oldValue){
					if(newUrls === oldValue){
						if(typeof newUrls !== 'undefined'){
							getByUrls(newUrls);
						}
					} else {
						getByUrls(newUrls);
					} // end if	
				});
			} // end return
		};
	});