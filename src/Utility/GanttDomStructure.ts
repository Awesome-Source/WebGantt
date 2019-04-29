class GanttDomStructure {

    public TitleDiv: HTMLElement;
    public TimeScaleDiv: HTMLElement;
    public TableDiv: HTMLElement;
    public LaneDiv: HTMLElement;

    public TitleSvg: SVGSVGElement;
    public TimeScaleSvg: SVGSVGElement;
    public TableSvg: SVGSVGElement;
    public LaneSvg: SVGSVGElement;

    private _settings: GanttSettings;
    private _svgns = "http://www.w3.org/2000/svg";

    constructor(settings: GanttSettings) {
        this._settings = settings;
    }

    public CreateDomStructure(ganttDivId: string, scrollbarWidth: number) {

        var tableWidth = this._settings.TableWidth;
        var ganttHeight = this._settings.GanttHeight;
        var timescaleHeight = this._settings.TimeScaleHeight;
        var ganttWidth = this._settings.Width;
        var correctedTimescaleHeight = timescaleHeight + scrollbarWidth;
        var overflowScrollStyle = "overflow: scroll;";
        var sizeStyle = "height: " + ganttHeight + "px;max-height: " + ganttHeight + "px;display: inline-block;";
        var timeScaleSizeStyle = "height: " + correctedTimescaleHeight + "px;max-height: " + correctedTimescaleHeight + "px;display: inline-block;";
        var flexStyle = "flex-basis: " + (tableWidth + scrollbarWidth) + "px;flex-grow: 0;flex-shrink: 0;";

        var ganttDiv = document.getElementById(ganttDivId);

        var row1 = document.createElement("div");
        var row2 = document.createElement("div");
        row1.setAttribute("style", "display: flex; flex-direction: row;");
        row2.setAttribute("style", "display: flex; flex-direction: row;");
        ganttDiv.appendChild(row1);
        ganttDiv.appendChild(row2);

        this.TitleDiv = this.createDiv(ganttDivId + "-title-div", overflowScrollStyle + flexStyle + timeScaleSizeStyle, false, row1);
        this.TimeScaleDiv = this.createDiv(ganttDivId + "-timescale-div", overflowScrollStyle + timeScaleSizeStyle, true, row1);
        this.TableDiv = this.createDiv(ganttDivId + "-table-div", overflowScrollStyle + flexStyle + sizeStyle, false, row2);
        this.LaneDiv = this.createDiv(ganttDivId + "-lanes-div", overflowScrollStyle + sizeStyle, true, row2);

        this.TitleSvg = this.createSvgElement(ganttDivId + "-title-svg", tableWidth, timescaleHeight, this.TitleDiv);
        this.TimeScaleSvg = this.createSvgElement(ganttDivId + "-timescale-svg", ganttWidth, timescaleHeight, this.TimeScaleDiv);
        this.TableSvg = this.createSvgElement(ganttDivId + "-table-svg", tableWidth, ganttHeight, this.TableDiv);
        this.LaneSvg = this.createSvgElement(ganttDivId + "-lanes-svg", ganttWidth, ganttHeight, this.LaneDiv);
    }

    private createDiv(id: string, style: string, maxWidth: boolean, parent: HTMLElement) {
        var divElement = document.createElement("div");
        divElement.id = id;
        divElement.setAttribute("style", style);

        if (maxWidth) {
            divElement.setAttribute("width", "100%");
        }

        parent.appendChild(divElement);

        return divElement;
    }

    private createSvgElement(id: string, width: number, height: number, parent: HTMLElement) {
        var svgElement = <SVGSVGElement>document.createElementNS(this._svgns, "svg");
        svgElement.id = id;
        svgElement.setAttribute("width", width + "px");
        svgElement.setAttribute("height", height + "px");
        parent.appendChild(svgElement);

        return svgElement;
    }
}