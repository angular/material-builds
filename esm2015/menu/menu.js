/**
 * @fileoverview added by tsickle
 * Generated from: src/material/menu/menu.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, UP_ARROW, HOME, END, hasModifierKey, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Output, TemplateRef, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { matMenuAnimations } from './menu-animations';
import { MatMenuContent } from './menu-content';
import { throwMatMenuInvalidPositionX, throwMatMenuInvalidPositionY } from './menu-errors';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
/**
 * Default `mat-menu` options that can be overridden.
 * @record
 */
export function MatMenuDefaultOptions() { }
if (false) {
    /**
     * The x-axis position of the menu.
     * @type {?}
     */
    MatMenuDefaultOptions.prototype.xPosition;
    /**
     * The y-axis position of the menu.
     * @type {?}
     */
    MatMenuDefaultOptions.prototype.yPosition;
    /**
     * Whether the menu should overlap the menu trigger.
     * @type {?}
     */
    MatMenuDefaultOptions.prototype.overlapTrigger;
    /**
     * Class to be applied to the menu's backdrop.
     * @type {?}
     */
    MatMenuDefaultOptions.prototype.backdropClass;
    /**
     * Whether the menu has a backdrop.
     * @type {?|undefined}
     */
    MatMenuDefaultOptions.prototype.hasBackdrop;
}
/**
 * Injection token to be used to override the default options for `mat-menu`.
 * @type {?}
 */
export const MAT_MENU_DEFAULT_OPTIONS = new InjectionToken('mat-menu-default-options', {
    providedIn: 'root',
    factory: MAT_MENU_DEFAULT_OPTIONS_FACTORY
});
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_MENU_DEFAULT_OPTIONS_FACTORY() {
    return {
        overlapTrigger: false,
        xPosition: 'after',
        yPosition: 'below',
        backdropClass: 'cdk-overlay-transparent-backdrop',
    };
}
/**
 * Start elevation for the menu panel.
 * \@docs-private
 * @type {?}
 */
const MAT_MENU_BASE_ELEVATION = 4;
/** @type {?} */
let menuPanelUid = 0;
/**
 * Base class with all of the `MatMenu` functionality.
 */
// tslint:disable-next-line:class-name
export class _MatMenuBase {
    /**
     * @param {?} _elementRef
     * @param {?} _ngZone
     * @param {?} _defaultOptions
     */
    constructor(_elementRef, _ngZone, _defaultOptions) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
        this._xPosition = this._defaultOptions.xPosition;
        this._yPosition = this._defaultOptions.yPosition;
        /**
         * Only the direct descendant menu items.
         */
        this._directDescendantItems = new QueryList();
        /**
         * Subscription to tab events on the menu panel
         */
        this._tabSubscription = Subscription.EMPTY;
        /**
         * Config object to be passed into the menu's ngClass
         */
        this._classList = {};
        /**
         * Current state of the panel animation.
         */
        this._panelAnimationState = 'void';
        /**
         * Emits whenever an animation on the menu completes.
         */
        this._animationDone = new Subject();
        /**
         * Class to be added to the backdrop element.
         */
        this.backdropClass = this._defaultOptions.backdropClass;
        this._overlapTrigger = this._defaultOptions.overlapTrigger;
        this._hasBackdrop = this._defaultOptions.hasBackdrop;
        /**
         * Event emitted when the menu is closed.
         */
        this.closed = new EventEmitter();
        /**
         * Event emitted when the menu is closed.
         * @deprecated Switch to `closed` instead
         * \@breaking-change 8.0.0
         */
        this.close = this.closed;
        this.panelId = `mat-menu-panel-${menuPanelUid++}`;
    }
    /**
     * Position of the menu in the X axis.
     * @return {?}
     */
    get xPosition() { return this._xPosition; }
    /**
     * @param {?} value
     * @return {?}
     */
    set xPosition(value) {
        if (value !== 'before' && value !== 'after') {
            throwMatMenuInvalidPositionX();
        }
        this._xPosition = value;
        this.setPositionClasses();
    }
    /**
     * Position of the menu in the Y axis.
     * @return {?}
     */
    get yPosition() { return this._yPosition; }
    /**
     * @param {?} value
     * @return {?}
     */
    set yPosition(value) {
        if (value !== 'above' && value !== 'below') {
            throwMatMenuInvalidPositionY();
        }
        this._yPosition = value;
        this.setPositionClasses();
    }
    /**
     * Whether the menu should overlap its trigger.
     * @return {?}
     */
    get overlapTrigger() { return this._overlapTrigger; }
    /**
     * @param {?} value
     * @return {?}
     */
    set overlapTrigger(value) {
        this._overlapTrigger = coerceBooleanProperty(value);
    }
    /**
     * Whether the menu has a backdrop.
     * @return {?}
     */
    get hasBackdrop() { return this._hasBackdrop; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param {?} classes list of class names
     * @return {?}
     */
    set panelClass(classes) {
        /** @type {?} */
        const previousPanelClass = this._previousPanelClass;
        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((/**
             * @param {?} className
             * @return {?}
             */
            (className) => {
                this._classList[className] = false;
            }));
        }
        this._previousPanelClass = classes;
        if (classes && classes.length) {
            classes.split(' ').forEach((/**
             * @param {?} className
             * @return {?}
             */
            (className) => {
                this._classList[className] = true;
            }));
            this._elementRef.nativeElement.className = '';
        }
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @deprecated Use `panelClass` instead.
     * \@breaking-change 8.0.0
     * @return {?}
     */
    get classList() { return this.panelClass; }
    /**
     * @param {?} classes
     * @return {?}
     */
    set classList(classes) { this.panelClass = classes; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.setPositionClasses();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._updateDirectDescendants();
        this._keyManager = new FocusKeyManager(this._directDescendantItems).withWrap().withTypeAhead();
        this._tabSubscription = this._keyManager.tabOut.subscribe((/**
         * @return {?}
         */
        () => this.closed.emit('tab')));
        // If a user manually (programatically) focuses a menu item, we need to reflect that focus
        // change back to the key manager. Note that we don't need to unsubscribe here because _focused
        // is internal and we know that it gets completed on destroy.
        this._directDescendantItems.changes.pipe(startWith(this._directDescendantItems), switchMap((/**
         * @param {?} items
         * @return {?}
         */
        items => merge(...items.map((/**
         * @param {?} item
         * @return {?}
         */
        (item) => item._focused)))))).subscribe((/**
         * @param {?} focusedItem
         * @return {?}
         */
        focusedItem => this._keyManager.updateActiveItem(focusedItem)));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._directDescendantItems.destroy();
        this._tabSubscription.unsubscribe();
        this.closed.complete();
    }
    /**
     * Stream that emits whenever the hovered menu item changes.
     * @return {?}
     */
    _hovered() {
        // Coerce the `changes` property because Angular types it as `Observable<any>`
        /** @type {?} */
        const itemChanges = (/** @type {?} */ (this._directDescendantItems.changes));
        return (/** @type {?} */ (itemChanges.pipe(startWith(this._directDescendantItems), switchMap((/**
         * @param {?} items
         * @return {?}
         */
        items => merge(...items.map((/**
         * @param {?} item
         * @return {?}
         */
        (item) => item._hovered))))))));
    }
    /*
       * Registers a menu item with the menu.
       * @docs-private
       * @deprecated No longer being used. To be removed.
       * @breaking-change 9.0.0
       */
    /**
     * @param {?} _item
     * @return {?}
     */
    addItem(_item) { }
    /**
     * Removes an item from the menu.
     * \@docs-private
     * @deprecated No longer being used. To be removed.
     * \@breaking-change 9.0.0
     * @param {?} _item
     * @return {?}
     */
    removeItem(_item) { }
    /**
     * Handle a keyboard event from the menu, delegating to the appropriate action.
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        /** @type {?} */
        const keyCode = event.keyCode;
        /** @type {?} */
        const manager = this._keyManager;
        switch (keyCode) {
            case ESCAPE:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this.closed.emit('keydown');
                }
                break;
            case LEFT_ARROW:
                if (this.parentMenu && this.direction === 'ltr') {
                    this.closed.emit('keydown');
                }
                break;
            case RIGHT_ARROW:
                if (this.parentMenu && this.direction === 'rtl') {
                    this.closed.emit('keydown');
                }
                break;
            case HOME:
            case END:
                if (!hasModifierKey(event)) {
                    keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
                    event.preventDefault();
                }
                break;
            default:
                if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
                    manager.setFocusOrigin('keyboard');
                }
                manager.onKeydown(event);
        }
    }
    /**
     * Focus the first item in the menu.
     * @param {?=} origin Action from which the focus originated. Used to set the correct styling.
     * @return {?}
     */
    focusFirstItem(origin = 'program') {
        // When the content is rendered lazily, it takes a bit before the items are inside the DOM.
        if (this.lazyContent) {
            this._ngZone.onStable.asObservable()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => this._focusFirstItem(origin)));
        }
        else {
            this._focusFirstItem(origin);
        }
    }
    /**
     * Actual implementation that focuses the first item. Needs to be separated
     * out so we don't repeat the same logic in the public `focusFirstItem` method.
     * @private
     * @param {?} origin
     * @return {?}
     */
    _focusFirstItem(origin) {
        /** @type {?} */
        const manager = this._keyManager;
        manager.setFocusOrigin(origin).setFirstItemActive();
        // If there's no active item at this point, it means that all the items are disabled.
        // Move focus to the menu panel so keyboard events like Escape still work. Also this will
        // give _some_ feedback to screen readers.
        if (!manager.activeItem && this._directDescendantItems.length) {
            /** @type {?} */
            let element = this._directDescendantItems.first._getHostElement().parentElement;
            // Because the `mat-menu` is at the DOM insertion point, not inside the overlay, we don't
            // have a nice way of getting a hold of the menu panel. We can't use a `ViewChild` either
            // because the panel is inside an `ng-template`. We work around it by starting from one of
            // the items and walking up the DOM.
            while (element) {
                if (element.getAttribute('role') === 'menu') {
                    element.focus();
                    break;
                }
                else {
                    element = element.parentElement;
                }
            }
        }
    }
    /**
     * Resets the active item in the menu. This is used when the menu is opened, allowing
     * the user to start from the first option when pressing the down arrow.
     * @return {?}
     */
    resetActiveItem() {
        this._keyManager.setActiveItem(-1);
    }
    /**
     * Sets the menu panel elevation.
     * @param {?} depth Number of parent menus that come before the menu.
     * @return {?}
     */
    setElevation(depth) {
        // The elevation starts at the base and increases by one for each level.
        // Capped at 24 because that's the maximum elevation defined in the Material design spec.
        /** @type {?} */
        const elevation = Math.min(MAT_MENU_BASE_ELEVATION + depth, 24);
        /** @type {?} */
        const newElevation = `mat-elevation-z${elevation}`;
        /** @type {?} */
        const customElevation = Object.keys(this._classList).find((/**
         * @param {?} c
         * @return {?}
         */
        c => c.startsWith('mat-elevation-z')));
        if (!customElevation || customElevation === this._previousElevation) {
            if (this._previousElevation) {
                this._classList[this._previousElevation] = false;
            }
            this._classList[newElevation] = true;
            this._previousElevation = newElevation;
        }
    }
    /**
     * Adds classes to the menu panel based on its position. Can be used by
     * consumers to add specific styling based on the position.
     * \@docs-private
     * @param {?=} posX Position of the menu along the x axis.
     * @param {?=} posY Position of the menu along the y axis.
     * @return {?}
     */
    setPositionClasses(posX = this.xPosition, posY = this.yPosition) {
        /** @type {?} */
        const classes = this._classList;
        classes['mat-menu-before'] = posX === 'before';
        classes['mat-menu-after'] = posX === 'after';
        classes['mat-menu-above'] = posY === 'above';
        classes['mat-menu-below'] = posY === 'below';
    }
    /**
     * Starts the enter animation.
     * @return {?}
     */
    _startAnimation() {
        // @breaking-change 8.0.0 Combine with _resetAnimation.
        this._panelAnimationState = 'enter';
    }
    /**
     * Resets the panel animation to its initial state.
     * @return {?}
     */
    _resetAnimation() {
        // @breaking-change 8.0.0 Combine with _startAnimation.
        this._panelAnimationState = 'void';
    }
    /**
     * Callback that is invoked when the panel animation completes.
     * @param {?} event
     * @return {?}
     */
    _onAnimationDone(event) {
        this._animationDone.next(event);
        this._isAnimating = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onAnimationStart(event) {
        this._isAnimating = true;
        // Scroll the content element to the top as soon as the animation starts. This is necessary,
        // because we move focus to the first item while it's still being animated, which can throw
        // the browser off when it determines the scroll position. Alternatively we can move focus
        // when the animation is done, however moving focus asynchronously will interrupt screen
        // readers which are in the process of reading out the menu already. We take the `element`
        // from the `event` since we can't use a `ViewChild` to access the pane.
        if (event.toState === 'enter' && this._keyManager.activeItemIndex === 0) {
            event.element.scrollTop = 0;
        }
    }
    /**
     * Sets up a stream that will keep track of any newly-added menu items and will update the list
     * of direct descendants. We collect the descendants this way, because `_allItems` can include
     * items that are part of child menus, and using a custom way of registering items is unreliable
     * when it comes to maintaining the item order.
     * @private
     * @return {?}
     */
    _updateDirectDescendants() {
        this._allItems.changes
            .pipe(startWith(this._allItems))
            .subscribe((/**
         * @param {?} items
         * @return {?}
         */
        (items) => {
            this._directDescendantItems.reset(items.filter((/**
             * @param {?} item
             * @return {?}
             */
            item => item._parentMenu === this)));
            this._directDescendantItems.notifyOnChanges();
        }));
    }
}
_MatMenuBase.decorators = [
    { type: Directive }
];
/** @nocollapse */
_MatMenuBase.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_DEFAULT_OPTIONS,] }] }
];
_MatMenuBase.propDecorators = {
    _allItems: [{ type: ContentChildren, args: [MatMenuItem, { descendants: true },] }],
    backdropClass: [{ type: Input }],
    ariaLabel: [{ type: Input, args: ['aria-label',] }],
    ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
    ariaDescribedby: [{ type: Input, args: ['aria-describedby',] }],
    xPosition: [{ type: Input }],
    yPosition: [{ type: Input }],
    templateRef: [{ type: ViewChild, args: [TemplateRef,] }],
    items: [{ type: ContentChildren, args: [MatMenuItem, { descendants: false },] }],
    lazyContent: [{ type: ContentChild, args: [MatMenuContent,] }],
    overlapTrigger: [{ type: Input }],
    hasBackdrop: [{ type: Input }],
    panelClass: [{ type: Input, args: ['class',] }],
    classList: [{ type: Input }],
    closed: [{ type: Output }],
    close: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._keyManager;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._xPosition;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._yPosition;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._previousElevation;
    /**
     * All items inside the menu. Includes items nested inside another menu.
     * @type {?}
     */
    _MatMenuBase.prototype._allItems;
    /**
     * Only the direct descendant menu items.
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._directDescendantItems;
    /**
     * Subscription to tab events on the menu panel
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._tabSubscription;
    /**
     * Config object to be passed into the menu's ngClass
     * @type {?}
     */
    _MatMenuBase.prototype._classList;
    /**
     * Current state of the panel animation.
     * @type {?}
     */
    _MatMenuBase.prototype._panelAnimationState;
    /**
     * Emits whenever an animation on the menu completes.
     * @type {?}
     */
    _MatMenuBase.prototype._animationDone;
    /**
     * Whether the menu is animating.
     * @type {?}
     */
    _MatMenuBase.prototype._isAnimating;
    /**
     * Parent menu of the current menu panel.
     * @type {?}
     */
    _MatMenuBase.prototype.parentMenu;
    /**
     * Layout direction of the menu.
     * @type {?}
     */
    _MatMenuBase.prototype.direction;
    /**
     * Class to be added to the backdrop element.
     * @type {?}
     */
    _MatMenuBase.prototype.backdropClass;
    /**
     * aria-label for the menu panel.
     * @type {?}
     */
    _MatMenuBase.prototype.ariaLabel;
    /**
     * aria-labelledby for the menu panel.
     * @type {?}
     */
    _MatMenuBase.prototype.ariaLabelledby;
    /**
     * aria-describedby for the menu panel.
     * @type {?}
     */
    _MatMenuBase.prototype.ariaDescribedby;
    /**
     * \@docs-private
     * @type {?}
     */
    _MatMenuBase.prototype.templateRef;
    /**
     * List of the items inside of a menu.
     * @deprecated
     * \@breaking-change 8.0.0
     * @type {?}
     */
    _MatMenuBase.prototype.items;
    /**
     * Menu content that will be rendered lazily.
     * \@docs-private
     * @type {?}
     */
    _MatMenuBase.prototype.lazyContent;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._overlapTrigger;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._hasBackdrop;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._previousPanelClass;
    /**
     * Event emitted when the menu is closed.
     * @type {?}
     */
    _MatMenuBase.prototype.closed;
    /**
     * Event emitted when the menu is closed.
     * @deprecated Switch to `closed` instead
     * \@breaking-change 8.0.0
     * @type {?}
     */
    _MatMenuBase.prototype.close;
    /** @type {?} */
    _MatMenuBase.prototype.panelId;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    _MatMenuBase.prototype._defaultOptions;
}
/**
 * \@docs-private We show the "_MatMenu" class as "MatMenu" in the docs.
 */
export class MatMenu extends _MatMenuBase {
}
MatMenu.decorators = [
    { type: Directive }
];
// Note on the weird inheritance setup: we need three classes, because the MDC-based menu has to
// extend `MatMenu`, however keeping a reference to it will cause the inlined template and styles
// to be retained as well. The MDC menu also has to provide itself as a `MatMenu` in order for
// queries and DI to work correctly, while still not referencing the actual menu class.
// Class responsibility is split up as follows:
// * _MatMenuBase - provides all the functionality without any of the Angular metadata.
// * MatMenu - keeps the same name symbol name as the current menu and
// is used as a provider for DI and query purposes.
// * _MatMenu - the actual menu component implementation with the Angular metadata that should
// be tree shaken away for MDC.
/**
 * \@docs-public MatMenu
 */
// tslint:disable-next-line:class-name
export class _MatMenu extends MatMenu {
    /**
     * @param {?} elementRef
     * @param {?} ngZone
     * @param {?} defaultOptions
     */
    constructor(elementRef, ngZone, defaultOptions) {
        super(elementRef, ngZone, defaultOptions);
    }
}
_MatMenu.decorators = [
    { type: Component, args: [{
                selector: 'mat-menu',
                template: "<ng-template>\n  <div\n    class=\"mat-menu-panel\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                exportAs: 'matMenu',
                animations: [
                    matMenuAnimations.transformMenu,
                    matMenuAnimations.fadeInItems
                ],
                providers: [
                    { provide: MAT_MENU_PANEL, useExisting: MatMenu },
                    { provide: MatMenu, useExisting: _MatMenu }
                ],
                styles: [".mat-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh - 48px);border-radius:4px;outline:0;min-height:64px}.mat-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-menu-panel{outline:solid 1px}.mat-menu-content:not(:empty){padding-top:8px;padding-bottom:8px}.mat-menu-item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative}.mat-menu-item::-moz-focus-inner{border:0}.mat-menu-item[disabled]{cursor:default}[dir=rtl] .mat-menu-item{text-align:right}.mat-menu-item .mat-icon{margin-right:16px;vertical-align:middle}.mat-menu-item .mat-icon svg{vertical-align:top}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px;margin-right:0}.mat-menu-item[disabled]{pointer-events:none}.cdk-high-contrast-active .mat-menu-item.cdk-program-focused,.cdk-high-contrast-active .mat-menu-item.cdk-keyboard-focused,.cdk-high-contrast-active .mat-menu-item-highlighted{outline:dotted 1px}.mat-menu-item-submenu-trigger{padding-right:32px}.mat-menu-item-submenu-trigger::after{width:0;height:0;border-style:solid;border-width:5px 0 5px 5px;border-color:transparent transparent transparent currentColor;content:\"\";display:inline-block;position:absolute;top:50%;right:16px;transform:translateY(-50%)}[dir=rtl] .mat-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}[dir=rtl] .mat-menu-item-submenu-trigger::after{right:auto;left:16px;transform:rotateY(180deg) translateY(-50%)}button.mat-menu-item{width:100%}.mat-menu-item .mat-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
            }] }
];
/** @nocollapse */
_MatMenu.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_DEFAULT_OPTIONS,] }] }
];
if (false) {
    /** @type {?} */
    _MatMenu.ngAcceptInputType_overlapTrigger;
    /** @type {?} */
    _MatMenu.ngAcceptInputType_hasBackdrop;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLElBQUksRUFDSixHQUFHLEVBQ0gsY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBQyw0QkFBNEIsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQWUsTUFBTSxjQUFjLENBQUM7Ozs7O0FBSTFELDJDQWVD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Ozs7O0lBSXBDLDBDQUFzRDs7SUFDdEQsdUNBQW1EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBFU0NBUEUsXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgSE9NRSxcbiAgRU5ELFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRNZW51QW5pbWF0aW9uc30gZnJvbSAnLi9tZW51LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtbWVudWAuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPignbWF0LW1lbnUtZGVmYXVsdC1vcHRpb25zJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUllcbiAgICB9KTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIG92ZXJsYXBUcmlnZ2VyOiBmYWxzZSxcbiAgICB4UG9zaXRpb246ICdhZnRlcicsXG4gICAgeVBvc2l0aW9uOiAnYmVsb3cnLFxuICAgIGJhY2tkcm9wQ2xhc3M6ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gIH07XG59XG4vKipcbiAqIFN0YXJ0IGVsZXZhdGlvbiBmb3IgdGhlIG1lbnUgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IE1BVF9NRU5VX0JBU0VfRUxFVkFUSU9OID0gNDtcblxubGV0IG1lbnVQYW5lbFVpZCA9IDA7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0TWVudWAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0TWVudUJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LCBPbkluaXQsXG4gIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT47XG4gIHByaXZhdGUgX3hQb3NpdGlvbjogTWVudVBvc2l0aW9uWCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfeVBvc2l0aW9uOiBNZW51UG9zaXRpb25ZID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueVBvc2l0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBBbGwgaXRlbXMgaW5zaWRlIHRoZSBtZW51LiBJbmNsdWRlcyBpdGVtcyBuZXN0ZWQgaW5zaWRlIGFub3RoZXIgbWVudS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2FsbEl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKiBPbmx5IHRoZSBkaXJlY3QgZGVzY2VuZGFudCBtZW51IGl0ZW1zLiAqL1xuICBwcml2YXRlIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGFiIGV2ZW50cyBvbiB0aGUgbWVudSBwYW5lbCAqL1xuICBwcml2YXRlIF90YWJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIG1lbnUncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3AgZWxlbWVudC4gKi9cbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcblxuICAvKiogYXJpYS1sYWJlbCBmb3IgdGhlIG1lbnUgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtZGVzY3JpYmVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHhQb3NpdGlvbigpOiBNZW51UG9zaXRpb25YIHsgcmV0dXJuIHRoaXMuX3hQb3NpdGlvbjsgfVxuICBzZXQgeFBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25YKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYmVmb3JlJyAmJiB2YWx1ZSAhPT0gJ2FmdGVyJykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCgpO1xuICAgIH1cbiAgICB0aGlzLl94UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB5UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWSB7IHJldHVybiB0aGlzLl95UG9zaXRpb247IH1cbiAgc2V0IHlQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWSkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2Fib3ZlJyAmJiB2YWx1ZSAhPT0gJ2JlbG93Jykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWSgpO1xuICAgIH1cbiAgICB0aGlzLl95UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdGhlIGl0ZW1zIGluc2lkZSBvZiBhIG1lbnUuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogZmFsc2V9KSBpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKipcbiAgICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTWF0TWVudUNvbnRlbnQpIGxhenlDb250ZW50OiBNYXRNZW51Q29udGVudDtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCBpdHMgdHJpZ2dlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG92ZXJsYXBUcmlnZ2VyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcFRyaWdnZXI7IH1cbiAgc2V0IG92ZXJsYXBUcmlnZ2VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcFRyaWdnZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXBUcmlnZ2VyOiBib29sZWFuID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuX2hhc0JhY2tkcm9wOyB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2hhc0JhY2tkcm9wID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oYXNCYWNrZHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c1BhbmVsQ2xhc3MgPSB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3M7XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucGFuZWxDbGFzczsgfVxuICBzZXQgY2xhc3NMaXN0KGNsYXNzZXM6IHN0cmluZykgeyB0aGlzLnBhbmVsQ2xhc3MgPSBjbGFzc2VzOyB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgY2xvc2VkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBjbG9zZTogRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLndpdGhXcmFwKCkud2l0aFR5cGVBaGVhZCgpO1xuICAgIHRoaXMuX3RhYlN1YnNjcmlwdGlvbiA9IHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlZC5lbWl0KCd0YWInKSk7XG5cbiAgICAvLyBJZiBhIHVzZXIgbWFudWFsbHkgKHByb2dyYW1hdGljYWxseSkgZm9jdXNlcyBhIG1lbnUgaXRlbSwgd2UgbmVlZCB0byByZWZsZWN0IHRoYXQgZm9jdXNcbiAgICAvLyBjaGFuZ2UgYmFjayB0byB0aGUga2V5IG1hbmFnZXIuIE5vdGUgdGhhdCB3ZSBkb24ndCBuZWVkIHRvIHVuc3Vic2NyaWJlIGhlcmUgYmVjYXVzZSBfZm9jdXNlZFxuICAgIC8vIGlzIGludGVybmFsIGFuZCB3ZSBrbm93IHRoYXQgaXQgZ2V0cyBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2U8TWF0TWVudUl0ZW0+KC4uLml0ZW1zLm1hcCgoaXRlbTogTWF0TWVudUl0ZW0pID0+IGl0ZW0uX2ZvY3VzZWQpKSlcbiAgICApLnN1YnNjcmliZShmb2N1c2VkSXRlbSA9PiB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oZm9jdXNlZEl0ZW0pKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5kZXN0cm95KCk7XG4gICAgdGhpcy5fdGFiU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jbG9zZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgaG92ZXJlZCBtZW51IGl0ZW0gY2hhbmdlcy4gKi9cbiAgX2hvdmVyZWQoKTogT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT4ge1xuICAgIC8vIENvZXJjZSB0aGUgYGNoYW5nZXNgIHByb3BlcnR5IGJlY2F1c2UgQW5ndWxhciB0eXBlcyBpdCBhcyBgT2JzZXJ2YWJsZTxhbnk+YFxuICAgIGNvbnN0IGl0ZW1DaGFuZ2VzID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmNoYW5nZXMgYXMgT2JzZXJ2YWJsZTxRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+PjtcbiAgICByZXR1cm4gaXRlbUNoYW5nZXMucGlwZShcbiAgICAgIHN0YXJ0V2l0aCh0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLFxuICAgICAgc3dpdGNoTWFwKGl0ZW1zID0+IG1lcmdlKC4uLml0ZW1zLm1hcCgoaXRlbTogTWF0TWVudUl0ZW0pID0+IGl0ZW0uX2hvdmVyZWQpKSlcbiAgICApIGFzIE9ic2VydmFibGU8TWF0TWVudUl0ZW0+O1xuICB9XG5cbiAgLypcbiAgICogUmVnaXN0ZXJzIGEgbWVudSBpdGVtIHdpdGggdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIGFkZEl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgcmVtb3ZlSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIG1lbnUsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAnbHRyJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBrZXlDb2RlID09PSBIT01FID8gbWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKSA6IG1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbigna2V5Ym9hcmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBvcmlnaW4gQWN0aW9uIGZyb20gd2hpY2ggdGhlIGZvY3VzIG9yaWdpbmF0ZWQuIFVzZWQgdG8gc2V0IHRoZSBjb3JyZWN0IHN0eWxpbmcuXG4gICAqL1xuICBmb2N1c0ZpcnN0SXRlbShvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTogdm9pZCB7XG4gICAgLy8gV2hlbiB0aGUgY29udGVudCBpcyByZW5kZXJlZCBsYXppbHksIGl0IHRha2VzIGEgYml0IGJlZm9yZSB0aGUgaXRlbXMgYXJlIGluc2lkZSB0aGUgRE9NLlxuICAgIGlmICh0aGlzLmxhenlDb250ZW50KSB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9mb2N1c0ZpcnN0SXRlbShvcmlnaW4pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZm9jdXNGaXJzdEl0ZW0ob3JpZ2luKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWN0dWFsIGltcGxlbWVudGF0aW9uIHRoYXQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbS4gTmVlZHMgdG8gYmUgc2VwYXJhdGVkXG4gICAqIG91dCBzbyB3ZSBkb24ndCByZXBlYXQgdGhlIHNhbWUgbG9naWMgaW4gdGhlIHB1YmxpYyBgZm9jdXNGaXJzdEl0ZW1gIG1ldGhvZC5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzRmlyc3RJdGVtKG9yaWdpbjogRm9jdXNPcmlnaW4pIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4ob3JpZ2luKS5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcblxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gYWN0aXZlIGl0ZW0gYXQgdGhpcyBwb2ludCwgaXQgbWVhbnMgdGhhdCBhbGwgdGhlIGl0ZW1zIGFyZSBkaXNhYmxlZC5cbiAgICAvLyBNb3ZlIGZvY3VzIHRvIHRoZSBtZW51IHBhbmVsIHNvIGtleWJvYXJkIGV2ZW50cyBsaWtlIEVzY2FwZSBzdGlsbCB3b3JrLiBBbHNvIHRoaXMgd2lsbFxuICAgIC8vIGdpdmUgX3NvbWVfIGZlZWRiYWNrIHRvIHNjcmVlbiByZWFkZXJzLlxuICAgIGlmICghbWFuYWdlci5hY3RpdmVJdGVtICYmIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5sZW5ndGgpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmZpcnN0Ll9nZXRIb3N0RWxlbWVudCgpLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgIC8vIEJlY2F1c2UgdGhlIGBtYXQtbWVudWAgaXMgYXQgdGhlIERPTSBpbnNlcnRpb24gcG9pbnQsIG5vdCBpbnNpZGUgdGhlIG92ZXJsYXksIHdlIGRvbid0XG4gICAgICAvLyBoYXZlIGEgbmljZSB3YXkgb2YgZ2V0dGluZyBhIGhvbGQgb2YgdGhlIG1lbnUgcGFuZWwuIFdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIGVpdGhlclxuICAgICAgLy8gYmVjYXVzZSB0aGUgcGFuZWwgaXMgaW5zaWRlIGFuIGBuZy10ZW1wbGF0ZWAuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IHN0YXJ0aW5nIGZyb20gb25lIG9mXG4gICAgICAvLyB0aGUgaXRlbXMgYW5kIHdhbGtpbmcgdXAgdGhlIERPTS5cbiAgICAgIHdoaWxlIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnbWVudScpIHtcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGFjdGl2ZSBpdGVtIGluIHRoZSBtZW51LiBUaGlzIGlzIHVzZWQgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQsIGFsbG93aW5nXG4gICAqIHRoZSB1c2VyIHRvIHN0YXJ0IGZyb20gdGhlIGZpcnN0IG9wdGlvbiB3aGVuIHByZXNzaW5nIHRoZSBkb3duIGFycm93LlxuICAgKi9cbiAgcmVzZXRBY3RpdmVJdGVtKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWVudSBwYW5lbCBlbGV2YXRpb24uXG4gICAqIEBwYXJhbSBkZXB0aCBOdW1iZXIgb2YgcGFyZW50IG1lbnVzIHRoYXQgY29tZSBiZWZvcmUgdGhlIG1lbnUuXG4gICAqL1xuICBzZXRFbGV2YXRpb24oZGVwdGg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFRoZSBlbGV2YXRpb24gc3RhcnRzIGF0IHRoZSBiYXNlIGFuZCBpbmNyZWFzZXMgYnkgb25lIGZvciBlYWNoIGxldmVsLlxuICAgIC8vIENhcHBlZCBhdCAyNCBiZWNhdXNlIHRoYXQncyB0aGUgbWF4aW11bSBlbGV2YXRpb24gZGVmaW5lZCBpbiB0aGUgTWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAgY29uc3QgZWxldmF0aW9uID0gTWF0aC5taW4oTUFUX01FTlVfQkFTRV9FTEVWQVRJT04gKyBkZXB0aCwgMjQpO1xuICAgIGNvbnN0IG5ld0VsZXZhdGlvbiA9IGBtYXQtZWxldmF0aW9uLXoke2VsZXZhdGlvbn1gO1xuICAgIGNvbnN0IGN1c3RvbUVsZXZhdGlvbiA9IE9iamVjdC5rZXlzKHRoaXMuX2NsYXNzTGlzdCkuZmluZChjID0+IGMuc3RhcnRzV2l0aCgnbWF0LWVsZXZhdGlvbi16JykpO1xuXG4gICAgaWYgKCFjdXN0b21FbGV2YXRpb24gfHwgY3VzdG9tRWxldmF0aW9uID09PSB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xhc3NMaXN0W25ld0VsZXZhdGlvbl0gPSB0cnVlO1xuICAgICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3NlcyB0byB0aGUgbWVudSBwYW5lbCBiYXNlZCBvbiBpdHMgcG9zaXRpb24uIENhbiBiZSB1c2VkIGJ5XG4gICAqIGNvbnN1bWVycyB0byBhZGQgc3BlY2lmaWMgc3R5bGluZyBiYXNlZCBvbiB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NYIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSBwb3NZIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB5IGF4aXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3NYOiBNZW51UG9zaXRpb25YID0gdGhpcy54UG9zaXRpb24sIHBvc1k6IE1lbnVQb3NpdGlvblkgPSB0aGlzLnlQb3NpdGlvbikge1xuICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLl9jbGFzc0xpc3Q7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVmb3JlJ10gPSBwb3NYID09PSAnYmVmb3JlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hZnRlciddID0gcG9zWCA9PT0gJ2FmdGVyJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hYm92ZSddID0gcG9zWSA9PT0gJ2Fib3ZlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWxvdyddID0gcG9zWSA9PT0gJ2JlbG93JztcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGVudGVyIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9yZXNldEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHBhbmVsIGFuaW1hdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gKi9cbiAgX3Jlc2V0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9zdGFydEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBwYW5lbCBhbmltYXRpb24gY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dChldmVudCk7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgIC8vIFNjcm9sbCB0aGUgY29udGVudCBlbGVtZW50IHRvIHRoZSB0b3AgYXMgc29vbiBhcyB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gVGhpcyBpcyBuZWNlc3NhcnksXG4gICAgLy8gYmVjYXVzZSB3ZSBtb3ZlIGZvY3VzIHRvIHRoZSBmaXJzdCBpdGVtIHdoaWxlIGl0J3Mgc3RpbGwgYmVpbmcgYW5pbWF0ZWQsIHdoaWNoIGNhbiB0aHJvd1xuICAgIC8vIHRoZSBicm93c2VyIG9mZiB3aGVuIGl0IGRldGVybWluZXMgdGhlIHNjcm9sbCBwb3NpdGlvbi4gQWx0ZXJuYXRpdmVseSB3ZSBjYW4gbW92ZSBmb2N1c1xuICAgIC8vIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBob3dldmVyIG1vdmluZyBmb2N1cyBhc3luY2hyb25vdXNseSB3aWxsIGludGVycnVwdCBzY3JlZW5cbiAgICAvLyByZWFkZXJzIHdoaWNoIGFyZSBpbiB0aGUgcHJvY2VzcyBvZiByZWFkaW5nIG91dCB0aGUgbWVudSBhbHJlYWR5LiBXZSB0YWtlIHRoZSBgZWxlbWVudGBcbiAgICAvLyBmcm9tIHRoZSBgZXZlbnRgIHNpbmNlIHdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIHRvIGFjY2VzcyB0aGUgcGFuZS5cbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJyAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gMCkge1xuICAgICAgZXZlbnQuZWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIGEgc3RyZWFtIHRoYXQgd2lsbCBrZWVwIHRyYWNrIG9mIGFueSBuZXdseS1hZGRlZCBtZW51IGl0ZW1zIGFuZCB3aWxsIHVwZGF0ZSB0aGUgbGlzdFxuICAgKiBvZiBkaXJlY3QgZGVzY2VuZGFudHMuIFdlIGNvbGxlY3QgdGhlIGRlc2NlbmRhbnRzIHRoaXMgd2F5LCBiZWNhdXNlIGBfYWxsSXRlbXNgIGNhbiBpbmNsdWRlXG4gICAqIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgY2hpbGQgbWVudXMsIGFuZCB1c2luZyBhIGN1c3RvbSB3YXkgb2YgcmVnaXN0ZXJpbmcgaXRlbXMgaXMgdW5yZWxpYWJsZVxuICAgKiB3aGVuIGl0IGNvbWVzIHRvIG1haW50YWluaW5nIHRoZSBpdGVtIG9yZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKSB7XG4gICAgdGhpcy5fYWxsSXRlbXMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbEl0ZW1zKSlcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5yZXNldChpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9wYXJlbnRNZW51ID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlIFdlIHNob3cgdGhlIFwiX01hdE1lbnVcIiBjbGFzcyBhcyBcIk1hdE1lbnVcIiBpbiB0aGUgZG9jcy4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdE1lbnUgZXh0ZW5kcyBfTWF0TWVudUJhc2Uge31cblxuLy8gTm90ZSBvbiB0aGUgd2VpcmQgaW5oZXJpdGFuY2Ugc2V0dXA6IHdlIG5lZWQgdGhyZWUgY2xhc3NlcywgYmVjYXVzZSB0aGUgTURDLWJhc2VkIG1lbnUgaGFzIHRvXG4vLyBleHRlbmQgYE1hdE1lbnVgLCBob3dldmVyIGtlZXBpbmcgYSByZWZlcmVuY2UgdG8gaXQgd2lsbCBjYXVzZSB0aGUgaW5saW5lZCB0ZW1wbGF0ZSBhbmQgc3R5bGVzXG4vLyB0byBiZSByZXRhaW5lZCBhcyB3ZWxsLiBUaGUgTURDIG1lbnUgYWxzbyBoYXMgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgTWF0TWVudWAgaW4gb3JkZXIgZm9yXG4vLyBxdWVyaWVzIGFuZCBESSB0byB3b3JrIGNvcnJlY3RseSwgd2hpbGUgc3RpbGwgbm90IHJlZmVyZW5jaW5nIHRoZSBhY3R1YWwgbWVudSBjbGFzcy5cbi8vIENsYXNzIHJlc3BvbnNpYmlsaXR5IGlzIHNwbGl0IHVwIGFzIGZvbGxvd3M6XG4vLyAqIF9NYXRNZW51QmFzZSAtIHByb3ZpZGVzIGFsbCB0aGUgZnVuY3Rpb25hbGl0eSB3aXRob3V0IGFueSBvZiB0aGUgQW5ndWxhciBtZXRhZGF0YS5cbi8vICogTWF0TWVudSAtIGtlZXBzIHRoZSBzYW1lIG5hbWUgc3ltYm9sIG5hbWUgYXMgdGhlIGN1cnJlbnQgbWVudSBhbmRcbi8vIGlzIHVzZWQgYXMgYSBwcm92aWRlciBmb3IgREkgYW5kIHF1ZXJ5IHB1cnBvc2VzLlxuLy8gKiBfTWF0TWVudSAtIHRoZSBhY3R1YWwgbWVudSBjb21wb25lbnQgaW1wbGVtZW50YXRpb24gd2l0aCB0aGUgQW5ndWxhciBtZXRhZGF0YSB0aGF0IHNob3VsZFxuLy8gYmUgdHJlZSBzaGFrZW4gYXdheSBmb3IgTURDLlxuXG4vKiogQGRvY3MtcHVibGljIE1hdE1lbnUgKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICdtZW51Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnbWVudS5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0TWVudScsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRNZW51QW5pbWF0aW9ucy50cmFuc2Zvcm1NZW51LFxuICAgIG1hdE1lbnVBbmltYXRpb25zLmZhZGVJbkl0ZW1zXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNQVRfTUVOVV9QQU5FTCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnV9LFxuICAgIHtwcm92aWRlOiBNYXRNZW51LCB1c2VFeGlzdGluZzogX01hdE1lbnV9XG4gIF1cbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIF9NYXRNZW51IGV4dGVuZHMgTWF0TWVudSB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIG5nWm9uZTogTmdab25lLFxuICAgICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBuZ1pvbmUsIGRlZmF1bHRPcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vdmVybGFwVHJpZ2dlcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzQmFja2Ryb3A6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==