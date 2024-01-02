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
import * as i1 from "@angular/common";
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
        /** Config object to be passed into the menu's ngClass */
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatMenu, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MAT_MENU_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.4", type: MatMenu, selector: "mat-menu", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], xPosition: "xPosition", yPosition: "yPosition", overlapTrigger: ["overlapTrigger", "overlapTrigger", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", (value) => (value == null ? null : booleanAttribute(value))], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed", close: "close" }, host: { properties: { "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" } }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], queries: [{ propertyName: "lazyContent", first: true, predicate: MAT_MENU_CONTENT, descendants: true }, { propertyName: "_allItems", predicate: MatMenuItem, descendants: true }, { propertyName: "items", predicate: MatMenuItem }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["matMenu"], ngImport: i0, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:16px}.mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:32px}[dir=rtl] .mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{position:absolute;top:50%;right:16px;transform:translateY(-50%);width:5px;height:10px;fill:currentColor}[dir=rtl] .mat-mdc-menu-submenu-icon{right:auto;left:16px;transform:translateY(-50%) scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mat-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, exportAs: 'matMenu', host: {
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                    }, animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:16px}.mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:32px}[dir=rtl] .mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{position:absolute;top:50%;right:16px;transform:translateY(-50%);width:5px;height:10px;fill:currentColor}[dir=rtl] .mat-mdc-menu-submenu-icon{right:auto;left:16px;transform:translateY(-50%) scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUNqQixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7QUFFcEQsSUFB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RUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFDO2dCQU1sQixXQUFXO3NCQUExQyxZQUFZO3VCQUFDLGdCQUFnQjtnQkFHUSxjQUFjO3NCQUFuRCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQUlwQyxXQUFXO3NCQURWLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO2dCQVVoRixVQUFVO3NCQURiLEtBQUs7dUJBQUMsT0FBTztnQkE4QlYsU0FBUztzQkFEWixLQUFLO2dCQVNhLE1BQU07c0JBQXhCLE1BQU07Z0JBT1ksS0FBSztzQkFBdkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWYsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25Jbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEVTQ0FQRSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIERPV05fQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdE1lbnVJdGVtfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQge01hdE1lbnVQYW5lbCwgTUFUX01FTlVfUEFORUx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5pbXBvcnQge01lbnVQb3NpdGlvblgsIE1lbnVQb3NpdGlvbll9IGZyb20gJy4vbWVudS1wb3NpdGlvbnMnO1xuaW1wb3J0IHt0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25YLCB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25ZfSBmcm9tICcuL21lbnUtZXJyb3JzJztcbmltcG9ydCB7TWF0TWVudUNvbnRlbnQsIE1BVF9NRU5VX0NPTlRFTlR9IGZyb20gJy4vbWVudS1jb250ZW50JztcbmltcG9ydCB7bWF0TWVudUFuaW1hdGlvbnN9IGZyb20gJy4vbWVudS1hbmltYXRpb25zJztcblxubGV0IG1lbnVQYW5lbFVpZCA9IDA7XG5cbi8qKiBSZWFzb24gd2h5IHRoZSBtZW51IHdhcyBjbG9zZWQuICovXG5leHBvcnQgdHlwZSBNZW51Q2xvc2VSZWFzb24gPSB2b2lkIHwgJ2NsaWNrJyB8ICdrZXlkb3duJyB8ICd0YWInO1xuXG4vKiogRGVmYXVsdCBgbWF0LW1lbnVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0TWVudURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFRoZSB4LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHhQb3NpdGlvbjogTWVudVBvc2l0aW9uWDtcblxuICAvKiogVGhlIHktYXhpcyBwb3NpdGlvbiBvZiB0aGUgbWVudS4gKi9cbiAgeVBvc2l0aW9uOiBNZW51UG9zaXRpb25ZO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IHNob3VsZCBvdmVybGFwIHRoZSBtZW51IHRyaWdnZXIuICovXG4gIG92ZXJsYXBUcmlnZ2VyOiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3MgYmFja2Ryb3AuICovXG4gIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcblxuICAvKiogQ2xhc3Mgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIG1lbnUncyBvdmVybGF5IHBhbmVsLiAqL1xuICBvdmVybGF5UGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LW1lbnVgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRNZW51RGVmYXVsdE9wdGlvbnM+KFxuICAnbWF0LW1lbnUtZGVmYXVsdC1vcHRpb25zJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0TWVudURlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBvdmVybGFwVHJpZ2dlcjogZmFsc2UsXG4gICAgeFBvc2l0aW9uOiAnYWZ0ZXInLFxuICAgIHlQb3NpdGlvbjogJ2JlbG93JyxcbiAgICBiYWNrZHJvcENsYXNzOiAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICB9O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbWVudScsXG4gIHRlbXBsYXRlVXJsOiAnbWVudS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ21lbnUuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdE1lbnUnLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdudWxsJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdE1lbnVBbmltYXRpb25zLnRyYW5zZm9ybU1lbnUsIG1hdE1lbnVBbmltYXRpb25zLmZhZGVJbkl0ZW1zXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9NRU5VX1BBTkVMLCB1c2VFeGlzdGluZzogTWF0TWVudX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRNZW51IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPiwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0TWVudUl0ZW0+O1xuICBwcml2YXRlIF94UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG4gIHByaXZhdGUgX3lQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcbiAgcHJpdmF0ZSBfZmlyc3RJdGVtRm9jdXNTdWJzY3JpcHRpb24/OiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX3ByZXZpb3VzRWxldmF0aW9uOiBzdHJpbmc7XG4gIHByaXZhdGUgX2VsZXZhdGlvblByZWZpeCA9ICdtYXQtZWxldmF0aW9uLXonO1xuICBwcml2YXRlIF9iYXNlRWxldmF0aW9uID0gODtcblxuICAvKiogQWxsIGl0ZW1zIGluc2lkZSB0aGUgbWVudS4gSW5jbHVkZXMgaXRlbXMgbmVzdGVkIGluc2lkZSBhbm90aGVyIG1lbnUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9hbGxJdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKiogT25seSB0aGUgZGlyZWN0IGRlc2NlbmRhbnQgbWVudSBpdGVtcy4gKi9cbiAgX2RpcmVjdERlc2NlbmRhbnRJdGVtcyA9IG5ldyBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIG1lbnUncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIG1lbnUgY29tcGxldGVzLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nOiBib29sZWFuO1xuXG4gIC8qKiBQYXJlbnQgbWVudSBvZiB0aGUgY3VycmVudCBtZW51IHBhbmVsLiAqL1xuICBwYXJlbnRNZW51OiBNYXRNZW51UGFuZWwgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIG1lbnUuICovXG4gIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcblxuICAvKiogYXJpYS1sYWJlbCBmb3IgdGhlIG1lbnUgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtZGVzY3JpYmVkYnkgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHhQb3NpdGlvbigpOiBNZW51UG9zaXRpb25YIHtcbiAgICByZXR1cm4gdGhpcy5feFBvc2l0aW9uO1xuICB9XG4gIHNldCB4UG9zaXRpb24odmFsdWU6IE1lbnVQb3NpdGlvblgpIHtcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gJ2JlZm9yZScgJiZcbiAgICAgIHZhbHVlICE9PSAnYWZ0ZXInICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKVxuICAgICkge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCgpO1xuICAgIH1cbiAgICB0aGlzLl94UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB5UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWSB7XG4gICAgcmV0dXJuIHRoaXMuX3lQb3NpdGlvbjtcbiAgfVxuICBzZXQgeVBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25ZKSB7XG4gICAgaWYgKHZhbHVlICE9PSAnYWJvdmUnICYmIHZhbHVlICE9PSAnYmVsb3cnICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25ZKCk7XG4gICAgfVxuICAgIHRoaXMuX3lQb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogTGlzdCBvZiB0aGUgaXRlbXMgaW5zaWRlIG9mIGEgbWVudS5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRNZW51SXRlbSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGl0ZW1zOiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+O1xuXG4gIC8qKlxuICAgKiBNZW51IGNvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfTUVOVV9DT05URU5UKSBsYXp5Q29udGVudDogTWF0TWVudUNvbnRlbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIG92ZXJsYXAgaXRzIHRyaWdnZXIuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgb3ZlcmxhcFRyaWdnZXI6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaGFzIGEgYmFja2Ryb3AuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiAodmFsdWU6IGFueSkgPT4gKHZhbHVlID09IG51bGwgPyBudWxsIDogYm9vbGVhbkF0dHJpYnV0ZSh2YWx1ZSkpfSlcbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2aW91c1BhbmVsQ2xhc3MgPSB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3M7XG5cbiAgICBpZiAocHJldmlvdXNQYW5lbENsYXNzICYmIHByZXZpb3VzUGFuZWxDbGFzcy5sZW5ndGgpIHtcbiAgICAgIHByZXZpb3VzUGFuZWxDbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFtjbGFzc05hbWVdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1BhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuXG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wcmV2aW91c1BhbmVsQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENsYXNzO1xuICB9XG4gIHNldCBjbGFzc0xpc3QoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlcztcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gYGNsb3NlZGAgaW5zdGVhZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2U6IEV2ZW50RW1pdHRlcjxNZW51Q2xvc2VSZWFzb24+ID0gdGhpcy5jbG9zZWQ7XG5cbiAgcmVhZG9ubHkgcGFuZWxJZCA9IGBtYXQtbWVudS1wYW5lbC0ke21lbnVQYW5lbFVpZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBfY2hhbmdlRGV0ZWN0b3JSZWZgIHRvIGJlY29tZSBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMCBgX2NoYW5nZURldGVjdG9yUmVmYCB0byBiZWNvbWUgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgdGhpcy5vdmVybGF5UGFuZWxDbGFzcyA9IGRlZmF1bHRPcHRpb25zLm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuICAgIHRoaXMuX3hQb3NpdGlvbiA9IGRlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgICB0aGlzLl95UG9zaXRpb24gPSBkZWZhdWx0T3B0aW9ucy55UG9zaXRpb247XG4gICAgdGhpcy5iYWNrZHJvcENsYXNzID0gZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcbiAgICB0aGlzLm92ZXJsYXBUcmlnZ2VyID0gZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG4gICAgdGhpcy5oYXNCYWNrZHJvcCA9IGRlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpO1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAud2l0aFR5cGVBaGVhZCgpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZWQuZW1pdCgndGFiJykpO1xuXG4gICAgLy8gSWYgYSB1c2VyIG1hbnVhbGx5IChwcm9ncmFtbWF0aWNhbGx5KSBmb2N1c2VzIGEgbWVudSBpdGVtLCB3ZSBuZWVkIHRvIHJlZmxlY3QgdGhhdCBmb2N1c1xuICAgIC8vIGNoYW5nZSBiYWNrIHRvIHRoZSBrZXkgbWFuYWdlci4gTm90ZSB0aGF0IHdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgaGVyZSBiZWNhdXNlIF9mb2N1c2VkXG4gICAgLy8gaXMgaW50ZXJuYWwgYW5kIHdlIGtub3cgdGhhdCBpdCBnZXRzIGNvbXBsZXRlZCBvbiBkZXN0cm95LlxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9mb2N1c2VkKSkpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShmb2N1c2VkSXRlbSA9PiB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oZm9jdXNlZEl0ZW0gYXMgTWF0TWVudUl0ZW0pKTtcblxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzLnN1YnNjcmliZSgoaXRlbXNMaXN0OiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAvLyBNb3ZlIGZvY3VzIHRvIGFub3RoZXIgaXRlbSwgaWYgdGhlIGFjdGl2ZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgbGlzdC5cbiAgICAgIC8vIFdlIG5lZWQgdG8gZGVib3VuY2UgdGhlIGNhbGxiYWNrLCBiZWNhdXNlIG11bHRpcGxlIGl0ZW1zIG1pZ2h0IGJlIHJlbW92ZWRcbiAgICAgIC8vIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgICAgaWYgKHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPT09ICdlbnRlcicgJiYgbWFuYWdlci5hY3RpdmVJdGVtPy5faGFzRm9jdXMoKSkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGl0ZW1zTGlzdC50b0FycmF5KCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMCkpO1xuXG4gICAgICAgIGlmIChpdGVtc1tpbmRleF0gJiYgIWl0ZW1zW2luZGV4XS5kaXNhYmxlZCkge1xuICAgICAgICAgIG1hbmFnZXIuc2V0QWN0aXZlSXRlbShpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFuYWdlci5zZXROZXh0SXRlbUFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmRlc3Ryb3koKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBob3ZlcmVkIG1lbnUgaXRlbSBjaGFuZ2VzLiAqL1xuICBfaG92ZXJlZCgpOiBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPiB7XG4gICAgLy8gQ29lcmNlIHRoZSBgY2hhbmdlc2AgcHJvcGVydHkgYmVjYXVzZSBBbmd1bGFyIHR5cGVzIGl0IGFzIGBPYnNlcnZhYmxlPGFueT5gXG4gICAgY29uc3QgaXRlbUNoYW5nZXMgPSB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcyBhcyBPYnNlcnZhYmxlPFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4+O1xuICAgIHJldHVybiBpdGVtQ2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2UoLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5faG92ZXJlZCkpKSxcbiAgICApIGFzIE9ic2VydmFibGU8TWF0TWVudUl0ZW0+O1xuICB9XG5cbiAgLypcbiAgICogUmVnaXN0ZXJzIGEgbWVudSBpdGVtIHdpdGggdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIGFkZEl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgcmVtb3ZlSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqIEhhbmRsZSBhIGtleWJvYXJkIGV2ZW50IGZyb20gdGhlIG1lbnUsIGRlbGVnYXRpbmcgdG8gdGhlIGFwcHJvcHJpYXRlIGFjdGlvbi4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdsdHInKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgIG1hbmFnZXIuc2V0Rm9jdXNPcmlnaW4oJ2tleWJvYXJkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEb24ndCBhbGxvdyB0aGUgZXZlbnQgdG8gcHJvcGFnYXRlIGlmIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCBpdCwgb3IgaXQgbWF5XG4gICAgLy8gZW5kIHVwIHJlYWNoaW5nIG90aGVyIG92ZXJsYXlzIHRoYXQgd2VyZSBvcGVuZWQgZWFybGllciAoc2VlICMyMjY5NCkuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG1lbnUuXG4gICAqIEBwYXJhbSBvcmlnaW4gQWN0aW9uIGZyb20gd2hpY2ggdGhlIGZvY3VzIG9yaWdpbmF0ZWQuIFVzZWQgdG8gc2V0IHRoZSBjb3JyZWN0IHN0eWxpbmcuXG4gICAqL1xuICBmb2N1c0ZpcnN0SXRlbShvcmlnaW46IEZvY3VzT3JpZ2luID0gJ3Byb2dyYW0nKTogdm9pZCB7XG4gICAgLy8gV2FpdCBmb3IgYG9uU3RhYmxlYCB0byBlbnN1cmUgaU9TIFZvaWNlT3ZlciBzY3JlZW4gcmVhZGVyIGZvY3VzZXMgdGhlIGZpcnN0IGl0ZW0gKCMyNDczNSkuXG4gICAgdGhpcy5fZmlyc3RJdGVtRm9jdXNTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZmlyc3RJdGVtRm9jdXNTdWJzY3JpcHRpb24gPSB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgbGV0IG1lbnVQYW5lbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgYG1hdC1tZW51UGFuZWxgIGlzIGF0IHRoZSBET00gaW5zZXJ0aW9uIHBvaW50LCBub3QgaW5zaWRlIHRoZSBvdmVybGF5LCB3ZSBkb24ndFxuICAgICAgICAvLyBoYXZlIGEgbmljZSB3YXkgb2YgZ2V0dGluZyBhIGhvbGQgb2YgdGhlIG1lbnVQYW5lbCBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHBhbmVsIGlzIGluc2lkZSBhbiBgbmctdGVtcGxhdGVgLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBzdGFydGluZyBmcm9tIG9uZSBvZlxuICAgICAgICAvLyB0aGUgaXRlbXMgYW5kIHdhbGtpbmcgdXAgdGhlIERPTS5cbiAgICAgICAgbWVudVBhbmVsID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmZpcnN0IS5fZ2V0SG9zdEVsZW1lbnQoKS5jbG9zZXN0KCdbcm9sZT1cIm1lbnVcIl0nKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgYW4gaXRlbSBpbiB0aGUgbWVudVBhbmVsIGlzIGFscmVhZHkgZm9jdXNlZCwgYXZvaWQgb3ZlcnJpZGluZyB0aGUgZm9jdXMuXG4gICAgICBpZiAoIW1lbnVQYW5lbCB8fCAhbWVudVBhbmVsLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKG9yaWdpbikuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgICAgICAvLyBNb3ZlIGZvY3VzIHRvIHRoZSBtZW51UGFuZWwgcGFuZWwgc28ga2V5Ym9hcmQgZXZlbnRzIGxpa2UgRXNjYXBlIHN0aWxsIHdvcmsuIEFsc28gdGhpcyB3aWxsXG4gICAgICAgIC8vIGdpdmUgX3NvbWVfIGZlZWRiYWNrIHRvIHNjcmVlbiByZWFkZXJzLlxuICAgICAgICBpZiAoIW1hbmFnZXIuYWN0aXZlSXRlbSAmJiBtZW51UGFuZWwpIHtcbiAgICAgICAgICBtZW51UGFuZWwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gaW4gdGhlIG1lbnUuIFRoaXMgaXMgdXNlZCB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZCwgYWxsb3dpbmdcbiAgICogdGhlIHVzZXIgdG8gc3RhcnQgZnJvbSB0aGUgZmlyc3Qgb3B0aW9uIHdoZW4gcHJlc3NpbmcgdGhlIGRvd24gYXJyb3cuXG4gICAqL1xuICByZXNldEFjdGl2ZUl0ZW0oKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtZW51IHBhbmVsIGVsZXZhdGlvbi5cbiAgICogQHBhcmFtIGRlcHRoIE51bWJlciBvZiBwYXJlbnQgbWVudXMgdGhhdCBjb21lIGJlZm9yZSB0aGUgbWVudS5cbiAgICovXG4gIHNldEVsZXZhdGlvbihkZXB0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIGVsZXZhdGlvbiBzdGFydHMgYXQgdGhlIGJhc2UgYW5kIGluY3JlYXNlcyBieSBvbmUgZm9yIGVhY2ggbGV2ZWwuXG4gICAgLy8gQ2FwcGVkIGF0IDI0IGJlY2F1c2UgdGhhdCdzIHRoZSBtYXhpbXVtIGVsZXZhdGlvbiBkZWZpbmVkIGluIHRoZSBNYXRlcmlhbCBkZXNpZ24gc3BlYy5cbiAgICBjb25zdCBlbGV2YXRpb24gPSBNYXRoLm1pbih0aGlzLl9iYXNlRWxldmF0aW9uICsgZGVwdGgsIDI0KTtcbiAgICBjb25zdCBuZXdFbGV2YXRpb24gPSBgJHt0aGlzLl9lbGV2YXRpb25QcmVmaXh9JHtlbGV2YXRpb259YDtcbiAgICBjb25zdCBjdXN0b21FbGV2YXRpb24gPSBPYmplY3Qua2V5cyh0aGlzLl9jbGFzc0xpc3QpLmZpbmQoY2xhc3NOYW1lID0+IHtcbiAgICAgIHJldHVybiBjbGFzc05hbWUuc3RhcnRzV2l0aCh0aGlzLl9lbGV2YXRpb25QcmVmaXgpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFjdXN0b21FbGV2YXRpb24gfHwgY3VzdG9tRWxldmF0aW9uID09PSB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICAgIHRoaXMuX2NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xhc3NMaXN0W25ld0VsZXZhdGlvbl0gPSB0cnVlO1xuICAgICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3NlcyB0byB0aGUgbWVudSBwYW5lbCBiYXNlZCBvbiBpdHMgcG9zaXRpb24uIENhbiBiZSB1c2VkIGJ5XG4gICAqIGNvbnN1bWVycyB0byBhZGQgc3BlY2lmaWMgc3R5bGluZyBiYXNlZCBvbiB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NYIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSBwb3NZIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB5IGF4aXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3NYOiBNZW51UG9zaXRpb25YID0gdGhpcy54UG9zaXRpb24sIHBvc1k6IE1lbnVQb3NpdGlvblkgPSB0aGlzLnlQb3NpdGlvbikge1xuICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLl9jbGFzc0xpc3Q7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVmb3JlJ10gPSBwb3NYID09PSAnYmVmb3JlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hZnRlciddID0gcG9zWCA9PT0gJ2FmdGVyJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1hYm92ZSddID0gcG9zWSA9PT0gJ2Fib3ZlJztcbiAgICBjbGFzc2VzWydtYXQtbWVudS1iZWxvdyddID0gcG9zWSA9PT0gJ2JlbG93JztcblxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgX2NoYW5nZURldGVjdG9yUmVmYC5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogU3RhcnRzIHRoZSBlbnRlciBhbmltYXRpb24uICovXG4gIF9zdGFydEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfcmVzZXRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gIH1cblxuICAvKiogUmVzZXRzIHRoZSBwYW5lbCBhbmltYXRpb24gdG8gaXRzIGluaXRpYWwgc3RhdGUuICovXG4gIF9yZXNldEFuaW1hdGlvbigpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIENvbWJpbmUgd2l0aCBfc3RhcnRBbmltYXRpb24uXG4gICAgdGhpcy5fcGFuZWxBbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgfVxuXG4gIC8qKiBDYWxsYmFjayB0aGF0IGlzIGludm9rZWQgd2hlbiB0aGUgcGFuZWwgYW5pbWF0aW9uIGNvbXBsZXRlcy4gKi9cbiAgX29uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLm5leHQoZXZlbnQpO1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gIH1cblxuICBfb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAvLyBTY3JvbGwgdGhlIGNvbnRlbnQgZWxlbWVudCB0byB0aGUgdG9wIGFzIHNvb24gYXMgdGhlIGFuaW1hdGlvbiBzdGFydHMuIFRoaXMgaXMgbmVjZXNzYXJ5LFxuICAgIC8vIGJlY2F1c2Ugd2UgbW92ZSBmb2N1cyB0byB0aGUgZmlyc3QgaXRlbSB3aGlsZSBpdCdzIHN0aWxsIGJlaW5nIGFuaW1hdGVkLCB3aGljaCBjYW4gdGhyb3dcbiAgICAvLyB0aGUgYnJvd3NlciBvZmYgd2hlbiBpdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgcG9zaXRpb24uIEFsdGVybmF0aXZlbHkgd2UgY2FuIG1vdmUgZm9jdXNcbiAgICAvLyB3aGVuIHRoZSBhbmltYXRpb24gaXMgZG9uZSwgaG93ZXZlciBtb3ZpbmcgZm9jdXMgYXN5bmNocm9ub3VzbHkgd2lsbCBpbnRlcnJ1cHQgc2NyZWVuXG4gICAgLy8gcmVhZGVycyB3aGljaCBhcmUgaW4gdGhlIHByb2Nlc3Mgb2YgcmVhZGluZyBvdXQgdGhlIG1lbnUgYWxyZWFkeS4gV2UgdGFrZSB0aGUgYGVsZW1lbnRgXG4gICAgLy8gZnJvbSB0aGUgYGV2ZW50YCBzaW5jZSB3ZSBjYW4ndCB1c2UgYSBgVmlld0NoaWxkYCB0byBhY2Nlc3MgdGhlIHBhbmUuXG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggPT09IDApIHtcbiAgICAgIGV2ZW50LmVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cCBhIHN0cmVhbSB0aGF0IHdpbGwga2VlcCB0cmFjayBvZiBhbnkgbmV3bHktYWRkZWQgbWVudSBpdGVtcyBhbmQgd2lsbCB1cGRhdGUgdGhlIGxpc3RcbiAgICogb2YgZGlyZWN0IGRlc2NlbmRhbnRzLiBXZSBjb2xsZWN0IHRoZSBkZXNjZW5kYW50cyB0aGlzIHdheSwgYmVjYXVzZSBgX2FsbEl0ZW1zYCBjYW4gaW5jbHVkZVxuICAgKiBpdGVtcyB0aGF0IGFyZSBwYXJ0IG9mIGNoaWxkIG1lbnVzLCBhbmQgdXNpbmcgYSBjdXN0b20gd2F5IG9mIHJlZ2lzdGVyaW5nIGl0ZW1zIGlzIHVucmVsaWFibGVcbiAgICogd2hlbiBpdCBjb21lcyB0byBtYWludGFpbmluZyB0aGUgaXRlbSBvcmRlci5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZURpcmVjdERlc2NlbmRhbnRzKCkge1xuICAgIHRoaXMuX2FsbEl0ZW1zLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9hbGxJdGVtcykpXG4gICAgICAuc3Vic2NyaWJlKChpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPikgPT4ge1xuICAgICAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMucmVzZXQoaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5fcGFyZW50TWVudSA9PT0gdGhpcykpO1xuICAgICAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJtYXQtbWRjLW1lbnUtcGFuZWwgbWF0LW1kYy1lbGV2YXRpb24tc3BlY2lmaWNcIlxuICAgIFtpZF09XCJwYW5lbElkXCJcbiAgICBbbmdDbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcbiAgICAoY2xpY2spPVwiY2xvc2VkLmVtaXQoJ2NsaWNrJylcIlxuICAgIFtAdHJhbnNmb3JtTWVudV09XCJfcGFuZWxBbmltYXRpb25TdGF0ZVwiXG4gICAgKEB0cmFuc2Zvcm1NZW51LnN0YXJ0KT1cIl9vbkFuaW1hdGlvblN0YXJ0KCRldmVudClcIlxuICAgIChAdHJhbnNmb3JtTWVudS5kb25lKT1cIl9vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KVwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gICAgcm9sZT1cIm1lbnVcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieSB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImFyaWFEZXNjcmliZWRieSB8fCBudWxsXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtbWVudS1jb250ZW50XCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==