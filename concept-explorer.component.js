var ConceptExplorerComponent = (function () {
    function ConceptExplorerComponent() {
        this.newConcept = '';
        this.concepts = [];
        this.selectedConcept = '';
    }
    ConceptExplorerComponent.prototype.addConcept = function () {
        if (this.newConcept != "" && !this.concepts.includes(this.newConcept)) {
            this.concepts.push(this.newConcept);
            console.log(document.getElementById("input").value);
            this.newConcept = '';
        }
        console.log(document.getElementById("input").value);
        this.concepts.push(document.getElementById("input").value);
        return false;
    };
    ConceptExplorerComponent.prototype.getInfo = function (concept) {
        console.log("getInfo(" + concept + ") was called");
        return false;
    };
    ConceptExplorerComponent.prototype.deleteConcept = function () {
        console.log("deleteConcept(" + this.selectedConcept + ") was called");
        var index = this.concepts.indexOf(this.selectedConcept);
        if (index === -1) {
            return;
        }
        console.log("Index about to remove: " + index + " this.concepts length: " + this.concepts.length);
        this.concepts.splice(index, 1);
        console.log("this.concepts length: " + this.concepts.length);
        return false;
    };
    ConceptExplorerComponent.prototype.submitQuery = function () {
        console.log("submitQuery(" + this.concepts + ") was called");
        return false;
    };
    ConceptExplorerComponent.prototype.onSelect = function (concept) {
        this.newConcept = concept.toString();
        this.selectedConcept = concept.toString();
    };
    return ConceptExplorerComponent;
}());
var Concept = (function () {
    function Concept() {
    }
    return Concept;
}());
/*var ce = new ConceptExplorerComponent();
ce.getInfo('aspirin');*/
