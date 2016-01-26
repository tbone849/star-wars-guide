angular.module('StarWarsApp')
	.directive('breadcrumbs', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/breadcrumbs.html',
			scope: {
				crumbs: '='
			},
			link: function(scope, element, attr){
				var crumbsString;
				scope.$watch('crumbs', function(newValue, oldValue) {
                	if (newValue){
                		scope.crumbs.forEach(function(item){
                			if(item.hasOwnProperty('url')){
                				crumbsString = '<a href="' + item.url + '">' + item.name + '</a> / ';
                			} else {
                				crumbsString = item.name;
                			}
                			angular.element(document).find('.breadcrumbs').append(crumbsString);
                		});
                	}
            	}, true);
				
			}
		};
	});