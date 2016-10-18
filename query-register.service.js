// An Array with all queries and their {function_name,query_type,api_type,query_info}: 
// {disgenet3,3,sparql,{concept1:"input"},{category1: "Disease"},{category2: "Gene"}}
// The service will calculate which queries to use for each user request and invoke them on_submit
	var all_queries=[];
function queryRegister(name,type,api_type,query_info){
	all_queries.push([name,type,api_type,query_info]);
	console.log(all_queries);	
}