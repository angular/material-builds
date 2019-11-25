/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends, __read, __spread } from "tslib";
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
/** Injection token to be used to override the default options for `mat-menu`. */
export var MAT_MENU_DEFAULT_OPTIONS = new InjectionToken('mat-menu-default-options', {
    providedIn: 'root',
    factory: MAT_MENU_DEFAULT_OPTIONS_FACTORY
});
/** @docs-private */
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
 * @docs-private
 */
var MAT_MENU_BASE_ELEVATION = 4;
var menuPanelUid = 0;
/** Base class with all of the `MatMenu` functionality. */
var _MatMenuBase = /** @class */ (function () {
    function _MatMenuBase(_elementRef, _ngZone, _defaultOptions) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
        this._xPosition = this._defaultOptions.xPosition;
        this._yPosition = this._defaultOptions.yPosition;
        /** Only the direct descendant menu items. */
        this._directDescendantItems = new QueryList();
        /** Subscription to tab events on the menu panel */
        this._tabSubscription = Subscription.EMPTY;
        /** Config object to be passed into the menu's ngClass */
        this._classList = {};
        /** Current state of the panel animation. */
        this._panelAnimationState = 'void';
        /** Emits whenever an animation on the menu completes. */
        this._animationDone = new Subject();
        /** Class to be added to the backdrop element. */
        this.backdropClass = this._defaultOptions.backdropClass;
        this._overlapTrigger = this._defaultOptions.overlapTrigger;
        this._hasBackdrop = this._defaultOptions.hasBackdrop;
        /** Event emitted when the menu is closed. */
        this.closed = new EventEmitter();
        /**
         * Event emitted when the menu is closed.
         * @deprecated Switch to `closed` instead
         * @breaking-change 8.0.0
         */
        this.close = this.closed;
        this.panelId = "mat-menu-panel-" + menuPanelUid++;
    }
    Object.defineProperty(_MatMenuBase.prototype, "xPosition", {
        /** Position of the menu in the X axis. */
        get: function () { return this._xPosition; },
        set: function (value) {
            if (value !== 'before' && value !== 'after') {
                throwMatMenuInvalidPositionX();
            }
            this._xPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatMenuBase.prototype, "yPosition", {
        /** Position of the menu in the Y axis. */
        get: function () { return this._yPosition; },
        set: function (value) {
            if (value !== 'above' && value !== 'below') {
                throwMatMenuInvalidPositionY();
            }
            this._yPosition = value;
            this.setPositionClasses();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatMenuBase.prototype, "overlapTrigger", {
        /** Whether the menu should overlap its trigger. */
        get: function () { return this._overlapTrigger; },
        set: function (value) {
            this._overlapTrigger = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatMenuBase.prototype, "hasBackdrop", {
        /** Whether the menu has a backdrop. */
        get: function () { return this._hasBackdrop; },
        set: function (value) {
            this._hasBackdrop = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatMenuBase.prototype, "panelClass", {
        /**
         * This method takes classes set on the host mat-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param classes list of class names
         */
        set: function (classes) {
            var _this = this;
            var previousPanelClass = this._previousPanelClass;
            if (previousPanelClass && previousPanelClass.length) {
                previousPanelClass.split(' ').forEach(function (className) {
                    _this._classList[className] = false;
                });
            }
            this._previousPanelClass = classes;
            if (classes && classes.length) {
                classes.split(' ').forEach(function (className) {
                    _this._classList[className] = true;
                });
                this._elementRef.nativeElement.className = '';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatMenuBase.prototype, "classList", {
        /**
         * This method takes classes set on the host mat-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @deprecated Use `panelClass` instead.
         * @breaking-change 8.0.0
         */
        get: function () { return this.panelClass; },
        set: function (classes) { this.panelClass = classes; },
        enumerable: true,
        configurable: true
    });
    _MatMenuBase.prototype.ngOnInit = function () {
        this.setPositionClasses();
    };
    _MatMenuBase.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._updateDirectDescendants();
        this._keyManager = new FocusKeyManager(this._directDescendantItems).withWrap().withTypeAhead();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () { return _this.closed.emit('tab'); });
    };
    _MatMenuBase.prototype.ngOnDestroy = function () {
        this._directDescendantItems.destroy();
        this._tabSubscription.unsubscribe();
        this.closed.complete();
    };
    /** Stream that emits whenever the hovered menu item changes. */
    _MatMenuBase.prototype._hovered = function () {
        // Coerce the `changes` property because Angular types it as `Observable<any>`
        var itemChanges = this._directDescendantItems.changes;
        return itemChanges.pipe(startWith(this._directDescendantItems), switchMap(function (items) { return merge.apply(void 0, __spread(items.map(function (item) { return item._hovered; }))); }));
    };
    /*
     * Registers a menu item with the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    _MatMenuBase.prototype.addItem = function (_item) { };
    /**
     * Removes an item from the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    _MatMenuBase.prototype.removeItem = function (_item) { };
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _MatMenuBase.prototype._handleKeydown = function (event) {
        var keyCode = event.keyCode;
        var manager = this._keyManager;
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
    };
    /**
     * Focus the first item in the menu.
     * @param origin Action from which the focus originated. Used to set the correct styling.
     */
    _MatMenuBase.prototype.focusFirstItem = function (origin) {
        if (origin === void 0) { origin = 'program'; }
        var manager = this._keyManager;
        // When the content is rendered lazily, it takes a bit before the items are inside the DOM.
        if (this.lazyContent) {
            this._ngZone.onStable.asObservable()
                .pipe(take(1))
                .subscribe(function () { return manager.setFocusOrigin(origin).setFirstItemActive(); });
        }
        else {
            manager.setFocusOrigin(origin).setFirstItemActive();
        }
        // If there's no active item at this point, it means that all the items are disabled.
        // Move focus to the menu panel so keyboard events like Escape still work. Also this will
        // give _some_ feedback to screen readers.
        if (!manager.activeItem && this._directDescendantItems.length) {
            var element = this._directDescendantItems.first._getHostElement().parentElement;
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
    };
    /**
     * Resets the active item in the menu. This is used when the menu is opened, allowing
     * the user to start from the first option when pressing the down arrow.
     */
    _MatMenuBase.prototype.resetActiveItem = function () {
        this._keyManager.setActiveItem(-1);
    };
    /**
     * Sets the menu panel elevation.
     * @param depth Number of parent menus that come before the menu.
     */
    _MatMenuBase.prototype.setElevation = function (depth) {
        // The elevation starts at the base and increases by one for each level.
        // Capped at 24 because that's the maximum elevation defined in the Material design spec.
        var elevation = Math.min(MAT_MENU_BASE_ELEVATION + depth, 24);
        var newElevation = "mat-elevation-z" + elevation;
        var customElevation = Object.keys(this._classList).find(function (c) { return c.startsWith('mat-elevation-z'); });
        if (!customElevation || customElevation === this._previousElevation) {
            if (this._previousElevation) {
                this._classList[this._previousElevation] = false;
            }
            this._classList[newElevation] = true;
            this._previousElevation = newElevation;
        }
    };
    /**
     * Adds classes to the menu panel based on its position. Can be used by
     * consumers to add specific styling based on the position.
     * @param posX Position of the menu along the x axis.
     * @param posY Position of the menu along the y axis.
     * @docs-private
     */
    _MatMenuBase.prototype.setPositionClasses = function (posX, posY) {
        if (posX === void 0) { posX = this.xPosition; }
        if (posY === void 0) { posY = this.yPosition; }
        var classes = this._classList;
        classes['mat-menu-before'] = posX === 'before';
        classes['mat-menu-after'] = posX === 'after';
        classes['mat-menu-above'] = posY === 'above';
        classes['mat-menu-below'] = posY === 'below';
    };
    /** Starts the enter animation. */
    _MatMenuBase.prototype._startAnimation = function () {
        // @breaking-change 8.0.0 Combine with _resetAnimation.
        this._panelAnimationState = 'enter';
    };
    /** Resets the panel animation to its initial state. */
    _MatMenuBase.prototype._resetAnimation = function () {
        // @breaking-change 8.0.0 Combine with _startAnimation.
        this._panelAnimationState = 'void';
    };
    /** Callback that is invoked when the panel animation completes. */
    _MatMenuBase.prototype._onAnimationDone = function (event) {
        this._animationDone.next(event);
        this._isAnimating = false;
    };
    _MatMenuBase.prototype._onAnimationStart = function (event) {
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
    };
    /**
     * Sets up a stream that will keep track of any newly-added menu items and will update the list
     * of direct descendants. We collect the descendants this way, because `_allItems` can include
     * items that are part of child menus, and using a custom way of registering items is unreliable
     * when it comes to maintaining the item order.
     */
    _MatMenuBase.prototype._updateDirectDescendants = function () {
        var _this = this;
        this._allItems.changes
            .pipe(startWith(this._allItems))
            .subscribe(function (items) {
            _this._directDescendantItems.reset(items.filter(function (item) { return item._parentMenu === _this; }));
            _this._directDescendantItems.notifyOnChanges();
        });
    };
    _MatMenuBase.decorators = [
        { type: Directive }
    ];
    /** @nocollapse */
    _MatMenuBase.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_DEFAULT_OPTIONS,] }] }
    ]; };
    _MatMenuBase.propDecorators = {
        _allItems: [{ type: ContentChildren, args: [MatMenuItem, { descendants: true },] }],
        backdropClass: [{ type: Input }],
        xPosition: [{ type: Input }],
        yPosition: [{ type: Input }],
        templateRef: [{ type: ViewChild, args: [TemplateRef,] }],
        items: [{ type: ContentChildren, args: [MatMenuItem,] }],
        lazyContent: [{ type: ContentChild, args: [MatMenuContent,] }],
        overlapTrigger: [{ type: Input }],
        hasBackdrop: [{ type: Input }],
        panelClass: [{ type: Input, args: ['class',] }],
        classList: [{ type: Input }],
        closed: [{ type: Output }],
        close: [{ type: Output }]
    };
    return _MatMenuBase;
}());
export { _MatMenuBase };
/** @docs-private We show the "_MatMenu" class as "MatMenu" in the docs. */
var MatMenu = /** @class */ (function (_super) {
    __extends(MatMenu, _super);
    function MatMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatMenu.decorators = [
        { type: Directive }
    ];
    return MatMenu;
}(_MatMenuBase));
export { MatMenu };
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
/** @docs-public MatMenu */
var _MatMenu = /** @class */ (function (_super) {
    __extends(_MatMenu, _super);
    function _MatMenu(elementRef, ngZone, defaultOptions) {
        return _super.call(this, elementRef, ngZone, defaultOptions) || this;
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
    _MatMenu.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_DEFAULT_OPTIONS,] }] }
    ]; };
    return _MatMenu;
}(MatMenu));
export { _MatMenu };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUUvRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNILGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFD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O0FBQ25ELDhGQUE4RjtBQUM5RiwrQkFBK0I7QUFFL0IsMkJBQTJCO0FBQzNCO0lBaUI4Qiw0QkFBTztJQUVuQyxrQkFBWSxVQUFtQyxFQUFFLE1BQWMsRUFDekIsY0FBcUM7ZUFDekUsa0JBQU0sVUFBVSxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUM7SUFDM0MsQ0FBQzs7Z0JBdEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsNGZBQXdCO29CQUV4QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFFBQVEsRUFBRSxTQUFTO29CQUNuQixVQUFVLEVBQUU7d0JBQ1YsaUJBQWlCLENBQUMsYUFBYTt3QkFDL0IsaUJBQWlCLENBQUMsV0FBVztxQkFDOUI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDO3dCQUMvQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztxQkFDMUM7O2lCQUNGOzs7O2dCQXpjQyxVQUFVO2dCQUtWLE1BQU07Z0RBeWNELE1BQU0sU0FBQyx3QkFBd0I7O0lBTXRDLGVBQUM7Q0FBQSxBQTFCRCxDQWlCOEIsT0FBTyxHQVNwQztTQVRZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXIsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBFU0NBUEUsXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgSE9NRSxcbiAgRU5ELFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRNZW51QW5pbWF0aW9uc30gZnJvbSAnLi9tZW51LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtbWVudWAuICovXG5leHBvcnQgY29uc3QgTUFUX01FTlVfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPignbWF0LW1lbnUtZGVmYXVsdC1vcHRpb25zJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUllcbiAgICB9KTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIG92ZXJsYXBUcmlnZ2VyOiBmYWxzZSxcbiAgICB4UG9zaXRpb246ICdhZnRlcicsXG4gICAgeVBvc2l0aW9uOiAnYmVsb3cnLFxuICAgIGJhY2tkcm9wQ2xhc3M6ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gIH07XG59XG4vKipcbiAqIFN0YXJ0IGVsZXZhdGlvbiBmb3IgdGhlIG1lbnUgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IE1BVF9NRU5VX0JBU0VfRUxFVkFUSU9OID0gNDtcblxubGV0IG1lbnVQYW5lbFVpZCA9IDA7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0TWVudWAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0TWVudUJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LCBPbkluaXQsXG4gIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT47XG4gIHByaXZhdGUgX3hQb3NpdGlvbjogTWVudVBvc2l0aW9uWCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfeVBvc2l0aW9uOiBNZW51UG9zaXRpb25ZID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueVBvc2l0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBBbGwgaXRlbXMgaW5zaWRlIHRoZSBtZW51LiBJbmNsdWRlcyBpdGVtcyBuZXN0ZWQgaW5zaWRlIGFub3RoZXIgbWVudS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2FsbEl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKiBPbmx5IHRoZSBkaXJlY3QgZGVzY2VuZGFudCBtZW51IGl0ZW1zLiAqL1xuICBwcml2YXRlIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGFiIGV2ZW50cyBvbiB0aGUgbWVudSBwYW5lbCAqL1xuICBwcml2YXRlIF90YWJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIG1lbnUncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3AgZWxlbWVudC4gKi9cbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHhQb3NpdGlvbigpOiBNZW51UG9zaXRpb25YIHsgcmV0dXJuIHRoaXMuX3hQb3NpdGlvbjsgfVxuICBzZXQgeFBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25YKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYmVmb3JlJyAmJiB2YWx1ZSAhPT0gJ2FmdGVyJykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCgpO1xuICAgIH1cbiAgICB0aGlzLl94UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB5UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWSB7IHJldHVybiB0aGlzLl95UG9zaXRpb247IH1cbiAgc2V0IHlQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWSkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2Fib3ZlJyAmJiB2YWx1ZSAhPT0gJ2JlbG93Jykge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWSgpO1xuICAgIH1cbiAgICB0aGlzLl95UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdGhlIGl0ZW1zIGluc2lkZSBvZiBhIG1lbnUuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0pIGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKlxuICAgKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNYXRNZW51Q29udGVudCkgbGF6eUNvbnRlbnQ6IE1hdE1lbnVDb250ZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IHNob3VsZCBvdmVybGFwIGl0cyB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgb3ZlcmxhcFRyaWdnZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9vdmVybGFwVHJpZ2dlcjsgfVxuICBzZXQgb3ZlcmxhcFRyaWdnZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vdmVybGFwVHJpZ2dlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW4gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5vdmVybGFwVHJpZ2dlcjtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhhc0JhY2tkcm9wKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQgeyByZXR1cm4gdGhpcy5faGFzQmFja2Ryb3A7IH1cbiAgc2V0IGhhc0JhY2tkcm9wKHZhbHVlOiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5faGFzQmFja2Ryb3AgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2hhc0JhY2tkcm9wOiBib29sZWFuIHwgdW5kZWZpbmVkID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuaGFzQmFja2Ryb3A7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1tZW51IGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogbWVudSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgbWVudSBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNsYXNzZXMgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBwYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZykge1xuICAgIGNvbnN0IHByZXZpb3VzUGFuZWxDbGFzcyA9IHRoaXMuX3ByZXZpb3VzUGFuZWxDbGFzcztcblxuICAgIGlmIChwcmV2aW91c1BhbmVsQ2xhc3MgJiYgcHJldmlvdXNQYW5lbENsYXNzLmxlbmd0aCkge1xuICAgICAgcHJldmlvdXNQYW5lbENsYXNzLnNwbGl0KCcgJykuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX3ByZXZpb3VzUGFuZWxDbGFzcyA9IGNsYXNzZXM7XG5cbiAgICBpZiAoY2xhc3NlcyAmJiBjbGFzc2VzLmxlbmd0aCkge1xuICAgICAgY2xhc3Nlcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ByZXZpb3VzUGFuZWxDbGFzczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgcGFuZWxDbGFzc2AgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGNsYXNzTGlzdCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wYW5lbENsYXNzOyB9XG4gIHNldCBjbGFzc0xpc3QoY2xhc3Nlczogc3RyaW5nKSB7IHRoaXMucGFuZWxDbGFzcyA9IGNsYXNzZXM7IH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8dm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJz4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBjbG9zZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIGNsb3NlOiBFdmVudEVtaXR0ZXI8dm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJz4gPSB0aGlzLmNsb3NlZDtcblxuICByZWFkb25seSBwYW5lbElkID0gYG1hdC1tZW51LXBhbmVsLSR7bWVudVBhbmVsVWlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucykgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpO1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcykud2l0aFdyYXAoKS53aXRoVHlwZUFoZWFkKCk7XG4gICAgdGhpcy5fdGFiU3Vic2NyaXB0aW9uID0gdGhpcy5fa2V5TWFuYWdlci50YWJPdXQuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2VkLmVtaXQoJ3RhYicpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5kZXN0cm95KCk7XG4gICAgdGhpcy5fdGFiU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jbG9zZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgaG92ZXJlZCBtZW51IGl0ZW0gY2hhbmdlcy4gKi9cbiAgX2hvdmVyZWQoKTogT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT4ge1xuICAgIC8vIENvZXJjZSB0aGUgYGNoYW5nZXNgIHByb3BlcnR5IGJlY2F1c2UgQW5ndWxhciB0eXBlcyBpdCBhcyBgT2JzZXJ2YWJsZTxhbnk+YFxuICAgIGNvbnN0IGl0ZW1DaGFuZ2VzID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmNoYW5nZXMgYXMgT2JzZXJ2YWJsZTxRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+PjtcbiAgICByZXR1cm4gaXRlbUNoYW5nZXMucGlwZShcbiAgICAgIHN0YXJ0V2l0aCh0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLFxuICAgICAgc3dpdGNoTWFwKGl0ZW1zID0+IG1lcmdlKC4uLml0ZW1zLm1hcCgoaXRlbTogTWF0TWVudUl0ZW0pID0+IGl0ZW0uX2hvdmVyZWQpKSlcbiAgICApIGFzIE9ic2VydmFibGU8TWF0TWVudUl0ZW0+O1xuICB9XG5cbiAgLypcbiAgICogUmVnaXN0ZXJzIGEgbWVudSBpdGVtIHdpdGggdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIGFkZEl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgcmVtb3ZlSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIG1lbnUsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAnbHRyJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBrZXlDb2RlID09PSBIT01FID8gbWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKSA6IG1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbigna2V5Ym9hcmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBvcmlnaW4gQWN0aW9uIGZyb20gd2hpY2ggdGhlIGZvY3VzIG9yaWdpbmF0ZWQuIFVzZWQgdG8gc2V0IHRoZSBjb3JyZWN0IHN0eWxpbmcuXG4gICAqL1xuICBmb2N1c0ZpcnN0SXRlbShvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTogdm9pZCB7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICAvLyBXaGVuIHRoZSBjb250ZW50IGlzIHJlbmRlcmVkIGxhemlseSwgaXQgdGFrZXMgYSBiaXQgYmVmb3JlIHRoZSBpdGVtcyBhcmUgaW5zaWRlIHRoZSBET00uXG4gICAgaWYgKHRoaXMubGF6eUNvbnRlbnQpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4ob3JpZ2luKS5zZXRGaXJzdEl0ZW1BY3RpdmUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4ob3JpZ2luKS5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSdzIG5vIGFjdGl2ZSBpdGVtIGF0IHRoaXMgcG9pbnQsIGl0IG1lYW5zIHRoYXQgYWxsIHRoZSBpdGVtcyBhcmUgZGlzYWJsZWQuXG4gICAgLy8gTW92ZSBmb2N1cyB0byB0aGUgbWVudSBwYW5lbCBzbyBrZXlib2FyZCBldmVudHMgbGlrZSBFc2NhcGUgc3RpbGwgd29yay4gQWxzbyB0aGlzIHdpbGxcbiAgICAvLyBnaXZlIF9zb21lXyBmZWVkYmFjayB0byBzY3JlZW4gcmVhZGVycy5cbiAgICBpZiAoIW1hbmFnZXIuYWN0aXZlSXRlbSAmJiB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMubGVuZ3RoKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5maXJzdC5fZ2V0SG9zdEVsZW1lbnQoKS5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAvLyBCZWNhdXNlIHRoZSBgbWF0LW1lbnVgIGlzIGF0IHRoZSBET00gaW5zZXJ0aW9uIHBvaW50LCBub3QgaW5zaWRlIHRoZSBvdmVybGF5LCB3ZSBkb24ndFxuICAgICAgLy8gaGF2ZSBhIG5pY2Ugd2F5IG9mIGdldHRpbmcgYSBob2xkIG9mIHRoZSBtZW51IHBhbmVsLiBXZSBjYW4ndCB1c2UgYSBgVmlld0NoaWxkYCBlaXRoZXJcbiAgICAgIC8vIGJlY2F1c2UgdGhlIHBhbmVsIGlzIGluc2lkZSBhbiBgbmctdGVtcGxhdGVgLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBzdGFydGluZyBmcm9tIG9uZSBvZlxuICAgICAgLy8gdGhlIGl0ZW1zIGFuZCB3YWxraW5nIHVwIHRoZSBET00uXG4gICAgICB3aGlsZSAoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSA9PT0gJ21lbnUnKSB7XG4gICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBhY3RpdmUgaXRlbSBpbiB0aGUgbWVudS4gVGhpcyBpcyB1c2VkIHdoZW4gdGhlIG1lbnUgaXMgb3BlbmVkLCBhbGxvd2luZ1xuICAgKiB0aGUgdXNlciB0byBzdGFydCBmcm9tIHRoZSBmaXJzdCBvcHRpb24gd2hlbiBwcmVzc2luZyB0aGUgZG93biBhcnJvdy5cbiAgICovXG4gIHJlc2V0QWN0aXZlSXRlbSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oLTEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1lbnUgcGFuZWwgZWxldmF0aW9uLlxuICAgKiBAcGFyYW0gZGVwdGggTnVtYmVyIG9mIHBhcmVudCBtZW51cyB0aGF0IGNvbWUgYmVmb3JlIHRoZSBtZW51LlxuICAgKi9cbiAgc2V0RWxldmF0aW9uKGRlcHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBUaGUgZWxldmF0aW9uIHN0YXJ0cyBhdCB0aGUgYmFzZSBhbmQgaW5jcmVhc2VzIGJ5IG9uZSBmb3IgZWFjaCBsZXZlbC5cbiAgICAvLyBDYXBwZWQgYXQgMjQgYmVjYXVzZSB0aGF0J3MgdGhlIG1heGltdW0gZWxldmF0aW9uIGRlZmluZWQgaW4gdGhlIE1hdGVyaWFsIGRlc2lnbiBzcGVjLlxuICAgIGNvbnN0IGVsZXZhdGlvbiA9IE1hdGgubWluKE1BVF9NRU5VX0JBU0VfRUxFVkFUSU9OICsgZGVwdGgsIDI0KTtcbiAgICBjb25zdCBuZXdFbGV2YXRpb24gPSBgbWF0LWVsZXZhdGlvbi16JHtlbGV2YXRpb259YDtcbiAgICBjb25zdCBjdXN0b21FbGV2YXRpb24gPSBPYmplY3Qua2V5cyh0aGlzLl9jbGFzc0xpc3QpLmZpbmQoYyA9PiBjLnN0YXJ0c1dpdGgoJ21hdC1lbGV2YXRpb24teicpKTtcblxuICAgIGlmICghY3VzdG9tRWxldmF0aW9uIHx8IGN1c3RvbUVsZXZhdGlvbiA9PT0gdGhpcy5fcHJldmlvdXNFbGV2YXRpb24pIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbdGhpcy5fcHJldmlvdXNFbGV2YXRpb25dID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NsYXNzTGlzdFtuZXdFbGV2YXRpb25dID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uID0gbmV3RWxldmF0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGNsYXNzZXMgdG8gdGhlIG1lbnUgcGFuZWwgYmFzZWQgb24gaXRzIHBvc2l0aW9uLiBDYW4gYmUgdXNlZCBieVxuICAgKiBjb25zdW1lcnMgdG8gYWRkIHNwZWNpZmljIHN0eWxpbmcgYmFzZWQgb24gdGhlIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zWCBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0gcG9zWSBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeSBheGlzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXRQb3NpdGlvbkNsYXNzZXMocG9zWDogTWVudVBvc2l0aW9uWCA9IHRoaXMueFBvc2l0aW9uLCBwb3NZOiBNZW51UG9zaXRpb25ZID0gdGhpcy55UG9zaXRpb24pIHtcbiAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5fY2xhc3NMaXN0O1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWJlZm9yZSddID0gcG9zWCA9PT0gJ2JlZm9yZSc7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYWZ0ZXInXSA9IHBvc1ggPT09ICdhZnRlcic7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYWJvdmUnXSA9IHBvc1kgPT09ICdhYm92ZSc7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVsb3cnXSA9IHBvc1kgPT09ICdiZWxvdyc7XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBlbnRlciBhbmltYXRpb24uICovXG4gIF9zdGFydEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfcmVzZXRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gIH1cblxuICAvKiogUmVzZXRzIHRoZSBwYW5lbCBhbmltYXRpb24gdG8gaXRzIGluaXRpYWwgc3RhdGUuICovXG4gIF9yZXNldEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfc3RhcnRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayB0aGF0IGlzIGludm9rZWQgd2hlbiB0aGUgcGFuZWwgYW5pbWF0aW9uIGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLm5leHQoZXZlbnQpO1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gIH1cblxuICBfb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAvLyBTY3JvbGwgdGhlIGNvbnRlbnQgZWxlbWVudCB0byB0aGUgdG9wIGFzIHNvb24gYXMgdGhlIGFuaW1hdGlvbiBzdGFydHMuIFRoaXMgaXMgbmVjZXNzYXJ5LFxuICAgIC8vIGJlY2F1c2Ugd2UgbW92ZSBmb2N1cyB0byB0aGUgZmlyc3QgaXRlbSB3aGlsZSBpdCdzIHN0aWxsIGJlaW5nIGFuaW1hdGVkLCB3aGljaCBjYW4gdGhyb3dcbiAgICAvLyB0aGUgYnJvd3NlciBvZmYgd2hlbiBpdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgcG9zaXRpb24uIEFsdGVybmF0aXZlbHkgd2UgY2FuIG1vdmUgZm9jdXNcbiAgICAvLyB3aGVuIHRoZSBhbmltYXRpb24gaXMgZG9uZSwgaG93ZXZlciBtb3ZpbmcgZm9jdXMgYXN5bmNocm9ub3VzbHkgd2lsbCBpbnRlcnJ1cHQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyB3aGljaCBhcmUgaW4gdGhlIHByb2Nlc3Mgb2YgcmVhZGluZyBvdXQgdGhlIG1lbnUgYWxyZWFkeS4gV2UgdGFrZSB0aGUgYGVsZW1lbnRgXG4gICAgLy8gZnJvbSB0aGUgYGV2ZW50YCBzaW5jZSB3ZSBjYW4ndCB1c2UgYSBgVmlld0NoaWxkYCB0byBhY2Nlc3MgdGhlIHBhbmUuXG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggPT09IDApIHtcbiAgICAgIGV2ZW50LmVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCBhIHN0cmVhbSB0aGF0IHdpbGwga2VlcCB0cmFjayBvZiBhbnkgbmV3bHktYWRkZWQgbWVudSBpdGVtcyBhbmQgd2lsbCB1cGRhdGUgdGhlIGxpc3RcbiAgICogb2YgZGlyZWN0IGRlc2NlbmRhbnRzLiBXZSBjb2xsZWN0IHRoZSBkZXNjZW5kYW50cyB0aGlzIHdheSwgYmVjYXVzZSBgX2FsbEl0ZW1zYCBjYW4gaW5jbHVkZVxuICAgKiBpdGVtcyB0aGF0IGFyZSBwYXJ0IG9mIGNoaWxkIG1lbnVzLCBhbmQgdXNpbmcgYSBjdXN0b20gd2F5IG9mIHJlZ2lzdGVyaW5nIGl0ZW1zIGlzIHVucmVsaWFibGVcbiAgICogd2hlbiBpdCBjb21lcyB0byBtYWludGFpbmluZyB0aGUgaXRlbSBvcmRlci5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZURpcmVjdERlc2NlbmRhbnRzKCkge1xuICAgIHRoaXMuX2FsbEl0ZW1zLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9hbGxJdGVtcykpXG4gICAgICAuc3Vic2NyaWJlKChpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPikgPT4ge1xuICAgICAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMucmVzZXQoaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5fcGFyZW50TWVudSA9PT0gdGhpcykpO1xuICAgICAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgfVxufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSBXZSBzaG93IHRoZSBcIl9NYXRNZW51XCIgY2xhc3MgYXMgXCJNYXRNZW51XCIgaW4gdGhlIGRvY3MuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBNYXRNZW51IGV4dGVuZHMgX01hdE1lbnVCYXNlIHt9XG5cbi8vIE5vdGUgb24gdGhlIHdlaXJkIGluaGVyaXRhbmNlIHNldHVwOiB3ZSBuZWVkIHRocmVlIGNsYXNzZXMsIGJlY2F1c2UgdGhlIE1EQy1iYXNlZCBtZW51IGhhcyB0b1xuLy8gZXh0ZW5kIGBNYXRNZW51YCwgaG93ZXZlciBrZWVwaW5nIGEgcmVmZXJlbmNlIHRvIGl0IHdpbGwgY2F1c2UgdGhlIGlubGluZWQgdGVtcGxhdGUgYW5kIHN0eWxlc1xuLy8gdG8gYmUgcmV0YWluZWQgYXMgd2VsbC4gVGhlIE1EQyBtZW51IGFsc28gaGFzIHRvIHByb3ZpZGUgaXRzZWxmIGFzIGEgYE1hdE1lbnVgIGluIG9yZGVyIGZvclxuLy8gcXVlcmllcyBhbmQgREkgdG8gd29yayBjb3JyZWN0bHksIHdoaWxlIHN0aWxsIG5vdCByZWZlcmVuY2luZyB0aGUgYWN0dWFsIG1lbnUgY2xhc3MuXG4vLyBDbGFzcyByZXNwb25zaWJpbGl0eSBpcyBzcGxpdCB1cCBhcyBmb2xsb3dzOlxuLy8gKiBfTWF0TWVudUJhc2UgLSBwcm92aWRlcyBhbGwgdGhlIGZ1bmN0aW9uYWxpdHkgd2l0aG91dCBhbnkgb2YgdGhlIEFuZ3VsYXIgbWV0YWRhdGEuXG4vLyAqIE1hdE1lbnUgLSBrZWVwcyB0aGUgc2FtZSBuYW1lIHN5bWJvbCBuYW1lIGFzIHRoZSBjdXJyZW50IG1lbnUgYW5kXG4vLyBpcyB1c2VkIGFzIGEgcHJvdmlkZXIgZm9yIERJIGFuZCBxdWVyeSBwdXJwb3Nlcy5cbi8vICogX01hdE1lbnUgLSB0aGUgYWN0dWFsIG1lbnUgY29tcG9uZW50IGltcGxlbWVudGF0aW9uIHdpdGggdGhlIEFuZ3VsYXIgbWV0YWRhdGEgdGhhdCBzaG91bGRcbi8vIGJlIHRyZWUgc2hha2VuIGF3YXkgZm9yIE1EQy5cblxuLyoqIEBkb2NzLXB1YmxpYyBNYXRNZW51ICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbWVudScsXG4gIHRlbXBsYXRlVXJsOiAnbWVudS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ21lbnUuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdE1lbnUnLFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0TWVudUFuaW1hdGlvbnMudHJhbnNmb3JtTWVudSxcbiAgICBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtc1xuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTUFUX01FTlVfUEFORUwsIHVzZUV4aXN0aW5nOiBNYXRNZW51fSxcbiAgICB7cHJvdmlkZTogTWF0TWVudSwgdXNlRXhpc3Rpbmc6IF9NYXRNZW51fVxuICBdXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBjbGFzcyBfTWF0TWVudSBleHRlbmRzIE1hdE1lbnUge1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBuZ1pvbmU6IE5nWm9uZSxcbiAgICAgIEBJbmplY3QoTUFUX01FTlVfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0T3B0aW9uczogTWF0TWVudURlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgbmdab25lLCBkZWZhdWx0T3B0aW9ucyk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzQmFja2Ryb3A6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xufVxuIl19