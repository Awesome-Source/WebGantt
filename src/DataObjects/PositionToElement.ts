class PositionToElement {
    Position: number;
    Element: IGanttTableElement;

    constructor(position: number, element: IGanttTableElement) {
        this.Position = position;
        this.Element = element;
    }
}