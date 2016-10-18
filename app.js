// App.js
$(document).ready(function() {
  queryRegister("getAllInfo_NDFRT",3,"rest",{concept1:"input",category1: "Drug",category2: "Disease"});
  initial_graph();
  //graph_draw([],[],[]);
  $('#submit_b').click(function () {
    submitQuery();
  });
  $('#add_to_query').click(function(){
    addToQuery(nodesArray_initial, edgesArray_initial);
  });
  
  $('#getAllInfo').click(function(){
    var search_concept=$('#ontology_class').val();
    getAllInfo(search_concept);
  });
});
// Get all info for concept when Get info button pressed.
function getAllInfo(search_concept){
  console.log(search_concept,search_concept.split(':')[0],search_concept.split(':')[1]);
  var concept=search_concept.split(':')[0];
  findAllConceptRelations(concept).done(function(triples){
    console.log(triples);
    graph_draw([],[],triples[0]);
    table_draw(2,triples[1],concept,1,1);
    table_draw(1,triples[2],concept,2);
    table_draw(1,triples[3],concept,3);
    table_draw(2,triples[4],concept,4);
  });
}
var nodesArray_initial, edgesArray_initial, nodesNames;
var network = null;
function initial_graph(){
	nodesArray=[], edgesArray=[], nodesNames=[];
  nodesArray.push({id: 1, label: "Drug"},{id: 2, label: "Dosage"},{id: 3, label: "Target/Gene"},
  {id: 4, label: "Mutation"},{id: 5, label: "Organ"},{id: 6, label: "Protein"},
  {id: 7, label: "Disease"},{id: 8, label: "Adverse_Effect"},{id: 9, label: "Pathways"});
	
  edgesArray.push({from: 1, to: 2, label:"has_dosage", arrows:'to'},{from: 2, to: 5, label:"is_toxic_for", arrows:'to'},
  {from: 1, to: 3, label:"binds_to", arrows:'to'},{from: 3, to: 6, label:"encode", arrows:'to'},
  {from: 1, to: 6, label:"targets", arrows:'to'},{from: 5, to: 7, label:"subject_of", arrows:'to'},
  {from: 1, to: 8, label:"causes", arrows:'to'},{from: 7, to: 3, label:"affects", arrows:'to'},
  {from: 1, to: 7, label:"treats/prevents", arrows:'to'},{from: 3, to: 4, label:"has_mutation", arrows:'to'},
  {from: 3, to: 1, arrows:'to'},{from: 3, to: 7, arrows:'to'},{from: 3, to: 9, label:"associated_with", arrows:'to'},
  {from: 7, to: 5, arrows:'to'},{from: 7, to: 1, arrows:'to'});
  console.log(nodesArray[0].label);
//,{from: 1, to: 1, label:"interacts", arrows:'to'}
  graph_draw(nodesArray,edgesArray,null); // [{o:"Drug",p:"has_dosage",s:"Dosage"}]
  nodesArray_initial=nodesArray; 
  edgesArray_initial=edgesArray;
  nodesNames.push("Drug","Dosage","Target/Gene","Mutation","Organ","Protein","Disease","Adverse_Effect","Pathways");
}

/*nodesArray.push({id: 1, label: "Drug"},{id: 2, label: "Dosage"},{id: 3, label: "Target/Gene"},
  {id: 4, label: "Mutation"},{id: 5, label: "Organ"},{id: 6, label: "Cellular_Component"},
  {id: 7, label: "Disease"},{id: 8, label: "Adverse_Effect"});
  edgesArray.push({from: 1, to: 2, label:"has_dosage", arrows:'to'},{from: 2, to: 5, label:"is_toxic_for", arrows:'to'},
  {from: 1, to: 3, label:"binds_to", arrows:'to'},{from: 3, to: 6, label:"part_of", arrows:'to'},
  {from: 6, to: 5, label:"part_of", arrows:'to'},{from: 5, to: 7, label:"subject_of", arrows:'to'},
  {from: 1, to: 8, label:"causes", arrows:'to'},{from: 7, to: 3, label:"affects", arrows:'to'},
  {from: 1, to: 7, label:"treats/prevents...", arrows:'to'},{from: 3, to: 4, label:"has_mutation", arrows:'to'},
  {from: 7, to: 6, label:"affects", arrows:'to'},{from: 3, to: 1, arrows:'to'},
  {from: 3, to: 7, arrows:'to'});*/