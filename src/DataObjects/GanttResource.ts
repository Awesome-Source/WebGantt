class GanttResource implements IGanttTableElement {
    IsGroup: boolean;
    Name: string;
    ID: number;
    DrawElements: IResourceDrawElement[];
    Nodes: GanttNode[];
    NonAvailabilities: NonAvailability[];
    ResultingHeight: number;

    constructor(objectManager: GanttObjectManager, name: string) {
        this.ID = objectManager.GetNextID();
        this.Name = name;
        this.Nodes = [];
        this.NonAvailabilities = [];
        this.DrawElements = [];
        this.IsGroup = false;
        this.ResultingHeight = 0;
    }

    public AddNonAvailability(from: number, to: number, color: GanttColor): void {
        this.NonAvailabilities.push(new NonAvailability(from, to, color));
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