class ScrollManager {
    _verticalTableScrollActive: boolean;
    _horizontalTimeScaleScrollActive: boolean;
    _verticalLanesScrollActive: boolean;
    _horizontalLanesScrollActive: boolean;
    _domStructure: GanttDomStructure;

    constructor(domStructure: GanttDomStructure) {
        this._domStructure = domStructure;
        this._verticalTableScrollActive = false;
        this._verticalLanesScrollActive = false;
        this._horizontalLanesScrollActive = false;
        this._horizontalTimeScaleScrollActive = false;
    }

    public SynchronizeScrollBars() {
        var localTableDiv = this._domStructure.TableDiv;
        var localLanesDiv = this._domStructure.LaneDiv;
        var localTimeScaleDiv = this._domStructure.TimeScaleDiv;
        var localManager = this;

        localTableDiv.onmouseenter = function (_evt) {
            localManager._verticalTableScrollActive = true;
            localManager._verticalLanesScrollActive = false;
            localManager._horizontalLanesScrollActive = false;
            localManager._horizontalTimeScaleScrollActive = false;
        }

        localLanesDiv.onmouseenter = function (_evt) {
            localManager._verticalTableScrollActive = false;
            localManager._verticalLanesScrollActive = true;
            localManager._horizontalLanesScrollActive = true;
            localManager._horizontalTimeScaleScrollActive = false;
        }

        localTimeScaleDiv.onmouseenter = function (_evt) {
            localManager._verticalTableScrollActive = false;
            localManager._verticalLanesScrollActive = false;
            localManager._horizontalLanesScrollActive = false;
            localManager._horizontalTimeScaleScrollActive = true;
        }

        localTimeScaleDiv.onscroll = function (_evt) {

            if (!localManager._horizontalTimeScaleScrollActive) {
                return;
            }

            localLanesDiv.scrollLeft = localTimeScaleDiv.scrollLeft;

        }

        localTableDiv.onscroll = function (_evt) {

            if (!localManager._verticalTableScrollActive) {
                return;
            }

            localLanesDiv.scrollTop = localTableDiv.scrollTop;

        }

        localLanesDiv.onscroll = function (_evt) {

            if (!localManager._verticalLanesScrollActive) {
                return;
            }

            localTableDiv.scrollTop = localLanesDiv.scrollTop;
            localTimeScaleDiv.scrollLeft = localLanesDiv.scrollLeft;
        }
    }
}