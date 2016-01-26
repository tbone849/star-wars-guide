angular.module('StarWarsApp')
	.directive('detailsBadge', function(){
		return {
			restrict: 'E',
			templateUrl: '/directives/detailsBadge.html',
			transclude: true,
			scope: {
				imgUrl: "=",
				title: "="
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});