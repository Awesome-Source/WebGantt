class DurationItem {
    Name: string;
    Duration: number;
    Color: GanttColor;

    constructor(name: string, duration: number, color: GanttColor) {
        this.Name = name;
        this.Duration = duration;
        this.Color = color;
    }
}