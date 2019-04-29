class Utils {
    public static FindNode(nodes: GanttNode[], node: GanttNode): number {
        for (var i = 0; i < nodes.length; i++) {
            if (node.ID == nodes[i].ID) {
                return i;
            }
        }

        return -1;
    }

    public static GetNodeInsertIndex(nodes: GanttNode[], planstart: number) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].PlanStart > planstart) {
                return i;
            }
        }

        return nodes.length;
    }

    public static GetMousePosition(event: MouseEvent, svg: SVGSVGElement) {
        var point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        var matrix = svg.getScreenCTM();
        point = point.matrixTransform(matrix.inverse());

        return new Point(point.x, point.y);
    }

    public static ApplyTranslation(target: CustomSvgGroup) {
        target.setAttribute("transform", "translate(" + target._x + "," + target._y + ")");
    }
}