class Edge {
  id: string;
  from: string;
  to: string;
  label: string;
  constructor(id: string,from: string,to: string,label: string){
    this.id=id;
    this.from=from;
    this.to=to;
    this.label=label;
  }
/*  get_from():string{
    return this.from;
  }
  get_to():string{
    return this.to;
  }*/
}
class myNode {
  id: string;
  label: string;
  constructor(id: string,label: string){
    this.id=id;
    this.label=label;
  }
}

class PathFinderService {
  START:string;
  END:string;
  find(start_node: string, end_node:string,nodesArray:myNode[],edgesArray:Edge[]): { [key:string]:string[] } {
    for(let e of edgesArray)
      console.log(e.from);
    this.START=start_node;
    this.END=end_node;
    let nodes:myNode[]=nodesArray;//=['a','b','c','d','e','f'];
    let tmp_edge:Edge[] = [new Edge('1','a','b','ab'),new Edge('3','a','c','ac'), new Edge('2','b','c','ac'),new Edge('3','c','d','cd'),new Edge('3','c','f','cf')];
    let edges:Edge[]=edgesArray;

    let neighboors:{ [key:string]:string[] }= this.neighboors_all(edges,nodes);
    let visited:string[]=[this.START];
    this.searchDepth(neighboors,visited);
    return neighboors;
  }
  private searchDepth(neighboors:{ [key:string]:string[] }, visited:string[]){
    console.log('Visited: '+visited);
    //console.log('Nei: '+neighboors['a']);
    let pop_node:string=visited.pop();
    let next_nodes:string[]=neighboors[pop_node];
    visited.push(pop_node);
    //console.log(next_nodes);
    let tmp_node:string;
    if(next_nodes){
      for(tmp_node of next_nodes){
        if(visited.includes(tmp_node))
          continue;
        if(tmp_node==this.END){
          visited.push(tmp_node);
          this.path(visited);
          visited.pop();
          break;
        }
      }
      for(tmp_node of next_nodes){
        if(visited.includes(tmp_node) || tmp_node==this.END)
          continue;
        visited.push(tmp_node);
        this.searchDepth(neighboors,visited);
        visited.pop();
      }
    }
  }
  path(path:string[]){
    console.log('PATH: '+path);
  }
  neighboors_all(edges:Edge[],nodes:myNode[]):{ [key:string]:string[] }{
    let neighboors:{[key:string]:string[]}={};
    let edge:Edge;
    let node:myNode, tmp_node:string;
    console.log(nodes);
    for(node of nodes){
      console.log('node_id: '+node.id+' node label: '+node.label);
      for(edge of edges){
        tmp_node=edge.from;
        //console.log(edge.from);
        if(tmp_node==node.id){
          if(neighboors[node.id]==null){
            neighboors[node.id]=[];
            neighboors[node.id].push(edge.to);
          }else{
            neighboors[node.id].push(edge.to);
          }
        }
      }
      console.log(neighboors);
    }
    return neighboors;
  }
  private handleError (error: any) {

  }
}
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };
var pf = new PathFinderService();
console.log("start");
console.log(pf.path(["dcs",'sdc']));
pf.find('1','4',[{id:'1',label:'one'},{id:'2',label:'two'},{id:'3',label:'three'}
  ,{id:'4',label:'four'}],[{id:'1',from:'1',to:'2',label:'ab'},{id:'2',from:'2',to:'3',label:'ab'},
  {id:'3',from:'2',to:'4',label:'24'},{id:'4',from:'3',to:'4',label:'34'}]);
//document.body.innerHTML = greeter(user);