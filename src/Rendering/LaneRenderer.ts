class LaneRenderer {

    private _settings: GanttSettings;
    private _svgHelper: SvgHelper;
    private _laneSvg: SVGSVGElement;
    private _objManager: GanttObjectManager;
    private _lanePositionToTableElements: PositionToElement[];

    constructor(renderContext: RenderContext, lanePosToTableElem: PositionToElement[]) {
        this._settings = renderContext.Settings;
        this._svgHelper = renderContext.SvgHelper;
        this._laneSvg = renderContext.DomStructure.LaneSvg;
        this._objManager = renderContext.ObjectManager;
        this._lanePositionToTableElements = lanePosToTableElem;
    }

    public DrawLanes() {
        var lanesContainer = this._svgHelper.CreateGroup(0, 0, "lanes-container");
        this._laneSvg.appendChild(lanesContainer);

        this._lanePositionToTableElements.length = 0; //delete all elements in the array
        var laneHeight = this._settings.LaneHeight;
        var laneColor = this._settings.LaneColor;
        var width = this._settings.Width;
        var tableElements = this._objManager.tableElements;
        var yPosition = 0;

        for (var rows = 0; rows < tableElements.length; rows++) {
            var element = tableElements[rows];
            yPosition = this.drawLanesRecursively(yPosition, element, laneHeight, width, laneColor, lanesContainer);
        }
    }

    private drawLanesRecursively(yPosition: number, element: IGanttTableElement, defaultLaneHeight: number, width: number, laneColor: GanttColor, lanesContainer: HTMLElement) {
        var laneHeight = element.ResultingHeight;
        var lane = this.createLane(0, yPosition, width, laneHeight, laneColor, element, lanesContainer);
        var widthOfOneSecond = this._settings.GetPixelLengthOfOneSecond();

        for (var na = 0; na < element.NonAvailabilities.length; na++) {
            var nonAvailability = element.NonAvailabilities[na];
            var start = nonAvailability.From * widthOfOneSecond;
            var length = nonAvailability.Length() * widthOfOneSecond;
            //+ 1 and -1 for stroke width of lane
            this.drawNonAvailability(start, 1, length, laneHeight - 1, nonAvailability.Color, lane)
        }

        yPosition += laneHeight;

        if (!element.IsGroup) {
            return yPosition;
        }

        var group = <GanttGroup>element;

        if (!group.Expanded) {

            return yPosition;
        }

        for (var i = 0; i < group.SubElements.length; i++) {
            yPosition = this.drawLanesRecursively(yPosition, group.SubElements[i], defaultLaneHeight, width, laneColor, lanesContainer);
        }

        return yPosition;
    }

    private createLane(x: number, y: number, width: number, height: number, color: GanttColor, element: IGanttTableElement, lanesContainer: HTMLElement) {
        this._lanePositionToTableElements.push(new PositionToElement(y, element));
        var group = this._svgHelper.CreateGroup(x, y, element.Name);
        this._svgHelper.CreateRect(height, width, 0, 0, color, 1, group);
        lanesContainer.appendChild(group);

        return group;
    }

    private drawNonAvailability(x: number, y: number, width: number, height: number, color: GanttColor, parent: HTMLElement) {
        var group = this._svgHelper.CreateGroup(x, y);
        this._svgHelper.CreateRect(height, width, 0, 0, color, 0, group);
        parent.appendChild(group);
    }
}