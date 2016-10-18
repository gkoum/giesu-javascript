function twoConceptQuery(concepts_for_search, approved_paths){
	var triples_all=[];
	var triples_table=[];
	console.log(approved_paths);
	for (i=0;i<approved_paths.length;i++){
		if(CSVtoArray(approved_paths[i]).length<3){
			console.log("Direct Relation");
			triples_table.push("Object","Predicate","Subject")
			DirectRelation(concepts_for_search).done(function(direct){
				for(j=0;j<direct[0].length;j++){
					triples_all.push(direct[0][j]);
					triples_table.push(direct[0][j].o,direct[0][j].p,direct[0][j].s);
				}
				console.log(direct[0]);
				console.log(triples_all);
				graph_draw([],[],triples_all);
				table_draw(3,triples_table,concepts_for_search[0]+" - "+concepts_for_search[1],1);//--
				table_draw(1,direct[1],concepts_for_search[0]+" - "+concepts_for_search[1],2);
				table_draw(1,direct[2],concepts_for_search[0]+" - "+concepts_for_search[1],3);
				table_draw(2,direct[3],concepts_for_search[0]+" - "+concepts_for_search[1],4);
			});
		}else if(CSVtoArray(approved_paths[i]).length==3){
			//triples_all.push(searchTwoStepRelation(path, concepts_for_search));
			//setTimeout(triples_all.push(searchTwoStepRelation(path, concepts_for_search)[0],searchTwoStepRelation(path, concepts_for_search)[1]), 10000);
		}else
			console.log("Path with more node-hops was selected. Not yet supported!");
	}
	console.log(triples_all);
	//graph_draw([],[],triples_all);
}
function DirectRelation(search_concepts){
	var deferred = $.Deferred();
	var relation_results=[]; 
	var parents_results1=[];var parents_results2=[];
	var children_results1=[];var children_results2=[];
	var properties_results1=[];var properties_results2=[];
	var results_all=[];
	var concepts_for_search=[];
	concepts_for_search[0]=search_concepts[0].split(':')[0];
	if(search_concepts[0].split(':')[1]){
		categories.push(search_concepts[0].split(':')[1]);
		console.log(categories);
	}
	concepts_for_search[1]=search_concepts[1].split(':')[0];
	console.log(search_concepts,concepts_for_search);
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
//--------------------------------------------------------------
// When a disease is given first we must go from drug->NDFRT_allInfo->Disease since we dont have another way
// starting from disease. SOme manipulation is needed on that for every query depending on the available 
// resources.
	$.when(
	findAllConceptRelations(search_concepts[0]).done(function(allConceptRelations){
		console.log(allConceptRelations,concepts_for_search[1]);
		for(i=0;i<allConceptRelations[0].length;i++){
			if (allConceptRelations[0][i].s == concepts_for_search[1]){
				relation_results.push(allConceptRelations[0][i]);
			}
		}
		for(i=0;i<allConceptRelations[2].length;i++){
			parents_results1.push(allConceptRelations[2][i]);
		}
		for(i=0;i<allConceptRelations[3].length;i++){
			children_results1.push(allConceptRelations[3][i]);
		}
		for(i=0;i<allConceptRelations[4].length;i++){
			properties_results1.push(allConceptRelations[4][i]);
		}
		console.log(relation_results,parents_results1,children_results1,properties_results1);
		//deferred.resolve(relation_results);	
	}),
	findAllConceptRelations(search_concepts[1]).done(function(allConceptRelations){
		for(i=0;i<allConceptRelations[2].length;i++){
			parents_results2.push(allConceptRelations[2][i]);
		}
		for(i=0;i<allConceptRelations[3].length;i++){
			children_results2.push(allConceptRelations[3][i]);
		}
		for(i=0;i<allConceptRelations[4].length;i++){
			properties_results2.push(allConceptRelations[4][i]);
		}
		console.log(parents_results2,children_results2,properties_results2);
		//deferred.resolve(relation_results2);	
	})
	).then(function(){
		console.log(relation_results,parents_results1,parents_results2);
		results_all.push(relation_results,parents_results1,children_results1,
			properties_results1,parents_results2,children_results2,properties_results2)
		deferred.resolve(results_all);
		console.log(results_all);
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
	var deferred = $.Deferred();
	var relation_results=[];
// Query the indirect relations: Ask for all predicates for one and examine if the objects or 
// subjects belong to the intermediate category. 
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
//For those that they do add them in a list and
// search each item of the list to see if on the other end is the second concept. If any path is 
// found return the path: c1-p1-inter-p2-c2
	console.log(relation_results);
	return deferred.promise();
	//return [{o:"ASPIRIN",p:"affects_gene",s:"g23"},{o:"g23",p:"implicates",s:"fever"}];
}