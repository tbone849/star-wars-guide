angular.module('StarWarsApp').
	filter('textOrNumber', ['$filter', function ($filter) {
	    return function (input, fractionSize) {
	        if (isNaN(input)) {
	            return input;
	        } else {
	            return $filter('number')(input, fractionSize);
	        }
	    };
	}]);