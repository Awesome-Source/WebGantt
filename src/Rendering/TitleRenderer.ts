class TitleRenderer {
    private _settings: GanttSettings;
    private _svgHelper: SvgHelper;
    private _titleSvg: SVGSVGElement;

    constructor(renderContext: RenderContext) {
        this._settings = renderContext.Settings;
        this._svgHelper = renderContext.SvgHelper;
        this._titleSvg = renderContext.DomStructure.TitleSvg;
    }

    public DrawTitle() {
        var group = this._svgHelper.CreateGroup(0, 0);
        this._svgHelper.CreateRect(this._settings.TimeScaleHeight, this._settings.TableWidth, 0, 0, this._settings.TimeScaleColor, 0, group);
        this._titleSvg.appendChild(group);
        this._svgHelper.CreateTextDetailed(10, this._settings.TimeScaleHeight / 2, this._settings.Title, this._titleSvg);
    }
}