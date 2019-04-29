interface IResourceDrawElement {
    Draw(resource: GanttResource, group: CustomSvgGroup, width: number, height: number, svgHelper: SvgHelper): void;
}