/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __read } from "tslib";
import { FocusMonitor, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, Optional, Output, Self, ViewContainerRef, } from '@angular/core';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { MatMenu } from './menu';
import { throwMatMenuMissingError } from './menu-errors';
import { MatMenuItem } from './menu-item';
/** Injection token that determines the scroll handling while the menu is open. */
export var MAT_MENU_SCROLL_STRATEGY = new InjectionToken('mat-menu-scroll-strategy');
/** @docs-private */
export function MAT_MENU_SCROLL_STRATEGY_FACTORY(overlay) {
    return function () { return overlay.scrollStrategies.reposition(); };
}
/** @docs-private */
export var MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_MENU_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_MENU_SCROLL_STRATEGY_FACTORY,
};
/** Default top padding of the menu panel. */
export var MENU_PANEL_TOP_PADDING = 8;
/** Options for binding a passive event listener. */
var passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });
// TODO(andrewseguin): Remove the kebab versions in favor of camelCased attribute selectors
/** Directive applied to an element that should trigger a `mat-menu`. */
var MatMenuTrigger = /** @class */ (function () {
    function MatMenuTrigger(_overlay, _element, _viewContainerRef, scrollStrategy, _parentMenu, _menuItemInstance, _dir, 
    // TODO(crisbeto): make the _focusMonitor required when doing breaking changes.
    // @breaking-change 8.0.0
    _focusMonitor) {
        var _this = this;
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._parentMenu = _parentMenu;
        this._menuItemInstance = _menuItemInstance;
        this._dir = _dir;
        this._focusMonitor = _focusMonitor;
        this._overlayRef = null;
        this._menuOpen = false;
        this._closingActionsSubscription = Subscription.EMPTY;
        this._hoverSubscription = Subscription.EMPTY;
        this._menuCloseSubscription = Subscription.EMPTY;
        /**
         * Handles touch start events on the trigger.
         * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
         */
        this._handleTouchStart = function () { return _this._openedBy = 'touch'; };
        // Tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the menu is opened via the keyboard
        this._openedBy = null;
        /**
         * Whether focus should be restored when the menu is closed.
         * Note that disabling this option can have accessibility implications
         * and it's up to you to manage focus, if you decide to turn it off.
         */
        this.restoreFocus = true;
        /** Event emitted when the associated menu is opened. */
        this.menuOpened = new EventEmitter();
        /**
         * Event emitted when the associated menu is opened.
         * @deprecated Switch to `menuOpened` instead
         * @breaking-change 8.0.0
         */
        // tslint:disable-next-line:no-output-on-prefix
        this.onMenuOpen = this.menuOpened;
        /** Event emitted when the associated menu is closed. */
        this.menuClosed = new EventEmitter();
        /**
         * Event emitted when the associated menu is closed.
         * @deprecated Switch to `menuClosed` instead
         * @breaking-change 8.0.0
         */
        // tslint:disable-next-line:no-output-on-prefix
        this.onMenuClose = this.menuClosed;
        _element.nativeElement.addEventListener('touchstart', this._handleTouchStart, passiveEventListenerOptions);
        if (_menuItemInstance) {
            _menuItemInstance._triggersSubmenu = this.triggersSubmenu();
        }
        this._scrollStrategy = scrollStrategy;
    }
    Object.defineProperty(MatMenuTrigger.prototype, "_deprecatedMatMenuTriggerFor", {
        /**
         * @deprecated
         * @breaking-change 8.0.0
         */
        get: function () { return this.menu; },
        set: function (v) {
            this.menu = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenuTrigger.prototype, "menu", {
        /** References the menu instance that the trigger is associated with. */
        get: function () { return this._menu; },
        set: function (menu) {
            var _this = this;
            if (menu === this._menu) {
                return;
            }
            this._menu = menu;
            this._menuCloseSubscription.unsubscribe();
            if (menu) {
                this._menuCloseSubscription = menu.close.asObservable().subscribe(function (reason) {
                    _this._destroyMenu();
                    // If a click closed the menu, we should close the entire chain of nested menus.
                    if ((reason === 'click' || reason === 'tab') && _this._parentMenu) {
                        _this._parentMenu.closed.emit(reason);
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    MatMenuTrigger.prototype.ngAfterContentInit = function () {
        this._checkMenu();
        this._handleHover();
    };
    MatMenuTrigger.prototype.ngOnDestroy = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._element.nativeElement.removeEventListener('touchstart', this._handleTouchStart, passiveEventListenerOptions);
        this._menuCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
        this._hoverSubscription.unsubscribe();
    };
    Object.defineProperty(MatMenuTrigger.prototype, "menuOpen", {
        /** Whether the menu is open. */
        get: function () {
            return this._menuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatMenuTrigger.prototype, "dir", {
        /** The text direction of the containing app. */
        get: function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /** Whether the menu triggers a sub-menu or a top-level one. */
    MatMenuTrigger.prototype.triggersSubmenu = function () {
        return !!(this._menuItemInstance && this._parentMenu);
    };
    /** Toggles the menu between the open and closed states. */
    MatMenuTrigger.prototype.toggleMenu = function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    /** Opens the menu. */
    MatMenuTrigger.prototype.openMenu = function () {
        var _this = this;
        if (this._menuOpen) {
            return;
        }
        this._checkMenu();
        var overlayRef = this._createOverlay();
        var overlayConfig = overlayRef.getConfig();
        this._setPosition(overlayConfig.positionStrategy);
        overlayConfig.hasBackdrop = this.menu.hasBackdrop == null ? !this.triggersSubmenu() :
            this.menu.hasBackdrop;
        overlayRef.attach(this._getPortal());
        if (this.menu.lazyContent) {
            this.menu.lazyContent.attach(this.menuData);
        }
        this._closingActionsSubscription = this._menuClosingActions().subscribe(function () { return _this.closeMenu(); });
        this._initMenu();
        if (this.menu instanceof MatMenu) {
            this.menu._startAnimation();
        }
    };
    /** Closes the menu. */
    MatMenuTrigger.prototype.closeMenu = function () {
        this.menu.close.emit();
    };
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    MatMenuTrigger.prototype.focus = function (origin, options) {
        if (origin === void 0) { origin = 'program'; }
        if (this._focusMonitor) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        else {
            this._element.nativeElement.focus(options);
        }
    };
    /** Closes the menu and does the necessary cleanup. */
    MatMenuTrigger.prototype._destroyMenu = function () {
        var _this = this;
        if (!this._overlayRef || !this.menuOpen) {
            return;
        }
        var menu = this.menu;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();
        if (menu instanceof MatMenu) {
            menu._resetAnimation();
            if (menu.lazyContent) {
                // Wait for the exit animation to finish before detaching the content.
                menu._animationDone
                    .pipe(filter(function (event) { return event.toState === 'void'; }), take(1), 
                // Interrupt if the content got re-attached.
                takeUntil(menu.lazyContent._attached))
                    .subscribe({
                    next: function () { return menu.lazyContent.detach(); },
                    // No matter whether the content got re-attached, reset the menu.
                    complete: function () { return _this._setIsMenuOpen(false); }
                });
            }
            else {
                this._setIsMenuOpen(false);
            }
        }
        else {
            this._setIsMenuOpen(false);
            if (menu.lazyContent) {
                menu.lazyContent.detach();
            }
        }
        this._restoreFocus();
    };
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    MatMenuTrigger.prototype._initMenu = function () {
        this.menu.parentMenu = this.triggersSubmenu() ? this._parentMenu : undefined;
        this.menu.direction = this.dir;
        this._setMenuElevation();
        this._setIsMenuOpen(true);
        this.menu.focusFirstItem(this._openedBy || 'program');
    };
    /** Updates the menu elevation based on the amount of parent menus that it has. */
    MatMenuTrigger.prototype._setMenuElevation = function () {
        if (this.menu.setElevation) {
            var depth = 0;
            var parentMenu = this.menu.parentMenu;
            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }
            this.menu.setElevation(depth);
        }
    };
    /** Restores focus to the element that was focused before the menu was open. */
    MatMenuTrigger.prototype._restoreFocus = function () {
        // We should reset focus if the user is navigating using a keyboard or
        // if we have a top-level trigger which might cause focus to be lost
        // when clicking on the backdrop.
        if (this.restoreFocus) {
            if (!this._openedBy) {
                // Note that the focus style will show up both for `program` and
                // `keyboard` so we don't have to specify which one it is.
                this.focus();
            }
            else if (!this.triggersSubmenu()) {
                this.focus(this._openedBy);
            }
        }
        this._openedBy = null;
    };
    // set state rather than toggle to support triggers sharing a menu
    MatMenuTrigger.prototype._setIsMenuOpen = function (isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
        if (this.triggersSubmenu()) {
            this._menuItemInstance._highlighted = isOpen;
        }
    };
    /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     */
    MatMenuTrigger.prototype._checkMenu = function () {
        if (!this.menu) {
            throwMatMenuMissingError();
        }
    };
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    MatMenuTrigger.prototype._createOverlay = function () {
        if (!this._overlayRef) {
            var config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
            // Consume the `keydownEvents` in order to prevent them from going to another overlay.
            // Ideally we'd also have our keyboard event logic in here, however doing so will
            // break anybody that may have implemented the `MatMenuPanel` themselves.
            this._overlayRef.keydownEvents().subscribe();
        }
        return this._overlayRef;
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    MatMenuTrigger.prototype._getOverlayConfig = function () {
        return new OverlayConfig({
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._element)
                .withLockedPosition()
                .withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
            backdropClass: this.menu.backdropClass || 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir
        });
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    MatMenuTrigger.prototype._subscribeToPositions = function (position) {
        var _this = this;
        if (this.menu.setPositionClasses) {
            position.positionChanges.subscribe(function (change) {
                var posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
                var posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
                _this.menu.setPositionClasses(posX, posY);
            });
        }
    };
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    MatMenuTrigger.prototype._setPosition = function (positionStrategy) {
        var _a = __read(this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'], 2), originX = _a[0], originFallbackX = _a[1];
        var _b = __read(this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], 2), overlayY = _b[0], overlayFallbackY = _b[1];
        var _c = __read([overlayY, overlayFallbackY], 2), originY = _c[0], originFallbackY = _c[1];
        var _d = __read([originX, originFallbackX], 2), overlayX = _d[0], overlayFallbackX = _d[1];
        var offsetY = 0;
        if (this.triggersSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            offsetY = overlayY === 'bottom' ? MENU_PANEL_TOP_PADDING : -MENU_PANEL_TOP_PADDING;
        }
        else if (!this.menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        positionStrategy.withPositions([
            { originX: originX, originY: originY, overlayX: overlayX, overlayY: overlayY, offsetY: offsetY },
            { originX: originFallbackX, originY: originY, overlayX: overlayFallbackX, overlayY: overlayY, offsetY: offsetY },
            {
                originX: originX,
                originY: originFallbackY,
                overlayX: overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            }
        ]);
    };
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    MatMenuTrigger.prototype._menuClosingActions = function () {
        var _this = this;
        var backdrop = this._overlayRef.backdropClick();
        var detachments = this._overlayRef.detachments();
        var parentClose = this._parentMenu ? this._parentMenu.closed : observableOf();
        var hover = this._parentMenu ? this._parentMenu._hovered().pipe(filter(function (active) { return active !== _this._menuItemInstance; }), filter(function () { return _this._menuOpen; })) : observableOf();
        return merge(backdrop, parentClose, hover, detachments);
    };
    /** Handles mouse presses on the trigger. */
    MatMenuTrigger.prototype._handleMousedown = function (event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the menu as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : null;
            // Since clicking on the trigger won't close the menu if it opens a sub-menu,
            // we should prevent focus from moving onto it via click to avoid the
            // highlight from lingering on the menu item.
            if (this.triggersSubmenu()) {
                event.preventDefault();
            }
        }
    };
    /** Handles key presses on the trigger. */
    MatMenuTrigger.prototype._handleKeydown = function (event) {
        var keyCode = event.keyCode;
        if (this.triggersSubmenu() && ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
            (keyCode === LEFT_ARROW && this.dir === 'rtl'))) {
            this.openMenu();
        }
    };
    /** Handles click events on the trigger. */
    MatMenuTrigger.prototype._handleClick = function (event) {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        }
        else {
            this.toggleMenu();
        }
    };
    /** Handles the cases where the user hovers over the trigger. */
    MatMenuTrigger.prototype._handleHover = function () {
        var _this = this;
        // Subscribe to changes in the hovered item in order to toggle the panel.
        if (!this.triggersSubmenu()) {
            return;
        }
        this._hoverSubscription = this._parentMenu._hovered()
            // Since we might have multiple competing triggers for the same menu (e.g. a sub-menu
            // with different data and triggers), we have to delay it by a tick to ensure that
            // it won't be closed immediately after it is opened.
            .pipe(filter(function (active) { return active === _this._menuItemInstance && !active.disabled; }), delay(0, asapScheduler))
            .subscribe(function () {
            _this._openedBy = 'mouse';
            // If the same menu is used between multiple triggers, it might still be animating
            // while the new trigger tries to re-open it. Wait for the animation to finish
            // before doing so. Also interrupt if the user moves to another item.
            if (_this.menu instanceof MatMenu && _this.menu._isAnimating) {
                // We need the `delay(0)` here in order to avoid
                // 'changed after checked' errors in some cases. See #12194.
                _this.menu._animationDone
                    .pipe(take(1), delay(0, asapScheduler), takeUntil(_this._parentMenu._hovered()))
                    .subscribe(function () { return _this.openMenu(); });
            }
            else {
                _this.openMenu();
            }
        });
    };
    /** Gets the portal that should be attached to the overlay. */
    MatMenuTrigger.prototype._getPortal = function () {
        // Note that we can avoid this check by keeping the portal on the menu panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MatMenuPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== this.menu.templateRef) {
            this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
        }
        return this._portal;
    };
    MatMenuTrigger.decorators = [
        { type: Directive, args: [{
                    selector: "[mat-menu-trigger-for], [matMenuTriggerFor]",
                    host: {
                        'class': 'mat-menu-trigger',
                        'aria-haspopup': 'true',
                        '[attr.aria-expanded]': 'menuOpen || null',
                        '[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                        '(click)': '_handleClick($event)',
                    },
                    exportAs: 'matMenuTrigger'
                },] }
    ];
    /** @nocollapse */
    MatMenuTrigger.ctorParameters = function () { return [
        { type: Overlay },
        { type: ElementRef },
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_SCROLL_STRATEGY,] }] },
        { type: MatMenu, decorators: [{ type: Optional }] },
        { type: MatMenuItem, decorators: [{ type: Optional }, { type: Self }] },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: FocusMonitor }
    ]; };
    MatMenuTrigger.propDecorators = {
        _deprecatedMatMenuTriggerFor: [{ type: Input, args: ['mat-menu-trigger-for',] }],
        menu: [{ type: Input, args: ['matMenuTriggerFor',] }],
        menuData: [{ type: Input, args: ['matMenuTriggerData',] }],
        restoreFocus: [{ type: Input, args: ['matMenuTriggerRestoreFocus',] }],
        menuOpened: [{ type: Output }],
        onMenuOpen: [{ type: Output }],
        menuClosed: [{ type: Output }],
        onMenuClose: [{ type: Output }]
    };
    return MatMenuTrigger;
}());
export { MatMenuTrigger };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFlLCtCQUErQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0YsT0FBTyxFQUFZLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUdMLE9BQU8sRUFDUCxhQUFhLEdBSWQsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sSUFBSSxFQUNKLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksWUFBWSxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1RSxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUl4QyxrRkFBa0Y7QUFDbEYsTUFBTSxD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bGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW4sIGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtMRUZUX0FSUk9XLCBSSUdIVF9BUlJPV30gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvcyxcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHthc2FwU2NoZWR1bGVyLCBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0TWVudX0gZnJvbSAnLi9tZW51JztcbmltcG9ydCB7dGhyb3dNYXRNZW51TWlzc2luZ0Vycm9yfSBmcm9tICcuL21lbnUtZXJyb3JzJztcbmltcG9ydCB7TWF0TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7TWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgbWVudSBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LW1lbnUtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBEZWZhdWx0IHRvcCBwYWRkaW5nIG9mIHRoZSBtZW51IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IE1FTlVfUEFORUxfVE9QX1BBRERJTkcgPSA4O1xuXG4vKiogT3B0aW9ucyBmb3IgYmluZGluZyBhIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8vIFRPRE8oYW5kcmV3c2VndWluKTogUmVtb3ZlIHRoZSBrZWJhYiB2ZXJzaW9ucyBpbiBmYXZvciBvZiBjYW1lbENhc2VkIGF0dHJpYnV0ZSBzZWxlY3RvcnNcblxuLyoqIERpcmVjdGl2ZSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgdHJpZ2dlciBhIGBtYXQtbWVudWAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LW1lbnUtdHJpZ2dlci1mb3JdLCBbbWF0TWVudVRyaWdnZXJGb3JdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWVudS10cmlnZ2VyJyxcbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnbWVudU9wZW4gfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ21lbnVPcGVuID8gbWVudS5wYW5lbElkIDogbnVsbCcsXG4gICAgJyhtb3VzZWRvd24pJzogJ19oYW5kbGVNb3VzZWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0TWVudVRyaWdnZXInXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVUcmlnZ2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9tZW51T3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfaG92ZXJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX21lbnVDbG9zZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRvdWNoIHN0YXJ0IGV2ZW50cyBvbiB0aGUgdHJpZ2dlci5cbiAgICogTmVlZHMgdG8gYmUgYW4gYXJyb3cgZnVuY3Rpb24gc28gd2UgY2FuIGVhc2lseSB1c2UgYWRkRXZlbnRMaXN0ZW5lciBhbmQgcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICovXG4gIHByaXZhdGUgX2hhbmRsZVRvdWNoU3RhcnQgPSAoKSA9PiB0aGlzLl9vcGVuZWRCeSA9ICd0b3VjaCc7XG5cbiAgLy8gVHJhY2tpbmcgaW5wdXQgdHlwZSBpcyBuZWNlc3Nhcnkgc28gaXQncyBwb3NzaWJsZSB0byBvbmx5IGF1dG8tZm9jdXNcbiAgLy8gdGhlIGZpcnN0IGl0ZW0gb2YgdGhlIGxpc3Qgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZFxuICBfb3BlbmVkQnk6ICdtb3VzZScgfCAndG91Y2gnIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgnbWF0LW1lbnUtdHJpZ2dlci1mb3InKVxuICBnZXQgX2RlcHJlY2F0ZWRNYXRNZW51VHJpZ2dlckZvcigpOiBNYXRNZW51UGFuZWwgeyByZXR1cm4gdGhpcy5tZW51OyB9XG4gIHNldCBfZGVwcmVjYXRlZE1hdE1lbnVUcmlnZ2VyRm9yKHY6IE1hdE1lbnVQYW5lbCkge1xuICAgIHRoaXMubWVudSA9IHY7XG4gIH1cblxuICAvKiogUmVmZXJlbmNlcyB0aGUgbWVudSBpbnN0YW5jZSB0aGF0IHRoZSB0cmlnZ2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KCdtYXRNZW51VHJpZ2dlckZvcicpXG4gIGdldCBtZW51KCkgeyByZXR1cm4gdGhpcy5fbWVudTsgfVxuICBzZXQgbWVudShtZW51OiBNYXRNZW51UGFuZWwpIHtcbiAgICBpZiAobWVudSA9PT0gdGhpcy5fbWVudSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21lbnUgPSBtZW51O1xuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKG1lbnUpIHtcbiAgICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbiA9IG1lbnUuY2xvc2UuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKHJlYXNvbiA9PiB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lNZW51KCk7XG5cbiAgICAgICAgLy8gSWYgYSBjbGljayBjbG9zZWQgdGhlIG1lbnUsIHdlIHNob3VsZCBjbG9zZSB0aGUgZW50aXJlIGNoYWluIG9mIG5lc3RlZCBtZW51cy5cbiAgICAgICAgaWYgKChyZWFzb24gPT09ICdjbGljaycgfHwgcmVhc29uID09PSAndGFiJykgJiYgdGhpcy5fcGFyZW50TWVudSkge1xuICAgICAgICAgIHRoaXMuX3BhcmVudE1lbnUuY2xvc2VkLmVtaXQocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21lbnU6IE1hdE1lbnVQYW5lbDtcblxuICAvKiogRGF0YSB0byBiZSBwYXNzZWQgYWxvbmcgdG8gYW55IGxhemlseS1yZW5kZXJlZCBjb250ZW50LiAqL1xuICBASW5wdXQoJ21hdE1lbnVUcmlnZ2VyRGF0YScpIG1lbnVEYXRhOiBhbnk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgZm9jdXMgc2hvdWxkIGJlIHJlc3RvcmVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBOb3RlIHRoYXQgZGlzYWJsaW5nIHRoaXMgb3B0aW9uIGNhbiBoYXZlIGFjY2Vzc2liaWxpdHkgaW1wbGljYXRpb25zXG4gICAqIGFuZCBpdCdzIHVwIHRvIHlvdSB0byBtYW5hZ2UgZm9jdXMsIGlmIHlvdSBkZWNpZGUgdG8gdHVybiBpdCBvZmYuXG4gICAqL1xuICBASW5wdXQoJ21hdE1lbnVUcmlnZ2VyUmVzdG9yZUZvY3VzJykgcmVzdG9yZUZvY3VzOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgb3BlbmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWVudU9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBvcGVuZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgbWVudU9wZW5lZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgcmVhZG9ubHkgb25NZW51T3BlbjogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gdGhpcy5tZW51T3BlbmVkO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtZW51Q2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIGNsb3NlZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBtZW51Q2xvc2VkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvbk1lbnVDbG9zZTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gdGhpcy5tZW51Q2xvc2VkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfcGFyZW50TWVudTogTWF0TWVudSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwcml2YXRlIF9tZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IG1ha2UgdGhlIF9mb2N1c01vbml0b3IgcmVxdWlyZWQgd2hlbiBkb2luZyBicmVha2luZyBjaGFuZ2VzLlxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcikge1xuXG4gICAgX2VsZW1lbnQubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2hTdGFydCxcbiAgICAgICAgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKTtcblxuICAgIGlmIChfbWVudUl0ZW1JbnN0YW5jZSkge1xuICAgICAgX21lbnVJdGVtSW5zdGFuY2UuX3RyaWdnZXJzU3VibWVudSA9IHRoaXMudHJpZ2dlcnNTdWJtZW51KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja01lbnUoKTtcbiAgICB0aGlzLl9oYW5kbGVIb3ZlcigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0LFxuICAgICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbWVudUNsb3NlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9ob3ZlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgZ2V0IG1lbnVPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbjtcbiAgfVxuXG4gIC8qKiBUaGUgdGV4dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBnZXQgZGlyKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IHRyaWdnZXJzIGEgc3ViLW1lbnUgb3IgYSB0b3AtbGV2ZWwgb25lLiAqL1xuICB0cmlnZ2Vyc1N1Ym1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHRoaXMuX21lbnVJdGVtSW5zdGFuY2UgJiYgdGhpcy5fcGFyZW50TWVudSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgbWVudSBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbiA/IHRoaXMuY2xvc2VNZW51KCkgOiB0aGlzLm9wZW5NZW51KCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIG9wZW5NZW51KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tZW51T3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrTWVudSgpO1xuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKTtcblxuICAgIHRoaXMuX3NldFBvc2l0aW9uKG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPSB0aGlzLm1lbnUuaGFzQmFja2Ryb3AgPT0gbnVsbCA/ICF0aGlzLnRyaWdnZXJzU3VibWVudSgpIDpcbiAgICAgICAgdGhpcy5tZW51Lmhhc0JhY2tkcm9wO1xuICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX2dldFBvcnRhbCgpKTtcblxuICAgIGlmICh0aGlzLm1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgIHRoaXMubWVudS5sYXp5Q29udGVudC5hdHRhY2godGhpcy5tZW51RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSB0aGlzLl9tZW51Q2xvc2luZ0FjdGlvbnMoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZU1lbnUoKSk7XG4gICAgdGhpcy5faW5pdE1lbnUoKTtcblxuICAgIGlmICh0aGlzLm1lbnUgaW5zdGFuY2VvZiBNYXRNZW51KSB7XG4gICAgICB0aGlzLm1lbnUuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgbWVudS4gKi9cbiAgY2xvc2VNZW51KCk6IHZvaWQge1xuICAgIHRoaXMubWVudS5jbG9zZS5lbWl0KCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgbWVudSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0gb3JpZ2luIFNvdXJjZSBvZiB0aGUgbWVudSB0cmlnZ2VyJ3MgZm9jdXMuXG4gICAqL1xuICBmb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvcikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBtZW51IGFuZCBkb2VzIHRoZSBuZWNlc3NhcnkgY2xlYW51cC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveU1lbnUoKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmIHx8ICF0aGlzLm1lbnVPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWVudSA9IHRoaXMubWVudTtcblxuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcblxuICAgIGlmIChtZW51IGluc3RhbmNlb2YgTWF0TWVudSkge1xuICAgICAgbWVudS5fcmVzZXRBbmltYXRpb24oKTtcblxuICAgICAgaWYgKG1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgZGV0YWNoaW5nIHRoZSBjb250ZW50LlxuICAgICAgICBtZW51Ll9hbmltYXRpb25Eb25lXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAvLyBJbnRlcnJ1cHQgaWYgdGhlIGNvbnRlbnQgZ290IHJlLWF0dGFjaGVkLlxuICAgICAgICAgICAgdGFrZVVudGlsKG1lbnUubGF6eUNvbnRlbnQuX2F0dGFjaGVkKVxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgIG5leHQ6ICgpID0+IG1lbnUubGF6eUNvbnRlbnQhLmRldGFjaCgpLFxuICAgICAgICAgICAgLy8gTm8gbWF0dGVyIHdoZXRoZXIgdGhlIGNvbnRlbnQgZ290IHJlLWF0dGFjaGVkLCByZXNldCB0aGUgbWVudS5cbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB0aGlzLl9zZXRJc01lbnVPcGVuKGZhbHNlKVxuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldElzTWVudU9wZW4oZmFsc2UpO1xuXG4gICAgICBpZiAobWVudS5sYXp5Q29udGVudCkge1xuICAgICAgICBtZW51LmxhenlDb250ZW50LmRldGFjaCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIG1lbnUgc3RhdGUgdG8gb3BlbiBhbmQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbSBpZlxuICAgKiB0aGUgbWVudSB3YXMgb3BlbmVkIHZpYSB0aGUga2V5Ym9hcmQuXG4gICAqL1xuICBwcml2YXRlIF9pbml0TWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLm1lbnUucGFyZW50TWVudSA9IHRoaXMudHJpZ2dlcnNTdWJtZW51KCkgPyB0aGlzLl9wYXJlbnRNZW51IDogdW5kZWZpbmVkO1xuICAgIHRoaXMubWVudS5kaXJlY3Rpb24gPSB0aGlzLmRpcjtcbiAgICB0aGlzLl9zZXRNZW51RWxldmF0aW9uKCk7XG4gICAgdGhpcy5fc2V0SXNNZW51T3Blbih0cnVlKTtcbiAgICB0aGlzLm1lbnUuZm9jdXNGaXJzdEl0ZW0odGhpcy5fb3BlbmVkQnkgfHwgJ3Byb2dyYW0nKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBtZW51IGVsZXZhdGlvbiBiYXNlZCBvbiB0aGUgYW1vdW50IG9mIHBhcmVudCBtZW51cyB0aGF0IGl0IGhhcy4gKi9cbiAgcHJpdmF0ZSBfc2V0TWVudUVsZXZhdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tZW51LnNldEVsZXZhdGlvbikge1xuICAgICAgbGV0IGRlcHRoID0gMDtcbiAgICAgIGxldCBwYXJlbnRNZW51ID0gdGhpcy5tZW51LnBhcmVudE1lbnU7XG5cbiAgICAgIHdoaWxlIChwYXJlbnRNZW51KSB7XG4gICAgICAgIGRlcHRoKys7XG4gICAgICAgIHBhcmVudE1lbnUgPSBwYXJlbnRNZW51LnBhcmVudE1lbnU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWVudS5zZXRFbGV2YXRpb24oZGVwdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgbWVudSB3YXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIC8vIFdlIHNob3VsZCByZXNldCBmb2N1cyBpZiB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nIHVzaW5nIGEga2V5Ym9hcmQgb3JcbiAgICAvLyBpZiB3ZSBoYXZlIGEgdG9wLWxldmVsIHRyaWdnZXIgd2hpY2ggbWlnaHQgY2F1c2UgZm9jdXMgdG8gYmUgbG9zdFxuICAgIC8vIHdoZW4gY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLlxuICAgIGlmICh0aGlzLnJlc3RvcmVGb2N1cykge1xuICAgICAgaWYgKCF0aGlzLl9vcGVuZWRCeSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGZvY3VzIHN0eWxlIHdpbGwgc2hvdyB1cCBib3RoIGZvciBgcHJvZ3JhbWAgYW5kXG4gICAgICAgIC8vIGBrZXlib2FyZGAgc28gd2UgZG9uJ3QgaGF2ZSB0byBzcGVjaWZ5IHdoaWNoIG9uZSBpdCBpcy5cbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgICB0aGlzLmZvY3VzKHRoaXMuX29wZW5lZEJ5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9vcGVuZWRCeSA9IG51bGw7XG4gIH1cblxuICAvLyBzZXQgc3RhdGUgcmF0aGVyIHRoYW4gdG9nZ2xlIHRvIHN1cHBvcnQgdHJpZ2dlcnMgc2hhcmluZyBhIG1lbnVcbiAgcHJpdmF0ZSBfc2V0SXNNZW51T3Blbihpc09wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9tZW51T3BlbiA9IGlzT3BlbjtcbiAgICB0aGlzLl9tZW51T3BlbiA/IHRoaXMubWVudU9wZW5lZC5lbWl0KCkgOiB0aGlzLm1lbnVDbG9zZWQuZW1pdCgpO1xuXG4gICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgIHRoaXMuX21lbnVJdGVtSW5zdGFuY2UuX2hpZ2hsaWdodGVkID0gaXNPcGVuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjaGVja3MgdGhhdCBhIHZhbGlkIGluc3RhbmNlIG9mIE1hdE1lbnUgaGFzIGJlZW4gcGFzc2VkIGludG9cbiAgICogbWF0TWVudVRyaWdnZXJGb3IuIElmIG5vdCwgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrTWVudSgpIHtcbiAgICBpZiAoIXRoaXMubWVudSkge1xuICAgICAgdGhyb3dNYXRNZW51TWlzc2luZ0Vycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgdGhlIG92ZXJsYXkgZnJvbSB0aGUgcHJvdmlkZWQgbWVudSdzIHRlbXBsYXRlIGFuZCBzYXZlcyBpdHNcbiAgICogT3ZlcmxheVJlZiBzbyB0aGF0IGl0IGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgRE9NIHdoZW4gb3Blbk1lbnUgaXMgY2FsbGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheSgpOiBPdmVybGF5UmVmIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldE92ZXJsYXlDb25maWcoKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvUG9zaXRpb25zKGNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoY29uZmlnKTtcblxuICAgICAgLy8gQ29uc3VtZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHByZXZlbnQgdGhlbSBmcm9tIGdvaW5nIHRvIGFub3RoZXIgb3ZlcmxheS5cbiAgICAgIC8vIElkZWFsbHkgd2UnZCBhbHNvIGhhdmUgb3VyIGtleWJvYXJkIGV2ZW50IGxvZ2ljIGluIGhlcmUsIGhvd2V2ZXIgZG9pbmcgc28gd2lsbFxuICAgICAgLy8gYnJlYWsgYW55Ym9keSB0aGF0IG1heSBoYXZlIGltcGxlbWVudGVkIHRoZSBgTWF0TWVudVBhbmVsYCB0aGVtc2VsdmVzLlxuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYnVpbGRzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBuZWVkZWQgdG8gY3JlYXRlIHRoZSBvdmVybGF5LCB0aGUgT3ZlcmxheVN0YXRlLlxuICAgKiBAcmV0dXJucyBPdmVybGF5Q29uZmlnXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKCk6IE92ZXJsYXlDb25maWcge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9lbGVtZW50KVxuICAgICAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKVxuICAgICAgICAgIC53aXRoVHJhbnNmb3JtT3JpZ2luT24oJy5tYXQtbWVudS1wYW5lbCwgLm1hdC1tZGMtbWVudS1wYW5lbCcpLFxuICAgICAgYmFja2Ryb3BDbGFzczogdGhpcy5tZW51LmJhY2tkcm9wQ2xhc3MgfHwgJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXJcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5IGFuZCBzZXRzIHRoZSBjb3JyZWN0IGNsYXNzZXNcbiAgICogb24gdGhlIG1lbnUgYmFzZWQgb24gdGhlIG5ldyBwb3NpdGlvbi4gVGhpcyBlbnN1cmVzIHRoZSBhbmltYXRpb24gb3JpZ2luIGlzIGFsd2F5c1xuICAgKiBjb3JyZWN0LCBldmVuIGlmIGEgZmFsbGJhY2sgcG9zaXRpb24gaXMgdXNlZCBmb3IgdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb1Bvc2l0aW9ucyhwb3NpdGlvbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWVudS5zZXRQb3NpdGlvbkNsYXNzZXMpIHtcbiAgICAgIHBvc2l0aW9uLnBvc2l0aW9uQ2hhbmdlcy5zdWJzY3JpYmUoY2hhbmdlID0+IHtcbiAgICAgICAgY29uc3QgcG9zWDogTWVudVBvc2l0aW9uWCA9IGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WCA9PT0gJ3N0YXJ0JyA/ICdhZnRlcicgOiAnYmVmb3JlJztcbiAgICAgICAgY29uc3QgcG9zWTogTWVudVBvc2l0aW9uWSA9IGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WSA9PT0gJ3RvcCcgPyAnYmVsb3cnIDogJ2Fib3ZlJztcblxuICAgICAgICB0aGlzLm1lbnUuc2V0UG9zaXRpb25DbGFzc2VzIShwb3NYLCBwb3NZKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhcHByb3ByaWF0ZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneVxuICAgKiBzbyB0aGUgb3ZlcmxheSBjb25uZWN0cyB3aXRoIHRoZSB0cmlnZ2VyIGNvcnJlY3RseS5cbiAgICogQHBhcmFtIHBvc2l0aW9uU3RyYXRlZ3kgU3RyYXRlZ3kgd2hvc2UgcG9zaXRpb24gdG8gdXBkYXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0UG9zaXRpb24ocG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgbGV0IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgICAgdGhpcy5tZW51LnhQb3NpdGlvbiA9PT0gJ2JlZm9yZScgPyBbJ2VuZCcsICdzdGFydCddIDogWydzdGFydCcsICdlbmQnXTtcblxuICAgIGxldCBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldOiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICAgIHRoaXMubWVudS55UG9zaXRpb24gPT09ICdhYm92ZScgPyBbJ2JvdHRvbScsICd0b3AnXSA6IFsndG9wJywgJ2JvdHRvbSddO1xuXG4gICAgbGV0IFtvcmlnaW5ZLCBvcmlnaW5GYWxsYmFja1ldID0gW292ZXJsYXlZLCBvdmVybGF5RmFsbGJhY2tZXTtcbiAgICBsZXQgW292ZXJsYXlYLCBvdmVybGF5RmFsbGJhY2tYXSA9IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdO1xuICAgIGxldCBvZmZzZXRZID0gMDtcblxuICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAvLyBXaGVuIHRoZSBtZW51IGlzIGEgc3ViLW1lbnUsIGl0IHNob3VsZCBhbHdheXMgYWxpZ24gaXRzZWxmXG4gICAgICAvLyB0byB0aGUgZWRnZXMgb2YgdGhlIHRyaWdnZXIsIGluc3RlYWQgb2Ygb3ZlcmxhcHBpbmcgaXQuXG4gICAgICBvdmVybGF5RmFsbGJhY2tYID0gb3JpZ2luWCA9IHRoaXMubWVudS54UG9zaXRpb24gPT09ICdiZWZvcmUnID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgICAgb3JpZ2luRmFsbGJhY2tYID0gb3ZlcmxheVggPSBvcmlnaW5YID09PSAnZW5kJyA/ICdzdGFydCcgOiAnZW5kJztcbiAgICAgIG9mZnNldFkgPSBvdmVybGF5WSA9PT0gJ2JvdHRvbScgPyBNRU5VX1BBTkVMX1RPUF9QQURESU5HIDogLU1FTlVfUEFORUxfVE9QX1BBRERJTkc7XG4gICAgfSBlbHNlIGlmICghdGhpcy5tZW51Lm92ZXJsYXBUcmlnZ2VyKSB7XG4gICAgICBvcmlnaW5ZID0gb3ZlcmxheVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICAgIG9yaWdpbkZhbGxiYWNrWSA9IG92ZXJsYXlGYWxsYmFja1kgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhQb3NpdGlvbnMoW1xuICAgICAge29yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSwgb2Zmc2V0WX0sXG4gICAgICB7b3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLCBvcmlnaW5ZLCBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCwgb3ZlcmxheVksIG9mZnNldFl9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YLFxuICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgIG92ZXJsYXlYLFxuICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgb2Zmc2V0WTogLW9mZnNldFlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCxcbiAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgIG9mZnNldFk6IC1vZmZzZXRZXG4gICAgICB9XG4gICAgXSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIGFuIGFjdGlvbiB0aGF0IHNob3VsZCBjbG9zZSB0aGUgbWVudSBvY2N1cnMuICovXG4gIHByaXZhdGUgX21lbnVDbG9zaW5nQWN0aW9ucygpIHtcbiAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuX292ZXJsYXlSZWYhLmJhY2tkcm9wQ2xpY2soKTtcbiAgICBjb25zdCBkZXRhY2htZW50cyA9IHRoaXMuX292ZXJsYXlSZWYhLmRldGFjaG1lbnRzKCk7XG4gICAgY29uc3QgcGFyZW50Q2xvc2UgPSB0aGlzLl9wYXJlbnRNZW51ID8gdGhpcy5fcGFyZW50TWVudS5jbG9zZWQgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBob3ZlciA9IHRoaXMuX3BhcmVudE1lbnUgPyB0aGlzLl9wYXJlbnRNZW51Ll9ob3ZlcmVkKCkucGlwZShcbiAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlICE9PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlKSxcbiAgICAgIGZpbHRlcigoKSA9PiB0aGlzLl9tZW51T3BlbilcbiAgICApIDogb2JzZXJ2YWJsZU9mKCk7XG5cbiAgICByZXR1cm4gbWVyZ2UoYmFja2Ryb3AsIHBhcmVudENsb3NlLCBob3ZlciwgZGV0YWNobWVudHMpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW91c2UgcHJlc3NlcyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZU1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCkpIHtcbiAgICAgIC8vIFNpbmNlIHJpZ2h0IG9yIG1pZGRsZSBidXR0b24gY2xpY2tzIHdvbid0IHRyaWdnZXIgdGhlIGBjbGlja2AgZXZlbnQsXG4gICAgICAvLyB3ZSBzaG91bGRuJ3QgY29uc2lkZXIgdGhlIG1lbnUgYXMgb3BlbmVkIGJ5IG1vdXNlIGluIHRob3NlIGNhc2VzLlxuICAgICAgdGhpcy5fb3BlbmVkQnkgPSBldmVudC5idXR0b24gPT09IDAgPyAnbW91c2UnIDogbnVsbDtcblxuICAgICAgLy8gU2luY2UgY2xpY2tpbmcgb24gdGhlIHRyaWdnZXIgd29uJ3QgY2xvc2UgdGhlIG1lbnUgaWYgaXQgb3BlbnMgYSBzdWItbWVudSxcbiAgICAgIC8vIHdlIHNob3VsZCBwcmV2ZW50IGZvY3VzIGZyb20gbW92aW5nIG9udG8gaXQgdmlhIGNsaWNrIHRvIGF2b2lkIHRoZVxuICAgICAgLy8gaGlnaGxpZ2h0IGZyb20gbGluZ2VyaW5nIG9uIHRoZSBtZW51IGl0ZW0uXG4gICAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleSBwcmVzc2VzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkgJiYgKFxuICAgICAgICAgICAgKGtleUNvZGUgPT09IFJJR0hUX0FSUk9XICYmIHRoaXMuZGlyID09PSAnbHRyJykgfHxcbiAgICAgICAgICAgIChrZXlDb2RlID09PSBMRUZUX0FSUk9XICYmIHRoaXMuZGlyID09PSAncnRsJykpKSB7XG4gICAgICB0aGlzLm9wZW5NZW51KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgLy8gU3RvcCBldmVudCBwcm9wYWdhdGlvbiB0byBhdm9pZCBjbG9zaW5nIHRoZSBwYXJlbnQgbWVudS5cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5vcGVuTWVudSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyB0aGUgY2FzZXMgd2hlcmUgdGhlIHVzZXIgaG92ZXJzIG92ZXIgdGhlIHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2hhbmRsZUhvdmVyKCkge1xuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBob3ZlcmVkIGl0ZW0gaW4gb3JkZXIgdG8gdG9nZ2xlIHRoZSBwYW5lbC5cbiAgICBpZiAoIXRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlclN1YnNjcmlwdGlvbiA9IHRoaXMuX3BhcmVudE1lbnUuX2hvdmVyZWQoKVxuICAgICAgLy8gU2luY2Ugd2UgbWlnaHQgaGF2ZSBtdWx0aXBsZSBjb21wZXRpbmcgdHJpZ2dlcnMgZm9yIHRoZSBzYW1lIG1lbnUgKGUuZy4gYSBzdWItbWVudVxuICAgICAgLy8gd2l0aCBkaWZmZXJlbnQgZGF0YSBhbmQgdHJpZ2dlcnMpLCB3ZSBoYXZlIHRvIGRlbGF5IGl0IGJ5IGEgdGljayB0byBlbnN1cmUgdGhhdFxuICAgICAgLy8gaXQgd29uJ3QgYmUgY2xvc2VkIGltbWVkaWF0ZWx5IGFmdGVyIGl0IGlzIG9wZW5lZC5cbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoYWN0aXZlID0+IGFjdGl2ZSA9PT0gdGhpcy5fbWVudUl0ZW1JbnN0YW5jZSAmJiAhYWN0aXZlLmRpc2FibGVkKSxcbiAgICAgICAgZGVsYXkoMCwgYXNhcFNjaGVkdWxlcilcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9vcGVuZWRCeSA9ICdtb3VzZSc7XG5cbiAgICAgICAgLy8gSWYgdGhlIHNhbWUgbWVudSBpcyB1c2VkIGJldHdlZW4gbXVsdGlwbGUgdHJpZ2dlcnMsIGl0IG1pZ2h0IHN0aWxsIGJlIGFuaW1hdGluZ1xuICAgICAgICAvLyB3aGlsZSB0aGUgbmV3IHRyaWdnZXIgdHJpZXMgdG8gcmUtb3BlbiBpdC4gV2FpdCBmb3IgdGhlIGFuaW1hdGlvbiB0byBmaW5pc2hcbiAgICAgICAgLy8gYmVmb3JlIGRvaW5nIHNvLiBBbHNvIGludGVycnVwdCBpZiB0aGUgdXNlciBtb3ZlcyB0byBhbm90aGVyIGl0ZW0uXG4gICAgICAgIGlmICh0aGlzLm1lbnUgaW5zdGFuY2VvZiBNYXRNZW51ICYmIHRoaXMubWVudS5faXNBbmltYXRpbmcpIHtcbiAgICAgICAgICAvLyBXZSBuZWVkIHRoZSBgZGVsYXkoMClgIGhlcmUgaW4gb3JkZXIgdG8gYXZvaWRcbiAgICAgICAgICAvLyAnY2hhbmdlZCBhZnRlciBjaGVja2VkJyBlcnJvcnMgaW4gc29tZSBjYXNlcy4gU2VlICMxMjE5NC5cbiAgICAgICAgICB0aGlzLm1lbnUuX2FuaW1hdGlvbkRvbmVcbiAgICAgICAgICAgIC5waXBlKHRha2UoMSksIGRlbGF5KDAsIGFzYXBTY2hlZHVsZXIpLCB0YWtlVW50aWwodGhpcy5fcGFyZW50TWVudS5faG92ZXJlZCgpKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vcGVuTWVudSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wZW5NZW51KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvcnRhbCB0aGF0IHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfZ2V0UG9ydGFsKCk6IFRlbXBsYXRlUG9ydGFsIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgY2FuIGF2b2lkIHRoaXMgY2hlY2sgYnkga2VlcGluZyB0aGUgcG9ydGFsIG9uIHRoZSBtZW51IHBhbmVsLlxuICAgIC8vIFdoaWxlIGl0IHdvdWxkIGJlIGNsZWFuZXIsIHdlJ2QgaGF2ZSB0byBpbnRyb2R1Y2UgYW5vdGhlciByZXF1aXJlZCBtZXRob2Qgb25cbiAgICAvLyBgTWF0TWVudVBhbmVsYCwgbWFraW5nIGl0IGhhcmRlciB0byBjb25zdW1lLlxuICAgIGlmICghdGhpcy5fcG9ydGFsIHx8IHRoaXMuX3BvcnRhbC50ZW1wbGF0ZVJlZiAhPT0gdGhpcy5tZW51LnRlbXBsYXRlUmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5tZW51LnRlbXBsYXRlUmVmLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcG9ydGFsO1xuICB9XG5cbn1cbiJdfQ==