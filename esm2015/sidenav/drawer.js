/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { FocusMonitor, FocusTrapFactory } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewEncapsulation, HostListener, HostBinding, } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, startWith, take, takeUntil, distinctUntilChanged, } from 'rxjs/operators';
import { matDrawerAnimations } from './drawer-animations';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Throws an exception when two MatDrawer are matching the same position.
 * \@docs-private
 * @param {?} position
 * @return {?}
 */
export function throwMatDuplicatedDrawerError(position) {
    throw Error(`A drawer was already declared for 'position="${position}"'`);
}
/**
 * Configures whether drawers should use auto sizing by default.
 * @type {?}
 */
export const MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken('MAT_DRAWER_DEFAULT_AUTOSIZE', {
    providedIn: 'root',
    factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY,
});
/**
 * Used to provide a drawer container to a drawer while avoiding circular references.
 * \@docs-private
 * @type {?}
 */
export const MAT_DRAWER_CONTAINER = new InjectionToken('MAT_DRAWER_CONTAINER');
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
    return false;
}
export class MatDrawerContent extends CdkScrollable {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _container
     * @param {?} elementRef
     * @param {?} scrollDispatcher
     * @param {?} ngZone
     */
    constructor(_changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone) {
        super(elementRef, scrollDispatcher, ngZone);
        this._changeDetectorRef = _changeDetectorRef;
        this._container = _container;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._container._contentMarginChanges.subscribe((/**
         * @return {?}
         */
        () => {
            this._changeDetectorRef.markForCheck();
        }));
    }
}
MatDrawerContent.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-drawer-content',
                template: '<ng-content></ng-content>',
                host: {
                    'class': 'mat-drawer-content',
                    '[style.margin-left.px]': '_container._contentMargins.left',
                    '[style.margin-right.px]': '_container._contentMargins.right',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            }] }
];
/** @nocollapse */
MatDrawerContent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: MatDrawerContainer, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatDrawerContainer)),] }] },
    { type: ElementRef },
    { type: ScrollDispatcher },
    { type: NgZone }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatDrawerContent.prototype._changeDetectorRef;
    /** @type {?} */
    MatDrawerContent.prototype._container;
}
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
export class MatDrawer {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _focusMonitor
     * @param {?} _platform
     * @param {?} _ngZone
     * @param {?} _doc
     * @param {?=} _container
     */
    constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _doc, _container) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._doc = _doc;
        this._container = _container;
        this._elementFocusedBeforeDrawerWasOpened = null;
        /**
         * Whether the drawer is initialized. Used for disabling the initial animation.
         */
        this._enableAnimations = false;
        this._position = 'start';
        this._mode = 'over';
        this._disableClose = false;
        this._autoFocus = true;
        this._opened = false;
        /**
         * Emits whenever the drawer has started animating.
         */
        this._animationStarted = new Subject();
        /**
         * Emits whenever the drawer is done animating.
         */
        this._animationEnd = new Subject();
        /**
         * Current state of the sidenav animation.
         */
        // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
        // metadata is not inherited by child classes, instead the host binding data is defined in a way
        // that can be inherited.
        // tslint:disable:no-host-decorator-in-concrete
        this._animationState = 'void';
        /**
         * Event emitted when the drawer open state is changed.
         */
        this.openedChange = 
        // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
        new EventEmitter(/* isAsync */ true);
        /**
         * Emits when the component is destroyed.
         */
        this._destroyed = new Subject();
        /**
         * Event emitted when the drawer's position changes.
         */
        // tslint:disable-next-line:no-output-on-prefix
        this.onPositionChanged = new EventEmitter();
        /**
         * An observable that emits when the drawer mode changes. This is used by the drawer container to
         * to know when to when the mode changes so it can adapt the margins on the content.
         */
        this._modeChanged = new Subject();
        this.openedChange.subscribe((/**
         * @param {?} opened
         * @return {?}
         */
        (opened) => {
            if (opened) {
                if (this._doc) {
                    this._elementFocusedBeforeDrawerWasOpened = (/** @type {?} */ (this._doc.activeElement));
                }
                if (this._isFocusTrapEnabled && this._focusTrap) {
                    this._trapFocus();
                }
            }
            else {
                this._restoreFocus();
            }
        }));
        /**
         * Listen to `keydown` events outside the zone so that change detection is not run every
         * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
         * and we don't have close disabled.
         */
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            ((/** @type {?} */ (fromEvent(this._elementRef.nativeElement, 'keydown')))).pipe(filter((/**
             * @param {?} event
             * @return {?}
             */
            event => {
                return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
            })), takeUntil(this._destroyed)).subscribe((/**
             * @param {?} event
             * @return {?}
             */
            event => this._ngZone.run((/**
             * @return {?}
             */
            () => {
                this.close();
                event.stopPropagation();
                event.preventDefault();
            }))));
        }));
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._animationEnd.pipe(distinctUntilChanged((/**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        (x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            const { fromState, toState } = event;
            if ((toState.indexOf('open') === 0 && fromState === 'void') ||
                (toState === 'void' && fromState.indexOf('open') === 0)) {
                this.openedChange.emit(this._opened);
            }
        }));
    }
    /**
     * The side that the drawer is attached to.
     * @return {?}
     */
    get position() { return this._position; }
    /**
     * @param {?} value
     * @return {?}
     */
    set position(value) {
        // Make sure we have a valid value.
        value = value === 'end' ? 'end' : 'start';
        if (value != this._position) {
            this._position = value;
            this.onPositionChanged.emit();
        }
    }
    /**
     * Mode of the drawer; one of 'over', 'push' or 'side'.
     * @return {?}
     */
    get mode() { return this._mode; }
    /**
     * @param {?} value
     * @return {?}
     */
    set mode(value) {
        this._mode = value;
        this._updateFocusTrapState();
        this._modeChanged.next();
    }
    /**
     * Whether the drawer can be closed with the escape key or by clicking on the backdrop.
     * @return {?}
     */
    get disableClose() { return this._disableClose; }
    /**
     * @param {?} value
     * @return {?}
     */
    set disableClose(value) { this._disableClose = coerceBooleanProperty(value); }
    /**
     * Whether the drawer should focus the first focusable element automatically when opened.
     * @return {?}
     */
    get autoFocus() { return this._autoFocus; }
    /**
     * @param {?} value
     * @return {?}
     */
    set autoFocus(value) { this._autoFocus = coerceBooleanProperty(value); }
    /**
     * Whether the drawer is opened. We overload this because we trigger an event when it
     * starts or end.
     * @return {?}
     */
    get opened() { return this._opened; }
    /**
     * @param {?} value
     * @return {?}
     */
    set opened(value) { this.toggle(coerceBooleanProperty(value)); }
    /**
     * Event emitted when the drawer has been opened.
     * @return {?}
     */
    get _openedStream() {
        return this.openedChange.pipe(filter((/**
         * @param {?} o
         * @return {?}
         */
        o => o)), map((/**
         * @return {?}
         */
        () => { })));
    }
    /**
     * Event emitted when the drawer has started opening.
     * @return {?}
     */
    get openedStart() {
        return this._animationStarted.pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        e => e.fromState !== e.toState && e.toState.indexOf('open') === 0)), map((/**
         * @return {?}
         */
        () => { })));
    }
    /**
     * Event emitted when the drawer has been closed.
     * @return {?}
     */
    get _closedStream() {
        return this.openedChange.pipe(filter((/**
         * @param {?} o
         * @return {?}
         */
        o => !o)), map((/**
         * @return {?}
         */
        () => { })));
    }
    /**
     * Event emitted when the drawer has started closing.
     * @return {?}
     */
    get closedStart() {
        return this._animationStarted.pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        e => e.fromState !== e.toState && e.toState === 'void')), map((/**
         * @return {?}
         */
        () => { })));
    }
    /**
     * @return {?}
     */
    get _isFocusTrapEnabled() {
        // The focus trap is only enabled when the drawer is open in any mode other than side.
        return this.opened && this.mode !== 'side';
    }
    /**
     * Traps focus inside the drawer.
     * @private
     * @return {?}
     */
    _trapFocus() {
        if (!this.autoFocus) {
            return;
        }
        this._focusTrap.focusInitialElementWhenReady().then((/**
         * @param {?} hasMovedFocus
         * @return {?}
         */
        hasMovedFocus => {
            // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
            // still works. We need to check that `focus` is a function due to Universal.
            if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
                this._elementRef.nativeElement.focus();
            }
        }));
    }
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @private
     * @return {?}
     */
    _restoreFocus() {
        if (!this.autoFocus) {
            return;
        }
        /** @type {?} */
        const activeEl = this._doc && this._doc.activeElement;
        if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
            if (this._elementFocusedBeforeDrawerWasOpened instanceof HTMLElement) {
                this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
            }
            else {
                this._elementRef.nativeElement.blur();
            }
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
        this._openedVia = null;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._updateFocusTrapState();
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // Enable the animations after the lifecycle hooks have run, in order to avoid animating
        // drawers that are open by default. When we're on the server, we shouldn't enable the
        // animations, because we don't want the drawer to animate the first time the user sees
        // the page.
        if (this._platform.isBrowser) {
            this._enableAnimations = true;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
        this._animationStarted.complete();
        this._animationEnd.complete();
        this._modeChanged.complete();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Open the drawer.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    open(openedVia) {
        return this.toggle(true, openedVia);
    }
    /**
     * Close the drawer.
     * @return {?}
     */
    close() {
        return this.toggle(false);
    }
    /**
     * Toggle this drawer.
     * @param {?=} isOpen Whether the drawer should be open.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    toggle(isOpen = !this.opened, openedVia = 'program') {
        this._opened = isOpen;
        if (isOpen) {
            this._animationState = this._enableAnimations ? 'open' : 'open-instant';
            this._openedVia = openedVia;
        }
        else {
            this._animationState = 'void';
            this._restoreFocus();
        }
        this._updateFocusTrapState();
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            this.openedChange.pipe(take(1)).subscribe((/**
             * @param {?} open
             * @return {?}
             */
            open => resolve(open ? 'open' : 'close')));
        }));
    }
    /**
     * @return {?}
     */
    get _width() {
        return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
    }
    /**
     * Updates the enabled state of the focus trap.
     * @private
     * @return {?}
     */
    _updateFocusTrapState() {
        if (this._focusTrap) {
            this._focusTrap.enabled = this._isFocusTrapEnabled;
        }
    }
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    /**
     * @param {?} event
     * @return {?}
     */
    _animationStartListener(event) {
        this._animationStarted.next(event);
    }
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    /**
     * @param {?} event
     * @return {?}
     */
    _animationDoneListener(event) {
        this._animationEnd.next(event);
    }
}
MatDrawer.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-drawer',
                exportAs: 'matDrawer',
                template: "<div class=\"mat-drawer-inner-container\">\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                animations: [matDrawerAnimations.transformDrawer],
                host: {
                    'class': 'mat-drawer',
                    // must prevent the browser from aligning text based on value
                    '[attr.align]': 'null',
                    '[class.mat-drawer-end]': 'position === "end"',
                    '[class.mat-drawer-over]': 'mode === "over"',
                    '[class.mat-drawer-push]': 'mode === "push"',
                    '[class.mat-drawer-side]': 'mode === "side"',
                    '[class.mat-drawer-opened]': 'opened',
                    'tabIndex': '-1',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None
            }] }
];
/** @nocollapse */
MatDrawer.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusTrapFactory },
    { type: FocusMonitor },
    { type: Platform },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatDrawerContainer, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DRAWER_CONTAINER,] }] }
];
MatDrawer.propDecorators = {
    position: [{ type: Input }],
    mode: [{ type: Input }],
    disableClose: [{ type: Input }],
    autoFocus: [{ type: Input }],
    opened: [{ type: Input }],
    _animationState: [{ type: HostBinding, args: ['@transform',] }],
    openedChange: [{ type: Output }],
    _openedStream: [{ type: Output, args: ['opened',] }],
    openedStart: [{ type: Output }],
    _closedStream: [{ type: Output, args: ['closed',] }],
    closedStart: [{ type: Output }],
    onPositionChanged: [{ type: Output, args: ['positionChanged',] }],
    _animationStartListener: [{ type: HostListener, args: ['@transform.start', ['$event'],] }],
    _animationDoneListener: [{ type: HostListener, args: ['@transform.done', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    MatDrawer.ngAcceptInputType_disableClose;
    /** @type {?} */
    MatDrawer.ngAcceptInputType_autoFocus;
    /** @type {?} */
    MatDrawer.ngAcceptInputType_opened;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._focusTrap;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._elementFocusedBeforeDrawerWasOpened;
    /**
     * Whether the drawer is initialized. Used for disabling the initial animation.
     * @type {?}
     * @private
     */
    MatDrawer.prototype._enableAnimations;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._mode;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._disableClose;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._autoFocus;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._opened;
    /**
     * How the sidenav was opened (keypress, mouse click etc.)
     * @type {?}
     * @private
     */
    MatDrawer.prototype._openedVia;
    /**
     * Emits whenever the drawer has started animating.
     * @type {?}
     */
    MatDrawer.prototype._animationStarted;
    /**
     * Emits whenever the drawer is done animating.
     * @type {?}
     */
    MatDrawer.prototype._animationEnd;
    /**
     * Current state of the sidenav animation.
     * @type {?}
     */
    MatDrawer.prototype._animationState;
    /**
     * Event emitted when the drawer open state is changed.
     * @type {?}
     */
    MatDrawer.prototype.openedChange;
    /**
     * Emits when the component is destroyed.
     * @type {?}
     * @private
     */
    MatDrawer.prototype._destroyed;
    /**
     * Event emitted when the drawer's position changes.
     * @type {?}
     */
    MatDrawer.prototype.onPositionChanged;
    /**
     * An observable that emits when the drawer mode changes. This is used by the drawer container to
     * to know when to when the mode changes so it can adapt the margins on the content.
     * @type {?}
     */
    MatDrawer.prototype._modeChanged;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._focusTrapFactory;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._focusMonitor;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._platform;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatDrawer.prototype._doc;
    /**
     * @deprecated `_container` parameter to be made required.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    MatDrawer.prototype._container;
}
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export class MatDrawerContainer {
    /**
     * @param {?} _dir
     * @param {?} _element
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     * @param {?} viewportRuler
     * @param {?=} defaultAutosize
     * @param {?=} _animationMode
     */
    constructor(_dir, _element, _ngZone, _changeDetectorRef, viewportRuler, defaultAutosize = false, _animationMode) {
        this._dir = _dir;
        this._element = _element;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /**
         * Drawers that belong to this container.
         */
        this._drawers = new QueryList();
        /**
         * Event emitted when the drawer backdrop is clicked.
         */
        this.backdropClick = new EventEmitter();
        /**
         * Emits when the component is destroyed.
         */
        this._destroyed = new Subject();
        /**
         * Emits on every ngDoCheck. Used for debouncing reflows.
         */
        this._doCheckSubject = new Subject();
        /**
         * Margins to be applied to the content. These are used to push / shrink the drawer content when a
         * drawer is open. We use margin rather than transform even for push mode because transform breaks
         * fixed position elements inside of the transformed element.
         */
        this._contentMargins = { left: null, right: null };
        this._contentMarginChanges = new Subject();
        // If a `Dir` directive exists up the tree, listen direction changes
        // and update the left/right properties to point to the proper start/end.
        if (_dir) {
            _dir.change.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @return {?}
             */
            () => {
                this._validateDrawers();
                this.updateContentMargins();
            }));
        }
        // Since the minimum width of the sidenav depends on the viewport width,
        // we need to recompute the margins if the viewport changes.
        viewportRuler.change()
            .pipe(takeUntil(this._destroyed))
            .subscribe((/**
         * @return {?}
         */
        () => this.updateContentMargins()));
        this._autosize = defaultAutosize;
    }
    /**
     * The drawer child with the `start` position.
     * @return {?}
     */
    get start() { return this._start; }
    /**
     * The drawer child with the `end` position.
     * @return {?}
     */
    get end() { return this._end; }
    /**
     * Whether to automatically resize the container whenever
     * the size of any of its drawers changes.
     *
     * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
     * the drawers on every change detection cycle. Can be configured globally via the
     * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
     * @return {?}
     */
    get autosize() { return this._autosize; }
    /**
     * @param {?} value
     * @return {?}
     */
    set autosize(value) { this._autosize = coerceBooleanProperty(value); }
    /**
     * Whether the drawer container should have a backdrop while one of the sidenavs is open.
     * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
     * mode as well.
     * @return {?}
     */
    get hasBackdrop() {
        if (this._backdropOverride == null) {
            return !this._start || this._start.mode !== 'side' || !this._end || this._end.mode !== 'side';
        }
        return this._backdropOverride;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hasBackdrop(value) {
        this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
    }
    /**
     * Reference to the CdkScrollable instance that wraps the scrollable content.
     * @return {?}
     */
    get scrollable() {
        return this._userContent || this._content;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._allDrawers.changes
            .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
            .subscribe((/**
         * @param {?} drawer
         * @return {?}
         */
        (drawer) => {
            // @breaking-change 10.0.0 Remove `_container` check once container parameter is required.
            this._drawers.reset(drawer.filter((/**
             * @param {?} item
             * @return {?}
             */
            item => !item._container || item._container === this)));
            this._drawers.notifyOnChanges();
        }));
        this._drawers.changes.pipe(startWith(null)).subscribe((/**
         * @return {?}
         */
        () => {
            this._validateDrawers();
            this._drawers.forEach((/**
             * @param {?} drawer
             * @return {?}
             */
            (drawer) => {
                this._watchDrawerToggle(drawer);
                this._watchDrawerPosition(drawer);
                this._watchDrawerMode(drawer);
            }));
            if (!this._drawers.length ||
                this._isDrawerOpen(this._start) ||
                this._isDrawerOpen(this._end)) {
                this.updateContentMargins();
            }
            this._changeDetectorRef.markForCheck();
        }));
        this._doCheckSubject.pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
        takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => this.updateContentMargins()));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._contentMarginChanges.complete();
        this._doCheckSubject.complete();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    open() {
        this._drawers.forEach((/**
         * @param {?} drawer
         * @return {?}
         */
        drawer => drawer.open()));
    }
    /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    close() {
        this._drawers.forEach((/**
         * @param {?} drawer
         * @return {?}
         */
        drawer => drawer.close()));
    }
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     * @return {?}
     */
    updateContentMargins() {
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        /** @type {?} */
        let left = 0;
        /** @type {?} */
        let right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._width;
            }
            else if (this._left.mode == 'push') {
                /** @type {?} */
                const width = this._left._width;
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._width;
            }
            else if (this._right.mode == 'push') {
                /** @type {?} */
                const width = this._right._width;
                right += width;
                left -= width;
            }
        }
        // If either `right` or `left` is zero, don't set a style to the element. This
        // allows users to specify a custom size via CSS class in SSR scenarios where the
        // measured widths will always be zero. Note that we reset to `null` here, rather
        // than below, in order to ensure that the types in the `if` below are consistent.
        left = left || (/** @type {?} */ (null));
        right = right || (/** @type {?} */ (null));
        if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
            this._contentMargins = { left, right };
            // Pull back into the NgZone since in some cases we could be outside. We need to be careful
            // to do it only when something changed, otherwise we can end up hitting the zone too often.
            this._ngZone.run((/**
             * @return {?}
             */
            () => this._contentMarginChanges.next(this._contentMargins)));
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        // If users opted into autosizing, do a check every change detection cycle.
        if (this._autosize && this._isPushed()) {
            // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
            this._ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => this._doCheckSubject.next()));
        }
    }
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @private
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerToggle(drawer) {
        drawer._animationStarted.pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        (event) => event.fromState !== event.toState)), takeUntil(this._drawers.changes))
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
                this._element.nativeElement.classList.add('mat-drawer-transition');
            }
            this.updateContentMargins();
            this._changeDetectorRef.markForCheck();
        }));
        if (drawer.mode !== 'side') {
            drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe((/**
             * @return {?}
             */
            () => this._setContainerClass(drawer.opened)));
        }
    }
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     * @private
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerPosition(drawer) {
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe((/**
         * @return {?}
         */
        () => {
            this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe((/**
             * @return {?}
             */
            () => {
                this._validateDrawers();
            }));
        }));
    }
    /**
     * Subscribes to changes in drawer mode so we can run change detection.
     * @private
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerMode(drawer) {
        if (drawer) {
            drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this.updateContentMargins();
                this._changeDetectorRef.markForCheck();
            }));
        }
    }
    /**
     * Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element.
     * @private
     * @param {?} isAdd
     * @return {?}
     */
    _setContainerClass(isAdd) {
        /** @type {?} */
        const classList = this._element.nativeElement.classList;
        /** @type {?} */
        const className = 'mat-drawer-container-has-open';
        if (isAdd) {
            classList.add(className);
        }
        else {
            classList.remove(className);
        }
    }
    /**
     * Validate the state of the drawer children components.
     * @private
     * @return {?}
     */
    _validateDrawers() {
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach((/**
         * @param {?} drawer
         * @return {?}
         */
        drawer => {
            if (drawer.position == 'end') {
                if (this._end != null) {
                    throwMatDuplicatedDrawerError('end');
                }
                this._end = drawer;
            }
            else {
                if (this._start != null) {
                    throwMatDuplicatedDrawerError('start');
                }
                this._start = drawer;
            }
        }));
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir && this._dir.value === 'rtl') {
            this._left = this._end;
            this._right = this._start;
        }
        else {
            this._left = this._start;
            this._right = this._end;
        }
    }
    /**
     * Whether the container is being pushed to the side by one of the drawers.
     * @private
     * @return {?}
     */
    _isPushed() {
        return (this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
            (this._isDrawerOpen(this._end) && this._end.mode != 'over');
    }
    /**
     * @return {?}
     */
    _onBackdropClicked() {
        this.backdropClick.emit();
        this._closeModalDrawer();
    }
    /**
     * @return {?}
     */
    _closeModalDrawer() {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter((/**
         * @param {?} drawer
         * @return {?}
         */
        drawer => drawer && !drawer.disableClose && this._canHaveBackdrop(drawer)))
            .forEach((/**
         * @param {?} drawer
         * @return {?}
         */
        drawer => (/** @type {?} */ (drawer)).close()));
    }
    /**
     * @return {?}
     */
    _isShowingBackdrop() {
        return (this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
            (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end));
    }
    /**
     * @private
     * @param {?} drawer
     * @return {?}
     */
    _canHaveBackdrop(drawer) {
        return drawer.mode !== 'side' || !!this._backdropOverride;
    }
    /**
     * @private
     * @param {?} drawer
     * @return {?}
     */
    _isDrawerOpen(drawer) {
        return drawer != null && drawer.opened;
    }
}
MatDrawerContainer.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-drawer-container',
                exportAs: 'matDrawerContainer',
                template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n",
                host: {
                    'class': 'mat-drawer-container',
                    '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [{
                        provide: MAT_DRAWER_CONTAINER,
                        useExisting: MatDrawerContainer
                    }],
                styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(-ms-high-contrast: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(-ms-high-contrast: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(-ms-high-contrast: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"]
            }] }
];
/** @nocollapse */
MatDrawerContainer.ctorParameters = () => [
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: ViewportRuler },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DRAWER_DEFAULT_AUTOSIZE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatDrawerContainer.propDecorators = {
    _allDrawers: [{ type: ContentChildren, args: [MatDrawer, {
                    // We need to use `descendants: true`, because Ivy will no longer match
                    // indirect descendants if it's left as false.
                    descendants: true
                },] }],
    _content: [{ type: ContentChild, args: [MatDrawerContent,] }],
    _userContent: [{ type: ViewChild, args: [MatDrawerContent,] }],
    autosize: [{ type: Input }],
    hasBackdrop: [{ type: Input }],
    backdropClick: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    MatDrawerContainer.ngAcceptInputType_autosize;
    /** @type {?} */
    MatDrawerContainer.ngAcceptInputType_hasBackdrop;
    /**
     * All drawers in the container. Includes drawers from inside nested containers.
     * @type {?}
     */
    MatDrawerContainer.prototype._allDrawers;
    /**
     * Drawers that belong to this container.
     * @type {?}
     */
    MatDrawerContainer.prototype._drawers;
    /** @type {?} */
    MatDrawerContainer.prototype._content;
    /** @type {?} */
    MatDrawerContainer.prototype._userContent;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._autosize;
    /** @type {?} */
    MatDrawerContainer.prototype._backdropOverride;
    /**
     * Event emitted when the drawer backdrop is clicked.
     * @type {?}
     */
    MatDrawerContainer.prototype.backdropClick;
    /**
     * The drawer at the start/end position, independent of direction.
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._start;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._end;
    /**
     * The drawer at the left/right. When direction changes, these will change as well.
     * They're used as aliases for the above to set the left/right style properly.
     * In LTR, _left == _start and _right == _end.
     * In RTL, _left == _end and _right == _start.
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._left;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._right;
    /**
     * Emits when the component is destroyed.
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._destroyed;
    /**
     * Emits on every ngDoCheck. Used for debouncing reflows.
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._doCheckSubject;
    /**
     * Margins to be applied to the content. These are used to push / shrink the drawer content when a
     * drawer is open. We use margin rather than transform even for push mode because transform breaks
     * fixed position elements inside of the transformed element.
     * @type {?}
     */
    MatDrawerContainer.prototype._contentMargins;
    /** @type {?} */
    MatDrawerContainer.prototype._contentMarginChanges;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatDrawerContainer.prototype._animationMode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUEwQixnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNqQixZQUFZLEVBQ1osV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILFNBQVMsRUFDVCxJQUFJLEVBQ0osU0FBUyxFQUNULG9CQUFvQixHQUNyQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7O0FBTzNFLE1BQU0sVUFBVSw2QkFBNkIsQ0FBQyxRQUFnQjtJQUM1RCxNQUFNLEtBQUssQ0FBQyxnREFBZ0QsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUM1RSxDQUFDOzs7OztBQVVELE1BQU0sT0FBTywyQkFBMkIsR0FDcEMsSUFBSSxjQUFjLENBQVUsNkJBQTZCLEVBQUU7SUFDekQsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLG1DQUFtQztDQUM3QyxDQUFDOzs7Ozs7QUFPTixNQUFNLE9BQU8sb0JBQW9CLEdBQUcsSUFBSSxjQUFjLENBQUMsc0JBQXNCLENBQUM7Ozs7O0FBRzlFLE1BQU0sVUFBVSxtQ0FBbUM7SUFDakQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBY0QsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGFBQWE7Ozs7Ozs7O0lBQ2pELFlBQ1ksa0JBQXFDLEVBQ1EsVUFBOEIsRUFDbkYsVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLE1BQWM7UUFDaEIsS0FBSyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ1EsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7SUFLdkYsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRTtZQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7WUExQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxvQkFBb0I7b0JBQzdCLHdCQUF3QixFQUFFLGlDQUFpQztvQkFDM0QseUJBQXlCLEVBQUUsa0NBQWtDO2lCQUM5RDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDdEM7Ozs7WUFoRkMsaUJBQWlCO1lBb0ZvRCxrQkFBa0IsdUJBQWxGLE1BQU0sU0FBQyxVQUFVOzs7b0JBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLEVBQUM7WUEvRWhELFVBQVU7WUFYVyxnQkFBZ0I7WUFpQnJDLE1BQU07Ozs7Ozs7SUF3RUYsOENBQTZDOztJQUM3QyxzQ0FBbUY7Ozs7O0FBc0N6RixNQUFNLE9BQU8sU0FBUzs7Ozs7Ozs7OztJQXlIcEIsWUFBb0IsV0FBb0MsRUFDcEMsaUJBQW1DLEVBQ25DLGFBQTJCLEVBQzNCLFNBQW1CLEVBQ25CLE9BQWUsRUFDZSxJQUFTLEVBS0UsVUFBK0I7UUFWeEUsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0IsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2UsU0FBSSxHQUFKLElBQUksQ0FBSztRQUtFLGVBQVUsR0FBVixVQUFVLENBQXFCO1FBaklwRix5Q0FBb0MsR0FBdUIsSUFBSSxDQUFDOzs7O1FBR2hFLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQWExQixjQUFTLEdBQW9CLE9BQU8sQ0FBQztRQVVyQyxVQUFLLEdBQWtCLE1BQU0sQ0FBQztRQU05QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQU0vQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBUzNCLFlBQU8sR0FBWSxLQUFLLENBQUM7Ozs7UUFNakMsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7Ozs7UUFHbEQsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQzs7Ozs7Ozs7UUFROUMsb0JBQWUsR0FBcUMsTUFBTSxDQUFDOzs7O1FBR3hDLGlCQUFZO1FBQzNCLHlGQUF5RjtRQUN6RixJQUFJLFlBQVksQ0FBVSxhQUFhLENBQUEsSUFBSSxDQUFDLENBQUM7Ozs7UUFpQ2hDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7OztRQUl2QixzQkFBaUIsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQzs7Ozs7UUFNbkYsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBbUIxQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7Ozs7UUFBQyxDQUFDLE1BQWUsRUFBRSxFQUFFO1lBQzlDLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDYixJQUFJLENBQUMsb0NBQW9DLEdBQUcsbUJBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQWUsQ0FBQztpQkFDcEY7Z0JBRUQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUNuQjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN0QjtRQUNILENBQUMsRUFBQyxDQUFDO1FBRUg7Ozs7V0FJRztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCOzs7UUFBQyxHQUFHLEVBQUU7WUFDaEMsQ0FBQyxtQkFBQSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLEVBQTZCLENBQUMsQ0FBQyxJQUFJLENBQ3BGLE1BQU07Ozs7WUFBQyxLQUFLLENBQUMsRUFBRTtnQkFDYixPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRixDQUFDLEVBQUMsRUFDRixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUM3QixDQUFDLFNBQVM7Ozs7WUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRzs7O1lBQUMsR0FBRyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0IsQ0FBQyxFQUFDLEVBQUMsQ0FBQztRQUNSLENBQUMsRUFBQyxDQUFDO1FBRUgsd0VBQXdFO1FBQ3hFLG9GQUFvRjtRQUNwRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxvQkFBb0I7Ozs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEQsT0FBTyxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hFLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUzs7OztRQUFDLENBQUMsS0FBcUIsRUFBRSxFQUFFO2tCQUNoQyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsR0FBRyxLQUFLO1lBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLEtBQUssTUFBTSxDQUFDO2dCQUN2RCxDQUFDLE9BQU8sS0FBSyxNQUFNLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDM0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3RDO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7OztJQXpLRCxJQUNJLFFBQVEsS0FBc0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDMUQsSUFBSSxRQUFRLENBQUMsS0FBc0I7UUFDakMsbUNBQW1DO1FBQ25DLEtBQUssR0FBRyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7Ozs7O0lBSUQsSUFDSSxJQUFJLEtBQW9CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ2hELElBQUksSUFBSSxDQUFDLEtBQW9CO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Ozs7SUFJRCxJQUNJLFlBQVksS0FBYyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzs7OztJQUMxRCxJQUFJLFlBQVksQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBSXZGLElBQ0ksU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3BELElBQUksU0FBUyxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBT2pGLElBQ0ksTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQzlDLElBQUksTUFBTSxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7OztJQTBCekUsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBRSxHQUFHOzs7UUFBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Ozs7O0lBR0QsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUNoQyxNQUFNOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDLEVBQ3pFLEdBQUc7OztRQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBQyxDQUNkLENBQUM7SUFDSixDQUFDOzs7OztJQUdELElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTTs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxHQUFHOzs7UUFBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Ozs7O0lBR0QsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUNoQyxNQUFNOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUMsRUFDOUQsR0FBRzs7O1FBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFDLENBQ2QsQ0FBQztJQUNKLENBQUM7Ozs7SUFlRCxJQUFJLG1CQUFtQjtRQUNyQixzRkFBc0Y7UUFDdEYsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDO0lBQzdDLENBQUM7Ozs7OztJQTZETyxVQUFVO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxJQUFJOzs7O1FBQUMsYUFBYSxDQUFDLEVBQUU7WUFDbEUsMkZBQTJGO1lBQzNGLDZFQUE2RTtZQUM3RSxJQUFJLENBQUMsYUFBYSxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtnQkFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDeEM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7Ozs7SUFNTyxhQUFhO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE9BQU87U0FDUjs7Y0FFSyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7UUFFckQsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2pFLElBQUksSUFBSSxDQUFDLG9DQUFvQyxZQUFZLFdBQVcsRUFBRTtnQkFDcEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN6RjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN2QztTQUNGO1FBRUQsSUFBSSxDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDOzs7O0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxxQkFBcUI7UUFDbkIsd0ZBQXdGO1FBQ3hGLHNGQUFzRjtRQUN0Rix1RkFBdUY7UUFDdkYsWUFBWTtRQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUMvQjtJQUNILENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs7Ozs7O0lBT0QsSUFBSSxDQUFDLFNBQXVCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7Ozs7SUFHRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7Ozs7O0lBUUQsTUFBTSxDQUFDLFNBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUF5QixTQUFTO1FBR3ZFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7UUFFRCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUU3QixPQUFPLElBQUksT0FBTzs7OztRQUF3QixPQUFPLENBQUMsRUFBRTtZQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7O1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUM7UUFDdEYsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDOzs7Ozs7SUFHTyxxQkFBcUI7UUFDM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUNwRDtJQUNILENBQUM7Ozs7Ozs7Ozs7SUFRRCx1QkFBdUIsQ0FBQyxLQUFxQjtRQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Ozs7Ozs7Ozs7SUFRRCxzQkFBc0IsQ0FBQyxLQUFxQjtRQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7WUE3VUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixtR0FBMEI7Z0JBQzFCLFVBQVUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztnQkFDakQsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxZQUFZOztvQkFFckIsY0FBYyxFQUFFLE1BQU07b0JBQ3RCLHdCQUF3QixFQUFFLG9CQUFvQjtvQkFDOUMseUJBQXlCLEVBQUUsaUJBQWlCO29CQUM1Qyx5QkFBeUIsRUFBRSxpQkFBaUI7b0JBQzVDLHlCQUF5QixFQUFFLGlCQUFpQjtvQkFDNUMsMkJBQTJCLEVBQUUsUUFBUTtvQkFDckMsVUFBVSxFQUFFLElBQUk7aUJBQ2pCO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7OztZQXBIQyxVQUFVO1lBaEJrQyxnQkFBZ0I7WUFBdEQsWUFBWTtZQUlaLFFBQVE7WUFrQmQsTUFBTTs0Q0E2T08sUUFBUSxZQUFJLE1BQU0sU0FBQyxRQUFRO1lBS2tDLGtCQUFrQix1QkFBL0UsUUFBUSxZQUFJLE1BQU0sU0FBQyxvQkFBb0I7Ozt1QkEzSG5ELEtBQUs7bUJBYUwsS0FBSzsyQkFVTCxLQUFLO3dCQU1MLEtBQUs7cUJBU0wsS0FBSzs4QkFtQkwsV0FBVyxTQUFDLFlBQVk7MkJBSXhCLE1BQU07NEJBS04sTUFBTSxTQUFDLFFBQVE7MEJBTWYsTUFBTTs0QkFTTixNQUFNLFNBQUMsUUFBUTswQkFNZixNQUFNO2dDQWFOLE1BQU0sU0FBQyxpQkFBaUI7c0NBZ014QixZQUFZLFNBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUM7cUNBVTNDLFlBQVksU0FBQyxpQkFBaUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7OztJQUszQyx5Q0FBd0Q7O0lBQ3hELHNDQUFxRDs7SUFDckQsbUNBQWtEOzs7OztJQTVUbEQsK0JBQThCOzs7OztJQUM5Qix5REFBd0U7Ozs7OztJQUd4RSxzQ0FBa0M7Ozs7O0lBYWxDLDhCQUE2Qzs7Ozs7SUFVN0MsMEJBQXNDOzs7OztJQU10QyxrQ0FBdUM7Ozs7O0lBTXZDLCtCQUFtQzs7Ozs7SUFTbkMsNEJBQWlDOzs7Ozs7SUFHakMsK0JBQXVDOzs7OztJQUd2QyxzQ0FBa0Q7Ozs7O0lBR2xELGtDQUE4Qzs7Ozs7SUFPOUMsb0NBQzJEOzs7OztJQUczRCxpQ0FFaUQ7Ozs7OztJQWlDakQsK0JBQWtEOzs7OztJQUlsRCxzQ0FBNEY7Ozs7OztJQU01RixpQ0FBNEM7Ozs7O0lBT2hDLGdDQUE0Qzs7Ozs7SUFDNUMsc0NBQTJDOzs7OztJQUMzQyxrQ0FBbUM7Ozs7O0lBQ25DLDhCQUEyQjs7Ozs7SUFDM0IsNEJBQXVCOzs7OztJQUN2Qix5QkFBK0M7Ozs7OztJQUsvQywrQkFBZ0Y7Ozs7Ozs7O0FBcU45RixNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7Ozs7O0lBd0Y3QixZQUFnQyxJQUFvQixFQUNoQyxRQUFpQyxFQUNqQyxPQUFlLEVBQ2Ysa0JBQXFDLEVBQzdDLGFBQTRCLEVBQ1MsZUFBZSxHQUFHLEtBQUssRUFDVCxjQUF1QjtRQU50RCxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUNoQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUNqQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUdNLG1CQUFjLEdBQWQsY0FBYyxDQUFTOzs7O1FBcEZ0RixhQUFRLEdBQUcsSUFBSSxTQUFTLEVBQWEsQ0FBQzs7OztRQTJDbkIsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQzs7OztRQWdCL0QsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7Ozs7UUFHakMsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7Ozs7UUFPdkQsb0JBQWUsR0FBNEMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUU1RSwwQkFBcUIsR0FBRyxJQUFJLE9BQU8sRUFBMkMsQ0FBQztRQWV0RixvRUFBb0U7UUFDcEUseUVBQXlFO1FBQ3pFLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsRUFBQyxDQUFDO1NBQ0o7UUFFRCx3RUFBd0U7UUFDeEUsNERBQTREO1FBQzVELGFBQWEsQ0FBQyxNQUFNLEVBQUU7YUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztJQUNuQyxDQUFDOzs7OztJQWhHRCxJQUFJLEtBQUssS0FBdUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFHckQsSUFBSSxHQUFHLEtBQXVCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7SUFVakQsSUFDSSxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7SUFDbEQsSUFBSSxRQUFRLENBQUMsS0FBYyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBUS9FLElBQ0ksV0FBVztRQUNiLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRTtZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztTQUMvRjtRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBQ0QsSUFBSSxXQUFXLENBQUMsS0FBVTtRQUN4QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDOzs7OztJQW1DRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM1QyxDQUFDOzs7O0lBNEJELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU87YUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM3RCxTQUFTOzs7O1FBQUMsQ0FBQyxNQUE0QixFQUFFLEVBQUU7WUFDMUMsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNOzs7O1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDbEMsQ0FBQyxFQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQ3pELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzs7OztZQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLENBQUMsRUFBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtnQkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7YUFDN0I7WUFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQyxFQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FDdkIsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFFLHNEQUFzRDtRQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUMzQixDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLENBQUM7SUFDakQsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7SUFHRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUMsQ0FBQztJQUNqRCxDQUFDOzs7OztJQUdELEtBQUs7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87Ozs7UUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBQyxDQUFDO0lBQ2xELENBQUM7Ozs7OztJQU1ELG9CQUFvQjs7Ozs7Ozs7WUFPZCxJQUFJLEdBQUcsQ0FBQzs7WUFDUixLQUFLLEdBQUcsQ0FBQztRQUViLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQzNCO2lCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFOztzQkFDOUIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDL0IsSUFBSSxJQUFJLEtBQUssQ0FBQztnQkFDZCxLQUFLLElBQUksS0FBSyxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7Z0JBQzlCLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUM3QjtpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTs7c0JBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07Z0JBQ2hDLEtBQUssSUFBSSxLQUFLLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEtBQUssQ0FBQzthQUNmO1NBQ0Y7UUFFRCw4RUFBOEU7UUFDOUUsaUZBQWlGO1FBQ2pGLGlGQUFpRjtRQUNqRixrRkFBa0Y7UUFDbEYsSUFBSSxHQUFHLElBQUksSUFBSSxtQkFBQSxJQUFJLEVBQUMsQ0FBQztRQUNyQixLQUFLLEdBQUcsS0FBSyxJQUFJLG1CQUFBLElBQUksRUFBQyxDQUFDO1FBRXZCLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRTtZQUM5RSxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO1lBRXJDLDJGQUEyRjtZQUMzRiw0RkFBNEY7WUFDNUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHOzs7WUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBQyxDQUFDO1NBQy9FO0lBQ0gsQ0FBQzs7OztJQUVELFNBQVM7UUFDUCwyRUFBMkU7UUFDM0UsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUN0Qyx1RkFBdUY7WUFDdkYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7OztZQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUMsQ0FBQztTQUNuRTtJQUNILENBQUM7Ozs7Ozs7OztJQU9PLGtCQUFrQixDQUFDLE1BQWlCO1FBQzFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQzNCLE1BQU07Ozs7UUFBQyxDQUFDLEtBQXFCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBQyxFQUNwRSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FDakM7YUFDQSxTQUFTOzs7O1FBQUMsQ0FBQyxLQUFxQixFQUFFLEVBQUU7WUFDbkMsMEZBQTBGO1lBQzFGLHNGQUFzRjtZQUN0RixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssZ0JBQWdCLEVBQUU7Z0JBQ2hGLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUNwRTtZQUVELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDMUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7WUFBQyxHQUFHLEVBQUUsQ0FDdEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQzs7Ozs7Ozs7SUFNTyxvQkFBb0IsQ0FBQyxNQUFpQjtRQUM1QyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsK0VBQStFO1FBQy9FLGlFQUFpRTtRQUNqRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDeEUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUIsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7Ozs7SUFHTyxnQkFBZ0IsQ0FBQyxNQUFpQjtRQUN4QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQy9FLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLENBQUMsRUFBQyxDQUFDO1NBQ047SUFDSCxDQUFDOzs7Ozs7O0lBR08sa0JBQWtCLENBQUMsS0FBYzs7Y0FDakMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVM7O2NBQ2pELFNBQVMsR0FBRywrQkFBK0I7UUFFakQsSUFBSSxLQUFLLEVBQUU7WUFDVCxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCO2FBQU07WUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7Ozs7O0lBR08sZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFL0IsNERBQTREO1FBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzs7OztRQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLEVBQUU7Z0JBQzVCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7b0JBQ3JCLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN0QztnQkFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO29CQUN2Qiw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDeEM7Z0JBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7YUFDdEI7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFFaEMsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUU7WUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN6QjtJQUNILENBQUM7Ozs7OztJQUdPLFNBQVM7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1lBQy9ELENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUM7SUFDckUsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDZixtRkFBbUY7UUFDbkYsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDckIsTUFBTTs7OztRQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUM7YUFDakYsT0FBTzs7OztRQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQUEsTUFBTSxFQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQztJQUN4QyxDQUFDOzs7O0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7Ozs7OztJQUVPLGdCQUFnQixDQUFDLE1BQWlCO1FBQ3hDLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUM1RCxDQUFDOzs7Ozs7SUFFTyxhQUFhLENBQUMsTUFBd0I7UUFDNUMsT0FBTyxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDekMsQ0FBQzs7O1lBOVdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ25CLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLG9YQUFvQztnQkFFcEMsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxzQkFBc0I7b0JBQy9CLGdEQUFnRCxFQUFFLG1CQUFtQjtpQkFDdEU7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxTQUFTLEVBQUUsQ0FBQzt3QkFDVixPQUFPLEVBQUUsb0JBQW9CO3dCQUM3QixXQUFXLEVBQUUsa0JBQWtCO3FCQUNoQyxDQUFDOzthQUNIOzs7O1lBM2RPLGNBQWMsdUJBb2pCUCxRQUFRO1lBcmlCckIsVUFBVTtZQU1WLE1BQU07WUFYTixpQkFBaUI7WUFOc0IsYUFBYTs0Q0FxakJ2QyxNQUFNLFNBQUMsMkJBQTJCO3lDQUNsQyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7OzBCQTVGcEQsZUFBZSxTQUFDLFNBQVMsRUFBRTs7O29CQUcxQixXQUFXLEVBQUUsSUFBSTtpQkFDbEI7dUJBTUEsWUFBWSxTQUFDLGdCQUFnQjsyQkFDN0IsU0FBUyxTQUFDLGdCQUFnQjt1QkFnQjFCLEtBQUs7MEJBVUwsS0FBSzs0QkFjTCxNQUFNOzs7O0lBMFNQLDhDQUFvRDs7SUFDcEQsaURBQXVEOzs7OztJQTlWdkQseUNBS2tDOzs7OztJQUdsQyxzQ0FBc0M7O0lBRXRDLHNDQUEyRDs7SUFDM0QsMENBQTREOzs7OztJQW1CNUQsdUNBQTJCOztJQWtCM0IsK0NBQWtDOzs7OztJQUdsQywyQ0FBZ0Y7Ozs7OztJQUdoRixvQ0FBaUM7Ozs7O0lBQ2pDLGtDQUErQjs7Ozs7Ozs7O0lBUS9CLG1DQUFnQzs7Ozs7SUFDaEMsb0NBQWlDOzs7Ozs7SUFHakMsd0NBQWtEOzs7Ozs7SUFHbEQsNkNBQXVEOzs7Ozs7O0lBT3ZELDZDQUFxRjs7SUFFckYsbURBQXdGOzs7OztJQU81RSxrQ0FBd0M7Ozs7O0lBQ3hDLHNDQUF5Qzs7Ozs7SUFDekMscUNBQXVCOzs7OztJQUN2QixnREFBNkM7Ozs7O0lBRzdDLDRDQUEwRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW4sIEZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlLCBTY3JvbGxEaXNwYXRjaGVyLCBWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEhvc3RMaXN0ZW5lcixcbiAgSG9zdEJpbmRpbmcsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIG1lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGRlYm91bmNlVGltZSxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgdGFrZSxcbiAgdGFrZVVudGlsLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXREcmF3ZXJBbmltYXRpb25zfSBmcm9tICcuL2RyYXdlci1hbmltYXRpb25zJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIHR3byBNYXREcmF3ZXIgYXJlIG1hdGNoaW5nIHRoZSBzYW1lIHBvc2l0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICB0aHJvdyBFcnJvcihgQSBkcmF3ZXIgd2FzIGFscmVhZHkgZGVjbGFyZWQgZm9yICdwb3NpdGlvbj1cIiR7cG9zaXRpb259XCInYCk7XG59XG5cblxuLyoqIFJlc3VsdCBvZiB0aGUgdG9nZ2xlIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgdGhlIHN0YXRlIG9mIHRoZSBkcmF3ZXIuICovXG5leHBvcnQgdHlwZSBNYXREcmF3ZXJUb2dnbGVSZXN1bHQgPSAnb3BlbicgfCAnY2xvc2UnO1xuXG4vKiogRHJhd2VyIGFuZCBTaWRlTmF2IGRpc3BsYXkgbW9kZXMuICovXG5leHBvcnQgdHlwZSBNYXREcmF3ZXJNb2RlID0gJ292ZXInIHwgJ3B1c2gnIHwgJ3NpZGUnO1xuXG4vKiogQ29uZmlndXJlcyB3aGV0aGVyIGRyYXdlcnMgc2hvdWxkIHVzZSBhdXRvIHNpemluZyBieSBkZWZhdWx0LiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkUnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVfRkFDVE9SWSxcbiAgICB9KTtcblxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIGRyYXdlciBjb250YWluZXIgdG8gYSBkcmF3ZXIgd2hpbGUgYXZvaWRpbmcgY2lyY3VsYXIgcmVmZXJlbmNlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EUkFXRVJfQ09OVEFJTkVSID0gbmV3IEluamVjdGlvblRva2VuKCdNQVRfRFJBV0VSX0NPTlRBSU5FUicpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRV9GQUNUT1JZKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1sZWZ0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5sZWZ0JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1yaWdodC5weF0nOiAnX2NvbnRhaW5lci5fY29udGVudE1hcmdpbnMucmlnaHQnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyQ29udGVudCBleHRlbmRzIENka1Njcm9sbGFibGUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0RHJhd2VyQ29udGFpbmVyKSkgcHVibGljIF9jb250YWluZXI6IE1hdERyYXdlckNvbnRhaW5lcixcbiAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIG5nWm9uZTogTmdab25lKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgc2Nyb2xsRGlzcGF0Y2hlciwgbmdab25lKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jb250YWluZXIuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8gYSBkcmF3ZXIgdGhhdCBjYW4gYmUgb3BlbmVkIG9uIHRoZSBkcmF3ZXIgY29udGFpbmVyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci5odG1sJyxcbiAgYW5pbWF0aW9uczogW21hdERyYXdlckFuaW1hdGlvbnMudHJhbnNmb3JtRHJhd2VyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyJyxcbiAgICAvLyBtdXN0IHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSBhbGlnbmluZyB0ZXh0IGJhc2VkIG9uIHZhbHVlXG4gICAgJ1thdHRyLmFsaWduXSc6ICdudWxsJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItZW5kXSc6ICdwb3NpdGlvbiA9PT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW92ZXJdJzogJ21vZGUgPT09IFwib3ZlclwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItcHVzaF0nOiAnbW9kZSA9PT0gXCJwdXNoXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1zaWRlXSc6ICdtb2RlID09PSBcInNpZGVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW9wZW5lZF0nOiAnb3BlbmVkJyxcbiAgICAndGFiSW5kZXgnOiAnLTEnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgaW5pdGlhbGl6ZWQuIFVzZWQgZm9yIGRpc2FibGluZyB0aGUgaW5pdGlhbCBhbmltYXRpb24uICovXG4gIHByaXZhdGUgX2VuYWJsZUFuaW1hdGlvbnMgPSBmYWxzZTtcblxuICAvKiogVGhlIHNpZGUgdGhhdCB0aGUgZHJhd2VyIGlzIGF0dGFjaGVkIHRvLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcG9zaXRpb24oKTogJ3N0YXJ0JyB8ICdlbmQnIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogJ3N0YXJ0JyB8ICdlbmQnKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYSB2YWxpZCB2YWx1ZS5cbiAgICB2YWx1ZSA9IHZhbHVlID09PSAnZW5kJyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBpZiAodmFsdWUgIT0gdGhpcy5fcG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG4gICAgICB0aGlzLm9uUG9zaXRpb25DaGFuZ2VkLmVtaXQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcG9zaXRpb246ICdzdGFydCcgfCAnZW5kJyA9ICdzdGFydCc7XG5cbiAgLyoqIE1vZGUgb2YgdGhlIGRyYXdlcjsgb25lIG9mICdvdmVyJywgJ3B1c2gnIG9yICdzaWRlJy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1vZGUoKTogTWF0RHJhd2VyTW9kZSB7IHJldHVybiB0aGlzLl9tb2RlOyB9XG4gIHNldCBtb2RlKHZhbHVlOiBNYXREcmF3ZXJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX21vZGU6IE1hdERyYXdlck1vZGUgPSAnb3Zlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBjYW4gYmUgY2xvc2VkIHdpdGggdGhlIGVzY2FwZSBrZXkgb3IgYnkgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsb3NlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsb3NlOyB9XG4gIHNldCBkaXNhYmxlQ2xvc2UodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUNsb3NlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBmb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgYXV0b21hdGljYWxseSB3aGVuIG9wZW5lZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9Gb2N1cygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9Gb2N1czsgfVxuICBzZXQgYXV0b0ZvY3VzKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2F1dG9Gb2N1cyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfYXV0b0ZvY3VzOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGlzIG9wZW5lZC4gV2Ugb3ZlcmxvYWQgdGhpcyBiZWNhdXNlIHdlIHRyaWdnZXIgYW4gZXZlbnQgd2hlbiBpdFxuICAgKiBzdGFydHMgb3IgZW5kLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMudG9nZ2xlKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpOyB9XG4gIHByaXZhdGUgX29wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBIb3cgdGhlIHNpZGVuYXYgd2FzIG9wZW5lZCAoa2V5cHJlc3MsIG1vdXNlIGNsaWNrIGV0Yy4pICovXG4gIHByaXZhdGUgX29wZW5lZFZpYTogRm9jdXNPcmlnaW4gfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGFuaW1hdGluZy4gKi9cbiAgX2FuaW1hdGlvblN0YXJ0ZWQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgX2FuaW1hdGlvbkVuZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBzaWRlbmF2IGFuaW1hdGlvbi4gKi9cbiAgLy8gQEhvc3RCaW5kaW5nIGlzIHVzZWQgaW4gdGhlIGNsYXNzIGFzIGl0IGlzIGV4cGVjdGVkIHRvIGJlIGV4dGVuZGVkLiAgU2luY2UgQENvbXBvbmVudCBkZWNvcmF0b3JcbiAgLy8gbWV0YWRhdGEgaXMgbm90IGluaGVyaXRlZCBieSBjaGlsZCBjbGFzc2VzLCBpbnN0ZWFkIHRoZSBob3N0IGJpbmRpbmcgZGF0YSBpcyBkZWZpbmVkIGluIGEgd2F5XG4gIC8vIHRoYXQgY2FuIGJlIGluaGVyaXRlZC5cbiAgLy8gdHNsaW50OmRpc2FibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RCaW5kaW5nKCdAdHJhbnNmb3JtJylcbiAgX2FuaW1hdGlvblN0YXRlOiAnb3Blbi1pbnN0YW50JyB8ICdvcGVuJyB8ICd2b2lkJyA9ICd2b2lkJztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbiBzdGF0ZSBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxuICAgICAgLy8gTm90ZSB0aGlzIGhhcyB0byBiZSBhc3luYyBpbiBvcmRlciB0byBhdm9pZCBzb21lIGlzc3VlcyB3aXRoIHR3by1iaW5kaW5ncyAoc2VlICM4ODcyKS5cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oLyogaXNBc3luYyAqL3RydWUpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpXG4gIGdldCBfb3BlbmVkU3RyZWFtKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLm9wZW5lZENoYW5nZS5waXBlKGZpbHRlcihvID0+IG8pLCBtYXAoKCkgPT4ge30pKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBvcGVuaW5nLiAqL1xuICBAT3V0cHV0KClcbiAgZ2V0IG9wZW5lZFN0YXJ0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApLFxuICAgICAgbWFwKCgpID0+IHt9KVxuICAgICk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKVxuICBnZXQgX2Nsb3NlZFN0cmVhbSgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiAhbyksIG1hcCgoKSA9PiB7fSkpO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGNsb3NpbmcuICovXG4gIEBPdXRwdXQoKVxuICBnZXQgY2xvc2VkU3RhcnQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICAgIGZpbHRlcihlID0+IGUuZnJvbVN0YXRlICE9PSBlLnRvU3RhdGUgJiYgZS50b1N0YXRlID09PSAndm9pZCcpLFxuICAgICAgbWFwKCgpID0+IHt9KVxuICAgICk7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIncyBwb3NpdGlvbiBjaGFuZ2VzLiAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCdwb3NpdGlvbkNoYW5nZWQnKSBvblBvc2l0aW9uQ2hhbmdlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgZHJhd2VyIG1vZGUgY2hhbmdlcy4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBkcmF3ZXIgY29udGFpbmVyIHRvXG4gICAqIHRvIGtub3cgd2hlbiB0byB3aGVuIHRoZSBtb2RlIGNoYW5nZXMgc28gaXQgY2FuIGFkYXB0IHRoZSBtYXJnaW5zIG9uIHRoZSBjb250ZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgX21vZGVDaGFuZ2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBnZXQgX2lzRm9jdXNUcmFwRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAvLyBUaGUgZm9jdXMgdHJhcCBpcyBvbmx5IGVuYWJsZWQgd2hlbiB0aGUgZHJhd2VyIGlzIG9wZW4gaW4gYW55IG1vZGUgb3RoZXIgdGhhbiBzaWRlLlxuICAgIHJldHVybiB0aGlzLm9wZW5lZCAmJiB0aGlzLm1vZGUgIT09ICdzaWRlJztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jOiBhbnksXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBgX2NvbnRhaW5lcmAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICAgICAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EUkFXRVJfQ09OVEFJTkVSKSBwdWJsaWMgX2NvbnRhaW5lcj86IE1hdERyYXdlckNvbnRhaW5lcikge1xuXG4gICAgdGhpcy5vcGVuZWRDaGFuZ2Uuc3Vic2NyaWJlKChvcGVuZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmIChvcGVuZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RvYykge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkID0gdGhpcy5fZG9jLmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5faXNGb2N1c1RyYXBFbmFibGVkICYmIHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byBga2V5ZG93bmAgZXZlbnRzIG91dHNpZGUgdGhlIHpvbmUgc28gdGhhdCBjaGFuZ2UgZGV0ZWN0aW9uIGlzIG5vdCBydW4gZXZlcnlcbiAgICAgKiB0aW1lIGEga2V5IGlzIHByZXNzZWQuIEluc3RlYWQgd2UgcmUtZW50ZXIgdGhlIHpvbmUgb25seSBpZiB0aGUgYEVTQ2Aga2V5IGlzIHByZXNzZWRcbiAgICAgKiBhbmQgd2UgZG9uJ3QgaGF2ZSBjbG9zZSBkaXNhYmxlZC5cbiAgICAgKi9cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAoZnJvbUV2ZW50KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2tleWRvd24nKSBhcyBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+KS5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhdGhpcy5kaXNhYmxlQ2xvc2UgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICAgICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFdlIG5lZWQgYSBTdWJqZWN0IHdpdGggZGlzdGluY3RVbnRpbENoYW5nZWQsIGJlY2F1c2UgdGhlIGBkb25lYCBldmVudFxuICAgIC8vIGZpcmVzIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4ge1xuICAgICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgICAgaWYgKCh0b1N0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMCAmJiBmcm9tU3RhdGUgPT09ICd2b2lkJykgfHxcbiAgICAgICAgICAodG9TdGF0ZSA9PT0gJ3ZvaWQnICYmIGZyb21TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApKSB7XG4gICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQodGhpcy5fb3BlbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBUcmFwcyBmb2N1cyBpbnNpZGUgdGhlIGRyYXdlci4gKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzKCkge1xuICAgIGlmICghdGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpLnRoZW4oaGFzTW92ZWRGb2N1cyA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIGZvY3VzYWJsZSBlbGVtZW50cywgZm9jdXMgdGhlIHNpZGVuYXYgaXRzZWxmIHNvIHRoZSBrZXlib2FyZCBuYXZpZ2F0aW9uXG4gICAgICAvLyBzdGlsbCB3b3Jrcy4gV2UgbmVlZCB0byBjaGVjayB0aGF0IGBmb2N1c2AgaXMgYSBmdW5jdGlvbiBkdWUgdG8gVW5pdmVyc2FsLlxuICAgICAgaWYgKCFoYXNNb3ZlZEZvY3VzICYmIHR5cGVvZiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgZm9jdXMgaXMgY3VycmVudGx5IGluc2lkZSB0aGUgZHJhd2VyLCByZXN0b3JlcyBpdCB0byB3aGVyZSBpdCB3YXMgYmVmb3JlIHRoZSBkcmF3ZXJcbiAgICogb3BlbmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGlmICghdGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVFbCA9IHRoaXMuX2RvYyAmJiB0aGlzLl9kb2MuYWN0aXZlRWxlbWVudDtcblxuICAgIGlmIChhY3RpdmVFbCAmJiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWwpKSB7XG4gICAgICBpZiAodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQsIHRoaXMuX29wZW5lZFZpYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkID0gbnVsbDtcbiAgICB0aGlzLl9vcGVuZWRWaWEgPSBudWxsO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBFbmFibGUgdGhlIGFuaW1hdGlvbnMgYWZ0ZXIgdGhlIGxpZmVjeWNsZSBob29rcyBoYXZlIHJ1biwgaW4gb3JkZXIgdG8gYXZvaWQgYW5pbWF0aW5nXG4gICAgLy8gZHJhd2VycyB0aGF0IGFyZSBvcGVuIGJ5IGRlZmF1bHQuIFdoZW4gd2UncmUgb24gdGhlIHNlcnZlciwgd2Ugc2hvdWxkbid0IGVuYWJsZSB0aGVcbiAgICAvLyBhbmltYXRpb25zLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIGRyYXdlciB0byBhbmltYXRlIHRoZSBmaXJzdCB0aW1lIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgcGFnZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9lbmFibGVBbmltYXRpb25zID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25FbmQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9tb2RlQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbiB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIG9wZW4ob3BlbmVkVmlhPzogRm9jdXNPcmlnaW4pOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZSh0cnVlLCBvcGVuZWRWaWEpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBkcmF3ZXIuICovXG4gIGNsb3NlKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlKGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhpcyBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBiZSBvcGVuLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIHRvZ2dsZShpc09wZW46IGJvb2xlYW4gPSAhdGhpcy5vcGVuZWQsIG9wZW5lZFZpYTogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScpOlxuICAgIFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG5cbiAgICB0aGlzLl9vcGVuZWQgPSBpc09wZW47XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9IHRoaXMuX2VuYWJsZUFuaW1hdGlvbnMgPyAnb3BlbicgOiAnb3Blbi1pbnN0YW50JztcbiAgICAgIHRoaXMuX29wZW5lZFZpYSA9IG9wZW5lZFZpYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLm9wZW5lZENoYW5nZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcGVuID0+IHJlc29sdmUob3BlbiA/ICdvcGVuJyA6ICdjbG9zZScpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBfd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ID8gKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwKSA6IDA7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgZm9jdXMgdHJhcC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRm9jdXNUcmFwU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmVuYWJsZWQgPSB0aGlzLl9pc0ZvY3VzVHJhcEVuYWJsZWQ7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ0B0cmFuc2Zvcm0uc3RhcnQnLCBbJyRldmVudCddKVxuICBfYW5pbWF0aW9uU3RhcnRMaXN0ZW5lcihldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGFydGVkLm5leHQoZXZlbnQpO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ0B0cmFuc2Zvcm0uZG9uZScsIFsnJGV2ZW50J10pXG4gIF9hbmltYXRpb25Eb25lTGlzdGVuZXIoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLm5leHQoZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbG9zZTogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9Gb2N1czogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wZW5lZDogYm9vbGVhbiB8IHN0cmluZztcbn1cblxuXG4vKipcbiAqIGA8bWF0LWRyYXdlci1jb250YWluZXI+YCBjb21wb25lbnQuXG4gKlxuICogVGhpcyBpcyB0aGUgcGFyZW50IGNvbXBvbmVudCB0byBvbmUgb3IgdHdvIGA8bWF0LWRyYXdlcj5gcyB0aGF0IHZhbGlkYXRlcyB0aGUgc3RhdGUgaW50ZXJuYWxseVxuICogYW5kIGNvb3JkaW5hdGVzIHRoZSBiYWNrZHJvcCBhbmQgY29udGVudCBzdHlsaW5nLlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyLWNvbnRhaW5lcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyQ29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXItY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZHJhd2VyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItY29udGFpbmVyLWV4cGxpY2l0LWJhY2tkcm9wXSc6ICdfYmFja2Ryb3BPdmVycmlkZScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0RSQVdFUl9DT05UQUlORVIsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdERyYXdlckNvbnRhaW5lclxuICB9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250YWluZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICAvKiogQWxsIGRyYXdlcnMgaW4gdGhlIGNvbnRhaW5lci4gSW5jbHVkZXMgZHJhd2VycyBmcm9tIGluc2lkZSBuZXN0ZWQgY29udGFpbmVycy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXREcmF3ZXIsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KVxuICBfYWxsRHJhd2VyczogUXVlcnlMaXN0PE1hdERyYXdlcj47XG5cbiAgLyoqIERyYXdlcnMgdGhhdCBiZWxvbmcgdG8gdGhpcyBjb250YWluZXIuICovXG4gIF9kcmF3ZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+KCk7XG5cbiAgQENvbnRlbnRDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfY29udGVudDogTWF0RHJhd2VyQ29udGVudDtcbiAgQFZpZXdDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfdXNlckNvbnRlbnQ6IE1hdERyYXdlckNvbnRlbnQ7XG5cbiAgLyoqIFRoZSBkcmF3ZXIgY2hpbGQgd2l0aCB0aGUgYHN0YXJ0YCBwb3NpdGlvbi4gKi9cbiAgZ2V0IHN0YXJ0KCk6IE1hdERyYXdlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fc3RhcnQ7IH1cblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgZW5kYCBwb3NpdGlvbi4gKi9cbiAgZ2V0IGVuZCgpOiBNYXREcmF3ZXIgfCBudWxsIHsgcmV0dXJuIHRoaXMuX2VuZDsgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIHRoZSBjb250YWluZXIgd2hlbmV2ZXJcbiAgICogdGhlIHNpemUgb2YgYW55IG9mIGl0cyBkcmF3ZXJzIGNoYW5nZXMuXG4gICAqXG4gICAqICoqVXNlIGF0IHlvdXIgb3duIHJpc2shKiogRW5hYmxpbmcgdGhpcyBvcHRpb24gY2FuIGNhdXNlIGxheW91dCB0aHJhc2hpbmcgYnkgbWVhc3VyaW5nXG4gICAqIHRoZSBkcmF3ZXJzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuIENhbiBiZSBjb25maWd1cmVkIGdsb2JhbGx5IHZpYSB0aGVcbiAgICogYE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRWAgdG9rZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hdXRvc2l6ZTsgfVxuICBzZXQgYXV0b3NpemUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fYXV0b3NpemUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2F1dG9zaXplOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgY29udGFpbmVyIHNob3VsZCBoYXZlIGEgYmFja2Ryb3Agd2hpbGUgb25lIG9mIHRoZSBzaWRlbmF2cyBpcyBvcGVuLlxuICAgKiBJZiBleHBsaWNpdGx5IHNldCB0byBgdHJ1ZWAsIHRoZSBiYWNrZHJvcCB3aWxsIGJlIGVuYWJsZWQgZm9yIGRyYXdlcnMgaW4gdGhlIGBzaWRlYFxuICAgKiBtb2RlIGFzIHdlbGwuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaGFzQmFja2Ryb3AoKSB7XG4gICAgaWYgKHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICF0aGlzLl9zdGFydCB8fCB0aGlzLl9zdGFydC5tb2RlICE9PSAnc2lkZScgfHwgIXRoaXMuX2VuZCB8fCB0aGlzLl9lbmQubW9kZSAhPT0gJ3NpZGUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fYmFja2Ryb3BPdmVycmlkZSA9IHZhbHVlID09IG51bGwgPyBudWxsIDogY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBfYmFja2Ryb3BPdmVycmlkZTogYm9vbGVhbiB8IG51bGw7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGJhY2tkcm9wIGlzIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBiYWNrZHJvcENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBkcmF3ZXIgYXQgdGhlIHN0YXJ0L2VuZCBwb3NpdGlvbiwgaW5kZXBlbmRlbnQgb2YgZGlyZWN0aW9uLiAqL1xuICBwcml2YXRlIF9zdGFydDogTWF0RHJhd2VyIHwgbnVsbDtcbiAgcHJpdmF0ZSBfZW5kOiBNYXREcmF3ZXIgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgZHJhd2VyIGF0IHRoZSBsZWZ0L3JpZ2h0LiBXaGVuIGRpcmVjdGlvbiBjaGFuZ2VzLCB0aGVzZSB3aWxsIGNoYW5nZSBhcyB3ZWxsLlxuICAgKiBUaGV5J3JlIHVzZWQgYXMgYWxpYXNlcyBmb3IgdGhlIGFib3ZlIHRvIHNldCB0aGUgbGVmdC9yaWdodCBzdHlsZSBwcm9wZXJseS5cbiAgICogSW4gTFRSLCBfbGVmdCA9PSBfc3RhcnQgYW5kIF9yaWdodCA9PSBfZW5kLlxuICAgKiBJbiBSVEwsIF9sZWZ0ID09IF9lbmQgYW5kIF9yaWdodCA9PSBfc3RhcnQuXG4gICAqL1xuICBwcml2YXRlIF9sZWZ0OiBNYXREcmF3ZXIgfCBudWxsO1xuICBwcml2YXRlIF9yaWdodDogTWF0RHJhd2VyIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgb24gZXZlcnkgbmdEb0NoZWNrLiBVc2VkIGZvciBkZWJvdW5jaW5nIHJlZmxvd3MuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2RvQ2hlY2tTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogTWFyZ2lucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjb250ZW50LiBUaGVzZSBhcmUgdXNlZCB0byBwdXNoIC8gc2hyaW5rIHRoZSBkcmF3ZXIgY29udGVudCB3aGVuIGFcbiAgICogZHJhd2VyIGlzIG9wZW4uIFdlIHVzZSBtYXJnaW4gcmF0aGVyIHRoYW4gdHJhbnNmb3JtIGV2ZW4gZm9yIHB1c2ggbW9kZSBiZWNhdXNlIHRyYW5zZm9ybSBicmVha3NcbiAgICogZml4ZWQgcG9zaXRpb24gZWxlbWVudHMgaW5zaWRlIG9mIHRoZSB0cmFuc2Zvcm1lZCBlbGVtZW50LlxuICAgKi9cbiAgX2NvbnRlbnRNYXJnaW5zOiB7bGVmdDogbnVtYmVyfG51bGwsIHJpZ2h0OiBudW1iZXJ8bnVsbH0gPSB7bGVmdDogbnVsbCwgcmlnaHQ6IG51bGx9O1xuXG4gIHJlYWRvbmx5IF9jb250ZW50TWFyZ2luQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHtsZWZ0OiBudW1iZXJ8bnVsbCwgcmlnaHQ6IG51bWJlcnxudWxsfT4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBDZGtTY3JvbGxhYmxlIGluc3RhbmNlIHRoYXQgd3JhcHMgdGhlIHNjcm9sbGFibGUgY29udGVudC4gKi9cbiAgZ2V0IHNjcm9sbGFibGUoKTogQ2RrU2Nyb2xsYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJDb250ZW50IHx8IHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkUpIGRlZmF1bHRBdXRvc2l6ZSA9IGZhbHNlLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuXG4gICAgLy8gSWYgYSBgRGlyYCBkaXJlY3RpdmUgZXhpc3RzIHVwIHRoZSB0cmVlLCBsaXN0ZW4gZGlyZWN0aW9uIGNoYW5nZXNcbiAgICAvLyBhbmQgdXBkYXRlIHRoZSBsZWZ0L3JpZ2h0IHByb3BlcnRpZXMgdG8gcG9pbnQgdG8gdGhlIHByb3BlciBzdGFydC9lbmQuXG4gICAgaWYgKF9kaXIpIHtcbiAgICAgIF9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgbWluaW11bSB3aWR0aCBvZiB0aGUgc2lkZW5hdiBkZXBlbmRzIG9uIHRoZSB2aWV3cG9ydCB3aWR0aCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJlY29tcHV0ZSB0aGUgbWFyZ2lucyBpZiB0aGUgdmlld3BvcnQgY2hhbmdlcy5cbiAgICB2aWV3cG9ydFJ1bGVyLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcblxuICAgIHRoaXMuX2F1dG9zaXplID0gZGVmYXVsdEF1dG9zaXplO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FsbERyYXdlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbERyYXdlcnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRyYXdlcjogUXVlcnlMaXN0PE1hdERyYXdlcj4pID0+IHtcbiAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMC4wLjAgUmVtb3ZlIGBfY29udGFpbmVyYCBjaGVjayBvbmNlIGNvbnRhaW5lciBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAgICAgIHRoaXMuX2RyYXdlcnMucmVzZXQoZHJhd2VyLmZpbHRlcihpdGVtID0+ICFpdGVtLl9jb250YWluZXIgfHwgaXRlbS5fY29udGFpbmVyID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RyYXdlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2RyYXdlcnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuXG4gICAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goKGRyYXdlcjogTWF0RHJhd2VyKSA9PiB7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyVG9nZ2xlKGRyYXdlcik7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0aGlzLl9kcmF3ZXJzLmxlbmd0aCB8fFxuICAgICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgfHxcbiAgICAgICAgICB0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZG9DaGVja1N1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMCksIC8vIEFyYml0cmFyeSBkZWJvdW5jZSB0aW1lLCBsZXNzIHRoYW4gYSBmcmFtZSBhdCA2MGZwc1xuICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY29udGVudE1hcmdpbkNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kb0NoZWNrU3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2FsbHMgYG9wZW5gIG9mIGJvdGggc3RhcnQgYW5kIGVuZCBkcmF3ZXJzICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIub3BlbigpKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgY2xvc2VgIG9mIGJvdGggc3RhcnQgYW5kIGVuZCBkcmF3ZXJzICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyLmNsb3NlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyBhbmQgdXBkYXRlcyB0aGUgaW5saW5lIHN0eWxlcyBmb3IgdGhlIGNvbnRlbnQuIE5vdGUgdGhhdCB0aGlzIHNob3VsZCBiZSB1c2VkXG4gICAqIHNwYXJpbmdseSwgYmVjYXVzZSBpdCBjYXVzZXMgYSByZWZsb3cuXG4gICAqL1xuICB1cGRhdGVDb250ZW50TWFyZ2lucygpIHtcbiAgICAvLyAxLiBGb3IgZHJhd2VycyBpbiBgb3ZlcmAgbW9kZSwgdGhleSBkb24ndCBhZmZlY3QgdGhlIGNvbnRlbnQuXG4gICAgLy8gMi4gRm9yIGRyYXdlcnMgaW4gYHNpZGVgIG1vZGUgdGhleSBzaG91bGQgc2hyaW5rIHRoZSBjb250ZW50LiBXZSBkbyB0aGlzIGJ5IGFkZGluZyB0byB0aGVcbiAgICAvLyAgICBsZWZ0IG1hcmdpbiAoZm9yIGxlZnQgZHJhd2VyKSBvciByaWdodCBtYXJnaW4gKGZvciByaWdodCB0aGUgZHJhd2VyKS5cbiAgICAvLyAzLiBGb3IgZHJhd2VycyBpbiBgcHVzaGAgbW9kZSB0aGUgc2hvdWxkIHNoaWZ0IHRoZSBjb250ZW50IHdpdGhvdXQgcmVzaXppbmcgaXQuIFdlIGRvIHRoaXMgYnlcbiAgICAvLyAgICBhZGRpbmcgdG8gdGhlIGxlZnQgb3IgcmlnaHQgbWFyZ2luIGFuZCBzaW11bHRhbmVvdXNseSBzdWJ0cmFjdGluZyB0aGUgc2FtZSBhbW91bnQgb2ZcbiAgICAvLyAgICBtYXJnaW4gZnJvbSB0aGUgb3RoZXIgc2lkZS5cbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgbGV0IHJpZ2h0ID0gMDtcblxuICAgIGlmICh0aGlzLl9sZWZ0ICYmIHRoaXMuX2xlZnQub3BlbmVkKSB7XG4gICAgICBpZiAodGhpcy5fbGVmdC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICBsZWZ0ICs9IHRoaXMuX2xlZnQuX3dpZHRoO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fbGVmdC5fd2lkdGg7XG4gICAgICAgIGxlZnQgKz0gd2lkdGg7XG4gICAgICAgIHJpZ2h0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9yaWdodCAmJiB0aGlzLl9yaWdodC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICByaWdodCArPSB0aGlzLl9yaWdodC5fd2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fcmlnaHQuX3dpZHRoO1xuICAgICAgICByaWdodCArPSB3aWR0aDtcbiAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBlaXRoZXIgYHJpZ2h0YCBvciBgbGVmdGAgaXMgemVybywgZG9uJ3Qgc2V0IGEgc3R5bGUgdG8gdGhlIGVsZW1lbnQuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXNlcnMgdG8gc3BlY2lmeSBhIGN1c3RvbSBzaXplIHZpYSBDU1MgY2xhc3MgaW4gU1NSIHNjZW5hcmlvcyB3aGVyZSB0aGVcbiAgICAvLyBtZWFzdXJlZCB3aWR0aHMgd2lsbCBhbHdheXMgYmUgemVyby4gTm90ZSB0aGF0IHdlIHJlc2V0IHRvIGBudWxsYCBoZXJlLCByYXRoZXJcbiAgICAvLyB0aGFuIGJlbG93LCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdHlwZXMgaW4gdGhlIGBpZmAgYmVsb3cgYXJlIGNvbnNpc3RlbnQuXG4gICAgbGVmdCA9IGxlZnQgfHwgbnVsbCE7XG4gICAgcmlnaHQgPSByaWdodCB8fCBudWxsITtcblxuICAgIGlmIChsZWZ0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5sZWZ0IHx8IHJpZ2h0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5yaWdodCkge1xuICAgICAgdGhpcy5fY29udGVudE1hcmdpbnMgPSB7bGVmdCwgcmlnaHR9O1xuXG4gICAgICAvLyBQdWxsIGJhY2sgaW50byB0aGUgTmdab25lIHNpbmNlIGluIHNvbWUgY2FzZXMgd2UgY291bGQgYmUgb3V0c2lkZS4gV2UgbmVlZCB0byBiZSBjYXJlZnVsXG4gICAgICAvLyB0byBkbyBpdCBvbmx5IHdoZW4gc29tZXRoaW5nIGNoYW5nZWQsIG90aGVyd2lzZSB3ZSBjYW4gZW5kIHVwIGhpdHRpbmcgdGhlIHpvbmUgdG9vIG9mdGVuLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5uZXh0KHRoaXMuX2NvbnRlbnRNYXJnaW5zKSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIElmIHVzZXJzIG9wdGVkIGludG8gYXV0b3NpemluZywgZG8gYSBjaGVjayBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9hdXRvc2l6ZSAmJiB0aGlzLl9pc1B1c2hlZCgpKSB7XG4gICAgICAvLyBSdW4gb3V0c2lkZSB0aGUgTmdab25lLCBvdGhlcndpc2UgdGhlIGRlYm91bmNlciB3aWxsIHRocm93IHVzIGludG8gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLl9kb0NoZWNrU3ViamVjdC5uZXh0KCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBldmVudHMgaW4gb3JkZXIgdG8gc2V0IGEgY2xhc3Mgb24gdGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQgd2hlbiB0aGVcbiAgICogZHJhd2VyIGlzIG9wZW4gYW5kIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiBUaGlzIGVuc3VyZXMgYW55IG92ZXJmbG93IG9uIHRoZSBjb250YWluZXIgZWxlbWVudFxuICAgKiBpcyBwcm9wZXJseSBoaWRkZW4uXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclRvZ2dsZShkcmF3ZXI6IE1hdERyYXdlcik6IHZvaWQge1xuICAgIGRyYXdlci5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgICAgZmlsdGVyKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IGV2ZW50LmZyb21TdGF0ZSAhPT0gZXZlbnQudG9TdGF0ZSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSxcbiAgICApXG4gICAgLnN1YnNjcmliZSgoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICAvLyBTZXQgdGhlIHRyYW5zaXRpb24gY2xhc3Mgb24gdGhlIGNvbnRhaW5lciBzbyB0aGF0IHRoZSBhbmltYXRpb25zIG9jY3VyLiBUaGlzIHNob3VsZCBub3RcbiAgICAgIC8vIGJlIHNldCBpbml0aWFsbHkgYmVjYXVzZSBhbmltYXRpb25zIHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZCB2aWEgYSBjaGFuZ2UgaW4gc3RhdGUuXG4gICAgICBpZiAoZXZlbnQudG9TdGF0ZSAhPT0gJ29wZW4taW5zdGFudCcgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWRyYXdlci10cmFuc2l0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgaWYgKGRyYXdlci5tb2RlICE9PSAnc2lkZScpIHtcbiAgICAgIGRyYXdlci5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+XG4gICAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyQ2xhc3MoZHJhd2VyLm9wZW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBvblBvc2l0aW9uQ2hhbmdlZCBldmVudCBpbiBvcmRlciB0b1xuICAgKiByZS12YWxpZGF0ZSBkcmF3ZXJzIHdoZW4gdGhlIHBvc2l0aW9uIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTk9URTogV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IGJlZm9yZSB2YWxpZGF0aW5nLFxuICAgIC8vIHNpbmNlIGJvdGggZHJhd2VycyBtYXkgYmUgc3dhcHBpbmcgcG9zaXRpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgZHJhd2VyLm9uUG9zaXRpb25DaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIGRyYXdlciBtb2RlIHNvIHdlIGNhbiBydW4gY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKGRyYXdlcikge1xuICAgICAgZHJhd2VyLl9tb2RlQ2hhbmdlZC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3llZCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSAnbWF0LWRyYXdlci1vcGVuZWQnIGNsYXNzIG9uIHRoZSBtYWluICdtYXQtZHJhd2VyLWNvbnRhaW5lcicgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc2V0Q29udGFpbmVyQ2xhc3MoaXNBZGQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9ICdtYXQtZHJhd2VyLWNvbnRhaW5lci1oYXMtb3Blbic7XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlciBjaGlsZHJlbiBjb21wb25lbnRzLiAqL1xuICBwcml2YXRlIF92YWxpZGF0ZURyYXdlcnMoKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9lbmQgPSBudWxsO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhdCBtb3N0IG9uZSBzdGFydCBhbmQgb25lIGVuZCBkcmF3ZXIuXG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiB7XG4gICAgICBpZiAoZHJhd2VyLnBvc2l0aW9uID09ICdlbmQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmQgIT0gbnVsbCkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdlbmQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbmQgPSBkcmF3ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdzdGFydCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gZHJhd2VyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9sZWZ0ID0gbnVsbDtcblxuICAgIC8vIERldGVjdCBpZiB3ZSdyZSBMVFIgb3IgUlRMLlxuICAgIGlmICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX2VuZDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9zdGFydDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fZW5kO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250YWluZXIgaXMgYmVpbmcgcHVzaGVkIHRvIHRoZSBzaWRlIGJ5IG9uZSBvZiB0aGUgZHJhd2Vycy4gKi9cbiAgcHJpdmF0ZSBfaXNQdXNoZWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpICYmIHRoaXMuX3N0YXJ0Lm1vZGUgIT0gJ292ZXInKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fZW5kLm1vZGUgIT0gJ292ZXInKTtcbiAgfVxuXG4gIF9vbkJhY2tkcm9wQ2xpY2tlZCgpIHtcbiAgICB0aGlzLmJhY2tkcm9wQ2xpY2suZW1pdCgpO1xuICAgIHRoaXMuX2Nsb3NlTW9kYWxEcmF3ZXIoKTtcbiAgfVxuXG4gIF9jbG9zZU1vZGFsRHJhd2VyKCkge1xuICAgIC8vIENsb3NlIGFsbCBvcGVuIGRyYXdlcnMgd2hlcmUgY2xvc2luZyBpcyBub3QgZGlzYWJsZWQgYW5kIHRoZSBtb2RlIGlzIG5vdCBgc2lkZWAuXG4gICAgW3RoaXMuX3N0YXJ0LCB0aGlzLl9lbmRdXG4gICAgICAuZmlsdGVyKGRyYXdlciA9PiBkcmF3ZXIgJiYgIWRyYXdlci5kaXNhYmxlQ2xvc2UgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcikpXG4gICAgICAuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyIS5jbG9zZSgpKTtcbiAgfVxuXG4gIF9pc1Nob3dpbmdCYWNrZHJvcCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX3N0YXJ0KSkgfHxcbiAgICAgICAgICAgKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpICYmIHRoaXMuX2NhbkhhdmVCYWNrZHJvcCh0aGlzLl9lbmQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NhbkhhdmVCYWNrZHJvcChkcmF3ZXI6IE1hdERyYXdlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkcmF3ZXIubW9kZSAhPT0gJ3NpZGUnIHx8ICEhdGhpcy5fYmFja2Ryb3BPdmVycmlkZTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRHJhd2VyT3BlbihkcmF3ZXI6IE1hdERyYXdlciB8IG51bGwpOiBkcmF3ZXIgaXMgTWF0RHJhd2VyIHtcbiAgICByZXR1cm4gZHJhd2VyICE9IG51bGwgJiYgZHJhd2VyLm9wZW5lZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvc2l6ZTogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0JhY2tkcm9wOiBib29sZWFuIHwgc3RyaW5nO1xufVxuIl19