/*
aspirin:Drug
Pain:Disease
*/
var type_of_query=0;
var concepts_for_search=[];
var paths=[{c1:'',p:'',c2:''}];
var results=[{c1:'',p:'',c2:''}];

// When the add its concept to the query is pressed 
function addToQuery(nodes, edges){
// Get concept/s from the input box -> Map them to categories (Drug, Disease) OR Drug and Relation
	var categories=[];
	var input_concept=$('#ontology_class').val();
	var query_concepts=$('#query_text').val();
	var search_concepts=[];
	var tmp_category;
	var exists=false;
  if(query_concepts){
  	query_concepts=($('#query_text').val()).split('\n');
  	for(var i=0;i<query_concepts.length;i++){
  		if(query_concepts[i]==input_concept)
  			exists=true;
  		search_concepts.push(query_concepts[i].split(':')[0]);
  		categories.push(query_concepts[i].split(':')[1]);
  		console.log(input_concept,query_concepts,search_concepts,categories,categories[0]);
  	}
  	if(exists)
  		alert("Concept already exists and cannot be added twice");
    else if(input_concept.split(':')[1]!=undefined){
			search_concepts.push(input_concept.split(':')[0]);
  		categories.push(input_concept.split(':')[1]);
  		$('#query_text').val(query_concepts+'\n'+input_concept);
		}else{
			search_concepts.push(input_concept);
			tmp_category=mapToCategory(input_concept);
			categories.push(tmp_category); // better return an array of objects:[{con:"morphine",cat:"Drug"}]
			$('#query_text').val(query_concepts+'\n'+input_concept+':'+categories[0]);
		}
    console.log(input_concept,query_concepts,search_concepts,categories,categories[0]);
  }
  else{
  	if(input_concept.split(':')[1]!=undefined){
			search_concepts.push(input_concept.split(':')[0]);
  		categories.push(input_concept.split(':')[1]);
  		$('#query_text').val(input_concept);
		}else{
			search_concepts.push(input_concept);
			tmp_category=mapToCategory(input_concept);
			categories.push(tmp_category);
			$('#query_text').val(input_concept+':'+categories[0]);
		}
		console.log(input_concept,query_concepts,search_concepts,categories,categories[0]);
    
  }
	var calculated_paths=[];

	if (search_concepts.length==1 && categories[0]!=0){ //code {concept,?,?} -> type 1
		type_of_query=1;
		console.log('Search for concept '+search_concepts[0]+' : '+categories[0]+' will be performed.');
		inform_user(type_of_query, search_concepts, []);
	}
	else if (search_concepts.length==1 && search_concepts[0]=="1 relation") {//code {?,relation,?} -> type 2
		type_of_query=2;
		console.log('Cannot recognize concept or it is relationship. Add a concept to combine with this relation');
	}
	else if (search_concepts.length==2 && (categories[0]!=0 && categories[1]!=0)){ //{concept,?,concept} -> type 3
		type_of_query=3;
		calculated_paths=twoConcepts_paths(categories, search_concepts, nodes, edges);
		inform_user(type_of_query, search_concepts, calculated_paths);
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
	var node_numbers=pathNamestoIds(categories);
	console.log(categories,node_numbers);
	paths=find(node_numbers[0],node_numbers[1], nodes, edges);
	//paths=find(1,7, nodes, edges);
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
