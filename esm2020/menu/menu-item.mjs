/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, Inject, Optional, Input, ChangeDetectorRef, } from '@angular/core';
import { mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MAT_MENU_PANEL } from './menu-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/core";
// Boilerplate for applying mixins to MatMenuItem.
/** @docs-private */
const _MatMenuItemBase = mixinDisableRipple(mixinDisabled(class {
}));
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export class MatMenuItem extends _MatMenuItemBase {
    constructor(_elementRef, _document, _focusMonitor, _parentMenu, _changeDetectorRef) {
        super();
        this._elementRef = _elementRef;
        this._document = _document;
        this._focusMonitor = _focusMonitor;
        this._parentMenu = _parentMenu;
        this._changeDetectorRef = _changeDetectorRef;
        /** ARIA role for the menu item. */
        this.role = 'menuitem';
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
            // Start monitoring the element so it gets the appropriate focused classes. We want
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
        // Strip away icons so they don't show up in the text.
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
    _hasFocus() {
        return this._document && this._document.activeElement === this._getHostElement();
    }
}
MatMenuItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatMenuItem, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }, { token: i1.FocusMonitor }, { token: MAT_MENU_PANEL, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MatMenuItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatMenuItem, selector: "[mat-menu-item]", inputs: { disabled: "disabled", disableRipple: "disableRipple", role: "role" }, host: { listeners: { "click": "_checkDisabled($event)", "mouseenter": "_handleMouseEnter()" }, properties: { "attr.role": "role", "class.mat-mdc-menu-item-highlighted": "_highlighted", "class.mat-mdc-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled", "attr.disabled": "disabled || null" }, classAttribute: "mat-mdc-menu-item mat-mdc-focus-indicator mdc-list-item" }, exportAs: ["matMenuItem"], usesInheritance: true, ngImport: i0, template: "<ng-content select=\"mat-icon\"></ng-content>\n<span class=\"mdc-list-item__primary-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatMenuItem, decorators: [{
            type: Component,
            args: [{ selector: '[mat-menu-item]', exportAs: 'matMenuItem', inputs: ['disabled', 'disableRipple'], host: {
                        '[attr.role]': 'role',
                        'class': 'mat-mdc-menu-item mat-mdc-focus-indicator mdc-list-item',
                        '[class.mat-mdc-menu-item-highlighted]': '_highlighted',
                        '[class.mat-mdc-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.disabled]': 'disabled || null',
                        '(click)': '_checkDisabled($event)',
                        '(mouseenter)': '_handleMouseEnter()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content select=\"mat-icon\"></ng-content>\n<span class=\"mdc-list-item__primary-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n" }]
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFFTCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQWtCLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBZSxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7O0FBRTFELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQW9CSCxNQUFNLE9BQU8sV0FDWCxTQUFRLGdCQUFnQjtJQXNDeEIsWUFDVSxXQUFvQyxFQUNsQixTQUFlLEVBQ2pDLGFBQTRCLEVBQ08sV0FBdUMsRUFDMUUsa0JBQXNDO1FBRTlDLEtBQUssRUFBRSxDQUFDO1FBTkEsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ2xCLGNBQVMsR0FBVCxTQUFTLENBQU07UUFDakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDTyxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7UUFDMUUsdUJBQWtCLEdBQWxC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Z2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIElucHV0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRNZW51UGFuZWwsIE1BVF9NRU5VX1BBTkVMfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdE1lbnVJdGVtLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRNZW51SXRlbUJhc2UgPSBtaXhpbkRpc2FibGVSaXBwbGUobWl4aW5EaXNhYmxlZChjbGFzcyB7fSkpO1xuXG4vKipcbiAqIFNpbmdsZSBpdGVtIGluc2lkZSBvZiBhIGBtYXQtbWVudWAuIFByb3ZpZGVzIHRoZSBtZW51IGl0ZW0gc3R5bGluZyBhbmQgYWNjZXNzaWJpbGl0eSB0cmVhdG1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtbWVudS1pdGVtXScsXG4gIGV4cG9ydEFzOiAnbWF0TWVudUl0ZW0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtbWRjLW1lbnUtaXRlbSBtYXQtbWRjLWZvY3VzLWluZGljYXRvciBtZGMtbGlzdC1pdGVtJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbWVudS1pdGVtLWhpZ2hsaWdodGVkXSc6ICdfaGlnaGxpZ2h0ZWQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1tZW51LWl0ZW0tc3VibWVudS10cmlnZ2VyXSc6ICdfdHJpZ2dlcnNTdWJtZW51JyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ19nZXRUYWJJbmRleCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJyhjbGljayknOiAnX2NoZWNrRGlzYWJsZWQoJGV2ZW50KScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfaGFuZGxlTW91c2VFbnRlcigpJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlVXJsOiAnbWVudS1pdGVtLmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51SXRlbVxuICBleHRlbmRzIF9NYXRNZW51SXRlbUJhc2VcbiAgaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIENhbkRpc2FibGUsIENhbkRpc2FibGVSaXBwbGUsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveVxue1xuICAvKiogQVJJQSByb2xlIGZvciB0aGUgbWVudSBpdGVtLiAqL1xuICBASW5wdXQoKSByb2xlOiAnbWVudWl0ZW0nIHwgJ21lbnVpdGVtcmFkaW8nIHwgJ21lbnVpdGVtY2hlY2tib3gnID0gJ21lbnVpdGVtJztcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGhvdmVyZWQuICovXG4gIHJlYWRvbmx5IF9ob3ZlcmVkOiBTdWJqZWN0PE1hdE1lbnVJdGVtPiA9IG5ldyBTdWJqZWN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBtZW51IGl0ZW0gaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgX2ZvY3VzZWQgPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpdGVtIGlzIGhpZ2hsaWdodGVkLiAqL1xuICBfaGlnaGxpZ2h0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpdGVtIGFjdHMgYXMgYSB0cmlnZ2VyIGZvciBhIHN1Yi1tZW51LiAqL1xuICBfdHJpZ2dlcnNTdWJtZW51OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZG9jdW1lbnQ6IGFueSxcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+IHwgdW5kZWZpbmVkLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgYGRvY3VtZW50YCwgYGNoYW5nZURldGVjdG9yUmVmYCBhbmQgYGZvY3VzTW9uaXRvcmAgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZG9jdW1lbnQ/OiBhbnksXG4gICAgZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICAgIHBhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LFxuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ/OiBhbnksXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoTUFUX01FTlVfUEFORUwpIEBPcHRpb25hbCgpIHB1YmxpYyBfcGFyZW50TWVudT86IE1hdE1lbnVQYW5lbDxNYXRNZW51SXRlbT4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICBfcGFyZW50TWVudT8uYWRkSXRlbT8uKHRoaXMpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yICYmIG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2dldEhvc3RFbGVtZW50KCksIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2dldEhvc3RFbGVtZW50KCkuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNlZC5uZXh0KHRoaXMpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIC8vIFN0YXJ0IG1vbml0b3JpbmcgdGhlIGVsZW1lbnQgc28gaXQgZ2V0cyB0aGUgYXBwcm9wcmlhdGUgZm9jdXNlZCBjbGFzc2VzLiBXZSB3YW50XG4gICAgICAvLyB0byBzaG93IHRoZSBmb2N1cyBzdHlsZSBmb3IgbWVudSBpdGVtcyBvbmx5IHdoZW4gdGhlIGZvY3VzIHdhcyBub3QgY2F1c2VkIGJ5IGFcbiAgICAgIC8vIG1vdXNlIG9yIHRvdWNoIGludGVyYWN0aW9uLlxuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50TWVudSAmJiB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0pIHtcbiAgICAgIHRoaXMuX3BhcmVudE1lbnUucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlcmVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZm9jdXNlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFVzZWQgdG8gc2V0IHRoZSBgdGFiaW5kZXhgLiAqL1xuICBfZ2V0VGFiSW5kZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICctMScgOiAnMCc7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaG9zdCBET00gZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFByZXZlbnRzIHRoZSBkZWZhdWx0IGVsZW1lbnQgYWN0aW9ucyBpZiBpdCBpcyBkaXNhYmxlZC4gKi9cbiAgX2NoZWNrRGlzYWJsZWQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgdG8gdGhlIGhvdmVyIHN0cmVhbS4gKi9cbiAgX2hhbmRsZU1vdXNlRW50ZXIoKSB7XG4gICAgdGhpcy5faG92ZXJlZC5uZXh0KHRoaXMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIHRvIGJlIHVzZWQgd2hlbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBvcHRpb24gc2hvdWxkIGJlIGZvY3VzZWQuICovXG4gIGdldExhYmVsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgY2xvbmUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGljb25zID0gY2xvbmUucXVlcnlTZWxlY3RvckFsbCgnbWF0LWljb24sIC5tYXRlcmlhbC1pY29ucycpO1xuXG4gICAgLy8gU3RyaXAgYXdheSBpY29ucyBzbyB0aGV5IGRvbid0IHNob3cgdXAgaW4gdGhlIHRleHQuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWNvbnNbaV0ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb25lLnRleHRDb250ZW50Py50cmltKCkgfHwgJyc7XG4gIH1cblxuICBfc2V0SGlnaGxpZ2h0ZWQoaXNIaWdobGlnaHRlZDogYm9vbGVhbikge1xuICAgIC8vIFdlIG5lZWQgdG8gbWFyayB0aGlzIGZvciBjaGVjayBmb3IgdGhlIGNhc2Ugd2hlcmUgdGhlIGNvbnRlbnQgaXMgY29taW5nIGZyb20gYVxuICAgIC8vIGBtYXRNZW51Q29udGVudGAgd2hvc2UgY2hhbmdlIGRldGVjdGlvbiB0cmVlIGlzIGF0IHRoZSBkZWNsYXJhdGlvbiBwb3NpdGlvbixcbiAgICAvLyBub3QgdGhlIGluc2VydGlvbiBwb3NpdGlvbi4gU2VlICMyMzE3NS5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAuXG4gICAgdGhpcy5faGlnaGxpZ2h0ZWQgPSBpc0hpZ2hsaWdodGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIF9oYXNGb2N1cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnQgJiYgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZ2V0SG9zdEVsZW1lbnQoKTtcbiAgfVxufVxuIiwiPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWljb25cIj48L25nLWNvbnRlbnQ+XG48c3BhbiBjbGFzcz1cIm1kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48ZGl2IGNsYXNzPVwibWF0LW1kYy1tZW51LXJpcHBsZVwiIG1hdFJpcHBsZVxuICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZVJpcHBsZSB8fCBkaXNhYmxlZFwiXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cIl9nZXRIb3N0RWxlbWVudCgpXCI+XG48L2Rpdj5cbjxzdmdcbiAgKm5nSWY9XCJfdHJpZ2dlcnNTdWJtZW51XCJcbiAgY2xhc3M9XCJtYXQtbWRjLW1lbnUtc3VibWVudS1pY29uXCJcbiAgdmlld0JveD1cIjAgMCA1IDEwXCJcbiAgZm9jdXNhYmxlPVwiZmFsc2VcIj48cG9seWdvbiBwb2ludHM9XCIwLDAgNSw1IDAsMTBcIi8+PC9zdmc+XG4iXX0=