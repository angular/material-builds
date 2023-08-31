/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, Inject, Optional, Input, ChangeDetectorRef, booleanAttribute, } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MAT_MENU_PANEL } from './menu-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/core";
/**
 * Single item inside a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export class MatMenuItem {
    constructor(_elementRef, _document, _focusMonitor, _parentMenu, _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._document = _document;
        this._focusMonitor = _focusMonitor;
        this._parentMenu = _parentMenu;
        this._changeDetectorRef = _changeDetectorRef;
        /** ARIA role for the menu item. */
        this.role = 'menuitem';
        /** Whether the menu item is disabled. */
        this.disabled = false;
        /** Whether ripples are disabled on the menu item. */
        this.disableRipple = false;
        /** Stream that emits when the menu item is hovered. */
        this._hovered = new Subject();
        /** Stream that emits when the menu item is focused. */
        this._focused = new Subject();
        /** Whether the menu item is highlighted. */
        this._highlighted = false;
        /** Whether the menu item acts as a trigger for a sub-menu. */
        this._triggersSubmenu = false;
        _parentMenu?.addItem?.(this);
    }
    /** Focuses the menu item. */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._getHostElement(), origin, options);
        }
        else {
            this._getHostElement().focus(options);
        }
        this._focused.next(this);
    }
    ngAfterViewInit() {
        if (this._focusMonitor) {
            // Start monitoring the element, so it gets the appropriate focused classes. We want
            // to show the focus style for menu items only when the focus was not caused by a
            // mouse or touch interaction.
            this._focusMonitor.monitor(this._elementRef, false);
        }
    }
    ngOnDestroy() {
        if (this._focusMonitor) {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        if (this._parentMenu && this._parentMenu.removeItem) {
            this._parentMenu.removeItem(this);
        }
        this._hovered.complete();
        this._focused.complete();
    }
    /** Used to set the `tabindex`. */
    _getTabIndex() {
        return this.disabled ? '-1' : '0';
    }
    /** Returns the host DOM element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /** Emits to the hover stream. */
    _handleMouseEnter() {
        this._hovered.next(this);
    }
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel() {
        const clone = this._elementRef.nativeElement.cloneNode(true);
        const icons = clone.querySelectorAll('mat-icon, .material-icons');
        // Strip away icons, so they don't show up in the text.
        for (let i = 0; i < icons.length; i++) {
            icons[i].remove();
        }
        return clone.textContent?.trim() || '';
    }
    _setHighlighted(isHighlighted) {
        // We need to mark this for check for the case where the content is coming from a
        // `matMenuContent` whose change detection tree is at the declaration position,
        // not the insertion position. See #23175.
        // @breaking-change 12.0.0 Remove null check for `_changeDetectorRef`.
        this._highlighted = isHighlighted;
        this._changeDetectorRef?.markForCheck();
    }
    _setTriggersSubmenu(triggersSubmenu) {
        // @breaking-change 12.0.0 Remove null check for `_changeDetectorRef`.
        this._triggersSubmenu = triggersSubmenu;
        this._changeDetectorRef?.markForCheck();
    }
    _hasFocus() {
        return this._document && this._document.activeElement === this._getHostElement();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatMenuItem, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }, { token: i1.FocusMonitor }, { token: MAT_MENU_PANEL, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatMenuItem, selector: "[mat-menu-item]", inputs: { role: "role", disabled: ["disabled", "disabled", booleanAttribute], disableRipple: ["disableRipple", "disableRipple", booleanAttribute] }, host: { listeners: { "click": "_checkDisabled($event)", "mouseenter": "_handleMouseEnter()" }, properties: { "attr.role": "role", "class.mat-mdc-menu-item-highlighted": "_highlighted", "class.mat-mdc-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled", "attr.disabled": "disabled || null" }, classAttribute: "mat-mdc-menu-item mat-mdc-focus-indicator" }, exportAs: ["matMenuItem"], ngImport: i0, template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mat-mdc-menu-item-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatMenuItem, decorators: [{
            type: Component,
            args: [{ selector: '[mat-menu-item]', exportAs: 'matMenuItem', host: {
                        '[attr.role]': 'role',
                        'class': 'mat-mdc-menu-item mat-mdc-focus-indicator',
                        '[class.mat-mdc-menu-item-highlighted]': '_highlighted',
                        '[class.mat-mdc-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.disabled]': 'disabled || null',
                        '(click)': '_checkDisabled($event)',
                        '(mouseenter)': '_handleMouseEnter()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mat-mdc-menu-item-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_MENU_PANEL]
                }, {
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { role: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFFTCxpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7Ozs7QUFFMUQ7O0dBRUc7QUFtQkgsTUFBTSxPQUFPLFdBQVc7SUEwQ3RCLFlBQ1UsV0FBb0MsRUFDbEIsU0FBZSxFQUNqQyxhQUE0QixFQUNPLFdBQXVDLEVBQzFFLGtCQUFzQztRQUp0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDbEIsY0FBUyxHQUFULFNBQVMsQ0FBTTtRQUNqQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUNPLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtRQUMxRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBOUNoRCxtQ0FBbUM7UUFDMUIsU0FBSSxHQUFzRCxVQUFVLENBQUM7UUFFOUUseUNBQXlDO1FBQ0gsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUVoRSxxREFBcUQ7UUFDZixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUVyRSx1REFBdUQ7UUFDOUMsYUFBUSxHQUF5QixJQUFJ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QyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBR0UsYUFBYTtzQkFBbEQsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBJbnB1dCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRNZW51UGFuZWwsIE1BVF9NRU5VX1BBTkVMfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuXG4vKipcbiAqIFNpbmdsZSBpdGVtIGluc2lkZSBhIGBtYXQtbWVudWAuIFByb3ZpZGVzIHRoZSBtZW51IGl0ZW0gc3R5bGluZyBhbmQgYWNjZXNzaWJpbGl0eSB0cmVhdG1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtbWVudS1pdGVtXScsXG4gIGV4cG9ydEFzOiAnbWF0TWVudUl0ZW0nLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtbWRjLW1lbnUtaXRlbSBtYXQtbWRjLWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW1lbnUtaXRlbS1oaWdobGlnaHRlZF0nOiAnX2hpZ2hsaWdodGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbWVudS1pdGVtLXN1Ym1lbnUtdHJpZ2dlcl0nOiAnX3RyaWdnZXJzU3VibWVudScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICcoY2xpY2spJzogJ19jaGVja0Rpc2FibGVkKCRldmVudCknLFxuICAgICcobW91c2VlbnRlciknOiAnX2hhbmRsZU1vdXNlRW50ZXIoKScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUtaXRlbS5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW0gaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBBUklBIHJvbGUgZm9yIHRoZSBtZW51IGl0ZW0uICovXG4gIEBJbnB1dCgpIHJvbGU6ICdtZW51aXRlbScgfCAnbWVudWl0ZW1yYWRpbycgfCAnbWVudWl0ZW1jaGVja2JveCcgPSAnbWVudWl0ZW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiB0aGUgbWVudSBpdGVtLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pIGRpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGhvdmVyZWQuICovXG4gIHJlYWRvbmx5IF9ob3ZlcmVkOiBTdWJqZWN0PE1hdE1lbnVJdGVtPiA9IG5ldyBTdWJqZWN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBtZW51IGl0ZW0gaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgX2ZvY3VzZWQgPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGhpZ2hsaWdodGVkLiAqL1xuICBfaGlnaGxpZ2h0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpdGVtIGFjdHMgYXMgYSB0cmlnZ2VyIGZvciBhIHN1Yi1tZW51LiAqL1xuICBfdHJpZ2dlcnNTdWJtZW51OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZG9jdW1lbnQ6IGFueSxcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+IHwgdW5kZWZpbmVkLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgYGRvY3VtZW50YCwgYGNoYW5nZURldGVjdG9yUmVmYCBhbmQgYGZvY3VzTW9uaXRvcmAgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZG9jdW1lbnQ/OiBhbnksXG4gICAgZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICAgIHBhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LFxuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ/OiBhbnksXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoTUFUX01FTlVfUEFORUwpIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50TWVudT86IE1hdE1lbnVQYW5lbDxNYXRNZW51SXRlbT4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgX3BhcmVudE1lbnU/LmFkZEl0ZW0/Lih0aGlzKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvciAmJiBvcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9nZXRIb3N0RWxlbWVudCgpLCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9nZXRIb3N0RWxlbWVudCgpLmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICAvLyBTdGFydCBtb25pdG9yaW5nIHRoZSBlbGVtZW50LCBzbyBpdCBnZXRzIHRoZSBhcHByb3ByaWF0ZSBmb2N1c2VkIGNsYXNzZXMuIFdlIHdhbnRcbiAgICAgIC8vIHRvIHNob3cgdGhlIGZvY3VzIHN0eWxlIGZvciBtZW51IGl0ZW1zIG9ubHkgd2hlbiB0aGUgZm9jdXMgd2FzIG5vdCBjYXVzZWQgYnkgYVxuICAgICAgLy8gbW91c2Ugb3IgdG91Y2ggaW50ZXJhY3Rpb24uXG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvcikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnRNZW51ICYmIHRoaXMuX3BhcmVudE1lbnUucmVtb3ZlSXRlbSkge1xuICAgICAgdGhpcy5fcGFyZW50TWVudS5yZW1vdmVJdGVtKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuX2hvdmVyZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9mb2N1c2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogVXNlZCB0byBzZXQgdGhlIGB0YWJpbmRleGAuICovXG4gIF9nZXRUYWJJbmRleCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8gJy0xJyA6ICcwJztcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBob3N0IERPTSBlbGVtZW50LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogUHJldmVudHMgdGhlIGRlZmF1bHQgZWxlbWVudCBhY3Rpb25zIGlmIGl0IGlzIGRpc2FibGVkLiAqL1xuICBfY2hlY2tEaXNhYmxlZChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyB0byB0aGUgaG92ZXIgc3RyZWFtLiAqL1xuICBfaGFuZGxlTW91c2VFbnRlcigpIHtcbiAgICB0aGlzLl9ob3ZlcmVkLm5leHQodGhpcyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgdG8gYmUgdXNlZCB3aGVuIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIG9wdGlvbiBzaG91bGQgYmUgZm9jdXNlZC4gKi9cbiAgZ2V0TGFiZWwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjbG9uZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgaWNvbnMgPSBjbG9uZS5xdWVyeVNlbGVjdG9yQWxsKCdtYXQtaWNvbiwgLm1hdGVyaWFsLWljb25zJyk7XG5cbiAgICAvLyBTdHJpcCBhd2F5IGljb25zLCBzbyB0aGV5IGRvbid0IHNob3cgdXAgaW4gdGhlIHRleHQuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWNvbnNbaV0ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb25lLnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XG4gIH1cblxuICBfc2V0SGlnaGxpZ2h0ZWQoaXNIaWdobGlnaHRlZDogYm9vbGVhbikge1xuICAgIC8vIFdlIG5lZWQgdG8gbWFyayB0aGlzIGZvciBjaGVjayBmb3IgdGhlIGNhc2Ugd2hlcmUgdGhlIGNvbnRlbnQgaXMgY29taW5nIGZyb20gYVxuICAgIC8vIGBtYXRNZW51Q29udGVudGAgd2hvc2UgY2hhbmdlIGRldGVjdGlvbiB0cmVlIGlzIGF0IHRoZSBkZWNsYXJhdGlvbiBwb3NpdGlvbixcbiAgICAvLyBub3QgdGhlIGluc2VydGlvbiBwb3NpdGlvbi4gU2VlICMyMzE3NS5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAuXG4gICAgdGhpcy5faGlnaGxpZ2h0ZWQgPSBpc0hpZ2hsaWdodGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIF9zZXRUcmlnZ2Vyc1N1Ym1lbnUodHJpZ2dlcnNTdWJtZW51OiBib29sZWFuKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMi4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLlxuICAgIHRoaXMuX3RyaWdnZXJzU3VibWVudSA9IHRyaWdnZXJzU3VibWVudTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFzRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50ICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2dldEhvc3RFbGVtZW50KCk7XG4gIH1cbn1cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1pY29uLCBbbWF0TWVudUl0ZW1JY29uXVwiPjwvbmctY29udGVudD5cbjxzcGFuIGNsYXNzPVwibWF0LW1kYy1tZW51LWl0ZW0tdGV4dFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48ZGl2IGNsYXNzPVwibWF0LW1kYy1tZW51LXJpcHBsZVwiIG1hdFJpcHBsZVxuICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZVJpcHBsZSB8fCBkaXNhYmxlZFwiXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cIl9nZXRIb3N0RWxlbWVudCgpXCI+XG48L2Rpdj5cbjxzdmdcbiAgKm5nSWY9XCJfdHJpZ2dlcnNTdWJtZW51XCJcbiAgY2xhc3M9XCJtYXQtbWRjLW1lbnUtc3VibWVudS1pY29uXCJcbiAgdmlld0JveD1cIjAgMCA1IDEwXCJcbiAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICBhcmlhLWhpZGRlbj1cInRydWVcIj48cG9seWdvbiBwb2ludHM9XCIwLDAgNSw1IDAsMTBcIi8+PC9zdmc+XG4iXX0=