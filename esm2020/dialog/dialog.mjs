/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, Type, } from '@angular/core';
import { defer, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatDialogConfig } from './dialog-config';
import { MatDialogContainer } from './dialog-container';
import { MatDialogRef } from './dialog-ref';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
import * as i3 from "./dialog-config";
/** Injection token that can be used to access the data that was passed in to a dialog. */
export const MAT_DIALOG_DATA = new InjectionToken('MatDialogData');
/** Injection token that can be used to specify default dialog options. */
export const MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
export const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.block();
}
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
// Counter for unique dialog ids.
let uniqueId = 0;
/**
 * Base class for dialog services. The base dialog service allows
 * for arbitrary dialog refs and dialog container components.
 */
export class _MatDialogBase {
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
                    { provide: MatDialogConfig, useValue: config },
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
_MatDialogBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatDialogBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
_MatDialogBase.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatDialogBase });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatDialogBase, decorators: [{
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
    _location, defaultOptions, scrollStrategy, parentDialog, 
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
    }
}
MatDialog.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_DIALOG_SCROLL_STRATEGY }, { token: MatDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatDialog.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatDialog });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatDialog, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBaUIsTUFBTSxzQkFBc0IsQ0FBQztBQUUvRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFFBQVEsRUFFUixRQUFRLEVBQ1IsUUFBUSxFQUVSLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBMEIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBRXpELDBGQUEwRjtBQUMxRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFeEUsMEVBQTBFO0FBQzFFLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLElBQUksY0FBYyxDQUMxRCw0QkFBNEIsQ0FDN0IsQ0FBQztBQUVGLG9GQUFvRjtBQUNwRixNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLGNBQWMsQ0FDMUQsNEJBQTRCLENBQzdC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YUFDSSxTQUFTLDZFQVd2QyxxQkFBcUI7MEdBdEJwQixTQUFTOzJGQUFULFNBQVM7a0JBRHJCLFVBQVU7OzBCQVNOLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsMEJBQTBCOzswQkFDN0MsTUFBTTsyQkFBQywwQkFBMEI7OEJBQ0ksU0FBUzswQkFBOUMsUUFBUTs7MEJBQUksUUFBUTs7MEJBVXBCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50VHlwZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVHlwZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2RlZmVyLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyLCBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZX0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7TWF0RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0RpYWxvZywgRGlhbG9nQ29uZmlnfSBmcm9tICdAYW5ndWxhci9jZGsvZGlhbG9nJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREaWFsb2dDb25maWc+KFxuICAnbWF0LWRpYWxvZy1kZWZhdWx0LW9wdGlvbnMnLFxuKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgZGlhbG9nIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LWRpYWxvZy1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBvdmVybGF5OiBPdmVybGF5LFxuKTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZGlhbG9nIGlkcy5cbmxldCB1bmlxdWVJZCA9IDA7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgZGlhbG9nIHNlcnZpY2VzLiBUaGUgYmFzZSBkaWFsb2cgc2VydmljZSBhbGxvd3NcbiAqIGZvciBhcmJpdHJhcnkgZGlhbG9nIHJlZnMgYW5kIGRpYWxvZyBjb250YWluZXIgY29tcG9uZW50cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXREaWFsb2dCYXNlPEMgZXh0ZW5kcyBfTWF0RGlhbG9nQ29udGFpbmVyQmFzZT4gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcGVuRGlhbG9nc0F0VGhpc0xldmVsOiBNYXREaWFsb2dSZWY8YW55PltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+KCk7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJvdGVjdGVkIF9pZFByZWZpeCA9ICdtYXQtZGlhbG9nLSc7XG4gIHByaXZhdGUgX2RpYWxvZzogRGlhbG9nO1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0QWZ0ZXJBbGxDbG9zZWQoKTogU3ViamVjdDx2b2lkPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50RGlhbG9nO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX2dldEFmdGVyQWxsQ2xvc2VkKCkgOiB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYWxsIG9wZW4gZGlhbG9nIGhhdmUgZmluaXNoZWQgY2xvc2luZy5cbiAgICogV2lsbCBlbWl0IG9uIHN1YnNjcmliZSBpZiB0aGVyZSBhcmUgbm8gb3BlbiBkaWFsb2dzIHRvIGJlZ2luIHdpdGguXG4gICAqL1xuICByZWFkb25seSBhZnRlckFsbENsb3NlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IGRlZmVyKCgpID0+XG4gICAgdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGhcbiAgICAgID8gdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKVxuICAgICAgOiB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpLnBpcGUoc3RhcnRXaXRoKHVuZGVmaW5lZCkpLFxuICApIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnIHwgdW5kZWZpbmVkLFxuICAgIHByaXZhdGUgX3BhcmVudERpYWxvZzogX01hdERpYWxvZ0Jhc2U8Qz4gfCB1bmRlZmluZWQsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICAgKi9cbiAgICBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIHByaXZhdGUgX2RpYWxvZ1JlZkNvbnN0cnVjdG9yOiBUeXBlPE1hdERpYWxvZ1JlZjxhbnk+PixcbiAgICBwcml2YXRlIF9kaWFsb2dDb250YWluZXJUeXBlOiBUeXBlPEM+LFxuICAgIHByaXZhdGUgX2RpYWxvZ0RhdGFUb2tlbjogSW5qZWN0aW9uVG9rZW48YW55PixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIF9hbmltYXRpb25Nb2RlPzogJ05vb3BBbmltYXRpb25zJyB8ICdCcm93c2VyQW5pbWF0aW9ucycsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gICAgdGhpcy5fZGlhbG9nID0gaW5qZWN0b3IuZ2V0KERpYWxvZyk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBtb2RhbCBkaWFsb2cgY29udGFpbmluZyB0aGUgZ2l2ZW4gY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG4gICAgbGV0IGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPFQsIFI+O1xuICAgIGNvbmZpZyA9IHsuLi4odGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdERpYWxvZ0NvbmZpZygpKSwgLi4uY29uZmlnfTtcbiAgICBjb25maWcuaWQgPSBjb25maWcuaWQgfHwgYCR7dGhpcy5faWRQcmVmaXh9JHt1bmlxdWVJZCsrfWA7XG4gICAgY29uZmlnLnNjcm9sbFN0cmF0ZWd5ID0gY29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCk7XG5cbiAgICBjb25zdCBjZGtSZWYgPSB0aGlzLl9kaWFsb2cub3BlbjxSLCBELCBUPihjb21wb25lbnRPclRlbXBsYXRlUmVmLCB7XG4gICAgICAuLi5jb25maWcsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpLFxuICAgICAgLy8gRGlzYWJsZSBjbG9zaW5nIHNpbmNlIHdlIG5lZWQgdG8gc3luYyBpdCB1cCB0byB0aGUgYW5pbWF0aW9uIG91cnNlbHZlcy5cbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIC8vIERpc2FibGUgY2xvc2luZyBvbiBkZXN0cm95LCBiZWNhdXNlIHRoaXMgc2VydmljZSBjbGVhbnMgdXAgaXRzIG9wZW4gZGlhbG9ncyBhcyB3ZWxsLlxuICAgICAgLy8gV2Ugd2FudCB0byBkbyB0aGUgY2xlYW51cCBoZXJlLCByYXRoZXIgdGhhbiB0aGUgQ0RLIHNlcnZpY2UsIGJlY2F1c2UgdGhlIENESyBkZXN0cm95c1xuICAgICAgLy8gdGhlIGRpYWxvZ3MgaW1tZWRpYXRlbHkgd2hlcmVhcyB3ZSB3YW50IGl0IHRvIHdhaXQgZm9yIHRoZSBhbmltYXRpb25zIHRvIGZpbmlzaC5cbiAgICAgIGNsb3NlT25EZXN0cm95OiBmYWxzZSxcbiAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICB0eXBlOiB0aGlzLl9kaWFsb2dDb250YWluZXJUeXBlLFxuICAgICAgICBwcm92aWRlcnM6ICgpID0+IFtcbiAgICAgICAgICAvLyBQcm92aWRlIG91ciBjb25maWcgYXMgdGhlIENESyBjb25maWcgYXMgd2VsbCBzaW5jZSBpdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlIGFzIHRoZVxuICAgICAgICAgIC8vIENESyBvbmUsIGJ1dCBpdCBjb250YWlucyB0aGUgYWN0dWFsIHZhbHVlcyBwYXNzZWQgaW4gYnkgdGhlIHVzZXIgZm9yIHRoaW5ncyBsaWtlXG4gICAgICAgICAgLy8gYGRpc2FibGVDbG9zZWAgd2hpY2ggd2UgZGlzYWJsZSBmb3IgdGhlIENESyBkaWFsb2cgc2luY2Ugd2UgaGFuZGxlIGl0IG91cnNlbHZlcy5cbiAgICAgICAgICB7cHJvdmlkZTogTWF0RGlhbG9nQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnfSxcbiAgICAgICAgICB7cHJvdmlkZTogRGlhbG9nQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZUNvbnRleHQ6ICgpID0+ICh7ZGlhbG9nUmVmfSksXG4gICAgICBwcm92aWRlcnM6IChyZWYsIGNka0NvbmZpZywgZGlhbG9nQ29udGFpbmVyKSA9PiB7XG4gICAgICAgIGRpYWxvZ1JlZiA9IG5ldyB0aGlzLl9kaWFsb2dSZWZDb25zdHJ1Y3RvcihyZWYsIGNvbmZpZywgZGlhbG9nQ29udGFpbmVyKTtcbiAgICAgICAgZGlhbG9nUmVmLnVwZGF0ZVBvc2l0aW9uKGNvbmZpZz8ucG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtwcm92aWRlOiB0aGlzLl9kaWFsb2dDb250YWluZXJUeXBlLCB1c2VWYWx1ZTogZGlhbG9nQ29udGFpbmVyfSxcbiAgICAgICAgICB7cHJvdmlkZTogdGhpcy5fZGlhbG9nRGF0YVRva2VuLCB1c2VWYWx1ZTogY2RrQ29uZmlnLmRhdGF9LFxuICAgICAgICAgIHtwcm92aWRlOiB0aGlzLl9kaWFsb2dSZWZDb25zdHJ1Y3RvciwgdXNlVmFsdWU6IGRpYWxvZ1JlZn0sXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBjYW4ndCBiZSBhc3NpZ25lZCBpbiB0aGUgYHByb3ZpZGVyc2AgY2FsbGJhY2ssIGJlY2F1c2VcbiAgICAvLyB0aGUgaW5zdGFuY2UgaGFzbid0IGJlZW4gYXNzaWduZWQgdG8gdGhlIENESyByZWYgeWV0LlxuICAgIGRpYWxvZ1JlZiEuY29tcG9uZW50SW5zdGFuY2UgPSBjZGtSZWYuY29tcG9uZW50SW5zdGFuY2UhO1xuXG4gICAgdGhpcy5vcGVuRGlhbG9ncy5wdXNoKGRpYWxvZ1JlZiEpO1xuICAgIHRoaXMuYWZ0ZXJPcGVuZWQubmV4dChkaWFsb2dSZWYhKTtcblxuICAgIGRpYWxvZ1JlZiEuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm9wZW5EaWFsb2dzLmluZGV4T2YoZGlhbG9nUmVmKTtcblxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5vcGVuRGlhbG9ncy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIGlmICghdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRpYWxvZ1JlZiE7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIGFsbCBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy5cbiAgICovXG4gIGNsb3NlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuX2Nsb3NlRGlhbG9ncyh0aGlzLm9wZW5EaWFsb2dzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbiBvcGVuIGRpYWxvZyBieSBpdHMgaWQuXG4gICAqIEBwYXJhbSBpZCBJRCB0byB1c2Ugd2hlbiBsb29raW5nIHVwIHRoZSBkaWFsb2cuXG4gICAqL1xuICBnZXREaWFsb2dCeUlkKGlkOiBzdHJpbmcpOiBNYXREaWFsb2dSZWY8YW55PiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMub3BlbkRpYWxvZ3MuZmluZChkaWFsb2cgPT4gZGlhbG9nLmlkID09PSBpZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBPbmx5IGNsb3NlIHRoZSBkaWFsb2dzIGF0IHRoaXMgbGV2ZWwgb24gZGVzdHJveVxuICAgIC8vIHNpbmNlIHRoZSBwYXJlbnQgc2VydmljZSBtYXkgc3RpbGwgYmUgYWN0aXZlLlxuICAgIHRoaXMuX2Nsb3NlRGlhbG9ncyh0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsKTtcbiAgICB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xvc2VEaWFsb2dzKGRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgICBsZXQgaSA9IGRpYWxvZ3MubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZGlhbG9nc1tpXS5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNlcnZpY2UgdG8gb3BlbiBNYXRlcmlhbCBEZXNpZ24gbW9kYWwgZGlhbG9ncy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZyBleHRlbmRzIF9NYXREaWFsb2dCYXNlPE1hdERpYWxvZ0NvbnRhaW5lcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2xvY2F0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIF9sb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBASW5qZWN0KE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudERpYWxvZzogTWF0RGlhbG9nLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wXG4gICAgICovXG4gICAgb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpXG4gICAgYW5pbWF0aW9uTW9kZT86ICdOb29wQW5pbWF0aW9ucycgfCAnQnJvd3NlckFuaW1hdGlvbnMnLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIG92ZXJsYXksXG4gICAgICBpbmplY3RvcixcbiAgICAgIGRlZmF1bHRPcHRpb25zLFxuICAgICAgcGFyZW50RGlhbG9nLFxuICAgICAgb3ZlcmxheUNvbnRhaW5lcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5LFxuICAgICAgTWF0RGlhbG9nUmVmLFxuICAgICAgTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgICAgTUFUX0RJQUxPR19EQVRBLFxuICAgICAgYW5pbWF0aW9uTW9kZSxcbiAgICApO1xuICB9XG59XG4iXX0=