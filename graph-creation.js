//-------------------vis draw destroy-----------------------------------------------------------------
function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}
function graph_draw(initial_nodes, initial_edges, query_triples) {
  destroy();
  /*console.log(initial_nodes);
  console.log(initial_nodes[0].label);*/
  /*nodes = new vis.DataSet(nodesArray);
  edges = new vis.DataSet(edgesArray);*/
  var triple_nodes=[]; 
  var triple_edges=[];
  var node_from;
  console.log(query_triples);
  if(query_triples){
    for(var tr=0;tr<query_triples.length;tr++){
      console.log(triple_nodes);
      if(triple_nodes.length>0){
        for(var n=0;n<triple_nodes.length;n++){
          if(query_triples[tr].o==triple_nodes[n].label){
            node_from=triple_nodes[n].id;
            triple_nodes.push({id: tr+3, label: query_triples[tr].s});
            triple_edges.push({from: node_from, to: tr+3, label:query_triples[tr].p, arrows:'to'});
          }else 
          if(query_triples[tr].s==triple_nodes[n].label){
            node_from=triple_nodes[n].id;
            triple_nodes.push({id: tr+3, label: query_triples[tr].o});
            triple_edges.push({from: node_from, to: tr+3, label:query_triples[tr].p, arrows:'from'});
          }
          else{

          }
        }
      }else{
        triple_nodes.push({id: 1, label: query_triples[0].s},{id: 2, label: query_triples[0].o});
        triple_edges.push({from: 1, to: 2, label:query_triples[0].p, arrows:'to'});
      }

      /*triple_nodes.push({id: tr+1, label: query_triples[tr].o},{id: tr+2, label: query_triples[tr].s});
      triple_edges.push({from: tr+1, to: tr+2, label:query_triples[tr].p, arrows:'to'});*/
    }
    nodes = new vis.DataSet(triple_nodes);
    edges = new vis.DataSet(triple_edges);
    console.log(nodes);    
  }else{
    nodes = new vis.DataSet(initial_nodes);
    edges = new vis.DataSet(initial_edges);
    console.log(nodes);
  }
  var data = {
    nodes: nodes,
    edges: edges
  }
  // create a network
  var container = document.getElementById('mynetwork');
  var directionInput = document.getElementById("direction").value;
  var options = {
    /*layout: {
        hierarchical: {
            direction: "UD",
            sortMethod: "directed"
        }
    },*/
    interaction:{hover:true},
    physics: {
        enabled: false
    },
    locale: document.getElementById('locale').value,
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('operation').innerHTML = "Add Node";
        document.getElementById('node-id').value = data.id;
        document.getElementById('node-label').value = data.label;
        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
        document.getElementById('cancelButton').onclick = clearPopUp.bind();
        document.getElementById('network-popUp').style.display = 'block';
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('operation').innerHTML = "Edit Node";
        document.getElementById('node-id').value = data.id;
        document.getElementById('node-label').value = data.label;
        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
        document.getElementById('cancelButton').onclick = cancelEdit.bind(this,callback);
        document.getElementById('network-popUp').style.display = 'block';
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r == true) {
            callback(data);
          }
        }
        else {
          callback(data);
        }
      }
    }
  };
  network = new vis.Network(container, data, options);
  network.on("select", function (params) {
    console.log('select Edge:', edges._data[params.edges[0]].label);
    console.log('from:', edges._data[params.edges[0]].from);
    console.log('to:', edges._data[params.edges[0]].to);
    console.log('select Node:', nodes._data[params.nodes[0]].label);
    $('#ontology_class').val(nodes._data[params.nodes[0]].label);
    //$("#multi_search").html("Search for <span class='highlight' id='concept_add_to_search'>"+nodes._data[params.nodes[0]].label+"</span> or more specific concepts:<a href='javascript:add_to_search_input();' id='link_add_to_search'></a>");
    //updateInteractionTab();
    //displaySearchContent(); rxnav_client
    //updateMeshGraph(); rxnav_client
  });
  network.on("doubleClick", function (params) {
    params.event = "[original event]";
    console.log(JSON.stringify(params, null, 4));
    $('#ontology_class').val(nodes._data[params.nodes[0]].label);
    alert(nodes._data[params.nodes[0]].label);
    getAllInfo_NDFRT();
  });
}

function clearPopUp() {
  document.getElementById('saveButton').onclick = null;
  document.getElementById('cancelButton').onclick = null;
  document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function saveData(data,callback) {
  data.id = document.getElementById('node-id').value;
  data.label = document.getElementById('node-label').value;
  clearPopUp();
  callback(data);
}
