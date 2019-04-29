class DateLineRenderer {

    private _svgHelper: SvgHelper;
    private _laneSvg: SVGSVGElement;
    private _objManager: GanttObjectManager;
    private _settings: GanttSettings;

    constructor(renderContext: RenderContext) {
        this._svgHelper = renderContext.SvgHelper;
        this._laneSvg = renderContext.DomStructure.LaneSvg;
        this._objManager = renderContext.ObjectManager;
        this._settings = renderContext.Settings;
    }

    public DrawDateLines() {
        var dateLineContainer = this._svgHelper.CreateGroup(0, 0, "dateline-container");
        this._laneSvg.appendChild(dateLineContainer);

        var dateLines = this._objManager.dateLines;
        for (var i = 0; i < dateLines.length; i++) {
            var dateLine = dateLines[i];
            this.drawSingleDateLine(dateLine, dateLineContainer);
        }
    }

    private drawSingleDateLine(dateLine: GanttDateLine, dateLineContainer: HTMLElement) {
        var xPosition = dateLine.Time * this._settings.GetPixelLengthOfOneSecond();
        var group = this._svgHelper.CreateGroup(xPosition, 0);
        this._svgHelper.CreateLine(0, 0, 0, this._laneSvg.clientHeight, dateLine.Color, true, group);
        dateLineContainer.appendChild(group);
    } 
}