/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, Optional, Output, Self, ViewContainerRef, } from '@angular/core';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { _MatMenuBase } from './menu';
import { throwMatMenuMissingError, throwMatMenuRecursiveError } from './menu-errors';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
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
    constructor(_overlay, _element, _viewContainerRef, scrollStrategy, parentMenu, 
    // `MatMenuTrigger` is commonly used in combination with a `MatMenuItem`.
    // tslint:disable-next-line: lightweight-tokens
    _menuItemInstance, _dir, 
    // TODO(crisbeto): make the _focusMonitor required when doing breaking changes.
    // @breaking-change 8.0.0
    _focusMonitor) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
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
            if (menu === this._parentMaterialMenu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throwMatMenuRecursiveError();
            }
            this._menuCloseSubscription = menu.close.subscribe((reason) => {
                this._destroyMenu();
                // If a click closed the menu, we should close the entire chain of nested menus.
                if ((reason === 'click' || reason === 'tab') && this._parentMaterialMenu) {
                    this._parentMaterialMenu.closed.emit(reason);
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
        return !!(this._menuItemInstance && this._parentMaterialMenu);
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
        if (this.menu instanceof _MatMenuBase) {
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
        this.menu.parentMenu = this.triggersSubmenu() ? this._parentMaterialMenu : undefined;
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
                .withGrowAfterOpen()
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
        const parentClose = this._parentMaterialMenu ? this._parentMaterialMenu.closed : observableOf();
        const hover = this._parentMaterialMenu ? this._parentMaterialMenu._hovered().pipe(filter(active => active !== this._menuItemInstance), filter(() => this._menuOpen)) : observableOf();
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
        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }
        if (this.triggersSubmenu() && ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
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
        this._hoverSubscription = this._parentMaterialMenu._hovered()
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
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_PANEL,] }, { type: Optional }] },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWUsK0JBQStCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFHTCxPQUFPLEVBQ1AsYUFBYSxHQUlkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLElBQUksRUFDSixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEUsT0FBTyxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUUsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDcEMsT0FBTyxFQUFDLHdCQUF3QixFQUFFLDBCQUEwQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25GLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMs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QUFTLEVBQUUsc0JBQXNCO2lCQUNsQztnQkFDRCxRQUFRLEVBQUUsZ0JBQWdCO2FBQzNCOzs7WUFuRUMsT0FBTztZQVVQLFVBQVU7WUFTVixnQkFBZ0I7NENBb0pILE1BQU0sU0FBQyx3QkFBd0I7NENBQy9CLE1BQU0sU0FBQyxjQUFjLGNBQUcsUUFBUTtZQTlJdkMsV0FBVyx1QkFpSkosUUFBUSxZQUFJLElBQUk7WUFoTFosY0FBYyx1QkFpTGxCLFFBQVE7WUFsTGYsWUFBWTs7OzJDQXVHakIsS0FBSyxTQUFDLHNCQUFzQjttQkFPNUIsS0FBSyxTQUFDLG1CQUFtQjt1QkE2QnpCLEtBQUssU0FBQyxvQkFBb0I7MkJBTzFCLEtBQUssU0FBQyw0QkFBNEI7eUJBR2xDLE1BQU07eUJBUU4sTUFBTTt5QkFHTixNQUFNOzBCQVFOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2luLCBpc0Zha2VNb3VzZWRvd25Gcm9tU2NyZWVuUmVhZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7RU5URVIsIExFRlRfQVJST1csIFJJR0hUX0FSUk9XLCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvcyxcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHthc2FwU2NoZWR1bGVyLCBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7X01hdE1lbnVCYXNlfSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IHt0aHJvd01hdE1lbnVNaXNzaW5nRXJyb3IsIHRocm93TWF0TWVudVJlY3Vyc2l2ZUVycm9yfSBmcm9tICcuL21lbnUtZXJyb3JzJztcbmltcG9ydCB7TWF0TWVudUl0ZW19IGZyb20gJy4vbWVudS1pdGVtJztcbmltcG9ydCB7TWF0TWVudVBhbmVsLCBNQVRfTUVOVV9QQU5FTH0gZnJvbSAnLi9tZW51LXBhbmVsJztcbmltcG9ydCB7TWVudVBvc2l0aW9uWCwgTWVudVBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LXBvc2l0aW9ucyc7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIG1lbnUgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1tZW51LXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfTUVOVV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX01FTlVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKiogRGVmYXVsdCB0b3AgcGFkZGluZyBvZiB0aGUgbWVudSBwYW5lbC4gKi9cbmV4cG9ydCBjb25zdCBNRU5VX1BBTkVMX1RPUF9QQURESU5HID0gODtcblxuLyoqIE9wdGlvbnMgZm9yIGJpbmRpbmcgYSBwYXNzaXZlIGV2ZW50IGxpc3RlbmVyLiAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zID0gbm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyh7cGFzc2l2ZTogdHJ1ZX0pO1xuXG4vLyBUT0RPKGFuZHJld3NlZ3Vpbik6IFJlbW92ZSB0aGUga2ViYWIgdmVyc2lvbnMgaW4gZmF2b3Igb2YgY2FtZWxDYXNlZCBhdHRyaWJ1dGUgc2VsZWN0b3JzXG5cbi8qKiBEaXJlY3RpdmUgYXBwbGllZCB0byBhbiBlbGVtZW50IHRoYXQgc2hvdWxkIHRyaWdnZXIgYSBgbWF0LW1lbnVgLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1tZW51LXRyaWdnZXItZm9yXSwgW21hdE1lbnVUcmlnZ2VyRm9yXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1lbnUtdHJpZ2dlcicsXG4gICAgJ2FyaWEtaGFzcG9wdXAnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ21lbnVPcGVuIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdtZW51T3BlbiA/IG1lbnUucGFuZWxJZCA6IG51bGwnLFxuICAgICcobW91c2Vkb3duKSc6ICdfaGFuZGxlTW91c2Vkb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdE1lbnVUcmlnZ2VyJ1xufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51VHJpZ2dlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfbWVudU9wZW46IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX2hvdmVyU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9tZW51Q2xvc2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogV2UncmUgc3BlY2lmaWNhbGx5IGxvb2tpbmcgZm9yIGEgYE1hdE1lbnVgIGhlcmUgc2luY2UgdGhlIGdlbmVyaWMgYE1hdE1lbnVQYW5lbGBcbiAgICogaW50ZXJmYWNlIGxhY2tzIHNvbWUgZnVuY3Rpb25hbGl0eSBhcm91bmQgbmVzdGVkIG1lbnVzIGFuZCBhbmltYXRpb25zLlxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWF0ZXJpYWxNZW51OiBfTWF0TWVudUJhc2UgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdG91Y2ggc3RhcnQgZXZlbnRzIG9uIHRoZSB0cmlnZ2VyLlxuICAgKiBOZWVkcyB0byBiZSBhbiBhcnJvdyBmdW5jdGlvbiBzbyB3ZSBjYW4gZWFzaWx5IHVzZSBhZGRFdmVudExpc3RlbmVyIGFuZCByZW1vdmVFdmVudExpc3RlbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFuZGxlVG91Y2hTdGFydCA9ICgpID0+IHRoaXMuX29wZW5lZEJ5ID0gJ3RvdWNoJztcblxuICAvLyBUcmFja2luZyBpbnB1dCB0eXBlIGlzIG5lY2Vzc2FyeSBzbyBpdCdzIHBvc3NpYmxlIHRvIG9ubHkgYXV0by1mb2N1c1xuICAvLyB0aGUgZmlyc3QgaXRlbSBvZiB0aGUgbGlzdCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkXG4gIF9vcGVuZWRCeTogRXhjbHVkZTxGb2N1c09yaWdpbiwgJ3Byb2dyYW0nPiA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgnbWF0LW1lbnUtdHJpZ2dlci1mb3InKVxuICBnZXQgX2RlcHJlY2F0ZWRNYXRNZW51VHJpZ2dlckZvcigpOiBNYXRNZW51UGFuZWwgeyByZXR1cm4gdGhpcy5tZW51OyB9XG4gIHNldCBfZGVwcmVjYXRlZE1hdE1lbnVUcmlnZ2VyRm9yKHY6IE1hdE1lbnVQYW5lbCkge1xuICAgIHRoaXMubWVudSA9IHY7XG4gIH1cblxuICAvKiogUmVmZXJlbmNlcyB0aGUgbWVudSBpbnN0YW5jZSB0aGF0IHRoZSB0cmlnZ2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KCdtYXRNZW51VHJpZ2dlckZvcicpXG4gIGdldCBtZW51KCkgeyByZXR1cm4gdGhpcy5fbWVudTsgfVxuICBzZXQgbWVudShtZW51OiBNYXRNZW51UGFuZWwpIHtcbiAgICBpZiAobWVudSA9PT0gdGhpcy5fbWVudSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21lbnUgPSBtZW51O1xuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKG1lbnUpIHtcbiAgICAgIGlmIChtZW51ID09PSB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3dNYXRNZW51UmVjdXJzaXZlRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWVudUNsb3NlU3Vic2NyaXB0aW9uID0gbWVudS5jbG9zZS5zdWJzY3JpYmUoXG4gICAgICAgIChyZWFzb246ICdjbGljaycgfCAndGFiJyB8ICdrZXlkb3duJyB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lNZW51KCk7XG5cbiAgICAgICAgICAvLyBJZiBhIGNsaWNrIGNsb3NlZCB0aGUgbWVudSwgd2Ugc2hvdWxkIGNsb3NlIHRoZSBlbnRpcmUgY2hhaW4gb2YgbmVzdGVkIG1lbnVzLlxuICAgICAgICAgIGlmICgocmVhc29uID09PSAnY2xpY2snIHx8IHJlYXNvbiA9PT0gJ3RhYicpICYmIHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51LmNsb3NlZC5lbWl0KHJlYXNvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfbWVudTogTWF0TWVudVBhbmVsO1xuXG4gIC8qKiBEYXRhIHRvIGJlIHBhc3NlZCBhbG9uZyB0byBhbnkgbGF6aWx5LXJlbmRlcmVkIGNvbnRlbnQuICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJEYXRhJykgbWVudURhdGE6IGFueTtcblxuICAvKipcbiAgICogV2hldGhlciBmb2N1cyBzaG91bGQgYmUgcmVzdG9yZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBkaXNhYmxpbmcgdGhpcyBvcHRpb24gY2FuIGhhdmUgYWNjZXNzaWJpbGl0eSBpbXBsaWNhdGlvbnNcbiAgICogYW5kIGl0J3MgdXAgdG8geW91IHRvIG1hbmFnZSBmb2N1cywgaWYgeW91IGRlY2lkZSB0byB0dXJuIGl0IG9mZi5cbiAgICovXG4gIEBJbnB1dCgnbWF0TWVudVRyaWdnZXJSZXN0b3JlRm9jdXMnKSByZXN0b3JlRm9jdXM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgbWVudSBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtZW51T3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIG9wZW5lZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBtZW51T3BlbmVkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvbk1lbnVPcGVuOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVPcGVuZWQ7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBtZW51IGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1lbnVDbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYG1lbnVDbG9zZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9uTWVudUNsb3NlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSB0aGlzLm1lbnVDbG9zZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX01FTlVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwsXG4gICAgICAgICAgICAgIC8vIGBNYXRNZW51VHJpZ2dlcmAgaXMgY29tbW9ubHkgdXNlZCBpbiBjb21iaW5hdGlvbiB3aXRoIGEgYE1hdE1lbnVJdGVtYC5cbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBsaWdodHdlaWdodC10b2tlbnNcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwcml2YXRlIF9tZW51SXRlbUluc3RhbmNlOiBNYXRNZW51SXRlbSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IG1ha2UgdGhlIF9mb2N1c01vbml0b3IgcmVxdWlyZWQgd2hlbiBkb2luZyBicmVha2luZyBjaGFuZ2VzLlxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcikge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gICAgdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51ID0gcGFyZW50TWVudSBpbnN0YW5jZW9mIF9NYXRNZW51QmFzZSA/IHBhcmVudE1lbnUgOiB1bmRlZmluZWQ7XG5cbiAgICBfZWxlbWVudC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0LFxuICAgICAgICBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuXG4gICAgaWYgKF9tZW51SXRlbUluc3RhbmNlKSB7XG4gICAgICBfbWVudUl0ZW1JbnN0YW5jZS5fdHJpZ2dlcnNTdWJtZW51ID0gdGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY2hlY2tNZW51KCk7XG4gICAgdGhpcy5faGFuZGxlSG92ZXIoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5faGFuZGxlVG91Y2hTdGFydCxcbiAgICAgICAgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKTtcblxuICAgIHRoaXMuX21lbnVDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5faG92ZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIG9wZW4uICovXG4gIGdldCBtZW51T3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWVudU9wZW47XG4gIH1cblxuICAvKiogVGhlIHRleHQgZGlyZWN0aW9uIG9mIHRoZSBjb250YWluaW5nIGFwcC4gKi9cbiAgZ2V0IGRpcigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbWVudSB0cmlnZ2VycyBhIHN1Yi1tZW51IG9yIGEgdG9wLWxldmVsIG9uZS4gKi9cbiAgdHJpZ2dlcnNTdWJtZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmIHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgbWVudSBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVNZW51KCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9tZW51T3BlbiA/IHRoaXMuY2xvc2VNZW51KCkgOiB0aGlzLm9wZW5NZW51KCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG1lbnUuICovXG4gIG9wZW5NZW51KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tZW51T3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrTWVudSgpO1xuXG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX2NyZWF0ZU92ZXJsYXkoKTtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gb3ZlcmxheVJlZi5nZXRDb25maWcoKTtcblxuICAgIHRoaXMuX3NldFBvc2l0aW9uKG92ZXJsYXlDb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPSB0aGlzLm1lbnUuaGFzQmFja2Ryb3AgPT0gbnVsbCA/ICF0aGlzLnRyaWdnZXJzU3VibWVudSgpIDpcbiAgICAgICAgdGhpcy5tZW51Lmhhc0JhY2tkcm9wO1xuICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX2dldFBvcnRhbCgpKTtcblxuICAgIGlmICh0aGlzLm1lbnUubGF6eUNvbnRlbnQpIHtcbiAgICAgIHRoaXMubWVudS5sYXp5Q29udGVudC5hdHRhY2godGhpcy5tZW51RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSB0aGlzLl9tZW51Q2xvc2luZ0FjdGlvbnMoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZU1lbnUoKSk7XG4gICAgdGhpcy5faW5pdE1lbnUoKTtcblxuICAgIGlmICh0aGlzLm1lbnUgaW5zdGFuY2VvZiBfTWF0TWVudUJhc2UpIHtcbiAgICAgIHRoaXMubWVudS5fc3RhcnRBbmltYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBtZW51LiAqL1xuICBjbG9zZU1lbnUoKTogdm9pZCB7XG4gICAgdGhpcy5tZW51LmNsb3NlLmVtaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBtZW51IHRyaWdnZXIuXG4gICAqIEBwYXJhbSBvcmlnaW4gU291cmNlIG9mIHRoZSBtZW51IHRyaWdnZXIncyBmb2N1cy5cbiAgICovXG4gIGZvY3VzKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG1lbnUgYW5kIGRvZXMgdGhlIG5lY2Vzc2FyeSBjbGVhbnVwLiAqL1xuICBwcml2YXRlIF9kZXN0cm95TWVudSgpIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlSZWYgfHwgIXRoaXMubWVudU9wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZW51ID0gdGhpcy5tZW51O1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcblxuICAgIGlmIChtZW51IGluc3RhbmNlb2YgX01hdE1lbnVCYXNlKSB7XG4gICAgICBtZW51Ll9yZXNldEFuaW1hdGlvbigpO1xuXG4gICAgICBpZiAobWVudS5sYXp5Q29udGVudCkge1xuICAgICAgICAvLyBXYWl0IGZvciB0aGUgZXhpdCBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBkZXRhY2hpbmcgdGhlIGNvbnRlbnQuXG4gICAgICAgIG1lbnUuX2FuaW1hdGlvbkRvbmVcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC50b1N0YXRlID09PSAndm9pZCcpLFxuICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgIC8vIEludGVycnVwdCBpZiB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQuXG4gICAgICAgICAgICB0YWtlVW50aWwobWVudS5sYXp5Q29udGVudC5fYXR0YWNoZWQpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogKCkgPT4gbWVudS5sYXp5Q29udGVudCEuZGV0YWNoKCksXG4gICAgICAgICAgICAvLyBObyBtYXR0ZXIgd2hldGhlciB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQsIHJlc2V0IHRoZSBtZW51LlxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX3NldElzTWVudU9wZW4oZmFsc2UpXG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zZXRJc01lbnVPcGVuKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0SXNNZW51T3BlbihmYWxzZSk7XG5cbiAgICAgIGlmIChtZW51LmxhenlDb250ZW50KSB7XG4gICAgICAgIG1lbnUubGF6eUNvbnRlbnQuZGV0YWNoKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgdGhlIG1lbnUgc3RhdGUgdG8gb3BlbiBhbmQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbSBpZlxuICAgKiB0aGUgbWVudSB3YXMgb3BlbmVkIHZpYSB0aGUga2V5Ym9hcmQuXG4gICAqL1xuICBwcml2YXRlIF9pbml0TWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLm1lbnUucGFyZW50TWVudSA9IHRoaXMudHJpZ2dlcnNTdWJtZW51KCkgPyB0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5tZW51LmRpcmVjdGlvbiA9IHRoaXMuZGlyO1xuICAgIHRoaXMuX3NldE1lbnVFbGV2YXRpb24oKTtcbiAgICB0aGlzLl9zZXRJc01lbnVPcGVuKHRydWUpO1xuICAgIHRoaXMubWVudS5mb2N1c0ZpcnN0SXRlbSh0aGlzLl9vcGVuZWRCeSB8fCAncHJvZ3JhbScpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIG1lbnUgZWxldmF0aW9uIGJhc2VkIG9uIHRoZSBhbW91bnQgb2YgcGFyZW50IG1lbnVzIHRoYXQgaXQgaGFzLiAqL1xuICBwcml2YXRlIF9zZXRNZW51RWxldmF0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1lbnUuc2V0RWxldmF0aW9uKSB7XG4gICAgICBsZXQgZGVwdGggPSAwO1xuICAgICAgbGV0IHBhcmVudE1lbnUgPSB0aGlzLm1lbnUucGFyZW50TWVudTtcblxuICAgICAgd2hpbGUgKHBhcmVudE1lbnUpIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgICAgcGFyZW50TWVudSA9IHBhcmVudE1lbnUucGFyZW50TWVudTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tZW51LnNldEVsZXZhdGlvbihkZXB0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBtZW51IHdhcyBvcGVuLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgLy8gV2Ugc2hvdWxkIHJlc2V0IGZvY3VzIGlmIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcgdXNpbmcgYSBrZXlib2FyZCBvclxuICAgIC8vIGlmIHdlIGhhdmUgYSB0b3AtbGV2ZWwgdHJpZ2dlciB3aGljaCBtaWdodCBjYXVzZSBmb2N1cyB0byBiZSBsb3N0XG4gICAgLy8gd2hlbiBjbGlja2luZyBvbiB0aGUgYmFja2Ryb3AuXG4gICAgaWYgKHRoaXMucmVzdG9yZUZvY3VzKSB7XG4gICAgICBpZiAoIXRoaXMuX29wZW5lZEJ5KSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGUgZm9jdXMgc3R5bGUgd2lsbCBzaG93IHVwIGJvdGggZm9yIGBwcm9ncmFtYCBhbmRcbiAgICAgICAgLy8gYGtleWJvYXJkYCBzbyB3ZSBkb24ndCBoYXZlIHRvIHNwZWNpZnkgd2hpY2ggb25lIGl0IGlzLlxuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnRyaWdnZXJzU3VibWVudSgpKSB7XG4gICAgICAgIHRoaXMuZm9jdXModGhpcy5fb3BlbmVkQnkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZEJ5ID0gbnVsbDtcbiAgfVxuXG4gIC8vIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgbWVudVxuICBwcml2YXRlIF9zZXRJc01lbnVPcGVuKGlzT3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX21lbnVPcGVuID0gaXNPcGVuO1xuICAgIHRoaXMuX21lbnVPcGVuID8gdGhpcy5tZW51T3BlbmVkLmVtaXQoKSA6IHRoaXMubWVudUNsb3NlZC5lbWl0KCk7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgdGhpcy5fbWVudUl0ZW1JbnN0YW5jZS5faGlnaGxpZ2h0ZWQgPSBpc09wZW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyB0aGF0IGEgdmFsaWQgaW5zdGFuY2Ugb2YgTWF0TWVudSBoYXMgYmVlbiBwYXNzZWQgaW50b1xuICAgKiBtYXRNZW51VHJpZ2dlckZvci4gSWYgbm90LCBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tNZW51KCkge1xuICAgIGlmICghdGhpcy5tZW51ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVNaXNzaW5nRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyB0aGUgb3ZlcmxheSBmcm9tIHRoZSBwcm92aWRlZCBtZW51J3MgdGVtcGxhdGUgYW5kIHNhdmVzIGl0c1xuICAgKiBPdmVybGF5UmVmIHNvIHRoYXQgaXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00gd2hlbiBvcGVuTWVudSBpcyBjYWxsZWQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0T3ZlcmxheUNvbmZpZygpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlVG9Qb3NpdGlvbnMoY29uZmlnLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZShjb25maWcpO1xuXG4gICAgICAvLyBDb25zdW1lIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gcHJldmVudCB0aGVtIGZyb20gZ29pbmcgdG8gYW5vdGhlciBvdmVybGF5LlxuICAgICAgLy8gSWRlYWxseSB3ZSdkIGFsc28gaGF2ZSBvdXIga2V5Ym9hcmQgZXZlbnQgbG9naWMgaW4gaGVyZSwgaG93ZXZlciBkb2luZyBzbyB3aWxsXG4gICAgICAvLyBicmVhayBhbnlib2R5IHRoYXQgbWF5IGhhdmUgaW1wbGVtZW50ZWQgdGhlIGBNYXRNZW51UGFuZWxgIHRoZW1zZWx2ZXMuXG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBidWlsZHMgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG5lZWRlZCB0byBjcmVhdGUgdGhlIG92ZXJsYXksIHRoZSBPdmVybGF5U3RhdGUuXG4gICAqIEByZXR1cm5zIE92ZXJsYXlDb25maWdcbiAgICovXG4gIHByaXZhdGUgX2dldE92ZXJsYXlDb25maWcoKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgcmV0dXJuIG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgICAgLndpdGhMb2NrZWRQb3NpdGlvbigpXG4gICAgICAgICAgLndpdGhHcm93QWZ0ZXJPcGVuKClcbiAgICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LW1lbnUtcGFuZWwsIC5tYXQtbWRjLW1lbnUtcGFuZWwnKSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IHRoaXMubWVudS5iYWNrZHJvcENsYXNzIHx8ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLm1lbnUub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyB0byBjaGFuZ2VzIGluIHRoZSBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheSBhbmQgc2V0cyB0aGUgY29ycmVjdCBjbGFzc2VzXG4gICAqIG9uIHRoZSBtZW51IGJhc2VkIG9uIHRoZSBuZXcgcG9zaXRpb24uIFRoaXMgZW5zdXJlcyB0aGUgYW5pbWF0aW9uIG9yaWdpbiBpcyBhbHdheXNcbiAgICogY29ycmVjdCwgZXZlbiBpZiBhIGZhbGxiYWNrIHBvc2l0aW9uIGlzIHVzZWQgZm9yIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Qb3NpdGlvbnMocG9zaXRpb246IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1lbnUuc2V0UG9zaXRpb25DbGFzc2VzKSB7XG4gICAgICBwb3NpdGlvbi5wb3NpdGlvbkNoYW5nZXMuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc1g6IE1lbnVQb3NpdGlvblggPSBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVggPT09ICdzdGFydCcgPyAnYWZ0ZXInIDogJ2JlZm9yZSc7XG4gICAgICAgIGNvbnN0IHBvc1k6IE1lbnVQb3NpdGlvblkgPSBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVkgPT09ICd0b3AnID8gJ2JlbG93JyA6ICdhYm92ZSc7XG5cbiAgICAgICAgdGhpcy5tZW51LnNldFBvc2l0aW9uQ2xhc3NlcyEocG9zWCwgcG9zWSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXBwcm9wcmlhdGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3lcbiAgICogc28gdGhlIG92ZXJsYXkgY29ubmVjdHMgd2l0aCB0aGUgdHJpZ2dlciBjb3JyZWN0bHkuXG4gICAqIEBwYXJhbSBwb3NpdGlvblN0cmF0ZWd5IFN0cmF0ZWd5IHdob3NlIHBvc2l0aW9uIHRvIHVwZGF0ZS5cbiAgICovXG4gIHByaXZhdGUgX3NldFBvc2l0aW9uKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGxldCBbb3JpZ2luWCwgb3JpZ2luRmFsbGJhY2tYXTogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICAgIHRoaXMubWVudS54UG9zaXRpb24gPT09ICdiZWZvcmUnID8gWydlbmQnLCAnc3RhcnQnXSA6IFsnc3RhcnQnLCAnZW5kJ107XG5cbiAgICBsZXQgW292ZXJsYXlZLCBvdmVybGF5RmFsbGJhY2tZXTogVmVydGljYWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgICB0aGlzLm1lbnUueVBvc2l0aW9uID09PSAnYWJvdmUnID8gWydib3R0b20nLCAndG9wJ10gOiBbJ3RvcCcsICdib3R0b20nXTtcblxuICAgIGxldCBbb3JpZ2luWSwgb3JpZ2luRmFsbGJhY2tZXSA9IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV07XG4gICAgbGV0IFtvdmVybGF5WCwgb3ZlcmxheUZhbGxiYWNrWF0gPSBbb3JpZ2luWCwgb3JpZ2luRmFsbGJhY2tYXTtcbiAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgLy8gV2hlbiB0aGUgbWVudSBpcyBhIHN1Yi1tZW51LCBpdCBzaG91bGQgYWx3YXlzIGFsaWduIGl0c2VsZlxuICAgICAgLy8gdG8gdGhlIGVkZ2VzIG9mIHRoZSB0cmlnZ2VyLCBpbnN0ZWFkIG9mIG92ZXJsYXBwaW5nIGl0LlxuICAgICAgb3ZlcmxheUZhbGxiYWNrWCA9IG9yaWdpblggPSB0aGlzLm1lbnUueFBvc2l0aW9uID09PSAnYmVmb3JlJyA/ICdzdGFydCcgOiAnZW5kJztcbiAgICAgIG9yaWdpbkZhbGxiYWNrWCA9IG92ZXJsYXlYID0gb3JpZ2luWCA9PT0gJ2VuZCcgPyAnc3RhcnQnIDogJ2VuZCc7XG4gICAgICBvZmZzZXRZID0gb3ZlcmxheVkgPT09ICdib3R0b20nID8gTUVOVV9QQU5FTF9UT1BfUEFERElORyA6IC1NRU5VX1BBTkVMX1RPUF9QQURESU5HO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubWVudS5vdmVybGFwVHJpZ2dlcikge1xuICAgICAgb3JpZ2luWSA9IG92ZXJsYXlZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgICBvcmlnaW5GYWxsYmFja1kgPSBvdmVybGF5RmFsbGJhY2tZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtvcmlnaW5YLCBvcmlnaW5ZLCBvdmVybGF5WCwgb3ZlcmxheVksIG9mZnNldFl9LFxuICAgICAge29yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsIG92ZXJsYXlZLCBvZmZzZXRZfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWCxcbiAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICBvdmVybGF5WCxcbiAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgIG9mZnNldFk6IC1vZmZzZXRZXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsXG4gICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WVxuICAgICAgfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciBhbiBhY3Rpb24gdGhhdCBzaG91bGQgY2xvc2UgdGhlIG1lbnUgb2NjdXJzLiAqL1xuICBwcml2YXRlIF9tZW51Q2xvc2luZ0FjdGlvbnMoKSB7XG4gICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLl9vdmVybGF5UmVmIS5iYWNrZHJvcENsaWNrKCk7XG4gICAgY29uc3QgZGV0YWNobWVudHMgPSB0aGlzLl9vdmVybGF5UmVmIS5kZXRhY2htZW50cygpO1xuICAgIGNvbnN0IHBhcmVudENsb3NlID0gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51ID8gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51LmNsb3NlZCA6IG9ic2VydmFibGVPZigpO1xuICAgIGNvbnN0IGhvdmVyID0gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51ID8gdGhpcy5fcGFyZW50TWF0ZXJpYWxNZW51Ll9ob3ZlcmVkKCkucGlwZShcbiAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlICE9PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlKSxcbiAgICAgIGZpbHRlcigoKSA9PiB0aGlzLl9tZW51T3BlbilcbiAgICApIDogb2JzZXJ2YWJsZU9mKCk7XG5cbiAgICByZXR1cm4gbWVyZ2UoYmFja2Ryb3AsIHBhcmVudENsb3NlLCBob3ZlciwgZGV0YWNobWVudHMpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW91c2UgcHJlc3NlcyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZU1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlcihldmVudCkpIHtcbiAgICAgIC8vIFNpbmNlIHJpZ2h0IG9yIG1pZGRsZSBidXR0b24gY2xpY2tzIHdvbid0IHRyaWdnZXIgdGhlIGBjbGlja2AgZXZlbnQsXG4gICAgICAvLyB3ZSBzaG91bGRuJ3QgY29uc2lkZXIgdGhlIG1lbnUgYXMgb3BlbmVkIGJ5IG1vdXNlIGluIHRob3NlIGNhc2VzLlxuICAgICAgdGhpcy5fb3BlbmVkQnkgPSBldmVudC5idXR0b24gPT09IDAgPyAnbW91c2UnIDogbnVsbDtcblxuICAgICAgLy8gU2luY2UgY2xpY2tpbmcgb24gdGhlIHRyaWdnZXIgd29uJ3QgY2xvc2UgdGhlIG1lbnUgaWYgaXQgb3BlbnMgYSBzdWItbWVudSxcbiAgICAgIC8vIHdlIHNob3VsZCBwcmV2ZW50IGZvY3VzIGZyb20gbW92aW5nIG9udG8gaXQgdmlhIGNsaWNrIHRvIGF2b2lkIHRoZVxuICAgICAgLy8gaGlnaGxpZ2h0IGZyb20gbGluZ2VyaW5nIG9uIHRoZSBtZW51IGl0ZW0uXG4gICAgICBpZiAodGhpcy50cmlnZ2Vyc1N1Ym1lbnUoKSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleSBwcmVzc2VzIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgLy8gUHJlc3NpbmcgZW50ZXIgb24gdGhlIHRyaWdnZXIgd2lsbCB0cmlnZ2VyIHRoZSBjbGljayBoYW5kbGVyIGxhdGVyLlxuICAgIGlmIChrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRSkge1xuICAgICAgdGhpcy5fb3BlbmVkQnkgPSAna2V5Ym9hcmQnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRyaWdnZXJzU3VibWVudSgpICYmIChcbiAgICAgICAgICAgIChrZXlDb2RlID09PSBSSUdIVF9BUlJPVyAmJiB0aGlzLmRpciA9PT0gJ2x0cicpIHx8XG4gICAgICAgICAgICAoa2V5Q29kZSA9PT0gTEVGVF9BUlJPVyAmJiB0aGlzLmRpciA9PT0gJ3J0bCcpKSkge1xuICAgICAgdGhpcy5fb3BlbmVkQnkgPSAna2V5Ym9hcmQnO1xuICAgICAgdGhpcy5vcGVuTWVudSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHJpZ2dlcnNTdWJtZW51KCkpIHtcbiAgICAgIC8vIFN0b3AgZXZlbnQgcHJvcGFnYXRpb24gdG8gYXZvaWQgY2xvc2luZyB0aGUgcGFyZW50IG1lbnUuXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMub3Blbk1lbnUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VyIGhvdmVycyBvdmVyIHRoZSB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9oYW5kbGVIb3ZlcigpIHtcbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgaG92ZXJlZCBpdGVtIGluIG9yZGVyIHRvIHRvZ2dsZSB0aGUgcGFuZWwuXG4gICAgaWYgKCF0aGlzLnRyaWdnZXJzU3VibWVudSgpIHx8ICF0aGlzLl9wYXJlbnRNYXRlcmlhbE1lbnUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlclN1YnNjcmlwdGlvbiA9IHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudS5faG92ZXJlZCgpXG4gICAgICAvLyBTaW5jZSB3ZSBtaWdodCBoYXZlIG11bHRpcGxlIGNvbXBldGluZyB0cmlnZ2VycyBmb3IgdGhlIHNhbWUgbWVudSAoZS5nLiBhIHN1Yi1tZW51XG4gICAgICAvLyB3aXRoIGRpZmZlcmVudCBkYXRhIGFuZCB0cmlnZ2VycyksIHdlIGhhdmUgdG8gZGVsYXkgaXQgYnkgYSB0aWNrIHRvIGVuc3VyZSB0aGF0XG4gICAgICAvLyBpdCB3b24ndCBiZSBjbG9zZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaXMgb3BlbmVkLlxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcihhY3RpdmUgPT4gYWN0aXZlID09PSB0aGlzLl9tZW51SXRlbUluc3RhbmNlICYmICFhY3RpdmUuZGlzYWJsZWQpLFxuICAgICAgICBkZWxheSgwLCBhc2FwU2NoZWR1bGVyKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ21vdXNlJztcblxuICAgICAgICAvLyBJZiB0aGUgc2FtZSBtZW51IGlzIHVzZWQgYmV0d2VlbiBtdWx0aXBsZSB0cmlnZ2VycywgaXQgbWlnaHQgc3RpbGwgYmUgYW5pbWF0aW5nXG4gICAgICAgIC8vIHdoaWxlIHRoZSBuZXcgdHJpZ2dlciB0cmllcyB0byByZS1vcGVuIGl0LiBXYWl0IGZvciB0aGUgYW5pbWF0aW9uIHRvIGZpbmlzaFxuICAgICAgICAvLyBiZWZvcmUgZG9pbmcgc28uIEFsc28gaW50ZXJydXB0IGlmIHRoZSB1c2VyIG1vdmVzIHRvIGFub3RoZXIgaXRlbS5cbiAgICAgICAgaWYgKHRoaXMubWVudSBpbnN0YW5jZW9mIF9NYXRNZW51QmFzZSAmJiB0aGlzLm1lbnUuX2lzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0aGUgYGRlbGF5KDApYCBoZXJlIGluIG9yZGVyIHRvIGF2b2lkXG4gICAgICAgICAgLy8gJ2NoYW5nZWQgYWZ0ZXIgY2hlY2tlZCcgZXJyb3JzIGluIHNvbWUgY2FzZXMuIFNlZSAjMTIxOTQuXG4gICAgICAgICAgdGhpcy5tZW51Ll9hbmltYXRpb25Eb25lXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpLCBkZWxheSgwLCBhc2FwU2NoZWR1bGVyKSwgdGFrZVVudGlsKHRoaXMuX3BhcmVudE1hdGVyaWFsTWVudSEuX2hvdmVyZWQoKSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMub3Blbk1lbnUoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuTWVudSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwb3J0YWwgdGhhdCBzaG91bGQgYmUgYXR0YWNoZWQgdG8gdGhlIG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2dldFBvcnRhbCgpOiBUZW1wbGF0ZVBvcnRhbCB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIGNhbiBhdm9pZCB0aGlzIGNoZWNrIGJ5IGtlZXBpbmcgdGhlIHBvcnRhbCBvbiB0aGUgbWVudSBwYW5lbC5cbiAgICAvLyBXaGlsZSBpdCB3b3VsZCBiZSBjbGVhbmVyLCB3ZSdkIGhhdmUgdG8gaW50cm9kdWNlIGFub3RoZXIgcmVxdWlyZWQgbWV0aG9kIG9uXG4gICAgLy8gYE1hdE1lbnVQYW5lbGAsIG1ha2luZyBpdCBoYXJkZXIgdG8gY29uc3VtZS5cbiAgICBpZiAoIXRoaXMuX3BvcnRhbCB8fCB0aGlzLl9wb3J0YWwudGVtcGxhdGVSZWYgIT09IHRoaXMubWVudS50ZW1wbGF0ZVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMubWVudS50ZW1wbGF0ZVJlZiwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbDtcbiAgfVxuXG59XG4iXX0=