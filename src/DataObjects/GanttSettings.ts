class GanttSettings {
    public LaneHeight: number;
    public TableWidth: number;
    public Width: number;
    public NodeHeight: number;
    public TextOffset: number;
    public NodeBorderThickness: number;
    public LaneColor: GanttColor;
    public TableGroupColor: GanttColor;
    public TableResourceColor: GanttColor;
    public TimeScaleColor: GanttColor;
    public TimeScaleTickColor: GanttColor;
    public TimeScalePullHandleColor: GanttColor;
    public ZoomFactor: number;
    public TimeScaleHeight: number;
    public DefaultDayLength: number;
    public ZoomBase: number;
    public HorizonStart: Date;
    public HorizonEnd: Date;
    public GanttHeight: number;
    public NumberOfDisplayedDays: number;
    public Title: string;

    constructor() {
        this.NumberOfDisplayedDays = 30;
        this.DefaultDayLength = 400;
        this.ZoomBase = 600;
        this.ZoomFactor = 1.0;
        this.LaneHeight = 48;
        this.NodeHeight = 28;
        this.TableWidth = 150;
        this.Width = this.NumberOfDisplayedDays * this.DefaultDayLength * this.ZoomFactor;
        this.TextOffset = 20;
        this.NodeBorderThickness = 0;
        this.LaneColor = GanttColor.FromHex("#ffffff");
        this.TableGroupColor = GanttColor.FromHex("#c0c4d8");
        this.TableResourceColor = GanttColor.FromHex("#e3e4e6");
        this.TimeScaleColor = GanttColor.FromHex("#e3e4e6");
        this.TimeScaleTickColor = new GanttColor(0, 0, 0);        
        this.TimeScalePullHandleColor = new GanttColor(0, 0, 0);        
        this.TimeScaleHeight = 50;        
        this.HorizonStart = new Date();
        this.HorizonEnd = new Date().addDays(this.NumberOfDisplayedDays);
        this.GanttHeight = 600;
        this.Title = "";
    }

    public GetCalculatedDayLength() {
        return this.DefaultDayLength * this.ZoomFactor;
    }

    public GetPixelLengthOfOneSecond() {
        return this.GetCalculatedDayLength() / 86400;
    }
}