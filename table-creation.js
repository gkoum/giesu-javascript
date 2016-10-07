function table_draw(number_of_columns, data, concept_info, tab_number){
	var html = "<table border='1'>";
	for (r=0;r<data.length/number_of_columns;r++){
		//console.log("r="+r);
		html += "<tr>";
		for (c=0;c<number_of_columns;c++){
			//console.log("c="+c);
			html+="<td><input checked type='checkbox' name='column-"+c+"' value='column-"+c+"'>"+data[r*number_of_columns+c]+"</td>";
		}
		html+="</tr>";
	}
	html+="</table>";
	//alert(number_of_columns+data+html);
	if(tab_number==1)
		$("#relationships").html(html);
	else if(tab_number==2)
		$("#parents").html(html);
	else{
		$("#children").html(html);
	}
	/*$( "#child"+ch ).click(function() {
    may_treat();
  });*/
	$("#tables_for_concept").html("Information for "+concept_info);
}