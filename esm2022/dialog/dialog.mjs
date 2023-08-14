/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { ANIMATION_MODULE_TYPE, Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, } from '@angular/core';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatDialog, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: MAT_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: MAT_DIALOG_SCROLL_STRATEGY }, { token: MatDialog, optional: true, skipSelf: true }, { token: i1.OverlayContainer }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatDialog }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatDialog, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixPQUFPLEVBQUUsZ0JBQWdCLEVBQWlCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFFckIsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEdBR1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBRXpDLDBGQUEwRjtBQUMxRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQU0sa0JBQWtCLENBQUMsQ0FBQztBQUUzRSwwRUFBMEU7QUFDMUUsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxjQUFjLENBQzFELGdDQUFnQyxDQUNqQyxDQUFDO0FBRUYsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLElBQUksY0FBYyxDQUMxRCxnQ0FBZ0MsQ0FDakMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsMkNBQTJD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QUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsV0FBVztRQUNULGtEQUFrRDtRQUNsRCxnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFTyxhQUFhLENBQUMsT0FBNEI7UUFDaEQsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUV2QixPQUFPLENBQUMsRUFBRSxFQUFFO1lBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs4R0E3TFUsU0FBUyx5R0E0Q0UsMEJBQTBCLDZCQUN0QywwQkFBMEIsbUdBWTFCLHFCQUFxQjtrSEF6RHBCLFNBQVM7OzJGQUFULFNBQVM7a0JBRHJCLFVBQVU7OzBCQTRDTixRQUFROzswQkFDUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLDBCQUEwQjs7MEJBQzdDLE1BQU07MkJBQUMsMEJBQTBCOzswQkFDakMsUUFBUTs7MEJBQUksUUFBUTs7MEJBVXBCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50VHlwZSwgT3ZlcmxheSwgT3ZlcmxheUNvbnRhaW5lciwgU2Nyb2xsU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIENvbXBvbmVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVHlwZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IHtNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5pbXBvcnQge2RlZmVyLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7RGlhbG9nLCBEaWFsb2dDb25maWd9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kaWFsb2cnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdE1kY0RpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREaWFsb2dDb25maWc+KFxuICAnbWF0LW1kYy1kaWFsb2ctZGVmYXVsdC1vcHRpb25zJyxcbik7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ21hdC1tZGMtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScsXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkoXG4gIG92ZXJsYXk6IE92ZXJsYXksXG4pOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBkaWFsb2cgaWRzLlxubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2cgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcGVuRGlhbG9nc0F0VGhpc0xldmVsOiBNYXREaWFsb2dSZWY8YW55PltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+KCk7XG4gIHByaXZhdGUgX2RpYWxvZzogRGlhbG9nO1xuICBwcm90ZWN0ZWQgZGlhbG9nQ29uZmlnQ2xhc3MgPSBNYXREaWFsb2dDb25maWc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGlhbG9nUmVmQ29uc3RydWN0b3I6IFR5cGU8TWF0RGlhbG9nUmVmPGFueT4+O1xuICBwcml2YXRlIHJlYWRvbmx5IF9kaWFsb2dDb250YWluZXJUeXBlOiBUeXBlPE1hdERpYWxvZ0NvbnRhaW5lcj47XG4gIHByaXZhdGUgcmVhZG9ubHkgX2RpYWxvZ0RhdGFUb2tlbjogSW5qZWN0aW9uVG9rZW48YW55PjtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuICovXG4gIGdldCBvcGVuRGlhbG9ncygpOiBNYXREaWFsb2dSZWY8YW55PltdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLm9wZW5EaWFsb2dzIDogdGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgZGlhbG9nIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgZ2V0IGFmdGVyT3BlbmVkKCk6IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLmFmdGVyT3BlbmVkIDogdGhpcy5fYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFmdGVyQWxsQ2xvc2VkKCk6IFN1YmplY3Q8dm9pZD4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudERpYWxvZztcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9nZXRBZnRlckFsbENsb3NlZCgpIDogdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGFsbCBvcGVuIGRpYWxvZyBoYXZlIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqIFdpbGwgZW1pdCBvbiBzdWJzY3JpYmUgaWYgdGhlcmUgYXJlIG5vIG9wZW4gZGlhbG9ncyB0byBiZWdpbiB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxDbG9zZWQ6IE9ic2VydmFibGU8dm9pZD4gPSBkZWZlcigoKSA9PlxuICAgIHRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoXG4gICAgICA/IHRoaXMuX2dldEFmdGVyQWxsQ2xvc2VkKClcbiAgICAgIDogdGhpcy5fZ2V0QWZ0ZXJBbGxDbG9zZWQoKS5waXBlKHN0YXJ0V2l0aCh1bmRlZmluZWQpKSxcbiAgKSBhcyBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9sb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBsb2NhdGlvbjogTG9jYXRpb24sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICBASW5qZWN0KE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZKSBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudERpYWxvZzogTWF0RGlhbG9nLFxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wXG4gICAgICovXG4gICAgX292ZXJsYXlDb250YWluZXI6IE92ZXJsYXlDb250YWluZXIsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKVxuICAgIF9hbmltYXRpb25Nb2RlPzogJ05vb3BBbmltYXRpb25zJyB8ICdCcm93c2VyQW5pbWF0aW9ucycsXG4gICkge1xuICAgIHRoaXMuX2RpYWxvZyA9IGluamVjdG9yLmdldChEaWFsb2cpO1xuXG4gICAgdGhpcy5fZGlhbG9nUmVmQ29uc3RydWN0b3IgPSBNYXREaWFsb2dSZWY7XG4gICAgdGhpcy5fZGlhbG9nQ29udGFpbmVyVHlwZSA9IE1hdERpYWxvZ0NvbnRhaW5lcjtcbiAgICB0aGlzLl9kaWFsb2dEYXRhVG9rZW4gPSBNQVRfRElBTE9HX0RBVEE7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBtb2RhbCBkaWFsb2cgY29udGFpbmluZyB0aGUgZ2l2ZW4gY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPixcbiAgKTogTWF0RGlhbG9nUmVmPFQsIFI+O1xuXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPjtcblxuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4sXG4gICk6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG4gICAgbGV0IGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPFQsIFI+O1xuICAgIGNvbmZpZyA9IHsuLi4odGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdERpYWxvZ0NvbmZpZygpKSwgLi4uY29uZmlnfTtcbiAgICBjb25maWcuaWQgPSBjb25maWcuaWQgfHwgYG1hdC1tZGMtZGlhbG9nLSR7dW5pcXVlSWQrK31gO1xuICAgIGNvbmZpZy5zY3JvbGxTdHJhdGVneSA9IGNvbmZpZy5zY3JvbGxTdHJhdGVneSB8fCB0aGlzLl9zY3JvbGxTdHJhdGVneSgpO1xuXG4gICAgY29uc3QgY2RrUmVmID0gdGhpcy5fZGlhbG9nLm9wZW48UiwgRCwgVD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwge1xuICAgICAgLi4uY29uZmlnLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmNlbnRlclZlcnRpY2FsbHkoKSxcbiAgICAgIC8vIERpc2FibGUgY2xvc2luZyBzaW5jZSB3ZSBuZWVkIHRvIHN5bmMgaXQgdXAgdG8gdGhlIGFuaW1hdGlvbiBvdXJzZWx2ZXMuXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICAvLyBEaXNhYmxlIGNsb3Npbmcgb24gZGVzdHJveSwgYmVjYXVzZSB0aGlzIHNlcnZpY2UgY2xlYW5zIHVwIGl0cyBvcGVuIGRpYWxvZ3MgYXMgd2VsbC5cbiAgICAgIC8vIFdlIHdhbnQgdG8gZG8gdGhlIGNsZWFudXAgaGVyZSwgcmF0aGVyIHRoYW4gdGhlIENESyBzZXJ2aWNlLCBiZWNhdXNlIHRoZSBDREsgZGVzdHJveXNcbiAgICAgIC8vIHRoZSBkaWFsb2dzIGltbWVkaWF0ZWx5IHdoZXJlYXMgd2Ugd2FudCBpdCB0byB3YWl0IGZvciB0aGUgYW5pbWF0aW9ucyB0byBmaW5pc2guXG4gICAgICBjbG9zZU9uRGVzdHJveTogZmFsc2UsXG4gICAgICAvLyBEaXNhYmxlIGNsb3Npbmcgb24gZGV0YWNobWVudHMgc28gdGhhdCB3ZSBjYW4gc3luYyB1cCB0aGUgYW5pbWF0aW9uLlxuICAgICAgLy8gVGhlIE1hdGVyaWFsIGRpYWxvZyByZWYgaGFuZGxlcyB0aGlzIG1hbnVhbGx5LlxuICAgICAgY2xvc2VPbk92ZXJsYXlEZXRhY2htZW50czogZmFsc2UsXG4gICAgICBjb250YWluZXI6IHtcbiAgICAgICAgdHlwZTogdGhpcy5fZGlhbG9nQ29udGFpbmVyVHlwZSxcbiAgICAgICAgcHJvdmlkZXJzOiAoKSA9PiBbXG4gICAgICAgICAgLy8gUHJvdmlkZSBvdXIgY29uZmlnIGFzIHRoZSBDREsgY29uZmlnIGFzIHdlbGwgc2luY2UgaXQgaGFzIHRoZSBzYW1lIGludGVyZmFjZSBhcyB0aGVcbiAgICAgICAgICAvLyBDREsgb25lLCBidXQgaXQgY29udGFpbnMgdGhlIGFjdHVhbCB2YWx1ZXMgcGFzc2VkIGluIGJ5IHRoZSB1c2VyIGZvciB0aGluZ3MgbGlrZVxuICAgICAgICAgIC8vIGBkaXNhYmxlQ2xvc2VgIHdoaWNoIHdlIGRpc2FibGUgZm9yIHRoZSBDREsgZGlhbG9nIHNpbmNlIHdlIGhhbmRsZSBpdCBvdXJzZWx2ZXMuXG4gICAgICAgICAge3Byb3ZpZGU6IHRoaXMuZGlhbG9nQ29uZmlnQ2xhc3MsIHVzZVZhbHVlOiBjb25maWd9LFxuICAgICAgICAgIHtwcm92aWRlOiBEaWFsb2dDb25maWcsIHVzZVZhbHVlOiBjb25maWd9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlQ29udGV4dDogKCkgPT4gKHtkaWFsb2dSZWZ9KSxcbiAgICAgIHByb3ZpZGVyczogKHJlZiwgY2RrQ29uZmlnLCBkaWFsb2dDb250YWluZXIpID0+IHtcbiAgICAgICAgZGlhbG9nUmVmID0gbmV3IHRoaXMuX2RpYWxvZ1JlZkNvbnN0cnVjdG9yKHJlZiwgY29uZmlnLCBkaWFsb2dDb250YWluZXIpO1xuICAgICAgICBkaWFsb2dSZWYudXBkYXRlUG9zaXRpb24oY29uZmlnPy5wb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ0NvbnRhaW5lclR5cGUsIHVzZVZhbHVlOiBkaWFsb2dDb250YWluZXJ9LFxuICAgICAgICAgIHtwcm92aWRlOiB0aGlzLl9kaWFsb2dEYXRhVG9rZW4sIHVzZVZhbHVlOiBjZGtDb25maWcuZGF0YX0sXG4gICAgICAgICAge3Byb3ZpZGU6IHRoaXMuX2RpYWxvZ1JlZkNvbnN0cnVjdG9yLCB1c2VWYWx1ZTogZGlhbG9nUmVmfSxcbiAgICAgICAgXTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGNhbid0IGJlIGFzc2lnbmVkIGluIHRoZSBgcHJvdmlkZXJzYCBjYWxsYmFjaywgYmVjYXVzZVxuICAgIC8vIHRoZSBpbnN0YW5jZSBoYXNuJ3QgYmVlbiBhc3NpZ25lZCB0byB0aGUgQ0RLIHJlZiB5ZXQuXG4gICAgKGRpYWxvZ1JlZiEgYXMge2NvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPFQ+fSkuY29tcG9uZW50UmVmID0gY2RrUmVmLmNvbXBvbmVudFJlZiE7XG4gICAgZGlhbG9nUmVmIS5jb21wb25lbnRJbnN0YW5jZSA9IGNka1JlZi5jb21wb25lbnRJbnN0YW5jZSE7XG5cbiAgICB0aGlzLm9wZW5EaWFsb2dzLnB1c2goZGlhbG9nUmVmISk7XG4gICAgdGhpcy5hZnRlck9wZW5lZC5uZXh0KGRpYWxvZ1JlZiEpO1xuXG4gICAgZGlhbG9nUmVmIS5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMub3BlbkRpYWxvZ3MuaW5kZXhPZihkaWFsb2dSZWYpO1xuXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLm9wZW5EaWFsb2dzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuX2dldEFmdGVyQWxsQ2xvc2VkKCkubmV4dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmITtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYWxsIG9mIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICAgKi9cbiAgY2xvc2VBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5fY2xvc2VEaWFsb2dzKHRoaXMub3BlbkRpYWxvZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuIG9wZW4gZGlhbG9nIGJ5IGl0cyBpZC5cbiAgICogQHBhcmFtIGlkIElEIHRvIHVzZSB3aGVuIGxvb2tpbmcgdXAgdGhlIGRpYWxvZy5cbiAgICovXG4gIGdldERpYWxvZ0J5SWQoaWQ6IHN0cmluZyk6IE1hdERpYWxvZ1JlZjxhbnk+IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuRGlhbG9ncy5maW5kKGRpYWxvZyA9PiBkaWFsb2cuaWQgPT09IGlkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgY2xvc2UgdGhlIGRpYWxvZ3MgYXQgdGhpcyBsZXZlbCBvbiBkZXN0cm95XG4gICAgLy8gc2luY2UgdGhlIHBhcmVudCBzZXJ2aWNlIG1heSBzdGlsbCBiZSBhY3RpdmUuXG4gICAgdGhpcy5fY2xvc2VEaWFsb2dzKHRoaXMuX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWwpO1xuICAgIHRoaXMuX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jbG9zZURpYWxvZ3MoZGlhbG9nczogTWF0RGlhbG9nUmVmPGFueT5bXSkge1xuICAgIGxldCBpID0gZGlhbG9ncy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBkaWFsb2dzW2ldLmNsb3NlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=