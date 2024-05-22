import { FocusMonitor, FocusTrapFactory, InteractivityChecker, } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { afterNextRender, AfterRenderPhase, ANIMATION_MODULE_TYPE, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, inject, Inject, InjectionToken, Injector, Input, NgZone, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, startWith, take, takeUntil, } from 'rxjs/operators';
import { matDrawerAnimations } from './drawer-animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/bidi";
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawerContent, deps: [{ token: i0.ChangeDetectorRef }, { token: forwardRef(() => MatDrawerContainer) }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.0", type: MatDrawerContent, isStandalone: true, selector: "mat-drawer-content", host: { properties: { "style.margin-left.px": "_container._contentMargins.left", "style.margin-right.px": "_container._contentMargins.right" }, classAttribute: "mat-drawer-content" }, providers: [
            {
                provide: CdkScrollable,
                useExisting: MatDrawerContent,
            },
        ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawerContent, decorators: [{
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
                    providers: [
                        {
                            provide: CdkScrollable,
                            useExisting: MatDrawerContent,
                        },
                    ],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: MatDrawerContainer, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => MatDrawerContainer)]
                }] }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.NgZone }] });
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
export class MatDrawer {
    /** The side that the drawer is attached to. */
    get position() {
        return this._position;
    }
    set position(value) {
        // Make sure we have a valid value.
        value = value === 'end' ? 'end' : 'start';
        if (value !== this._position) {
            // Static inputs in Ivy are set before the element is in the DOM.
            if (this._isAttached) {
                this._updatePositionInParent(value);
            }
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
        if (value === 'true' || value === 'false' || value == null) {
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
    constructor(_elementRef, _focusTrapFactory, _focusMonitor, _platform, _ngZone, _interactivityChecker, _doc, _container) {
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._platform = _platform;
        this._ngZone = _ngZone;
        this._interactivityChecker = _interactivityChecker;
        this._doc = _doc;
        this._container = _container;
        this._focusTrap = null;
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
        this._injector = inject(Injector);
        this.openedChange.pipe(takeUntil(this._destroyed)).subscribe((opened) => {
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
                const callback = () => {
                    element.removeEventListener('blur', callback);
                    element.removeEventListener('mousedown', callback);
                    element.removeAttribute('tabindex');
                };
                element.addEventListener('blur', callback);
                element.addEventListener('mousedown', callback);
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
                afterNextRender(() => {
                    const hasMovedFocus = this._focusTrap.focusInitialElement();
                    if (!hasMovedFocus && typeof element.focus === 'function') {
                        element.focus();
                    }
                }, { injector: this._injector });
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
        const activeEl = this._doc.activeElement;
        return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
    }
    ngAfterViewInit() {
        this._isAttached = true;
        // Only update the DOM position when the sidenav is positioned at
        // the end since we project the sidenav before the content by default.
        if (this._position === 'end') {
            this._updatePositionInParent('end');
        }
        // Needs to happen after the position is updated
        // so the focus trap anchors are in the right place.
        if (this._platform.isBrowser) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
            this._updateFocusTrapState();
        }
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
        this._focusTrap?.destroy();
        this._anchor?.remove();
        this._anchor = null;
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
            // Trap focus only if the backdrop is enabled. Otherwise, allow end user to interact with the
            // sidenav content.
            this._focusTrap.enabled = !!this._container?.hasBackdrop;
        }
    }
    /**
     * Updates the position of the drawer in the DOM. We need to move the element around ourselves
     * when it's in the `end` position so that it comes after the content and the visual order
     * matches the tab order. We also need to be able to move it back to `start` if the sidenav
     * started off as `end` and was changed to `start`.
     */
    _updatePositionInParent(newPosition) {
        // Don't move the DOM node around on the server, because it can throw off hydration.
        if (!this._platform.isBrowser) {
            return;
        }
        const element = this._elementRef.nativeElement;
        const parent = element.parentNode;
        if (newPosition === 'end') {
            if (!this._anchor) {
                this._anchor = this._doc.createComment('mat-drawer-anchor');
                parent.insertBefore(this._anchor, element);
            }
            parent.appendChild(element);
        }
        else if (this._anchor) {
            this._anchor.parentNode.insertBefore(element, this._anchor);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawer, deps: [{ token: i0.ElementRef }, { token: i2.FocusTrapFactory }, { token: i2.FocusMonitor }, { token: i3.Platform }, { token: i0.NgZone }, { token: i2.InteractivityChecker }, { token: DOCUMENT, optional: true }, { token: MAT_DRAWER_CONTAINER, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.0", type: MatDrawer, isStandalone: true, selector: "mat-drawer", inputs: { position: "position", mode: "mode", disableClose: "disableClose", autoFocus: "autoFocus", opened: "opened" }, outputs: { openedChange: "openedChange", _openedStream: "opened", openedStart: "openedStart", _closedStream: "closed", closedStart: "closedStart", onPositionChanged: "positionChanged" }, host: { attributes: { "tabIndex": "-1" }, listeners: { "@transform.start": "_animationStarted.next($event)", "@transform.done": "_animationEnd.next($event)" }, properties: { "attr.align": "null", "class.mat-drawer-end": "position === \"end\"", "class.mat-drawer-over": "mode === \"over\"", "class.mat-drawer-push": "mode === \"push\"", "class.mat-drawer-side": "mode === \"side\"", "class.mat-drawer-opened": "opened", "@transform": "_animationState" }, classAttribute: "mat-drawer" }, viewQueries: [{ propertyName: "_content", first: true, predicate: ["content"], descendants: true }], exportAs: ["matDrawer"], ngImport: i0, template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n", dependencies: [{ kind: "directive", type: CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]" }], animations: [matDrawerAnimations.transformDrawer], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawer, decorators: [{
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
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, standalone: true, imports: [CdkScrollable], template: "<div class=\"mat-drawer-inner-container\" cdkScrollable #content>\r\n  <ng-content></ng-content>\r\n</div>\r\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i2.FocusTrapFactory }, { type: i2.FocusMonitor }, { type: i3.Platform }, { type: i0.NgZone }, { type: i2.InteractivityChecker }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: MatDrawerContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DRAWER_CONTAINER]
                }] }], propDecorators: { position: [{
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
            }], _content: [{
                type: ViewChild,
                args: ['content']
            }] } });
/**
 * `<mat-drawer-container>` component.
 *
 * This is the parent component to one or two `<mat-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
export class MatDrawerContainer {
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
        return this._drawerHasBackdrop(this._start) || this._drawerHasBackdrop(this._end);
    }
    set hasBackdrop(value) {
        this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
    }
    /** Reference to the CdkScrollable instance that wraps the scrollable content. */
    get scrollable() {
        return this._userContent || this._content;
    }
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
        this._injector = inject(Injector);
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
            afterNextRender(() => {
                this._validateDrawers();
            }, { injector: this._injector, phase: AfterRenderPhase.Read });
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
            .filter(drawer => drawer && !drawer.disableClose && this._drawerHasBackdrop(drawer))
            .forEach(drawer => drawer._closeViaBackdropClick());
    }
    _isShowingBackdrop() {
        return ((this._isDrawerOpen(this._start) && this._drawerHasBackdrop(this._start)) ||
            (this._isDrawerOpen(this._end) && this._drawerHasBackdrop(this._end)));
    }
    _isDrawerOpen(drawer) {
        return drawer != null && drawer.opened;
    }
    // Whether argument drawer should have a backdrop when it opens
    _drawerHasBackdrop(drawer) {
        if (this._backdropOverride == null) {
            return !!drawer && drawer.mode !== 'side';
        }
        return this._backdropOverride;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawerContainer, deps: [{ token: i4.Directionality, optional: true }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: MAT_DRAWER_DEFAULT_AUTOSIZE }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.0", type: MatDrawerContainer, isStandalone: true, selector: "mat-drawer-container", inputs: { autosize: "autosize", hasBackdrop: "hasBackdrop" }, outputs: { backdropClick: "backdropClick" }, host: { properties: { "class.mat-drawer-container-explicit-backdrop": "_backdropOverride" }, classAttribute: "mat-drawer-container" }, providers: [
            {
                provide: MAT_DRAWER_CONTAINER,
                useExisting: MatDrawerContainer,
            },
        ], queries: [{ propertyName: "_content", first: true, predicate: MatDrawerContent, descendants: true }, { propertyName: "_allDrawers", predicate: MatDrawer, descendants: true }], viewQueries: [{ propertyName: "_userContent", first: true, predicate: MatDrawerContent, descendants: true }], exportAs: ["matDrawerContainer"], ngImport: i0, template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n", styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*=\"visibility: hidden\"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}"], dependencies: [{ kind: "component", type: MatDrawerContent, selector: "mat-drawer-content" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDrawerContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mat-drawer-container', exportAs: 'matDrawerContainer', host: {
                        'class': 'mat-drawer-container',
                        '[class.mat-drawer-container-explicit-backdrop]': '_backdropOverride',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: MAT_DRAWER_CONTAINER,
                            useExisting: MatDrawerContainer,
                        },
                    ], standalone: true, imports: [MatDrawerContent], template: "@if (hasBackdrop) {\n  <div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\"\n       [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div>\n}\n\n<ng-content select=\"mat-drawer\"></ng-content>\n\n<ng-content select=\"mat-drawer-content\">\n</ng-content>\n\n@if (!_content) {\n  <mat-drawer-content>\n    <ng-content></ng-content>\n  </mat-drawer-content>\n}\n", styles: [".mat-drawer-container{position:relative;z-index:1;color:var(--mat-sidenav-content-text-color);background-color:var(--mat-sidenav-content-background-color);box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-container-has-open{overflow:hidden}.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side{z-index:3}.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,.mat-drawer-container.ng-animate-disabled .mat-drawer-content,.ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,.ng-animate-disabled .mat-drawer-container .mat-drawer-content{transition:none}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible;background-color:var(--mat-sidenav-scrim-color)}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:background-color,visibility}.cdk-high-contrast-active .mat-drawer-backdrop{opacity:.5}.mat-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:400ms;transition-timing-function:cubic-bezier(0.25, 0.8, 0.25, 1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;color:var(--mat-sidenav-container-text-color);box-shadow:var(--mat-sidenav-container-elevation-shadow);background-color:var(--mat-sidenav-container-background-color);border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);width:var(--mat-sidenav-container-width);display:block;position:absolute;top:0;bottom:0;z-index:3;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%, 0, 0)}.cdk-high-contrast-active .mat-drawer,.cdk-high-contrast-active [dir=rtl] .mat-drawer.mat-drawer-end{border-right:solid 1px currentColor}.cdk-high-contrast-active [dir=rtl] .mat-drawer,.cdk-high-contrast-active .mat-drawer.mat-drawer-end{border-left:solid 1px currentColor;border-right:none}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%, 0, 0);border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl] .mat-drawer{border-top-left-radius:var(--mat-sidenav-container-shape);border-bottom-left-radius:var(--mat-sidenav-container-shape);border-top-right-radius:0;border-bottom-right-radius:0;transform:translate3d(100%, 0, 0)}[dir=rtl] .mat-drawer.mat-drawer-end{border-top-right-radius:var(--mat-sidenav-container-shape);border-bottom-right-radius:var(--mat-sidenav-container-shape);border-top-left-radius:0;border-bottom-left-radius:0;left:0;right:auto;transform:translate3d(-100%, 0, 0)}.mat-drawer[style*=\"visibility: hidden\"]{display:none}.mat-drawer-side{box-shadow:none;border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid}.mat-drawer-side.mat-drawer-end{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side{border-left-color:var(--mat-sidenav-container-divider-color);border-left-width:1px;border-left-style:solid;border-right:none}[dir=rtl] .mat-drawer-side.mat-drawer-end{border-right-color:var(--mat-sidenav-container-divider-color);border-right-width:1px;border-right-style:solid;border-left:none}.mat-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}.mat-sidenav-fixed{position:fixed}"] }]
        }], ctorParameters: () => [{ type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DRAWER_DEFAULT_AUTOSIZE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }], propDecorators: { _allDrawers: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NpZGVuYXYvZHJhd2VyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9kcmF3ZXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUNMLFlBQVksRUFHWixnQkFBZ0IsRUFDaEIsb0JBQW9CLEdBQ3JCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFHTCxlQUFlLEVBQ2YsZ0JBQWdCLEVBRWhCLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFB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RSxzQkFBc0IsWUFDdEIsb0JBQW9CLFFBR3hCO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLGdEQUFnRCxFQUFFLG1CQUFtQjtxQkFDdEUsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksYUFDMUI7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLG9CQUFvQjs0QkFDN0IsV0FBVyxvQkFBb0I7eUJBQ2hDO3FCQUNGLGNBQ1csSUFBSSxXQUNQLENBQUMsZ0JBQWdCLENBQUM7OzBCQWlHeEIsUUFBUTs7MEJBS1IsTUFBTTsyQkFBQywyQkFBMkI7OzBCQUNsQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjt5Q0E5RjNDLFdBQVc7c0JBTFYsZUFBZTt1QkFBQyxTQUFTLEVBQUU7d0JBQzFCLHVFQUF1RTt3QkFDdkUsOENBQThDO3dCQUM5QyxXQUFXLEVBQUUsSUFBSTtxQkFDbEI7Z0JBTStCLFFBQVE7c0JBQXZDLFlBQVk7dUJBQUMsZ0JBQWdCO2dCQUNELFlBQVk7c0JBQXhDLFNBQVM7dUJBQUMsZ0JBQWdCO2dCQXFCdkIsUUFBUTtzQkFEWCxLQUFLO2dCQWVGLFdBQVc7c0JBRGQsS0FBSztnQkFVYSxhQUFhO3NCQUEvQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEZvY3VzTW9uaXRvcixcbiAgRm9jdXNPcmlnaW4sXG4gIEZvY3VzVHJhcCxcbiAgRm9jdXNUcmFwRmFjdG9yeSxcbiAgSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VTQ0FQRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtDZGtTY3JvbGxhYmxlLCBTY3JvbGxEaXNwYXRjaGVyLCBWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBhZnRlck5leHRSZW5kZXIsXG4gIEFmdGVyUmVuZGVyUGhhc2UsXG4gIEFmdGVyVmlld0luaXQsXG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgbWFwVG8sXG4gIHN0YXJ0V2l0aCxcbiAgdGFrZSxcbiAgdGFrZVVudGlsLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdERyYXdlckFuaW1hdGlvbnN9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbnMnO1xuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiB0d28gTWF0RHJhd2VyIGFyZSBtYXRjaGluZyB0aGUgc2FtZSBwb3NpdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TWF0RHVwbGljYXRlZERyYXdlckVycm9yKHBvc2l0aW9uOiBzdHJpbmcpIHtcbiAgdGhyb3cgRXJyb3IoYEEgZHJhd2VyIHdhcyBhbHJlYWR5IGRlY2xhcmVkIGZvciAncG9zaXRpb249XCIke3Bvc2l0aW9ufVwiJ2ApO1xufVxuXG4vKiogT3B0aW9ucyBmb3Igd2hlcmUgdG8gc2V0IGZvY3VzIHRvIGF1dG9tYXRpY2FsbHkgb24gZGlhbG9nIG9wZW4gKi9cbmV4cG9ydCB0eXBlIEF1dG9Gb2N1c1RhcmdldCA9ICdkaWFsb2cnIHwgJ2ZpcnN0LXRhYmJhYmxlJyB8ICdmaXJzdC1oZWFkaW5nJztcblxuLyoqIFJlc3VsdCBvZiB0aGUgdG9nZ2xlIHByb21pc2UgdGhhdCBpbmRpY2F0ZXMgdGhlIHN0YXRlIG9mIHRoZSBkcmF3ZXIuICovXG5leHBvcnQgdHlwZSBNYXREcmF3ZXJUb2dnbGVSZXN1bHQgPSAnb3BlbicgfCAnY2xvc2UnO1xuXG4vKiogRHJhd2VyIGFuZCBTaWRlTmF2IGRpc3BsYXkgbW9kZXMuICovXG5leHBvcnQgdHlwZSBNYXREcmF3ZXJNb2RlID0gJ292ZXInIHwgJ3B1c2gnIHwgJ3NpZGUnO1xuXG4vKiogQ29uZmlndXJlcyB3aGV0aGVyIGRyYXdlcnMgc2hvdWxkIHVzZSBhdXRvIHNpemluZyBieSBkZWZhdWx0LiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPihcbiAgJ01BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRScsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0RSQVdFUl9ERUZBVUxUX0FVVE9TSVpFX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIGRyYXdlciBjb250YWluZXIgdG8gYSBkcmF3ZXIgd2hpbGUgYXZvaWRpbmcgY2lyY3VsYXIgcmVmZXJlbmNlcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EUkFXRVJfQ09OVEFJTkVSID0gbmV3IEluamVjdGlvblRva2VuKCdNQVRfRFJBV0VSX0NPTlRBSU5FUicpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRV9GQUNUT1JZKCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250ZW50JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1sZWZ0LnB4XSc6ICdfY29udGFpbmVyLl9jb250ZW50TWFyZ2lucy5sZWZ0JyxcbiAgICAnW3N0eWxlLm1hcmdpbi1yaWdodC5weF0nOiAnX2NvbnRhaW5lci5fY29udGVudE1hcmdpbnMucmlnaHQnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogQ2RrU2Nyb2xsYWJsZSxcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXREcmF3ZXJDb250ZW50LFxuICAgIH0sXG4gIF0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRlbnQgZXh0ZW5kcyBDZGtTY3JvbGxhYmxlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0RHJhd2VyQ29udGFpbmVyKSkgcHVibGljIF9jb250YWluZXI6IE1hdERyYXdlckNvbnRhaW5lcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIG5nWm9uZTogTmdab25lLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzY3JvbGxEaXNwYXRjaGVyLCBuZ1pvbmUpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2NvbnRhaW5lci5fY29udGVudE1hcmdpbkNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgY29ycmVzcG9uZHMgdG8gYSBkcmF3ZXIgdGhhdCBjYW4gYmUgb3BlbmVkIG9uIHRoZSBkcmF3ZXIgY29udGFpbmVyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZHJhd2VyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci5odG1sJyxcbiAgYW5pbWF0aW9uczogW21hdERyYXdlckFuaW1hdGlvbnMudHJhbnNmb3JtRHJhd2VyXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZHJhd2VyJyxcbiAgICAvLyBtdXN0IHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSBhbGlnbmluZyB0ZXh0IGJhc2VkIG9uIHZhbHVlXG4gICAgJ1thdHRyLmFsaWduXSc6ICdudWxsJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItZW5kXSc6ICdwb3NpdGlvbiA9PT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW92ZXJdJzogJ21vZGUgPT09IFwib3ZlclwiJyxcbiAgICAnW2NsYXNzLm1hdC1kcmF3ZXItcHVzaF0nOiAnbW9kZSA9PT0gXCJwdXNoXCInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1zaWRlXSc6ICdtb2RlID09PSBcInNpZGVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZHJhd2VyLW9wZW5lZF0nOiAnb3BlbmVkJyxcbiAgICAndGFiSW5kZXgnOiAnLTEnLFxuICAgICdbQHRyYW5zZm9ybV0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEB0cmFuc2Zvcm0uc3RhcnQpJzogJ19hbmltYXRpb25TdGFydGVkLm5leHQoJGV2ZW50KScsXG4gICAgJyhAdHJhbnNmb3JtLmRvbmUpJzogJ19hbmltYXRpb25FbmQubmV4dCgkZXZlbnQpJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDZGtTY3JvbGxhYmxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwOiBGb2N1c1RyYXAgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBpcyBpbml0aWFsaXplZC4gVXNlZCBmb3IgZGlzYWJsaW5nIHRoZSBpbml0aWFsIGFuaW1hdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZW5hYmxlQW5pbWF0aW9ucyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB2aWV3IG9mIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gYXR0YWNoZWQuICovXG4gIHByaXZhdGUgX2lzQXR0YWNoZWQ6IGJvb2xlYW47XG5cbiAgLyoqIEFuY2hvciBub2RlIHVzZWQgdG8gcmVzdG9yZSB0aGUgZHJhd2VyIHRvIGl0cyBpbml0aWFsIHBvc2l0aW9uLiAqL1xuICBwcml2YXRlIF9hbmNob3I6IENvbW1lbnQgfCBudWxsO1xuXG4gIC8qKiBUaGUgc2lkZSB0aGF0IHRoZSBkcmF3ZXIgaXMgYXR0YWNoZWQgdG8uICovXG4gIEBJbnB1dCgpXG4gIGdldCBwb3NpdGlvbigpOiAnc3RhcnQnIHwgJ2VuZCcge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuICBzZXQgcG9zaXRpb24odmFsdWU6ICdzdGFydCcgfCAnZW5kJykge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgdmFsdWUgPSB2YWx1ZSA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgLy8gU3RhdGljIGlucHV0cyBpbiBJdnkgYXJlIHNldCBiZWZvcmUgdGhlIGVsZW1lbnQgaXMgaW4gdGhlIERPTS5cbiAgICAgIGlmICh0aGlzLl9pc0F0dGFjaGVkKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uSW5QYXJlbnQodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuICAgICAgdGhpcy5vblBvc2l0aW9uQ2hhbmdlZC5lbWl0KCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgPSAnc3RhcnQnO1xuXG4gIC8qKiBNb2RlIG9mIHRoZSBkcmF3ZXI7IG9uZSBvZiAnb3ZlcicsICdwdXNoJyBvciAnc2lkZScuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtb2RlKCk6IE1hdERyYXdlck1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG4gIHNldCBtb2RlKHZhbHVlOiBNYXREcmF3ZXJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCk7XG4gICAgdGhpcy5fbW9kZUNoYW5nZWQubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX21vZGU6IE1hdERyYXdlck1vZGUgPSAnb3Zlcic7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBjYW4gYmUgY2xvc2VkIHdpdGggdGhlIGVzY2FwZSBrZXkgb3IgYnkgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZUNsb3NlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQ2xvc2U7XG4gIH1cbiAgc2V0IGRpc2FibGVDbG9zZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZUNsb3NlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIHNob3VsZCBmb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgYXV0b21hdGljYWxseSB3aGVuIG9wZW5lZC5cbiAgICogRGVmYXVsdHMgdG8gZmFsc2UgaW4gd2hlbiBgbW9kZWAgaXMgc2V0IHRvIGBzaWRlYCwgb3RoZXJ3aXNlIGRlZmF1bHRzIHRvIGB0cnVlYC4gSWYgZXhwbGljaXRseVxuICAgKiBlbmFibGVkLCBmb2N1cyB3aWxsIGJlIG1vdmVkIGludG8gdGhlIHNpZGVuYXYgaW4gYHNpZGVgIG1vZGUgYXMgd2VsbC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNC4wLjAgUmVtb3ZlIGJvb2xlYW4gb3B0aW9uIGZyb20gYXV0b0ZvY3VzLiBVc2Ugc3RyaW5nIG9yIEF1dG9Gb2N1c1RhcmdldFxuICAgKiBpbnN0ZWFkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9Gb2N1cygpOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2F1dG9Gb2N1cztcblxuICAgIC8vIE5vdGUgdGhhdCB1c3VhbGx5IHdlIGRvbid0IGFsbG93IGF1dG9Gb2N1cyB0byBiZSBzZXQgdG8gYGZpcnN0LXRhYmJhYmxlYCBpbiBgc2lkZWAgbW9kZSxcbiAgICAvLyBiZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IHRoZSBzaWRlbmF2IGlzIGJlaW5nIHVzZWQsIGJ1dCBpbiBzb21lIGNhc2VzIGl0IHN0aWxsIG1ha2VzXG4gICAgLy8gc2Vuc2UgdG8gZG8gaXQuIFRoZSBjb25zdW1lciBjYW4gZXhwbGljaXRseSBzZXQgYGF1dG9Gb2N1c2AuXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdzaWRlJykge1xuICAgICAgICByZXR1cm4gJ2RpYWxvZyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2ZpcnN0LXRhYmJhYmxlJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHNldCBhdXRvRm9jdXModmFsdWU6IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IEJvb2xlYW5JbnB1dCkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnIHx8IHZhbHVlID09PSAnZmFsc2UnIHx8IHZhbHVlID09IG51bGwpIHtcbiAgICAgIHZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5fYXV0b0ZvY3VzID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b0ZvY3VzOiBBdXRvRm9jdXNUYXJnZXQgfCBzdHJpbmcgfCBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgaXMgb3BlbmVkLiBXZSBvdmVybG9hZCB0aGlzIGJlY2F1c2Ugd2UgdHJpZ2dlciBhbiBldmVudCB3aGVuIGl0XG4gICAqIHN0YXJ0cyBvciBlbmQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWQ7XG4gIH1cbiAgc2V0IG9wZW5lZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy50b2dnbGUoY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfb3BlbmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEhvdyB0aGUgc2lkZW5hdiB3YXMgb3BlbmVkIChrZXlwcmVzcywgbW91c2UgY2xpY2sgZXRjLikgKi9cbiAgcHJpdmF0ZSBfb3BlbmVkVmlhOiBGb2N1c09yaWdpbiB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBkcmF3ZXIgaGFzIHN0YXJ0ZWQgYW5pbWF0aW5nLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uU3RhcnRlZCA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgZHJhd2VyIGlzIGRvbmUgYW5pbWF0aW5nLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRW5kID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIHNpZGVuYXYgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICdvcGVuLWluc3RhbnQnIHwgJ29wZW4nIHwgJ3ZvaWQnID0gJ3ZvaWQnO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBvcGVuIHN0YXRlIGlzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcGVuZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9XG4gICAgLy8gTm90ZSB0aGlzIGhhcyB0byBiZSBhc3luYyBpbiBvcmRlciB0byBhdm9pZCBzb21lIGlzc3VlcyB3aXRoIHR3by1iaW5kaW5ncyAoc2VlICM4ODcyKS5cbiAgICBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KC8qIGlzQXN5bmMgKi8gdHJ1ZSk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJylcbiAgcmVhZG9ubHkgX29wZW5lZFN0cmVhbSA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gbyksXG4gICAgbWFwKCgpID0+IHt9KSxcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIHN0YXJ0ZWQgb3BlbmluZy4gKi9cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IG9wZW5lZFN0YXJ0OiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgIGZpbHRlcihlID0+IGUuZnJvbVN0YXRlICE9PSBlLnRvU3RhdGUgJiYgZS50b1N0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMCksXG4gICAgbWFwVG8odW5kZWZpbmVkKSxcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKVxuICByZWFkb25seSBfY2xvc2VkU3RyZWFtID0gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShcbiAgICBmaWx0ZXIobyA9PiAhbyksXG4gICAgbWFwKCgpID0+IHt9KSxcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBkcmF3ZXIgaGFzIHN0YXJ0ZWQgY2xvc2luZy4gKi9cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IGNsb3NlZFN0YXJ0OiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fYW5pbWF0aW9uU3RhcnRlZC5waXBlKFxuICAgIGZpbHRlcihlID0+IGUuZnJvbVN0YXRlICE9PSBlLnRvU3RhdGUgJiYgZS50b1N0YXRlID09PSAndm9pZCcpLFxuICAgIG1hcFRvKHVuZGVmaW5lZCksXG4gICk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZHJhd2VyJ3MgcG9zaXRpb24gY2hhbmdlcy4gKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgncG9zaXRpb25DaGFuZ2VkJykgcmVhZG9ubHkgb25Qb3NpdGlvbkNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW5uZXIgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgY29udGVudC4gKi9cbiAgQFZpZXdDaGlsZCgnY29udGVudCcpIF9jb250ZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIGRyYXdlciBtb2RlIGNoYW5nZXMuIFRoaXMgaXMgdXNlZCBieSB0aGUgZHJhd2VyIGNvbnRhaW5lciB0b1xuICAgKiB0byBrbm93IHdoZW4gdG8gd2hlbiB0aGUgbW9kZSBjaGFuZ2VzIHNvIGl0IGNhbiBhZGFwdCB0aGUgbWFyZ2lucyBvbiB0aGUgY29udGVudC5cbiAgICovXG4gIHJlYWRvbmx5IF9tb2RlQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ludGVyYWN0aXZpdHlDaGVja2VyOiBJbnRlcmFjdGl2aXR5Q2hlY2tlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2M6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EUkFXRVJfQ09OVEFJTkVSKSBwdWJsaWMgX2NvbnRhaW5lcj86IE1hdERyYXdlckNvbnRhaW5lcixcbiAgKSB7XG4gICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKChvcGVuZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmIChvcGVuZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RvYykge1xuICAgICAgICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkID0gdGhpcy5fZG9jLmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGFrZUZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzRm9jdXNXaXRoaW5EcmF3ZXIoKSkge1xuICAgICAgICB0aGlzLl9yZXN0b3JlRm9jdXModGhpcy5fb3BlbmVkVmlhIHx8ICdwcm9ncmFtJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gYGtleWRvd25gIGV2ZW50cyBvdXRzaWRlIHRoZSB6b25lIHNvIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBpcyBub3QgcnVuIGV2ZXJ5XG4gICAgICogdGltZSBhIGtleSBpcyBwcmVzc2VkLiBJbnN0ZWFkIHdlIHJlLWVudGVyIHRoZSB6b25lIG9ubHkgaWYgdGhlIGBFU0NgIGtleSBpcyBwcmVzc2VkXG4gICAgICogYW5kIHdlIGRvbid0IGhhdmUgY2xvc2UgZGlzYWJsZWQuXG4gICAgICovXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIChmcm9tRXZlbnQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAna2V5ZG93bicpIGFzIE9ic2VydmFibGU8S2V5Ym9hcmRFdmVudD4pXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT5cbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIFdlIG5lZWQgYSBTdWJqZWN0IHdpdGggZGlzdGluY3RVbnRpbENoYW5nZWQsIGJlY2F1c2UgdGhlIGBkb25lYCBldmVudFxuICAgIC8vIGZpcmVzIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX2FuaW1hdGlvbkVuZFxuICAgICAgLnBpcGUoXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qge2Zyb21TdGF0ZSwgdG9TdGF0ZX0gPSBldmVudDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKHRvU3RhdGUuaW5kZXhPZignb3BlbicpID09PSAwICYmIGZyb21TdGF0ZSA9PT0gJ3ZvaWQnKSB8fFxuICAgICAgICAgICh0b1N0YXRlID09PSAndm9pZCcgJiYgZnJvbVN0YXRlLmluZGV4T2YoJ29wZW4nKSA9PT0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCh0aGlzLl9vcGVuZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwcm92aWRlZCBlbGVtZW50LiBJZiB0aGUgZWxlbWVudCBpcyBub3QgZm9jdXNhYmxlLCBpdCB3aWxsIGFkZCBhIHRhYkluZGV4XG4gICAqIGF0dHJpYnV0ZSB0byBmb3JjZWZ1bGx5IGZvY3VzIGl0LiBUaGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgYWZ0ZXIgZm9jdXMgaXMgbW92ZWQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9yY2VGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICghdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcbiAgICAgIGVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgIC8vIFRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHJlbW92ZWQgdG8gYXZvaWQgbmF2aWdhdGluZyB0byB0aGF0IGVsZW1lbnQgYWdhaW5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGNhbGxiYWNrKTtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNhbGxiYWNrKTtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBjYWxsYmFjayk7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yIHdpdGhpbiB0aGUgZm9jdXMgdHJhcC5cbiAgICogQHBhcmFtIHNlbGVjdG9yIFRoZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBlbGVtZW50IHRvIHNldCBmb2N1cyB0by5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzQnlDc3NTZWxlY3RvcihzZWxlY3Rvcjogc3RyaW5nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBzZWxlY3RvcixcbiAgICApIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoZWxlbWVudFRvRm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvcmNlRm9jdXMoZWxlbWVudFRvRm9jdXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBmb2N1cyBpbnRvIHRoZSBkcmF3ZXIuIE5vdGUgdGhhdCB0aGlzIHdvcmtzIGV2ZW4gaWZcbiAgICogdGhlIGZvY3VzIHRyYXAgaXMgZGlzYWJsZWQgaW4gYHNpZGVgIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIF90YWtlRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gV2hlbiBhdXRvRm9jdXMgaXMgbm90IG9uIHRoZSBzaWRlbmF2LCBpZiB0aGUgZWxlbWVudCBjYW5ub3QgYmUgZm9jdXNlZCBvciBkb2VzXG4gICAgLy8gbm90IGV4aXN0LCBmb2N1cyB0aGUgc2lkZW5hdiBpdHNlbGYgc28gdGhlIGtleWJvYXJkIG5hdmlnYXRpb24gc3RpbGwgd29ya3MuXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB0aGF0IGBmb2N1c2AgaXMgYSBmdW5jdGlvbiBkdWUgdG8gVW5pdmVyc2FsLlxuICAgIHN3aXRjaCAodGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIGNhc2UgZmFsc2U6XG4gICAgICBjYXNlICdkaWFsb2cnOlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIHRydWU6XG4gICAgICBjYXNlICdmaXJzdC10YWJiYWJsZSc6XG4gICAgICAgIGFmdGVyTmV4dFJlbmRlcihcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYXNNb3ZlZEZvY3VzID0gdGhpcy5fZm9jdXNUcmFwIS5mb2N1c0luaXRpYWxFbGVtZW50KCk7XG4gICAgICAgICAgICBpZiAoIWhhc01vdmVkRm9jdXMgJiYgdHlwZW9mIGVsZW1lbnQuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge2luamVjdG9yOiB0aGlzLl9pbmplY3Rvcn0sXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmlyc3QtaGVhZGluZyc6XG4gICAgICAgIHRoaXMuX2ZvY3VzQnlDc3NTZWxlY3RvcignaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgW3JvbGU9XCJoZWFkaW5nXCJdJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fZm9jdXNCeUNzc1NlbGVjdG9yKHRoaXMuYXV0b0ZvY3VzISk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBvcmlnaW5hbGx5IGZvY3VzZWQgd2hlbiB0aGUgZHJhd2VyIG9wZW5lZC5cbiAgICogSWYgbm8gZWxlbWVudCB3YXMgZm9jdXNlZCBhdCB0aGF0IHRpbWUsIHRoZSBmb2N1cyB3aWxsIGJlIHJlc3RvcmVkIHRvIHRoZSBkcmF3ZXIuXG4gICAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoZm9jdXNPcmlnaW46IEV4Y2x1ZGU8Rm9jdXNPcmlnaW4sIG51bGw+KSB7XG4gICAgaWYgKHRoaXMuYXV0b0ZvY3VzID09PSAnZGlhbG9nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURyYXdlcldhc09wZW5lZCkge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRHJhd2VyV2FzT3BlbmVkLCBmb2N1c09yaWdpbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEcmF3ZXJXYXNPcGVuZWQgPSBudWxsO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgZm9jdXMgaXMgY3VycmVudGx5IHdpdGhpbiB0aGUgZHJhd2VyLiAqL1xuICBwcml2YXRlIF9pc0ZvY3VzV2l0aGluRHJhd2VyKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFjdGl2ZUVsID0gdGhpcy5fZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuICEhYWN0aXZlRWwgJiYgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZTtcblxuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBET00gcG9zaXRpb24gd2hlbiB0aGUgc2lkZW5hdiBpcyBwb3NpdGlvbmVkIGF0XG4gICAgLy8gdGhlIGVuZCBzaW5jZSB3ZSBwcm9qZWN0IHRoZSBzaWRlbmF2IGJlZm9yZSB0aGUgY29udGVudCBieSBkZWZhdWx0LlxuICAgIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uSW5QYXJlbnQoJ2VuZCcpO1xuICAgIH1cblxuICAgIC8vIE5lZWRzIHRvIGhhcHBlbiBhZnRlciB0aGUgcG9zaXRpb24gaXMgdXBkYXRlZFxuICAgIC8vIHNvIHRoZSBmb2N1cyB0cmFwIGFuY2hvcnMgYXJlIGluIHRoZSByaWdodCBwbGFjZS5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gRW5hYmxlIHRoZSBhbmltYXRpb25zIGFmdGVyIHRoZSBsaWZlY3ljbGUgaG9va3MgaGF2ZSBydW4sIGluIG9yZGVyIHRvIGF2b2lkIGFuaW1hdGluZ1xuICAgIC8vIGRyYXdlcnMgdGhhdCBhcmUgb3BlbiBieSBkZWZhdWx0LiBXaGVuIHdlJ3JlIG9uIHRoZSBzZXJ2ZXIsIHdlIHNob3VsZG4ndCBlbmFibGUgdGhlXG4gICAgLy8gYW5pbWF0aW9ucywgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBkcmF3ZXIgdG8gYW5pbWF0ZSB0aGUgZmlyc3QgdGltZSB0aGUgdXNlciBzZWVzXG4gICAgLy8gdGhlIHBhZ2UuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fZW5hYmxlQW5pbWF0aW9ucyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNUcmFwPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fYW5jaG9yPy5yZW1vdmUoKTtcbiAgICB0aGlzLl9hbmNob3IgPSBudWxsO1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXJ0ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25FbmQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9tb2RlQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbiB0aGUgZHJhd2VyLlxuICAgKiBAcGFyYW0gb3BlbmVkVmlhIFdoZXRoZXIgdGhlIGRyYXdlciB3YXMgb3BlbmVkIGJ5IGEga2V5IHByZXNzLCBtb3VzZSBjbGljayBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKiBVc2VkIGZvciBmb2N1cyBtYW5hZ2VtZW50IGFmdGVyIHRoZSBzaWRlbmF2IGlzIGNsb3NlZC5cbiAgICovXG4gIG9wZW4ob3BlbmVkVmlhPzogRm9jdXNPcmlnaW4pOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZSh0cnVlLCBvcGVuZWRWaWEpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBkcmF3ZXIuICovXG4gIGNsb3NlKCk6IFByb21pc2U8TWF0RHJhd2VyVG9nZ2xlUmVzdWx0PiB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlKGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGRyYXdlciB3aXRoIGNvbnRleHQgdGhhdCB0aGUgYmFja2Ryb3Agd2FzIGNsaWNrZWQuICovXG4gIF9jbG9zZVZpYUJhY2tkcm9wQ2xpY2soKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICAvLyBJZiB0aGUgZHJhd2VyIGlzIGNsb3NlZCB1cG9uIGEgYmFja2Ryb3AgY2xpY2ssIHdlIGFsd2F5cyB3YW50IHRvIHJlc3RvcmUgZm9jdXMuIFdlXG4gICAgLy8gZG9uJ3QgbmVlZCB0byBjaGVjayB3aGV0aGVyIGZvY3VzIGlzIGN1cnJlbnRseSBpbiB0aGUgZHJhd2VyLCBhcyBjbGlja2luZyBvbiB0aGVcbiAgICAvLyBiYWNrZHJvcCBjYXVzZXMgYmx1cnMgdGhlIGFjdGl2ZSBlbGVtZW50LlxuICAgIHJldHVybiB0aGlzLl9zZXRPcGVuKC8qIGlzT3BlbiAqLyBmYWxzZSwgLyogcmVzdG9yZUZvY3VzICovIHRydWUsICdtb3VzZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGlzIGRyYXdlci5cbiAgICogQHBhcmFtIGlzT3BlbiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIGJlIG9wZW4uXG4gICAqIEBwYXJhbSBvcGVuZWRWaWEgV2hldGhlciB0aGUgZHJhd2VyIHdhcyBvcGVuZWQgYnkgYSBrZXkgcHJlc3MsIG1vdXNlIGNsaWNrIG9yIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqIFVzZWQgZm9yIGZvY3VzIG1hbmFnZW1lbnQgYWZ0ZXIgdGhlIHNpZGVuYXYgaXMgY2xvc2VkLlxuICAgKi9cbiAgdG9nZ2xlKGlzT3BlbjogYm9vbGVhbiA9ICF0aGlzLm9wZW5lZCwgb3BlbmVkVmlhPzogRm9jdXNPcmlnaW4pOiBQcm9taXNlPE1hdERyYXdlclRvZ2dsZVJlc3VsdD4ge1xuICAgIC8vIElmIHRoZSBmb2N1cyBpcyBjdXJyZW50bHkgaW5zaWRlIHRoZSBkcmF3ZXIgY29udGVudCBhbmQgd2UgYXJlIGNsb3NpbmcgdGhlIGRyYXdlcixcbiAgICAvLyByZXN0b3JlIHRoZSBmb2N1cyB0byB0aGUgaW5pdGlhbGx5IGZvY3VzZWQgZWxlbWVudCAod2hlbiB0aGUgZHJhd2VyIG9wZW5lZCkuXG4gICAgaWYgKGlzT3BlbiAmJiBvcGVuZWRWaWEpIHtcbiAgICAgIHRoaXMuX29wZW5lZFZpYSA9IG9wZW5lZFZpYTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9zZXRPcGVuKFxuICAgICAgaXNPcGVuLFxuICAgICAgLyogcmVzdG9yZUZvY3VzICovICFpc09wZW4gJiYgdGhpcy5faXNGb2N1c1dpdGhpbkRyYXdlcigpLFxuICAgICAgdGhpcy5fb3BlbmVkVmlhIHx8ICdwcm9ncmFtJyxcbiAgICApO1xuXG4gICAgaWYgKCFpc09wZW4pIHtcbiAgICAgIHRoaXMuX29wZW5lZFZpYSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBvcGVuZWQgc3RhdGUgb2YgdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIGlzT3BlbiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIG9wZW4gb3IgY2xvc2UuXG4gICAqIEBwYXJhbSByZXN0b3JlRm9jdXMgV2hldGhlciBmb2N1cyBzaG91bGQgYmUgcmVzdG9yZWQgb24gY2xvc2UuXG4gICAqIEBwYXJhbSBmb2N1c09yaWdpbiBPcmlnaW4gdG8gdXNlIHdoZW4gcmVzdG9yaW5nIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0T3BlbihcbiAgICBpc09wZW46IGJvb2xlYW4sXG4gICAgcmVzdG9yZUZvY3VzOiBib29sZWFuLFxuICAgIGZvY3VzT3JpZ2luOiBFeGNsdWRlPEZvY3VzT3JpZ2luLCBudWxsPixcbiAgKTogUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+IHtcbiAgICB0aGlzLl9vcGVuZWQgPSBpc09wZW47XG5cbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9IHRoaXMuX2VuYWJsZUFuaW1hdGlvbnMgPyAnb3BlbicgOiAnb3Blbi1pbnN0YW50JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgICBpZiAocmVzdG9yZUZvY3VzKSB7XG4gICAgICAgIHRoaXMuX3Jlc3RvcmVGb2N1cyhmb2N1c09yaWdpbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRm9jdXNUcmFwU3RhdGUoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxNYXREcmF3ZXJUb2dnbGVSZXN1bHQ+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3BlbiA9PiByZXNvbHZlKG9wZW4gPyAnb3BlbicgOiAnY2xvc2UnKSk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ID8gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IDAgOiAwO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGVuYWJsZWQgc3RhdGUgb2YgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3VwZGF0ZUZvY3VzVHJhcFN0YXRlKCkge1xuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIC8vIFRyYXAgZm9jdXMgb25seSBpZiB0aGUgYmFja2Ryb3AgaXMgZW5hYmxlZC4gT3RoZXJ3aXNlLCBhbGxvdyBlbmQgdXNlciB0byBpbnRlcmFjdCB3aXRoIHRoZVxuICAgICAgLy8gc2lkZW5hdiBjb250ZW50LlxuICAgICAgdGhpcy5fZm9jdXNUcmFwLmVuYWJsZWQgPSAhIXRoaXMuX2NvbnRhaW5lcj8uaGFzQmFja2Ryb3A7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmF3ZXIgaW4gdGhlIERPTS4gV2UgbmVlZCB0byBtb3ZlIHRoZSBlbGVtZW50IGFyb3VuZCBvdXJzZWx2ZXNcbiAgICogd2hlbiBpdCdzIGluIHRoZSBgZW5kYCBwb3NpdGlvbiBzbyB0aGF0IGl0IGNvbWVzIGFmdGVyIHRoZSBjb250ZW50IGFuZCB0aGUgdmlzdWFsIG9yZGVyXG4gICAqIG1hdGNoZXMgdGhlIHRhYiBvcmRlci4gV2UgYWxzbyBuZWVkIHRvIGJlIGFibGUgdG8gbW92ZSBpdCBiYWNrIHRvIGBzdGFydGAgaWYgdGhlIHNpZGVuYXZcbiAgICogc3RhcnRlZCBvZmYgYXMgYGVuZGAgYW5kIHdhcyBjaGFuZ2VkIHRvIGBzdGFydGAuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVQb3NpdGlvbkluUGFyZW50KG5ld1Bvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcpOiB2b2lkIHtcbiAgICAvLyBEb24ndCBtb3ZlIHRoZSBET00gbm9kZSBhcm91bmQgb24gdGhlIHNlcnZlciwgYmVjYXVzZSBpdCBjYW4gdGhyb3cgb2ZmIGh5ZHJhdGlvbi5cbiAgICBpZiAoIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlITtcblxuICAgIGlmIChuZXdQb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgIGlmICghdGhpcy5fYW5jaG9yKSB7XG4gICAgICAgIHRoaXMuX2FuY2hvciA9IHRoaXMuX2RvYy5jcmVhdGVDb21tZW50KCdtYXQtZHJhd2VyLWFuY2hvcicpITtcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLl9hbmNob3IhLCBlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fYW5jaG9yKSB7XG4gICAgICB0aGlzLl9hbmNob3IucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMuX2FuY2hvcik7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogYDxtYXQtZHJhd2VyLWNvbnRhaW5lcj5gIGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIG9uZSBvciB0d28gYDxtYXQtZHJhd2VyPmBzIHRoYXQgdmFsaWRhdGVzIHRoZSBzdGF0ZSBpbnRlcm5hbGx5XG4gKiBhbmQgY29vcmRpbmF0ZXMgdGhlIGJhY2tkcm9wIGFuZCBjb250ZW50IHN0eWxpbmcuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kcmF3ZXItY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICdtYXREcmF3ZXJDb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RyYXdlci1jb250YWluZXIuaHRtbCcsXG4gIHN0eWxlVXJsOiAnZHJhd2VyLmNzcycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRyYXdlci1jb250YWluZXInLFxuICAgICdbY2xhc3MubWF0LWRyYXdlci1jb250YWluZXItZXhwbGljaXQtYmFja2Ryb3BdJzogJ19iYWNrZHJvcE92ZXJyaWRlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1BVF9EUkFXRVJfQ09OVEFJTkVSLFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdERyYXdlckNvbnRhaW5lcixcbiAgICB9LFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0RHJhd2VyQ29udGVudF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERyYXdlckNvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIC8qKiBBbGwgZHJhd2VycyBpbiB0aGUgY29udGFpbmVyLiBJbmNsdWRlcyBkcmF3ZXJzIGZyb20gaW5zaWRlIG5lc3RlZCBjb250YWluZXJzLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdERyYXdlciwge1xuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkZXNjZW5kYW50czogdHJ1ZWAsIGJlY2F1c2UgSXZ5IHdpbGwgbm8gbG9uZ2VyIG1hdGNoXG4gICAgLy8gaW5kaXJlY3QgZGVzY2VuZGFudHMgaWYgaXQncyBsZWZ0IGFzIGZhbHNlLlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlLFxuICB9KVxuICBfYWxsRHJhd2VyczogUXVlcnlMaXN0PE1hdERyYXdlcj47XG5cbiAgLyoqIERyYXdlcnMgdGhhdCBiZWxvbmcgdG8gdGhpcyBjb250YWluZXIuICovXG4gIF9kcmF3ZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXREcmF3ZXI+KCk7XG5cbiAgQENvbnRlbnRDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfY29udGVudDogTWF0RHJhd2VyQ29udGVudDtcbiAgQFZpZXdDaGlsZChNYXREcmF3ZXJDb250ZW50KSBfdXNlckNvbnRlbnQ6IE1hdERyYXdlckNvbnRlbnQ7XG5cbiAgLyoqIFRoZSBkcmF3ZXIgY2hpbGQgd2l0aCB0aGUgYHN0YXJ0YCBwb3NpdGlvbi4gKi9cbiAgZ2V0IHN0YXJ0KCk6IE1hdERyYXdlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zdGFydDtcbiAgfVxuXG4gIC8qKiBUaGUgZHJhd2VyIGNoaWxkIHdpdGggdGhlIGBlbmRgIHBvc2l0aW9uLiAqL1xuICBnZXQgZW5kKCk6IE1hdERyYXdlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9lbmQ7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IHJlc2l6ZSB0aGUgY29udGFpbmVyIHdoZW5ldmVyXG4gICAqIHRoZSBzaXplIG9mIGFueSBvZiBpdHMgZHJhd2VycyBjaGFuZ2VzLlxuICAgKlxuICAgKiAqKlVzZSBhdCB5b3VyIG93biByaXNrISoqIEVuYWJsaW5nIHRoaXMgb3B0aW9uIGNhbiBjYXVzZSBsYXlvdXQgdGhyYXNoaW5nIGJ5IG1lYXN1cmluZ1xuICAgKiB0aGUgZHJhd2VycyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLiBDYW4gYmUgY29uZmlndXJlZCBnbG9iYWxseSB2aWEgdGhlXG4gICAqIGBNQVRfRFJBV0VSX0RFRkFVTFRfQVVUT1NJWkVgIHRva2VuLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9zaXplKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hdXRvc2l6ZTtcbiAgfVxuICBzZXQgYXV0b3NpemUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2F1dG9zaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hdXRvc2l6ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZHJhd2VyIGNvbnRhaW5lciBzaG91bGQgaGF2ZSBhIGJhY2tkcm9wIHdoaWxlIG9uZSBvZiB0aGUgc2lkZW5hdnMgaXMgb3Blbi5cbiAgICogSWYgZXhwbGljaXRseSBzZXQgdG8gYHRydWVgLCB0aGUgYmFja2Ryb3Agd2lsbCBiZSBlbmFibGVkIGZvciBkcmF3ZXJzIGluIHRoZSBgc2lkZWBcbiAgICogbW9kZSBhcyB3ZWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGhhc0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kcmF3ZXJIYXNCYWNrZHJvcCh0aGlzLl9zdGFydCkgfHwgdGhpcy5fZHJhd2VySGFzQmFja2Ryb3AodGhpcy5fZW5kKTtcbiAgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2JhY2tkcm9wT3ZlcnJpZGUgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgX2JhY2tkcm9wT3ZlcnJpZGU6IGJvb2xlYW4gfCBudWxsO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRyYXdlciBiYWNrZHJvcCBpcyBjbGlja2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYmFja2Ryb3BDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZHJhd2VyIGF0IHRoZSBzdGFydC9lbmQgcG9zaXRpb24sIGluZGVwZW5kZW50IG9mIGRpcmVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc3RhcnQ6IE1hdERyYXdlciB8IG51bGw7XG4gIHByaXZhdGUgX2VuZDogTWF0RHJhd2VyIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIGRyYXdlciBhdCB0aGUgbGVmdC9yaWdodC4gV2hlbiBkaXJlY3Rpb24gY2hhbmdlcywgdGhlc2Ugd2lsbCBjaGFuZ2UgYXMgd2VsbC5cbiAgICogVGhleSdyZSB1c2VkIGFzIGFsaWFzZXMgZm9yIHRoZSBhYm92ZSB0byBzZXQgdGhlIGxlZnQvcmlnaHQgc3R5bGUgcHJvcGVybHkuXG4gICAqIEluIExUUiwgX2xlZnQgPT0gX3N0YXJ0IGFuZCBfcmlnaHQgPT0gX2VuZC5cbiAgICogSW4gUlRMLCBfbGVmdCA9PSBfZW5kIGFuZCBfcmlnaHQgPT0gX3N0YXJ0LlxuICAgKi9cbiAgcHJpdmF0ZSBfbGVmdDogTWF0RHJhd2VyIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcmlnaHQ6IE1hdERyYXdlciB8IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIG9uIGV2ZXJ5IG5nRG9DaGVjay4gVXNlZCBmb3IgZGVib3VuY2luZyByZWZsb3dzLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9kb0NoZWNrU3ViamVjdCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIE1hcmdpbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY29udGVudC4gVGhlc2UgYXJlIHVzZWQgdG8gcHVzaCAvIHNocmluayB0aGUgZHJhd2VyIGNvbnRlbnQgd2hlbiBhXG4gICAqIGRyYXdlciBpcyBvcGVuLiBXZSB1c2UgbWFyZ2luIHJhdGhlciB0aGFuIHRyYW5zZm9ybSBldmVuIGZvciBwdXNoIG1vZGUgYmVjYXVzZSB0cmFuc2Zvcm0gYnJlYWtzXG4gICAqIGZpeGVkIHBvc2l0aW9uIGVsZW1lbnRzIGluc2lkZSBvZiB0aGUgdHJhbnNmb3JtZWQgZWxlbWVudC5cbiAgICovXG4gIF9jb250ZW50TWFyZ2luczoge2xlZnQ6IG51bWJlciB8IG51bGw7IHJpZ2h0OiBudW1iZXIgfCBudWxsfSA9IHtsZWZ0OiBudWxsLCByaWdodDogbnVsbH07XG5cbiAgcmVhZG9ubHkgX2NvbnRlbnRNYXJnaW5DaGFuZ2VzID0gbmV3IFN1YmplY3Q8e2xlZnQ6IG51bWJlciB8IG51bGw7IHJpZ2h0OiBudW1iZXIgfCBudWxsfT4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBDZGtTY3JvbGxhYmxlIGluc3RhbmNlIHRoYXQgd3JhcHMgdGhlIHNjcm9sbGFibGUgY29udGVudC4gKi9cbiAgZ2V0IHNjcm9sbGFibGUoKTogQ2RrU2Nyb2xsYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJDb250ZW50IHx8IHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBASW5qZWN0KE1BVF9EUkFXRVJfREVGQVVMVF9BVVRPU0laRSkgZGVmYXVsdEF1dG9zaXplID0gZmFsc2UsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIC8vIElmIGEgYERpcmAgZGlyZWN0aXZlIGV4aXN0cyB1cCB0aGUgdHJlZSwgbGlzdGVuIGRpcmVjdGlvbiBjaGFuZ2VzXG4gICAgLy8gYW5kIHVwZGF0ZSB0aGUgbGVmdC9yaWdodCBwcm9wZXJ0aWVzIHRvIHBvaW50IHRvIHRoZSBwcm9wZXIgc3RhcnQvZW5kLlxuICAgIGlmIChfZGlyKSB7XG4gICAgICBfZGlyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZURyYXdlcnMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIG1pbmltdW0gd2lkdGggb2YgdGhlIHNpZGVuYXYgZGVwZW5kcyBvbiB0aGUgdmlld3BvcnQgd2lkdGgsXG4gICAgLy8gd2UgbmVlZCB0byByZWNvbXB1dGUgdGhlIG1hcmdpbnMgaWYgdGhlIHZpZXdwb3J0IGNoYW5nZXMuXG4gICAgdmlld3BvcnRSdWxlclxuICAgICAgLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpKTtcblxuICAgIHRoaXMuX2F1dG9zaXplID0gZGVmYXVsdEF1dG9zaXplO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FsbERyYXdlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbERyYXdlcnMpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRyYXdlcjogUXVlcnlMaXN0PE1hdERyYXdlcj4pID0+IHtcbiAgICAgICAgdGhpcy5fZHJhd2Vycy5yZXNldChkcmF3ZXIuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uX2NvbnRhaW5lciB8fCBpdGVtLl9jb250YWluZXIgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZHJhd2Vycy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fZHJhd2Vycy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVEcmF3ZXJzKCk7XG5cbiAgICAgIHRoaXMuX2RyYXdlcnMuZm9yRWFjaCgoZHJhd2VyOiBNYXREcmF3ZXIpID0+IHtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyKTtcbiAgICAgICAgdGhpcy5fd2F0Y2hEcmF3ZXJQb3NpdGlvbihkcmF3ZXIpO1xuICAgICAgICB0aGlzLl93YXRjaERyYXdlck1vZGUoZHJhd2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9kcmF3ZXJzLmxlbmd0aCB8fFxuICAgICAgICB0aGlzLl9pc0RyYXdlck9wZW4odGhpcy5fc3RhcnQpIHx8XG4gICAgICAgIHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9lbmQpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIEF2b2lkIGhpdHRpbmcgdGhlIE5nWm9uZSB0aHJvdWdoIHRoZSBkZWJvdW5jZSB0aW1lb3V0LlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9kb0NoZWNrU3ViamVjdFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBkZWJvdW5jZVRpbWUoMTApLCAvLyBBcmJpdHJhcnkgZGVib3VuY2UgdGltZSwgbGVzcyB0aGFuIGEgZnJhbWUgYXQgNjBmcHNcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jb250ZW50TWFyZ2luQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2RvQ2hlY2tTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZHJhd2Vycy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDYWxscyBgb3BlbmAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IGRyYXdlci5vcGVuKCkpO1xuICB9XG5cbiAgLyoqIENhbGxzIGBjbG9zZWAgb2YgYm90aCBzdGFydCBhbmQgZW5kIGRyYXdlcnMgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd2Vycy5mb3JFYWNoKGRyYXdlciA9PiBkcmF3ZXIuY2xvc2UoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIGFuZCB1cGRhdGVzIHRoZSBpbmxpbmUgc3R5bGVzIGZvciB0aGUgY29udGVudC4gTm90ZSB0aGF0IHRoaXMgc2hvdWxkIGJlIHVzZWRcbiAgICogc3BhcmluZ2x5LCBiZWNhdXNlIGl0IGNhdXNlcyBhIHJlZmxvdy5cbiAgICovXG4gIHVwZGF0ZUNvbnRlbnRNYXJnaW5zKCkge1xuICAgIC8vIDEuIEZvciBkcmF3ZXJzIGluIGBvdmVyYCBtb2RlLCB0aGV5IGRvbid0IGFmZmVjdCB0aGUgY29udGVudC5cbiAgICAvLyAyLiBGb3IgZHJhd2VycyBpbiBgc2lkZWAgbW9kZSB0aGV5IHNob3VsZCBzaHJpbmsgdGhlIGNvbnRlbnQuIFdlIGRvIHRoaXMgYnkgYWRkaW5nIHRvIHRoZVxuICAgIC8vICAgIGxlZnQgbWFyZ2luIChmb3IgbGVmdCBkcmF3ZXIpIG9yIHJpZ2h0IG1hcmdpbiAoZm9yIHJpZ2h0IHRoZSBkcmF3ZXIpLlxuICAgIC8vIDMuIEZvciBkcmF3ZXJzIGluIGBwdXNoYCBtb2RlIHRoZSBzaG91bGQgc2hpZnQgdGhlIGNvbnRlbnQgd2l0aG91dCByZXNpemluZyBpdC4gV2UgZG8gdGhpcyBieVxuICAgIC8vICAgIGFkZGluZyB0byB0aGUgbGVmdCBvciByaWdodCBtYXJnaW4gYW5kIHNpbXVsdGFuZW91c2x5IHN1YnRyYWN0aW5nIHRoZSBzYW1lIGFtb3VudCBvZlxuICAgIC8vICAgIG1hcmdpbiBmcm9tIHRoZSBvdGhlciBzaWRlLlxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBsZXQgcmlnaHQgPSAwO1xuXG4gICAgaWYgKHRoaXMuX2xlZnQgJiYgdGhpcy5fbGVmdC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9sZWZ0Lm1vZGUgPT0gJ3NpZGUnKSB7XG4gICAgICAgIGxlZnQgKz0gdGhpcy5fbGVmdC5fZ2V0V2lkdGgoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGVmdC5tb2RlID09ICdwdXNoJykge1xuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2xlZnQuX2dldFdpZHRoKCk7XG4gICAgICAgIGxlZnQgKz0gd2lkdGg7XG4gICAgICAgIHJpZ2h0IC09IHdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9yaWdodCAmJiB0aGlzLl9yaWdodC5vcGVuZWQpIHtcbiAgICAgIGlmICh0aGlzLl9yaWdodC5tb2RlID09ICdzaWRlJykge1xuICAgICAgICByaWdodCArPSB0aGlzLl9yaWdodC5fZ2V0V2lkdGgoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcmlnaHQubW9kZSA9PSAncHVzaCcpIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9yaWdodC5fZ2V0V2lkdGgoKTtcbiAgICAgICAgcmlnaHQgKz0gd2lkdGg7XG4gICAgICAgIGxlZnQgLT0gd2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgZWl0aGVyIGByaWdodGAgb3IgYGxlZnRgIGlzIHplcm8sIGRvbid0IHNldCBhIHN0eWxlIHRvIHRoZSBlbGVtZW50LiBUaGlzXG4gICAgLy8gYWxsb3dzIHVzZXJzIHRvIHNwZWNpZnkgYSBjdXN0b20gc2l6ZSB2aWEgQ1NTIGNsYXNzIGluIFNTUiBzY2VuYXJpb3Mgd2hlcmUgdGhlXG4gICAgLy8gbWVhc3VyZWQgd2lkdGhzIHdpbGwgYWx3YXlzIGJlIHplcm8uIE5vdGUgdGhhdCB3ZSByZXNldCB0byBgbnVsbGAgaGVyZSwgcmF0aGVyXG4gICAgLy8gdGhhbiBiZWxvdywgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgdGhlIHR5cGVzIGluIHRoZSBgaWZgIGJlbG93IGFyZSBjb25zaXN0ZW50LlxuICAgIGxlZnQgPSBsZWZ0IHx8IG51bGwhO1xuICAgIHJpZ2h0ID0gcmlnaHQgfHwgbnVsbCE7XG5cbiAgICBpZiAobGVmdCAhPT0gdGhpcy5fY29udGVudE1hcmdpbnMubGVmdCB8fCByaWdodCAhPT0gdGhpcy5fY29udGVudE1hcmdpbnMucmlnaHQpIHtcbiAgICAgIHRoaXMuX2NvbnRlbnRNYXJnaW5zID0ge2xlZnQsIHJpZ2h0fTtcblxuICAgICAgLy8gUHVsbCBiYWNrIGludG8gdGhlIE5nWm9uZSBzaW5jZSBpbiBzb21lIGNhc2VzIHdlIGNvdWxkIGJlIG91dHNpZGUuIFdlIG5lZWQgdG8gYmUgY2FyZWZ1bFxuICAgICAgLy8gdG8gZG8gaXQgb25seSB3aGVuIHNvbWV0aGluZyBjaGFuZ2VkLCBvdGhlcndpc2Ugd2UgY2FuIGVuZCB1cCBoaXR0aW5nIHRoZSB6b25lIHRvbyBvZnRlbi5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5fY29udGVudE1hcmdpbkNoYW5nZXMubmV4dCh0aGlzLl9jb250ZW50TWFyZ2lucykpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICAvLyBJZiB1c2VycyBvcHRlZCBpbnRvIGF1dG9zaXppbmcsIGRvIGEgY2hlY2sgZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy5fYXV0b3NpemUgJiYgdGhpcy5faXNQdXNoZWQoKSkge1xuICAgICAgLy8gUnVuIG91dHNpZGUgdGhlIE5nWm9uZSwgb3RoZXJ3aXNlIHRoZSBkZWJvdW5jZXIgd2lsbCB0aHJvdyB1cyBpbnRvIGFuIGluZmluaXRlIGxvb3AuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5fZG9DaGVja1N1YmplY3QubmV4dCgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBkcmF3ZXIgZXZlbnRzIGluIG9yZGVyIHRvIHNldCBhIGNsYXNzIG9uIHRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50IHdoZW4gdGhlXG4gICAqIGRyYXdlciBpcyBvcGVuIGFuZCB0aGUgYmFja2Ryb3AgaXMgdmlzaWJsZS4gVGhpcyBlbnN1cmVzIGFueSBvdmVyZmxvdyBvbiB0aGUgY29udGFpbmVyIGVsZW1lbnRcbiAgICogaXMgcHJvcGVybHkgaGlkZGVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfd2F0Y2hEcmF3ZXJUb2dnbGUoZHJhd2VyOiBNYXREcmF3ZXIpOiB2b2lkIHtcbiAgICBkcmF3ZXIuX2FuaW1hdGlvblN0YXJ0ZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4gZXZlbnQuZnJvbVN0YXRlICE9PSBldmVudC50b1N0YXRlKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcyksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogQW5pbWF0aW9uRXZlbnQpID0+IHtcbiAgICAgICAgLy8gU2V0IHRoZSB0cmFuc2l0aW9uIGNsYXNzIG9uIHRoZSBjb250YWluZXIgc28gdGhhdCB0aGUgYW5pbWF0aW9ucyBvY2N1ci4gVGhpcyBzaG91bGQgbm90XG4gICAgICAgIC8vIGJlIHNldCBpbml0aWFsbHkgYmVjYXVzZSBhbmltYXRpb25zIHNob3VsZCBvbmx5IGJlIHRyaWdnZXJlZCB2aWEgYSBjaGFuZ2UgaW4gc3RhdGUuXG4gICAgICAgIGlmIChldmVudC50b1N0YXRlICE9PSAnb3Blbi1pbnN0YW50JyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1kcmF3ZXItdHJhbnNpdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50TWFyZ2lucygpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGRyYXdlci5tb2RlICE9PSAnc2lkZScpIHtcbiAgICAgIGRyYXdlci5vcGVuZWRDaGFuZ2VcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fc2V0Q29udGFpbmVyQ2xhc3MoZHJhd2VyLm9wZW5lZCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGRyYXdlciBvblBvc2l0aW9uQ2hhbmdlZCBldmVudCBpbiBvcmRlciB0b1xuICAgKiByZS12YWxpZGF0ZSBkcmF3ZXJzIHdoZW4gdGhlIHBvc2l0aW9uIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF93YXRjaERyYXdlclBvc2l0aW9uKGRyYXdlcjogTWF0RHJhd2VyKTogdm9pZCB7XG4gICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTk9URTogV2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IGJlZm9yZSB2YWxpZGF0aW5nLFxuICAgIC8vIHNpbmNlIGJvdGggZHJhd2VycyBtYXkgYmUgc3dhcHBpbmcgcG9zaXRpb25zIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgZHJhd2VyLm9uUG9zaXRpb25DaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2RyYXdlcnMuY2hhbmdlcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBhZnRlck5leHRSZW5kZXIoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLl92YWxpZGF0ZURyYXdlcnMoKTtcbiAgICAgICAgfSxcbiAgICAgICAge2luamVjdG9yOiB0aGlzLl9pbmplY3RvciwgcGhhc2U6IEFmdGVyUmVuZGVyUGhhc2UuUmVhZH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFN1YnNjcmliZXMgdG8gY2hhbmdlcyBpbiBkcmF3ZXIgbW9kZSBzbyB3ZSBjYW4gcnVuIGNoYW5nZSBkZXRlY3Rpb24uICovXG4gIHByaXZhdGUgX3dhdGNoRHJhd2VyTW9kZShkcmF3ZXI6IE1hdERyYXdlcik6IHZvaWQge1xuICAgIGlmIChkcmF3ZXIpIHtcbiAgICAgIGRyYXdlci5fbW9kZUNoYW5nZWRcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMuX2RyYXdlcnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveWVkKSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlQ29udGVudE1hcmdpbnMoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlICdtYXQtZHJhd2VyLW9wZW5lZCcgY2xhc3Mgb24gdGhlIG1haW4gJ21hdC1kcmF3ZXItY29udGFpbmVyJyBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9zZXRDb250YWluZXJDbGFzcyhpc0FkZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gJ21hdC1kcmF3ZXItY29udGFpbmVyLWhhcy1vcGVuJztcblxuICAgIGlmIChpc0FkZCkge1xuICAgICAgY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBzdGF0ZSBvZiB0aGUgZHJhd2VyIGNoaWxkcmVuIGNvbXBvbmVudHMuICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlRHJhd2VycygpIHtcbiAgICB0aGlzLl9zdGFydCA9IHRoaXMuX2VuZCA9IG51bGw7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGF0IG1vc3Qgb25lIHN0YXJ0IGFuZCBvbmUgZW5kIGRyYXdlci5cbiAgICB0aGlzLl9kcmF3ZXJzLmZvckVhY2goZHJhd2VyID0+IHtcbiAgICAgIGlmIChkcmF3ZXIucG9zaXRpb24gPT0gJ2VuZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VuZCAhPSBudWxsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ2VuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VuZCA9IGRyYXdlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydCAhPSBudWxsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgICAgdGhyb3dNYXREdXBsaWNhdGVkRHJhd2VyRXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RhcnQgPSBkcmF3ZXI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9yaWdodCA9IHRoaXMuX2xlZnQgPSBudWxsO1xuXG4gICAgLy8gRGV0ZWN0IGlmIHdlJ3JlIExUUiBvciBSVEwuXG4gICAgaWYgKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSB7XG4gICAgICB0aGlzLl9sZWZ0ID0gdGhpcy5fZW5kO1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9zdGFydDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGVmdCA9IHRoaXMuX3N0YXJ0O1xuICAgICAgdGhpcy5fcmlnaHQgPSB0aGlzLl9lbmQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbnRhaW5lciBpcyBiZWluZyBwdXNoZWQgdG8gdGhlIHNpZGUgYnkgb25lIG9mIHRoZSBkcmF3ZXJzLiAqL1xuICBwcml2YXRlIF9pc1B1c2hlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgKHRoaXMuX2lzRHJhd2VyT3Blbih0aGlzLl9zdGFydCkgJiYgdGhpcy5fc3RhcnQubW9kZSAhPSAnb3ZlcicpIHx8XG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fZW5kLm1vZGUgIT0gJ292ZXInKVxuICAgICk7XG4gIH1cblxuICBfb25CYWNrZHJvcENsaWNrZWQoKSB7XG4gICAgdGhpcy5iYWNrZHJvcENsaWNrLmVtaXQoKTtcbiAgICB0aGlzLl9jbG9zZU1vZGFsRHJhd2Vyc1ZpYUJhY2tkcm9wKCk7XG4gIH1cblxuICBfY2xvc2VNb2RhbERyYXdlcnNWaWFCYWNrZHJvcCgpIHtcbiAgICAvLyBDbG9zZSBhbGwgb3BlbiBkcmF3ZXJzIHdoZXJlIGNsb3NpbmcgaXMgbm90IGRpc2FibGVkIGFuZCB0aGUgbW9kZSBpcyBub3QgYHNpZGVgLlxuICAgIFt0aGlzLl9zdGFydCwgdGhpcy5fZW5kXVxuICAgICAgLmZpbHRlcihkcmF3ZXIgPT4gZHJhd2VyICYmICFkcmF3ZXIuZGlzYWJsZUNsb3NlICYmIHRoaXMuX2RyYXdlckhhc0JhY2tkcm9wKGRyYXdlcikpXG4gICAgICAuZm9yRWFjaChkcmF3ZXIgPT4gZHJhd2VyIS5fY2xvc2VWaWFCYWNrZHJvcENsaWNrKCkpO1xuICB9XG5cbiAgX2lzU2hvd2luZ0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX3N0YXJ0KSAmJiB0aGlzLl9kcmF3ZXJIYXNCYWNrZHJvcCh0aGlzLl9zdGFydCkpIHx8XG4gICAgICAodGhpcy5faXNEcmF3ZXJPcGVuKHRoaXMuX2VuZCkgJiYgdGhpcy5fZHJhd2VySGFzQmFja2Ryb3AodGhpcy5fZW5kKSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNEcmF3ZXJPcGVuKGRyYXdlcjogTWF0RHJhd2VyIHwgbnVsbCk6IGRyYXdlciBpcyBNYXREcmF3ZXIge1xuICAgIHJldHVybiBkcmF3ZXIgIT0gbnVsbCAmJiBkcmF3ZXIub3BlbmVkO1xuICB9XG5cbiAgLy8gV2hldGhlciBhcmd1bWVudCBkcmF3ZXIgc2hvdWxkIGhhdmUgYSBiYWNrZHJvcCB3aGVuIGl0IG9wZW5zXG4gIHByaXZhdGUgX2RyYXdlckhhc0JhY2tkcm9wKGRyYXdlcjogTWF0RHJhd2VyIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9iYWNrZHJvcE92ZXJyaWRlID09IG51bGwpIHtcbiAgICAgIHJldHVybiAhIWRyYXdlciAmJiBkcmF3ZXIubW9kZSAhPT0gJ3NpZGUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9iYWNrZHJvcE92ZXJyaWRlO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LWRyYXdlci1pbm5lci1jb250YWluZXJcIiBjZGtTY3JvbGxhYmxlICNjb250ZW50PlxyXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuPC9kaXY+XHJcbiIsIkBpZiAoaGFzQmFja2Ryb3ApIHtcbiAgPGRpdiBjbGFzcz1cIm1hdC1kcmF3ZXItYmFja2Ryb3BcIiAoY2xpY2spPVwiX29uQmFja2Ryb3BDbGlja2VkKClcIlxuICAgICAgIFtjbGFzcy5tYXQtZHJhd2VyLXNob3duXT1cIl9pc1Nob3dpbmdCYWNrZHJvcCgpXCI+PC9kaXY+XG59XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1kcmF3ZXJcIj48L25nLWNvbnRlbnQ+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1kcmF3ZXItY29udGVudFwiPlxuPC9uZy1jb250ZW50PlxuXG5AaWYgKCFfY29udGVudCkge1xuICA8bWF0LWRyYXdlci1jb250ZW50PlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9tYXQtZHJhd2VyLWNvbnRlbnQ+XG59XG4iXX0=