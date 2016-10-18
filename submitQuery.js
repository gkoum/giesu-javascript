// When the submit query is pressed 
function submitQuery(){ 	//uses: type_of_query, concepts_for_search[], paths[]
// Get approved paths by checking the ticks
	var approved_paths=[]; //[{c1:'',p:'',c2:''}]
	var inputPaths = document.getElementsByName("paths");
	console.log(inputPaths);
	for(var i=0; i<inputPaths.length; i++){
		console.log(inputPaths[i]);
    if(inputPaths[i].checked){
       approved_paths.push(inputPaths[i].value);
       console.log(inputPaths[i].value);
    }
	}
	console.log(approved_paths);
	console.log($("#query_text").val());
	var query_concepts=($("#query_text").val()).match(/[^\r\n]+/g);
	console.log(query_concepts);
// Get the type of query already calculated along with the concepts[] and approved_paths[] and formulate the sub-queries
	if (type_of_query==1)
		findAllConceptRelations(query_concepts[0]);
	else if (type_of_query==2)
		alert('Add a concept to combine with this relation');
	else if (type_of_query==3)
		twoConceptQuery(query_concepts, approved_paths);
	else if (type_of_query==4)
		conceptRelationQuery(query_concepts, approved_paths);
	else if (type_of_query==5)
		threeConceptQuery(query_concepts, approved_paths);
	else
		alert("wrong concepts given");
}

function conceptRelationQuery(concepts_for_search){
//	Find if this is a relation/relations of the concept
	var concept_relations;
	concept_triples=findAllConceptRelations(concepts_for_search[0]); //returns triples {c1,p,c2} with c1 the same
	for (relation in concepts_triples) // loop through predicates
		for (search_relation in concepts_for_search)
			if (relation==search_relation)  //For every relation of the concept that matches the given relations
				results.push(triple); 		//push the associated triple into results for presentation 
	return results;
}
