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
    class MatDrawerContent extends CdkScrollable {
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
    }
    MatDrawerContent.decorators = [
        { type: Component, args: [{
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
        { type: MatDrawerContainer, decorators: [{ type: Inject, args: [forwardRef(() => MatDrawerContainer),] }] },
        { type: ElementRef },
        { type: ScrollDispatcher },
        { type: NgZone }
    ];
    return MatDrawerContent;
})();
export { MatDrawerContent };
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
let MatDrawer = /** @class */ (() => {
    class MatDrawer {
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
    }
    MatDrawer.decorators = [
        { type: Component, args: [{
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
    class MatDrawerContainer {
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
    }
    MatDrawerContainer.decorators = [
        { type: Component, args: [{
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
                    styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"]
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
    return MatDrawerContainer;
})();
export { MatDrawerContainer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxZQUFZLEVBQTBCLGdCQUFnQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDekYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzRCxPQUFPLEVBQ0wsWUFBWSxFQUNaLE1BQU0sRUFDTixHQUFHLEVBQ0gsU0FBUyxFQUNULElBQUksRUFDSixTQUFTLEVBQ1Qsb0JBQW9CLEdBQ3JCLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxF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RUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxTQUFTLEVBQUUsQ0FBQzs0QkFDVixPQUFPLEVBQUUsb0JBQW9COzRCQUM3QixXQUFXLEVBQUUsa0JBQWtCO3lCQUNoQyxDQUFDOztpQkFDSDs7OztnQkFqZU8sY0FBYyx1QkEwakJQLFFBQVE7Z0JBM2lCckIsVUFBVTtnQkFNVixNQUFNO2dCQVhOLGlCQUFpQjtnQkFOc0IsYUFBYTtnREEyakJ2QyxNQUFNLFNBQUMsMkJBQTJCOzZDQUNsQyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7OzhCQTVGcEQsZUFBZSxTQUFDLFNBQVMsRUFBRTt3QkFDMUIsdUVBQXVFO3dCQUN2RSw4Q0FBOEM7d0JBQzlDLFdBQVcsRUFBRSxJQUFJO3FCQUNsQjsyQkFNQSxZQUFZLFNBQUMsZ0JBQWdCOytCQUM3QixTQUFTLFNBQUMsZ0JBQWdCOzJCQWdCMUIsS0FBSzs4QkFVTCxLQUFLO2dDQWNMLE1BQU07O0lBNlNULHlCQUFDO0tBQUE7U0FsV1ksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbiwgRm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5fSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZSwgU2Nyb2xsRGlzcGF0Y2hlciwgVmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBIb3N0TGlzdGVuZXIsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIHRha2UsXG4gIHRha2VVbnRpbCxcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0RHJhd2VyQW5pbWF0aW9uc30gZnJvbSAnLi9kcmF3ZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiB0d28gTWF0RHJhd2VyIGFyZSBtYXRjaGluZyB0aGUgc2FtZSBwb3NpdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKHBvc2l0aW9uOiBzdHJpbmcpIHtcbiAgdGhyb3cgRXJyb3IoYEEgZHJhd2VyIHdhcyBhbHJlYWR5IGRlY2xhcmVkIGZvciAncG9zaXRpb249XCIke3Bvc2l0aW9ufVwiJ2ApO1xufVxuXG5cbi8qKiBSZXN1bHQgb2YgdGhlIHRvZ2dsZSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgZHJhd2VyLiAqL1xuZXhwb3J0IHR5cGUgTWF0RHJhd2VyVG9nZ2xlUmVzdWx0ID0gJ29wZW4nIHwgJ2Nsb3NlJztcblxuLyoqIERyYXdlciBhbmQgU2lkZU5hdiBkaXNwbGF5IG1vZGVzLiAqL1xuZXhwb3J0IHR5cGUgTWF0RHJhd2VyTW9kZSA9ICdvdmVyJyB8ICdwdXNoJyB8ICdzaWRlJztcblxuLyoqIENvbmZpZ3VyZXMgd2hldGhlciBkcmF3ZXJzIHNob3VsZCB1c2UgYXV0byBzaXppbmcgYnkgZGVmYXVsdC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkUgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlksXG4gICAgfSk7XG5cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBkcmF3ZXIgY29udGFpbmVyIHRvIGEgZHJhd2VyIHdoaWxlIGF2b2lkaW5nIGNpcmN1bGFyIHJlZmVyZW5jZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRFJBV0VSX0NPTlRBSU5FUiA9IG5ldyBJbmplY3Rpb25Ub2tlbignTUFUX0RSQVdFUl9DT05UQUlORVInKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVfRkFDVE9SWSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXItY29udGVudCcsXG4gICAgJ1tzdHlsZS5tYXJnaW4tbGVmdC5weF0nOiAnX2NvbnRhaW5lci5fY29udGVudE1hcmdpbnMubGVmdCcsXG4gICAgJ1tzdHlsZS5tYXJnaW4tcmlnaHQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLnJpZ2h0JyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRlbnQgZXh0ZW5kcyBDZGtTY3JvbGxhYmxlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdERyYXdlckNvbnRhaW5lcikpIHB1YmxpYyBfY29udGFpbmVyOiBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgICBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHNjcm9sbERpc3BhdGNoZXIsIG5nWm9uZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY29udGFpbmVyLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGNvcnJlc3BvbmRzIHRvIGEgZHJhd2VyIHRoYXQgY2FuIGJlIG9wZW5lZCBvbiB0aGUgZHJhd2VyIGNvbnRhaW5lci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXIuaHRtbCcsXG4gIGFuaW1hdGlvbnM6IFttYXREcmF3ZXJBbmltYXRpb25zLnRyYW5zZm9ybURyYXdlcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlcicsXG4gICAgLy8gbXVzdCBwcmV2ZW50IHRoZSBicm93c2VyIGZyb20gYWxpZ25pbmcgdGV4dCBiYXNlZCBvbiB2YWx1ZVxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLWVuZF0nOiAncG9zaXRpb24gPT09IFwiZW5kXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vdmVyXSc6ICdtb2RlID09PSBcIm92ZXJcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXB1c2hdJzogJ21vZGUgPT09IFwicHVzaFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItc2lkZV0nOiAnbW9kZSA9PT0gXCJzaWRlXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vcGVuZWRdJzogJ29wZW5lZCcsXG4gICAgJ3RhYkluZGV4JzogJy0xJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZHJhd2VyIGlzIGluaXRpYWxpemVkLiBVc2VkIGZvciBkaXNhYmxpbmcgdGhlIGluaXRpYWwgYW5pbWF0aW9uLiAqL1xuICBwcml2YXRlIF9lbmFibGVBbmltYXRpb25zID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzaWRlIHRoYXQgdGhlIGRyYXdlciBpcyBhdHRhY2hlZCB0by4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBvc2l0aW9uKCk6ICdzdGFydCcgfCAnZW5kJyB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxuICBzZXQgcG9zaXRpb24odmFsdWU6ICdzdGFydCcgfCAnZW5kJykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgdmFsdWUgPSB2YWx1ZSA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgaWYgKHZhbHVlICE9IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuICAgICAgdGhpcy5vblBvc2l0aW9uQ2hhbmdlZC5lbWl0KCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBNb2RlIG9mIHRoZSBkcmF3ZXI7IG9uZSBvZiAnb3ZlcicsICdwdXNoJyBvciAnc2lkZScuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtb2RlKCk6IE1hdERyYXdlck1vZGUgeyByZXR1cm4gdGhpcy5fbW9kZTsgfVxuICBzZXQgbW9kZSh2YWx1ZTogTWF0RHJhd2VyTW9kZSkge1xuICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9tb2RlOiBNYXREcmF3ZXJNb2RlID0gJ292ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgY2FuIGJlIGNsb3NlZCB3aXRoIHRoZSBlc2NhcGUga2V5IG9yIGJ5IGNsaWNraW5nIG9uIHRoZSBiYWNrZHJvcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVDbG9zZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbG9zZTsgfVxuICBzZXQgZGlzYWJsZUNsb3NlKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVDbG9zZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGF1dG9tYXRpY2FsbHkgd2hlbiBvcGVuZWQuXG4gICAqIERlZmF1bHRzIHRvIGZhbHNlIGluIHdoZW4gYG1vZGVgIGlzIHNldCB0byBgc2lkZWAsIG90aGVyd2lzZSBkZWZhdWx0cyB0byBgdHJ1ZWAuIElmIGV4cGxpY2l0bHlcbiAgICogZW5hYmxlZCwgZm9jdXMgd2lsbCBiZSBtb3ZlZCBpbnRvIHRoZSBzaWRlbmF2IGluIGBzaWRlYCBtb2RlIGFzIHdlbGwuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b0ZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fYXV0b0ZvY3VzO1xuXG4gICAgLy8gTm90ZSB0aGF0IHVzdWFsbHkgd2UgZGlzYWJsZSBhdXRvIGZvY3VzaW5nIGluIGBzaWRlYCBtb2RlLCBiZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IHRoZVxuICAgIC8vIHNpZGVuYXYgaXMgYmVpbmcgdXNlZCwgYnV0IGluIHNvbWUgY2FzZXMgaXQgc3RpbGwgbWFrZXMgc2Vuc2UgdG8gZG8gaXQuIElmIHRoZSBjb25zdW1lclxuICAgIC8vIGV4cGxpY2l0bHkgZW5hYmxlZCBgYXV0b0ZvY3VzYCwgd2UgdGFrZSBpdCBhcyB0aGVtIGFsd2F5cyB3YW50aW5nIHRvIGVuYWJsZSBpdC5cbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IHRoaXMubW9kZSAhPT0gJ3NpZGUnIDogdmFsdWU7XG4gIH1cbiAgc2V0IGF1dG9Gb2N1cyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9hdXRvRm9jdXMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2F1dG9Gb2N1czogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGlzIG9wZW5lZC4gV2Ugb3ZlcmxvYWQgdGhpcyBiZWNhdXNlIHdlIHRyaWdnZXIgYW4gZXZlbnQgd2hlbiBpdFxuICAgKiBzdGFydHMgb3IgZW5kLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMudG9nZ2xlKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpOyB9XG4gIHByaXZhdGUgX29wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBIb3cgdGhlIHNpZGVuYXYgd2FzIG9wZW5lZCAoa2V5cHJlc3MsIG1vdXNlIGNsaWNrIGV0Yy4pICovXG4gIHByaXZhdGUgX29wZW5lZFZpYTogRm9jdXNPcmlnaW4gfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGFuaW1hdGluZy4gKi9cbiAgX2FuaW1hdGlvblN0YXJ0ZWQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgX2FuaW1hdGlvbkVuZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBzaWRlbmF2IGFuaW1hdGlvbi4gKi9cbiAgLy8gQEhvc3RCaW5kaW5nIGlzIHVzZWQgaW4gdGhlIGNsYXNzIGFzIGl0IGlzIGV4cGVjdGVkIHRvIGJlIGV4dGVuZGVkLiAgU2luY2UgQENvbXBvbmVudCBkZWNvcmF0b3JcbiAgLy8gbWV0YWRhdGEgaXMgbm90IGluaGVyaXRlZCBieSBjaGlsZCBjbGFzc2VzLCBpbnN0ZWFkIHRoZSBob3N0IGJpbmRpbmcgZGF0YSBpcyBkZWZpbmVkIGluIGEgd2F5XG4gIC8vIHRoYXQgY2FuIGJlIGluaGVyaXRlZC5cbiAgLy8gdHNsaW50OmRpc2FibGU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RCaW5kaW5nKCdAdHJhbnNmb3JtJylcbiAgX2FuaW1hdGlvblN0YXRlOiAnb3Blbi1pbnN0YW50JyB8ICdvcGVuJyB8ICd2b2lkJyA9ICd2b2lkJztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbiBzdGF0ZSBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxuICAgICAgLy8gTm90ZSB0aGlzIGhhcyB0byBiZSBhc3luYyBpbiBvcmRlciB0byBhdm9pZCBzb21lIGlzc3VlcyB3aXRoIHR3by1iaW5kaW5ncyAoc2VlICM4ODcyKS5cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oLyogaXNBc3luYyAqL3RydWUpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpXG4gIGdldCBfb3BlbmVkU3RyZWFtKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLm9wZW5lZENoYW5nZS5waXBlKGZpbHRlcihvID0+IG8pLCBtYXAoKCkgPT4ge30pKTtcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBvcGVuaW5nLiAqL1xuICBAT3V0cHV0KClcbiAgZ2V0IG9wZW5lZFN0YXJ0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApLFxuICAgICAgbWFwKCgpID0+IHt9KVxuICAgICk7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKVxuICBnZXQgX2Nsb3NlZFN0cmVhbSgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiAhbyksIG1hcCgoKSA9PiB7fSkpO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGNsb3NpbmcuICovXG4gIEBPdXRwdXQoKVxuICBnZXQgY2xvc2VkU3RhcnQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICAgIGZpbHRlcihlID0+IGUuZnJvbVN0YXRlICE9PSBlLnRvU3RhdGUgJiYgZS50b1N0YXRlID09PSAndm9pZCcpLFxuICAgICAgbWFwKCgpID0+IHt9KVxuICAgICk7XG4gIH1cblxuICAvKiogRW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIncyBwb3NpdGlvbiBjaGFuZ2VzLiAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCdwb3NpdGlvbkNoYW5nZWQnKSBvblBvc2l0aW9uQ2hhbmdlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgZHJhd2VyIG1vZGUgY2hhbmdlcy4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBkcmF3ZXIgY29udGFpbmVyIHRvXG4gICAqIHRvIGtub3cgd2hlbiB0byB3aGVuIHRoZSBtb2RlIGNoYW5nZXMgc28gaXQgY2FuIGFkYXB0IHRoZSBtYXJnaW5zIG9uIHRoZSBjb250ZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgX21vZGVDaGFuZ2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvYzogYW55LFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYF9jb250YWluZXJgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICAgICAgICAgICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRFJBV0VSX0NPTlRBSU5FUikgcHVibGljIF9jb250YWluZXI/OiBNYXREcmF3ZXJDb250YWluZXIpIHtcblxuICAgIHRoaXMub3BlbmVkQ2hhbmdlLnN1YnNjcmliZSgob3BlbmVkOiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAob3BlbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9kb2MpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCA9IHRoaXMuX2RvYy5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGFrZUZvY3VzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byBga2V5ZG93bmAgZXZlbnRzIG91dHNpZGUgdGhlIHpvbmUgc28gdGhhdCBjaGFuZ2UgZGV0ZWN0aW9uIGlzIG5vdCBydW4gZXZlcnlcbiAgICAgKiB0aW1lIGEga2V5IGlzIHByZXNzZWQuIEluc3RlYWQgd2UgcmUtZW50ZXIgdGhlIHpvbmUgb25seSBpZiB0aGUgYEVTQ2Aga2V5IGlzIHByZXNzZWRcbiAgICAgKiBhbmQgd2UgZG9uJ3QgaGF2ZSBjbG9zZSBkaXNhYmxlZC5cbiAgICAgKi9cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAoZnJvbUV2ZW50KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2tleWRvd24nKSBhcyBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+KS5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhdGhpcy5kaXNhYmxlQ2xvc2UgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICAgICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8vIFdlIG5lZWQgYSBTdWJqZWN0IHdpdGggZGlzdGluY3RVbnRpbENoYW5nZWQsIGJlY2F1c2UgdGhlIGBkb25lYCBldmVudFxuICAgIC8vIGZpcmVzIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4ge1xuICAgICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgICAgaWYgKCh0b1N0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMCAmJiBmcm9tU3RhdGUgPT09ICd2b2lkJykgfHxcbiAgICAgICAgICAodG9TdGF0ZSA9PT0gJ3ZvaWQnICYmIGZyb21TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApKSB7XG4gICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQodGhpcy5fb3BlbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBmb2N1cyBpbnRvIHRoZSBkcmF3ZXIuIE5vdGUgdGhhdCB0aGlzIHdvcmtzIGV2ZW4gaWZcbiAgICogdGhlIGZvY3VzIHRyYXAgaXMgZGlzYWJsZWQgaW4gYHNpZGVgIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIF90YWtlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmF1dG9Gb2N1cyB8fCAhdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKS50aGVuKGhhc01vdmVkRm9jdXMgPT4ge1xuICAgICAgLy8gSWYgdGhlcmUgd2VyZSBubyBmb2N1c2FibGUgZWxlbWVudHMsIGZvY3VzIHRoZSBzaWRlbmF2IGl0c2VsZiBzbyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgLy8gc3RpbGwgd29ya3MuIFdlIG5lZWQgdG8gY2hlY2sgdGhhdCBgZm9jdXNgIGlzIGEgZnVuY3Rpb24gZHVlIHRvIFVuaXZlcnNhbC5cbiAgICAgIGlmICghaGFzTW92ZWRGb2N1cyAmJiB0eXBlb2YgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGZvY3VzIGlzIGN1cnJlbnRseSBpbnNpZGUgdGhlIGRyYXdlciwgcmVzdG9yZXMgaXQgdG8gd2hlcmUgaXQgd2FzIGJlZm9yZSB0aGUgZHJhd2VyXG4gICAqIG9wZW5lZC5cbiAgICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuYXV0b0ZvY3VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlRWwgPSB0aGlzLl9kb2MgJiYgdGhpcy5fZG9jLmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoYWN0aXZlRWwgJiYgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsKSkge1xuICAgICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGNoZWNrIHZpYSBgaW5zdGFuY2VvZiBIVE1MRWxlbWVudGAgc28gdGhhdCB3ZSBjYW4gY292ZXIgU1ZHcyBhcyB3ZWxsLlxuICAgICAgaWYgKHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCwgdGhpcy5fb3BlbmVkVmlhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSBudWxsO1xuICAgIHRoaXMuX29wZW5lZFZpYSA9IG51bGw7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIEVuYWJsZSB0aGUgYW5pbWF0aW9ucyBhZnRlciB0aGUgbGlmZWN5Y2xlIGhvb2tzIGhhdmUgcnVuLCBpbiBvcmRlciB0byBhdm9pZCBhbmltYXRpbmdcbiAgICAvLyBkcmF3ZXJzIHRoYXQgYXJlIG9wZW4gYnkgZGVmYXVsdC4gV2hlbiB3ZSdyZSBvbiB0aGUgc2VydmVyLCB3ZSBzaG91bGRuJ3QgZW5hYmxlIHRoZVxuICAgIC8vIGFuaW1hdGlvbnMsIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0aGUgZHJhd2VyIHRvIGFuaW1hdGUgdGhlIGZpcnN0IHRpbWUgdGhlIHVzZXIgc2Vlc1xuICAgIC8vIHRoZSBwYWdlLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2VuYWJsZUFuaW1hdGlvbnMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIHRoZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSBvcGVuZWRWaWEgV2hldGhlciB0aGUgZHJhd2VyIHdhcyBvcGVuZWQgYnkgYSBrZXkgcHJlc3MsIG1vdXNlIGNsaWNrIG9yIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqIFVzZWQgZm9yIGZvY3VzIG1hbmFnZW1lbnQgYWZ0ZXIgdGhlIHNpZGVuYXYgaXMgY2xvc2VkLlxuICAgKi9cbiAgb3BlbihvcGVuZWRWaWE/OiBGb2N1c09yaWdpbik6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlKHRydWUsIG9wZW5lZFZpYSk7XG4gIH1cblxuICAvKiogQ2xvc2UgdGhlIGRyYXdlci4gKi9cbiAgY2xvc2UoKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGUoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGlzIGRyYXdlci5cbiAgICogQHBhcmFtIGlzT3BlbiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIGJlIG9wZW4uXG4gICAqIEBwYXJhbSBvcGVuZWRWaWEgV2hldGhlciB0aGUgZHJhd2VyIHdhcyBvcGVuZWQgYnkgYSBrZXkgcHJlc3MsIG1vdXNlIGNsaWNrIG9yIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqIFVzZWQgZm9yIGZvY3VzIG1hbmFnZW1lbnQgYWZ0ZXIgdGhlIHNpZGVuYXYgaXMgY2xvc2VkLlxuICAgKi9cbiAgdG9nZ2xlKGlzT3BlbjogYm9vbGVhbiA9ICF0aGlzLm9wZW5lZCwgb3BlbmVkVmlhOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJyk6XG4gICAgUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcblxuICAgIHRoaXMuX29wZW5lZCA9IGlzT3BlbjtcblxuICAgIGlmIChpc09wZW4pIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gdGhpcy5fZW5hYmxlQW5pbWF0aW9ucyA/ICdvcGVuJyA6ICdvcGVuLWluc3RhbnQnO1xuICAgICAgdGhpcy5fb3BlbmVkVmlhID0gb3BlbmVkVmlhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgICAgIHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wZW4gPT4gcmVzb2x2ZShvcGVuID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IF93aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgPyAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApIDogMDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBmb2N1cyB0cmFwLiAqL1xuICBwcml2YXRlIF91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICAvLyBUaGUgZm9jdXMgdHJhcCBpcyBvbmx5IGVuYWJsZWQgd2hlbiB0aGUgZHJhd2VyIGlzIG9wZW4gaW4gYW55IG1vZGUgb3RoZXIgdGhhbiBzaWRlLlxuICAgICAgdGhpcy5fZm9jdXNUcmFwLmVuYWJsZWQgPSB0aGlzLm9wZW5lZCAmJiB0aGlzLm1vZGUgIT09ICdzaWRlJztcbiAgICB9XG4gIH1cblxuICAvLyBXZSBoYXZlIHRvIHVzZSBhIGBIb3N0TGlzdGVuZXJgIGhlcmUgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgLy8gSW4gSXZ5IHRoZSBgaG9zdGAgYmluZGluZ3Mgd2lsbCBiZSBtZXJnZWQgd2hlbiB0aGlzIGNsYXNzIGlzIGV4dGVuZGVkLCB3aGVyZWFzIGluXG4gIC8vIFZpZXdFbmdpbmUgdGhleSdyZSBvdmVyd3JpdHRlbi5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG1vdmUgdGhpcyBiYWNrIGludG8gYGhvc3RgIG9uY2UgSXZ5IGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RMaXN0ZW5lcignQHRyYW5zZm9ybS5zdGFydCcsIFsnJGV2ZW50J10pXG4gIF9hbmltYXRpb25TdGFydExpc3RlbmVyKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQubmV4dChldmVudCk7XG4gIH1cblxuICAvLyBXZSBoYXZlIHRvIHVzZSBhIGBIb3N0TGlzdGVuZXJgIGhlcmUgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgLy8gSW4gSXZ5IHRoZSBgaG9zdGAgYmluZGluZ3Mgd2lsbCBiZSBtZXJnZWQgd2hlbiB0aGlzIGNsYXNzIGlzIGV4dGVuZGVkLCB3aGVyZWFzIGluXG4gIC8vIFZpZXdFbmdpbmUgdGhleSdyZSBvdmVyd3JpdHRlbi5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG1vdmUgdGhpcyBiYWNrIGludG8gYGhvc3RgIG9uY2UgSXZ5IGlzIHR1cm5lZCBvbiBieSBkZWZhdWx0LlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1kZWNvcmF0b3ItaW4tY29uY3JldGVcbiAgQEhvc3RMaXN0ZW5lcignQHRyYW5zZm9ybS5kb25lJywgWyckZXZlbnQnXSlcbiAgX2FuaW1hdGlvbkRvbmVMaXN0ZW5lcihldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25FbmQubmV4dChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsb3NlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvRm9jdXM6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wZW5lZDogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogYDxtYXQtZHJhd2VyLWNvbnRhaW5lcj5gIGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIG9uZSBvciB0d28gYDxtYXQtZHJhd2VyPmBzIHRoYXQgdmFsaWRhdGVzIHRoZSBzdGF0ZSBpbnRlcm5hbGx5XG4gKiBhbmQgY29vcmRpbmF0ZXMgdGhlIGJhY2tkcm9wIGFuZCBjb250ZW50IHN0eWxpbmcuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXJDb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkcmF3ZXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfRFJBV0VSX0NPTlRBSU5FUixcbiAgICB1c2VFeGlzdGluZzogTWF0RHJhd2VyQ29udGFpbmVyXG4gIH1dXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIC8qKiBBbGwgZHJhd2VycyBpbiB0aGUgY29udGFpbmVyLiBJbmNsdWRlcyBkcmF3ZXJzIGZyb20gaW5zaWRlIG5lc3RlZCBjb250YWluZXJzLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdERyYXdlciwge1xuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkZXNjZW5kYW50czogdHJ1ZWAsIGJlY2F1c2UgSXZ5IHdpbGwgbm8gbG9uZ2VyIG1hdGNoXG4gICAgLy8gaW5kaXJlY3QgZGVzY2VuZGFudHMgaWYgaXQncyBsZWZ0IGFzIGZhbHNlLlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlXG4gIH0pXG4gIF9hbGxEcmF3ZXJzOiBRdWVyeUxpc3Q8TWF0RHJhd2VyPjtcblxuICAvKiogRHJhd2VycyB0aGF0IGJlbG9uZyB0byB0aGlzIGNvbnRhaW5lci4gKi9cbiAgX2RyYXdlcnMgPSBuZXcgUXVlcnlMaXN0PE1hdERyYXdlcj4oKTtcblxuICBAQ29udGVudENoaWxkKE1hdERyYXdlckNvbnRlbnQpIF9jb250ZW50OiBNYXREcmF3ZXJDb250ZW50O1xuICBAVmlld0NoaWxkKE1hdERyYXdlckNvbnRlbnQpIF91c2VyQ29udGVudDogTWF0RHJhd2VyQ29udGVudDtcblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgc3RhcnRgIHBvc2l0aW9uLiAqL1xuICBnZXQgc3RhcnQoKTogTWF0RHJhd2VyIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zdGFydDsgfVxuXG4gIC8qKiBUaGUgZHJhd2VyIGNoaWxkIHdpdGggdGhlIGBlbmRgIHBvc2l0aW9uLiAqL1xuICBnZXQgZW5kKCk6IE1hdERyYXdlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fZW5kOyB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXV0b21hdGljYWxseSByZXNpemUgdGhlIGNvbnRhaW5lciB3aGVuZXZlclxuICAgKiB0aGUgc2l6ZSBvZiBhbnkgb2YgaXRzIGRyYXdlcnMgY2hhbmdlcy5cbiAgICpcbiAgICogKipVc2UgYXQgeW91ciBvd24gcmlzayEqKiBFbmFibGluZyB0aGlzIG9wdGlvbiBjYW4gY2F1c2UgbGF5b3V0IHRocmFzaGluZyBieSBtZWFzdXJpbmdcbiAgICogdGhlIGRyYXdlcnMgb24gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS4gQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdmlhIHRoZVxuICAgKiBgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvc2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9zaXplOyB9XG4gIHNldCBhdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9hdXRvc2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfYXV0b3NpemU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBjb250YWluZXIgc2hvdWxkIGhhdmUgYSBiYWNrZHJvcCB3aGlsZSBvbmUgb2YgdGhlIHNpZGVuYXZzIGlzIG9wZW4uXG4gICAqIElmIGV4cGxpY2l0bHkgc2V0IHRvIGB0cnVlYCwgdGhlIGJhY2tkcm9wIHdpbGwgYmUgZW5hYmxlZCBmb3IgZHJhd2VycyBpbiB0aGUgYHNpZGVgXG4gICAqIG1vZGUgYXMgd2VsbC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpIHtcbiAgICBpZiAodGhpcy5fYmFja2Ryb3BPdmVycmlkZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gIXRoaXMuX3N0YXJ0IHx8IHRoaXMuX3N0YXJ0Lm1vZGUgIT09ICdzaWRlJyB8fCAhdGhpcy5fZW5kIHx8IHRoaXMuX2VuZC5tb2RlICE9PSAnc2lkZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGU7XG4gIH1cbiAgc2V0IGhhc0JhY2tkcm9wKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIF9iYWNrZHJvcE92ZXJyaWRlOiBib29sZWFuIHwgbnVsbDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgYmFja2Ryb3AgaXMgY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGJhY2tkcm9wQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogVGhlIGRyYXdlciBhdCB0aGUgc3RhcnQvZW5kIHBvc2l0aW9uLCBpbmRlcGVuZGVudCBvZiBkaXJlY3Rpb24uICovXG4gIHByaXZhdGUgX3N0YXJ0OiBNYXREcmF3ZXIgfCBudWxsO1xuICBwcml2YXRlIF9lbmQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBkcmF3ZXIgYXQgdGhlIGxlZnQvcmlnaHQuIFdoZW4gZGlyZWN0aW9uIGNoYW5nZXMsIHRoZXNlIHdpbGwgY2hhbmdlIGFzIHdlbGwuXG4gICAqIFRoZXkncmUgdXNlZCBhcyBhbGlhc2VzIGZvciB0aGUgYWJvdmUgdG8gc2V0IHRoZSBsZWZ0L3JpZ2h0IHN0eWxlIHByb3Blcmx5LlxuICAgKiBJbiBMVFIsIF9sZWZ0ID09IF9zdGFydCBhbmQgX3JpZ2h0ID09IF9lbmQuXG4gICAqIEluIFJUTCwgX2xlZnQgPT0gX2VuZCBhbmQgX3JpZ2h0ID09IF9zdGFydC5cbiAgICovXG4gIHByaXZhdGUgX2xlZnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX3JpZ2h0OiBNYXREcmF3ZXIgfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyBvbiBldmVyeSBuZ0RvQ2hlY2suIFVzZWQgZm9yIGRlYm91bmNpbmcgcmVmbG93cy4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZG9DaGVja1N1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBNYXJnaW5zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGNvbnRlbnQuIFRoZXNlIGFyZSB1c2VkIHRvIHB1c2ggLyBzaHJpbmsgdGhlIGRyYXdlciBjb250ZW50IHdoZW4gYVxuICAgKiBkcmF3ZXIgaXMgb3Blbi4gV2UgdXNlIG1hcmdpbiByYXRoZXIgdGhhbiB0cmFuc2Zvcm0gZXZlbiBmb3IgcHVzaCBtb2RlIGJlY2F1c2UgdHJhbnNmb3JtIGJyZWFrc1xuICAgKiBmaXhlZCBwb3NpdGlvbiBlbGVtZW50cyBpbnNpZGUgb2YgdGhlIHRyYW5zZm9ybWVkIGVsZW1lbnQuXG4gICAqL1xuICBfY29udGVudE1hcmdpbnM6IHtsZWZ0OiBudW1iZXJ8bnVsbCwgcmlnaHQ6IG51bWJlcnxudWxsfSA9IHtsZWZ0OiBudWxsLCByaWdodDogbnVsbH07XG5cbiAgcmVhZG9ubHkgX2NvbnRlbnRNYXJnaW5DaGFuZ2VzID0gbmV3IFN1YmplY3Q8e2xlZnQ6IG51bWJlcnxudWxsLCByaWdodDogbnVtYmVyfG51bGx9PigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIENka1Njcm9sbGFibGUgaW5zdGFuY2UgdGhhdCB3cmFwcyB0aGUgc2Nyb2xsYWJsZSBjb250ZW50LiAqL1xuICBnZXQgc2Nyb2xsYWJsZSgpOiBDZGtTY3JvbGxhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlckNvbnRlbnQgfHwgdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSkgZGVmYXVsdEF1dG9zaXplID0gZmFsc2UsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG5cbiAgICAvLyBJZiBhIGBEaXJgIGRpcmVjdGl2ZSBleGlzdHMgdXAgdGhlIHRyZWUsIGxpc3RlbiBkaXJlY3Rpb24gY2hhbmdlc1xuICAgIC8vIGFuZCB1cGRhdGUgdGhlIGxlZnQvcmlnaHQgcHJvcGVydGllcyB0byBwb2ludCB0byB0aGUgcHJvcGVyIHN0YXJ0L2VuZC5cbiAgICBpZiAoX2Rpcikge1xuICAgICAgX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBtaW5pbXVtIHdpZHRoIG9mIHRoZSBzaWRlbmF2IGRlcGVuZHMgb24gdGhlIHZpZXdwb3J0IHdpZHRoLFxuICAgIC8vIHdlIG5lZWQgdG8gcmVjb21wdXRlIHRoZSBtYXJnaW5zIGlmIHRoZSB2aWV3cG9ydCBjaGFuZ2VzLlxuICAgIHZpZXdwb3J0UnVsZXIuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkpO1xuXG4gICAgdGhpcy5fYXV0b3NpemUgPSBkZWZhdWx0QXV0b3NpemU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fYWxsRHJhd2Vycy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsRHJhd2VycyksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoZHJhd2VyOiBRdWVyeUxpc3Q8TWF0RHJhd2VyPikgPT4ge1xuICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBSZW1vdmUgYF9jb250YWluZXJgIGNoZWNrIG9uY2UgY29udGFpbmVyIHBhcmFtZXRlciBpcyByZXF1aXJlZC5cbiAgICAgICAgdGhpcy5fZHJhd2Vycy5yZXNldChkcmF3ZXIuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uX2NvbnRhaW5lciB8fCBpdGVtLl9jb250YWluZXIgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZHJhd2Vycy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fZHJhd2Vycy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG5cbiAgICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaCgoZHJhd2VyOiBNYXREcmF3ZXIpID0+IHtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJQb3NpdGlvbihkcmF3ZXIpO1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlck1vZGUoZHJhd2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuX2RyYXdlcnMubGVuZ3RoIHx8XG4gICAgICAgICAgdGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSB8fFxuICAgICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpKSB7XG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9kb0NoZWNrU3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDEwKSwgLy8gQXJiaXRyYXJ5IGRlYm91bmNlIHRpbWUsIGxlc3MgdGhhbiBhIGZyYW1lIGF0IDYwZnBzXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZHJhd2Vycy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgb3BlbmAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5vcGVuKCkpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBjbG9zZWAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIuY2xvc2UoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIGFuZCB1cGRhdGVzIHRoZSBpbmxpbmUgc3R5bGVzIGZvciB0aGUgY29udGVudC4gTm90ZSB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWRcbiAgICogc3BhcmluZ2x5LCBiZWNhdXNlIGl0IGNhdXNlcyBhIHJlZmxvdy5cbiAgICovXG4gIHVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkge1xuICAgIC8vIDEuIEZvciBkcmF3ZXJzIGluIGBvdmVyYCBtb2RlLCB0aGV5IGRvbid0IGFmZmVjdCB0aGUgY29udGVudC5cbiAgICAvLyAyLiBGb3IgZHJhd2VycyBpbiBgc2lkZWAgbW9kZSB0aGV5IHNob3VsZCBzaHJpbmsgdGhlIGNvbnRlbnQuIFdlIGRvIHRoaXMgYnkgYWRkaW5nIHRvIHRoZVxuICAgIC8vICAgIGxlZnQgbWFyZ2luIChmb3IgbGVmdCBkcmF3ZXIpIG9yIHJpZ2h0IG1hcmdpbiAoZm9yIHJpZ2h0IHRoZSBkcmF3ZXIpLlxuICAgIC8vIDMuIEZvciBkcmF3ZXJzIGluIGBwdXNoYCBtb2RlIHRoZSBzaG91bGQgc2hpZnQgdGhlIGNvbnRlbnQgd2l0aG91dCByZXNpemluZyBpdC4gV2UgZG8gdGhpcyBieVxuICAgIC8vICAgIGFkZGluZyB0byB0aGUgbGVmdCBvciByaWdodCBtYXJnaW4gYW5kIHNpbXVsdGFuZW91c2x5IHN1YnRyYWN0aW5nIHRoZSBzYW1lIGFtb3VudCBvZlxuICAgIC8vICAgIG1hcmdpbiBmcm9tIHRoZSBvdGhlciBzaWRlLlxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBsZXQgcmlnaHQgPSAwO1xuXG4gICAgaWYgKHRoaXMuX2xlZnQgJiYgdGhpcy5fbGVmdC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIGxlZnQgKz0gdGhpcy5fbGVmdC5fd2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2xlZnQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9sZWZ0Ll93aWR0aDtcbiAgICAgICAgbGVmdCArPSB3aWR0aDtcbiAgICAgICAgcmlnaHQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JpZ2h0ICYmIHRoaXMuX3JpZ2h0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIHJpZ2h0ICs9IHRoaXMuX3JpZ2h0Ll93aWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmlnaHQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9yaWdodC5fd2lkdGg7XG4gICAgICAgIHJpZ2h0ICs9IHdpZHRoO1xuICAgICAgICBsZWZ0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIGVpdGhlciBgcmlnaHRgIG9yIGBsZWZ0YCBpcyB6ZXJvLCBkb24ndCBzZXQgYSBzdHlsZSB0byB0aGUgZWxlbWVudC4gVGhpc1xuICAgIC8vIGFsbG93cyB1c2VycyB0byBzcGVjaWZ5IGEgY3VzdG9tIHNpemUgdmlhIENTUyBjbGFzcyBpbiBTU1Igc2NlbmFyaW9zIHdoZXJlIHRoZVxuICAgIC8vIG1lYXN1cmVkIHdpZHRocyB3aWxsIGFsd2F5cyBiZSB6ZXJvLiBOb3RlIHRoYXQgd2UgcmVzZXQgdG8gYG51bGxgIGhlcmUsIHJhdGhlclxuICAgIC8vIHRoYW4gYmVsb3csIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IHRoZSB0eXBlcyBpbiB0aGUgYGlmYCBiZWxvdyBhcmUgY29uc2lzdGVudC5cbiAgICBsZWZ0ID0gbGVmdCB8fCBudWxsITtcbiAgICByaWdodCA9IHJpZ2h0IHx8IG51bGwhO1xuXG4gICAgaWYgKGxlZnQgIT09IHRoaXMuX2NvbnRlbnRNYXJnaW5zLmxlZnQgfHwgcmlnaHQgIT09IHRoaXMuX2NvbnRlbnRNYXJnaW5zLnJpZ2h0KSB7XG4gICAgICB0aGlzLl9jb250ZW50TWFyZ2lucyA9IHtsZWZ0LCByaWdodH07XG5cbiAgICAgIC8vIFB1bGwgYmFjayBpbnRvIHRoZSBOZ1pvbmUgc2luY2UgaW4gc29tZSBjYXNlcyB3ZSBjb3VsZCBiZSBvdXRzaWRlLiBXZSBuZWVkIHRvIGJlIGNhcmVmdWxcbiAgICAgIC8vIHRvIGRvIGl0IG9ubHkgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCwgb3RoZXJ3aXNlIHdlIGNhbiBlbmQgdXAgaGl0dGluZyB0aGUgem9uZSB0b28gb2Z0ZW4uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLm5leHQodGhpcy5fY29udGVudE1hcmdpbnMpKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgLy8gSWYgdXNlcnMgb3B0ZWQgaW50byBhdXRvc2l6aW5nLCBkbyBhIGNoZWNrIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuXG4gICAgaWYgKHRoaXMuX2F1dG9zaXplICYmIHRoaXMuX2lzUHVzaGVkKCkpIHtcbiAgICAgIC8vIFJ1biBvdXRzaWRlIHRoZSBOZ1pvbmUsIG90aGVyd2lzZSB0aGUgZGVib3VuY2VyIHdpbGwgdGhyb3cgdXMgaW50byBhbiBpbmZpbml0ZSBsb29wLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuX2RvQ2hlY2tTdWJqZWN0Lm5leHQoKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gZHJhd2VyIGV2ZW50cyBpbiBvcmRlciB0byBzZXQgYSBjbGFzcyBvbiB0aGUgbWFpbiBjb250YWluZXIgZWxlbWVudCB3aGVuIHRoZVxuICAgKiBkcmF3ZXIgaXMgb3BlbiBhbmQgdGhlIGJhY2tkcm9wIGlzIHZpc2libGUuIFRoaXMgZW5zdXJlcyBhbnkgb3ZlcmZsb3cgb24gdGhlIGNvbnRhaW5lciBlbGVtZW50XG4gICAqIGlzIHByb3Blcmx5IGhpZGRlbi5cbiAgICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyVG9nZ2xlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgZHJhd2VyLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4gZXZlbnQuZnJvbVN0YXRlICE9PSBldmVudC50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMpLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgIC8vIFNldCB0aGUgdHJhbnNpdGlvbiBjbGFzcyBvbiB0aGUgY29udGFpbmVyIHNvIHRoYXQgdGhlIGFuaW1hdGlvbnMgb2NjdXIuIFRoaXMgc2hvdWxkIG5vdFxuICAgICAgLy8gYmUgc2V0IGluaXRpYWxseSBiZWNhdXNlIGFuaW1hdGlvbnMgc2hvdWxkIG9ubHkgYmUgdHJpZ2dlcmVkIHZpYSBhIGNoYW5nZSBpbiBzdGF0ZS5cbiAgICAgIGlmIChldmVudC50b1N0YXRlICE9PSAnb3Blbi1pbnN0YW50JyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtZHJhd2VyLXRyYW5zaXRpb24nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoZHJhd2VyLm1vZGUgIT09ICdzaWRlJykge1xuICAgICAgZHJhd2VyLm9wZW5lZENoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMpKS5zdWJzY3JpYmUoKCkgPT5cbiAgICAgICAgICB0aGlzLl9zZXRDb250YWluZXJDbGFzcyhkcmF3ZXIub3BlbmVkKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gZHJhd2VyIG9uUG9zaXRpb25DaGFuZ2VkIGV2ZW50IGluIG9yZGVyIHRvXG4gICAqIHJlLXZhbGlkYXRlIGRyYXdlcnMgd2hlbiB0aGUgcG9zaXRpb24gY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoIWRyYXdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBOT1RFOiBXZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkgYmVmb3JlIHZhbGlkYXRpbmcsXG4gICAgLy8gc2luY2UgYm90aCBkcmF3ZXJzIG1heSBiZSBzd2FwcGluZyBwb3NpdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICBkcmF3ZXIub25Qb3NpdGlvbkNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gZHJhd2VyIG1vZGUgc28gd2UgY2FuIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlck1vZGUoZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoZHJhd2VyKSB7XG4gICAgICBkcmF3ZXIuX21vZGVDaGFuZ2VkLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMuX2RyYXdlcnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveWVkKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlICdtYXQtZHJhd2VyLW9wZW5lZCcgY2xhc3Mgb24gdGhlIG1haW4gJ21hdC1kcmF3ZXItY29udGFpbmVyJyBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9zZXRDb250YWluZXJDbGFzcyhpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gJ21hdC1kcmF3ZXItY29udGFpbmVyLWhhcy1vcGVuJztcblxuICAgIGlmIChpc0FkZCkge1xuICAgICAgY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBzdGF0ZSBvZiB0aGUgZHJhd2VyIGNoaWxkcmVuIGNvbXBvbmVudHMuICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlRHJhd2VycygpIHtcbiAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2VuZCA9IG51bGw7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGF0IG1vc3Qgb25lIHN0YXJ0IGFuZCBvbmUgZW5kIGRyYXdlci5cbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IHtcbiAgICAgIGlmIChkcmF3ZXIucG9zaXRpb24gPT0gJ2VuZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VuZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ2VuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VuZCA9IGRyYXdlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RhcnQgPSBkcmF3ZXI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2xlZnQgPSBudWxsO1xuXG4gICAgLy8gRGV0ZWN0IGlmIHdlJ3JlIExUUiBvciBSVEwuXG4gICAgaWYgKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSB7XG4gICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5fZW5kO1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX3N0YXJ0O1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9lbmQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRhaW5lciBpcyBiZWluZyBwdXNoZWQgdG8gdGhlIHNpZGUgYnkgb25lIG9mIHRoZSBkcmF3ZXJzLiAqL1xuICBwcml2YXRlIF9pc1B1c2hlZCgpIHtcbiAgICByZXR1cm4gKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgJiYgdGhpcy5fc3RhcnQubW9kZSAhPSAnb3ZlcicpIHx8XG4gICAgICAgICAgICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSAmJiB0aGlzLl9lbmQubW9kZSAhPSAnb3ZlcicpO1xuICB9XG5cbiAgX29uQmFja2Ryb3BDbGlja2VkKCkge1xuICAgIHRoaXMuYmFja2Ryb3BDbGljay5lbWl0KCk7XG4gICAgdGhpcy5fY2xvc2VNb2RhbERyYXdlcigpO1xuICB9XG5cbiAgX2Nsb3NlTW9kYWxEcmF3ZXIoKSB7XG4gICAgLy8gQ2xvc2UgYWxsIG9wZW4gZHJhd2VycyB3aGVyZSBjbG9zaW5nIGlzIG5vdCBkaXNhYmxlZCBhbmQgdGhlIG1vZGUgaXMgbm90IGBzaWRlYC5cbiAgICBbdGhpcy5fc3RhcnQsIHRoaXMuX2VuZF1cbiAgICAgIC5maWx0ZXIoZHJhd2VyID0+IGRyYXdlciAmJiAhZHJhd2VyLmRpc2FibGVDbG9zZSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AoZHJhd2VyKSlcbiAgICAgIC5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIhLmNsb3NlKCkpO1xuICB9XG5cbiAgX2lzU2hvd2luZ0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AodGhpcy5fc3RhcnQpKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX2VuZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcjogTWF0RHJhd2VyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRyYXdlci5tb2RlICE9PSAnc2lkZScgfHwgISF0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNEcmF3ZXJPcGVuKGRyYXdlcjogTWF0RHJhd2VyIHwgbnVsbCk6IGRyYXdlciBpcyBNYXREcmF3ZXIge1xuICAgIHJldHVybiBkcmF3ZXIgIT0gbnVsbCAmJiBkcmF3ZXIub3BlbmVkO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9zaXplOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNCYWNrZHJvcDogQm9vbGVhbklucHV0O1xufVxuIl19