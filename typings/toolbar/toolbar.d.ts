import { ElementRef, Renderer2 } from '@angular/core';
import { CanColor } from '../core/common-behaviors/color';
export declare class MdToolbarRow {
}
export declare class MdToolbarBase {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
}
export declare const _MdToolbarMixinBase: (new (...args: any[]) => CanColor) & typeof MdToolbarBase;
export declare class MdToolbar extends _MdToolbarMixinBase implements CanColor {
    constructor(renderer: Renderer2, elementRef: ElementRef);
}
