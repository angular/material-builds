import { ElementRef, Renderer } from '@angular/core';
import { Focusable } from '../core/a11y/list-key-manager';
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
export declare class MdMenuItem implements Focusable {
    private _renderer;
    private _elementRef;
    _disabled: boolean;
    constructor(_renderer: Renderer, _elementRef: ElementRef);
    focus(): void;
    /** Whether the menu item is disabled. */
    disabled: boolean;
    /** Sets the aria-disabled property on the menu item. */
    readonly isAriaDisabled: string;
    readonly _tabindex: string;
    _getHostElement(): HTMLElement;
    _checkDisabled(event: Event): void;
}
