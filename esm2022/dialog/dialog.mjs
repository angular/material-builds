/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { ANIMATION_MODULE_TYPE, Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, inject, } from '@angular/core';
import { MatDialogConfig } from './dialog-config';
import { MatDialogContainer } from './dialog-container';
import { MatDialogRef } from './dialog-ref';
import { defer, Subject } from 'rxjs';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { startWith } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "./dialog-config";
/** Injection token that can be used to access the data that was passed in to a dialog. */
export const MAT_DIALOG_DATA = new InjectionToken('MatMdcDialogData');
/** Injection token that can be used to specify default dialog options. */
export const MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-mdc-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
export const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-mdc-dialog-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.block();
    },
});
/**
 * @docs-private
 * @deprecated No longer used. To be removed.
 * @breaking-change 19.0.0
 */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/**
 * @docs-private
 * @deprecated No longer used. To be removed.
 * @breaking-change 19.0.0
 */
export const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
// Counter for unique dialog ids.
let uniqueId = 0;
/**
 * Service to open Material Design modal dialogs.
 */
export class MatDialog {
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
    }
    _getAfterAllClosed() {
        const parent = this._parentDialog;
        return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
    }
    constructor(_overlay, injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    location, _defaultOptions, _scrollStrategy, _parentDialog, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 15.0.0
     */
    _overlayContainer, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    _animationMode) {
        this._overlay = _overlay;
        this._defaultOptions = _defaultOptions;
        this._scrollStrategy = _scrollStrategy;
        this._parentDialog = _parentDialog;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new Subject();
        this._afterOpenedAtThisLevel = new Subject();
        this.dialogConfigClass = MatDialogConfig;
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(() => this.openDialogs.length
            ? this._getAfterAllClosed()
            : this._getAfterAllClosed().pipe(startWith(undefined)));
        this._dialog = injector.get(Dialog);
        this._dialogRefConstructor = MatDialogRef;
        this._dialogContainerType = MatDialogContainer;
        this._dialogDataToken = MAT_DIALOG_DATA;
    }
    open(componentOrTemplateRef, config) {
        let dialogRef;
        config = { ...(this._defaultOptions || new MatDialogConfig()), ...config };
        config.id = config.id || `mat-mdc-dialog-${uniqueId++}`;
        config.scrollStrategy = config.scrollStrategy || this._scrollStrategy();
        const cdkRef = this._dialog.open(componentOrTemplateRef, {
            ...config,
            positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
            // Disable closing since we need to sync it up to the animation ourselves.
            disableClose: true,
            // Disable closing on destroy, because this service cleans up its open dialogs as well.
            // We want to do the cleanup here, rather than the CDK service, because the CDK destroys
            // the dialogs immediately whereas we want it to wait for the animations to finish.
            closeOnDestroy: false,
            // Disable closing on detachments so that we can sync up the animation.
            // The Material dialog ref handles this manually.
            closeOnOverlayDetachments: false,
            container: {
                type: this._dialogContainerType,
                providers: () => [
                    // Provide our config as the CDK config as well since it has the same interface as the
                    // CDK one, but it contains the actual values passed in by the user for things like
                    // `disableClose` which we disable for the CDK dialog since we handle it ourselves.
                    { provide: this.dialogConfigClass, useValue: config },
                    { provide: DialogConfig, useValue: config },
                ],
            },
            templateContext: () => ({ dialogRef }),
            providers: (ref, cdkConfig, dialogContainer) => {
                dialogRef = new this._dialogRefConstructor(ref, config, dialogContainer);
                dialogRef.updatePosition(config?.position);
                return [
                    { provide: this._dialogContainerType, useValue: dialogContainer },
                    { provide: this._dialogDataToken, useValue: cdkConfig.data },
                    { provide: this._dialogRefConstructor, useValue: dialogRef },
                ];
            },
        });
        // This can't be assigned in the `providers` callback, because
        // the instance hasn't been assigned to the CDK ref yet.
        dialogRef.componentRef = cdkRef.componentRef;
        dialogRef.componentInstance = cdkRef.componentInstance;
        this.openDialogs.push(dialogRef);
        this.afterOpened.next(dialogRef);
        dialogRef.afterClosed().subscribe(() => {
            const index = this.openDialogs.indexOf(dialogRef);
            if (index > -1) {
                this.openDialogs.splice(index, 1);
                if (!this.openDialogs.length) {
                    this._getAfterAllClosed().next();
                }
            }
        });
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        this._closeDialogs(this.openDialogs);
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    ngOnDestroy() {
        // Only close the dialogs at this level on destroy
        // since the parent service may still be active.
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
    }
    _closeDialogs(dialogs) {
        let i = dialogs.length;
        while (i--) {
            dialogs[i].close();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: MatDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_DIALOG_SCROLL_STRATEGY }, { token: MatDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: MatDialog, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: MatDialog, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
                    type: Optional
                }] }, { type: i3.MatDialogConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DIALOG_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_SCROLL_STRATEGY]
                }] }, { type: MatDialog, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.OverlayContainer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixPQUFPLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFFckIsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEVBR1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDekQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUV6QywwRkFBMEY7QUFDMUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFNLGtCQUFrQixDQUFDLENBQUM7QUFFM0UsMEVBQTBFO0FBQzFFLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLElBQUksY0FBYyxDQUMxRCxnQ0FBZ0MsQ0FDakMsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLGNBQWMsQ0FDMUQsZ0NBQWdDLEVBQ2hDO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FB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XG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50VHlwZSwgT3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIENvbXBvbmVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVHlwZSxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0RGlhbG9nQ29uZmlnfSBmcm9tICcuL2RpYWxvZy1jb25maWcnO1xuaW1wb3J0IHtNYXREaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdERpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcbmltcG9ydCB7ZGVmZXIsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtEaWFsb2csIERpYWxvZ0NvbmZpZ30gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCBpbiB0byBhIGRpYWxvZy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RBVEEgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignTWF0TWRjRGlhbG9nRGF0YScpO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGRpYWxvZyBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdERpYWxvZ0NvbmZpZz4oXG4gICdtYXQtbWRjLWRpYWxvZy1kZWZhdWx0LW9wdGlvbnMnLFxuKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgZGlhbG9nIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LW1kYy1kaWFsb2ctc2Nyb2xsLXN0cmF0ZWd5JyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiAoKSA9PiB7XG4gICAgICBjb25zdCBvdmVybGF5ID0gaW5qZWN0KE92ZXJsYXkpO1xuICAgICAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xuICAgIH0sXG4gIH0sXG4pO1xuXG4vKipcbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxOS4wLjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIG92ZXJsYXk6IE92ZXJsYXksXG4pOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTkuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBkaWFsb2cgaWRzLlxubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZyBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWw6IE1hdERpYWxvZ1JlZjxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4oKTtcbiAgcHJpdmF0ZSBfZGlhbG9nOiBEaWFsb2c7XG4gIHByb3RlY3RlZCBkaWFsb2dDb25maWdDbGFzcyA9IE1hdERpYWxvZ0NvbmZpZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kaWFsb2dSZWZDb25zdHJ1Y3RvcjogVHlwZTxNYXREaWFsb2dSZWY8YW55Pj47XG4gIHByaXZhdGUgcmVhZG9ubHkgX2RpYWxvZ0NvbnRhaW5lclR5cGU6IFR5cGU8TWF0RGlhbG9nQ29udGFpbmVyPjtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGlhbG9nRGF0YVRva2VuOiBJbmplY3Rpb25Ub2tlbjxhbnk+O1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QWZ0ZXJBbGxDbG9zZWQoKTogU3ViamVjdDx2b2lkPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50RGlhbG9nO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX2dldEFmdGVyQWxsQ2xvc2VkKCkgOiB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYWxsIG9wZW4gZGlhbG9nIGhhdmUgZmluaXNoZWQgY2xvc2luZy5cbiAgICogV2lsbCBlbWl0IG9uIHN1YnNjcmliZSBpZiB0aGVyZSBhcmUgbm8gb3BlbiBkaWFsb2dzIHRvIGJlZ2luIHdpdGguXG4gICAqL1xuICByZWFkb25seSBhZnRlckFsbENsb3NlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IGRlZmVyKCgpID0+XG4gICAgdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGhcbiAgICAgID8gdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKVxuICAgICAgOiB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpLnBpcGUoc3RhcnRXaXRoKHVuZGVmaW5lZCkpLFxuICApIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2xvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnLFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kpIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50RGlhbG9nOiBNYXREaWFsb2csXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICAgKi9cbiAgICBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpXG4gICAgX2FuaW1hdGlvbk1vZGU/OiAnTm9vcEFuaW1hdGlvbnMnIHwgJ0Jyb3dzZXJBbmltYXRpb25zJyxcbiAgKSB7XG4gICAgdGhpcy5fZGlhbG9nID0gaW5qZWN0b3IuZ2V0KERpYWxvZyk7XG5cbiAgICB0aGlzLl9kaWFsb2dSZWZDb25zdHJ1Y3RvciA9IE1hdERpYWxvZ1JlZjtcbiAgICB0aGlzLl9kaWFsb2dDb250YWluZXJUeXBlID0gTWF0RGlhbG9nQ29udGFpbmVyO1xuICAgIHRoaXMuX2RpYWxvZ0RhdGFUb2tlbiA9IE1BVF9ESUFMT0dfREFUQTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnQgVHlwZSBvZiB0aGUgY29tcG9uZW50IHRvIGxvYWQgaW50byB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZGlhbG9nLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+LFxuICApOiBNYXREaWFsb2dSZWY8VCwgUj47XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgbW9kYWwgZGlhbG9nIGNvbnRhaW5pbmcgdGhlIGdpdmVuIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGVSZWYgdG8gaW5zdGFudGlhdGUgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZGlhbG9nLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8VD4sXG4gICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+LFxuICApOiBNYXREaWFsb2dSZWY8VCwgUj47XG5cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICB0ZW1wbGF0ZTogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+IHtcbiAgICBsZXQgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8VCwgUj47XG4gICAgY29uZmlnID0gey4uLih0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTWF0RGlhbG9nQ29uZmlnKCkpLCAuLi5jb25maWd9O1xuICAgIGNvbmZpZy5pZCA9IGNvbmZpZy5pZCB8fCBgbWF0LW1kYy1kaWFsb2ctJHt1bmlxdWVJZCsrfWA7XG4gICAgY29uZmlnLnNjcm9sbFN0cmF0ZWd5ID0gY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCk7XG5cbiAgICBjb25zdCBjZGtSZWYgPSB0aGlzLl9kaWFsb2cub3BlbjxSLCBELCBUPihjb21wb25lbnRPclRlbXBsYXRlUmVmLCB7XG4gICAgICAuLi5jb25maWcsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpLFxuICAgICAgLy8gRGlzYWJsZSBjbG9zaW5nIHNpbmNlIHdlIG5lZWQgdG8gc3luYyBpdCB1cCB0byB0aGUgYW5pbWF0aW9uIG91cnNlbHZlcy5cbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIC8vIERpc2FibGUgY2xvc2luZyBvbiBkZXN0cm95LCBiZWNhdXNlIHRoaXMgc2VydmljZSBjbGVhbnMgdXAgaXRzIG9wZW4gZGlhbG9ncyBhcyB3ZWxsLlxuICAgICAgLy8gV2Ugd2FudCB0byBkbyB0aGUgY2xlYW51cCBoZXJlLCByYXRoZXIgdGhhbiB0aGUgQ0RLIHNlcnZpY2UsIGJlY2F1c2UgdGhlIENESyBkZXN0cm95c1xuICAgICAgLy8gdGhlIGRpYWxvZ3MgaW1tZWRpYXRlbHkgd2hlcmVhcyB3ZSB3YW50IGl0IHRvIHdhaXQgZm9yIHRoZSBhbmltYXRpb25zIHRvIGZpbmlzaC5cbiAgICAgIGNsb3NlT25EZXN0cm95OiBmYWxzZSxcbiAgICAgIC8vIERpc2FibGUgY2xvc2luZyBvbiBkZXRhY2htZW50cyBzbyB0aGF0IHdlIGNhbiBzeW5jIHVwIHRoZSBhbmltYXRpb24uXG4gICAgICAvLyBUaGUgTWF0ZXJpYWwgZGlhbG9nIHJlZiBoYW5kbGVzIHRoaXMgbWFudWFsbHkuXG4gICAgICBjbG9zZU9uT3ZlcmxheURldGFjaG1lbnRzOiBmYWxzZSxcbiAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICB0eXBlOiB0aGlzLl9kaWFsb2dDb250YWluZXJUeXBlLFxuICAgICAgICBwcm92aWRlcnM6ICgpID0+IFtcbiAgICAgICAgICAvLyBQcm92aWRlIG91ciBjb25maWcgYXMgdGhlIENESyBjb25maWcgYXMgd2VsbCBzaW5jZSBpdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlIGFzIHRoZVxuICAgICAgICAgIC8vIENESyBvbmUsIGJ1dCBpdCBjb250YWlucyB0aGUgYWN0dWFsIHZhbHVlcyBwYXNzZWQgaW4gYnkgdGhlIHVzZXIgZm9yIHRoaW5ncyBsaWtlXG4gICAgICAgICAgLy8gYGRpc2FibGVDbG9zZWAgd2hpY2ggd2UgZGlzYWJsZSBmb3IgdGhlIENESyBkaWFsb2cgc2luY2Ugd2UgaGFuZGxlIGl0IG91cnNlbHZlcy5cbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5kaWFsb2dDb25maWdDbGFzcywgdXNlVmFsdWU6IGNvbmZpZ30sXG4gICAgICAgICAge3Byb3ZpZGU6IERpYWxvZ0NvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ30sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVDb250ZXh0OiAoKSA9PiAoe2RpYWxvZ1JlZn0pLFxuICAgICAgcHJvdmlkZXJzOiAocmVmLCBjZGtDb25maWcsIGRpYWxvZ0NvbnRhaW5lcikgPT4ge1xuICAgICAgICBkaWFsb2dSZWYgPSBuZXcgdGhpcy5fZGlhbG9nUmVmQ29uc3RydWN0b3IocmVmLCBjb25maWcsIGRpYWxvZ0NvbnRhaW5lcik7XG4gICAgICAgIGRpYWxvZ1JlZi51cGRhdGVQb3NpdGlvbihjb25maWc/LnBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5fZGlhbG9nQ29udGFpbmVyVHlwZSwgdXNlVmFsdWU6IGRpYWxvZ0NvbnRhaW5lcn0sXG4gICAgICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ0RhdGFUb2tlbiwgdXNlVmFsdWU6IGNka0NvbmZpZy5kYXRhfSxcbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5fZGlhbG9nUmVmQ29uc3RydWN0b3IsIHVzZVZhbHVlOiBkaWFsb2dSZWZ9LFxuICAgICAgICBdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgY2FuJ3QgYmUgYXNzaWduZWQgaW4gdGhlIGBwcm92aWRlcnNgIGNhbGxiYWNrLCBiZWNhdXNlXG4gICAgLy8gdGhlIGluc3RhbmNlIGhhc24ndCBiZWVuIGFzc2lnbmVkIHRvIHRoZSBDREsgcmVmIHlldC5cbiAgICAoZGlhbG9nUmVmISBhcyB7Y29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8VD59KS5jb21wb25lbnRSZWYgPSBjZGtSZWYuY29tcG9uZW50UmVmITtcbiAgICBkaWFsb2dSZWYhLmNvbXBvbmVudEluc3RhbmNlID0gY2RrUmVmLmNvbXBvbmVudEluc3RhbmNlITtcblxuICAgIHRoaXMub3BlbkRpYWxvZ3MucHVzaChkaWFsb2dSZWYhKTtcbiAgICB0aGlzLmFmdGVyT3BlbmVkLm5leHQoZGlhbG9nUmVmISk7XG5cbiAgICBkaWFsb2dSZWYhLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5vcGVuRGlhbG9ncy5pbmRleE9mKGRpYWxvZ1JlZik7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMub3BlbkRpYWxvZ3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKS5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkaWFsb2dSZWYhO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbGwgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gICAqL1xuICBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5vcGVuRGlhbG9ncyk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gb3BlbiBkaWFsb2cgYnkgaXRzIGlkLlxuICAgKiBAcGFyYW0gaWQgSUQgdG8gdXNlIHdoZW4gbG9va2luZyB1cCB0aGUgZGlhbG9nLlxuICAgKi9cbiAgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogTWF0RGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBjbG9zZSB0aGUgZGlhbG9ncyBhdCB0aGlzIGxldmVsIG9uIGRlc3Ryb3lcbiAgICAvLyBzaW5jZSB0aGUgcGFyZW50IHNlcnZpY2UgbWF5IHN0aWxsIGJlIGFjdGl2ZS5cbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbCk7XG4gICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlRGlhbG9ncyhkaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gICAgbGV0IGkgPSBkaWFsb2dzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGRpYWxvZ3NbaV0uY2xvc2UoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==