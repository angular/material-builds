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
import { NgClass } from '@angular/common';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatMenu, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MAT_MENU_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.1.0-next.2", type: MatMenu, isStandalone: true, selector: "mat-menu", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], xPosition: "xPosition", yPosition: "yPosition", overlapTrigger: ["overlapTrigger", "overlapTrigger", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", (value) => (value == null ? null : booleanAttribute(value))], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed", close: "close" }, host: { attributes: { "ngSkipHydration": "" }, properties: { "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" } }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], queries: [{ propertyName: "lazyContent", first: true, predicate: MAT_MENU_CONTENT, descendants: true }, { propertyName: "_allItems", predicate: MatMenuItem, descendants: true }, { propertyName: "items", predicate: MatMenuItem }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["matMenu"], ngImport: i0, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:16px}.mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:32px}[dir=rtl] .mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{position:absolute;top:50%;right:16px;transform:translateY(-50%);width:5px;height:10px;fill:currentColor}[dir=rtl] .mat-mdc-menu-submenu-icon{right:auto;left:16px;transform:translateY(-50%) scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mat-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, exportAs: 'matMenu', host: {
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                        'ngSkipHydration': '',
                    }, animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], standalone: true, imports: [NgClass], template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [ngClass]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{margin-right:16px}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:16px}.mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:32px}[dir=rtl] .mat-mdc-menu-item.mat-mdc-menu-item-submenu-trigger{padding-right:16px;padding-left:32px}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{position:absolute;top:50%;right:16px;transform:translateY(-50%);width:5px;height:10px;fill:currentColor}[dir=rtl] .mat-mdc-menu-submenu-icon{right:auto;left:16px;transform:translateY(-50%) scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUNqQixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFlLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8s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QyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQTJCeEMsYUFBYTtzQkFBckIsS0FBSztnQkFHZSxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBR08sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBR0csZUFBZTtzQkFBekMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBSXJCLFNBQVM7c0JBRFosS0FBSztnQkFrQkYsU0FBUztzQkFEWixLQUFLO2dCQWFrQixXQUFXO3NCQUFsQyxTQUFTO3VCQUFDLFdBQVc7Z0JBTzhCLEtBQUs7c0JBQXhELGVBQWU7dUJBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQztnQkFNbEIsV0FBVztzQkFBMUMsWUFBWTt1QkFBQyxnQkFBZ0I7Z0JBR1EsY0FBYztzQkFBbkQsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFJcEMsV0FBVztzQkFEVixLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztnQkFVaEYsVUFBVTtzQkFEYixLQUFLO3VCQUFDLE9BQU87Z0JBOEJWLFNBQVM7c0JBRFosS0FBSztnQkFTYSxNQUFNO3NCQUF4QixNQUFNO2dCQU9ZLEtBQUs7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uSW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBFU0NBUEUsXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBET1dOX0FSUk9XLFxuICBVUF9BUlJPVyxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNYXRNZW51UGFuZWwsIE1BVF9NRU5VX1BBTkVMfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVDb250ZW50LCBNQVRfTUVOVV9DT05URU5UfSBmcm9tICcuL21lbnUtY29udGVudCc7XG5pbXBvcnQge21hdE1lbnVBbmltYXRpb25zfSBmcm9tICcuL21lbnUtYW5pbWF0aW9ucyc7XG5pbXBvcnQge05nQ2xhc3N9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmxldCBtZW51UGFuZWxVaWQgPSAwO1xuXG4vKiogUmVhc29uIHdoeSB0aGUgbWVudSB3YXMgY2xvc2VkLiAqL1xuZXhwb3J0IHR5cGUgTWVudUNsb3NlUmVhc29uID0gdm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1tZW51YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPihcbiAgJ21hdC1tZW51LWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgb3ZlcmxhcFRyaWdnZXI6IGZhbHNlLFxuICAgIHhQb3NpdGlvbjogJ2FmdGVyJyxcbiAgICB5UG9zaXRpb246ICdiZWxvdycsXG4gICAgYmFja2Ryb3BDbGFzczogJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgfTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydtZW51LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnbnVsbCcsXG4gICAgJ25nU2tpcEh5ZHJhdGlvbic6ICcnLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0TWVudUFuaW1hdGlvbnMudHJhbnNmb3JtTWVudSwgbWF0TWVudUFuaW1hdGlvbnMuZmFkZUluSXRlbXNdLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX01FTlVfUEFORUwsIHVzZUV4aXN0aW5nOiBNYXRNZW51fV0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtOZ0NsYXNzXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE1hdE1lbnVQYW5lbDxNYXRNZW51SXRlbT4sIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdE1lbnVJdGVtPjtcbiAgcHJpdmF0ZSBfeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuICBwcml2YXRlIF95UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG4gIHByaXZhdGUgX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbjogc3RyaW5nO1xuICBwcml2YXRlIF9lbGV2YXRpb25QcmVmaXggPSAnbWF0LWVsZXZhdGlvbi16JztcbiAgcHJpdmF0ZSBfYmFzZUVsZXZhdGlvbiA9IDg7XG5cbiAgLyoqIEFsbCBpdGVtcyBpbnNpZGUgdGhlIG1lbnUuIEluY2x1ZGVzIGl0ZW1zIG5lc3RlZCBpbnNpZGUgYW5vdGhlciBtZW51LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE1lbnVJdGVtLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsSXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT47XG5cbiAgLyoqIE9ubHkgdGhlIGRpcmVjdCBkZXNjZW5kYW50IG1lbnUgaXRlbXMuICovXG4gIF9kaXJlY3REZXNjZW5kYW50SXRlbXMgPSBuZXcgUXVlcnlMaXN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBtZW51J3MgbmdDbGFzcyAqL1xuICBfY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgcGFuZWwgYW5pbWF0aW9uLiAqL1xuICBfcGFuZWxBbmltYXRpb25TdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgYW4gYW5pbWF0aW9uIG9uIHRoZSBtZW51IGNvbXBsZXRlcy4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBpcyBhbmltYXRpbmcuICovXG4gIF9pc0FuaW1hdGluZzogYm9vbGVhbjtcblxuICAvKiogUGFyZW50IG1lbnUgb2YgdGhlIGN1cnJlbnQgbWVudSBwYW5lbC4gKi9cbiAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIG9mIHRoZSBtZW51LiAqL1xuICBkaXJlY3Rpb246IERpcmVjdGlvbjtcblxuICAvKiogQ2xhc3Mgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvdmVybGF5UGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIENsYXNzIHRvIGJlIGFkZGVkIHRvIHRoZSBiYWNrZHJvcCBlbGVtZW50LiAqL1xuICBASW5wdXQoKSBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtbGFiZWwgZm9yIHRoZSBtZW51IHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogYXJpYS1sYWJlbGxlZGJ5IGZvciB0aGUgbWVudSBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWRlc2NyaWJlZGJ5IGZvciB0aGUgbWVudSBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBtZW51IGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIGdldCB4UG9zaXRpb24oKTogTWVudVBvc2l0aW9uWCB7XG4gICAgcmV0dXJuIHRoaXMuX3hQb3NpdGlvbjtcbiAgfVxuICBzZXQgeFBvc2l0aW9uKHZhbHVlOiBNZW51UG9zaXRpb25YKSB7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09ICdiZWZvcmUnICYmXG4gICAgICB2YWx1ZSAhPT0gJ2FmdGVyJyAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICApIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblgoKTtcbiAgICB9XG4gICAgdGhpcy5feFBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgbWVudSBpbiB0aGUgWSBheGlzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgeVBvc2l0aW9uKCk6IE1lbnVQb3NpdGlvblkge1xuICAgIHJldHVybiB0aGlzLl95UG9zaXRpb247XG4gIH1cbiAgc2V0IHlQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWSkge1xuICAgIGlmICh2YWx1ZSAhPT0gJ2Fib3ZlJyAmJiB2YWx1ZSAhPT0gJ2JlbG93JyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWSgpO1xuICAgIH1cbiAgICB0aGlzLl95UG9zaXRpb24gPSB2YWx1ZTtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdGhlIGl0ZW1zIGluc2lkZSBvZiBhIG1lbnUuXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogZmFsc2V9KSBpdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKipcbiAgICogTWVudSBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX01FTlVfQ09OVEVOVCkgbGF6eUNvbnRlbnQ6IE1hdE1lbnVDb250ZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IHNob3VsZCBvdmVybGFwIGl0cyB0cmlnZ2VyLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pIG92ZXJsYXBUcmlnZ2VyOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGhhcyBhIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogKHZhbHVlOiBhbnkpID0+ICh2YWx1ZSA9PSBudWxsID8gbnVsbCA6IGJvb2xlYW5BdHRyaWJ1dGUodmFsdWUpKX0pXG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LW1lbnUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBtZW51IHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBtZW51IGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lbENsYXNzID0gdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzO1xuXG4gICAgaWYgKHByZXZpb3VzUGFuZWxDbGFzcyAmJiBwcmV2aW91c1BhbmVsQ2xhc3MubGVuZ3RoKSB7XG4gICAgICBwcmV2aW91c1BhbmVsQ2xhc3Muc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbY2xhc3NOYW1lXSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNQYW5lbENsYXNzID0gY2xhc3NlcztcblxuICAgIGlmIChjbGFzc2VzICYmIGNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICBjbGFzc2VzLnNwbGl0KCcgJykuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfcHJldmlvdXNQYW5lbENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1tZW51IGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogbWVudSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgbWVudSBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBwYW5lbENsYXNzYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xhc3NMaXN0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWxDbGFzcztcbiAgfVxuICBzZXQgY2xhc3NMaXN0KGNsYXNzZXM6IHN0cmluZykge1xuICAgIHRoaXMucGFuZWxDbGFzcyA9IGNsYXNzZXM7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPE1lbnVDbG9zZVJlYXNvbj4gPSBuZXcgRXZlbnRFbWl0dGVyPE1lbnVDbG9zZVJlYXNvbj4oKTtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZC5cbiAgICogQGRlcHJlY2F0ZWQgU3dpdGNoIHRvIGBjbG9zZWRgIGluc3RlYWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlOiBFdmVudEVtaXR0ZXI8TWVudUNsb3NlUmVhc29uPiA9IHRoaXMuY2xvc2VkO1xuXG4gIHJlYWRvbmx5IHBhbmVsSWQgPSBgbWF0LW1lbnUtcGFuZWwtJHttZW51UGFuZWxVaWQrK31gO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBgX2NoYW5nZURldGVjdG9yUmVmYCB0byBiZWNvbWUgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTUuMC4wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBkZWZhdWx0T3B0aW9uczogTWF0TWVudURlZmF1bHRPcHRpb25zLFxuICAgIGNoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxNS4wLjAgYF9jaGFuZ2VEZXRlY3RvclJlZmAgdG8gYmVjb21lIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHRoaXMub3ZlcmxheVBhbmVsQ2xhc3MgPSBkZWZhdWx0T3B0aW9ucy5vdmVybGF5UGFuZWxDbGFzcyB8fCAnJztcbiAgICB0aGlzLl94UG9zaXRpb24gPSBkZWZhdWx0T3B0aW9ucy54UG9zaXRpb247XG4gICAgdGhpcy5feVBvc2l0aW9uID0gZGVmYXVsdE9wdGlvbnMueVBvc2l0aW9uO1xuICAgIHRoaXMuYmFja2Ryb3BDbGFzcyA9IGRlZmF1bHRPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG4gICAgdGhpcy5vdmVybGFwVHJpZ2dlciA9IGRlZmF1bHRPcHRpb25zLm92ZXJsYXBUcmlnZ2VyO1xuICAgIHRoaXMuaGFzQmFja2Ryb3AgPSBkZWZhdWx0T3B0aW9ucy5oYXNCYWNrZHJvcDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdXBkYXRlRGlyZWN0RGVzY2VuZGFudHMoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpXG4gICAgICAud2l0aFdyYXAoKVxuICAgICAgLndpdGhUeXBlQWhlYWQoKVxuICAgICAgLndpdGhIb21lQW5kRW5kKCk7XG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2VkLmVtaXQoJ3RhYicpKTtcblxuICAgIC8vIElmIGEgdXNlciBtYW51YWxseSAocHJvZ3JhbW1hdGljYWxseSkgZm9jdXNlcyBhIG1lbnUgaXRlbSwgd2UgbmVlZCB0byByZWZsZWN0IHRoYXQgZm9jdXNcbiAgICAvLyBjaGFuZ2UgYmFjayB0byB0aGUga2V5IG1hbmFnZXIuIE5vdGUgdGhhdCB3ZSBkb24ndCBuZWVkIHRvIHVuc3Vic2NyaWJlIGhlcmUgYmVjYXVzZSBfZm9jdXNlZFxuICAgIC8vIGlzIGludGVybmFsIGFuZCB3ZSBrbm93IHRoYXQgaXQgZ2V0cyBjb21wbGV0ZWQgb24gZGVzdHJveS5cbiAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlc1xuICAgICAgLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aCh0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLFxuICAgICAgICBzd2l0Y2hNYXAoaXRlbXMgPT4gbWVyZ2UoLi4uaXRlbXMubWFwKChpdGVtOiBNYXRNZW51SXRlbSkgPT4gaXRlbS5fZm9jdXNlZCkpKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNlZEl0ZW0gPT4gdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGZvY3VzZWRJdGVtIGFzIE1hdE1lbnVJdGVtKSk7XG5cbiAgICB0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMuY2hhbmdlcy5zdWJzY3JpYmUoKGl0ZW1zTGlzdDogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPikgPT4ge1xuICAgICAgLy8gTW92ZSBmb2N1cyB0byBhbm90aGVyIGl0ZW0sIGlmIHRoZSBhY3RpdmUgaXRlbSBpcyByZW1vdmVkIGZyb20gdGhlIGxpc3QuXG4gICAgICAvLyBXZSBuZWVkIHRvIGRlYm91bmNlIHRoZSBjYWxsYmFjaywgYmVjYXVzZSBtdWx0aXBsZSBpdGVtcyBtaWdodCBiZSByZW1vdmVkXG4gICAgICAvLyBpbiBxdWljayBzdWNjZXNzaW9uLlxuICAgICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICAgIGlmICh0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID09PSAnZW50ZXInICYmIG1hbmFnZXIuYWN0aXZlSXRlbT8uX2hhc0ZvY3VzKCkpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBpdGVtc0xpc3QudG9BcnJheSgpO1xuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKGl0ZW1zLmxlbmd0aCAtIDEsIG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApKTtcblxuICAgICAgICBpZiAoaXRlbXNbaW5kZXhdICYmICFpdGVtc1tpbmRleF0uZGlzYWJsZWQpIHtcbiAgICAgICAgICBtYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hbmFnZXIuc2V0TmV4dEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5kZXN0cm95KCk7XG4gICAgdGhpcy5jbG9zZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9maXJzdEl0ZW1Gb2N1c1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgaG92ZXJlZCBtZW51IGl0ZW0gY2hhbmdlcy4gKi9cbiAgX2hvdmVyZWQoKTogT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT4ge1xuICAgIC8vIENvZXJjZSB0aGUgYGNoYW5nZXNgIHByb3BlcnR5IGJlY2F1c2UgQW5ndWxhciB0eXBlcyBpdCBhcyBgT2JzZXJ2YWJsZTxhbnk+YFxuICAgIGNvbnN0IGl0ZW1DaGFuZ2VzID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmNoYW5nZXMgYXMgT2JzZXJ2YWJsZTxRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+PjtcbiAgICByZXR1cm4gaXRlbUNoYW5nZXMucGlwZShcbiAgICAgIHN0YXJ0V2l0aCh0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMpLFxuICAgICAgc3dpdGNoTWFwKGl0ZW1zID0+IG1lcmdlKC4uLml0ZW1zLm1hcCgoaXRlbTogTWF0TWVudUl0ZW0pID0+IGl0ZW0uX2hvdmVyZWQpKSksXG4gICAgKSBhcyBPYnNlcnZhYmxlPE1hdE1lbnVJdGVtPjtcbiAgfVxuXG4gIC8qXG4gICAqIFJlZ2lzdGVycyBhIG1lbnUgaXRlbSB3aXRoIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICBhZGRJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIG1lbnUuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICogQGRlcHJlY2F0ZWQgTm8gbG9uZ2VyIGJlaW5nIHVzZWQuIFRvIGJlIHJlbW92ZWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAgICovXG4gIHJlbW92ZUl0ZW0oX2l0ZW06IE1hdE1lbnVJdGVtKSB7fVxuXG4gIC8qKiBIYW5kbGUgYSBrZXlib2FyZCBldmVudCBmcm9tIHRoZSBtZW51LCBkZWxlZ2F0aW5nIHRvIHRoZSBhcHByb3ByaWF0ZSBhY3Rpb24uICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAnbHRyJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIGlmICh0aGlzLnBhcmVudE1lbnUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1cpIHtcbiAgICAgICAgICBtYW5hZ2VyLnNldEZvY3VzT3JpZ2luKCdrZXlib2FyZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgYWxsb3cgdGhlIGV2ZW50IHRvIHByb3BhZ2F0ZSBpZiB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgaXQsIG9yIGl0IG1heVxuICAgIC8vIGVuZCB1cCByZWFjaGluZyBvdGhlciBvdmVybGF5cyB0aGF0IHdlcmUgb3BlbmVkIGVhcmxpZXIgKHNlZSAjMjI2OTQpLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBtZW51LlxuICAgKiBAcGFyYW0gb3JpZ2luIEFjdGlvbiBmcm9tIHdoaWNoIHRoZSBmb2N1cyBvcmlnaW5hdGVkLiBVc2VkIHRvIHNldCB0aGUgY29ycmVjdCBzdHlsaW5nLlxuICAgKi9cbiAgZm9jdXNGaXJzdEl0ZW0ob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJyk6IHZvaWQge1xuICAgIC8vIFdhaXQgZm9yIGBvblN0YWJsZWAgdG8gZW5zdXJlIGlPUyBWb2ljZU92ZXIgc2NyZWVuIHJlYWRlciBmb2N1c2VzIHRoZSBmaXJzdCBpdGVtICgjMjQ3MzUpLlxuICAgIHRoaXMuX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2ZpcnN0SXRlbUZvY3VzU3Vic2NyaXB0aW9uID0gdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGxldCBtZW51UGFuZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3REZXNjZW5kYW50SXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIGBtYXQtbWVudVBhbmVsYCBpcyBhdCB0aGUgRE9NIGluc2VydGlvbiBwb2ludCwgbm90IGluc2lkZSB0aGUgb3ZlcmxheSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gaGF2ZSBhIG5pY2Ugd2F5IG9mIGdldHRpbmcgYSBob2xkIG9mIHRoZSBtZW51UGFuZWwgcGFuZWwuIFdlIGNhbid0IHVzZSBhIGBWaWV3Q2hpbGRgIGVpdGhlclxuICAgICAgICAvLyBiZWNhdXNlIHRoZSBwYW5lbCBpcyBpbnNpZGUgYW4gYG5nLXRlbXBsYXRlYC4gV2Ugd29yayBhcm91bmQgaXQgYnkgc3RhcnRpbmcgZnJvbSBvbmUgb2ZcbiAgICAgICAgLy8gdGhlIGl0ZW1zIGFuZCB3YWxraW5nIHVwIHRoZSBET00uXG4gICAgICAgIG1lbnVQYW5lbCA9IHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5maXJzdCEuX2dldEhvc3RFbGVtZW50KCkuY2xvc2VzdCgnW3JvbGU9XCJtZW51XCJdJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGFuIGl0ZW0gaW4gdGhlIG1lbnVQYW5lbCBpcyBhbHJlYWR5IGZvY3VzZWQsIGF2b2lkIG92ZXJyaWRpbmcgdGhlIGZvY3VzLlxuICAgICAgaWYgKCFtZW51UGFuZWwgfHwgIW1lbnVQYW5lbC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbihvcmlnaW4pLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuXG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gYWN0aXZlIGl0ZW0gYXQgdGhpcyBwb2ludCwgaXQgbWVhbnMgdGhhdCBhbGwgdGhlIGl0ZW1zIGFyZSBkaXNhYmxlZC5cbiAgICAgICAgLy8gTW92ZSBmb2N1cyB0byB0aGUgbWVudVBhbmVsIHBhbmVsIHNvIGtleWJvYXJkIGV2ZW50cyBsaWtlIEVzY2FwZSBzdGlsbCB3b3JrLiBBbHNvIHRoaXMgd2lsbFxuICAgICAgICAvLyBnaXZlIF9zb21lXyBmZWVkYmFjayB0byBzY3JlZW4gcmVhZGVycy5cbiAgICAgICAgaWYgKCFtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiYgbWVudVBhbmVsKSB7XG4gICAgICAgICAgbWVudVBhbmVsLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGFjdGl2ZSBpdGVtIGluIHRoZSBtZW51LiBUaGlzIGlzIHVzZWQgd2hlbiB0aGUgbWVudSBpcyBvcGVuZWQsIGFsbG93aW5nXG4gICAqIHRoZSB1c2VyIHRvIHN0YXJ0IGZyb20gdGhlIGZpcnN0IG9wdGlvbiB3aGVuIHByZXNzaW5nIHRoZSBkb3duIGFycm93LlxuICAgKi9cbiAgcmVzZXRBY3RpdmVJdGVtKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWVudSBwYW5lbCBlbGV2YXRpb24uXG4gICAqIEBwYXJhbSBkZXB0aCBOdW1iZXIgb2YgcGFyZW50IG1lbnVzIHRoYXQgY29tZSBiZWZvcmUgdGhlIG1lbnUuXG4gICAqL1xuICBzZXRFbGV2YXRpb24oZGVwdGg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFRoZSBlbGV2YXRpb24gc3RhcnRzIGF0IHRoZSBiYXNlIGFuZCBpbmNyZWFzZXMgYnkgb25lIGZvciBlYWNoIGxldmVsLlxuICAgIC8vIENhcHBlZCBhdCAyNCBiZWNhdXNlIHRoYXQncyB0aGUgbWF4aW11bSBlbGV2YXRpb24gZGVmaW5lZCBpbiB0aGUgTWF0ZXJpYWwgZGVzaWduIHNwZWMuXG4gICAgY29uc3QgZWxldmF0aW9uID0gTWF0aC5taW4odGhpcy5fYmFzZUVsZXZhdGlvbiArIGRlcHRoLCAyNCk7XG4gICAgY29uc3QgbmV3RWxldmF0aW9uID0gYCR7dGhpcy5fZWxldmF0aW9uUHJlZml4fSR7ZWxldmF0aW9ufWA7XG4gICAgY29uc3QgY3VzdG9tRWxldmF0aW9uID0gT2JqZWN0LmtleXModGhpcy5fY2xhc3NMaXN0KS5maW5kKGNsYXNzTmFtZSA9PiB7XG4gICAgICByZXR1cm4gY2xhc3NOYW1lLnN0YXJ0c1dpdGgodGhpcy5fZWxldmF0aW9uUHJlZml4KTtcbiAgICB9KTtcblxuICAgIGlmICghY3VzdG9tRWxldmF0aW9uIHx8IGN1c3RvbUVsZXZhdGlvbiA9PT0gdGhpcy5fcHJldmlvdXNFbGV2YXRpb24pIHtcbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgICB0aGlzLl9jbGFzc0xpc3RbdGhpcy5fcHJldmlvdXNFbGV2YXRpb25dID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NsYXNzTGlzdFtuZXdFbGV2YXRpb25dID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uID0gbmV3RWxldmF0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGNsYXNzZXMgdG8gdGhlIG1lbnUgcGFuZWwgYmFzZWQgb24gaXRzIHBvc2l0aW9uLiBDYW4gYmUgdXNlZCBieVxuICAgKiBjb25zdW1lcnMgdG8gYWRkIHNwZWNpZmljIHN0eWxpbmcgYmFzZWQgb24gdGhlIHBvc2l0aW9uLlxuICAgKiBAcGFyYW0gcG9zWCBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0gcG9zWSBQb3NpdGlvbiBvZiB0aGUgbWVudSBhbG9uZyB0aGUgeSBheGlzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXRQb3NpdGlvbkNsYXNzZXMocG9zWDogTWVudVBvc2l0aW9uWCA9IHRoaXMueFBvc2l0aW9uLCBwb3NZOiBNZW51UG9zaXRpb25ZID0gdGhpcy55UG9zaXRpb24pIHtcbiAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5fY2xhc3NMaXN0O1xuICAgIGNsYXNzZXNbJ21hdC1tZW51LWJlZm9yZSddID0gcG9zWCA9PT0gJ2JlZm9yZSc7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYWZ0ZXInXSA9IHBvc1ggPT09ICdhZnRlcic7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYWJvdmUnXSA9IHBvc1kgPT09ICdhYm92ZSc7XG4gICAgY2xhc3Nlc1snbWF0LW1lbnUtYmVsb3cnXSA9IHBvc1kgPT09ICdiZWxvdyc7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZW50ZXIgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3Jlc2V0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgcGFuZWwgYW5pbWF0aW9uIHRvIGl0cyBpbml0aWFsIHN0YXRlLiAqL1xuICBfcmVzZXRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3N0YXJ0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIHBhbmVsIGFuaW1hdGlvbiBjb21wbGV0ZXMuICovXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5uZXh0KGV2ZW50KTtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgLy8gU2Nyb2xsIHRoZSBjb250ZW50IGVsZW1lbnQgdG8gdGhlIHRvcCBhcyBzb29uIGFzIHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGlzIGlzIG5lY2Vzc2FyeSxcbiAgICAvLyBiZWNhdXNlIHdlIG1vdmUgZm9jdXMgdG8gdGhlIGZpcnN0IGl0ZW0gd2hpbGUgaXQncyBzdGlsbCBiZWluZyBhbmltYXRlZCwgd2hpY2ggY2FuIHRocm93XG4gICAgLy8gdGhlIGJyb3dzZXIgb2ZmIHdoZW4gaXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIHBvc2l0aW9uLiBBbHRlcm5hdGl2ZWx5IHdlIGNhbiBtb3ZlIGZvY3VzXG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUsIGhvd2V2ZXIgbW92aW5nIGZvY3VzIGFzeW5jaHJvbm91c2x5IHdpbGwgaW50ZXJydXB0IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgd2hpY2ggYXJlIGluIHRoZSBwcm9jZXNzIG9mIHJlYWRpbmcgb3V0IHRoZSBtZW51IGFscmVhZHkuIFdlIHRha2UgdGhlIGBlbGVtZW50YFxuICAgIC8vIGZyb20gdGhlIGBldmVudGAgc2luY2Ugd2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgdG8gYWNjZXNzIHRoZSBwYW5lLlxuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSAwKSB7XG4gICAgICBldmVudC5lbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgYSBzdHJlYW0gdGhhdCB3aWxsIGtlZXAgdHJhY2sgb2YgYW55IG5ld2x5LWFkZGVkIG1lbnUgaXRlbXMgYW5kIHdpbGwgdXBkYXRlIHRoZSBsaXN0XG4gICAqIG9mIGRpcmVjdCBkZXNjZW5kYW50cy4gV2UgY29sbGVjdCB0aGUgZGVzY2VuZGFudHMgdGhpcyB3YXksIGJlY2F1c2UgYF9hbGxJdGVtc2AgY2FuIGluY2x1ZGVcbiAgICogaXRlbXMgdGhhdCBhcmUgcGFydCBvZiBjaGlsZCBtZW51cywgYW5kIHVzaW5nIGEgY3VzdG9tIHdheSBvZiByZWdpc3RlcmluZyBpdGVtcyBpcyB1bnJlbGlhYmxlXG4gICAqIHdoZW4gaXQgY29tZXMgdG8gbWFpbnRhaW5pbmcgdGhlIGl0ZW0gb3JkZXIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpIHtcbiAgICB0aGlzLl9hbGxJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsSXRlbXMpKVxuICAgICAgLnN1YnNjcmliZSgoaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4pID0+IHtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLnJlc2V0KGl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX3BhcmVudE1lbnUgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIGNsYXNzPVwibWF0LW1kYy1tZW51LXBhbmVsIG1hdC1tZGMtZWxldmF0aW9uLXNwZWNpZmljXCJcbiAgICBbaWRdPVwicGFuZWxJZFwiXG4gICAgW25nQ2xhc3NdPVwiX2NsYXNzTGlzdFwiXG4gICAgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiXG4gICAgKGNsaWNrKT1cImNsb3NlZC5lbWl0KCdjbGljaycpXCJcbiAgICBbQHRyYW5zZm9ybU1lbnVdPVwiX3BhbmVsQW5pbWF0aW9uU3RhdGVcIlxuICAgIChAdHJhbnNmb3JtTWVudS5zdGFydCk9XCJfb25BbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAoQHRyYW5zZm9ybU1lbnUuZG9uZSk9XCJfb25BbmltYXRpb25Eb25lKCRldmVudClcIlxuICAgIHRhYmluZGV4PVwiLTFcIlxuICAgIHJvbGU9XCJtZW51XCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkYnkgfHwgbnVsbFwiXG4gICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJhcmlhRGVzY3JpYmVkYnkgfHwgbnVsbFwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtbWRjLW1lbnUtY29udGVudFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=