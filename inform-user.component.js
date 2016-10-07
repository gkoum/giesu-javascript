//Takes all paths to inform and general information to present
//Depends on the type of query what the suggestion-information will be
function inform_user(query_type, paths){
	console.log(paths);
	//$("#query_explanation").html("");
	var path_suggestion="Your query is type: "+query_type+" and search will exploit the following paths: <ul>";
	for(var i=0;i<paths.length;i++){
		if(paths[i].length<3){
			path_suggestion+="<li><input checked class='path_suggestion' type='checkbox' name='paths' value='"+paths[i].toString()+"'>\n\
												direct path: "+pathIdstoNames(paths[i].toString())+"</li>";
		}else{
			path_suggestion+="<li><input checked class='path_suggestion' type='checkbox' name='paths' value='"+paths[i].toString()+"'>\n\
												indirect path: "+pathIdstoNames(paths[i].toString())+"</li>";
		}
	}
  path_suggestion+="</ul>";
	$("#query_explanation").html(path_suggestion);
}
function pathIdstoNames(path_ids){
	var path_names=[];
	var ids=CSVtoArray(path_ids);
	for(i=0;i<ids.length;i++){
		path_names.push(nodesNames[ids[i]-1])
	}
	return path_names;
}
/*$("#query_explanation").html("Your query is type: "+query_type+" and search will exploit the following paths: <ul><li>\n\
      <input checked class='path_suggestion' type='checkbox' name='paths' value='Path'>direct connections: \n\
      aspirin to any disease with relationships may_treat, may_prevent </li><li>\n\
      <input checked type='checkbox' name='paths' value='Path'> aspirin (binds_to)-> \n\
      all_Targets (affects)-> Disease </li><li><input checked type='checkbox' \n\
      name='paths' value='Path'>  aspirin (has_dosage)-> Dosage (is_toxic_for)-> Organ \n\
      (subject_of)-> Disease</li>");*/