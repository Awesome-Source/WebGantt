class DragManager {
    private _dragElement: CustomSvgGroup;
    private _dragPoint: Point;
    private _svg: SVGSVGElement;
    private _dragStartedEvent: (target: HTMLElement) => void;
    private _dragEndedEvent: (target: HTMLElement) => void;
    private _source: any;
    private _verticalMoveAllowed: boolean;
    private _horizontalMoveAllowed: boolean;

    constructor(svg: SVGSVGElement, dragStartedEvent: (target: CustomSvgGroup) => void, dragEndedEvent: (target: CustomSvgGroup) => void, source: any) {
        this._dragElement = null;
        this._dragPoint = null;
        this._svg = svg;
        this._dragStartedEvent = dragStartedEvent;
        this._dragEndedEvent = dragEndedEvent;
        this._source = source;
        this._horizontalMoveAllowed = false;
        this._verticalMoveAllowed = false;

        var localDragManager = this;
        svg.onmousemove = function (evt) { localDragManager.DoDrag(evt); };
        svg.onmouseup = function (_evt) { localDragManager.EndDrag(); };
    }

    public StartDrag(e: MouseEvent) {
        this.StartDragWithElement(<HTMLElement>e.target, e);
    }

    public StartDragWithElement(element: HTMLElement, e: MouseEvent) {
        if (this._dragElement) {
            //we are already dragging an element
            return;
        }

        var targetElement = this.getGroupOfElement(element);

        if (targetElement.classList.contains("draggableXY")) {
            this.startDragInternal(targetElement, e);
            this._horizontalMoveAllowed = true;
            this._verticalMoveAllowed = true;
            return;
        }

        if (targetElement.classList.contains("draggableX")) {
            this.startDragInternal(targetElement, e);
            this._horizontalMoveAllowed = false;
            this._verticalMoveAllowed = true;
            return;
        }

        if (targetElement.classList.contains("draggableY")) {
            this.startDragInternal(targetElement, e);
            this._horizontalMoveAllowed = true;
            this._verticalMoveAllowed = false;
            return;
        }

        if (targetElement.classList.contains("no-drag")) {
            this.startDragInternal(targetElement, e);
            this._horizontalMoveAllowed = false;
            this._verticalMoveAllowed = false;
            return;
        }
    }

    private startDragInternal(targetElement: CustomSvgGroup, e: MouseEvent) {        
        var mousePosition = Utils.GetMousePosition(e, this._svg);

        this._dragElement = targetElement;
        this._dragPoint = mousePosition;
        this._dragStartedEvent.call(this._source, targetElement);
    }

    public DoDrag(e: MouseEvent) {
        var mousePosition = Utils.GetMousePosition(e, this._svg);

        if (this._dragElement) {

            if (this._horizontalMoveAllowed) {
                this._dragElement._x += mousePosition.X - this._dragPoint.X;
            }

            if (this._verticalMoveAllowed) {
                this._dragElement._y += mousePosition.Y - this._dragPoint.Y;
            }
            
            this._dragPoint = mousePosition;
            Utils.ApplyTranslation(this._dragElement);
        }
    }

    public EndDrag() {
        if (this._dragElement) {
            this._dragEndedEvent.call(this._source, this._dragElement);
            this._dragElement = null;
        }
    }

    private getGroupOfElement(element: HTMLElement): CustomSvgGroup {
        if (element.nodeName === "G" || element.nodeName === "g") {
            return <CustomSvgGroup>element;
        }

        var parent = element.parentElement;

        while (parent) {

            if (parent.nodeName === "G" || parent.nodeName === "g") {
                break;
            }

            parent = parent.parentElement
        }

        return <CustomSvgGroup>parent;
    }
}