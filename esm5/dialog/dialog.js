/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayContainer, } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
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
    function MatDialog(_overlay, _injector, _location, _defaultOptions, scrollStrategy, _parentDialog, _overlayContainer) {
        var _this = this;
        this._overlay = _overlay;
        this._injector = _injector;
        this._location = _location;
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
    Object.defineProperty(MatDialog.prototype, "afterOpen", {
        /**
         * Stream that emits when a dialog has been opened.
         * @deprecated Use `afterOpened` instead.
         * @breaking-change 8.0.0
         */
        get: function () {
            return this.afterOpened;
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
        var injector = new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatDialogConfig, config]
        ]));
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
        var dialogRef = new MatDialogRef(overlayRef, dialogContainer, this._location, config.id);
        // When the dialog backdrop is clicked, we want to close it.
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(function () {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, { $implicit: config.data, dialogRef: dialogRef }));
        }
        else {
            var injector = this._createInjector(config, dialogRef, dialogContainer);
            var contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
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
        var injectionTokens = new WeakMap([
            [MatDialogContainer, dialogContainer],
            [MAT_DIALOG_DATA, config.data],
            [MatDialogRef, dialogRef]
        ]);
        if (config.direction &&
            (!userInjector || !userInjector.get(Directionality, null))) {
            injectionTokens.set(Directionality, {
                value: config.direction,
                change: observableOf()
            });
        }
        return new PortalInjector(userInjector || this._injector, injectionTokens);
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
    return tslib_1.__assign({}, defaultOptions, config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLGFBQWEsRUFDYixnQkFBZ0IsR0FHakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsZUFBZSxFQUFpQixjQUFjLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkcsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFDZCxRQUFRLEVBRVIsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHMUMsMEZBQTBGO0FBQzFGLE1BQU0sQ0FBQyxJQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUMsQ0FBQztBQUV4RSwwRUFBMEU7QUFDMUUsTUFBTSxDQUFDLElBQU0sMEJBQTBCLEdBQ25DLElBQUksY0FBYyxDQUFrQiw0QkFBNEIsQ0FBQyxDQUFDO0FBRXRFLG9GQUFvRjtBQUNwRixNQUFNLENB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QU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7O2dCQXRURixVQUFVOzs7O2dCQTFEVCxPQUFPO2dCQVlQLFFBQVE7Z0JBTEYsUUFBUSx1QkErRlQsUUFBUTtnQkFsRlAsZUFBZSx1QkFtRmhCLFFBQVEsWUFBSSxNQUFNLFNBQUMsMEJBQTBCO2dEQUM3QyxNQUFNLFNBQUMsMEJBQTBCO2dCQUNhLFNBQVMsdUJBQXZELFFBQVEsWUFBSSxRQUFRO2dCQXZHekIsZ0JBQWdCOztJQWdYbEIsZ0JBQUM7Q0FBQSxBQXhURCxJQXdUQztTQXZUWSxTQUFTO0FBeVR0Qjs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQ3pCLE1BQXdCLEVBQUUsY0FBZ0M7SUFDNUQsNEJBQVcsY0FBYyxFQUFLLE1BQU0sRUFBRTtBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlDb250YWluZXIsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgUG9ydGFsSW5qZWN0b3IsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZGVmZXIsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXREaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbnRhaW5lcn0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyJztcbmltcG9ydCB7TWF0RGlhbG9nUmVmfSBmcm9tICcuL2RpYWxvZy1yZWYnO1xuXG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgdGhlIGRhdGEgdGhhdCB3YXMgcGFzc2VkIGluIHRvIGEgZGlhbG9nLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfREFUQSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNYXREaWFsb2dEYXRhJyk7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGRlZmF1bHQgZGlhbG9nIG9wdGlvbnMuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXREaWFsb2dDb25maWc+KCdtYXQtZGlhbG9nLWRlZmF1bHQtb3B0aW9ucycpO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBkaWFsb2cgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LWRpYWxvZy1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOlxuICAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cblxuLyoqXG4gKiBTZXJ2aWNlIHRvIG9wZW4gTWF0ZXJpYWwgRGVzaWduIG1vZGFsIGRpYWxvZ3MuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXREaWFsb2cgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9vcGVuRGlhbG9nc0F0VGhpc0xldmVsOiBNYXREaWFsb2dSZWY8YW55PltdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9hZnRlck9wZW5lZEF0VGhpc0xldmVsID0gbmV3IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+KCk7XG4gIHByaXZhdGUgX2FyaWFIaWRkZW5FbGVtZW50cyA9IG5ldyBNYXA8RWxlbWVudCwgc3RyaW5nfG51bGw+KCk7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuICovXG4gIGdldCBvcGVuRGlhbG9ncygpOiBNYXREaWFsb2dSZWY8YW55PltdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLm9wZW5EaWFsb2dzIDogdGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgZGlhbG9nIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgZ2V0IGFmdGVyT3BlbmVkKCk6IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50RGlhbG9nID8gdGhpcy5fcGFyZW50RGlhbG9nLmFmdGVyT3BlbmVkIDogdGhpcy5fYWZ0ZXJPcGVuZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGEgZGlhbG9nIGhhcyBiZWVuIG9wZW5lZC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhZnRlck9wZW5lZGAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgZ2V0IGFmdGVyT3BlbigpOiBTdWJqZWN0PE1hdERpYWxvZ1JlZjxhbnk+PiB7XG4gICAgcmV0dXJuIHRoaXMuYWZ0ZXJPcGVuZWQ7XG4gIH1cblxuICBnZXQgX2FmdGVyQWxsQ2xvc2VkKCk6IFN1YmplY3Q8dm9pZD4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudERpYWxvZztcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9hZnRlckFsbENsb3NlZCA6IHRoaXMuX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWw7XG4gIH1cblxuICAvLyBUT0RPIChqZWxib3Vybik6IHRpZ2h0ZW4gdGhlIHR5cGluZyByaWdodC1oYW5kIHNpZGUgb2YgdGhpcyBleHByZXNzaW9uLlxuICAvKipcbiAgICogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBhbGwgb3BlbiBkaWFsb2cgaGF2ZSBmaW5pc2hlZCBjbG9zaW5nLlxuICAgKiBXaWxsIGVtaXQgb24gc3Vic2NyaWJlIGlmIHRoZXJlIGFyZSBubyBvcGVuIGRpYWxvZ3MgdG8gYmVnaW4gd2l0aC5cbiAgICovXG4gIHJlYWRvbmx5IGFmdGVyQWxsQ2xvc2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gZGVmZXIoKCkgPT4gdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGggP1xuICAgICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWQgOlxuICAgICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWQucGlwZShzdGFydFdpdGgodW5kZWZpbmVkKSkpIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9sb2NhdGlvbjogTG9jYXRpb24sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9ESUFMT0dfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0RGlhbG9nQ29uZmlnLFxuICAgICAgQEluamVjdChNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudERpYWxvZzogTWF0RGlhbG9nLFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcikge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgYSBtb2RhbCBkaWFsb2cgY29udGFpbmluZyB0aGUgZ2l2ZW4gY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29tcG9uZW50T3JUZW1wbGF0ZVJlZiBUeXBlIG9mIHRoZSBjb21wb25lbnQgdG8gbG9hZCBpbnRvIHRoZSBkaWFsb2csXG4gICAqICAgICBvciBhIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkaWFsb2cgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRpYWxvZy5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxEPik6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG5cbiAgICBjb25maWcgPSBfYXBwbHlDb25maWdEZWZhdWx0cyhjb25maWcsIHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNYXREaWFsb2dDb25maWcoKSk7XG5cbiAgICBpZiAoY29uZmlnLmlkICYmIHRoaXMuZ2V0RGlhbG9nQnlJZChjb25maWcuaWQpKSB7XG4gICAgICB0aHJvdyBFcnJvcihgRGlhbG9nIHdpdGggaWQgXCIke2NvbmZpZy5pZH1cIiBleGlzdHMgYWxyZWFkeS4gVGhlIGRpYWxvZyBpZCBtdXN0IGJlIHVuaXF1ZS5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShjb25maWcpO1xuICAgIGNvbnN0IGRpYWxvZ0NvbnRhaW5lciA9IHRoaXMuX2F0dGFjaERpYWxvZ0NvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuX2F0dGFjaERpYWxvZ0NvbnRlbnQ8VCwgUj4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ0NvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcpO1xuXG4gICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZGlhbG9nIHRoYXQgd2UncmUgb3BlbmluZywgaGlkZSBhbGwgdGhlIG5vbi1vdmVybGF5IGNvbnRlbnQuXG4gICAgaWYgKCF0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCkge1xuICAgICAgdGhpcy5faGlkZU5vbkRpYWxvZ0NvbnRlbnRGcm9tQXNzaXN0aXZlVGVjaG5vbG9neSgpO1xuICAgIH1cblxuICAgIHRoaXMub3BlbkRpYWxvZ3MucHVzaChkaWFsb2dSZWYpO1xuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9yZW1vdmVPcGVuRGlhbG9nKGRpYWxvZ1JlZikpO1xuICAgIHRoaXMuYWZ0ZXJPcGVuZWQubmV4dChkaWFsb2dSZWYpO1xuXG4gICAgcmV0dXJuIGRpYWxvZ1JlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYWxsIG9mIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICAgKi9cbiAgY2xvc2VBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5fY2xvc2VEaWFsb2dzKHRoaXMub3BlbkRpYWxvZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuIG9wZW4gZGlhbG9nIGJ5IGl0cyBpZC5cbiAgICogQHBhcmFtIGlkIElEIHRvIHVzZSB3aGVuIGxvb2tpbmcgdXAgdGhlIGRpYWxvZy5cbiAgICovXG4gIGdldERpYWxvZ0J5SWQoaWQ6IHN0cmluZyk6IE1hdERpYWxvZ1JlZjxhbnk+IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuRGlhbG9ncy5maW5kKGRpYWxvZyA9PiBkaWFsb2cuaWQgPT09IGlkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIE9ubHkgY2xvc2UgdGhlIGRpYWxvZ3MgYXQgdGhpcyBsZXZlbCBvbiBkZXN0cm95XG4gICAgLy8gc2luY2UgdGhlIHBhcmVudCBzZXJ2aWNlIG1heSBzdGlsbCBiZSBhY3RpdmUuXG4gICAgdGhpcy5fY2xvc2VEaWFsb2dzKHRoaXMuX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWwpO1xuICAgIHRoaXMuX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHRoZSBkaWFsb2cgd2lsbCBiZSBsb2FkZWQuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIHRoZSBPdmVybGF5UmVmIGZvciB0aGUgY3JlYXRlZCBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheShjb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSB0aGlzLl9nZXRPdmVybGF5Q29uZmlnKGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3ZlcmxheSBjb25maWcgZnJvbSBhIGRpYWxvZyBjb25maWcuXG4gICAqIEBwYXJhbSBkaWFsb2dDb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgb3ZlcmxheSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZyhkaWFsb2dDb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE92ZXJsYXlDb25maWcge1xuICAgIGNvbnN0IHN0YXRlID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IGRpYWxvZ0NvbmZpZy5zY3JvbGxTdHJhdGVneSB8fCB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgcGFuZWxDbGFzczogZGlhbG9nQ29uZmlnLnBhbmVsQ2xhc3MsXG4gICAgICBoYXNCYWNrZHJvcDogZGlhbG9nQ29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlyZWN0aW9uOiBkaWFsb2dDb25maWcuZGlyZWN0aW9uLFxuICAgICAgbWluV2lkdGg6IGRpYWxvZ0NvbmZpZy5taW5XaWR0aCxcbiAgICAgIG1pbkhlaWdodDogZGlhbG9nQ29uZmlnLm1pbkhlaWdodCxcbiAgICAgIG1heFdpZHRoOiBkaWFsb2dDb25maWcubWF4V2lkdGgsXG4gICAgICBtYXhIZWlnaHQ6IGRpYWxvZ0NvbmZpZy5tYXhIZWlnaHQsXG4gICAgICBkaXNwb3NlT25OYXZpZ2F0aW9uOiBkaWFsb2dDb25maWcuY2xvc2VPbk5hdmlnYXRpb25cbiAgICB9KTtcblxuICAgIGlmIChkaWFsb2dDb25maWcuYmFja2Ryb3BDbGFzcykge1xuICAgICAgc3RhdGUuYmFja2Ryb3BDbGFzcyA9IGRpYWxvZ0NvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhbiBNYXREaWFsb2dDb250YWluZXIgdG8gYSBkaWFsb2cncyBhbHJlYWR5LWNyZWF0ZWQgb3ZlcmxheS5cbiAgICogQHBhcmFtIG92ZXJsYXkgUmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cncyB1bmRlcmx5aW5nIG92ZXJsYXkuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIGEgQ29tcG9uZW50UmVmIGZvciB0aGUgYXR0YWNoZWQgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoRGlhbG9nQ29udGFpbmVyKG92ZXJsYXk6IE92ZXJsYXlSZWYsIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogTWF0RGlhbG9nQ29udGFpbmVyIHtcbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBuZXcgUG9ydGFsSW5qZWN0b3IodXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBuZXcgV2Vha01hcChbXG4gICAgICBbTWF0RGlhbG9nQ29uZmlnLCBjb25maWddXG4gICAgXSkpO1xuICAgIGNvbnN0IGNvbnRhaW5lclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTWF0RGlhbG9nQ29udGFpbmVyLFxuICAgICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZiwgaW5qZWN0b3IsIGNvbmZpZy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZiA9IG92ZXJsYXkuYXR0YWNoPE1hdERpYWxvZ0NvbnRhaW5lcj4oY29udGFpbmVyUG9ydGFsKTtcblxuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIHVzZXItcHJvdmlkZWQgY29tcG9uZW50IHRvIHRoZSBhbHJlYWR5LWNyZWF0ZWQgTWF0RGlhbG9nQ29udGFpbmVyLlxuICAgKiBAcGFyYW0gY29tcG9uZW50T3JUZW1wbGF0ZVJlZiBUaGUgdHlwZSBvZiBjb21wb25lbnQgYmVpbmcgbG9hZGVkIGludG8gdGhlIGRpYWxvZyxcbiAgICogICAgIG9yIGEgVGVtcGxhdGVSZWYgdG8gaW5zdGFudGlhdGUgYXMgdGhlIGNvbnRlbnQuXG4gICAqIEBwYXJhbSBkaWFsb2dDb250YWluZXIgUmVmZXJlbmNlIHRvIHRoZSB3cmFwcGluZyBNYXREaWFsb2dDb250YWluZXIuXG4gICAqIEBwYXJhbSBvdmVybGF5UmVmIFJlZmVyZW5jZSB0byB0aGUgb3ZlcmxheSBpbiB3aGljaCB0aGUgZGlhbG9nIHJlc2lkZXMuXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIHRoZSBNYXREaWFsb2dSZWYgdGhhdCBzaG91bGQgYmUgcmV0dXJuZWQgdG8gdGhlIHVzZXIuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hEaWFsb2dDb250ZW50PFQsIFI+KFxuICAgICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxUPiB8IFRlbXBsYXRlUmVmPFQ+LFxuICAgICAgZGlhbG9nQ29udGFpbmVyOiBNYXREaWFsb2dDb250YWluZXIsXG4gICAgICBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgY29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBNYXREaWFsb2dSZWY8VCwgUj4ge1xuXG4gICAgLy8gQ3JlYXRlIGEgcmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cgd2UncmUgY3JlYXRpbmcgaW4gb3JkZXIgdG8gZ2l2ZSB0aGUgdXNlciBhIGhhbmRsZVxuICAgIC8vIHRvIG1vZGlmeSBhbmQgY2xvc2UgaXQuXG4gICAgY29uc3QgZGlhbG9nUmVmID1cbiAgICAgICAgbmV3IE1hdERpYWxvZ1JlZjxULCBSPihvdmVybGF5UmVmLCBkaWFsb2dDb250YWluZXIsIHRoaXMuX2xvY2F0aW9uLCBjb25maWcuaWQpO1xuXG4gICAgLy8gV2hlbiB0aGUgZGlhbG9nIGJhY2tkcm9wIGlzIGNsaWNrZWQsIHdlIHdhbnQgdG8gY2xvc2UgaXQuXG4gICAgaWYgKGNvbmZpZy5oYXNCYWNrZHJvcCkge1xuICAgICAgb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKCFkaWFsb2dSZWYuZGlzYWJsZUNsb3NlKSB7XG4gICAgICAgICAgZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgbmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLFxuICAgICAgICAgIDxhbnk+eyAkaW1wbGljaXQ6IGNvbmZpZy5kYXRhLCBkaWFsb2dSZWYgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuX2NyZWF0ZUluamVjdG9yPFQ+KGNvbmZpZywgZGlhbG9nUmVmLCBkaWFsb2dDb250YWluZXIpO1xuICAgICAgY29uc3QgY29udGVudFJlZiA9IGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWw8VD4oXG4gICAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRPclRlbXBsYXRlUmVmLCB1bmRlZmluZWQsIGluamVjdG9yKSk7XG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIGRpYWxvZ1JlZlxuICAgICAgLnVwZGF0ZVNpemUoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KVxuICAgICAgLnVwZGF0ZVBvc2l0aW9uKGNvbmZpZy5wb3NpdGlvbik7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjdXN0b20gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgdGhlIGRpYWxvZy4gVGhpcyBhbGxvd3MgYSBjb21wb25lbnQgbG9hZGVkIGluc2lkZVxuICAgKiBvZiBhIGRpYWxvZyB0byBjbG9zZSBpdHNlbGYgYW5kLCBvcHRpb25hbGx5LCB0byByZXR1cm4gYSB2YWx1ZS5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgb2JqZWN0IHRoYXQgaXMgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ1JlZiBSZWZlcmVuY2UgdG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGNvbnRhaW5lciBEaWFsb2cgY29udGFpbmVyIGVsZW1lbnQgdGhhdCB3cmFwcyBhbGwgb2YgdGhlIGNvbnRlbnRzLlxuICAgKiBAcmV0dXJucyBUaGUgY3VzdG9tIGluamVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgaW5zaWRlIHRoZSBkaWFsb2cuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihcbiAgICAgIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnLFxuICAgICAgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IE1hdERpYWxvZ0NvbnRhaW5lcik6IFBvcnRhbEluamVjdG9yIHtcblxuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcblxuICAgIC8vIFRoZSBNYXREaWFsb2dDb250YWluZXIgaXMgaW5qZWN0ZWQgaW4gdGhlIHBvcnRhbCBhcyB0aGUgTWF0RGlhbG9nQ29udGFpbmVyIGFuZCB0aGUgZGlhbG9nJ3NcbiAgICAvLyBjb250ZW50IGFyZSBjcmVhdGVkIG91dCBvZiB0aGUgc2FtZSBWaWV3Q29udGFpbmVyUmVmIGFuZCBhcyBzdWNoLCBhcmUgc2libGluZ3MgZm9yIGluamVjdG9yXG4gICAgLy8gcHVycG9zZXMuIFRvIGFsbG93IHRoZSBoaWVyYXJjaHkgdGhhdCBpcyBleHBlY3RlZCwgdGhlIE1hdERpYWxvZ0NvbnRhaW5lciBpcyBleHBsaWNpdGx5XG4gICAgLy8gYWRkZWQgdG8gdGhlIGluamVjdGlvbiB0b2tlbnMuXG4gICAgY29uc3QgaW5qZWN0aW9uVG9rZW5zID0gbmV3IFdlYWtNYXA8YW55LCBhbnk+KFtcbiAgICAgIFtNYXREaWFsb2dDb250YWluZXIsIGRpYWxvZ0NvbnRhaW5lcl0sXG4gICAgICBbTUFUX0RJQUxPR19EQVRBLCBjb25maWcuZGF0YV0sXG4gICAgICBbTWF0RGlhbG9nUmVmLCBkaWFsb2dSZWZdXG4gICAgXSk7XG5cbiAgICBpZiAoY29uZmlnLmRpcmVjdGlvbiAmJlxuICAgICAgICAoIXVzZXJJbmplY3RvciB8fCAhdXNlckluamVjdG9yLmdldDxEaXJlY3Rpb25hbGl0eSB8IG51bGw+KERpcmVjdGlvbmFsaXR5LCBudWxsKSkpIHtcbiAgICAgIGluamVjdGlvblRva2Vucy5zZXQoRGlyZWN0aW9uYWxpdHksIHtcbiAgICAgICAgdmFsdWU6IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICAgIGNoYW5nZTogb2JzZXJ2YWJsZU9mKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUG9ydGFsSW5qZWN0b3IodXNlckluamVjdG9yIHx8IHRoaXMuX2luamVjdG9yLCBpbmplY3Rpb25Ub2tlbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBkaWFsb2cgZnJvbSB0aGUgYXJyYXkgb2Ygb3BlbiBkaWFsb2dzLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVmIERpYWxvZyB0byBiZSByZW1vdmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlT3BlbkRpYWxvZyhkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLm9wZW5EaWFsb2dzLmluZGV4T2YoZGlhbG9nUmVmKTtcblxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm9wZW5EaWFsb2dzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIC8vIElmIGFsbCB0aGUgZGlhbG9ncyB3ZXJlIGNsb3NlZCwgcmVtb3ZlL3Jlc3RvcmUgdGhlIGBhcmlhLWhpZGRlbmBcbiAgICAgIC8vIHRvIGEgdGhlIHNpYmxpbmdzIGFuZCBlbWl0IHRvIHRoZSBgYWZ0ZXJBbGxDbG9zZWRgIHN0cmVhbS5cbiAgICAgIGlmICghdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fYXJpYUhpZGRlbkVsZW1lbnRzLmZvckVhY2goKHByZXZpb3VzVmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgcHJldmlvdXNWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYXJpYUhpZGRlbkVsZW1lbnRzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2FmdGVyQWxsQ2xvc2VkLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGlkZXMgYWxsIG9mIHRoZSBjb250ZW50IHRoYXQgaXNuJ3QgYW4gb3ZlcmxheSBmcm9tIGFzc2lzdGl2ZSB0ZWNobm9sb2d5LlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlkZU5vbkRpYWxvZ0NvbnRlbnRGcm9tQXNzaXN0aXZlVGVjaG5vbG9neSgpIHtcbiAgICBjb25zdCBvdmVybGF5Q29udGFpbmVyID0gdGhpcy5fb3ZlcmxheUNvbnRhaW5lci5nZXRDb250YWluZXJFbGVtZW50KCk7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBjb250YWluZXIgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICBpZiAob3ZlcmxheUNvbnRhaW5lci5wYXJlbnRFbGVtZW50KSB7XG4gICAgICBjb25zdCBzaWJsaW5ncyA9IG92ZXJsYXlDb250YWluZXIucGFyZW50RWxlbWVudC5jaGlsZHJlbjtcblxuICAgICAgZm9yIChsZXQgaSA9IHNpYmxpbmdzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XG4gICAgICAgIGxldCBzaWJsaW5nID0gc2libGluZ3NbaV07XG5cbiAgICAgICAgaWYgKHNpYmxpbmcgIT09IG92ZXJsYXlDb250YWluZXIgJiZcbiAgICAgICAgICBzaWJsaW5nLm5vZGVOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgICAgIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTVFlMRScgJiZcbiAgICAgICAgICAhc2libGluZy5oYXNBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpKSB7XG5cbiAgICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuc2V0KHNpYmxpbmcsIHNpYmxpbmcuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKTtcbiAgICAgICAgICBzaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyBhbGwgb2YgdGhlIGRpYWxvZ3MgaW4gYW4gYXJyYXkuICovXG4gIHByaXZhdGUgX2Nsb3NlRGlhbG9ncyhkaWFsb2dzOiBNYXREaWFsb2dSZWY8YW55PltdKSB7XG4gICAgbGV0IGkgPSBkaWFsb2dzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIC8vIFRoZSBgX29wZW5EaWFsb2dzYCBwcm9wZXJ0eSBpc24ndCB1cGRhdGVkIGFmdGVyIGNsb3NlIHVudGlsIHRoZSByeGpzIHN1YnNjcmlwdGlvblxuICAgICAgLy8gcnVucyBvbiB0aGUgbmV4dCBtaWNyb3Rhc2ssIGluIGFkZGl0aW9uIHRvIG1vZGlmeWluZyB0aGUgYXJyYXkgYXMgd2UncmUgZ29pbmdcbiAgICAgIC8vIHRocm91Z2ggaXQuIFdlIGxvb3AgdGhyb3VnaCBhbGwgb2YgdGhlbSBhbmQgY2FsbCBjbG9zZSB3aXRob3V0IGFzc3VtaW5nIHRoYXRcbiAgICAgIC8vIHRoZXknbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IGluc3RhbnRhbmVvdXNseS5cbiAgICAgIGRpYWxvZ3NbaV0uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEFwcGxpZXMgZGVmYXVsdCBvcHRpb25zIHRvIHRoZSBkaWFsb2cgY29uZmlnLlxuICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgbW9kaWZpZWQuXG4gKiBAcGFyYW0gZGVmYXVsdE9wdGlvbnMgRGVmYXVsdCBvcHRpb25zIHByb3ZpZGVkLlxuICogQHJldHVybnMgVGhlIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gX2FwcGx5Q29uZmlnRGVmYXVsdHMoXG4gICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnLCBkZWZhdWx0T3B0aW9ucz86IE1hdERpYWxvZ0NvbmZpZyk6IE1hdERpYWxvZ0NvbmZpZyB7XG4gIHJldHVybiB7Li4uZGVmYXVsdE9wdGlvbnMsIC4uLmNvbmZpZ307XG59XG4iXX0=