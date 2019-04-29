class NodePositionCalculator {

    private _objectManager: GanttObjectManager;
    private _settings: GanttSettings;

    constructor(renderContext: RenderContext) {
        this._objectManager = renderContext.ObjectManager;
        this._settings = renderContext.Settings;
    }

    public CalculatePositions() {
        this.calculatePositionsRecursively(this._objectManager.tableElements);
    }

    private calculatePositionsRecursively(elements: IGanttTableElement[]) {
        for (var i = 0; i < elements.length; i++) {
            var currentElement = elements[i];
            this.calculatePositionsForTableElement(currentElement);

            if (currentElement.IsGroup) {
                var group = <GanttGroup>currentElement;
                if (group.Expanded) {
                    this.calculatePositionsRecursively(group.SubElements);
                }                
            }
        }
    }

    private calculatePositionsForTableElement(element: IGanttTableElement) {
        this.calculatePlanendOfNodes(element.Nodes);

        var currentHeightMultiplier = 1;

        for (var i = 0; i < element.Nodes.length; i++) {
            var parallelNodes = this.setHeightOffsetForNodes(element.Nodes[i], element.Nodes);
            currentHeightMultiplier = Math.max(currentHeightMultiplier, parallelNodes);
        }

        element.ResultingHeight = this.calculateElementHeight(currentHeightMultiplier);
    }

    private calculateElementHeight(heightMultiplier: number) {
        var laneHeight = this._settings.LaneHeight;
        var nodeHeight = this._settings.NodeHeight;
        var offsetInsideLane = (laneHeight - nodeHeight) / 2;

        return offsetInsideLane + (nodeHeight + offsetInsideLane) * heightMultiplier;
    }

    private setHeightOffsetForNodes(investigatedNode: GanttNode, nodes: GanttNode[]) {
        if (investigatedNode.IsHeightSet) {
            return investigatedNode.HeightOffset;
        }

        var takenOffsets: number[] = [];

        for (var i = 0; i < nodes.length; i++) {
            var currentNode = nodes[i];

            if (currentNode.PlanStart > investigatedNode.CalculatedPlanEnd || currentNode.CalculatedPlanEnd < investigatedNode.PlanStart) {
                continue;
            }

            if (currentNode.IsHeightSet) {
                takenOffsets.push(currentNode.HeightOffset);
                continue;
            }

            currentNode.HeightOffset = this.determineNodeHeightOffset(takenOffsets);
            currentNode.IsHeightSet = true;
            takenOffsets.push(currentNode.HeightOffset);
        }

        return takenOffsets.length;
    }

    private determineNodeHeightOffset(takenOffsets: number[]) {
        var smallestOffset = 0;
        takenOffsets.sort();
        for (var i = 0; i < takenOffsets.length; i++) {
            var currentOffset = takenOffsets[i];

            if (smallestOffset < currentOffset) {
                return smallestOffset;
            }

            if (smallestOffset === currentOffset) {
                smallestOffset += 1;
            }
        }

        return smallestOffset;
    }

    private calculatePlanendOfNodes(nodes: GanttNode[]) {
        for (var i = 0; i < nodes.length; i++) {
            var currentNode = nodes[i];
            var durationItems = currentNode.DurationItems;
            var completeDuration = 0;
            for (var d = 0; d < durationItems.length; d++) {
                completeDuration += durationItems[d].Duration;
            }

            currentNode.CompleteDuration = completeDuration;
            currentNode.CalculatedPlanEnd = currentNode.PlanStart + completeDuration;
            currentNode.HeightOffset = 0;
            currentNode.IsHeightSet = false;
        }
    }
}