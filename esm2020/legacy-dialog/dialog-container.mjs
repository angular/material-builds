import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, Optional, ViewEncapsulation, } from '@angular/core';
import { defaultParams } from './dialog-animations';
import { _MatDialogContainerBase, MatDialogConfig, matDialogAnimations, } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/dialog";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export class MatLegacyDialogContainer extends _MatDialogContainerBase {
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
MatLegacyDialogContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyDialogContainer, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }, { token: i2.MatDialogConfig }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i3.OverlayRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component });
MatLegacyDialogContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.0", type: MatLegacyDialogContainer, selector: "mat-dialog-container", host: { attributes: { "tabindex": "-1" }, listeners: { "@dialogContainer.start": "_onAnimationStart($event)", "@dialogContainer.done": "_onAnimationDone($event)" }, properties: { "attr.aria-modal": "_config.ariaModal", "id": "_config.id", "attr.role": "_config.role", "attr.aria-labelledby": "_config.ariaLabel ? null : _ariaLabelledBy", "attr.aria-label": "_config.ariaLabel", "attr.aria-describedby": "_config.ariaDescribedBy || null", "@dialogContainer": "_getAnimationState()" }, classAttribute: "mat-dialog-container" }, usesInheritance: true, ngImport: i0, template: "<ng-template cdkPortalOutlet></ng-template>\n", styles: [".mat-dialog-container{display:block;padding:24px;border-radius:4px;box-sizing:border-box;overflow:auto;outline:0;width:100%;height:100%;min-height:inherit;max-height:inherit}.cdk-high-contrast-active .mat-dialog-container{outline:solid 1px}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto;-webkit-overflow-scrolling:touch}.mat-dialog-title{margin:0 0 20px;display:block}.mat-dialog-actions{padding:8px 0;display:flex;flex-wrap:wrap;min-height:52px;align-items:center;box-sizing:content-box;margin-bottom:-24px}.mat-dialog-actions.mat-dialog-actions-align-center,.mat-dialog-actions[align=center]{justify-content:center}.mat-dialog-actions.mat-dialog-actions-align-end,.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions .mat-button-base+.mat-button-base,.mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-dialog-actions .mat-button-base+.mat-button-base,[dir=rtl] .mat-dialog-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}"], dependencies: [{ kind: "directive", type: i4.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matDialogAnimations.dialogContainer], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyDialogContainer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktZGlhbG9nL2RpYWxvZy1jb250YWluZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LWRpYWxvZy9kaWFsb2ctY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsT0FBTyxFQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsZUFBZSxFQUNmLG1CQUFtQixHQUNwQixNQUFNLDBCQUEwQixDQUFDOzs7Ozs7QUFFbEM7Ozs7R0FJRztBQXdCSCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsdUJBQXVCO0lBK0JuRSxZQUNFLFVBQXNCLEVBQ3RCLGdCQUFrQyxFQUNKLFFBQWEsRUFDM0MsWUFBNkIsRUFDN0IsT0FBNkIsRUFDN0IsTUFBYyxFQUNkLFVBQXNCLEVBQ2Qsa0JBQXFDLEVBQzdDLFlBQTJCO1FBRTNCLEtBQUssQ0FDSCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDUixZQUFZLEVBQ1osT0FBTyxFQUNQLE1BQU0sRUFDTixVQUFVLEVBQ1YsWUFBWSxDQUNiLENBQUM7UUFaTSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBdEMvQyxxQ0FBcUM7UUFDckMsV0FBTSxHQUE4QixPQUFPLENBQUM7SUFrRDVDLENBQUM7SUFoREQscUVBQXFFO0lBQ3JFLGdCQUFnQixDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBaUI7UUFDbkQsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwQzthQUFNLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQztJQUVELDhEQUE4RDtJQUM5RCxpQkFBaUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQWlCO1FBQ3BELElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU0sSUFBSSxPQUFPLEtBQUssTUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7WUFDbkQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztTQUNqRTtJQUNILENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLHNEQUFzRDtRQUN0RCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUF5QkQsa0JBQWtCO1FBQ2hCLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsTUFBTSxFQUFFO2dCQUNOLHdCQUF3QixFQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCO2dCQUNwRix1QkFBdUIsRUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLHFCQUFxQjthQUNuRjtTQUNGLENBQUM7SUFDSixDQUFDOztxSEFoRVUsd0JBQXdCLDRFQWtDYixRQUFRO3lHQWxDbkIsd0JBQXdCLGltQkN6RHJDLCtDQUNBLDJ2Q0R5Q2MsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUM7MkZBZXRDLHdCQUF3QjtrQkF2QnBDLFNBQVM7K0JBQ0Usc0JBQXNCLGlCQUdqQixpQkFBaUIsQ0FBQyxJQUFJLG1CQUdwQix1QkFBdUIsQ0FBQyxPQUFPLGNBQ3BDLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLFFBQzNDO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLE1BQU0sRUFBRSxZQUFZO3dCQUNwQixhQUFhLEVBQUUsY0FBYzt3QkFDN0Isd0JBQXdCLEVBQUUsNENBQTRDO3dCQUN0RSxtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLHlCQUF5QixFQUFFLGlDQUFpQzt3QkFDNUQsb0JBQW9CLEVBQUUsc0JBQXNCO3dCQUM1QywwQkFBMEIsRUFBRSwyQkFBMkI7d0JBQ3ZELHlCQUF5QixFQUFFLDBCQUEwQjtxQkFDdEQ7OzBCQW9DRSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNUcmFwRmFjdG9yeSwgSW50ZXJhY3Rpdml0eUNoZWNrZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7T3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZGVmYXVsdFBhcmFtc30gZnJvbSAnLi9kaWFsb2ctYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSxcbiAgTWF0RGlhbG9nQ29uZmlnLFxuICBtYXREaWFsb2dBbmltYXRpb25zLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgZGlhbG9nIGNvbnRlbnQuXG4gKiBBbmltYXRpb24gaXMgYmFzZWQgb24gaHR0cHM6Ly9tYXRlcmlhbC5pby9ndWlkZWxpbmVzL21vdGlvbi9jaG9yZW9ncmFwaHkuaHRtbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRpYWxvZy1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RpYWxvZy1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkaWFsb2cuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFVzaW5nIE9uUHVzaCBmb3IgZGlhbG9ncyBjYXVzZWQgc29tZSBHMyBzeW5jIGlzc3Vlcy4gRGlzYWJsZWQgdW50aWwgd2UgY2FuIHRyYWNrIHRoZW0gZG93bi5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0RGlhbG9nQW5pbWF0aW9ucy5kaWFsb2dDb250YWluZXJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kaWFsb2ctY29udGFpbmVyJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLW1vZGFsXSc6ICdfY29uZmlnLmFyaWFNb2RhbCcsXG4gICAgJ1tpZF0nOiAnX2NvbmZpZy5pZCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19jb25maWcucm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2NvbmZpZy5hcmlhTGFiZWwgPyBudWxsIDogX2FyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnX2NvbmZpZy5hcmlhTGFiZWwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfY29uZmlnLmFyaWFEZXNjcmliZWRCeSB8fCBudWxsJyxcbiAgICAnW0BkaWFsb2dDb250YWluZXJdJzogYF9nZXRBbmltYXRpb25TdGF0ZSgpYCxcbiAgICAnKEBkaWFsb2dDb250YWluZXIuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQGRpYWxvZ0NvbnRhaW5lci5kb25lKSc6ICdfb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lEaWFsb2dDb250YWluZXIgZXh0ZW5kcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZSB7XG4gIC8qKiBTdGF0ZSBvZiB0aGUgZGlhbG9nIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXRlOiAndm9pZCcgfCAnZW50ZXInIHwgJ2V4aXQnID0gJ2VudGVyJztcblxuICAvKiogQ2FsbGJhY2ssIGludm9rZWQgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZSh7dG9TdGF0ZSwgdG90YWxUaW1lfTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fb3BlbkFuaW1hdGlvbkRvbmUodG90YWxUaW1lKTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0Jykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLm5leHQoe3N0YXRlOiAnY2xvc2VkJywgdG90YWxUaW1lfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSBob3N0IHN0YXJ0cy4gKi9cbiAgX29uQW5pbWF0aW9uU3RhcnQoe3RvU3RhdGUsIHRvdGFsVGltZX06IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKHRvU3RhdGUgPT09ICdlbnRlcicpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ29wZW5pbmcnLCB0b3RhbFRpbWV9KTtcbiAgICB9IGVsc2UgaWYgKHRvU3RhdGUgPT09ICdleGl0JyB8fCB0b1N0YXRlID09PSAndm9pZCcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlQ2hhbmdlZC5uZXh0KHtzdGF0ZTogJ2Nsb3NpbmcnLCB0b3RhbFRpbWV9KTtcbiAgICB9XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBkaWFsb2cgZXhpdCBhbmltYXRpb24uICovXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGUgPSAnZXhpdCc7XG5cbiAgICAvLyBNYXJrIHRoZSBjb250YWluZXIgZm9yIGNoZWNrIHNvIGl0IGNhbiByZWFjdCBpZiB0aGVcbiAgICAvLyB2aWV3IGNvbnRhaW5lciBpcyB1c2luZyBPblB1c2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIGRpYWxvZ0NvbmZpZzogTWF0RGlhbG9nQ29uZmlnLFxuICAgIGNoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgKSB7XG4gICAgc3VwZXIoXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgZm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgIGRvY3VtZW50LFxuICAgICAgZGlhbG9nQ29uZmlnLFxuICAgICAgY2hlY2tlcixcbiAgICAgIG5nWm9uZSxcbiAgICAgIG92ZXJsYXlSZWYsXG4gICAgICBmb2N1c01vbml0b3IsXG4gICAgKTtcbiAgfVxuXG4gIF9nZXRBbmltYXRpb25TdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMuX3N0YXRlLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgICdlbnRlckFuaW1hdGlvbkR1cmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9jb25maWcuZW50ZXJBbmltYXRpb25EdXJhdGlvbiB8fCBkZWZhdWx0UGFyYW1zLnBhcmFtcy5lbnRlckFuaW1hdGlvbkR1cmF0aW9uLFxuICAgICAgICAnZXhpdEFuaW1hdGlvbkR1cmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9jb25maWcuZXhpdEFuaW1hdGlvbkR1cmF0aW9uIHx8IGRlZmF1bHRQYXJhbXMucGFyYW1zLmV4aXRBbmltYXRpb25EdXJhdGlvbixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxuIl19