/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Inject, NgZone, Optional, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { _MatTooltipBase, _TooltipComponentBase, MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY, } from '@angular/material/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/a11y";
import * as i5 from "@angular/cdk/bidi";
import * as i6 from "@angular/cdk/layout";
import * as i7 from "@angular/common";
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 *
 * @deprecated Use `MatTooltip` from `@angular/material/tooltip` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTooltip extends _MatTooltipBase {
    constructor(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document) {
        super(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document);
        this._tooltipComponent = LegacyTooltipComponent;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatLegacyTooltip, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i2.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i3.Platform }, { token: i4.AriaDescriber }, { token: i4.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i5.Directionality, optional: true }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatLegacyTooltip, selector: "[matTooltip]", host: { classAttribute: "mat-tooltip-trigger" }, exportAs: ["matTooltip"], usesInheritance: true, ngImport: i0 }); }
}
export { MatLegacyTooltip };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatLegacyTooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTooltip]',
                    exportAs: 'matTooltip',
                    host: {
                        'class': 'mat-tooltip-trigger',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i2.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i3.Platform }, { type: i4.AriaDescriber }, { type: i4.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TOOLTIP_SCROLL_STRATEGY]
                }] }, { type: i5.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_TOOLTIP_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 * @deprecated Use `TooltipComponent` from `@angular/material/tooltip` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class LegacyTooltipComponent extends _TooltipComponentBase {
    constructor(changeDetectorRef, breakpointObserver, animationMode) {
        super(changeDetectorRef, animationMode);
        this._showAnimation = 'mat-tooltip-show';
        this._hideAnimation = 'mat-tooltip-hide';
        this._isHandset = breakpointObserver.observe(Breakpoints.Handset);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: LegacyTooltipComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i6.BreakpointObserver }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: LegacyTooltipComponent, selector: "mat-tooltip-component", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" }, properties: { "style.zoom": "isVisible() ? 1 : null" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div #tooltip\n     class=\"mat-tooltip\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">{{message}}</div>\n", styles: [".mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis;transform:scale(0)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.cdk-high-contrast-active .mat-tooltip{outline:solid 1px}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(0.99)}100%{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}.mat-tooltip-show{animation:mat-tooltip-show 200ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-tooltip-hide{animation:mat-tooltip-hide 100ms cubic-bezier(0, 0, 0.2, 1) forwards}"], dependencies: [{ kind: "directive", type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "pipe", type: i7.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { LegacyTooltipComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: LegacyTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tooltip-component', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
                        // won't be rendered if the animations are disabled or there is no web animations polyfill.
                        '[style.zoom]': 'isVisible() ? 1 : null',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, template: "<div #tooltip\n     class=\"mat-tooltip\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [ngClass]=\"tooltipClass\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">{{message}}</div>\n", styles: [".mat-tooltip{color:#fff;border-radius:4px;margin:14px;max-width:250px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis;transform:scale(0)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.cdk-high-contrast-active .mat-tooltip{outline:solid 1px}.mat-tooltip-handset{margin:24px;padding-left:16px;padding-right:16px}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(0.99)}100%{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1)}}.mat-tooltip-show{animation:mat-tooltip-show 200ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-tooltip-hide{animation:mat-tooltip-hide 100ms cubic-bezier(0, 0, 0.2, 1) forwards}"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i6.BreakpointObserver }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _tooltip: [{
                type: ViewChild,
                args: ['tooltip', {
                        // Use a static query here since we interact directly with
                        // the DOM which can happen before `ngAfterViewInit`.
                        static: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktdG9vbHRpcC90b29sdGlwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS10b29sdGlwL3Rvb2x0aXAuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsYUFBYSxFQUFFLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFrQixNQUFNLHFCQUFxQixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRTNFLE9BQU8sRUFDTCxlQUFlLEVBQ2YscUJBQXFCLEVBQ3JCLDJCQUEyQixFQUMzQiwyQkFBMkIsR0FFNUIsTUFBTSwyQkFBMkIsQ0FBQzs7Ozs7Ozs7O0FBRW5DOzs7Ozs7OztHQVFHO0FBQ0gsTUFPYSxnQkFBaUIsU0FBUSxlQUF1QztJQUczRSxZQUNFLE9BQWdCLEVBQ2hCLFVBQW1DLEVBQ25DLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsTUFBYyxFQUNkLFFBQWtCLEVBQ2xCLGFBQTRCLEVBQzVCLFlBQTBCLEVBQ1csY0FBbUIsRUFDNUMsR0FBbUIsRUFDa0IsY0FBd0MsRUFDdkUsU0FBYztRQUVoQyxLQUFLLENBQ0gsT0FBTyxFQUNQLFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLE1BQU0sRUFDTixRQUFRLEVBQ1IsYUFBYSxFQUNiLFlBQVksRUFDWixjQUFjLEVBQ2QsR0FBRyxFQUNILGNBQWMsRUFDZCxTQUFTLENBQ1YsQ0FBQztRQTdCZSxzQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQztJQThCOUQsQ0FBQzttSEEvQlUsZ0JBQWdCLDBPQVlqQiwyQkFBMkIsMkRBRWYsMkJBQTJCLDZCQUN2QyxRQUFRO3VHQWZQLGdCQUFnQjs7U0FBaEIsZ0JBQWdCO2dHQUFoQixnQkFBZ0I7a0JBUDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxZQUFZO29CQUN0QixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLHFCQUFxQjtxQkFDL0I7aUJBQ0Y7OzBCQWFJLE1BQU07MkJBQUMsMkJBQTJCOzswQkFDbEMsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQUksTUFBTTsyQkFBQywyQkFBMkI7OzBCQUM5QyxNQUFNOzJCQUFDLFFBQVE7O0FBbUJwQjs7Ozs7R0FLRztBQUNILE1BY2Esc0JBQXVCLFNBQVEscUJBQXFCO0lBYS9ELFlBQ0UsaUJBQW9DLEVBQ3BDLGtCQUFzQyxFQUNLLGFBQXNCO1FBRWpFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztRQWYxQyxtQkFBYyxHQUFHLGtCQUFrQixDQUFDO1FBQ3BDLG1CQUFjLEdBQUcsa0JBQWtCLENBQUM7UUFlbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7bUhBcEJVLHNCQUFzQixxRkFnQlgscUJBQXFCO3VHQWhCaEMsc0JBQXNCLDBXQzNHbkMseU5BS0E7O1NEc0dhLHNCQUFzQjtnR0FBdEIsc0JBQXNCO2tCQWRsQyxTQUFTOytCQUNFLHVCQUF1QixpQkFHbEIsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6Qzt3QkFDSiwwRkFBMEY7d0JBQzFGLDJGQUEyRjt3QkFDM0YsY0FBYyxFQUFFLHdCQUF3Qjt3QkFDeEMsY0FBYyxFQUFFLDJCQUEyQjt3QkFDM0MsYUFBYSxFQUFFLE1BQU07cUJBQ3RCOzswQkFrQkUsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBTDNDLFFBQVE7c0JBTFAsU0FBUzt1QkFBQyxTQUFTLEVBQUU7d0JBQ3BCLDBEQUEwRDt3QkFDMUQscURBQXFEO3dCQUNyRCxNQUFNLEVBQUUsSUFBSTtxQkFDYiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBcmlhRGVzY3JpYmVyLCBGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50cywgQnJlYWtwb2ludFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7T3ZlcmxheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7U2Nyb2xsRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIF9NYXRUb29sdGlwQmFzZSxcbiAgX1Rvb2x0aXBDb21wb25lbnRCYXNlLFxuICBNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMsXG4gIE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSxcbiAgTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgdGhhdCBhdHRhY2hlcyBhIG1hdGVyaWFsIGRlc2lnbiB0b29sdGlwIHRvIHRoZSBob3N0IGVsZW1lbnQuIEFuaW1hdGVzIHRoZSBzaG93aW5nIGFuZFxuICogaGlkaW5nIG9mIGEgdG9vbHRpcCBwcm92aWRlZCBwb3NpdGlvbiAoZGVmYXVsdHMgdG8gYmVsb3cgdGhlIGVsZW1lbnQpLlxuICpcbiAqIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdG9vbHRpcHMuaHRtbFxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VG9vbHRpcGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VG9vbHRpcF0nLFxuICBleHBvcnRBczogJ21hdFRvb2x0aXAnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10b29sdGlwLXRyaWdnZXInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lUb29sdGlwIGV4dGVuZHMgX01hdFRvb2x0aXBCYXNlPExlZ2FjeVRvb2x0aXBDb21wb25lbnQ+IHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF90b29sdGlwQ29tcG9uZW50ID0gTGVnYWN5VG9vbHRpcENvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0T3B0aW9uczogTWF0VG9vbHRpcERlZmF1bHRPcHRpb25zLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIG92ZXJsYXksXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIHZpZXdDb250YWluZXJSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICBwbGF0Zm9ybSxcbiAgICAgIGFyaWFEZXNjcmliZXIsXG4gICAgICBmb2N1c01vbml0b3IsXG4gICAgICBzY3JvbGxTdHJhdGVneSxcbiAgICAgIGRpcixcbiAgICAgIGRlZmF1bHRPcHRpb25zLFxuICAgICAgX2RvY3VtZW50LFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB0aGUgdG9vbHRpcCdzIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFRvb2x0aXBDb21wb25lbnRgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3Rvb2x0aXBgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2x0aXAtY29tcG9uZW50JyxcbiAgdGVtcGxhdGVVcmw6ICd0b29sdGlwLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndG9vbHRpcC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAvLyBGb3JjZXMgdGhlIGVsZW1lbnQgdG8gaGF2ZSBhIGxheW91dCBpbiBJRSBhbmQgRWRnZS4gVGhpcyBmaXhlcyBpc3N1ZXMgd2hlcmUgdGhlIGVsZW1lbnRcbiAgICAvLyB3b24ndCBiZSByZW5kZXJlZCBpZiB0aGUgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQgb3IgdGhlcmUgaXMgbm8gd2ViIGFuaW1hdGlvbnMgcG9seWZpbGwuXG4gICAgJ1tzdHlsZS56b29tXSc6ICdpc1Zpc2libGUoKSA/IDEgOiBudWxsJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19oYW5kbGVNb3VzZUxlYXZlKCRldmVudCknLFxuICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTGVnYWN5VG9vbHRpcENvbXBvbmVudCBleHRlbmRzIF9Ub29sdGlwQ29tcG9uZW50QmFzZSB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBhIGhhbmRzZXQtc2l6ZWQgZGlzcGxheS4gICovXG4gIF9pc0hhbmRzZXQ6IE9ic2VydmFibGU8QnJlYWtwb2ludFN0YXRlPjtcbiAgX3Nob3dBbmltYXRpb24gPSAnbWF0LXRvb2x0aXAtc2hvdyc7XG4gIF9oaWRlQW5pbWF0aW9uID0gJ21hdC10b29sdGlwLWhpZGUnO1xuXG4gIEBWaWV3Q2hpbGQoJ3Rvb2x0aXAnLCB7XG4gICAgLy8gVXNlIGEgc3RhdGljIHF1ZXJ5IGhlcmUgc2luY2Ugd2UgaW50ZXJhY3QgZGlyZWN0bHkgd2l0aFxuICAgIC8vIHRoZSBET00gd2hpY2ggY2FuIGhhcHBlbiBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gICAgc3RhdGljOiB0cnVlLFxuICB9KVxuICBfdG9vbHRpcDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihjaGFuZ2VEZXRlY3RvclJlZiwgYW5pbWF0aW9uTW9kZSk7XG4gICAgdGhpcy5faXNIYW5kc2V0ID0gYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldCk7XG4gIH1cbn1cbiIsIjxkaXYgI3Rvb2x0aXBcbiAgICAgY2xhc3M9XCJtYXQtdG9vbHRpcFwiXG4gICAgIChhbmltYXRpb25lbmQpPVwiX2hhbmRsZUFuaW1hdGlvbkVuZCgkZXZlbnQpXCJcbiAgICAgW25nQ2xhc3NdPVwidG9vbHRpcENsYXNzXCJcbiAgICAgW2NsYXNzLm1hdC10b29sdGlwLWhhbmRzZXRdPVwiKF9pc0hhbmRzZXQgfCBhc3luYyk/Lm1hdGNoZXNcIj57e21lc3NhZ2V9fTwvZGl2PlxuIl19