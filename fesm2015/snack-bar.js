import { OverlayModule, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { BasePortalOutlet, CdkPortalOutlet, PortalModule, PortalInjector, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { InjectionToken, Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, NgZone, ElementRef, ChangeDetectorRef, ViewChild, NgModule, TemplateRef, Injectable, Injector, Optional, SkipSelf, ɵɵdefineInjectable, ɵɵinject, INJECTOR } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-ref.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Event that is emitted when a snack bar is dismissed.
 * @record
 */
function MatSnackBarDismiss() { }
if (false) {
    /**
     * Whether the snack bar was dismissed using the action button.
     * @type {?}
     */
    MatSnackBarDismiss.prototype.dismissedByAction;
}
/**
 * Maximum amount of milliseconds that can be passed into setTimeout.
 * @type {?}
 */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;
/**
 * Reference to a snack bar dispatched from the snack bar service.
 * @template T
 */
class MatSnackBarRef {
    /**
     * @param {?} containerInstance
     * @param {?} _overlayRef
     */
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /**
         * Subject for notifying the user that the snack bar has been dismissed.
         */
        this._afterDismissed = new Subject();
        /**
         * Subject for notifying the user that the snack bar has opened and appeared.
         */
        this._afterOpened = new Subject();
        /**
         * Subject for notifying the user that the snack bar action was called.
         */
        this._onAction = new Subject();
        /**
         * Whether the snack bar was dismissed using the action button.
         */
        this._dismissedByAction = false;
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe((/**
         * @return {?}
         */
        () => this.dismiss()));
        containerInstance._onExit.subscribe((/**
         * @return {?}
         */
        () => this._finishDismiss()));
    }
    /**
     * Dismisses the snack bar.
     * @return {?}
     */
    dismiss() {
        if (!this._afterDismissed.closed) {
            this.containerInstance.exit();
        }
        clearTimeout(this._durationTimeoutId);
    }
    /**
     * Marks the snackbar action clicked.
     * @return {?}
     */
    dismissWithAction() {
        if (!this._onAction.closed) {
            this._dismissedByAction = true;
            this._onAction.next();
            this._onAction.complete();
        }
    }
    /**
     * Marks the snackbar action clicked.
     * @deprecated Use `dismissWithAction` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    closeWithAction() {
        this.dismissWithAction();
    }
    /**
     * Dismisses the snack bar after some duration
     * @param {?} duration
     * @return {?}
     */
    _dismissAfter(duration) {
        // Note that we need to cap the duration to the maximum value for setTimeout, because
        // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
        this._durationTimeoutId = setTimeout((/**
         * @return {?}
         */
        () => this.dismiss()), Math.min(duration, MAX_TIMEOUT));
    }
    /**
     * Marks the snackbar as opened
     * @return {?}
     */
    _open() {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    }
    /**
     * Cleans up the DOM after closing.
     * @private
     * @return {?}
     */
    _finishDismiss() {
        this._overlayRef.dispose();
        if (!this._onAction.closed) {
            this._onAction.complete();
        }
        this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
        this._afterDismissed.complete();
        this._dismissedByAction = false;
    }
    /**
     * Gets an observable that is notified when the snack bar is finished closing.
     * @return {?}
     */
    afterDismissed() {
        return this._afterDismissed.asObservable();
    }
    /**
     * Gets an observable that is notified when the snack bar has opened and appeared.
     * @return {?}
     */
    afterOpened() {
        return this.containerInstance._onEnter;
    }
    /**
     * Gets an observable that is notified when the snack bar action is called.
     * @return {?}
     */
    onAction() {
        return this._onAction.asObservable();
    }
}
if (false) {
    /**
     * The instance of the component making up the content of the snack bar.
     * @type {?}
     */
    MatSnackBarRef.prototype.instance;
    /**
     * The instance of the component making up the content of the snack bar.
     * \@docs-private
     * @type {?}
     */
    MatSnackBarRef.prototype.containerInstance;
    /**
     * Subject for notifying the user that the snack bar has been dismissed.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._afterDismissed;
    /**
     * Subject for notifying the user that the snack bar has opened and appeared.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._afterOpened;
    /**
     * Subject for notifying the user that the snack bar action was called.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._onAction;
    /**
     * Timeout ID for the duration setTimeout call. Used to clear the timeout if the snackbar is
     * dismissed before the duration passes.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._durationTimeoutId;
    /**
     * Whether the snack bar was dismissed using the action button.
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._dismissedByAction;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarRef.prototype._overlayRef;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-config.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Injection token that can be used to access the data that was passed in to a snack bar.
 * @type {?}
 */
const MAT_SNACK_BAR_DATA = new InjectionToken('MatSnackBarData');
/**
 * Configuration used when opening a snack-bar.
 * @template D
 */
class MatSnackBarConfig {
    constructor() {
        /**
         * The politeness level for the MatAriaLiveAnnouncer announcement.
         */
        this.politeness = 'assertive';
        /**
         * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
         * component or template, the announcement message will default to the specified message.
         */
        this.announcementMessage = '';
        /**
         * The length of time in milliseconds to wait before automatically dismissing the snack bar.
         */
        this.duration = 0;
        /**
         * Data being injected into the child component.
         */
        this.data = null;
        /**
         * The horizontal position to place the snack bar.
         */
        this.horizontalPosition = 'center';
        /**
         * The vertical position to place the snack bar.
         */
        this.verticalPosition = 'bottom';
    }
}
if (false) {
    /**
     * The politeness level for the MatAriaLiveAnnouncer announcement.
     * @type {?}
     */
    MatSnackBarConfig.prototype.politeness;
    /**
     * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
     * component or template, the announcement message will default to the specified message.
     * @type {?}
     */
    MatSnackBarConfig.prototype.announcementMessage;
    /**
     * The view container that serves as the parent for the snackbar for the purposes of dependency
     * injection. Note: this does not affect where the snackbar is inserted in the DOM.
     * @type {?}
     */
    MatSnackBarConfig.prototype.viewContainerRef;
    /**
     * The length of time in milliseconds to wait before automatically dismissing the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.duration;
    /**
     * Extra CSS classes to be added to the snack bar container.
     * @type {?}
     */
    MatSnackBarConfig.prototype.panelClass;
    /**
     * Text layout direction for the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.direction;
    /**
     * Data being injected into the child component.
     * @type {?}
     */
    MatSnackBarConfig.prototype.data;
    /**
     * The horizontal position to place the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.horizontalPosition;
    /**
     * The vertical position to place the snack bar.
     * @type {?}
     */
    MatSnackBarConfig.prototype.verticalPosition;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/simple-snack-bar.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
class SimpleSnackBar {
    /**
     * @param {?} snackBarRef
     * @param {?} data
     */
    constructor(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /**
     * Performs the action on the snack bar.
     * @return {?}
     */
    action() {
        this.snackBarRef.dismissWithAction();
    }
    /**
     * If the action button should be shown.
     * @return {?}
     */
    get hasAction() {
        return !!this.data.action;
    }
}
SimpleSnackBar.decorators = [
    { type: Component, args: [{
                selector: 'simple-snack-bar',
                template: "<span>{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-simple-snackbar',
                },
                styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}\n"]
            }] }
];
/** @nocollapse */
SimpleSnackBar.ctorParameters = () => [
    { type: MatSnackBarRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DATA,] }] }
];
if (false) {
    /**
     * Data that was injected into the snack bar.
     * @type {?}
     */
    SimpleSnackBar.prototype.data;
    /** @type {?} */
    SimpleSnackBar.prototype.snackBarRef;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-animations.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Animations used by the Material snack bar.
 * \@docs-private
 * @type {?}
 */
const matSnackBarAnimations = {
    /**
     * Animation that shows and hides a snack bar.
     */
    snackBarState: trigger('state', [
        state('void, hidden', style({
            transform: 'scale(0.8)',
            opacity: 0,
        })),
        state('visible', style({
            transform: 'scale(1)',
            opacity: 1,
        })),
        transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
        transition('* => void, * => hidden', animate('75ms cubic-bezier(0.4, 0.0, 1, 1)', style({
            opacity: 0
        }))),
    ])
};

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-container.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Internal component that wraps user-provided snack bar content.
 * \@docs-private
 */
class MatSnackBarContainer extends BasePortalOutlet {
    /**
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} snackBarConfig
     */
    constructor(_ngZone, _elementRef, _changeDetectorRef, snackBarConfig) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this.snackBarConfig = snackBarConfig;
        /**
         * Whether the component has been destroyed.
         */
        this._destroyed = false;
        /**
         * Subject for notifying that the snack bar has exited from view.
         */
        this._onExit = new Subject();
        /**
         * Subject for notifying that the snack bar has finished entering the view.
         */
        this._onEnter = new Subject();
        /**
         * The state of the snack bar animations.
         */
        this._animationState = 'void';
        /**
         * Attaches a DOM portal to the snack bar container.
         * @deprecated To be turned into a method.
         * \@breaking-change 10.0.0
         */
        this.attachDomPortal = (/**
         * @param {?} portal
         * @return {?}
         */
        (portal) => {
            this._assertNotAttached();
            this._applySnackBarClasses();
            return this._portalOutlet.attachDomPortal(portal);
        });
        // Based on the ARIA spec, `alert` and `status` roles have an
        // implicit `assertive` and `polite` politeness respectively.
        if (snackBarConfig.politeness === 'assertive' && !snackBarConfig.announcementMessage) {
            this._role = 'alert';
        }
        else if (snackBarConfig.politeness === 'off') {
            this._role = null;
        }
        else {
            this._role = 'status';
        }
    }
    /**
     * Attach a component portal as content to this snack bar container.
     * @template T
     * @param {?} portal
     * @return {?}
     */
    attachComponentPortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /**
     * Attach a template portal as content to this snack bar container.
     * @template C
     * @param {?} portal
     * @return {?}
     */
    attachTemplatePortal(portal) {
        this._assertNotAttached();
        this._applySnackBarClasses();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /**
     * Handle end of animations, updating the state of the snackbar.
     * @param {?} event
     * @return {?}
     */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
            this._completeExit();
        }
        if (toState === 'visible') {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            /** @type {?} */
            const onEnter = this._onEnter;
            this._ngZone.run((/**
             * @return {?}
             */
            () => {
                onEnter.next();
                onEnter.complete();
            }));
        }
    }
    /**
     * Begin animation of snack bar entrance into view.
     * @return {?}
     */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Begin animation of the snack bar exiting from view.
     * @return {?}
     */
    exit() {
        // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
        // where multiple snack bars are opened in quick succession (e.g. two consecutive calls to
        // `MatSnackBar.open`).
        this._animationState = 'hidden';
        // Mark this element with an 'exit' attribute to indicate that the snackbar has
        // been dismissed and will soon be removed from the DOM. This is used by the snackbar
        // test harness.
        this._elementRef.nativeElement.setAttribute('mat-exit', '');
        return this._onExit;
    }
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed = true;
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     * @private
     * @return {?}
     */
    _completeExit() {
        this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            this._onExit.next();
            this._onExit.complete();
        }));
    }
    /**
     * Applies the various positioning and user-configured CSS classes to the snack bar.
     * @private
     * @return {?}
     */
    _applySnackBarClasses() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const panelClasses = this.snackBarConfig.panelClass;
        if (panelClasses) {
            if (Array.isArray(panelClasses)) {
                // Note that we can't use a spread here, because IE doesn't support multiple arguments.
                panelClasses.forEach((/**
                 * @param {?} cssClass
                 * @return {?}
                 */
                cssClass => element.classList.add(cssClass)));
            }
            else {
                element.classList.add(panelClasses);
            }
        }
        if (this.snackBarConfig.horizontalPosition === 'center') {
            element.classList.add('mat-snack-bar-center');
        }
        if (this.snackBarConfig.verticalPosition === 'top') {
            element.classList.add('mat-snack-bar-top');
        }
    }
    /**
     * Asserts that no content is already attached to the container.
     * @private
     * @return {?}
     */
    _assertNotAttached() {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach snack bar content after content is already attached');
        }
    }
}
MatSnackBarContainer.decorators = [
    { type: Component, args: [{
                selector: 'snack-bar-container',
                template: "<ng-template cdkPortalOutlet></ng-template>\n",
                // In Ivy embedded views will be change detected from their declaration place, rather than
                // where they were stamped out. This means that we can't have the snack bar container be OnPush,
                // because it might cause snack bars that were opened from a template not to be out of date.
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                encapsulation: ViewEncapsulation.None,
                animations: [matSnackBarAnimations.snackBarState],
                host: {
                    '[attr.role]': '_role',
                    'class': 'mat-snack-bar-container',
                    '[@state]': '_animationState',
                    '(@state.done)': 'onAnimationEnd($event)'
                },
                styles: [".mat-snack-bar-container{border-radius:4px;box-sizing:border-box;display:block;margin:24px;max-width:33vw;min-width:344px;padding:14px 16px;min-height:48px;transform-origin:center}.cdk-high-contrast-active .mat-snack-bar-container{border:solid 1px}.mat-snack-bar-handset{width:100%}.mat-snack-bar-handset .mat-snack-bar-container{margin:8px;max-width:100%;min-width:0;width:100%}\n"]
            }] }
];
/** @nocollapse */
MatSnackBarContainer.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatSnackBarConfig }
];
MatSnackBarContainer.propDecorators = {
    _portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }]
};
if (false) {
    /**
     * Whether the component has been destroyed.
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._destroyed;
    /**
     * The portal outlet inside of this container into which the snack bar content will be loaded.
     * @type {?}
     */
    MatSnackBarContainer.prototype._portalOutlet;
    /**
     * Subject for notifying that the snack bar has exited from view.
     * @type {?}
     */
    MatSnackBarContainer.prototype._onExit;
    /**
     * Subject for notifying that the snack bar has finished entering the view.
     * @type {?}
     */
    MatSnackBarContainer.prototype._onEnter;
    /**
     * The state of the snack bar animations.
     * @type {?}
     */
    MatSnackBarContainer.prototype._animationState;
    /**
     * ARIA role for the snack bar container.
     * @type {?}
     */
    MatSnackBarContainer.prototype._role;
    /**
     * Attaches a DOM portal to the snack bar container.
     * @deprecated To be turned into a method.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    MatSnackBarContainer.prototype.attachDomPortal;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatSnackBarContainer.prototype._changeDetectorRef;
    /**
     * The snack bar configuration.
     * @type {?}
     */
    MatSnackBarContainer.prototype.snackBarConfig;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MatSnackBarModule {
}
MatSnackBarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    PortalModule,
                    CommonModule,
                    MatButtonModule,
                    MatCommonModule,
                ],
                exports: [MatSnackBarContainer, MatCommonModule],
                declarations: [MatSnackBarContainer, SimpleSnackBar],
                entryComponents: [MatSnackBarContainer, SimpleSnackBar],
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/snack-bar.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Injection token that can be used to specify default snack bar.
 * @type {?}
 */
const MAT_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken('mat-snack-bar-default-options', {
    providedIn: 'root',
    factory: MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
});
/**
 * \@docs-private
 * @return {?}
 */
function MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY() {
    return new MatSnackBarConfig();
}
/**
 * Service to dispatch Material Design snack bar messages.
 */
class MatSnackBar {
    /**
     * @param {?} _overlay
     * @param {?} _live
     * @param {?} _injector
     * @param {?} _breakpointObserver
     * @param {?} _parentSnackBar
     * @param {?} _defaultConfig
     */
    constructor(_overlay, _live, _injector, _breakpointObserver, _parentSnackBar, _defaultConfig) {
        this._overlay = _overlay;
        this._live = _live;
        this._injector = _injector;
        this._breakpointObserver = _breakpointObserver;
        this._parentSnackBar = _parentSnackBar;
        this._defaultConfig = _defaultConfig;
        /**
         * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
         * If there is a parent snack-bar service, all operations should delegate to that parent
         * via `_openedSnackBarRef`.
         */
        this._snackBarRefAtThisLevel = null;
    }
    /**
     * Reference to the currently opened snackbar at *any* level.
     * @return {?}
     */
    get _openedSnackBarRef() {
        /** @type {?} */
        const parent = this._parentSnackBar;
        return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set _openedSnackBarRef(value) {
        if (this._parentSnackBar) {
            this._parentSnackBar._openedSnackBarRef = value;
        }
        else {
            this._snackBarRefAtThisLevel = value;
        }
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     *
     * @template T
     * @param {?} component Component to be instantiated.
     * @param {?=} config Extra configuration for the snack bar.
     * @return {?}
     */
    openFromComponent(component, config) {
        return (/** @type {?} */ (this._attach(component, config)));
    }
    /**
     * Creates and dispatches a snack bar with a custom template for the content, removing any
     * currently opened snack bars.
     *
     * @param {?} template Template to be instantiated.
     * @param {?=} config Extra configuration for the snack bar.
     * @return {?}
     */
    openFromTemplate(template, config) {
        return this._attach(template, config);
    }
    /**
     * Opens a snackbar with a message and an optional action.
     * @param {?} message The message to show in the snackbar.
     * @param {?=} action The label for the snackbar action.
     * @param {?=} config Additional configuration options for the snackbar.
     * @return {?}
     */
    open(message, action = '', config) {
        /** @type {?} */
        const _config = Object.assign(Object.assign({}, this._defaultConfig), config);
        // Since the user doesn't have access to the component, we can
        // override the data to pass in our own message and action.
        _config.data = { message, action };
        if (!_config.announcementMessage) {
            _config.announcementMessage = message;
        }
        return this.openFromComponent(SimpleSnackBar, _config);
    }
    /**
     * Dismisses the currently-visible snack bar.
     * @return {?}
     */
    dismiss() {
        if (this._openedSnackBarRef) {
            this._openedSnackBarRef.dismiss();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // Only dismiss the snack bar at the current level on destroy.
        if (this._snackBarRefAtThisLevel) {
            this._snackBarRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the snack bar container component to the overlay.
     * @private
     * @param {?} overlayRef
     * @param {?} config
     * @return {?}
     */
    _attachSnackBarContainer(overlayRef, config) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        /** @type {?} */
        const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatSnackBarConfig, config]
        ]));
        /** @type {?} */
        const containerPortal = new ComponentPortal(MatSnackBarContainer, config.viewContainerRef, injector);
        /** @type {?} */
        const containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component or a template as the content of the snack bar container.
     * @private
     * @template T
     * @param {?} content
     * @param {?=} userConfig
     * @return {?}
     */
    _attach(content, userConfig) {
        /** @type {?} */
        const config = Object.assign(Object.assign(Object.assign({}, new MatSnackBarConfig()), this._defaultConfig), userConfig);
        /** @type {?} */
        const overlayRef = this._createOverlay(config);
        /** @type {?} */
        const container = this._attachSnackBarContainer(overlayRef, config);
        /** @type {?} */
        const snackBarRef = new MatSnackBarRef(container, overlayRef);
        if (content instanceof TemplateRef) {
            /** @type {?} */
            const portal = new TemplatePortal(content, (/** @type {?} */ (null)), (/** @type {?} */ ({
                $implicit: config.data,
                snackBarRef
            })));
            snackBarRef.instance = container.attachTemplatePortal(portal);
        }
        else {
            /** @type {?} */
            const injector = this._createInjector(config, snackBarRef);
            /** @type {?} */
            const portal = new ComponentPortal(content, undefined, injector);
            /** @type {?} */
            const contentRef = container.attachComponentPortal(portal);
            // We can't pass this via the injector, because the injector is created earlier.
            snackBarRef.instance = contentRef.instance;
        }
        // Subscribe to the breakpoint observer and attach the mat-snack-bar-handset class as
        // appropriate. This class is applied to the overlay element because the overlay must expand to
        // fill the width of the screen for full width snackbars.
        this._breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(takeUntil(overlayRef.detachments())).subscribe((/**
         * @param {?} state
         * @return {?}
         */
        state => {
            /** @type {?} */
            const classList = overlayRef.overlayElement.classList;
            /** @type {?} */
            const className = 'mat-snack-bar-handset';
            state.matches ? classList.add(className) : classList.remove(className);
        }));
        this._animateSnackBar(snackBarRef, config);
        this._openedSnackBarRef = snackBarRef;
        return this._openedSnackBarRef;
    }
    /**
     * Animates the old snack bar out and the new one in.
     * @private
     * @param {?} snackBarRef
     * @param {?} config
     * @return {?}
     */
    _animateSnackBar(snackBarRef, config) {
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe((/**
         * @return {?}
         */
        () => {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (this._openedSnackBarRef == snackBarRef) {
                this._openedSnackBarRef = null;
            }
            if (config.announcementMessage) {
                this._live.clear();
            }
        }));
        if (this._openedSnackBarRef) {
            // If a snack bar is already in view, dismiss it and enter the
            // new snack bar after exit animation is complete.
            this._openedSnackBarRef.afterDismissed().subscribe((/**
             * @return {?}
             */
            () => {
                snackBarRef.containerInstance.enter();
            }));
            this._openedSnackBarRef.dismiss();
        }
        else {
            // If no snack bar is in view, enter the new snack bar.
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration && config.duration > 0) {
            snackBarRef.afterOpened().subscribe((/**
             * @return {?}
             */
            () => snackBarRef._dismissAfter((/** @type {?} */ (config.duration)))));
        }
        if (config.announcementMessage) {
            this._live.announce(config.announcementMessage, config.politeness);
        }
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @private
     * @param {?} config The user-specified snack bar config.
     * @return {?}
     */
    _createOverlay(config) {
        /** @type {?} */
        const overlayConfig = new OverlayConfig();
        overlayConfig.direction = config.direction;
        /** @type {?} */
        let positionStrategy = this._overlay.position().global();
        // Set horizontal position.
        /** @type {?} */
        const isRtl = config.direction === 'rtl';
        /** @type {?} */
        const isLeft = (config.horizontalPosition === 'left' ||
            (config.horizontalPosition === 'start' && !isRtl) ||
            (config.horizontalPosition === 'end' && isRtl));
        /** @type {?} */
        const isRight = !isLeft && config.horizontalPosition !== 'center';
        if (isLeft) {
            positionStrategy.left('0');
        }
        else if (isRight) {
            positionStrategy.right('0');
        }
        else {
            positionStrategy.centerHorizontally();
        }
        // Set horizontal position.
        if (config.verticalPosition === 'top') {
            positionStrategy.top('0');
        }
        else {
            positionStrategy.bottom('0');
        }
        overlayConfig.positionStrategy = positionStrategy;
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a snack bar component.
     * @private
     * @template T
     * @param {?} config Config that was used to create the snack bar.
     * @param {?} snackBarRef Reference to the snack bar.
     * @return {?}
     */
    _createInjector(config, snackBarRef) {
        /** @type {?} */
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        return new PortalInjector(userInjector || this._injector, new WeakMap([
            [MatSnackBarRef, snackBarRef],
            [MAT_SNACK_BAR_DATA, config.data]
        ]));
    }
}
MatSnackBar.decorators = [
    { type: Injectable, args: [{ providedIn: MatSnackBarModule },] }
];
/** @nocollapse */
MatSnackBar.ctorParameters = () => [
    { type: Overlay },
    { type: LiveAnnouncer },
    { type: Injector },
    { type: BreakpointObserver },
    { type: MatSnackBar, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: MatSnackBarConfig, decorators: [{ type: Inject, args: [MAT_SNACK_BAR_DEFAULT_OPTIONS,] }] }
];
/** @nocollapse */ MatSnackBar.ɵprov = ɵɵdefineInjectable({ factory: function MatSnackBar_Factory() { return new MatSnackBar(ɵɵinject(Overlay), ɵɵinject(LiveAnnouncer), ɵɵinject(INJECTOR), ɵɵinject(BreakpointObserver), ɵɵinject(MatSnackBar, 12), ɵɵinject(MAT_SNACK_BAR_DEFAULT_OPTIONS)); }, token: MatSnackBar, providedIn: MatSnackBarModule });
if (false) {
    /**
     * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
     * If there is a parent snack-bar service, all operations should delegate to that parent
     * via `_openedSnackBarRef`.
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._snackBarRefAtThisLevel;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._live;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._injector;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._breakpointObserver;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._parentSnackBar;
    /**
     * @type {?}
     * @private
     */
    MatSnackBar.prototype._defaultConfig;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/snack-bar/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MAT_SNACK_BAR_DATA, MAT_SNACK_BAR_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY, MatSnackBar, MatSnackBarConfig, MatSnackBarContainer, MatSnackBarModule, MatSnackBarRef, SimpleSnackBar, matSnackBarAnimations };
//# sourceMappingURL=snack-bar.js.map
