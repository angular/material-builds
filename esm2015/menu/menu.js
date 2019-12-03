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
                template: "<ng-template>\n  <div\n    class=\"mat-menu-panel\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\">\n    <div class=\"mat-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLElBQUksRUFDSixHQUFHLEVBQ0gsY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBQyw0QkFBNEIsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQWUsTUFBTSxjQUFjLENBQUM7Ozs7O0FBSTFELDJDQWVD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TUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7OztZQXRCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLDRmQUF3QjtnQkFFeEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsU0FBUztnQkFDbkIsVUFBVSxFQUFFO29CQUNWLGlCQUFpQixDQUFDLGFBQWE7b0JBQy9CLGlCQUFpQixDQUFDLFdBQVc7aUJBQzlCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQztvQkFDL0MsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7aUJBQzFDOzthQUNGOzs7O1lBamRDLFVBQVU7WUFLVixNQUFNOzRDQWlkRCxNQUFNLFNBQUMsd0JBQXdCOzs7O0lBSXBDLDBDQUE2RTs7SUFDN0UsdUNBQTBFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRVNDQVBFLFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgRE9XTl9BUlJPVyxcbiAgVVBfQVJST1csXG4gIEhPTUUsXG4gIEVORCxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0TWVudUFuaW1hdGlvbnN9IGZyb20gJy4vbWVudS1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0TWVudUNvbnRlbnR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7TWVudVBvc2l0aW9uWCwgTWVudVBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LXBvc2l0aW9ucyc7XG5pbXBvcnQge3Rocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgsIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvbll9IGZyb20gJy4vbWVudS1lcnJvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNQVRfTUVOVV9QQU5FTCwgTWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBEZWZhdWx0IGBtYXQtbWVudWAgb3B0aW9ucyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRNZW51RGVmYXVsdE9wdGlvbnMge1xuICAvKiogVGhlIHgtYXhpcyBwb3NpdGlvbiBvZiB0aGUgbWVudS4gKi9cbiAgeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuXG4gIC8qKiBUaGUgeS1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB5UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgdGhlIG1lbnUgdHJpZ2dlci4gKi9cbiAgb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW47XG5cbiAgLyoqIENsYXNzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIG1lbnUncyBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LW1lbnVgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdE1lbnVEZWZhdWx0T3B0aW9ucz4oJ21hdC1tZW51LWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0TWVudURlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBvdmVybGFwVHJpZ2dlcjogZmFsc2UsXG4gICAgeFBvc2l0aW9uOiAnYWZ0ZXInLFxuICAgIHlQb3NpdGlvbjogJ2JlbG93JyxcbiAgICBiYWNrZHJvcENsYXNzOiAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICB9O1xufVxuLyoqXG4gKiBTdGFydCBlbGV2YXRpb24gZm9yIHRoZSBtZW51IHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jb25zdCBNQVRfTUVOVV9CQVNFX0VMRVZBVElPTiA9IDQ7XG5cbmxldCBtZW51UGFuZWxVaWQgPSAwO1xuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdE1lbnVgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE1lbnVCYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPiwgT25Jbml0LFxuICBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0TWVudUl0ZW0+O1xuICBwcml2YXRlIF94UG9zaXRpb246IE1lbnVQb3NpdGlvblggPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy54UG9zaXRpb247XG4gIHByaXZhdGUgX3lQb3NpdGlvbjogTWVudVBvc2l0aW9uWSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnlQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfcHJldmlvdXNFbGV2YXRpb246IHN0cmluZztcblxuICAvKiogQWxsIGl0ZW1zIGluc2lkZSB0aGUgbWVudS4gSW5jbHVkZXMgaXRlbXMgbmVzdGVkIGluc2lkZSBhbm90aGVyIG1lbnUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9hbGxJdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKiogT25seSB0aGUgZGlyZWN0IGRlc2NlbmRhbnQgbWVudSBpdGVtcy4gKi9cbiAgcHJpdmF0ZSBfZGlyZWN0RGVzY2VuZGFudEl0ZW1zID0gbmV3IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRhYiBldmVudHMgb24gdGhlIG1lbnUgcGFuZWwgKi9cbiAgcHJpdmF0ZSBfdGFiU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBtZW51J3MgbmdDbGFzcyAqL1xuICBfY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcGFuZWwgYW5pbWF0aW9uLiAqL1xuICBfcGFuZWxBbmltYXRpb25TdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBtZW51IGNvbXBsZXRlcy4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBhbmltYXRpbmcuICovXG4gIF9pc0FuaW1hdGluZzogYm9vbGVhbjtcblxuICAvKiogUGFyZW50IG1lbnUgb2YgdGhlIGN1cnJlbnQgbWVudSBwYW5lbC4gKi9cbiAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIG9mIHRoZSBtZW51LiAqL1xuICBkaXJlY3Rpb246IERpcmVjdGlvbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB4UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWCB7IHJldHVybiB0aGlzLl94UG9zaXRpb247IH1cbiAgc2V0IHhQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWCkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2JlZm9yZScgJiYgdmFsdWUgIT09ICdhZnRlcicpIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgoKTtcbiAgICB9XG4gICAgdGhpcy5feFBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgbWVudSBpbiB0aGUgWSBheGlzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgeVBvc2l0aW9uKCk6IE1lbnVQb3NpdGlvblkgeyByZXR1cm4gdGhpcy5feVBvc2l0aW9uOyB9XG4gIHNldCB5UG9zaXRpb24odmFsdWU6IE1lbnVQb3NpdGlvblkpIHtcbiAgICBpZiAodmFsdWUgIT09ICdhYm92ZScgJiYgdmFsdWUgIT09ICdiZWxvdycpIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblkoKTtcbiAgICB9XG4gICAgdGhpcy5feVBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHRoZSBpdGVtcyBpbnNpZGUgb2YgYSBtZW51LlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE1lbnVJdGVtLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT47XG5cbiAgLyoqXG4gICAqIE1lbnUgY29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAQ29udGVudENoaWxkKE1hdE1lbnVDb250ZW50KSBsYXp5Q29udGVudDogTWF0TWVudUNvbnRlbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgaXRzIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBvdmVybGFwVHJpZ2dlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXBUcmlnZ2VyOyB9XG4gIHNldCBvdmVybGFwVHJpZ2dlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX292ZXJsYXBUcmlnZ2VyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9vdmVybGFwVHJpZ2dlcjogYm9vbGVhbiA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLm92ZXJsYXBUcmlnZ2VyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGFzQmFja2Ryb3AoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLl9oYXNCYWNrZHJvcDsgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9oYXNCYWNrZHJvcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGFzQmFja2Ryb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5oYXNCYWNrZHJvcDtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lbENsYXNzID0gdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzO1xuXG4gICAgaWYgKHByZXZpb3VzUGFuZWxDbGFzcyAmJiBwcmV2aW91c1BhbmVsQ2xhc3MubGVuZ3RoKSB7XG4gICAgICBwcmV2aW91c1BhbmVsQ2xhc3Muc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzID0gY2xhc3NlcztcblxuICAgIGlmIChjbGFzc2VzICYmIGNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBjbGFzc2VzLnNwbGl0KCcgJykuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcHJldmlvdXNQYW5lbENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1tZW51IGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogbWVudSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgbWVudSBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBwYW5lbENsYXNzYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xhc3NMaXN0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhbmVsQ2xhc3M7IH1cbiAgc2V0IGNsYXNzTGlzdChjbGFzc2VzOiBzdHJpbmcpIHsgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlczsgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJz4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYGNsb3NlZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgY2xvc2U6IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPiA9IHRoaXMuY2xvc2VkO1xuXG4gIHJlYWRvbmx5IHBhbmVsSWQgPSBgbWF0LW1lbnUtcGFuZWwtJHttZW51UGFuZWxVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoTUFUX01FTlVfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTWF0TWVudURlZmF1bHRPcHRpb25zKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3VwZGF0ZURpcmVjdERlc2NlbmRhbnRzKCk7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zKS53aXRoV3JhcCgpLndpdGhUeXBlQWhlYWQoKTtcbiAgICB0aGlzLl90YWJTdWJzY3JpcHRpb24gPSB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZWQuZW1pdCgndGFiJykpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmRlc3Ryb3koKTtcbiAgICB0aGlzLl90YWJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBob3ZlcmVkIG1lbnUgaXRlbSBjaGFuZ2VzLiAqL1xuICBfaG92ZXJlZCgpOiBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPiB7XG4gICAgLy8gQ29lcmNlIHRoZSBgY2hhbmdlc2AgcHJvcGVydHkgYmVjYXVzZSBBbmd1bGFyIHR5cGVzIGl0IGFzIGBPYnNlcnZhYmxlPGFueT5gXG4gICAgY29uc3QgaXRlbUNoYW5nZXMgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcyBhcyBPYnNlcnZhYmxlPFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4+O1xuICAgIHJldHVybiBpdGVtQ2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2UoLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5faG92ZXJlZCkpKVxuICAgICkgYXMgT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT47XG4gIH1cblxuICAvKlxuICAgKiBSZWdpc3RlcnMgYSBtZW51IGl0ZW0gd2l0aCB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgYWRkSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICByZW1vdmVJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKiogSGFuZGxlIGEga2V5Ym9hcmQgZXZlbnQgZnJvbSB0aGUgbWVudSwgZGVsZWdhdGluZyB0byB0aGUgYXBwcm9wcmlhdGUgYWN0aW9uLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdsdHInKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1cpIHtcbiAgICAgICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKCdrZXlib2FyZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1cyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgbWVudS5cbiAgICogQHBhcmFtIG9yaWdpbiBBY3Rpb24gZnJvbSB3aGljaCB0aGUgZm9jdXMgb3JpZ2luYXRlZC4gVXNlZCB0byBzZXQgdGhlIGNvcnJlY3Qgc3R5bGluZy5cbiAgICovXG4gIGZvY3VzRmlyc3RJdGVtKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScpOiB2b2lkIHtcbiAgICAvLyBXaGVuIHRoZSBjb250ZW50IGlzIHJlbmRlcmVkIGxhemlseSwgaXQgdGFrZXMgYSBiaXQgYmVmb3JlIHRoZSBpdGVtcyBhcmUgaW5zaWRlIHRoZSBET00uXG4gICAgaWYgKHRoaXMubGF6eUNvbnRlbnQpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2ZvY3VzRmlyc3RJdGVtKG9yaWdpbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9mb2N1c0ZpcnN0SXRlbShvcmlnaW4pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBY3R1YWwgaW1wbGVtZW50YXRpb24gdGhhdCBmb2N1c2VzIHRoZSBmaXJzdCBpdGVtLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWRcbiAgICogb3V0IHNvIHdlIGRvbid0IHJlcGVhdCB0aGUgc2FtZSBsb2dpYyBpbiB0aGUgcHVibGljIGBmb2N1c0ZpcnN0SXRlbWAgbWV0aG9kLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNGaXJzdEl0ZW0ob3JpZ2luOiBGb2N1c09yaWdpbikge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbihvcmlnaW4pLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuXG4gICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgIC8vIE1vdmUgZm9jdXMgdG8gdGhlIG1lbnUgcGFuZWwgc28ga2V5Ym9hcmQgZXZlbnRzIGxpa2UgRXNjYXBlIHN0aWxsIHdvcmsuIEFsc28gdGhpcyB3aWxsXG4gICAgLy8gZ2l2ZSBfc29tZV8gZmVlZGJhY2sgdG8gc2NyZWVuIHJlYWRlcnMuXG4gICAgaWYgKCFtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiYgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmxlbmd0aCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuZmlyc3QuX2dldEhvc3RFbGVtZW50KCkucGFyZW50RWxlbWVudDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgYG1hdC1tZW51YCBpcyBhdCB0aGUgRE9NIGluc2VydGlvbiBwb2ludCwgbm90IGluc2lkZSB0aGUgb3ZlcmxheSwgd2UgZG9uJ3RcbiAgICAgIC8vIGhhdmUgYSBuaWNlIHdheSBvZiBnZXR0aW5nIGEgaG9sZCBvZiB0aGUgbWVudSBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAvLyBiZWNhdXNlIHRoZSBwYW5lbCBpcyBpbnNpZGUgYW4gYG5nLXRlbXBsYXRlYC4gV2Ugd29yayBhcm91bmQgaXQgYnkgc3RhcnRpbmcgZnJvbSBvbmUgb2ZcbiAgICAgIC8vIHRoZSBpdGVtcyBhbmQgd2Fsa2luZyB1cCB0aGUgRE9NLlxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJykgPT09ICdtZW51Jykge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gaW4gdGhlIG1lbnUuIFRoaXMgaXMgdXNlZCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCwgYWxsb3dpbmdcbiAgICogdGhlIHVzZXIgdG8gc3RhcnQgZnJvbSB0aGUgZmlyc3Qgb3B0aW9uIHdoZW4gcHJlc3NpbmcgdGhlIGRvd24gYXJyb3cuXG4gICAqL1xuICByZXNldEFjdGl2ZUl0ZW0oKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtZW51IHBhbmVsIGVsZXZhdGlvbi5cbiAgICogQHBhcmFtIGRlcHRoIE51bWJlciBvZiBwYXJlbnQgbWVudXMgdGhhdCBjb21lIGJlZm9yZSB0aGUgbWVudS5cbiAgICovXG4gIHNldEVsZXZhdGlvbihkZXB0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIGVsZXZhdGlvbiBzdGFydHMgYXQgdGhlIGJhc2UgYW5kIGluY3JlYXNlcyBieSBvbmUgZm9yIGVhY2ggbGV2ZWwuXG4gICAgLy8gQ2FwcGVkIGF0IDI0IGJlY2F1c2UgdGhhdCdzIHRoZSBtYXhpbXVtIGVsZXZhdGlvbiBkZWZpbmVkIGluIHRoZSBNYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICBjb25zdCBlbGV2YXRpb24gPSBNYXRoLm1pbihNQVRfTUVOVV9CQVNFX0VMRVZBVElPTiArIGRlcHRoLCAyNCk7XG4gICAgY29uc3QgbmV3RWxldmF0aW9uID0gYG1hdC1lbGV2YXRpb24teiR7ZWxldmF0aW9ufWA7XG4gICAgY29uc3QgY3VzdG9tRWxldmF0aW9uID0gT2JqZWN0LmtleXModGhpcy5fY2xhc3NMaXN0KS5maW5kKGMgPT4gYy5zdGFydHNXaXRoKCdtYXQtZWxldmF0aW9uLXonKSk7XG5cbiAgICBpZiAoIWN1c3RvbUVsZXZhdGlvbiB8fCBjdXN0b21FbGV2YXRpb24gPT09IHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNFbGV2YXRpb24pIHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W3RoaXMuX3ByZXZpb3VzRWxldmF0aW9uXSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jbGFzc0xpc3RbbmV3RWxldmF0aW9uXSA9IHRydWU7XG4gICAgICB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbiA9IG5ld0VsZXZhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBjbGFzc2VzIHRvIHRoZSBtZW51IHBhbmVsIGJhc2VkIG9uIGl0cyBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnlcbiAgICogY29uc3VtZXJzIHRvIGFkZCBzcGVjaWZpYyBzdHlsaW5nIGJhc2VkIG9uIHRoZSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvc1ggUG9zaXRpb24gb2YgdGhlIG1lbnUgYWxvbmcgdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHBvc1kgUG9zaXRpb24gb2YgdGhlIG1lbnUgYWxvbmcgdGhlIHkgYXhpcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0UG9zaXRpb25DbGFzc2VzKHBvc1g6IE1lbnVQb3NpdGlvblggPSB0aGlzLnhQb3NpdGlvbiwgcG9zWTogTWVudVBvc2l0aW9uWSA9IHRoaXMueVBvc2l0aW9uKSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuX2NsYXNzTGlzdDtcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWZvcmUnXSA9IHBvc1ggPT09ICdiZWZvcmUnO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWFmdGVyJ10gPSBwb3NYID09PSAnYWZ0ZXInO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWFib3ZlJ10gPSBwb3NZID09PSAnYWJvdmUnO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWJlbG93J10gPSBwb3NZID09PSAnYmVsb3cnO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZW50ZXIgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3Jlc2V0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgcGFuZWwgYW5pbWF0aW9uIHRvIGl0cyBpbml0aWFsIHN0YXRlLiAqL1xuICBfcmVzZXRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3N0YXJ0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIHBhbmVsIGFuaW1hdGlvbiBjb21wbGV0ZXMuICovXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5uZXh0KGV2ZW50KTtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgLy8gU2Nyb2xsIHRoZSBjb250ZW50IGVsZW1lbnQgdG8gdGhlIHRvcCBhcyBzb29uIGFzIHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGlzIGlzIG5lY2Vzc2FyeSxcbiAgICAvLyBiZWNhdXNlIHdlIG1vdmUgZm9jdXMgdG8gdGhlIGZpcnN0IGl0ZW0gd2hpbGUgaXQncyBzdGlsbCBiZWluZyBhbmltYXRlZCwgd2hpY2ggY2FuIHRocm93XG4gICAgLy8gdGhlIGJyb3dzZXIgb2ZmIHdoZW4gaXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIHBvc2l0aW9uLiBBbHRlcm5hdGl2ZWx5IHdlIGNhbiBtb3ZlIGZvY3VzXG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUsIGhvd2V2ZXIgbW92aW5nIGZvY3VzIGFzeW5jaHJvbm91c2x5IHdpbGwgaW50ZXJydXB0IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgd2hpY2ggYXJlIGluIHRoZSBwcm9jZXNzIG9mIHJlYWRpbmcgb3V0IHRoZSBtZW51IGFscmVhZHkuIFdlIHRha2UgdGhlIGBlbGVtZW50YFxuICAgIC8vIGZyb20gdGhlIGBldmVudGAgc2luY2Ugd2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgdG8gYWNjZXNzIHRoZSBwYW5lLlxuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSAwKSB7XG4gICAgICBldmVudC5lbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgYSBzdHJlYW0gdGhhdCB3aWxsIGtlZXAgdHJhY2sgb2YgYW55IG5ld2x5LWFkZGVkIG1lbnUgaXRlbXMgYW5kIHdpbGwgdXBkYXRlIHRoZSBsaXN0XG4gICAqIG9mIGRpcmVjdCBkZXNjZW5kYW50cy4gV2UgY29sbGVjdCB0aGUgZGVzY2VuZGFudHMgdGhpcyB3YXksIGJlY2F1c2UgYF9hbGxJdGVtc2AgY2FuIGluY2x1ZGVcbiAgICogaXRlbXMgdGhhdCBhcmUgcGFydCBvZiBjaGlsZCBtZW51cywgYW5kIHVzaW5nIGEgY3VzdG9tIHdheSBvZiByZWdpc3RlcmluZyBpdGVtcyBpcyB1bnJlbGlhYmxlXG4gICAqIHdoZW4gaXQgY29tZXMgdG8gbWFpbnRhaW5pbmcgdGhlIGl0ZW0gb3JkZXIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpIHtcbiAgICB0aGlzLl9hbGxJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsSXRlbXMpKVxuICAgICAgLnN1YnNjcmliZSgoaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4pID0+IHtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLnJlc2V0KGl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX3BhcmVudE1lbnUgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgV2Ugc2hvdyB0aGUgXCJfTWF0TWVudVwiIGNsYXNzIGFzIFwiTWF0TWVudVwiIGluIHRoZSBkb2NzLiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTWF0TWVudSBleHRlbmRzIF9NYXRNZW51QmFzZSB7fVxuXG4vLyBOb3RlIG9uIHRoZSB3ZWlyZCBpbmhlcml0YW5jZSBzZXR1cDogd2UgbmVlZCB0aHJlZSBjbGFzc2VzLCBiZWNhdXNlIHRoZSBNREMtYmFzZWQgbWVudSBoYXMgdG9cbi8vIGV4dGVuZCBgTWF0TWVudWAsIGhvd2V2ZXIga2VlcGluZyBhIHJlZmVyZW5jZSB0byBpdCB3aWxsIGNhdXNlIHRoZSBpbmxpbmVkIHRlbXBsYXRlIGFuZCBzdHlsZXNcbi8vIHRvIGJlIHJldGFpbmVkIGFzIHdlbGwuIFRoZSBNREMgbWVudSBhbHNvIGhhcyB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBNYXRNZW51YCBpbiBvcmRlciBmb3Jcbi8vIHF1ZXJpZXMgYW5kIERJIHRvIHdvcmsgY29ycmVjdGx5LCB3aGlsZSBzdGlsbCBub3QgcmVmZXJlbmNpbmcgdGhlIGFjdHVhbCBtZW51IGNsYXNzLlxuLy8gQ2xhc3MgcmVzcG9uc2liaWxpdHkgaXMgc3BsaXQgdXAgYXMgZm9sbG93czpcbi8vICogX01hdE1lbnVCYXNlIC0gcHJvdmlkZXMgYWxsIHRoZSBmdW5jdGlvbmFsaXR5IHdpdGhvdXQgYW55IG9mIHRoZSBBbmd1bGFyIG1ldGFkYXRhLlxuLy8gKiBNYXRNZW51IC0ga2VlcHMgdGhlIHNhbWUgbmFtZSBzeW1ib2wgbmFtZSBhcyB0aGUgY3VycmVudCBtZW51IGFuZFxuLy8gaXMgdXNlZCBhcyBhIHByb3ZpZGVyIGZvciBESSBhbmQgcXVlcnkgcHVycG9zZXMuXG4vLyAqIF9NYXRNZW51IC0gdGhlIGFjdHVhbCBtZW51IGNvbXBvbmVudCBpbXBsZW1lbnRhdGlvbiB3aXRoIHRoZSBBbmd1bGFyIG1ldGFkYXRhIHRoYXQgc2hvdWxkXG4vLyBiZSB0cmVlIHNoYWtlbiBhd2F5IGZvciBNREMuXG5cbi8qKiBAZG9jcy1wdWJsaWMgTWF0TWVudSAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydtZW51LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51JyxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdE1lbnVBbmltYXRpb25zLnRyYW5zZm9ybU1lbnUsXG4gICAgbWF0TWVudUFuaW1hdGlvbnMuZmFkZUluSXRlbXNcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9NRU5VX1BBTkVMLCB1c2VFeGlzdGluZzogTWF0TWVudX0sXG4gICAge3Byb3ZpZGU6IE1hdE1lbnUsIHVzZUV4aXN0aW5nOiBfTWF0TWVudX1cbiAgXVxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE1lbnUgZXh0ZW5kcyBNYXRNZW51IHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Piwgbmdab25lOiBOZ1pvbmUsXG4gICAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG5nWm9uZSwgZGVmYXVsdE9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXBUcmlnZ2VyOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0JhY2tkcm9wOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==