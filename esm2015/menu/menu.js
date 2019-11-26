/**
 * @fileoverview added by tsickle
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
        /** @type {?} */
        const manager = this._keyManager;
        // When the content is rendered lazily, it takes a bit before the items are inside the DOM.
        if (this.lazyContent) {
            this._ngZone.onStable.asObservable()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => manager.setFocusOrigin(origin).setFirstItemActive()));
        }
        else {
            manager.setFocusOrigin(origin).setFirstItemActive();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsZUFBZSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFFL0QsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsV0FBVyxFQUNYLFVBQVUsRUFDVixRQUFRLEVBQ1IsSUFBSSxFQUNKLEdBQUcsRUFDSCxjQUFjLEdBQ2YsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFDLDRCQUE0QixFQUFFLDRCQUE0QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLGNBQWMsQ0FBQzs7Ozs7QUFJMUQsMkNBZUM7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LEVBQUUsVUFBVTtnQkFDcEIsNGZBQXdCO2dCQUV4QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixVQUFVLEVBQUU7b0JBQ1YsaUJBQWlCLENBQUMsYUFBYTtvQkFDL0IsaUJBQWlCLENBQUMsV0FBVztpQkFDOUI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDO29CQUMvQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztpQkFDMUM7O2FBQ0Y7Ozs7WUF6Y0MsVUFBVTtZQUtWLE1BQU07NENBeWNELE1BQU0sU0FBQyx3QkFBd0I7Ozs7SUFJcEMsMENBQTZFOztJQUM3RSx1Q0FBMEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXIsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBFU0NBUEUsXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgSE9NRSxcbiAgRU5ELFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRNZW51QW5pbWF0aW9uc30gZnJvbSAnLi9tZW51LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtbWVudWAuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPignbWF0LW1lbnUtZGVmYXVsdC1vcHRpb25zJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUllcbiAgICB9KTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIG92ZXJsYXBUcmlnZ2VyOiBmYWxzZSxcbiAgICB4UG9zaXRpb246ICdhZnRlcicsXG4gICAgeVBvc2l0aW9uOiAnYmVsb3cnLFxuICAgIGJhY2tkcm9wQ2xhc3M6ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gIH07XG59XG4vKipcbiAqIFN0YXJ0IGVsZXZhdGlvbiBmb3IgdGhlIG1lbnUgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IE1BVF9NRU5VX0JBU0VfRUxFVkFUSU9OID0gNDtcblxubGV0IG1lbnVQYW5lbFVpZCA9IDA7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0TWVudWAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0TWVudUJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LCBPbkluaXQsXG4gIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT47XG4gIHByaXZhdGUgX3hQb3NpdGlvbjogTWVudVBvc2l0aW9uWCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfeVBvc2l0aW9uOiBNZW51UG9zaXRpb25ZID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueVBvc2l0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBBbGwgaXRlbXMgaW5zaWRlIHRoZSBtZW51LiBJbmNsdWRlcyBpdGVtcyBuZXN0ZWQgaW5zaWRlIGFub3RoZXIgbWVudS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2FsbEl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKiBPbmx5IHRoZSBkaXJlY3QgZGVzY2VuZGFudCBtZW51IGl0ZW1zLiAqL1xuICBwcml2YXRlIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGFiIGV2ZW50cyBvbiB0aGUgbWVudSBwYW5lbCAqL1xuICBwcml2YXRlIF90YWJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIG1lbnUncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3AgZWxlbWVudC4gKi9cbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHhQb3NpdGlvbigpOiBNZW51UG9zaXRpb25YIHsgcmV0dXJuIHRoaXMuX3hQb3NpdGlvbjsgfVxuICBzZXQgeFBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25YKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYmVmb3JlJyAmJiB2YWx1ZSAhPT0gJ2FmdGVyJykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCgpO1xuICAgIH1cbiAgICB0aGlzLl94UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB5UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWSB7IHJldHVybiB0aGlzLl95UG9zaXRpb247IH1cbiAgc2V0IHlQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWSkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2Fib3ZlJyAmJiB2YWx1ZSAhPT0gJ2JlbG93Jykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWSgpO1xuICAgIH1cbiAgICB0aGlzLl95UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdGhlIGl0ZW1zIGluc2lkZSBvZiBhIG1lbnUuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogZmFsc2V9KSBpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKipcbiAgICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTWF0TWVudUNvbnRlbnQpIGxhenlDb250ZW50OiBNYXRNZW51Q29udGVudDtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCBpdHMgdHJpZ2dlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG92ZXJsYXBUcmlnZ2VyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcFRyaWdnZXI7IH1cbiAgc2V0IG92ZXJsYXBUcmlnZ2VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcFRyaWdnZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXBUcmlnZ2VyOiBib29sZWFuID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuX2hhc0JhY2tkcm9wOyB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2hhc0JhY2tkcm9wID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oYXNCYWNrZHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c1BhbmVsQ2xhc3MgPSB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3M7XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucGFuZWxDbGFzczsgfVxuICBzZXQgY2xhc3NMaXN0KGNsYXNzZXM6IHN0cmluZykgeyB0aGlzLnBhbmVsQ2xhc3MgPSBjbGFzc2VzOyB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgY2xvc2VkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBjbG9zZTogRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLndpdGhXcmFwKCkud2l0aFR5cGVBaGVhZCgpO1xuICAgIHRoaXMuX3RhYlN1YnNjcmlwdGlvbiA9IHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlZC5lbWl0KCd0YWInKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuZGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYlN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuY2xvc2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGhvdmVyZWQgbWVudSBpdGVtIGNoYW5nZXMuICovXG4gIF9ob3ZlcmVkKCk6IE9ic2VydmFibGU8TWF0TWVudUl0ZW0+IHtcbiAgICAvLyBDb2VyY2UgdGhlIGBjaGFuZ2VzYCBwcm9wZXJ0eSBiZWNhdXNlIEFuZ3VsYXIgdHlwZXMgaXQgYXMgYE9ic2VydmFibGU8YW55PmBcbiAgICBjb25zdCBpdGVtQ2hhbmdlcyA9IHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzIGFzIE9ic2VydmFibGU8UXVlcnlMaXN0PE1hdE1lbnVJdGVtPj47XG4gICAgcmV0dXJuIGl0ZW1DaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zKSxcbiAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9ob3ZlcmVkKSkpXG4gICAgKSBhcyBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPjtcbiAgfVxuXG4gIC8qXG4gICAqIFJlZ2lzdGVycyBhIG1lbnUgaXRlbSB3aXRoIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICBhZGRJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIHJlbW92ZUl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKiBIYW5kbGUgYSBrZXlib2FyZCBldmVudCBmcm9tIHRoZSBtZW51LCBkZWxlZ2F0aW5nIHRvIHRoZSBhcHByb3ByaWF0ZSBhY3Rpb24uICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ2x0cicpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gb3JpZ2luIEFjdGlvbiBmcm9tIHdoaWNoIHRoZSBmb2N1cyBvcmlnaW5hdGVkLiBVc2VkIHRvIHNldCB0aGUgY29ycmVjdCBzdHlsaW5nLlxuICAgKi9cbiAgZm9jdXNGaXJzdEl0ZW0ob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJyk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gV2hlbiB0aGUgY29udGVudCBpcyByZW5kZXJlZCBsYXppbHksIGl0IHRha2VzIGEgYml0IGJlZm9yZSB0aGUgaXRlbXMgYXJlIGluc2lkZSB0aGUgRE9NLlxuICAgIGlmICh0aGlzLmxhenlDb250ZW50KSB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgIC8vIE1vdmUgZm9jdXMgdG8gdGhlIG1lbnUgcGFuZWwgc28ga2V5Ym9hcmQgZXZlbnRzIGxpa2UgRXNjYXBlIHN0aWxsIHdvcmsuIEFsc28gdGhpcyB3aWxsXG4gICAgLy8gZ2l2ZSBfc29tZV8gZmVlZGJhY2sgdG8gc2NyZWVuIHJlYWRlcnMuXG4gICAgaWYgKCFtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiYgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmxlbmd0aCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuZmlyc3QuX2dldEhvc3RFbGVtZW50KCkucGFyZW50RWxlbWVudDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgYG1hdC1tZW51YCBpcyBhdCB0aGUgRE9NIGluc2VydGlvbiBwb2ludCwgbm90IGluc2lkZSB0aGUgb3ZlcmxheSwgd2UgZG9uJ3RcbiAgICAgIC8vIGhhdmUgYSBuaWNlIHdheSBvZiBnZXR0aW5nIGEgaG9sZCBvZiB0aGUgbWVudSBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAvLyBiZWNhdXNlIHRoZSBwYW5lbCBpcyBpbnNpZGUgYW4gYG5nLXRlbXBsYXRlYC4gV2Ugd29yayBhcm91bmQgaXQgYnkgc3RhcnRpbmcgZnJvbSBvbmUgb2ZcbiAgICAgIC8vIHRoZSBpdGVtcyBhbmQgd2Fsa2luZyB1cCB0aGUgRE9NLlxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJykgPT09ICdtZW51Jykge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gaW4gdGhlIG1lbnUuIFRoaXMgaXMgdXNlZCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCwgYWxsb3dpbmdcbiAgICogdGhlIHVzZXIgdG8gc3RhcnQgZnJvbSB0aGUgZmlyc3Qgb3B0aW9uIHdoZW4gcHJlc3NpbmcgdGhlIGRvd24gYXJyb3cuXG4gICAqL1xuICByZXNldEFjdGl2ZUl0ZW0oKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtZW51IHBhbmVsIGVsZXZhdGlvbi5cbiAgICogQHBhcmFtIGRlcHRoIE51bWJlciBvZiBwYXJlbnQgbWVudXMgdGhhdCBjb21lIGJlZm9yZSB0aGUgbWVudS5cbiAgICovXG4gIHNldEVsZXZhdGlvbihkZXB0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIGVsZXZhdGlvbiBzdGFydHMgYXQgdGhlIGJhc2UgYW5kIGluY3JlYXNlcyBieSBvbmUgZm9yIGVhY2ggbGV2ZWwuXG4gICAgLy8gQ2FwcGVkIGF0IDI0IGJlY2F1c2UgdGhhdCdzIHRoZSBtYXhpbXVtIGVsZXZhdGlvbiBkZWZpbmVkIGluIHRoZSBNYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICBjb25zdCBlbGV2YXRpb24gPSBNYXRoLm1pbihNQVRfTUVOVV9CQVNFX0VMRVZBVElPTiArIGRlcHRoLCAyNCk7XG4gICAgY29uc3QgbmV3RWxldmF0aW9uID0gYG1hdC1lbGV2YXRpb24teiR7ZWxldmF0aW9ufWA7XG4gICAgY29uc3QgY3VzdG9tRWxldmF0aW9uID0gT2JqZWN0LmtleXModGhpcy5fY2xhc3NMaXN0KS5maW5kKGMgPT4gYy5zdGFydHNXaXRoKCdtYXQtZWxldmF0aW9uLXonKSk7XG5cbiAgICBpZiAoIWN1c3RvbUVsZXZhdGlvbiB8fCBjdXN0b21FbGV2YXRpb24gPT09IHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNFbGV2YXRpb24pIHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W3RoaXMuX3ByZXZpb3VzRWxldmF0aW9uXSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jbGFzc0xpc3RbbmV3RWxldmF0aW9uXSA9IHRydWU7XG4gICAgICB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbiA9IG5ld0VsZXZhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBjbGFzc2VzIHRvIHRoZSBtZW51IHBhbmVsIGJhc2VkIG9uIGl0cyBwb3NpdGlvbi4gQ2FuIGJlIHVzZWQgYnlcbiAgICogY29uc3VtZXJzIHRvIGFkZCBzcGVjaWZpYyBzdHlsaW5nIGJhc2VkIG9uIHRoZSBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvc1ggUG9zaXRpb24gb2YgdGhlIG1lbnUgYWxvbmcgdGhlIHggYXhpcy5cbiAgICogQHBhcmFtIHBvc1kgUG9zaXRpb24gb2YgdGhlIG1lbnUgYWxvbmcgdGhlIHkgYXhpcy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0UG9zaXRpb25DbGFzc2VzKHBvc1g6IE1lbnVQb3NpdGlvblggPSB0aGlzLnhQb3NpdGlvbiwgcG9zWTogTWVudVBvc2l0aW9uWSA9IHRoaXMueVBvc2l0aW9uKSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuX2NsYXNzTGlzdDtcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWZvcmUnXSA9IHBvc1ggPT09ICdiZWZvcmUnO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWFmdGVyJ10gPSBwb3NYID09PSAnYWZ0ZXInO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWFib3ZlJ10gPSBwb3NZID09PSAnYWJvdmUnO1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWJlbG93J10gPSBwb3NZID09PSAnYmVsb3cnO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZW50ZXIgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3Jlc2V0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgcGFuZWwgYW5pbWF0aW9uIHRvIGl0cyBpbml0aWFsIHN0YXRlLiAqL1xuICBfcmVzZXRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3N0YXJ0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIHBhbmVsIGFuaW1hdGlvbiBjb21wbGV0ZXMuICovXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5uZXh0KGV2ZW50KTtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgLy8gU2Nyb2xsIHRoZSBjb250ZW50IGVsZW1lbnQgdG8gdGhlIHRvcCBhcyBzb29uIGFzIHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGlzIGlzIG5lY2Vzc2FyeSxcbiAgICAvLyBiZWNhdXNlIHdlIG1vdmUgZm9jdXMgdG8gdGhlIGZpcnN0IGl0ZW0gd2hpbGUgaXQncyBzdGlsbCBiZWluZyBhbmltYXRlZCwgd2hpY2ggY2FuIHRocm93XG4gICAgLy8gdGhlIGJyb3dzZXIgb2ZmIHdoZW4gaXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIHBvc2l0aW9uLiBBbHRlcm5hdGl2ZWx5IHdlIGNhbiBtb3ZlIGZvY3VzXG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUsIGhvd2V2ZXIgbW92aW5nIGZvY3VzIGFzeW5jaHJvbm91c2x5IHdpbGwgaW50ZXJydXB0IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgd2hpY2ggYXJlIGluIHRoZSBwcm9jZXNzIG9mIHJlYWRpbmcgb3V0IHRoZSBtZW51IGFscmVhZHkuIFdlIHRha2UgdGhlIGBlbGVtZW50YFxuICAgIC8vIGZyb20gdGhlIGBldmVudGAgc2luY2Ugd2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgdG8gYWNjZXNzIHRoZSBwYW5lLlxuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSAwKSB7XG4gICAgICBldmVudC5lbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgYSBzdHJlYW0gdGhhdCB3aWxsIGtlZXAgdHJhY2sgb2YgYW55IG5ld2x5LWFkZGVkIG1lbnUgaXRlbXMgYW5kIHdpbGwgdXBkYXRlIHRoZSBsaXN0XG4gICAqIG9mIGRpcmVjdCBkZXNjZW5kYW50cy4gV2UgY29sbGVjdCB0aGUgZGVzY2VuZGFudHMgdGhpcyB3YXksIGJlY2F1c2UgYF9hbGxJdGVtc2AgY2FuIGluY2x1ZGVcbiAgICogaXRlbXMgdGhhdCBhcmUgcGFydCBvZiBjaGlsZCBtZW51cywgYW5kIHVzaW5nIGEgY3VzdG9tIHdheSBvZiByZWdpc3RlcmluZyBpdGVtcyBpcyB1bnJlbGlhYmxlXG4gICAqIHdoZW4gaXQgY29tZXMgdG8gbWFpbnRhaW5pbmcgdGhlIGl0ZW0gb3JkZXIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpIHtcbiAgICB0aGlzLl9hbGxJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsSXRlbXMpKVxuICAgICAgLnN1YnNjcmliZSgoaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4pID0+IHtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLnJlc2V0KGl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX3BhcmVudE1lbnUgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgV2Ugc2hvdyB0aGUgXCJfTWF0TWVudVwiIGNsYXNzIGFzIFwiTWF0TWVudVwiIGluIHRoZSBkb2NzLiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTWF0TWVudSBleHRlbmRzIF9NYXRNZW51QmFzZSB7fVxuXG4vLyBOb3RlIG9uIHRoZSB3ZWlyZCBpbmhlcml0YW5jZSBzZXR1cDogd2UgbmVlZCB0aHJlZSBjbGFzc2VzLCBiZWNhdXNlIHRoZSBNREMtYmFzZWQgbWVudSBoYXMgdG9cbi8vIGV4dGVuZCBgTWF0TWVudWAsIGhvd2V2ZXIga2VlcGluZyBhIHJlZmVyZW5jZSB0byBpdCB3aWxsIGNhdXNlIHRoZSBpbmxpbmVkIHRlbXBsYXRlIGFuZCBzdHlsZXNcbi8vIHRvIGJlIHJldGFpbmVkIGFzIHdlbGwuIFRoZSBNREMgbWVudSBhbHNvIGhhcyB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBNYXRNZW51YCBpbiBvcmRlciBmb3Jcbi8vIHF1ZXJpZXMgYW5kIERJIHRvIHdvcmsgY29ycmVjdGx5LCB3aGlsZSBzdGlsbCBub3QgcmVmZXJlbmNpbmcgdGhlIGFjdHVhbCBtZW51IGNsYXNzLlxuLy8gQ2xhc3MgcmVzcG9uc2liaWxpdHkgaXMgc3BsaXQgdXAgYXMgZm9sbG93czpcbi8vICogX01hdE1lbnVCYXNlIC0gcHJvdmlkZXMgYWxsIHRoZSBmdW5jdGlvbmFsaXR5IHdpdGhvdXQgYW55IG9mIHRoZSBBbmd1bGFyIG1ldGFkYXRhLlxuLy8gKiBNYXRNZW51IC0ga2VlcHMgdGhlIHNhbWUgbmFtZSBzeW1ib2wgbmFtZSBhcyB0aGUgY3VycmVudCBtZW51IGFuZFxuLy8gaXMgdXNlZCBhcyBhIHByb3ZpZGVyIGZvciBESSBhbmQgcXVlcnkgcHVycG9zZXMuXG4vLyAqIF9NYXRNZW51IC0gdGhlIGFjdHVhbCBtZW51IGNvbXBvbmVudCBpbXBsZW1lbnRhdGlvbiB3aXRoIHRoZSBBbmd1bGFyIG1ldGFkYXRhIHRoYXQgc2hvdWxkXG4vLyBiZSB0cmVlIHNoYWtlbiBhd2F5IGZvciBNREMuXG5cbi8qKiBAZG9jcy1wdWJsaWMgTWF0TWVudSAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydtZW51LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51JyxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdE1lbnVBbmltYXRpb25zLnRyYW5zZm9ybU1lbnUsXG4gICAgbWF0TWVudUFuaW1hdGlvbnMuZmFkZUluSXRlbXNcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9NRU5VX1BBTkVMLCB1c2VFeGlzdGluZzogTWF0TWVudX0sXG4gICAge3Byb3ZpZGU6IE1hdE1lbnUsIHVzZUV4aXN0aW5nOiBfTWF0TWVudX1cbiAgXVxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE1lbnUgZXh0ZW5kcyBNYXRNZW51IHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Piwgbmdab25lOiBOZ1pvbmUsXG4gICAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG5nWm9uZSwgZGVmYXVsdE9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXBUcmlnZ2VyOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0JhY2tkcm9wOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==