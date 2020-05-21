import { __decorate, __metadata, __param } from "tslib";
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
    throw Error(`A drawer was already declared for 'position="${position}"'`);
}
/** Configures whether drawers should use auto sizing by default. */
export const MAT_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken('MAT_DRAWER_DEFAULT_AUTOSIZE', {
    providedIn: 'root',
    factory: MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY,
});
/**
 * Used to provide a drawer container to a drawer while avoiding circular references.
 * @docs-private
 */
export const MAT_DRAWER_CONTAINER = new InjectionToken('MAT_DRAWER_CONTAINER');
/** @docs-private */
export function MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY() {
    return false;
}
let MatDrawerContent = /** @class */ (() => {
    let MatDrawerContent = class MatDrawerContent extends CdkScrollable {
        constructor(_changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone) {
            super(elementRef, scrollDispatcher, ngZone);
            this._changeDetectorRef = _changeDetectorRef;
            this._container = _container;
        }
        ngAfterContentInit() {
            this._container._contentMarginChanges.subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
        }
    };
    MatDrawerContent = __decorate([
        Component({
            selector: 'mat-drawer-content',
            template: '<ng-content></ng-content>',
            host: {
                'class': 'mat-drawer-content',
                '[style.margin-left.px]': '_container._contentMargins.left',
                '[style.margin-right.px]': '_container._contentMargins.right',
            },
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }),
        __param(1, Inject(forwardRef(() => MatDrawerContainer))),
        __metadata("design:paramtypes", [ChangeDetectorRef,
            MatDrawerContainer,
            ElementRef,
            ScrollDispatcher,
            NgZone])
    ], MatDrawerContent);
    return MatDrawerContent;
})();
export { MatDrawerContent };
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
let MatDrawer = /** @class */ (() => {
    let MatDrawer = class MatDrawer {
        constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _doc, 
        /**
         * @deprecated `_container` parameter to be made required.
         * @breaking-change 10.0.0
         */
        _container) {
            this._elementRef = _elementRef;
            this._focusTrapFactory = _focusTrapFactory;
            this._focusMonitor = _focusMonitor;
            this._platform = _platform;
            this._ngZone = _ngZone;
            this._doc = _doc;
            this._container = _container;
            this._elementFocusedBeforeDrawerWasOpened = null;
            /** Whether the drawer is initialized. Used for disabling the initial animation. */
            this._enableAnimations = false;
            this._position = 'start';
            this._mode = 'over';
            this._disableClose = false;
            this._opened = false;
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
            this.openedChange.subscribe((opened) => {
                if (opened) {
                    if (this._doc) {
                        this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement;
                    }
                    this._takeFocus();
                }
                else {
                    this._restoreFocus();
                }
            });
            /**
             * Listen to `keydown` events outside the zone so that change detection is not run every
             * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
             * and we don't have close disabled.
             */
            this._ngZone.runOutsideAngular(() => {
                fromEvent(this._elementRef.nativeElement, 'keydown').pipe(filter(event => {
                    return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
                }), takeUntil(this._destroyed)).subscribe(event => this._ngZone.run(() => {
                    this.close();
                    event.stopPropagation();
                    event.preventDefault();
                }));
            });
            // We need a Subject with distinctUntilChanged, because the `done` event
            // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
            this._animationEnd.pipe(distinctUntilChanged((x, y) => {
                return x.fromState === y.fromState && x.toState === y.toState;
            })).subscribe((event) => {
                const { fromState, toState } = event;
                if ((toState.indexOf('open') === 0 && fromState === 'void') ||
                    (toState === 'void' && fromState.indexOf('open') === 0)) {
                    this.openedChange.emit(this._opened);
                }
            });
        }
        /** The side that the drawer is attached to. */
        get position() { return this._position; }
        set position(value) {
            // Make sure we have a valid value.
            value = value === 'end' ? 'end' : 'start';
            if (value != this._position) {
                this._position = value;
                this.onPositionChanged.emit();
            }
        }
        /** Mode of the drawer; one of 'over', 'push' or 'side'. */
        get mode() { return this._mode; }
        set mode(value) {
            this._mode = value;
            this._updateFocusTrapState();
            this._modeChanged.next();
        }
        /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
        get disableClose() { return this._disableClose; }
        set disableClose(value) { this._disableClose = coerceBooleanProperty(value); }
        /**
         * Whether the drawer should focus the first focusable element automatically when opened.
         * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
         * enabled, focus will be moved into the sidenav in `side` mode as well.
         */
        get autoFocus() {
            const value = this._autoFocus;
            // Note that usually we disable auto focusing in `side` mode, because we don't know how the
            // sidenav is being used, but in some cases it still makes sense to do it. If the consumer
            // explicitly enabled `autoFocus`, we take it as them always wanting to enable it.
            return value == null ? this.mode !== 'side' : value;
        }
        set autoFocus(value) { this._autoFocus = coerceBooleanProperty(value); }
        /**
         * Whether the drawer is opened. We overload this because we trigger an event when it
         * starts or end.
         */
        get opened() { return this._opened; }
        set opened(value) { this.toggle(coerceBooleanProperty(value)); }
        /** Event emitted when the drawer has been opened. */
        get _openedStream() {
            return this.openedChange.pipe(filter(o => o), map(() => { }));
        }
        /** Event emitted when the drawer has started opening. */
        get openedStart() {
            return this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0), map(() => { }));
        }
        /** Event emitted when the drawer has been closed. */
        get _closedStream() {
            return this.openedChange.pipe(filter(o => !o), map(() => { }));
        }
        /** Event emitted when the drawer has started closing. */
        get closedStart() {
            return this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState === 'void'), map(() => { }));
        }
        /**
         * Moves focus into the drawer. Note that this works even if
         * the focus trap is disabled in `side` mode.
         */
        _takeFocus() {
            if (!this.autoFocus || !this._focusTrap) {
                return;
            }
            this._focusTrap.focusInitialElementWhenReady().then(hasMovedFocus => {
                // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
                // still works. We need to check that `focus` is a function due to Universal.
                if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
                    this._elementRef.nativeElement.focus();
                }
            });
        }
        /**
         * If focus is currently inside the drawer, restores it to where it was before the drawer
         * opened.
         */
        _restoreFocus() {
            if (!this.autoFocus) {
                return;
            }
            const activeEl = this._doc && this._doc.activeElement;
            if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
                // Note that we don't check via `instanceof HTMLElement` so that we can cover SVGs as well.
                if (this._elementFocusedBeforeDrawerWasOpened) {
                    this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
                }
                else {
                    this._elementRef.nativeElement.blur();
                }
            }
            this._elementFocusedBeforeDrawerWasOpened = null;
            this._openedVia = null;
        }
        ngAfterContentInit() {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
            this._updateFocusTrapState();
        }
        ngAfterContentChecked() {
            // Enable the animations after the lifecycle hooks have run, in order to avoid animating
            // drawers that are open by default. When we're on the server, we shouldn't enable the
            // animations, because we don't want the drawer to animate the first time the user sees
            // the page.
            if (this._platform.isBrowser) {
                this._enableAnimations = true;
            }
        }
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
         * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
         * Used for focus management after the sidenav is closed.
         */
        open(openedVia) {
            return this.toggle(true, openedVia);
        }
        /** Close the drawer. */
        close() {
            return this.toggle(false);
        }
        /**
         * Toggle this drawer.
         * @param isOpen Whether the drawer should be open.
         * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
         * Used for focus management after the sidenav is closed.
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
            return new Promise(resolve => {
                this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
            });
        }
        get _width() {
            return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
        }
        /** Updates the enabled state of the focus trap. */
        _updateFocusTrapState() {
            if (this._focusTrap) {
                // The focus trap is only enabled when the drawer is open in any mode other than side.
                this._focusTrap.enabled = this.opened && this.mode !== 'side';
            }
        }
        // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
        // In Ivy the `host` bindings will be merged when this class is extended, whereas in
        // ViewEngine they're overwritten.
        // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
        // tslint:disable-next-line:no-host-decorator-in-concrete
        _animationStartListener(event) {
            this._animationStarted.next(event);
        }
        // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
        // In Ivy the `host` bindings will be merged when this class is extended, whereas in
        // ViewEngine they're overwritten.
        // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
        // tslint:disable-next-line:no-host-decorator-in-concrete
        _animationDoneListener(event) {
            this._animationEnd.next(event);
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatDrawer.prototype, "position", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatDrawer.prototype, "mode", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDrawer.prototype, "disableClose", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDrawer.prototype, "autoFocus", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDrawer.prototype, "opened", null);
    __decorate([
        HostBinding('@transform'),
        __metadata("design:type", String)
    ], MatDrawer.prototype, "_animationState", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatDrawer.prototype, "openedChange", void 0);
    __decorate([
        Output('opened'),
        __metadata("design:type", Observable),
        __metadata("design:paramtypes", [])
    ], MatDrawer.prototype, "_openedStream", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable),
        __metadata("design:paramtypes", [])
    ], MatDrawer.prototype, "openedStart", null);
    __decorate([
        Output('closed'),
        __metadata("design:type", Observable),
        __metadata("design:paramtypes", [])
    ], MatDrawer.prototype, "_closedStream", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable),
        __metadata("design:paramtypes", [])
    ], MatDrawer.prototype, "closedStart", null);
    __decorate([
        Output('positionChanged'),
        __metadata("design:type", EventEmitter)
    ], MatDrawer.prototype, "onPositionChanged", void 0);
    __decorate([
        HostListener('@transform.start', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MatDrawer.prototype, "_animationStartListener", null);
    __decorate([
        HostListener('@transform.done', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MatDrawer.prototype, "_animationDoneListener", null);
    MatDrawer = __decorate([
        Component({
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
        }),
        __param(5, Optional()), __param(5, Inject(DOCUMENT)),
        __param(6, Optional()), __param(6, Inject(MAT_DRAWER_CONTAINER)),
        __metadata("design:paramtypes", [ElementRef,
            FocusTrapFactory,
            FocusMonitor,
            Platform,
            NgZone, Object, MatDrawerContainer])
    ], MatDrawer);
    return MatDrawer;
})();
export { MatDrawer };
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
let MatDrawerContainer = /** @class */ (() => {
    var MatDrawerContainer_1;
    let MatDrawerContainer = MatDrawerContainer_1 = class MatDrawerContainer {
        constructor(_dir, _element, _ngZone, _changeDetectorRef, viewportRuler, defaultAutosize = false, _animationMode) {
            this._dir = _dir;
            this._element = _element;
            this._ngZone = _ngZone;
            this._changeDetectorRef = _changeDetectorRef;
            this._animationMode = _animationMode;
            /** Drawers that belong to this container. */
            this._drawers = new QueryList();
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
                _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
                    this._validateDrawers();
                    this.updateContentMargins();
                });
            }
            // Since the minimum width of the sidenav depends on the viewport width,
            // we need to recompute the margins if the viewport changes.
            viewportRuler.change()
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => this.updateContentMargins());
            this._autosize = defaultAutosize;
        }
        /** The drawer child with the `start` position. */
        get start() { return this._start; }
        /** The drawer child with the `end` position. */
        get end() { return this._end; }
        /**
         * Whether to automatically resize the container whenever
         * the size of any of its drawers changes.
         *
         * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
         * the drawers on every change detection cycle. Can be configured globally via the
         * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
         */
        get autosize() { return this._autosize; }
        set autosize(value) { this._autosize = coerceBooleanProperty(value); }
        /**
         * Whether the drawer container should have a backdrop while one of the sidenavs is open.
         * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
         * mode as well.
         */
        get hasBackdrop() {
            if (this._backdropOverride == null) {
                return !this._start || this._start.mode !== 'side' || !this._end || this._end.mode !== 'side';
            }
            return this._backdropOverride;
        }
        set hasBackdrop(value) {
            this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
        }
        /** Reference to the CdkScrollable instance that wraps the scrollable content. */
        get scrollable() {
            return this._userContent || this._content;
        }
        ngAfterContentInit() {
            this._allDrawers.changes
                .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
                .subscribe((drawer) => {
                // @breaking-change 10.0.0 Remove `_container` check once container parameter is required.
                this._drawers.reset(drawer.filter(item => !item._container || item._container === this));
                this._drawers.notifyOnChanges();
            });
            this._drawers.changes.pipe(startWith(null)).subscribe(() => {
                this._validateDrawers();
                this._drawers.forEach((drawer) => {
                    this._watchDrawerToggle(drawer);
                    this._watchDrawerPosition(drawer);
                    this._watchDrawerMode(drawer);
                });
                if (!this._drawers.length ||
                    this._isDrawerOpen(this._start) ||
                    this._isDrawerOpen(this._end)) {
                    this.updateContentMargins();
                }
                this._changeDetectorRef.markForCheck();
            });
            this._doCheckSubject.pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
            takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
        }
        ngOnDestroy() {
            this._contentMarginChanges.complete();
            this._doCheckSubject.complete();
            this._drawers.destroy();
            this._destroyed.next();
            this._destroyed.complete();
        }
        /** Calls `open` of both start and end drawers */
        open() {
            this._drawers.forEach(drawer => drawer.open());
        }
        /** Calls `close` of both start and end drawers */
        close() {
            this._drawers.forEach(drawer => drawer.close());
        }
        /**
         * Recalculates and updates the inline styles for the content. Note that this should be used
         * sparingly, because it causes a reflow.
         */
        updateContentMargins() {
            // 1. For drawers in `over` mode, they don't affect the content.
            // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
            //    left margin (for left drawer) or right margin (for right the drawer).
            // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
            //    adding to the left or right margin and simultaneously subtracting the same amount of
            //    margin from the other side.
            let left = 0;
            let right = 0;
            if (this._left && this._left.opened) {
                if (this._left.mode == 'side') {
                    left += this._left._width;
                }
                else if (this._left.mode == 'push') {
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
                    const width = this._right._width;
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
                this._contentMargins = { left, right };
                // Pull back into the NgZone since in some cases we could be outside. We need to be careful
                // to do it only when something changed, otherwise we can end up hitting the zone too often.
                this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
            }
        }
        ngDoCheck() {
            // If users opted into autosizing, do a check every change detection cycle.
            if (this._autosize && this._isPushed()) {
                // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
                this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
            }
        }
        /**
         * Subscribes to drawer events in order to set a class on the main container element when the
         * drawer is open and the backdrop is visible. This ensures any overflow on the container element
         * is properly hidden.
         */
        _watchDrawerToggle(drawer) {
            drawer._animationStarted.pipe(filter((event) => event.fromState !== event.toState), takeUntil(this._drawers.changes))
                .subscribe((event) => {
                // Set the transition class on the container so that the animations occur. This should not
                // be set initially because animations should only be triggered via a change in state.
                if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
                    this._element.nativeElement.classList.add('mat-drawer-transition');
                }
                this.updateContentMargins();
                this._changeDetectorRef.markForCheck();
            });
            if (drawer.mode !== 'side') {
                drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
            }
        }
        /**
         * Subscribes to drawer onPositionChanged event in order to
         * re-validate drawers when the position changes.
         */
        _watchDrawerPosition(drawer) {
            if (!drawer) {
                return;
            }
            // NOTE: We need to wait for the microtask queue to be empty before validating,
            // since both drawers may be swapping positions at the same time.
            drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
                this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(() => {
                    this._validateDrawers();
                });
            });
        }
        /** Subscribes to changes in drawer mode so we can run change detection. */
        _watchDrawerMode(drawer) {
            if (drawer) {
                drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
                    .subscribe(() => {
                    this.updateContentMargins();
                    this._changeDetectorRef.markForCheck();
                });
            }
        }
        /** Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element. */
        _setContainerClass(isAdd) {
            const classList = this._element.nativeElement.classList;
            const className = 'mat-drawer-container-has-open';
            if (isAdd) {
                classList.add(className);
            }
            else {
                classList.remove(className);
            }
        }
        /** Validate the state of the drawer children components. */
        _validateDrawers() {
            this._start = this._end = null;
            // Ensure that we have at most one start and one end drawer.
            this._drawers.forEach(drawer => {
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
        }
        /** Whether the container is being pushed to the side by one of the drawers. */
        _isPushed() {
            return (this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
                (this._isDrawerOpen(this._end) && this._end.mode != 'over');
        }
        _onBackdropClicked() {
            this.backdropClick.emit();
            this._closeModalDrawer();
        }
        _closeModalDrawer() {
            // Close all open drawers where closing is not disabled and the mode is not `side`.
            [this._start, this._end]
                .filter(drawer => drawer && !drawer.disableClose && this._canHaveBackdrop(drawer))
                .forEach(drawer => drawer.close());
        }
        _isShowingBackdrop() {
            return (this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
                (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end));
        }
        _canHaveBackdrop(drawer) {
            return drawer.mode !== 'side' || !!this._backdropOverride;
        }
        _isDrawerOpen(drawer) {
            return drawer != null && drawer.opened;
        }
    };
    __decorate([
        ContentChildren(MatDrawer, {
            // We need to use `descendants: true`, because Ivy will no longer match
            // indirect descendants if it's left as false.
            descendants: true
        }),
        __metadata("design:type", QueryList)
    ], MatDrawerContainer.prototype, "_allDrawers", void 0);
    __decorate([
        ContentChild(MatDrawerContent),
        __metadata("design:type", MatDrawerContent)
    ], MatDrawerContainer.prototype, "_content", void 0);
    __decorate([
        ViewChild(MatDrawerContent),
        __metadata("design:type", MatDrawerContent)
    ], MatDrawerContainer.prototype, "_userContent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDrawerContainer.prototype, "autosize", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatDrawerContainer.prototype, "hasBackdrop", null);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatDrawerContainer.prototype, "backdropClick", void 0);
    MatDrawerContainer = MatDrawerContainer_1 = __decorate([
        Component({
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
                    useExisting: MatDrawerContainer_1
                }],
            styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"]
        }),
        __param(0, Optional()),
        __param(5, Inject(MAT_DRAWER_DEFAULT_AUTOSIZE)),
        __param(6, Optional()), __param(6, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [Directionality,
            ElementRef,
            NgZone,
            ChangeDetectorRef,
            ViewportRuler, Object, String])
    ], MatDrawerContainer);
    return MatDrawerContainer;
})();
export { MatDrawerContainer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQSxPQUFPLEVBQUMsWUFBWSxFQUEwQixnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNqQixZQUFZLEVBQ1osV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILFNBQVMsRUFDVCxJQUFJLEVBQ0osU0FBUyxFQUNULG9CQUFvQixHQUNyQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8s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aEMsQ0FBQzs7U0FDSCxDQUFDO1FBeUZhLFdBQUEsUUFBUSxFQUFFLENBQUE7UUFLVixXQUFBLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQ25DLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO3lDQU5oQixjQUFjO1lBQ3RCLFVBQVU7WUFDWCxNQUFNO1lBQ0ssaUJBQWlCO1lBQzlCLGFBQWE7T0E1RjdCLGtCQUFrQixDQWtXOUI7SUFBRCx5QkFBQztLQUFBO1NBbFdZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW4sIEZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGUsIFNjcm9sbERpc3BhdGNoZXIsIFZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSG9zdExpc3RlbmVyLFxuICBIb3N0QmluZGluZyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZGVib3VuY2VUaW1lLFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgc3RhcnRXaXRoLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gdHdvIE1hdERyYXdlciBhcmUgbWF0Y2hpbmcgdGhlIHNhbWUgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdER1cGxpY2F0ZWREcmF3ZXJFcnJvcihwb3NpdGlvbjogc3RyaW5nKSB7XG4gIHRocm93IEVycm9yKGBBIGRyYXdlciB3YXMgYWxyZWFkeSBkZWNsYXJlZCBmb3IgJ3Bvc2l0aW9uPVwiJHtwb3NpdGlvbn1cIidgKTtcbn1cblxuXG4vKiogUmVzdWx0IG9mIHRoZSB0b2dnbGUgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlci4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlclRvZ2dsZVJlc3VsdCA9ICdvcGVuJyB8ICdjbG9zZSc7XG5cbi8qKiBEcmF3ZXIgYW5kIFNpZGVOYXYgZGlzcGxheSBtb2Rlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlck1vZGUgPSAnb3ZlcicgfCAncHVzaCcgfCAnc2lkZSc7XG5cbi8qKiBDb25maWd1cmVzIHdoZXRoZXIgZHJhd2VycyBzaG91bGQgdXNlIGF1dG8gc2l6aW5nIGJ5IGRlZmF1bHQuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ01BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRScsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRV9GQUNUT1JZLFxuICAgIH0pO1xuXG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgZHJhd2VyIGNvbnRhaW5lciB0byBhIGRyYXdlciB3aGlsZSBhdm9pZGluZyBjaXJjdWxhciByZWZlcmVuY2VzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9DT05UQUlORVIgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ01BVF9EUkFXRVJfQ09OVEFJTkVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlkoKTogYm9vbGVhbiB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRlbnQnLFxuICAgICdbc3R5bGUubWFyZ2luLWxlZnQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLmxlZnQnLFxuICAgICdbc3R5bGUubWFyZ2luLXJpZ2h0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5yaWdodCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250ZW50IGV4dGVuZHMgQ2RrU2Nyb2xsYWJsZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXREcmF3ZXJDb250YWluZXIpKSBwdWJsaWMgX2NvbnRhaW5lcjogTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgbmdab25lOiBOZ1pvbmUpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzY3JvbGxEaXNwYXRjaGVyLCBuZ1pvbmUpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2NvbnRhaW5lci5fY29udGVudE1hcmdpbkNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG59XG5cblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBjb3JyZXNwb25kcyB0byBhIGRyYXdlciB0aGF0IGNhbiBiZSBvcGVuZWQgb24gdGhlIGRyYXdlciBjb250YWluZXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXInLFxuICBleHBvcnRBczogJ21hdERyYXdlcicsXG4gIHRlbXBsYXRlVXJsOiAnZHJhd2VyLmh0bWwnLFxuICBhbmltYXRpb25zOiBbbWF0RHJhd2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1EcmF3ZXJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXInLFxuICAgIC8vIG11c3QgcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGFsaWduaW5nIHRleHQgYmFzZWQgb24gdmFsdWVcbiAgICAnW2F0dHIuYWxpZ25dJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1lbmRdJzogJ3Bvc2l0aW9uID09PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3Zlcl0nOiAnbW9kZSA9PT0gXCJvdmVyXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1wdXNoXSc6ICdtb2RlID09PSBcInB1c2hcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXNpZGVdJzogJ21vZGUgPT09IFwic2lkZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItb3BlbmVkXSc6ICdvcGVuZWQnLFxuICAgICd0YWJJbmRleCc6ICctMScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBpcyBpbml0aWFsaXplZC4gVXNlZCBmb3IgZGlzYWJsaW5nIHRoZSBpbml0aWFsIGFuaW1hdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZW5hYmxlQW5pbWF0aW9ucyA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc2lkZSB0aGF0IHRoZSBkcmF3ZXIgaXMgYXR0YWNoZWQgdG8uICovXG4gIEBJbnB1dCgpXG4gIGdldCBwb3NpdGlvbigpOiAnc3RhcnQnIHwgJ2VuZCcgeyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiAnc3RhcnQnIHwgJ2VuZCcpIHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHZhbGlkIHZhbHVlLlxuICAgIHZhbHVlID0gdmFsdWUgPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGlmICh2YWx1ZSAhPSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcbiAgICAgIHRoaXMub25Qb3NpdGlvbkNoYW5nZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wb3NpdGlvbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ3N0YXJ0JztcblxuICAvKiogTW9kZSBvZiB0aGUgZHJhd2VyOyBvbmUgb2YgJ292ZXInLCAncHVzaCcgb3IgJ3NpZGUnLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbW9kZSgpOiBNYXREcmF3ZXJNb2RlIHsgcmV0dXJuIHRoaXMuX21vZGU7IH1cbiAgc2V0IG1vZGUodmFsdWU6IE1hdERyYXdlck1vZGUpIHtcbiAgICB0aGlzLl9tb2RlID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcbiAgICB0aGlzLl9tb2RlQ2hhbmdlZC5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfbW9kZTogTWF0RHJhd2VyTW9kZSA9ICdvdmVyJztcblxuICAvKiogV2hldGhlciB0aGUgZHJhd2VyIGNhbiBiZSBjbG9zZWQgd2l0aCB0aGUgZXNjYXBlIGtleSBvciBieSBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQ2xvc2UoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlQ2xvc2U7IH1cbiAgc2V0IGRpc2FibGVDbG9zZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9kaXNhYmxlQ2xvc2UgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2Rpc2FibGVDbG9zZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIGZvY3VzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBhdXRvbWF0aWNhbGx5IHdoZW4gb3BlbmVkLlxuICAgKiBEZWZhdWx0cyB0byBmYWxzZSBpbiB3aGVuIGBtb2RlYCBpcyBzZXQgdG8gYHNpZGVgLCBvdGhlcndpc2UgZGVmYXVsdHMgdG8gYHRydWVgLiBJZiBleHBsaWNpdGx5XG4gICAqIGVuYWJsZWQsIGZvY3VzIHdpbGwgYmUgbW92ZWQgaW50byB0aGUgc2lkZW5hdiBpbiBgc2lkZWAgbW9kZSBhcyB3ZWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9Gb2N1cygpOiBib29sZWFuIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2F1dG9Gb2N1cztcblxuICAgIC8vIE5vdGUgdGhhdCB1c3VhbGx5IHdlIGRpc2FibGUgYXV0byBmb2N1c2luZyBpbiBgc2lkZWAgbW9kZSwgYmVjYXVzZSB3ZSBkb24ndCBrbm93IGhvdyB0aGVcbiAgICAvLyBzaWRlbmF2IGlzIGJlaW5nIHVzZWQsIGJ1dCBpbiBzb21lIGNhc2VzIGl0IHN0aWxsIG1ha2VzIHNlbnNlIHRvIGRvIGl0LiBJZiB0aGUgY29uc3VtZXJcbiAgICAvLyBleHBsaWNpdGx5IGVuYWJsZWQgYGF1dG9Gb2N1c2AsIHdlIHRha2UgaXQgYXMgdGhlbSBhbHdheXMgd2FudGluZyB0byBlbmFibGUgaXQuXG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyB0aGlzLm1vZGUgIT09ICdzaWRlJyA6IHZhbHVlO1xuICB9XG4gIHNldCBhdXRvRm9jdXModmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fYXV0b0ZvY3VzID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9hdXRvRm9jdXM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBpcyBvcGVuZWQuIFdlIG92ZXJsb2FkIHRoaXMgYmVjYXVzZSB3ZSB0cmlnZ2VyIGFuIGV2ZW50IHdoZW4gaXRcbiAgICogc3RhcnRzIG9yIGVuZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBvcGVuZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9vcGVuZWQ7IH1cbiAgc2V0IG9wZW5lZCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnRvZ2dsZShjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpKTsgfVxuICBwcml2YXRlIF9vcGVuZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogSG93IHRoZSBzaWRlbmF2IHdhcyBvcGVuZWQgKGtleXByZXNzLCBtb3VzZSBjbGljayBldGMuKSAqL1xuICBwcml2YXRlIF9vcGVuZWRWaWE6IEZvY3VzT3JpZ2luIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBhbmltYXRpbmcuICovXG4gIF9hbmltYXRpb25TdGFydGVkID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBkcmF3ZXIgaXMgZG9uZSBhbmltYXRpbmcuICovXG4gIF9hbmltYXRpb25FbmQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgc2lkZW5hdiBhbmltYXRpb24uICovXG4gIC8vIEBIb3N0QmluZGluZyBpcyB1c2VkIGluIHRoZSBjbGFzcyBhcyBpdCBpcyBleHBlY3RlZCB0byBiZSBleHRlbmRlZC4gIFNpbmNlIEBDb21wb25lbnQgZGVjb3JhdG9yXG4gIC8vIG1ldGFkYXRhIGlzIG5vdCBpbmhlcml0ZWQgYnkgY2hpbGQgY2xhc3NlcywgaW5zdGVhZCB0aGUgaG9zdCBiaW5kaW5nIGRhdGEgaXMgZGVmaW5lZCBpbiBhIHdheVxuICAvLyB0aGF0IGNhbiBiZSBpbmhlcml0ZWQuXG4gIC8vIHRzbGludDpkaXNhYmxlOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0QmluZGluZygnQHRyYW5zZm9ybScpXG4gIF9hbmltYXRpb25TdGF0ZTogJ29wZW4taW5zdGFudCcgfCAnb3BlbicgfCAndm9pZCcgPSAndm9pZCc7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIG9wZW4gc3RhdGUgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID1cbiAgICAgIC8vIE5vdGUgdGhpcyBoYXMgdG8gYmUgYXN5bmMgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBpc3N1ZXMgd2l0aCB0d28tYmluZGluZ3MgKHNlZSAjODg3MikuXG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KC8qIGlzQXN5bmMgKi90cnVlKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKVxuICBnZXQgX29wZW5lZFN0cmVhbSgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiBvKSwgbWFwKCgpID0+IHt9KSk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIHN0YXJ0ZWQgb3BlbmluZy4gKi9cbiAgQE91dHB1dCgpXG4gIGdldCBvcGVuZWRTdGFydCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgICAgZmlsdGVyKGUgPT4gZS5mcm9tU3RhdGUgIT09IGUudG9TdGF0ZSAmJiBlLnRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwKSxcbiAgICAgIG1hcCgoKSA9PiB7fSlcbiAgICApO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJylcbiAgZ2V0IF9jbG9zZWRTdHJlYW0oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKG8gPT4gIW8pLCBtYXAoKCkgPT4ge30pKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBAT3V0cHV0KClcbiAgZ2V0IGNsb3NlZFN0YXJ0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICAgIG1hcCgoKSA9PiB7fSlcbiAgICApO1xuICB9XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyJ3MgcG9zaXRpb24gY2hhbmdlcy4gKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgncG9zaXRpb25DaGFuZ2VkJykgb25Qb3NpdGlvbkNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIGRyYXdlciBtb2RlIGNoYW5nZXMuIFRoaXMgaXMgdXNlZCBieSB0aGUgZHJhd2VyIGNvbnRhaW5lciB0b1xuICAgKiB0byBrbm93IHdoZW4gdG8gd2hlbiB0aGUgbW9kZSBjaGFuZ2VzIHNvIGl0IGNhbiBhZGFwdCB0aGUgbWFyZ2lucyBvbiB0aGUgY29udGVudC5cbiAgICovXG4gIHJlYWRvbmx5IF9tb2RlQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2M6IGFueSxcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEBkZXByZWNhdGVkIGBfY29udGFpbmVyYCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgICAgICAgICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RSQVdFUl9DT05UQUlORVIpIHB1YmxpYyBfY29udGFpbmVyPzogTWF0RHJhd2VyQ29udGFpbmVyKSB7XG5cbiAgICB0aGlzLm9wZW5lZENoYW5nZS5zdWJzY3JpYmUoKG9wZW5lZDogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKG9wZW5lZCkge1xuICAgICAgICBpZiAodGhpcy5fZG9jKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSB0aGlzLl9kb2MuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Rha2VGb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gYGtleWRvd25gIGV2ZW50cyBvdXRzaWRlIHRoZSB6b25lIHNvIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBpcyBub3QgcnVuIGV2ZXJ5XG4gICAgICogdGltZSBhIGtleSBpcyBwcmVzc2VkLiBJbnN0ZWFkIHdlIHJlLWVudGVyIHRoZSB6b25lIG9ubHkgaWYgdGhlIGBFU0NgIGtleSBpcyBwcmVzc2VkXG4gICAgICogYW5kIHdlIGRvbid0IGhhdmUgY2xvc2UgZGlzYWJsZWQuXG4gICAgICovXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgKGZyb21FdmVudCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdrZXlkb3duJykgYXMgT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PikucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIXRoaXMuZGlzYWJsZUNsb3NlICYmICFoYXNNb2RpZmllcktleShldmVudCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpXG4gICAgICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICAvLyBXZSBuZWVkIGEgU3ViamVjdCB3aXRoIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBiZWNhdXNlIHRoZSBgZG9uZWAgZXZlbnRcbiAgICAvLyBmaXJlcyB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9hbmltYXRpb25FbmQucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICB9KSkuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHtmcm9tU3RhdGUsIHRvU3RhdGV9ID0gZXZlbnQ7XG5cbiAgICAgIGlmICgodG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDAgJiYgZnJvbVN0YXRlID09PSAndm9pZCcpIHx8XG4gICAgICAgICAgKHRvU3RhdGUgPT09ICd2b2lkJyAmJiBmcm9tU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwKSkge1xuICAgICAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KHRoaXMuX29wZW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgZm9jdXMgaW50byB0aGUgZHJhd2VyLiBOb3RlIHRoYXQgdGhpcyB3b3JrcyBldmVuIGlmXG4gICAqIHRoZSBmb2N1cyB0cmFwIGlzIGRpc2FibGVkIGluIGBzaWRlYCBtb2RlLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFrZUZvY3VzKCkge1xuICAgIGlmICghdGhpcy5hdXRvRm9jdXMgfHwgIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50V2hlblJlYWR5KCkudGhlbihoYXNNb3ZlZEZvY3VzID0+IHtcbiAgICAgIC8vIElmIHRoZXJlIHdlcmUgbm8gZm9jdXNhYmxlIGVsZW1lbnRzLCBmb2N1cyB0aGUgc2lkZW5hdiBpdHNlbGYgc28gdGhlIGtleWJvYXJkIG5hdmlnYXRpb25cbiAgICAgIC8vIHN0aWxsIHdvcmtzLiBXZSBuZWVkIHRvIGNoZWNrIHRoYXQgYGZvY3VzYCBpcyBhIGZ1bmN0aW9uIGR1ZSB0byBVbml2ZXJzYWwuXG4gICAgICBpZiAoIWhhc01vdmVkRm9jdXMgJiYgdHlwZW9mIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBmb2N1cyBpcyBjdXJyZW50bHkgaW5zaWRlIHRoZSBkcmF3ZXIsIHJlc3RvcmVzIGl0IHRvIHdoZXJlIGl0IHdhcyBiZWZvcmUgdGhlIGRyYXdlclxuICAgKiBvcGVuZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZUVsID0gdGhpcy5fZG9jICYmIHRoaXMuX2RvYy5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKGFjdGl2ZUVsICYmIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbCkpIHtcbiAgICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBjaGVjayB2aWEgYGluc3RhbmNlb2YgSFRNTEVsZW1lbnRgIHNvIHRoYXQgd2UgY2FuIGNvdmVyIFNWR3MgYXMgd2VsbC5cbiAgICAgIGlmICh0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCkge1xuICAgICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQsIHRoaXMuX29wZW5lZFZpYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkID0gbnVsbDtcbiAgICB0aGlzLl9vcGVuZWRWaWEgPSBudWxsO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzVHJhcCA9IHRoaXMuX2ZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBFbmFibGUgdGhlIGFuaW1hdGlvbnMgYWZ0ZXIgdGhlIGxpZmVjeWNsZSBob29rcyBoYXZlIHJ1biwgaW4gb3JkZXIgdG8gYXZvaWQgYW5pbWF0aW5nXG4gICAgLy8gZHJhd2VycyB0aGF0IGFyZSBvcGVuIGJ5IGRlZmF1bHQuIFdoZW4gd2UncmUgb24gdGhlIHNlcnZlciwgd2Ugc2hvdWxkbid0IGVuYWJsZSB0aGVcbiAgICAvLyBhbmltYXRpb25zLCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIGRyYXdlciB0byBhbmltYXRlIHRoZSBmaXJzdCB0aW1lIHRoZSB1c2VyIHNlZXNcbiAgICAvLyB0aGUgcGFnZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9lbmFibGVBbmltYXRpb25zID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25FbmQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9tb2RlQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbiB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIG9wZW4ob3BlbmVkVmlhPzogRm9jdXNPcmlnaW4pOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZSh0cnVlLCBvcGVuZWRWaWEpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBkcmF3ZXIuICovXG4gIGNsb3NlKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlKGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhpcyBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBiZSBvcGVuLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIHRvZ2dsZShpc09wZW46IGJvb2xlYW4gPSAhdGhpcy5vcGVuZWQsIG9wZW5lZFZpYTogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScpOlxuICAgIFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG5cbiAgICB0aGlzLl9vcGVuZWQgPSBpc09wZW47XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9IHRoaXMuX2VuYWJsZUFuaW1hdGlvbnMgPyAnb3BlbicgOiAnb3Blbi1pbnN0YW50JztcbiAgICAgIHRoaXMuX29wZW5lZFZpYSA9IG9wZW5lZFZpYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLm9wZW5lZENoYW5nZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcGVuID0+IHJlc29sdmUob3BlbiA/ICdvcGVuJyA6ICdjbG9zZScpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBfd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ID8gKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwKSA6IDA7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgZm9jdXMgdHJhcC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRm9jdXNUcmFwU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgLy8gVGhlIGZvY3VzIHRyYXAgaXMgb25seSBlbmFibGVkIHdoZW4gdGhlIGRyYXdlciBpcyBvcGVuIGluIGFueSBtb2RlIG90aGVyIHRoYW4gc2lkZS5cbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5lbmFibGVkID0gdGhpcy5vcGVuZWQgJiYgdGhpcy5tb2RlICE9PSAnc2lkZSc7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ0B0cmFuc2Zvcm0uc3RhcnQnLCBbJyRldmVudCddKVxuICBfYW5pbWF0aW9uU3RhcnRMaXN0ZW5lcihldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGFydGVkLm5leHQoZXZlbnQpO1xuICB9XG5cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ0B0cmFuc2Zvcm0uZG9uZScsIFsnJGV2ZW50J10pXG4gIF9hbmltYXRpb25Eb25lTGlzdGVuZXIoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLm5leHQoZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVDbG9zZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcGVuZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuXG4vKipcbiAqIGA8bWF0LWRyYXdlci1jb250YWluZXI+YCBjb21wb25lbnQuXG4gKlxuICogVGhpcyBpcyB0aGUgcGFyZW50IGNvbXBvbmVudCB0byBvbmUgb3IgdHdvIGA8bWF0LWRyYXdlcj5gcyB0aGF0IHZhbGlkYXRlcyB0aGUgc3RhdGUgaW50ZXJuYWxseVxuICogYW5kIGNvb3JkaW5hdGVzIHRoZSBiYWNrZHJvcCBhbmQgY29udGVudCBzdHlsaW5nLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyLWNvbnRhaW5lcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyQ29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXItY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZHJhd2VyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItY29udGFpbmVyLWV4cGxpY2l0LWJhY2tkcm9wXSc6ICdfYmFja2Ryb3BPdmVycmlkZScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0RSQVdFUl9DT05UQUlORVIsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdERyYXdlckNvbnRhaW5lclxuICB9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250YWluZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICAvKiogQWxsIGRyYXdlcnMgaW4gdGhlIGNvbnRhaW5lci4gSW5jbHVkZXMgZHJhd2VycyBmcm9tIGluc2lkZSBuZXN0ZWQgY29udGFpbmVycy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXREcmF3ZXIsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KVxuICBfYWxsRHJhd2VyczogUXVlcnlMaXN0PE1hdERyYXdlcj47XG5cbiAgLyoqIERyYXdlcnMgdGhhdCBiZWxvbmcgdG8gdGhpcyBjb250YWluZXIuICovXG4gIF9kcmF3ZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+KCk7XG5cbiAgQENvbnRlbnRDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfY29udGVudDogTWF0RHJhd2VyQ29udGVudDtcbiAgQFZpZXdDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfdXNlckNvbnRlbnQ6IE1hdERyYXdlckNvbnRlbnQ7XG5cbiAgLyoqIFRoZSBkcmF3ZXIgY2hpbGQgd2l0aCB0aGUgYHN0YXJ0YCBwb3NpdGlvbi4gKi9cbiAgZ2V0IHN0YXJ0KCk6IE1hdERyYXdlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fc3RhcnQ7IH1cblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgZW5kYCBwb3NpdGlvbi4gKi9cbiAgZ2V0IGVuZCgpOiBNYXREcmF3ZXIgfCBudWxsIHsgcmV0dXJuIHRoaXMuX2VuZDsgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIHRoZSBjb250YWluZXIgd2hlbmV2ZXJcbiAgICogdGhlIHNpemUgb2YgYW55IG9mIGl0cyBkcmF3ZXJzIGNoYW5nZXMuXG4gICAqXG4gICAqICoqVXNlIGF0IHlvdXIgb3duIHJpc2shKiogRW5hYmxpbmcgdGhpcyBvcHRpb24gY2FuIGNhdXNlIGxheW91dCB0aHJhc2hpbmcgYnkgbWVhc3VyaW5nXG4gICAqIHRoZSBkcmF3ZXJzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuIENhbiBiZSBjb25maWd1cmVkIGdsb2JhbGx5IHZpYSB0aGVcbiAgICogYE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRWAgdG9rZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b3NpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hdXRvc2l6ZTsgfVxuICBzZXQgYXV0b3NpemUodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fYXV0b3NpemUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2F1dG9zaXplOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgY29udGFpbmVyIHNob3VsZCBoYXZlIGEgYmFja2Ryb3Agd2hpbGUgb25lIG9mIHRoZSBzaWRlbmF2cyBpcyBvcGVuLlxuICAgKiBJZiBleHBsaWNpdGx5IHNldCB0byBgdHJ1ZWAsIHRoZSBiYWNrZHJvcCB3aWxsIGJlIGVuYWJsZWQgZm9yIGRyYXdlcnMgaW4gdGhlIGBzaWRlYFxuICAgKiBtb2RlIGFzIHdlbGwuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaGFzQmFja2Ryb3AoKSB7XG4gICAgaWYgKHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICF0aGlzLl9zdGFydCB8fCB0aGlzLl9zdGFydC5tb2RlICE9PSAnc2lkZScgfHwgIXRoaXMuX2VuZCB8fCB0aGlzLl9lbmQubW9kZSAhPT0gJ3NpZGUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fYmFja2Ryb3BPdmVycmlkZSA9IHZhbHVlID09IG51bGwgPyBudWxsIDogY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBfYmFja2Ryb3BPdmVycmlkZTogYm9vbGVhbiB8IG51bGw7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGJhY2tkcm9wIGlzIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBiYWNrZHJvcENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBkcmF3ZXIgYXQgdGhlIHN0YXJ0L2VuZCBwb3NpdGlvbiwgaW5kZXBlbmRlbnQgb2YgZGlyZWN0aW9uLiAqL1xuICBwcml2YXRlIF9zdGFydDogTWF0RHJhd2VyIHwgbnVsbDtcbiAgcHJpdmF0ZSBfZW5kOiBNYXREcmF3ZXIgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgZHJhd2VyIGF0IHRoZSBsZWZ0L3JpZ2h0LiBXaGVuIGRpcmVjdGlvbiBjaGFuZ2VzLCB0aGVzZSB3aWxsIGNoYW5nZSBhcyB3ZWxsLlxuICAgKiBUaGV5J3JlIHVzZWQgYXMgYWxpYXNlcyBmb3IgdGhlIGFib3ZlIHRvIHNldCB0aGUgbGVmdC9yaWdodCBzdHlsZSBwcm9wZXJseS5cbiAgICogSW4gTFRSLCBfbGVmdCA9PSBfc3RhcnQgYW5kIF9yaWdodCA9PSBfZW5kLlxuICAgKiBJbiBSVEwsIF9sZWZ0ID09IF9lbmQgYW5kIF9yaWdodCA9PSBfc3RhcnQuXG4gICAqL1xuICBwcml2YXRlIF9sZWZ0OiBNYXREcmF3ZXIgfCBudWxsO1xuICBwcml2YXRlIF9yaWdodDogTWF0RHJhd2VyIHwgbnVsbDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgb24gZXZlcnkgbmdEb0NoZWNrLiBVc2VkIGZvciBkZWJvdW5jaW5nIHJlZmxvd3MuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2RvQ2hlY2tTdWJqZWN0ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogTWFyZ2lucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjb250ZW50LiBUaGVzZSBhcmUgdXNlZCB0byBwdXNoIC8gc2hyaW5rIHRoZSBkcmF3ZXIgY29udGVudCB3aGVuIGFcbiAgICogZHJhd2VyIGlzIG9wZW4uIFdlIHVzZSBtYXJnaW4gcmF0aGVyIHRoYW4gdHJhbnNmb3JtIGV2ZW4gZm9yIHB1c2ggbW9kZSBiZWNhdXNlIHRyYW5zZm9ybSBicmVha3NcbiAgICogZml4ZWQgcG9zaXRpb24gZWxlbWVudHMgaW5zaWRlIG9mIHRoZSB0cmFuc2Zvcm1lZCBlbGVtZW50LlxuICAgKi9cbiAgX2NvbnRlbnRNYXJnaW5zOiB7bGVmdDogbnVtYmVyfG51bGwsIHJpZ2h0OiBudW1iZXJ8bnVsbH0gPSB7bGVmdDogbnVsbCwgcmlnaHQ6IG51bGx9O1xuXG4gIHJlYWRvbmx5IF9jb250ZW50TWFyZ2luQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHtsZWZ0OiBudW1iZXJ8bnVsbCwgcmlnaHQ6IG51bWJlcnxudWxsfT4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBDZGtTY3JvbGxhYmxlIGluc3RhbmNlIHRoYXQgd3JhcHMgdGhlIHNjcm9sbGFibGUgY29udGVudC4gKi9cbiAgZ2V0IHNjcm9sbGFibGUoKTogQ2RrU2Nyb2xsYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJDb250ZW50IHx8IHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkUpIGRlZmF1bHRBdXRvc2l6ZSA9IGZhbHNlLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuXG4gICAgLy8gSWYgYSBgRGlyYCBkaXJlY3RpdmUgZXhpc3RzIHVwIHRoZSB0cmVlLCBsaXN0ZW4gZGlyZWN0aW9uIGNoYW5nZXNcbiAgICAvLyBhbmQgdXBkYXRlIHRoZSBsZWZ0L3JpZ2h0IHByb3BlcnRpZXMgdG8gcG9pbnQgdG8gdGhlIHByb3BlciBzdGFydC9lbmQuXG4gICAgaWYgKF9kaXIpIHtcbiAgICAgIF9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgbWluaW11bSB3aWR0aCBvZiB0aGUgc2lkZW5hdiBkZXBlbmRzIG9uIHRoZSB2aWV3cG9ydCB3aWR0aCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJlY29tcHV0ZSB0aGUgbWFyZ2lucyBpZiB0aGUgdmlld3BvcnQgY2hhbmdlcy5cbiAgICB2aWV3cG9ydFJ1bGVyLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcblxuICAgIHRoaXMuX2F1dG9zaXplID0gZGVmYXVsdEF1dG9zaXplO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FsbERyYXdlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbERyYXdlcnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRyYXdlcjogUXVlcnlMaXN0PE1hdERyYXdlcj4pID0+IHtcbiAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMC4wLjAgUmVtb3ZlIGBfY29udGFpbmVyYCBjaGVjayBvbmNlIGNvbnRhaW5lciBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAgICAgIHRoaXMuX2RyYXdlcnMucmVzZXQoZHJhd2VyLmZpbHRlcihpdGVtID0+ICFpdGVtLl9jb250YWluZXIgfHwgaXRlbS5fY29udGFpbmVyID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RyYXdlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2RyYXdlcnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuXG4gICAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goKGRyYXdlcjogTWF0RHJhd2VyKSA9PiB7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyVG9nZ2xlKGRyYXdlcik7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0aGlzLl9kcmF3ZXJzLmxlbmd0aCB8fFxuICAgICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgfHxcbiAgICAgICAgICB0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZG9DaGVja1N1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgxMCksIC8vIEFyYml0cmFyeSBkZWJvdW5jZSB0aW1lLCBsZXNzIHRoYW4gYSBmcmFtZSBhdCA2MGZwc1xuICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY29udGVudE1hcmdpbkNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kb0NoZWNrU3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2RyYXdlcnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2FsbHMgYG9wZW5gIG9mIGJvdGggc3RhcnQgYW5kIGVuZCBkcmF3ZXJzICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIub3BlbigpKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgY2xvc2VgIG9mIGJvdGggc3RhcnQgYW5kIGVuZCBkcmF3ZXJzICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyLmNsb3NlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyBhbmQgdXBkYXRlcyB0aGUgaW5saW5lIHN0eWxlcyBmb3IgdGhlIGNvbnRlbnQuIE5vdGUgdGhhdCB0aGlzIHNob3VsZCBiZSB1c2VkXG4gICAqIHNwYXJpbmdseSwgYmVjYXVzZSBpdCBjYXVzZXMgYSByZWZsb3cuXG4gICAqL1xuICB1cGRhdGVDb250ZW50TWFyZ2lucygpIHtcbiAgICAvLyAxLiBGb3IgZHJhd2VycyBpbiBgb3ZlcmAgbW9kZSwgdGhleSBkb24ndCBhZmZlY3QgdGhlIGNvbnRlbnQuXG4gICAgLy8gMi4gRm9yIGRyYXdlcnMgaW4gYHNpZGVgIG1vZGUgdGhleSBzaG91bGQgc2hyaW5rIHRoZSBjb250ZW50LiBXZSBkbyB0aGlzIGJ5IGFkZGluZyB0byB0aGVcbiAgICAvLyAgICBsZWZ0IG1hcmdpbiAoZm9yIGxlZnQgZHJhd2VyKSBvciByaWdodCBtYXJnaW4gKGZvciByaWdodCB0aGUgZHJhd2VyKS5cbiAgICAvLyAzLiBGb3IgZHJhd2VycyBpbiBgcHVzaGAgbW9kZSB0aGUgc2hvdWxkIHNoaWZ0IHRoZSBjb250ZW50IHdpdGhvdXQgcmVzaXppbmcgaXQuIFdlIGRvIHRoaXMgYnlcbiAgICAvLyAgICBhZGRpbmcgdG8gdGhlIGxlZnQgb3IgcmlnaHQgbWFyZ2luIGFuZCBzaW11bHRhbmVvdXNseSBzdWJ0cmFjdGluZyB0aGUgc2FtZSBhbW91bnQgb2ZcbiAgICAvLyAgICBtYXJnaW4gZnJvbSB0aGUgb3RoZXIgc2lkZS5cbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgbGV0IHJpZ2h0ID0gMDtcblxuICAgIGlmICh0aGlzLl9sZWZ0ICYmIHRoaXMuX2xlZnQub3BlbmVkKSB7XG4gICAgICBpZiAodGhpcy5fbGVmdC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICBsZWZ0ICs9IHRoaXMuX2xlZnQuX3dpZHRoO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fbGVmdC5fd2lkdGg7XG4gICAgICAgIGxlZnQgKz0gd2lkdGg7XG4gICAgICAgIHJpZ2h0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9yaWdodCAmJiB0aGlzLl9yaWdodC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICByaWdodCArPSB0aGlzLl9yaWdodC5fd2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fcmlnaHQuX3dpZHRoO1xuICAgICAgICByaWdodCArPSB3aWR0aDtcbiAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBlaXRoZXIgYHJpZ2h0YCBvciBgbGVmdGAgaXMgemVybywgZG9uJ3Qgc2V0IGEgc3R5bGUgdG8gdGhlIGVsZW1lbnQuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXNlcnMgdG8gc3BlY2lmeSBhIGN1c3RvbSBzaXplIHZpYSBDU1MgY2xhc3MgaW4gU1NSIHNjZW5hcmlvcyB3aGVyZSB0aGVcbiAgICAvLyBtZWFzdXJlZCB3aWR0aHMgd2lsbCBhbHdheXMgYmUgemVyby4gTm90ZSB0aGF0IHdlIHJlc2V0IHRvIGBudWxsYCBoZXJlLCByYXRoZXJcbiAgICAvLyB0aGFuIGJlbG93LCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdHlwZXMgaW4gdGhlIGBpZmAgYmVsb3cgYXJlIGNvbnNpc3RlbnQuXG4gICAgbGVmdCA9IGxlZnQgfHwgbnVsbCE7XG4gICAgcmlnaHQgPSByaWdodCB8fCBudWxsITtcblxuICAgIGlmIChsZWZ0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5sZWZ0IHx8IHJpZ2h0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5yaWdodCkge1xuICAgICAgdGhpcy5fY29udGVudE1hcmdpbnMgPSB7bGVmdCwgcmlnaHR9O1xuXG4gICAgICAvLyBQdWxsIGJhY2sgaW50byB0aGUgTmdab25lIHNpbmNlIGluIHNvbWUgY2FzZXMgd2UgY291bGQgYmUgb3V0c2lkZS4gV2UgbmVlZCB0byBiZSBjYXJlZnVsXG4gICAgICAvLyB0byBkbyBpdCBvbmx5IHdoZW4gc29tZXRoaW5nIGNoYW5nZWQsIG90aGVyd2lzZSB3ZSBjYW4gZW5kIHVwIGhpdHRpbmcgdGhlIHpvbmUgdG9vIG9mdGVuLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5uZXh0KHRoaXMuX2NvbnRlbnRNYXJnaW5zKSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIElmIHVzZXJzIG9wdGVkIGludG8gYXV0b3NpemluZywgZG8gYSBjaGVjayBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9hdXRvc2l6ZSAmJiB0aGlzLl9pc1B1c2hlZCgpKSB7XG4gICAgICAvLyBSdW4gb3V0c2lkZSB0aGUgTmdab25lLCBvdGhlcndpc2UgdGhlIGRlYm91bmNlciB3aWxsIHRocm93IHVzIGludG8gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLl9kb0NoZWNrU3ViamVjdC5uZXh0KCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBldmVudHMgaW4gb3JkZXIgdG8gc2V0IGEgY2xhc3Mgb24gdGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQgd2hlbiB0aGVcbiAgICogZHJhd2VyIGlzIG9wZW4gYW5kIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiBUaGlzIGVuc3VyZXMgYW55IG92ZXJmbG93IG9uIHRoZSBjb250YWluZXIgZWxlbWVudFxuICAgKiBpcyBwcm9wZXJseSBoaWRkZW4uXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclRvZ2dsZShkcmF3ZXI6IE1hdERyYXdlcik6IHZvaWQge1xuICAgIGRyYXdlci5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgICAgZmlsdGVyKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IGV2ZW50LmZyb21TdGF0ZSAhPT0gZXZlbnQudG9TdGF0ZSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSxcbiAgICApXG4gICAgLnN1YnNjcmliZSgoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICAvLyBTZXQgdGhlIHRyYW5zaXRpb24gY2xhc3Mgb24gdGhlIGNvbnRhaW5lciBzbyB0aGF0IHRoZSBhbmltYXRpb25zIG9jY3VyLiBUaGlzIHNob3VsZCBub3RcbiAgICAgIC8vIGJlIHNldCBpbml0aWFsbHkgYmVjYXVzZSBhbmltYXRpb25zIHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZCB2aWEgYSBjaGFuZ2UgaW4gc3RhdGUuXG4gICAgICBpZiAoZXZlbnQudG9TdGF0ZSAhPT0gJ29wZW4taW5zdGFudCcgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWRyYXdlci10cmFuc2l0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgaWYgKGRyYXdlci5tb2RlICE9PSAnc2lkZScpIHtcbiAgICAgIGRyYXdlci5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+XG4gICAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyQ2xhc3MoZHJhd2VyLm9wZW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBvblBvc2l0aW9uQ2hhbmdlZCBldmVudCBpbiBvcmRlciB0b1xuICAgKiByZS12YWxpZGF0ZSBkcmF3ZXJzIHdoZW4gdGhlIHBvc2l0aW9uIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTk9URTogV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IGJlZm9yZSB2YWxpZGF0aW5nLFxuICAgIC8vIHNpbmNlIGJvdGggZHJhd2VycyBtYXkgYmUgc3dhcHBpbmcgcG9zaXRpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgZHJhd2VyLm9uUG9zaXRpb25DaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIGRyYXdlciBtb2RlIHNvIHdlIGNhbiBydW4gY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKGRyYXdlcikge1xuICAgICAgZHJhd2VyLl9tb2RlQ2hhbmdlZC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3llZCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSAnbWF0LWRyYXdlci1vcGVuZWQnIGNsYXNzIG9uIHRoZSBtYWluICdtYXQtZHJhd2VyLWNvbnRhaW5lcicgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc2V0Q29udGFpbmVyQ2xhc3MoaXNBZGQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9ICdtYXQtZHJhd2VyLWNvbnRhaW5lci1oYXMtb3Blbic7XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlciBjaGlsZHJlbiBjb21wb25lbnRzLiAqL1xuICBwcml2YXRlIF92YWxpZGF0ZURyYXdlcnMoKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9lbmQgPSBudWxsO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhdCBtb3N0IG9uZSBzdGFydCBhbmQgb25lIGVuZCBkcmF3ZXIuXG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiB7XG4gICAgICBpZiAoZHJhd2VyLnBvc2l0aW9uID09ICdlbmQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmQgIT0gbnVsbCkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdlbmQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbmQgPSBkcmF3ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQgIT0gbnVsbCkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdzdGFydCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gZHJhd2VyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9sZWZ0ID0gbnVsbDtcblxuICAgIC8vIERldGVjdCBpZiB3ZSdyZSBMVFIgb3IgUlRMLlxuICAgIGlmICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX2VuZDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9zdGFydDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fZW5kO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250YWluZXIgaXMgYmVpbmcgcHVzaGVkIHRvIHRoZSBzaWRlIGJ5IG9uZSBvZiB0aGUgZHJhd2Vycy4gKi9cbiAgcHJpdmF0ZSBfaXNQdXNoZWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpICYmIHRoaXMuX3N0YXJ0Lm1vZGUgIT0gJ292ZXInKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fZW5kLm1vZGUgIT0gJ292ZXInKTtcbiAgfVxuXG4gIF9vbkJhY2tkcm9wQ2xpY2tlZCgpIHtcbiAgICB0aGlzLmJhY2tkcm9wQ2xpY2suZW1pdCgpO1xuICAgIHRoaXMuX2Nsb3NlTW9kYWxEcmF3ZXIoKTtcbiAgfVxuXG4gIF9jbG9zZU1vZGFsRHJhd2VyKCkge1xuICAgIC8vIENsb3NlIGFsbCBvcGVuIGRyYXdlcnMgd2hlcmUgY2xvc2luZyBpcyBub3QgZGlzYWJsZWQgYW5kIHRoZSBtb2RlIGlzIG5vdCBgc2lkZWAuXG4gICAgW3RoaXMuX3N0YXJ0LCB0aGlzLl9lbmRdXG4gICAgICAuZmlsdGVyKGRyYXdlciA9PiBkcmF3ZXIgJiYgIWRyYXdlci5kaXNhYmxlQ2xvc2UgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcikpXG4gICAgICAuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyIS5jbG9zZSgpKTtcbiAgfVxuXG4gIF9pc1Nob3dpbmdCYWNrZHJvcCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX3N0YXJ0KSkgfHxcbiAgICAgICAgICAgKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpICYmIHRoaXMuX2NhbkhhdmVCYWNrZHJvcCh0aGlzLl9lbmQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NhbkhhdmVCYWNrZHJvcChkcmF3ZXI6IE1hdERyYXdlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkcmF3ZXIubW9kZSAhPT0gJ3NpZGUnIHx8ICEhdGhpcy5fYmFja2Ryb3BPdmVycmlkZTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRHJhd2VyT3BlbihkcmF3ZXI6IE1hdERyYXdlciB8IG51bGwpOiBkcmF3ZXIgaXMgTWF0RHJhd2VyIHtcbiAgICByZXR1cm4gZHJhd2VyICE9IG51bGwgJiYgZHJhd2VyLm9wZW5lZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvc2l6ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzQmFja2Ryb3A6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==