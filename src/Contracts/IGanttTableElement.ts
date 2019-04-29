interface IGanttTableElement {
    ID: number;
    Name: string;
    Nodes: GanttNode[];
    NonAvailabilities: NonAvailability[];
    IsGroup: boolean;
    ResultingHeight: number;

    AddNode(node: GanttNode): void;
    RemoveNode(node: GanttNode): void;
}