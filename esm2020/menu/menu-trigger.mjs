/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isFakeMousedownFromScreenReader, isFakeTouchstartFromScreenReader, } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, Self, ViewContainerRef, } from '@angular/core';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { _MatMenuBase } from './menu';
import { throwMatMenuRecursiveError } from './menu-errors';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./menu-item";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/cdk/a11y";
/** Injection token that determines the scroll handling while the menu is open. */
export const MAT_MENU_SCROLL_STRATEGY = new InjectionToken('mat-menu-scroll-strategy');
/** @docs-private */
export function MAT_MENU_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_MENU_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_MENU_SCROLL_STRATEGY_FACTORY,
};
/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * Default top padding of the menu panel.
 * @deprecated No longer being used. Will be removed.
 * @breaking-change 15.0.0
 */
export const MENU_PANEL_TOP_PADDING = 8;
export class _MatMenuTriggerBase {
    constructor(_overlay, _element, _viewContainerRef, scrollStrategy, parentMenu, 
    // `MatMenuTrigger` is commonly used in combination with a `MatMenuItem`.
    // tslint:disable-next-line: lightweight-tokens
    _menuItemInstance, _dir, _focusMonitor, _ngZone) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._menuItemInstance = _menuItemInstance;
        this._dir = _dir;
        this._focusMonitor = _focusMonitor;
        this._ngZone = _ngZone;
        this._overlayRef = null;
        this._menuOpen = false;
        this._closingActionsSubscription = Subscription.EMPTY;
        this._hoverSubscription = Subscription.EMPTY;
        this._menuCloseSubscription = Subscription.EMPTY;
        /**
         * Handles touch start events on the trigger.
         * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
         */
        this._handleTouchStart = (event) => {
            if (!isFakeTouchstartFromScreenReader(event)) {
                this._openedBy = 'touch';
            }
        };
        // Tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the menu is opened via the keyboard
        this._openedBy = undefined;
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
        this._scrollStrategy = scrollStrategy;
        this._parentMaterialMenu = parentMenu instanceof _MatMenuBase ? parentMenu : undefined;
        _element.nativeElement.addEventListener('touchstart', this._handleTouchStart, passiveEventListenerOptions);
        if (_menuItemInstance) {
            _menuItemInstance._triggersSubmenu = this.triggersSubmenu();
        }
    }
    /**
     * @deprecated
     * @breaking-change 8.0.0
     */
    get _deprecatedMatMenuTriggerFor() {
        return this.menu;
    }
    set _deprecatedMatMenuTriggerFor(v) {
        this.menu = v;
    }
    /** References the menu instance that the trigger is associated with. */
    get menu() {
        return this._menu;
    }
    set menu(menu) {
        if (menu === this._menu) {
            return;
        }
        this._menu = menu;
        this._menuCloseSubscription.unsubscribe();
        if (menu) {
            if (menu === this._parentMaterialMenu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throwMatMenuRecursiveError();
            }
            this._menuCloseSubscription = menu.close.subscribe((reason) => {
                this._destroyMenu(reason);
                // If a click closed the menu, we should close the entire chain of nested menus.
                if ((reason === 'click' || reason === 'tab') && this._parentMaterialMenu) {
                    this._parentMaterialMenu.closed.emit(reason);
                }
            });
        }
    }
    ngAfterContentInit() {
        this._handleHover();
    }
    ngOnDestroy() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._element.nativeElement.removeEventListener('touchstart', this._handleTouchStart, passiveEventListenerOptions);
        this._menuCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
        this._hoverSubscription.unsubscribe();
    }
    /** Whether the menu is open. */
    get menuOpen() {
        return this._menuOpen;
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Whether the menu triggers a sub-menu or a top-level one. */
    triggersSubmenu() {
        return !!(this._menuItemInstance && this._parentMaterialMenu);
    }
    /** Toggles the menu between the open and closed states. */
    toggleMenu() {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    }
    /** Opens the menu. */
    openMenu() {
        const menu = this.menu;
        if (this._menuOpen || !menu) {
            return;
        }
        const overlayRef = this._createOverlay(menu);
        const overlayConfig = overlayRef.getConfig();
        const positionStrategy = overlayConfig.positionStrategy;
        this._setPosition(menu, positionStrategy);
        overlayConfig.hasBackdrop =
            menu.hasBackdrop == null ? !this.triggersSubmenu() : menu.hasBackdrop;
        overlayRef.attach(this._getPortal(menu));
        if (menu.lazyContent) {
            menu.lazyContent.attach(this.menuData);
        }
        this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
        this._initMenu(menu);
        if (menu instanceof _MatMenuBase) {
            menu._startAnimation();
            menu._directDescendantItems.changes.pipe(takeUntil(menu.close)).subscribe(() => {
                // Re-adjust the position without locking when the amount of items
                // changes so that the overlay is allowed to pick a new optimal position.
                positionStrategy.withLockedPosition(false).reapplyLastPosition();
                positionStrategy.withLockedPosition(true);
            });
        }
    }
    /** Closes the menu. */
    closeMenu() {
        this.menu?.close.emit();
    }
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        else {
            this._element.nativeElement.focus(options);
        }
    }
    /**
     * Updates the position of the menu to ensure that it fits all options within the viewport.
     */
    updatePosition() {
        this._overlayRef?.updatePosition();
    }
    /** Closes the menu and does the necessary cleanup. */
    _destroyMenu(reason) {
        if (!this._overlayRef || !this.menuOpen) {
            return;
        }
        const menu = this.menu;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();
        // Always restore focus if the user is navigating using the keyboard or the menu was opened
        // programmatically. We don't restore for non-root triggers, because it can prevent focus
        // from making it back to the root trigger when closing a long chain of menus by clicking
        // on the backdrop.
        if (this.restoreFocus && (reason === 'keydown' || !this._openedBy || !this.triggersSubmenu())) {
            this.focus(this._openedBy);
        }
        this._openedBy = undefined;
        if (menu instanceof _MatMenuBase) {
            menu._resetAnimation();
            if (menu.lazyContent) {
                // Wait for the exit animation to finish before detaching the content.
                menu._animationDone
                    .pipe(filter(event => event.toState === 'void'), take(1), 
                // Interrupt if the content got re-attached.
                takeUntil(menu.lazyContent._attached))
                    .subscribe({
                    next: () => menu.lazyContent.detach(),
                    // No matter whether the content got re-attached, reset the menu.
                    complete: () => this._setIsMenuOpen(false),
                });
            }
            else {
                this._setIsMenuOpen(false);
            }
        }
        else {
            this._setIsMenuOpen(false);
            menu?.lazyContent?.detach();
        }
    }
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    _initMenu(menu) {
        menu.parentMenu = this.triggersSubmenu() ? this._parentMaterialMenu : undefined;
        menu.direction = this.dir;
        this._setMenuElevation(menu);
        menu.focusFirstItem(this._openedBy || 'program');
        this._setIsMenuOpen(true);
    }
    /** Updates the menu elevation based on the amount of parent menus that it has. */
    _setMenuElevation(menu) {
        if (menu.setElevation) {
            let depth = 0;
            let parentMenu = menu.parentMenu;
            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }
            menu.setElevation(depth);
        }
    }
    // set state rather than toggle to support triggers sharing a menu
    _setIsMenuOpen(isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
        if (this.triggersSubmenu()) {
            this._menuItemInstance._setHighlighted(isOpen);
        }
    }
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    _createOverlay(menu) {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig(menu);
            this._subscribeToPositions(menu, config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
            // Consume the `keydownEvents` in order to prevent them from going to another overlay.
            // Ideally we'd also have our keyboard event logic in here, however doing so will
            // break anybody that may have implemented the `MatMenuPanel` themselves.
            this._overlayRef.keydownEvents().subscribe();
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    _getOverlayConfig(menu) {
        return new OverlayConfig({
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._element)
                .withLockedPosition()
                .withGrowAfterOpen()
                .withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
            backdropClass: menu.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: menu.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir,
        });
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(menu, position) {
        if (menu.setPositionClasses) {
            position.positionChanges.subscribe(change => {
                const posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
                const posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
                // @breaking-change 15.0.0 Remove null check for `ngZone`.
                // `positionChanges` fires outside of the `ngZone` and `setPositionClasses` might be
                // updating something in the view so we need to bring it back in.
                if (this._ngZone) {
                    this._ngZone.run(() => menu.setPositionClasses(posX, posY));
                }
                else {
                    menu.setPositionClasses(posX, posY);
                }
            });
        }
    }
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    _setPosition(menu, positionStrategy) {
        let [originX, originFallbackX] = menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];
        let [overlayY, overlayFallbackY] = menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;
        if (this.triggersSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            if (this._parentMaterialMenu) {
                if (this._parentInnerPadding == null) {
                    const firstItem = this._parentMaterialMenu.items.first;
                    this._parentInnerPadding = firstItem ? firstItem._getHostElement().offsetTop : 0;
                }
                offsetY = overlayY === 'bottom' ? this._parentInnerPadding : -this._parentInnerPadding;
            }
        }
        else if (!menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }
        positionStrategy.withPositions([
            { originX, originY, overlayX, overlayY, offsetY },
            { originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
            {
                originX,
                originY: originFallbackY,
                overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
        ]);
    }
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    _menuClosingActions() {
        const backdrop = this._overlayRef.backdropClick();
        const detachments = this._overlayRef.detachments();
        const parentClose = this._parentMaterialMenu ? this._parentMaterialMenu.closed : observableOf();
        const hover = this._parentMaterialMenu
            ? this._parentMaterialMenu._hovered().pipe(filter(active => active !== this._menuItemInstance), filter(() => this._menuOpen))
            : observableOf();
        return merge(backdrop, parentClose, hover, detachments);
    }
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the menu as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : undefined;
            // Since clicking on the trigger won't close the menu if it opens a sub-menu,
            // we should prevent focus from moving onto it via click to avoid the
            // highlight from lingering on the menu item.
            if (this.triggersSubmenu()) {
                event.preventDefault();
            }
        }
    }
    /** Handles key presses on the trigger. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }
        if (this.triggersSubmenu() &&
            ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
                (keyCode === LEFT_ARROW && this.dir === 'rtl'))) {
            this._openedBy = 'keyboard';
            this.openMenu();
        }
    }
    /** Handles click events on the trigger. */
    _handleClick(event) {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        }
        else {
            this.toggleMenu();
        }
    }
    /** Handles the cases where the user hovers over the trigger. */
    _handleHover() {
        // Subscribe to changes in the hovered item in order to toggle the panel.
        if (!this.triggersSubmenu() || !this._parentMaterialMenu) {
            return;
        }
        this._hoverSubscription = this._parentMaterialMenu
            ._hovered()
            // Since we might have multiple competing triggers for the same menu (e.g. a sub-menu
            // with different data and triggers), we have to delay it by a tick to ensure that
            // it won't be closed immediately after it is opened.
            .pipe(filter(active => active === this._menuItemInstance && !active.disabled), delay(0, asapScheduler))
            .subscribe(() => {
            this._openedBy = 'mouse';
            // If the same menu is used between multiple triggers, it might still be animating
            // while the new trigger tries to re-open it. Wait for the animation to finish
            // before doing so. Also interrupt if the user moves to another item.
            if (this.menu instanceof _MatMenuBase && this.menu._isAnimating) {
                // We need the `delay(0)` here in order to avoid
                // 'changed after checked' errors in some cases. See #12194.
                this.menu._animationDone
                    .pipe(take(1), delay(0, asapScheduler), takeUntil(this._parentMaterialMenu._hovered()))
                    .subscribe(() => this.openMenu());
            }
            else {
                this.openMenu();
            }
        });
    }
    /** Gets the portal that should be attached to the overlay. */
    _getPortal(menu) {
        // Note that we can avoid this check by keeping the portal on the menu panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MatMenuPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== menu.templateRef) {
            this._portal = new TemplatePortal(menu.templateRef, this._viewContainerRef);
        }
        return this._portal;
    }
}
_MatMenuTriggerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: _MatMenuTriggerBase, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: MAT_MENU_SCROLL_STRATEGY }, { token: MAT_MENU_PANEL, optional: true }, { token: i2.MatMenuItem, optional: true, self: true }, { token: i3.Directionality, optional: true }, { token: i4.FocusMonitor }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
_MatMenuTriggerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: _MatMenuTriggerBase, inputs: { _deprecatedMatMenuTriggerFor: ["mat-menu-trigger-for", "_deprecatedMatMenuTriggerFor"], menu: ["matMenuTriggerFor", "menu"], menuData: ["matMenuTriggerData", "menuData"], restoreFocus: ["matMenuTriggerRestoreFocus", "restoreFocus"] }, outputs: { menuOpened: "menuOpened", onMenuOpen: "onMenuOpen", menuClosed: "menuClosed", onMenuClose: "onMenuClose" }, host: { listeners: { "click": "_handleClick($event)", "mousedown": "_handleMousedown($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-haspopup": "menu ? \"menu\" : null", "attr.aria-expanded": "menuOpen || null", "attr.aria-controls": "menuOpen ? menu.panelId : null" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: _MatMenuTriggerBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[attr.aria-haspopup]': 'menu ? "menu" : null',
                        '[attr.aria-expanded]': 'menuOpen || null',
                        '[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
                        '(click)': '_handleClick($event)',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_MENU_SCROLL_STRATEGY]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_MENU_PANEL]
                }, {
                    type: Optional
                }] }, { type: i2.MatMenuItem, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i3.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i4.FocusMonitor }, { type: i0.NgZone }]; }, propDecorators: { _deprecatedMatMenuTriggerFor: [{
                type: Input,
                args: ['mat-menu-trigger-for']
            }], menu: [{
                type: Input,
                args: ['matMenuTriggerFor']
            }], menuData: [{
                type: Input,
                args: ['matMenuTriggerData']
            }], restoreFocus: [{
                type: Input,
                args: ['matMenuTriggerRestoreFocus']
            }], menuOpened: [{
                type: Output
            }], onMenuOpen: [{
                type: Output
            }], menuClosed: [{
                type: Output
            }], onMenuClose: [{
                type: Output
            }] } });
/** Directive applied to an element that should trigger a `mat-menu`. */
export class MatMenuTrigger extends _MatMenuTriggerBase {
}
MatMenuTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatMenuTrigger, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatMenuTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", host: { classAttribute: "mat-mdc-menu-trigger" }, exportAs: ["matMenuTrigger"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatMenuTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-menu-trigger-for], [matMenuTriggerFor]`,
                    host: {
                        'class': 'mat-mdc-menu-trigger',
                    },
                    exportAs: 'matMenuTrigger',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHTCwrQkFBK0IsRUFDL0IsZ0NBQWdDLEdBQ2pDLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFZLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RSxPQUFPLEVBR0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sSUFBSSxFQUNKLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBYyxFQUFFLElBQUksWUFBWSxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN4RixPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUQsT0FBTyxFQUFDLFlBQVksRUFBa0IsTUFBTSxRQUFRLENBQUM7QUFDckQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLGNBQWMsQ0FBQzs7Ozs7O0FBRzFELGtGQUFrRjtBQUNsRixNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FDeEQsMEJBQTBCLENBQzNCLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLGdDQUFnQyxDQUFDLE9BQWdCO0lBQy9ELE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3JELENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0seUNBQXlDLEdBQUc7SUFDdkQsT0FBTyxFQUFFLHdCQUF3QjtJQUNqQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDZixVQUFVLEVBQUUsZ0NBQWdDO0NBQzdDLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsTUFBTSwyQkFBMkIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRXJGOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFZeEMsTUFBTSxPQUFnQixtQkFBbUI7SUF1SnZDLFlBQ1UsUUFBaUIsRUFDakIsUUFBaUMsRUFDakMsaUJBQW1DLEVBQ1QsY0FBbUIsRUFDakIsVUFBd0I7SUFDNUQseUVBQXlFO0lBQ3pFLCtDQUErQztJQUNuQixpQkFBOEIsRUFDdEMsSUFBb0IsRUFDaEMsYUFBa0MsRUFDbEMsT0FBZ0I7UUFWaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUNqQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBS2Ysc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFhO1FBQ3RDLFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ2hDLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBaEtsQixnQkFBVyxHQUFzQixJQUFJLENBQUM7UUFDdEMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixnQ0FBMkIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQ2pELHVCQUFrQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDeEMsMkJBQXNCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQWVwRDs7O1dBR0c7UUFDSyxzQkFBaUIsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUNoRCxJQUFJLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsdUVBQXVFO1FBQ3ZFLHNFQUFzRTtRQUN0RSxjQUFTLEdBQXVELFNBQVMsQ0FBQztRQStDMUU7Ozs7V0FJRztRQUNrQyxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUVsRSx3REFBd0Q7UUFDckMsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTdFOzs7O1dBSUc7UUFDSCwrQ0FBK0M7UUFDNUIsZUFBVSxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDO1FBRXBFLHdEQUF3RDtRQUNyQyxlQUFVLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFFN0U7Ozs7V0FJRztRQUNILCtDQUErQztRQUM1QixnQkFBVyxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDO1FBeURuRSxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxZQUFZLFlBQVksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFdkYsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FDckMsWUFBWSxFQUNaLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsMkJBQTJCLENBQzVCLENBQUM7UUFFRixJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLGlCQUFpQixDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUM3RDtJQUNILENBQUM7SUE3SUQ7OztPQUdHO0lBQ0gsSUFDSSw0QkFBNEI7UUFDOUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLDRCQUE0QixDQUFDLENBQXNCO1FBQ3JELElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFRCx3RUFBd0U7SUFDeEUsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxJQUF5QjtRQUNoQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUxQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtnQkFDeEYsMEJBQTBCLEVBQUUsQ0FBQzthQUM5QjtZQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtnQkFDN0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFMUIsZ0ZBQWdGO2dCQUNoRixJQUFJLENBQUMsTUFBTSxLQUFLLE9BQU8sSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO29CQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDOUM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQXdHRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDekI7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FDN0MsWUFBWSxFQUNaLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsMkJBQTJCLENBQzVCLENBQUM7UUFFRixJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0RBQWdEO0lBQ2hELElBQUksR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwrREFBK0Q7SUFDL0QsZUFBZTtRQUNiLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixRQUFRO1FBQ04sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0MsTUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsZ0JBQXFELENBQUM7UUFFN0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUMxQyxhQUFhLENBQUMsV0FBVztZQUN2QixJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDeEUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFekMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQixJQUFJLElBQUksWUFBWSxZQUFZLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUM3RSxrRUFBa0U7Z0JBQ2xFLHlFQUF5RTtnQkFDekUsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDakUsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsU0FBUztRQUNQLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsTUFBb0IsRUFBRSxPQUFzQjtRQUNoRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksTUFBTSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdEO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsc0RBQXNEO0lBQzlDLFlBQVksQ0FBQyxNQUF1QjtRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdkMsT0FBTztTQUNSO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUUxQiwyRkFBMkY7UUFDM0YseUZBQXlGO1FBQ3pGLHlGQUF5RjtRQUN6RixtQkFBbUI7UUFDbkIsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRTtZQUM3RixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTNCLElBQUksSUFBSSxZQUFZLFlBQVksRUFBRTtZQUNoQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFdkIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixzRUFBc0U7Z0JBQ3RFLElBQUksQ0FBQyxjQUFjO3FCQUNoQixJQUFJLENBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsRUFDekMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCw0Q0FBNEM7Z0JBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUN0QztxQkFDQSxTQUFTLENBQUM7b0JBQ1QsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFZLENBQUMsTUFBTSxFQUFFO29CQUN0QyxpRUFBaUU7b0JBQ2pFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztpQkFDM0MsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1QjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssU0FBUyxDQUFDLElBQWtCO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxrRkFBa0Y7SUFDMUUsaUJBQWlCLENBQUMsSUFBa0I7UUFDMUMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFFakMsT0FBTyxVQUFVLEVBQUU7Z0JBQ2pCLEtBQUssRUFBRSxDQUFDO2dCQUNSLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO2FBQ3BDO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxrRUFBa0U7SUFDMUQsY0FBYyxDQUFDLE1BQWU7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVqRSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGNBQWMsQ0FBQyxJQUFrQjtRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLHFCQUFxQixDQUN4QixJQUFJLEVBQ0osTUFBTSxDQUFDLGdCQUFxRCxDQUM3RCxDQUFDO1lBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoRCxzRkFBc0Y7WUFDdEYsaUZBQWlGO1lBQ2pGLHlFQUF5RTtZQUN6RSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzlDO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSyxpQkFBaUIsQ0FBQyxJQUFrQjtRQUMxQyxPQUFPLElBQUksYUFBYSxDQUFDO1lBQ3ZCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUM1QixRQUFRLEVBQUU7aUJBQ1YsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDbEMsa0JBQWtCLEVBQUU7aUJBQ3BCLGlCQUFpQixFQUFFO2lCQUNuQixxQkFBcUIsQ0FBQyxzQ0FBc0MsQ0FBQztZQUNoRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsSUFBSSxrQ0FBa0M7WUFDdkUsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDbEMsY0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDdEMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0sscUJBQXFCLENBQUMsSUFBa0IsRUFBRSxRQUEyQztRQUMzRixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEdBQWtCLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQzVGLE1BQU0sSUFBSSxHQUFrQixNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUV6RiwwREFBMEQ7Z0JBQzFELG9GQUFvRjtnQkFDcEYsaUVBQWlFO2dCQUNqRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDOUQ7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLGtCQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDdEM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxZQUFZLENBQUMsSUFBa0IsRUFBRSxnQkFBbUQ7UUFDMUYsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsR0FDNUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQzlCLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFFaEIsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDMUIsNkRBQTZEO1lBQzdELDBEQUEwRDtZQUMxRCxnQkFBZ0IsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzNFLGVBQWUsR0FBRyxRQUFRLEdBQUcsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFakUsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzVCLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksRUFBRTtvQkFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEY7Z0JBRUQsT0FBTyxHQUFHLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7YUFDeEY7U0FDRjthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQy9CLE9BQU8sR0FBRyxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNoRCxlQUFlLEdBQUcsZ0JBQWdCLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNqRTtRQUVELGdCQUFnQixDQUFDLGFBQWEsQ0FBQztZQUM3QixFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7WUFDL0MsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztZQUNsRjtnQkFDRSxPQUFPO2dCQUNQLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixRQUFRO2dCQUNSLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLE9BQU87YUFDbEI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLE9BQU87YUFDbEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0ZBQXdGO0lBQ2hGLG1CQUFtQjtRQUN6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBWSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25ELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoRyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CO1lBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQ25ELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQzdCO1lBQ0gsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRW5CLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUEwQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQsNENBQTRDO0lBQzVDLGdCQUFnQixDQUFDLEtBQWlCO1FBQ2hDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQyx1RUFBdUU7WUFDdkUsb0VBQW9FO1lBQ3BFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBRTFELDZFQUE2RTtZQUM3RSxxRUFBcUU7WUFDckUsNkNBQTZDO1lBQzdDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUMxQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDeEI7U0FDRjtJQUNILENBQUM7SUFFRCwwQ0FBMEM7SUFDMUMsY0FBYyxDQUFDLEtBQW9CO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFOUIsc0VBQXNFO1FBQ3RFLElBQUksT0FBTyxLQUFLLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO1lBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1NBQzdCO1FBRUQsSUFDRSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RCLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDO2dCQUM5QyxDQUFDLE9BQU8sS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUNqRDtZQUNBLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQzVCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsWUFBWSxDQUFDLEtBQWlCO1FBQzVCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQzFCLDJEQUEyRDtZQUMzRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQsZ0VBQWdFO0lBQ3hELFlBQVk7UUFDbEIseUVBQXlFO1FBQ3pFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDeEQsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUI7YUFDL0MsUUFBUSxFQUFFO1lBQ1gscUZBQXFGO1lBQ3JGLGtGQUFrRjtZQUNsRixxREFBcUQ7YUFDcEQsSUFBSSxDQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsaUJBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQ3ZFLEtBQUssQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQ3hCO2FBQ0EsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1lBRXpCLGtGQUFrRjtZQUNsRiw4RUFBOEU7WUFDOUUscUVBQXFFO1lBQ3JFLElBQUksSUFBSSxDQUFDLElBQUksWUFBWSxZQUFZLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQy9ELGdEQUFnRDtnQkFDaEQsNERBQTREO2dCQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7cUJBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7cUJBQ3ZGLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCw4REFBOEQ7SUFDdEQsVUFBVSxDQUFDLElBQWtCO1FBQ25DLDZFQUE2RTtRQUM3RSwrRUFBK0U7UUFDL0UsK0NBQStDO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQzdFO1FBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7O3FIQXprQm1CLG1CQUFtQixtR0EySjdCLHdCQUF3QixhQUN4QixjQUFjO3lHQTVKSixtQkFBbUI7Z0dBQW5CLG1CQUFtQjtrQkFWeEMsU0FBUzttQkFBQztvQkFDVCxJQUFJLEVBQUU7d0JBQ0osc0JBQXNCLEVBQUUsc0JBQXNCO3dCQUM5QyxzQkFBc0IsRUFBRSxrQkFBa0I7d0JBQzFDLHNCQUFzQixFQUFFLGdDQUFnQzt3QkFDeEQsU0FBUyxFQUFFLHNCQUFzQjt3QkFDakMsYUFBYSxFQUFFLDBCQUEwQjt3QkFDekMsV0FBVyxFQUFFLHdCQUF3QjtxQkFDdEM7aUJBQ0Y7OzBCQTRKSSxNQUFNOzJCQUFDLHdCQUF3Qjs7MEJBQy9CLE1BQU07MkJBQUMsY0FBYzs7MEJBQUcsUUFBUTs7MEJBR2hDLFFBQVE7OzBCQUFJLElBQUk7OzBCQUNoQixRQUFROzRGQXhIUCw0QkFBNEI7c0JBRC9CLEtBQUs7dUJBQUMsc0JBQXNCO2dCQVV6QixJQUFJO3NCQURQLEtBQUs7dUJBQUMsbUJBQW1CO2dCQThCRyxRQUFRO3NCQUFwQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFPVSxZQUFZO3NCQUFoRCxLQUFLO3VCQUFDLDRCQUE0QjtnQkFHaEIsVUFBVTtzQkFBNUIsTUFBTTtnQkFRWSxVQUFVO3NCQUE1QixNQUFNO2dCQUdZLFVBQVU7c0JBQTVCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTTs7QUFpZVQsd0VBQXdFO0FBUXhFLE1BQU0sT0FBTyxjQUFlLFNBQVEsbUJBQW1COztnSEFBMUMsY0FBYztvR0FBZCxjQUFjO2dHQUFkLGNBQWM7a0JBUDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZDQUE2QztvQkFDdkQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7cUJBQ2hDO29CQUNELFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEZvY3VzTW9uaXRvcixcbiAgRm9jdXNPcmlnaW4sXG4gIGlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIsXG4gIGlzRmFrZVRvdWNoc3RhcnRGcm9tU2NyZWVuUmVhZGVyLFxufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7RU5URVIsIExFRlRfQVJST1csIFJJR0hUX0FSUk9XLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2VsZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge25vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2FzYXBTY2hlZHVsZXIsIG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtfTWF0TWVudUJhc2UsIE1lbnVDbG9zZVJlYXNvbn0gZnJvbSAnLi9tZW51JztcbmltcG9ydCB7dGhyb3dNYXRNZW51UmVjdXJzaXZlRXJyb3J9IGZyb20gJy4vbWVudS1lcnJvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNQVRfTUVOVV9QQU5FTCwgTWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgbWVudSBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtbWVudS1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX01FTlVfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIE9wdGlvbnMgZm9yIGJpbmRpbmcgYSBwYXNzaXZlIGV2ZW50IGxpc3RlbmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vKipcbiAqIERlZmF1bHQgdG9wIHBhZGRpbmcgb2YgdGhlIG1lbnUgcGFuZWwuXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gV2lsbCBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1FTlVfUEFORUxfVE9QX1BBRERJTkcgPSA4O1xuXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdtZW51ID8gXCJtZW51XCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnbWVudU9wZW4gfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ21lbnVPcGVuID8gbWVudS5wYW5lbElkIDogbnVsbCcsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICAgICcobW91c2Vkb3duKSc6ICdfaGFuZGxlTW91c2Vkb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRNZW51VHJpZ2dlckJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsO1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX21lbnVPcGVuOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9ob3ZlclN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfbWVudUNsb3NlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqXG4gICAqIFdlJ3JlIHNwZWNpZmljYWxseSBsb29raW5nIGZvciBhIGBNYXRNZW51YCBoZXJlIHNpbmNlIHRoZSBnZW5lcmljIGBNYXRNZW51UGFuZWxgXG4gICAqIGludGVyZmFjZSBsYWNrcyBzb21lIGZ1bmN0aW9uYWxpdHkgYXJvdW5kIG5lc3RlZCBtZW51cyBhbmQgYW5pbWF0aW9ucy5cbiAgICovXG4gIHByaXZhdGUgX3BhcmVudE1hdGVyaWFsTWVudTogX01hdE1lbnVCYXNlIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgdmFsdWUgb2YgdGhlIHBhZGRpbmcgb2YgdGhlIHBhcmVudCBtZW51IHBhbmVsLlxuICAgKiBVc2VkIHRvIG9mZnNldCBzdWItbWVudXMgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIHBhZGRpbmcuXG4gICAqL1xuICBwcml2YXRlIF9wYXJlbnRJbm5lclBhZGRpbmc6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSGFuZGxlcyB0b3VjaCBzdGFydCBldmVudHMgb24gdGhlIHRyaWdnZXIuXG4gICAqIE5lZWRzIHRvIGJlIGFuIGFycm93IGZ1bmN0aW9uIHNvIHdlIGNhbiBlYXNpbHkgdXNlIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHJlbW92ZUV2ZW50TGlzdGVuZXIuXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVUb3VjaFN0YXJ0ID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKCFpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcihldmVudCkpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ3RvdWNoJztcbiAgICB9XG4gIH07XG5cbiAgLy8gVHJhY2tpbmcgaW5wdXQgdHlwZSBpcyBuZWNlc3Nhcnkgc28gaXQncyBwb3NzaWJsZSB0byBvbmx5IGF1dG8tZm9jdXNcbiAgLy8gdGhlIGZpcnN0IGl0ZW0gb2YgdGhlIGxpc3Qgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZFxuICBfb3BlbmVkQnk6IEV4Y2x1ZGU8Rm9jdXNPcmlnaW4sICdwcm9ncmFtJyB8IG51bGw+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoJ21hdC1tZW51LXRyaWdnZXItZm9yJylcbiAgZ2V0IF9kZXByZWNhdGVkTWF0TWVudVRyaWdnZXJGb3IoKTogTWF0TWVudVBhbmVsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWVudTtcbiAgfVxuICBzZXQgX2RlcHJlY2F0ZWRNYXRNZW51VHJpZ2dlckZvcih2OiBNYXRNZW51UGFuZWwgfCBudWxsKSB7XG4gICAgdGhpcy5tZW51ID0gdjtcbiAgfVxuXG4gIC8qKiBSZWZlcmVuY2VzIHRoZSBtZW51IGluc3RhbmNlIHRoYXQgdGhlIHRyaWdnZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoJ21hdE1lbnVUcmlnZ2VyRm9yJylcbiAgZ2V0IG1lbnUoKTogTWF0TWVudVBhbmVsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21lbnU7XG4gIH1cbiAgc2V0IG1lbnUobWVudTogTWF0TWVudVBhbmVsIHwgbnVsbCkge1xuICAgIGlmIChtZW51ID09PSB0aGlzLl9tZW51KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbWVudSA9IG1lbnU7XG4gICAgdGhpcy5fbWVudUNsb3NlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICBpZiAobWVudSkge1xuICAgICAgaWYgKG1lbnUgPT09IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvd01hdE1lbnVSZWN1cnNpdmVFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tZW51Q2xvc2VTdWJzY3JpcHRpb24gPSBtZW51LmNsb3NlLnN1YnNjcmliZSgocmVhc29uOiBNZW51Q2xvc2VSZWFzb24pID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveU1lbnUocmVhc29uKTtcblxuICAgICAgICAvLyBJZiBhIGNsaWNrIGNsb3NlZCB0aGUgbWVudSwgd2Ugc2hvdWxkIGNsb3NlIHRoZSBlbnRpcmUgY2hhaW4gb2YgbmVzdGVkIG1lbnVzLlxuICAgICAgICBpZiAoKHJlYXNvbiA9PT0gJ2NsaWNrJyB8fCByZWFzb24gPT09ICd0YWInKSAmJiB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUpIHtcbiAgICAgICAgICB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUuY2xvc2VkLmVtaXQocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX21lbnU6IE1hdE1lbnVQYW5lbCB8IG51bGw7XG5cbiAgLyoqIERhdGEgdG8gYmUgcGFzc2VkIGFsb25nIHRvIGFueSBsYXppbHktcmVuZGVyZWQgY29udGVudC4gKi9cbiAgQElucHV0KCdtYXRNZW51VHJpZ2dlckRhdGEnKSBtZW51RGF0YTogYW55O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGZvY3VzIHNob3VsZCBiZSByZXN0b3JlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC5cbiAgICogTm90ZSB0aGF0IGRpc2FibGluZyB0aGlzIG9wdGlvbiBjYW4gaGF2ZSBhY2Nlc3NpYmlsaXR5IGltcGxpY2F0aW9uc1xuICAgKiBhbmQgaXQncyB1cCB0byB5b3UgdG8gbWFuYWdlIGZvY3VzLCBpZiB5b3UgZGVjaWRlIHRvIHR1cm4gaXQgb2ZmLlxuICAgKi9cbiAgQElucHV0KCdtYXRNZW51VHJpZ2dlclJlc3RvcmVGb2N1cycpIHJlc3RvcmVGb2N1czogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1lbnVPcGVuZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgb3BlbmVkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYG1lbnVPcGVuZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9uTWVudU9wZW46IEV2ZW50RW1pdHRlcjx2b2lkPiA9IHRoaXMubWVudU9wZW5lZDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWVudUNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBjbG9zZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgbWVudUNsb3NlZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgcmVhZG9ubHkgb25NZW51Q2xvc2U6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IHRoaXMubWVudUNsb3NlZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwsXG4gICAgbWVudUl0ZW1JbnN0YW5jZTogTWF0TWVudUl0ZW0sXG4gICAgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgKTtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgYGZvY3VzTW9uaXRvcmAgd2lsbCBiZWNvbWUgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIHBhcmVudE1lbnU6IE1hdE1lbnVQYW5lbCxcbiAgICBtZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIGZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvciB8IG51bGwsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBuZ1pvbmVgIHdpbGwgYmVjb21lIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsLFxuICAgIG1lbnVJdGVtSW5zdGFuY2U6IE1hdE1lbnVJdGVtLFxuICAgIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTUFUX01FTlVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBJbmplY3QoTUFUX01FTlVfUEFORUwpIEBPcHRpb25hbCgpIHBhcmVudE1lbnU6IE1hdE1lbnVQYW5lbCxcbiAgICAvLyBgTWF0TWVudVRyaWdnZXJgIGlzIGNvbW1vbmx5IHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBhIGBNYXRNZW51SXRlbWAuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHByaXZhdGUgX21lbnVJdGVtSW5zdGFuY2U6IE1hdE1lbnVJdGVtLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IgfCBudWxsLFxuICAgIHByaXZhdGUgX25nWm9uZT86IE5nWm9uZSxcbiAgKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgICB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUgPSBwYXJlbnRNZW51IGluc3RhbmNlb2YgX01hdE1lbnVCYXNlID8gcGFyZW50TWVudSA6IHVuZGVmaW5lZDtcblxuICAgIF9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgIHRoaXMuX2hhbmRsZVRvdWNoU3RhcnQsXG4gICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4gICAgKTtcblxuICAgIGlmIChfbWVudUl0ZW1JbnN0YW5jZSkge1xuICAgICAgX21lbnVJdGVtSW5zdGFuY2UuX3RyaWdnZXJzU3VibWVudSA9IHRoaXMudHJpZ2dlcnNTdWJtZW51KCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2hhbmRsZUhvdmVyKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgIHRoaXMuX2hhbmRsZVRvdWNoU3RhcnQsXG4gICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4gICAgKTtcblxuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5faG92ZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIG9wZW4uICovXG4gIGdldCBtZW51T3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWVudU9wZW47XG4gIH1cblxuICAvKiogVGhlIHRleHQgZGlyZWN0aW9uIG9mIHRoZSBjb250YWluaW5nIGFwcC4gKi9cbiAgZ2V0IGRpcigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSB0cmlnZ2VycyBhIHN1Yi1tZW51IG9yIGEgdG9wLWxldmVsIG9uZS4gKi9cbiAgdHJpZ2dlcnNTdWJtZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmIHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgbWVudSBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbiA/IHRoaXMuY2xvc2VNZW51KCkgOiB0aGlzLm9wZW5NZW51KCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIG9wZW5NZW51KCk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSB0aGlzLm1lbnU7XG5cbiAgICBpZiAodGhpcy5fbWVudU9wZW4gfHwgIW1lbnUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShtZW51KTtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKTtcbiAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gb3ZlcmxheUNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcblxuICAgIHRoaXMuX3NldFBvc2l0aW9uKG1lbnUsIHBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPVxuICAgICAgbWVudS5oYXNCYWNrZHJvcCA9PSBudWxsID8gIXRoaXMudHJpZ2dlcnNTdWJtZW51KCkgOiBtZW51Lmhhc0JhY2tkcm9wO1xuICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX2dldFBvcnRhbChtZW51KSk7XG5cbiAgICBpZiAobWVudS5sYXp5Q29udGVudCkge1xuICAgICAgbWVudS5sYXp5Q29udGVudC5hdHRhY2godGhpcy5tZW51RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSB0aGlzLl9tZW51Q2xvc2luZ0FjdGlvbnMoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZU1lbnUoKSk7XG4gICAgdGhpcy5faW5pdE1lbnUobWVudSk7XG5cbiAgICBpZiAobWVudSBpbnN0YW5jZW9mIF9NYXRNZW51QmFzZSkge1xuICAgICAgbWVudS5fc3RhcnRBbmltYXRpb24oKTtcbiAgICAgIG1lbnUuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKG1lbnUuY2xvc2UpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBSZS1hZGp1c3QgdGhlIHBvc2l0aW9uIHdpdGhvdXQgbG9ja2luZyB3aGVuIHRoZSBhbW91bnQgb2YgaXRlbXNcbiAgICAgICAgLy8gY2hhbmdlcyBzbyB0aGF0IHRoZSBvdmVybGF5IGlzIGFsbG93ZWQgdG8gcGljayBhIG5ldyBvcHRpbWFsIHBvc2l0aW9uLlxuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhMb2NrZWRQb3NpdGlvbihmYWxzZSkucmVhcHBseUxhc3RQb3NpdGlvbigpO1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhMb2NrZWRQb3NpdGlvbih0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUuICovXG4gIGNsb3NlTWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLm1lbnU/LmNsb3NlLmVtaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBtZW51IHRyaWdnZXIuXG4gICAqIEBwYXJhbSBvcmlnaW4gU291cmNlIG9mIHRoZSBtZW51IHRyaWdnZXIncyBmb2N1cy5cbiAgICovXG4gIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvciAmJiBvcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBtZW51IHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgYWxsIG9wdGlvbnMgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX292ZXJsYXlSZWY/LnVwZGF0ZVBvc2l0aW9uKCk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBtZW51IGFuZCBkb2VzIHRoZSBuZWNlc3NhcnkgY2xlYW51cC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveU1lbnUocmVhc29uOiBNZW51Q2xvc2VSZWFzb24pIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlSZWYgfHwgIXRoaXMubWVudU9wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZW51ID0gdGhpcy5tZW51O1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcblxuICAgIC8vIEFsd2F5cyByZXN0b3JlIGZvY3VzIGlmIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcgdXNpbmcgdGhlIGtleWJvYXJkIG9yIHRoZSBtZW51IHdhcyBvcGVuZWRcbiAgICAvLyBwcm9ncmFtbWF0aWNhbGx5LiBXZSBkb24ndCByZXN0b3JlIGZvciBub24tcm9vdCB0cmlnZ2VycywgYmVjYXVzZSBpdCBjYW4gcHJldmVudCBmb2N1c1xuICAgIC8vIGZyb20gbWFraW5nIGl0IGJhY2sgdG8gdGhlIHJvb3QgdHJpZ2dlciB3aGVuIGNsb3NpbmcgYSBsb25nIGNoYWluIG9mIG1lbnVzIGJ5IGNsaWNraW5nXG4gICAgLy8gb24gdGhlIGJhY2tkcm9wLlxuICAgIGlmICh0aGlzLnJlc3RvcmVGb2N1cyAmJiAocmVhc29uID09PSAna2V5ZG93bicgfHwgIXRoaXMuX29wZW5lZEJ5IHx8ICF0aGlzLnRyaWdnZXJzU3VibWVudSgpKSkge1xuICAgICAgdGhpcy5mb2N1cyh0aGlzLl9vcGVuZWRCeSk7XG4gICAgfVxuXG4gICAgdGhpcy5fb3BlbmVkQnkgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAobWVudSBpbnN0YW5jZW9mIF9NYXRNZW51QmFzZSkge1xuICAgICAgbWVudS5fcmVzZXRBbmltYXRpb24oKTtcblxuICAgICAgaWYgKG1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgZGV0YWNoaW5nIHRoZSBjb250ZW50LlxuICAgICAgICBtZW51Ll9hbmltYXRpb25Eb25lXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAvLyBJbnRlcnJ1cHQgaWYgdGhlIGNvbnRlbnQgZ290IHJlLWF0dGFjaGVkLlxuICAgICAgICAgICAgdGFrZVVudGlsKG1lbnUubGF6eUNvbnRlbnQuX2F0dGFjaGVkKSxcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiAoKSA9PiBtZW51LmxhenlDb250ZW50IS5kZXRhY2goKSxcbiAgICAgICAgICAgIC8vIE5vIG1hdHRlciB3aGV0aGVyIHRoZSBjb250ZW50IGdvdCByZS1hdHRhY2hlZCwgcmVzZXQgdGhlIG1lbnUuXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSksXG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXRJc01lbnVPcGVuKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgICBtZW51Py5sYXp5Q29udGVudD8uZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIG1lbnUgc3RhdGUgdG8gb3BlbiBhbmQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbSBpZlxuICAgKiB0aGUgbWVudSB3YXMgb3BlbmVkIHZpYSB0aGUga2V5Ym9hcmQuXG4gICAqL1xuICBwcml2YXRlIF9pbml0TWVudShtZW51OiBNYXRNZW51UGFuZWwpOiB2b2lkIHtcbiAgICBtZW51LnBhcmVudE1lbnUgPSB0aGlzLnRyaWdnZXJzU3VibWVudSgpID8gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51IDogdW5kZWZpbmVkO1xuICAgIG1lbnUuZGlyZWN0aW9uID0gdGhpcy5kaXI7XG4gICAgdGhpcy5fc2V0TWVudUVsZXZhdGlvbihtZW51KTtcbiAgICBtZW51LmZvY3VzRmlyc3RJdGVtKHRoaXMuX29wZW5lZEJ5IHx8ICdwcm9ncmFtJyk7XG4gICAgdGhpcy5fc2V0SXNNZW51T3Blbih0cnVlKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBtZW51IGVsZXZhdGlvbiBiYXNlZCBvbiB0aGUgYW1vdW50IG9mIHBhcmVudCBtZW51cyB0aGF0IGl0IGhhcy4gKi9cbiAgcHJpdmF0ZSBfc2V0TWVudUVsZXZhdGlvbihtZW51OiBNYXRNZW51UGFuZWwpOiB2b2lkIHtcbiAgICBpZiAobWVudS5zZXRFbGV2YXRpb24pIHtcbiAgICAgIGxldCBkZXB0aCA9IDA7XG4gICAgICBsZXQgcGFyZW50TWVudSA9IG1lbnUucGFyZW50TWVudTtcblxuICAgICAgd2hpbGUgKHBhcmVudE1lbnUpIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgICAgcGFyZW50TWVudSA9IHBhcmVudE1lbnUucGFyZW50TWVudTtcbiAgICAgIH1cblxuICAgICAgbWVudS5zZXRFbGV2YXRpb24oZGVwdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgbWVudVxuICBwcml2YXRlIF9zZXRJc01lbnVPcGVuKGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX21lbnVPcGVuID0gaXNPcGVuO1xuICAgIHRoaXMuX21lbnVPcGVuID8gdGhpcy5tZW51T3BlbmVkLmVtaXQoKSA6IHRoaXMubWVudUNsb3NlZC5lbWl0KCk7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgdGhpcy5fbWVudUl0ZW1JbnN0YW5jZS5fc2V0SGlnaGxpZ2h0ZWQoaXNPcGVuKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyB0aGUgb3ZlcmxheSBmcm9tIHRoZSBwcm92aWRlZCBtZW51J3MgdGVtcGxhdGUgYW5kIHNhdmVzIGl0c1xuICAgKiBPdmVybGF5UmVmIHNvIHRoYXQgaXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00gd2hlbiBvcGVuTWVudSBpcyBjYWxsZWQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KG1lbnU6IE1hdE1lbnVQYW5lbCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0T3ZlcmxheUNvbmZpZyhtZW51KTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvUG9zaXRpb25zKFxuICAgICAgICBtZW51LFxuICAgICAgICBjb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICApO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKGNvbmZpZyk7XG5cbiAgICAgIC8vIENvbnN1bWUgdGhlIGBrZXlkb3duRXZlbnRzYCBpbiBvcmRlciB0byBwcmV2ZW50IHRoZW0gZnJvbSBnb2luZyB0byBhbm90aGVyIG92ZXJsYXkuXG4gICAgICAvLyBJZGVhbGx5IHdlJ2QgYWxzbyBoYXZlIG91ciBrZXlib2FyZCBldmVudCBsb2dpYyBpbiBoZXJlLCBob3dldmVyIGRvaW5nIHNvIHdpbGxcbiAgICAgIC8vIGJyZWFrIGFueWJvZHkgdGhhdCBtYXkgaGF2ZSBpbXBsZW1lbnRlZCB0aGUgYE1hdE1lbnVQYW5lbGAgdGhlbXNlbHZlcy5cbiAgICAgIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGJ1aWxkcyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgbmVlZGVkIHRvIGNyZWF0ZSB0aGUgb3ZlcmxheSwgdGhlIE92ZXJsYXlTdGF0ZS5cbiAgICogQHJldHVybnMgT3ZlcmxheUNvbmZpZ1xuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZyhtZW51OiBNYXRNZW51UGFuZWwpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheVxuICAgICAgICAucG9zaXRpb24oKVxuICAgICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9lbGVtZW50KVxuICAgICAgICAud2l0aExvY2tlZFBvc2l0aW9uKClcbiAgICAgICAgLndpdGhHcm93QWZ0ZXJPcGVuKClcbiAgICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1tZW51LXBhbmVsLCAubWF0LW1kYy1tZW51LXBhbmVsJyksXG4gICAgICBiYWNrZHJvcENsYXNzOiBtZW51LmJhY2tkcm9wQ2xhc3MgfHwgJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgICAgIHBhbmVsQ2xhc3M6IG1lbnUub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiB0aGUgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Nlc1xuICAgKiBvbiB0aGUgbWVudSBiYXNlZCBvbiB0aGUgbmV3IHBvc2l0aW9uLiBUaGlzIGVuc3VyZXMgdGhlIGFuaW1hdGlvbiBvcmlnaW4gaXMgYWx3YXlzXG4gICAqIGNvcnJlY3QsIGV2ZW4gaWYgYSBmYWxsYmFjayBwb3NpdGlvbiBpcyB1c2VkIGZvciB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvUG9zaXRpb25zKG1lbnU6IE1hdE1lbnVQYW5lbCwgcG9zaXRpb246IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGlmIChtZW51LnNldFBvc2l0aW9uQ2xhc3Nlcykge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb25DaGFuZ2VzLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgICBjb25zdCBwb3NYOiBNZW51UG9zaXRpb25YID0gY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlYID09PSAnc3RhcnQnID8gJ2FmdGVyJyA6ICdiZWZvcmUnO1xuICAgICAgICBjb25zdCBwb3NZOiBNZW51UG9zaXRpb25ZID0gY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlZID09PSAndG9wJyA/ICdiZWxvdycgOiAnYWJvdmUnO1xuXG4gICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgbmdab25lYC5cbiAgICAgICAgLy8gYHBvc2l0aW9uQ2hhbmdlc2AgZmlyZXMgb3V0c2lkZSBvZiB0aGUgYG5nWm9uZWAgYW5kIGBzZXRQb3NpdGlvbkNsYXNzZXNgIG1pZ2h0IGJlXG4gICAgICAgIC8vIHVwZGF0aW5nIHNvbWV0aGluZyBpbiB0aGUgdmlldyBzbyB3ZSBuZWVkIHRvIGJyaW5nIGl0IGJhY2sgaW4uXG4gICAgICAgIGlmICh0aGlzLl9uZ1pvbmUpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IG1lbnUuc2V0UG9zaXRpb25DbGFzc2VzIShwb3NYLCBwb3NZKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVudS5zZXRQb3NpdGlvbkNsYXNzZXMhKHBvc1gsIHBvc1kpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXBwcm9wcmlhdGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3lcbiAgICogc28gdGhlIG92ZXJsYXkgY29ubmVjdHMgd2l0aCB0aGUgdHJpZ2dlciBjb3JyZWN0bHkuXG4gICAqIEBwYXJhbSBwb3NpdGlvblN0cmF0ZWd5IFN0cmF0ZWd5IHdob3NlIHBvc2l0aW9uIHRvIHVwZGF0ZS5cbiAgICovXG4gIHByaXZhdGUgX3NldFBvc2l0aW9uKG1lbnU6IE1hdE1lbnVQYW5lbCwgcG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgbGV0IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIG1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/IFsnZW5kJywgJ3N0YXJ0J10gOiBbJ3N0YXJ0JywgJ2VuZCddO1xuXG4gICAgbGV0IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV06IFZlcnRpY2FsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIG1lbnUueVBvc2l0aW9uID09PSAnYWJvdmUnID8gWydib3R0b20nLCAndG9wJ10gOiBbJ3RvcCcsICdib3R0b20nXTtcblxuICAgIGxldCBbb3JpZ2luWSwgb3JpZ2luRmFsbGJhY2tZXSA9IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV07XG4gICAgbGV0IFtvdmVybGF5WCwgb3ZlcmxheUZhbGxiYWNrWF0gPSBbb3JpZ2luWCwgb3JpZ2luRmFsbGJhY2tYXTtcbiAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgLy8gV2hlbiB0aGUgbWVudSBpcyBhIHN1Yi1tZW51LCBpdCBzaG91bGQgYWx3YXlzIGFsaWduIGl0c2VsZlxuICAgICAgLy8gdG8gdGhlIGVkZ2VzIG9mIHRoZSB0cmlnZ2VyLCBpbnN0ZWFkIG9mIG92ZXJsYXBwaW5nIGl0LlxuICAgICAgb3ZlcmxheUZhbGxiYWNrWCA9IG9yaWdpblggPSBtZW51LnhQb3NpdGlvbiA9PT0gJ2JlZm9yZScgPyAnc3RhcnQnIDogJ2VuZCc7XG4gICAgICBvcmlnaW5GYWxsYmFja1ggPSBvdmVybGF5WCA9IG9yaWdpblggPT09ICdlbmQnID8gJ3N0YXJ0JyA6ICdlbmQnO1xuXG4gICAgICBpZiAodGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51KSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRJbm5lclBhZGRpbmcgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudS5pdGVtcy5maXJzdDtcbiAgICAgICAgICB0aGlzLl9wYXJlbnRJbm5lclBhZGRpbmcgPSBmaXJzdEl0ZW0gPyBmaXJzdEl0ZW0uX2dldEhvc3RFbGVtZW50KCkub2Zmc2V0VG9wIDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG9mZnNldFkgPSBvdmVybGF5WSA9PT0gJ2JvdHRvbScgPyB0aGlzLl9wYXJlbnRJbm5lclBhZGRpbmcgOiAtdGhpcy5fcGFyZW50SW5uZXJQYWRkaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIW1lbnUub3ZlcmxhcFRyaWdnZXIpIHtcbiAgICAgIG9yaWdpblkgPSBvdmVybGF5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgICAgb3JpZ2luRmFsbGJhY2tZID0gb3ZlcmxheUZhbGxiYWNrWSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIH1cblxuICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7b3JpZ2luWCwgb3JpZ2luWSwgb3ZlcmxheVgsIG92ZXJsYXlZLCBvZmZzZXRZfSxcbiAgICAgIHtvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsIG9yaWdpblksIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLCBvdmVybGF5WSwgb2Zmc2V0WX0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblgsXG4gICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgb3ZlcmxheVgsXG4gICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCxcbiAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgIG9mZnNldFk6IC1vZmZzZXRZLFxuICAgICAgfSxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgc3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgYW4gYWN0aW9uIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBtZW51IG9jY3Vycy4gKi9cbiAgcHJpdmF0ZSBfbWVudUNsb3NpbmdBY3Rpb25zKCkge1xuICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5fb3ZlcmxheVJlZiEuYmFja2Ryb3BDbGljaygpO1xuICAgIGNvbnN0IGRldGFjaG1lbnRzID0gdGhpcy5fb3ZlcmxheVJlZiEuZGV0YWNobWVudHMoKTtcbiAgICBjb25zdCBwYXJlbnRDbG9zZSA9IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSA/IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudS5jbG9zZWQgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBob3ZlciA9IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudVxuICAgICAgPyB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUuX2hvdmVyZWQoKS5waXBlKFxuICAgICAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlICE9PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlKSxcbiAgICAgICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5fbWVudU9wZW4pLFxuICAgICAgICApXG4gICAgICA6IG9ic2VydmFibGVPZigpO1xuXG4gICAgcmV0dXJuIG1lcmdlKGJhY2tkcm9wLCBwYXJlbnRDbG9zZSBhcyBPYnNlcnZhYmxlPE1lbnVDbG9zZVJlYXNvbj4sIGhvdmVyLCBkZXRhY2htZW50cyk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb3VzZSBwcmVzc2VzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KSkge1xuICAgICAgLy8gU2luY2UgcmlnaHQgb3IgbWlkZGxlIGJ1dHRvbiBjbGlja3Mgd29uJ3QgdHJpZ2dlciB0aGUgYGNsaWNrYCBldmVudCxcbiAgICAgIC8vIHdlIHNob3VsZG4ndCBjb25zaWRlciB0aGUgbWVudSBhcyBvcGVuZWQgYnkgbW91c2UgaW4gdGhvc2UgY2FzZXMuXG4gICAgICB0aGlzLl9vcGVuZWRCeSA9IGV2ZW50LmJ1dHRvbiA9PT0gMCA/ICdtb3VzZScgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIFNpbmNlIGNsaWNraW5nIG9uIHRoZSB0cmlnZ2VyIHdvbid0IGNsb3NlIHRoZSBtZW51IGlmIGl0IG9wZW5zIGEgc3ViLW1lbnUsXG4gICAgICAvLyB3ZSBzaG91bGQgcHJldmVudCBmb2N1cyBmcm9tIG1vdmluZyBvbnRvIGl0IHZpYSBjbGljayB0byBhdm9pZCB0aGVcbiAgICAgIC8vIGhpZ2hsaWdodCBmcm9tIGxpbmdlcmluZyBvbiB0aGUgbWVudSBpdGVtLlxuICAgICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXkgcHJlc3NlcyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIC8vIFByZXNzaW5nIGVudGVyIG9uIHRoZSB0cmlnZ2VyIHdpbGwgdHJpZ2dlciB0aGUgY2xpY2sgaGFuZGxlciBsYXRlci5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ2tleWJvYXJkJztcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnRyaWdnZXJzU3VibWVudSgpICYmXG4gICAgICAoKGtleUNvZGUgPT09IFJJR0hUX0FSUk9XICYmIHRoaXMuZGlyID09PSAnbHRyJykgfHxcbiAgICAgICAgKGtleUNvZGUgPT09IExFRlRfQVJST1cgJiYgdGhpcy5kaXIgPT09ICdydGwnKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ2tleWJvYXJkJztcbiAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAvLyBTdG9wIGV2ZW50IHByb3BhZ2F0aW9uIHRvIGF2b2lkIGNsb3NpbmcgdGhlIHBhcmVudCBtZW51LlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLm9wZW5NZW51KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlciBob3ZlcnMgb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlSG92ZXIoKSB7XG4gICAgLy8gU3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIGhvdmVyZWQgaXRlbSBpbiBvcmRlciB0byB0b2dnbGUgdGhlIHBhbmVsLlxuICAgIGlmICghdGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSB8fCAhdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faG92ZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnVcbiAgICAgIC5faG92ZXJlZCgpXG4gICAgICAvLyBTaW5jZSB3ZSBtaWdodCBoYXZlIG11bHRpcGxlIGNvbXBldGluZyB0cmlnZ2VycyBmb3IgdGhlIHNhbWUgbWVudSAoZS5nLiBhIHN1Yi1tZW51XG4gICAgICAvLyB3aXRoIGRpZmZlcmVudCBkYXRhIGFuZCB0cmlnZ2VycyksIHdlIGhhdmUgdG8gZGVsYXkgaXQgYnkgYSB0aWNrIHRvIGVuc3VyZSB0aGF0XG4gICAgICAvLyBpdCB3b24ndCBiZSBjbG9zZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaXMgb3BlbmVkLlxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlID09PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmICFhY3RpdmUuZGlzYWJsZWQpLFxuICAgICAgICBkZWxheSgwLCBhc2FwU2NoZWR1bGVyKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9vcGVuZWRCeSA9ICdtb3VzZSc7XG5cbiAgICAgICAgLy8gSWYgdGhlIHNhbWUgbWVudSBpcyB1c2VkIGJldHdlZW4gbXVsdGlwbGUgdHJpZ2dlcnMsIGl0IG1pZ2h0IHN0aWxsIGJlIGFuaW1hdGluZ1xuICAgICAgICAvLyB3aGlsZSB0aGUgbmV3IHRyaWdnZXIgdHJpZXMgdG8gcmUtb3BlbiBpdC4gV2FpdCBmb3IgdGhlIGFuaW1hdGlvbiB0byBmaW5pc2hcbiAgICAgICAgLy8gYmVmb3JlIGRvaW5nIHNvLiBBbHNvIGludGVycnVwdCBpZiB0aGUgdXNlciBtb3ZlcyB0byBhbm90aGVyIGl0ZW0uXG4gICAgICAgIGlmICh0aGlzLm1lbnUgaW5zdGFuY2VvZiBfTWF0TWVudUJhc2UgJiYgdGhpcy5tZW51Ll9pc0FuaW1hdGluZykge1xuICAgICAgICAgIC8vIFdlIG5lZWQgdGhlIGBkZWxheSgwKWAgaGVyZSBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgICAgIC8vICdjaGFuZ2VkIGFmdGVyIGNoZWNrZWQnIGVycm9ycyBpbiBzb21lIGNhc2VzLiBTZWUgIzEyMTk0LlxuICAgICAgICAgIHRoaXMubWVudS5fYW5pbWF0aW9uRG9uZVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSwgZGVsYXkoMCwgYXNhcFNjaGVkdWxlciksIHRha2VVbnRpbCh0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUhLl9ob3ZlcmVkKCkpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9wZW5NZW51KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9ydGFsIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9nZXRQb3J0YWwobWVudTogTWF0TWVudVBhbmVsKTogVGVtcGxhdGVQb3J0YWwge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBjaGVjayBieSBrZWVwaW5nIHRoZSBwb3J0YWwgb24gdGhlIG1lbnUgcGFuZWwuXG4gICAgLy8gV2hpbGUgaXQgd291bGQgYmUgY2xlYW5lciwgd2UnZCBoYXZlIHRvIGludHJvZHVjZSBhbm90aGVyIHJlcXVpcmVkIG1ldGhvZCBvblxuICAgIC8vIGBNYXRNZW51UGFuZWxgLCBtYWtpbmcgaXQgaGFyZGVyIHRvIGNvbnN1bWUuXG4gICAgaWYgKCF0aGlzLl9wb3J0YWwgfHwgdGhpcy5fcG9ydGFsLnRlbXBsYXRlUmVmICE9PSBtZW51LnRlbXBsYXRlUmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwobWVudS50ZW1wbGF0ZVJlZiwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbDtcbiAgfVxufVxuXG4vKiogRGlyZWN0aXZlIGFwcGxpZWQgdG8gYW4gZWxlbWVudCB0aGF0IHNob3VsZCB0cmlnZ2VyIGEgYG1hdC1tZW51YC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYFttYXQtbWVudS10cmlnZ2VyLWZvcl0sIFttYXRNZW51VHJpZ2dlckZvcl1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtbWVudS10cmlnZ2VyJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51VHJpZ2dlcicsXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVUcmlnZ2VyIGV4dGVuZHMgX01hdE1lbnVUcmlnZ2VyQmFzZSB7fVxuIl19