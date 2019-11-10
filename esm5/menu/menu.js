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
        var newElevation = "mat-elevation-z" + (MAT_MENU_BASE_ELEVATION + depth);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUUvRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsTUFBTSxFQUNOLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNILGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFD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bUMsRUFBRSxNQUFjLEVBQ3pCLGNBQXFDO2VBQ3pFLGtCQUFNLFVBQVUsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDO0lBQzNDLENBQUM7O2dCQXRCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLDRmQUF3QjtvQkFFeEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsU0FBUztvQkFDbkIsVUFBVSxFQUFFO3dCQUNWLGlCQUFpQixDQUFDLGFBQWE7d0JBQy9CLGlCQUFpQixDQUFDLFdBQVc7cUJBQzlCO29CQUNELFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQzt3QkFDL0MsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7cUJBQzFDOztpQkFDRjs7OztnQkF2Y0MsVUFBVTtnQkFLVixNQUFNO2dEQXVjRCxNQUFNLFNBQUMsd0JBQXdCOztJQU10QyxlQUFDO0NBQUEsQUExQkQsQ0FpQjhCLE9BQU8sR0FTcEM7U0FUWSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRVNDQVBFLFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgRE9XTl9BUlJPVyxcbiAgVVBfQVJST1csXG4gIEhPTUUsXG4gIEVORCxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0TWVudUFuaW1hdGlvbnN9IGZyb20gJy4vbWVudS1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0TWVudUNvbnRlbnR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7TWVudVBvc2l0aW9uWCwgTWVudVBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LXBvc2l0aW9ucyc7XG5pbXBvcnQge3Rocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgsIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvbll9IGZyb20gJy4vbWVudS1lcnJvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNQVRfTUVOVV9QQU5FTCwgTWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBEZWZhdWx0IGBtYXQtbWVudWAgb3B0aW9ucyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRNZW51RGVmYXVsdE9wdGlvbnMge1xuICAvKiogVGhlIHgtYXhpcyBwb3NpdGlvbiBvZiB0aGUgbWVudS4gKi9cbiAgeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuXG4gIC8qKiBUaGUgeS1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB5UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgdGhlIG1lbnUgdHJpZ2dlci4gKi9cbiAgb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW47XG5cbiAgLyoqIENsYXNzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIG1lbnUncyBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LW1lbnVgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdE1lbnVEZWZhdWx0T3B0aW9ucz4oJ21hdC1tZW51LWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0TWVudURlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBvdmVybGFwVHJpZ2dlcjogZmFsc2UsXG4gICAgeFBvc2l0aW9uOiAnYWZ0ZXInLFxuICAgIHlQb3NpdGlvbjogJ2JlbG93JyxcbiAgICBiYWNrZHJvcENsYXNzOiAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICB9O1xufVxuLyoqXG4gKiBTdGFydCBlbGV2YXRpb24gZm9yIHRoZSBtZW51IHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jb25zdCBNQVRfTUVOVV9CQVNFX0VMRVZBVElPTiA9IDQ7XG5cbmxldCBtZW51UGFuZWxVaWQgPSAwO1xuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdE1lbnVgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgY2xhc3MgX01hdE1lbnVCYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPiwgT25Jbml0LFxuICBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0TWVudUl0ZW0+O1xuICBwcml2YXRlIF94UG9zaXRpb246IE1lbnVQb3NpdGlvblggPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy54UG9zaXRpb247XG4gIHByaXZhdGUgX3lQb3NpdGlvbjogTWVudVBvc2l0aW9uWSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnlQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfcHJldmlvdXNFbGV2YXRpb246IHN0cmluZztcblxuICAvKiogQWxsIGl0ZW1zIGluc2lkZSB0aGUgbWVudS4gSW5jbHVkZXMgaXRlbXMgbmVzdGVkIGluc2lkZSBhbm90aGVyIG1lbnUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9hbGxJdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKiogT25seSB0aGUgZGlyZWN0IGRlc2NlbmRhbnQgbWVudSBpdGVtcy4gKi9cbiAgcHJpdmF0ZSBfZGlyZWN0RGVzY2VuZGFudEl0ZW1zID0gbmV3IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRhYiBldmVudHMgb24gdGhlIG1lbnUgcGFuZWwgKi9cbiAgcHJpdmF0ZSBfdGFiU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBtZW51J3MgbmdDbGFzcyAqL1xuICBfY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcGFuZWwgYW5pbWF0aW9uLiAqL1xuICBfcGFuZWxBbmltYXRpb25TdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBtZW51IGNvbXBsZXRlcy4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBhbmltYXRpbmcuICovXG4gIF9pc0FuaW1hdGluZzogYm9vbGVhbjtcblxuICAvKiogUGFyZW50IG1lbnUgb2YgdGhlIGN1cnJlbnQgbWVudSBwYW5lbC4gKi9cbiAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIG9mIHRoZSBtZW51LiAqL1xuICBkaXJlY3Rpb246IERpcmVjdGlvbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB4UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWCB7IHJldHVybiB0aGlzLl94UG9zaXRpb247IH1cbiAgc2V0IHhQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWCkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2JlZm9yZScgJiYgdmFsdWUgIT09ICdhZnRlcicpIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgoKTtcbiAgICB9XG4gICAgdGhpcy5feFBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgbWVudSBpbiB0aGUgWSBheGlzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgeVBvc2l0aW9uKCk6IE1lbnVQb3NpdGlvblkgeyByZXR1cm4gdGhpcy5feVBvc2l0aW9uOyB9XG4gIHNldCB5UG9zaXRpb24odmFsdWU6IE1lbnVQb3NpdGlvblkpIHtcbiAgICBpZiAodmFsdWUgIT09ICdhYm92ZScgJiYgdmFsdWUgIT09ICdiZWxvdycpIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblkoKTtcbiAgICB9XG4gICAgdGhpcy5feVBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHRoZSBpdGVtcyBpbnNpZGUgb2YgYSBtZW51LlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE1lbnVJdGVtKSBpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKipcbiAgICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTWF0TWVudUNvbnRlbnQpIGxhenlDb250ZW50OiBNYXRNZW51Q29udGVudDtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCBpdHMgdHJpZ2dlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG92ZXJsYXBUcmlnZ2VyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcFRyaWdnZXI7IH1cbiAgc2V0IG92ZXJsYXBUcmlnZ2VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcFRyaWdnZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXBUcmlnZ2VyOiBib29sZWFuID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoYXNCYWNrZHJvcCgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHsgcmV0dXJuIHRoaXMuX2hhc0JhY2tkcm9wOyB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2hhc0JhY2tkcm9wID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oYXNCYWNrZHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c1BhbmVsQ2xhc3MgPSB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3M7XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucGFuZWxDbGFzczsgfVxuICBzZXQgY2xhc3NMaXN0KGNsYXNzZXM6IHN0cmluZykgeyB0aGlzLnBhbmVsQ2xhc3MgPSBjbGFzc2VzOyB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgY2xvc2VkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBjbG9zZTogRXZlbnRFbWl0dGVyPHZvaWQgfCAnY2xpY2snIHwgJ2tleWRvd24nIHwgJ3RhYic+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLndpdGhXcmFwKCkud2l0aFR5cGVBaGVhZCgpO1xuICAgIHRoaXMuX3RhYlN1YnNjcmlwdGlvbiA9IHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlZC5lbWl0KCd0YWInKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuZGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYlN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuY2xvc2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGhvdmVyZWQgbWVudSBpdGVtIGNoYW5nZXMuICovXG4gIF9ob3ZlcmVkKCk6IE9ic2VydmFibGU8TWF0TWVudUl0ZW0+IHtcbiAgICAvLyBDb2VyY2UgdGhlIGBjaGFuZ2VzYCBwcm9wZXJ0eSBiZWNhdXNlIEFuZ3VsYXIgdHlwZXMgaXQgYXMgYE9ic2VydmFibGU8YW55PmBcbiAgICBjb25zdCBpdGVtQ2hhbmdlcyA9IHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzIGFzIE9ic2VydmFibGU8UXVlcnlMaXN0PE1hdE1lbnVJdGVtPj47XG4gICAgcmV0dXJuIGl0ZW1DaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zKSxcbiAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9ob3ZlcmVkKSkpXG4gICAgKSBhcyBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPjtcbiAgfVxuXG4gIC8qXG4gICAqIFJlZ2lzdGVycyBhIG1lbnUgaXRlbSB3aXRoIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICBhZGRJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIHJlbW92ZUl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKiBIYW5kbGUgYSBrZXlib2FyZCBldmVudCBmcm9tIHRoZSBtZW51LCBkZWxlZ2F0aW5nIHRvIHRoZSBhcHByb3ByaWF0ZSBhY3Rpb24uICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ2x0cicpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gb3JpZ2luIEFjdGlvbiBmcm9tIHdoaWNoIHRoZSBmb2N1cyBvcmlnaW5hdGVkLiBVc2VkIHRvIHNldCB0aGUgY29ycmVjdCBzdHlsaW5nLlxuICAgKi9cbiAgZm9jdXNGaXJzdEl0ZW0ob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJyk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gV2hlbiB0aGUgY29udGVudCBpcyByZW5kZXJlZCBsYXppbHksIGl0IHRha2VzIGEgYml0IGJlZm9yZSB0aGUgaXRlbXMgYXJlIGluc2lkZSB0aGUgRE9NLlxuICAgIGlmICh0aGlzLmxhenlDb250ZW50KSB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgIC8vIE1vdmUgZm9jdXMgdG8gdGhlIG1lbnUgcGFuZWwgc28ga2V5Ym9hcmQgZXZlbnRzIGxpa2UgRXNjYXBlIHN0aWxsIHdvcmsuIEFsc28gdGhpcyB3aWxsXG4gICAgLy8gZ2l2ZSBfc29tZV8gZmVlZGJhY2sgdG8gc2NyZWVuIHJlYWRlcnMuXG4gICAgaWYgKCFtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiYgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmxlbmd0aCkge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuZmlyc3QuX2dldEhvc3RFbGVtZW50KCkucGFyZW50RWxlbWVudDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgYG1hdC1tZW51YCBpcyBhdCB0aGUgRE9NIGluc2VydGlvbiBwb2ludCwgbm90IGluc2lkZSB0aGUgb3ZlcmxheSwgd2UgZG9uJ3RcbiAgICAgIC8vIGhhdmUgYSBuaWNlIHdheSBvZiBnZXR0aW5nIGEgaG9sZCBvZiB0aGUgbWVudSBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAvLyBiZWNhdXNlIHRoZSBwYW5lbCBpcyBpbnNpZGUgYW4gYG5nLXRlbXBsYXRlYC4gV2Ugd29yayBhcm91bmQgaXQgYnkgc3RhcnRpbmcgZnJvbSBvbmUgb2ZcbiAgICAgIC8vIHRoZSBpdGVtcyBhbmQgd2Fsa2luZyB1cCB0aGUgRE9NLlxuICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJykgPT09ICdtZW51Jykge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gaW4gdGhlIG1lbnUuIFRoaXMgaXMgdXNlZCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCwgYWxsb3dpbmdcbiAgICogdGhlIHVzZXIgdG8gc3RhcnQgZnJvbSB0aGUgZmlyc3Qgb3B0aW9uIHdoZW4gcHJlc3NpbmcgdGhlIGRvd24gYXJyb3cuXG4gICAqL1xuICByZXNldEFjdGl2ZUl0ZW0oKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtZW51IHBhbmVsIGVsZXZhdGlvbi5cbiAgICogQHBhcmFtIGRlcHRoIE51bWJlciBvZiBwYXJlbnQgbWVudXMgdGhhdCBjb21lIGJlZm9yZSB0aGUgbWVudS5cbiAgICovXG4gIHNldEVsZXZhdGlvbihkZXB0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIGVsZXZhdGlvbiBzdGFydHMgYXQgdGhlIGJhc2UgYW5kIGluY3JlYXNlcyBieSBvbmUgZm9yIGVhY2ggbGV2ZWwuXG4gICAgY29uc3QgbmV3RWxldmF0aW9uID0gYG1hdC1lbGV2YXRpb24teiR7TUFUX01FTlVfQkFTRV9FTEVWQVRJT04gKyBkZXB0aH1gO1xuICAgIGNvbnN0IGN1c3RvbUVsZXZhdGlvbiA9IE9iamVjdC5rZXlzKHRoaXMuX2NsYXNzTGlzdCkuZmluZChjID0+IGMuc3RhcnRzV2l0aCgnbWF0LWVsZXZhdGlvbi16JykpO1xuXG4gICAgaWYgKCFjdXN0b21FbGV2YXRpb24gfHwgY3VzdG9tRWxldmF0aW9uID09PSB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xhc3NMaXN0W25ld0VsZXZhdGlvbl0gPSB0cnVlO1xuICAgICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3NlcyB0byB0aGUgbWVudSBwYW5lbCBiYXNlZCBvbiBpdHMgcG9zaXRpb24uIENhbiBiZSB1c2VkIGJ5XG4gICAqIGNvbnN1bWVycyB0byBhZGQgc3BlY2lmaWMgc3R5bGluZyBiYXNlZCBvbiB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NYIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSBwb3NZIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB5IGF4aXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3NYOiBNZW51UG9zaXRpb25YID0gdGhpcy54UG9zaXRpb24sIHBvc1k6IE1lbnVQb3NpdGlvblkgPSB0aGlzLnlQb3NpdGlvbikge1xuICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLl9jbGFzc0xpc3Q7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVmb3JlJ10gPSBwb3NYID09PSAnYmVmb3JlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hZnRlciddID0gcG9zWCA9PT0gJ2FmdGVyJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hYm92ZSddID0gcG9zWSA9PT0gJ2Fib3ZlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWxvdyddID0gcG9zWSA9PT0gJ2JlbG93JztcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGVudGVyIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9yZXNldEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHBhbmVsIGFuaW1hdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gKi9cbiAgX3Jlc2V0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9zdGFydEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBwYW5lbCBhbmltYXRpb24gY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dChldmVudCk7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgIC8vIFNjcm9sbCB0aGUgY29udGVudCBlbGVtZW50IHRvIHRoZSB0b3AgYXMgc29vbiBhcyB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gVGhpcyBpcyBuZWNlc3NhcnksXG4gICAgLy8gYmVjYXVzZSB3ZSBtb3ZlIGZvY3VzIHRvIHRoZSBmaXJzdCBpdGVtIHdoaWxlIGl0J3Mgc3RpbGwgYmVpbmcgYW5pbWF0ZWQsIHdoaWNoIGNhbiB0aHJvd1xuICAgIC8vIHRoZSBicm93c2VyIG9mZiB3aGVuIGl0IGRldGVybWluZXMgdGhlIHNjcm9sbCBwb3NpdGlvbi4gQWx0ZXJuYXRpdmVseSB3ZSBjYW4gbW92ZSBmb2N1c1xuICAgIC8vIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBob3dldmVyIG1vdmluZyBmb2N1cyBhc3luY2hyb25vdXNseSB3aWxsIGludGVycnVwdCBzY3JlZW5cbiAgICAvLyByZWFkZXJzIHdoaWNoIGFyZSBpbiB0aGUgcHJvY2VzcyBvZiByZWFkaW5nIG91dCB0aGUgbWVudSBhbHJlYWR5LiBXZSB0YWtlIHRoZSBgZWxlbWVudGBcbiAgICAvLyBmcm9tIHRoZSBgZXZlbnRgIHNpbmNlIHdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIHRvIGFjY2VzcyB0aGUgcGFuZS5cbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJyAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gMCkge1xuICAgICAgZXZlbnQuZWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIGEgc3RyZWFtIHRoYXQgd2lsbCBrZWVwIHRyYWNrIG9mIGFueSBuZXdseS1hZGRlZCBtZW51IGl0ZW1zIGFuZCB3aWxsIHVwZGF0ZSB0aGUgbGlzdFxuICAgKiBvZiBkaXJlY3QgZGVzY2VuZGFudHMuIFdlIGNvbGxlY3QgdGhlIGRlc2NlbmRhbnRzIHRoaXMgd2F5LCBiZWNhdXNlIGBfYWxsSXRlbXNgIGNhbiBpbmNsdWRlXG4gICAqIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgY2hpbGQgbWVudXMsIGFuZCB1c2luZyBhIGN1c3RvbSB3YXkgb2YgcmVnaXN0ZXJpbmcgaXRlbXMgaXMgdW5yZWxpYWJsZVxuICAgKiB3aGVuIGl0IGNvbWVzIHRvIG1haW50YWluaW5nIHRoZSBpdGVtIG9yZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKSB7XG4gICAgdGhpcy5fYWxsSXRlbXMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbEl0ZW1zKSlcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5yZXNldChpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9wYXJlbnRNZW51ID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlIFdlIHNob3cgdGhlIFwiX01hdE1lbnVcIiBjbGFzcyBhcyBcIk1hdE1lbnVcIiBpbiB0aGUgZG9jcy4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE1hdE1lbnUgZXh0ZW5kcyBfTWF0TWVudUJhc2Uge31cblxuLy8gTm90ZSBvbiB0aGUgd2VpcmQgaW5oZXJpdGFuY2Ugc2V0dXA6IHdlIG5lZWQgdGhyZWUgY2xhc3NlcywgYmVjYXVzZSB0aGUgTURDLWJhc2VkIG1lbnUgaGFzIHRvXG4vLyBleHRlbmQgYE1hdE1lbnVgLCBob3dldmVyIGtlZXBpbmcgYSByZWZlcmVuY2UgdG8gaXQgd2lsbCBjYXVzZSB0aGUgaW5saW5lZCB0ZW1wbGF0ZSBhbmQgc3R5bGVzXG4vLyB0byBiZSByZXRhaW5lZCBhcyB3ZWxsLiBUaGUgTURDIG1lbnUgYWxzbyBoYXMgdG8gcHJvdmlkZSBpdHNlbGYgYXMgYSBgTWF0TWVudWAgaW4gb3JkZXIgZm9yXG4vLyBxdWVyaWVzIGFuZCBESSB0byB3b3JrIGNvcnJlY3RseSwgd2hpbGUgc3RpbGwgbm90IHJlZmVyZW5jaW5nIHRoZSBhY3R1YWwgbWVudSBjbGFzcy5cbi8vIENsYXNzIHJlc3BvbnNpYmlsaXR5IGlzIHNwbGl0IHVwIGFzIGZvbGxvd3M6XG4vLyAqIF9NYXRNZW51QmFzZSAtIHByb3ZpZGVzIGFsbCB0aGUgZnVuY3Rpb25hbGl0eSB3aXRob3V0IGFueSBvZiB0aGUgQW5ndWxhciBtZXRhZGF0YS5cbi8vICogTWF0TWVudSAtIGtlZXBzIHRoZSBzYW1lIG5hbWUgc3ltYm9sIG5hbWUgYXMgdGhlIGN1cnJlbnQgbWVudSBhbmRcbi8vIGlzIHVzZWQgYXMgYSBwcm92aWRlciBmb3IgREkgYW5kIHF1ZXJ5IHB1cnBvc2VzLlxuLy8gKiBfTWF0TWVudSAtIHRoZSBhY3R1YWwgbWVudSBjb21wb25lbnQgaW1wbGVtZW50YXRpb24gd2l0aCB0aGUgQW5ndWxhciBtZXRhZGF0YSB0aGF0IHNob3VsZFxuLy8gYmUgdHJlZSBzaGFrZW4gYXdheSBmb3IgTURDLlxuXG4vKiogQGRvY3MtcHVibGljIE1hdE1lbnUgKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICdtZW51Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnbWVudS5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0TWVudScsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRNZW51QW5pbWF0aW9ucy50cmFuc2Zvcm1NZW51LFxuICAgIG1hdE1lbnVBbmltYXRpb25zLmZhZGVJbkl0ZW1zXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNQVRfTUVOVV9QQU5FTCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnV9LFxuICAgIHtwcm92aWRlOiBNYXRNZW51LCB1c2VFeGlzdGluZzogX01hdE1lbnV9XG4gIF1cbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGNsYXNzIF9NYXRNZW51IGV4dGVuZHMgTWF0TWVudSB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIG5nWm9uZTogTmdab25lLFxuICAgICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBuZ1pvbmUsIGRlZmF1bHRPcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vdmVybGFwVHJpZ2dlcjogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNCYWNrZHJvcDogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG4iXX0=