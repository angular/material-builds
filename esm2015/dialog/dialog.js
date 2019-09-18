/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
/**
 * Injection token that can be used to access the data that was passed in to a dialog.
 * @type {?}
 */
export const MAT_DIALOG_DATA = new InjectionToken('MatDialogData');
/**
 * Injection token that can be used to specify default dialog options.
 * @type {?}
 */
export const MAT_DIALOG_DEFAULT_OPTIONS = new InjectionToken('mat-dialog-default-options');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 * @type {?}
 */
export const MAT_DIALOG_SCROLL_STRATEGY = new InjectionToken('mat-dialog-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
export function MAT_DIALOG_SCROLL_STRATEGY_FACTORY(overlay) {
    return (/**
     * @return {?}
     */
    () => overlay.scrollStrategies.block());
}
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
export function MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return (/**
     * @return {?}
     */
    () => overlay.scrollStrategies.block());
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/**
 * Service to open Material Design modal dialogs.
 */
export class MatDialog {
    /**
     * @param {?} _overlay
     * @param {?} _injector
     * @param {?} _location
     * @param {?} _defaultOptions
     * @param {?} scrollStrategy
     * @param {?} _parentDialog
     * @param {?} _overlayContainer
     */
    constructor(_overlay, _injector, _location, _defaultOptions, scrollStrategy, _parentDialog, _overlayContainer) {
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
        this.afterAllClosed = (/** @type {?} */ (defer((/**
         * @return {?}
         */
        () => this.openDialogs.length ?
            this._afterAllClosed :
            this._afterAllClosed.pipe(startWith(undefined))))));
        this._scrollStrategy = scrollStrategy;
    }
    /**
     * Keeps track of the currently-open dialogs.
     * @return {?}
     */
    get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
    }
    /**
     * Stream that emits when a dialog has been opened.
     * @return {?}
     */
    get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
    }
    /**
     * Stream that emits when a dialog has been opened.
     * @deprecated Use `afterOpened` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    get afterOpen() {
        return this.afterOpened;
    }
    /**
     * @return {?}
     */
    get _afterAllClosed() {
        /** @type {?} */
        const parent = this._parentDialog;
        return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
    }
    /**
     * Opens a modal dialog containing the given component.
     * @template T, D, R
     * @param {?} componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param {?=} config Extra configuration options.
     * @return {?} Reference to the newly-opened dialog.
     */
    open(componentOrTemplateRef, config) {
        config = _applyConfigDefaults(config, this._defaultOptions || new MatDialogConfig());
        if (config.id && this.getDialogById(config.id)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        /** @type {?} */
        const overlayRef = this._createOverlay(config);
        /** @type {?} */
        const dialogContainer = this._attachDialogContainer(overlayRef, config);
        /** @type {?} */
        const dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        // If this is the first dialog that we're opening, hide all the non-overlay content.
        if (!this.openDialogs.length) {
            this._hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe((/**
         * @return {?}
         */
        () => this._removeOpenDialog(dialogRef)));
        this.afterOpened.next(dialogRef);
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     * @return {?}
     */
    closeAll() {
        this._closeDialogs(this.openDialogs);
    }
    /**
     * Finds an open dialog by its id.
     * @param {?} id ID to use when looking up the dialog.
     * @return {?}
     */
    getDialogById(id) {
        return this.openDialogs.find((/**
         * @param {?} dialog
         * @return {?}
         */
        dialog => dialog.id === id));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // Only close the dialogs at this level on destroy
        // since the parent service may still be active.
        this._closeDialogs(this._openDialogsAtThisLevel);
        this._afterAllClosedAtThisLevel.complete();
        this._afterOpenedAtThisLevel.complete();
    }
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @private
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the OverlayRef for the created overlay.
     */
    _createOverlay(config) {
        /** @type {?} */
        const overlayConfig = this._getOverlayConfig(config);
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an overlay config from a dialog config.
     * @private
     * @param {?} dialogConfig The dialog configuration.
     * @return {?} The overlay configuration.
     */
    _getOverlayConfig(dialogConfig) {
        /** @type {?} */
        const state = new OverlayConfig({
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
    }
    /**
     * Attaches an MatDialogContainer to a dialog's already-created overlay.
     * @private
     * @param {?} overlay Reference to the dialog's underlying overlay.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to a ComponentRef for the attached container.
     */
    _attachDialogContainer(overlay, config) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        /** @type {?} */
        const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatDialogConfig, config]
        ]));
        /** @type {?} */
        const containerPortal = new ComponentPortal(MatDialogContainer, config.viewContainerRef, injector, config.componentFactoryResolver);
        /** @type {?} */
        const containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Attaches the user-provided component to the already-created MatDialogContainer.
     * @private
     * @template T, R
     * @param {?} componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param {?} dialogContainer Reference to the wrapping MatDialogContainer.
     * @param {?} overlayRef Reference to the overlay in which the dialog resides.
     * @param {?} config The dialog configuration.
     * @return {?} A promise resolving to the MatDialogRef that should be returned to the user.
     */
    _attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        /** @type {?} */
        const dialogRef = new MatDialogRef(overlayRef, dialogContainer, this._location, config.id);
        // When the dialog backdrop is clicked, we want to close it.
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe((/**
             * @return {?}
             */
            () => {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            }));
        }
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, (/** @type {?} */ (null)), (/** @type {?} */ ({ $implicit: config.data, dialogRef }))));
        }
        else {
            /** @type {?} */
            const injector = this._createInjector(config, dialogRef, dialogContainer);
            /** @type {?} */
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    }
    /**
     * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
     * of a dialog to close itself and, optionally, to return a value.
     * @private
     * @template T
     * @param {?} config Config object that is used to construct the dialog.
     * @param {?} dialogRef Reference to the dialog.
     * @param {?} dialogContainer
     * @return {?} The custom injector that can be used inside the dialog.
     */
    _createInjector(config, dialogRef, dialogContainer) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        // The MatDialogContainer is injected in the portal as the MatDialogContainer and the dialog's
        // content are created out of the same ViewContainerRef and as such, are siblings for injector
        // purposes. To allow the hierarchy that is expected, the MatDialogContainer is explicitly
        // added to the injection tokens.
        /** @type {?} */
        const injectionTokens = new WeakMap([
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
    }
    /**
     * Removes a dialog from the array of open dialogs.
     * @private
     * @param {?} dialogRef Dialog to be removed.
     * @return {?}
     */
    _removeOpenDialog(dialogRef) {
        /** @type {?} */
        const index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach((/**
                 * @param {?} previousValue
                 * @param {?} element
                 * @return {?}
                 */
                (previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                }));
                this._ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    }
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     * @private
     * @return {?}
     */
    _hideNonDialogContentFromAssistiveTechnology() {
        /** @type {?} */
        const overlayContainer = this._overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            /** @type {?} */
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
                /** @type {?} */
                let sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
    /**
     * Closes all of the dialogs in an array.
     * @private
     * @param {?} dialogs
     * @return {?}
     */
    _closeDialogs(dialogs) {
        /** @type {?} */
        let i = dialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            dialogs[i].close();
        }
    }
}
MatDialog.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatDialog.ctorParameters = () => [
    { type: Overlay },
    { type: Injector },
    { type: Location, decorators: [{ type: Optional }] },
    { type: MatDialogConfig, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DIALOG_DEFAULT_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_SCROLL_STRATEGY,] }] },
    { type: MatDialog, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: OverlayContainer }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._openDialogsAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._afterAllClosedAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._afterOpenedAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._ariaHiddenElements;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._scrollStrategy;
    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     * @type {?}
     */
    MatDialog.prototype.afterAllClosed;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._injector;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._location;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._defaultOptions;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._parentDialog;
    /**
     * @type {?}
     * @private
     */
    MatDialog.prototype._overlayContainer;
}
/**
 * Applies default options to the dialog config.
 * @param {?=} config Config to be modified.
 * @param {?=} defaultOptions Default options provided.
 * @return {?} The new configuration object.
 */
function _applyConfigDefaults(config, defaultOptions) {
    return Object.assign({}, defaultOptions, config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUNMLE9BQU8sRUFDUCxhQUFhLEVBQ2IsZ0JBQWdCLEdBR2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBaUIsY0FBYyxFQUFFLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25HLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQUkxQyxNQUFNLE9BQU8sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFNLGVBQWUsQ0FBQzs7Ozs7QUFHdkUsTUFBTSxPQUFPLDBCQUEwQixHQUNuQyxJQUFJLGNBQWMsQ0FBa0IsNEJBQTRCLENBQUM7Ozs7O0FBR3JFLE1BQU0sT0FBTywwQkFBMEIsR0FDbkMsSUFBSSxjQUFjLENBQXVCLDRCQUE0QixDQUFDOzs7Ozs7QUFHMUUsTUFBTSxVQUFV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Z2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheUNvbnRhaW5lcixcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlLCBQb3J0YWxJbmplY3RvciwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtMb2NhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtkZWZlciwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IHtNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdERpYWxvZ0NvbmZpZz4oJ21hdC1kaWFsb2ctZGVmYXVsdC1vcHRpb25zJyk7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6XG4gICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuXG4vKipcbiAqIFNlcnZpY2UgdG8gb3BlbiBNYXRlcmlhbCBEZXNpZ24gbW9kYWwgZGlhbG9ncy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZyBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWw6IE1hdERpYWxvZ1JlZjxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4oKTtcbiAgcHJpdmF0ZSBfYXJpYUhpZGRlbkVsZW1lbnRzID0gbmV3IE1hcDxFbGVtZW50LCBzdHJpbmd8bnVsbD4oKTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGFmdGVyT3BlbmVkYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBnZXQgYWZ0ZXJPcGVuKCk6IFN1YmplY3Q8TWF0RGlhbG9nUmVmPGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5hZnRlck9wZW5lZDtcbiAgfVxuXG4gIGdldCBfYWZ0ZXJBbGxDbG9zZWQoKTogU3ViamVjdDx2b2lkPiB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50RGlhbG9nO1xuICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuX2FmdGVyQWxsQ2xvc2VkIDogdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8vIFRPRE8gKGplbGJvdXJuKTogdGlnaHRlbiB0aGUgdHlwaW5nIHJpZ2h0LWhhbmQgc2lkZSBvZiB0aGlzIGV4cHJlc3Npb24uXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGFsbCBvcGVuIGRpYWxvZyBoYXZlIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqIFdpbGwgZW1pdCBvbiBzdWJzY3JpYmUgaWYgdGhlcmUgYXJlIG5vIG9wZW4gZGlhbG9ncyB0byBiZWdpbiB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxDbG9zZWQ6IE9ic2VydmFibGU8dm9pZD4gPSBkZWZlcigoKSA9PiB0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCA/XG4gICAgICB0aGlzLl9hZnRlckFsbENsb3NlZCA6XG4gICAgICB0aGlzLl9hZnRlckFsbENsb3NlZC5waXBlKHN0YXJ0V2l0aCh1bmRlZmluZWQpKSkgYXMgT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2xvY2F0aW9uOiBMb2NhdGlvbixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RJQUxPR19ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXREaWFsb2dDb25maWcsXG4gICAgICBASW5qZWN0KE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50RGlhbG9nOiBNYXREaWFsb2csXG4gICAgICBwcml2YXRlIF9vdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnRPclRlbXBsYXRlUmVmIFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGRpYWxvZyxcbiAgICogICAgIG9yIGEgVGVtcGxhdGVSZWYgdG8gaW5zdGFudGlhdGUgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZGlhbG9nLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pihjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICAgICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+KTogTWF0RGlhbG9nUmVmPFQsIFI+IHtcblxuICAgIGNvbmZpZyA9IF9hcHBseUNvbmZpZ0RlZmF1bHRzKGNvbmZpZywgdGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdERpYWxvZ0NvbmZpZygpKTtcblxuICAgIGlmIChjb25maWcuaWQgJiYgdGhpcy5nZXREaWFsb2dCeUlkKGNvbmZpZy5pZCkpIHtcbiAgICAgIHRocm93IEVycm9yKGBEaWFsb2cgd2l0aCBpZCBcIiR7Y29uZmlnLmlkfVwiIGV4aXN0cyBhbHJlYWR5LiBUaGUgZGlhbG9nIGlkIG11c3QgYmUgdW5pcXVlLmApO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgZGlhbG9nQ29udGFpbmVyID0gdGhpcy5fYXR0YWNoRGlhbG9nQ29udGFpbmVyKG92ZXJsYXlSZWYsIGNvbmZpZyk7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5fYXR0YWNoRGlhbG9nQ29udGVudDxULCBSPihjb21wb25lbnRPclRlbXBsYXRlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyk7XG5cbiAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBkaWFsb2cgdGhhdCB3ZSdyZSBvcGVuaW5nLCBoaWRlIGFsbCB0aGUgbm9uLW92ZXJsYXkgY29udGVudC5cbiAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuRGlhbG9ncy5wdXNoKGRpYWxvZ1JlZik7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3JlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmKSk7XG4gICAgdGhpcy5hZnRlck9wZW5lZC5uZXh0KGRpYWxvZ1JlZik7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbGwgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gICAqL1xuICBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5vcGVuRGlhbG9ncyk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gb3BlbiBkaWFsb2cgYnkgaXRzIGlkLlxuICAgKiBAcGFyYW0gaWQgSUQgdG8gdXNlIHdoZW4gbG9va2luZyB1cCB0aGUgZGlhbG9nLlxuICAgKi9cbiAgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogTWF0RGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBjbG9zZSB0aGUgZGlhbG9ncyBhdCB0aGlzIGxldmVsIG9uIGRlc3Ryb3lcbiAgICAvLyBzaW5jZSB0aGUgcGFyZW50IHNlcnZpY2UgbWF5IHN0aWxsIGJlIGFjdGl2ZS5cbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbCk7XG4gICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBvdmVybGF5IGludG8gd2hpY2ggdGhlIGRpYWxvZyB3aWxsIGJlIGxvYWRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIE92ZXJsYXlSZWYgZm9yIHRoZSBjcmVhdGVkIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IHRoaXMuX2dldE92ZXJsYXlDb25maWcoY29uZmlnKTtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvdmVybGF5IGNvbmZpZyBmcm9tIGEgZGlhbG9nIGNvbmZpZy5cbiAgICogQHBhcmFtIGRpYWxvZ0NvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIFRoZSBvdmVybGF5IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKGRpYWxvZ0NvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogZGlhbG9nQ29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICBwYW5lbENsYXNzOiBkaWFsb2dDb25maWcucGFuZWxDbGFzcyxcbiAgICAgIGhhc0JhY2tkcm9wOiBkaWFsb2dDb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBkaXJlY3Rpb246IGRpYWxvZ0NvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBtaW5XaWR0aDogZGlhbG9nQ29uZmlnLm1pbldpZHRoLFxuICAgICAgbWluSGVpZ2h0OiBkaWFsb2dDb25maWcubWluSGVpZ2h0LFxuICAgICAgbWF4V2lkdGg6IGRpYWxvZ0NvbmZpZy5tYXhXaWR0aCxcbiAgICAgIG1heEhlaWdodDogZGlhbG9nQ29uZmlnLm1heEhlaWdodCxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IGRpYWxvZ0NvbmZpZy5jbG9zZU9uTmF2aWdhdGlvblxuICAgIH0pO1xuXG4gICAgaWYgKGRpYWxvZ0NvbmZpZy5iYWNrZHJvcENsYXNzKSB7XG4gICAgICBzdGF0ZS5iYWNrZHJvcENsYXNzID0gZGlhbG9nQ29uZmlnLmJhY2tkcm9wQ2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGFuIE1hdERpYWxvZ0NvbnRhaW5lciB0byBhIGRpYWxvZydzIGFscmVhZHktY3JlYXRlZCBvdmVybGF5LlxuICAgKiBAcGFyYW0gb3ZlcmxheSBSZWZlcmVuY2UgdG8gdGhlIGRpYWxvZydzIHVuZGVybHlpbmcgb3ZlcmxheS5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gYSBDb21wb25lbnRSZWYgZm9yIHRoZSBhdHRhY2hlZCBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hEaWFsb2dDb250YWluZXIob3ZlcmxheTogT3ZlcmxheVJlZiwgY29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBNYXREaWFsb2dDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IG5ldyBQb3J0YWxJbmplY3Rvcih1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIG5ldyBXZWFrTWFwKFtcbiAgICAgIFtNYXREaWFsb2dDb25maWcsIGNvbmZpZ11cbiAgICBdKSk7XG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChNYXREaWFsb2dDb250YWluZXIsXG4gICAgICAgIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLCBpbmplY3RvciwgY29uZmlnLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG4gICAgY29uc3QgY29udGFpbmVyUmVmID0gb3ZlcmxheS5hdHRhY2g8TWF0RGlhbG9nQ29udGFpbmVyPihjb250YWluZXJQb3J0YWwpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgdXNlci1wcm92aWRlZCBjb21wb25lbnQgdG8gdGhlIGFscmVhZHktY3JlYXRlZCBNYXREaWFsb2dDb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnRPclRlbXBsYXRlUmVmIFRoZSB0eXBlIG9mIGNvbXBvbmVudCBiZWluZyBsb2FkZWQgaW50byB0aGUgZGlhbG9nLFxuICAgKiAgICAgb3IgYSBUZW1wbGF0ZVJlZiB0byBpbnN0YW50aWF0ZSBhcyB0aGUgY29udGVudC5cbiAgICogQHBhcmFtIGRpYWxvZ0NvbnRhaW5lciBSZWZlcmVuY2UgdG8gdGhlIHdyYXBwaW5nIE1hdERpYWxvZ0NvbnRhaW5lci5cbiAgICogQHBhcmFtIG92ZXJsYXlSZWYgUmVmZXJlbmNlIHRvIHRoZSBvdmVybGF5IGluIHdoaWNoIHRoZSBkaWFsb2cgcmVzaWRlcy5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIE1hdERpYWxvZ1JlZiB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCB0byB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaERpYWxvZ0NvbnRlbnQ8VCwgUj4oXG4gICAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IE1hdERpYWxvZ0NvbnRhaW5lcixcbiAgICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICBjb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG5cbiAgICAvLyBDcmVhdGUgYSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3ZSdyZSBjcmVhdGluZyBpbiBvcmRlciB0byBnaXZlIHRoZSB1c2VyIGEgaGFuZGxlXG4gICAgLy8gdG8gbW9kaWZ5IGFuZCBjbG9zZSBpdC5cbiAgICBjb25zdCBkaWFsb2dSZWYgPVxuICAgICAgICBuZXcgTWF0RGlhbG9nUmVmPFQsIFI+KG92ZXJsYXlSZWYsIGRpYWxvZ0NvbnRhaW5lciwgdGhpcy5fbG9jYXRpb24sIGNvbmZpZy5pZCk7XG5cbiAgICAvLyBXaGVuIHRoZSBkaWFsb2cgYmFja2Ryb3AgaXMgY2xpY2tlZCwgd2Ugd2FudCB0byBjbG9zZSBpdC5cbiAgICBpZiAoY29uZmlnLmhhc0JhY2tkcm9wKSB7XG4gICAgICBvdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAoIWRpYWxvZ1JlZi5kaXNhYmxlQ2xvc2UpIHtcbiAgICAgICAgICBkaWFsb2dSZWYuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgZGlhbG9nQ29udGFpbmVyLmF0dGFjaFRlbXBsYXRlUG9ydGFsKFxuICAgICAgICBuZXcgVGVtcGxhdGVQb3J0YWw8VD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgbnVsbCEsXG4gICAgICAgICAgPGFueT57ICRpbXBsaWNpdDogY29uZmlnLmRhdGEsIGRpYWxvZ1JlZiB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5fY3JlYXRlSW5qZWN0b3I8VD4oY29uZmlnLCBkaWFsb2dSZWYsIGRpYWxvZ0NvbnRhaW5lcik7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gZGlhbG9nQ29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihcbiAgICAgICAgICBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIHVuZGVmaW5lZCwgaW5qZWN0b3IpKTtcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgZGlhbG9nUmVmXG4gICAgICAudXBkYXRlU2l6ZShjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQpXG4gICAgICAudXBkYXRlUG9zaXRpb24oY29uZmlnLnBvc2l0aW9uKTtcblxuICAgIHJldHVybiBkaWFsb2dSZWY7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGN1c3RvbSBpbmplY3RvciB0byBiZSB1c2VkIGluc2lkZSB0aGUgZGlhbG9nLiBUaGlzIGFsbG93cyBhIGNvbXBvbmVudCBsb2FkZWQgaW5zaWRlXG4gICAqIG9mIGEgZGlhbG9nIHRvIGNsb3NlIGl0c2VsZiBhbmQsIG9wdGlvbmFsbHksIHRvIHJldHVybiBhIHZhbHVlLlxuICAgKiBAcGFyYW0gY29uZmlnIENvbmZpZyBvYmplY3QgdGhhdCBpcyB1c2VkIHRvIGNvbnN0cnVjdCB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVmIFJlZmVyZW5jZSB0byB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gY29udGFpbmVyIERpYWxvZyBjb250YWluZXIgZWxlbWVudCB0aGF0IHdyYXBzIGFsbCBvZiB0aGUgY29udGVudHMuXG4gICAqIEByZXR1cm5zIFRoZSBjdXN0b20gaW5qZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCBpbnNpZGUgdGhlIGRpYWxvZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZUluamVjdG9yPFQ+KFxuICAgICAgY29uZmlnOiBNYXREaWFsb2dDb25maWcsXG4gICAgICBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxUPixcbiAgICAgIGRpYWxvZ0NvbnRhaW5lcjogTWF0RGlhbG9nQ29udGFpbmVyKTogUG9ydGFsSW5qZWN0b3Ige1xuXG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuXG4gICAgLy8gVGhlIE1hdERpYWxvZ0NvbnRhaW5lciBpcyBpbmplY3RlZCBpbiB0aGUgcG9ydGFsIGFzIHRoZSBNYXREaWFsb2dDb250YWluZXIgYW5kIHRoZSBkaWFsb2cnc1xuICAgIC8vIGNvbnRlbnQgYXJlIGNyZWF0ZWQgb3V0IG9mIHRoZSBzYW1lIFZpZXdDb250YWluZXJSZWYgYW5kIGFzIHN1Y2gsIGFyZSBzaWJsaW5ncyBmb3IgaW5qZWN0b3JcbiAgICAvLyBwdXJwb3Nlcy4gVG8gYWxsb3cgdGhlIGhpZXJhcmNoeSB0aGF0IGlzIGV4cGVjdGVkLCB0aGUgTWF0RGlhbG9nQ29udGFpbmVyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBhZGRlZCB0byB0aGUgaW5qZWN0aW9uIHRva2Vucy5cbiAgICBjb25zdCBpbmplY3Rpb25Ub2tlbnMgPSBuZXcgV2Vha01hcDxhbnksIGFueT4oW1xuICAgICAgW01hdERpYWxvZ0NvbnRhaW5lciwgZGlhbG9nQ29udGFpbmVyXSxcbiAgICAgIFtNQVRfRElBTE9HX0RBVEEsIGNvbmZpZy5kYXRhXSxcbiAgICAgIFtNYXREaWFsb2dSZWYsIGRpYWxvZ1JlZl1cbiAgICBdKTtcblxuICAgIGlmIChjb25maWcuZGlyZWN0aW9uICYmXG4gICAgICAgICghdXNlckluamVjdG9yIHx8ICF1c2VySW5qZWN0b3IuZ2V0PERpcmVjdGlvbmFsaXR5IHwgbnVsbD4oRGlyZWN0aW9uYWxpdHksIG51bGwpKSkge1xuICAgICAgaW5qZWN0aW9uVG9rZW5zLnNldChEaXJlY3Rpb25hbGl0eSwge1xuICAgICAgICB2YWx1ZTogY29uZmlnLmRpcmVjdGlvbixcbiAgICAgICAgY2hhbmdlOiBvYnNlcnZhYmxlT2YoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQb3J0YWxJbmplY3Rvcih1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIGluamVjdGlvblRva2Vucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGRpYWxvZyBmcm9tIHRoZSBhcnJheSBvZiBvcGVuIGRpYWxvZ3MuXG4gICAqIEBwYXJhbSBkaWFsb2dSZWYgRGlhbG9nIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVPcGVuRGlhbG9nKGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPGFueT4pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMub3BlbkRpYWxvZ3MuaW5kZXhPZihkaWFsb2dSZWYpO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMub3BlbkRpYWxvZ3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgLy8gSWYgYWxsIHRoZSBkaWFsb2dzIHdlcmUgY2xvc2VkLCByZW1vdmUvcmVzdG9yZSB0aGUgYGFyaWEtaGlkZGVuYFxuICAgICAgLy8gdG8gYSB0aGUgc2libGluZ3MgYW5kIGVtaXQgdG8gdGhlIGBhZnRlckFsbENsb3NlZGAgc3RyZWFtLlxuICAgICAgaWYgKCF0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuZm9yRWFjaCgocHJldmlvdXNWYWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hcmlhSGlkZGVuRWxlbWVudHMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWQubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyBhbGwgb2YgdGhlIGNvbnRlbnQgdGhhdCBpc24ndCBhbiBvdmVybGF5IGZyb20gYXNzaXN0aXZlIHRlY2hub2xvZ3kuXG4gICAqL1xuICBwcml2YXRlIF9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCkge1xuICAgIGNvbnN0IG92ZXJsYXlDb250YWluZXIgPSB0aGlzLl9vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IGNvbnRhaW5lciBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgIGlmIChvdmVybGF5Q29udGFpbmVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHNpYmxpbmdzID0gb3ZlcmxheUNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNoaWxkcmVuO1xuXG4gICAgICBmb3IgKGxldCBpID0gc2libGluZ3MubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgbGV0IHNpYmxpbmcgPSBzaWJsaW5nc1tpXTtcblxuICAgICAgICBpZiAoc2libGluZyAhPT0gb3ZlcmxheUNvbnRhaW5lciAmJlxuICAgICAgICAgIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTQ1JJUFQnICYmXG4gICAgICAgICAgc2libGluZy5ub2RlTmFtZSAhPT0gJ1NUWUxFJyAmJlxuICAgICAgICAgICFzaWJsaW5nLmhhc0F0dHJpYnV0ZSgnYXJpYS1saXZlJykpIHtcblxuICAgICAgICAgIHRoaXMuX2FyaWFIaWRkZW5FbGVtZW50cy5zZXQoc2libGluZywgc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIGFsbCBvZiB0aGUgZGlhbG9ncyBpbiBhbiBhcnJheS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VEaWFsb2dzKGRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgICBsZXQgaSA9IGRpYWxvZ3MubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgLy8gVGhlIGBfb3BlbkRpYWxvZ3NgIHByb3BlcnR5IGlzbid0IHVwZGF0ZWQgYWZ0ZXIgY2xvc2UgdW50aWwgdGhlIHJ4anMgc3Vic2NyaXB0aW9uXG4gICAgICAvLyBydW5zIG9uIHRoZSBuZXh0IG1pY3JvdGFzaywgaW4gYWRkaXRpb24gdG8gbW9kaWZ5aW5nIHRoZSBhcnJheSBhcyB3ZSdyZSBnb2luZ1xuICAgICAgLy8gdGhyb3VnaCBpdC4gV2UgbG9vcCB0aHJvdWdoIGFsbCBvZiB0aGVtIGFuZCBjYWxsIGNsb3NlIHdpdGhvdXQgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gdGhleSdsbCBiZSByZW1vdmVkIGZyb20gdGhlIGxpc3QgaW5zdGFudGFuZW91c2x5LlxuICAgICAgZGlhbG9nc1tpXS5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogQXBwbGllcyBkZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGRpYWxvZyBjb25maWcuXG4gKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSBtb2RpZmllZC5cbiAqIEBwYXJhbSBkZWZhdWx0T3B0aW9ucyBEZWZhdWx0IG9wdGlvbnMgcHJvdmlkZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWcsIGRlZmF1bHRPcHRpb25zPzogTWF0RGlhbG9nQ29uZmlnKTogTWF0RGlhbG9nQ29uZmlnIHtcbiAgcmV0dXJuIHsuLi5kZWZhdWx0T3B0aW9ucywgLi4uY29uZmlnfTtcbn1cbiJdfQ==