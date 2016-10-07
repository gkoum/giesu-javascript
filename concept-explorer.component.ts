class ConceptExplorerComponent{

  concept: Concept;
  newConcept: string='';
  concepts: any[] = [];
  selectedConcept: string='';

  addConcept(): boolean {
    if(this.newConcept!="" && !this.concepts.includes(this.newConcept)){
      this.concepts.push(this.newConcept);
      console.log(document.getElementById("input").value);
      this.newConcept = '';
    }
    console.log(document.getElementById("input").value);
    this.concepts.push(document.getElementById("input").value);
    return false;
  }

  getInfo(concept: string): boolean{
    console.log("getInfo("+concept+") was called");
    return false;
  }
  deleteConcept(): boolean{
    console.log("deleteConcept("+this.selectedConcept+") was called");
    var index = this.concepts.indexOf(this.selectedConcept);
    if (index === -1) { return;}
    console.log(`Index about to remove: ${index} this.concepts length: ${this.concepts.length}`);
    this.concepts.splice(index, 1);
    console.log(`this.concepts length: ${this.concepts.length}`);
    return false;
  }
  submitQuery(): boolean{
    console.log("submitQuery("+this.concepts+") was called");
    return false;
  }
  onSelect(concept: Concept) {
    this.newConcept = concept.toString();
    this.selectedConcept = concept.toString();
  }
}
class Concept {
    id: number;
    name: string;
}
var ce=new ConceptExplorerComponent();
ce.getInfo('aspirin');