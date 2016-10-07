//var paths_all=[];
var temp_path=[];
var START, END;
function find(start_node, end_node, nodesArray, edgesArray) {
    for (var _i = 0, edgesArray_1 = edgesArray; _i < edgesArray_1.length; _i++) {
        var e = edgesArray_1[_i];
        console.log(e.from);
    }
    START = start_node;
    END = end_node;
    var nodes = nodesArray; //=['a','b','c','d','e','f'];
    console.log(start_node,end_node,nodesArray,edgesArray);
    var edges = edgesArray;
    var neighboors = neighboors_all(edges, nodes);
    var visited = [START];
    temp_path=[];
    return searchDepth(neighboors, visited);
        //return paths_all;
}
function searchDepth(neighboors, visited) {
    console.log(visited,neighboors);
    console.log(visited);
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
            if (tmp_node == END) {
                visited.push(tmp_node);
                path(visited); 
                temp_path.push(visited.toString());
                console.log(visited);
                console.log(temp_path);
                visited.pop();
                break;
            }
        }
        for (var _a = 0, next_nodes_2 = next_nodes; _a < next_nodes_2.length; _a++) {
            tmp_node = next_nodes_2[_a];
            if (visited.includes(tmp_node) || tmp_node == END)
                continue;
            visited.push(tmp_node);
            searchDepth(neighboors, visited);
            visited.pop();
        }
    }
    return temp_path;
}
function path(path) {
    console.log('------------------------PATH: ' + path);
    var paths_all=[];
    paths_all.push(path);
    console.log('------------------------PATHs: ' + paths_all);
    /*paths_all.push(path);
    return paths_all;*/
}
function neighboors_all(edges, nodes) {
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
}