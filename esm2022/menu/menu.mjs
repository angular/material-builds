/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Output, TemplateRef, QueryList, ViewChild, ViewEncapsulation, ChangeDetectorRef, booleanAttribute, } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ESCAPE, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { MatMenuItem } from './menu-item';
import { MAT_MENU_PANEL } from './menu-panel';
import { throwMatMenuInvalidPositionX, throwMatMenuInvalidPositionY } from './menu-errors';
import { MatMenuContent, MAT_MENU_CONTENT } from './menu-content';
import { matMenuAnimations } from './menu-animations';
import * as i0 from "@angular/core";
let menuPanelUid = 0;
/** Injection token to be used to override the default options for `mat-menu`. */
export const MAT_MENU_DEFAULT_OPTIONS = new InjectionToken('mat-menu-default-options', {
    providedIn: 'root',
    factory: MAT_MENU_DEFAULT_OPTIONS_FACTORY,
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
export class MatMenu {
    /** Position of the menu in the X axis. */
    get xPosition() {
        return this._xPosition;
    }
    set xPosition(value) {
        if (value !== 'before' &&
            value !== 'after' &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionX();
        }
        this._xPosition = value;
        this.setPositionClasses();
    }
    /** Position of the menu in the Y axis. */
    get yPosition() {
        return this._yPosition;
    }
    set yPosition(value) {
        if (value !== 'above' && value !== 'below' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwMatMenuInvalidPositionY();
        }
        this._yPosition = value;
        this.setPositionClasses();
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        const previousPanelClass = this._previousPanelClass;
        const newClassList = { ...this._classList };
        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((className) => {
                newClassList[className] = false;
            });
        }
        this._previousPanelClass = classes;
        if (classes && classes.length) {
            classes.split(' ').forEach((className) => {
                newClassList[className] = true;
            });
            this._elementRef.nativeElement.className = '';
        }
        this._classList = newClassList;
    }
    /**
     * This method takes classes set on the host mat-menu element and applies them on the
     * menu template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing menu from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList() {
        return this.panelClass;
    }
    set classList(classes) {
        this.panelClass = classes;
    }
    constructor(_elementRef, _ngZone, defaultOptions, 
    // @breaking-change 15.0.0 `_changeDetectorRef` to become a required parameter.
    _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        this._elevationPrefix = 'mat-elevation-z';
        this._baseElevation = 8;
        /** Only the direct descendant menu items. */
        this._directDescendantItems = new QueryList();
        /** Classes to be applied to the menu panel. */
        this._classList = {};
        /** Current state of the panel animation. */
        this._panelAnimationState = 'void';
        /** Emits whenever an animation on the menu completes. */
        this._animationDone = new Subject();
        /** Event emitted when the menu is closed. */
        this.closed = new EventEmitter();
        /**
         * Event emitted when the menu is closed.
         * @deprecated Switch to `closed` instead
         * @breaking-change 8.0.0
         */
        this.close = this.closed;
        this.panelId = `mat-menu-panel-${menuPanelUid++}`;
        this.overlayPanelClass = defaultOptions.overlayPanelClass || '';
        this._xPosition = defaultOptions.xPosition;
        this._yPosition = defaultOptions.yPosition;
        this.backdropClass = defaultOptions.backdropClass;
        this.overlapTrigger = defaultOptions.overlapTrigger;
        this.hasBackdrop = defaultOptions.hasBackdrop;
    }
    ngOnInit() {
        this.setPositionClasses();
    }
    ngAfterContentInit() {
        this._updateDirectDescendants();
        this._keyManager = new FocusKeyManager(this._directDescendantItems)
            .withWrap()
            .withTypeAhead()
            .withHomeAndEnd();
        this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));
        // If a user manually (programmatically) focuses a menu item, we need to reflect that focus
        // change back to the key manager. Note that we don't need to unsubscribe here because _focused
        // is internal and we know that it gets completed on destroy.
        this._directDescendantItems.changes
            .pipe(startWith(this._directDescendantItems), switchMap(items => merge(...items.map((item) => item._focused))))
            .subscribe(focusedItem => this._keyManager.updateActiveItem(focusedItem));
        this._directDescendantItems.changes.subscribe((itemsList) => {
            // Move focus to another item, if the active item is removed from the list.
            // We need to debounce the callback, because multiple items might be removed
            // in quick succession.
            const manager = this._keyManager;
            if (this._panelAnimationState === 'enter' && manager.activeItem?._hasFocus()) {
                const items = itemsList.toArray();
                const index = Math.max(0, Math.min(items.length - 1, manager.activeItemIndex || 0));
                if (items[index] && !items[index].disabled) {
                    manager.setActiveItem(index);
                }
                else {
                    manager.setNextItemActive();
                }
            }
        });
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
        this._directDescendantItems.destroy();
        this.closed.complete();
        this._firstItemFocusSubscription?.unsubscribe();
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
                return;
        }
        // Don't allow the event to propagate if we've already handled it, or it may
        // end up reaching other overlays that were opened earlier (see #22694).
        event.stopPropagation();
    }
    /**
     * Focus the first item in the menu.
     * @param origin Action from which the focus originated. Used to set the correct styling.
     */
    focusFirstItem(origin = 'program') {
        // Wait for `onStable` to ensure iOS VoiceOver screen reader focuses the first item (#24735).
        this._firstItemFocusSubscription?.unsubscribe();
        this._firstItemFocusSubscription = this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            let menuPanel = null;
            if (this._directDescendantItems.length) {
                // Because the `mat-menuPanel` is at the DOM insertion point, not inside the overlay, we don't
                // have a nice way of getting a hold of the menuPanel panel. We can't use a `ViewChild` either
                // because the panel is inside an `ng-template`. We work around it by starting from one of
                // the items and walking up the DOM.
                menuPanel = this._directDescendantItems.first._getHostElement().closest('[role="menu"]');
            }
            // If an item in the menuPanel is already focused, avoid overriding the focus.
            if (!menuPanel || !menuPanel.contains(document.activeElement)) {
                const manager = this._keyManager;
                manager.setFocusOrigin(origin).setFirstItemActive();
                // If there's no active item at this point, it means that all the items are disabled.
                // Move focus to the menuPanel panel so keyboard events like Escape still work. Also this will
                // give _some_ feedback to screen readers.
                if (!manager.activeItem && menuPanel) {
                    menuPanel.focus();
                }
            }
        });
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
        const elevation = Math.min(this._baseElevation + depth, 24);
        const newElevation = `${this._elevationPrefix}${elevation}`;
        const customElevation = Object.keys(this._classList).find(className => {
            return className.startsWith(this._elevationPrefix);
        });
        if (!customElevation || customElevation === this._previousElevation) {
            const newClassList = { ...this._classList };
            if (this._previousElevation) {
                newClassList[this._previousElevation] = false;
            }
            newClassList[newElevation] = true;
            this._previousElevation = newElevation;
            this._classList = newClassList;
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
        this._classList = {
            ...this._classList,
            ['mat-menu-before']: posX === 'before',
            ['mat-menu-after']: posX === 'after',
            ['mat-menu-above']: posY === 'above',
            ['mat-menu-below']: posY === 'below',
        };
        // @breaking-change 15.0.0 Remove null check for `_changeDetectorRef`.
        this._changeDetectorRef?.markForCheck();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatMenu, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MAT_MENU_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.2.0", type: MatMenu, isStandalone: true, selector: "mat-menu", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], xPosition: "xPosition", yPosition: "yPosition", overlapTrigger: ["overlapTrigger", "overlapTrigger", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", (value) => (value == null ? null : booleanAttribute(value))], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed", close: "close" }, host: { properties: { "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" } }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], queries: [{ propertyName: "lazyContent", first: true, predicate: MAT_MENU_CONTENT, descendants: true }, { propertyName: "_allItems", predicate: MatMenuItem, descendants: true }, { propertyName: "items", predicate: MatMenuItem }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["matMenu"], ngImport: i0, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"], animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mat-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, exportAs: 'matMenu', host: {
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                    }, animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], standalone: true, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_MENU_DEFAULT_OPTIONS]
                }] }, { type: i0.ChangeDetectorRef }], propDecorators: { _allItems: [{
                type: ContentChildren,
                args: [MatMenuItem, { descendants: true }]
            }], backdropClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }], items: [{
                type: ContentChildren,
                args: [MatMenuItem, { descendants: false }]
            }], lazyContent: [{
                type: ContentChild,
                args: [MAT_MENU_CONTENT]
            }], overlapTrigger: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hasBackdrop: [{
                type: Input,
                args: [{ transform: (value) => (value == null ? null : booleanAttribute(value)) }]
            }], panelClass: [{
                type: Input,
                args: ['class']
            }], classList: [{
                type: Input
            }], closed: [{
                type: Output
            }], close: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUNqQixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDOztBQUVwRCxJQUFJ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QTFLaUIsU0FBUztzQkFBM0QsZUFBZTt1QkFBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQTJCeEMsYUFBYTtzQkFBckIsS0FBSztnQkFHZSxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBR08sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBR0csZUFBZTtzQkFBekMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBSXJCLFNBQVM7c0JBRFosS0FBSztnQkFrQkYsU0FBUztzQkFEWixLQUFLO2dCQWFrQixXQUFXO3NCQUFsQyxTQUFTO3VCQUFDLFdBQVc7Z0JBTzhCLEtBQUs7c0JBQXhELGVBQWU7dUJBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQztnQkFNbEIsV0FBVztzQkFBMUMsWUFBWTt1QkFBQyxnQkFBZ0I7Z0JBR1EsY0FBYztzQkFBbkQsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFJcEMsV0FBVztzQkFEVixLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztnQkFVaEYsVUFBVTtzQkFEYixLQUFLO3VCQUFDLE9BQU87Z0JBaUNWLFNBQVM7c0JBRFosS0FBSztnQkFTYSxNQUFNO3NCQUF4QixNQUFNO2dCQU9ZLEtBQUs7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBFU0NBUEUsXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNYXRNZW51UGFuZWwsIE1BVF9NRU5VX1BBTkVMfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVDb250ZW50LCBNQVRfTUVOVV9DT05URU5UfSBmcm9tICcuL21lbnUtY29udGVudCc7XG5pbXBvcnQge21hdE1lbnVBbmltYXRpb25zfSBmcm9tICcuL21lbnUtYW5pbWF0aW9ucyc7XG5cbmxldCBtZW51UGFuZWxVaWQgPSAwO1xuXG4vKiogUmVhc29uIHdoeSB0aGUgbWVudSB3YXMgY2xvc2VkLiAqL1xuZXhwb3J0IHR5cGUgTWVudUNsb3NlUmVhc29uID0gdm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1tZW51YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPihcbiAgJ21hdC1tZW51LWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgb3ZlcmxhcFRyaWdnZXI6IGZhbHNlLFxuICAgIHhQb3NpdGlvbjogJ2FmdGVyJyxcbiAgICB5UG9zaXRpb246ICdiZWxvdycsXG4gICAgYmFja2Ryb3BDbGFzczogJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgfTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCcsXG4gIHN0eWxlVXJsOiAnbWVudS5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnbnVsbCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRNZW51QW5pbWF0aW9ucy50cmFuc2Zvcm1NZW51LCBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtc10sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfTUVOVV9QQU5FTCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnV9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE1hdE1lbnVQYW5lbDxNYXRNZW51SXRlbT4sIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdE1lbnVJdGVtPjtcbiAgcHJpdmF0ZSBfeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuICBwcml2YXRlIF95UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG4gIHByaXZhdGUgX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuICBwcml2YXRlIF9lbGV2YXRpb25QcmVmaXggPSAnbWF0LWVsZXZhdGlvbi16JztcbiAgcHJpdmF0ZSBfYmFzZUVsZXZhdGlvbiA9IDg7XG5cbiAgLyoqIEFsbCBpdGVtcyBpbnNpZGUgdGhlIG1lbnUuIEluY2x1ZGVzIGl0ZW1zIG5lc3RlZCBpbnNpZGUgYW5vdGhlciBtZW51LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE1lbnVJdGVtLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsSXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT47XG5cbiAgLyoqIE9ubHkgdGhlIGRpcmVjdCBkZXNjZW5kYW50IG1lbnUgaXRlbXMuICovXG4gIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIG1lbnUgcGFuZWwuICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcblxuICAvKiogYXJpYS1sYWJlbCBmb3IgdGhlIG1lbnUgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtZGVzY3JpYmVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHhQb3NpdGlvbigpOiBNZW51UG9zaXRpb25YIHtcbiAgICByZXR1cm4gdGhpcy5feFBvc2l0aW9uO1xuICB9XG4gIHNldCB4UG9zaXRpb24odmFsdWU6IE1lbnVQb3NpdGlvblgpIHtcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gJ2JlZm9yZScgJiZcbiAgICAgIHZhbHVlICE9PSAnYWZ0ZXInICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCgpO1xuICAgIH1cbiAgICB0aGlzLl94UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB5UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWSB7XG4gICAgcmV0dXJuIHRoaXMuX3lQb3NpdGlvbjtcbiAgfVxuICBzZXQgeVBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25ZKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYWJvdmUnICYmIHZhbHVlICE9PSAnYmVsb3cnICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25ZKCk7XG4gICAgfVxuICAgIHRoaXMuX3lQb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogTGlzdCBvZiB0aGUgaXRlbXMgaW5zaWRlIG9mIGEgbWVudS5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKlxuICAgKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfTUVOVV9DT05URU5UKSBsYXp5Q29udGVudDogTWF0TWVudUNvbnRlbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgaXRzIHRyaWdnZXIuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiAodmFsdWU6IGFueSkgPT4gKHZhbHVlID09IG51bGwgPyBudWxsIDogYm9vbGVhbkF0dHJpYnV0ZSh2YWx1ZSkpfSlcbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c1BhbmVsQ2xhc3MgPSB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3M7XG4gICAgY29uc3QgbmV3Q2xhc3NMaXN0ID0gey4uLnRoaXMuX2NsYXNzTGlzdH07XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIG5ld0NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBuZXdDbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIH1cblxuICAgIHRoaXMuX2NsYXNzTGlzdCA9IG5ld0NsYXNzTGlzdDtcbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENsYXNzO1xuICB9XG4gIHNldCBjbGFzc0xpc3QoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlcztcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYGNsb3NlZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2U6IEV2ZW50RW1pdHRlcjxNZW51Q2xvc2VSZWFzb24+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBfY2hhbmdlRGV0ZWN0b3JSZWZgIHRvIGJlY29tZSBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMCBgX2NoYW5nZURldGVjdG9yUmVmYCB0byBiZWNvbWUgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgdGhpcy5vdmVybGF5UGFuZWxDbGFzcyA9IGRlZmF1bHRPcHRpb25zLm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuICAgIHRoaXMuX3hQb3NpdGlvbiA9IGRlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgICB0aGlzLl95UG9zaXRpb24gPSBkZWZhdWx0T3B0aW9ucy55UG9zaXRpb247XG4gICAgdGhpcy5iYWNrZHJvcENsYXNzID0gZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcbiAgICB0aGlzLm92ZXJsYXBUcmlnZ2VyID0gZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG4gICAgdGhpcy5oYXNCYWNrZHJvcCA9IGRlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpO1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAud2l0aFR5cGVBaGVhZCgpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZWQuZW1pdCgndGFiJykpO1xuXG4gICAgLy8gSWYgYSB1c2VyIG1hbnVhbGx5IChwcm9ncmFtbWF0aWNhbGx5KSBmb2N1c2VzIGEgbWVudSBpdGVtLCB3ZSBuZWVkIHRvIHJlZmxlY3QgdGhhdCBmb2N1c1xuICAgIC8vIGNoYW5nZSBiYWNrIHRvIHRoZSBrZXkgbWFuYWdlci4gTm90ZSB0aGF0IHdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgaGVyZSBiZWNhdXNlIF9mb2N1c2VkXG4gICAgLy8gaXMgaW50ZXJuYWwgYW5kIHdlIGtub3cgdGhhdCBpdCBnZXRzIGNvbXBsZXRlZCBvbiBkZXN0cm95LlxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9mb2N1c2VkKSkpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShmb2N1c2VkSXRlbSA9PiB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oZm9jdXNlZEl0ZW0gYXMgTWF0TWVudUl0ZW0pKTtcblxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzLnN1YnNjcmliZSgoaXRlbXNMaXN0OiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAvLyBNb3ZlIGZvY3VzIHRvIGFub3RoZXIgaXRlbSwgaWYgdGhlIGFjdGl2ZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgbGlzdC5cbiAgICAgIC8vIFdlIG5lZWQgdG8gZGVib3VuY2UgdGhlIGNhbGxiYWNrLCBiZWNhdXNlIG11bHRpcGxlIGl0ZW1zIG1pZ2h0IGJlIHJlbW92ZWRcbiAgICAgIC8vIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgICAgaWYgKHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPT09ICdlbnRlcicgJiYgbWFuYWdlci5hY3RpdmVJdGVtPy5faGFzRm9jdXMoKSkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGl0ZW1zTGlzdC50b0FycmF5KCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMCkpO1xuXG4gICAgICAgIGlmIChpdGVtc1tpbmRleF0gJiYgIWl0ZW1zW2luZGV4XS5kaXNhYmxlZCkge1xuICAgICAgICAgIG1hbmFnZXIuc2V0QWN0aXZlSXRlbShpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFuYWdlci5zZXROZXh0SXRlbUFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmRlc3Ryb3koKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBob3ZlcmVkIG1lbnUgaXRlbSBjaGFuZ2VzLiAqL1xuICBfaG92ZXJlZCgpOiBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPiB7XG4gICAgLy8gQ29lcmNlIHRoZSBgY2hhbmdlc2AgcHJvcGVydHkgYmVjYXVzZSBBbmd1bGFyIHR5cGVzIGl0IGFzIGBPYnNlcnZhYmxlPGFueT5gXG4gICAgY29uc3QgaXRlbUNoYW5nZXMgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcyBhcyBPYnNlcnZhYmxlPFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4+O1xuICAgIHJldHVybiBpdGVtQ2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2UoLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5faG92ZXJlZCkpKSxcbiAgICApIGFzIE9ic2VydmFibGU8TWF0TWVudUl0ZW0+O1xuICB9XG5cbiAgLypcbiAgICogUmVnaXN0ZXJzIGEgbWVudSBpdGVtIHdpdGggdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIGFkZEl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgcmVtb3ZlSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIG1lbnUsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdsdHInKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBhbGxvdyB0aGUgZXZlbnQgdG8gcHJvcGFnYXRlIGlmIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCBpdCwgb3IgaXQgbWF5XG4gICAgLy8gZW5kIHVwIHJlYWNoaW5nIG90aGVyIG92ZXJsYXlzIHRoYXQgd2VyZSBvcGVuZWQgZWFybGllciAoc2VlICMyMjY5NCkuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBvcmlnaW4gQWN0aW9uIGZyb20gd2hpY2ggdGhlIGZvY3VzIG9yaWdpbmF0ZWQuIFVzZWQgdG8gc2V0IHRoZSBjb3JyZWN0IHN0eWxpbmcuXG4gICAqL1xuICBmb2N1c0ZpcnN0SXRlbShvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTogdm9pZCB7XG4gICAgLy8gV2FpdCBmb3IgYG9uU3RhYmxlYCB0byBlbnN1cmUgaU9TIFZvaWNlT3ZlciBzY3JlZW4gcmVhZGVyIGZvY3VzZXMgdGhlIGZpcnN0IGl0ZW0gKCMyNDczNSkuXG4gICAgdGhpcy5fZmlyc3RJdGVtRm9jdXNTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZmlyc3RJdGVtRm9jdXNTdWJzY3JpcHRpb24gPSB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgbGV0IG1lbnVQYW5lbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgYG1hdC1tZW51UGFuZWxgIGlzIGF0IHRoZSBET00gaW5zZXJ0aW9uIHBvaW50LCBub3QgaW5zaWRlIHRoZSBvdmVybGF5LCB3ZSBkb24ndFxuICAgICAgICAvLyBoYXZlIGEgbmljZSB3YXkgb2YgZ2V0dGluZyBhIGhvbGQgb2YgdGhlIG1lbnVQYW5lbCBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHBhbmVsIGlzIGluc2lkZSBhbiBgbmctdGVtcGxhdGVgLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBzdGFydGluZyBmcm9tIG9uZSBvZlxuICAgICAgICAvLyB0aGUgaXRlbXMgYW5kIHdhbGtpbmcgdXAgdGhlIERPTS5cbiAgICAgICAgbWVudVBhbmVsID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmZpcnN0IS5fZ2V0SG9zdEVsZW1lbnQoKS5jbG9zZXN0KCdbcm9sZT1cIm1lbnVcIl0nKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgYW4gaXRlbSBpbiB0aGUgbWVudVBhbmVsIGlzIGFscmVhZHkgZm9jdXNlZCwgYXZvaWQgb3ZlcnJpZGluZyB0aGUgZm9jdXMuXG4gICAgICBpZiAoIW1lbnVQYW5lbCB8fCAhbWVudVBhbmVsLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgICAgICAvLyBNb3ZlIGZvY3VzIHRvIHRoZSBtZW51UGFuZWwgcGFuZWwgc28ga2V5Ym9hcmQgZXZlbnRzIGxpa2UgRXNjYXBlIHN0aWxsIHdvcmsuIEFsc28gdGhpcyB3aWxsXG4gICAgICAgIC8vIGdpdmUgX3NvbWVfIGZlZWRiYWNrIHRvIHNjcmVlbiByZWFkZXJzLlxuICAgICAgICBpZiAoIW1hbmFnZXIuYWN0aXZlSXRlbSAmJiBtZW51UGFuZWwpIHtcbiAgICAgICAgICBtZW51UGFuZWwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gaW4gdGhlIG1lbnUuIFRoaXMgaXMgdXNlZCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCwgYWxsb3dpbmdcbiAgICogdGhlIHVzZXIgdG8gc3RhcnQgZnJvbSB0aGUgZmlyc3Qgb3B0aW9uIHdoZW4gcHJlc3NpbmcgdGhlIGRvd24gYXJyb3cuXG4gICAqL1xuICByZXNldEFjdGl2ZUl0ZW0oKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtZW51IHBhbmVsIGVsZXZhdGlvbi5cbiAgICogQHBhcmFtIGRlcHRoIE51bWJlciBvZiBwYXJlbnQgbWVudXMgdGhhdCBjb21lIGJlZm9yZSB0aGUgbWVudS5cbiAgICovXG4gIHNldEVsZXZhdGlvbihkZXB0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIGVsZXZhdGlvbiBzdGFydHMgYXQgdGhlIGJhc2UgYW5kIGluY3JlYXNlcyBieSBvbmUgZm9yIGVhY2ggbGV2ZWwuXG4gICAgLy8gQ2FwcGVkIGF0IDI0IGJlY2F1c2UgdGhhdCdzIHRoZSBtYXhpbXVtIGVsZXZhdGlvbiBkZWZpbmVkIGluIHRoZSBNYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICBjb25zdCBlbGV2YXRpb24gPSBNYXRoLm1pbih0aGlzLl9iYXNlRWxldmF0aW9uICsgZGVwdGgsIDI0KTtcbiAgICBjb25zdCBuZXdFbGV2YXRpb24gPSBgJHt0aGlzLl9lbGV2YXRpb25QcmVmaXh9JHtlbGV2YXRpb259YDtcbiAgICBjb25zdCBjdXN0b21FbGV2YXRpb24gPSBPYmplY3Qua2V5cyh0aGlzLl9jbGFzc0xpc3QpLmZpbmQoY2xhc3NOYW1lID0+IHtcbiAgICAgIHJldHVybiBjbGFzc05hbWUuc3RhcnRzV2l0aCh0aGlzLl9lbGV2YXRpb25QcmVmaXgpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFjdXN0b21FbGV2YXRpb24gfHwgY3VzdG9tRWxldmF0aW9uID09PSB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgY29uc3QgbmV3Q2xhc3NMaXN0ID0gey4uLnRoaXMuX2NsYXNzTGlzdH07XG5cbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgICBuZXdDbGFzc0xpc3RbdGhpcy5fcHJldmlvdXNFbGV2YXRpb25dID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIG5ld0NsYXNzTGlzdFtuZXdFbGV2YXRpb25dID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uID0gbmV3RWxldmF0aW9uO1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gbmV3Q2xhc3NMaXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGNsYXNzZXMgdG8gdGhlIG1lbnUgcGFuZWwgYmFzZWQgb24gaXRzIHBvc2l0aW9uLiBDYW4gYmUgdXNlZCBieVxuICAgKiBjb25zdW1lcnMgdG8gYWRkIHNwZWNpZmljIHN0eWxpbmcgYmFzZWQgb24gdGhlIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zWCBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0gcG9zWSBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeSBheGlzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXRQb3NpdGlvbkNsYXNzZXMocG9zWDogTWVudVBvc2l0aW9uWCA9IHRoaXMueFBvc2l0aW9uLCBwb3NZOiBNZW51UG9zaXRpb25ZID0gdGhpcy55UG9zaXRpb24pIHtcbiAgICB0aGlzLl9jbGFzc0xpc3QgPSB7XG4gICAgICAuLi50aGlzLl9jbGFzc0xpc3QsXG4gICAgICBbJ21hdC1tZW51LWJlZm9yZSddOiBwb3NYID09PSAnYmVmb3JlJyxcbiAgICAgIFsnbWF0LW1lbnUtYWZ0ZXInXTogcG9zWCA9PT0gJ2FmdGVyJyxcbiAgICAgIFsnbWF0LW1lbnUtYWJvdmUnXTogcG9zWSA9PT0gJ2Fib3ZlJyxcbiAgICAgIFsnbWF0LW1lbnUtYmVsb3cnXTogcG9zWSA9PT0gJ2JlbG93JyxcbiAgICB9O1xuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxNS4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGVudGVyIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9yZXNldEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHBhbmVsIGFuaW1hdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gKi9cbiAgX3Jlc2V0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9zdGFydEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBwYW5lbCBhbmltYXRpb24gY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dChldmVudCk7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgIC8vIFNjcm9sbCB0aGUgY29udGVudCBlbGVtZW50IHRvIHRoZSB0b3AgYXMgc29vbiBhcyB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gVGhpcyBpcyBuZWNlc3NhcnksXG4gICAgLy8gYmVjYXVzZSB3ZSBtb3ZlIGZvY3VzIHRvIHRoZSBmaXJzdCBpdGVtIHdoaWxlIGl0J3Mgc3RpbGwgYmVpbmcgYW5pbWF0ZWQsIHdoaWNoIGNhbiB0aHJvd1xuICAgIC8vIHRoZSBicm93c2VyIG9mZiB3aGVuIGl0IGRldGVybWluZXMgdGhlIHNjcm9sbCBwb3NpdGlvbi4gQWx0ZXJuYXRpdmVseSB3ZSBjYW4gbW92ZSBmb2N1c1xuICAgIC8vIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBob3dldmVyIG1vdmluZyBmb2N1cyBhc3luY2hyb25vdXNseSB3aWxsIGludGVycnVwdCBzY3JlZW5cbiAgICAvLyByZWFkZXJzIHdoaWNoIGFyZSBpbiB0aGUgcHJvY2VzcyBvZiByZWFkaW5nIG91dCB0aGUgbWVudSBhbHJlYWR5LiBXZSB0YWtlIHRoZSBgZWxlbWVudGBcbiAgICAvLyBmcm9tIHRoZSBgZXZlbnRgIHNpbmNlIHdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIHRvIGFjY2VzcyB0aGUgcGFuZS5cbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJyAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCA9PT0gMCkge1xuICAgICAgZXZlbnQuZWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIGEgc3RyZWFtIHRoYXQgd2lsbCBrZWVwIHRyYWNrIG9mIGFueSBuZXdseS1hZGRlZCBtZW51IGl0ZW1zIGFuZCB3aWxsIHVwZGF0ZSB0aGUgbGlzdFxuICAgKiBvZiBkaXJlY3QgZGVzY2VuZGFudHMuIFdlIGNvbGxlY3QgdGhlIGRlc2NlbmRhbnRzIHRoaXMgd2F5LCBiZWNhdXNlIGBfYWxsSXRlbXNgIGNhbiBpbmNsdWRlXG4gICAqIGl0ZW1zIHRoYXQgYXJlIHBhcnQgb2YgY2hpbGQgbWVudXMsIGFuZCB1c2luZyBhIGN1c3RvbSB3YXkgb2YgcmVnaXN0ZXJpbmcgaXRlbXMgaXMgdW5yZWxpYWJsZVxuICAgKiB3aGVuIGl0IGNvbWVzIHRvIG1haW50YWluaW5nIHRoZSBpdGVtIG9yZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKSB7XG4gICAgdGhpcy5fYWxsSXRlbXMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbEl0ZW1zKSlcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5yZXNldChpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9wYXJlbnRNZW51ID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuICB9XG59XG4iLCI8bmctdGVtcGxhdGU+XG4gIDxkaXZcbiAgICBjbGFzcz1cIm1hdC1tZGMtbWVudS1wYW5lbCBtYXQtbWRjLWVsZXZhdGlvbi1zcGVjaWZpY1wiXG4gICAgW2lkXT1cInBhbmVsSWRcIlxuICAgIFtjbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcbiAgICAoY2xpY2spPVwiY2xvc2VkLmVtaXQoJ2NsaWNrJylcIlxuICAgIFtAdHJhbnNmb3JtTWVudV09XCJfcGFuZWxBbmltYXRpb25TdGF0ZVwiXG4gICAgKEB0cmFuc2Zvcm1NZW51LnN0YXJ0KT1cIl9vbkFuaW1hdGlvblN0YXJ0KCRldmVudClcIlxuICAgIChAdHJhbnNmb3JtTWVudS5kb25lKT1cIl9vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KVwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gICAgcm9sZT1cIm1lbnVcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieSB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImFyaWFEZXNjcmliZWRieSB8fCBudWxsXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtbWVudS1jb250ZW50XCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==