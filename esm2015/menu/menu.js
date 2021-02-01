/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Output, TemplateRef, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { matMenuAnimations } from './menu-animations';
import { MAT_MENU_CONTENT, MatMenuContent } from './menu-content';
import { throwMatMenuInvalidPositionX, throwMatMenuInvalidPositionY } from './menu-errors';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
/** Injection token to be used to override the default options for `mat-menu`. */
export const MAT_MENU_DEFAULT_OPTIONS = new InjectionToken('mat-menu-default-options', {
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
const MAT_MENU_BASE_ELEVATION = 4;
let menuPanelUid = 0;
/** Base class with all of the `MatMenu` functionality. */
export class _MatMenuBase {
    constructor(_elementRef, _ngZone, _defaultOptions) {
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
        /** Class or list of classes to be added to the overlay panel. */
        this.overlayPanelClass = this._defaultOptions.overlayPanelClass || '';
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
        this.panelId = `mat-menu-panel-${menuPanelUid++}`;
    }
    /** Position of the menu in the X axis. */
    get xPosition() { return this._xPosition; }
    set xPosition(value) {
        if (value !== 'before' && value !== 'after' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionX();
        }
        this._xPosition = value;
        this.setPositionClasses();
    }
    /** Position of the menu in the Y axis. */
    get yPosition() { return this._yPosition; }
    set yPosition(value) {
        if (value !== 'above' && value !== 'below' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionY();
        }
        this._yPosition = value;
        this.setPositionClasses();
    }
    /** Whether the menu should overlap its trigger. */
    get overlapTrigger() { return this._overlapTrigger; }
    set overlapTrigger(value) {
        this._overlapTrigger = coerceBooleanProperty(value);
    }
    /** Whether the menu has a backdrop. */
    get hasBackdrop() { return this._hasBackdrop; }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        const previousPanelClass = this._previousPanelClass;
        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((className) => {
                this._classList[className] = false;
            });
        }
        this._previousPanelClass = classes;
        if (classes && classes.length) {
            classes.split(' ').forEach((className) => {
                this._classList[className] = true;
            });
            this._elementRef.nativeElement.className = '';
        }
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList() { return this.panelClass; }
    set classList(classes) { this.panelClass = classes; }
    ngOnInit() {
        this.setPositionClasses();
    }
    ngAfterContentInit() {
        this._updateDirectDescendants();
        this._keyManager = new FocusKeyManager(this._directDescendantItems)
            .withWrap()
            .withTypeAhead()
            .withHomeAndEnd();
        this._tabSubscription = this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));
        // If a user manually (programatically) focuses a menu item, we need to reflect that focus
        // change back to the key manager. Note that we don't need to unsubscribe here because _focused
        // is internal and we know that it gets completed on destroy.
        this._directDescendantItems.changes.pipe(startWith(this._directDescendantItems), switchMap(items => merge(...items.map((item) => item._focused)))).subscribe(focusedItem => this._keyManager.updateActiveItem(focusedItem));
    }
    ngOnDestroy() {
        this._directDescendantItems.destroy();
        this._tabSubscription.unsubscribe();
        this.closed.complete();
    }
    /** Stream that emits whenever the hovered menu item changes. */
    _hovered() {
        // Coerce the `changes` property because Angular types it as `Observable<any>`
        const itemChanges = this._directDescendantItems.changes;
        return itemChanges.pipe(startWith(this._directDescendantItems), switchMap(items => merge(...items.map((item) => item._hovered))));
    }
    /*
     * Registers a menu item with the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    addItem(_item) { }
    /**
     * Removes an item from the menu.
     * @docs-private
     * @deprecated No longer being used. To be removed.
     * @breaking-change 9.0.0
     */
    removeItem(_item) { }
    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
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
            default:
                if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
                    manager.setFocusOrigin('keyboard');
                }
                manager.onKeydown(event);
        }
    }
    /**
     * Focus the first item in the menu.
     * @param origin Action from which the focus originated. Used to set the correct styling.
     */
    focusFirstItem(origin = 'program') {
        // When the content is rendered lazily, it takes a bit before the items are inside the DOM.
        if (this.lazyContent) {
            this._ngZone.onStable
                .pipe(take(1))
                .subscribe(() => this._focusFirstItem(origin));
        }
        else {
            this._focusFirstItem(origin);
        }
    }
    /**
     * Actual implementation that focuses the first item. Needs to be separated
     * out so we don't repeat the same logic in the public `focusFirstItem` method.
     */
    _focusFirstItem(origin) {
        const manager = this._keyManager;
        manager.setFocusOrigin(origin).setFirstItemActive();
        // If there's no active item at this point, it means that all the items are disabled.
        // Move focus to the menu panel so keyboard events like Escape still work. Also this will
        // give _some_ feedback to screen readers.
        if (!manager.activeItem && this._directDescendantItems.length) {
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
     */
    resetActiveItem() {
        this._keyManager.setActiveItem(-1);
    }
    /**
     * Sets the menu panel elevation.
     * @param depth Number of parent menus that come before the menu.
     */
    setElevation(depth) {
        // The elevation starts at the base and increases by one for each level.
        // Capped at 24 because that's the maximum elevation defined in the Material design spec.
        const elevation = Math.min(MAT_MENU_BASE_ELEVATION + depth, 24);
        const newElevation = `mat-elevation-z${elevation}`;
        const customElevation = Object.keys(this._classList).find(c => c.startsWith('mat-elevation-z'));
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
     * @param posX Position of the menu along the x axis.
     * @param posY Position of the menu along the y axis.
     * @docs-private
     */
    setPositionClasses(posX = this.xPosition, posY = this.yPosition) {
        const classes = this._classList;
        classes['mat-menu-before'] = posX === 'before';
        classes['mat-menu-after'] = posX === 'after';
        classes['mat-menu-above'] = posY === 'above';
        classes['mat-menu-below'] = posY === 'below';
    }
    /** Starts the enter animation. */
    _startAnimation() {
        // @breaking-change 8.0.0 Combine with _resetAnimation.
        this._panelAnimationState = 'enter';
    }
    /** Resets the panel animation to its initial state. */
    _resetAnimation() {
        // @breaking-change 8.0.0 Combine with _startAnimation.
        this._panelAnimationState = 'void';
    }
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event) {
        this._animationDone.next(event);
        this._isAnimating = false;
    }
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
     */
    _updateDirectDescendants() {
        this._allItems.changes
            .pipe(startWith(this._allItems))
            .subscribe((items) => {
            this._directDescendantItems.reset(items.filter(item => item._parentMenu === this));
            this._directDescendantItems.notifyOnChanges();
        });
    }
}
_MatMenuBase.decorators = [
    { type: Directive }
];
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
    lazyContent: [{ type: ContentChild, args: [MAT_MENU_CONTENT,] }],
    overlapTrigger: [{ type: Input }],
    hasBackdrop: [{ type: Input }],
    panelClass: [{ type: Input, args: ['class',] }],
    classList: [{ type: Input }],
    closed: [{ type: Output }],
    close: [{ type: Output }]
};
/** @docs-public MatMenu */
export class MatMenu extends _MatMenuBase {
    constructor(elementRef, ngZone, defaultOptions) {
        super(elementRef, ngZone, defaultOptions);
    }
}
MatMenu.decorators = [
    { type: Component, args: [{
                selector: 'mat-menu',
                template: "<ng-template>\n  <div\n    class=\"mat-menu-panel\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                exportAs: 'matMenu',
                host: {
                    '[attr.aria-label]': 'null',
                    '[attr.aria-labelledby]': 'null',
                    '[attr.aria-describedby]': 'null',
                },
                animations: [
                    matMenuAnimations.transformMenu,
                    matMenuAnimations.fadeInItems
                ],
                providers: [
                    { provide: MAT_MENU_PANEL, useExisting: MatMenu },
                ],
                styles: [".mat-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh - 48px);border-radius:4px;outline:0;min-height:64px}.mat-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-menu-panel{outline:solid 1px}.mat-menu-content:not(:empty){padding-top:8px;padding-bottom:8px}.mat-menu-item{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative}.mat-menu-item::-moz-focus-inner{border:0}.mat-menu-item[disabled]{cursor:default}[dir=rtl] .mat-menu-item{text-align:right}.mat-menu-item .mat-icon{margin-right:16px;vertical-align:middle}.mat-menu-item .mat-icon svg{vertical-align:top}[dir=rtl] .mat-menu-item .mat-icon{margin-left:16px;margin-right:0}.mat-menu-item[disabled]{pointer-events:none}.cdk-high-contrast-active .mat-menu-item{margin-top:1px}.cdk-high-contrast-active .mat-menu-item.cdk-program-focused,.cdk-high-contrast-active .mat-menu-item.cdk-keyboard-focused,.cdk-high-contrast-active .mat-menu-item-highlighted{outline:dotted 1px}.mat-menu-item-submenu-trigger{padding-right:32px}.mat-menu-item-submenu-trigger::after{width:0;height:0;border-style:solid;border-width:5px 0 5px 5px;border-color:transparent transparent transparent currentColor;content:\"\";display:inline-block;position:absolute;top:50%;right:16px;transform:translateY(-50%)}[dir=rtl] .mat-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}[dir=rtl] .mat-menu-item-submenu-trigger::after{right:auto;left:16px;transform:rotateY(180deg) translateY(-50%)}button.mat-menu-item{width:100%}.mat-menu-item .mat-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
            },] }
];
MatMenu.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRSxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFDO0FBd0IxRCxpRkFBaUY7QUFDakYsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQ2pDLElBQUksY0FBYyxDQUF3QiwwQkFBMEIsRUFBRTtJQUNwRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsZ0NBQWdDO0NBQzFDLENBQUMsQ0FBQztBQUVQLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsZ0NBQWdDO0lBQzlDLE9BQU87UUFDTCxjQUFjLEVBQUUsS0FBSztRQUNyQixTQUFTLEVBQUUsT0FBTztRQUNsQixTQUFTLEVBQUUsT0FBTztRQUNsQixhQUFhLEVBQUUsa0NBQWtDO0tBQ2xELENBQUM7QUFDSixDQUFDO0FBQ0Q7OztHQUdHO0FBQ0gsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLENBQUM7QUFFbEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBT3JCLDBEQUEwRDtBQUUxRCxNQUFNLE9BQU8sWUFBWTtJQTJKdkIsWUFDVSxXQUFvQyxFQUNwQyxPQUFlLEVBQ21CLGVBQXNDO1FBRnhFLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ21CLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQTNKMUUsZUFBVSxHQUFrQixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztRQUMzRCxlQUFVLEdBQWtCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1FBTW5FLDZDQUE2QztRQUNyQywyQkFBc0IsR0FBRyxJQUFJLFNBQVMsRUFBZSxDQUFDO1FBRTlELG1EQUFtRDtRQUMzQyxxQkFBZ0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBRTlDLHlEQUF5RDtRQUN6RCxlQUFVLEdBQTZCLEVBQUUsQ0FBQztRQUUxQyw0Q0FBNEM7UUFDNUMseUJBQW9CLEdBQXFCLE1BQU0sQ0FBQztRQUVoRCx5REFBeUQ7UUFDekQsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQVcvQyxpRUFBaUU7UUFDakUsc0JBQWlCLEdBQW9CLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDO1FBRWxGLGlEQUFpRDtRQUN4QyxrQkFBYSxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDO1FBd0Q1RCxvQkFBZSxHQUFZLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO1FBUS9ELGlCQUFZLEdBQXdCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO1FBeUM3RSw2Q0FBNkM7UUFDMUIsV0FBTSxHQUFrQyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUUvRjs7OztXQUlHO1FBQ08sVUFBSyxHQUFrQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXBELFlBQU8sR0FBRyxrQkFBa0IsWUFBWSxFQUFFLEVBQUUsQ0FBQztJQUtnQyxDQUFDO0lBN0d2RiwwQ0FBMEM7SUFDMUMsSUFDSSxTQUFTLEtBQW9CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFTLENBQUMsS0FBb0I7UUFDaEMsSUFBSSxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxPQUFPO1lBQ3pDLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ2pELDRCQUE0QixFQUFFLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsMENBQTBDO0lBQzFDLElBQ0ksU0FBUyxLQUFvQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFELElBQUksU0FBUyxDQUFDLEtBQW9CO1FBQ2hDLElBQUksS0FBSyxLQUFLLE9BQU8sSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQzdGLDRCQUE0QixFQUFFLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBa0JELG1EQUFtRDtJQUNuRCxJQUNJLGNBQWMsS0FBYyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzlELElBQUksY0FBYyxDQUFDLEtBQWM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBR0QsdUNBQXVDO0lBQ3ZDLElBQ0ksV0FBVyxLQUEwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLElBQUksV0FBVyxDQUFDLEtBQTBCO1FBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsSUFDSSxVQUFVLENBQUMsT0FBZTtRQUM1QixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUVwRCxJQUFJLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUNuRCxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBaUIsRUFBRSxFQUFFO2dCQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBaUIsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBR0Q7Ozs7OztPQU1HO0lBQ0gsSUFDSSxTQUFTLEtBQWEsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNuRCxJQUFJLFNBQVMsQ0FBQyxPQUFlLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBbUI3RCxRQUFRO1FBQ04sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQzthQUNoRSxRQUFRLEVBQUU7YUFDVixhQUFhLEVBQUU7YUFDZixjQUFjLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekYsMEZBQTBGO1FBQzFGLCtGQUErRjtRQUMvRiw2REFBNkQ7UUFDN0QsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ3RDLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFDdEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFjLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQWlCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQzNGLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxnRUFBZ0U7SUFDaEUsUUFBUTtRQUNOLDhFQUE4RTtRQUM5RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBNkMsQ0FBQztRQUM5RixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFDdEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQWlCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQ25ELENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsT0FBTyxDQUFDLEtBQWtCLElBQUcsQ0FBQztJQUU5Qjs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxLQUFrQixJQUFHLENBQUM7SUFFakMsbUZBQW1GO0lBQ25GLGNBQWMsQ0FBQyxLQUFvQjtRQUNqQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFakMsUUFBUSxPQUFPLEVBQUU7WUFDZixLQUFLLE1BQU07Z0JBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDMUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0gsTUFBTTtZQUNOLEtBQUssVUFBVTtnQkFDYixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7b0JBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM3QjtnQkFDSCxNQUFNO1lBQ04sS0FBSyxXQUFXO2dCQUNkLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRTtvQkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzdCO2dCQUNILE1BQU07WUFDTjtnQkFDRSxJQUFJLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLFVBQVUsRUFBRTtvQkFDbEQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDcEM7Z0JBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsU0FBc0IsU0FBUztRQUM1QywyRkFBMkY7UUFDM0YsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtpQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDYixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxNQUFtQjtRQUN6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRWpDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUVwRCxxRkFBcUY7UUFDckYseUZBQXlGO1FBQ3pGLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFO1lBQzdELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDO1lBRWhGLHlGQUF5RjtZQUN6Rix5RkFBeUY7WUFDekYsMEZBQTBGO1lBQzFGLG9DQUFvQztZQUNwQyxPQUFPLE9BQU8sRUFBRTtnQkFDZCxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxFQUFFO29CQUMzQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2hCLE1BQU07aUJBQ1A7cUJBQU07b0JBQ0wsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7aUJBQ2pDO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLEtBQWE7UUFDeEIsd0VBQXdFO1FBQ3hFLHlGQUF5RjtRQUN6RixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxNQUFNLFlBQVksR0FBRyxrQkFBa0IsU0FBUyxFQUFFLENBQUM7UUFDbkQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxDQUFDLGVBQWUsSUFBSSxlQUFlLEtBQUssSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ25FLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUNsRDtZQUVELElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsa0JBQWtCLENBQUMsT0FBc0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFzQixJQUFJLENBQUMsU0FBUztRQUMzRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksS0FBSyxRQUFRLENBQUM7UUFDL0MsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxLQUFLLE9BQU8sQ0FBQztRQUM3QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxJQUFJLEtBQUssT0FBTyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksS0FBSyxPQUFPLENBQUM7SUFDL0MsQ0FBQztJQUVELGtDQUFrQztJQUNsQyxlQUFlO1FBQ2IsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUM7SUFDdEMsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxlQUFlO1FBQ2IsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUM7SUFDckMsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxnQkFBZ0IsQ0FBQyxLQUFxQjtRQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBcUI7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFekIsNEZBQTRGO1FBQzVGLDJGQUEyRjtRQUMzRiwwRkFBMEY7UUFDMUYsd0ZBQXdGO1FBQ3hGLDBGQUEwRjtRQUMxRix3RUFBd0U7UUFDeEUsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsS0FBSyxDQUFDLEVBQUU7WUFDdkUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssd0JBQXdCO1FBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTzthQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvQixTQUFTLENBQUMsQ0FBQyxLQUE2QixFQUFFLEVBQUU7WUFDM0MsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OztZQTNYRixTQUFTOzs7WUEzRVIsVUFBVTtZQUtWLE1BQU07NENBcU9ILE1BQU0sU0FBQyx3QkFBd0I7Ozt3QkF0SmpDLGVBQWUsU0FBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQThCaEQsS0FBSzt3QkFHTCxLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGtCQUFrQjt3QkFHeEIsS0FBSzt3QkFZTCxLQUFLOzBCQVdMLFNBQVMsU0FBQyxXQUFXO29CQU9yQixlQUFlLFNBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQzswQkFNakQsWUFBWSxTQUFDLGdCQUFnQjs2QkFHN0IsS0FBSzswQkFRTCxLQUFLO3lCQWFMLEtBQUssU0FBQyxPQUFPO3dCQTZCYixLQUFLO3FCQUtMLE1BQU07b0JBT04sTUFBTTs7QUF5T1QsMkJBQTJCO0FBcUIzQixNQUFNLE9BQU8sT0FBUSxTQUFRLFlBQVk7SUFDdkMsWUFBWSxVQUFtQyxFQUFFLE1BQWMsRUFDekIsY0FBcUM7UUFDekUsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7O1lBeEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIseXBCQUF3QjtnQkFFeEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsU0FBUztnQkFDbkIsSUFBSSxFQUFFO29CQUNKLG1CQUFtQixFQUFFLE1BQU07b0JBQzNCLHdCQUF3QixFQUFFLE1BQU07b0JBQ2hDLHlCQUF5QixFQUFFLE1BQU07aUJBQ2xDO2dCQUNELFVBQVUsRUFBRTtvQkFDVixpQkFBaUIsQ0FBQyxhQUFhO29CQUMvQixpQkFBaUIsQ0FBQyxXQUFXO2lCQUM5QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUM7aUJBQ2hEOzthQUNGOzs7WUFoZUMsVUFBVTtZQUtWLE1BQU07NENBOGRELE1BQU0sU0FBQyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXIsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEVTQ0FQRSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIERPV05fQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRNZW51QW5pbWF0aW9uc30gZnJvbSAnLi9tZW51LWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNQVRfTUVOVV9DT05URU5ULCBNYXRNZW51Q29udGVudH0gZnJvbSAnLi9tZW51LWNvbnRlbnQnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1tZW51YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRNZW51RGVmYXVsdE9wdGlvbnM+KCdtYXQtbWVudS1kZWZhdWx0LW9wdGlvbnMnLCB7XG4gICAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgICBmYWN0b3J5OiBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWVxuICAgIH0pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgb3ZlcmxhcFRyaWdnZXI6IGZhbHNlLFxuICAgIHhQb3NpdGlvbjogJ2FmdGVyJyxcbiAgICB5UG9zaXRpb246ICdiZWxvdycsXG4gICAgYmFja2Ryb3BDbGFzczogJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgfTtcbn1cbi8qKlxuICogU3RhcnQgZWxldmF0aW9uIGZvciB0aGUgbWVudSBwYW5lbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgTUFUX01FTlVfQkFTRV9FTEVWQVRJT04gPSA0O1xuXG5sZXQgbWVudVBhbmVsVWlkID0gMDtcblxuXG4vKiogUmVhc29uIHdoeSB0aGUgbWVudSB3YXMgY2xvc2VkLiAqL1xuZXhwb3J0IHR5cGUgTWVudUNsb3NlUmVhc29uID0gdm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJztcblxuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdE1lbnVgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBfTWF0TWVudUJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LCBPbkluaXQsXG4gIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT47XG4gIHByaXZhdGUgX3hQb3NpdGlvbjogTWVudVBvc2l0aW9uWCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgcHJpdmF0ZSBfeVBvc2l0aW9uOiBNZW51UG9zaXRpb25ZID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueVBvc2l0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBBbGwgaXRlbXMgaW5zaWRlIHRoZSBtZW51LiBJbmNsdWRlcyBpdGVtcyBuZXN0ZWQgaW5zaWRlIGFub3RoZXIgbWVudS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2FsbEl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKiBPbmx5IHRoZSBkaXJlY3QgZGVzY2VuZGFudCBtZW51IGl0ZW1zLiAqL1xuICBwcml2YXRlIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGFiIGV2ZW50cyBvbiB0aGUgbWVudSBwYW5lbCAqL1xuICBwcml2YXRlIF90YWJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIG1lbnUncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmd8c3RyaW5nW10gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5vdmVybGF5UGFuZWxDbGFzcyB8fCAnJztcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG5cbiAgLyoqIGFyaWEtbGFiZWwgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogYXJpYS1sYWJlbGxlZGJ5IGZvciB0aGUgbWVudSBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWRlc2NyaWJlZGJ5IGZvciB0aGUgbWVudSBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB4UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWCB7IHJldHVybiB0aGlzLl94UG9zaXRpb247IH1cbiAgc2V0IHhQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWCkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2JlZm9yZScgJiYgdmFsdWUgIT09ICdhZnRlcicgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25YKCk7XG4gICAgfVxuICAgIHRoaXMuX3hQb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHlQb3NpdGlvbigpOiBNZW51UG9zaXRpb25ZIHsgcmV0dXJuIHRoaXMuX3lQb3NpdGlvbjsgfVxuICBzZXQgeVBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25ZKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYWJvdmUnICYmIHZhbHVlICE9PSAnYmVsb3cnICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25ZKCk7XG4gICAgfVxuICAgIHRoaXMuX3lQb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogTGlzdCBvZiB0aGUgaXRlbXMgaW5zaWRlIG9mIGEgbWVudS5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKlxuICAgKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfTUVOVV9DT05URU5UKSBsYXp5Q29udGVudDogTWF0TWVudUNvbnRlbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgaXRzIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBvdmVybGFwVHJpZ2dlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXBUcmlnZ2VyOyB9XG4gIHNldCBvdmVybGFwVHJpZ2dlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX292ZXJsYXBUcmlnZ2VyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9vdmVybGFwVHJpZ2dlcjogYm9vbGVhbiA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLm92ZXJsYXBUcmlnZ2VyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGFzQmFja2Ryb3AoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLl9oYXNCYWNrZHJvcDsgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9oYXNCYWNrZHJvcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGFzQmFja2Ryb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5oYXNCYWNrZHJvcDtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lbENsYXNzID0gdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzO1xuXG4gICAgaWYgKHByZXZpb3VzUGFuZWxDbGFzcyAmJiBwcmV2aW91c1BhbmVsQ2xhc3MubGVuZ3RoKSB7XG4gICAgICBwcmV2aW91c1BhbmVsQ2xhc3Muc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzID0gY2xhc3NlcztcblxuICAgIGlmIChjbGFzc2VzICYmIGNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBjbGFzc2VzLnNwbGl0KCcgJykuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcHJldmlvdXNQYW5lbENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1tZW51IGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogbWVudSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgbWVudSBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBwYW5lbENsYXNzYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xhc3NMaXN0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnBhbmVsQ2xhc3M7IH1cbiAgc2V0IGNsYXNzTGlzdChjbGFzc2VzOiBzdHJpbmcpIHsgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlczsgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYGNsb3NlZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgY2xvc2U6IEV2ZW50RW1pdHRlcjxNZW51Q2xvc2VSZWFzb24+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhUeXBlQWhlYWQoKVxuICAgICAgLndpdGhIb21lQW5kRW5kKCk7XG4gICAgdGhpcy5fdGFiU3Vic2NyaXB0aW9uID0gdGhpcy5fa2V5TWFuYWdlci50YWJPdXQuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2VkLmVtaXQoJ3RhYicpKTtcblxuICAgIC8vIElmIGEgdXNlciBtYW51YWxseSAocHJvZ3JhbWF0aWNhbGx5KSBmb2N1c2VzIGEgbWVudSBpdGVtLCB3ZSBuZWVkIHRvIHJlZmxlY3QgdGhhdCBmb2N1c1xuICAgIC8vIGNoYW5nZSBiYWNrIHRvIHRoZSBrZXkgbWFuYWdlci4gTm90ZSB0aGF0IHdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgaGVyZSBiZWNhdXNlIF9mb2N1c2VkXG4gICAgLy8gaXMgaW50ZXJuYWwgYW5kIHdlIGtub3cgdGhhdCBpdCBnZXRzIGNvbXBsZXRlZCBvbiBkZXN0cm95LlxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zKSxcbiAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZTxNYXRNZW51SXRlbT4oLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5fZm9jdXNlZCkpKVxuICAgICkuc3Vic2NyaWJlKGZvY3VzZWRJdGVtID0+IHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShmb2N1c2VkSXRlbSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmRlc3Ryb3koKTtcbiAgICB0aGlzLl90YWJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBob3ZlcmVkIG1lbnUgaXRlbSBjaGFuZ2VzLiAqL1xuICBfaG92ZXJlZCgpOiBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPiB7XG4gICAgLy8gQ29lcmNlIHRoZSBgY2hhbmdlc2AgcHJvcGVydHkgYmVjYXVzZSBBbmd1bGFyIHR5cGVzIGl0IGFzIGBPYnNlcnZhYmxlPGFueT5gXG4gICAgY29uc3QgaXRlbUNoYW5nZXMgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcyBhcyBPYnNlcnZhYmxlPFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4+O1xuICAgIHJldHVybiBpdGVtQ2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2UoLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5faG92ZXJlZCkpKVxuICAgICkgYXMgT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT47XG4gIH1cblxuICAvKlxuICAgKiBSZWdpc3RlcnMgYSBtZW51IGl0ZW0gd2l0aCB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgYWRkSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICByZW1vdmVJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKiogSGFuZGxlIGEga2V5Ym9hcmQgZXZlbnQgZnJvbSB0aGUgbWVudSwgZGVsZWdhdGluZyB0byB0aGUgYXBwcm9wcmlhdGUgYWN0aW9uLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdsdHInKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbigna2V5Ym9hcmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBvcmlnaW4gQWN0aW9uIGZyb20gd2hpY2ggdGhlIGZvY3VzIG9yaWdpbmF0ZWQuIFVzZWQgdG8gc2V0IHRoZSBjb3JyZWN0IHN0eWxpbmcuXG4gICAqL1xuICBmb2N1c0ZpcnN0SXRlbShvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTogdm9pZCB7XG4gICAgLy8gV2hlbiB0aGUgY29udGVudCBpcyByZW5kZXJlZCBsYXppbHksIGl0IHRha2VzIGEgYml0IGJlZm9yZSB0aGUgaXRlbXMgYXJlIGluc2lkZSB0aGUgRE9NLlxuICAgIGlmICh0aGlzLmxhenlDb250ZW50KSB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9mb2N1c0ZpcnN0SXRlbShvcmlnaW4pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZm9jdXNGaXJzdEl0ZW0ob3JpZ2luKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWN0dWFsIGltcGxlbWVudGF0aW9uIHRoYXQgZm9jdXNlcyB0aGUgZmlyc3QgaXRlbS4gTmVlZHMgdG8gYmUgc2VwYXJhdGVkXG4gICAqIG91dCBzbyB3ZSBkb24ndCByZXBlYXQgdGhlIHNhbWUgbG9naWMgaW4gdGhlIHB1YmxpYyBgZm9jdXNGaXJzdEl0ZW1gIG1ldGhvZC5cbiAgICovXG4gIHByaXZhdGUgX2ZvY3VzRmlyc3RJdGVtKG9yaWdpbjogRm9jdXNPcmlnaW4pIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4ob3JpZ2luKS5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcblxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gYWN0aXZlIGl0ZW0gYXQgdGhpcyBwb2ludCwgaXQgbWVhbnMgdGhhdCBhbGwgdGhlIGl0ZW1zIGFyZSBkaXNhYmxlZC5cbiAgICAvLyBNb3ZlIGZvY3VzIHRvIHRoZSBtZW51IHBhbmVsIHNvIGtleWJvYXJkIGV2ZW50cyBsaWtlIEVzY2FwZSBzdGlsbCB3b3JrLiBBbHNvIHRoaXMgd2lsbFxuICAgIC8vIGdpdmUgX3NvbWVfIGZlZWRiYWNrIHRvIHNjcmVlbiByZWFkZXJzLlxuICAgIGlmICghbWFuYWdlci5hY3RpdmVJdGVtICYmIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5sZW5ndGgpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmZpcnN0Ll9nZXRIb3N0RWxlbWVudCgpLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgIC8vIEJlY2F1c2UgdGhlIGBtYXQtbWVudWAgaXMgYXQgdGhlIERPTSBpbnNlcnRpb24gcG9pbnQsIG5vdCBpbnNpZGUgdGhlIG92ZXJsYXksIHdlIGRvbid0XG4gICAgICAvLyBoYXZlIGEgbmljZSB3YXkgb2YgZ2V0dGluZyBhIGhvbGQgb2YgdGhlIG1lbnUgcGFuZWwuIFdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIGVpdGhlclxuICAgICAgLy8gYmVjYXVzZSB0aGUgcGFuZWwgaXMgaW5zaWRlIGFuIGBuZy10ZW1wbGF0ZWAuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IHN0YXJ0aW5nIGZyb20gb25lIG9mXG4gICAgICAvLyB0aGUgaXRlbXMgYW5kIHdhbGtpbmcgdXAgdGhlIERPTS5cbiAgICAgIHdoaWxlIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnbWVudScpIHtcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGFjdGl2ZSBpdGVtIGluIHRoZSBtZW51LiBUaGlzIGlzIHVzZWQgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQsIGFsbG93aW5nXG4gICAqIHRoZSB1c2VyIHRvIHN0YXJ0IGZyb20gdGhlIGZpcnN0IG9wdGlvbiB3aGVuIHByZXNzaW5nIHRoZSBkb3duIGFycm93LlxuICAgKi9cbiAgcmVzZXRBY3RpdmVJdGVtKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWVudSBwYW5lbCBlbGV2YXRpb24uXG4gICAqIEBwYXJhbSBkZXB0aCBOdW1iZXIgb2YgcGFyZW50IG1lbnVzIHRoYXQgY29tZSBiZWZvcmUgdGhlIG1lbnUuXG4gICAqL1xuICBzZXRFbGV2YXRpb24oZGVwdGg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFRoZSBlbGV2YXRpb24gc3RhcnRzIGF0IHRoZSBiYXNlIGFuZCBpbmNyZWFzZXMgYnkgb25lIGZvciBlYWNoIGxldmVsLlxuICAgIC8vIENhcHBlZCBhdCAyNCBiZWNhdXNlIHRoYXQncyB0aGUgbWF4aW11bSBlbGV2YXRpb24gZGVmaW5lZCBpbiB0aGUgTWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAgY29uc3QgZWxldmF0aW9uID0gTWF0aC5taW4oTUFUX01FTlVfQkFTRV9FTEVWQVRJT04gKyBkZXB0aCwgMjQpO1xuICAgIGNvbnN0IG5ld0VsZXZhdGlvbiA9IGBtYXQtZWxldmF0aW9uLXoke2VsZXZhdGlvbn1gO1xuICAgIGNvbnN0IGN1c3RvbUVsZXZhdGlvbiA9IE9iamVjdC5rZXlzKHRoaXMuX2NsYXNzTGlzdCkuZmluZChjID0+IGMuc3RhcnRzV2l0aCgnbWF0LWVsZXZhdGlvbi16JykpO1xuXG4gICAgaWYgKCFjdXN0b21FbGV2YXRpb24gfHwgY3VzdG9tRWxldmF0aW9uID09PSB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xhc3NMaXN0W25ld0VsZXZhdGlvbl0gPSB0cnVlO1xuICAgICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3NlcyB0byB0aGUgbWVudSBwYW5lbCBiYXNlZCBvbiBpdHMgcG9zaXRpb24uIENhbiBiZSB1c2VkIGJ5XG4gICAqIGNvbnN1bWVycyB0byBhZGQgc3BlY2lmaWMgc3R5bGluZyBiYXNlZCBvbiB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NYIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSBwb3NZIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB5IGF4aXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3NYOiBNZW51UG9zaXRpb25YID0gdGhpcy54UG9zaXRpb24sIHBvc1k6IE1lbnVQb3NpdGlvblkgPSB0aGlzLnlQb3NpdGlvbikge1xuICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLl9jbGFzc0xpc3Q7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVmb3JlJ10gPSBwb3NYID09PSAnYmVmb3JlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hZnRlciddID0gcG9zWCA9PT0gJ2FmdGVyJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hYm92ZSddID0gcG9zWSA9PT0gJ2Fib3ZlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWxvdyddID0gcG9zWSA9PT0gJ2JlbG93JztcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGVudGVyIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9yZXNldEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHBhbmVsIGFuaW1hdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gKi9cbiAgX3Jlc2V0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9zdGFydEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBwYW5lbCBhbmltYXRpb24gY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dChldmVudCk7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgIC8vIFNjcm9sbCB0aGUgY29udGVudCBlbGVtZW50IHRvIHRoZSB0b3AgYXMgc29vbiBhcyB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gVGhpcyBpcyBuZWNlc3NhcnksXG4gICAgLy8gYmVjYXVzZSB3ZSBtb3ZlIGZvY3VzIHRvIHRoZSBmaXJzdCBpdGVtIHdoaWxlIGl0J3Mgc3RpbGwgYmVpbmcgYW5pbWF0ZWQsIHdoaWNoIGNhbiB0aHJvd1xuICAgIC8vIHRoZSBicm93c2VyIG9mZiB3aGVuIGl0IGRldGVybWluZXMgdGhlIHNjcm9sbCBwb3NpdGlvbi4gQWx0ZXJuYXRpdmVseSB3ZSBjYW4gbW92ZSBmb2N1c1xuICAgIC8vIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBob3dldmVyIG1vdmluZyBmb2N1cyBhc3luY2hyb25vdXNseSB3aWxsIGludGVycnVwdCBzY3JlZW5cbiAgICAvLyByZWFkZXJzIHdoaWNoIGFyZSBpbiB0aGUgcHJvY2VzcyBvZiByZWFkaW5nIG91dCB0aGUgbWVudSBhbHJlYWR5LiBXZSB0YWtlIHRoZSBgZWxlbWVudGBcbiAgICAvLyBmcm9tIHRoZSBgZXZlbnRgIHNpbmNlIHdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIHRvIGFjY2VzcyB0aGUgcGFuZS5cbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJyAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gMCkge1xuICAgICAgZXZlbnQuZWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIGEgc3RyZWFtIHRoYXQgd2lsbCBrZWVwIHRyYWNrIG9mIGFueSBuZXdseS1hZGRlZCBtZW51IGl0ZW1zIGFuZCB3aWxsIHVwZGF0ZSB0aGUgbGlzdFxuICAgKiBvZiBkaXJlY3QgZGVzY2VuZGFudHMuIFdlIGNvbGxlY3QgdGhlIGRlc2NlbmRhbnRzIHRoaXMgd2F5LCBiZWNhdXNlIGBfYWxsSXRlbXNgIGNhbiBpbmNsdWRlXG4gICAqIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgY2hpbGQgbWVudXMsIGFuZCB1c2luZyBhIGN1c3RvbSB3YXkgb2YgcmVnaXN0ZXJpbmcgaXRlbXMgaXMgdW5yZWxpYWJsZVxuICAgKiB3aGVuIGl0IGNvbWVzIHRvIG1haW50YWluaW5nIHRoZSBpdGVtIG9yZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKSB7XG4gICAgdGhpcy5fYWxsSXRlbXMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbEl0ZW1zKSlcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5yZXNldChpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9wYXJlbnRNZW51ID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXBUcmlnZ2VyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNCYWNrZHJvcDogQm9vbGVhbklucHV0O1xufVxuXG4vKiogQGRvY3MtcHVibGljIE1hdE1lbnUgKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICdtZW51Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnbWVudS5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0TWVudScsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ251bGwnLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0TWVudUFuaW1hdGlvbnMudHJhbnNmb3JtTWVudSxcbiAgICBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtc1xuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTUFUX01FTlVfUEFORUwsIHVzZUV4aXN0aW5nOiBNYXRNZW51fSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51IGV4dGVuZHMgX01hdE1lbnVCYXNlIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIG5nWm9uZTogTmdab25lLFxuICAgICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBuZ1pvbmUsIGRlZmF1bHRPcHRpb25zKTtcbiAgfVxufVxuIl19