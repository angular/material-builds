import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, Optional, ViewEncapsulation, } from '@angular/core';
import { defaultParams } from './dialog-animations';
import { MatLegacyDialogConfig } from './dialog-config';
import { _MatDialogContainerBase, matDialogAnimations } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "./dialog-config";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 * @deprecated Use `MatDialogContainer` from `@angular/material/dialog` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyDialogContainer extends _MatDialogContainerBase {
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
    constructor(elementRef, focusTrapFactory, document, dialogConfig, checker, ngZone, overlayRef, _changeDetectorRef, focusMonitor) {
        super(elementRef, focusTrapFactory, document, dialogConfig, checker, ngZone, overlayRef, focusMonitor);
        this._changeDetectorRef = _changeDetectorRef;
        /** State of the dialog animation. */
        this._state = 'enter';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatLegacyDialogContainer, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.MatLegacyDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatLegacyDialogContainer, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, listeners: { "@dialogContainer.start": "_onAnimationStart($event)", "@dialogContainer.done": "_onAnimationDone($event)" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledBy", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "@dialogContainer": "_getAnimationState()" }, classAttribute: "mat-dialog-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"], dependencies: [{ kind: "directive", type: i4.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDialogAnimations.dialogContainer], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyDialogContainer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatLegacyDialogContainer, decorators: [{
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
                }] }, { type: i2.MatLegacyDialogConfig }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i3.OverlayRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktZGlhbG9nL2RpYWxvZy1jb250YWluZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWRpYWxvZy9kaWFsb2ctY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsT0FBTyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFdEY7Ozs7OztHQU1HO0FBQ0gsTUF1QmEsd0JBQXlCLFNBQVEsdUJBQXVCO0lBSW5FLHFFQUFxRTtJQUNyRSxnQkFBZ0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQWlCO1FBQ25ELElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDcEM7YUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFRCw4REFBOEQ7SUFDOUQsaUJBQWlCLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFpQjtRQUNwRCxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFDdkIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztTQUNqRTthQUFNLElBQUksT0FBTyxLQUFLLE1BQU0sSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1lBQ25ELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLG1CQUFtQjtRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixzREFBc0Q7UUFDdEQsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsWUFDRSxVQUFzQixFQUN0QixnQkFBa0MsRUFDSixRQUFhLEVBQzNDLFlBQW1DLEVBQ25DLE9BQTZCLEVBQzdCLE1BQWMsRUFDZCxVQUFzQixFQUNkLGtCQUFxQyxFQUM3QyxZQUEyQjtRQUUzQixLQUFLLENBQ0gsVUFBVSxFQUNWLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsWUFBWSxFQUNaLE9BQU8sRUFDUCxNQUFNLEVBQ04sVUFBVSxFQUNWLFlBQVksQ0FDYixDQUFDO1FBWk0sdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQXRDL0MscUNBQXFDO1FBQ3JDLFdBQU0sR0FBOEIsT0FBTyxDQUFDO0lBa0Q1QyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsTUFBTSxFQUFFO2dCQUNOLHdCQUF3QixFQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCO2dCQUNwRix1QkFBdUIsRUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLHFCQUFxQjthQUNuRjtTQUNGLENBQUM7SUFDSixDQUFDO21IQWhFVSx3QkFBd0IsNEVBa0NiLFFBQVE7dUdBbENuQix3QkFBd0IsaW1CQ3hEckMsK0NBQ0EsMnZDRHdDYyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQzs7U0FldEMsd0JBQXdCO2dHQUF4Qix3QkFBd0I7a0JBdkJwQyxTQUFTOytCQUNFLHNCQUFzQixpQkFHakIsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyxjQUNwQyxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxRQUMzQzt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4QyxNQUFNLEVBQUUsWUFBWTt3QkFDcEIsYUFBYSxFQUFFLGNBQWM7d0JBQzdCLHdCQUF3QixFQUFFLDRDQUE0Qzt3QkFDdEUsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4Qyx5QkFBeUIsRUFBRSxpQ0FBaUM7d0JBQzVELG9CQUFvQixFQUFFLHNCQUFzQjt3QkFDNUMsMEJBQTBCLEVBQUUsMkJBQTJCO3dCQUN2RCx5QkFBeUIsRUFBRSwwQkFBMEI7cUJBQ3REOzswQkFvQ0UsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzVHJhcEZhY3RvcnksIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge092ZXJsYXlSZWZ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2RlZmF1bHRQYXJhbXN9IGZyb20gJy4vZGlhbG9nLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRMZWdhY3lEaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge19NYXREaWFsb2dDb250YWluZXJCYXNlLCBtYXREaWFsb2dBbmltYXRpb25zfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgZGlhbG9nIGNvbnRlbnQuXG4gKiBBbmltYXRpb24gaXMgYmFzZWQgb24gaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL21vdGlvbi9jaG9yZW9ncmFwaHkuaHRtbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0RGlhbG9nQ29udGFpbmVyYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2dgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RpYWxvZy1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkaWFsb2cuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFVzaW5nIE9uUHVzaCBmb3IgZGlhbG9ncyBjYXVzZWQgc29tZSBHMyBzeW5jIGlzc3Vlcy4gRGlzYWJsZWQgdW50aWwgd2UgY2FuIHRyYWNrIHRoZW0gZG93bi5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0RGlhbG9nQW5pbWF0aW9ucy5kaWFsb2dDb250YWluZXJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLW1vZGFsXSc6ICdfY29uZmlnLmFyaWFNb2RhbCcsXG4gICAgJ1tpZF0nOiAnX2NvbmZpZy5pZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19jb25maWcucm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2NvbmZpZy5hcmlhTGFiZWwgPyBudWxsIDogX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnX2NvbmZpZy5hcmlhTGFiZWwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfY29uZmlnLmFyaWFEZXNjcmliZWRCeSB8fCBudWxsJyxcbiAgICAnW0BkaWFsb2dDb250YWluZXJdJzogYF9nZXRBbmltYXRpb25TdGF0ZSgpYCxcbiAgICAnKEBkaWFsb2dDb250YWluZXIuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lEaWFsb2dDb250YWluZXIgZXh0ZW5kcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSB7XG4gIC8qKiBTdGF0ZSBvZiB0aGUgZGlhbG9nIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXRlOiAndm9pZCcgfCAnZW50ZXInIHwgJ2V4aXQnID0gJ2VudGVyJztcblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZSh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fb3BlbkFuaW1hdGlvbkRvbmUodG90YWxUaW1lKTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnY2xvc2VkJywgdG90YWxUaW1lfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IHN0YXJ0cy4gKi9cbiAgX29uQW5pbWF0aW9uU3RhcnQoe3RvU3RhdGUsIHRvdGFsVGltZX06IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKHRvU3RhdGUgPT09ICdlbnRlcicpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ29wZW5pbmcnLCB0b3RhbFRpbWV9KTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0JyB8fCB0b1N0YXRlID09PSAndm9pZCcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ2Nsb3NpbmcnLCB0b3RhbFRpbWV9KTtcbiAgICB9XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGUgPSAnZXhpdCc7XG5cbiAgICAvLyBNYXJrIHRoZSBjb250YWluZXIgZm9yIGNoZWNrIHNvIGl0IGNhbiByZWFjdCBpZiB0aGVcbiAgICAvLyB2aWV3IGNvbnRhaW5lciBpcyB1c2luZyBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIGRpYWxvZ0NvbmZpZzogTWF0TGVnYWN5RGlhbG9nQ29uZmlnLFxuICAgIGNoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgKSB7XG4gICAgc3VwZXIoXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgZm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgIGRvY3VtZW50LFxuICAgICAgZGlhbG9nQ29uZmlnLFxuICAgICAgY2hlY2tlcixcbiAgICAgIG5nWm9uZSxcbiAgICAgIG92ZXJsYXlSZWYsXG4gICAgICBmb2N1c01vbml0b3IsXG4gICAgKTtcbiAgfVxuXG4gIF9nZXRBbmltYXRpb25TdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMuX3N0YXRlLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgICdlbnRlckFuaW1hdGlvbkR1cmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9jb25maWcuZW50ZXJBbmltYXRpb25EdXJhdGlvbiB8fCBkZWZhdWx0UGFyYW1zLnBhcmFtcy5lbnRlckFuaW1hdGlvbkR1cmF0aW9uLFxuICAgICAgICAnZXhpdEFuaW1hdGlvbkR1cmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9jb25maWcuZXhpdEFuaW1hdGlvbkR1cmF0aW9uIHx8IGRlZmF1bHRQYXJhbXMucGFyYW1zLmV4aXRBbmltYXRpb25EdXJhdGlvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxuIl19