import { ElementRef, Renderer2 } from '@angular/core';
export declare class MdToolbarRow {
}
export declare class MdToolbar {
    private _elementRef;
    private _renderer;
    private _color;
    constructor(_elementRef: ElementRef, _renderer: Renderer2);
    /** The color of the toolbar. Can be primary, accent, or warn. */
    color: string;
    private _updateColor(newColor);
    private _setElementColor(color, isAdd);
}
