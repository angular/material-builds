import * as tslib_1 from "tslib";
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
 * @docs-private
 */
export function throwMatDuplicatedDrawerError(position) {
    throw Error("A drawer was already declared for 'position=\"" + position + "\"'");
}
/** Configures whether drawers should use auto sizing by default. */
export var MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken('MAT_DRAWER_DEFAULT_AUTOSIZE', {
    providedIn: 'root',
    factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY,
});
/** @docs-private */
export function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
    return false;
}
var MatDrawerContent = /** @class */ (function (_super) {
    tslib_1.__extends(MatDrawerContent, _super);
    function MatDrawerContent(_changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone) {
        var _this = _super.call(this, elementRef, scrollDispatcher, ngZone) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._container = _container;
        return _this;
    }
    MatDrawerContent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._container._contentMarginChanges.subscribe(function () {
            _this._changeDetectorRef.markForCheck();
        });
    };
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
    MatDrawerContent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: MatDrawerContainer, decorators: [{ type: Inject, args: [forwardRef(function () { return MatDrawerContainer; }),] }] },
        { type: ElementRef },
        { type: ScrollDispatcher },
        { type: NgZone }
    ]; };
    return MatDrawerContent;
}(CdkScrollable));
export { MatDrawerContent };
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
var MatDrawer = /** @class */ (function () {
    function MatDrawer(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _doc) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._doc = _doc;
        this._elementFocusedBeforeDrawerWasOpened = null;
        /** Whether the drawer is initialized. Used for disabling the initial animation. */
        this._enableAnimations = false;
        this._position = 'start';
        this._mode = 'over';
        this._disableClose = false;
        this._autoFocus = true;
        /** Emits whenever the drawer has started animating. */
        this._animationStarted = new Subject();
        /** Emits whenever the drawer is done animating. */
        this._animationEnd = new Subject();
        /** Current state of the sidenav animation. */
        // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
        // metadata is not inherited by child classes, instead the host binding data is defined in a way
        // that can be inherited.
        // tslint:disable:no-host-decorator-in-concrete
        this._animationState = 'void';
        /** Event emitted when the drawer open state is changed. */
        this.openedChange = 
        // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
        new EventEmitter(/* isAsync */ true);
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Event emitted when the drawer's position changes. */
        // tslint:disable-next-line:no-output-on-prefix
        this.onPositionChanged = new EventEmitter();
        /**
         * An observable that emits when the drawer mode changes. This is used by the drawer container to
         * to know when to when the mode changes so it can adapt the margins on the content.
         */
        this._modeChanged = new Subject();
        this._opened = false;
        this.openedChange.subscribe(function (opened) {
            if (opened) {
                if (_this._doc) {
                    _this._elementFocusedBeforeDrawerWasOpened = _this._doc.activeElement;
                }
                if (_this._isFocusTrapEnabled && _this._focusTrap) {
                    _this._trapFocus();
                }
            }
            else {
                _this._restoreFocus();
            }
        });
        /**
         * Listen to `keydown` events outside the zone so that change detection is not run every
         * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
         * and we don't have close disabled.
         */
        this._ngZone.runOutsideAngular(function () {
            fromEvent(_this._elementRef.nativeElement, 'keydown').pipe(filter(function (event) {
                return event.keyCode === ESCAPE && !_this.disableClose && !hasModifierKey(event);
            }), takeUntil(_this._destroyed)).subscribe(function (event) { return _this._ngZone.run(function () {
                _this.close();
                event.stopPropagation();
                event.preventDefault();
            }); });
        });
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._animationEnd.pipe(distinctUntilChanged(function (x, y) {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(function (event) {
            var fromState = event.fromState, toState = event.toState;
            if ((toState.indexOf('open') === 0 && fromState === 'void') ||
                (toState === 'void' && fromState.indexOf('open') === 0)) {
                _this.openedChange.emit(_this._opened);
            }
        });
    }
    Object.defineProperty(MatDrawer.prototype, "position", {
        /** The side that the drawer is attached to. */
        get: function () { return this._position; },
        set: function (value) {
            // Make sure we have a valid value.
            value = value === 'end' ? 'end' : 'start';
            if (value != this._position) {
                this._position = value;
                this.onPositionChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "mode", {
        /** Mode of the drawer; one of 'over', 'push' or 'side'. */
        get: function () { return this._mode; },
        set: function (value) {
            this._mode = value;
            this._updateFocusTrapState();
            this._modeChanged.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "disableClose", {
        /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
        get: function () { return this._disableClose; },
        set: function (value) { this._disableClose = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "autoFocus", {
        /** Whether the drawer should focus the first focusable element automatically when opened. */
        get: function () { return this._autoFocus; },
        set: function (value) { this._autoFocus = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_openedStream", {
        /** Event emitted when the drawer has been opened. */
        get: function () {
            return this.openedChange.pipe(filter(function (o) { return o; }), map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "openedStart", {
        /** Event emitted when the drawer has started opening. */
        get: function () {
            return this._animationStarted.pipe(filter(function (e) { return e.fromState !== e.toState && e.toState.indexOf('open') === 0; }), map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_closedStream", {
        /** Event emitted when the drawer has been closed. */
        get: function () {
            return this.openedChange.pipe(filter(function (o) { return !o; }), map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "closedStart", {
        /** Event emitted when the drawer has started closing. */
        get: function () {
            return this._animationStarted.pipe(filter(function (e) { return e.fromState !== e.toState && e.toState === 'void'; }), map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_isFocusTrapEnabled", {
        get: function () {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            return this.opened && this.mode !== 'side';
        },
        enumerable: true,
        configurable: true
    });
    /** Traps focus inside the drawer. */
    MatDrawer.prototype._trapFocus = function () {
        var _this = this;
        if (!this.autoFocus) {
            return;
        }
        this._focusTrap.focusInitialElementWhenReady().then(function (hasMovedFocus) {
            // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
            // still works. We need to check that `focus` is a function due to Universal.
            if (!hasMovedFocus && typeof _this._elementRef.nativeElement.focus === 'function') {
                _this._elementRef.nativeElement.focus();
            }
        });
    };
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     */
    MatDrawer.prototype._restoreFocus = function () {
        if (!this.autoFocus) {
            return;
        }
        var activeEl = this._doc && this._doc.activeElement;
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
    };
    MatDrawer.prototype.ngAfterContentInit = function () {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._updateFocusTrapState();
    };
    MatDrawer.prototype.ngAfterContentChecked = function () {
        // Enable the animations after the lifecycle hooks have run, in order to avoid animating
        // drawers that are open by default. When we're on the server, we shouldn't enable the
        // animations, because we don't want the drawer to animate the first time the user sees
        // the page.
        if (this._platform.isBrowser) {
            this._enableAnimations = true;
        }
    };
    MatDrawer.prototype.ngOnDestroy = function () {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
        this._animationStarted.complete();
        this._animationEnd.complete();
        this._modeChanged.complete();
        this._destroyed.next();
        this._destroyed.complete();
    };
    Object.defineProperty(MatDrawer.prototype, "opened", {
        /**
         * Whether the drawer is opened. We overload this because we trigger an event when it
         * starts or end.
         */
        get: function () { return this._opened; },
        set: function (value) { this.toggle(coerceBooleanProperty(value)); },
        enumerable: true,
        configurable: true
    });
    /**
     * Open the drawer.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    MatDrawer.prototype.open = function (openedVia) {
        return this.toggle(true, openedVia);
    };
    /** Close the drawer. */
    MatDrawer.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    MatDrawer.prototype.toggle = function (isOpen, openedVia) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        if (openedVia === void 0) { openedVia = 'program'; }
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
        return new Promise(function (resolve) {
            _this.openedChange.pipe(take(1)).subscribe(function (open) { return resolve(open ? 'open' : 'close'); });
        });
    };
    Object.defineProperty(MatDrawer.prototype, "_width", {
        get: function () {
            return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
        },
        enumerable: true,
        configurable: true
    });
    /** Updates the enabled state of the focus trap. */
    MatDrawer.prototype._updateFocusTrapState = function () {
        if (this._focusTrap) {
            this._focusTrap.enabled = this._isFocusTrapEnabled;
        }
    };
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    MatDrawer.prototype._animationStartListener = function (event) {
        this._animationStarted.next(event);
    };
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    MatDrawer.prototype._animationDoneListener = function (event) {
        this._animationEnd.next(event);
    };
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
    MatDrawer.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FocusTrapFactory },
        { type: FocusMonitor },
        { type: Platform },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
    ]; };
    MatDrawer.propDecorators = {
        position: [{ type: Input }],
        mode: [{ type: Input }],
        disableClose: [{ type: Input }],
        autoFocus: [{ type: Input }],
        _animationState: [{ type: HostBinding, args: ['@transform',] }],
        openedChange: [{ type: Output }],
        _openedStream: [{ type: Output, args: ['opened',] }],
        openedStart: [{ type: Output }],
        _closedStream: [{ type: Output, args: ['closed',] }],
        closedStart: [{ type: Output }],
        onPositionChanged: [{ type: Output, args: ['positionChanged',] }],
        opened: [{ type: Input }],
        _animationStartListener: [{ type: HostListener, args: ['@transform.start', ['$event'],] }],
        _animationDoneListener: [{ type: HostListener, args: ['@transform.done', ['$event'],] }]
    };
    return MatDrawer;
}());
export { MatDrawer };
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MatDrawerContainer = /** @class */ (function () {
    function MatDrawerContainer(_dir, _element, _ngZone, _changeDetectorRef, viewportRuler, defaultAutosize, _animationMode) {
        var _this = this;
        if (defaultAutosize === void 0) { defaultAutosize = false; }
        this._dir = _dir;
        this._element = _element;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /** Event emitted when the drawer backdrop is clicked. */
        this.backdropClick = new EventEmitter();
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Emits on every ngDoCheck. Used for debouncing reflows. */
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
            _dir.change.pipe(takeUntil(this._destroyed)).subscribe(function () {
                _this._validateDrawers();
                _this.updateContentMargins();
            });
        }
        // Since the minimum width of the sidenav depends on the viewport width,
        // we need to recompute the margins if the viewport changes.
        viewportRuler.change()
            .pipe(takeUntil(this._destroyed))
            .subscribe(function () { return _this.updateContentMargins(); });
        this._autosize = defaultAutosize;
    }
    Object.defineProperty(MatDrawerContainer.prototype, "start", {
        /** The drawer child with the `start` position. */
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "end", {
        /** The drawer child with the `end` position. */
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "autosize", {
        /**
         * Whether to automatically resize the container whenever
         * the size of any of its drawers changes.
         *
         * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
         * the drawers on every change detection cycle. Can be configured globally via the
         * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
         */
        get: function () { return this._autosize; },
        set: function (value) { this._autosize = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "hasBackdrop", {
        /**
         * Whether the drawer container should have a backdrop while one of the sidenavs is open.
         * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
         * mode as well.
         */
        get: function () {
            if (this._backdropOverride == null) {
                return !this._start || this._start.mode !== 'side' || !this._end || this._end.mode !== 'side';
            }
            return this._backdropOverride;
        },
        set: function (value) {
            this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "scrollable", {
        /** Reference to the CdkScrollable instance that wraps the scrollable content. */
        get: function () {
            return this._userContent || this._content;
        },
        enumerable: true,
        configurable: true
    });
    MatDrawerContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._drawers.changes.pipe(startWith(null)).subscribe(function () {
            _this._validateDrawers();
            _this._drawers.forEach(function (drawer) {
                _this._watchDrawerToggle(drawer);
                _this._watchDrawerPosition(drawer);
                _this._watchDrawerMode(drawer);
            });
            if (!_this._drawers.length ||
                _this._isDrawerOpen(_this._start) ||
                _this._isDrawerOpen(_this._end)) {
                _this.updateContentMargins();
            }
            _this._changeDetectorRef.markForCheck();
        });
        this._doCheckSubject.pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
        takeUntil(this._destroyed)).subscribe(function () { return _this.updateContentMargins(); });
    };
    MatDrawerContainer.prototype.ngOnDestroy = function () {
        this._contentMarginChanges.complete();
        this._doCheckSubject.complete();
        this._destroyed.next();
        this._destroyed.complete();
    };
    /** Calls `open` of both start and end drawers */
    MatDrawerContainer.prototype.open = function () {
        this._drawers.forEach(function (drawer) { return drawer.open(); });
    };
    /** Calls `close` of both start and end drawers */
    MatDrawerContainer.prototype.close = function () {
        this._drawers.forEach(function (drawer) { return drawer.close(); });
    };
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     */
    MatDrawerContainer.prototype.updateContentMargins = function () {
        var _this = this;
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        var left = 0;
        var right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._width;
            }
            else if (this._left.mode == 'push') {
                var width = this._left._width;
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._width;
            }
            else if (this._right.mode == 'push') {
                var width = this._right._width;
                right += width;
                left -= width;
            }
        }
        // If either `right` or `left` is zero, don't set a style to the element. This
        // allows users to specify a custom size via CSS class in SSR scenarios where the
        // measured widths will always be zero. Note that we reset to `null` here, rather
        // than below, in order to ensure that the types in the `if` below are consistent.
        left = left || null;
        right = right || null;
        if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
            this._contentMargins = { left: left, right: right };
            // Pull back into the NgZone since in some cases we could be outside. We need to be careful
            // to do it only when something changed, otherwise we can end up hitting the zone too often.
            this._ngZone.run(function () { return _this._contentMarginChanges.next(_this._contentMargins); });
        }
    };
    MatDrawerContainer.prototype.ngDoCheck = function () {
        var _this = this;
        // If users opted into autosizing, do a check every change detection cycle.
        if (this._autosize && this._isPushed()) {
            // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
            this._ngZone.runOutsideAngular(function () { return _this._doCheckSubject.next(); });
        }
    };
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     */
    MatDrawerContainer.prototype._watchDrawerToggle = function (drawer) {
        var _this = this;
        drawer._animationStarted.pipe(filter(function (event) { return event.fromState !== event.toState; }), takeUntil(this._drawers.changes))
            .subscribe(function (event) {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant' && _this._animationMode !== 'NoopAnimations') {
                _this._element.nativeElement.classList.add('mat-drawer-transition');
            }
            _this.updateContentMargins();
            _this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(function () {
                return _this._setContainerClass(drawer.opened);
            });
        }
    };
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     */
    MatDrawerContainer.prototype._watchDrawerPosition = function (drawer) {
        var _this = this;
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(function () {
            _this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(function () {
                _this._validateDrawers();
            });
        });
    };
    /** Subscribes to changes in drawer mode so we can run change detection. */
    MatDrawerContainer.prototype._watchDrawerMode = function (drawer) {
        var _this = this;
        if (drawer) {
            drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
                .subscribe(function () {
                _this.updateContentMargins();
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
    MatDrawerContainer.prototype._setContainerClass = function (isAdd) {
        var classList = this._element.nativeElement.classList;
        var className = 'mat-drawer-container-has-open';
        if (isAdd) {
            classList.add(className);
        }
        else {
            classList.remove(className);
        }
    };
    /** Validate the state of the drawer children components. */
    MatDrawerContainer.prototype._validateDrawers = function () {
        var _this = this;
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach(function (drawer) {
            if (drawer.position == 'end') {
                if (_this._end != null) {
                    throwMatDuplicatedDrawerError('end');
                }
                _this._end = drawer;
            }
            else {
                if (_this._start != null) {
                    throwMatDuplicatedDrawerError('start');
                }
                _this._start = drawer;
            }
        });
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
    };
    /** Whether the container is being pushed to the side by one of the drawers. */
    MatDrawerContainer.prototype._isPushed = function () {
        return (this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
            (this._isDrawerOpen(this._end) && this._end.mode != 'over');
    };
    MatDrawerContainer.prototype._onBackdropClicked = function () {
        this.backdropClick.emit();
        this._closeModalDrawer();
    };
    MatDrawerContainer.prototype._closeModalDrawer = function () {
        var _this = this;
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(function (drawer) { return drawer && !drawer.disableClose && _this._canHaveBackdrop(drawer); })
            .forEach(function (drawer) { return drawer.close(); });
    };
    MatDrawerContainer.prototype._isShowingBackdrop = function () {
        return (this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
            (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end));
    };
    MatDrawerContainer.prototype._canHaveBackdrop = function (drawer) {
        return drawer.mode !== 'side' || !!this._backdropOverride;
    };
    MatDrawerContainer.prototype._isDrawerOpen = function (drawer) {
        return drawer != null && drawer.opened;
    };
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
                    styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}@media(-ms-high-contrast: active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}@media(-ms-high-contrast: active){.mat-drawer,[dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}}@media(-ms-high-contrast: active){[dir=rtl] .mat-drawer,.mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}/*# sourceMappingURL=drawer.css.map */\n"]
                }] }
    ];
    /** @nocollapse */
    MatDrawerContainer.ctorParameters = function () { return [
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: ElementRef },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DRAWER_DEFAULT_AUTOSIZE,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    MatDrawerContainer.propDecorators = {
        _drawers: [{ type: ContentChildren, args: [MatDrawer,] }],
        _content: [{ type: ContentChild, args: [MatDrawerContent, { static: false },] }],
        _userContent: [{ type: ViewChild, args: [MatDrawerContent, { static: false },] }],
        autosize: [{ type: Input }],
        hasBackdrop: [{ type: Input }],
        backdropClick: [{ type: Output }]
    };
    return MatDrawerContainer;
}());
export { MatDrawerContainer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUEwQixnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNqQixZQUFZLEVBQ1osV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILFNBQVMsRUFDVCxJQUFJLEVBQ0osU0FBUyxFQUNULG9CQUFvQixHQUNyQixNQUFNLGdCQUFnQixDQUFD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QUEyQjs2Q0FDbEMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7OzsyQkFuRnBELGVBQWUsU0FBQyxTQUFTOzJCQUN6QixZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOytCQUM5QyxTQUFTLFNBQUMsZ0JBQWdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOzJCQWdCM0MsS0FBSzs4QkFVTCxLQUFLO2dDQWNMLE1BQU07O0lBa1NULHlCQUFDO0NBQUEsQUExVkQsSUEwVkM7U0E3VVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbiwgRm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5fSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGUsIFNjcm9sbERpc3BhdGNoZXIsIFZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSG9zdExpc3RlbmVyLFxuICBIb3N0QmluZGluZyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZGVib3VuY2VUaW1lLFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gdHdvIE1hdERyYXdlciBhcmUgbWF0Y2hpbmcgdGhlIHNhbWUgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdER1cGxpY2F0ZWREcmF3ZXJFcnJvcihwb3NpdGlvbjogc3RyaW5nKSB7XG4gIHRocm93IEVycm9yKGBBIGRyYXdlciB3YXMgYWxyZWFkeSBkZWNsYXJlZCBmb3IgJ3Bvc2l0aW9uPVwiJHtwb3NpdGlvbn1cIidgKTtcbn1cblxuXG4vKiogUmVzdWx0IG9mIHRoZSB0b2dnbGUgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlci4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlclRvZ2dsZVJlc3VsdCA9ICdvcGVuJyB8ICdjbG9zZSc7XG5cbi8qKiBDb25maWd1cmVzIHdoZXRoZXIgZHJhd2VycyBzaG91bGQgdXNlIGF1dG8gc2l6aW5nIGJ5IGRlZmF1bHQuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ01BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRScsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRV9GQUNUT1JZLFxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRV9GQUNUT1JZKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1sZWZ0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5sZWZ0JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1yaWdodC5weF0nOiAnX2NvbnRhaW5lci5fY29udGVudE1hcmdpbnMucmlnaHQnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyQ29udGVudCBleHRlbmRzIENka1Njcm9sbGFibGUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0RHJhd2VyQ29udGFpbmVyKSkgcHVibGljIF9jb250YWluZXI6IE1hdERyYXdlckNvbnRhaW5lcixcbiAgICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIG5nWm9uZTogTmdab25lKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgc2Nyb2xsRGlzcGF0Y2hlciwgbmdab25lKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jb250YWluZXIuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8gYSBkcmF3ZXIgdGhhdCBjYW4gYmUgb3BlbmVkIG9uIHRoZSBkcmF3ZXIgY29udGFpbmVyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci5odG1sJyxcbiAgYW5pbWF0aW9uczogW21hdERyYXdlckFuaW1hdGlvbnMudHJhbnNmb3JtRHJhd2VyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyJyxcbiAgICAvLyBtdXN0IHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSBhbGlnbmluZyB0ZXh0IGJhc2VkIG9uIHZhbHVlXG4gICAgJ1thdHRyLmFsaWduXSc6ICdudWxsJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItZW5kXSc6ICdwb3NpdGlvbiA9PT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW92ZXJdJzogJ21vZGUgPT09IFwib3ZlclwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItcHVzaF0nOiAnbW9kZSA9PT0gXCJwdXNoXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1zaWRlXSc6ICdtb2RlID09PSBcInNpZGVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW9wZW5lZF0nOiAnb3BlbmVkJyxcbiAgICAndGFiSW5kZXgnOiAnLTEnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXA7XG4gIHByaXZhdGUgX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgaW5pdGlhbGl6ZWQuIFVzZWQgZm9yIGRpc2FibGluZyB0aGUgaW5pdGlhbCBhbmltYXRpb24uICovXG4gIHByaXZhdGUgX2VuYWJsZUFuaW1hdGlvbnMgPSBmYWxzZTtcblxuICAvKiogVGhlIHNpZGUgdGhhdCB0aGUgZHJhd2VyIGlzIGF0dGFjaGVkIHRvLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcG9zaXRpb24oKTogJ3N0YXJ0JyB8ICdlbmQnIHsgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uOyB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogJ3N0YXJ0JyB8ICdlbmQnKSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYSB2YWxpZCB2YWx1ZS5cbiAgICB2YWx1ZSA9IHZhbHVlID09PSAnZW5kJyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBpZiAodmFsdWUgIT0gdGhpcy5fcG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG4gICAgICB0aGlzLm9uUG9zaXRpb25DaGFuZ2VkLmVtaXQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcG9zaXRpb246ICdzdGFydCcgfCAnZW5kJyA9ICdzdGFydCc7XG5cbiAgLyoqIE1vZGUgb2YgdGhlIGRyYXdlcjsgb25lIG9mICdvdmVyJywgJ3B1c2gnIG9yICdzaWRlJy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1vZGUoKTogJ292ZXInIHwgJ3B1c2gnIHwgJ3NpZGUnIHsgcmV0dXJuIHRoaXMuX21vZGU7IH1cbiAgc2V0IG1vZGUodmFsdWU6ICdvdmVyJyB8ICdwdXNoJyB8ICdzaWRlJykge1xuICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9tb2RlOiAnb3ZlcicgfCAncHVzaCcgfCAnc2lkZScgPSAnb3Zlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBjYW4gYmUgY2xvc2VkIHdpdGggdGhlIGVzY2FwZSBrZXkgb3IgYnkgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsb3NlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZUNsb3NlOyB9XG4gIHNldCBkaXNhYmxlQ2xvc2UodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZGlzYWJsZUNsb3NlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBmb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgYXV0b21hdGljYWxseSB3aGVuIG9wZW5lZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9Gb2N1cygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9Gb2N1czsgfVxuICBzZXQgYXV0b0ZvY3VzKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2F1dG9Gb2N1cyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfYXV0b0ZvY3VzOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogSG93IHRoZSBzaWRlbmF2IHdhcyBvcGVuZWQgKGtleXByZXNzLCBtb3VzZSBjbGljayBldGMuKSAqL1xuICBwcml2YXRlIF9vcGVuZWRWaWE6IEZvY3VzT3JpZ2luIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBhbmltYXRpbmcuICovXG4gIF9hbmltYXRpb25TdGFydGVkID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBkcmF3ZXIgaXMgZG9uZSBhbmltYXRpbmcuICovXG4gIF9hbmltYXRpb25FbmQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgc2lkZW5hdiBhbmltYXRpb24uICovXG4gIC8vIEBIb3N0QmluZGluZyBpcyB1c2VkIGluIHRoZSBjbGFzcyBhcyBpdCBpcyBleHBlY3RlZCB0byBiZSBleHRlbmRlZC4gIFNpbmNlIEBDb21wb25lbnQgZGVjb3JhdG9yXG4gIC8vIG1ldGFkYXRhIGlzIG5vdCBpbmhlcml0ZWQgYnkgY2hpbGQgY2xhc3NlcywgaW5zdGVhZCB0aGUgaG9zdCBiaW5kaW5nIGRhdGEgaXMgZGVmaW5lZCBpbiBhIHdheVxuICAvLyB0aGF0IGNhbiBiZSBpbmhlcml0ZWQuXG4gIC8vIHRzbGludDpkaXNhYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0QmluZGluZygnQHRyYW5zZm9ybScpXG4gIF9hbmltYXRpb25TdGF0ZTogJ29wZW4taW5zdGFudCcgfCAnb3BlbicgfCAndm9pZCcgPSAndm9pZCc7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIG9wZW4gc3RhdGUgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID1cbiAgICAgIC8vIE5vdGUgdGhpcyBoYXMgdG8gYmUgYXN5bmMgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBpc3N1ZXMgd2l0aCB0d28tYmluZGluZ3MgKHNlZSAjODg3MikuXG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KC8qIGlzQXN5bmMgKi90cnVlKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKVxuICBnZXQgX29wZW5lZFN0cmVhbSgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiBvKSwgbWFwKCgpID0+IHt9KSk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIHN0YXJ0ZWQgb3BlbmluZy4gKi9cbiAgQE91dHB1dCgpXG4gIGdldCBvcGVuZWRTdGFydCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgICAgZmlsdGVyKGUgPT4gZS5mcm9tU3RhdGUgIT09IGUudG9TdGF0ZSAmJiBlLnRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwKSxcbiAgICAgIG1hcCgoKSA9PiB7fSlcbiAgICApO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJylcbiAgZ2V0IF9jbG9zZWRTdHJlYW0oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKG8gPT4gIW8pLCBtYXAoKCkgPT4ge30pKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBAT3V0cHV0KClcbiAgZ2V0IGNsb3NlZFN0YXJ0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICAgIG1hcCgoKSA9PiB7fSlcbiAgICApO1xuICB9XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyJ3MgcG9zaXRpb24gY2hhbmdlcy4gKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgncG9zaXRpb25DaGFuZ2VkJykgb25Qb3NpdGlvbkNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIGRyYXdlciBtb2RlIGNoYW5nZXMuIFRoaXMgaXMgdXNlZCBieSB0aGUgZHJhd2VyIGNvbnRhaW5lciB0b1xuICAgKiB0byBrbm93IHdoZW4gdG8gd2hlbiB0aGUgbW9kZSBjaGFuZ2VzIHNvIGl0IGNhbiBhZGFwdCB0aGUgbWFyZ2lucyBvbiB0aGUgY29udGVudC5cbiAgICovXG4gIHJlYWRvbmx5IF9tb2RlQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgZ2V0IF9pc0ZvY3VzVHJhcEVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgLy8gVGhlIGZvY3VzIHRyYXAgaXMgb25seSBlbmFibGVkIHdoZW4gdGhlIGRyYXdlciBpcyBvcGVuIGluIGFueSBtb2RlIG90aGVyIHRoYW4gc2lkZS5cbiAgICByZXR1cm4gdGhpcy5vcGVuZWQgJiYgdGhpcy5tb2RlICE9PSAnc2lkZSc7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvYzogYW55KSB7XG5cbiAgICB0aGlzLm9wZW5lZENoYW5nZS5zdWJzY3JpYmUoKG9wZW5lZDogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKG9wZW5lZCkge1xuICAgICAgICBpZiAodGhpcy5fZG9jKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSB0aGlzLl9kb2MuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pc0ZvY3VzVHJhcEVuYWJsZWQgJiYgdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIGBrZXlkb3duYCBldmVudHMgb3V0c2lkZSB0aGUgem9uZSBzbyB0aGF0IGNoYW5nZSBkZXRlY3Rpb24gaXMgbm90IHJ1biBldmVyeVxuICAgICAqIHRpbWUgYSBrZXkgaXMgcHJlc3NlZC4gSW5zdGVhZCB3ZSByZS1lbnRlciB0aGUgem9uZSBvbmx5IGlmIHRoZSBgRVNDYCBrZXkgaXMgcHJlc3NlZFxuICAgICAqIGFuZCB3ZSBkb24ndCBoYXZlIGNsb3NlIGRpc2FibGVkLlxuICAgICAqL1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIChmcm9tRXZlbnQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAna2V5ZG93bicpIGFzIE9ic2VydmFibGU8S2V5Ym9hcmRFdmVudD4pLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgICApLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiB4LmZyb21TdGF0ZSA9PT0geS5mcm9tU3RhdGUgJiYgeC50b1N0YXRlID09PSB5LnRvU3RhdGU7XG4gICAgfSkpLnN1YnNjcmliZSgoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB7ZnJvbVN0YXRlLCB0b1N0YXRlfSA9IGV2ZW50O1xuXG4gICAgICBpZiAoKHRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwICYmIGZyb21TdGF0ZSA9PT0gJ3ZvaWQnKSB8fFxuICAgICAgICAgICh0b1N0YXRlID09PSAndm9pZCcgJiYgZnJvbVN0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCh0aGlzLl9vcGVuZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIFRyYXBzIGZvY3VzIGluc2lkZSB0aGUgZHJhd2VyLiAqL1xuICBwcml2YXRlIF90cmFwRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KCkudGhlbihoYXNNb3ZlZEZvY3VzID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIHdlcmUgbm8gZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyB0aGUgc2lkZW5hdiBpdHNlbGYgc28gdGhlIGtleWJvYXJkIG5hdmlnYXRpb25cbiAgICAgIC8vIHN0aWxsIHdvcmtzLiBXZSBuZWVkIHRvIGNoZWNrIHRoYXQgYGZvY3VzYCBpcyBhIGZ1bmN0aW9uIGR1ZSB0byBVbml2ZXJzYWwuXG4gICAgICBpZiAoIWhhc01vdmVkRm9jdXMgJiYgdHlwZW9mIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBmb2N1cyBpcyBjdXJyZW50bHkgaW5zaWRlIHRoZSBkcmF3ZXIsIHJlc3RvcmVzIGl0IHRvIHdoZXJlIGl0IHdhcyBiZWZvcmUgdGhlIGRyYXdlclxuICAgKiBvcGVuZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZUVsID0gdGhpcy5fZG9jICYmIHRoaXMuX2RvYy5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKGFjdGl2ZUVsICYmIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbCkpIHtcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCwgdGhpcy5fb3BlbmVkVmlhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSBudWxsO1xuICAgIHRoaXMuX29wZW5lZFZpYSA9IG51bGw7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIEVuYWJsZSB0aGUgYW5pbWF0aW9ucyBhZnRlciB0aGUgbGlmZWN5Y2xlIGhvb2tzIGhhdmUgcnVuLCBpbiBvcmRlciB0byBhdm9pZCBhbmltYXRpbmdcbiAgICAvLyBkcmF3ZXJzIHRoYXQgYXJlIG9wZW4gYnkgZGVmYXVsdC4gV2hlbiB3ZSdyZSBvbiB0aGUgc2VydmVyLCB3ZSBzaG91bGRuJ3QgZW5hYmxlIHRoZVxuICAgIC8vIGFuaW1hdGlvbnMsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0aGUgZHJhd2VyIHRvIGFuaW1hdGUgdGhlIGZpcnN0IHRpbWUgdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBwYWdlLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2VuYWJsZUFuaW1hdGlvbnMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgb3BlbmVkLiBXZSBvdmVybG9hZCB0aGlzIGJlY2F1c2Ugd2UgdHJpZ2dlciBhbiBldmVudCB3aGVuIGl0XG4gICAqIHN0YXJ0cyBvciBlbmQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3BlbmVkOyB9XG4gIHNldCBvcGVuZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy50b2dnbGUoY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSk7IH1cbiAgcHJpdmF0ZSBfb3BlbmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIG9wZW5lZFZpYSBXaGV0aGVyIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZCBieSBhIGtleSBwcmVzcywgbW91c2UgY2xpY2sgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogVXNlZCBmb3IgZm9jdXMgbWFuYWdlbWVudCBhZnRlciB0aGUgc2lkZW5hdiBpcyBjbG9zZWQuXG4gICAqL1xuICBvcGVuKG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGUodHJ1ZSwgb3BlbmVkVmlhKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgZHJhd2VyLiAqL1xuICBjbG9zZSgpOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZShmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIHRoaXMgZHJhd2VyLlxuICAgKiBAcGFyYW0gaXNPcGVuIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgYmUgb3Blbi5cbiAgICogQHBhcmFtIG9wZW5lZFZpYSBXaGV0aGVyIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZCBieSBhIGtleSBwcmVzcywgbW91c2UgY2xpY2sgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogVXNlZCBmb3IgZm9jdXMgbWFuYWdlbWVudCBhZnRlciB0aGUgc2lkZW5hdiBpcyBjbG9zZWQuXG4gICAqL1xuICB0b2dnbGUoaXNPcGVuOiBib29sZWFuID0gIXRoaXMub3BlbmVkLCBvcGVuZWRWaWE6IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTpcbiAgICBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuXG4gICAgdGhpcy5fb3BlbmVkID0gaXNPcGVuO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLl9lbmFibGVBbmltYXRpb25zID8gJ29wZW4nIDogJ29wZW4taW5zdGFudCc7XG4gICAgICB0aGlzLl9vcGVuZWRWaWEgPSBvcGVuZWRWaWE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3BlbiA9PiByZXNvbHZlKG9wZW4gPyAnb3BlbicgOiAnY2xvc2UnKSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgX3dpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA/ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMCkgOiAwO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGVuYWJsZWQgc3RhdGUgb2YgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCkge1xuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5lbmFibGVkID0gdGhpcy5faXNGb2N1c1RyYXBFbmFibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdAdHJhbnNmb3JtLnN0YXJ0JywgWyckZXZlbnQnXSlcbiAgX2FuaW1hdGlvblN0YXJ0TGlzdGVuZXIoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdAdHJhbnNmb3JtLmRvbmUnLCBbJyRldmVudCddKVxuICBfYW5pbWF0aW9uRG9uZUxpc3RlbmVyKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5uZXh0KGV2ZW50KTtcbiAgfVxufVxuXG5cbi8qKlxuICogYDxtYXQtZHJhd2VyLWNvbnRhaW5lcj5gIGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIG9uZSBvciB0d28gYDxtYXQtZHJhd2VyPmBzIHRoYXQgdmFsaWRhdGVzIHRoZSBzdGF0ZSBpbnRlcm5hbGx5XG4gKiBhbmQgY29vcmRpbmF0ZXMgdGhlIGJhY2tkcm9wIGFuZCBjb250ZW50IHN0eWxpbmcuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXJDb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkcmF3ZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0RHJhd2VyKSBfZHJhd2VyczogUXVlcnlMaXN0PE1hdERyYXdlcj47XG4gIEBDb250ZW50Q2hpbGQoTWF0RHJhd2VyQ29udGVudCwge3N0YXRpYzogZmFsc2V9KSBfY29udGVudDogTWF0RHJhd2VyQ29udGVudDtcbiAgQFZpZXdDaGlsZChNYXREcmF3ZXJDb250ZW50LCB7c3RhdGljOiBmYWxzZX0pIF91c2VyQ29udGVudDogTWF0RHJhd2VyQ29udGVudDtcblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgc3RhcnRgIHBvc2l0aW9uLiAqL1xuICBnZXQgc3RhcnQoKTogTWF0RHJhd2VyIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zdGFydDsgfVxuXG4gIC8qKiBUaGUgZHJhd2VyIGNoaWxkIHdpdGggdGhlIGBlbmRgIHBvc2l0aW9uLiAqL1xuICBnZXQgZW5kKCk6IE1hdERyYXdlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fZW5kOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSByZXNpemUgdGhlIGNvbnRhaW5lciB3aGVuZXZlclxuICAgKiB0aGUgc2l6ZSBvZiBhbnkgb2YgaXRzIGRyYXdlcnMgY2hhbmdlcy5cbiAgICpcbiAgICogKipVc2UgYXQgeW91ciBvd24gcmlzayEqKiBFbmFibGluZyB0aGlzIG9wdGlvbiBjYW4gY2F1c2UgbGF5b3V0IHRocmFzaGluZyBieSBtZWFzdXJpbmdcbiAgICogdGhlIGRyYXdlcnMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS4gQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdmlhIHRoZVxuICAgKiBgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvc2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9zaXplOyB9XG4gIHNldCBhdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9hdXRvc2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfYXV0b3NpemU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBjb250YWluZXIgc2hvdWxkIGhhdmUgYSBiYWNrZHJvcCB3aGlsZSBvbmUgb2YgdGhlIHNpZGVuYXZzIGlzIG9wZW4uXG4gICAqIElmIGV4cGxpY2l0bHkgc2V0IHRvIGB0cnVlYCwgdGhlIGJhY2tkcm9wIHdpbGwgYmUgZW5hYmxlZCBmb3IgZHJhd2VycyBpbiB0aGUgYHNpZGVgXG4gICAqIG1vZGUgYXMgd2VsbC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpIHtcbiAgICBpZiAodGhpcy5fYmFja2Ryb3BPdmVycmlkZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gIXRoaXMuX3N0YXJ0IHx8IHRoaXMuX3N0YXJ0Lm1vZGUgIT09ICdzaWRlJyB8fCAhdGhpcy5fZW5kIHx8IHRoaXMuX2VuZC5tb2RlICE9PSAnc2lkZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGU7XG4gIH1cbiAgc2V0IGhhc0JhY2tkcm9wKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIF9iYWNrZHJvcE92ZXJyaWRlOiBib29sZWFuIHwgbnVsbDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgYmFja2Ryb3AgaXMgY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGJhY2tkcm9wQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogVGhlIGRyYXdlciBhdCB0aGUgc3RhcnQvZW5kIHBvc2l0aW9uLCBpbmRlcGVuZGVudCBvZiBkaXJlY3Rpb24uICovXG4gIHByaXZhdGUgX3N0YXJ0OiBNYXREcmF3ZXIgfCBudWxsO1xuICBwcml2YXRlIF9lbmQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBkcmF3ZXIgYXQgdGhlIGxlZnQvcmlnaHQuIFdoZW4gZGlyZWN0aW9uIGNoYW5nZXMsIHRoZXNlIHdpbGwgY2hhbmdlIGFzIHdlbGwuXG4gICAqIFRoZXkncmUgdXNlZCBhcyBhbGlhc2VzIGZvciB0aGUgYWJvdmUgdG8gc2V0IHRoZSBsZWZ0L3JpZ2h0IHN0eWxlIHByb3Blcmx5LlxuICAgKiBJbiBMVFIsIF9sZWZ0ID09IF9zdGFydCBhbmQgX3JpZ2h0ID09IF9lbmQuXG4gICAqIEluIFJUTCwgX2xlZnQgPT0gX2VuZCBhbmQgX3JpZ2h0ID09IF9zdGFydC5cbiAgICovXG4gIHByaXZhdGUgX2xlZnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX3JpZ2h0OiBNYXREcmF3ZXIgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyBvbiBldmVyeSBuZ0RvQ2hlY2suIFVzZWQgZm9yIGRlYm91bmNpbmcgcmVmbG93cy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZG9DaGVja1N1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBNYXJnaW5zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGNvbnRlbnQuIFRoZXNlIGFyZSB1c2VkIHRvIHB1c2ggLyBzaHJpbmsgdGhlIGRyYXdlciBjb250ZW50IHdoZW4gYVxuICAgKiBkcmF3ZXIgaXMgb3Blbi4gV2UgdXNlIG1hcmdpbiByYXRoZXIgdGhhbiB0cmFuc2Zvcm0gZXZlbiBmb3IgcHVzaCBtb2RlIGJlY2F1c2UgdHJhbnNmb3JtIGJyZWFrc1xuICAgKiBmaXhlZCBwb3NpdGlvbiBlbGVtZW50cyBpbnNpZGUgb2YgdGhlIHRyYW5zZm9ybWVkIGVsZW1lbnQuXG4gICAqL1xuICBfY29udGVudE1hcmdpbnM6IHtsZWZ0OiBudW1iZXJ8bnVsbCwgcmlnaHQ6IG51bWJlcnxudWxsfSA9IHtsZWZ0OiBudWxsLCByaWdodDogbnVsbH07XG5cbiAgcmVhZG9ubHkgX2NvbnRlbnRNYXJnaW5DaGFuZ2VzID0gbmV3IFN1YmplY3Q8e2xlZnQ6IG51bWJlcnxudWxsLCByaWdodDogbnVtYmVyfG51bGx9PigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIENka1Njcm9sbGFibGUgaW5zdGFuY2UgdGhhdCB3cmFwcyB0aGUgc2Nyb2xsYWJsZSBjb250ZW50LiAqL1xuICBnZXQgc2Nyb2xsYWJsZSgpOiBDZGtTY3JvbGxhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlckNvbnRlbnQgfHwgdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSkgZGVmYXVsdEF1dG9zaXplID0gZmFsc2UsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG5cbiAgICAvLyBJZiBhIGBEaXJgIGRpcmVjdGl2ZSBleGlzdHMgdXAgdGhlIHRyZWUsIGxpc3RlbiBkaXJlY3Rpb24gY2hhbmdlc1xuICAgIC8vIGFuZCB1cGRhdGUgdGhlIGxlZnQvcmlnaHQgcHJvcGVydGllcyB0byBwb2ludCB0byB0aGUgcHJvcGVyIHN0YXJ0L2VuZC5cbiAgICBpZiAoX2Rpcikge1xuICAgICAgX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBtaW5pbXVtIHdpZHRoIG9mIHRoZSBzaWRlbmF2IGRlcGVuZHMgb24gdGhlIHZpZXdwb3J0IHdpZHRoLFxuICAgIC8vIHdlIG5lZWQgdG8gcmVjb21wdXRlIHRoZSBtYXJnaW5zIGlmIHRoZSB2aWV3cG9ydCBjaGFuZ2VzLlxuICAgIHZpZXdwb3J0UnVsZXIuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkpO1xuXG4gICAgdGhpcy5fYXV0b3NpemUgPSBkZWZhdWx0QXV0b3NpemU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fZHJhd2Vycy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG5cbiAgICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaCgoZHJhd2VyOiBNYXREcmF3ZXIpID0+IHtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJQb3NpdGlvbihkcmF3ZXIpO1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlck1vZGUoZHJhd2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuX2RyYXdlcnMubGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSB8fFxuICAgICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9kb0NoZWNrU3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDEwKSwgLy8gQXJiaXRyYXJ5IGRlYm91bmNlIHRpbWUsIGxlc3MgdGhhbiBhIGZyYW1lIGF0IDYwZnBzXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgb3BlbmAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5vcGVuKCkpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBjbG9zZWAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIuY2xvc2UoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIGFuZCB1cGRhdGVzIHRoZSBpbmxpbmUgc3R5bGVzIGZvciB0aGUgY29udGVudC4gTm90ZSB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWRcbiAgICogc3BhcmluZ2x5LCBiZWNhdXNlIGl0IGNhdXNlcyBhIHJlZmxvdy5cbiAgICovXG4gIHVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkge1xuICAgIC8vIDEuIEZvciBkcmF3ZXJzIGluIGBvdmVyYCBtb2RlLCB0aGV5IGRvbid0IGFmZmVjdCB0aGUgY29udGVudC5cbiAgICAvLyAyLiBGb3IgZHJhd2VycyBpbiBgc2lkZWAgbW9kZSB0aGV5IHNob3VsZCBzaHJpbmsgdGhlIGNvbnRlbnQuIFdlIGRvIHRoaXMgYnkgYWRkaW5nIHRvIHRoZVxuICAgIC8vICAgIGxlZnQgbWFyZ2luIChmb3IgbGVmdCBkcmF3ZXIpIG9yIHJpZ2h0IG1hcmdpbiAoZm9yIHJpZ2h0IHRoZSBkcmF3ZXIpLlxuICAgIC8vIDMuIEZvciBkcmF3ZXJzIGluIGBwdXNoYCBtb2RlIHRoZSBzaG91bGQgc2hpZnQgdGhlIGNvbnRlbnQgd2l0aG91dCByZXNpemluZyBpdC4gV2UgZG8gdGhpcyBieVxuICAgIC8vICAgIGFkZGluZyB0byB0aGUgbGVmdCBvciByaWdodCBtYXJnaW4gYW5kIHNpbXVsdGFuZW91c2x5IHN1YnRyYWN0aW5nIHRoZSBzYW1lIGFtb3VudCBvZlxuICAgIC8vICAgIG1hcmdpbiBmcm9tIHRoZSBvdGhlciBzaWRlLlxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBsZXQgcmlnaHQgPSAwO1xuXG4gICAgaWYgKHRoaXMuX2xlZnQgJiYgdGhpcy5fbGVmdC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIGxlZnQgKz0gdGhpcy5fbGVmdC5fd2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2xlZnQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9sZWZ0Ll93aWR0aDtcbiAgICAgICAgbGVmdCArPSB3aWR0aDtcbiAgICAgICAgcmlnaHQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JpZ2h0ICYmIHRoaXMuX3JpZ2h0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIHJpZ2h0ICs9IHRoaXMuX3JpZ2h0Ll93aWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmlnaHQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9yaWdodC5fd2lkdGg7XG4gICAgICAgIHJpZ2h0ICs9IHdpZHRoO1xuICAgICAgICBsZWZ0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIGVpdGhlciBgcmlnaHRgIG9yIGBsZWZ0YCBpcyB6ZXJvLCBkb24ndCBzZXQgYSBzdHlsZSB0byB0aGUgZWxlbWVudC4gVGhpc1xuICAgIC8vIGFsbG93cyB1c2VycyB0byBzcGVjaWZ5IGEgY3VzdG9tIHNpemUgdmlhIENTUyBjbGFzcyBpbiBTU1Igc2NlbmFyaW9zIHdoZXJlIHRoZVxuICAgIC8vIG1lYXN1cmVkIHdpZHRocyB3aWxsIGFsd2F5cyBiZSB6ZXJvLiBOb3RlIHRoYXQgd2UgcmVzZXQgdG8gYG51bGxgIGhlcmUsIHJhdGhlclxuICAgIC8vIHRoYW4gYmVsb3csIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSB0eXBlcyBpbiB0aGUgYGlmYCBiZWxvdyBhcmUgY29uc2lzdGVudC5cbiAgICBsZWZ0ID0gbGVmdCB8fCBudWxsITtcbiAgICByaWdodCA9IHJpZ2h0IHx8IG51bGwhO1xuXG4gICAgaWYgKGxlZnQgIT09IHRoaXMuX2NvbnRlbnRNYXJnaW5zLmxlZnQgfHwgcmlnaHQgIT09IHRoaXMuX2NvbnRlbnRNYXJnaW5zLnJpZ2h0KSB7XG4gICAgICB0aGlzLl9jb250ZW50TWFyZ2lucyA9IHtsZWZ0LCByaWdodH07XG5cbiAgICAgIC8vIFB1bGwgYmFjayBpbnRvIHRoZSBOZ1pvbmUgc2luY2UgaW4gc29tZSBjYXNlcyB3ZSBjb3VsZCBiZSBvdXRzaWRlLiBXZSBuZWVkIHRvIGJlIGNhcmVmdWxcbiAgICAgIC8vIHRvIGRvIGl0IG9ubHkgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCwgb3RoZXJ3aXNlIHdlIGNhbiBlbmQgdXAgaGl0dGluZyB0aGUgem9uZSB0b28gb2Z0ZW4uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLm5leHQodGhpcy5fY29udGVudE1hcmdpbnMpKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgLy8gSWYgdXNlcnMgb3B0ZWQgaW50byBhdXRvc2l6aW5nLCBkbyBhIGNoZWNrIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuXG4gICAgaWYgKHRoaXMuX2F1dG9zaXplICYmIHRoaXMuX2lzUHVzaGVkKCkpIHtcbiAgICAgIC8vIFJ1biBvdXRzaWRlIHRoZSBOZ1pvbmUsIG90aGVyd2lzZSB0aGUgZGVib3VuY2VyIHdpbGwgdGhyb3cgdXMgaW50byBhbiBpbmZpbml0ZSBsb29wLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuX2RvQ2hlY2tTdWJqZWN0Lm5leHQoKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gZHJhd2VyIGV2ZW50cyBpbiBvcmRlciB0byBzZXQgYSBjbGFzcyBvbiB0aGUgbWFpbiBjb250YWluZXIgZWxlbWVudCB3aGVuIHRoZVxuICAgKiBkcmF3ZXIgaXMgb3BlbiBhbmQgdGhlIGJhY2tkcm9wIGlzIHZpc2libGUuIFRoaXMgZW5zdXJlcyBhbnkgb3ZlcmZsb3cgb24gdGhlIGNvbnRhaW5lciBlbGVtZW50XG4gICAqIGlzIHByb3Blcmx5IGhpZGRlbi5cbiAgICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyVG9nZ2xlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgZHJhd2VyLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4gZXZlbnQuZnJvbVN0YXRlICE9PSBldmVudC50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMpLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgIC8vIFNldCB0aGUgdHJhbnNpdGlvbiBjbGFzcyBvbiB0aGUgY29udGFpbmVyIHNvIHRoYXQgdGhlIGFuaW1hdGlvbnMgb2NjdXIuIFRoaXMgc2hvdWxkIG5vdFxuICAgICAgLy8gYmUgc2V0IGluaXRpYWxseSBiZWNhdXNlIGFuaW1hdGlvbnMgc2hvdWxkIG9ubHkgYmUgdHJpZ2dlcmVkIHZpYSBhIGNoYW5nZSBpbiBzdGF0ZS5cbiAgICAgIGlmIChldmVudC50b1N0YXRlICE9PSAnb3Blbi1pbnN0YW50JyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtZHJhd2VyLXRyYW5zaXRpb24nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoZHJhd2VyLm1vZGUgIT09ICdzaWRlJykge1xuICAgICAgZHJhd2VyLm9wZW5lZENoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMpKS5zdWJzY3JpYmUoKCkgPT5cbiAgICAgICAgICB0aGlzLl9zZXRDb250YWluZXJDbGFzcyhkcmF3ZXIub3BlbmVkKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gZHJhd2VyIG9uUG9zaXRpb25DaGFuZ2VkIGV2ZW50IGluIG9yZGVyIHRvXG4gICAqIHJlLXZhbGlkYXRlIGRyYXdlcnMgd2hlbiB0aGUgcG9zaXRpb24gY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoIWRyYXdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBOT1RFOiBXZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkgYmVmb3JlIHZhbGlkYXRpbmcsXG4gICAgLy8gc2luY2UgYm90aCBkcmF3ZXJzIG1heSBiZSBzd2FwcGluZyBwb3NpdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICBkcmF3ZXIub25Qb3NpdGlvbkNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gZHJhd2VyIG1vZGUgc28gd2UgY2FuIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlck1vZGUoZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoZHJhd2VyKSB7XG4gICAgICBkcmF3ZXIuX21vZGVDaGFuZ2VkLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMuX2RyYXdlcnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveWVkKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlICdtYXQtZHJhd2VyLW9wZW5lZCcgY2xhc3Mgb24gdGhlIG1haW4gJ21hdC1kcmF3ZXItY29udGFpbmVyJyBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9zZXRDb250YWluZXJDbGFzcyhpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gJ21hdC1kcmF3ZXItY29udGFpbmVyLWhhcy1vcGVuJztcblxuICAgIGlmIChpc0FkZCkge1xuICAgICAgY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBzdGF0ZSBvZiB0aGUgZHJhd2VyIGNoaWxkcmVuIGNvbXBvbmVudHMuICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlRHJhd2VycygpIHtcbiAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2VuZCA9IG51bGw7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGF0IG1vc3Qgb25lIHN0YXJ0IGFuZCBvbmUgZW5kIGRyYXdlci5cbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IHtcbiAgICAgIGlmIChkcmF3ZXIucG9zaXRpb24gPT0gJ2VuZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VuZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ2VuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VuZCA9IGRyYXdlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RhcnQgPSBkcmF3ZXI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2xlZnQgPSBudWxsO1xuXG4gICAgLy8gRGV0ZWN0IGlmIHdlJ3JlIExUUiBvciBSVEwuXG4gICAgaWYgKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSB7XG4gICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5fZW5kO1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX3N0YXJ0O1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9lbmQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRhaW5lciBpcyBiZWluZyBwdXNoZWQgdG8gdGhlIHNpZGUgYnkgb25lIG9mIHRoZSBkcmF3ZXJzLiAqL1xuICBwcml2YXRlIF9pc1B1c2hlZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgJiYgdGhpcy5fc3RhcnQubW9kZSAhPSAnb3ZlcicpIHx8XG4gICAgICAgICAgICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSAmJiB0aGlzLl9lbmQubW9kZSAhPSAnb3ZlcicpO1xuICB9XG5cbiAgX29uQmFja2Ryb3BDbGlja2VkKCkge1xuICAgIHRoaXMuYmFja2Ryb3BDbGljay5lbWl0KCk7XG4gICAgdGhpcy5fY2xvc2VNb2RhbERyYXdlcigpO1xuICB9XG5cbiAgX2Nsb3NlTW9kYWxEcmF3ZXIoKSB7XG4gICAgLy8gQ2xvc2UgYWxsIG9wZW4gZHJhd2VycyB3aGVyZSBjbG9zaW5nIGlzIG5vdCBkaXNhYmxlZCBhbmQgdGhlIG1vZGUgaXMgbm90IGBzaWRlYC5cbiAgICBbdGhpcy5fc3RhcnQsIHRoaXMuX2VuZF1cbiAgICAgIC5maWx0ZXIoZHJhd2VyID0+IGRyYXdlciAmJiAhZHJhd2VyLmRpc2FibGVDbG9zZSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AoZHJhd2VyKSlcbiAgICAgIC5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIhLmNsb3NlKCkpO1xuICB9XG5cbiAgX2lzU2hvd2luZ0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AodGhpcy5fc3RhcnQpKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX2VuZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcjogTWF0RHJhd2VyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRyYXdlci5tb2RlICE9PSAnc2lkZScgfHwgISF0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNEcmF3ZXJPcGVuKGRyYXdlcjogTWF0RHJhd2VyIHwgbnVsbCk6IGRyYXdlciBpcyBNYXREcmF3ZXIge1xuICAgIHJldHVybiBkcmF3ZXIgIT0gbnVsbCAmJiBkcmF3ZXIub3BlbmVkO1xuICB9XG5cbn1cbiJdfQ==