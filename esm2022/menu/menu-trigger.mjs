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
import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, inject, Inject, InjectionToken, Input, NgZone, Optional, Output, Self, ViewContainerRef, } from '@angular/core';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { MatMenu } from './menu';
import { throwMatMenuRecursiveError } from './menu-errors';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./menu-item";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/cdk/a11y";
/** Injection token that determines the scroll handling while the menu is open. */
export const MAT_MENU_SCROLL_STRATEGY = new InjectionToken('mat-menu-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
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
/** Directive applied to an element that should trigger a `mat-menu`. */
export class MatMenuTrigger {
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
        this._menuItemInstance?._setTriggersSubmenu(this.triggersSubmenu());
    }
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
        this._changeDetectorRef = inject(ChangeDetectorRef);
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
        this._parentMaterialMenu = parentMenu instanceof MatMenu ? parentMenu : undefined;
        _element.nativeElement.addEventListener('touchstart', this._handleTouchStart, passiveEventListenerOptions);
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
        return !!(this._menuItemInstance && this._parentMaterialMenu && this.menu);
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
        if (menu instanceof MatMenu) {
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
        if (menu instanceof MatMenu) {
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
        if (isOpen !== this._menuOpen) {
            this._menuOpen = isOpen;
            this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
            if (this.triggersSubmenu()) {
                this._menuItemInstance._setHighlighted(isOpen);
            }
            this._changeDetectorRef.markForCheck();
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
            if (this.menu instanceof MatMenu && this.menu._isAnimating) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatMenuTrigger, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: MAT_MENU_SCROLL_STRATEGY }, { token: MAT_MENU_PANEL, optional: true }, { token: i2.MatMenuItem, optional: true, self: true }, { token: i3.Directionality, optional: true }, { token: i4.FocusMonitor }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatMenuTrigger, isStandalone: true, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: { _deprecatedMatMenuTriggerFor: ["mat-menu-trigger-for", "_deprecatedMatMenuTriggerFor"], menu: ["matMenuTriggerFor", "menu"], menuData: ["matMenuTriggerData", "menuData"], restoreFocus: ["matMenuTriggerRestoreFocus", "restoreFocus"] }, outputs: { menuOpened: "menuOpened", onMenuOpen: "onMenuOpen", menuClosed: "menuClosed", onMenuClose: "onMenuClose" }, host: { listeners: { "click": "_handleClick($event)", "mousedown": "_handleMousedown($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-haspopup": "menu ? \"menu\" : null", "attr.aria-expanded": "menuOpen", "attr.aria-controls": "menuOpen ? menu.panelId : null" }, classAttribute: "mat-mdc-menu-trigger" }, exportAs: ["matMenuTrigger"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatMenuTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-menu-trigger-for], [matMenuTriggerFor]`,
                    host: {
                        'class': 'mat-mdc-menu-trigger',
                        '[attr.aria-haspopup]': 'menu ? "menu" : null',
                        '[attr.aria-expanded]': 'menuOpen',
                        '[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
                        '(click)': '_handleClick($event)',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                    exportAs: 'matMenuTrigger',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
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
                }] }, { type: i4.FocusMonitor }, { type: i0.NgZone }], propDecorators: { _deprecatedMatMenuTriggerFor: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHTCwrQkFBK0IsRUFDL0IsZ0NBQWdDLEdBQ2pDLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFZLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RSxPQUFPLEVBR0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBQ0osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxhQUFhLEVBQUUsS0FBSyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3hGLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsT0FBTyxFQUFrQixNQUFNLFFBQVEsQ0FBQztBQUNoRCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFDOzs7Ozs7QUFHMUQsa0ZBQWtGO0FBQ2xGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsRUFDMUI7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3JELENBQUM7Q0FDRixDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLGdDQUFnQyxDQUFDLE9BQWdCO0lBQy9ELE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3JELENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0seUNBQXlDLEdBQUc7SUFDdkQsT0FBTyxFQUFFLHdCQUF3QjtJQUNqQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDZixVQUFVLEVBQUUsZ0NBQWdDO0NBQzdDLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsTUFBTSwyQkFBMkIsR0FBRywrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRXJGOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFFeEMsd0VBQXdFO0FBZXhFLE1BQU0sT0FBTyxjQUFjO0lBb0N6Qjs7O09BR0c7SUFDSCxJQUNJLDRCQUE0QjtRQUM5QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksNEJBQTRCLENBQUMsQ0FBc0I7UUFDckQsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELHdFQUF3RTtJQUN4RSxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLElBQXlCO1FBQ2hDLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdkIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRTFDLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLG1CQUFtQixJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO2dCQUN4RiwwQkFBMEIsRUFBRSxDQUFDO2FBQzlCO1lBRUQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBdUIsRUFBRSxFQUFFO2dCQUM3RSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUxQixnRkFBZ0Y7Z0JBQ2hGLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7b0JBQ3hFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM5QztZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQTZFRCxZQUNVLFFBQWlCLEVBQ2pCLFFBQWlDLEVBQ2pDLGlCQUFtQyxFQUNULGNBQW1CLEVBQ2pCLFVBQXdCO0lBQzVELHlFQUF5RTtJQUN6RSwrQ0FBK0M7SUFDbkIsaUJBQThCLEVBQ3RDLElBQW9CLEVBQ2hDLGFBQWtDLEVBQ2xDLE9BQWdCO1FBVmhCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFDakMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUtmLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBYTtRQUN0QyxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBcUI7UUFDbEMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQW5LbEIsZ0JBQVcsR0FBc0IsSUFBSSxDQUFDO1FBQ3RDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZ0NBQTJCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUNqRCx1QkFBa0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQ3hDLDJCQUFzQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFFNUMsdUJBQWtCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFjdkQ7OztXQUdHO1FBQ0ssc0JBQWlCLEdBQUcsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQztRQUVGLHVFQUF1RTtRQUN2RSxzRUFBc0U7UUFDdEUsY0FBUyxHQUF1RCxTQUFTLENBQUM7UUFpRDFFOzs7O1dBSUc7UUFDa0MsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFFbEUsd0RBQXdEO1FBQ3JDLGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUU3RTs7OztXQUlHO1FBQ0gsK0NBQStDO1FBQzVCLGVBQVUsR0FBdUIsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUVwRSx3REFBd0Q7UUFDckMsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTdFOzs7O1dBSUc7UUFDSCwrQ0FBK0M7UUFDNUIsZ0JBQVcsR0FBdUIsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQXlEbkUsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFVBQVUsWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRWxGLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQ3JDLFlBQVksRUFDWixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLDJCQUEyQixDQUM1QixDQUFDO0lBQ0osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUM3QyxZQUFZLEVBQ1osSUFBSSxDQUFDLGlCQUFpQixFQUN0QiwyQkFBMkIsQ0FDNUIsQ0FBQztRQUVGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsSUFBSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDaEUsQ0FBQztJQUVELCtEQUErRDtJQUMvRCxlQUFlO1FBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsMkRBQTJEO0lBQzNELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsUUFBUTtRQUNOLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzNCLE9BQU87U0FDUjtRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzdDLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLGdCQUFxRCxDQUFDO1FBRTdGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDMUMsYUFBYSxDQUFDLFdBQVc7WUFDdkIsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hFLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXpDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBSSxJQUFJLFlBQVksT0FBTyxFQUFFO1lBQzNCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDN0Usa0VBQWtFO2dCQUNsRSx5RUFBeUU7Z0JBQ3pFLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQ2pFLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLFNBQVM7UUFDUCxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLE1BQW9CLEVBQUUsT0FBc0I7UUFDaEQsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLE1BQU0sRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsY0FBYztRQUNaLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHNEQUFzRDtJQUM5QyxZQUFZLENBQUMsTUFBdUI7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLE9BQU87U0FDUjtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFMUIsMkZBQTJGO1FBQzNGLHlGQUF5RjtRQUN6Rix5RkFBeUY7UUFDekYsbUJBQW1CO1FBQ25CLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUU7WUFDN0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUI7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUUzQixJQUFJLElBQUksWUFBWSxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXZCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsc0VBQXNFO2dCQUN0RSxJQUFJLENBQUMsY0FBYztxQkFDaEIsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLEVBQ3pDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsNENBQTRDO2dCQUM1QyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FDdEM7cUJBQ0EsU0FBUyxDQUFDO29CQUNULElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBWSxDQUFDLE1BQU0sRUFBRTtvQkFDdEMsaUVBQWlFO29CQUNqRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7aUJBQzNDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUI7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQixJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLFNBQVMsQ0FBQyxJQUFrQjtRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0ZBQWtGO0lBQzFFLGlCQUFpQixDQUFDLElBQWtCO1FBQzFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRWpDLE9BQU8sVUFBVSxFQUFFO2dCQUNqQixLQUFLLEVBQUUsQ0FBQztnQkFDUixVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQzthQUNwQztZQUVELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsa0VBQWtFO0lBQzFELGNBQWMsQ0FBQyxNQUFlO1FBQ3BDLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVqRSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoRDtZQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSyxjQUFjLENBQUMsSUFBa0I7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxxQkFBcUIsQ0FDeEIsSUFBSSxFQUNKLE1BQU0sQ0FBQyxnQkFBcUQsQ0FDN0QsQ0FBQztZQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsc0ZBQXNGO1lBQ3RGLGlGQUFpRjtZQUNqRix5RUFBeUU7WUFDekUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUM5QztRQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssaUJBQWlCLENBQUMsSUFBa0I7UUFDMUMsT0FBTyxJQUFJLGFBQWEsQ0FBQztZQUN2QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDNUIsUUFBUSxFQUFFO2lCQUNWLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQ2xDLGtCQUFrQixFQUFFO2lCQUNwQixpQkFBaUIsRUFBRTtpQkFDbkIscUJBQXFCLENBQUMsc0NBQXNDLENBQUM7WUFDaEUsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLElBQUksa0NBQWtDO1lBQ3ZFLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1lBQ2xDLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLHFCQUFxQixDQUFDLElBQWtCLEVBQUUsUUFBMkM7UUFDM0YsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFDLE1BQU0sSUFBSSxHQUFrQixNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUM1RixNQUFNLElBQUksR0FBa0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFFekYsMERBQTBEO2dCQUMxRCxvRkFBb0Y7Z0JBQ3BGLGlFQUFpRTtnQkFDakUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzlEO3FCQUFNO29CQUNMLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3RDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssWUFBWSxDQUFDLElBQWtCLEVBQUUsZ0JBQW1EO1FBQzFGLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLEdBQzVCLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEUsSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxHQUM5QixJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDOUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQzFCLDZEQUE2RDtZQUM3RCwwREFBMEQ7WUFDMUQsZ0JBQWdCLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMzRSxlQUFlLEdBQUcsUUFBUSxHQUFHLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRWpFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUM1QixJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLEVBQUU7b0JBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUN2RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xGO2dCQUVELE9BQU8sR0FBRyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO2FBQ3hGO1NBQ0Y7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMvQixPQUFPLEdBQUcsUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDaEQsZUFBZSxHQUFHLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDakU7UUFFRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7WUFDN0IsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO1lBQy9DLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7WUFDbEY7Z0JBQ0UsT0FBTztnQkFDUCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsUUFBUTtnQkFDUixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixPQUFPLEVBQUUsQ0FBQyxPQUFPO2FBQ2xCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixPQUFPLEVBQUUsQ0FBQyxPQUFPO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdGQUF3RjtJQUNoRixtQkFBbUI7UUFDekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEcsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQjtZQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM3QjtZQUNILENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVuQixPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsV0FBMEMsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxnQkFBZ0IsQ0FBQyxLQUFpQjtRQUNoQyxJQUFJLENBQUMsK0JBQStCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0MsdUVBQXVFO1lBQ3ZFLG9FQUFvRTtZQUNwRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUUxRCw2RUFBNkU7WUFDN0UscUVBQXFFO1lBQ3JFLDZDQUE2QztZQUM3QyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDMUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBRTlCLHNFQUFzRTtRQUN0RSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssRUFBRTtZQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztTQUM3QjtRQUVELElBQ0UsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixDQUFDLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQztnQkFDOUMsQ0FBQyxPQUFPLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsRUFDakQ7WUFDQSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM1QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLFlBQVksQ0FBQyxLQUFpQjtRQUM1QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUMxQiwyREFBMkQ7WUFDM0QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELGdFQUFnRTtJQUN4RCxZQUFZO1FBQ2xCLHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ3hELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CO2FBQy9DLFFBQVEsRUFBRTtZQUNYLHFGQUFxRjtZQUNyRixrRkFBa0Y7WUFDbEYscURBQXFEO2FBQ3BELElBQUksQ0FDSCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGlCQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUN2RSxLQUFLLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUN4QjthQUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUV6QixrRkFBa0Y7WUFDbEYsOEVBQThFO1lBQzlFLHFFQUFxRTtZQUNyRSxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUMxRCxnREFBZ0Q7Z0JBQ2hELDREQUE0RDtnQkFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjO3FCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBb0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUN2RixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDckM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsOERBQThEO0lBQ3RELFVBQVUsQ0FBQyxJQUFrQjtRQUNuQyw2RUFBNkU7UUFDN0UsK0VBQStFO1FBQy9FLCtDQUErQztRQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUM3RTtRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDOzhHQTVrQlUsY0FBYyxtR0E4SmYsd0JBQXdCLGFBQ3hCLGNBQWM7a0dBL0piLGNBQWM7OzJGQUFkLGNBQWM7a0JBZDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZDQUE2QztvQkFDdkQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLHNCQUFzQixFQUFFLHNCQUFzQjt3QkFDOUMsc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsc0JBQXNCLEVBQUUsZ0NBQWdDO3dCQUN4RCxTQUFTLEVBQUUsc0JBQXNCO3dCQUNqQyxhQUFhLEVBQUUsMEJBQTBCO3dCQUN6QyxXQUFXLEVBQUUsd0JBQXdCO3FCQUN0QztvQkFDRCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7OzBCQStKSSxNQUFNOzJCQUFDLHdCQUF3Qjs7MEJBQy9CLE1BQU07MkJBQUMsY0FBYzs7MEJBQUcsUUFBUTs7MEJBR2hDLFFBQVE7OzBCQUFJLElBQUk7OzBCQUNoQixRQUFRO3lGQTFIUCw0QkFBNEI7c0JBRC9CLEtBQUs7dUJBQUMsc0JBQXNCO2dCQVV6QixJQUFJO3NCQURQLEtBQUs7dUJBQUMsbUJBQW1CO2dCQWdDRyxRQUFRO3NCQUFwQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFPVSxZQUFZO3NCQUFoRCxLQUFLO3VCQUFDLDRCQUE0QjtnQkFHaEIsVUFBVTtzQkFBNUIsTUFBTTtnQkFRWSxVQUFVO3NCQUE1QixNQUFNO2dCQUdZLFVBQVU7c0JBQTVCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBGb2N1c01vbml0b3IsXG4gIEZvY3VzT3JpZ2luLFxuICBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyLFxuICBpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0VOVEVSLCBMRUZUX0FSUk9XLCBSSUdIVF9BUlJPVywgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIEhvcml6b250YWxDb25uZWN0aW9uUG9zLFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbiAgVmVydGljYWxDb25uZWN0aW9uUG9zLFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHthc2FwU2NoZWR1bGVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0TWVudSwgTWVudUNsb3NlUmVhc29ufSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHt0aHJvd01hdE1lbnVSZWN1cnNpdmVFcnJvcn0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge01lbnVQb3NpdGlvblgsIE1lbnVQb3NpdGlvbll9IGZyb20gJy4vbWVudS1wb3NpdGlvbnMnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBtZW51IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ21hdC1tZW51LXNjcm9sbC1zdHJhdGVneScsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogKCkgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IGluamVjdChPdmVybGF5KTtcbiAgICAgIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xuICAgIH0sXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKiogT3B0aW9ucyBmb3IgYmluZGluZyBhIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8qKlxuICogRGVmYXVsdCB0b3AgcGFkZGluZyBvZiB0aGUgbWVudSBwYW5lbC5cbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBXaWxsIGJlIHJlbW92ZWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMFxuICovXG5leHBvcnQgY29uc3QgTUVOVV9QQU5FTF9UT1BfUEFERElORyA9IDg7XG5cbi8qKiBEaXJlY3RpdmUgYXBwbGllZCB0byBhbiBlbGVtZW50IHRoYXQgc2hvdWxkIHRyaWdnZXIgYSBgbWF0LW1lbnVgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1tZW51LXRyaWdnZXItZm9yXSwgW21hdE1lbnVUcmlnZ2VyRm9yXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1tZW51LXRyaWdnZXInLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdtZW51ID8gXCJtZW51XCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnbWVudU9wZW4nLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdtZW51T3BlbiA/IG1lbnUucGFuZWxJZCA6IG51bGwnLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygkZXZlbnQpJyxcbiAgICAnKG1vdXNlZG93biknOiAnX2hhbmRsZU1vdXNlZG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdE1lbnVUcmlnZ2VyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudVRyaWdnZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsO1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX21lbnVPcGVuOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9ob3ZlclN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfbWVudUNsb3NlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmID0gaW5qZWN0KENoYW5nZURldGVjdG9yUmVmKTtcblxuICAvKipcbiAgICogV2UncmUgc3BlY2lmaWNhbGx5IGxvb2tpbmcgZm9yIGEgYE1hdE1lbnVgIGhlcmUgc2luY2UgdGhlIGdlbmVyaWMgYE1hdE1lbnVQYW5lbGBcbiAgICogaW50ZXJmYWNlIGxhY2tzIHNvbWUgZnVuY3Rpb25hbGl0eSBhcm91bmQgbmVzdGVkIG1lbnVzIGFuZCBhbmltYXRpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWF0ZXJpYWxNZW51OiBNYXRNZW51IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDYWNoZWQgdmFsdWUgb2YgdGhlIHBhZGRpbmcgb2YgdGhlIHBhcmVudCBtZW51IHBhbmVsLlxuICAgKiBVc2VkIHRvIG9mZnNldCBzdWItbWVudXMgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIHBhZGRpbmcuXG4gICAqL1xuICBwcml2YXRlIF9wYXJlbnRJbm5lclBhZGRpbmc6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSGFuZGxlcyB0b3VjaCBzdGFydCBldmVudHMgb24gdGhlIHRyaWdnZXIuXG4gICAqIE5lZWRzIHRvIGJlIGFuIGFycm93IGZ1bmN0aW9uIHNvIHdlIGNhbiBlYXNpbHkgdXNlIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHJlbW92ZUV2ZW50TGlzdGVuZXIuXG4gICAqL1xuICBwcml2YXRlIF9oYW5kbGVUb3VjaFN0YXJ0ID0gKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKCFpc0Zha2VUb3VjaHN0YXJ0RnJvbVNjcmVlblJlYWRlcihldmVudCkpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ3RvdWNoJztcbiAgICB9XG4gIH07XG5cbiAgLy8gVHJhY2tpbmcgaW5wdXQgdHlwZSBpcyBuZWNlc3Nhcnkgc28gaXQncyBwb3NzaWJsZSB0byBvbmx5IGF1dG8tZm9jdXNcbiAgLy8gdGhlIGZpcnN0IGl0ZW0gb2YgdGhlIGxpc3Qgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZFxuICBfb3BlbmVkQnk6IEV4Y2x1ZGU8Rm9jdXNPcmlnaW4sICdwcm9ncmFtJyB8IG51bGw+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoJ21hdC1tZW51LXRyaWdnZXItZm9yJylcbiAgZ2V0IF9kZXByZWNhdGVkTWF0TWVudVRyaWdnZXJGb3IoKTogTWF0TWVudVBhbmVsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWVudTtcbiAgfVxuICBzZXQgX2RlcHJlY2F0ZWRNYXRNZW51VHJpZ2dlckZvcih2OiBNYXRNZW51UGFuZWwgfCBudWxsKSB7XG4gICAgdGhpcy5tZW51ID0gdjtcbiAgfVxuXG4gIC8qKiBSZWZlcmVuY2VzIHRoZSBtZW51IGluc3RhbmNlIHRoYXQgdGhlIHRyaWdnZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoJ21hdE1lbnVUcmlnZ2VyRm9yJylcbiAgZ2V0IG1lbnUoKTogTWF0TWVudVBhbmVsIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21lbnU7XG4gIH1cbiAgc2V0IG1lbnUobWVudTogTWF0TWVudVBhbmVsIHwgbnVsbCkge1xuICAgIGlmIChtZW51ID09PSB0aGlzLl9tZW51KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbWVudSA9IG1lbnU7XG4gICAgdGhpcy5fbWVudUNsb3NlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICBpZiAobWVudSkge1xuICAgICAgaWYgKG1lbnUgPT09IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvd01hdE1lbnVSZWN1cnNpdmVFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tZW51Q2xvc2VTdWJzY3JpcHRpb24gPSBtZW51LmNsb3NlLnN1YnNjcmliZSgocmVhc29uOiBNZW51Q2xvc2VSZWFzb24pID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveU1lbnUocmVhc29uKTtcblxuICAgICAgICAvLyBJZiBhIGNsaWNrIGNsb3NlZCB0aGUgbWVudSwgd2Ugc2hvdWxkIGNsb3NlIHRoZSBlbnRpcmUgY2hhaW4gb2YgbmVzdGVkIG1lbnVzLlxuICAgICAgICBpZiAoKHJlYXNvbiA9PT0gJ2NsaWNrJyB8fCByZWFzb24gPT09ICd0YWInKSAmJiB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUpIHtcbiAgICAgICAgICB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUuY2xvc2VkLmVtaXQocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWVudUl0ZW1JbnN0YW5jZT8uX3NldFRyaWdnZXJzU3VibWVudSh0aGlzLnRyaWdnZXJzU3VibWVudSgpKTtcbiAgfVxuICBwcml2YXRlIF9tZW51OiBNYXRNZW51UGFuZWwgfCBudWxsO1xuXG4gIC8qKiBEYXRhIHRvIGJlIHBhc3NlZCBhbG9uZyB0byBhbnkgbGF6aWx5LXJlbmRlcmVkIGNvbnRlbnQuICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJEYXRhJykgbWVudURhdGE6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBmb2N1cyBzaG91bGQgYmUgcmVzdG9yZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBkaXNhYmxpbmcgdGhpcyBvcHRpb24gY2FuIGhhdmUgYWNjZXNzaWJpbGl0eSBpbXBsaWNhdGlvbnNcbiAgICogYW5kIGl0J3MgdXAgdG8geW91IHRvIG1hbmFnZSBmb2N1cywgaWYgeW91IGRlY2lkZSB0byB0dXJuIGl0IG9mZi5cbiAgICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJSZXN0b3JlRm9jdXMnKSByZXN0b3JlRm9jdXM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtZW51T3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIG9wZW5lZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBtZW51T3BlbmVkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvbk1lbnVPcGVuOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVPcGVuZWQ7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1lbnVDbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYG1lbnVDbG9zZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9uTWVudUNsb3NlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVDbG9zZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsLFxuICAgIG1lbnVJdGVtSW5zdGFuY2U6IE1hdE1lbnVJdGVtLFxuICAgIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBmb2N1c01vbml0b3JgIHdpbGwgYmVjb21lIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBvdmVybGF5OiBPdmVybGF5LFxuICAgIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwsXG4gICAgbWVudUl0ZW1JbnN0YW5jZTogTWF0TWVudUl0ZW0sXG4gICAgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBmb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3IgfCBudWxsLFxuICApO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBgbmdab25lYCB3aWxsIGJlY29tZSBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIHBhcmVudE1lbnU6IE1hdE1lbnVQYW5lbCxcbiAgICBtZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwsXG4gICAgLy8gYE1hdE1lbnVUcmlnZ2VyYCBpcyBjb21tb25seSB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggYSBgTWF0TWVudUl0ZW1gLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbGlnaHR3ZWlnaHQtdG9rZW5zXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwcml2YXRlIF9tZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yIHwgbnVsbCxcbiAgICBwcml2YXRlIF9uZ1pvbmU/OiBOZ1pvbmUsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gICAgdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51ID0gcGFyZW50TWVudSBpbnN0YW5jZW9mIE1hdE1lbnUgPyBwYXJlbnRNZW51IDogdW5kZWZpbmVkO1xuXG4gICAgX2VsZW1lbnQubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgdGhpcy5faGFuZGxlVG91Y2hTdGFydCxcbiAgICAgIHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucyxcbiAgICApO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2hhbmRsZUhvdmVyKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgIHRoaXMuX2hhbmRsZVRvdWNoU3RhcnQsXG4gICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4gICAgKTtcblxuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5faG92ZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIG9wZW4uICovXG4gIGdldCBtZW51T3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWVudU9wZW47XG4gIH1cblxuICAvKiogVGhlIHRleHQgZGlyZWN0aW9uIG9mIHRoZSBjb250YWluaW5nIGFwcC4gKi9cbiAgZ2V0IGRpcigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSB0cmlnZ2VycyBhIHN1Yi1tZW51IG9yIGEgdG9wLWxldmVsIG9uZS4gKi9cbiAgdHJpZ2dlcnNTdWJtZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmIHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSAmJiB0aGlzLm1lbnUpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIG1lbnUgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2VkIHN0YXRlcy4gKi9cbiAgdG9nZ2xlTWVudSgpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fbWVudU9wZW4gPyB0aGlzLmNsb3NlTWVudSgpIDogdGhpcy5vcGVuTWVudSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBtZW51LiAqL1xuICBvcGVuTWVudSgpOiB2b2lkIHtcbiAgICBjb25zdCBtZW51ID0gdGhpcy5tZW51O1xuXG4gICAgaWYgKHRoaXMuX21lbnVPcGVuIHx8ICFtZW51KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkobWVudSk7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IG92ZXJsYXlSZWYuZ2V0Q29uZmlnKCk7XG4gICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgICB0aGlzLl9zZXRQb3NpdGlvbihtZW51LCBwb3NpdGlvblN0cmF0ZWd5KTtcbiAgICBvdmVybGF5Q29uZmlnLmhhc0JhY2tkcm9wID1cbiAgICAgIG1lbnUuaGFzQmFja2Ryb3AgPT0gbnVsbCA/ICF0aGlzLnRyaWdnZXJzU3VibWVudSgpIDogbWVudS5oYXNCYWNrZHJvcDtcbiAgICBvdmVybGF5UmVmLmF0dGFjaCh0aGlzLl9nZXRQb3J0YWwobWVudSkpO1xuXG4gICAgaWYgKG1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgIG1lbnUubGF6eUNvbnRlbnQuYXR0YWNoKHRoaXMubWVudURhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uID0gdGhpcy5fbWVudUNsb3NpbmdBY3Rpb25zKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2VNZW51KCkpO1xuICAgIHRoaXMuX2luaXRNZW51KG1lbnUpO1xuXG4gICAgaWYgKG1lbnUgaW5zdGFuY2VvZiBNYXRNZW51KSB7XG4gICAgICBtZW51Ll9zdGFydEFuaW1hdGlvbigpO1xuICAgICAgbWVudS5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmNoYW5nZXMucGlwZSh0YWtlVW50aWwobWVudS5jbG9zZSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFJlLWFkanVzdCB0aGUgcG9zaXRpb24gd2l0aG91dCBsb2NraW5nIHdoZW4gdGhlIGFtb3VudCBvZiBpdGVtc1xuICAgICAgICAvLyBjaGFuZ2VzIHNvIHRoYXQgdGhlIG92ZXJsYXkgaXMgYWxsb3dlZCB0byBwaWNrIGEgbmV3IG9wdGltYWwgcG9zaXRpb24uXG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aExvY2tlZFBvc2l0aW9uKGZhbHNlKS5yZWFwcGx5TGFzdFBvc2l0aW9uKCk7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aExvY2tlZFBvc2l0aW9uKHRydWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgbWVudS4gKi9cbiAgY2xvc2VNZW51KCk6IHZvaWQge1xuICAgIHRoaXMubWVudT8uY2xvc2UuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIG1lbnUgdHJpZ2dlci5cbiAgICogQHBhcmFtIG9yaWdpbiBTb3VyY2Ugb2YgdGhlIG1lbnUgdHJpZ2dlcidzIGZvY3VzLlxuICAgKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yICYmIG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIG1lbnUgdG8gZW5zdXJlIHRoYXQgaXQgZml0cyBhbGwgb3B0aW9ucyB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fb3ZlcmxheVJlZj8udXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUgYW5kIGRvZXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwLiAqL1xuICBwcml2YXRlIF9kZXN0cm95TWVudShyZWFzb246IE1lbnVDbG9zZVJlYXNvbikge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVJlZiB8fCAhdGhpcy5tZW51T3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1lbnUgPSB0aGlzLm1lbnU7XG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuXG4gICAgLy8gQWx3YXlzIHJlc3RvcmUgZm9jdXMgaWYgdGhlIHVzZXIgaXMgbmF2aWdhdGluZyB1c2luZyB0aGUga2V5Ym9hcmQgb3IgdGhlIG1lbnUgd2FzIG9wZW5lZFxuICAgIC8vIHByb2dyYW1tYXRpY2FsbHkuIFdlIGRvbid0IHJlc3RvcmUgZm9yIG5vbi1yb290IHRyaWdnZXJzLCBiZWNhdXNlIGl0IGNhbiBwcmV2ZW50IGZvY3VzXG4gICAgLy8gZnJvbSBtYWtpbmcgaXQgYmFjayB0byB0aGUgcm9vdCB0cmlnZ2VyIHdoZW4gY2xvc2luZyBhIGxvbmcgY2hhaW4gb2YgbWVudXMgYnkgY2xpY2tpbmdcbiAgICAvLyBvbiB0aGUgYmFja2Ryb3AuXG4gICAgaWYgKHRoaXMucmVzdG9yZUZvY3VzICYmIChyZWFzb24gPT09ICdrZXlkb3duJyB8fCAhdGhpcy5fb3BlbmVkQnkgfHwgIXRoaXMudHJpZ2dlcnNTdWJtZW51KCkpKSB7XG4gICAgICB0aGlzLmZvY3VzKHRoaXMuX29wZW5lZEJ5KTtcbiAgICB9XG5cbiAgICB0aGlzLl9vcGVuZWRCeSA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChtZW51IGluc3RhbmNlb2YgTWF0TWVudSkge1xuICAgICAgbWVudS5fcmVzZXRBbmltYXRpb24oKTtcblxuICAgICAgaWYgKG1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgdGhlIGV4aXQgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgZGV0YWNoaW5nIHRoZSBjb250ZW50LlxuICAgICAgICBtZW51Ll9hbmltYXRpb25Eb25lXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQudG9TdGF0ZSA9PT0gJ3ZvaWQnKSxcbiAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAvLyBJbnRlcnJ1cHQgaWYgdGhlIGNvbnRlbnQgZ290IHJlLWF0dGFjaGVkLlxuICAgICAgICAgICAgdGFrZVVudGlsKG1lbnUubGF6eUNvbnRlbnQuX2F0dGFjaGVkKSxcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiAoKSA9PiBtZW51LmxhenlDb250ZW50IS5kZXRhY2goKSxcbiAgICAgICAgICAgIC8vIE5vIG1hdHRlciB3aGV0aGVyIHRoZSBjb250ZW50IGdvdCByZS1hdHRhY2hlZCwgcmVzZXQgdGhlIG1lbnUuXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSksXG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXRJc01lbnVPcGVuKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgICBtZW51Py5sYXp5Q29udGVudD8uZGV0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIG1lbnUgc3RhdGUgdG8gb3BlbiBhbmQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbSBpZlxuICAgKiB0aGUgbWVudSB3YXMgb3BlbmVkIHZpYSB0aGUga2V5Ym9hcmQuXG4gICAqL1xuICBwcml2YXRlIF9pbml0TWVudShtZW51OiBNYXRNZW51UGFuZWwpOiB2b2lkIHtcbiAgICBtZW51LnBhcmVudE1lbnUgPSB0aGlzLnRyaWdnZXJzU3VibWVudSgpID8gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51IDogdW5kZWZpbmVkO1xuICAgIG1lbnUuZGlyZWN0aW9uID0gdGhpcy5kaXI7XG4gICAgdGhpcy5fc2V0TWVudUVsZXZhdGlvbihtZW51KTtcbiAgICBtZW51LmZvY3VzRmlyc3RJdGVtKHRoaXMuX29wZW5lZEJ5IHx8ICdwcm9ncmFtJyk7XG4gICAgdGhpcy5fc2V0SXNNZW51T3Blbih0cnVlKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBtZW51IGVsZXZhdGlvbiBiYXNlZCBvbiB0aGUgYW1vdW50IG9mIHBhcmVudCBtZW51cyB0aGF0IGl0IGhhcy4gKi9cbiAgcHJpdmF0ZSBfc2V0TWVudUVsZXZhdGlvbihtZW51OiBNYXRNZW51UGFuZWwpOiB2b2lkIHtcbiAgICBpZiAobWVudS5zZXRFbGV2YXRpb24pIHtcbiAgICAgIGxldCBkZXB0aCA9IDA7XG4gICAgICBsZXQgcGFyZW50TWVudSA9IG1lbnUucGFyZW50TWVudTtcblxuICAgICAgd2hpbGUgKHBhcmVudE1lbnUpIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgICAgcGFyZW50TWVudSA9IHBhcmVudE1lbnUucGFyZW50TWVudTtcbiAgICAgIH1cblxuICAgICAgbWVudS5zZXRFbGV2YXRpb24oZGVwdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgbWVudVxuICBwcml2YXRlIF9zZXRJc01lbnVPcGVuKGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpc09wZW4gIT09IHRoaXMuX21lbnVPcGVuKSB7XG4gICAgICB0aGlzLl9tZW51T3BlbiA9IGlzT3BlbjtcbiAgICAgIHRoaXMuX21lbnVPcGVuID8gdGhpcy5tZW51T3BlbmVkLmVtaXQoKSA6IHRoaXMubWVudUNsb3NlZC5lbWl0KCk7XG5cbiAgICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAgIHRoaXMuX21lbnVJdGVtSW5zdGFuY2UuX3NldEhpZ2hsaWdodGVkKGlzT3Blbik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjcmVhdGVzIHRoZSBvdmVybGF5IGZyb20gdGhlIHByb3ZpZGVkIG1lbnUncyB0ZW1wbGF0ZSBhbmQgc2F2ZXMgaXRzXG4gICAqIE92ZXJsYXlSZWYgc28gdGhhdCBpdCBjYW4gYmUgYXR0YWNoZWQgdG8gdGhlIERPTSB3aGVuIG9wZW5NZW51IGlzIGNhbGxlZC5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkobWVudTogTWF0TWVudVBhbmVsKTogT3ZlcmxheVJlZiB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZXRPdmVybGF5Q29uZmlnKG1lbnUpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9Qb3NpdGlvbnMoXG4gICAgICAgIG1lbnUsXG4gICAgICAgIGNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgICAgICk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoY29uZmlnKTtcblxuICAgICAgLy8gQ29uc3VtZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHByZXZlbnQgdGhlbSBmcm9tIGdvaW5nIHRvIGFub3RoZXIgb3ZlcmxheS5cbiAgICAgIC8vIElkZWFsbHkgd2UnZCBhbHNvIGhhdmUgb3VyIGtleWJvYXJkIGV2ZW50IGxvZ2ljIGluIGhlcmUsIGhvd2V2ZXIgZG9pbmcgc28gd2lsbFxuICAgICAgLy8gYnJlYWsgYW55Ym9keSB0aGF0IG1heSBoYXZlIGltcGxlbWVudGVkIHRoZSBgTWF0TWVudVBhbmVsYCB0aGVtc2VsdmVzLlxuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYnVpbGRzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBuZWVkZWQgdG8gY3JlYXRlIHRoZSBvdmVybGF5LCB0aGUgT3ZlcmxheVN0YXRlLlxuICAgKiBAcmV0dXJucyBPdmVybGF5Q29uZmlnXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKG1lbnU6IE1hdE1lbnVQYW5lbCk6IE92ZXJsYXlDb25maWcge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5XG4gICAgICAgIC5wb3NpdGlvbigpXG4gICAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKVxuICAgICAgICAud2l0aEdyb3dBZnRlck9wZW4oKVxuICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LW1lbnUtcGFuZWwsIC5tYXQtbWRjLW1lbnUtcGFuZWwnKSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IG1lbnUuYmFja2Ryb3BDbGFzcyB8fCAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICAgICAgcGFuZWxDbGFzczogbWVudS5vdmVybGF5UGFuZWxDbGFzcyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyB0byBjaGFuZ2VzIGluIHRoZSBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheSBhbmQgc2V0cyB0aGUgY29ycmVjdCBjbGFzc2VzXG4gICAqIG9uIHRoZSBtZW51IGJhc2VkIG9uIHRoZSBuZXcgcG9zaXRpb24uIFRoaXMgZW5zdXJlcyB0aGUgYW5pbWF0aW9uIG9yaWdpbiBpcyBhbHdheXNcbiAgICogY29ycmVjdCwgZXZlbiBpZiBhIGZhbGxiYWNrIHBvc2l0aW9uIGlzIHVzZWQgZm9yIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Qb3NpdGlvbnMobWVudTogTWF0TWVudVBhbmVsLCBwb3NpdGlvbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgaWYgKG1lbnUuc2V0UG9zaXRpb25DbGFzc2VzKSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbkNoYW5nZXMuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc1g6IE1lbnVQb3NpdGlvblggPSBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVggPT09ICdzdGFydCcgPyAnYWZ0ZXInIDogJ2JlZm9yZSc7XG4gICAgICAgIGNvbnN0IHBvc1k6IE1lbnVQb3NpdGlvblkgPSBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVkgPT09ICd0b3AnID8gJ2JlbG93JyA6ICdhYm92ZSc7XG5cbiAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxNS4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBuZ1pvbmVgLlxuICAgICAgICAvLyBgcG9zaXRpb25DaGFuZ2VzYCBmaXJlcyBvdXRzaWRlIG9mIHRoZSBgbmdab25lYCBhbmQgYHNldFBvc2l0aW9uQ2xhc3Nlc2AgbWlnaHQgYmVcbiAgICAgICAgLy8gdXBkYXRpbmcgc29tZXRoaW5nIGluIHRoZSB2aWV3IHNvIHdlIG5lZWQgdG8gYnJpbmcgaXQgYmFjayBpbi5cbiAgICAgICAgaWYgKHRoaXMuX25nWm9uZSkge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gbWVudS5zZXRQb3NpdGlvbkNsYXNzZXMhKHBvc1gsIHBvc1kpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZW51LnNldFBvc2l0aW9uQ2xhc3NlcyEocG9zWCwgcG9zWSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhcHByb3ByaWF0ZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneVxuICAgKiBzbyB0aGUgb3ZlcmxheSBjb25uZWN0cyB3aXRoIHRoZSB0cmlnZ2VyIGNvcnJlY3RseS5cbiAgICogQHBhcmFtIHBvc2l0aW9uU3RyYXRlZ3kgU3RyYXRlZ3kgd2hvc2UgcG9zaXRpb24gdG8gdXBkYXRlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0UG9zaXRpb24obWVudTogTWF0TWVudVBhbmVsLCBwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICBsZXQgW29yaWdpblgsIG9yaWdpbkZhbGxiYWNrWF06IEhvcml6b250YWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgbWVudS54UG9zaXRpb24gPT09ICdiZWZvcmUnID8gWydlbmQnLCAnc3RhcnQnXSA6IFsnc3RhcnQnLCAnZW5kJ107XG5cbiAgICBsZXQgW292ZXJsYXlZLCBvdmVybGF5RmFsbGJhY2tZXTogVmVydGljYWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgbWVudS55UG9zaXRpb24gPT09ICdhYm92ZScgPyBbJ2JvdHRvbScsICd0b3AnXSA6IFsndG9wJywgJ2JvdHRvbSddO1xuXG4gICAgbGV0IFtvcmlnaW5ZLCBvcmlnaW5GYWxsYmFja1ldID0gW292ZXJsYXlZLCBvdmVybGF5RmFsbGJhY2tZXTtcbiAgICBsZXQgW292ZXJsYXlYLCBvdmVybGF5RmFsbGJhY2tYXSA9IFtvcmlnaW5YLCBvcmlnaW5GYWxsYmFja1hdO1xuICAgIGxldCBvZmZzZXRZID0gMDtcblxuICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAvLyBXaGVuIHRoZSBtZW51IGlzIGEgc3ViLW1lbnUsIGl0IHNob3VsZCBhbHdheXMgYWxpZ24gaXRzZWxmXG4gICAgICAvLyB0byB0aGUgZWRnZXMgb2YgdGhlIHRyaWdnZXIsIGluc3RlYWQgb2Ygb3ZlcmxhcHBpbmcgaXQuXG4gICAgICBvdmVybGF5RmFsbGJhY2tYID0gb3JpZ2luWCA9IG1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/ICdzdGFydCcgOiAnZW5kJztcbiAgICAgIG9yaWdpbkZhbGxiYWNrWCA9IG92ZXJsYXlYID0gb3JpZ2luWCA9PT0gJ2VuZCcgPyAnc3RhcnQnIDogJ2VuZCc7XG5cbiAgICAgIGlmICh0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudElubmVyUGFkZGluZyA9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51Lml0ZW1zLmZpcnN0O1xuICAgICAgICAgIHRoaXMuX3BhcmVudElubmVyUGFkZGluZyA9IGZpcnN0SXRlbSA/IGZpcnN0SXRlbS5fZ2V0SG9zdEVsZW1lbnQoKS5vZmZzZXRUb3AgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgb2Zmc2V0WSA9IG92ZXJsYXlZID09PSAnYm90dG9tJyA/IHRoaXMuX3BhcmVudElubmVyUGFkZGluZyA6IC10aGlzLl9wYXJlbnRJbm5lclBhZGRpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghbWVudS5vdmVybGFwVHJpZ2dlcikge1xuICAgICAgb3JpZ2luWSA9IG92ZXJsYXlZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgICBvcmlnaW5GYWxsYmFja1kgPSBvdmVybGF5RmFsbGJhY2tZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtvcmlnaW5YLCBvcmlnaW5ZLCBvdmVybGF5WCwgb3ZlcmxheVksIG9mZnNldFl9LFxuICAgICAge29yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsIG92ZXJsYXlZLCBvZmZzZXRZfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWCxcbiAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICBvdmVybGF5WCxcbiAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgIG9mZnNldFk6IC1vZmZzZXRZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLFxuICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgb2Zmc2V0WTogLW9mZnNldFksXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciBhbiBhY3Rpb24gdGhhdCBzaG91bGQgY2xvc2UgdGhlIG1lbnUgb2NjdXJzLiAqL1xuICBwcml2YXRlIF9tZW51Q2xvc2luZ0FjdGlvbnMoKSB7XG4gICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLl9vdmVybGF5UmVmIS5iYWNrZHJvcENsaWNrKCk7XG4gICAgY29uc3QgZGV0YWNobWVudHMgPSB0aGlzLl9vdmVybGF5UmVmIS5kZXRhY2htZW50cygpO1xuICAgIGNvbnN0IHBhcmVudENsb3NlID0gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51ID8gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51LmNsb3NlZCA6IG9ic2VydmFibGVPZigpO1xuICAgIGNvbnN0IGhvdmVyID0gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51XG4gICAgICA/IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudS5faG92ZXJlZCgpLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGFjdGl2ZSA9PiBhY3RpdmUgIT09IHRoaXMuX21lbnVJdGVtSW5zdGFuY2UpLFxuICAgICAgICAgIGZpbHRlcigoKSA9PiB0aGlzLl9tZW51T3BlbiksXG4gICAgICAgIClcbiAgICAgIDogb2JzZXJ2YWJsZU9mKCk7XG5cbiAgICByZXR1cm4gbWVyZ2UoYmFja2Ryb3AsIHBhcmVudENsb3NlIGFzIE9ic2VydmFibGU8TWVudUNsb3NlUmVhc29uPiwgaG92ZXIsIGRldGFjaG1lbnRzKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlIHByZXNzZXMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTaW5jZSByaWdodCBvciBtaWRkbGUgYnV0dG9uIGNsaWNrcyB3b24ndCB0cmlnZ2VyIHRoZSBgY2xpY2tgIGV2ZW50LFxuICAgICAgLy8gd2Ugc2hvdWxkbid0IGNvbnNpZGVyIHRoZSBtZW51IGFzIG9wZW5lZCBieSBtb3VzZSBpbiB0aG9zZSBjYXNlcy5cbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gZXZlbnQuYnV0dG9uID09PSAwID8gJ21vdXNlJyA6IHVuZGVmaW5lZDtcblxuICAgICAgLy8gU2luY2UgY2xpY2tpbmcgb24gdGhlIHRyaWdnZXIgd29uJ3QgY2xvc2UgdGhlIG1lbnUgaWYgaXQgb3BlbnMgYSBzdWItbWVudSxcbiAgICAgIC8vIHdlIHNob3VsZCBwcmV2ZW50IGZvY3VzIGZyb20gbW92aW5nIG9udG8gaXQgdmlhIGNsaWNrIHRvIGF2b2lkIHRoZVxuICAgICAgLy8gaGlnaGxpZ2h0IGZyb20gbGluZ2VyaW5nIG9uIHRoZSBtZW51IGl0ZW0uXG4gICAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleSBwcmVzc2VzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgLy8gUHJlc3NpbmcgZW50ZXIgb24gdGhlIHRyaWdnZXIgd2lsbCB0cmlnZ2VyIHRoZSBjbGljayBoYW5kbGVyIGxhdGVyLlxuICAgIGlmIChrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRSkge1xuICAgICAgdGhpcy5fb3BlbmVkQnkgPSAna2V5Ym9hcmQnO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMudHJpZ2dlcnNTdWJtZW51KCkgJiZcbiAgICAgICgoa2V5Q29kZSA9PT0gUklHSFRfQVJST1cgJiYgdGhpcy5kaXIgPT09ICdsdHInKSB8fFxuICAgICAgICAoa2V5Q29kZSA9PT0gTEVGVF9BUlJPVyAmJiB0aGlzLmRpciA9PT0gJ3J0bCcpKVxuICAgICkge1xuICAgICAgdGhpcy5fb3BlbmVkQnkgPSAna2V5Ym9hcmQnO1xuICAgICAgdGhpcy5vcGVuTWVudSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgIC8vIFN0b3AgZXZlbnQgcHJvcGFnYXRpb24gdG8gYXZvaWQgY2xvc2luZyB0aGUgcGFyZW50IG1lbnUuXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VyIGhvdmVycyBvdmVyIHRoZSB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9oYW5kbGVIb3ZlcigpIHtcbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgaG92ZXJlZCBpdGVtIGluIG9yZGVyIHRvIHRvZ2dsZSB0aGUgcGFuZWwuXG4gICAgaWYgKCF0aGlzLnRyaWdnZXJzU3VibWVudSgpIHx8ICF0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlclN1YnNjcmlwdGlvbiA9IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudVxuICAgICAgLl9ob3ZlcmVkKClcbiAgICAgIC8vIFNpbmNlIHdlIG1pZ2h0IGhhdmUgbXVsdGlwbGUgY29tcGV0aW5nIHRyaWdnZXJzIGZvciB0aGUgc2FtZSBtZW51IChlLmcuIGEgc3ViLW1lbnVcbiAgICAgIC8vIHdpdGggZGlmZmVyZW50IGRhdGEgYW5kIHRyaWdnZXJzKSwgd2UgaGF2ZSB0byBkZWxheSBpdCBieSBhIHRpY2sgdG8gZW5zdXJlIHRoYXRcbiAgICAgIC8vIGl0IHdvbid0IGJlIGNsb3NlZCBpbW1lZGlhdGVseSBhZnRlciBpdCBpcyBvcGVuZWQuXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGFjdGl2ZSA9PiBhY3RpdmUgPT09IHRoaXMuX21lbnVJdGVtSW5zdGFuY2UgJiYgIWFjdGl2ZS5kaXNhYmxlZCksXG4gICAgICAgIGRlbGF5KDAsIGFzYXBTY2hlZHVsZXIpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ21vdXNlJztcblxuICAgICAgICAvLyBJZiB0aGUgc2FtZSBtZW51IGlzIHVzZWQgYmV0d2VlbiBtdWx0aXBsZSB0cmlnZ2VycywgaXQgbWlnaHQgc3RpbGwgYmUgYW5pbWF0aW5nXG4gICAgICAgIC8vIHdoaWxlIHRoZSBuZXcgdHJpZ2dlciB0cmllcyB0byByZS1vcGVuIGl0LiBXYWl0IGZvciB0aGUgYW5pbWF0aW9uIHRvIGZpbmlzaFxuICAgICAgICAvLyBiZWZvcmUgZG9pbmcgc28uIEFsc28gaW50ZXJydXB0IGlmIHRoZSB1c2VyIG1vdmVzIHRvIGFub3RoZXIgaXRlbS5cbiAgICAgICAgaWYgKHRoaXMubWVudSBpbnN0YW5jZW9mIE1hdE1lbnUgJiYgdGhpcy5tZW51Ll9pc0FuaW1hdGluZykge1xuICAgICAgICAgIC8vIFdlIG5lZWQgdGhlIGBkZWxheSgwKWAgaGVyZSBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgICAgIC8vICdjaGFuZ2VkIGFmdGVyIGNoZWNrZWQnIGVycm9ycyBpbiBzb21lIGNhc2VzLiBTZWUgIzEyMTk0LlxuICAgICAgICAgIHRoaXMubWVudS5fYW5pbWF0aW9uRG9uZVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSwgZGVsYXkoMCwgYXNhcFNjaGVkdWxlciksIHRha2VVbnRpbCh0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUhLl9ob3ZlcmVkKCkpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9wZW5NZW51KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9ydGFsIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9nZXRQb3J0YWwobWVudTogTWF0TWVudVBhbmVsKTogVGVtcGxhdGVQb3J0YWwge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBjaGVjayBieSBrZWVwaW5nIHRoZSBwb3J0YWwgb24gdGhlIG1lbnUgcGFuZWwuXG4gICAgLy8gV2hpbGUgaXQgd291bGQgYmUgY2xlYW5lciwgd2UnZCBoYXZlIHRvIGludHJvZHVjZSBhbm90aGVyIHJlcXVpcmVkIG1ldGhvZCBvblxuICAgIC8vIGBNYXRNZW51UGFuZWxgLCBtYWtpbmcgaXQgaGFyZGVyIHRvIGNvbnN1bWUuXG4gICAgaWYgKCF0aGlzLl9wb3J0YWwgfHwgdGhpcy5fcG9ydGFsLnRlbXBsYXRlUmVmICE9PSBtZW51LnRlbXBsYXRlUmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwobWVudS50ZW1wbGF0ZVJlZiwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbDtcbiAgfVxufVxuIl19