import { CdkDialogContainer } from '@angular/cdk/dialog';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, NgZone, Optional, ViewEncapsulation, } from '@angular/core';
import { matDialogAnimations, defaultParams } from './dialog-animations';
import { MatDialogConfig } from './dialog-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "./dialog-config";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "@angular/cdk/portal";
/**
 * Base class for the `MatDialogContainer`. The base class does not implement
 * animations as these are left to implementers of the dialog container.
 */
// tslint:disable-next-line:validate-decorators
export class _MatDialogContainerBase extends CdkDialogContainer {
    constructor(elementRef, focusTrapFactory, _document, dialogConfig, interactivityChecker, ngZone, overlayRef, focusMonitor) {
        super(elementRef, focusTrapFactory, _document, dialogConfig, interactivityChecker, ngZone, overlayRef, focusMonitor);
        /** Emits when an animation state changes. */
        this._animationStateChanged = new EventEmitter();
    }
    _captureInitialFocus() {
        if (!this._config.delayFocusTrap) {
            this._trapFocus();
        }
    }
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    _openAnimationDone(totalTime) {
        if (this._config.delayFocusTrap) {
            this._trapFocus();
        }
        this._animationStateChanged.next({ state: 'opened', totalTime });
    }
}
_MatDialogContainerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: _MatDialogContainerBase, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component });
_MatDialogContainerBase.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: _MatDialogContainerBase, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: _MatDialogContainerBase, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.MatDialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i3.OverlayRef }, { type: i1.FocusMonitor }]; } });
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export class MatDialogContainer extends _MatDialogContainerBase {
    constructor(elementRef, focusTrapFactory, document, dialogConfig, checker, ngZone, overlayRef, _changeDetectorRef, focusMonitor) {
        super(elementRef, focusTrapFactory, document, dialogConfig, checker, ngZone, overlayRef, focusMonitor);
        this._changeDetectorRef = _changeDetectorRef;
        /** State of the dialog animation. */
        this._state = 'enter';
    }
    /** Callback, invoked whenever an animation on the host completes. */
    _onAnimationDone({ toState, totalTime }) {
        if (toState === 'enter') {
            this._openAnimationDone(totalTime);
        }
        else if (toState === 'exit') {
            this._animationStateChanged.next({ state: 'closed', totalTime });
        }
    }
    /** Callback, invoked when an animation on the host starts. */
    _onAnimationStart({ toState, totalTime }) {
        if (toState === 'enter') {
            this._animationStateChanged.next({ state: 'opening', totalTime });
        }
        else if (toState === 'exit' || toState === 'void') {
            this._animationStateChanged.next({ state: 'closing', totalTime });
        }
    }
    /** Starts the dialog exit animation. */
    _startExitAnimation() {
        this._state = 'exit';
        // Mark the container for check so it can react if the
        // view container is using OnPush change detection.
        this._changeDetectorRef.markForCheck();
    }
    _getAnimationState() {
        return {
            value: this._state,
            params: {
                'enterAnimationDuration': this._config.enterAnimationDuration || defaultParams.params.enterAnimationDuration,
                'exitAnimationDuration': this._config.exitAnimationDuration || defaultParams.params.exitAnimationDuration,
            },
        };
    }
}
MatDialogContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogContainer, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component });
MatDialogContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatDialogContainer, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, listeners: { "@dialogContainer.start": "_onAnimationStart($event)", "@dialogContainer.done": "_onAnimationDone($event)" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledBy", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "@dialogContainer": "_getAnimationState()" }, classAttribute: "mat-dialog-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"], dependencies: [{ kind: "directive", type: i4.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDialogAnimations.dialogContainer], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-dialog-container', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, animations: [matDialogAnimations.dialogContainer], host: {
                        'class': 'mat-dialog-container',
                        'tabindex': '-1',
                        '[attr.aria-modal]': '_config.ariaModal',
                        '[id]': '_config.id',
                        '[attr.role]': '_config.role',
                        '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
                        '[attr.aria-label]': '_config.ariaLabel',
                        '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
                        '[@dialogContainer]': `_getAnimationState()`,
                        '(@dialogContainer.start)': '_onAnimationStart($event)',
                        '(@dialogContainer.done)': '_onAnimationDone($event)',
                    }, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.MatDialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i3.OverlayRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxFQUNSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7QUFRaEQ7OztHQUdHO0FBQ0gsK0NBQStDO0FBRS9DLE1BQU0sT0FBZ0IsdUJBQXdCLFNBQVEsa0JBQW1DO0lBSXZGLFlBQ0UsVUFBc0IsRUFDdEIsZ0JBQWtDLEVBQ0osU0FBYyxFQUM1QyxZQUE2QixFQUM3QixvQkFBMEMsRUFDMUMsTUFBYyxFQUNkLFVBQXNCLEVBQ3RCLFlBQTJCO1FBRTNCLEtBQUssQ0FDSCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxZQUFZLEVBQ1osb0JBQW9CLEVBQ3BCLE1BQU0sRUFDTixVQUFVLEVBQ1YsWUFB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QUMscUJBQXFCLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUI7YUFDbkY7U0FDRixDQUFDO0lBQ0osQ0FBQzs7K0dBaEVVLGtCQUFrQiw0RUFrQ1AsUUFBUTttR0FsQ25CLGtCQUFrQixpbUJDcEgvQiwrQ0FDQSwydkNEb0djLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDOzJGQWV0QyxrQkFBa0I7a0JBdkI5QixTQUFTOytCQUNFLHNCQUFzQixpQkFHakIsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyxjQUNwQyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxRQUMzQzt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4QyxNQUFNLEVBQUUsWUFBWTt3QkFDcEIsYUFBYSxFQUFFLGNBQWM7d0JBQzdCLHdCQUF3QixFQUFFLDRDQUE0Qzt3QkFDdEUsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4Qyx5QkFBeUIsRUFBRSxpQ0FBaUM7d0JBQzVELG9CQUFvQixFQUFFLHNCQUFzQjt3QkFDNUMsMEJBQTBCLEVBQUUsMkJBQTJCO3dCQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7cUJBQ3REOzswQkFvQ0UsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtDZGtEaWFsb2dDb250YWluZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kaWFsb2cnO1xuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzVHJhcEZhY3RvcnksIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7X2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHttYXREaWFsb2dBbmltYXRpb25zLCBkZWZhdWx0UGFyYW1zfSBmcm9tICcuL2RpYWxvZy1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuXG4vKiogRXZlbnQgdGhhdCBjYXB0dXJlcyB0aGUgc3RhdGUgb2YgZGlhbG9nIGNvbnRhaW5lciBhbmltYXRpb25zLiAqL1xuaW50ZXJmYWNlIERpYWxvZ0FuaW1hdGlvbkV2ZW50IHtcbiAgc3RhdGU6ICdvcGVuZWQnIHwgJ29wZW5pbmcnIHwgJ2Nsb3NpbmcnIHwgJ2Nsb3NlZCc7XG4gIHRvdGFsVGltZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBgTWF0RGlhbG9nQ29udGFpbmVyYC4gVGhlIGJhc2UgY2xhc3MgZG9lcyBub3QgaW1wbGVtZW50XG4gKiBhbmltYXRpb25zIGFzIHRoZXNlIGFyZSBsZWZ0IHRvIGltcGxlbWVudGVycyBvZiB0aGUgZGlhbG9nIGNvbnRhaW5lci5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbkBDb21wb25lbnQoe3RlbXBsYXRlOiAnJ30pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdERpYWxvZ0NvbnRhaW5lckJhc2UgZXh0ZW5kcyBDZGtEaWFsb2dDb250YWluZXI8TWF0RGlhbG9nQ29uZmlnPiB7XG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBfYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxEaWFsb2dBbmltYXRpb25FdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIGZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgZGlhbG9nQ29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgaW50ZXJhY3Rpdml0eUNoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBmb2N1c1RyYXBGYWN0b3J5LFxuICAgICAgX2RvY3VtZW50LFxuICAgICAgZGlhbG9nQ29uZmlnLFxuICAgICAgaW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgICBuZ1pvbmUsXG4gICAgICBvdmVybGF5UmVmLFxuICAgICAgZm9jdXNNb25pdG9yLFxuICAgICk7XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gIGFic3RyYWN0IF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZDtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2NhcHR1cmVJbml0aWFsRm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgb3BlbiBkaWFsb2cgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gSW50ZW5kZWQgdG9cbiAgICogYmUgY2FsbGVkIGJ5IHN1Yi1jbGFzc2VzIHRoYXQgdXNlIGRpZmZlcmVudCBhbmltYXRpb24gaW1wbGVtZW50YXRpb25zLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9vcGVuQW5pbWF0aW9uRG9uZSh0b3RhbFRpbWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9jb25maWcuZGVsYXlGb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ29wZW5lZCcsIHRvdGFsVGltZX0pO1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBkaWFsb2cgY29udGVudC5cbiAqIEFuaW1hdGlvbiBpcyBiYXNlZCBvbiBodHRwczovL21hdGVyaWFsLmlvL2d1aWRlbGluZXMvbW90aW9uL2Nob3Jlb2dyYXBoeS5odG1sLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGlhbG9nLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZGlhbG9nLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RpYWxvZy5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gVXNpbmcgT25QdXNoIGZvciBkaWFsb2dzIGNhdXNlZCBzb21lIEczIHN5bmMgaXNzdWVzLiBEaXNhYmxlZCB1bnRpbCB3ZSBjYW4gdHJhY2sgdGhlbSBkb3duLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGFuaW1hdGlvbnM6IFttYXREaWFsb2dBbmltYXRpb25zLmRpYWxvZ0NvbnRhaW5lcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1thdHRyLmFyaWEtbW9kYWxdJzogJ19jb25maWcuYXJpYU1vZGFsJyxcbiAgICAnW2lkXSc6ICdfY29uZmlnLmlkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnX2NvbmZpZy5yb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdfY29uZmlnLmFyaWFMYWJlbCA/IG51bGwgOiBfYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfY29uZmlnLmFyaWFMYWJlbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ19jb25maWcuYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbQGRpYWxvZ0NvbnRhaW5lcl0nOiBgX2dldEFuaW1hdGlvblN0YXRlKClgLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5zdGFydCknOiAnX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KScsXG4gICAgJyhAZGlhbG9nQ29udGFpbmVyLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZ0NvbnRhaW5lciBleHRlbmRzIF9NYXREaWFsb2dDb250YWluZXJCYXNlIHtcbiAgLyoqIFN0YXRlIG9mIHRoZSBkaWFsb2cgYW5pbWF0aW9uLiAqL1xuICBfc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKHt0b1N0YXRlLCB0b3RhbFRpbWV9OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmICh0b1N0YXRlID09PSAnZW50ZXInKSB7XG4gICAgICB0aGlzLl9vcGVuQW5pbWF0aW9uRG9uZSh0b3RhbFRpbWUpO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZSA9PT0gJ2V4aXQnKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZUNoYW5nZWQubmV4dCh7c3RhdGU6ICdjbG9zZWQnLCB0b3RhbFRpbWV9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIGhvc3Qgc3RhcnRzLiAqL1xuICBfb25BbmltYXRpb25TdGFydCh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnb3BlbmluZycsIHRvdGFsVGltZX0pO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZSA9PT0gJ2V4aXQnIHx8IHRvU3RhdGUgPT09ICd2b2lkJykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnY2xvc2luZycsIHRvdGFsVGltZX0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGRpYWxvZyBleGl0IGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZSA9ICdleGl0JztcblxuICAgIC8vIE1hcmsgdGhlIGNvbnRhaW5lciBmb3IgY2hlY2sgc28gaXQgY2FuIHJlYWN0IGlmIHRoZVxuICAgIC8vIHZpZXcgY29udGFpbmVyIGlzIHVzaW5nIE9uUHVzaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBmb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgZGlhbG9nQ29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgY2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZm9jdXNNb25pdG9yPzogRm9jdXNNb25pdG9yLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBmb2N1c1RyYXBGYWN0b3J5LFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBkaWFsb2dDb25maWcsXG4gICAgICBjaGVja2VyLFxuICAgICAgbmdab25lLFxuICAgICAgb3ZlcmxheVJlZixcbiAgICAgIGZvY3VzTW9uaXRvcixcbiAgICApO1xuICB9XG5cbiAgX2dldEFuaW1hdGlvblN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdGhpcy5fc3RhdGUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgJ2VudGVyQW5pbWF0aW9uRHVyYXRpb24nOlxuICAgICAgICAgIHRoaXMuX2NvbmZpZy5lbnRlckFuaW1hdGlvbkR1cmF0aW9uIHx8IGRlZmF1bHRQYXJhbXMucGFyYW1zLmVudGVyQW5pbWF0aW9uRHVyYXRpb24sXG4gICAgICAgICdleGl0QW5pbWF0aW9uRHVyYXRpb24nOlxuICAgICAgICAgIHRoaXMuX2NvbmZpZy5leGl0QW5pbWF0aW9uRHVyYXRpb24gfHwgZGVmYXVsdFBhcmFtcy5wYXJhbXMuZXhpdEFuaW1hdGlvbkR1cmF0aW9uLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCI8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XG4iXX0=