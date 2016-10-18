var relationship_categories=[], rel=[], par=[], ch=[], prop=[];

function table_draw(number_of_columns, data, concept_info, tab_number){
	var html = "<table class='table table-hover table-striped table-condensed'>";
	var rows=data.length/number_of_columns;
	console.log(number_of_columns,data.length,rows);
	var temp_td;
	for (r=0;r<rows;r++){
		//console.log(r);
		//console.log("r="+r);
		if(r==0)
			html += "<tr><td>Select</td>";
		else
			html += "<tr><td><input checked type='checkbox' name='row-"+r+"' id='row-"+r+
							"' onchange='rowClick(this,"+number_of_columns+")'></td>";
		for (c=0;c<number_of_columns;c++){
			//console.log("c="+c);
			temp_td=data[r*number_of_columns+c];
			html+="<td>"+temp_td+"</td>";
			if(tab_number==1)
				rel.push(temp_td)
			else if(tab_number==2)
				par.push(temp_td);
			else if(tab_number==3)
				ch.push(temp_td);
			else if(tab_number==4)
				prop.push(temp_td);
		}
		html+="</tr>";
	}
	html+="</table>";
	console.log(rel,par,ch,prop);
	//alert(number_of_columns+data+html);
	if(tab_number==1)
		$("#relationships").html(html);
	else if(tab_number==2)
		$("#parents").html(html);
	else if(tab_number==3){
		$("#children").html(html);
	}else{
		$("#properties").html(html);
	}
	/*$( "#child"+ch ).click(function() {
    may_treat();
  });*/
	$("#tables_for_concept").html("Information for "+concept_info);
	$("#redraw_graph").click(function(){
		redraw_graph();
	});
}
function redraw_graph(){
	
}
function rowClick(row,number_of_columns){
	var tmp_row=(row.name).split('-')[1];
	if (row.checked) {
    console.log(rel[tmp_row],par[tmp_row],ch[tmp_row],prop[tmp_row],relationship_categories[tmp_row],number_of_columns);
  	
  } else {
    console.log(row);
    rel.splice(1,1);
  }
}