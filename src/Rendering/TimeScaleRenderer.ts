class TimeScaleRenderer {

    private _settings: GanttSettings;
    private _svgHelper: SvgHelper;
    private _timescaleSvg: SVGSVGElement;
    private _pullHandle: HTMLElement;
    private _pullHandleDrag: DragManager;
    private _eventManager: EventManager;
    private _dragStartTime: number;
    private _dragEndTime: number;

    constructor(renderContext: RenderContext) {
        this._settings = renderContext.Settings;
        this._svgHelper = renderContext.SvgHelper;
        this._timescaleSvg = renderContext.DomStructure.TimeScaleSvg;
        this._eventManager = renderContext.EventManager;
        var localDragManager = new DragManager(this._timescaleSvg, this.pullHandleDragStarted, this.pullHandleDragEnded, this);
        this._pullHandleDrag = localDragManager;
        renderContext.DomStructure.TimeScaleDiv.onmouseleave = function (_evt) { localDragManager.EndDrag() };
    }

    public DrawTimeScale() {
        var group = this._svgHelper.CreateGroup(0, 0);
        group.classList.add("noselect");

        var timescale = this.createTimeScale();
        var pullHandle = this.createPullHandle();

        group.appendChild(timescale);
        group.appendChild(pullHandle);
        this._timescaleSvg.appendChild(group);
    }

    private createTimeScale() {
        var timeScaleHeight = this._settings.TimeScaleHeight;
        var dayLength = this._settings.DefaultDayLength * this._settings.ZoomFactor;
        var hourLength = dayLength / 24;

        var timescaleGroup = this._svgHelper.CreateGroup(0, 0);
        this._svgHelper.CreateRect(timeScaleHeight, this._settings.Width, 0, 0, this._settings.TimeScaleColor, 0, timescaleGroup);

        for (var d = 0; d < this._settings.NumberOfDisplayedDays; d++) {
            var xPosition = d * dayLength;
            this._svgHelper.CreateLine(xPosition, xPosition, 0, timeScaleHeight, this._settings.TimeScaleTickColor, false, timescaleGroup);
            var date = this._settings.HorizonStart.clone();
            var dateString = date.addDays(d).toDateString();
            this._svgHelper.CreateTextDetailed(xPosition + 10, timeScaleHeight / 2 - 12, dateString, timescaleGroup);

            for (var h = 1; h < 24; h++) {
                var currentHourTickPosition = xPosition + h * hourLength;
                var lineHeight = h % 2 == 0 ? timeScaleHeight / 3 : timeScaleHeight / 5;
                this._svgHelper.CreateLine(currentHourTickPosition, currentHourTickPosition, timeScaleHeight - lineHeight, timeScaleHeight, this._settings.TimeScaleTickColor, false, timescaleGroup);
            }
        }

        return timescaleGroup;
    }

    private createPullHandle() {
        var pullHandle = this._svgHelper.CreateDraggableGroupWithoutHandler(0, 0, true, false);

        var localDragManager = this._pullHandleDrag;
        var localSvg = this._timescaleSvg;

        this._timescaleSvg.onmousedown = function (evt) {
            pullHandle._x = Utils.GetMousePosition(evt, localSvg).X;
            pullHandle._y = 0;
            Utils.ApplyTranslation(pullHandle);
            localDragManager.StartDragWithElement(pullHandle, evt);
        };

        this._pullHandle = pullHandle;
        pullHandle.style.display = "none";
        this._svgHelper.CreateLine(0, 0, 0, this._settings.TimeScaleHeight, this._settings.TimeScalePullHandleColor, false, pullHandle);

        return pullHandle;
    }

    private pullHandleDragStarted(target: CustomSvgGroup) {
        this._pullHandle.style.display = "block";
        this._dragStartTime = target._x;
    }

    private pullHandleDragEnded(target: CustomSvgGroup) {
        this._pullHandle.style.display = "none";
        this._dragEndTime = target._x;

        var timeDelta = this._dragEndTime - this._dragStartTime;
        var zoomFactorAddition = timeDelta / this._settings.ZoomBase;
        var newZoomFactor = this._settings.ZoomFactor * (1 + zoomFactorAddition);
        this._settings.ZoomFactor = Math.max(newZoomFactor, 0.05);
        this._eventManager.RaiseRedrawEvent(new RedrawInfo());
    }
}