class GanttGroup implements IGanttTableElement {
    IsGroup: boolean;
    Name: string;
    ID: number;
    Expanded: boolean;
    SubElements: IGanttTableElement[];
    Nodes: GanttNode[];
    NonAvailabilities: NonAvailability[];
    ObjectManager: GanttObjectManager;
    ResultingHeight: number;

    constructor(objectManager: GanttObjectManager, name: string) {
        this.ObjectManager = objectManager;
        this.ID = objectManager.GetNextID();
        this.Name = name;
        this.Expanded = false;
        this.SubElements = [];
        this.Nodes = [];
        this.NonAvailabilities = [];
        this.IsGroup = true;
        this.ResultingHeight = 0;
    }

    public AddNonAvailability(from: number, to: number, color: GanttColor): void {
        this.NonAvailabilities.push(new NonAvailability(from, to, color));
    }

    public AddGroup(name: string): GanttGroup {
        var group = new GanttGroup(this.ObjectManager, name);
        this.SubElements.push(group);

        return group;
    }

    public AddResource(name: string): GanttResource {
        var resource = new GanttResource(this.ObjectManager, name);
        this.SubElements.push(resource);

        return resource;
    }

    public GetResourceByName(resourceName: string): GanttResource {
        for (var i = 0; i < this.SubElements.length; i++) {
            var element = this.SubElements[i];

            if (element.IsGroup) {
                continue;
            }

            var resource = <GanttResource>element;

            if (resource.Name === resourceName) {
                return resource;
            }
        }

        console.error("Could not find resource for the name: " + resourceName + " in the group: " + this.Name);
        return null;
    }

    public AddNode(node: GanttNode) {
        var index = Utils.GetNodeInsertIndex(this.Nodes, node.PlanStart);
        this.Nodes.splice(index, 0, node);
    }

    public RemoveNode(node: GanttNode): void {
        var index = Utils.FindNode(this.Nodes, node);
        if (index > -1) {
            this.Nodes.splice(index, 1);
        }
    }
}