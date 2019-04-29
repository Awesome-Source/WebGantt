class NodeRenderer {

    private _settings: GanttSettings;
    private _svgHelper: SvgHelper;
    private _laneSvg: SVGSVGElement;
    private _objManager: GanttObjectManager;
    private _nodeDrag: DragManager;
    private _eventManager: EventManager;

    constructor(renderContext: RenderContext) {
        this._settings = renderContext.Settings;
        this._svgHelper = renderContext.SvgHelper;
        this._laneSvg = renderContext.DomStructure.LaneSvg;
        this._objManager = renderContext.ObjectManager;
        this._eventManager = renderContext.EventManager;
        this._nodeDrag = new DragManager(this._laneSvg, this.nodeDragStarted, this.nodeDragEnded, this);
    }

    public DrawNodes() {
        var nodeContainer = this._svgHelper.CreateGroup(0, 0, "node-container");
        this._laneSvg.appendChild(nodeContainer);

        var tableElements = this._objManager.tableElements;
        var yPosition = 0;

        for (var rows = 0; rows < tableElements.length; rows++) {
            var element = tableElements[rows];
            yPosition = this.drawNodesRecursively(yPosition, element, nodeContainer);
        }
    }

    private drawNodesRecursively(yPosition: number, element: IGanttTableElement, nodeContainer: HTMLElement) {
        for (var i = 0; i < element.Nodes.length; i++) {
            this.drawSingleNode(element.Nodes[i], yPosition, nodeContainer);
        }

        yPosition += element.ResultingHeight;

        if (!element.IsGroup) {
            return yPosition;
        }

        var group = <GanttGroup>element;

        if (!group.Expanded) {
            return yPosition;
        }

        for (var i = 0; i < group.SubElements.length; i++) {
            var subElement = group.SubElements[i];
            yPosition = this.drawNodesRecursively(yPosition, subElement, nodeContainer);
        }

        return yPosition;
    }

    private drawSingleNode(node: GanttNode, y: number, nodeContainer: HTMLElement) {
        var xPosition = node.PlanStart * this._settings.GetPixelLengthOfOneSecond();
        var yPosition = y + this.getVerticalOffsetInLane(node);
        this.createDraggableRect(xPosition, yPosition, this._settings.NodeHeight, node.ID, node.DurationItems, nodeContainer);
    }

    private getVerticalOffsetInLane(node: GanttNode) {
        var laneHeight = this._settings.LaneHeight;
        var nodeHeight = this._settings.NodeHeight;
        var offsetInsideLane = (laneHeight - nodeHeight) / 2;

        return offsetInsideLane + (nodeHeight + offsetInsideLane) * node.HeightOffset;
    }

    private createDraggableRect(x: number, y: number, height: number, nodeID: string, durations: DurationItem[], nodeContainer: HTMLElement) {

        var group = this._svgHelper.CreateDraggableGroup(x, y, this._nodeDrag, true, true, nodeID);

        var offset = 0;

        for (var i = 0; i < durations.length; i++) {
            var durationItem = durations[i];

            if (durationItem.Duration === 0) {
                continue;
            }

            var lengthOfSecond = this._settings.GetPixelLengthOfOneSecond();
            var rectWidth = Math.max(1, durationItem.Duration * lengthOfSecond);

            this._svgHelper.CreateRect(height, rectWidth, offset, 0, durationItem.Color, this._settings.NodeBorderThickness, group);
            offset += rectWidth;
        }

        if (nodeID) {
            this._svgHelper.CreateText(height, nodeID, group);
        }

        nodeContainer.appendChild(group);
    }

    private nodeDragStarted(target: CustomSvgGroup) {
        this._eventManager.RaiseDragStartedEvent(target);
    }

    private nodeDragEnded(target: CustomSvgGroup) {
        this._eventManager.RaiseDragEndedEvent(target);
    }
}