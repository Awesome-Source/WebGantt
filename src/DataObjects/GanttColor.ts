class GanttColor {

    R: number;
    G: number;
    B: number;

    constructor(r: number, g: number, b: number) {
        this.R = r;
        this.G = g;
        this.B = b;
    }

    public static FromHex(hexColor: string) {

        var beginOffset = hexColor.length == 6 ? 0 : 1;

        var r = parseInt(hexColor.substr(0 + beginOffset, 2), 16);
        var g = parseInt(hexColor.substr(2 + beginOffset, 2), 16);
        var b = parseInt(hexColor.substr(4 + beginOffset, 2), 16);

        return new GanttColor(r, g, b);
    }
}