angular.module('StarWarsApp')
	.controller('headerController', ['$scope', 'LxDialogService', function($scope, LxDialogService){
		$scope.openDialog = function(dialogId){
			LxDialogService.open(dialogId);
		};
	}]);