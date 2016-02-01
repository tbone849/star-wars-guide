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
				scope.$watch('data', function(newValue, oldValue){
					console.log(newValue);
					if(newValue !== undefined){
						if(newValue.length > 0){
							element.removeClass('ng-hide');
						}	
					} else {
						element.addClass('ng-hide');
					}

				});
			}
		};
	});