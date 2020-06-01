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
let MatSidenavContent = /** @class */ (() => {
    class MatSidenavContent extends MatDrawerContent {
        constructor(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone) {
            super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
        }
    }
    MatSidenavContent.decorators = [
        { type: Component, args: [{
                    selector: 'mat-sidenav-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content mat-sidenav-content',
                        '[style.margin-left.px]': '_container._contentMargins.left',
                        '[style.margin-right.px]': '_container._contentMargins.right',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    MatSidenavContent.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: MatSidenavContainer, decorators: [{ type: Inject, args: [forwardRef(() => MatSidenavContainer),] }] },
        { type: ElementRef },
        { type: ScrollDispatcher },
        { type: NgZone }
    ];
    return MatSidenavContent;
})();
export { MatSidenavContent };
let MatSidenav = /** @class */ (() => {
    class MatSidenav extends MatDrawer {
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
    MatSidenav.decorators = [
        { type: Component, args: [{
                    selector: 'mat-sidenav',
                    exportAs: 'matSidenav',
                    template: "<div class=\"mat-drawer-inner-container\">\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                    animations: [matDrawerAnimations.transformDrawer],
                    host: {
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
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    MatSidenav.propDecorators = {
        fixedInViewport: [{ type: Input }],
        fixedTopGap: [{ type: Input }],
        fixedBottomGap: [{ type: Input }]
    };
    return MatSidenav;
})();
export { MatSidenav };
let MatSidenavContainer = /** @class */ (() => {
    class MatSidenavContainer extends MatDrawerContainer {
    }
    MatSidenavContainer.decorators = [
        { type: Component, args: [{
                    selector: 'mat-sidenav-container',
                    exportAs: 'matSidenavContainer',
                    template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-sidenav\"></ng-content>\n\n<ng-content select=\"mat-sidenav-content\">\n</ng-content>\n<mat-sidenav-content *ngIf=\"!_content\" cdkScrollable>\n  <ng-content></ng-content>\n</mat-sidenav-content>\n",
                    host: {
                        'class': 'mat-drawer-container mat-sidenav-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [{
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatSidenavContainer
                        }],
                    styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"]
                }] }
    ];
    MatSidenavContainer.propDecorators = {
        _allDrawers: [{ type: ContentChildren, args: [MatSidenav, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true
                    },] }],
        _content: [{ type: ContentChild, args: [MatSidenavContent,] }]
    };
    return MatSidenavContainer;
})();
export { MatSidenavContainer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zaWRlbmF2L3NpZGVuYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDL0YsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsRUFFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUd4RDtJQUFBLE1BV2EsaUJBQWtCLFNBQVEsZ0JBQWdCO1FBQ3JELFlBQ0ksaUJBQW9DLEVBQ1csU0FBOEIsRUFDN0UsVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLE1BQWM7WUFDaEIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsQ0FBQzs7O2dCQW5CRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSx3Q0FBd0M7d0JBQ2pELHdCQUF3QixFQUFFLGlDQUFpQzt3QkFDM0QseUJBQXlCLEVBQUUsa0NBQWtDO3FCQUM5RDtvQkFDRCxlQUFlLEVB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QUFXLEVBQUUsSUFBSTtxQkFDbEI7MkJBR0EsWUFBWSxTQUFDLGlCQUFpQjs7SUFFakMsMEJBQUM7S0FBQTtTQVZZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERyYXdlciwgTWF0RHJhd2VyQ29udGFpbmVyLCBNYXREcmF3ZXJDb250ZW50LCBNQVRfRFJBV0VSX0NPTlRBSU5FUn0gZnJvbSAnLi9kcmF3ZXInO1xuaW1wb3J0IHttYXREcmF3ZXJBbmltYXRpb25zfSBmcm9tICcuL2RyYXdlci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2Nyb2xsRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYtY29udGVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250ZW50IG1hdC1zaWRlbmF2LWNvbnRlbnQnLFxuICAgICdbc3R5bGUubWFyZ2luLWxlZnQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLmxlZnQnLFxuICAgICdbc3R5bGUubWFyZ2luLXJpZ2h0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5yaWdodCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2Q29udGVudCBleHRlbmRzIE1hdERyYXdlckNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTaWRlbmF2Q29udGFpbmVyKSkgY29udGFpbmVyOiBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgbmdab25lOiBOZ1pvbmUpIHtcbiAgICBzdXBlcihjaGFuZ2VEZXRlY3RvclJlZiwgY29udGFpbmVyLCBlbGVtZW50UmVmLCBzY3JvbGxEaXNwYXRjaGVyLCBuZ1pvbmUpO1xuICB9XG59XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYnLFxuICBleHBvcnRBczogJ21hdFNpZGVuYXYnLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci5odG1sJyxcbiAgYW5pbWF0aW9uczogW21hdERyYXdlckFuaW1hdGlvbnMudHJhbnNmb3JtRHJhd2VyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyIG1hdC1zaWRlbmF2JyxcbiAgICAndGFiSW5kZXgnOiAnLTEnLFxuICAgIC8vIG11c3QgcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGFsaWduaW5nIHRleHQgYmFzZWQgb24gdmFsdWVcbiAgICAnW2F0dHIuYWxpZ25dJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1lbmRdJzogJ3Bvc2l0aW9uID09PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3Zlcl0nOiAnbW9kZSA9PT0gXCJvdmVyXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1wdXNoXSc6ICdtb2RlID09PSBcInB1c2hcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXNpZGVdJzogJ21vZGUgPT09IFwic2lkZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3BlbmVkXSc6ICdvcGVuZWQnLFxuICAgICdbY2xhc3MubWF0LXNpZGVuYXYtZml4ZWRdJzogJ2ZpeGVkSW5WaWV3cG9ydCcsXG4gICAgJ1tzdHlsZS50b3AucHhdJzogJ2ZpeGVkSW5WaWV3cG9ydCA/IGZpeGVkVG9wR2FwIDogbnVsbCcsXG4gICAgJ1tzdHlsZS5ib3R0b20ucHhdJzogJ2ZpeGVkSW5WaWV3cG9ydCA/IGZpeGVkQm90dG9tR2FwIDogbnVsbCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2IGV4dGVuZHMgTWF0RHJhd2VyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNpZGVuYXYgaXMgZml4ZWQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZml4ZWRJblZpZXdwb3J0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZml4ZWRJblZpZXdwb3J0OyB9XG4gIHNldCBmaXhlZEluVmlld3BvcnQodmFsdWUpIHsgdGhpcy5fZml4ZWRJblZpZXdwb3J0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9maXhlZEluVmlld3BvcnQgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGdhcCBiZXR3ZWVuIHRoZSB0b3Agb2YgdGhlIHNpZGVuYXYgYW5kIHRoZSB0b3Agb2YgdGhlIHZpZXdwb3J0IHdoZW4gdGhlIHNpZGVuYXYgaXMgaW4gZml4ZWRcbiAgICogbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmaXhlZFRvcEdhcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fZml4ZWRUb3BHYXA7IH1cbiAgc2V0IGZpeGVkVG9wR2FwKHZhbHVlKSB7IHRoaXMuX2ZpeGVkVG9wR2FwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2ZpeGVkVG9wR2FwID0gMDtcblxuICAvKipcbiAgICogVGhlIGdhcCBiZXR3ZWVuIHRoZSBib3R0b20gb2YgdGhlIHNpZGVuYXYgYW5kIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0IHdoZW4gdGhlIHNpZGVuYXYgaXMgaW5cbiAgICogZml4ZWQgbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmaXhlZEJvdHRvbUdhcCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fZml4ZWRCb3R0b21HYXA7IH1cbiAgc2V0IGZpeGVkQm90dG9tR2FwKHZhbHVlKSB7IHRoaXMuX2ZpeGVkQm90dG9tR2FwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2ZpeGVkQm90dG9tR2FwID0gMDtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZml4ZWRJblZpZXdwb3J0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9maXhlZFRvcEdhcDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9maXhlZEJvdHRvbUdhcDogTnVtYmVySW5wdXQ7XG59XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNpZGVuYXYtY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXRTaWRlbmF2Q29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzaWRlbmF2LWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RyYXdlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRhaW5lciBtYXQtc2lkZW5hdi1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfRFJBV0VSX0NPTlRBSU5FUixcbiAgICB1c2VFeGlzdGluZzogTWF0U2lkZW5hdkNvbnRhaW5lclxuICB9XVxuXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNpZGVuYXZDb250YWluZXIgZXh0ZW5kcyBNYXREcmF3ZXJDb250YWluZXIge1xuICBAQ29udGVudENoaWxkcmVuKE1hdFNpZGVuYXYsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KVxuICBfYWxsRHJhd2VyczogUXVlcnlMaXN0PE1hdFNpZGVuYXY+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0U2lkZW5hdkNvbnRlbnQpIF9jb250ZW50OiBNYXRTaWRlbmF2Q29udGVudDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0JhY2tkcm9wOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=