// Here all related API calls or SPARQL queries can be added. 
// Functions will be dynamically added to custom_extension.js and call added from the db here again on download
// Parameter (concept) will be standard and also added 
// There is also a need to gather all results in a single list for presentation
function findAllConceptRelations(concept){
	var deferred = $.Deferred();
	var allRelationResults=[];
	var ndfrt=[];
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
  return deferred.promise();
}
function getAllInfo_NDFRT(search_concept) {
	var deferred = $.Deferred();
  nodesArray=[], edgesArray=[];
  var siteDomain_ndfrt = "http://rxnav.nlm.nih.gov/REST/Ndfrt"
  transitive="true";
  var url_ndf = siteDomain_ndfrt + "/search?conceptName="+search_concept;  
  var triplesArray=[]; 
  var triple={};     
  $.ajax({
    dataType: 'json',
    url: url_ndf,
    success: function(data) {
      console.log(data.groupConcepts[0].concept[0].conceptName);
      concept_nui=data.groupConcepts[0].concept[0].conceptNui;
      console.log(concept_nui);
      nodesArray.push({id: 1, label: data.groupConcepts[0].concept[0].conceptName});
      var concept_info=data.groupConcepts[0].concept[0].conceptName;
      $.ajax({
        dataType: 'json',
        url: "https://rxnav.nlm.nih.gov/REST/Ndfrt/allInfo.json?nui="+concept_nui,
        success: function(data2) {
          var for_table=[];
          for_table.push("Concepts Relationships","... with Class");
          console.log(data2.responseType.inputNui1);
          var node_number=1, num=0;
          if (data2.fullConcept.groupRoles[0]!=null)
            for (i=0; i<data2.fullConcept.groupRoles[0].role.length; i++){
              console.log(data2.fullConcept.groupRoles[0].role[i].roleName+"  "+data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName); 
              for_table.push(data2.fullConcept.groupRoles[0].role[i].roleName, data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName);
              triplesArray.push({o:data.groupConcepts[0].concept[0].conceptName,
                                p:data2.fullConcept.groupRoles[0].role[i].roleName,
                                s:data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
              nodesArray.push({id: i+2, label: data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
              edgesArray.push({from: 1, to: i+2, label:data2.fullConcept.groupRoles[0].role[i].roleName});
              node_number=i+1;
              console.log(node_number);

              console.log(nodesArray[i]);
            }
            table_draw(2,for_table,concept_info,1);
            var parents = [];//"<table border='1'><tr><th>Parents</th></tr>";
            if (data2.fullConcept.parentConcepts[0]!=null){
              for (i=0; i<data2.fullConcept.parentConcepts[0].concept.length; i++){
                console.log(data2.fullConcept.parentConcepts[0].concept[i].conceptName+" id: "+ node_number+i+1);
                parents.push(data2.fullConcept.parentConcepts[0].concept[i].conceptName); 
                num=i;
                console.log(num);
              }
            }
            node_number=node_number+num+1;
            console.log(node_number);
            //table_draw(1,parents,concept_info,2);
            var children = [];
            if (data2.fullConcept.childConcepts[0]!=null){
              for (i=0; i<data2.fullConcept.childConcepts[0].concept.length; i++){
                console.log(data2.fullConcept.childConcepts[0].concept[i].conceptName);
                children.push(data2.fullConcept.childConcepts[0].concept[i].conceptName);
              }
            }  
            //table_draw(1,children,concept_info,3);
            console.log(nodesArray);
            destroy();
            //graph_draw(nodesArray,edgesArray,null);
				    deferred.resolve(triplesArray);
        }
      });
    }
  });
  return deferred.promise();
}
/*Morphine
Asthma*/
// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};