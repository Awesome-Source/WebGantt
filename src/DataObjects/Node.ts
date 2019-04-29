class GanttNode {
    public ID: string;
    public TableElementID: number;
    public PlanStart: number;
    public DurationItems: DurationItem[];
    public CompleteDuration: number;
    public CalculatedPlanEnd: number;
    public HeightOffset: number;
    public IsHeightSet: boolean;

    constructor(id: string, tableElementID: number, planStart: number) {
        this.ID = id;
        this.TableElementID = tableElementID;
        this.PlanStart = planStart;
        this.DurationItems = [];
        this.CompleteDuration = 0;
        this.CalculatedPlanEnd = planStart;
        this.HeightOffset = 0;
        this.IsHeightSet = false;
    }

    public AddDurationItem(item: DurationItem): void {
        this.DurationItems.push(item);
    }
}