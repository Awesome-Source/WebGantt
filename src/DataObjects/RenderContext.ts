class RenderContext {
    public DomStructure: GanttDomStructure;
    public Settings: GanttSettings;
    public SvgHelper: SvgHelper;
    public ObjectManager: GanttObjectManager;
    public EventManager: EventManager;

    constructor(domStructure: GanttDomStructure, settings: GanttSettings, svgHelper: SvgHelper, objectManager: GanttObjectManager, eventManager: EventManager) {
        this.DomStructure = domStructure;
        this.Settings = settings;
        this.SvgHelper = svgHelper;
        this.ObjectManager = objectManager;
        this.EventManager = eventManager;
    }
}