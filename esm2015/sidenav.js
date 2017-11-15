/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/cdk/a11y';
import '@angular/cdk/overlay';
import '@angular/common';
import '@angular/core';
import '@angular/material/core';
import '@angular/cdk/scrolling';
import '@angular/animations';
import '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import '@angular/platform-browser';
import { merge } from 'rxjs/observable/merge';
import { filter } from 'rxjs/operators/filter';
import { first } from 'rxjs/operators/first';
import { startWith } from 'rxjs/operators/startWith';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { map } from 'rxjs/operators/map';
import 'rxjs/Subject';
import 'rxjs/Observable';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Throws an exception when two MatDrawer are matching the same position.
 * @param {?} position
 * @return {?}
 */
function throwMatDuplicatedDrawerError(position) {
    throw Error(`A drawer was already declared for 'position="${position}"'`);
}
/**
 * Drawer toggle promise result.
 * @deprecated
 */
class MatDrawerToggleResult {
    /**
     * @param {?} type
     * @param {?} animationFinished
     */
    constructor(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
}
class MatDrawerContent {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _container
     */
    constructor(_changeDetectorRef, _container) {
        this._changeDetectorRef = _changeDetectorRef;
        this._container = _container;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._container._contentMargins.subscribe(margins => {
            this._margins = margins;
            this._changeDetectorRef.markForCheck();
        });
    }
}
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
class MatDrawer {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _focusMonitor
     * @param {?} _doc
     */
    constructor(_elementRef, _focusTrapFactory, _focusMonitor, _doc) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._doc = _doc;
        this.openedChange.subscribe((opened) => {
            if (opened) {
                if (this._doc) {
                    this._elementFocusedBeforeDrawerWasOpened = /** @type {?} */ (this._doc.activeElement);
                }
                if (this._isFocusTrapEnabled && this._focusTrap) {
                    this._focusTrap.focusInitialElementWhenReady();
                }
            }
            else {
                this._restoreFocus();
            }
        });
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
            this.onAlignChanged.emit();
            this.onPositionChanged.emit();
        }
    }
    /**
     * @deprecated
     * @return {?}
     */
    get align() { return this.position; }
    /**
     * @param {?} value
     * @return {?}
     */
    set align(value) { this.position = value; }
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
     * Event emitted when the drawer has been opened.
     * @return {?}
     */
    get _openedStream() {
        return this.openedChange.pipe(filter(o => o), map(() => { }));
    }
    /**
     * Event emitted when the drawer has started opening.
     * @return {?}
     */
    get openedStart() {
        return this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0), map(() => { }));
    }
    /**
     * Event emitted when the drawer has been closed.
     * @return {?}
     */
    get _closedStream() {
        return this.openedChange.pipe(filter(o => !o), map(() => { }));
    }
    /**
     * Event emitted when the drawer has started closing.
     * @return {?}
     */
    get closedStart() {
        return this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState === 'void'), map(() => { }));
    }
    /**
     * @return {?}
     */
    get _isFocusTrapEnabled() {
        // The focus trap is only enabled when the drawer is open in any mode other than side.
        return this.opened && this.mode !== 'side';
    }
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @return {?}
     */
    _restoreFocus() {
        const /** @type {?} */ activeEl = this._doc && this._doc.activeElement;
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
        this._focusTrap.enabled = this._isFocusTrapEnabled;
        this._enableAnimations = true;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /**
     * Whether the drawer is opened. We overload this because we trigger an event when it
     * starts or end.
     * @return {?}
     */
    get opened() { return this._opened; }
    /**
     * @param {?} v
     * @return {?}
     */
    set opened(v) {
        this.toggle(coerceBooleanProperty(v));
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
        if (this._focusTrap) {
            this._focusTrap.enabled = this._isFocusTrapEnabled;
        }
        // TODO(crisbeto): This promise is here for backwards-compatibility.
        // It should be removed next time we do breaking changes in the drawer.
        return new Promise(resolve => {
            this.openedChange.pipe(first()).subscribe(open => {
                resolve(new MatDrawerToggleResult(open ? 'open' : 'close', true));
            });
        });
    }
    /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    handleKeydown(event) {
        if (event.keyCode === ESCAPE && !this.disableClose) {
            this.close();
            event.stopPropagation();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onAnimationStart(event) {
        this._animationStarted.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onAnimationEnd(event) {
        const { fromState, toState } = event;
        if (toState.indexOf('open') === 0 && fromState === 'void') {
            this.openedChange.emit(true);
        }
        else if (toState === 'void' && fromState.indexOf('open') === 0) {
            this.openedChange.emit(false);
        }
    }
    /**
     * @return {?}
     */
    get _width() {
        return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
    }
}
/**
 * <mat-drawer-container> component.
 *
 * This is the parent component to one or two <mat-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
class MatDrawerContainer {
    /**
     * @param {?} _dir
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     */
    constructor(_dir, _element, _renderer, _ngZone, _changeDetectorRef) {
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => this._validateDrawers());
        }
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
     * @return {?}
     */
    ngAfterContentInit() {
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
                this._updateContentMargins();
            }
            this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    open() {
        this._drawers.forEach(drawer => drawer.open());
    }
    /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    close() {
        this._drawers.forEach(drawer => drawer.close());
    }
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerToggle(drawer) {
        drawer._animationStarted.pipe(takeUntil(this._drawers.changes), filter((event) => event.fromState !== event.toState))
            .subscribe((event) => {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant') {
                this._renderer.addClass(this._element.nativeElement, 'mat-drawer-transition');
            }
            this._updateContentMargins();
            this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            drawer.openedChange.pipe(takeUntil(this._drawers.changes)).subscribe(() => this._setContainerClass(drawer.opened));
        }
    }
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerPosition(drawer) {
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
            this._ngZone.onMicrotaskEmpty.asObservable().pipe(first()).subscribe(() => {
                this._validateDrawers();
            });
        });
    }
    /**
     * Subscribes to changes in drawer mode so we can run change detection.
     * @param {?} drawer
     * @return {?}
     */
    _watchDrawerMode(drawer) {
        if (drawer) {
            drawer._modeChanged.pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
                .subscribe(() => {
                this._updateContentMargins();
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    /**
     * Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    _setContainerClass(isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, 'mat-drawer-opened');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-drawer-opened');
        }
    }
    /**
     * Validate the state of the drawer children components.
     * @return {?}
     */
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
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
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
            .filter(drawer => drawer && !drawer.disableClose && drawer.mode !== 'side')
            .forEach(drawer => /** @type {?} */ ((drawer)).close());
    }
    /**
     * @return {?}
     */
    _isShowingBackdrop() {
        return (this._isDrawerOpen(this._start) && /** @type {?} */ ((this._start)).mode != 'side')
            || (this._isDrawerOpen(this._end) && /** @type {?} */ ((this._end)).mode != 'side');
    }
    /**
     * @param {?} drawer
     * @return {?}
     */
    _isDrawerOpen(drawer) {
        return drawer != null && drawer.opened;
    }
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     * @return {?}
     */
    _updateContentMargins() {
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        let /** @type {?} */ left = 0;
        let /** @type {?} */ right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._width;
            }
            else if (this._left.mode == 'push') {
                let /** @type {?} */ width = this._left._width;
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._width;
            }
            else if (this._right.mode == 'push') {
                let /** @type {?} */ width = this._right._width;
                right += width;
                left -= width;
            }
        }
        this._contentMargins.next({ left, right });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatSidenavContent extends MatDrawerContent {
    /**
     * @param {?} changeDetectorRef
     * @param {?} container
     */
    constructor(changeDetectorRef, container) {
        super(changeDetectorRef, container);
    }
}
class MatSidenav extends MatDrawer {
    /**
     * Whether the sidenav is fixed in the viewport.
     * @return {?}
     */
    get fixedInViewport() { return this._fixedInViewport; }
    /**
     * @param {?} value
     * @return {?}
     */
    set fixedInViewport(value) { this._fixedInViewport = coerceBooleanProperty(value); }
    /**
     * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
     * mode.
     * @return {?}
     */
    get fixedTopGap() { return this._fixedTopGap; }
    /**
     * @param {?} value
     * @return {?}
     */
    set fixedTopGap(value) { this._fixedTopGap = coerceNumberProperty(value); }
    /**
     * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
     * fixed mode.
     * @return {?}
     */
    get fixedBottomGap() { return this._fixedBottomGap; }
    /**
     * @param {?} value
     * @return {?}
     */
    set fixedBottomGap(value) { this._fixedBottomGap = coerceNumberProperty(value); }
}
class MatSidenavContainer extends MatDrawerContainer {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatSidenavModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatSidenavModule, throwMatDuplicatedDrawerError, MatDrawerToggleResult, MatDrawerContent, MatDrawer, MatDrawerContainer, MatSidenavContent, MatSidenav, MatSidenavContainer };
//# sourceMappingURL=sidenav.js.map
