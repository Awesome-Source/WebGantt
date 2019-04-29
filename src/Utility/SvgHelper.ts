class SvgHelper {
    private svgns = "http://www.w3.org/2000/svg";
    private settings: GanttSettings;

    constructor(settings: GanttSettings) {
        this.settings = settings;
    }

    public ChangeSvgHeight(svg: SVGSVGElement, newHeight: number): void {
        svg.setAttribute("height", "" + newHeight);
    }

    public CreateGroup(x: number, y: number, id: string = null): CustomSvgGroup {
        var group = <CustomSvgGroup>document.createElementNS(this.svgns, 'g');
        group.setAttribute("transform", "translate(" + x + "," + y + ")");

        if (id) {
            group.id = id;
        }

        return group;
    }

    public CreateDraggableGroup(x: number, y: number, dragManager: DragManager, verticalDraggable: boolean, horizontalDraggable: boolean, id: string = null): CustomSvgGroup {
        var group = this.CreateDraggableGroupWithoutHandler(x, y, verticalDraggable, horizontalDraggable, id);
        group.onmousedown = function (evt) { dragManager.StartDrag(<MouseEvent>evt); };

        return group;
    }

    public CreateDraggableGroupWithoutHandler(x: number, y: number, verticalDraggable: boolean, horizontalDraggable: boolean, id: string = null): CustomSvgGroup {
        var group = this.CreateGroup(x, y, id);

        group.classList.add("draggable");
        group.classList.add("noselect");
        group._x = x;
        group._y = y;

        if (verticalDraggable && horizontalDraggable) {
            group.classList.add("draggableXY");

            return group;
        }

        if (verticalDraggable) {
            group.classList.add("draggableY");

            return group;
        }

        if (horizontalDraggable) {
            group.classList.add("draggableX");

            return group;
        }

        group.classList.add("no-drag");

        return group;
    }

    public CreateRect(height: number, width: number, xOffset: number, yOffset: number, color: GanttColor, strokeWidth: number, parent: Element): SVGRectElement {
        var rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'x', '' + xOffset);
        rect.setAttributeNS(null, 'y', '' + yOffset);
        rect.setAttributeNS(null, 'height', '' + height);
        rect.setAttributeNS(null, 'width', '' + width);
        rect.setAttributeNS(null, 'style', 'fill:rgb(' + color.R + ',' + color.G + ',' + color.B + ');stroke-width:' + strokeWidth + ';stroke:rgb(0,0,0)');

        parent.appendChild(rect);

        return <SVGRectElement> rect;
    }

    public CreateTextDetailed(x: number, y: number, nodeText: string, group: Element) {
        var text = document.createElementNS(this.svgns, 'text');
        text.setAttributeNS(null, 'x', '' + x);
        text.setAttributeNS(null, 'y', '' + y);
        text.setAttributeNS(null, 'dy', '0.4em'); //center the text - IE and edge don't support alignment-baseline :(
        text.setAttributeNS(null, 'fill', "black");
        text.innerHTML = nodeText;

        group.appendChild(text);

        return text;
    }

    public CreateText(height: number, nodeText: string, group: Element) {
        var text = document.createElementNS(this.svgns, 'text');
        text.setAttributeNS(null, 'x', '' + this.settings.TextOffset);
        text.setAttributeNS(null, 'y', '' + (height / 2));
        text.setAttributeNS(null, 'dy', '0.4em'); //center the text - IE and edge don't support alignment-baseline :(
        text.setAttributeNS(null, 'fill', "black");
        text.innerHTML = nodeText;

        group.appendChild(text);

        return text;
    }

    public CreateLine(x1: number, x2: number, y1: number, y2: number, color: GanttColor, dotted: boolean, group: Element): HTMLElement {
        var line = document.createElementNS(this.svgns, 'line');
        line.setAttributeNS(null, 'x1', '' + x1);
        line.setAttributeNS(null, 'x2', '' + x2);
        line.setAttributeNS(null, 'y1', '' + y1);
        line.setAttributeNS(null, 'y2', '' + y2);
        line.setAttributeNS(null, 'y2', '' + y2);

        if (dotted) {
            line.setAttributeNS(null, 'stroke-dasharray', '6');
        }

        var strokeWidth = 1;
        line.setAttributeNS(null, 'style', 'stroke:rgb(' + color.R + ',' + color.G + ',' + color.B + ');stroke-width:' + strokeWidth);

        group.appendChild(line);

        return <HTMLElement>line;
    }
}