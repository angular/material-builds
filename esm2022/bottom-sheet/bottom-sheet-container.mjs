import { CdkDialogContainer, DialogConfig } from '@angular/cdk/dialog';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewEncapsulation, } from '@angular/core';
import { matBottomSheetAnimations } from './bottom-sheet-animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/dialog";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "@angular/cdk/layout";
import * as i5 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided bottom sheet content.
 * @docs-private
 */
class MatBottomSheetContainer extends CdkDialogContainer {
    constructor(elementRef, focusTrapFactory, document, config, checker, ngZone, overlayRef, breakpointObserver, _changeDetectorRef, focusMonitor) {
        super(elementRef, focusTrapFactory, document, config, checker, ngZone, overlayRef, focusMonitor);
        this._changeDetectorRef = _changeDetectorRef;
        /** The state of the bottom sheet animations. */
        this._animationState = 'void';
        /** Emits whenever the state of the animation changes. */
        this._animationStateChanged = new EventEmitter();
        this._breakpointSubscription = breakpointObserver
            .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .subscribe(() => {
            this._toggleClass('mat-bottom-sheet-container-medium', breakpointObserver.isMatched(Breakpoints.Medium));
            this._toggleClass('mat-bottom-sheet-container-large', breakpointObserver.isMatched(Breakpoints.Large));
            this._toggleClass('mat-bottom-sheet-container-xlarge', breakpointObserver.isMatched(Breakpoints.XLarge));
        });
    }
    /** Begin animation of bottom sheet entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /** Begin animation of the bottom sheet exiting from view. */
    exit() {
        if (!this._destroyed) {
            this._animationState = 'hidden';
            this._changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._breakpointSubscription.unsubscribe();
        this._destroyed = true;
    }
    _onAnimationDone(event) {
        if (event.toState === 'visible') {
            this._trapFocus();
        }
        this._animationStateChanged.emit(event);
    }
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    _captureInitialFocus() { }
    _toggleClass(cssClass, add) {
        this._elementRef.nativeElement.classList.toggle(cssClass, add);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatBottomSheetContainer, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.DialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: i4.BreakpointObserver }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatBottomSheetContainer, selector: "mat-bottom-sheet-container", host: { attributes: { "tabindex": "-1" }, listeners: { "@state.start": "_onAnimationStart($event)", "@state.done": "_onAnimationDone($event)" }, properties: { "attr.role": "_config.role", "attr.aria-modal": "_config.ariaModal", "attr.aria-label": "_config.ariaLabel", "@state": "_animationState" }, classAttribute: "mat-bottom-sheet-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\r\n", styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}.cdk-high-contrast-active .mat-bottom-sheet-container{outline:1px solid}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}"], dependencies: [{ kind: "directive", type: i5.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matBottomSheetAnimations.bottomSheetState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatBottomSheetContainer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatBottomSheetContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-bottom-sheet-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [matBottomSheetAnimations.bottomSheetState], host: {
                        'class': 'mat-bottom-sheet-container',
                        'tabindex': '-1',
                        '[attr.role]': '_config.role',
                        '[attr.aria-modal]': '_config.ariaModal',
                        '[attr.aria-label]': '_config.ariaLabel',
                        '[@state]': '_animationState',
                        '(@state.start)': '_onAnimationStart($event)',
                        '(@state.done)': '_onAnimationDone($event)',
                    }, template: "<ng-template cdkPortalOutlet></ng-template>\r\n", styles: [".mat-bottom-sheet-container{padding:8px 16px;min-width:100vw;box-sizing:border-box;display:block;outline:0;max-height:80vh;overflow:auto}.cdk-high-contrast-active .mat-bottom-sheet-container{outline:1px solid}.mat-bottom-sheet-container-xlarge,.mat-bottom-sheet-container-large,.mat-bottom-sheet-container-medium{border-top-left-radius:4px;border-top-right-radius:4px}.mat-bottom-sheet-container-medium{min-width:384px;max-width:calc(100vw - 128px)}.mat-bottom-sheet-container-large{min-width:512px;max-width:calc(100vw - 256px)}.mat-bottom-sheet-container-xlarge{min-width:576px;max-width:calc(100vw - 384px)}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.DialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i3.OverlayRef }, { type: i4.BreakpointObserver }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ib3R0b20tc2hlZXQvYm90dG9tLXNoZWV0LWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRSxPQUFPLEVBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdkYsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFFTixRQUFRLEVBQ1IsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7O0FBRW5FOzs7R0FHRztBQUNILE1Bc0JhLHVCQUF3QixTQUFRLGtCQUFrQjtJQVk3RCxZQUNFLFVBQXNCLEVBQ3RCLGdCQUFrQyxFQUNKLFFBQWEsRUFDM0MsTUFBb0IsRUFDcEIsT0FBNkIsRUFDN0IsTUFBYyxFQUNkLFVBQXNCLEVBQ3RCLGtCQUFzQyxFQUM5QixrQkFBcUMsRUFDN0MsWUFBMkI7UUFFM0IsS0FBSyxDQUNILFVBQVUsRUFDVixnQkFBZ0IsRUFDaEIsUUFBUSxF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eEMsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4QyxVQUFVLEVBQUUsaUJBQWlCO3dCQUM3QixnQkFBZ0IsRUFBRSwyQkFBMkI7d0JBQzdDLGVBQWUsRUFBRSwwQkFBMEI7cUJBQzVDOzswQkFpQkUsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtDZGtEaWFsb2dDb250YWluZXIsIERpYWxvZ0NvbmZpZ30gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNUcmFwRmFjdG9yeSwgSW50ZXJhY3Rpdml0eUNoZWNrZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50c30gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXRCb3R0b21TaGVldEFuaW1hdGlvbnN9IGZyb20gJy4vYm90dG9tLXNoZWV0LWFuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgYm90dG9tIHNoZWV0IGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ib3R0b20tc2hlZXQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdib3R0b20tc2hlZXQtY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYm90dG9tLXNoZWV0LWNvbnRhaW5lci5jc3MnXSxcbiAgLy8gSW4gSXZ5IGVtYmVkZGVkIHZpZXdzIHdpbGwgYmUgY2hhbmdlIGRldGVjdGVkIGZyb20gdGhlaXIgZGVjbGFyYXRpb24gcGxhY2UsIHJhdGhlciB0aGFuIHdoZXJlXG4gIC8vIHRoZXkgd2VyZSBzdGFtcGVkIG91dC4gVGhpcyBtZWFucyB0aGF0IHdlIGNhbid0IGhhdmUgdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIgYmUgT25QdXNoLFxuICAvLyBiZWNhdXNlIGl0IG1pZ2h0IGNhdXNlIHRoZSBzaGVldHMgdGhhdCB3ZXJlIG9wZW5lZCBmcm9tIGEgdGVtcGxhdGUgbm90IHRvIGJlIG91dCBvZiBkYXRlLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFttYXRCb3R0b21TaGVldEFuaW1hdGlvbnMuYm90dG9tU2hlZXRTdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19jb25maWcucm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbW9kYWxdJzogJ19jb25maWcuYXJpYU1vZGFsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnX2NvbmZpZy5hcmlhTGFiZWwnLFxuICAgICdbQHN0YXRlXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHN0YXRlLnN0YXJ0KSc6ICdfb25BbmltYXRpb25TdGFydCgkZXZlbnQpJyxcbiAgICAnKEBzdGF0ZS5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCb3R0b21TaGVldENvbnRhaW5lciBleHRlbmRzIENka0RpYWxvZ0NvbnRhaW5lciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2JyZWFrcG9pbnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBib3R0b20gc2hlZXQgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBhbmltYXRpb24gY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIGZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgICBjb25maWc6IERpYWxvZ0NvbmZpZyxcbiAgICBjaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBmb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3IsXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIGZvY3VzVHJhcEZhY3RvcnksXG4gICAgICBkb2N1bWVudCxcbiAgICAgIGNvbmZpZyxcbiAgICAgIGNoZWNrZXIsXG4gICAgICBuZ1pvbmUsXG4gICAgICBvdmVybGF5UmVmLFxuICAgICAgZm9jdXNNb25pdG9yLFxuICAgICk7XG5cbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uID0gYnJlYWtwb2ludE9ic2VydmVyXG4gICAgICAub2JzZXJ2ZShbQnJlYWtwb2ludHMuTWVkaXVtLCBCcmVha3BvaW50cy5MYXJnZSwgQnJlYWtwb2ludHMuWExhcmdlXSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl90b2dnbGVDbGFzcyhcbiAgICAgICAgICAnbWF0LWJvdHRvbS1zaGVldC1jb250YWluZXItbWVkaXVtJyxcbiAgICAgICAgICBicmVha3BvaW50T2JzZXJ2ZXIuaXNNYXRjaGVkKEJyZWFrcG9pbnRzLk1lZGl1bSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUNsYXNzKFxuICAgICAgICAgICdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lci1sYXJnZScsXG4gICAgICAgICAgYnJlYWtwb2ludE9ic2VydmVyLmlzTWF0Y2hlZChCcmVha3BvaW50cy5MYXJnZSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUNsYXNzKFxuICAgICAgICAgICdtYXQtYm90dG9tLXNoZWV0LWNvbnRhaW5lci14bGFyZ2UnLFxuICAgICAgICAgIGJyZWFrcG9pbnRPYnNlcnZlci5pc01hdGNoZWQoQnJlYWtwb2ludHMuWExhcmdlKSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiBib3R0b20gc2hlZXQgZW50cmFuY2UgaW50byB2aWV3LiAqL1xuICBlbnRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Rlc3Ryb3llZCkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEJlZ2luIGFuaW1hdGlvbiBvZiB0aGUgYm90dG9tIHNoZWV0IGV4aXRpbmcgZnJvbSB2aWV3LiAqL1xuICBleGl0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICdoaWRkZW4nO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9jYXB0dXJlSW5pdGlhbEZvY3VzKCk6IHZvaWQge31cblxuICBwcml2YXRlIF90b2dnbGVDbGFzcyhjc3NDbGFzczogc3RyaW5nLCBhZGQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjc3NDbGFzcywgYWRkKTtcbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxyXG4iXX0=