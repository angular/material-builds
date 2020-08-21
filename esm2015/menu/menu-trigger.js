/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
import { throwMatMenuMissingError, throwMatMenuRecursiveError } from './menu-errors';
import { MatMenuItem } from './menu-item';
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
/** Default top padding of the menu panel. */
export const MENU_PANEL_TOP_PADDING = 8;
/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });
// TODO(andrewseguin): Remove the kebab versions in favor of camelCased attribute selectors
/** Directive applied to an element that should trigger a `mat-menu`. */
export class MatMenuTrigger {
    constructor(_overlay, _element, _viewContainerRef, scrollStrategy, 
    // `MatMenu` is always used in combination with a `MatMenuTrigger`.
    // tslint:disable-next-line: lightweight-tokens
    _parentMenu, 
    // `MatMenuTrigger` is commonly used in combination with a `MatMenuItem`.
    // tslint:disable-next-line: lightweight-tokens
    _menuItemInstance, _dir, 
    // TODO(crisbeto): make the _focusMonitor required when doing breaking changes.
    // @breaking-change 8.0.0
    _focusMonitor) {
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
        this._handleTouchStart = () => this._openedBy = 'touch';
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
    /**
     * @deprecated
     * @breaking-change 8.0.0
     */
    get _deprecatedMatMenuTriggerFor() { return this.menu; }
    set _deprecatedMatMenuTriggerFor(v) {
        this.menu = v;
    }
    /** References the menu instance that the trigger is associated with. */
    get menu() { return this._menu; }
    set menu(menu) {
        if (menu === this._menu) {
            return;
        }
        this._menu = menu;
        this._menuCloseSubscription.unsubscribe();
        if (menu) {
            if (menu === this._parentMenu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throwMatMenuRecursiveError();
            }
            this._menuCloseSubscription = menu.close.subscribe((reason) => {
                this._destroyMenu();
                // If a click closed the menu, we should close the entire chain of nested menus.
                if ((reason === 'click' || reason === 'tab') && this._parentMenu) {
                    this._parentMenu.closed.emit(reason);
                }
            });
        }
    }
    ngAfterContentInit() {
        this._checkMenu();
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
        return !!(this._menuItemInstance && this._parentMenu);
    }
    /** Toggles the menu between the open and closed states. */
    toggleMenu() {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    }
    /** Opens the menu. */
    openMenu() {
        if (this._menuOpen) {
            return;
        }
        this._checkMenu();
        const overlayRef = this._createOverlay();
        const overlayConfig = overlayRef.getConfig();
        this._setPosition(overlayConfig.positionStrategy);
        overlayConfig.hasBackdrop = this.menu.hasBackdrop == null ? !this.triggersSubmenu() :
            this.menu.hasBackdrop;
        overlayRef.attach(this._getPortal());
        if (this.menu.lazyContent) {
            this.menu.lazyContent.attach(this.menuData);
        }
        this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
        this._initMenu();
        if (this.menu instanceof MatMenu) {
            this.menu._startAnimation();
        }
    }
    /** Closes the menu. */
    closeMenu() {
        this.menu.close.emit();
    }
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    focus(origin = 'program', options) {
        if (this._focusMonitor) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        else {
            this._element.nativeElement.focus(options);
        }
    }
    /** Closes the menu and does the necessary cleanup. */
    _destroyMenu() {
        if (!this._overlayRef || !this.menuOpen) {
            return;
        }
        const menu = this.menu;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();
        this._restoreFocus();
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
                    complete: () => this._setIsMenuOpen(false)
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
    }
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    _initMenu() {
        this.menu.parentMenu = this.triggersSubmenu() ? this._parentMenu : undefined;
        this.menu.direction = this.dir;
        this._setMenuElevation();
        this._setIsMenuOpen(true);
        this.menu.focusFirstItem(this._openedBy || 'program');
    }
    /** Updates the menu elevation based on the amount of parent menus that it has. */
    _setMenuElevation() {
        if (this.menu.setElevation) {
            let depth = 0;
            let parentMenu = this.menu.parentMenu;
            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }
            this.menu.setElevation(depth);
        }
    }
    /** Restores focus to the element that was focused before the menu was open. */
    _restoreFocus() {
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
    }
    // set state rather than toggle to support triggers sharing a menu
    _setIsMenuOpen(isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
        if (this.triggersSubmenu()) {
            this._menuItemInstance._highlighted = isOpen;
        }
    }
    /**
     * This method checks that a valid instance of MatMenu has been passed into
     * matMenuTriggerFor. If not, an exception is thrown.
     */
    _checkMenu() {
        if (!this.menu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuMissingError();
        }
    }
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    _createOverlay() {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
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
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._element)
                .withLockedPosition()
                .withTransformOriginOn('.mat-menu-panel, .mat-mdc-menu-panel'),
            backdropClass: this.menu.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: this.menu.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir
        });
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(position) {
        if (this.menu.setPositionClasses) {
            position.positionChanges.subscribe(change => {
                const posX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
                const posY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';
                this.menu.setPositionClasses(posX, posY);
            });
        }
    }
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    _setPosition(positionStrategy) {
        let [originX, originFallbackX] = this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];
        let [overlayY, overlayFallbackY] = this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];
        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;
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
            { originX, originY, overlayX, overlayY, offsetY },
            { originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
            {
                originX,
                originY: originFallbackY,
                overlayX,
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
    }
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    _menuClosingActions() {
        const backdrop = this._overlayRef.backdropClick();
        const detachments = this._overlayRef.detachments();
        const parentClose = this._parentMenu ? this._parentMenu.closed : observableOf();
        const hover = this._parentMenu ? this._parentMenu._hovered().pipe(filter(active => active !== this._menuItemInstance), filter(() => this._menuOpen)) : observableOf();
        return merge(backdrop, parentClose, hover, detachments);
    }
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event) {
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
    }
    /** Handles key presses on the trigger. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        if (this.triggersSubmenu() && ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
            (keyCode === LEFT_ARROW && this.dir === 'rtl'))) {
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
        if (!this.triggersSubmenu()) {
            return;
        }
        this._hoverSubscription = this._parentMenu._hovered()
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
                    .pipe(take(1), delay(0, asapScheduler), takeUntil(this._parentMenu._hovered()))
                    .subscribe(() => this.openMenu());
            }
            else {
                this.openMenu();
            }
        });
    }
    /** Gets the portal that should be attached to the overlay. */
    _getPortal() {
        // Note that we can avoid this check by keeping the portal on the menu panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MatMenuPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== this.menu.templateRef) {
            this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
        }
        return this._portal;
    }
}
MatMenuTrigger.decorators = [
    { type: Directive, args: [{
                selector: `[mat-menu-trigger-for], [matMenuTriggerFor]`,
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
MatMenuTrigger.ctorParameters = () => [
    { type: Overlay },
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_SCROLL_STRATEGY,] }] },
    { type: MatMenu, decorators: [{ type: Optional }] },
    { type: MatMenuItem, decorators: [{ type: Optional }, { type: Self }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: FocusMonitor }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWUsK0JBQStCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RCxPQUFPLEVBR0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBQ0osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQywrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVFLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQy9CLE9BQU8sRUFBQyx3QkFBd0IsRUFBRSwwQkFBMEIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBSXhDLGtGQUFrRjtBQUNsRixNQUFNLENB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QUdsQyxNQUFNO3lCQVFOLE1BQU07eUJBR04sTUFBTTswQkFRTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbiwgaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0xFRlRfQVJST1csIFJJR0hUX0FSUk9XfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyxcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgVmVydGljYWxDb25uZWN0aW9uUG9zLFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2VsZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge25vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2FzYXBTY2hlZHVsZXIsIG1lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRNZW51fSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHt0aHJvd01hdE1lbnVNaXNzaW5nRXJyb3IsIHRocm93TWF0TWVudVJlY3Vyc2l2ZUVycm9yfSBmcm9tICcuL21lbnUtZXJyb3JzJztcbmltcG9ydCB7TWF0TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7TWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgbWVudSBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LW1lbnUtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBEZWZhdWx0IHRvcCBwYWRkaW5nIG9mIHRoZSBtZW51IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IE1FTlVfUEFORUxfVE9QX1BBRERJTkcgPSA4O1xuXG4vKiogT3B0aW9ucyBmb3IgYmluZGluZyBhIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXIuICovXG5jb25zdCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSk7XG5cbi8vIFRPRE8oYW5kcmV3c2VndWluKTogUmVtb3ZlIHRoZSBrZWJhYiB2ZXJzaW9ucyBpbiBmYXZvciBvZiBjYW1lbENhc2VkIGF0dHJpYnV0ZSBzZWxlY3RvcnNcblxuLyoqIERpcmVjdGl2ZSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgdHJpZ2dlciBhIGBtYXQtbWVudWAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBbbWF0LW1lbnUtdHJpZ2dlci1mb3JdLCBbbWF0TWVudVRyaWdnZXJGb3JdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWVudS10cmlnZ2VyJyxcbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnbWVudU9wZW4gfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ21lbnVPcGVuID8gbWVudS5wYW5lbElkIDogbnVsbCcsXG4gICAgJyhtb3VzZWRvd24pJzogJ19oYW5kbGVNb3VzZWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0TWVudVRyaWdnZXInXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVUcmlnZ2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9tZW51T3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfaG92ZXJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX21lbnVDbG9zZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRvdWNoIHN0YXJ0IGV2ZW50cyBvbiB0aGUgdHJpZ2dlci5cbiAgICogTmVlZHMgdG8gYmUgYW4gYXJyb3cgZnVuY3Rpb24gc28gd2UgY2FuIGVhc2lseSB1c2UgYWRkRXZlbnRMaXN0ZW5lciBhbmQgcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICovXG4gIHByaXZhdGUgX2hhbmRsZVRvdWNoU3RhcnQgPSAoKSA9PiB0aGlzLl9vcGVuZWRCeSA9ICd0b3VjaCc7XG5cbiAgLy8gVHJhY2tpbmcgaW5wdXQgdHlwZSBpcyBuZWNlc3Nhcnkgc28gaXQncyBwb3NzaWJsZSB0byBvbmx5IGF1dG8tZm9jdXNcbiAgLy8gdGhlIGZpcnN0IGl0ZW0gb2YgdGhlIGxpc3Qgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZFxuICBfb3BlbmVkQnk6ICdtb3VzZScgfCAndG91Y2gnIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgnbWF0LW1lbnUtdHJpZ2dlci1mb3InKVxuICBnZXQgX2RlcHJlY2F0ZWRNYXRNZW51VHJpZ2dlckZvcigpOiBNYXRNZW51UGFuZWwgeyByZXR1cm4gdGhpcy5tZW51OyB9XG4gIHNldCBfZGVwcmVjYXRlZE1hdE1lbnVUcmlnZ2VyRm9yKHY6IE1hdE1lbnVQYW5lbCkge1xuICAgIHRoaXMubWVudSA9IHY7XG4gIH1cblxuICAvKiogUmVmZXJlbmNlcyB0aGUgbWVudSBpbnN0YW5jZSB0aGF0IHRoZSB0cmlnZ2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KCdtYXRNZW51VHJpZ2dlckZvcicpXG4gIGdldCBtZW51KCkgeyByZXR1cm4gdGhpcy5fbWVudTsgfVxuICBzZXQgbWVudShtZW51OiBNYXRNZW51UGFuZWwpIHtcbiAgICBpZiAobWVudSA9PT0gdGhpcy5fbWVudSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21lbnUgPSBtZW51O1xuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKG1lbnUpIHtcbiAgICAgIGlmIChtZW51ID09PSB0aGlzLl9wYXJlbnRNZW51ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93TWF0TWVudVJlY3Vyc2l2ZUVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbiA9IG1lbnUuY2xvc2Uuc3Vic2NyaWJlKFxuICAgICAgICAocmVhc29uOiAnY2xpY2snIHwgJ3RhYicgfCAna2V5ZG93bicgfCB1bmRlZmluZWQpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZXN0cm95TWVudSgpO1xuXG4gICAgICAgICAgLy8gSWYgYSBjbGljayBjbG9zZWQgdGhlIG1lbnUsIHdlIHNob3VsZCBjbG9zZSB0aGUgZW50aXJlIGNoYWluIG9mIG5lc3RlZCBtZW51cy5cbiAgICAgICAgICBpZiAoKHJlYXNvbiA9PT0gJ2NsaWNrJyB8fCByZWFzb24gPT09ICd0YWInKSAmJiB0aGlzLl9wYXJlbnRNZW51KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnRNZW51LmNsb3NlZC5lbWl0KHJlYXNvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWVudTogTWF0TWVudVBhbmVsO1xuXG4gIC8qKiBEYXRhIHRvIGJlIHBhc3NlZCBhbG9uZyB0byBhbnkgbGF6aWx5LXJlbmRlcmVkIGNvbnRlbnQuICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJEYXRhJykgbWVudURhdGE6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBmb2N1cyBzaG91bGQgYmUgcmVzdG9yZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBkaXNhYmxpbmcgdGhpcyBvcHRpb24gY2FuIGhhdmUgYWNjZXNzaWJpbGl0eSBpbXBsaWNhdGlvbnNcbiAgICogYW5kIGl0J3MgdXAgdG8geW91IHRvIG1hbmFnZSBmb2N1cywgaWYgeW91IGRlY2lkZSB0byB0dXJuIGl0IG9mZi5cbiAgICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJSZXN0b3JlRm9jdXMnKSByZXN0b3JlRm9jdXM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtZW51T3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIG9wZW5lZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBtZW51T3BlbmVkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvbk1lbnVPcGVuOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVPcGVuZWQ7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1lbnVDbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYG1lbnVDbG9zZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9uTWVudUNsb3NlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVDbG9zZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX01FTlVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgICAgICAgICAgICAvLyBgTWF0TWVudWAgaXMgYWx3YXlzIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBhIGBNYXRNZW51VHJpZ2dlcmAuXG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbGlnaHR3ZWlnaHQtdG9rZW5zXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX3BhcmVudE1lbnU6IE1hdE1lbnUsXG4gICAgICAgICAgICAgIC8vIGBNYXRNZW51VHJpZ2dlcmAgaXMgY29tbW9ubHkgdXNlZCBpbiBjb21iaW5hdGlvbiB3aXRoIGEgYE1hdE1lbnVJdGVtYC5cbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwcml2YXRlIF9tZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IG1ha2UgdGhlIF9mb2N1c01vbml0b3IgcmVxdWlyZWQgd2hlbiBkb2luZyBicmVha2luZyBjaGFuZ2VzLlxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcikge1xuXG4gICAgX2VsZW1lbnQubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2hTdGFydCxcbiAgICAgICAgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKTtcblxuICAgIGlmIChfbWVudUl0ZW1JbnN0YW5jZSkge1xuICAgICAgX21lbnVJdGVtSW5zdGFuY2UuX3RyaWdnZXJzU3VibWVudSA9IHRoaXMudHJpZ2dlcnNTdWJtZW51KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja01lbnUoKTtcbiAgICB0aGlzLl9oYW5kbGVIb3ZlcigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0LFxuICAgICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbWVudUNsb3NlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9ob3ZlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbiAgZ2V0IG1lbnVPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbjtcbiAgfVxuXG4gIC8qKiBUaGUgdGV4dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBnZXQgZGlyKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IHRyaWdnZXJzIGEgc3ViLW1lbnUgb3IgYSB0b3AtbGV2ZWwgb25lLiAqL1xuICB0cmlnZ2Vyc1N1Ym1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHRoaXMuX21lbnVJdGVtSW5zdGFuY2UgJiYgdGhpcy5fcGFyZW50TWVudSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgbWVudSBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbiA/IHRoaXMuY2xvc2VNZW51KCkgOiB0aGlzLm9wZW5NZW51KCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIG9wZW5NZW51KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tZW51T3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrTWVudSgpO1xuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKTtcblxuICAgIHRoaXMuX3NldFBvc2l0aW9uKG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPSB0aGlzLm1lbnUuaGFzQmFja2Ryb3AgPT0gbnVsbCA/ICF0aGlzLnRyaWdnZXJzU3VibWVudSgpIDpcbiAgICAgICAgdGhpcy5tZW51Lmhhc0JhY2tkcm9wO1xuICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX2dldFBvcnRhbCgpKTtcblxuICAgIGlmICh0aGlzLm1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgIHRoaXMubWVudS5sYXp5Q29udGVudC5hdHRhY2godGhpcy5tZW51RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSB0aGlzLl9tZW51Q2xvc2luZ0FjdGlvbnMoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZU1lbnUoKSk7XG4gICAgdGhpcy5faW5pdE1lbnUoKTtcblxuICAgIGlmICh0aGlzLm1lbnUgaW5zdGFuY2VvZiBNYXRNZW51KSB7XG4gICAgICB0aGlzLm1lbnUuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgbWVudS4gKi9cbiAgY2xvc2VNZW51KCk6IHZvaWQge1xuICAgIHRoaXMubWVudS5jbG9zZS5lbWl0KCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgbWVudSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0gb3JpZ2luIFNvdXJjZSBvZiB0aGUgbWVudSB0cmlnZ2VyJ3MgZm9jdXMuXG4gICAqL1xuICBmb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvcikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBtZW51IGFuZCBkb2VzIHRoZSBuZWNlc3NhcnkgY2xlYW51cC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveU1lbnUoKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmIHx8ICF0aGlzLm1lbnVPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWVudSA9IHRoaXMubWVudTtcbiAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG5cbiAgICBpZiAobWVudSBpbnN0YW5jZW9mIE1hdE1lbnUpIHtcbiAgICAgIG1lbnUuX3Jlc2V0QW5pbWF0aW9uKCk7XG5cbiAgICAgIGlmIChtZW51LmxhenlDb250ZW50KSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIHRoZSBleGl0IGFuaW1hdGlvbiB0byBmaW5pc2ggYmVmb3JlIGRldGFjaGluZyB0aGUgY29udGVudC5cbiAgICAgICAgbWVudS5fYW5pbWF0aW9uRG9uZVxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnRvU3RhdGUgPT09ICd2b2lkJyksXG4gICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgLy8gSW50ZXJydXB0IGlmIHRoZSBjb250ZW50IGdvdCByZS1hdHRhY2hlZC5cbiAgICAgICAgICAgIHRha2VVbnRpbChtZW51LmxhenlDb250ZW50Ll9hdHRhY2hlZClcbiAgICAgICAgICApXG4gICAgICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiAoKSA9PiBtZW51LmxhenlDb250ZW50IS5kZXRhY2goKSxcbiAgICAgICAgICAgIC8vIE5vIG1hdHRlciB3aGV0aGVyIHRoZSBjb250ZW50IGdvdCByZS1hdHRhY2hlZCwgcmVzZXQgdGhlIG1lbnUuXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSlcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldElzTWVudU9wZW4oZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRJc01lbnVPcGVuKGZhbHNlKTtcblxuICAgICAgaWYgKG1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgICAgbWVudS5sYXp5Q29udGVudC5kZXRhY2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2V0cyB0aGUgbWVudSBzdGF0ZSB0byBvcGVuIGFuZCBmb2N1c2VzIHRoZSBmaXJzdCBpdGVtIGlmXG4gICAqIHRoZSBtZW51IHdhcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZC5cbiAgICovXG4gIHByaXZhdGUgX2luaXRNZW51KCk6IHZvaWQge1xuICAgIHRoaXMubWVudS5wYXJlbnRNZW51ID0gdGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSA/IHRoaXMuX3BhcmVudE1lbnUgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5tZW51LmRpcmVjdGlvbiA9IHRoaXMuZGlyO1xuICAgIHRoaXMuX3NldE1lbnVFbGV2YXRpb24oKTtcbiAgICB0aGlzLl9zZXRJc01lbnVPcGVuKHRydWUpO1xuICAgIHRoaXMubWVudS5mb2N1c0ZpcnN0SXRlbSh0aGlzLl9vcGVuZWRCeSB8fCAncHJvZ3JhbScpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIG1lbnUgZWxldmF0aW9uIGJhc2VkIG9uIHRoZSBhbW91bnQgb2YgcGFyZW50IG1lbnVzIHRoYXQgaXQgaGFzLiAqL1xuICBwcml2YXRlIF9zZXRNZW51RWxldmF0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1lbnUuc2V0RWxldmF0aW9uKSB7XG4gICAgICBsZXQgZGVwdGggPSAwO1xuICAgICAgbGV0IHBhcmVudE1lbnUgPSB0aGlzLm1lbnUucGFyZW50TWVudTtcblxuICAgICAgd2hpbGUgKHBhcmVudE1lbnUpIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgICAgcGFyZW50TWVudSA9IHBhcmVudE1lbnUucGFyZW50TWVudTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tZW51LnNldEVsZXZhdGlvbihkZXB0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBtZW51IHdhcyBvcGVuLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgLy8gV2Ugc2hvdWxkIHJlc2V0IGZvY3VzIGlmIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcgdXNpbmcgYSBrZXlib2FyZCBvclxuICAgIC8vIGlmIHdlIGhhdmUgYSB0b3AtbGV2ZWwgdHJpZ2dlciB3aGljaCBtaWdodCBjYXVzZSBmb2N1cyB0byBiZSBsb3N0XG4gICAgLy8gd2hlbiBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AuXG4gICAgaWYgKHRoaXMucmVzdG9yZUZvY3VzKSB7XG4gICAgICBpZiAoIXRoaXMuX29wZW5lZEJ5KSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgc3R5bGUgd2lsbCBzaG93IHVwIGJvdGggZm9yIGBwcm9ncmFtYCBhbmRcbiAgICAgICAgLy8gYGtleWJvYXJkYCBzbyB3ZSBkb24ndCBoYXZlIHRvIHNwZWNpZnkgd2hpY2ggb25lIGl0IGlzLlxuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAgIHRoaXMuZm9jdXModGhpcy5fb3BlbmVkQnkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZEJ5ID0gbnVsbDtcbiAgfVxuXG4gIC8vIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgbWVudVxuICBwcml2YXRlIF9zZXRJc01lbnVPcGVuKGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX21lbnVPcGVuID0gaXNPcGVuO1xuICAgIHRoaXMuX21lbnVPcGVuID8gdGhpcy5tZW51T3BlbmVkLmVtaXQoKSA6IHRoaXMubWVudUNsb3NlZC5lbWl0KCk7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgdGhpcy5fbWVudUl0ZW1JbnN0YW5jZS5faGlnaGxpZ2h0ZWQgPSBpc09wZW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyB0aGF0IGEgdmFsaWQgaW5zdGFuY2Ugb2YgTWF0TWVudSBoYXMgYmVlbiBwYXNzZWQgaW50b1xuICAgKiBtYXRNZW51VHJpZ2dlckZvci4gSWYgbm90LCBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tNZW51KCkge1xuICAgIGlmICghdGhpcy5tZW51ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVNaXNzaW5nRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyB0aGUgb3ZlcmxheSBmcm9tIHRoZSBwcm92aWRlZCBtZW51J3MgdGVtcGxhdGUgYW5kIHNhdmVzIGl0c1xuICAgKiBPdmVybGF5UmVmIHNvIHRoYXQgaXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00gd2hlbiBvcGVuTWVudSBpcyBjYWxsZWQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0T3ZlcmxheUNvbmZpZygpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9Qb3NpdGlvbnMoY29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZShjb25maWcpO1xuXG4gICAgICAvLyBDb25zdW1lIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gcHJldmVudCB0aGVtIGZyb20gZ29pbmcgdG8gYW5vdGhlciBvdmVybGF5LlxuICAgICAgLy8gSWRlYWxseSB3ZSdkIGFsc28gaGF2ZSBvdXIga2V5Ym9hcmQgZXZlbnQgbG9naWMgaW4gaGVyZSwgaG93ZXZlciBkb2luZyBzbyB3aWxsXG4gICAgICAvLyBicmVhayBhbnlib2R5IHRoYXQgbWF5IGhhdmUgaW1wbGVtZW50ZWQgdGhlIGBNYXRNZW51UGFuZWxgIHRoZW1zZWx2ZXMuXG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBidWlsZHMgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG5lZWRlZCB0byBjcmVhdGUgdGhlIG92ZXJsYXksIHRoZSBPdmVybGF5U3RhdGUuXG4gICAqIEByZXR1cm5zIE92ZXJsYXlDb25maWdcbiAgICovXG4gIHByaXZhdGUgX2dldE92ZXJsYXlDb25maWcoKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgcmV0dXJuIG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgICAgLndpdGhMb2NrZWRQb3NpdGlvbigpXG4gICAgICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1tZW51LXBhbmVsLCAubWF0LW1kYy1tZW51LXBhbmVsJyksXG4gICAgICBiYWNrZHJvcENsYXNzOiB0aGlzLm1lbnUuYmFja2Ryb3BDbGFzcyB8fCAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICAgICAgcGFuZWxDbGFzczogdGhpcy5tZW51Lm92ZXJsYXlQYW5lbENsYXNzLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpclxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiB0aGUgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Nlc1xuICAgKiBvbiB0aGUgbWVudSBiYXNlZCBvbiB0aGUgbmV3IHBvc2l0aW9uLiBUaGlzIGVuc3VyZXMgdGhlIGFuaW1hdGlvbiBvcmlnaW4gaXMgYWx3YXlzXG4gICAqIGNvcnJlY3QsIGV2ZW4gaWYgYSBmYWxsYmFjayBwb3NpdGlvbiBpcyB1c2VkIGZvciB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvUG9zaXRpb25zKHBvc2l0aW9uOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tZW51LnNldFBvc2l0aW9uQ2xhc3Nlcykge1xuICAgICAgcG9zaXRpb24ucG9zaXRpb25DaGFuZ2VzLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgICBjb25zdCBwb3NYOiBNZW51UG9zaXRpb25YID0gY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlYID09PSAnc3RhcnQnID8gJ2FmdGVyJyA6ICdiZWZvcmUnO1xuICAgICAgICBjb25zdCBwb3NZOiBNZW51UG9zaXRpb25ZID0gY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlZID09PSAndG9wJyA/ICdiZWxvdycgOiAnYWJvdmUnO1xuXG4gICAgICAgIHRoaXMubWVudS5zZXRQb3NpdGlvbkNsYXNzZXMhKHBvc1gsIHBvc1kpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFwcHJvcHJpYXRlIHBvc2l0aW9ucyBvbiBhIHBvc2l0aW9uIHN0cmF0ZWd5XG4gICAqIHNvIHRoZSBvdmVybGF5IGNvbm5lY3RzIHdpdGggdGhlIHRyaWdnZXIgY29ycmVjdGx5LlxuICAgKiBAcGFyYW0gcG9zaXRpb25TdHJhdGVneSBTdHJhdGVneSB3aG9zZSBwb3NpdGlvbiB0byB1cGRhdGUuXG4gICAqL1xuICBwcml2YXRlIF9zZXRQb3NpdGlvbihwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICBsZXQgW29yaWdpblgsIG9yaWdpbkZhbGxiYWNrWF06IEhvcml6b250YWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgICB0aGlzLm1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/IFsnZW5kJywgJ3N0YXJ0J10gOiBbJ3N0YXJ0JywgJ2VuZCddO1xuXG4gICAgbGV0IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV06IFZlcnRpY2FsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgICAgdGhpcy5tZW51LnlQb3NpdGlvbiA9PT0gJ2Fib3ZlJyA/IFsnYm90dG9tJywgJ3RvcCddIDogWyd0b3AnLCAnYm90dG9tJ107XG5cbiAgICBsZXQgW29yaWdpblksIG9yaWdpbkZhbGxiYWNrWV0gPSBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldO1xuICAgIGxldCBbb3ZlcmxheVgsIG92ZXJsYXlGYWxsYmFja1hdID0gW29yaWdpblgsIG9yaWdpbkZhbGxiYWNrWF07XG4gICAgbGV0IG9mZnNldFkgPSAwO1xuXG4gICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgIC8vIFdoZW4gdGhlIG1lbnUgaXMgYSBzdWItbWVudSwgaXQgc2hvdWxkIGFsd2F5cyBhbGlnbiBpdHNlbGZcbiAgICAgIC8vIHRvIHRoZSBlZGdlcyBvZiB0aGUgdHJpZ2dlciwgaW5zdGVhZCBvZiBvdmVybGFwcGluZyBpdC5cbiAgICAgIG92ZXJsYXlGYWxsYmFja1ggPSBvcmlnaW5YID0gdGhpcy5tZW51LnhQb3NpdGlvbiA9PT0gJ2JlZm9yZScgPyAnc3RhcnQnIDogJ2VuZCc7XG4gICAgICBvcmlnaW5GYWxsYmFja1ggPSBvdmVybGF5WCA9IG9yaWdpblggPT09ICdlbmQnID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgICAgb2Zmc2V0WSA9IG92ZXJsYXlZID09PSAnYm90dG9tJyA/IE1FTlVfUEFORUxfVE9QX1BBRERJTkcgOiAtTUVOVV9QQU5FTF9UT1BfUEFERElORztcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm1lbnUub3ZlcmxhcFRyaWdnZXIpIHtcbiAgICAgIG9yaWdpblkgPSBvdmVybGF5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgICAgb3JpZ2luRmFsbGJhY2tZID0gb3ZlcmxheUZhbGxiYWNrWSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIH1cblxuICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7b3JpZ2luWCwgb3JpZ2luWSwgb3ZlcmxheVgsIG92ZXJsYXlZLCBvZmZzZXRZfSxcbiAgICAgIHtvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsIG9yaWdpblksIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLCBvdmVybGF5WSwgb2Zmc2V0WX0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblgsXG4gICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgb3ZlcmxheVgsXG4gICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLFxuICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgb2Zmc2V0WTogLW9mZnNldFlcbiAgICAgIH1cbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgc3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgYW4gYWN0aW9uIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBtZW51IG9jY3Vycy4gKi9cbiAgcHJpdmF0ZSBfbWVudUNsb3NpbmdBY3Rpb25zKCkge1xuICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5fb3ZlcmxheVJlZiEuYmFja2Ryb3BDbGljaygpO1xuICAgIGNvbnN0IGRldGFjaG1lbnRzID0gdGhpcy5fb3ZlcmxheVJlZiEuZGV0YWNobWVudHMoKTtcbiAgICBjb25zdCBwYXJlbnRDbG9zZSA9IHRoaXMuX3BhcmVudE1lbnUgPyB0aGlzLl9wYXJlbnRNZW51LmNsb3NlZCA6IG9ic2VydmFibGVPZigpO1xuICAgIGNvbnN0IGhvdmVyID0gdGhpcy5fcGFyZW50TWVudSA/IHRoaXMuX3BhcmVudE1lbnUuX2hvdmVyZWQoKS5waXBlKFxuICAgICAgZmlsdGVyKGFjdGl2ZSA9PiBhY3RpdmUgIT09IHRoaXMuX21lbnVJdGVtSW5zdGFuY2UpLFxuICAgICAgZmlsdGVyKCgpID0+IHRoaXMuX21lbnVPcGVuKVxuICAgICkgOiBvYnNlcnZhYmxlT2YoKTtcblxuICAgIHJldHVybiBtZXJnZShiYWNrZHJvcCwgcGFyZW50Q2xvc2UsIGhvdmVyLCBkZXRhY2htZW50cyk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb3VzZSBwcmVzc2VzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyKGV2ZW50KSkge1xuICAgICAgLy8gU2luY2UgcmlnaHQgb3IgbWlkZGxlIGJ1dHRvbiBjbGlja3Mgd29uJ3QgdHJpZ2dlciB0aGUgYGNsaWNrYCBldmVudCxcbiAgICAgIC8vIHdlIHNob3VsZG4ndCBjb25zaWRlciB0aGUgbWVudSBhcyBvcGVuZWQgYnkgbW91c2UgaW4gdGhvc2UgY2FzZXMuXG4gICAgICB0aGlzLl9vcGVuZWRCeSA9IGV2ZW50LmJ1dHRvbiA9PT0gMCA/ICdtb3VzZScgOiBudWxsO1xuXG4gICAgICAvLyBTaW5jZSBjbGlja2luZyBvbiB0aGUgdHJpZ2dlciB3b24ndCBjbG9zZSB0aGUgbWVudSBpZiBpdCBvcGVucyBhIHN1Yi1tZW51LFxuICAgICAgLy8gd2Ugc2hvdWxkIHByZXZlbnQgZm9jdXMgZnJvbSBtb3Zpbmcgb250byBpdCB2aWEgY2xpY2sgdG8gYXZvaWQgdGhlXG4gICAgICAvLyBoaWdobGlnaHQgZnJvbSBsaW5nZXJpbmcgb24gdGhlIG1lbnUgaXRlbS5cbiAgICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5IHByZXNzZXMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSAmJiAoXG4gICAgICAgICAgICAoa2V5Q29kZSA9PT0gUklHSFRfQVJST1cgJiYgdGhpcy5kaXIgPT09ICdsdHInKSB8fFxuICAgICAgICAgICAgKGtleUNvZGUgPT09IExFRlRfQVJST1cgJiYgdGhpcy5kaXIgPT09ICdydGwnKSkpIHtcbiAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAvLyBTdG9wIGV2ZW50IHByb3BhZ2F0aW9uIHRvIGF2b2lkIGNsb3NpbmcgdGhlIHBhcmVudCBtZW51LlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLm9wZW5NZW51KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHRoZSBjYXNlcyB3aGVyZSB0aGUgdXNlciBob3ZlcnMgb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlSG92ZXIoKSB7XG4gICAgLy8gU3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIGhvdmVyZWQgaXRlbSBpbiBvcmRlciB0byB0b2dnbGUgdGhlIHBhbmVsLlxuICAgIGlmICghdGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2hvdmVyU3Vic2NyaXB0aW9uID0gdGhpcy5fcGFyZW50TWVudS5faG92ZXJlZCgpXG4gICAgICAvLyBTaW5jZSB3ZSBtaWdodCBoYXZlIG11bHRpcGxlIGNvbXBldGluZyB0cmlnZ2VycyBmb3IgdGhlIHNhbWUgbWVudSAoZS5nLiBhIHN1Yi1tZW51XG4gICAgICAvLyB3aXRoIGRpZmZlcmVudCBkYXRhIGFuZCB0cmlnZ2VycyksIHdlIGhhdmUgdG8gZGVsYXkgaXQgYnkgYSB0aWNrIHRvIGVuc3VyZSB0aGF0XG4gICAgICAvLyBpdCB3b24ndCBiZSBjbG9zZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaXMgb3BlbmVkLlxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlID09PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmICFhY3RpdmUuZGlzYWJsZWQpLFxuICAgICAgICBkZWxheSgwLCBhc2FwU2NoZWR1bGVyKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ21vdXNlJztcblxuICAgICAgICAvLyBJZiB0aGUgc2FtZSBtZW51IGlzIHVzZWQgYmV0d2VlbiBtdWx0aXBsZSB0cmlnZ2VycywgaXQgbWlnaHQgc3RpbGwgYmUgYW5pbWF0aW5nXG4gICAgICAgIC8vIHdoaWxlIHRoZSBuZXcgdHJpZ2dlciB0cmllcyB0byByZS1vcGVuIGl0LiBXYWl0IGZvciB0aGUgYW5pbWF0aW9uIHRvIGZpbmlzaFxuICAgICAgICAvLyBiZWZvcmUgZG9pbmcgc28uIEFsc28gaW50ZXJydXB0IGlmIHRoZSB1c2VyIG1vdmVzIHRvIGFub3RoZXIgaXRlbS5cbiAgICAgICAgaWYgKHRoaXMubWVudSBpbnN0YW5jZW9mIE1hdE1lbnUgJiYgdGhpcy5tZW51Ll9pc0FuaW1hdGluZykge1xuICAgICAgICAgIC8vIFdlIG5lZWQgdGhlIGBkZWxheSgwKWAgaGVyZSBpbiBvcmRlciB0byBhdm9pZFxuICAgICAgICAgIC8vICdjaGFuZ2VkIGFmdGVyIGNoZWNrZWQnIGVycm9ycyBpbiBzb21lIGNhc2VzLiBTZWUgIzEyMTk0LlxuICAgICAgICAgIHRoaXMubWVudS5fYW5pbWF0aW9uRG9uZVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSwgZGVsYXkoMCwgYXNhcFNjaGVkdWxlciksIHRha2VVbnRpbCh0aGlzLl9wYXJlbnRNZW51Ll9ob3ZlcmVkKCkpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9wZW5NZW51KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9ydGFsIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9nZXRQb3J0YWwoKTogVGVtcGxhdGVQb3J0YWwge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBjaGVjayBieSBrZWVwaW5nIHRoZSBwb3J0YWwgb24gdGhlIG1lbnUgcGFuZWwuXG4gICAgLy8gV2hpbGUgaXQgd291bGQgYmUgY2xlYW5lciwgd2UnZCBoYXZlIHRvIGludHJvZHVjZSBhbm90aGVyIHJlcXVpcmVkIG1ldGhvZCBvblxuICAgIC8vIGBNYXRNZW51UGFuZWxgLCBtYWtpbmcgaXQgaGFyZGVyIHRvIGNvbnN1bWUuXG4gICAgaWYgKCF0aGlzLl9wb3J0YWwgfHwgdGhpcy5fcG9ydGFsLnRlbXBsYXRlUmVmICE9PSB0aGlzLm1lbnUudGVtcGxhdGVSZWYpIHtcbiAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLm1lbnUudGVtcGxhdGVSZWYsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wb3J0YWw7XG4gIH1cblxufVxuIl19