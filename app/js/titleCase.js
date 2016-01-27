angular.module('StarWarsApp')
	.factory('titleCase', function(){
		return function (string){
			var titledString = [];
			var splitString = string.split(' ');
			splitString.forEach(function(substring){
				var titledSub = substring.charAt(0).toUpperCase() + substring.slice(1);
				titledString.push(titledSub);
			});
			titledString = titledString.join(' ');
			return titledString;
		};
	});