angular.module('StarWarsApp')
	.factory('urlsFactory', ['$http', '$q', function($http, $q){
		return {
			getRelatedData: function(urls, cb){

				var urlCalls = [];
				angular.forEach(urls, function(url) {
					urlCalls.push($http.get(url, {cache:true}));
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						cb(null, results);
					},
					function(errors) {
						cb(errors);
					}
				);
			}
		};
	}]);