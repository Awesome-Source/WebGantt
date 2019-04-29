class NonAvailability {
    From: number;
    To: number;
    Color: GanttColor;

    constructor(from: number, to: number, color: GanttColor) {
        this.From = from;
        this.To = to;
        this.Color = color;
    }

    public Length(): number {
        return this.To - this.From;
    }
}