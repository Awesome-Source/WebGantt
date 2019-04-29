class GanttRenderer{
    private _domStructure: GanttDomStructure;
    private _svgHelper: SvgHelper;
    private _settings: GanttSettings;
    private _objectManager: GanttObjectManager;
    private _lanePositionToTableElements: PositionToElement[];

    private _nodePositionCalculator: NodePositionCalculator;
    private _timeScaleRenderer: TimeScaleRenderer;
    private _tableRenderer: TableRenderer;
    private _laneRenderer: LaneRenderer;
    private _nodeRenderer: NodeRenderer;
    private _dateLineRenderer: DateLineRenderer;
    private _titleRenderer: TitleRenderer;

    constructor(domStructure: GanttDomStructure, eventManager: EventManager, settings: GanttSettings, objectManager: GanttObjectManager) {
        this._domStructure = domStructure;
        this._settings = settings;
        eventManager.RegisterGroupCollapseStateChangedCallback(this, this.collapseOrExpand);
        eventManager.RegisterRedrawCallback(this, this.handleRedrawEvent);
        this._svgHelper = new SvgHelper(settings);
        this._objectManager = objectManager;
        this._lanePositionToTableElements = [];

        var renderContext = new RenderContext(domStructure, settings, this._svgHelper, objectManager, eventManager);

        this._nodePositionCalculator = new NodePositionCalculator(renderContext);
        this._timeScaleRenderer = new TimeScaleRenderer(renderContext);
        this._tableRenderer = new TableRenderer(renderContext);
        this._laneRenderer = new LaneRenderer(renderContext, this._lanePositionToTableElements);
        this._nodeRenderer = new NodeRenderer(renderContext);
        this._dateLineRenderer = new DateLineRenderer(renderContext);
        this._titleRenderer = new TitleRenderer(renderContext);
    }

    public ReDraw() {
        this.clearSvgs();
        this._nodePositionCalculator.CalculatePositions();
        this._titleRenderer.DrawTitle();
        this._timeScaleRenderer.DrawTimeScale(); //TODO only if the zoom factor changes
        this._laneRenderer.DrawLanes();
        this._nodeRenderer.DrawNodes();
        this._dateLineRenderer.DrawDateLines();
        this._tableRenderer.DrawTable();
    }

    private clearSvgs() {        
        this.clearSingleSvg(this._domStructure.TableSvg);
        this.clearSingleSvg(this._domStructure.LaneSvg);
        this.clearSingleSvg(this._domStructure.TimeScaleSvg);
        this.clearSingleSvg(this._domStructure.TitleSvg);
    }   

    private clearSingleSvg(svg: SVGSVGElement) {
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    }

    private collapseOrExpand(id: number) {
        var entry = <GanttGroup>this._objectManager.FindTableElementById(id);

        if (entry.Expanded) {
            this.collapseGroup(entry);
        } else {
            this.expandGroup(entry);
        }

        entry.Expanded = !entry.Expanded;
        this.ReDraw();
    }

    private collapseGroup(group: GanttGroup): void {
        var svgHeight = this._domStructure.TableSvg.clientHeight;
        var additionalHeight = group.SubElements.length * this._settings.LaneHeight;
        this._svgHelper.ChangeSvgHeight(this._domStructure.TableSvg, svgHeight - additionalHeight);
        this._svgHelper.ChangeSvgHeight(this._domStructure.LaneSvg, svgHeight - additionalHeight);
    }

    private expandGroup(group: GanttGroup): void {
        var svgHeight = this._domStructure.TableSvg.clientHeight;
        var additionalHeight = group.SubElements.length * this._settings.LaneHeight;
        this._svgHelper.ChangeSvgHeight(this._domStructure.TableSvg, svgHeight + additionalHeight);
        this._svgHelper.ChangeSvgHeight(this._domStructure.LaneSvg, svgHeight + additionalHeight);
    }

    private handleRedrawEvent(_redrawInfo: RedrawInfo) {
        this.ReDraw();
    }

    public GetTableElementForYPosition(yPosition: number): IGanttTableElement {

        var length = this._lanePositionToTableElements.length;
        for (var i = 0; i < length; i++) {
            var posToElement = this._lanePositionToTableElements[i];

            if (yPosition < posToElement.Position) {
                continue;
            }

            if (i === length - 1 || yPosition < this._lanePositionToTableElements[i + 1].Position) {
                return posToElement.Element;
            }
        }

        return null;
    }
}