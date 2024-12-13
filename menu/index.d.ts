import { AfterContentInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { AnimationTriggerMetadata } from '@angular/animations';
import { Direction } from '@angular/cdk/bidi';
import { EventEmitter } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { FocusOrigin } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import * as i1 from '@angular/material/core';
import * as i2 from '@angular/cdk/overlay';
import * as i7 from '@angular/cdk/scrolling';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { QueryList } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { TemplateRef } from '@angular/core';

/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
export declare const fadeInItems: AnimationTriggerMetadata;

declare namespace i3 {
    export {
        MAT_MENU_DEFAULT_OPTIONS_FACTORY,
        MenuCloseReason,
        MatMenuDefaultOptions,
        MAT_MENU_DEFAULT_OPTIONS,
        MatMenu
    }
}

declare namespace i4 {
    export {
        MatMenuItem
    }
}

declare namespace i5 {
    export {
        MAT_MENU_CONTENT,
        MatMenuContent
    }
}

declare namespace i6 {
    export {
        MAT_MENU_SCROLL_STRATEGY_FACTORY,
        MAT_MENU_SCROLL_STRATEGY,
        MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
        MENU_PANEL_TOP_PADDING,
        MatMenuTrigger
    }
}

/**
 * Injection token that can be used to reference instances of `MatMenuContent`. It serves
 * as alternative token to the actual `MatMenuContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_MENU_CONTENT: InjectionToken<MatMenuContent>;

/** Injection token to be used to override the default options for `mat-menu`. */
export declare const MAT_MENU_DEFAULT_OPTIONS: InjectionToken<MatMenuDefaultOptions>;

/** @docs-private */
declare function MAT_MENU_DEFAULT_OPTIONS_FACTORY(): MatMenuDefaultOptions;

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
export declare const MAT_MENU_PANEL: InjectionToken<MatMenuPanel<any>>;

/** Injection token that determines the scroll handling while the menu is open. */
export declare const MAT_MENU_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;

/** @docs-private */
declare function MAT_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;

/** @docs-private */
export declare const MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_MENU_SCROLL_STRATEGY_FACTORY;
};

export declare class MatMenu implements AfterContentInit, MatMenuPanel<MatMenuItem>, OnInit, OnDestroy {
    private _elementRef;
    private _changeDetectorRef;
    private _injector;
    private _keyManager;
    private _xPosition;
    private _yPosition;
    private _firstItemFocusRef?;
    private _exitFallbackTimeout;
    /** Whether animations are currently disabled. */
    protected _animationsDisabled: boolean;
    /** All items inside the menu. Includes items nested inside another menu. */
    _allItems: QueryList<MatMenuItem>;
    /** Only the direct descendant menu items. */
    _directDescendantItems: QueryList<MatMenuItem>;
    /** Classes to be applied to the menu panel. */
    _classList: {
        [key: string]: boolean;
    };
    /** Current state of the panel animation. */
    _panelAnimationState: 'void' | 'enter';
    /** Emits whenever an animation on the menu completes. */
    readonly _animationDone: Subject<"void" | "enter">;
    /** Whether the menu is animating. */
    _isAnimating: boolean;
    /** Parent menu of the current menu panel. */
    parentMenu: MatMenuPanel | undefined;
    /** Layout direction of the menu. */
    direction: Direction;
    /** Class or list of classes to be added to the overlay panel. */
    overlayPanelClass: string | string[];
    /** Class to be added to the backdrop element. */
    backdropClass: string;
    /** aria-label for the menu panel. */
    ariaLabel: string;
    /** aria-labelledby for the menu panel. */
    ariaLabelledby: string;
    /** aria-describedby for the menu panel. */
    ariaDescribedby: string;
    /** Position of the menu in the X axis. */
    get xPosition(): MenuPositionX;
    set xPosition(value: MenuPositionX);
    /** Position of the menu in the Y axis. */
    get yPosition(): MenuPositionY;
    set yPosition(value: MenuPositionY);
    /** @docs-private */
    templateRef: TemplateRef<any>;
    /**
     * List of the items inside of a menu.
     * @deprecated
     * @breaking-change 8.0.0
     */
    items: QueryList<MatMenuItem>;
    /**
     * Menu content that will be rendered lazily.
     * @docs-private
     */
    lazyContent: MatMenuContent;
    /** Whether the menu should overlap its trigger. */
    overlapTrigger: boolean;
    /** Whether the menu has a backdrop. */
    hasBackdrop?: boolean;
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes: string);
    private _previousPanelClass;
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList(): string;
    set classList(classes: string);
    /** Event emitted when the menu is closed. */
    readonly closed: EventEmitter<MenuCloseReason>;
    /**
     * Event emitted when the menu is closed.
     * @deprecated Switch to `closed` instead
     * @breaking-change 8.0.0
     */
    readonly close: EventEmitter<MenuCloseReason>;
    readonly panelId: string;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Stream that emits whenever the hovered menu item changes. */
    _hovered(): Observable<MatMenuItem>;
    addItem(_item: MatMenuItem): void;
    /**
     * Removes an item from the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    removeItem(_item: MatMenuItem): void;
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * Focus the first item in the menu.
     * @param origin Action from which the focus originated. Used to set the correct styling.
     */
    focusFirstItem(origin?: FocusOrigin): void;
    /**
     * Resets the active item in the menu. This is used when the menu is opened, allowing
     * the user to start from the first option when pressing the down arrow.
     */
    resetActiveItem(): void;
    /**
     * @deprecated No longer used and will be removed.
     * @breaking-change 21.0.0
     */
    setElevation(_depth: number): void;
    /**
     * Adds classes to the menu panel based on its position. Can be used by
     * consumers to add specific styling based on the position.
     * @param posX Position of the menu along the x axis.
     * @param posY Position of the menu along the y axis.
     * @docs-private
     */
    setPositionClasses(posX?: MenuPositionX, posY?: MenuPositionY): void;
    /** Callback that is invoked when the panel animation completes. */
    protected _onAnimationDone(state: string): void;
    protected _onAnimationStart(state: string): void;
    _setIsOpen(isOpen: boolean): void;
    /**
     * Sets up a stream that will keep track of any newly-added menu items and will update the list
     * of direct descendants. We collect the descendants this way, because `_allItems` can include
     * items that are part of child menus, and using a custom way of registering items is unreliable
     * when it comes to maintaining the item order.
     */
    private _updateDirectDescendants;
    /** Gets the menu panel DOM node. */
    private _resolvePanel;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMenu, "mat-menu", ["matMenu"], { "backdropClass": { "alias": "backdropClass"; "required": false; }; "ariaLabel": { "alias": "aria-label"; "required": false; }; "ariaLabelledby": { "alias": "aria-labelledby"; "required": false; }; "ariaDescribedby": { "alias": "aria-describedby"; "required": false; }; "xPosition": { "alias": "xPosition"; "required": false; }; "yPosition": { "alias": "yPosition"; "required": false; }; "overlapTrigger": { "alias": "overlapTrigger"; "required": false; }; "hasBackdrop": { "alias": "hasBackdrop"; "required": false; }; "panelClass": { "alias": "class"; "required": false; }; "classList": { "alias": "classList"; "required": false; }; }, { "closed": "closed"; "close": "close"; }, ["lazyContent", "_allItems", "items"], ["*"], true, never>;
    static ngAcceptInputType_overlapTrigger: unknown;
    static ngAcceptInputType_hasBackdrop: any;
}

/**
 * Animations used by the mat-menu component.
 * Animation duration and timing values are based on:
 * https://material.io/guidelines/components/menus.html#menus-usage
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
export declare const matMenuAnimations: {
    readonly transformMenu: AnimationTriggerMetadata;
    readonly fadeInItems: AnimationTriggerMetadata;
};

/** Menu content that will be rendered lazily once the menu is opened. */
export declare class MatMenuContent implements OnDestroy {
    private _template;
    private _appRef;
    private _injector;
    private _viewContainerRef;
    private _document;
    private _changeDetectorRef;
    private _portal;
    private _outlet;
    /** Emits when the menu content has been attached. */
    readonly _attached: Subject<void>;
    constructor(...args: unknown[]);
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context?: any): void;
    /**
     * Detaches the content.
     * @docs-private
     */
    detach(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatMenuContent, "ng-template[matMenuContent]", never, {}, {}, never, never, true, never>;
}

/** Default `mat-menu` options that can be overridden. */
export declare interface MatMenuDefaultOptions {
    /** The x-axis position of the menu. */
    xPosition: MenuPositionX;
    /** The y-axis position of the menu. */
    yPosition: MenuPositionY;
    /** Whether the menu should overlap the menu trigger. */
    overlapTrigger: boolean;
    /** Class to be applied to the menu's backdrop. */
    backdropClass: string;
    /** Class or list of classes to be applied to the menu's overlay panel. */
    overlayPanelClass?: string | string[];
    /** Whether the menu has a backdrop. */
    hasBackdrop?: boolean;
}

/**
 * Single item inside a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export declare class MatMenuItem implements FocusableOption, AfterViewInit, OnDestroy {
    private _elementRef;
    private _document;
    private _focusMonitor;
    _parentMenu?: MatMenuPanel<MatMenuItem> | null | undefined;
    private _changeDetectorRef;
    /** ARIA role for the menu item. */
    role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
    /** Whether the menu item is disabled. */
    disabled: boolean;
    /** Whether ripples are disabled on the menu item. */
    disableRipple: boolean;
    /** Stream that emits when the menu item is hovered. */
    readonly _hovered: Subject<MatMenuItem>;
    /** Stream that emits when the menu item is focused. */
    readonly _focused: Subject<MatMenuItem>;
    /** Whether the menu item is highlighted. */
    _highlighted: boolean;
    /** Whether the menu item acts as a trigger for a sub-menu. */
    _triggersSubmenu: boolean;
    constructor(...args: unknown[]);
    /** Focuses the menu item. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Used to set the `tabindex`. */
    _getTabIndex(): string;
    /** Returns the host DOM element. */
    _getHostElement(): HTMLElement;
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event: Event): void;
    /** Emits to the hover stream. */
    _handleMouseEnter(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
    _setHighlighted(isHighlighted: boolean): void;
    _setTriggersSubmenu(triggersSubmenu: boolean): void;
    _hasFocus(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMenuItem, "[mat-menu-item]", ["matMenuItem"], { "role": { "alias": "role"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "disableRipple": { "alias": "disableRipple"; "required": false; }; }, {}, never, ["mat-icon, [matMenuItemIcon]", "*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_disableRipple: unknown;
}

export declare class MatMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatMenuModule, never, [typeof i1.MatRippleModule, typeof i1.MatCommonModule, typeof i2.OverlayModule, typeof i3.MatMenu, typeof i4.MatMenuItem, typeof i5.MatMenuContent, typeof i6.MatMenuTrigger], [typeof i7.CdkScrollableModule, typeof i3.MatMenu, typeof i1.MatCommonModule, typeof i4.MatMenuItem, typeof i5.MatMenuContent, typeof i6.MatMenuTrigger]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatMenuModule>;
}

/**
 * Interface for a custom menu panel that can be used with `matMenuTriggerFor`.
 * @docs-private
 */
export declare interface MatMenuPanel<T = any> {
    xPosition: MenuPositionX;
    yPosition: MenuPositionY;
    overlapTrigger: boolean;
    templateRef: TemplateRef<any>;
    readonly close: EventEmitter<void | 'click' | 'keydown' | 'tab'>;
    parentMenu?: MatMenuPanel | undefined;
    direction?: Direction;
    focusFirstItem: (origin?: FocusOrigin) => void;
    resetActiveItem: () => void;
    setPositionClasses?: (x: MenuPositionX, y: MenuPositionY) => void;
    /**
     * @deprecated No longer used and will be removed.
     * @breaking-change 21.0.0
     */
    setElevation?(depth: number): void;
    lazyContent?: MatMenuContent;
    backdropClass?: string;
    overlayPanelClass?: string | string[];
    hasBackdrop?: boolean;
    readonly panelId?: string;
    /**
     * @deprecated To be removed.
     * @breaking-change 8.0.0
     */
    addItem?: (item: T) => void;
    /**
     * @deprecated To be removed.
     * @breaking-change 8.0.0
     */
    removeItem?: (item: T) => void;
}

/** Directive applied to an element that should trigger a `mat-menu`. */
export declare class MatMenuTrigger implements AfterContentInit, OnDestroy {
    private _overlay;
    private _element;
    private _viewContainerRef;
    private _menuItemInstance;
    private _dir;
    private _focusMonitor;
    private _ngZone;
    private _scrollStrategy;
    private _changeDetectorRef;
    private _portal;
    private _overlayRef;
    private _menuOpen;
    private _closingActionsSubscription;
    private _hoverSubscription;
    private _menuCloseSubscription;
    private _pendingRemoval;
    /**
     * We're specifically looking for a `MatMenu` here since the generic `MatMenuPanel`
     * interface lacks some functionality around nested menus and animations.
     */
    private _parentMaterialMenu;
    /**
     * Cached value of the padding of the parent menu panel.
     * Used to offset sub-menus to compensate for the padding.
     */
    private _parentInnerPadding;
    /**
     * Handles touch start events on the trigger.
     * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
     */
    private _handleTouchStart;
    _openedBy: Exclude<FocusOrigin, 'program' | null> | undefined;
    /**
     * @deprecated
     * @breaking-change 8.0.0
     */
    get _deprecatedMatMenuTriggerFor(): MatMenuPanel | null;
    set _deprecatedMatMenuTriggerFor(v: MatMenuPanel | null);
    /** References the menu instance that the trigger is associated with. */
    get menu(): MatMenuPanel | null;
    set menu(menu: MatMenuPanel | null);
    private _menu;
    /** Data to be passed along to any lazily-rendered content. */
    menuData: any;
    /**
     * Whether focus should be restored when the menu is closed.
     * Note that disabling this option can have accessibility implications
     * and it's up to you to manage focus, if you decide to turn it off.
     */
    restoreFocus: boolean;
    /** Event emitted when the associated menu is opened. */
    readonly menuOpened: EventEmitter<void>;
    /**
     * Event emitted when the associated menu is opened.
     * @deprecated Switch to `menuOpened` instead
     * @breaking-change 8.0.0
     */
    readonly onMenuOpen: EventEmitter<void>;
    /** Event emitted when the associated menu is closed. */
    readonly menuClosed: EventEmitter<void>;
    /**
     * Event emitted when the associated menu is closed.
     * @deprecated Switch to `menuClosed` instead
     * @breaking-change 8.0.0
     */
    readonly onMenuClose: EventEmitter<void>;
    constructor(...args: unknown[]);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Whether the menu is open. */
    get menuOpen(): boolean;
    /** The text direction of the containing app. */
    get dir(): Direction;
    /** Whether the menu triggers a sub-menu or a top-level one. */
    triggersSubmenu(): boolean;
    /** Toggles the menu between the open and closed states. */
    toggleMenu(): void;
    /** Opens the menu. */
    openMenu(): void;
    /** Closes the menu. */
    closeMenu(): void;
    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    /**
     * Updates the position of the menu to ensure that it fits all options within the viewport.
     */
    updatePosition(): void;
    /** Closes the menu and does the necessary cleanup. */
    private _destroyMenu;
    private _setIsMenuOpen;
    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    private _createOverlay;
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    private _getOverlayConfig;
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions;
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    private _setPosition;
    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    private _menuClosingActions;
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event: MouseEvent): void;
    /** Handles key presses on the trigger. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Handles click events on the trigger. */
    _handleClick(event: MouseEvent): void;
    /** Handles the cases where the user hovers over the trigger. */
    private _handleHover;
    /** Gets the portal that should be attached to the overlay. */
    private _getPortal;
    /**
     * Determines whether the trigger owns a specific menu panel, at the current point in time.
     * This allows us to distinguish the case where the same panel is passed into multiple triggers
     * and multiple are open at a time.
     */
    private _ownsMenu;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMenuTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatMenuTrigger, "[mat-menu-trigger-for], [matMenuTriggerFor]", ["matMenuTrigger"], { "_deprecatedMatMenuTriggerFor": { "alias": "mat-menu-trigger-for"; "required": false; }; "menu": { "alias": "matMenuTriggerFor"; "required": false; }; "menuData": { "alias": "matMenuTriggerData"; "required": false; }; "restoreFocus": { "alias": "matMenuTriggerRestoreFocus"; "required": false; }; }, { "menuOpened": "menuOpened"; "onMenuOpen": "onMenuOpen"; "menuClosed": "menuClosed"; "onMenuClose": "onMenuClose"; }, never, never, true, never>;
}

/**
 * Default top padding of the menu panel.
 * @deprecated No longer being used. Will be removed.
 * @breaking-change 15.0.0
 */
export declare const MENU_PANEL_TOP_PADDING = 8;

/** Reason why the menu was closed. */
export declare type MenuCloseReason = void | 'click' | 'keydown' | 'tab';


export declare type MenuPositionX = 'before' | 'after';

export declare type MenuPositionY = 'above' | 'below';

/**
 * @deprecated
 * @breaking-change 8.0.0
 * @docs-private
 */
export declare const transformMenu: AnimationTriggerMetadata;

export { }
