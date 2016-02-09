angular.module('StarWarsApp')
	.factory('wikiaFactory', ['$http', function($http){

		return {
			getAbstract: function(search, cb){
				$http.jsonp('http://starwars.wikia.com/api/v1/Search/List/?callback=JSON_CALLBACK&limit=1&query=' + search)
					.then(function(response){
						cb(null, response);
					}, function(err){
						cb(err);
					});
			}
		};
	}]);