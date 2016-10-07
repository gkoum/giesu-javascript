// App.js
$(document).ready(function() {
  initial_graph();
  //graph_draw([],[],[]);
  $('#submit_b').click(function () {
    submitQuery();
  });
  $('#add_to_query').click(function(){
    //add concept to query box
    if($('#query_text').val())
      $('#query_text').val($('#query_text').val()+'\n'+$('#ontology_class').val());
    else
      $('#query_text').val($('#ontology_class').val());
    //take all added concepts categorize them and run add query
    addToQuery([1,7],nodesArray_initial, edgesArray_initial);
  });
  
  $('#getAllInfo').click(function(){
    var search_concept=$('#ontology_class').val();
    console.log(search_concept);
    findAllConceptRelations(search_concept).done(function(triples){
      console.log(triples);
      graph_draw([],[],triples);
    });
    //getAllInfo_NDFRT(search_concept);
  });
  table_draw(4,[1,2,3,4,5,6,7,8,9,0])
});
var nodesArray_initial, edgesArray_initial, nodesNames;

var network = null;
function initial_graph(){
	nodesArray=[], edgesArray=[], nodesNames=[];
  nodesArray.push({id: 1, label: "Drug"},{id: 2, label: "Dosage"},{id: 3, label: "Target/Gene"},
  {id: 4, label: "Mutation"},{id: 5, label: "Organ"},{id: 6, label: "Cellular_Component"},
  {id: 7, label: "Disease"},{id: 8, label: "Adverse_Effect"});
	edgesArray.push({from: 1, to: 2, label:"has_dosage", arrows:'to'},{from: 2, to: 5, label:"is_toxic_for", arrows:'to'},
  {from: 1, to: 3, label:"binds_to", arrows:'to'},{from: 3, to: 6, label:"part_of", arrows:'to'},
  {from: 6, to: 5, label:"part_of", arrows:'to'},{from: 5, to: 7, label:"subject_of", arrows:'to'},
  {from: 1, to: 8, label:"causes", arrows:'to'},{from: 7, to: 3, label:"affects", arrows:'to'},
  {from: 1, to: 7, label:"treats/prevents...", arrows:'to'},{from: 3, to: 4, label:"has_mutation", arrows:'to'},
  {from: 7, to: 6, label:"affects", arrows:'to'},{from: 3, to: 1, arrows:'to'},
  {from: 3, to: 7, arrows:'to'});
  console.log(nodesArray[0].label);
//,{from: 1, to: 1, label:"interacts", arrows:'to'}
  graph_draw(nodesArray,edgesArray,null); // [{o:"Drug",p:"has_dosage",s:"Dosage"}]
  nodesArray_initial=nodesArray; 
  edgesArray_initial=edgesArray;
  nodesNames.push("Drug","Dosage","Target/Gene","Mutation","Organ","Cellular_Component","Disease","Adverse_Effect")

}

//disgenet_endpoint.query(disgenet3_query_details.sparql_query).done(onSuccess_disgenet).error(onFailure_disgenet);