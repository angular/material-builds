import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewEncapsulation, HostListener, HostBinding, } from '@angular/core';
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
MatDrawerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawerContent, deps: [{ token: i0.ChangeDetectorRef }, { token: forwardRef(() => MatDrawerContainer) }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatDrawerContent, selector: "mat-drawer-content", host: { properties: { "style.margin-left.px": "_container._contentMargins.left", "style.margin-right.px": "_container._contentMargins.right" }, classAttribute: "mat-drawer-content" }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawerContent, decorators: [{
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
        // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
        // metadata is not inherited by child classes, instead the host binding data is defined in a way
        // that can be inherited.
        // tslint:disable-next-line:no-host-decorator-in-concrete
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
    get opened() { return this._opened; }
    set opened(value) { this.toggle(coerceBooleanProperty(value)); }
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
        const result = this._setOpen(isOpen, /* restoreFocus */ !isOpen && this._isFocusWithinDrawer(), this._openedVia || 'program');
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
MatDrawer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawer, deps: [{ token: i0.ElementRef }, { token: i2.FocusTrapFactory }, { token: i2.FocusMonitor }, { token: i3.Platform }, { token: i0.NgZone }, { token: i2.InteractivityChecker }, { token: DOCUMENT, optional: true }, { token: MAT_DRAWER_CONTAINER, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatDrawer, selector: "mat-drawer", inputs: { position: "position", mode: "mode", disableClose: "disableClose", autoFocus: "autoFocus", opened: "opened" }, outputs: { openedChange: "openedChange", _openedStream: "opened", openedStart: "openedStart", _closedStream: "closed", closedStart: "closedStart", onPositionChanged: "positionChanged" }, host: { attributes: { "tabIndex": "-1" }, listeners: { "@transform.start": "_animationStartListener($event)", "@transform.done": "_animationDoneListener($event)" }, properties: { "attr.align": "null", "class.mat-drawer-end": "position === \"end\"", "class.mat-drawer-over": "mode === \"over\"", "class.mat-drawer-push": "mode === \"push\"", "class.mat-drawer-side": "mode === \"side\"", "class.mat-drawer-opened": "opened", "@transform": "this._animationState" }, classAttribute: "mat-drawer" }, exportAs: ["matDrawer"], ngImport: i0, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable>\r\n  <ng-content></ng-content>\r\n</div>\r\n", directives: [{ type: i1.CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], animations: [matDrawerAnimations.transformDrawer], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawer, decorators: [{
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
            }], _animationState: [{
                type: HostBinding,
                args: ['@transform']
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
            }], _animationStartListener: [{
                type: HostListener,
                args: ['@transform.start', ['$event']]
            }], _animationDoneListener: [{
                type: HostListener,
                args: ['@transform.done', ['$event']]
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
            this._doCheckSubject.pipe(debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
            takeUntil(this._destroyed)).subscribe(() => this.updateContentMargins());
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
            this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
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
        return (this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
            (this._isDrawerOpen(this._end) && this._end.mode != 'over');
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
MatDrawerContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawerContainer, deps: [{ token: i4.Directionality, optional: true }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: MAT_DRAWER_DEFAULT_AUTOSIZE }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatDrawerContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatDrawerContainer, selector: "mat-drawer-container", inputs: { autosize: "autosize", hasBackdrop: "hasBackdrop" }, outputs: { backdropClick: "backdropClick" }, host: { properties: { "class.mat-drawer-container-explicit-backdrop": "_backdropOverride" }, classAttribute: "mat-drawer-container" }, providers: [{
            provide: MAT_DRAWER_CONTAINER,
            useExisting: MatDrawerContainer
        }], queries: [{ propertyName: "_content", first: true, predicate: MatDrawerContent, descendants: true }, { propertyName: "_allDrawers", predicate: MatDrawer, descendants: true }], viewQueries: [{ propertyName: "_userContent", first: true, predicate: MatDrawerContent, descendants: true }], exportAs: ["matDrawerContainer"], ngImport: i0, template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"], components: [{ type: MatDrawerContent, selector: "mat-drawer-content" }], directives: [{ type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatDrawerContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer-container', exportAs: 'matDrawerContainer', host: {
                        'class': 'mat-drawer-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatDrawerContainer
                        }], template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" *ngIf=\"hasBackdrop\"\n     [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n<mat-drawer-content *ngIf=\"!_content\">\n  <ng-content></ng-content>\n</mat-drawer-content>\n", styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer{transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}\n"] }]
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
                        descendants: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUNMLFlBQVksRUFHWixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3JCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFN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QkFBa0IsOEtBNkZULDJCQUEyQixhQUNmLHFCQUFxQjsyR0E5RjFDLGtCQUFrQixpU0FMbEIsQ0FBQztZQUNWLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsV0FBVyxFQUFFLGtCQUFrQjtTQUNoQyxDQUFDLGdFQWNZLGdCQUFnQixpRUFWYixTQUFTLDhGQVdmLGdCQUFnQixrRkVsbEI3QiwwV0FVQSxnckVGa0dhLGdCQUFnQjttR0F5ZGhCLGtCQUFrQjtrQkFoQjlCLFNBQVM7K0JBQ0Usc0JBQXNCLFlBQ3RCLG9CQUFvQixRQUd4Qjt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixnREFBZ0QsRUFBRSxtQkFBbUI7cUJBQ3RFLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLGFBQzFCLENBQUM7NEJBQ1YsT0FBTyxFQUFFLG9CQUFvQjs0QkFDN0IsV0FBVyxvQkFBb0I7eUJBQ2hDLENBQUM7OzBCQTBGVyxRQUFROzswQkFLUixNQUFNOzJCQUFDLDJCQUEyQjs7MEJBQ2xDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQXZGckQsV0FBVztzQkFMVixlQUFlO3VCQUFDLFNBQVMsRUFBRTt3QkFDMUIsdUVBQXVFO3dCQUN2RSw4Q0FBOEM7d0JBQzlDLFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtnQkFNK0IsUUFBUTtzQkFBdkMsWUFBWTt1QkFBQyxnQkFBZ0I7Z0JBQ0QsWUFBWTtzQkFBeEMsU0FBUzt1QkFBQyxnQkFBZ0I7Z0JBaUJ2QixRQUFRO3NCQURYLEtBQUs7Z0JBV0YsV0FBVztzQkFEZCxLQUFLO2dCQWNhLGFBQWE7c0JBQS9CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgRm9jdXNNb25pdG9yLFxuICBGb2N1c09yaWdpbixcbiAgRm9jdXNUcmFwLFxuICBGb2N1c1RyYXBGYWN0b3J5LFxuICBJbnRlcmFjdGl2aXR5Q2hlY2tlclxufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Q2RrU2Nyb2xsYWJsZSwgU2Nyb2xsRGlzcGF0Y2hlciwgVmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBIb3N0TGlzdGVuZXIsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGZpbHRlcixcbiAgbWFwLFxuICBzdGFydFdpdGgsXG4gIHRha2UsXG4gIHRha2VVbnRpbCxcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXG4gIG1hcFRvLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gdHdvIE1hdERyYXdlciBhcmUgbWF0Y2hpbmcgdGhlIHNhbWUgcG9zaXRpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd01hdER1cGxpY2F0ZWREcmF3ZXJFcnJvcihwb3NpdGlvbjogc3RyaW5nKSB7XG4gIHRocm93IEVycm9yKGBBIGRyYXdlciB3YXMgYWxyZWFkeSBkZWNsYXJlZCBmb3IgJ3Bvc2l0aW9uPVwiJHtwb3NpdGlvbn1cIidgKTtcbn1cblxuLyoqIE9wdGlvbnMgZm9yIHdoZXJlIHRvIHNldCBmb2N1cyB0byBhdXRvbWF0aWNhbGx5IG9uIGRpYWxvZyBvcGVuICovXG5leHBvcnQgdHlwZSBBdXRvRm9jdXNUYXJnZXQgPSAnZGlhbG9nJyB8ICdmaXJzdC10YWJiYWJsZScgfCAnZmlyc3QtaGVhZGluZyc7XG5cbi8qKiBSZXN1bHQgb2YgdGhlIHRvZ2dsZSBwcm9taXNlIHRoYXQgaW5kaWNhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgZHJhd2VyLiAqL1xuZXhwb3J0IHR5cGUgTWF0RHJhd2VyVG9nZ2xlUmVzdWx0ID0gJ29wZW4nIHwgJ2Nsb3NlJztcblxuLyoqIERyYXdlciBhbmQgU2lkZU5hdiBkaXNwbGF5IG1vZGVzLiAqL1xuZXhwb3J0IHR5cGUgTWF0RHJhd2VyTW9kZSA9ICdvdmVyJyB8ICdwdXNoJyB8ICdzaWRlJztcblxuLyoqIENvbmZpZ3VyZXMgd2hldGhlciBkcmF3ZXJzIHNob3VsZCB1c2UgYXV0byBzaXppbmcgYnkgZGVmYXVsdC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkUgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlksXG4gICAgfSk7XG5cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBkcmF3ZXIgY29udGFpbmVyIHRvIGEgZHJhd2VyIHdoaWxlIGF2b2lkaW5nIGNpcmN1bGFyIHJlZmVyZW5jZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRFJBV0VSX0NPTlRBSU5FUiA9IG5ldyBJbmplY3Rpb25Ub2tlbignTUFUX0RSQVdFUl9DT05UQUlORVInKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVfRkFDVE9SWSgpOiBib29sZWFuIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kcmF3ZXItY29udGVudCcsXG4gICAgJ1tzdHlsZS5tYXJnaW4tbGVmdC5weF0nOiAnX2NvbnRhaW5lci5fY29udGVudE1hcmdpbnMubGVmdCcsXG4gICAgJ1tzdHlsZS5tYXJnaW4tcmlnaHQucHhdJzogJ19jb250YWluZXIuX2NvbnRlbnRNYXJnaW5zLnJpZ2h0JyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRlbnQgZXh0ZW5kcyBDZGtTY3JvbGxhYmxlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdERyYXdlckNvbnRhaW5lcikpIHB1YmxpYyBfY29udGFpbmVyOiBNYXREcmF3ZXJDb250YWluZXIsXG4gICAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgICBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHNjcm9sbERpc3BhdGNoZXIsIG5nWm9uZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY29udGFpbmVyLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGNvcnJlc3BvbmRzIHRvIGEgZHJhd2VyIHRoYXQgY2FuIGJlIG9wZW5lZCBvbiB0aGUgZHJhd2VyIGNvbnRhaW5lci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlcicsXG4gIGV4cG9ydEFzOiAnbWF0RHJhd2VyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXIuaHRtbCcsXG4gIGFuaW1hdGlvbnM6IFttYXREcmF3ZXJBbmltYXRpb25zLnRyYW5zZm9ybURyYXdlcl0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlcicsXG4gICAgLy8gbXVzdCBwcmV2ZW50IHRoZSBicm93c2VyIGZyb20gYWxpZ25pbmcgdGV4dCBiYXNlZCBvbiB2YWx1ZVxuICAgICdbYXR0ci5hbGlnbl0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLWVuZF0nOiAncG9zaXRpb24gPT09IFwiZW5kXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vdmVyXSc6ICdtb2RlID09PSBcIm92ZXJcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLXB1c2hdJzogJ21vZGUgPT09IFwicHVzaFwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItc2lkZV0nOiAnbW9kZSA9PT0gXCJzaWRlXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1vcGVuZWRdJzogJ29wZW5lZCcsXG4gICAgJ3RhYkluZGV4JzogJy0xJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZHJhd2VyIGlzIGluaXRpYWxpemVkLiBVc2VkIGZvciBkaXNhYmxpbmcgdGhlIGluaXRpYWwgYW5pbWF0aW9uLiAqL1xuICBwcml2YXRlIF9lbmFibGVBbmltYXRpb25zID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzaWRlIHRoYXQgdGhlIGRyYXdlciBpcyBhdHRhY2hlZCB0by4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBvc2l0aW9uKCk6ICdzdGFydCcgfCAnZW5kJyB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxuICBzZXQgcG9zaXRpb24odmFsdWU6ICdzdGFydCcgfCAnZW5kJykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgdmFsdWUgPSB2YWx1ZSA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgaWYgKHZhbHVlICE9IHRoaXMuX3Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuICAgICAgdGhpcy5vblBvc2l0aW9uQ2hhbmdlZC5lbWl0KCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBNb2RlIG9mIHRoZSBkcmF3ZXI7IG9uZSBvZiAnb3ZlcicsICdwdXNoJyBvciAnc2lkZScuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtb2RlKCk6IE1hdERyYXdlck1vZGUgeyByZXR1cm4gdGhpcy5fbW9kZTsgfVxuICBzZXQgbW9kZSh2YWx1ZTogTWF0RHJhd2VyTW9kZSkge1xuICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVGb2N1c1RyYXBTdGF0ZSgpO1xuICAgIHRoaXMuX21vZGVDaGFuZ2VkLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9tb2RlOiBNYXREcmF3ZXJNb2RlID0gJ292ZXInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkcmF3ZXIgY2FuIGJlIGNsb3NlZCB3aXRoIHRoZSBlc2NhcGUga2V5IG9yIGJ5IGNsaWNraW5nIG9uIHRoZSBiYWNrZHJvcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVDbG9zZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVDbG9zZTsgfVxuICBzZXQgZGlzYWJsZUNsb3NlKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVDbG9zZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZGlzYWJsZUNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgZm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGF1dG9tYXRpY2FsbHkgd2hlbiBvcGVuZWQuXG4gICAqIERlZmF1bHRzIHRvIGZhbHNlIGluIHdoZW4gYG1vZGVgIGlzIHNldCB0byBgc2lkZWAsIG90aGVyd2lzZSBkZWZhdWx0cyB0byBgdHJ1ZWAuIElmIGV4cGxpY2l0bHlcbiAgICogZW5hYmxlZCwgZm9jdXMgd2lsbCBiZSBtb3ZlZCBpbnRvIHRoZSBzaWRlbmF2IGluIGBzaWRlYCBtb2RlIGFzIHdlbGwuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvciBBdXRvRm9jdXNUYXJnZXRcbiAgICogaW5zdGVhZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvRm9jdXMoKTogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hdXRvRm9jdXM7XG5cbiAgICAvLyBOb3RlIHRoYXQgdXN1YWxseSB3ZSBkb24ndCBhbGxvdyBhdXRvRm9jdXMgdG8gYmUgc2V0IHRvIGBmaXJzdC10YWJiYWJsZWAgaW4gYHNpZGVgIG1vZGUsXG4gICAgLy8gYmVjYXVzZSB3ZSBkb24ndCBrbm93IGhvdyB0aGUgc2lkZW5hdiBpcyBiZWluZyB1c2VkLCBidXQgaW4gc29tZSBjYXNlcyBpdCBzdGlsbCBtYWtlc1xuICAgIC8vIHNlbnNlIHRvIGRvIGl0LiBUaGUgY29uc3VtZXIgY2FuIGV4cGxpY2l0bHkgc2V0IGBhdXRvRm9jdXNgLlxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSAnc2lkZScpIHtcbiAgICAgICAgcmV0dXJuICdkaWFsb2cnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdmaXJzdC10YWJiYWJsZSc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzZXQgYXV0b0ZvY3VzKHZhbHVlOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgIHZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2F1dG9Gb2N1cyA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2F1dG9Gb2N1czogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGlzIG9wZW5lZC4gV2Ugb3ZlcmxvYWQgdGhpcyBiZWNhdXNlIHdlIHRyaWdnZXIgYW4gZXZlbnQgd2hlbiBpdFxuICAgKiBzdGFydHMgb3IgZW5kLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMudG9nZ2xlKGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkpOyB9XG4gIHByaXZhdGUgX29wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBIb3cgdGhlIHNpZGVuYXYgd2FzIG9wZW5lZCAoa2V5cHJlc3MsIG1vdXNlIGNsaWNrIGV0Yy4pICovXG4gIHByaXZhdGUgX29wZW5lZFZpYTogRm9jdXNPcmlnaW4gfCBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvblN0YXJ0ZWQgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGRyYXdlciBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkVuZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBzaWRlbmF2IGFuaW1hdGlvbi4gKi9cbiAgLy8gQEhvc3RCaW5kaW5nIGlzIHVzZWQgaW4gdGhlIGNsYXNzIGFzIGl0IGlzIGV4cGVjdGVkIHRvIGJlIGV4dGVuZGVkLiAgU2luY2UgQENvbXBvbmVudCBkZWNvcmF0b3JcbiAgLy8gbWV0YWRhdGEgaXMgbm90IGluaGVyaXRlZCBieSBjaGlsZCBjbGFzc2VzLCBpbnN0ZWFkIHRoZSBob3N0IGJpbmRpbmcgZGF0YSBpcyBkZWZpbmVkIGluIGEgd2F5XG4gIC8vIHRoYXQgY2FuIGJlIGluaGVyaXRlZC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0QmluZGluZygnQHRyYW5zZm9ybScpXG4gIF9hbmltYXRpb25TdGF0ZTogJ29wZW4taW5zdGFudCcgfCAnb3BlbicgfCAndm9pZCcgPSAndm9pZCc7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIG9wZW4gc3RhdGUgaXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID1cbiAgICAgIC8vIE5vdGUgdGhpcyBoYXMgdG8gYmUgYXN5bmMgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBpc3N1ZXMgd2l0aCB0d28tYmluZGluZ3MgKHNlZSAjODg3MikuXG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KC8qIGlzQXN5bmMgKi90cnVlKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKVxuICByZWFkb25seSBfb3BlbmVkU3RyZWFtID0gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiBvKSwgbWFwKCgpID0+IHt9KSk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBzdGFydGVkIG9wZW5pbmcuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBvcGVuZWRTdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQucGlwZShcbiAgICBmaWx0ZXIoZSA9PiBlLmZyb21TdGF0ZSAhPT0gZS50b1N0YXRlICYmIGUudG9TdGF0ZS5pbmRleE9mKCdvcGVuJykgPT09IDApLFxuICAgIG1hcFRvKHVuZGVmaW5lZClcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKVxuICByZWFkb25seSBfY2xvc2VkU3RyZWFtID0gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiAhbyksIG1hcCgoKSA9PiB7fSkpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBoYXMgc3RhcnRlZCBjbG9zaW5nLiAqL1xuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgY2xvc2VkU3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9hbmltYXRpb25TdGFydGVkLnBpcGUoXG4gICAgZmlsdGVyKGUgPT4gZS5mcm9tU3RhdGUgIT09IGUudG9TdGF0ZSAmJiBlLnRvU3RhdGUgPT09ICd2b2lkJyksXG4gICAgbWFwVG8odW5kZWZpbmVkKVxuICApO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlcidzIHBvc2l0aW9uIGNoYW5nZXMuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoJ3Bvc2l0aW9uQ2hhbmdlZCcpIHJlYWRvbmx5IG9uUG9zaXRpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgZHJhd2VyIG1vZGUgY2hhbmdlcy4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBkcmF3ZXIgY29udGFpbmVyIHRvXG4gICAqIHRvIGtub3cgd2hlbiB0byB3aGVuIHRoZSBtb2RlIGNoYW5nZXMgc28gaXQgY2FuIGFkYXB0IHRoZSBtYXJnaW5zIG9uIHRoZSBjb250ZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgX21vZGVDaGFuZ2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2ludGVyYWN0aXZpdHlDaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jOiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RSQVdFUl9DT05UQUlORVIpIHB1YmxpYyBfY29udGFpbmVyPzogTWF0RHJhd2VyQ29udGFpbmVyKSB7XG5cbiAgICB0aGlzLm9wZW5lZENoYW5nZS5zdWJzY3JpYmUoKG9wZW5lZDogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKG9wZW5lZCkge1xuICAgICAgICBpZiAodGhpcy5fZG9jKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSB0aGlzLl9kb2MuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Rha2VGb2N1cygpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9pc0ZvY3VzV2l0aGluRHJhd2VyKCkpIHtcbiAgICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKHRoaXMuX29wZW5lZFZpYSB8fCAncHJvZ3JhbScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIGBrZXlkb3duYCBldmVudHMgb3V0c2lkZSB0aGUgem9uZSBzbyB0aGF0IGNoYW5nZSBkZXRlY3Rpb24gaXMgbm90IHJ1biBldmVyeVxuICAgICAqIHRpbWUgYSBrZXkgaXMgcHJlc3NlZC4gSW5zdGVhZCB3ZSByZS1lbnRlciB0aGUgem9uZSBvbmx5IGlmIHRoZSBgRVNDYCBrZXkgaXMgcHJlc3NlZFxuICAgICAqIGFuZCB3ZSBkb24ndCBoYXZlIGNsb3NlIGRpc2FibGVkLlxuICAgICAqL1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIChmcm9tRXZlbnQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAna2V5ZG93bicpIGFzIE9ic2VydmFibGU8S2V5Ym9hcmRFdmVudD4pLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgICApLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiB4LmZyb21TdGF0ZSA9PT0geS5mcm9tU3RhdGUgJiYgeC50b1N0YXRlID09PSB5LnRvU3RhdGU7XG4gICAgfSkpLnN1YnNjcmliZSgoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB7ZnJvbVN0YXRlLCB0b1N0YXRlfSA9IGV2ZW50O1xuXG4gICAgICBpZiAoKHRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwICYmIGZyb21TdGF0ZSA9PT0gJ3ZvaWQnKSB8fFxuICAgICAgICAgICh0b1N0YXRlID09PSAndm9pZCcgJiYgZnJvbVN0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCh0aGlzLl9vcGVuZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHByb3ZpZGVkIGVsZW1lbnQuIElmIHRoZSBlbGVtZW50IGlzIG5vdCBmb2N1c2FibGUsIGl0IHdpbGwgYWRkIGEgdGFiSW5kZXhcbiAgICogYXR0cmlidXRlIHRvIGZvcmNlZnVsbHkgZm9jdXMgaXQuIFRoZSBhdHRyaWJ1dGUgaXMgcmVtb3ZlZCBhZnRlciBmb2N1cyBpcyBtb3ZlZC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZm9jdXMuXG4gICAqL1xuICBwcml2YXRlIF9mb3JjZUZvY3VzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLl9pbnRlcmFjdGl2aXR5Q2hlY2tlci5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xuICAgICAgZWxlbWVudC50YWJJbmRleCA9IC0xO1xuICAgICAgLy8gVGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBzaG91bGQgYmUgcmVtb3ZlZCB0byBhdm9pZCBuYXZpZ2F0aW5nIHRvIHRoYXQgZWxlbWVudCBhZ2FpblxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JykpO1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3RvciB3aXRoaW4gdGhlIGZvY3VzIHRyYXAuXG4gICAqIEBwYXJhbSBzZWxlY3RvciBUaGUgQ1NTIHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudCB0byBzZXQgZm9jdXMgdG8uXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0J5Q3NzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGxldCBlbGVtZW50VG9Gb2N1cyA9XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmIChlbGVtZW50VG9Gb2N1cykge1xuICAgICAgdGhpcy5fZm9yY2VGb2N1cyhlbGVtZW50VG9Gb2N1cywgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIGZvY3VzIGludG8gdGhlIGRyYXdlci4gTm90ZSB0aGF0IHRoaXMgd29ya3MgZXZlbiBpZlxuICAgKiB0aGUgZm9jdXMgdHJhcCBpcyBkaXNhYmxlZCBpbiBgc2lkZWAgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgX3Rha2VGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgb24gdGhlIHNpZGVuYXYsIGlmIHRoZSBlbGVtZW50IGNhbm5vdCBiZSBmb2N1c2VkIG9yIGRvZXNcbiAgICAvLyBub3QgZXhpc3QsIGZvY3VzIHRoZSBzaWRlbmF2IGl0c2VsZiBzbyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvbiBzdGlsbCB3b3Jrcy5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHRoYXQgYGZvY3VzYCBpcyBhIGZ1bmN0aW9uIGR1ZSB0byBVbml2ZXJzYWwuXG4gICAgc3dpdGNoICh0aGlzLmF1dG9Gb2N1cykge1xuICAgICAgY2FzZSBmYWxzZTpcbiAgICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgIGNhc2UgJ2ZpcnN0LXRhYmJhYmxlJzpcbiAgICAgICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKS50aGVuKGhhc01vdmVkRm9jdXMgPT4ge1xuICAgICAgICAgIGlmICghaGFzTW92ZWRGb2N1cyAmJiB0eXBlb2YgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmaXJzdC1oZWFkaW5nJzpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBbcm9sZT1cImhlYWRpbmdcIl0nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IodGhpcy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIG9yaWdpbmFsbHkgZm9jdXNlZCB3aGVuIHRoZSBkcmF3ZXIgb3BlbmVkLlxuICAgKiBJZiBubyBlbGVtZW50IHdhcyBmb2N1c2VkIGF0IHRoYXQgdGltZSwgdGhlIGZvY3VzIHdpbGwgYmUgcmVzdG9yZWQgdG8gdGhlIGRyYXdlci5cbiAgICovXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cyhmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4pIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMgPT09ICdkaWFsb2cnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQsIGZvY3VzT3JpZ2luKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCA9IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgd2l0aGluIHRoZSBkcmF3ZXIuICovXG4gIHByaXZhdGUgX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWN0aXZlRWwgPSB0aGlzLl9kb2M/LmFjdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuICEhYWN0aXZlRWwgJiYgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gRW5hYmxlIHRoZSBhbmltYXRpb25zIGFmdGVyIHRoZSBsaWZlY3ljbGUgaG9va3MgaGF2ZSBydW4sIGluIG9yZGVyIHRvIGF2b2lkIGFuaW1hdGluZ1xuICAgIC8vIGRyYXdlcnMgdGhhdCBhcmUgb3BlbiBieSBkZWZhdWx0LiBXaGVuIHdlJ3JlIG9uIHRoZSBzZXJ2ZXIsIHdlIHNob3VsZG4ndCBlbmFibGUgdGhlXG4gICAgLy8gYW5pbWF0aW9ucywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBkcmF3ZXIgdG8gYW5pbWF0ZSB0aGUgZmlyc3QgdGltZSB0aGUgdXNlciBzZWVzXG4gICAgLy8gdGhlIHBhZ2UuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fZW5hYmxlQW5pbWF0aW9ucyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hbmltYXRpb25TdGFydGVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uRW5kLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIG9wZW5lZFZpYSBXaGV0aGVyIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZCBieSBhIGtleSBwcmVzcywgbW91c2UgY2xpY2sgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogVXNlZCBmb3IgZm9jdXMgbWFuYWdlbWVudCBhZnRlciB0aGUgc2lkZW5hdiBpcyBjbG9zZWQuXG4gICAqL1xuICBvcGVuKG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGUodHJ1ZSwgb3BlbmVkVmlhKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgZHJhd2VyLiAqL1xuICBjbG9zZSgpOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZShmYWxzZSk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBkcmF3ZXIgd2l0aCBjb250ZXh0IHRoYXQgdGhlIGJhY2tkcm9wIHdhcyBjbGlja2VkLiAqL1xuICBfY2xvc2VWaWFCYWNrZHJvcENsaWNrKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgLy8gSWYgdGhlIGRyYXdlciBpcyBjbG9zZWQgdXBvbiBhIGJhY2tkcm9wIGNsaWNrLCB3ZSBhbHdheXMgd2FudCB0byByZXN0b3JlIGZvY3VzLiBXZVxuICAgIC8vIGRvbid0IG5lZWQgdG8gY2hlY2sgd2hldGhlciBmb2N1cyBpcyBjdXJyZW50bHkgaW4gdGhlIGRyYXdlciwgYXMgY2xpY2tpbmcgb24gdGhlXG4gICAgLy8gYmFja2Ryb3AgY2F1c2VzIGJsdXJzIHRoZSBhY3RpdmUgZWxlbWVudC5cbiAgICByZXR1cm4gdGhpcy5fc2V0T3BlbigvKiBpc09wZW4gKi8gZmFsc2UsIC8qIHJlc3RvcmVGb2N1cyAqLyB0cnVlLCAnbW91c2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgdGhpcyBkcmF3ZXIuXG4gICAqIEBwYXJhbSBpc09wZW4gV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBiZSBvcGVuLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIHRvZ2dsZShpc09wZW46IGJvb2xlYW4gPSAhdGhpcy5vcGVuZWQsIG9wZW5lZFZpYT86IEZvY3VzT3JpZ2luKVxuICAgICAgOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIC8vIElmIHRoZSBmb2N1cyBpcyBjdXJyZW50bHkgaW5zaWRlIHRoZSBkcmF3ZXIgY29udGVudCBhbmQgd2UgYXJlIGNsb3NpbmcgdGhlIGRyYXdlcixcbiAgICAvLyByZXN0b3JlIHRoZSBmb2N1cyB0byB0aGUgaW5pdGlhbGx5IGZvY3VzZWQgZWxlbWVudCAod2hlbiB0aGUgZHJhd2VyIG9wZW5lZCkuXG4gICAgaWYgKGlzT3BlbiAmJiBvcGVuZWRWaWEpIHtcbiAgICAgIHRoaXMuX29wZW5lZFZpYSA9IG9wZW5lZFZpYTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9zZXRPcGVuKGlzT3BlbiwgLyogcmVzdG9yZUZvY3VzICovICFpc09wZW4gJiYgdGhpcy5faXNGb2N1c1dpdGhpbkRyYXdlcigpLFxuICAgICAgdGhpcy5fb3BlbmVkVmlhIHx8ICdwcm9ncmFtJyk7XG5cbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgdGhpcy5fb3BlbmVkVmlhID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIG9wZW5lZCBzdGF0ZSBvZiB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gaXNPcGVuIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgb3BlbiBvciBjbG9zZS5cbiAgICogQHBhcmFtIHJlc3RvcmVGb2N1cyBXaGV0aGVyIGZvY3VzIHNob3VsZCBiZSByZXN0b3JlZCBvbiBjbG9zZS5cbiAgICogQHBhcmFtIGZvY3VzT3JpZ2luIE9yaWdpbiB0byB1c2Ugd2hlbiByZXN0b3JpbmcgZm9jdXMuXG4gICAqL1xuICBwcml2YXRlIF9zZXRPcGVuKGlzT3BlbjogYm9vbGVhbiwgcmVzdG9yZUZvY3VzOiBib29sZWFuLCBmb2N1c09yaWdpbjogRXhjbHVkZTxGb2N1c09yaWdpbiwgbnVsbD4pOlxuICAgIFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgdGhpcy5fb3BlbmVkID0gaXNPcGVuO1xuXG4gICAgaWYgKGlzT3Blbikge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLl9lbmFibGVBbmltYXRpb25zID8gJ29wZW4nIDogJ29wZW4taW5zdGFudCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgICAgaWYgKHJlc3RvcmVGb2N1cykge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoZm9jdXNPcmlnaW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wZW4gPT4gcmVzb2x2ZShvcGVuID8gJ29wZW4nIDogJ2Nsb3NlJykpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA/ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMCkgOiAwO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGVuYWJsZWQgc3RhdGUgb2YgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCkge1xuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIC8vIFRoZSBmb2N1cyB0cmFwIGlzIG9ubHkgZW5hYmxlZCB3aGVuIHRoZSBkcmF3ZXIgaXMgb3BlbiBpbiBhbnkgbW9kZSBvdGhlciB0aGFuIHNpZGUuXG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZW5hYmxlZCA9IHRoaXMub3BlbmVkICYmIHRoaXMubW9kZSAhPT0gJ3NpZGUnO1xuICAgIH1cbiAgfVxuXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdAdHJhbnNmb3JtLnN0YXJ0JywgWyckZXZlbnQnXSlcbiAgX2FuaW1hdGlvblN0YXJ0TGlzdGVuZXIoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdAdHJhbnNmb3JtLmRvbmUnLCBbJyRldmVudCddKVxuICBfYW5pbWF0aW9uRG9uZUxpc3RlbmVyKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkVuZC5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQ2xvc2U6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9Gb2N1czogQXV0b0ZvY3VzVGFyZ2V0IHwgc3RyaW5nIHwgQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3BlbmVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqXG4gKiBgPG1hdC1kcmF3ZXItY29udGFpbmVyPmAgY29tcG9uZW50LlxuICpcbiAqIFRoaXMgaXMgdGhlIHBhcmVudCBjb21wb25lbnQgdG8gb25lIG9yIHR3byBgPG1hdC1kcmF3ZXI+YHMgdGhhdCB2YWxpZGF0ZXMgdGhlIHN0YXRlIGludGVybmFsbHlcbiAqIGFuZCBjb29yZGluYXRlcyB0aGUgYmFja2Ryb3AgYW5kIGNvbnRlbnQgc3R5bGluZy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRyYXdlci1jb250YWluZXInLFxuICBleHBvcnRBczogJ21hdERyYXdlckNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnZHJhd2VyLWNvbnRhaW5lci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RyYXdlci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyLWNvbnRhaW5lcicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLWNvbnRhaW5lci1leHBsaWNpdC1iYWNrZHJvcF0nOiAnX2JhY2tkcm9wT3ZlcnJpZGUnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9EUkFXRVJfQ09OVEFJTkVSLFxuICAgIHVzZUV4aXN0aW5nOiBNYXREcmF3ZXJDb250YWluZXJcbiAgfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyQ29udGFpbmVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgLyoqIEFsbCBkcmF3ZXJzIGluIHRoZSBjb250YWluZXIuIEluY2x1ZGVzIGRyYXdlcnMgZnJvbSBpbnNpZGUgbmVzdGVkIGNvbnRhaW5lcnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0RHJhd2VyLCB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYGRlc2NlbmRhbnRzOiB0cnVlYCwgYmVjYXVzZSBJdnkgd2lsbCBubyBsb25nZXIgbWF0Y2hcbiAgICAvLyBpbmRpcmVjdCBkZXNjZW5kYW50cyBpZiBpdCdzIGxlZnQgYXMgZmFsc2UuXG4gICAgZGVzY2VuZGFudHM6IHRydWVcbiAgfSlcbiAgX2FsbERyYXdlcnM6IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+O1xuXG4gIC8qKiBEcmF3ZXJzIHRoYXQgYmVsb25nIHRvIHRoaXMgY29udGFpbmVyLiAqL1xuICBfZHJhd2VycyA9IG5ldyBRdWVyeUxpc3Q8TWF0RHJhd2VyPigpO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0RHJhd2VyQ29udGVudCkgX2NvbnRlbnQ6IE1hdERyYXdlckNvbnRlbnQ7XG4gIEBWaWV3Q2hpbGQoTWF0RHJhd2VyQ29udGVudCkgX3VzZXJDb250ZW50OiBNYXREcmF3ZXJDb250ZW50O1xuXG4gIC8qKiBUaGUgZHJhd2VyIGNoaWxkIHdpdGggdGhlIGBzdGFydGAgcG9zaXRpb24uICovXG4gIGdldCBzdGFydCgpOiBNYXREcmF3ZXIgfCBudWxsIHsgcmV0dXJuIHRoaXMuX3N0YXJ0OyB9XG5cbiAgLyoqIFRoZSBkcmF3ZXIgY2hpbGQgd2l0aCB0aGUgYGVuZGAgcG9zaXRpb24uICovXG4gIGdldCBlbmQoKTogTWF0RHJhd2VyIHwgbnVsbCB7IHJldHVybiB0aGlzLl9lbmQ7IH1cblxuICAvKipcbiAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHJlc2l6ZSB0aGUgY29udGFpbmVyIHdoZW5ldmVyXG4gICAqIHRoZSBzaXplIG9mIGFueSBvZiBpdHMgZHJhd2VycyBjaGFuZ2VzLlxuICAgKlxuICAgKiAqKlVzZSBhdCB5b3VyIG93biByaXNrISoqIEVuYWJsaW5nIHRoaXMgb3B0aW9uIGNhbiBjYXVzZSBsYXlvdXQgdGhyYXNoaW5nIGJ5IG1lYXN1cmluZ1xuICAgKiB0aGUgZHJhd2VycyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLiBDYW4gYmUgY29uZmlndXJlZCBnbG9iYWxseSB2aWEgdGhlXG4gICAqIGBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVgIHRva2VuLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9zaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fYXV0b3NpemU7IH1cbiAgc2V0IGF1dG9zaXplKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2F1dG9zaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9hdXRvc2l6ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGNvbnRhaW5lciBzaG91bGQgaGF2ZSBhIGJhY2tkcm9wIHdoaWxlIG9uZSBvZiB0aGUgc2lkZW5hdnMgaXMgb3Blbi5cbiAgICogSWYgZXhwbGljaXRseSBzZXQgdG8gYHRydWVgLCB0aGUgYmFja2Ryb3Agd2lsbCBiZSBlbmFibGVkIGZvciBkcmF3ZXJzIGluIHRoZSBgc2lkZWBcbiAgICogbW9kZSBhcyB3ZWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGhhc0JhY2tkcm9wKCkge1xuICAgIGlmICh0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID09IG51bGwpIHtcbiAgICAgIHJldHVybiAhdGhpcy5fc3RhcnQgfHwgdGhpcy5fc3RhcnQubW9kZSAhPT0gJ3NpZGUnIHx8ICF0aGlzLl9lbmQgfHwgdGhpcy5fZW5kLm1vZGUgIT09ICdzaWRlJztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fYmFja2Ryb3BPdmVycmlkZTtcbiAgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGUgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgX2JhY2tkcm9wT3ZlcnJpZGU6IGJvb2xlYW4gfCBudWxsO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBiYWNrZHJvcCBpcyBjbGlja2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYmFja2Ryb3BDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZHJhd2VyIGF0IHRoZSBzdGFydC9lbmQgcG9zaXRpb24sIGluZGVwZW5kZW50IG9mIGRpcmVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc3RhcnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX2VuZDogTWF0RHJhd2VyIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIGRyYXdlciBhdCB0aGUgbGVmdC9yaWdodC4gV2hlbiBkaXJlY3Rpb24gY2hhbmdlcywgdGhlc2Ugd2lsbCBjaGFuZ2UgYXMgd2VsbC5cbiAgICogVGhleSdyZSB1c2VkIGFzIGFsaWFzZXMgZm9yIHRoZSBhYm92ZSB0byBzZXQgdGhlIGxlZnQvcmlnaHQgc3R5bGUgcHJvcGVybHkuXG4gICAqIEluIExUUiwgX2xlZnQgPT0gX3N0YXJ0IGFuZCBfcmlnaHQgPT0gX2VuZC5cbiAgICogSW4gUlRMLCBfbGVmdCA9PSBfZW5kIGFuZCBfcmlnaHQgPT0gX3N0YXJ0LlxuICAgKi9cbiAgcHJpdmF0ZSBfbGVmdDogTWF0RHJhd2VyIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcmlnaHQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIG9uIGV2ZXJ5IG5nRG9DaGVjay4gVXNlZCBmb3IgZGVib3VuY2luZyByZWZsb3dzLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kb0NoZWNrU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIE1hcmdpbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY29udGVudC4gVGhlc2UgYXJlIHVzZWQgdG8gcHVzaCAvIHNocmluayB0aGUgZHJhd2VyIGNvbnRlbnQgd2hlbiBhXG4gICAqIGRyYXdlciBpcyBvcGVuLiBXZSB1c2UgbWFyZ2luIHJhdGhlciB0aGFuIHRyYW5zZm9ybSBldmVuIGZvciBwdXNoIG1vZGUgYmVjYXVzZSB0cmFuc2Zvcm0gYnJlYWtzXG4gICAqIGZpeGVkIHBvc2l0aW9uIGVsZW1lbnRzIGluc2lkZSBvZiB0aGUgdHJhbnNmb3JtZWQgZWxlbWVudC5cbiAgICovXG4gIF9jb250ZW50TWFyZ2luczoge2xlZnQ6IG51bWJlcnxudWxsLCByaWdodDogbnVtYmVyfG51bGx9ID0ge2xlZnQ6IG51bGwsIHJpZ2h0OiBudWxsfTtcblxuICByZWFkb25seSBfY29udGVudE1hcmdpbkNoYW5nZXMgPSBuZXcgU3ViamVjdDx7bGVmdDogbnVtYmVyfG51bGwsIHJpZ2h0OiBudW1iZXJ8bnVsbH0+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgQ2RrU2Nyb2xsYWJsZSBpbnN0YW5jZSB0aGF0IHdyYXBzIHRoZSBzY3JvbGxhYmxlIGNvbnRlbnQuICovXG4gIGdldCBzY3JvbGxhYmxlKCk6IENka1Njcm9sbGFibGUge1xuICAgIHJldHVybiB0aGlzLl91c2VyQ29udGVudCB8fCB0aGlzLl9jb250ZW50O1xuICB9XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFKSBkZWZhdWx0QXV0b3NpemUgPSBmYWxzZSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcblxuICAgIC8vIElmIGEgYERpcmAgZGlyZWN0aXZlIGV4aXN0cyB1cCB0aGUgdHJlZSwgbGlzdGVuIGRpcmVjdGlvbiBjaGFuZ2VzXG4gICAgLy8gYW5kIHVwZGF0ZSB0aGUgbGVmdC9yaWdodCBwcm9wZXJ0aWVzIHRvIHBvaW50IHRvIHRoZSBwcm9wZXIgc3RhcnQvZW5kLlxuICAgIGlmIChfZGlyKSB7XG4gICAgICBfZGlyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZURyYXdlcnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIG1pbmltdW0gd2lkdGggb2YgdGhlIHNpZGVuYXYgZGVwZW5kcyBvbiB0aGUgdmlld3BvcnQgd2lkdGgsXG4gICAgLy8gd2UgbmVlZCB0byByZWNvbXB1dGUgdGhlIG1hcmdpbnMgaWYgdGhlIHZpZXdwb3J0IGNoYW5nZXMuXG4gICAgdmlld3BvcnRSdWxlci5jaGFuZ2UoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKSk7XG5cbiAgICB0aGlzLl9hdXRvc2l6ZSA9IGRlZmF1bHRBdXRvc2l6ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9hbGxEcmF3ZXJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9hbGxEcmF3ZXJzKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKChkcmF3ZXI6IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+KSA9PiB7XG4gICAgICAgIHRoaXMuX2RyYXdlcnMucmVzZXQoZHJhd2VyLmZpbHRlcihpdGVtID0+ICFpdGVtLl9jb250YWluZXIgfHwgaXRlbS5fY29udGFpbmVyID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RyYXdlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2RyYXdlcnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuXG4gICAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goKGRyYXdlcjogTWF0RHJhd2VyKSA9PiB7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyVG9nZ2xlKGRyYXdlcik7XG4gICAgICAgIHRoaXMuX3dhdGNoRHJhd2VyUG9zaXRpb24oZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0aGlzLl9kcmF3ZXJzLmxlbmd0aCB8fFxuICAgICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgfHxcbiAgICAgICAgICB0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fZW5kKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgaGl0dGluZyB0aGUgTmdab25lIHRocm91Z2ggdGhlIGRlYm91bmNlIHRpbWVvdXQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0LnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgxMCksIC8vIEFyYml0cmFyeSBkZWJvdW5jZSB0aW1lLCBsZXNzIHRoYW4gYSBmcmFtZSBhdCA2MGZwc1xuICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2NvbnRlbnRNYXJnaW5DaGFuZ2VzLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZG9DaGVja1N1YmplY3QuY29tcGxldGUoKTtcbiAgICB0aGlzLl9kcmF3ZXJzLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBvcGVuYCBvZiBib3RoIHN0YXJ0IGFuZCBlbmQgZHJhd2VycyAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyLm9wZW4oKSk7XG4gIH1cblxuICAvKiogQ2FsbHMgYGNsb3NlYCBvZiBib3RoIHN0YXJ0IGFuZCBlbmQgZHJhd2VycyAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5jbG9zZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgYW5kIHVwZGF0ZXMgdGhlIGlubGluZSBzdHlsZXMgZm9yIHRoZSBjb250ZW50LiBOb3RlIHRoYXQgdGhpcyBzaG91bGQgYmUgdXNlZFxuICAgKiBzcGFyaW5nbHksIGJlY2F1c2UgaXQgY2F1c2VzIGEgcmVmbG93LlxuICAgKi9cbiAgdXBkYXRlQ29udGVudE1hcmdpbnMoKSB7XG4gICAgLy8gMS4gRm9yIGRyYXdlcnMgaW4gYG92ZXJgIG1vZGUsIHRoZXkgZG9uJ3QgYWZmZWN0IHRoZSBjb250ZW50LlxuICAgIC8vIDIuIEZvciBkcmF3ZXJzIGluIGBzaWRlYCBtb2RlIHRoZXkgc2hvdWxkIHNocmluayB0aGUgY29udGVudC4gV2UgZG8gdGhpcyBieSBhZGRpbmcgdG8gdGhlXG4gICAgLy8gICAgbGVmdCBtYXJnaW4gKGZvciBsZWZ0IGRyYXdlcikgb3IgcmlnaHQgbWFyZ2luIChmb3IgcmlnaHQgdGhlIGRyYXdlcikuXG4gICAgLy8gMy4gRm9yIGRyYXdlcnMgaW4gYHB1c2hgIG1vZGUgdGhlIHNob3VsZCBzaGlmdCB0aGUgY29udGVudCB3aXRob3V0IHJlc2l6aW5nIGl0LiBXZSBkbyB0aGlzIGJ5XG4gICAgLy8gICAgYWRkaW5nIHRvIHRoZSBsZWZ0IG9yIHJpZ2h0IG1hcmdpbiBhbmQgc2ltdWx0YW5lb3VzbHkgc3VidHJhY3RpbmcgdGhlIHNhbWUgYW1vdW50IG9mXG4gICAgLy8gICAgbWFyZ2luIGZyb20gdGhlIG90aGVyIHNpZGUuXG4gICAgbGV0IGxlZnQgPSAwO1xuICAgIGxldCByaWdodCA9IDA7XG5cbiAgICBpZiAodGhpcy5fbGVmdCAmJiB0aGlzLl9sZWZ0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX2xlZnQubW9kZSA9PSAnc2lkZScpIHtcbiAgICAgICAgbGVmdCArPSB0aGlzLl9sZWZ0Ll9nZXRXaWR0aCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3B1c2gnKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fbGVmdC5fZ2V0V2lkdGgoKTtcbiAgICAgICAgbGVmdCArPSB3aWR0aDtcbiAgICAgICAgcmlnaHQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JpZ2h0ICYmIHRoaXMuX3JpZ2h0Lm9wZW5lZCkge1xuICAgICAgaWYgKHRoaXMuX3JpZ2h0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIHJpZ2h0ICs9IHRoaXMuX3JpZ2h0Ll9nZXRXaWR0aCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdwdXNoJykge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3JpZ2h0Ll9nZXRXaWR0aCgpO1xuICAgICAgICByaWdodCArPSB3aWR0aDtcbiAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBlaXRoZXIgYHJpZ2h0YCBvciBgbGVmdGAgaXMgemVybywgZG9uJ3Qgc2V0IGEgc3R5bGUgdG8gdGhlIGVsZW1lbnQuIFRoaXNcbiAgICAvLyBhbGxvd3MgdXNlcnMgdG8gc3BlY2lmeSBhIGN1c3RvbSBzaXplIHZpYSBDU1MgY2xhc3MgaW4gU1NSIHNjZW5hcmlvcyB3aGVyZSB0aGVcbiAgICAvLyBtZWFzdXJlZCB3aWR0aHMgd2lsbCBhbHdheXMgYmUgemVyby4gTm90ZSB0aGF0IHdlIHJlc2V0IHRvIGBudWxsYCBoZXJlLCByYXRoZXJcbiAgICAvLyB0aGFuIGJlbG93LCBpbiBvcmRlciB0byBlbnN1cmUgdGhhdCB0aGUgdHlwZXMgaW4gdGhlIGBpZmAgYmVsb3cgYXJlIGNvbnNpc3RlbnQuXG4gICAgbGVmdCA9IGxlZnQgfHwgbnVsbCE7XG4gICAgcmlnaHQgPSByaWdodCB8fCBudWxsITtcblxuICAgIGlmIChsZWZ0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5sZWZ0IHx8IHJpZ2h0ICE9PSB0aGlzLl9jb250ZW50TWFyZ2lucy5yaWdodCkge1xuICAgICAgdGhpcy5fY29udGVudE1hcmdpbnMgPSB7bGVmdCwgcmlnaHR9O1xuXG4gICAgICAvLyBQdWxsIGJhY2sgaW50byB0aGUgTmdab25lIHNpbmNlIGluIHNvbWUgY2FzZXMgd2UgY291bGQgYmUgb3V0c2lkZS4gV2UgbmVlZCB0byBiZSBjYXJlZnVsXG4gICAgICAvLyB0byBkbyBpdCBvbmx5IHdoZW4gc29tZXRoaW5nIGNoYW5nZWQsIG90aGVyd2lzZSB3ZSBjYW4gZW5kIHVwIGhpdHRpbmcgdGhlIHpvbmUgdG9vIG9mdGVuLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5uZXh0KHRoaXMuX2NvbnRlbnRNYXJnaW5zKSk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIElmIHVzZXJzIG9wdGVkIGludG8gYXV0b3NpemluZywgZG8gYSBjaGVjayBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmICh0aGlzLl9hdXRvc2l6ZSAmJiB0aGlzLl9pc1B1c2hlZCgpKSB7XG4gICAgICAvLyBSdW4gb3V0c2lkZSB0aGUgTmdab25lLCBvdGhlcndpc2UgdGhlIGRlYm91bmNlciB3aWxsIHRocm93IHVzIGludG8gYW4gaW5maW5pdGUgbG9vcC5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLl9kb0NoZWNrU3ViamVjdC5uZXh0KCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBldmVudHMgaW4gb3JkZXIgdG8gc2V0IGEgY2xhc3Mgb24gdGhlIG1haW4gY29udGFpbmVyIGVsZW1lbnQgd2hlbiB0aGVcbiAgICogZHJhd2VyIGlzIG9wZW4gYW5kIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiBUaGlzIGVuc3VyZXMgYW55IG92ZXJmbG93IG9uIHRoZSBjb250YWluZXIgZWxlbWVudFxuICAgKiBpcyBwcm9wZXJseSBoaWRkZW4uXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclRvZ2dsZShkcmF3ZXI6IE1hdERyYXdlcik6IHZvaWQge1xuICAgIGRyYXdlci5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgICAgZmlsdGVyKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IGV2ZW50LmZyb21TdGF0ZSAhPT0gZXZlbnQudG9TdGF0ZSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSxcbiAgICApXG4gICAgLnN1YnNjcmliZSgoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICAvLyBTZXQgdGhlIHRyYW5zaXRpb24gY2xhc3Mgb24gdGhlIGNvbnRhaW5lciBzbyB0aGF0IHRoZSBhbmltYXRpb25zIG9jY3VyLiBUaGlzIHNob3VsZCBub3RcbiAgICAgIC8vIGJlIHNldCBpbml0aWFsbHkgYmVjYXVzZSBhbmltYXRpb25zIHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZCB2aWEgYSBjaGFuZ2UgaW4gc3RhdGUuXG4gICAgICBpZiAoZXZlbnQudG9TdGF0ZSAhPT0gJ29wZW4taW5zdGFudCcgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWRyYXdlci10cmFuc2l0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgaWYgKGRyYXdlci5tb2RlICE9PSAnc2lkZScpIHtcbiAgICAgIGRyYXdlci5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZHJhd2Vycy5jaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+XG4gICAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyQ2xhc3MoZHJhd2VyLm9wZW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBvblBvc2l0aW9uQ2hhbmdlZCBldmVudCBpbiBvcmRlciB0b1xuICAgKiByZS12YWxpZGF0ZSBkcmF3ZXJzIHdoZW4gdGhlIHBvc2l0aW9uIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTk9URTogV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IGJlZm9yZSB2YWxpZGF0aW5nLFxuICAgIC8vIHNpbmNlIGJvdGggZHJhd2VycyBtYXkgYmUgc3dhcHBpbmcgcG9zaXRpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgZHJhd2VyLm9uUG9zaXRpb25DaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlRHJhd2VycygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIGRyYXdlciBtb2RlIHNvIHdlIGNhbiBydW4gY2hhbmdlIGRldGVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJNb2RlKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKGRyYXdlcikge1xuICAgICAgZHJhd2VyLl9tb2RlQ2hhbmdlZC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9kcmF3ZXJzLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3llZCkpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRNYXJnaW5zKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSAnbWF0LWRyYXdlci1vcGVuZWQnIGNsYXNzIG9uIHRoZSBtYWluICdtYXQtZHJhd2VyLWNvbnRhaW5lcicgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfc2V0Q29udGFpbmVyQ2xhc3MoaXNBZGQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9ICdtYXQtZHJhd2VyLWNvbnRhaW5lci1oYXMtb3Blbic7XG5cbiAgICBpZiAoaXNBZGQpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIGRyYXdlciBjaGlsZHJlbiBjb21wb25lbnRzLiAqL1xuICBwcml2YXRlIF92YWxpZGF0ZURyYXdlcnMoKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB0aGlzLl9lbmQgPSBudWxsO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhdCBtb3N0IG9uZSBzdGFydCBhbmQgb25lIGVuZCBkcmF3ZXIuXG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiB7XG4gICAgICBpZiAoZHJhd2VyLnBvc2l0aW9uID09ICdlbmQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmQgIT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdlbmQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbmQgPSBkcmF3ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnQgIT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICAgIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKCdzdGFydCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YXJ0ID0gZHJhd2VyO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9sZWZ0ID0gbnVsbDtcblxuICAgIC8vIERldGVjdCBpZiB3ZSdyZSBMVFIgb3IgUlRMLlxuICAgIGlmICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX2VuZDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fc3RhcnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xlZnQgPSB0aGlzLl9zdGFydDtcbiAgICAgIHRoaXMuX3JpZ2h0ID0gdGhpcy5fZW5kO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb250YWluZXIgaXMgYmVpbmcgcHVzaGVkIHRvIHRoZSBzaWRlIGJ5IG9uZSBvZiB0aGUgZHJhd2Vycy4gKi9cbiAgcHJpdmF0ZSBfaXNQdXNoZWQoKSB7XG4gICAgcmV0dXJuICh0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpICYmIHRoaXMuX3N0YXJ0Lm1vZGUgIT0gJ292ZXInKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fZW5kLm1vZGUgIT0gJ292ZXInKTtcbiAgfVxuXG4gIF9vbkJhY2tkcm9wQ2xpY2tlZCgpIHtcbiAgICB0aGlzLmJhY2tkcm9wQ2xpY2suZW1pdCgpO1xuICAgIHRoaXMuX2Nsb3NlTW9kYWxEcmF3ZXJzVmlhQmFja2Ryb3AoKTtcbiAgfVxuXG4gIF9jbG9zZU1vZGFsRHJhd2Vyc1ZpYUJhY2tkcm9wKCkge1xuICAgIC8vIENsb3NlIGFsbCBvcGVuIGRyYXdlcnMgd2hlcmUgY2xvc2luZyBpcyBub3QgZGlzYWJsZWQgYW5kIHRoZSBtb2RlIGlzIG5vdCBgc2lkZWAuXG4gICAgW3RoaXMuX3N0YXJ0LCB0aGlzLl9lbmRdXG4gICAgICAuZmlsdGVyKGRyYXdlciA9PiBkcmF3ZXIgJiYgIWRyYXdlci5kaXNhYmxlQ2xvc2UgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcikpXG4gICAgICAuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyIS5fY2xvc2VWaWFCYWNrZHJvcENsaWNrKCkpO1xuICB9XG5cbiAgX2lzU2hvd2luZ0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9jYW5IYXZlQmFja2Ryb3AodGhpcy5fc3RhcnQpKSB8fFxuICAgICAgICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fY2FuSGF2ZUJhY2tkcm9wKHRoaXMuX2VuZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FuSGF2ZUJhY2tkcm9wKGRyYXdlcjogTWF0RHJhd2VyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRyYXdlci5tb2RlICE9PSAnc2lkZScgfHwgISF0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNEcmF3ZXJPcGVuKGRyYXdlcjogTWF0RHJhd2VyIHwgbnVsbCk6IGRyYXdlciBpcyBNYXREcmF3ZXIge1xuICAgIHJldHVybiBkcmF3ZXIgIT0gbnVsbCAmJiBkcmF3ZXIub3BlbmVkO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9zaXplOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNCYWNrZHJvcDogQm9vbGVhbklucHV0O1xufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1kcmF3ZXItaW5uZXItY29udGFpbmVyXCIgY2RrU2Nyb2xsYWJsZT5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG4iLCI8ZGl2IGNsYXNzPVwibWF0LWRyYXdlci1iYWNrZHJvcFwiIChjbGljayk9XCJfb25CYWNrZHJvcENsaWNrZWQoKVwiICpuZ0lmPVwiaGFzQmFja2Ryb3BcIlxuICAgICBbY2xhc3MubWF0LWRyYXdlci1zaG93bl09XCJfaXNTaG93aW5nQmFja2Ryb3AoKVwiPjwvZGl2PlxuXG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtZHJhd2VyXCI+PC9uZy1jb250ZW50PlxuXG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtZHJhd2VyLWNvbnRlbnRcIj5cbjwvbmctY29udGVudD5cbjxtYXQtZHJhd2VyLWNvbnRlbnQgKm5nSWY9XCIhX2NvbnRlbnRcIj5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9tYXQtZHJhd2VyLWNvbnRlbnQ+XG4iXX0=