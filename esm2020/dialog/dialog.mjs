/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { ANIMATION_MODULE_TYPE, Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, Type, } from '@angular/core';
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
export const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-mdc-dialog-scroll-strategy');
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
/** @docs-private */
export const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
// Counter for unique dialog ids.
let uniqueId = 0;
/**
 * Base class for dialog services. The base dialog service allows
 * for arbitrary dialog refs and dialog container components.
 */
export class _MatDialogBase {
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
    constructor(_overlay, injector, _defaultOptions, _parentDialog, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 15.0.0
     */
    _overlayContainer, scrollStrategy, _dialogRefConstructor, _dialogContainerType, _dialogDataToken, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    _animationMode) {
        this._overlay = _overlay;
        this._defaultOptions = _defaultOptions;
        this._parentDialog = _parentDialog;
        this._dialogRefConstructor = _dialogRefConstructor;
        this._dialogContainerType = _dialogContainerType;
        this._dialogDataToken = _dialogDataToken;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new Subject();
        this._afterOpenedAtThisLevel = new Subject();
        this._idPrefix = 'mat-dialog-';
        this.dialogConfigClass = MatDialogConfig;
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(() => this.openDialogs.length
            ? this._getAfterAllClosed()
            : this._getAfterAllClosed().pipe(startWith(undefined)));
        this._scrollStrategy = scrollStrategy;
        this._dialog = injector.get(Dialog);
    }
    open(componentOrTemplateRef, config) {
        let dialogRef;
        config = { ...(this._defaultOptions || new MatDialogConfig()), ...config };
        config.id = config.id || `${this._idPrefix}${uniqueId++}`;
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
}
_MatDialogBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: _MatDialogBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
_MatDialogBase.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: _MatDialogBase });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: _MatDialogBase, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: undefined }, { type: undefined }, { type: i1.OverlayContainer }, { type: undefined }, { type: i0.Type }, { type: i0.Type }, { type: i0.InjectionToken }, { type: undefined }]; } });
/**
 * Service to open Material Design modal dialogs.
 */
export class MatDialog extends _MatDialogBase {
    constructor(overlay, injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    location, defaultOptions, scrollStrategy, parentDialog, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 15.0.0
     */
    overlayContainer, 
    /**
     * @deprecated No longer used. To be removed.
     * @breaking-change 14.0.0
     */
    animationMode) {
        super(overlay, injector, defaultOptions, parentDialog, overlayContainer, scrollStrategy, MatDialogRef, MatDialogContainer, MAT_DIALOG_DATA, animationMode);
        this._idPrefix = 'mat-mdc-dialog-';
    }
}
MatDialog.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_DIALOG_SCROLL_STRATEGY }, { token: MatDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatDialog.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatDialog });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatDialog, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
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
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixPQUFPLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEVBRVIsSUFBSSxHQUNMLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQTBCLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFFekMsMEZBQTBGO0FBQzFGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBTSxrQkFBa0IsQ0FBQyxDQUFDO0FBRTNFLDBFQUEwRTtBQUMxRSxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLGNBQWMsQ0FDMUQsZ0NBQWdDLENBQ2pDLENBQUM7QUFFRixvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxjQUFjLENBQzFELGdDQUFnQyxDQUNqQyxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0s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QyxDQUFDOztzR0F2Q1UsU0FBUyx5R0FTRSwwQkFBMEIsNkJBQ3RDLDBCQUEwQixtR0FZMUIscUJBQXFCOzBHQXRCcEIsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixVQUFVOzswQkFTTixRQUFROzswQkFDUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLDBCQUEwQjs7MEJBQzdDLE1BQU07MkJBQUMsMEJBQTBCOzswQkFDakMsUUFBUTs7MEJBQUksUUFBUTs7MEJBVXBCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50VHlwZSwgT3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFR5cGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge19NYXREaWFsb2dDb250YWluZXJCYXNlLCBNYXREaWFsb2dDb250YWluZXJ9IGZyb20gJy4vZGlhbG9nLWNvbnRhaW5lcic7XG5pbXBvcnQge01hdERpYWxvZ1JlZn0gZnJvbSAnLi9kaWFsb2ctcmVmJztcbmltcG9ydCB7ZGVmZXIsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtEaWFsb2csIERpYWxvZ0NvbmZpZ30gZnJvbSAnQGFuZ3VsYXIvY2RrL2RpYWxvZyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIHRoZSBkYXRhIHRoYXQgd2FzIHBhc3NlZCBpbiB0byBhIGRpYWxvZy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RBVEEgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignTWF0TWRjRGlhbG9nRGF0YScpO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGRpYWxvZyBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdERpYWxvZ0NvbmZpZz4oXG4gICdtYXQtbWRjLWRpYWxvZy1kZWZhdWx0LW9wdGlvbnMnLFxuKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgZGlhbG9nIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LW1kYy1kaWFsb2ctc2Nyb2xsLXN0cmF0ZWd5Jyxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWShcbiAgb3ZlcmxheTogT3ZlcmxheSxcbik6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLy8gQ291bnRlciBmb3IgdW5pcXVlIGRpYWxvZyBpZHMuXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGRpYWxvZyBzZXJ2aWNlcy4gVGhlIGJhc2UgZGlhbG9nIHNlcnZpY2UgYWxsb3dzXG4gKiBmb3IgYXJiaXRyYXJ5IGRpYWxvZyByZWZzIGFuZCBkaWFsb2cgY29udGFpbmVyIGNvbXBvbmVudHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0RGlhbG9nQmFzZTxDIGV4dGVuZHMgX01hdERpYWxvZ0NvbnRhaW5lckJhc2U+IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbDogTWF0RGlhbG9nUmVmPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PE1hdERpYWxvZ1JlZjxhbnk+PigpO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByb3RlY3RlZCBfaWRQcmVmaXggPSAnbWF0LWRpYWxvZy0nO1xuICBwcml2YXRlIF9kaWFsb2c6IERpYWxvZztcbiAgcHJvdGVjdGVkIGRpYWxvZ0NvbmZpZ0NsYXNzID0gTWF0RGlhbG9nQ29uZmlnO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QWZ0ZXJBbGxDbG9zZWQoKTogU3ViamVjdDx2b2lkPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50RGlhbG9nO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX2dldEFmdGVyQWxsQ2xvc2VkKCkgOiB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYWxsIG9wZW4gZGlhbG9nIGhhdmUgZmluaXNoZWQgY2xvc2luZy5cbiAgICogV2lsbCBlbWl0IG9uIHN1YnNjcmliZSBpZiB0aGVyZSBhcmUgbm8gb3BlbiBkaWFsb2dzIHRvIGJlZ2luIHdpdGguXG4gICAqL1xuICByZWFkb25seSBhZnRlckFsbENsb3NlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IGRlZmVyKCgpID0+XG4gICAgdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGhcbiAgICAgID8gdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKVxuICAgICAgOiB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpLnBpcGUoc3RhcnRXaXRoKHVuZGVmaW5lZCkpLFxuICApIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgX3BhcmVudERpYWxvZzogX01hdERpYWxvZ0Jhc2U8Qz4gfCB1bmRlZmluZWQsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICAgKi9cbiAgICBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIHByaXZhdGUgX2RpYWxvZ1JlZkNvbnN0cnVjdG9yOiBUeXBlPE1hdERpYWxvZ1JlZjxhbnk+PixcbiAgICBwcml2YXRlIF9kaWFsb2dDb250YWluZXJUeXBlOiBUeXBlPEM+LFxuICAgIHByaXZhdGUgX2RpYWxvZ0RhdGFUb2tlbjogSW5qZWN0aW9uVG9rZW48YW55PixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIF9hbmltYXRpb25Nb2RlPzogJ05vb3BBbmltYXRpb25zJyB8ICdCcm93c2VyQW5pbWF0aW9ucycsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gICAgdGhpcy5fZGlhbG9nID0gaW5qZWN0b3IuZ2V0KERpYWxvZyk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBtb2RhbCBkaWFsb2cgY29udGFpbmluZyB0aGUgZ2l2ZW4gY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG4gICAgbGV0IGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPFQsIFI+O1xuICAgIGNvbmZpZyA9IHsuLi4odGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdERpYWxvZ0NvbmZpZygpKSwgLi4uY29uZmlnfTtcbiAgICBjb25maWcuaWQgPSBjb25maWcuaWQgfHwgYCR7dGhpcy5faWRQcmVmaXh9JHt1bmlxdWVJZCsrfWA7XG4gICAgY29uZmlnLnNjcm9sbFN0cmF0ZWd5ID0gY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCk7XG5cbiAgICBjb25zdCBjZGtSZWYgPSB0aGlzLl9kaWFsb2cub3BlbjxSLCBELCBUPihjb21wb25lbnRPclRlbXBsYXRlUmVmLCB7XG4gICAgICAuLi5jb25maWcsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpLFxuICAgICAgLy8gRGlzYWJsZSBjbG9zaW5nIHNpbmNlIHdlIG5lZWQgdG8gc3luYyBpdCB1cCB0byB0aGUgYW5pbWF0aW9uIG91cnNlbHZlcy5cbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIC8vIERpc2FibGUgY2xvc2luZyBvbiBkZXN0cm95LCBiZWNhdXNlIHRoaXMgc2VydmljZSBjbGVhbnMgdXAgaXRzIG9wZW4gZGlhbG9ncyBhcyB3ZWxsLlxuICAgICAgLy8gV2Ugd2FudCB0byBkbyB0aGUgY2xlYW51cCBoZXJlLCByYXRoZXIgdGhhbiB0aGUgQ0RLIHNlcnZpY2UsIGJlY2F1c2UgdGhlIENESyBkZXN0cm95c1xuICAgICAgLy8gdGhlIGRpYWxvZ3MgaW1tZWRpYXRlbHkgd2hlcmVhcyB3ZSB3YW50IGl0IHRvIHdhaXQgZm9yIHRoZSBhbmltYXRpb25zIHRvIGZpbmlzaC5cbiAgICAgIGNsb3NlT25EZXN0cm95OiBmYWxzZSxcbiAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICB0eXBlOiB0aGlzLl9kaWFsb2dDb250YWluZXJUeXBlLFxuICAgICAgICBwcm92aWRlcnM6ICgpID0+IFtcbiAgICAgICAgICAvLyBQcm92aWRlIG91ciBjb25maWcgYXMgdGhlIENESyBjb25maWcgYXMgd2VsbCBzaW5jZSBpdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlIGFzIHRoZVxuICAgICAgICAgIC8vIENESyBvbmUsIGJ1dCBpdCBjb250YWlucyB0aGUgYWN0dWFsIHZhbHVlcyBwYXNzZWQgaW4gYnkgdGhlIHVzZXIgZm9yIHRoaW5ncyBsaWtlXG4gICAgICAgICAgLy8gYGRpc2FibGVDbG9zZWAgd2hpY2ggd2UgZGlzYWJsZSBmb3IgdGhlIENESyBkaWFsb2cgc2luY2Ugd2UgaGFuZGxlIGl0IG91cnNlbHZlcy5cbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5kaWFsb2dDb25maWdDbGFzcywgdXNlVmFsdWU6IGNvbmZpZ30sXG4gICAgICAgICAge3Byb3ZpZGU6IERpYWxvZ0NvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ30sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVDb250ZXh0OiAoKSA9PiAoe2RpYWxvZ1JlZn0pLFxuICAgICAgcHJvdmlkZXJzOiAocmVmLCBjZGtDb25maWcsIGRpYWxvZ0NvbnRhaW5lcikgPT4ge1xuICAgICAgICBkaWFsb2dSZWYgPSBuZXcgdGhpcy5fZGlhbG9nUmVmQ29uc3RydWN0b3IocmVmLCBjb25maWcsIGRpYWxvZ0NvbnRhaW5lcik7XG4gICAgICAgIGRpYWxvZ1JlZi51cGRhdGVQb3NpdGlvbihjb25maWc/LnBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5fZGlhbG9nQ29udGFpbmVyVHlwZSwgdXNlVmFsdWU6IGRpYWxvZ0NvbnRhaW5lcn0sXG4gICAgICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ0RhdGFUb2tlbiwgdXNlVmFsdWU6IGNka0NvbmZpZy5kYXRhfSxcbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5fZGlhbG9nUmVmQ29uc3RydWN0b3IsIHVzZVZhbHVlOiBkaWFsb2dSZWZ9LFxuICAgICAgICBdO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRoaXMgY2FuJ3QgYmUgYXNzaWduZWQgaW4gdGhlIGBwcm92aWRlcnNgIGNhbGxiYWNrLCBiZWNhdXNlXG4gICAgLy8gdGhlIGluc3RhbmNlIGhhc24ndCBiZWVuIGFzc2lnbmVkIHRvIHRoZSBDREsgcmVmIHlldC5cbiAgICBkaWFsb2dSZWYhLmNvbXBvbmVudEluc3RhbmNlID0gY2RrUmVmLmNvbXBvbmVudEluc3RhbmNlITtcblxuICAgIHRoaXMub3BlbkRpYWxvZ3MucHVzaChkaWFsb2dSZWYhKTtcbiAgICB0aGlzLmFmdGVyT3BlbmVkLm5leHQoZGlhbG9nUmVmISk7XG5cbiAgICBkaWFsb2dSZWYhLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5vcGVuRGlhbG9ncy5pbmRleE9mKGRpYWxvZ1JlZik7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMub3BlbkRpYWxvZ3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKS5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkaWFsb2dSZWYhO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbGwgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gICAqL1xuICBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5vcGVuRGlhbG9ncyk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gb3BlbiBkaWFsb2cgYnkgaXRzIGlkLlxuICAgKiBAcGFyYW0gaWQgSUQgdG8gdXNlIHdoZW4gbG9va2luZyB1cCB0aGUgZGlhbG9nLlxuICAgKi9cbiAgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogTWF0RGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBjbG9zZSB0aGUgZGlhbG9ncyBhdCB0aGlzIGxldmVsIG9uIGRlc3Ryb3lcbiAgICAvLyBzaW5jZSB0aGUgcGFyZW50IHNlcnZpY2UgbWF5IHN0aWxsIGJlIGFjdGl2ZS5cbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbCk7XG4gICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlRGlhbG9ncyhkaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gICAgbGV0IGkgPSBkaWFsb2dzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGRpYWxvZ3NbaV0uY2xvc2UoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2cgZXh0ZW5kcyBfTWF0RGlhbG9nQmFzZTxNYXREaWFsb2dDb250YWluZXI+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9sb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBASW5qZWN0KE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudERpYWxvZzogTWF0RGlhbG9nLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wXG4gICAgICovXG4gICAgb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpXG4gICAgYW5pbWF0aW9uTW9kZT86ICdOb29wQW5pbWF0aW9ucycgfCAnQnJvd3NlckFuaW1hdGlvbnMnLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIG92ZXJsYXksXG4gICAgICBpbmplY3RvcixcbiAgICAgIGRlZmF1bHRPcHRpb25zLFxuICAgICAgcGFyZW50RGlhbG9nLFxuICAgICAgb3ZlcmxheUNvbnRhaW5lcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5LFxuICAgICAgTWF0RGlhbG9nUmVmLFxuICAgICAgTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgICAgTUFUX0RJQUxPR19EQVRBLFxuICAgICAgYW5pbWF0aW9uTW9kZSxcbiAgICApO1xuXG4gICAgdGhpcy5faWRQcmVmaXggPSAnbWF0LW1kYy1kaWFsb2ctJztcbiAgfVxufVxuIl19