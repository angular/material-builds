/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, forwardRef, Inject, Input, ViewEncapsulation, QueryList, ElementRef, NgZone, } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MAT_DRAWER_CONTAINER } from './drawer';
import { matDrawerAnimations } from './drawer-animations';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/common";
export class MatSidenavContent extends MatDrawerContent {
    constructor(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone) {
        super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
    }
}
MatSidenavContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenavContent, deps: [{ token: i0.ChangeDetectorRef }, { token: forwardRef(() => MatSidenavContainer) }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatSidenavContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSidenavContent, selector: "mat-sidenav-content", host: { properties: { "style.margin-left.px": "_container._contentMargins.left", "style.margin-right.px": "_container._contentMargins.right" }, classAttribute: "mat-drawer-content mat-sidenav-content" }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenavContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-sidenav-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content mat-sidenav-content',
                        '[style.margin-left.px]': '_container._contentMargins.left',
                        '[style.margin-right.px]': '_container._contentMargins.right',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: MatSidenavContainer, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatSidenavContainer)]
                }] }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.NgZone }]; } });
export class MatSidenav extends MatDrawer {
    constructor() {
        super(...arguments);
        this._fixedInViewport = false;
        this._fixedTopGap = 0;
        this._fixedBottomGap = 0;
    }
    /** Whether the sidenav is fixed in the viewport. */
    get fixedInViewport() { return this._fixedInViewport; }
    set fixedInViewport(value) { this._fixedInViewport = coerceBooleanProperty(value); }
    /**
     * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
     * mode.
     */
    get fixedTopGap() { return this._fixedTopGap; }
    set fixedTopGap(value) { this._fixedTopGap = coerceNumberProperty(value); }
    /**
     * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
     * fixed mode.
     */
    get fixedBottomGap() { return this._fixedBottomGap; }
    set fixedBottomGap(value) { this._fixedBottomGap = coerceNumberProperty(value); }
}
MatSidenav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenav, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSidenav.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSidenav, selector: "mat-sidenav", inputs: { fixedInViewport: "fixedInViewport", fixedTopGap: "fixedTopGap", fixedBottomGap: "fixedBottomGap" }, host: { attributes: { "tabIndex": "-1" }, properties: { "attr.align": "null", "class.mat-drawer-end": "position === \"end\"", "class.mat-drawer-over": "mode === \"over\"", "class.mat-drawer-push": "mode === \"push\"", "class.mat-drawer-side": "mode === \"side\"", "class.mat-drawer-opened": "opened", "class.mat-sidenav-fixed": "fixedInViewport", "style.top.px": "fixedInViewport ? fixedTopGap : null", "style.bottom.px": "fixedInViewport ? fixedBottomGap : null" }, classAttribute: "mat-drawer mat-sidenav" }, exportAs: ["matSidenav"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable>\r\n  <ng-content></ng-content>\r\n</div>\r\n", directives: [{ type: i1.CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], animations: [matDrawerAnimations.transformDrawer], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenav, decorators: [{
            type: Component,
            args: [{ selector: 'mat-sidenav', exportAs: 'matSidenav', animations: [matDrawerAnimations.transformDrawer], host: {
                        'class': 'mat-drawer mat-sidenav',
                        'tabIndex': '-1',
                        // must prevent the browser from aligning text based on value
                        '[attr.align]': 'null',
                        '[class.mat-drawer-end]': 'position === "end"',
                        '[class.mat-drawer-over]': 'mode === "over"',
                        '[class.mat-drawer-push]': 'mode === "push"',
                        '[class.mat-drawer-side]': 'mode === "side"',
                        '[class.mat-drawer-opened]': 'opened',
                        '[class.mat-sidenav-fixed]': 'fixedInViewport',
                        '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
                        '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable>\r\n  <ng-content></ng-content>\r\n</div>\r\n" }]
        }], propDecorators: { fixedInViewport: [{
                type: Input
            }], fixedTopGap: [{
                type: Input
            }], fixedBottomGap: [{
                type: Input
            }] } });
export class MatSidenavContainer extends MatDrawerContainer {
}
MatSidenavContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenavContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSidenavContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSidenavContainer, selector: "mat-sidenav-container", host: { properties: { "class.mat-drawer-container-explicit-backdrop": "_backdropOverride" }, classAttribute: "mat-drawer-container mat-sidenav-container" }, providers: [{
            provide: MAT_DRAWER_CONTAINER,
            useExisting: MatSidenavContainer
        }], queries: [{ propertyName: "_content", first: true, predicate: MatSidenavContent, descendants: true }, { propertyName: "_allDrawers", predicate: MatSidenav, descendants: true }], exportAs: ["matSidenavContainer"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-sidenav\"></ng-content>\n\n<ng-content select=\"mat-sidenav-content\">\n</ng-content>\n<mat-sidenav-content *ngIf=\"!_content\" cdkScrollable>\n  <ng-content></ng-content>\n</mat-sidenav-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"], components: [{ type: MatSidenavContent, selector: "mat-sidenav-content" }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSidenavContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-sidenav-container', exportAs: 'matSidenavContainer', host: {
                        'class': 'mat-drawer-container mat-sidenav-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatSidenavContainer
                        }], template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-sidenav\"></ng-content>\n\n<ng-content select=\"mat-sidenav-content\">\n</ng-content>\n<mat-sidenav-content *ngIf=\"!_content\" cdkScrollable>\n  <ng-content></ng-content>\n</mat-sidenav-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"] }]
        }], propDecorators: { _allDrawers: [{
                type: ContentChildren,
                args: [MatSidenav, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true
                    }]
            }], _content: [{
                type: ContentChild,
                args: [MatSidenavContent]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3NpZGVuYXYudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXIuaHRtbCIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3NpZGVuYXYtY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDL0YsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsRUFFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7OztBQWN4RCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBQ3JELFlBQ0ksaUJBQW9DLEVBQ1csU0FBOEIsRUFDN0UsVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLE1BQWM7UUFDaEIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsQ0FBQzs7c0hBUlUsaUJBQWlCLG1EQUdoQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUM7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QWdELEVBQUUsbUJBQW1CO3FCQUN0RSxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxhQUMxQixDQUFDOzRCQUNWLE9BQU8sRUFBRSxvQkFBb0I7NEJBQzdCLFdBQVcscUJBQXFCO3lCQUNqQyxDQUFDOzhCQVNPLFdBQVc7c0JBTG5CLGVBQWU7dUJBQUMsVUFBVSxFQUFFO3dCQUMzQix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO2dCQUd5QyxRQUFRO3NCQUFqRCxZQUFZO3VCQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERyYXdlciwgTWF0RHJhd2VyQ29udGFpbmVyLCBNYXREcmF3ZXJDb250ZW50LCBNQVRfRFJBV0VSX0NPTlRBSU5FUn0gZnJvbSAnLi9kcmF3ZXInO1xuaW1wb3J0IHttYXREcmF3ZXJBbmltYXRpb25zfSBmcm9tICcuL2RyYXdlci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2Nyb2xsRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYtY29udGVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250ZW50IG1hdC1zaWRlbmF2LWNvbnRlbnQnLFxuICAgICdbc3R5bGUubWFyZ2luLWxlZnQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLmxlZnQnLFxuICAgICdbc3R5bGUubWFyZ2luLXJpZ2h0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5yaWdodCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2Q29udGVudCBleHRlbmRzIE1hdERyYXdlckNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTaWRlbmF2Q29udGFpbmVyKSkgY29udGFpbmVyOiBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgbmdab25lOiBOZ1pvbmUpIHtcbiAgICBzdXBlcihjaGFuZ2VEZXRlY3RvclJlZiwgY29udGFpbmVyLCBlbGVtZW50UmVmLCBzY3JvbGxEaXNwYXRjaGVyLCBuZ1pvbmUpO1xuICB9XG59XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYnLFxuICBleHBvcnRBczogJ21hdFNpZGVuYXYnLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci5odG1sJyxcbiAgYW5pbWF0aW9uczogW21hdERyYXdlckFuaW1hdGlvbnMudHJhbnNmb3JtRHJhd2VyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyIG1hdC1zaWRlbmF2JyxcbiAgICAndGFiSW5kZXgnOiAnLTEnLFxuICAgIC8vIG11c3QgcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGFsaWduaW5nIHRleHQgYmFzZWQgb24gdmFsdWVcbiAgICAnW2F0dHIuYWxpZ25dJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1lbmRdJzogJ3Bvc2l0aW9uID09PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3Zlcl0nOiAnbW9kZSA9PT0gXCJvdmVyXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1wdXNoXSc6ICdtb2RlID09PSBcInB1c2hcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXNpZGVdJzogJ21vZGUgPT09IFwic2lkZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3BlbmVkXSc6ICdvcGVuZWQnLFxuICAgICdbY2xhc3MubWF0LXNpZGVuYXYtZml4ZWRdJzogJ2ZpeGVkSW5WaWV3cG9ydCcsXG4gICAgJ1tzdHlsZS50b3AucHhdJzogJ2ZpeGVkSW5WaWV3cG9ydCA/IGZpeGVkVG9wR2FwIDogbnVsbCcsXG4gICAgJ1tzdHlsZS5ib3R0b20ucHhdJzogJ2ZpeGVkSW5WaWV3cG9ydCA/IGZpeGVkQm90dG9tR2FwIDogbnVsbCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2IGV4dGVuZHMgTWF0RHJhd2VyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNpZGVuYXYgaXMgZml4ZWQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZml4ZWRJblZpZXdwb3J0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZml4ZWRJblZpZXdwb3J0OyB9XG4gIHNldCBmaXhlZEluVmlld3BvcnQodmFsdWUpIHsgdGhpcy5fZml4ZWRJblZpZXdwb3J0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9maXhlZEluVmlld3BvcnQgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGdhcCBiZXR3ZWVuIHRoZSB0b3Agb2YgdGhlIHNpZGVuYXYgYW5kIHRoZSB0b3Agb2YgdGhlIHZpZXdwb3J0IHdoZW4gdGhlIHNpZGVuYXYgaXMgaW4gZml4ZWRcbiAgICogbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmaXhlZFRvcEdhcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fZml4ZWRUb3BHYXA7IH1cbiAgc2V0IGZpeGVkVG9wR2FwKHZhbHVlKSB7IHRoaXMuX2ZpeGVkVG9wR2FwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2ZpeGVkVG9wR2FwID0gMDtcblxuICAvKipcbiAgICogVGhlIGdhcCBiZXR3ZWVuIHRoZSBib3R0b20gb2YgdGhlIHNpZGVuYXYgYW5kIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0IHdoZW4gdGhlIHNpZGVuYXYgaXMgaW5cbiAgICogZml4ZWQgbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmaXhlZEJvdHRvbUdhcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fZml4ZWRCb3R0b21HYXA7IH1cbiAgc2V0IGZpeGVkQm90dG9tR2FwKHZhbHVlKSB7IHRoaXMuX2ZpeGVkQm90dG9tR2FwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2ZpeGVkQm90dG9tR2FwID0gMDtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZml4ZWRJblZpZXdwb3J0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9maXhlZFRvcEdhcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9maXhlZEJvdHRvbUdhcDogTnVtYmVySW5wdXQ7XG59XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYtY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXRTaWRlbmF2Q29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzaWRlbmF2LWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RyYXdlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRhaW5lciBtYXQtc2lkZW5hdi1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfRFJBV0VSX0NPTlRBSU5FUixcbiAgICB1c2VFeGlzdGluZzogTWF0U2lkZW5hdkNvbnRhaW5lclxuICB9XVxuXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNpZGVuYXZDb250YWluZXIgZXh0ZW5kcyBNYXREcmF3ZXJDb250YWluZXIge1xuICBAQ29udGVudENoaWxkcmVuKE1hdFNpZGVuYXYsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KVxuICBvdmVycmlkZSBfYWxsRHJhd2VyczogUXVlcnlMaXN0PE1hdFNpZGVuYXY+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0U2lkZW5hdkNvbnRlbnQpIG92ZXJyaWRlIF9jb250ZW50OiBNYXRTaWRlbmF2Q29udGVudDtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtZHJhd2VyLWlubmVyLWNvbnRhaW5lclwiIGNka1Njcm9sbGFibGU+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuIiwiPGRpdiBjbGFzcz1cIm1hdC1kcmF3ZXItYmFja2Ryb3BcIiAoY2xpY2spPVwiX29uQmFja2Ryb3BDbGlja2VkKClcIiAqbmdJZj1cImhhc0JhY2tkcm9wXCJcbiAgICAgW2NsYXNzLm1hdC1kcmF3ZXItc2hvd25dPVwiX2lzU2hvd2luZ0JhY2tkcm9wKClcIj48L2Rpdj5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LXNpZGVuYXZcIj48L25nLWNvbnRlbnQ+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1zaWRlbmF2LWNvbnRlbnRcIj5cbjwvbmctY29udGVudD5cbjxtYXQtc2lkZW5hdi1jb250ZW50ICpuZ0lmPVwiIV9jb250ZW50XCIgY2RrU2Nyb2xsYWJsZT5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9tYXQtc2lkZW5hdi1jb250ZW50PlxuIl19