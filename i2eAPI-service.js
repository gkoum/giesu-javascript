var searched_concepts=[];
var categories=[]; // caches all mappings. Refresh with each new query
function mapToCategory(search_concepts){
	/*if(search_concepts[0].split(':')){
		console.log(search_concepts[0].split(':')[0]);
	}*/
	console.log("i2eAPI-service invoked: MapToCategory");
	searched_concepts.push("Morphine");
	categories.push("Drug");
	return "Drug";
}

function twoConceptsNLP(concepts){
	console.log("search for relationships between concepts: "+concepts[0]+"    "+concepts[1]);
}