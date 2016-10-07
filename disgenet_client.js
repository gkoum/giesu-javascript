//---------------------------------Using the http://rdf.disgenet.org/sparql/--------------------------
var disgenet3_c1='"Alzheimer\'s Disease"';
var disgenet3_query_details=new query_details(
  [{concept1:disgenet3_c1},{category1: "Disease"},{category2: "Gene"}],
  3,
  'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
  PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
  PREFIX dcterms: <http://purl.org/dc/terms/>\n\
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
  PREFIX void: <http://rdfs.org/ns/void#>\n\
  PREFIX sio: <http://semanticscience.org/resource/>\n\
  PREFIX ncit: <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#>\n\
  PREFIX up: <http://purl.uniprot.org/core/>\n\
  PREFIX dcat: <http://www.w3.org/ns/dcat#>\n\
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>\n\
  PREFIX wi: <http://http://purl.org/ontology/wi/core#>\n\
  PREFIX eco: <http://http://purl.obolibrary.org/obo/eco.owl#>\n\
  PREFIX prov: <http://http://http://www.w3.org/ns/prov#>\n\
  PREFIX pav: <http://http://http://purl.org/pav/>\n\
  PREFIX obo: <http://purl.obolibrary.org/obo/> \n\
  SELECT DISTINCT ?gene ?geneName ?score \n\
  FROM <http://rdf.disgenet.org> \n\
  WHERE { \n\
  ?gda sio:SIO_000628 ?gene,?disease ; \n\
       sio:SIO_000216 ?scoreIRI . \n\
  ?gene rdf:type ncit:C16612 ; \n\
        dcterms:title ?geneName . \n\
  ?disease rdf:type ncit:C7057 ; \n\
           dcterms:title '+disgenet3_c1+'@en . \n\
  ?scoreIRI sio:SIO_000300 ?score . \n\
  FILTER (?score > "0.29"^^xsd:decimal) } \n\
  ORDER BY DESC(?score)');


//console.log(disgenet3_query_details);
//console.log(disgenet3_query_details.sparql_query);
function onFailure_disgenet(xhr, status) {
    $("#result").html(status + " (See console.)");
    console.log("error");
    console.log(xhr);
}

function onSuccess_disgenet(json) {
  console.log("disgenet OKoooooooooooooooooooooooooooooooooooooooooooooooooo");
  console.log(json);
  var results=[];
  var num_of_columns=json.head.vars.length;
  for (var head in json.head.vars) { 
    results.push(json.head.vars[head]);
  }
  for (var content in json.results.bindings) {
    for (var head in json.head.vars) {
      results.push(json.results.bindings[content][json.head.vars[head]].value);
    }
  }
  console.log(results);
  console.log(num_of_columns);
  //table_draw(num_of_columns,results,disgenet3_query_details.parameter_mapping[0].concept1);
  //graph_draw([],[],[]);
}

//disgenet.query(query_string_disgenet).done(onSuccess_disgenet).error(onFailure_disgenet);
//});
/* For Alzheimer Disease, give me all the genes associated with the disease with a score greater than 0.29.
SELECT DISTINCT ?gene str(?geneName) as ?name ?score 
WHERE { 
?gda sio:SIO_000628 ?gene,?disease ; 
   sio:SIO_000216 ?scoreIRI . 
?gene rdf:type ncit:C16612 ; 
    dcterms:title ?geneName . 
?disease rdf:type ncit:C7057 ; 
       dcterms:title "Alzheimer's Disease"@en . 
?scoreIRI sio:SIO_000300 ?score . 
FILTER (?score > "0.29"^^xsd:decimal) } 
ORDER BY DESC(?score)
*/
/* For Alzheimer Disease, give me all the genes associated with the disease with a score greater than 0.29
along with their proteins and their associated pathways.
SELECT DISTINCT ?gene str(?geneName) as ?name ?score ?protein ?pl str(?pathwayname) as ?pathwayname 
WHERE { 
?gda sio:SIO_000628 ?gene,?disease ; 
   sio:SIO_000216 ?scoreIRI . 
?gene rdf:type ncit:C16612 ; 
    dcterms:title ?geneName ; 
    sio:SIO_010078 ?protein ; 
    sio:SIO_000062 ?pathway . 
?disease rdf:type ncit:C7057 ; 
       dcterms:title "Alzheimer's Disease"@en . 
?protein dcterms:title ?pl .
?scoreIRI sio:SIO_000300 ?score .  
?pathway dcterms:title ?pathwayname . 
FILTER (?score > "0.29"^^xsd:decimal) } 
ORDER BY DESC(?score)
*/
/*SELECT ?gda ?gene ?disease ?gl ?dl FROM <http://rdf.disgenet.org> WHERE {
      ?gda <http://semanticscience.org/resource/SIO_000628>?gene,?disease .
      ?gene rdf:type <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C16612> ;
            rdfs:label ?gl .
      ?disease rdf:type <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C7057>;
               rdfs:label ?dl . }
      LIMIT 12*/

/*PREFIX+rdf:+<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?comment ?title
FROM <http://rdf.disgenet.org>
WHERE 
{?gda rdf:type <http://semanticscience.org/resource/SIO_001120>;
    <http://www.w3.org/2000/01/rdf-schema#label>?label;
    <http://www.w3.org/2000/01/rdf-schema#comment>?comment;
    <http://purl.org/dc/terms/title>?title;
    fILTER regex(?label,+"Inflammation",+"i")}LIMIT+19*/

/*Give me all disease-disease associations related by the same encoding gene
SELECT DISTINCT  ?diseaseName  ?diseaseName2 ?gene_name
FROM <http://rdf.disgenet.org> 
WHERE { 
  ?gda <http://semanticscience.org/resource/SIO_000628> ?disease,?gene . 
  ?gda2 <http://semanticscience.org/resource/SIO_000628> ?disease2,?gene .  
  FILTER (?disease != ?disease2) 
  FILTER (?gda != ?gda2)
  FILTER regex(?disease, "umls/id")
  ?disease <http://purl.org/dc/terms/title> ?diseaseName .  
  FILTER regex(?disease2, "umls/id") 
  ?disease2 <http://purl.org/dc/terms/title> ?diseaseName2 . 
              ?gene<http://purl.org/dc/terms/title>?gene_name .
  } 
  
      LIMIT 10*/

/*Give me all disease-disease associations related by the same encoding gene given a disease name
SELECT DISTINCT  ?diseaseName ?diseaseName2 ?gene_name
FROM <http://rdf.disgenet.org> 
WHERE { 
  ?gda <http://semanticscience.org/resource/SIO_000628> ?disease,?gene . 
  ?gda2 <http://semanticscience.org/resource/SIO_000628> ?disease2,?gene .  
  FILTER (?disease != ?disease2) 
  FILTER (?gda != ?gda2)
  FILTER regex(?disease, "umls/id")
  ?disease <http://purl.org/dc/terms/title> ?diseaseName .  
  FILTER regex(?diseaseName, "Thymoma" )
  FILTER regex(?disease2, "umls/id") 
  ?disease2 <http://purl.org/dc/terms/title> ?diseaseName2 . 
              ?gene<http://purl.org/dc/terms/title>?gene_name .
  } 
  
LIMIT 10*/

/*Give disease take all genes
SELECT ?gda ?gene ?disease ?diseaseName FROM <http://rdf.disgenet.org> WHERE {
      ?gda <http://semanticscience.org/resource/SIO_000628>?gene,?disease .
      ?gene rdf:type <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C16612> .
      ?disease rdf:type <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C7057>. 
      ?disease <http://purl.org/dc/terms/title> ?diseaseName .  
       FILTER regex(?diseaseName, "Thymoma" )

}
      LIMIT 10*/

/* Give disease take all genes
SELECT DISTINCT ?gene ?geneName ?disease ?diseaseName 
FROM <http://rdf.disgenet.org> 
WHERE {
      ?gda <http://semanticscience.org/resource/SIO_000628>?gene,?disease .
      ?gene <http://purl.org/dc/terms/title> ?geneName .
      ?disease <http://purl.org/dc/terms/title> ?diseaseName .  
       FILTER regex(?diseaseName, "Thymoma" )

}
      LIMIT 60
*/

/* Find evidence for a specific gene-disease association
SELECT DISTINCT 
?gda <http://linkedlifedata.com/resource/umls/id/C0035372> as ?disease 
<http://identifiers.org/ncbigene/4204> as ?gene 
?score ?source ?associationType ?pmid ?sentence 
WHERE { 
?gda sio:SIO_000628 <http://linkedlifedata.com/resource/umls/id/C0035372>,<http://identifiers.org/ncbigene/4204> ; 
   rdf:type ?associationType ; 
   sio:SIO_000216 ?scoreIRI ;  
   sio:SIO_000253 ?source . 
?scoreIRI sio:SIO_000300 ?score . 
OPTIONAL { ?gda sio:SIO_000772 ?pmid . ?gda dcterms:description ?sentence . } 

SELECT DISTINCT 
?gda <http://linkedlifedata.com/resource/umls/id/C0035372> as ?disease 
<http://identifiers.org/ncbigene/4204> as ?gene 
?associationType ?label ?desc
WHERE { 
?gda sio:SIO_000628 <http://linkedlifedata.com/resource/umls/id/C0035372>,<http://identifiers.org/ncbigene/4204> ; 
   rdf:type ?associationType ;
   rdfs:label ?label ;
   dcterms:description ?desc .
}

SELECT DISTINCT ?gda <http://linkedlifedata.com/resource/umls/id/C0035372> as ?disease ?associationType ?label ?desc ?gene ?gl
WHERE { 
?gda sio:SIO_000628 <http://linkedlifedata.com/resource/umls/id/C0035372>,?gene ; 
   rdf:type ?associationType ;
   rdfs:label ?label ;
   dcterms:description ?desc .
?gene rdfs:label ?gl .
FILTER regex(?gene, "ncbigene")
}
}
*/
/* All genes and descriptions associated with a disease
SELECT DISTINCT ?gene ?gl
WHERE { 
?gda sio:SIO_000628 <http://linkedlifedata.com/resource/umls/id/C0035372>,?gene ; 
   rdf:type ?associationType ;
   rdfs:label ?label ;
   dcterms:description ?desc .
?gene rdfs:label ?gl .
FILTER regex(?gene, "ncbigene")
}
*/
/* SOS
Give me all disease genes for 'Marfan Syndrome' (MeSH:D008382 or OMIM:601665) 
in DisGeNET and the pathways for these genes from WikiPathways. Output the disease name, 
NCBI Gene ID, HGNC gene name, gene label, WikiPathways pathway ID and name. 
disease->genes->pathways = (c1:C1, C2) = c2s -> (c2s:C2, C3) = c3s . c1,c2s,c3s
PREFIX wp: <http://vocabularies.wikipathways.org/wp#> 
SELECT DISTINCT str(?DiseaseName) as ?DiseaseName ?gene str(?GeneName) as ?GeneTitle ?PathwayID str(?PathwayName) as ?PathwayName 
WHERE { 
# Query DisGeNET for disease-genes 
?disease skos:exactMatch <http://id.nlm.nih.gov/mesh/D008382> . 
# alternatively, searching by MIM term: 
# ?disease skos:exactMatch <http://bio2rdf.org/omim:601665> 
?gda sio:SIO_000628 ?gene,?disease . 
?gene rdf:type ncit:C16612 ; 
    dcterms:title ?GeneName . 
?disease rdf:type ncit:C7057 ; 
       dcterms:title ?DiseaseName . 
# Query WikiPathways for gene-pathways 
SERVICE <http://sparql.wikipathways.org/> { 
?geneProduct a wp:GeneProduct ; 
           dc:identifier ?gene ; 
           rdfs:label ?GeneLabel ; 
           dcterms:isPartOf ?pathway . 
?pathway dc:identifier ?PathwayID ;  
       dc:title ?PathwayName } } 
ORDER BY DESC(?GeneName)
*/
/* Retrieve the protein targets of Gleevec (CHEMBL941), the genes that encode these protein targets and their associated diseases
Drug -> protein -> genes -> diseases = (c1:C1, C2) = c2s -> (c2s:C2, C3) = c3s -> (c3s:C3,C4) = c4s. c1,c2s,c3s,c4s
PREFIX cco: <http://rdf.ebi.ac.uk/terms/chembl#> 
PREFIX chembl_molecule: <http://rdf.ebi.ac.uk/resource/chembl/molecule/> 
SELECT DISTINCT ?activity ?target ?targetcmpt ?uniprot ?gene ?diseaseName 
WHERE { 
?gda sio:SIO_000628 ?gene,?disease . 
?disease rdf:type ncit:C7057 ; 
       dcterms:title ?diseaseName . 
?gene rdf:type ncit:C16612 ; 
    sio:SIO_010078 ?protein . 
?protein skos:exactMatch ?uniprot . 
FILTER regex(?uniprot, "http://purl.uniprot.org/uniprot/") 
# Query ChEMBL for activity data for Gleevec 
{ SELECT * 
WHERE { 
    SERVICE <http://www.ebi.ac.uk/rdf/services/chembl/sparql> 
    { SELECT ?activity ?assay ?target ?targetcmpt ?uniprot 
      WHERE { 
            ?activity a cco:Activity ; 
                      cco:hasMolecule chembl_molecule:CHEMBL941 ; 
                      cco:hasAssay ?assay . 
            ?assay cco:hasTarget ?target . 
            ?target cco:hasTargetComponent ?targetcmpt . 
            ?targetcmpt cco:targetCmptXref ?uniprot . 
            ?uniprot a cco:UniprotRef 
            } 
# end of chembl query 
} # end of service 
} } } # end of query 
LIMIT 10*/