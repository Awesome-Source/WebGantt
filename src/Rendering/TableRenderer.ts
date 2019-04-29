class TableRenderer {

    private _settings: GanttSettings;
    private _svgHelper: SvgHelper;
    private _tableSvg: SVGSVGElement;
    private _objManager: GanttObjectManager;
    private _eventManager: EventManager;

    constructor(renderContext: RenderContext) {
        this._settings = renderContext.Settings;
        this._svgHelper = renderContext.SvgHelper;
        this._tableSvg = renderContext.DomStructure.TableSvg;
        this._objManager = renderContext.ObjectManager;
        this._eventManager = renderContext.EventManager;
    }


    public DrawTable() {
        var tableItemContainer = this._svgHelper.CreateGroup(0, 0, "table-container");
        this._tableSvg.appendChild(tableItemContainer);

        var tableElements = this._objManager.tableElements;
        var yPosition = 0;

        for (var rows = 0; rows < tableElements.length; rows++) {
            var element = tableElements[rows];
            yPosition = this.drawTableRecursively(yPosition, element, tableItemContainer);
        }
    }

    private drawTableRecursively(yPosition: number, element: IGanttTableElement, tableItemContainer: HTMLElement) {

        if (element.IsGroup) {
            var group = <GanttGroup>element;
            yPosition = this.createTableGroup(0, yPosition, group, tableItemContainer);

            if (!group.Expanded) {
                return yPosition;
            }

            for (var i = 0; i < group.SubElements.length; i++) {
                yPosition = this.drawTableRecursively(yPosition, group.SubElements[i], tableItemContainer);
            }

        } else {
            var resource = <GanttResource>element;
            yPosition = this.createTableResource(0, yPosition, resource, tableItemContainer);
        }

        return yPosition;
    }

    private createTableResource(x: number, y: number, resource: GanttResource, tableItemContainer: HTMLElement) {
        var laneHeight = resource.ResultingHeight;
        var width = this._settings.TableWidth;
        var group = this._svgHelper.CreateGroup(x, y);
        this._svgHelper.CreateRect(laneHeight, width, 0, 0, this._settings.TableResourceColor, 1, group);

        for (var i = 0; i < resource.DrawElements.length; i++) {
            resource.DrawElements[i].Draw(resource, group, width, laneHeight, this._svgHelper);
        }

        tableItemContainer.appendChild(group);

        return y + laneHeight;
    }

    private createTableGroup(x: number, y: number, ganttGroup: GanttGroup, tableItemContainer: HTMLElement) {
        var laneHeight = ganttGroup.ResultingHeight;
        var color = this._settings.TableGroupColor;
        var nodeText = ganttGroup.Name;
        var group = this._svgHelper.CreateGroup(x, y);
        this._svgHelper.CreateRect(laneHeight, this._settings.TableWidth, 0, 0, color, 1, group);
        this._svgHelper.CreateText(laneHeight, nodeText, group);
        var squareLength = 10;
        var collapseExpandButton = this._svgHelper.CreateRect(squareLength, squareLength, x + squareLength / 2, laneHeight / 2 - squareLength / 2, color, 1, group);
        var localEventManager = this._eventManager;
        collapseExpandButton.onclick = function (_evt) { localEventManager.RaiseGroupCollapseStateChangedEvent(ganttGroup.ID); };
        tableItemContainer.appendChild(group);

        return y + laneHeight;
    }
}