/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, Inject, Optional, Input, HostListener, } from '@angular/core';
import { mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MAT_MENU_PANEL } from './menu-panel';
// Boilerplate for applying mixins to MatMenuItem.
/** @docs-private */
const _MatMenuItemBase = mixinDisableRipple(mixinDisabled(class {
}));
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export class MatMenuItem extends _MatMenuItemBase {
    constructor(_elementRef, 
    /**
     * @deprecated `_document` parameter is no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    _document, _focusMonitor, _parentMenu) {
        // @breaking-change 8.0.0 make `_focusMonitor` and `document` required params.
        super();
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._parentMenu = _parentMenu;
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
        if (_parentMenu && _parentMenu.addItem) {
            _parentMenu.addItem(this);
        }
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
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    _checkDisabled(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /** Emits to the hover stream. */
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    _handleMouseEnter() {
        this._hovered.next(this);
    }
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel() {
        var _a, _b;
        const clone = this._elementRef.nativeElement.cloneNode(true);
        const icons = clone.querySelectorAll('mat-icon, .material-icons');
        // Strip away icons so they don't show up in the text.
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i];
            (_a = icon.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(icon);
        }
        return ((_b = clone.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
    }
}
MatMenuItem.decorators = [
    { type: Component, args: [{
                selector: '[mat-menu-item]',
                exportAs: 'matMenuItem',
                inputs: ['disabled', 'disableRipple'],
                host: {
                    '[attr.role]': 'role',
                    '[class.mat-menu-item]': 'true',
                    '[class.mat-menu-item-highlighted]': '_highlighted',
                    '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.disabled]': 'disabled || null',
                    'class': 'mat-focus-indicator',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n"
            },] }
];
MatMenuItem.ctorParameters = () => [
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: FocusMonitor },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_PANEL,] }, { type: Optional }] }
];
MatMenuItem.propDecorators = {
    role: [{ type: Input }],
    _checkDisabled: [{ type: HostListener, args: ['click', ['$event'],] }],
    _handleMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFFN0UsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxZQUFZLEdBRWIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFDO0FBRTFELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQW1CSCxNQUFNLE9BQU8sV0FBWSxTQUFRLGdCQUFnQjtJQWtCL0MsWUFDVSxXQUFvQztJQUM1Qzs7O09BR0c7SUFDZSxTQUFlLEVBQ3pCLGFBQTRCLEVBQ08sV0FBdUM7UUFFbEYsOEVBQThFO1FBQzlFLEtBQUssRUFBRSxDQUFDO1FBVkEsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBTXBDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ08sZ0JBQVcsR0FBWCxXQUFXLENBQTRCO1FBdkJwRixtQ0FBbUM7UUFDMUIsU0FBSSxHQUFzRCxVQUFVLENBQUM7UUFFOUUsdURBQXVEO1FBQzlDLGFBQVEsR0FBeUIsSUFBSSxPQUFPLEVBQWUsQ0FBQztRQUVyRSx1REFBdUQ7UUFDOUMsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFlLENBQUM7UUFFL0MsNENBQTRDO1FBQzVDLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBRTlCLDhEQUE4RDtRQUM5RCxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFlaEMsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUN0QyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELDZCQUE2QjtJQUM3QixLQUFLLENBQUMsTUFBb0IsRUFBRSxPQUFzQjtRQUNoRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksTUFBTSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixtRkFBbUY7WUFDbkYsaUZBQWlGO1lBQ2pGLDhCQUE4QjtZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDcEMsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsOERBQThEO0lBQzlELG9GQUFvRjtJQUNwRixvRkFBb0Y7SUFDcEYsa0NBQWtDO0lBQ2xDLGtGQUFrRjtJQUNsRix5REFBeUQ7SUFFekQsY0FBYyxDQUFDLEtBQVk7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLG9GQUFvRjtJQUNwRixvRkFBb0Y7SUFDcEYsa0NBQWtDO0lBQ2xDLGtGQUFrRjtJQUNsRix5REFBeUQ7SUFFekQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELHVGQUF1RjtJQUN2RixRQUFROztRQUNOLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWdCLENBQUM7UUFDNUUsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFbEUsc0RBQXNEO1FBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFBLElBQUksQ0FBQyxVQUFVLDBDQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztRQUVELE9BQU8sQ0FBQSxNQUFBLEtBQUssQ0FBQyxXQUFXLDBDQUFFLElBQUksRUFBRSxLQUFJLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzs7WUF0SUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osYUFBYSxFQUFFLE1BQU07b0JBQ3JCLHVCQUF1QixFQUFFLE1BQU07b0JBQy9CLG1DQUFtQyxFQUFFLGNBQWM7b0JBQ25ELHVDQUF1QyxFQUFFLGtCQUFrQjtvQkFDM0QsaUJBQWlCLEVBQUUsZ0JBQWdCO29CQUNuQyxzQkFBc0IsRUFBRSxxQkFBcUI7b0JBQzdDLGlCQUFpQixFQUFFLGtCQUFrQjtvQkFDckMsT0FBTyxFQUFFLHFCQUFxQjtpQkFDL0I7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxpTUFBNkI7YUFDOUI7OztZQTNDQyxVQUFVOzRDQW9FUCxNQUFNLFNBQUMsUUFBUTtZQXpFSyxZQUFZOzRDQTJFaEMsTUFBTSxTQUFDLGNBQWMsY0FBRyxRQUFROzs7bUJBdEJsQyxLQUFLOzZCQWlGTCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO2dDQWNoQyxZQUFZLFNBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBJbnB1dCxcbiAgSG9zdExpc3RlbmVyLFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TUFUX01FTlVfUEFORUwsIE1hdE1lbnVQYW5lbH0gZnJvbSAnLi9tZW51LXBhbmVsJztcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRNZW51SXRlbS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0TWVudUl0ZW1CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoY2xhc3Mge30pKTtcblxuLyoqXG4gKiBTaW5nbGUgaXRlbSBpbnNpZGUgb2YgYSBgbWF0LW1lbnVgLiBQcm92aWRlcyB0aGUgbWVudSBpdGVtIHN0eWxpbmcgYW5kIGFjY2Vzc2liaWxpdHkgdHJlYXRtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LW1lbnUtaXRlbV0nLFxuICBleHBvcnRBczogJ21hdE1lbnVJdGVtJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW1dJzogJ3RydWUnLFxuICAgICdbY2xhc3MubWF0LW1lbnUtaXRlbS1oaWdobGlnaHRlZF0nOiAnX2hpZ2hsaWdodGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW0tc3VibWVudS10cmlnZ2VyXSc6ICdfdHJpZ2dlcnNTdWJtZW51JyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ19nZXRUYWJJbmRleCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnY2xhc3MnOiAnbWF0LWZvY3VzLWluZGljYXRvcicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUtaXRlbS5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW0gZXh0ZW5kcyBfTWF0TWVudUl0ZW1CYXNlXG4gICAgaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIENhbkRpc2FibGUsIENhbkRpc2FibGVSaXBwbGUsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgLyoqIEFSSUEgcm9sZSBmb3IgdGhlIG1lbnUgaXRlbS4gKi9cbiAgQElucHV0KCkgcm9sZTogJ21lbnVpdGVtJyB8ICdtZW51aXRlbXJhZGlvJyB8ICdtZW51aXRlbWNoZWNrYm94JyA9ICdtZW51aXRlbSc7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBob3ZlcmVkLiAqL1xuICByZWFkb25seSBfaG92ZXJlZDogU3ViamVjdDxNYXRNZW51SXRlbT4gPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9mb2N1c2VkID0gbmV3IFN1YmplY3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBoaWdobGlnaHRlZC4gKi9cbiAgX2hpZ2hsaWdodGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBhY3RzIGFzIGEgdHJpZ2dlciBmb3IgYSBzdWItbWVudS4gKi9cbiAgX3RyaWdnZXJzU3VibWVudTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIGBfZG9jdW1lbnRgIHBhcmFtZXRlciBpcyBubyBsb25nZXIgYmVpbmcgdXNlZCBhbmQgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wXG4gICAgICovXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+KSB7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIG1ha2UgYF9mb2N1c01vbml0b3JgIGFuZCBgZG9jdW1lbnRgIHJlcXVpcmVkIHBhcmFtcy5cbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKF9wYXJlbnRNZW51ICYmIF9wYXJlbnRNZW51LmFkZEl0ZW0pIHtcbiAgICAgIF9wYXJlbnRNZW51LmFkZEl0ZW0odGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yICYmIG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2dldEhvc3RFbGVtZW50KCksIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2dldEhvc3RFbGVtZW50KCkuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNlZC5uZXh0KHRoaXMpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIC8vIFN0YXJ0IG1vbml0b3JpbmcgdGhlIGVsZW1lbnQgc28gaXQgZ2V0cyB0aGUgYXBwcm9wcmlhdGUgZm9jdXNlZCBjbGFzc2VzLiBXZSB3YW50XG4gICAgICAvLyB0byBzaG93IHRoZSBmb2N1cyBzdHlsZSBmb3IgbWVudSBpdGVtcyBvbmx5IHdoZW4gdGhlIGZvY3VzIHdhcyBub3QgY2F1c2VkIGJ5IGFcbiAgICAgIC8vIG1vdXNlIG9yIHRvdWNoIGludGVyYWN0aW9uLlxuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50TWVudSAmJiB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0pIHtcbiAgICAgIHRoaXMuX3BhcmVudE1lbnUucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlcmVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZm9jdXNlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFVzZWQgdG8gc2V0IHRoZSBgdGFiaW5kZXhgLiAqL1xuICBfZ2V0VGFiSW5kZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICctMScgOiAnMCc7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaG9zdCBET00gZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFByZXZlbnRzIHRoZSBkZWZhdWx0IGVsZW1lbnQgYWN0aW9ucyBpZiBpdCBpcyBkaXNhYmxlZC4gKi9cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgX2NoZWNrRGlzYWJsZWQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgdG8gdGhlIGhvdmVyIHN0cmVhbS4gKi9cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBfaGFuZGxlTW91c2VFbnRlcigpIHtcbiAgICB0aGlzLl9ob3ZlcmVkLm5leHQodGhpcyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgdG8gYmUgdXNlZCB3aGVuIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIG9wdGlvbiBzaG91bGQgYmUgZm9jdXNlZC4gKi9cbiAgZ2V0TGFiZWwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjbG9uZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgaWNvbnMgPSBjbG9uZS5xdWVyeVNlbGVjdG9yQWxsKCdtYXQtaWNvbiwgLm1hdGVyaWFsLWljb25zJyk7XG5cbiAgICAvLyBTdHJpcCBhd2F5IGljb25zIHNvIHRoZXkgZG9uJ3Qgc2hvdyB1cCBpbiB0aGUgdGV4dC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGljb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpY29uID0gaWNvbnNbaV07XG4gICAgICBpY29uLnBhcmVudE5vZGU/LnJlbW92ZUNoaWxkKGljb24pO1xuICAgIH1cblxuICAgIHJldHVybiBjbG9uZS50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=