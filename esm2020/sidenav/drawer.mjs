import { FocusMonitor, FocusTrapFactory, InteractivityChecker, } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, startWith, take, takeUntil, distinctUntilChanged, mapTo, } from 'rxjs/operators';
import { matDrawerAnimations } from './drawer-animations';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/bidi";
import * as i5 from "@angular/common";
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
export class MatDrawerContent extends CdkScrollable {
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
MatDrawerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawerContent, deps: [{ token: i0.ChangeDetectorRef }, { token: forwardRef(() => MatDrawerContainer) }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatDrawerContent, selector: "mat-drawer-content", host: { properties: { "style.margin-left.px": "_container._contentMargins.left", "style.margin-right.px": "_container._contentMargins.right" }, classAttribute: "mat-drawer-content" }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawerContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-drawer-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content',
                        '[style.margin-left.px]': '_container._contentMargins.left',
                        '[style.margin-right.px]': '_container._contentMargins.right',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: MatDrawerContainer, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatDrawerContainer)]
                }] }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.NgZone }]; } });
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
export class MatDrawer {
    constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _interactivityChecker, _doc, _container) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._interactivityChecker = _interactivityChecker;
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
        this._animationState = 'void';
        /** Event emitted when the drawer open state is changed. */
        this.openedChange = 
        // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
        new EventEmitter(/* isAsync */ true);
        /** Event emitted when the drawer has been opened. */
        this._openedStream = this.openedChange.pipe(filter(o => o), map(() => { }));
        /** Event emitted when the drawer has started opening. */
        this.openedStart = this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0), mapTo(undefined));
        /** Event emitted when the drawer has been closed. */
        this._closedStream = this.openedChange.pipe(filter(o => !o), map(() => { }));
        /** Event emitted when the drawer has started closing. */
        this.closedStart = this._animationStarted.pipe(filter(e => e.fromState !== e.toState && e.toState === 'void'), mapTo(undefined));
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
            else if (this._isFocusWithinDrawer()) {
                this._restoreFocus(this._openedVia || 'program');
            }
        });
        /**
         * Listen to `keydown` events outside the zone so that change detection is not run every
         * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
         * and we don't have close disabled.
         */
        this._ngZone.runOutsideAngular(() => {
            fromEvent(this._elementRef.nativeElement, 'keydown')
                .pipe(filter(event => {
                return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
            }), takeUntil(this._destroyed))
                .subscribe(event => this._ngZone.run(() => {
                this.close();
                event.stopPropagation();
                event.preventDefault();
            }));
        });
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._animationEnd
            .pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))
            .subscribe((event) => {
            const { fromState, toState } = event;
            if ((toState.indexOf('open') === 0 && fromState === 'void') ||
                (toState === 'void' && fromState.indexOf('open') === 0)) {
                this.openedChange.emit(this._opened);
            }
        });
    }
    /** The side that the drawer is attached to. */
    get position() {
        return this._position;
    }
    set position(value) {
        // Make sure we have a valid value.
        value = value === 'end' ? 'end' : 'start';
        if (value != this._position) {
            this._position = value;
            this.onPositionChanged.emit();
        }
    }
    /** Mode of the drawer; one of 'over', 'push' or 'side'. */
    get mode() {
        return this._mode;
    }
    set mode(value) {
        this._mode = value;
        this._updateFocusTrapState();
        this._modeChanged.next();
    }
    /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
    get disableClose() {
        return this._disableClose;
    }
    set disableClose(value) {
        this._disableClose = coerceBooleanProperty(value);
    }
    /**
     * Whether the drawer should focus the first focusable element automatically when opened.
     * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
     * enabled, focus will be moved into the sidenav in `side` mode as well.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or AutoFocusTarget
     * instead.
     */
    get autoFocus() {
        const value = this._autoFocus;
        // Note that usually we don't allow autoFocus to be set to `first-tabbable` in `side` mode,
        // because we don't know how the sidenav is being used, but in some cases it still makes
        // sense to do it. The consumer can explicitly set `autoFocus`.
        if (value == null) {
            if (this.mode === 'side') {
                return 'dialog';
            }
            else {
                return 'first-tabbable';
            }
        }
        return value;
    }
    set autoFocus(value) {
        if (value === 'true' || value === 'false') {
            value = coerceBooleanProperty(value);
        }
        this._autoFocus = value;
    }
    /**
     * Whether the drawer is opened. We overload this because we trigger an event when it
     * starts or end.
     */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        this.toggle(coerceBooleanProperty(value));
    }
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
            element.tabIndex = -1;
            // The tabindex attribute should be removed to avoid navigating to that element again
            this._ngZone.runOutsideAngular(() => {
                element.addEventListener('blur', () => element.removeAttribute('tabindex'));
                element.addEventListener('mousedown', () => element.removeAttribute('tabindex'));
            });
        }
        element.focus(options);
    }
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    _focusByCssSelector(selector, options) {
        let elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
            this._forceFocus(elementToFocus, options);
        }
    }
    /**
     * Moves focus into the drawer. Note that this works even if
     * the focus trap is disabled in `side` mode.
     */
    _takeFocus() {
        if (!this._focusTrap) {
            return;
        }
        const element = this._elementRef.nativeElement;
        // When autoFocus is not on the sidenav, if the element cannot be focused or does
        // not exist, focus the sidenav itself so the keyboard navigation still works.
        // We need to check that `focus` is a function due to Universal.
        switch (this.autoFocus) {
            case false:
            case 'dialog':
                return;
            case true:
            case 'first-tabbable':
                this._focusTrap.focusInitialElementWhenReady().then(hasMovedFocus => {
                    if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
                        element.focus();
                    }
                });
                break;
            case 'first-heading':
                this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
                break;
            default:
                this._focusByCssSelector(this.autoFocus);
                break;
        }
    }
    /**
     * Restores focus to the element that was originally focused when the drawer opened.
     * If no element was focused at that time, the focus will be restored to the drawer.
     */
    _restoreFocus(focusOrigin) {
        if (this.autoFocus === 'dialog') {
            return;
        }
        if (this._elementFocusedBeforeDrawerWasOpened) {
            this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
        }
        else {
            this._elementRef.nativeElement.blur();
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
    }
    /** Whether focus is currently within the drawer. */
    _isFocusWithinDrawer() {
        const activeEl = this._doc?.activeElement;
        return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
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
    /** Closes the drawer with context that the backdrop was clicked. */
    _closeViaBackdropClick() {
        // If the drawer is closed upon a backdrop click, we always want to restore focus. We
        // don't need to check whether focus is currently in the drawer, as clicking on the
        // backdrop causes blurs the active element.
        return this._setOpen(/* isOpen */ false, /* restoreFocus */ true, 'mouse');
    }
    /**
     * Toggle this drawer.
     * @param isOpen Whether the drawer should be open.
     * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     */
    toggle(isOpen = !this.opened, openedVia) {
        // If the focus is currently inside the drawer content and we are closing the drawer,
        // restore the focus to the initially focused element (when the drawer opened).
        if (isOpen && openedVia) {
            this._openedVia = openedVia;
        }
        const result = this._setOpen(isOpen, 
        /* restoreFocus */ !isOpen && this._isFocusWithinDrawer(), this._openedVia || 'program');
        if (!isOpen) {
            this._openedVia = null;
        }
        return result;
    }
    /**
     * Toggles the opened state of the drawer.
     * @param isOpen Whether the drawer should open or close.
     * @param restoreFocus Whether focus should be restored on close.
     * @param focusOrigin Origin to use when restoring focus.
     */
    _setOpen(isOpen, restoreFocus, focusOrigin) {
        this._opened = isOpen;
        if (isOpen) {
            this._animationState = this._enableAnimations ? 'open' : 'open-instant';
        }
        else {
            this._animationState = 'void';
            if (restoreFocus) {
                this._restoreFocus(focusOrigin);
            }
        }
        this._updateFocusTrapState();
        return new Promise(resolve => {
            this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
        });
    }
    _getWidth() {
        return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
    }
    /** Updates the enabled state of the focus trap. */
    _updateFocusTrapState() {
        if (this._focusTrap) {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            this._focusTrap.enabled = this.opened && this.mode !== 'side';
        }
    }
}
MatDrawer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawer, deps: [{ token: i0.ElementRef }, { token: i2.FocusTrapFactory }, { token: i2.FocusMonitor }, { token: i3.Platform }, { token: i0.NgZone }, { token: i2.InteractivityChecker }, { token: DOCUMENT, optional: true }, { token: MAT_DRAWER_CONTAINER, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatDrawer, selector: "mat-drawer", inputs: { position: "position", mode: "mode", disableClose: "disableClose", autoFocus: "autoFocus", opened: "opened" }, outputs: { openedChange: "openedChange", _openedStream: "opened", openedStart: "openedStart", _closedStream: "closed", closedStart: "closedStart", onPositionChanged: "positionChanged" }, host: { attributes: { "tabIndex": "-1" }, listeners: { "@transform.start": "_animationStarted.next($event)", "@transform.done": "_animationEnd.next($event)" }, properties: { "attr.align": "null", "class.mat-drawer-end": "position === \"end\"", "class.mat-drawer-over": "mode === \"over\"", "class.mat-drawer-push": "mode === \"push\"", "class.mat-drawer-side": "mode === \"side\"", "class.mat-drawer-opened": "opened", "@transform": "_animationState" }, classAttribute: "mat-drawer" }, exportAs: ["matDrawer"], ngImport: i0, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable>\r\n  <ng-content></ng-content>\r\n</div>\r\n", directives: [{ type: i1.CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], animations: [matDrawerAnimations.transformDrawer], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer', exportAs: 'matDrawer', animations: [matDrawerAnimations.transformDrawer], host: {
                        'class': 'mat-drawer',
                        // must prevent the browser from aligning text based on value
                        '[attr.align]': 'null',
                        '[class.mat-drawer-end]': 'position === "end"',
                        '[class.mat-drawer-over]': 'mode === "over"',
                        '[class.mat-drawer-push]': 'mode === "push"',
                        '[class.mat-drawer-side]': 'mode === "side"',
                        '[class.mat-drawer-opened]': 'opened',
                        'tabIndex': '-1',
                        '[@transform]': '_animationState',
                        '(@transform.start)': '_animationStarted.next($event)',
                        '(@transform.done)': '_animationEnd.next($event)',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable>\r\n  <ng-content></ng-content>\r\n</div>\r\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i2.FocusTrapFactory }, { type: i2.FocusMonitor }, { type: i3.Platform }, { type: i0.NgZone }, { type: i2.InteractivityChecker }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: MatDrawerContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DRAWER_CONTAINER]
                }] }]; }, propDecorators: { position: [{
                type: Input
            }], mode: [{
                type: Input
            }], disableClose: [{
                type: Input
            }], autoFocus: [{
                type: Input
            }], opened: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], _openedStream: [{
                type: Output,
                args: ['opened']
            }], openedStart: [{
                type: Output
            }], _closedStream: [{
                type: Output,
                args: ['closed']
            }], closedStart: [{
                type: Output
            }], onPositionChanged: [{
                type: Output,
                args: ['positionChanged']
            }] } });
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export class MatDrawerContainer {
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
        viewportRuler
            .change()
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => this.updateContentMargins());
        this._autosize = defaultAutosize;
    }
    /** The drawer child with the `start` position. */
    get start() {
        return this._start;
    }
    /** The drawer child with the `end` position. */
    get end() {
        return this._end;
    }
    /**
     * Whether to automatically resize the container whenever
     * the size of any of its drawers changes.
     *
     * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
     * the drawers on every change detection cycle. Can be configured globally via the
     * `MAT_DRAWER_DEFAULT_AUTOSIZE` token.
     */
    get autosize() {
        return this._autosize;
    }
    set autosize(value) {
        this._autosize = coerceBooleanProperty(value);
    }
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
        // Avoid hitting the NgZone through the debounce timeout.
        this._ngZone.runOutsideAngular(() => {
            this._doCheckSubject
                .pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
            takeUntil(this._destroyed))
                .subscribe(() => this.updateContentMargins());
        });
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
                left += this._left._getWidth();
            }
            else if (this._left.mode == 'push') {
                const width = this._left._getWidth();
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._getWidth();
            }
            else if (this._right.mode == 'push') {
                const width = this._right._getWidth();
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
        drawer._animationStarted
            .pipe(filter((event) => event.fromState !== event.toState), takeUntil(this._drawers.changes))
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
            drawer.openedChange
                .pipe(takeUntil(this._drawers.changes))
                .subscribe(() => this._setContainerClass(drawer.opened));
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
            this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
                this._validateDrawers();
            });
        });
    }
    /** Subscribes to changes in drawer mode so we can run change detection. */
    _watchDrawerMode(drawer) {
        if (drawer) {
            drawer._modeChanged
                .pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
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
                if (this._end != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throwMatDuplicatedDrawerError('end');
                }
                this._end = drawer;
            }
            else {
                if (this._start != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        return ((this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
            (this._isDrawerOpen(this._end) && this._end.mode != 'over'));
    }
    _onBackdropClicked() {
        this.backdropClick.emit();
        this._closeModalDrawersViaBackdrop();
    }
    _closeModalDrawersViaBackdrop() {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(drawer => drawer && !drawer.disableClose && this._canHaveBackdrop(drawer))
            .forEach(drawer => drawer._closeViaBackdropClick());
    }
    _isShowingBackdrop() {
        return ((this._isDrawerOpen(this._start) && this._canHaveBackdrop(this._start)) ||
            (this._isDrawerOpen(this._end) && this._canHaveBackdrop(this._end)));
    }
    _canHaveBackdrop(drawer) {
        return drawer.mode !== 'side' || !!this._backdropOverride;
    }
    _isDrawerOpen(drawer) {
        return drawer != null && drawer.opened;
    }
}
MatDrawerContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawerContainer, deps: [{ token: i4.Directionality, optional: true }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: MAT_DRAWER_DEFAULT_AUTOSIZE }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatDrawerContainer, selector: "mat-drawer-container", inputs: { autosize: "autosize", hasBackdrop: "hasBackdrop" }, outputs: { backdropClick: "backdropClick" }, host: { properties: { "class.mat-drawer-container-explicit-backdrop": "_backdropOverride" }, classAttribute: "mat-drawer-container" }, providers: [
        {
            provide: MAT_DRAWER_CONTAINER,
            useExisting: MatDrawerContainer,
        },
    ], queries: [{ propertyName: "_content", first: true, predicate: MatDrawerContent, descendants: true }, { propertyName: "_allDrawers", predicate: MatDrawer, descendants: true }], viewQueries: [{ propertyName: "_userContent", first: true, predicate: MatDrawerContent, descendants: true }], exportAs: ["matDrawerContainer"], ngImport: i0, template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"], components: [{ type: MatDrawerContent, selector: "mat-drawer-content" }], directives: [{ type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatDrawerContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer-container', exportAs: 'matDrawerContainer', host: {
                        'class': 'mat-drawer-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatDrawerContainer,
                        },
                    ], template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"] }]
        }], ctorParameters: function () { return [{ type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DRAWER_DEFAULT_AUTOSIZE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _allDrawers: [{
                type: ContentChildren,
                args: [MatDrawer, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }], _content: [{
                type: ContentChild,
                args: [MatDrawerContent]
            }], _userContent: [{
                type: ViewChild,
                args: [MatDrawerContent]
            }], autosize: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }], backdropClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUNMLFlBQVksRUFHWixnQkFBZ0IsRUFDaEIsb0JBQW9CLEdBQ3JCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sR0FBRyxFQUNILFNBQVMsRUFDVCxJQUFJLEVBQ0osU0FBUyxFQUNULG9CQUFvQixFQUNwQixLQUFLLEdBQ04sTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7OztBQUUzRTs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsNkJBQTZCLENBQUMsUUFBZ0I7SUFDNUQsTUFBTSxLQUFLLENBQUMsZ0RBQWdELFFBQVEsSUFBSSxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQVdELG9FQUFvRTtBQUNwRSxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLGNBQWMsQ0FDM0QsNkJBQTZCLEVBQzdCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLG1DQUFtQztDQUM3QyxDQUNGLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRS9FLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DO0lBQ2pELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWFELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxhQUFhO0lBQ2pELFlBQ1Usa0JBQXFDLEVBQ1EsVUFBOEIsRUFDbkYsVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLE1BQWM7UUFFZCxLQUFLLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTnBDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDUSxlQUFVLEdBQVYsVUFBVSxDQUFvQjtJQU1yRixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs2R0FmVSxnQkFBZ0IsbURBR2pCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpR0FIbkMsZ0JBQWdCLHlRQVRqQiwyQkFBMkI7MkZBUzFCLGdCQUFnQjtrQkFYNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLG9CQUFvQjt3QkFDN0Isd0JBQXdCLEVBQUUsaUNBQWlDO3dCQUMzRCx5QkFBeUIsRUFBRSxrQ0FBa0M7cUJBQzlEO29CQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7MEZBSW9FLGtCQUFrQjswQkFBbEYsTUFBTTsyQkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7O0FBZWhEOztHQUVHO0FBdUJILE1BQU0sT0FBTyxTQUFTO0lBa0pwQixZQUNVLFdBQW9DLEVBQ3BDLGlCQUFtQyxFQUNuQyxhQUEyQixFQUMzQixTQUFtQixFQUNuQixPQUFlLEVBQ04scUJBQTJDLEVBQ3RCLElBQVMsRUFDRSxVQUErQjtRQVB4RSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDTiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXNCO1FBQ3RCLFNBQUksR0FBSixJQUFJLENBQUs7UUFDRSxlQUFVLEdBQVYsVUFBVSxDQUFxQjtRQXhKMUUseUNBQW9DLEdBQXVCLElBQUksQ0FBQztRQUV4RSxtRkFBbUY7UUFDM0Usc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBZTFCLGNBQVMsR0FBb0IsT0FBTyxDQUFDO1FBWXJDLFVBQUssR0FBa0IsTUFBTSxDQUFDO1FBVTlCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBNEMvQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBS2pDLHVEQUF1RDtRQUM5QyxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUUzRCxtREFBbUQ7UUFDMUMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUV2RCw4Q0FBOEM7UUFDOUMsb0JBQWUsR0FBcUMsTUFBTSxDQUFDO1FBRTNELDJEQUEyRDtRQUN4QyxpQkFBWTtRQUM3Qix5RkFBeUY7UUFDekYsSUFBSSxZQUFZLENBQVUsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELHFEQUFxRDtRQUU1QyxrQkFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDZCxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQ2QsQ0FBQztRQUVGLHlEQUF5RDtRQUVoRCxnQkFBVyxHQUFxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUNsRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ3pFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FDakIsQ0FBQztRQUVGLHFEQUFxRDtRQUU1QyxrQkFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNmLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FDZCxDQUFDO1FBRUYseURBQXlEO1FBRWhELGdCQUFXLEdBQXFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQ2xFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxFQUM5RCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQ2pCLENBQUM7UUFFRiw2Q0FBNkM7UUFDNUIsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFbEQsd0RBQXdEO1FBQ3hELCtDQUErQztRQUNYLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFFakY7OztXQUdHO1FBQ00saUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBWTFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBZSxFQUFFLEVBQUU7WUFDOUMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNiLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQTRCLENBQUM7aUJBQ3BGO2dCQUVELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNuQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksU0FBUyxDQUFDLENBQUM7YUFDbEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVIOzs7O1dBSUc7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUErQjtpQkFDaEYsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDYixPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsRUFDRixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUMzQjtpQkFDQSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNwQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsd0VBQXdFO1FBQ3hFLG9GQUFvRjtRQUNwRixJQUFJLENBQUMsYUFBYTthQUNmLElBQUksQ0FDSCxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QixPQUFPLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQ0g7YUFDQSxTQUFTLENBQUMsQ0FBQyxLQUFxQixFQUFFLEVBQUU7WUFDbkMsTUFBTSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsR0FBRyxLQUFLLENBQUM7WUFFbkMsSUFDRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVMsS0FBSyxNQUFNLENBQUM7Z0JBQ3ZELENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN2RDtnQkFDQSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUF6TUQsK0NBQStDO0lBQy9DLElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBc0I7UUFDakMsbUNBQW1DO1FBQ25DLEtBQUssR0FBRyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFHRCwyREFBMkQ7SUFDM0QsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxLQUFvQjtRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFHRCwyRkFBMkY7SUFDM0YsSUFDSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFDRCxJQUFJLFlBQVksQ0FBQyxLQUFjO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUdEOzs7Ozs7T0FNRztJQUNILElBQ0ksU0FBUztRQUNYLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFOUIsMkZBQTJGO1FBQzNGLHdGQUF3RjtRQUN4RiwrREFBK0Q7UUFDL0QsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ3hCLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO2lCQUFNO2dCQUNMLE9BQU8sZ0JBQWdCLENBQUM7YUFDekI7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEtBQXlDO1FBQ3JELElBQUksS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssT0FBTyxFQUFFO1lBQ3pDLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLEtBQWM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUE2SEQ7Ozs7T0FJRztJQUNLLFdBQVcsQ0FBQyxPQUFvQixFQUFFLE9BQXNCO1FBQzlELElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEIscUZBQXFGO1lBQ3JGLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsT0FBc0I7UUFDbEUsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUMvRCxRQUFRLENBQ2EsQ0FBQztRQUN4QixJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSyxVQUFVO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBRS9DLGlGQUFpRjtRQUNqRiw4RUFBOEU7UUFDOUUsZ0VBQWdFO1FBQ2hFLFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssUUFBUTtnQkFDWCxPQUFPO1lBQ1QsS0FBSyxJQUFJLENBQUM7WUFDVixLQUFLLGdCQUFnQjtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDbEUsSUFBSSxDQUFDLGFBQWEsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7d0JBQ2hGLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDakI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTTtZQUNSLEtBQUssZUFBZTtnQkFDbEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLDBDQUEwQyxDQUFDLENBQUM7Z0JBQ3JFLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssYUFBYSxDQUFDLFdBQXVDO1FBQzNELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDL0IsT0FBTztTQUNSO1FBRUQsSUFBSSxJQUFJLENBQUMsb0NBQW9DLEVBQUU7WUFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3JGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUM7SUFDbkQsQ0FBQztJQUVELG9EQUFvRDtJQUM1QyxvQkFBb0I7UUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7UUFDMUMsT0FBTyxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsd0ZBQXdGO1FBQ3hGLHNGQUFzRjtRQUN0Rix1RkFBdUY7UUFDdkYsWUFBWTtRQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksQ0FBQyxTQUF1QjtRQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsb0VBQW9FO0lBQ3BFLHNCQUFzQjtRQUNwQixxRkFBcUY7UUFDckYsbUZBQW1GO1FBQ25GLDRDQUE0QztRQUM1QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFNBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUF1QjtRQUM1RCxxRkFBcUY7UUFDckYsK0VBQStFO1FBQy9FLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztTQUM3QjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQzFCLE1BQU07UUFDTixrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFDekQsSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQzdCLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxRQUFRLENBQ2QsTUFBZSxFQUNmLFlBQXFCLEVBQ3JCLFdBQXVDO1FBRXZDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1NBQ3pFO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztZQUM5QixJQUFJLFlBQVksRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNqQztTQUNGO1FBRUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFN0IsT0FBTyxJQUFJLE9BQU8sQ0FBd0IsT0FBTyxDQUFDLEVBQUU7WUFDbEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELG1EQUFtRDtJQUMzQyxxQkFBcUI7UUFDM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLHNGQUFzRjtZQUN0RixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDO1NBQy9EO0lBQ0gsQ0FBQzs7c0dBN1pVLFNBQVMsMExBeUpFLFFBQVEsNkJBQ1Isb0JBQW9COzBGQTFKL0IsU0FBUyxvMkJDckp0Qix1R0FHQSx1R0RnSWMsQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUM7MkZBa0J0QyxTQUFTO2tCQXRCckIsU0FBUzsrQkFDRSxZQUFZLFlBQ1osV0FBVyxjQUVULENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLFFBQzNDO3dCQUNKLE9BQU8sRUFBRSxZQUFZO3dCQUNyQiw2REFBNkQ7d0JBQzdELGNBQWMsRUFBRSxNQUFNO3dCQUN0Qix3QkFBd0IsRUFBRSxvQkFBb0I7d0JBQzlDLHlCQUF5QixFQUFFLGlCQUFpQjt3QkFDNUMseUJBQXlCLEVBQUUsaUJBQWlCO3dCQUM1Qyx5QkFBeUIsRUFBRSxpQkFBaUI7d0JBQzVDLDJCQUEyQixFQUFFLFFBQVE7d0JBQ3JDLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixjQUFjLEVBQUUsaUJBQWlCO3dCQUNqQyxvQkFBb0IsRUFBRSxnQ0FBZ0M7d0JBQ3RELG1CQUFtQixFQUFFLDRCQUE0QjtxQkFDbEQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUk7OzBCQTJKbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFROzhCQUNrQyxrQkFBa0I7MEJBQS9FLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsb0JBQW9COzRDQWpKdEMsUUFBUTtzQkFEWCxLQUFLO2dCQWdCRixJQUFJO3NCQURQLEtBQUs7Z0JBYUYsWUFBWTtzQkFEZixLQUFLO2dCQWlCRixTQUFTO3NCQURaLEtBQUs7Z0JBNkJGLE1BQU07c0JBRFQsS0FBSztnQkFzQmEsWUFBWTtzQkFBOUIsTUFBTTtnQkFNRSxhQUFhO3NCQURyQixNQUFNO3VCQUFDLFFBQVE7Z0JBUVAsV0FBVztzQkFEbkIsTUFBTTtnQkFRRSxhQUFhO3NCQURyQixNQUFNO3VCQUFDLFFBQVE7Z0JBUVAsV0FBVztzQkFEbkIsTUFBTTtnQkFXNkIsaUJBQWlCO3NCQUFwRCxNQUFNO3VCQUFDLGlCQUFpQjs7QUEwUjNCOzs7OztHQUtHO0FBbUJILE1BQU0sT0FBTyxrQkFBa0I7SUFnRzdCLFlBQ3NCLElBQW9CLEVBQ2hDLFFBQWlDLEVBQ2pDLE9BQWUsRUFDZixrQkFBcUMsRUFDN0MsYUFBNEIsRUFDUyxlQUFlLEdBQUcsS0FBSyxFQUNULGNBQXVCO1FBTnRELFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ2pDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBR00sbUJBQWMsR0FBZCxjQUFjLENBQVM7UUE5RjVFLDZDQUE2QztRQUM3QyxhQUFRLEdBQUcsSUFBSSxTQUFTLEVBQWEsQ0FBQztRQWtEdEMseURBQXlEO1FBQ3RDLGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFlaEYsNkNBQTZDO1FBQzVCLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWxELDZEQUE2RDtRQUM1QyxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdkQ7Ozs7V0FJRztRQUNILG9CQUFlLEdBQWdELEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFaEYsMEJBQXFCLEdBQUcsSUFBSSxPQUFPLEVBQStDLENBQUM7UUFnQjFGLG9FQUFvRTtRQUNwRSx5RUFBeUU7UUFDekUsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCx3RUFBd0U7UUFDeEUsNERBQTREO1FBQzVELGFBQWE7YUFDVixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztJQUNuQyxDQUFDO0lBM0dELGtEQUFrRDtJQUNsRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxJQUFJLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILElBQ0ksV0FBVztRQUNiLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRTtZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztTQUMvRjtRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxLQUFVO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFrQ0QsaUZBQWlGO0lBQ2pGLElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzVDLENBQUM7SUE4QkQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTzthQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzdELFNBQVMsQ0FBQyxDQUFDLE1BQTRCLEVBQUUsRUFBRTtZQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDekQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFpQixFQUFFLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUNFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNO2dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM3QjtnQkFDQSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzthQUM3QjtZQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNsQyxJQUFJLENBQUMsZUFBZTtpQkFDakIsSUFBSSxDQUNILFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxzREFBc0Q7WUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDM0I7aUJBQ0EsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxpREFBaUQ7SUFDakQsSUFBSTtRQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsb0JBQW9CO1FBQ2xCLGdFQUFnRTtRQUNoRSw0RkFBNEY7UUFDNUYsMkVBQTJFO1FBQzNFLGdHQUFnRztRQUNoRywwRkFBMEY7UUFDMUYsaUNBQWlDO1FBQ2pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVkLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtnQkFDN0IsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7Z0JBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3JDLElBQUksSUFBSSxLQUFLLENBQUM7Z0JBQ2QsS0FBSyxJQUFJLEtBQUssQ0FBQzthQUNoQjtTQUNGO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFO2dCQUM5QixLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQztpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtnQkFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDdEMsS0FBSyxJQUFJLEtBQUssQ0FBQztnQkFDZixJQUFJLElBQUksS0FBSyxDQUFDO2FBQ2Y7U0FDRjtRQUVELDhFQUE4RTtRQUM5RSxpRkFBaUY7UUFDakYsaUZBQWlGO1FBQ2pGLGtGQUFrRjtRQUNsRixJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUssQ0FBQztRQUNyQixLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUssQ0FBQztRQUV2QixJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDOUUsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztZQUVyQywyRkFBMkY7WUFDM0YsNEZBQTRGO1lBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDL0U7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLDJFQUEyRTtRQUMzRSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ3RDLHVGQUF1RjtZQUN2RixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNuRTtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssa0JBQWtCLENBQUMsTUFBaUI7UUFDMUMsTUFBTSxDQUFDLGlCQUFpQjthQUNyQixJQUFJLENBQ0gsTUFBTSxDQUFDLENBQUMsS0FBcUIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQ3BFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUNqQzthQUNBLFNBQVMsQ0FBQyxDQUFDLEtBQXFCLEVBQUUsRUFBRTtZQUNuQywwRkFBMEY7WUFDMUYsc0ZBQXNGO1lBQ3RGLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDaEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3BFO1lBRUQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUMxQixNQUFNLENBQUMsWUFBWTtpQkFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUN0QyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLG9CQUFvQixDQUFDLE1BQWlCO1FBQzVDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPO1NBQ1I7UUFDRCwrRUFBK0U7UUFDL0UsaUVBQWlFO1FBQ2pFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMkVBQTJFO0lBQ25FLGdCQUFnQixDQUFDLE1BQWlCO1FBQ3hDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLFlBQVk7aUJBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUM5RCxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNILENBQUM7SUFFRCx3RkFBd0Y7SUFDaEYsa0JBQWtCLENBQUMsS0FBYztRQUN2QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQUcsK0JBQStCLENBQUM7UUFFbEQsSUFBSSxLQUFLLEVBQUU7WUFDVCxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCO2FBQU07WUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELDREQUE0RDtJQUNwRCxnQkFBZ0I7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUUvQiw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtvQkFDeEUsNkJBQTZCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO2dCQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7b0JBQzFFLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUN4QztnQkFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzthQUN0QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUVoQyw4QkFBOEI7UUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzNCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELCtFQUErRTtJQUN2RSxTQUFTO1FBQ2YsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1lBQy9ELENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQzVELENBQUM7SUFDSixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDZCQUE2QjtRQUMzQixtRkFBbUY7UUFDbkYsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDakYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTyxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU8sQ0FDTCxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3BFLENBQUM7SUFDSixDQUFDO0lBRU8sZ0JBQWdCLENBQUMsTUFBaUI7UUFDeEMsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQzVELENBQUM7SUFFTyxhQUFhLENBQUMsTUFBd0I7UUFDNUMsT0FBTyxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDekMsQ0FBQzs7K0dBclhVLGtCQUFrQiw4S0FzR25CLDJCQUEyQixhQUNmLHFCQUFxQjttR0F2R2hDLGtCQUFrQixpU0FQbEI7UUFDVDtZQUNFLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsV0FBVyxFQUFFLGtCQUFrQjtTQUNoQztLQUNGLGdFQWNhLGdCQUFnQixpRUFWYixTQUFTLDhGQVdmLGdCQUFnQixrRkU5bEI3QiwwV0FVQSxnckVGZ0dhLGdCQUFnQjsyRkF1ZWhCLGtCQUFrQjtrQkFsQjlCLFNBQVM7K0JBQ0Usc0JBQXNCLFlBQ3RCLG9CQUFvQixRQUd4Qjt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixnREFBZ0QsRUFBRSxtQkFBbUI7cUJBQ3RFLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLGFBQzFCO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxvQkFBb0I7NEJBQzdCLFdBQVcsb0JBQW9CO3lCQUNoQztxQkFDRjs7MEJBbUdFLFFBQVE7OzBCQUtSLE1BQU07MkJBQUMsMkJBQTJCOzswQkFDbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBaEczQyxXQUFXO3NCQUxWLGVBQWU7dUJBQUMsU0FBUyxFQUFFO3dCQUMxQix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO2dCQU0rQixRQUFRO3NCQUF2QyxZQUFZO3VCQUFDLGdCQUFnQjtnQkFDRCxZQUFZO3NCQUF4QyxTQUFTO3VCQUFDLGdCQUFnQjtnQkFxQnZCLFFBQVE7c0JBRFgsS0FBSztnQkFlRixXQUFXO3NCQURkLEtBQUs7Z0JBY2EsYUFBYTtzQkFBL0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBGb2N1c01vbml0b3IsXG4gIEZvY3VzT3JpZ2luLFxuICBGb2N1c1RyYXAsXG4gIEZvY3VzVHJhcEZhY3RvcnksXG4gIEludGVyYWN0aXZpdHlDaGVja2VyLFxufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZSwgU2Nyb2xsRGlzcGF0Y2hlciwgVmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIHRha2UsXG4gIHRha2VVbnRpbCxcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIG1hcFRvLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIHR3byBNYXREcmF3ZXIgYXJlIG1hdGNoaW5nIHRoZSBzYW1lIHBvc2l0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IocG9zaXRpb246IHN0cmluZykge1xuICB0aHJvdyBFcnJvcihgQSBkcmF3ZXIgd2FzIGFscmVhZHkgZGVjbGFyZWQgZm9yICdwb3NpdGlvbj1cIiR7cG9zaXRpb259XCInYCk7XG59XG5cbi8qKiBPcHRpb25zIGZvciB3aGVyZSB0byBzZXQgZm9jdXMgdG8gYXV0b21hdGljYWxseSBvbiBkaWFsb2cgb3BlbiAqL1xuZXhwb3J0IHR5cGUgQXV0b0ZvY3VzVGFyZ2V0ID0gJ2RpYWxvZycgfCAnZmlyc3QtdGFiYmFibGUnIHwgJ2ZpcnN0LWhlYWRpbmcnO1xuXG4vKiogUmVzdWx0IG9mIHRoZSB0b2dnbGUgcHJvbWlzZSB0aGF0IGluZGljYXRlcyB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlci4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlclRvZ2dsZVJlc3VsdCA9ICdvcGVuJyB8ICdjbG9zZSc7XG5cbi8qKiBEcmF3ZXIgYW5kIFNpZGVOYXYgZGlzcGxheSBtb2Rlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdERyYXdlck1vZGUgPSAnb3ZlcicgfCAncHVzaCcgfCAnc2lkZSc7XG5cbi8qKiBDb25maWd1cmVzIHdoZXRoZXIgZHJhd2VycyBzaG91bGQgdXNlIGF1dG8gc2l6aW5nIGJ5IGRlZmF1bHQuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KFxuICAnTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgZHJhd2VyIGNvbnRhaW5lciB0byBhIGRyYXdlciB3aGlsZSBhdm9pZGluZyBjaXJjdWxhciByZWZlcmVuY2VzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0RSQVdFUl9DT05UQUlORVIgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ01BVF9EUkFXRVJfQ09OVEFJTkVSJyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlkoKTogYm9vbGVhbiB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRlbnQnLFxuICAgICdbc3R5bGUubWFyZ2luLWxlZnQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLmxlZnQnLFxuICAgICdbc3R5bGUubWFyZ2luLXJpZ2h0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5yaWdodCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXJDb250ZW50IGV4dGVuZHMgQ2RrU2Nyb2xsYWJsZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdERyYXdlckNvbnRhaW5lcikpIHB1YmxpYyBfY29udGFpbmVyOiBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgc2Nyb2xsRGlzcGF0Y2hlciwgbmdab25lKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jb250YWluZXIuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGNvcnJlc3BvbmRzIHRvIGEgZHJhd2VyIHRoYXQgY2FuIGJlIG9wZW5lZCBvbiB0aGUgZHJhd2VyIGNvbnRhaW5lci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXIuaHRtbCcsXG4gIGFuaW1hdGlvbnM6IFttYXREcmF3ZXJBbmltYXRpb25zLnRyYW5zZm9ybURyYXdlcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlcicsXG4gICAgLy8gbXVzdCBwcmV2ZW50IHRoZSBicm93c2VyIGZyb20gYWxpZ25pbmcgdGV4dCBiYXNlZCBvbiB2YWx1ZVxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLWVuZF0nOiAncG9zaXRpb24gPT09IFwiZW5kXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vdmVyXSc6ICdtb2RlID09PSBcIm92ZXJcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXB1c2hdJzogJ21vZGUgPT09IFwicHVzaFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItc2lkZV0nOiAnbW9kZSA9PT0gXCJzaWRlXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vcGVuZWRdJzogJ29wZW5lZCcsXG4gICAgJ3RhYkluZGV4JzogJy0xJyxcbiAgICAnW0B0cmFuc2Zvcm1dJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtLnN0YXJ0KSc6ICdfYW5pbWF0aW9uU3RhcnRlZC5uZXh0KCRldmVudCknLFxuICAgICcoQHRyYW5zZm9ybS5kb25lKSc6ICdfYW5pbWF0aW9uRW5kLm5leHQoJGV2ZW50KScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREcmF3ZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBpcyBpbml0aWFsaXplZC4gVXNlZCBmb3IgZGlzYWJsaW5nIHRoZSBpbml0aWFsIGFuaW1hdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZW5hYmxlQW5pbWF0aW9ucyA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc2lkZSB0aGF0IHRoZSBkcmF3ZXIgaXMgYXR0YWNoZWQgdG8uICovXG4gIEBJbnB1dCgpXG4gIGdldCBwb3NpdGlvbigpOiAnc3RhcnQnIHwgJ2VuZCcge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuICBzZXQgcG9zaXRpb24odmFsdWU6ICdzdGFydCcgfCAnZW5kJykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgdmFsdWUgPSB2YWx1ZSA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgaWYgKHZhbHVlICE9IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuICAgICAgdGhpcy5vblBvc2l0aW9uQ2hhbmdlZC5lbWl0KCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBNb2RlIG9mIHRoZSBkcmF3ZXI7IG9uZSBvZiAnb3ZlcicsICdwdXNoJyBvciAnc2lkZScuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtb2RlKCk6IE1hdERyYXdlck1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG4gIHNldCBtb2RlKHZhbHVlOiBNYXREcmF3ZXJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX21vZGU6IE1hdERyYXdlck1vZGUgPSAnb3Zlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBjYW4gYmUgY2xvc2VkIHdpdGggdGhlIGVzY2FwZSBrZXkgb3IgYnkgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsb3NlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ2xvc2U7XG4gIH1cbiAgc2V0IGRpc2FibGVDbG9zZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVDbG9zZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGF1dG9tYXRpY2FsbHkgd2hlbiBvcGVuZWQuXG4gICAqIERlZmF1bHRzIHRvIGZhbHNlIGluIHdoZW4gYG1vZGVgIGlzIHNldCB0byBgc2lkZWAsIG90aGVyd2lzZSBkZWZhdWx0cyB0byBgdHJ1ZWAuIElmIGV4cGxpY2l0bHlcbiAgICogZW5hYmxlZCwgZm9jdXMgd2lsbCBiZSBtb3ZlZCBpbnRvIHRoZSBzaWRlbmF2IGluIGBzaWRlYCBtb2RlIGFzIHdlbGwuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvciBBdXRvRm9jdXNUYXJnZXRcbiAgICogaW5zdGVhZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvRm9jdXMoKTogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hdXRvRm9jdXM7XG5cbiAgICAvLyBOb3RlIHRoYXQgdXN1YWxseSB3ZSBkb24ndCBhbGxvdyBhdXRvRm9jdXMgdG8gYmUgc2V0IHRvIGBmaXJzdC10YWJiYWJsZWAgaW4gYHNpZGVgIG1vZGUsXG4gICAgLy8gYmVjYXVzZSB3ZSBkb24ndCBrbm93IGhvdyB0aGUgc2lkZW5hdiBpcyBiZWluZyB1c2VkLCBidXQgaW4gc29tZSBjYXNlcyBpdCBzdGlsbCBtYWtlc1xuICAgIC8vIHNlbnNlIHRvIGRvIGl0LiBUaGUgY29uc3VtZXIgY2FuIGV4cGxpY2l0bHkgc2V0IGBhdXRvRm9jdXNgLlxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSAnc2lkZScpIHtcbiAgICAgICAgcmV0dXJuICdkaWFsb2cnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdmaXJzdC10YWJiYWJsZSc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzZXQgYXV0b0ZvY3VzKHZhbHVlOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09PSAndHJ1ZScgfHwgdmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgIHZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5fYXV0b0ZvY3VzID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b0ZvY3VzOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgb3BlbmVkLiBXZSBvdmVybG9hZCB0aGlzIGJlY2F1c2Ugd2UgdHJpZ2dlciBhbiBldmVudCB3aGVuIGl0XG4gICAqIHN0YXJ0cyBvciBlbmQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWQ7XG4gIH1cbiAgc2V0IG9wZW5lZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMudG9nZ2xlKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBIb3cgdGhlIHNpZGVuYXYgd2FzIG9wZW5lZCAoa2V5cHJlc3MsIG1vdXNlIGNsaWNrIGV0Yy4pICovXG4gIHByaXZhdGUgX29wZW5lZFZpYTogRm9jdXNPcmlnaW4gfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvblN0YXJ0ZWQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkVuZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBzaWRlbmF2IGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAnb3Blbi1pbnN0YW50JyB8ICdvcGVuJyB8ICd2b2lkJyA9ICd2b2lkJztcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbiBzdGF0ZSBpcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPVxuICAgIC8vIE5vdGUgdGhpcyBoYXMgdG8gYmUgYXN5bmMgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBpc3N1ZXMgd2l0aCB0d28tYmluZGluZ3MgKHNlZSAjODg3MikuXG4gICAgbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigvKiBpc0FzeW5jICovIHRydWUpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpXG4gIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW0gPSB0aGlzLm9wZW5lZENoYW5nZS5waXBlKFxuICAgIGZpbHRlcihvID0+IG8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIG9wZW5pbmcuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBvcGVuZWRTdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApLFxuICAgIG1hcFRvKHVuZGVmaW5lZCksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJylcbiAgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbSA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gIW8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGNsb3NpbmcuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBjbG9zZWRTdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICBtYXBUbyh1bmRlZmluZWQpLFxuICApO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlcidzIHBvc2l0aW9uIGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoJ3Bvc2l0aW9uQ2hhbmdlZCcpIHJlYWRvbmx5IG9uUG9zaXRpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgZHJhd2VyIG1vZGUgY2hhbmdlcy4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBkcmF3ZXIgY29udGFpbmVyIHRvXG4gICAqIHRvIGtub3cgd2hlbiB0byB3aGVuIHRoZSBtb2RlIGNoYW5nZXMgc28gaXQgY2FuIGFkYXB0IHRoZSBtYXJnaW5zIG9uIHRoZSBjb250ZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgX21vZGVDaGFuZ2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9mb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jOiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRFJBV0VSX0NPTlRBSU5FUikgcHVibGljIF9jb250YWluZXI/OiBNYXREcmF3ZXJDb250YWluZXIsXG4gICkge1xuICAgIHRoaXMub3BlbmVkQ2hhbmdlLnN1YnNjcmliZSgob3BlbmVkOiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAob3BlbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLl9kb2MpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCA9IHRoaXMuX2RvYy5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdGFrZUZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKSkge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXModGhpcy5fb3BlbmVkVmlhIHx8ICdwcm9ncmFtJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gYGtleWRvd25gIGV2ZW50cyBvdXRzaWRlIHRoZSB6b25lIHNvIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBpcyBub3QgcnVuIGV2ZXJ5XG4gICAgICogdGltZSBhIGtleSBpcyBwcmVzc2VkLiBJbnN0ZWFkIHdlIHJlLWVudGVyIHRoZSB6b25lIG9ubHkgaWYgdGhlIGBFU0NgIGtleSBpcyBwcmVzc2VkXG4gICAgICogYW5kIHdlIGRvbid0IGhhdmUgY2xvc2UgZGlzYWJsZWQuXG4gICAgICovXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIChmcm9tRXZlbnQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAna2V5ZG93bicpIGFzIE9ic2VydmFibGU8S2V5Ym9hcmRFdmVudD4pXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIFdlIG5lZWQgYSBTdWJqZWN0IHdpdGggZGlzdGluY3RVbnRpbENoYW5nZWQsIGJlY2F1c2UgdGhlIGBkb25lYCBldmVudFxuICAgIC8vIGZpcmVzIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX2FuaW1hdGlvbkVuZFxuICAgICAgLnBpcGUoXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKHRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwICYmIGZyb21TdGF0ZSA9PT0gJ3ZvaWQnKSB8fFxuICAgICAgICAgICh0b1N0YXRlID09PSAndm9pZCcgJiYgZnJvbVN0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCh0aGlzLl9vcGVuZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwcm92aWRlZCBlbGVtZW50LiBJZiB0aGUgZWxlbWVudCBpcyBub3QgZm9jdXNhYmxlLCBpdCB3aWxsIGFkZCBhIHRhYkluZGV4XG4gICAqIGF0dHJpYnV0ZSB0byBmb3JjZWZ1bGx5IGZvY3VzIGl0LiBUaGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgYWZ0ZXIgZm9jdXMgaXMgbW92ZWQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9yY2VGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICghdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcbiAgICAgIGVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgIC8vIFRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHJlbW92ZWQgdG8gYXZvaWQgbmF2aWdhdGluZyB0byB0aGF0IGVsZW1lbnQgYWdhaW5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3Igd2l0aGluIHRoZSBmb2N1cyB0cmFwLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciBmb3IgdGhlIGVsZW1lbnQgdG8gc2V0IGZvY3VzIHRvLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNCeUNzc1NlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBsZXQgZWxlbWVudFRvRm9jdXMgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIHNlbGVjdG9yLFxuICAgICkgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChlbGVtZW50VG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9yY2VGb2N1cyhlbGVtZW50VG9Gb2N1cywgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIGZvY3VzIGludG8gdGhlIGRyYXdlci4gTm90ZSB0aGF0IHRoaXMgd29ya3MgZXZlbiBpZlxuICAgKiB0aGUgZm9jdXMgdHJhcCBpcyBkaXNhYmxlZCBpbiBgc2lkZWAgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgX3Rha2VGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgb24gdGhlIHNpZGVuYXYsIGlmIHRoZSBlbGVtZW50IGNhbm5vdCBiZSBmb2N1c2VkIG9yIGRvZXNcbiAgICAvLyBub3QgZXhpc3QsIGZvY3VzIHRoZSBzaWRlbmF2IGl0c2VsZiBzbyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvbiBzdGlsbCB3b3Jrcy5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHRoYXQgYGZvY3VzYCBpcyBhIGZ1bmN0aW9uIGR1ZSB0byBVbml2ZXJzYWwuXG4gICAgc3dpdGNoICh0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgY2FzZSBmYWxzZTpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgIGNhc2UgJ2ZpcnN0LXRhYmJhYmxlJzpcbiAgICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKS50aGVuKGhhc01vdmVkRm9jdXMgPT4ge1xuICAgICAgICAgIGlmICghaGFzTW92ZWRGb2N1cyAmJiB0eXBlb2YgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaXJzdC1oZWFkaW5nJzpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBbcm9sZT1cImhlYWRpbmdcIl0nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IodGhpcy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIG9yaWdpbmFsbHkgZm9jdXNlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbmVkLlxuICAgKiBJZiBubyBlbGVtZW50IHdhcyBmb2N1c2VkIGF0IHRoYXQgdGltZSwgdGhlIGZvY3VzIHdpbGwgYmUgcmVzdG9yZWQgdG8gdGhlIGRyYXdlci5cbiAgICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cyhmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4pIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMgPT09ICdkaWFsb2cnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQsIGZvY3VzT3JpZ2luKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCA9IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgd2l0aGluIHRoZSBkcmF3ZXIuICovXG4gIHByaXZhdGUgX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWN0aXZlRWwgPSB0aGlzLl9kb2M/LmFjdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuICEhYWN0aXZlRWwgJiYgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gRW5hYmxlIHRoZSBhbmltYXRpb25zIGFmdGVyIHRoZSBsaWZlY3ljbGUgaG9va3MgaGF2ZSBydW4sIGluIG9yZGVyIHRvIGF2b2lkIGFuaW1hdGluZ1xuICAgIC8vIGRyYXdlcnMgdGhhdCBhcmUgb3BlbiBieSBkZWZhdWx0LiBXaGVuIHdlJ3JlIG9uIHRoZSBzZXJ2ZXIsIHdlIHNob3VsZG4ndCBlbmFibGUgdGhlXG4gICAgLy8gYW5pbWF0aW9ucywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBkcmF3ZXIgdG8gYW5pbWF0ZSB0aGUgZmlyc3QgdGltZSB0aGUgdXNlciBzZWVzXG4gICAgLy8gdGhlIHBhZ2UuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fZW5hYmxlQW5pbWF0aW9ucyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hbmltYXRpb25TdGFydGVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIG9wZW5lZFZpYSBXaGV0aGVyIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZCBieSBhIGtleSBwcmVzcywgbW91c2UgY2xpY2sgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogVXNlZCBmb3IgZm9jdXMgbWFuYWdlbWVudCBhZnRlciB0aGUgc2lkZW5hdiBpcyBjbG9zZWQuXG4gICAqL1xuICBvcGVuKG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGUodHJ1ZSwgb3BlbmVkVmlhKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgZHJhd2VyLiAqL1xuICBjbG9zZSgpOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZShmYWxzZSk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBkcmF3ZXIgd2l0aCBjb250ZXh0IHRoYXQgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkLiAqL1xuICBfY2xvc2VWaWFCYWNrZHJvcENsaWNrKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgLy8gSWYgdGhlIGRyYXdlciBpcyBjbG9zZWQgdXBvbiBhIGJhY2tkcm9wIGNsaWNrLCB3ZSBhbHdheXMgd2FudCB0byByZXN0b3JlIGZvY3VzLiBXZVxuICAgIC8vIGRvbid0IG5lZWQgdG8gY2hlY2sgd2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgaW4gdGhlIGRyYXdlciwgYXMgY2xpY2tpbmcgb24gdGhlXG4gICAgLy8gYmFja2Ryb3AgY2F1c2VzIGJsdXJzIHRoZSBhY3RpdmUgZWxlbWVudC5cbiAgICByZXR1cm4gdGhpcy5fc2V0T3BlbigvKiBpc09wZW4gKi8gZmFsc2UsIC8qIHJlc3RvcmVGb2N1cyAqLyB0cnVlLCAnbW91c2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhpcyBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBiZSBvcGVuLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIHRvZ2dsZShpc09wZW46IGJvb2xlYW4gPSAhdGhpcy5vcGVuZWQsIG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICAvLyBJZiB0aGUgZm9jdXMgaXMgY3VycmVudGx5IGluc2lkZSB0aGUgZHJhd2VyIGNvbnRlbnQgYW5kIHdlIGFyZSBjbG9zaW5nIHRoZSBkcmF3ZXIsXG4gICAgLy8gcmVzdG9yZSB0aGUgZm9jdXMgdG8gdGhlIGluaXRpYWxseSBmb2N1c2VkIGVsZW1lbnQgKHdoZW4gdGhlIGRyYXdlciBvcGVuZWQpLlxuICAgIGlmIChpc09wZW4gJiYgb3BlbmVkVmlhKSB7XG4gICAgICB0aGlzLl9vcGVuZWRWaWEgPSBvcGVuZWRWaWE7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fc2V0T3BlbihcbiAgICAgIGlzT3BlbixcbiAgICAgIC8qIHJlc3RvcmVGb2N1cyAqLyAhaXNPcGVuICYmIHRoaXMuX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKSxcbiAgICAgIHRoaXMuX29wZW5lZFZpYSB8fCAncHJvZ3JhbScsXG4gICAgKTtcblxuICAgIGlmICghaXNPcGVuKSB7XG4gICAgICB0aGlzLl9vcGVuZWRWaWEgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgb3BlbmVkIHN0YXRlIG9mIHRoZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBvcGVuIG9yIGNsb3NlLlxuICAgKiBAcGFyYW0gcmVzdG9yZUZvY3VzIFdoZXRoZXIgZm9jdXMgc2hvdWxkIGJlIHJlc3RvcmVkIG9uIGNsb3NlLlxuICAgKiBAcGFyYW0gZm9jdXNPcmlnaW4gT3JpZ2luIHRvIHVzZSB3aGVuIHJlc3RvcmluZyBmb2N1cy5cbiAgICovXG4gIHByaXZhdGUgX3NldE9wZW4oXG4gICAgaXNPcGVuOiBib29sZWFuLFxuICAgIHJlc3RvcmVGb2N1czogYm9vbGVhbixcbiAgICBmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4sXG4gICk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgdGhpcy5fb3BlbmVkID0gaXNPcGVuO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLl9lbmFibGVBbmltYXRpb25zID8gJ29wZW4nIDogJ29wZW4taW5zdGFudCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgICAgaWYgKHJlc3RvcmVGb2N1cykge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoZm9jdXNPcmlnaW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wZW4gPT4gcmVzb2x2ZShvcGVuID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA/IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwIDogMDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBmb2N1cyB0cmFwLiAqL1xuICBwcml2YXRlIF91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICAvLyBUaGUgZm9jdXMgdHJhcCBpcyBvbmx5IGVuYWJsZWQgd2hlbiB0aGUgZHJhd2VyIGlzIG9wZW4gaW4gYW55IG1vZGUgb3RoZXIgdGhhbiBzaWRlLlxuICAgICAgdGhpcy5fZm9jdXNUcmFwLmVuYWJsZWQgPSB0aGlzLm9wZW5lZCAmJiB0aGlzLm1vZGUgIT09ICdzaWRlJztcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZUNsb3NlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvRm9jdXM6IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wZW5lZDogQm9vbGVhbklucHV0O1xufVxuXG4vKipcbiAqIGA8bWF0LWRyYXdlci1jb250YWluZXI+YCBjb21wb25lbnQuXG4gKlxuICogVGhpcyBpcyB0aGUgcGFyZW50IGNvbXBvbmVudCB0byBvbmUgb3IgdHdvIGA8bWF0LWRyYXdlcj5gcyB0aGF0IHZhbGlkYXRlcyB0aGUgc3RhdGUgaW50ZXJuYWxseVxuICogYW5kIGNvb3JkaW5hdGVzIHRoZSBiYWNrZHJvcCBhbmQgY29udGVudCBzdHlsaW5nLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyLWNvbnRhaW5lcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyQ29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXItY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZHJhd2VyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItY29udGFpbmVyLWV4cGxpY2l0LWJhY2tkcm9wXSc6ICdfYmFja2Ryb3BPdmVycmlkZScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfRFJBV0VSX0NPTlRBSU5FUixcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyQ29udGFpbmVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgLyoqIEFsbCBkcmF3ZXJzIGluIHRoZSBjb250YWluZXIuIEluY2x1ZGVzIGRyYXdlcnMgZnJvbSBpbnNpZGUgbmVzdGVkIGNvbnRhaW5lcnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0RHJhd2VyLCB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYGRlc2NlbmRhbnRzOiB0cnVlYCwgYmVjYXVzZSBJdnkgd2lsbCBubyBsb25nZXIgbWF0Y2hcbiAgICAvLyBpbmRpcmVjdCBkZXNjZW5kYW50cyBpZiBpdCdzIGxlZnQgYXMgZmFsc2UuXG4gICAgZGVzY2VuZGFudHM6IHRydWUsXG4gIH0pXG4gIF9hbGxEcmF3ZXJzOiBRdWVyeUxpc3Q8TWF0RHJhd2VyPjtcblxuICAvKiogRHJhd2VycyB0aGF0IGJlbG9uZyB0byB0aGlzIGNvbnRhaW5lci4gKi9cbiAgX2RyYXdlcnMgPSBuZXcgUXVlcnlMaXN0PE1hdERyYXdlcj4oKTtcblxuICBAQ29udGVudENoaWxkKE1hdERyYXdlckNvbnRlbnQpIF9jb250ZW50OiBNYXREcmF3ZXJDb250ZW50O1xuICBAVmlld0NoaWxkKE1hdERyYXdlckNvbnRlbnQpIF91c2VyQ29udGVudDogTWF0RHJhd2VyQ29udGVudDtcblxuICAvKiogVGhlIGRyYXdlciBjaGlsZCB3aXRoIHRoZSBgc3RhcnRgIHBvc2l0aW9uLiAqL1xuICBnZXQgc3RhcnQoKTogTWF0RHJhd2VyIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgLyoqIFRoZSBkcmF3ZXIgY2hpbGQgd2l0aCB0aGUgYGVuZGAgcG9zaXRpb24uICovXG4gIGdldCBlbmQoKTogTWF0RHJhd2VyIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGF1dG9tYXRpY2FsbHkgcmVzaXplIHRoZSBjb250YWluZXIgd2hlbmV2ZXJcbiAgICogdGhlIHNpemUgb2YgYW55IG9mIGl0cyBkcmF3ZXJzIGNoYW5nZXMuXG4gICAqXG4gICAqICoqVXNlIGF0IHlvdXIgb3duIHJpc2shKiogRW5hYmxpbmcgdGhpcyBvcHRpb24gY2FuIGNhdXNlIGxheW91dCB0aHJhc2hpbmcgYnkgbWVhc3VyaW5nXG4gICAqIHRoZSBkcmF3ZXJzIG9uIGV2ZXJ5IGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUuIENhbiBiZSBjb25maWd1cmVkIGdsb2JhbGx5IHZpYSB0aGVcbiAgICogYE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRWAgdG9rZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b3NpemUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9zaXplO1xuICB9XG4gIHNldCBhdXRvc2l6ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2F1dG9zaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hdXRvc2l6ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGNvbnRhaW5lciBzaG91bGQgaGF2ZSBhIGJhY2tkcm9wIHdoaWxlIG9uZSBvZiB0aGUgc2lkZW5hdnMgaXMgb3Blbi5cbiAgICogSWYgZXhwbGljaXRseSBzZXQgdG8gYHRydWVgLCB0aGUgYmFja2Ryb3Agd2lsbCBiZSBlbmFibGVkIGZvciBkcmF3ZXJzIGluIHRoZSBgc2lkZWBcbiAgICogbW9kZSBhcyB3ZWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGhhc0JhY2tkcm9wKCkge1xuICAgIGlmICh0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID09IG51bGwpIHtcbiAgICAgIHJldHVybiAhdGhpcy5fc3RhcnQgfHwgdGhpcy5fc3RhcnQubW9kZSAhPT0gJ3NpZGUnIHx8ICF0aGlzLl9lbmQgfHwgdGhpcy5fZW5kLm1vZGUgIT09ICdzaWRlJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fYmFja2Ryb3BPdmVycmlkZTtcbiAgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGUgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgX2JhY2tkcm9wT3ZlcnJpZGU6IGJvb2xlYW4gfCBudWxsO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBiYWNrZHJvcCBpcyBjbGlja2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYmFja2Ryb3BDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZHJhd2VyIGF0IHRoZSBzdGFydC9lbmQgcG9zaXRpb24sIGluZGVwZW5kZW50IG9mIGRpcmVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc3RhcnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX2VuZDogTWF0RHJhd2VyIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIGRyYXdlciBhdCB0aGUgbGVmdC9yaWdodC4gV2hlbiBkaXJlY3Rpb24gY2hhbmdlcywgdGhlc2Ugd2lsbCBjaGFuZ2UgYXMgd2VsbC5cbiAgICogVGhleSdyZSB1c2VkIGFzIGFsaWFzZXMgZm9yIHRoZSBhYm92ZSB0byBzZXQgdGhlIGxlZnQvcmlnaHQgc3R5bGUgcHJvcGVybHkuXG4gICAqIEluIExUUiwgX2xlZnQgPT0gX3N0YXJ0IGFuZCBfcmlnaHQgPT0gX2VuZC5cbiAgICogSW4gUlRMLCBfbGVmdCA9PSBfZW5kIGFuZCBfcmlnaHQgPT0gX3N0YXJ0LlxuICAgKi9cbiAgcHJpdmF0ZSBfbGVmdDogTWF0RHJhd2VyIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcmlnaHQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIG9uIGV2ZXJ5IG5nRG9DaGVjay4gVXNlZCBmb3IgZGVib3VuY2luZyByZWZsb3dzLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kb0NoZWNrU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIE1hcmdpbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY29udGVudC4gVGhlc2UgYXJlIHVzZWQgdG8gcHVzaCAvIHNocmluayB0aGUgZHJhd2VyIGNvbnRlbnQgd2hlbiBhXG4gICAqIGRyYXdlciBpcyBvcGVuLiBXZSB1c2UgbWFyZ2luIHJhdGhlciB0aGFuIHRyYW5zZm9ybSBldmVuIGZvciBwdXNoIG1vZGUgYmVjYXVzZSB0cmFuc2Zvcm0gYnJlYWtzXG4gICAqIGZpeGVkIHBvc2l0aW9uIGVsZW1lbnRzIGluc2lkZSBvZiB0aGUgdHJhbnNmb3JtZWQgZWxlbWVudC5cbiAgICovXG4gIF9jb250ZW50TWFyZ2luczoge2xlZnQ6IG51bWJlciB8IG51bGw7IHJpZ2h0OiBudW1iZXIgfCBudWxsfSA9IHtsZWZ0OiBudWxsLCByaWdodDogbnVsbH07XG5cbiAgcmVhZG9ubHkgX2NvbnRlbnRNYXJnaW5DaGFuZ2VzID0gbmV3IFN1YmplY3Q8e2xlZnQ6IG51bWJlciB8IG51bGw7IHJpZ2h0OiBudW1iZXIgfCBudWxsfT4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBDZGtTY3JvbGxhYmxlIGluc3RhbmNlIHRoYXQgd3JhcHMgdGhlIHNjcm9sbGFibGUgY29udGVudC4gKi9cbiAgZ2V0IHNjcm9sbGFibGUoKTogQ2RrU2Nyb2xsYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJDb250ZW50IHx8IHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIEBJbmplY3QoTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFKSBkZWZhdWx0QXV0b3NpemUgPSBmYWxzZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgLy8gSWYgYSBgRGlyYCBkaXJlY3RpdmUgZXhpc3RzIHVwIHRoZSB0cmVlLCBsaXN0ZW4gZGlyZWN0aW9uIGNoYW5nZXNcbiAgICAvLyBhbmQgdXBkYXRlIHRoZSBsZWZ0L3JpZ2h0IHByb3BlcnRpZXMgdG8gcG9pbnQgdG8gdGhlIHByb3BlciBzdGFydC9lbmQuXG4gICAgaWYgKF9kaXIpIHtcbiAgICAgIF9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgbWluaW11bSB3aWR0aCBvZiB0aGUgc2lkZW5hdiBkZXBlbmRzIG9uIHRoZSB2aWV3cG9ydCB3aWR0aCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJlY29tcHV0ZSB0aGUgbWFyZ2lucyBpZiB0aGUgdmlld3BvcnQgY2hhbmdlcy5cbiAgICB2aWV3cG9ydFJ1bGVyXG4gICAgICAuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkpO1xuXG4gICAgdGhpcy5fYXV0b3NpemUgPSBkZWZhdWx0QXV0b3NpemU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fYWxsRHJhd2Vycy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsRHJhd2VycyksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoZHJhd2VyOiBRdWVyeUxpc3Q8TWF0RHJhd2VyPikgPT4ge1xuICAgICAgICB0aGlzLl9kcmF3ZXJzLnJlc2V0KGRyYXdlci5maWx0ZXIoaXRlbSA9PiAhaXRlbS5fY29udGFpbmVyIHx8IGl0ZW0uX2NvbnRhaW5lciA9PT0gdGhpcykpO1xuICAgICAgICB0aGlzLl9kcmF3ZXJzLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9kcmF3ZXJzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZURyYXdlcnMoKTtcblxuICAgICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKChkcmF3ZXI6IE1hdERyYXdlcikgPT4ge1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlclRvZ2dsZShkcmF3ZXIpO1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcik7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyTW9kZShkcmF3ZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuX2RyYXdlcnMubGVuZ3RoIHx8XG4gICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgfHxcbiAgICAgICAgdGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgaGl0dGluZyB0aGUgTmdab25lIHRocm91Z2ggdGhlIGRlYm91bmNlIHRpbWVvdXQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0XG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIGRlYm91bmNlVGltZSgxMCksIC8vIEFyYml0cmFyeSBkZWJvdW5jZSB0aW1lLCBsZXNzIHRoYW4gYSBmcmFtZSBhdCA2MGZwc1xuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZG9DaGVja1N1YmplY3QuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kcmF3ZXJzLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBvcGVuYCBvZiBib3RoIHN0YXJ0IGFuZCBlbmQgZHJhd2VycyAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyLm9wZW4oKSk7XG4gIH1cblxuICAvKiogQ2FsbHMgYGNsb3NlYCBvZiBib3RoIHN0YXJ0IGFuZCBlbmQgZHJhd2VycyAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5jbG9zZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgYW5kIHVwZGF0ZXMgdGhlIGlubGluZSBzdHlsZXMgZm9yIHRoZSBjb250ZW50LiBOb3RlIHRoYXQgdGhpcyBzaG91bGQgYmUgdXNlZFxuICAgKiBzcGFyaW5nbHksIGJlY2F1c2UgaXQgY2F1c2VzIGEgcmVmbG93LlxuICAgKi9cbiAgdXBkYXRlQ29udGVudE1hcmdpbnMoKSB7XG4gICAgLy8gMS4gRm9yIGRyYXdlcnMgaW4gYG92ZXJgIG1vZGUsIHRoZXkgZG9uJ3QgYWZmZWN0IHRoZSBjb250ZW50LlxuICAgIC8vIDIuIEZvciBkcmF3ZXJzIGluIGBzaWRlYCBtb2RlIHRoZXkgc2hvdWxkIHNocmluayB0aGUgY29udGVudC4gV2UgZG8gdGhpcyBieSBhZGRpbmcgdG8gdGhlXG4gICAgLy8gICAgbGVmdCBtYXJnaW4gKGZvciBsZWZ0IGRyYXdlcikgb3IgcmlnaHQgbWFyZ2luIChmb3IgcmlnaHQgdGhlIGRyYXdlcikuXG4gICAgLy8gMy4gRm9yIGRyYXdlcnMgaW4gYHB1c2hgIG1vZGUgdGhlIHNob3VsZCBzaGlmdCB0aGUgY29udGVudCB3aXRob3V0IHJlc2l6aW5nIGl0LiBXZSBkbyB0aGlzIGJ5XG4gICAgLy8gICAgYWRkaW5nIHRvIHRoZSBsZWZ0IG9yIHJpZ2h0IG1hcmdpbiBhbmQgc2ltdWx0YW5lb3VzbHkgc3VidHJhY3RpbmcgdGhlIHNhbWUgYW1vdW50IG9mXG4gICAgLy8gICAgbWFyZ2luIGZyb20gdGhlIG90aGVyIHNpZGUuXG4gICAgbGV0IGxlZnQgPSAwO1xuICAgIGxldCByaWdodCA9IDA7XG5cbiAgICBpZiAodGhpcy5fbGVmdCAmJiB0aGlzLl9sZWZ0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX2xlZnQubW9kZSA9PSAnc2lkZScpIHtcbiAgICAgICAgbGVmdCArPSB0aGlzLl9sZWZ0Ll9nZXRXaWR0aCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fbGVmdC5fZ2V0V2lkdGgoKTtcbiAgICAgICAgbGVmdCArPSB3aWR0aDtcbiAgICAgICAgcmlnaHQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JpZ2h0ICYmIHRoaXMuX3JpZ2h0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIHJpZ2h0ICs9IHRoaXMuX3JpZ2h0Ll9nZXRXaWR0aCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdwdXNoJykge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3JpZ2h0Ll9nZXRXaWR0aCgpO1xuICAgICAgICByaWdodCArPSB3aWR0aDtcbiAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBlaXRoZXIgYHJpZ2h0YCBvciBgbGVmdGAgaXMgemVybywgZG9uJ3Qgc2V0IGEgc3R5bGUgdG8gdGhlIGVsZW1lbnQuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXNlcnMgdG8gc3BlY2lmeSBhIGN1c3RvbSBzaXplIHZpYSBDU1MgY2xhc3MgaW4gU1NSIHNjZW5hcmlvcyB3aGVyZSB0aGVcbiAgICAvLyBtZWFzdXJlZCB3aWR0aHMgd2lsbCBhbHdheXMgYmUgemVyby4gTm90ZSB0aGF0IHdlIHJlc2V0IHRvIGBudWxsYCBoZXJlLCByYXRoZXJcbiAgICAvLyB0aGFuIGJlbG93LCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdHlwZXMgaW4gdGhlIGBpZmAgYmVsb3cgYXJlIGNvbnNpc3RlbnQuXG4gICAgbGVmdCA9IGxlZnQgfHwgbnVsbCE7XG4gICAgcmlnaHQgPSByaWdodCB8fCBudWxsITtcblxuICAgIGlmIChsZWZ0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5sZWZ0IHx8IHJpZ2h0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5yaWdodCkge1xuICAgICAgdGhpcy5fY29udGVudE1hcmdpbnMgPSB7bGVmdCwgcmlnaHR9O1xuXG4gICAgICAvLyBQdWxsIGJhY2sgaW50byB0aGUgTmdab25lIHNpbmNlIGluIHNvbWUgY2FzZXMgd2UgY291bGQgYmUgb3V0c2lkZS4gV2UgbmVlZCB0byBiZSBjYXJlZnVsXG4gICAgICAvLyB0byBkbyBpdCBvbmx5IHdoZW4gc29tZXRoaW5nIGNoYW5nZWQsIG90aGVyd2lzZSB3ZSBjYW4gZW5kIHVwIGhpdHRpbmcgdGhlIHpvbmUgdG9vIG9mdGVuLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5uZXh0KHRoaXMuX2NvbnRlbnRNYXJnaW5zKSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIElmIHVzZXJzIG9wdGVkIGludG8gYXV0b3NpemluZywgZG8gYSBjaGVjayBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9hdXRvc2l6ZSAmJiB0aGlzLl9pc1B1c2hlZCgpKSB7XG4gICAgICAvLyBSdW4gb3V0c2lkZSB0aGUgTmdab25lLCBvdGhlcndpc2UgdGhlIGRlYm91bmNlciB3aWxsIHRocm93IHVzIGludG8gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLl9kb0NoZWNrU3ViamVjdC5uZXh0KCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBldmVudHMgaW4gb3JkZXIgdG8gc2V0IGEgY2xhc3Mgb24gdGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQgd2hlbiB0aGVcbiAgICogZHJhd2VyIGlzIG9wZW4gYW5kIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiBUaGlzIGVuc3VyZXMgYW55IG92ZXJmbG93IG9uIHRoZSBjb250YWluZXIgZWxlbWVudFxuICAgKiBpcyBwcm9wZXJseSBoaWRkZW4uXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclRvZ2dsZShkcmF3ZXI6IE1hdERyYXdlcik6IHZvaWQge1xuICAgIGRyYXdlci5fYW5pbWF0aW9uU3RhcnRlZFxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiBldmVudC5mcm9tU3RhdGUgIT09IGV2ZW50LnRvU3RhdGUpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4ge1xuICAgICAgICAvLyBTZXQgdGhlIHRyYW5zaXRpb24gY2xhc3Mgb24gdGhlIGNvbnRhaW5lciBzbyB0aGF0IHRoZSBhbmltYXRpb25zIG9jY3VyLiBUaGlzIHNob3VsZCBub3RcbiAgICAgICAgLy8gYmUgc2V0IGluaXRpYWxseSBiZWNhdXNlIGFuaW1hdGlvbnMgc2hvdWxkIG9ubHkgYmUgdHJpZ2dlcmVkIHZpYSBhIGNoYW5nZSBpbiBzdGF0ZS5cbiAgICAgICAgaWYgKGV2ZW50LnRvU3RhdGUgIT09ICdvcGVuLWluc3RhbnQnICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWRyYXdlci10cmFuc2l0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG5cbiAgICBpZiAoZHJhd2VyLm1vZGUgIT09ICdzaWRlJykge1xuICAgICAgZHJhd2VyLm9wZW5lZENoYW5nZVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9zZXRDb250YWluZXJDbGFzcyhkcmF3ZXIub3BlbmVkKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gZHJhd2VyIG9uUG9zaXRpb25DaGFuZ2VkIGV2ZW50IGluIG9yZGVyIHRvXG4gICAqIHJlLXZhbGlkYXRlIGRyYXdlcnMgd2hlbiB0aGUgcG9zaXRpb24gY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoIWRyYXdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBOT1RFOiBXZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkgYmVmb3JlIHZhbGlkYXRpbmcsXG4gICAgLy8gc2luY2UgYm90aCBkcmF3ZXJzIG1heSBiZSBzd2FwcGluZyBwb3NpdGlvbnMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICBkcmF3ZXIub25Qb3NpdGlvbkNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5LnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gZHJhd2VyIG1vZGUgc28gd2UgY2FuIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlck1vZGUoZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBpZiAoZHJhd2VyKSB7XG4gICAgICBkcmF3ZXIuX21vZGVDaGFuZ2VkXG4gICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3llZCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSAnbWF0LWRyYXdlci1vcGVuZWQnIGNsYXNzIG9uIHRoZSBtYWluICdtYXQtZHJhd2VyLWNvbnRhaW5lcicgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc2V0Q29udGFpbmVyQ2xhc3MoaXNBZGQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9ICdtYXQtZHJhd2VyLWNvbnRhaW5lci1oYXMtb3Blbic7XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlciBjaGlsZHJlbiBjb21wb25lbnRzLiAqL1xuICBwcml2YXRlIF92YWxpZGF0ZURyYXdlcnMoKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9lbmQgPSBudWxsO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhdCBtb3N0IG9uZSBzdGFydCBhbmQgb25lIGVuZCBkcmF3ZXIuXG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiB7XG4gICAgICBpZiAoZHJhd2VyLnBvc2l0aW9uID09ICdlbmQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmQgIT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdlbmQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbmQgPSBkcmF3ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQgIT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdzdGFydCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gZHJhd2VyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9sZWZ0ID0gbnVsbDtcblxuICAgIC8vIERldGVjdCBpZiB3ZSdyZSBMVFIgb3IgUlRMLlxuICAgIGlmICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX2VuZDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9zdGFydDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fZW5kO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250YWluZXIgaXMgYmVpbmcgcHVzaGVkIHRvIHRoZSBzaWRlIGJ5IG9uZSBvZiB0aGUgZHJhd2Vycy4gKi9cbiAgcHJpdmF0ZSBfaXNQdXNoZWQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpICYmIHRoaXMuX3N0YXJ0Lm1vZGUgIT0gJ292ZXInKSB8fFxuICAgICAgKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpICYmIHRoaXMuX2VuZC5tb2RlICE9ICdvdmVyJylcbiAgICApO1xuICB9XG5cbiAgX29uQmFja2Ryb3BDbGlja2VkKCkge1xuICAgIHRoaXMuYmFja2Ryb3BDbGljay5lbWl0KCk7XG4gICAgdGhpcy5fY2xvc2VNb2RhbERyYXdlcnNWaWFCYWNrZHJvcCgpO1xuICB9XG5cbiAgX2Nsb3NlTW9kYWxEcmF3ZXJzVmlhQmFja2Ryb3AoKSB7XG4gICAgLy8gQ2xvc2UgYWxsIG9wZW4gZHJhd2VycyB3aGVyZSBjbG9zaW5nIGlzIG5vdCBkaXNhYmxlZCBhbmQgdGhlIG1vZGUgaXMgbm90IGBzaWRlYC5cbiAgICBbdGhpcy5fc3RhcnQsIHRoaXMuX2VuZF1cbiAgICAgIC5maWx0ZXIoZHJhd2VyID0+IGRyYXdlciAmJiAhZHJhd2VyLmRpc2FibGVDbG9zZSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AoZHJhd2VyKSlcbiAgICAgIC5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIhLl9jbG9zZVZpYUJhY2tkcm9wQ2xpY2soKSk7XG4gIH1cblxuICBfaXNTaG93aW5nQmFja2Ryb3AoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpICYmIHRoaXMuX2NhbkhhdmVCYWNrZHJvcCh0aGlzLl9zdGFydCkpIHx8XG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX2VuZCkpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NhbkhhdmVCYWNrZHJvcChkcmF3ZXI6IE1hdERyYXdlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkcmF3ZXIubW9kZSAhPT0gJ3NpZGUnIHx8ICEhdGhpcy5fYmFja2Ryb3BPdmVycmlkZTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRHJhd2VyT3BlbihkcmF3ZXI6IE1hdERyYXdlciB8IG51bGwpOiBkcmF3ZXIgaXMgTWF0RHJhd2VyIHtcbiAgICByZXR1cm4gZHJhd2VyICE9IG51bGwgJiYgZHJhd2VyLm9wZW5lZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvc2l6ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzQmFja2Ryb3A6IEJvb2xlYW5JbnB1dDtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtZHJhd2VyLWlubmVyLWNvbnRhaW5lclwiIGNka1Njcm9sbGFibGU+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuIiwiPGRpdiBjbGFzcz1cIm1hdC1kcmF3ZXItYmFja2Ryb3BcIiAoY2xpY2spPVwiX29uQmFja2Ryb3BDbGlja2VkKClcIiAqbmdJZj1cImhhc0JhY2tkcm9wXCJcbiAgICAgW2NsYXNzLm1hdC1kcmF3ZXItc2hvd25dPVwiX2lzU2hvd2luZ0JhY2tkcm9wKClcIj48L2Rpdj5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWRyYXdlclwiPjwvbmctY29udGVudD5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWRyYXdlci1jb250ZW50XCI+XG48L25nLWNvbnRlbnQ+XG48bWF0LWRyYXdlci1jb250ZW50ICpuZ0lmPVwiIV9jb250ZW50XCI+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvbWF0LWRyYXdlci1jb250ZW50PlxuIl19