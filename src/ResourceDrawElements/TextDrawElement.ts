class TextDrawElement implements IResourceDrawElement {

    private _offsetStart: number;
    public _Text: string;

    constructor(xOffsetStart: number, text: string) {
        this._offsetStart = xOffsetStart;
        this._Text = text;
    }

    public Draw(_resource: GanttResource, group: CustomSvgGroup, _width: number, height: number, svgHelper: SvgHelper): void {
        svgHelper.CreateTextDetailed(this._offsetStart, height / 2, this._Text, group);
    }
}