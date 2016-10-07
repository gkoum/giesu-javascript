
var paths_all=[];
var temp_path=[];
var Edge = (function () {
    function Edge(id, from, to, label) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.label = label;
    }
    return Edge;
}());
var myNode = (function () {
    function myNode(id, label) {
        this.id = id;
        this.label = label;
    }
    return myNode;
}());
var PathFinderService = (function () {
    function PathFinderService() {
    }
    PathFinderService.prototype.find = function (start_node, end_node, nodesArray, edgesArray) {
        for (var _i = 0, edgesArray_1 = edgesArray; _i < edgesArray_1.length; _i++) {
            var e = edgesArray_1[_i];
            console.log(e.from);
        }
        this.START = start_node;
        this.END = end_node;
        var nodes = nodesArray; //=['a','b','c','d','e','f'];
        console.log(start_node,end_node,nodesArray,edgesArray);
        //var tmp_edge = [new Edge('1', 'a', 'b', 'ab'), new Edge('3', 'a', 'c', 'ac'), new Edge('2', 'b', 'c', 'ac'), new Edge('3', 'c', 'd', 'cd'), new Edge('3', 'c', 'f', 'cf')];
        var edges = edgesArray;
        var neighboors = this.neighboors_all(edges, nodes);
        var visited = [this.START];
        return this.searchDepth(neighboors, visited);
        //return paths_all;
    };
    PathFinderService.prototype.searchDepth = function (neighboors, visited) {
        console.log(visited,neighboors);
        console.log('Visited: ' + visited);
        var pop_node = visited.pop();
        var next_nodes = neighboors[pop_node];
        visited.push(pop_node);
        console.log("pop_node: "+pop_node,"next_nodes: "+next_nodes,"visited: "+visited);
        console.log(neighboors);
        var tmp_node;
        
        if (next_nodes) {
            for (var _i = 0, next_nodes_1 = next_nodes; _i < next_nodes_1.length; _i++) {
                tmp_node = next_nodes_1[_i];
                if (visited.includes(tmp_node))
                    continue;
                if (tmp_node == this.END) {
                    visited.push(tmp_node);
                    this.path(visited); 
                    temp_path.push(visited);
                    visited.pop();
                    break;
                }
            }
            for (var _a = 0, next_nodes_2 = next_nodes; _a < next_nodes_2.length; _a++) {
                tmp_node = next_nodes_2[_a];
                if (visited.includes(tmp_node) || tmp_node == this.END)
                    continue;
                visited.push(tmp_node);
                this.searchDepth(neighboors, visited);
                visited.pop();
            }
        }
        return temp_path;
    };
    PathFinderService.prototype.path = function (path) {
        console.log('------------------------PATH: ' + path);
        paths_all.push(path);
        console.log('------------------------PATHs: ' + paths_all);
        /*paths_all.push(path);
        return paths_all;*/
    };
    PathFinderService.prototype.neighboors_all = function (edges, nodes) {
        var neighboors = {};
        var edge;
        var node, tmp_node;
        console.log(nodes);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            node = nodes_1[_i];
            console.log('node_id: ' + node.id + ' node label: ' + node.label);
            for (var _a = 0, edges_1 = edges; _a < edges_1.length; _a++) {
                edge = edges_1[_a];
                tmp_node = edge.from;
                //console.log(edge.from);
                if (tmp_node == node.id) {
                    if (neighboors[node.id] == null) {
                        neighboors[node.id] = [];
                        neighboors[node.id].push(edge.to);
                    }
                    else {
                        neighboors[node.id].push(edge.to);
                    }
                }
            }
            console.log(neighboors);
        }
        return neighboors;
    };
    PathFinderService.prototype.handleError = function (error) {
    };
    return PathFinderService;
}());
/*var user = { firstName: "Jane", lastName: "User" };
var pf = new PathFinderService();
console.log("start");
pf.path(["dcs", 'sdc']);
pf.find('1', '4', [{ id: '1', label: 'one' }, { id: '2', label: 'two' }, { id: '3', label: 'three' },
    { id: '4', label: 'four' }], [{ id: '1', from: '1', to: '2', label: 'ab' }, { id: '2', from: '2', to: '3', label: 'ab' },
    { id: '3', from: '2', to: '4', label: '24' }, { id: '4', from: '3', to: '4', label: '34' }]);
*/


function graph_draw(nodes, edges, query_triples) {
  destroy();

  nodes = new vis.DataSet(nodesArray);
  edges = new vis.DataSet(edgesArray);
  var data = {
      nodes: nodes,
      edges: edges
  };
  // create a network
  var container = document.getElementById('mynetwork');
  var directionInput = document.getElementById("direction").value;

  function getMessage(search_concept) {
  var deferred = $.Deferred();
  /*setTimeout(function() {
    deferred.resolve('Hello asynchronous world!');
  }, 13);*/
  var nodes=[], edgesArray=[];
    var siteDomain_ndfrt = "http://rxnav.nlm.nih.gov/REST/Ndfrt"
    transitive="true";
    var url_ndf = siteDomain_ndfrt + "/search?conceptName="+search_concept;  
    var triplesArray=[]; 
    var triple={};     
    //var html = "<table border='1'>";
    $.ajax({
      dataType: 'json',
      url: url_ndf,
      //async: false,
      success: function(data) {
        console.log(data.groupConcepts[0].concept[0].conceptName);
        concept_nui=data.groupConcepts[0].concept[0].conceptNui;
        console.log(concept_nui);
        nodes.push({id: 1, label: data.groupConcepts[0].concept[0].conceptName});
        deferred.resolve(nodes);
       }
    });
  return deferred.promise();
}
getMessage("Aspirin").done(function(message) {
  console.log(message[0].label);  
});