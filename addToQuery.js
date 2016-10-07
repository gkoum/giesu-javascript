var type_of_query=0;
var concepts_for_search=[];
var paths=[{c1:'',p:'',c2:''}];
var results=[{c1:'',p:'',c2:''}]
// When the add its concept to the query is pressed 
function addToQuery(search_concepts, nodes, edges){
// Get concept/s from the input box -> Map them to categories (Drug, Disease) OR Drug and Relation
	var categories; // []
	var calculated_paths;
	categories=mapToCategory(search_concepts);
	if (search_concepts.length==1 && categories[0]!=0){ //code {concept,?,?} -> type 1
		type_of_query=1;
		console.log('Search for concept '+search_concepts[0]+' : '+categories[0]+' will be performed.');
	}
	else if (search_concepts.length==1 && search_concepts[0]=="1 relation") {//code {?,relation,?} -> type 2
		type_of_query=2;
		console.log('Cannot recognize concept or it is relationship. Add a concept to combine with this relation');
	}
	else if (search_concepts.length==2 && (categories[0]!=0 && categories[1]!=0)){ //{concept,?,concept} -> type 3
		type_of_query=3;
		calculated_paths=twoConcepts_paths(categories, search_concepts, nodes, edges);
		inform_user(type_of_query, calculated_paths);
	}
	else if (search_concepts.length==2 && (categories[0]!=0 || categories[1]!=0)){ //{concept,relation,?} -> type 4
		type_of_query=4;
		conceptRelation(categories, search_concepts, nodes, edges);
	}
	else if (search_concepts=="3 concepts"){ //code {concept,?,concept} x 3 -> type 5
		type_of_query=5;
		threeConcepts(categories, search_concepts, nodes, edges);
	}
	else
		alert("wrong concepts given");
	return calculated_paths;
}
function twoConcepts_paths(categories, search_concepts, nodes, edges){
// 2 specific concepts from different categories
// Search for paths and present them to user: calls the path-finder service
	//var pfs = new PathFinderService();
	var paths=[];
	//paths=pfs.find(categories[0],categories[1], nodes, edges);
	paths=find(1,7, nodes, edges);
	console.log(nodes);
	console.log(paths);
	var each_path=[];
	var final_paths=[];
	for(i=0;i<paths.length;i++){
		each_path=paths[i].split(",");
		if(each_path.length<=3){
			final_paths.push(each_path);
			if(each_path.length<3){
				console.log("Direct Relationship");
			}
			else if(each_path.length==3){
				console.log("Indirect Relationship through node: "+ each_path[1]);
			}
		}
		console.log(each_path);
	}
	console.log(final_paths);

	return final_paths;
}
function conceptCategory_paths(concept,category){
// 1 specific and 1 category eg. All associated genes according to a given disease	
}
// No search for alternative paths needed since exact relationship is given
function conceptRelation(categories,search_concepts, nodes, edges){
// Look for synonyms or relative relations through i2e?
	var relative_relations = FindRelative(categories,search_concepts);
// Get all relations of concept and filter OR ask for specific concept-relation combination if allowed
	

}
function threeConcepts(categories,search_concepts, nodes, edges){
// 2 specific from one Category and a Category eg. (2 from C1, C2)
//	 Give me all the genes shared with two specific diseases introduced 
// 1 specific from one Category and a 2 times the same Category eg. (1 from C1, 2 C2)
//	 Give me all disease-disease associations related to a gene introduced
// 1 specific from one Category the same Category and another Category eg. (1 from C1, C1, C2)
//	 Give me all disease-disease associations related to a gene according to the disease name introduced
// 1 specific from a Category and two more Categories eg. (1 from C1, C2, C3) 
//	 the same with (1 from C1, 2 C2)???
//
}
