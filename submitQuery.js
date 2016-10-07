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
function twoConceptQuery(concepts_for_search, approved_paths){
	var triples_all=[];
	console.log(approved_paths);
	for (i=0;i<approved_paths.length;i++){
		if(CSVtoArray(approved_paths[i]).length<3){
			console.log("Direct Relation");
			searchDirectRelation(concepts_for_search).done(function(direct){
				for(j=0;j<direct.length;j++){
					triples_all.push(direct[j]);
				}
				console.log(direct);
				console.log(triples_all);
				graph_draw([],[],triples_all);
			});
		}else if(CSVtoArray(approved_paths[i]).length==3){
			//triples_all.push(searchTwoStepRelation(path, concepts_for_search));
		}else
			console.log("Path with more node-hops was selected. Not yet supported!");
	}
	//console.log(triples_all);
	//graph_draw([],[],triples_all);
}
function searchDirectRelation(concepts_for_search){
	var deferred = $.Deferred();
	var relation_results=[]; 
//--------------------------------------------------------------
// Query the direct relation. If a direct REST or SPARQL query returns the predicate ok.
	var tcrapi=twoConceptRelationsAPI(concepts_for_search);
	if(tcrapi)
		relation_results.push(tcrapi);//assuming that dac has the triples format => custom functions also adjust results format
//--------------------------------------------------------------
	var i2e_relations=twoConceptsNLP(concepts_for_search); //accepts two strings and returns String[]
	if(i2e_relations)
		relation_results.push(i2e_relations);
//--------------------------------------------------------------
// Also search for all predicates for one and see if on the other end is the other.
	findAllConceptRelations(concepts_for_search[0]).done(function(allConceptRelations){
		console.log(allConceptRelations,concepts_for_search[1]);
		for(i=0;i<allConceptRelations.length;i++){
			if (allConceptRelations[i].s == concepts_for_search[1]){
				relation_results.push(allConceptRelations[i]);
			}
		}
		console.log(relation_results);
		deferred.resolve(relation_results);	
	});
	/*var allConceptRelations=findAllConceptRelations(concepts_for_search[0]);//returns two-dimension table:[rel][c2]
	console.log(allConceptRelations);
	for(i=0;i<allConceptRelations.length;i++){
		if (allConceptRelations[i] == concepts_for_search[1]){
			relation_results.push(allConceptRelations);
		}
	}*/
	console.log(relation_results);
	return deferred.promise();
	//return relation_results;
}
function searchTwoStepRelation(path,concepts_for_search){
	console.log("searchTwoStepRelation was called");
// Query the indirect relations: Ask for all predicates for one and examine if the objects or 
// subjects belong to the intermediate category. For those that they do add them in a list and
// search each item of the list to see if on the other end is the second concept. If any path is 
// found return the path: c1-p1-inter-p2-c2
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
