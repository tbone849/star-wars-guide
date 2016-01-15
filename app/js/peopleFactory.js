angular.module('StarWarsApp')
	.factory('PeopleFactory', ['$http', function($http){
		function titleCase(string){
			var titledString = string.replace(/\b(\w)/g, function capitalize(letter){
				return letter.toUpperCase();
			});

			return titledString;
		}

		return {
			getPeople: function(callback)	{
				$http.get('http://swapi.co/api/people/')
					.then(function(response) {
						var peopleResponse = response.data.results;
						var people = [];
						for (x = 0; x < peopleResponse.length; x++){
							people[x] = {
								name: peopleResponse[x].name,
								birth_year: peopleResponse[x].birth_year,
								hair_color: titleCase(peopleResponse[x].hair_color),
								skin_color: titleCase(peopleResponse[x].skin_color),
								gender: titleCase(peopleResponse[x].gender),
								height: peopleResponse[x].height + "cm",
								mass: peopleResponse[x].mass + "kg"
							};
						}
            			callback(null, people);
            	}, function(err) {
            		callback(err);
            	});
			}
		};
	}]);