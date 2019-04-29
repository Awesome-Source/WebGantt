class EventManager{
    private _groupCollapseStateChangedCallbacks: EventCallback<number>[];
    private _dragStartedCallbacks: EventCallback<CustomSvgGroup>[];
    private _dragEndedCallbacks: EventCallback<CustomSvgGroup>[];
    private _redrawCallbacks: EventCallback<RedrawInfo>[];

    constructor() {
        this._groupCollapseStateChangedCallbacks = [];
        this._dragStartedCallbacks = [];
        this._dragEndedCallbacks = [];
        this._redrawCallbacks = [];
    }

    //Group collapse state changed
    public RegisterGroupCollapseStateChangedCallback(owner: any, callback: (groupID: number) => void): void
    {
        this._groupCollapseStateChangedCallbacks.push(new EventCallback(owner, callback));
    }

    public RaiseGroupCollapseStateChangedEvent(groupID: number)
    {
        this.RaiseEvent(this._groupCollapseStateChangedCallbacks, groupID);
    }

    //drag started
    public RegisterDragStartedCallback(owner: any,callback: (group: CustomSvgGroup) => void): void {
        this._dragStartedCallbacks.push(new EventCallback(owner, callback));
    }

    public RaiseDragStartedEvent(group: CustomSvgGroup) {
        this.RaiseEvent(this._dragStartedCallbacks, group);
    }

    //drag ended
    public RegisterDragEndedCallback(owner: any, callback: (group: CustomSvgGroup) => void): void {
        this._dragEndedCallbacks.push(new EventCallback(owner, callback));
    }

    public RaiseDragEndedEvent(group: CustomSvgGroup) {
        this.RaiseEvent(this._dragEndedCallbacks, group);
    }

    //redraw
    public RegisterRedrawCallback(owner: any, callback: (redrawInfo: RedrawInfo) => void): void {
        this._redrawCallbacks.push(new EventCallback(owner, callback));
    }

    public RaiseRedrawEvent(redrawInfo: RedrawInfo) {
        this.RaiseEvent(this._redrawCallbacks, redrawInfo);
    }

    private RaiseEvent<TCallback, TParameter>(callbacks: EventCallback<TCallback>[], parameter: TParameter) {
        for (var i = 0; i < callbacks.length; i++) {
            var eventCallback = callbacks[i];
            eventCallback.Callback.call(eventCallback.Owner, parameter);
        }
    }
}