/*function add_to_search_input(){
  $("#ontology_class").val($("#link_add_to_search").html());
  console.log($("#link_add_to_search").html()+"fdbdf");
}
$(document).on('click','#concept_add_to_search',function(){
  if($('#concept_add_to_search').html()==="Mutation"){
    $("#link_add_to_search").html("Gene, Man, Women...");
  }
  $("#ontology_class").val($("#concept_add_to_search").html());
});*/
//------------------using https://id.nlm.nih.gov/mesh/sparql--------------------------
// ? We must create SPARQL queries dynamically or have some standard?
    var nih = new SPARQL({  
      endpoint: "https://id.nlm.nih.gov/mesh/sparql"
    });
    var query_string_nih ="PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
                          PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
                          PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>\n\
                          PREFIX mesh: <http://id.nlm.nih.gov/mesh/>\n\
                          PREFIX mesh2015: <http://id.nlm.nih.gov/mesh/2015/>\n\
                          PREFIX mesh2016: <http://id.nlm.nih.gov/mesh/2016/>\n\
                          SELECT ?d ?dName ?c\n\
                          FROM <http://id.nlm.nih.gov/mesh>\n\
                          WHERE {\n\
                          ?d meshv:concept ?c .\n\
                          ?d rdfs:label ?dName .\n\
                          FILTER(REGEX(?dName,'aspirin','i'))\n\
                          } LIMIT 50";

/*    "PREFIX mesh: <http://id.nlm.nih.gov/mesh/>\n\
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                          PREFIX mesh2015: <http://id.nlm.nih.gov/mesh/2015/>\n\
                          PREFIX mesh2016: <http://id.nlm.nih.gov/mesh/2016/>\n\
                          PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>\n\
                          SELECT *\n\
                          FROM <http://id.nlm.nih.gov/mesh>\n\
                          WHERE {\n\
                          mesh:D015242 rdfs:label ?label .\n\
                          ?s ?p mesh:D015242 .\n\
                          ?s rdfs:label ?sl\n\
                          }";*/

/*    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
                          PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
                          PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>\n\
                          PREFIX mesh: <http://id.nlm.nih.gov/mesh/>\n\
                          PREFIX mesh2015: <http://id.nlm.nih.gov/mesh/2015/>\n\
                          PREFIX mesh2016: <http://id.nlm.nih.gov/mesh/2016/>\n\
                          SELECT ?d ?dName ?c ?cName\n\
                          FROM <http://id.nlm.nih.gov/mesh>\n\
                          WHERE {\n\
                          ?d a meshv:Descriptor .\n\
                          ?d meshv:concept ?c .\n\
                          ?d rdfs:label ?dName .\n\
                          FILTER(REGEX(?dName,'mutation','i'))\n\
                          }";*/

/*    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
                        PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
                        PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>\n\
                        PREFIX mesh: <http://id.nlm.nih.gov/mesh/>\n\
                        PREFIX mesh2015: <http://id.nlm.nih.gov/mesh/2015/>\n\
                        PREFIX mesh2016: <http://id.nlm.nih.gov/mesh/2016/>\n\
                        SELECT DISTINCT ?p\n\
                        FROM <http://id.nlm.nih.gov/mesh>\n\
                        WHERE {\n\
                          ?s ?p ?o .\n\
                        }";*/

    function onFailure_nih(xhr, status) {
        document.getElementById("result_nih").innerHTML = status + " (See console.)";
        console.log("error");
        console.log(xhr);
    }

    function onSuccess_nih(json) {
      console.log("NIH ok");
        var html = "<table border='1'>";
        html += "<tr>";
        for(var h in json.head.vars){
          html += "<th>" + json.head.vars[h] + "</th>";
        }
        html += "</tr>";
        for (var b in json.results.bindings) {
            html += "<tr>";
            console.log(b);
            for (var x in json.head.vars) { 
                console.log(x);
                var value = json.results.bindings[b][json.head.vars[x]];
                console.log(value);
                if (value.type == "uri")
                    html += "<td><a href='"+value.value+"'>" + value.value + "</a></td>";
                else
                    html += "<td>" + value.value + "</td>";
            }
            html += "</tr>";
        }
        html += "</table>";
        document.getElementById("result_nih").innerHTML = html;
        document.getElementById("query_nih").innerHTML = String(query_string_nih);
    }

    //nih.query(query_string_nih).done(onSuccess_nih).error(onFailure_nih);
//-------------------------------http://data.bioontology.org/documentation API used------------------------------------------------
$(document).ready(function() {
  /*var widget_tree = $("#widget_tree").NCBOTree({
    apikey: "b93271f8-3520-4181-a160-3b88214bc034",
    ontology: "MESH",
    afterSelect: function(event, classId, prefLabel, selectedNode){
      console.log(event, classId, prefLabel, selectedNode);
    }
  });*/
  
  function biontology_API(){
    
    //nodesArray=[], edgesArray=[];
    var siteDomain_biontology = "http://data.bioontology.org";
    var api_key="b93271f8-3520-4181-a160-3b88214bc034";
    var url_biontology = "http://data.bioontology.org/search?q=aspirin";
    //http://data.bioontology.org/ontologies/SNOMEDCT/classes/http%3A%2F%2Fpurl.bioontology.org%2Fontology%2FSNOMEDCT%2F410607006
    console.log("biontology_API");
    $.ajax({
      dataType: 'json',
      crossDomain: true,
      url: url_biontology,
      data: {apikey: api_key},
      /*headers: {
        "Authorization":api_key
      },*/
      success: function(data) {
        var value;
        console.log("biontology_API: "+data.collection[0].prefLabel);
        jQuery.each( data.collection, function( i, val ) {
          //console.log(val.links.ontology);
          //console.log(val.links.children);
          console.log(val);
          // Will stop running after "three"
          //return ( val !== "three" );
          console.log(i);
          value=val.links.children;
        });
        console.log(value);
        $.ajax({
            dataType: 'json',
            crossDomain: true,
            url: value,
            data: {apikey: api_key},
            success: function(data) {
              if(data.collection[0])
              console.log("biontology_API 2: "+data.collection[0].prefLabel);
              /*jQuery.each( data.collection, function( i, val ) {
                console.log(val.links.ontology);
                console.log(val.links.children);
                console.log(val.cui);
                // Will stop running after "three"
                return ( val !== "three" );*/
              //});
            }
          });
      }
    });
  }
  //biontology_API();
});
//"You must provide an API Key either using the query-string parameter `apikey` or the `Authorization` header: `Authorization: apikey token=my_apikey`. Your API Key can be obtained by logging in at http://bioportal.bioontology.org/account"
//-------------------------------// NDF-RT Rxnav API used----------------
//https://rxnav.nlm.nih.gov/REST/Ndfrt/search?conceptName=morphine-------
  // function getAllInfo_NDFRT(search_concept) {
  //   nodesArray=[], edgesArray=[];
  //   var siteDomain_ndfrt = "http://rxnav.nlm.nih.gov/REST/Ndfrt"
  //   transitive="true";
  //   var url_ndf = siteDomain_ndfrt + "/search?conceptName="+search_concept;  
  //   var triplesArray=[]; 
  //   var triple={};     
  //   //var html = "<table border='1'>";
  //   $.ajax({
  //     dataType: 'json',
  //     url: url_ndf,
  //     //async: false,
  //     success: function(data) {
  //       console.log(data.groupConcepts[0].concept[0].conceptName);
  //       concept_nui=data.groupConcepts[0].concept[0].conceptNui;
  //       console.log(concept_nui);
  //       nodesArray.push({id: 1, label: data.groupConcepts[0].concept[0].conceptName});
  //       $.ajax({
  //         dataType: 'json',
  //         url: "https://rxnav.nlm.nih.gov/REST/Ndfrt/allInfo.json?nui="+concept_nui,
  //         //async: false,
  //         success: function(data2) {
  //           var for_table=[];
  //           //var html = "<table border='1'>";
  //           for_table.push("Concepts Relationships","... with Class");
  //           //html += "<tr><th>Concepts Relationships</th><th>... with Class</th></tr>";
  //           console.log(data2.responseType.inputNui1);
  //           var node_number=1, num=0;
  //           if (data2.fullConcept.groupRoles[0]!=null)
  //             for (i=0; i<data2.fullConcept.groupRoles[0].role.length; i++){
  //               console.log(data2.fullConcept.groupRoles[0].role[i].roleName+"  "+data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName); 
  //               for_table.push(data2.fullConcept.groupRoles[0].role[i].roleName, data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName);
  //               //html += "<tr><td><input checked type='checkbox' name='relation"+i+"' value='Relation'>" + data2.fullConcept.groupRoles[0].role[i].roleName + "</td><td>"+data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName+"</td></tr>";
  //               /*triple.o=data.groupConcepts[0].concept[0].conceptName;
  //               triple.p=data2.fullConcept.groupRoles[0].role[i].roleName;
  //               triple.s=data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName;
  //               triplesArray.push(triple.o,triple.p,triple.s);
  //               console.log(triple);
  //               console.log(triplesArray);*/
  //               triplesArray.push({o:data.groupConcepts[0].concept[0].conceptName,
  //                                 p:data2.fullConcept.groupRoles[0].role[i].roleName,
  //                                 s:data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
  //               nodesArray.push({id: i+2, label: data2.fullConcept.groupRoles[0].role[i].concept[0].conceptName});
                
  //               edgesArray.push({from: 1, to: i+2, label:data2.fullConcept.groupRoles[0].role[i].roleName});
  //               node_number=i+1;
  //               console.log(node_number);

  //               console.log(nodesArray[i]);
  //             }
  //             //html += "</table>"
  //             //$("#relationships").html(html);
  //             table_draw(2,for_table);
  //             var parents = "<table border='1'><tr><th>Parents</th></tr>";
  //             if (data2.fullConcept.parentConcepts[0]!=null){
  //               for (i=0; i<data2.fullConcept.parentConcepts[0].concept.length; i++){
  //                 console.log(data2.fullConcept.parentConcepts[0].concept[i].conceptName+" id: "+ node_number+i+1);
  //                 parents += "<tr><td><input checked type='checkbox' name='parent"+i+"' value='Parent'>"+data2.fullConcept.parentConcepts[0].concept[i].conceptName+"</td></tr>"; 
  //                 //nodesArray.push({id: node_number+i+2, label: data2.fullConcept.parentConcepts[0].concept[i].conceptName});
  //                 //edgesArray.push({from: 1, to: node_number+i+2, label:"has parent"});
  //                 num=i;
  //                 console.log(num);
  //               }
  //             }
  //             node_number=node_number+num+1;
  //             console.log(node_number);
  //             parents += "</table>";
  //             $("#parents").html(parents);
  //             var children = "<table border='1'><tr><th>Children</th></tr>";
  //             if (data2.fullConcept.childConcepts[0]!=null){
  //               for (i=0; i<data2.fullConcept.childConcepts[0].concept.length; i++){
  //                 console.log(data2.fullConcept.childConcepts[0].concept[i].conceptName);
  //                 children += "<tr><td id='child"+i+"'><input checked type='checkbox' name='child"+i+"' value='Child'>"+data2.fullConcept.childConcepts[0].concept[i].conceptName+"</td></tr>";
  //                 //nodesArray.push({id: node_number+i+2, label: data2.fullConcept.childConcepts[0].concept[i].conceptName}); 
  //                 //edgesArray.push({from: 1, to: node_number+i+2, label:"has child"});
  //               }
  //             }  
  //             children += "</table>";
  //             $("#children").html(children);
  //             var ch = "1";
  //             $( "#child"+ch ).click(function() {
  //               //alert( "Handler for .click() called." );
  //               may_treat();
  //             });
  //             console.log(nodesArray);
  //             destroy();
  //             graph_draw(nodesArray,edgesArray,null);
  //             console.log(nodesArray);
  //   console.log(nodesArray[0]);
  //   console.log(triplesArray);
  //   console.log(triplesArray[0]);
  //   //return triplesArray;
  //         }
  //       });
  //     }
  //   });
  //   console.log(nodesArray);
  //   console.log(nodesArray[0]);
  //   console.log(triplesArray);
  //   console.log(triplesArray[0]);
  //   return triplesArray;
  // }
    function may_treat(){
      alert("may_treat used");
      nodesArray=[], edgesArray=[];
      var siteDomain_ndfrt = "http://rxnav.nlm.nih.gov/REST/Ndfrt"
      var nui = "N0000145914";
      //roleName = "has_PE {NDFRT}";
      transitive="true";
      var url_ndf = siteDomain_ndfrt + "/search?conceptName="+$('#ontology_class').val();
      //url_ndf = url_ndf+encodeURIComponent(nui)+"&transitive="+encodeURIComponent(transitive);
      
      $.ajax({
        dataType: 'json',
        url: url_ndf,
        success: function(data) {
          console.log(data.groupConcepts[0].concept[0].conceptName);
          concept_nui=data.groupConcepts[0].concept[0].conceptNui;
          console.log(concept_nui);
          nodesArray.push({id: 1, label: data.groupConcepts[0].concept[0].conceptName});
          //https://rxnav.nlm.nih.gov/REST/Ndfrt/role?nui=N0000000478&roleName=may_treat%20{NDFRT}&transitive=false
          $.ajax({
            dataType: 'json',
            url: "https://rxnav.nlm.nih.gov/REST/Ndfrt/role?nui="+concept_nui+"&roleName=may_treat%20{NDFRT}&transitive=false",
            success: function(data2) {
              console.log(data2.responseType.inputRoleName);
              
              for (i=0; i<data2.groupConcepts[0].concept.length; i++){
                console.log(data2.groupConcepts[0].concept[i].conceptName);
              
                nodesArray.push({id: i+2, label: data2.groupConcepts[0].concept[i].conceptName});
                console.log(nodesArray.length);
                edgesArray.push({from: 1, to: i+2, label:data2.responseType.inputRoleName}); 
              }
              destroy();
              graph_draw([],[],[]);
            }
          });
        }
      });
    }
    
//---------------------------------Using the http://sparql.bioontology.org/sparql/-----------------------------------------------------
    var bioportal = new SPARQL({ 
      apikey: "b93271f8-3520-4181-a160-3b88214bc034", 
      endpoint: "http://sparql.bioontology.org/sparql/"
    });
    var query_string = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                        SELECT DISTINCT * \n\
                        FROM <http://bioportal.bioontology.org/ontologies/SNOMEDCT>\n\
                        FROM <http://bioportal.bioontology.org/ontologies/globals>\n\
                        WHERE { \n\
                           <http://purl.bioontology.org/ontology/SNOMEDCT/93222003> rdfs:label ?label .  \n\
                        }";
//                            <http://purl.bioontology.org/ontology/SNOMEDCT/93222003> ?pr ?nei .  \n\
/*    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                        SELECT DISTINCT * \n\
                        FROM <http://bioportal.bioontology.org/ontologies/SNOMEDCT>\n\
                        FROM <http://bioportal.bioontology.org/ontologies/globals>\n\
                        WHERE { \n\
                           ?x rdfs:label ?label .  \n\
                           ?x rdfs:subClassOf ?parent .  \n\
                           ?parent rdfs:label ?parentLabel .\n\
                           FILTER (CONTAINS ( UCASE(str(?label)), \"MELANOMA\") && CONTAINS ( UCASE(str(?parentLabel)), \"MEATUS\") )\n\
                           OPTIONAL {?x ?pre ?s}\n\
                        }";*/
    /*var query_string = "PREFIX omv: <http://omv.ontoware.org/2005/05/ontology#>\n\
                        SELECT ?ont ?name ?acr \n\
                        WHERE { \n\
                           ?ont a omv:Ontology .  \n\
                           ?ont omv:acronym ?acr.  \n\
                           ?ont omv:name ?name .\n\
                           FILTER (str(?acr)='NDFRT')\n\
                        }";*/

    function onFailure(xhr, status) {
        $("#result").html(status + " (See console.)");
        console.log("error");
        console.log(xhr);
    }

    function onSuccess(json) {
        var biontology_sparql = "<table border='1'>";
        for (var b in json.results.bindings) {
            biontology_sparql += "<tr>";
            for (var x in json.head.vars) { 
                var value = json.results.bindings[b][json.head.vars[x]];
                if (value.type == "uri")
                    biontology_sparql += "<td><a href='"+value.value+"'>" + value.value + "</a></td>";
                else
                    biontology_sparql += "<td>" + value.value + "</td>";
            }
            biontology_sparql += "</tr>";
        }
        biontology_sparql += "</table>";
        $("#result").html(biontology_sparql);
        $("#query").html(String(query_string));
    }

    //bioportal.query(query_string).done(onSuccess).error(onFailure);

/*Connect with external sites:
var DRUG_LABEL_URL_PREFIX = "https://dailymed.nlm.nih.gov/dailymed/rxcui.cfm?rxcui=";
$("#drugLabelId").click(function() {var url = DRUG_LABEL_URL_PREFIX + globalRxcui; window.open(url, "_blank");});

var MEDLINE_URL_PREFIX = "https://apps.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.c=%20";
$("#medlineplusId").click(function() {
var url = MEDLINE_URL_PREFIX + globalRxcui + "%20";
window.open(url, "_blank");
});

var DRUGPORTAL_URL_PREFIX = "http://druginfo.nlm.nih.gov/drugportal/dpdirect.jsp?name=";
$("#drugInfoId").click(
function() {
var url = DRUGPORTAL_URL_PREFIX
+ displayName.replace(" ", "%20");
window.open(url, "_blank");
});*/
