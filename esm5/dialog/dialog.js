/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayContainer, } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef, } from '@angular/core';
import { defer, of as observableOf, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatDialogConfig } from './dialog-config';
import { MatDialogContainer } from './dialog-container';
import { MatDialogRef } from './dialog-ref';
/** Injection token that can be used to access the data that was passed in to a dialog. */
export var MAT_DIALOG_DATA = new InjectionToken('MatDialogData');
/** Injection token that can be used to specify default dialog options. */
export var MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/** Injection token that determines the scroll handling while the dialog is open. */
export var MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.block(); };
}
/** @docs-private */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.block(); };
}
/** @docs-private */
export var MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 */
var MatDialog = /** @class */ (function () {
    function MatDialog(_overlay, _injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    _location, _defaultOptions, scrollStrategy, _parentDialog, _overlayContainer) {
        var _this = this;
        this._overlay = _overlay;
        this._injector = _injector;
        this._defaultOptions = _defaultOptions;
        this._parentDialog = _parentDialog;
        this._overlayContainer = _overlayContainer;
        this._openDialogsAtThisLevel = [];
        this._afterAllClosedAtThisLevel = new Subject();
        this._afterOpenedAtThisLevel = new Subject();
        this._ariaHiddenElements = new Map();
        // TODO (jelbourn): tighten the typing right-hand side of this expression.
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(function () { return _this.openDialogs.length ?
            _this._afterAllClosed :
            _this._afterAllClosed.pipe(startWith(undefined)); });
        this._scrollStrategy = scrollStrategy;
    }
    Object.defineProperty(MatDialog.prototype, "openDialogs", {
        /** Keeps track of the currently-open dialogs. */
        get: function () {
            return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDialog.prototype, "afterOpened", {
        /** Stream that emits when a dialog has been opened. */
        get: function () {
            return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDialog.prototype, "_afterAllClosed", {
        get: function () {
            var parent = this._parentDialog;
            return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens a modal dialog containing the given component.
     * @param componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    MatDialog.prototype.open = function (componentOrTemplateRef, config) {
        var _this = this;
        config = _applyConfigDefaults(config, this._defaultOptions || new MatDialogConfig());
        if (config.id && this.getDialogById(config.id)) {
            throw Error("Dialog with id \"" + config.id + "\" exists already. The dialog id must be unique.");
        }
        var overlayRef = this._createOverlay(config);
        var dialogContainer = this._attachDialogContainer(overlayRef, config);
        var dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        // If this is the first dialog that we're opening, hide all the non-overlay content.
        if (!this.openDialogs.length) {
            this._hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(function () { return _this._removeOpenDialog(dialogRef); });
        this.afterOpened.next(dialogRef);
        return dialogRef;
    };
    /**
     * Closes all of the currently-open dialogs.
     */
    MatDialog.prototype.closeAll = function () {
        this._closeDialogs(this.openDialogs);
    };
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    MatDialog.prototype.getDialogById = function (id) {
        return this.openDialogs.find(function (dialog) { return dialog.id === id; });
    };
    MatDialog.prototype.ngOnDestroy = function () {
        // Only close the dialogs at this level on destroy
        // since the parent service may still be active.
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
    };
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    MatDialog.prototype._createOverlay = function (config) {
        var overlayConfig = this._getOverlayConfig(config);
        return this._overlay.create(overlayConfig);
    };
    /**
     * Creates an overlay config from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    MatDialog.prototype._getOverlayConfig = function (dialogConfig) {
        var state = new OverlayConfig({
            positionStrategy: this._overlay.position().global(),
            scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(),
            panelClass: dialogConfig.panelClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            direction: dialogConfig.direction,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight,
            disposeOnNavigation: dialogConfig.closeOnNavigation
        });
        if (dialogConfig.backdropClass) {
            state.backdropClass = dialogConfig.backdropClass;
        }
        return state;
    };
    /**
     * Attaches an MatDialogContainer to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    MatDialog.prototype._attachDialogContainer = function (overlay, config) {
        var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        var injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatDialogConfig, useValue: config }]
        });
        var containerPortal = new ComponentPortal(MatDialogContainer, config.viewContainerRef, injector, config.componentFactoryResolver);
        var containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    };
    /**
     * Attaches the user-provided component to the already-created MatDialogContainer.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping MatDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MatDialogRef that should be returned to the user.
     */
    MatDialog.prototype._attachDialogContent = function (componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        var dialogRef = new MatDialogRef(overlayRef, dialogContainer, config.id);
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, { $implicit: config.data, dialogRef: dialogRef }));
        }
        else {
            var injector = this._createInjector(config, dialogRef, dialogContainer);
            var contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    };
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog.
     * @param container Dialog container element that wraps all of the contents.
     * @returns The custom injector that can be used inside the dialog.
     */
    MatDialog.prototype._createInjector = function (config, dialogRef, dialogContainer) {
        var userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        // The MatDialogContainer is injected in the portal as the MatDialogContainer and the dialog's
        // content are created out of the same ViewContainerRef and as such, are siblings for injector
        // purposes. To allow the hierarchy that is expected, the MatDialogContainer is explicitly
        // added to the injection tokens.
        var providers = [
            { provide: MatDialogContainer, useValue: dialogContainer },
            { provide: MAT_DIALOG_DATA, useValue: config.data },
            { provide: MatDialogRef, useValue: dialogRef }
        ];
        if (config.direction &&
            (!userInjector || !userInjector.get(Directionality, null))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: observableOf() }
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers: providers });
    };
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    MatDialog.prototype._removeOpenDialog = function (dialogRef) {
        var index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach(function (previousValue, element) {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this._ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    };
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    MatDialog.prototype._hideNonDialogContentFromAssistiveTechnology = function () {
        var overlayContainer = this._overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            var siblings = overlayContainer.parentElement.children;
            for (var i = siblings.length - 1; i > -1; i--) {
                var sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    };
    /** Closes all of the dialogs in an array. */
    MatDialog.prototype._closeDialogs = function (dialogs) {
        var i = dialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            dialogs[i].close();
        }
    };
    MatDialog.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MatDialog.ctorParameters = function () { return [
        { type: Overlay },
        { type: Injector },
        { type: Location, decorators: [{ type: Optional }] },
        { type: MatDialogConfig, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DIALOG_DEFAULT_OPTIONS,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_SCROLL_STRATEGY,] }] },
        { type: MatDialog, decorators: [{ type: Optional }, { type: SkipSelf }] },
        { type: OverlayContainer }
    ]; };
    return MatDialog;
}());
export { MatDialog };
/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(config, defaultOptions) {
    return __assign(__assign({}, defaultOptions), config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLGFBQWEsRUFDYixnQkFBZ0IsR0FHakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsZUFBZSxFQUFpQixjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFFBQVEsRUFFUixRQUFRLEVBQ1IsUUFBUSxFQUNSLFdBQVcsR0FFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUcxQywwRkFBMEY7QUFDMUYsTUFBTSxDQUFDLElBQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFNLGVBQWUsQ0FBQyxDQUFDO0FBRXhFLDBFQUEwRTtBQUMxRSxNQUFNLENBQUMsSUFBTSwwQkFBMEIsR0FDbkMsSUFBSSxjQUFjLENBQWtCLDRCQUE0QixDQUFDLENBQUM7QUFFdEUsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxJQUFNLDBC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O2dEQUM3QyxNQUFNLFNBQUMsMEJBQTBCO2dCQUNhLFNBQVMsdUJBQXZELFFBQVEsWUFBSSxRQUFRO2dCQW5HekIsZ0JBQWdCOztJQXFXbEIsZ0JBQUM7Q0FBQSxBQTVTRCxJQTRTQztTQTNTWSxTQUFTO0FBNlN0Qjs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQ3pCLE1BQXdCLEVBQUUsY0FBZ0M7SUFDNUQsNkJBQVcsY0FBYyxHQUFLLE1BQU0sRUFBRTtBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlDb250YWluZXIsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFN0YXRpY1Byb3ZpZGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZGVmZXIsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbnRhaW5lcn0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7TWF0RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuXG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIGRhdGEgdGhhdCB3YXMgcGFzc2VkIGluIHRvIGEgZGlhbG9nLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfREFUQSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNYXREaWFsb2dEYXRhJyk7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgZGlhbG9nIG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREaWFsb2dDb25maWc+KCdtYXQtZGlhbG9nLWRlZmF1bHQtb3B0aW9ucycpO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBkaWFsb2cgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LWRpYWxvZy1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOlxuICAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2cgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9vcGVuRGlhbG9nc0F0VGhpc0xldmVsOiBNYXREaWFsb2dSZWY8YW55PltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+KCk7XG4gIHByaXZhdGUgX2FyaWFIaWRkZW5FbGVtZW50cyA9IG5ldyBNYXA8RWxlbWVudCwgc3RyaW5nfG51bGw+KCk7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuICovXG4gIGdldCBvcGVuRGlhbG9ncygpOiBNYXREaWFsb2dSZWY8YW55PltdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLm9wZW5EaWFsb2dzIDogdGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgZGlhbG9nIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgZ2V0IGFmdGVyT3BlbmVkKCk6IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLmFmdGVyT3BlbmVkIDogdGhpcy5fYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIGdldCBfYWZ0ZXJBbGxDbG9zZWQoKTogU3ViamVjdDx2b2lkPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50RGlhbG9nO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX2FmdGVyQWxsQ2xvc2VkIDogdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8vIFRPRE8gKGplbGJvdXJuKTogdGlnaHRlbiB0aGUgdHlwaW5nIHJpZ2h0LWhhbmQgc2lkZSBvZiB0aGlzIGV4cHJlc3Npb24uXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGFsbCBvcGVuIGRpYWxvZyBoYXZlIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqIFdpbGwgZW1pdCBvbiBzdWJzY3JpYmUgaWYgdGhlcmUgYXJlIG5vIG9wZW4gZGlhbG9ncyB0byBiZWdpbiB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxDbG9zZWQ6IE9ic2VydmFibGU8dm9pZD4gPSBkZWZlcigoKSA9PiB0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCA/XG4gICAgICB0aGlzLl9hZnRlckFsbENsb3NlZCA6XG4gICAgICB0aGlzLl9hZnRlckFsbENsb3NlZC5waXBlKHN0YXJ0V2l0aCh1bmRlZmluZWQpKSkgYXMgT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIC8qKlxuICAgICAgICogQGRlcHJlY2F0ZWQgYF9sb2NhdGlvbmAgcGFyYW1ldGVyIHRvIGJlIHJlbW92ZWQuXG4gICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICovXG4gICAgICBAT3B0aW9uYWwoKSBfbG9jYXRpb246IExvY2F0aW9uLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdERpYWxvZ0NvbmZpZyxcbiAgICAgIEBJbmplY3QoTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnREaWFsb2c6IE1hdERpYWxvZyxcbiAgICAgIHByaXZhdGUgX292ZXJsYXlDb250YWluZXI6IE92ZXJsYXlDb250YWluZXIpIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgbW9kYWwgZGlhbG9nIGNvbnRhaW5pbmcgdGhlIGdpdmVuIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgVHlwZSBvZiB0aGUgY29tcG9uZW50IHRvIGxvYWQgaW50byB0aGUgZGlhbG9nLFxuICAgKiAgICAgb3IgYSBUZW1wbGF0ZVJlZiB0byBpbnN0YW50aWF0ZSBhcyB0aGUgZGlhbG9nIGNvbnRlbnQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIG5ld2x5LW9wZW5lZCBkaWFsb2cuXG4gICAqL1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWc8RD4pOiBNYXREaWFsb2dSZWY8VCwgUj4ge1xuXG4gICAgY29uZmlnID0gX2FwcGx5Q29uZmlnRGVmYXVsdHMoY29uZmlnLCB0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTWF0RGlhbG9nQ29uZmlnKCkpO1xuXG4gICAgaWYgKGNvbmZpZy5pZCAmJiB0aGlzLmdldERpYWxvZ0J5SWQoY29uZmlnLmlkKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYERpYWxvZyB3aXRoIGlkIFwiJHtjb25maWcuaWR9XCIgZXhpc3RzIGFscmVhZHkuIFRoZSBkaWFsb2cgaWQgbXVzdCBiZSB1bmlxdWUuYCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoY29uZmlnKTtcbiAgICBjb25zdCBkaWFsb2dDb250YWluZXIgPSB0aGlzLl9hdHRhY2hEaWFsb2dDb250YWluZXIob3ZlcmxheVJlZiwgY29uZmlnKTtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLl9hdHRhY2hEaWFsb2dDb250ZW50PFQsIFI+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnKTtcblxuICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGRpYWxvZyB0aGF0IHdlJ3JlIG9wZW5pbmcsIGhpZGUgYWxsIHRoZSBub24tb3ZlcmxheSBjb250ZW50LlxuICAgIGlmICghdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2hpZGVOb25EaWFsb2dDb250ZW50RnJvbUFzc2lzdGl2ZVRlY2hub2xvZ3koKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wZW5EaWFsb2dzLnB1c2goZGlhbG9nUmVmKTtcbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcmVtb3ZlT3BlbkRpYWxvZyhkaWFsb2dSZWYpKTtcbiAgICB0aGlzLmFmdGVyT3BlbmVkLm5leHQoZGlhbG9nUmVmKTtcblxuICAgIHJldHVybiBkaWFsb2dSZWY7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIGFsbCBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy5cbiAgICovXG4gIGNsb3NlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuX2Nsb3NlRGlhbG9ncyh0aGlzLm9wZW5EaWFsb2dzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbiBvcGVuIGRpYWxvZyBieSBpdHMgaWQuXG4gICAqIEBwYXJhbSBpZCBJRCB0byB1c2Ugd2hlbiBsb29raW5nIHVwIHRoZSBkaWFsb2cuXG4gICAqL1xuICBnZXREaWFsb2dCeUlkKGlkOiBzdHJpbmcpOiBNYXREaWFsb2dSZWY8YW55PiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMub3BlbkRpYWxvZ3MuZmluZChkaWFsb2cgPT4gZGlhbG9nLmlkID09PSBpZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBPbmx5IGNsb3NlIHRoZSBkaWFsb2dzIGF0IHRoaXMgbGV2ZWwgb24gZGVzdHJveVxuICAgIC8vIHNpbmNlIHRoZSBwYXJlbnQgc2VydmljZSBtYXkgc3RpbGwgYmUgYWN0aXZlLlxuICAgIHRoaXMuX2Nsb3NlRGlhbG9ncyh0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsKTtcbiAgICB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIG92ZXJsYXkgaW50byB3aGljaCB0aGUgZGlhbG9nIHdpbGwgYmUgbG9hZGVkLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBkaWFsb2cgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHJlc29sdmluZyB0byB0aGUgT3ZlcmxheVJlZiBmb3IgdGhlIGNyZWF0ZWQgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBPdmVybGF5UmVmIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gdGhpcy5fZ2V0T3ZlcmxheUNvbmZpZyhjb25maWcpO1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG92ZXJsYXkgY29uZmlnIGZyb20gYSBkaWFsb2cgY29uZmlnLlxuICAgKiBAcGFyYW0gZGlhbG9nQ29uZmlnIFRoZSBkaWFsb2cgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMgVGhlIG92ZXJsYXkgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX2dldE92ZXJsYXlDb25maWcoZGlhbG9nQ29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBPdmVybGF5Q29uZmlnIHtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKSxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBkaWFsb2dDb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHBhbmVsQ2xhc3M6IGRpYWxvZ0NvbmZpZy5wYW5lbENsYXNzLFxuICAgICAgaGFzQmFja2Ryb3A6IGRpYWxvZ0NvbmZpZy5oYXNCYWNrZHJvcCxcbiAgICAgIGRpcmVjdGlvbjogZGlhbG9nQ29uZmlnLmRpcmVjdGlvbixcbiAgICAgIG1pbldpZHRoOiBkaWFsb2dDb25maWcubWluV2lkdGgsXG4gICAgICBtaW5IZWlnaHQ6IGRpYWxvZ0NvbmZpZy5taW5IZWlnaHQsXG4gICAgICBtYXhXaWR0aDogZGlhbG9nQ29uZmlnLm1heFdpZHRoLFxuICAgICAgbWF4SGVpZ2h0OiBkaWFsb2dDb25maWcubWF4SGVpZ2h0LFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogZGlhbG9nQ29uZmlnLmNsb3NlT25OYXZpZ2F0aW9uXG4gICAgfSk7XG5cbiAgICBpZiAoZGlhbG9nQ29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgIHN0YXRlLmJhY2tkcm9wQ2xhc3MgPSBkaWFsb2dDb25maWcuYmFja2Ryb3BDbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYW4gTWF0RGlhbG9nQ29udGFpbmVyIHRvIGEgZGlhbG9nJ3MgYWxyZWFkeS1jcmVhdGVkIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBvdmVybGF5IFJlZmVyZW5jZSB0byB0aGUgZGlhbG9nJ3MgdW5kZXJseWluZyBvdmVybGF5LlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBkaWFsb2cgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHJlc29sdmluZyB0byBhIENvbXBvbmVudFJlZiBmb3IgdGhlIGF0dGFjaGVkIGNvbnRhaW5lci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaERpYWxvZ0NvbnRhaW5lcihvdmVybGF5OiBPdmVybGF5UmVmLCBjb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE1hdERpYWxvZ0NvbnRhaW5lciB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IGluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1hdERpYWxvZ0NvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE1hdERpYWxvZ0NvbnRhaW5lcixcbiAgICAgICAgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yLCBjb25maWcuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyKTtcbiAgICBjb25zdCBjb250YWluZXJSZWYgPSBvdmVybGF5LmF0dGFjaDxNYXREaWFsb2dDb250YWluZXI+KGNvbnRhaW5lclBvcnRhbCk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSB1c2VyLXByb3ZpZGVkIGNvbXBvbmVudCB0byB0aGUgYWxyZWFkeS1jcmVhdGVkIE1hdERpYWxvZ0NvbnRhaW5lci5cbiAgICogQHBhcmFtIGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgVGhlIHR5cGUgb2YgY29tcG9uZW50IGJlaW5nIGxvYWRlZCBpbnRvIHRoZSBkaWFsb2csXG4gICAqICAgICBvciBhIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBjb250ZW50LlxuICAgKiBAcGFyYW0gZGlhbG9nQ29udGFpbmVyIFJlZmVyZW5jZSB0byB0aGUgd3JhcHBpbmcgTWF0RGlhbG9nQ29udGFpbmVyLlxuICAgKiBAcGFyYW0gb3ZlcmxheVJlZiBSZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgaW4gd2hpY2ggdGhlIGRpYWxvZyByZXNpZGVzLlxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBkaWFsb2cgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHJlc29sdmluZyB0byB0aGUgTWF0RGlhbG9nUmVmIHRoYXQgc2hvdWxkIGJlIHJldHVybmVkIHRvIHRoZSB1c2VyLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoRGlhbG9nQ29udGVudDxULCBSPihcbiAgICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICAgIGRpYWxvZ0NvbnRhaW5lcjogTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICAgIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogTWF0RGlhbG9nUmVmPFQsIFI+IHtcblxuICAgIC8vIENyZWF0ZSBhIHJlZmVyZW5jZSB0byB0aGUgZGlhbG9nIHdlJ3JlIGNyZWF0aW5nIGluIG9yZGVyIHRvIGdpdmUgdGhlIHVzZXIgYSBoYW5kbGVcbiAgICAvLyB0byBtb2RpZnkgYW5kIGNsb3NlIGl0LlxuICAgIGNvbnN0IGRpYWxvZ1JlZiA9XG4gICAgICAgIG5ldyBNYXREaWFsb2dSZWY8VCwgUj4ob3ZlcmxheVJlZiwgZGlhbG9nQ29udGFpbmVyLCBjb25maWcuaWQpO1xuXG4gICAgaWYgKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgZGlhbG9nQ29udGFpbmVyLmF0dGFjaFRlbXBsYXRlUG9ydGFsKFxuICAgICAgICBuZXcgVGVtcGxhdGVQb3J0YWw8VD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgbnVsbCEsXG4gICAgICAgICAgPGFueT57JGltcGxpY2l0OiBjb25maWcuZGF0YSwgZGlhbG9nUmVmfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX2NyZWF0ZUluamVjdG9yPFQ+KGNvbmZpZywgZGlhbG9nUmVmLCBkaWFsb2dDb250YWluZXIpO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWw8VD4oXG4gICAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRPclRlbXBsYXRlUmVmLCBjb25maWcudmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3IpKTtcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgZGlhbG9nUmVmXG4gICAgICAudXBkYXRlU2l6ZShjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpXG4gICAgICAudXBkYXRlUG9zaXRpb24oY29uZmlnLnBvc2l0aW9uKTtcblxuICAgIHJldHVybiBkaWFsb2dSZWY7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGN1c3RvbSBpbmplY3RvciB0byBiZSB1c2VkIGluc2lkZSB0aGUgZGlhbG9nLiBUaGlzIGFsbG93cyBhIGNvbXBvbmVudCBsb2FkZWQgaW5zaWRlXG4gICAqIG9mIGEgZGlhbG9nIHRvIGNsb3NlIGl0c2VsZiBhbmQsIG9wdGlvbmFsbHksIHRvIHJldHVybiBhIHZhbHVlLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyBvYmplY3QgdGhhdCBpcyB1c2VkIHRvIGNvbnN0cnVjdCB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVmIFJlZmVyZW5jZSB0byB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gY29udGFpbmVyIERpYWxvZyBjb250YWluZXIgZWxlbWVudCB0aGF0IHdyYXBzIGFsbCBvZiB0aGUgY29udGVudHMuXG4gICAqIEByZXR1cm5zIFRoZSBjdXN0b20gaW5qZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCBpbnNpZGUgdGhlIGRpYWxvZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZUluamVjdG9yPFQ+KFxuICAgICAgY29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgICBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxUPixcbiAgICAgIGRpYWxvZ0NvbnRhaW5lcjogTWF0RGlhbG9nQ29udGFpbmVyKTogSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgLy8gVGhlIE1hdERpYWxvZ0NvbnRhaW5lciBpcyBpbmplY3RlZCBpbiB0aGUgcG9ydGFsIGFzIHRoZSBNYXREaWFsb2dDb250YWluZXIgYW5kIHRoZSBkaWFsb2cnc1xuICAgIC8vIGNvbnRlbnQgYXJlIGNyZWF0ZWQgb3V0IG9mIHRoZSBzYW1lIFZpZXdDb250YWluZXJSZWYgYW5kIGFzIHN1Y2gsIGFyZSBzaWJsaW5ncyBmb3IgaW5qZWN0b3JcbiAgICAvLyBwdXJwb3Nlcy4gVG8gYWxsb3cgdGhlIGhpZXJhcmNoeSB0aGF0IGlzIGV4cGVjdGVkLCB0aGUgTWF0RGlhbG9nQ29udGFpbmVyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBhZGRlZCB0byB0aGUgaW5qZWN0aW9uIHRva2Vucy5cbiAgICBjb25zdCBwcm92aWRlcnM6IFN0YXRpY1Byb3ZpZGVyW10gPSBbXG4gICAgICB7cHJvdmlkZTogTWF0RGlhbG9nQ29udGFpbmVyLCB1c2VWYWx1ZTogZGlhbG9nQ29udGFpbmVyfSxcbiAgICAgIHtwcm92aWRlOiBNQVRfRElBTE9HX0RBVEEsIHVzZVZhbHVlOiBjb25maWcuZGF0YX0sXG4gICAgICB7cHJvdmlkZTogTWF0RGlhbG9nUmVmLCB1c2VWYWx1ZTogZGlhbG9nUmVmfVxuICAgIF07XG5cbiAgICBpZiAoY29uZmlnLmRpcmVjdGlvbiAmJlxuICAgICAgICAoIXVzZXJJbmplY3RvciB8fCAhdXNlckluamVjdG9yLmdldDxEaXJlY3Rpb25hbGl0eSB8IG51bGw+KERpcmVjdGlvbmFsaXR5LCBudWxsKSkpIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKHtcbiAgICAgICAgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHVzZVZhbHVlOiB7dmFsdWU6IGNvbmZpZy5kaXJlY3Rpb24sIGNoYW5nZTogb2JzZXJ2YWJsZU9mKCl9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgcHJvdmlkZXJzfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGRpYWxvZyBmcm9tIHRoZSBhcnJheSBvZiBvcGVuIGRpYWxvZ3MuXG4gICAqIEBwYXJhbSBkaWFsb2dSZWYgRGlhbG9nIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVPcGVuRGlhbG9nKGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMub3BlbkRpYWxvZ3MuaW5kZXhPZihkaWFsb2dSZWYpO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMub3BlbkRpYWxvZ3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgLy8gSWYgYWxsIHRoZSBkaWFsb2dzIHdlcmUgY2xvc2VkLCByZW1vdmUvcmVzdG9yZSB0aGUgYGFyaWEtaGlkZGVuYFxuICAgICAgLy8gdG8gYSB0aGUgc2libGluZ3MgYW5kIGVtaXQgdG8gdGhlIGBhZnRlckFsbENsb3NlZGAgc3RyZWFtLlxuICAgICAgaWYgKCF0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuZm9yRWFjaCgocHJldmlvdXNWYWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWQubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyBhbGwgb2YgdGhlIGNvbnRlbnQgdGhhdCBpc24ndCBhbiBvdmVybGF5IGZyb20gYXNzaXN0aXZlIHRlY2hub2xvZ3kuXG4gICAqL1xuICBwcml2YXRlIF9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCkge1xuICAgIGNvbnN0IG92ZXJsYXlDb250YWluZXIgPSB0aGlzLl9vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IGNvbnRhaW5lciBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgIGlmIChvdmVybGF5Q29udGFpbmVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHNpYmxpbmdzID0gb3ZlcmxheUNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNoaWxkcmVuO1xuXG4gICAgICBmb3IgKGxldCBpID0gc2libGluZ3MubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgbGV0IHNpYmxpbmcgPSBzaWJsaW5nc1tpXTtcblxuICAgICAgICBpZiAoc2libGluZyAhPT0gb3ZlcmxheUNvbnRhaW5lciAmJlxuICAgICAgICAgIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTQ1JJUFQnICYmXG4gICAgICAgICAgc2libGluZy5ub2RlTmFtZSAhPT0gJ1NUWUxFJyAmJlxuICAgICAgICAgICFzaWJsaW5nLmhhc0F0dHJpYnV0ZSgnYXJpYS1saXZlJykpIHtcblxuICAgICAgICAgIHRoaXMuX2FyaWFIaWRkZW5FbGVtZW50cy5zZXQoc2libGluZywgc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIGFsbCBvZiB0aGUgZGlhbG9ncyBpbiBhbiBhcnJheS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VEaWFsb2dzKGRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgICBsZXQgaSA9IGRpYWxvZ3MubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgLy8gVGhlIGBfb3BlbkRpYWxvZ3NgIHByb3BlcnR5IGlzbid0IHVwZGF0ZWQgYWZ0ZXIgY2xvc2UgdW50aWwgdGhlIHJ4anMgc3Vic2NyaXB0aW9uXG4gICAgICAvLyBydW5zIG9uIHRoZSBuZXh0IG1pY3JvdGFzaywgaW4gYWRkaXRpb24gdG8gbW9kaWZ5aW5nIHRoZSBhcnJheSBhcyB3ZSdyZSBnb2luZ1xuICAgICAgLy8gdGhyb3VnaCBpdC4gV2UgbG9vcCB0aHJvdWdoIGFsbCBvZiB0aGVtIGFuZCBjYWxsIGNsb3NlIHdpdGhvdXQgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gdGhleSdsbCBiZSByZW1vdmVkIGZyb20gdGhlIGxpc3QgaW5zdGFudGFuZW91c2x5LlxuICAgICAgZGlhbG9nc1tpXS5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogQXBwbGllcyBkZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGRpYWxvZyBjb25maWcuXG4gKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSBtb2RpZmllZC5cbiAqIEBwYXJhbSBkZWZhdWx0T3B0aW9ucyBEZWZhdWx0IG9wdGlvbnMgcHJvdmlkZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWcsIGRlZmF1bHRPcHRpb25zPzogTWF0RGlhbG9nQ29uZmlnKTogTWF0RGlhbG9nQ29uZmlnIHtcbiAgcmV0dXJuIHsuLi5kZWZhdWx0T3B0aW9ucywgLi4uY29uZmlnfTtcbn1cbiJdfQ==