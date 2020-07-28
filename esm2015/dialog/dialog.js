/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
/**
 * Service to open Material Design modal dialogs.
 */
export class MatDialog {
    constructor(_overlay, _injector, 
    /**
     * @deprecated `_location` parameter to be removed.
     * @breaking-change 10.0.0
     */
    _location, _defaultOptions, scrollStrategy, _parentDialog, _overlayContainer) {
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
        this.afterAllClosed = defer(() => this.openDialogs.length ?
            this._getAfterAllClosed() :
            this._getAfterAllClosed().pipe(startWith(undefined)));
        this._scrollStrategy = scrollStrategy;
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
    /**
     * Opens a modal dialog containing the given component.
     * @param componentOrTemplateRef Type of the component to load into the dialog,
     *     or a TemplateRef to instantiate as the dialog content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened dialog.
     */
    open(componentOrTemplateRef, config) {
        config = _applyConfigDefaults(config, this._defaultOptions || new MatDialogConfig());
        if (config.id && this.getDialogById(config.id)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const overlayRef = this._createOverlay(config);
        const dialogContainer = this._attachDialogContainer(overlayRef, config);
        const dialogRef = this._attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        // If this is the first dialog that we're opening, hide all the non-overlay content.
        if (!this.openDialogs.length) {
            this._hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
        this.afterOpened.next(dialogRef);
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
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param config The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    _createOverlay(config) {
        const overlayConfig = this._getOverlayConfig(config);
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an overlay config from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    _getOverlayConfig(dialogConfig) {
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
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    _attachDialogContainer(overlay, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatDialogConfig, useValue: config }]
        });
        const containerPortal = new ComponentPortal(MatDialogContainer, config.viewContainerRef, injector, config.componentFactoryResolver);
        const containerRef = overlay.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Attaches the user-provided component to the already-created MatDialogContainer.
     * @param componentOrTemplateRef The type of component being loaded into the dialog,
     *     or a TemplateRef to instantiate as the content.
     * @param dialogContainer Reference to the wrapping MatDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @param config The dialog configuration.
     * @returns A promise resolving to the MatDialogRef that should be returned to the user.
     */
    _attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        const dialogRef = new MatDialogRef(overlayRef, dialogContainer, config.id);
        if (componentOrTemplateRef instanceof TemplateRef) {
            dialogContainer.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, { $implicit: config.data, dialogRef }));
        }
        else {
            const injector = this._createInjector(config, dialogRef, dialogContainer);
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
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
     * @param config Config object that is used to construct the dialog.
     * @param dialogRef Reference to the dialog.
     * @param container Dialog container element that wraps all of the contents.
     * @returns The custom injector that can be used inside the dialog.
     */
    _createInjector(config, dialogRef, dialogContainer) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        // The MatDialogContainer is injected in the portal as the MatDialogContainer and the dialog's
        // content are created out of the same ViewContainerRef and as such, are siblings for injector
        // purposes. To allow the hierarchy that is expected, the MatDialogContainer is explicitly
        // added to the injection tokens.
        const providers = [
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
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
    /**
     * Removes a dialog from the array of open dialogs.
     * @param dialogRef Dialog to be removed.
     */
    _removeOpenDialog(dialogRef) {
        const index = this.openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this._ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this._ariaHiddenElements.clear();
                this._getAfterAllClosed().next();
            }
        }
    }
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    _hideNonDialogContentFromAssistiveTechnology() {
        const overlayContainer = this._overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
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
    /** Closes all of the dialogs in an array. */
    _closeDialogs(dialogs) {
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
MatDialog.ctorParameters = () => [
    { type: Overlay },
    { type: Injector },
    { type: Location, decorators: [{ type: Optional }] },
    { type: MatDialogConfig, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DIALOG_DEFAULT_OPTIONS,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_SCROLL_STRATEGY,] }] },
    { type: MatDialog, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: OverlayContainer }
];
/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(config, defaultOptions) {
    return Object.assign(Object.assign({}, defaultOptions), config);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RpYWxvZy9kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGdCQUFnQixHQUdqQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWlCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25GLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUVSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxHQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRzFDLDBGQUEwRjtBQUMxRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFeEUsMEVBQTBFO0FBQzFFLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUNuQyxJQUFJLGNBQWMsQ0FBa0IsNEJBQTRCLENBQUMsQ0FBQztBQUV0RSxvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQ25DLElB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O0FBQ3hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheUNvbnRhaW5lcixcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlLCBUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgU3RhdGljUHJvdmlkZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtkZWZlciwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdERpYWxvZ0NvbmZpZ30gZnJvbSAnLi9kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7TWF0RGlhbG9nQ29udGFpbmVyfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IHtNYXREaWFsb2dSZWZ9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkaWFsb2cuICovXG5leHBvcnQgY29uc3QgTUFUX0RJQUxPR19EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01hdERpYWxvZ0RhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkaWFsb2cgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdERpYWxvZ0NvbmZpZz4oJ21hdC1kaWFsb2ctZGVmYXVsdC1vcHRpb25zJyk7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGRpYWxvZyBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6XG4gICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfRElBTE9HX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuXG4vKipcbiAqIFNlcnZpY2UgdG8gb3BlbiBNYXRlcmlhbCBEZXNpZ24gbW9kYWwgZGlhbG9ncy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hdERpYWxvZyBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWw6IE1hdERpYWxvZ1JlZjxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4oKTtcbiAgcHJpdmF0ZSBfYXJpYUhpZGRlbkVsZW1lbnRzID0gbmV3IE1hcDxFbGVtZW50LCBzdHJpbmd8bnVsbD4oKTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudGx5LW9wZW4gZGlhbG9ncy4gKi9cbiAgZ2V0IG9wZW5EaWFsb2dzKCk6IE1hdERpYWxvZ1JlZjxhbnk+W10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cub3BlbkRpYWxvZ3MgOiB0aGlzLl9vcGVuRGlhbG9nc0F0VGhpc0xldmVsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBnZXQgYWZ0ZXJPcGVuZWQoKTogU3ViamVjdDxNYXREaWFsb2dSZWY8YW55Pj4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnREaWFsb2cgPyB0aGlzLl9wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuZWQgOiB0aGlzLl9hZnRlck9wZW5lZEF0VGhpc0xldmVsO1xuICB9XG5cbiAgX2dldEFmdGVyQWxsQ2xvc2VkKCk6IFN1YmplY3Q8dm9pZD4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudERpYWxvZztcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9nZXRBZnRlckFsbENsb3NlZCgpIDogdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIC8vIFRPRE8gKGplbGJvdXJuKTogdGlnaHRlbiB0aGUgdHlwaW5nIHJpZ2h0LWhhbmQgc2lkZSBvZiB0aGlzIGV4cHJlc3Npb24uXG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGFsbCBvcGVuIGRpYWxvZyBoYXZlIGZpbmlzaGVkIGNsb3NpbmcuXG4gICAqIFdpbGwgZW1pdCBvbiBzdWJzY3JpYmUgaWYgdGhlcmUgYXJlIG5vIG9wZW4gZGlhbG9ncyB0byBiZWdpbiB3aXRoLlxuICAgKi9cbiAgcmVhZG9ubHkgYWZ0ZXJBbGxDbG9zZWQ6IE9ic2VydmFibGU8dm9pZD4gPSBkZWZlcigoKSA9PiB0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCA/XG4gICAgICB0aGlzLl9nZXRBZnRlckFsbENsb3NlZCgpIDpcbiAgICAgIHRoaXMuX2dldEFmdGVyQWxsQ2xvc2VkKCkucGlwZShzdGFydFdpdGgodW5kZWZpbmVkKSkpIGFzIE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAvKipcbiAgICAgICAqIEBkZXByZWNhdGVkIGBfbG9jYXRpb25gIHBhcmFtZXRlciB0byBiZSByZW1vdmVkLlxuICAgICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgICAqL1xuICAgICAgQE9wdGlvbmFsKCkgX2xvY2F0aW9uOiBMb2NhdGlvbixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RJQUxPR19ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXREaWFsb2dDb25maWcsXG4gICAgICBASW5qZWN0KE1BVF9ESUFMT0dfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBfcGFyZW50RGlhbG9nOiBNYXREaWFsb2csXG4gICAgICBwcml2YXRlIF9vdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG1vZGFsIGRpYWxvZyBjb250YWluaW5nIHRoZSBnaXZlbiBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb21wb25lbnRPclRlbXBsYXRlUmVmIFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGRpYWxvZyxcbiAgICogICAgIG9yIGEgVGVtcGxhdGVSZWYgdG8gaW5zdGFudGlhdGUgYXMgdGhlIGRpYWxvZyBjb250ZW50LlxuICAgKiBAcGFyYW0gY29uZmlnIEV4dHJhIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBuZXdseS1vcGVuZWQgZGlhbG9nLlxuICAgKi9cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55Pihjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICAgICAgY29uZmlnPzogTWF0RGlhbG9nQ29uZmlnPEQ+KTogTWF0RGlhbG9nUmVmPFQsIFI+IHtcblxuICAgIGNvbmZpZyA9IF9hcHBseUNvbmZpZ0RlZmF1bHRzKGNvbmZpZywgdGhpcy5fZGVmYXVsdE9wdGlvbnMgfHwgbmV3IE1hdERpYWxvZ0NvbmZpZygpKTtcblxuICAgIGlmIChjb25maWcuaWQgJiYgdGhpcy5nZXREaWFsb2dCeUlkKGNvbmZpZy5pZCkpIHtcbiAgICAgIHRocm93IEVycm9yKGBEaWFsb2cgd2l0aCBpZCBcIiR7Y29uZmlnLmlkfVwiIGV4aXN0cyBhbHJlYWR5LiBUaGUgZGlhbG9nIGlkIG11c3QgYmUgdW5pcXVlLmApO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgY29uc3QgZGlhbG9nQ29udGFpbmVyID0gdGhpcy5fYXR0YWNoRGlhbG9nQ29udGFpbmVyKG92ZXJsYXlSZWYsIGNvbmZpZyk7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5fYXR0YWNoRGlhbG9nQ29udGVudDxULCBSPihjb21wb25lbnRPclRlbXBsYXRlUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyk7XG5cbiAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBkaWFsb2cgdGhhdCB3ZSdyZSBvcGVuaW5nLCBoaWRlIGFsbCB0aGUgbm9uLW92ZXJsYXkgY29udGVudC5cbiAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuRGlhbG9ncy5wdXNoKGRpYWxvZ1JlZik7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX3JlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmKSk7XG4gICAgdGhpcy5hZnRlck9wZW5lZC5uZXh0KGRpYWxvZ1JlZik7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyBhbGwgb2YgdGhlIGN1cnJlbnRseS1vcGVuIGRpYWxvZ3MuXG4gICAqL1xuICBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5vcGVuRGlhbG9ncyk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gb3BlbiBkaWFsb2cgYnkgaXRzIGlkLlxuICAgKiBAcGFyYW0gaWQgSUQgdG8gdXNlIHdoZW4gbG9va2luZyB1cCB0aGUgZGlhbG9nLlxuICAgKi9cbiAgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogTWF0RGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wZW5EaWFsb2dzLmZpbmQoZGlhbG9nID0+IGRpYWxvZy5pZCA9PT0gaWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gT25seSBjbG9zZSB0aGUgZGlhbG9ncyBhdCB0aGlzIGxldmVsIG9uIGRlc3Ryb3lcbiAgICAvLyBzaW5jZSB0aGUgcGFyZW50IHNlcnZpY2UgbWF5IHN0aWxsIGJlIGFjdGl2ZS5cbiAgICB0aGlzLl9jbG9zZURpYWxvZ3ModGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbCk7XG4gICAgdGhpcy5fYWZ0ZXJBbGxDbG9zZWRBdFRoaXNMZXZlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FmdGVyT3BlbmVkQXRUaGlzTGV2ZWwuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBvdmVybGF5IGludG8gd2hpY2ggdGhlIGRpYWxvZyB3aWxsIGJlIGxvYWRlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIE92ZXJsYXlSZWYgZm9yIHRoZSBjcmVhdGVkIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IHRoaXMuX2dldE92ZXJsYXlDb25maWcoY29uZmlnKTtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvdmVybGF5IGNvbmZpZyBmcm9tIGEgZGlhbG9nIGNvbmZpZy5cbiAgICogQHBhcmFtIGRpYWxvZ0NvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIFRoZSBvdmVybGF5IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKGRpYWxvZ0NvbmZpZzogTWF0RGlhbG9nQ29uZmlnKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogZGlhbG9nQ29uZmlnLnNjcm9sbFN0cmF0ZWd5IHx8IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICBwYW5lbENsYXNzOiBkaWFsb2dDb25maWcucGFuZWxDbGFzcyxcbiAgICAgIGhhc0JhY2tkcm9wOiBkaWFsb2dDb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBkaXJlY3Rpb246IGRpYWxvZ0NvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBtaW5XaWR0aDogZGlhbG9nQ29uZmlnLm1pbldpZHRoLFxuICAgICAgbWluSGVpZ2h0OiBkaWFsb2dDb25maWcubWluSGVpZ2h0LFxuICAgICAgbWF4V2lkdGg6IGRpYWxvZ0NvbmZpZy5tYXhXaWR0aCxcbiAgICAgIG1heEhlaWdodDogZGlhbG9nQ29uZmlnLm1heEhlaWdodCxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IGRpYWxvZ0NvbmZpZy5jbG9zZU9uTmF2aWdhdGlvblxuICAgIH0pO1xuXG4gICAgaWYgKGRpYWxvZ0NvbmZpZy5iYWNrZHJvcENsYXNzKSB7XG4gICAgICBzdGF0ZS5iYWNrZHJvcENsYXNzID0gZGlhbG9nQ29uZmlnLmJhY2tkcm9wQ2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGFuIE1hdERpYWxvZ0NvbnRhaW5lciB0byBhIGRpYWxvZydzIGFscmVhZHktY3JlYXRlZCBvdmVybGF5LlxuICAgKiBAcGFyYW0gb3ZlcmxheSBSZWZlcmVuY2UgdG8gdGhlIGRpYWxvZydzIHVuZGVybHlpbmcgb3ZlcmxheS5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gYSBDb21wb25lbnRSZWYgZm9yIHRoZSBhdHRhY2hlZCBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hEaWFsb2dDb250YWluZXIob3ZlcmxheTogT3ZlcmxheVJlZiwgY29uZmlnOiBNYXREaWFsb2dDb25maWcpOiBNYXREaWFsb2dDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXREaWFsb2dDb25maWcsIHVzZVZhbHVlOiBjb25maWd9XVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChNYXREaWFsb2dDb250YWluZXIsXG4gICAgICAgIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLCBpbmplY3RvciwgY29uZmlnLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG4gICAgY29uc3QgY29udGFpbmVyUmVmID0gb3ZlcmxheS5hdHRhY2g8TWF0RGlhbG9nQ29udGFpbmVyPihjb250YWluZXJQb3J0YWwpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgdXNlci1wcm92aWRlZCBjb21wb25lbnQgdG8gdGhlIGFscmVhZHktY3JlYXRlZCBNYXREaWFsb2dDb250YWluZXIuXG4gICAqIEBwYXJhbSBjb21wb25lbnRPclRlbXBsYXRlUmVmIFRoZSB0eXBlIG9mIGNvbXBvbmVudCBiZWluZyBsb2FkZWQgaW50byB0aGUgZGlhbG9nLFxuICAgKiAgICAgb3IgYSBUZW1wbGF0ZVJlZiB0byBpbnN0YW50aWF0ZSBhcyB0aGUgY29udGVudC5cbiAgICogQHBhcmFtIGRpYWxvZ0NvbnRhaW5lciBSZWZlcmVuY2UgdG8gdGhlIHdyYXBwaW5nIE1hdERpYWxvZ0NvbnRhaW5lci5cbiAgICogQHBhcmFtIG92ZXJsYXlSZWYgUmVmZXJlbmNlIHRvIHRoZSBvdmVybGF5IGluIHdoaWNoIHRoZSBkaWFsb2cgcmVzaWRlcy5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSByZXNvbHZpbmcgdG8gdGhlIE1hdERpYWxvZ1JlZiB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCB0byB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX2F0dGFjaERpYWxvZ0NvbnRlbnQ8VCwgUj4oXG4gICAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IE1hdERpYWxvZ0NvbnRhaW5lcixcbiAgICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICBjb25maWc6IE1hdERpYWxvZ0NvbmZpZyk6IE1hdERpYWxvZ1JlZjxULCBSPiB7XG5cbiAgICAvLyBDcmVhdGUgYSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3ZSdyZSBjcmVhdGluZyBpbiBvcmRlciB0byBnaXZlIHRoZSB1c2VyIGEgaGFuZGxlXG4gICAgLy8gdG8gbW9kaWZ5IGFuZCBjbG9zZSBpdC5cbiAgICBjb25zdCBkaWFsb2dSZWYgPVxuICAgICAgICBuZXcgTWF0RGlhbG9nUmVmPFQsIFI+KG92ZXJsYXlSZWYsIGRpYWxvZ0NvbnRhaW5lciwgY29uZmlnLmlkKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgbmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLFxuICAgICAgICAgIDxhbnk+eyRpbXBsaWNpdDogY29uZmlnLmRhdGEsIGRpYWxvZ1JlZn0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLl9jcmVhdGVJbmplY3RvcjxUPihjb25maWcsIGRpYWxvZ1JlZiwgZGlhbG9nQ29udGFpbmVyKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBkaWFsb2dDb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KFxuICAgICAgICAgIG5ldyBDb21wb25lbnRQb3J0YWwoY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgY29uZmlnLnZpZXdDb250YWluZXJSZWYsIGluamVjdG9yKSk7XG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIGRpYWxvZ1JlZlxuICAgICAgLnVwZGF0ZVNpemUoY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0KVxuICAgICAgLnVwZGF0ZVBvc2l0aW9uKGNvbmZpZy5wb3NpdGlvbik7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjdXN0b20gaW5qZWN0b3IgdG8gYmUgdXNlZCBpbnNpZGUgdGhlIGRpYWxvZy4gVGhpcyBhbGxvd3MgYSBjb21wb25lbnQgbG9hZGVkIGluc2lkZVxuICAgKiBvZiBhIGRpYWxvZyB0byBjbG9zZSBpdHNlbGYgYW5kLCBvcHRpb25hbGx5LCB0byByZXR1cm4gYSB2YWx1ZS5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgb2JqZWN0IHRoYXQgaXMgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGRpYWxvZ1JlZiBSZWZlcmVuY2UgdG8gdGhlIGRpYWxvZy5cbiAgICogQHBhcmFtIGNvbnRhaW5lciBEaWFsb2cgY29udGFpbmVyIGVsZW1lbnQgdGhhdCB3cmFwcyBhbGwgb2YgdGhlIGNvbnRlbnRzLlxuICAgKiBAcmV0dXJucyBUaGUgY3VzdG9tIGluamVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgaW5zaWRlIHRoZSBkaWFsb2cuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihcbiAgICAgIGNvbmZpZzogTWF0RGlhbG9nQ29uZmlnLFxuICAgICAgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8VD4sXG4gICAgICBkaWFsb2dDb250YWluZXI6IE1hdERpYWxvZ0NvbnRhaW5lcik6IEluamVjdG9yIHtcblxuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcblxuICAgIC8vIFRoZSBNYXREaWFsb2dDb250YWluZXIgaXMgaW5qZWN0ZWQgaW4gdGhlIHBvcnRhbCBhcyB0aGUgTWF0RGlhbG9nQ29udGFpbmVyIGFuZCB0aGUgZGlhbG9nJ3NcbiAgICAvLyBjb250ZW50IGFyZSBjcmVhdGVkIG91dCBvZiB0aGUgc2FtZSBWaWV3Q29udGFpbmVyUmVmIGFuZCBhcyBzdWNoLCBhcmUgc2libGluZ3MgZm9yIGluamVjdG9yXG4gICAgLy8gcHVycG9zZXMuIFRvIGFsbG93IHRoZSBoaWVyYXJjaHkgdGhhdCBpcyBleHBlY3RlZCwgdGhlIE1hdERpYWxvZ0NvbnRhaW5lciBpcyBleHBsaWNpdGx5XG4gICAgLy8gYWRkZWQgdG8gdGhlIGluamVjdGlvbiB0b2tlbnMuXG4gICAgY29uc3QgcHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdID0gW1xuICAgICAge3Byb3ZpZGU6IE1hdERpYWxvZ0NvbnRhaW5lciwgdXNlVmFsdWU6IGRpYWxvZ0NvbnRhaW5lcn0sXG4gICAgICB7cHJvdmlkZTogTUFUX0RJQUxPR19EQVRBLCB1c2VWYWx1ZTogY29uZmlnLmRhdGF9LFxuICAgICAge3Byb3ZpZGU6IE1hdERpYWxvZ1JlZiwgdXNlVmFsdWU6IGRpYWxvZ1JlZn1cbiAgICBdO1xuXG4gICAgaWYgKGNvbmZpZy5kaXJlY3Rpb24gJiZcbiAgICAgICAgKCF1c2VySW5qZWN0b3IgfHwgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCkpKSB7XG4gICAgICBwcm92aWRlcnMucHVzaCh7XG4gICAgICAgIHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICB1c2VWYWx1ZToge3ZhbHVlOiBjb25maWcuZGlyZWN0aW9uLCBjaGFuZ2U6IG9ic2VydmFibGVPZigpfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7cGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIHByb3ZpZGVyc30pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBkaWFsb2cgZnJvbSB0aGUgYXJyYXkgb2Ygb3BlbiBkaWFsb2dzLlxuICAgKiBAcGFyYW0gZGlhbG9nUmVmIERpYWxvZyB0byBiZSByZW1vdmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlT3BlbkRpYWxvZyhkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLm9wZW5EaWFsb2dzLmluZGV4T2YoZGlhbG9nUmVmKTtcblxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm9wZW5EaWFsb2dzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIC8vIElmIGFsbCB0aGUgZGlhbG9ncyB3ZXJlIGNsb3NlZCwgcmVtb3ZlL3Jlc3RvcmUgdGhlIGBhcmlhLWhpZGRlbmBcbiAgICAgIC8vIHRvIGEgdGhlIHNpYmxpbmdzIGFuZCBlbWl0IHRvIHRoZSBgYWZ0ZXJBbGxDbG9zZWRgIHN0cmVhbS5cbiAgICAgIGlmICghdGhpcy5vcGVuRGlhbG9ncy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fYXJpYUhpZGRlbkVsZW1lbnRzLmZvckVhY2goKHByZXZpb3VzVmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgcHJldmlvdXNWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fYXJpYUhpZGRlbkVsZW1lbnRzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2dldEFmdGVyQWxsQ2xvc2VkKCkubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyBhbGwgb2YgdGhlIGNvbnRlbnQgdGhhdCBpc24ndCBhbiBvdmVybGF5IGZyb20gYXNzaXN0aXZlIHRlY2hub2xvZ3kuXG4gICAqL1xuICBwcml2YXRlIF9oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCkge1xuICAgIGNvbnN0IG92ZXJsYXlDb250YWluZXIgPSB0aGlzLl9vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IGNvbnRhaW5lciBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgIGlmIChvdmVybGF5Q29udGFpbmVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHNpYmxpbmdzID0gb3ZlcmxheUNvbnRhaW5lci5wYXJlbnRFbGVtZW50LmNoaWxkcmVuO1xuXG4gICAgICBmb3IgKGxldCBpID0gc2libGluZ3MubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgbGV0IHNpYmxpbmcgPSBzaWJsaW5nc1tpXTtcblxuICAgICAgICBpZiAoc2libGluZyAhPT0gb3ZlcmxheUNvbnRhaW5lciAmJlxuICAgICAgICAgIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTQ1JJUFQnICYmXG4gICAgICAgICAgc2libGluZy5ub2RlTmFtZSAhPT0gJ1NUWUxFJyAmJlxuICAgICAgICAgICFzaWJsaW5nLmhhc0F0dHJpYnV0ZSgnYXJpYS1saXZlJykpIHtcblxuICAgICAgICAgIHRoaXMuX2FyaWFIaWRkZW5FbGVtZW50cy5zZXQoc2libGluZywgc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIGFsbCBvZiB0aGUgZGlhbG9ncyBpbiBhbiBhcnJheS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VEaWFsb2dzKGRpYWxvZ3M6IE1hdERpYWxvZ1JlZjxhbnk+W10pIHtcbiAgICBsZXQgaSA9IGRpYWxvZ3MubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgLy8gVGhlIGBfb3BlbkRpYWxvZ3NgIHByb3BlcnR5IGlzbid0IHVwZGF0ZWQgYWZ0ZXIgY2xvc2UgdW50aWwgdGhlIHJ4anMgc3Vic2NyaXB0aW9uXG4gICAgICAvLyBydW5zIG9uIHRoZSBuZXh0IG1pY3JvdGFzaywgaW4gYWRkaXRpb24gdG8gbW9kaWZ5aW5nIHRoZSBhcnJheSBhcyB3ZSdyZSBnb2luZ1xuICAgICAgLy8gdGhyb3VnaCBpdC4gV2UgbG9vcCB0aHJvdWdoIGFsbCBvZiB0aGVtIGFuZCBjYWxsIGNsb3NlIHdpdGhvdXQgYXNzdW1pbmcgdGhhdFxuICAgICAgLy8gdGhleSdsbCBiZSByZW1vdmVkIGZyb20gdGhlIGxpc3QgaW5zdGFudGFuZW91c2x5LlxuICAgICAgZGlhbG9nc1tpXS5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogQXBwbGllcyBkZWZhdWx0IG9wdGlvbnMgdG8gdGhlIGRpYWxvZyBjb25maWcuXG4gKiBAcGFyYW0gY29uZmlnIENvbmZpZyB0byBiZSBtb2RpZmllZC5cbiAqIEBwYXJhbSBkZWZhdWx0T3B0aW9ucyBEZWZhdWx0IG9wdGlvbnMgcHJvdmlkZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBfYXBwbHlDb25maWdEZWZhdWx0cyhcbiAgICBjb25maWc/OiBNYXREaWFsb2dDb25maWcsIGRlZmF1bHRPcHRpb25zPzogTWF0RGlhbG9nQ29uZmlnKTogTWF0RGlhbG9nQ29uZmlnIHtcbiAgcmV0dXJuIHsuLi5kZWZhdWx0T3B0aW9ucywgLi4uY29uZmlnfTtcbn1cbiJdfQ==