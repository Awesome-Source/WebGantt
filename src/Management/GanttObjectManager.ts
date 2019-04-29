class GanttObjectManager {
    tableElements: IGanttTableElement[];
    nodes: GanttNode[];
    dateLines: GanttDateLine[];
    currentElementID: number;

    constructor() {
        this.tableElements = [];
        this.nodes = [];
        this.dateLines = [];
        this.currentElementID = 0;
    }

    public CreateGroup(name: string): GanttGroup {
        var group = new GanttGroup(this, name);
        this.tableElements.push(group);

        return group;
    }

    public CreateDateLine(time: number, color: GanttColor): GanttDateLine {
        var dateLine = new GanttDateLine(time, color);
        this.dateLines.push(dateLine);

        return dateLine;
    }

    public GetNodeById(id: string): GanttNode {
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];

            if (node.ID == id) {
                return node;
            }
        }

        return null;
    }

    public FindTableElementById(elementID: number): IGanttTableElement {
        for (var i = 0; i < this.tableElements.length; i++) {
            var element = this.tableElements[i];
            if (element.ID == elementID) {
                return element;
            }

            if (element.IsGroup) {
                var foundElement = this.FindTableElementByIdInGroup(<GanttGroup>element, elementID);
                if (foundElement != null) {
                    return foundElement;
                }
            }
        }

        return null;
    }

    public FindTableElementByIdInGroup(group: GanttGroup, elementID: number): IGanttTableElement {
        for (var i = 0; i < group.SubElements.length; i++) {
            var subElement = group.SubElements[i];

            if (subElement.ID == elementID) {
                return subElement;
            }

            if (subElement.IsGroup) {
                var foundElement = this.FindTableElementByIdInGroup(<GanttGroup>subElement, elementID);
                if (foundElement != null) {
                    return foundElement;
                }
            }
        }

        return null;
    }

    public CreateNode(nodeName: string, tableElementID: number, planStart: number): GanttNode {
        var element = this.FindTableElementById(tableElementID);

        if (element == null) {
            return null;
        }

        var node = new GanttNode(nodeName, element.ID, planStart);
        element.AddNode(node);
        this.nodes.push(node);

        return node;
    }

    public GetNextID(): number {
        return this.currentElementID++;
    }
}