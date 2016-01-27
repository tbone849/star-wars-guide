angular.module('StarWarsApp')
	.factory('titleCase', function(){
		return function (string){
			var titledString = [];
			var splitString = string.split(' ');
			splitString.forEach(function(substring){
				if(substring === 'n/a'){
					titledString.push(substring);
				} else {
					var titledSub = substring.charAt(0).toUpperCase() + substring.slice(1);
					titledString.push(titledSub);
				}	
			});
			titledString = titledString.join(' ');
			return titledString;
		};
	});