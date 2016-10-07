SPARQL = function(o) {
  this.query = function(q) {
    return $.ajax({
      url: o.endpoint,
      accepts: {json: "application/sparql-results+json"},
      data: {query: q, apikey: o.apikey},
      dataType: "json"
    });
  };
};

var disgenet_endpoint = new SPARQL({ 
  //apikey: disgenet3_query_details.apikey, 
  endpoint: "http://rdf.disgenet.org/lodestar/sparql"
});

function query_details(parameter_mapping,query_type,sparql_query){
  this.parameter_mapping=parameter_mapping,
  this.query_type=query_type,
  this.sparql_query=sparql_query
};

