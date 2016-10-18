// Here all related API calls or SPARQL queries can be added. 
// Functions will be dynamically added to custom_extension.js and call added from the db here again on download
// Parameter (concept) will be standard and also added 
// There is also a need to gather all results in a single list for presentation
function findAllConceptRelations(concept){
	var deferred = $.Deferred();
	var allRelationResults=[];
	var ndfrt=[];
	var category=concept.split(':')[1];
	var concept=concept.split(':')[0];
	//search for the category of the specific concept in categories[{}] and decide which sub-queries to use
	var index=searched_concepts.indexOf(concept); // cache concepts already categorized when added to query
	console.log(categories,concept,searched_concepts,index);
	/*if(index!=-1){
		category=categories[index].cat;
		console.log(category);
	}else{ // the get_info case where no addition to the query and categorization has happened
		category=mapToCategory(concept)[0].cat;
	}*/
	if(category=="Drug"){
		getAllInfo_NDFRT(concept).done(function(ndfrt){
			console.log(ndfrt);
			console.log(ndfrt.length);
			for(i=0;i<ndfrt.length;i++){
				console.log(ndfrt[i]);
				allRelationResults.push(ndfrt[i]);
			}
			console.log(allRelationResults);
			//graph_draw([],[],allRelationResults);
			//return allRelationResults;
			deferred.resolve(allRelationResults);
		});		// the parents and children may be removed	
	}
	else if(category=="Disease"){
		getAllInfo_NDFRT(concept).done(function(ndfrt){
			console.log(ndfrt);
			console.log(ndfrt.length);
			for(i=0;i<ndfrt.length;i++){
				console.log(ndfrt[i]);
				allRelationResults.push(ndfrt[i]);
			}
			console.log(allRelationResults);
			//graph_draw([],[],allRelationResults);
			//return allRelationResults;
			deferred.resolve(allRelationResults);
		});		// the parents and children may be removed	
	}
	else if(category=="Target/Gene"){
		disgenet_endpoint.query(disgenet3_query_details.sparql_query).done(onSuccess_disgenet).error(onFailure_disgenet);
	}
	else
		alert("No category from the graph was found for the concept. Please provide the category in the following format: concept:category");
  return deferred.promise();
}
// This function needs to be mapped to the kind of query:(c1:C1, C2) and define C1=Drug, C2=Disease
// For the engine to know what function to use in certain query a mapping is done in the findAllConceptRelation
// for this kind of queries. 
function getAllInfo_NDFRT(search_concept) {
	var deferred = $.Deferred();
  //nodesArray=[], edgesArray=[];
  var siteDomain_ndfrt = "http://rxnav.nlm.nih.gov/REST/Ndfrt"
  transitive="true";
  var url_ndf = siteDomain_ndfrt + "/search?conceptName="+search_concept;  
  var triplesArray=[]; 
  //var triple={};     
  $.ajax({
    dataType: 'json',
    url: url_ndf,
    success: function(data) {
      console.log(data.groupConcepts[0].concept[0].conceptName);
      concept_nui=data.groupConcepts[0].concept[0].conceptNui;
      //There can be a second conceptNui for another Kind like Aspirin:Drug_Kind, Ingredient_Kind=data.groupConcepts[0].concept[1].conceptNui
      console.log(concept_nui);
      nodesArray.push({id: 1, label: data.groupConcepts[0].concept[0].conceptName});
      var concept_info=data.groupConcepts[0].concept[0].conceptName;
      $.ajax({
        dataType: 'json',
        url: "https://rxnav.nlm.nih.gov/REST/Ndfrt/allInfo.json?nui="+concept_nui,
        success: function(data2) {
          var relations_table=[];
          relations_table.push("Concepts Relationships","... with Class");
          console.log(data2.responseType.inputNui1);
          var node_number=1, num=0;
          if (data2.fullConcept.groupRoles[0]!=null){
            for (i=0; i<data2.fullConcept.groupRoles[0].role.length; i++){
              console.log(data2.fullConcept.groupRoles[0].role[i].roleName+"  "+data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName); 
              relations_table.push(data2.fullConcept.groupRoles[0].role[i].roleName, data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName);
              triplesArray.push({o:data.groupConcepts[0].concept[0].conceptName,
                                p:data2.fullConcept.groupRoles[0].role[i].roleName,
                                s:data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
              //nodesArray.push({id: i+2, label: data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
              //edgesArray.push({from: 1, to: i+2, label:data2.fullConcept.groupRoles[0].role[i].roleName});
              node_number=i+1;
              console.log(node_number);
              console.log(nodesArray[i]);
            }
            //table_draw(2,relations_table,concept_info,1,1);
          }
          else{
          	triplesArray=null;
          }
          var parents = [];
          parents.push('Parents');
          if (data2.fullConcept.parentConcepts[0]!=null){
            for (i=0; i<data2.fullConcept.parentConcepts[0].concept.length; i++){
              console.log(data2.fullConcept.parentConcepts[0].concept[i].conceptName+" id: "+ node_number+i+1);
              parents.push(data2.fullConcept.parentConcepts[0].concept[i].conceptName); 
              num=i;
              console.log(num);
            }
            //table_draw(1,parents,concept_info,2);
          }
          node_number=node_number+num+1;
          console.log(node_number);
          //table_draw(1,parents,concept_info,2);
          var children = [];
          children.push('Children');
          if (data2.fullConcept.childConcepts[0]!=null){
            for (i=0; i<data2.fullConcept.childConcepts[0].concept.length; i++){
              console.log(data2.fullConcept.childConcepts[0].concept[i].conceptName);
              children.push(data2.fullConcept.childConcepts[0].concept[i].conceptName);
            }
            //table_draw(1,children,concept_info,3);
          }
          var properties = [];
          //properties.push('Properties');
          if (data2.fullConcept.groupProperties[0]!=null){
          	properties.push("propertyName","propertyValue");
            for (i=0; i<data2.fullConcept.groupProperties[0].property.length; i++){
              properties.push(data2.fullConcept.groupProperties[0].property[i].propertyName,data2.fullConcept.groupProperties[0].property[i].propertyValue);
            }
            //table_draw(2,properties,concept_info,4);
          }
          //table_draw(1,children,concept_info,3);
          console.log(nodesArray);
          destroy();
          //graph_draw(nodesArray,edgesArray,null);
			    deferred.resolve([triplesArray,relations_table,parents,children,properties]);
        }
      });
    }
  });
  return deferred.promise();
}
/*Morphine
Asthma
angelos77!
*/
