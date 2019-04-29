class GanttManager
{
    private static _managers: { [key: string]: GanttManager; } = {};
    private _eventManager: EventManager;
    private _renderer: GanttRenderer;
    private _domStructure: GanttDomStructure;
    private _settings: GanttSettings;
    private _objectManager: GanttObjectManager;

    constructor(ganttDivId: string, settings: GanttSettings) {
        this._settings = settings;
        this._domStructure = new GanttDomStructure(settings);
        this._domStructure.CreateDomStructure(ganttDivId, 17);
        this._eventManager = new EventManager();
        this._objectManager = new GanttObjectManager();
        this._eventManager.RegisterDragEndedCallback(this, this.snapToLane);
        this._renderer = new GanttRenderer(this._domStructure, this._eventManager, settings, this._objectManager);
        new ScrollManager(this._domStructure).SynchronizeScrollBars();
        GanttManager._managers[ganttDivId] = this;
    }

    public static GetManagerById(id: string) {
        var manager = GanttManager._managers[id];

        if (manager) {
            return manager;
        }

        return null;
    }

    public CreateGroup(name: string): GanttGroup {
        return this._objectManager.CreateGroup(name);
    }

    public CreateNode(nodeName: string, tableElementID: number, planStart: number): GanttNode {
        return this._objectManager.CreateNode(nodeName, tableElementID, planStart);
    }

    public CreateDateLine(time: number, color: GanttColor): GanttDateLine {
        return this._objectManager.CreateDateLine(time, color);
    }

    public ReDraw(): void {
        this._renderer.ReDraw();
    }    

    public GetNodeById(id: string): GanttNode {
        return this._objectManager.GetNodeById(id);
    }

    private snapToLane(nodeElement: CustomSvgGroup) {
        if (!nodeElement.classList.contains('draggable')) {
            return;
        }

        var yCenterPos = (nodeElement._y + this._settings.NodeHeight / 2);
        var tableElement = this._renderer.GetTableElementForYPosition(yCenterPos);
        var node = this.GetNodeById(nodeElement.id);

        if (!node) {
            console.error("Could not find node for id:" + nodeElement.id);
            return;
        }

        var previousElement = this._objectManager.FindTableElementById(node.TableElementID);
        nodeElement.setAttribute("transform", "translate(" + nodeElement._x + "," + yCenterPos + ")");
        node.PlanStart = nodeElement._x / this._settings.GetPixelLengthOfOneSecond();
        previousElement.RemoveNode(node);
        node.TableElementID = tableElement.ID;
        tableElement.AddNode(node);
        this._eventManager.RaiseRedrawEvent(new RedrawInfo());
    }
}