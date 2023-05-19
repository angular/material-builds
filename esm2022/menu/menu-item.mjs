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
class MatMenuItem extends _MatMenuItemBase {
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
    _setTriggersSubmenu(triggersSubmenu) {
        // @breaking-change 12.0.0 Remove null check for `_changeDetectorRef`.
        this._triggersSubmenu = triggersSubmenu;
        this._changeDetectorRef?.markForCheck();
    }
    _hasFocus() {
        return this._document && this._document.activeElement === this._getHostElement();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuItem, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }, { token: i1.FocusMonitor }, { token: MAT_MENU_PANEL, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatMenuItem, selector: "[mat-menu-item]", inputs: { disabled: "disabled", disableRipple: "disableRipple", role: "role" }, host: { listeners: { "click": "_checkDisabled($event)", "mouseenter": "_handleMouseEnter()" }, properties: { "attr.role": "role", "class.mat-mdc-menu-item-highlighted": "_highlighted", "class.mat-mdc-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled", "attr.disabled": "disabled || null" }, classAttribute: "mat-mdc-menu-item mat-mdc-focus-indicator mdc-list-item" }, exportAs: ["matMenuItem"], usesInheritance: true, ngImport: i0, template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mdc-list-item__primary-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatMenuItem };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatMenuItem, decorators: [{
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
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content select=\"mat-icon, [matMenuItemIcon]\"></ng-content>\n<span class=\"mdc-list-item__primary-text\"><ng-content></ng-content></span>\n<div class=\"mat-mdc-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-mdc-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFFTCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQWtCLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBZSxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7O0FBRTFELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQUNILE1BbUJhLFdBQ1gsU0FBUSxnQkFBZ0I7SUFzQ3hCLFlBQ1UsV0FBb0MsRUFDbEIsU0FBZSxFQUNqQyxhQUE0QixFQUNPLFdBQXVDLEVBQzFFLGtCQUFzQztRQUU5QyxLQUFLLEVBQUUsQ0FBQztRQU5BLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNsQixjQUFTLEdBQVQsU0FBUyxDQUFNO1FBQ2pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ08sZ0JBQVcsR0FBWCxXQUFXLENBQTRCO1FBQzFFLHVCQUFrQixHQUFsQixrQkFB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LFFBQVE7OzBCQUVmLE1BQU07MkJBQUMsY0FBYzs7MEJBQUcsUUFBUTs0RUF0QzFCLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBJbnB1dCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9uLCBGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0TWVudVBhbmVsLCBNQVRfTUVOVV9QQU5FTH0gZnJvbSAnLi9tZW51LXBhbmVsJztcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRNZW51SXRlbS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0TWVudUl0ZW1CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoY2xhc3Mge30pKTtcblxuLyoqXG4gKiBTaW5nbGUgaXRlbSBpbnNpZGUgb2YgYSBgbWF0LW1lbnVgLiBQcm92aWRlcyB0aGUgbWVudSBpdGVtIHN0eWxpbmcgYW5kIGFjY2Vzc2liaWxpdHkgdHJlYXRtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LW1lbnUtaXRlbV0nLFxuICBleHBvcnRBczogJ21hdE1lbnVJdGVtJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1tZW51LWl0ZW0gbWF0LW1kYy1mb2N1cy1pbmRpY2F0b3IgbWRjLWxpc3QtaXRlbScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW1lbnUtaXRlbS1oaWdobGlnaHRlZF0nOiAnX2hpZ2hsaWdodGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbWVudS1pdGVtLXN1Ym1lbnUtdHJpZ2dlcl0nOiAnX3RyaWdnZXJzU3VibWVudScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkIHx8IG51bGwnLFxuICAgICcoY2xpY2spJzogJ19jaGVja0Rpc2FibGVkKCRldmVudCknLFxuICAgICcobW91c2VlbnRlciknOiAnX2hhbmRsZU1vdXNlRW50ZXIoKScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUtaXRlbS5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1cbiAgZXh0ZW5kcyBfTWF0TWVudUl0ZW1CYXNlXG4gIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBDYW5EaXNhYmxlLCBDYW5EaXNhYmxlUmlwcGxlLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbntcbiAgLyoqIEFSSUEgcm9sZSBmb3IgdGhlIG1lbnUgaXRlbS4gKi9cbiAgQElucHV0KCkgcm9sZTogJ21lbnVpdGVtJyB8ICdtZW51aXRlbXJhZGlvJyB8ICdtZW51aXRlbWNoZWNrYm94JyA9ICdtZW51aXRlbSc7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBob3ZlcmVkLiAqL1xuICByZWFkb25seSBfaG92ZXJlZDogU3ViamVjdDxNYXRNZW51SXRlbT4gPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9mb2N1c2VkID0gbmV3IFN1YmplY3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBoaWdobGlnaHRlZC4gKi9cbiAgX2hpZ2hsaWdodGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBhY3RzIGFzIGEgdHJpZ2dlciBmb3IgYSBzdWItbWVudS4gKi9cbiAgX3RyaWdnZXJzU3VibWVudTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRvY3VtZW50OiBhbnksXG4gICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPiB8IHVuZGVmaW5lZCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBkb2N1bWVudGAsIGBjaGFuZ2VEZXRlY3RvclJlZmAgYW5kIGBmb2N1c01vbml0b3JgIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRvY3VtZW50PzogYW55LFxuICAgIGZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBwYXJlbnRNZW51PzogTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50PzogYW55LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgX3BhcmVudE1lbnU/LmFkZEl0ZW0/Lih0aGlzKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvciAmJiBvcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9nZXRIb3N0RWxlbWVudCgpLCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9nZXRIb3N0RWxlbWVudCgpLmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICAvLyBTdGFydCBtb25pdG9yaW5nIHRoZSBlbGVtZW50IHNvIGl0IGdldHMgdGhlIGFwcHJvcHJpYXRlIGZvY3VzZWQgY2xhc3Nlcy4gV2Ugd2FudFxuICAgICAgLy8gdG8gc2hvdyB0aGUgZm9jdXMgc3R5bGUgZm9yIG1lbnUgaXRlbXMgb25seSB3aGVuIHRoZSBmb2N1cyB3YXMgbm90IGNhdXNlZCBieSBhXG4gICAgICAvLyBtb3VzZSBvciB0b3VjaCBpbnRlcmFjdGlvbi5cbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudE1lbnUgJiYgdGhpcy5fcGFyZW50TWVudS5yZW1vdmVJdGVtKSB7XG4gICAgICB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5faG92ZXJlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZvY3VzZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgYHRhYmluZGV4YC4gKi9cbiAgX2dldFRhYkluZGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAnLTEnIDogJzAnO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGhvc3QgRE9NIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBQcmV2ZW50cyB0aGUgZGVmYXVsdCBlbGVtZW50IGFjdGlvbnMgaWYgaXQgaXMgZGlzYWJsZWQuICovXG4gIF9jaGVja0Rpc2FibGVkKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIHRvIHRoZSBob3ZlciBzdHJlYW0uICovXG4gIF9oYW5kbGVNb3VzZUVudGVyKCkge1xuICAgIHRoaXMuX2hvdmVyZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCB0byBiZSB1c2VkIHdoZW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgb3B0aW9uIHNob3VsZCBiZSBmb2N1c2VkLiAqL1xuICBnZXRMYWJlbCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNsb25lID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBpY29ucyA9IGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hdC1pY29uLCAubWF0ZXJpYWwtaWNvbnMnKTtcblxuICAgIC8vIFN0cmlwIGF3YXkgaWNvbnMgc28gdGhleSBkb24ndCBzaG93IHVwIGluIHRoZSB0ZXh0LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGljb25zW2ldLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjbG9uZS50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xuICB9XG5cbiAgX3NldEhpZ2hsaWdodGVkKGlzSGlnaGxpZ2h0ZWQ6IGJvb2xlYW4pIHtcbiAgICAvLyBXZSBuZWVkIHRvIG1hcmsgdGhpcyBmb3IgY2hlY2sgZm9yIHRoZSBjYXNlIHdoZXJlIHRoZSBjb250ZW50IGlzIGNvbWluZyBmcm9tIGFcbiAgICAvLyBgbWF0TWVudUNvbnRlbnRgIHdob3NlIGNoYW5nZSBkZXRlY3Rpb24gdHJlZSBpcyBhdCB0aGUgZGVjbGFyYXRpb24gcG9zaXRpb24sXG4gICAgLy8gbm90IHRoZSBpbnNlcnRpb24gcG9zaXRpb24uIFNlZSAjMjMxNzUuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMi4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLlxuICAgIHRoaXMuX2hpZ2hsaWdodGVkID0gaXNIaWdobGlnaHRlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfc2V0VHJpZ2dlcnNTdWJtZW51KHRyaWdnZXJzU3VibWVudTogYm9vbGVhbikge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgX2NoYW5nZURldGVjdG9yUmVmYC5cbiAgICB0aGlzLl90cmlnZ2Vyc1N1Ym1lbnUgPSB0cmlnZ2Vyc1N1Ym1lbnU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX2hhc0ZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudCAmJiB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLl9nZXRIb3N0RWxlbWVudCgpO1xuICB9XG59XG4iLCI8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtaWNvbiwgW21hdE1lbnVJdGVtSWNvbl1cIj48L25nLWNvbnRlbnQ+XG48c3BhbiBjbGFzcz1cIm1kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48ZGl2IGNsYXNzPVwibWF0LW1kYy1tZW51LXJpcHBsZVwiIG1hdFJpcHBsZVxuICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZVJpcHBsZSB8fCBkaXNhYmxlZFwiXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cIl9nZXRIb3N0RWxlbWVudCgpXCI+XG48L2Rpdj5cbjxzdmdcbiAgKm5nSWY9XCJfdHJpZ2dlcnNTdWJtZW51XCJcbiAgY2xhc3M9XCJtYXQtbWRjLW1lbnUtc3VibWVudS1pY29uXCJcbiAgdmlld0JveD1cIjAgMCA1IDEwXCJcbiAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICBhcmlhLWhpZGRlbj1cInRydWVcIj48cG9seWdvbiBwb2ludHM9XCIwLDAgNSw1IDAsMTBcIi8+PC9zdmc+XG4iXX0=