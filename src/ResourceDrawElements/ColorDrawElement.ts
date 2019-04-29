class ColorDrawElement implements IResourceDrawElement {

    private _color: GanttColor;
    private _offsetStart: number;
    private _offsetEnd: number;

    constructor(color: GanttColor, xOffsetStart: number, xOffsetEnd: number) {
        this._color = color;
        this._offsetStart = xOffsetStart;
        this._offsetEnd = xOffsetEnd;
    }

    public Draw(_resource: GanttResource, group: CustomSvgGroup, _width: number, height: number, svgHelper: SvgHelper): void {
        svgHelper.CreateRect(height, this._offsetEnd - this._offsetStart, this._offsetStart, 0, this._color, 1, group);
    }

}