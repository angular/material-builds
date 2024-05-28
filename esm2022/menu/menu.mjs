/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Output, TemplateRef, QueryList, ViewChild, ViewEncapsulation, ChangeDetectorRef, booleanAttribute, afterNextRender, inject, Injector, } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ESCAPE, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
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
    constructor(_elementRef, 
    /**
     * @deprecated Unused param, will be removed.
     * @breaking-change 19.0.0
     */
    _unusedNgZone, defaultOptions, 
    // @breaking-change 15.0.0 `_changeDetectorRef` to become a required parameter.
    _changeDetectorRef) {
        this._elementRef = _elementRef;
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
        this._injector = inject(Injector);
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
        this._firstItemFocusRef?.destroy();
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
        // Wait for `afterNextRender` to ensure iOS VoiceOver screen reader focuses the first item (#24735).
        this._firstItemFocusRef?.destroy();
        this._firstItemFocusRef = afterNextRender(() => {
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
        }, { injector: this._injector });
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatMenu, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MAT_MENU_DEFAULT_OPTIONS }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.0", type: MatMenu, isStandalone: true, selector: "mat-menu", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], xPosition: "xPosition", yPosition: "yPosition", overlapTrigger: ["overlapTrigger", "overlapTrigger", booleanAttribute], hasBackdrop: ["hasBackdrop", "hasBackdrop", (value) => (value == null ? null : booleanAttribute(value))], panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed", close: "close" }, host: { properties: { "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.aria-describedby": "null" } }, providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], queries: [{ propertyName: "lazyContent", first: true, predicate: MAT_MENU_CONTENT, descendants: true }, { propertyName: "_allItems", predicate: MatMenuItem, descendants: true }, { propertyName: "items", predicate: MatMenuItem }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["matMenu"], ngImport: i0, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-panel .mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"], animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mat-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, exportAs: 'matMenu', host: {
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.aria-describedby]': 'null',
                    }, animations: [matMenuAnimations.transformMenu, matMenuAnimations.fadeInItems], providers: [{ provide: MAT_MENU_PANEL, useExisting: MatMenu }], standalone: true, template: "<ng-template>\n  <div\n    class=\"mat-mdc-menu-panel mat-mdc-elevation-specific\"\n    [id]=\"panelId\"\n    [class]=\"_classList\"\n    (keydown)=\"_handleKeydown($event)\"\n    (click)=\"closed.emit('click')\"\n    [@transformMenu]=\"_panelAnimationState\"\n    (@transformMenu.start)=\"_onAnimationStart($event)\"\n    (@transformMenu.done)=\"_onAnimationDone($event)\"\n    tabindex=\"-1\"\n    role=\"menu\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"ariaLabelledby || null\"\n    [attr.aria-describedby]=\"ariaDescribedby || null\">\n    <div class=\"mat-mdc-menu-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: ["mat-menu{display:none}.mat-mdc-menu-content{margin:0;padding:8px 0;list-style-type:none}.mat-mdc-menu-content:focus{outline:none}.mat-mdc-menu-content,.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;flex:1;white-space:normal;font-family:var(--mat-menu-item-label-text-font);line-height:var(--mat-menu-item-label-text-line-height);font-size:var(--mat-menu-item-label-text-size);letter-spacing:var(--mat-menu-item-label-text-tracking);font-weight:var(--mat-menu-item-label-text-weight)}.mat-mdc-menu-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;outline:0;border-radius:var(--mat-menu-container-shape);background-color:var(--mat-menu-container-color);will-change:transform,opacity}.mat-mdc-menu-panel.ng-animating{pointer-events:none}.cdk-high-contrast-active .mat-mdc-menu-panel{outline:solid 1px}.mat-mdc-menu-panel .mat-divider{color:var(--mat-menu-divider-color);margin-bottom:var(--mat-menu-divider-bottom-spacing);margin-top:var(--mat-menu-divider-top-spacing)}.mat-mdc-menu-item{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mat-menu-item-leading-spacing);padding-right:var(--mat-menu-item-trailing-spacing);-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;width:100%;text-align:left;box-sizing:border-box;color:inherit;font-size:inherit;background:none;text-decoration:none;margin:0;align-items:center;min-height:48px}.mat-mdc-menu-item:focus{outline:none}[dir=rtl] .mat-mdc-menu-item,.mat-mdc-menu-item[dir=rtl]{padding-left:var(--mat-menu-item-trailing-spacing);padding-right:var(--mat-menu-item-leading-spacing)}.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]){padding-left:var(--mat-menu-item-with-icon-leading-spacing);padding-right:var(--mat-menu-item-with-icon-trailing-spacing)}[dir=rtl] .mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon]),.mat-mdc-menu-item:has(.material-icons,mat-icon,[matButtonIcon])[dir=rtl]{padding-left:var(--mat-menu-item-with-icon-trailing-spacing);padding-right:var(--mat-menu-item-with-icon-leading-spacing)}.mat-mdc-menu-item::-moz-focus-inner{border:0}.mat-mdc-menu-item,.mat-mdc-menu-item:visited,.mat-mdc-menu-item:link{color:var(--mat-menu-item-label-text-color)}.mat-mdc-menu-item .mat-icon-no-color,.mat-mdc-menu-item .mat-mdc-menu-submenu-icon{color:var(--mat-menu-item-icon-color)}.mat-mdc-menu-item[disabled]{cursor:default;opacity:.38}.mat-mdc-menu-item[disabled]::after{display:block;position:absolute;content:\"\";top:0;left:0;bottom:0;right:0}.mat-mdc-menu-item .mat-icon{flex-shrink:0;margin-right:var(--mat-menu-item-spacing);height:var(--mat-menu-item-icon-size);width:var(--mat-menu-item-icon-size)}[dir=rtl] .mat-mdc-menu-item{text-align:right}[dir=rtl] .mat-mdc-menu-item .mat-icon{margin-right:0;margin-left:var(--mat-menu-item-spacing)}.mat-mdc-menu-item:not([disabled]):hover{background-color:var(--mat-menu-item-hover-state-layer-color)}.mat-mdc-menu-item:not([disabled]).cdk-program-focused,.mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused,.mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted{background-color:var(--mat-menu-item-focus-state-layer-color)}.cdk-high-contrast-active .mat-mdc-menu-item{margin-top:1px}.mat-mdc-menu-submenu-icon{width:var(--mat-menu-item-icon-size);height:10px;fill:currentColor;padding-left:var(--mat-menu-item-spacing)}[dir=rtl] .mat-mdc-menu-submenu-icon{padding-right:var(--mat-menu-item-spacing);padding-left:0}[dir=rtl] .mat-mdc-menu-submenu-icon polygon{transform:scaleX(-1)}.cdk-high-contrast-active .mat-mdc-menu-submenu-icon{fill:CanvasText}.mat-mdc-menu-item .mat-mdc-menu-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9tZW51L21lbnUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbWVudS9tZW51Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBRWpCLGlCQUFpQixFQUNqQixnQkFBZ0IsRUFDaEIsZUFBZSxFQUVmLE1BQU0sRUFDTixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGVBQWUsRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE9BQU8sRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsR0FDZixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQWUsY0FBYyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTFELE9BQU8sRUFBQyw0QkFBNEIsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0FBRXBELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQTBCckIsaUZBQWlGO0FBQ2pGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUN4RCwwQkFBMEIsRUFDMUI7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsZ0NBQWdDO0NBQzFDLENBQ0YsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsZ0NBQWdDO0lBQzlDLE9BQU87UUFDTCxjQUFjLEVBQUUsS0FBSztRQUNyQixTQUFTLEVBQUUsT0FBTztRQUNsQixTQUFTLEVBQUUsT0FBTztRQUNsQixhQUFhLEVBQUUsa0NBQWtDO0tBQ2xELENBQUM7QUFDSixDQUFDO0FBa0JELE1BQU0sT0FBTyxPQUFPO0lBZ0RsQiwwQ0FBMEM7SUFDMUMsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxLQUFvQjtRQUNoQyxJQUNFLEtBQUssS0FBSyxRQUFRO1lBQ2xCLEtBQUssS0FBSyxPQUFPO1lBQ2pCLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUMvQyxDQUFDO1lBQ0QsNEJBQTRCLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELDBDQUEwQztJQUMxQyxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEtBQW9CO1FBQ2hDLElBQUksS0FBSyxLQUFLLE9BQU8sSUFBSSxLQUFLLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUM7WUFDOUYsNEJBQTRCLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQXlCRDs7Ozs7T0FLRztJQUNILElBQ0ksVUFBVSxDQUFDLE9BQWU7UUFDNUIsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDcEQsTUFBTSxZQUFZLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQztRQUUxQyxJQUFJLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BELGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFpQixFQUFFLEVBQUU7Z0JBQzFELFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQztRQUVuQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFpQixFQUFFLEVBQUU7Z0JBQy9DLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2hELENBQUM7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQztJQUNqQyxDQUFDO0lBR0Q7Ozs7OztPQU1HO0lBQ0gsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxPQUFlO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFrQ0QsWUFDVSxXQUFvQztJQUM1Qzs7O09BR0c7SUFDSCxhQUFxQixFQUNhLGNBQXFDO0lBQ3ZFLCtFQUErRTtJQUN2RSxrQkFBc0M7UUFSdEMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBUXBDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUF0THhDLHFCQUFnQixHQUFHLGlCQUFpQixDQUFDO1FBQ3JDLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBSzNCLDZDQUE2QztRQUM3QywyQkFBc0IsR0FBRyxJQUFJLFNBQVMsRUFBZSxDQUFDO1FBRXRELCtDQUErQztRQUMvQyxlQUFVLEdBQTZCLEVBQUUsQ0FBQztRQUUxQyw0Q0FBNEM7UUFDNUMseUJBQW9CLEdBQXFCLE1BQU0sQ0FBQztRQUVoRCx5REFBeUQ7UUFDaEQsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQTZIeEQsNkNBQTZDO1FBQzFCLFdBQU0sR0FBa0MsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFL0Y7Ozs7V0FJRztRQUNnQixVQUFLLEdBQWtDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFN0QsWUFBTyxHQUFHLGtCQUFrQixZQUFZLEVBQUUsRUFBRSxDQUFDO1FBRTlDLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUErQm5DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztRQUMzQyxJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2FBQ2hFLFFBQVEsRUFBRTthQUNWLGFBQWEsRUFBRTthQUNmLGNBQWMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRWpFLDJGQUEyRjtRQUMzRiwrRkFBK0Y7UUFDL0YsNkRBQTZEO1FBQzdELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPO2FBQ2hDLElBQUksQ0FDSCxTQUFTLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQ3RDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUM5RTthQUNBLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsV0FBMEIsQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFpQyxFQUFFLEVBQUU7WUFDbEYsMkVBQTJFO1lBQzNFLDRFQUE0RTtZQUM1RSx1QkFBdUI7WUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUVqQyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDO2dCQUM3RSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVwRixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDM0MsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsQ0FBQztxQkFBTSxDQUFDO29CQUNOLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUM5QixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLFFBQVE7UUFDTiw4RUFBOEU7UUFDOUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQTZDLENBQUM7UUFDOUYsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUNyQixTQUFTLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQ3RDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNuRCxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE9BQU8sQ0FBQyxLQUFrQixJQUFHLENBQUM7SUFFOUI7Ozs7O09BS0c7SUFDSCxVQUFVLENBQUMsS0FBa0IsSUFBRyxDQUFDO0lBRWpDLG1GQUFtRjtJQUNuRixjQUFjLENBQUMsS0FBb0I7UUFDakMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRWpDLFFBQVEsT0FBTyxFQUFFLENBQUM7WUFDaEIsS0FBSyxNQUFNO2dCQUNULElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDM0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNO1lBQ1IsS0FBSyxVQUFVO2dCQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRSxDQUFDO29CQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNO1lBQ1IsS0FBSyxXQUFXO2dCQUNkLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRSxDQUFDO29CQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztvQkFDbkQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFFRCxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixPQUFPO1FBQ1gsQ0FBQztRQUVELDRFQUE0RTtRQUM1RSx3RUFBd0U7UUFDeEUsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsU0FBc0IsU0FBUztRQUM1QyxvR0FBb0c7UUFDcEcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxlQUFlLENBQ3ZDLEdBQUcsRUFBRTtZQUNILElBQUksU0FBUyxHQUF1QixJQUFJLENBQUM7WUFFekMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3ZDLDhGQUE4RjtnQkFDOUYsOEZBQThGO2dCQUM5RiwwRkFBMEY7Z0JBQzFGLG9DQUFvQztnQkFDcEMsU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVGLENBQUM7WUFFRCw4RUFBOEU7WUFDOUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7Z0JBQzlELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ2pDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFFcEQscUZBQXFGO2dCQUNyRiw4RkFBOEY7Z0JBQzlGLDBDQUEwQztnQkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksU0FBUyxFQUFFLENBQUM7b0JBQ3JDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDLEVBQ0QsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUMzQixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWU7UUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxZQUFZLENBQUMsS0FBYTtRQUN4Qix3RUFBd0U7UUFDeEUseUZBQXlGO1FBQ3pGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUQsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxFQUFFLENBQUM7UUFDNUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3BFLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLElBQUksZUFBZSxLQUFLLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ3BFLE1BQU0sWUFBWSxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUM7WUFFMUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNoRCxDQUFDO1lBRUQsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsWUFBWSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsa0JBQWtCLENBQUMsT0FBc0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFzQixJQUFJLENBQUMsU0FBUztRQUMzRixJQUFJLENBQUMsVUFBVSxHQUFHO1lBQ2hCLEdBQUcsSUFBSSxDQUFDLFVBQVU7WUFDbEIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksS0FBSyxRQUFRO1lBQ3RDLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEtBQUssT0FBTztZQUNwQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxLQUFLLE9BQU87WUFDcEMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksS0FBSyxPQUFPO1NBQ3JDLENBQUM7UUFFRixzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsZUFBZTtRQUNiLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsZUFBZTtRQUNiLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsZ0JBQWdCLENBQUMsS0FBcUI7UUFDcEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDNUIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQXFCO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXpCLDRGQUE0RjtRQUM1RiwyRkFBMkY7UUFDM0YsMEZBQTBGO1FBQzFGLHdGQUF3RjtRQUN4RiwwRkFBMEY7UUFDMUYsd0VBQXdFO1FBQ3hFLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDeEUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyx3QkFBd0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPO2FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQy9CLFNBQVMsQ0FBQyxDQUFDLEtBQTZCLEVBQUUsRUFBRTtZQUMzQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs4R0EzYlUsT0FBTyxrRUEwTFIsd0JBQXdCO2tHQTFMdkIsT0FBTyxvVkErRkMsZ0JBQWdCLCtDQUdoQixDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLGtQQXJHeEUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBQyxDQUFDLG1FQStGOUMsZ0JBQWdCLCtEQWxGYixXQUFXLDJEQTRFWCxXQUFXLDBFQVBqQixXQUFXLHVFQ2xNeEIsZ3JCQW9CQSx5MkhEMkZjLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFdBQVcsQ0FBQzs7MkZBSWpFLE9BQU87a0JBaEJuQixTQUFTOytCQUNFLFVBQVUsbUJBR0gsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxZQUMzQixTQUFTLFFBQ2I7d0JBQ0osbUJBQW1CLEVBQUUsTUFBTTt3QkFDM0Isd0JBQXdCLEVBQUUsTUFBTTt3QkFDaEMseUJBQXlCLEVBQUUsTUFBTTtxQkFDbEMsY0FDVyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsYUFDakUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxTQUFTLEVBQUMsQ0FBQyxjQUNoRCxJQUFJOzswQkE0TGIsTUFBTTsyQkFBQyx3QkFBd0I7eUVBaExpQixTQUFTO3NCQUEzRCxlQUFlO3VCQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBMkJ4QyxhQUFhO3NCQUFyQixLQUFLO2dCQUdlLFNBQVM7c0JBQTdCLEtBQUs7dUJBQUMsWUFBWTtnQkFHTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFHRyxlQUFlO3NCQUF6QyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFJckIsU0FBUztzQkFEWixLQUFLO2dCQWtCRixTQUFTO3NCQURaLEtBQUs7Z0JBYWtCLFdBQVc7c0JBQWxDLFNBQVM7dUJBQUMsV0FBVztnQkFPOEIsS0FBSztzQkFBeEQsZUFBZTt1QkFBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFDO2dCQU1sQixXQUFXO3NCQUExQyxZQUFZO3VCQUFDLGdCQUFnQjtnQkFHUSxjQUFjO3NCQUFuRCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQUlwQyxXQUFXO3NCQURWLEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO2dCQVVoRixVQUFVO3NCQURiLEtBQUs7dUJBQUMsT0FBTztnQkFpQ1YsU0FBUztzQkFEWixLQUFLO2dCQVNhLE1BQU07c0JBQXhCLE1BQU07Z0JBT1ksS0FBSztzQkFBdkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWYsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25Jbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgYWZ0ZXJOZXh0UmVuZGVyLFxuICBBZnRlclJlbmRlclJlZixcbiAgaW5qZWN0LFxuICBJbmplY3Rvcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEVTQ0FQRSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIERPV05fQVJST1csXG4gIFVQX0FSUk9XLFxuICBoYXNNb2RpZmllcktleSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRNZW51SXRlbX0gZnJvbSAnLi9tZW51LWl0ZW0nO1xuaW1wb3J0IHtNYXRNZW51UGFuZWwsIE1BVF9NRU5VX1BBTkVMfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuaW1wb3J0IHtNZW51UG9zaXRpb25YLCBNZW51UG9zaXRpb25ZfSBmcm9tICcuL21lbnUtcG9zaXRpb25zJztcbmltcG9ydCB7dGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWCwgdGhyb3dNYXRNZW51SW52YWxpZFBvc2l0aW9uWX0gZnJvbSAnLi9tZW51LWVycm9ycyc7XG5pbXBvcnQge01hdE1lbnVDb250ZW50LCBNQVRfTUVOVV9DT05URU5UfSBmcm9tICcuL21lbnUtY29udGVudCc7XG5pbXBvcnQge21hdE1lbnVBbmltYXRpb25zfSBmcm9tICcuL21lbnUtYW5pbWF0aW9ucyc7XG5cbmxldCBtZW51UGFuZWxVaWQgPSAwO1xuXG4vKiogUmVhc29uIHdoeSB0aGUgbWVudSB3YXMgY2xvc2VkLiAqL1xuZXhwb3J0IHR5cGUgTWVudUNsb3NlUmVhc29uID0gdm9pZCB8ICdjbGljaycgfCAna2V5ZG93bicgfCAndGFiJztcblxuLyoqIERlZmF1bHQgYG1hdC1tZW51YCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBUaGUgeC1heGlzIHBvc2l0aW9uIG9mIHRoZSBtZW51LiAqL1xuICB4UG9zaXRpb246IE1lbnVQb3NpdGlvblg7XG5cbiAgLyoqIFRoZSB5LWF4aXMgcG9zaXRpb24gb2YgdGhlIG1lbnUuICovXG4gIHlQb3NpdGlvbjogTWVudVBvc2l0aW9uWTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCB0aGUgbWVudSB0cmlnZ2VyLiAqL1xuICBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogQ2xhc3MgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIGJhY2tkcm9wLiAqL1xuICBiYWNrZHJvcENsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1tZW51YC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTUVOVV9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TWVudURlZmF1bHRPcHRpb25zPihcbiAgJ21hdC1tZW51LWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX01FTlVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgb3ZlcmxhcFRyaWdnZXI6IGZhbHNlLFxuICAgIHhQb3NpdGlvbjogJ2FmdGVyJyxcbiAgICB5UG9zaXRpb246ICdiZWxvdycsXG4gICAgYmFja2Ryb3BDbGFzczogJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgfTtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUuaHRtbCcsXG4gIHN0eWxlVXJsOiAnbWVudS5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRNZW51JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnbnVsbCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRNZW51QW5pbWF0aW9ucy50cmFuc2Zvcm1NZW51LCBtYXRNZW51QW5pbWF0aW9ucy5mYWRlSW5JdGVtc10sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfTUVOVV9QQU5FTCwgdXNlRXhpc3Rpbmc6IE1hdE1lbnV9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE1hdE1lbnVQYW5lbDxNYXRNZW51SXRlbT4sIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdE1lbnVJdGVtPjtcbiAgcHJpdmF0ZSBfeFBvc2l0aW9uOiBNZW51UG9zaXRpb25YO1xuICBwcml2YXRlIF95UG9zaXRpb246IE1lbnVQb3NpdGlvblk7XG4gIHByaXZhdGUgX2ZpcnN0SXRlbUZvY3VzUmVmPzogQWZ0ZXJSZW5kZXJSZWY7XG4gIHByaXZhdGUgX3ByZXZpb3VzRWxldmF0aW9uOiBzdHJpbmc7XG4gIHByaXZhdGUgX2VsZXZhdGlvblByZWZpeCA9ICdtYXQtZWxldmF0aW9uLXonO1xuICBwcml2YXRlIF9iYXNlRWxldmF0aW9uID0gODtcblxuICAvKiogQWxsIGl0ZW1zIGluc2lkZSB0aGUgbWVudS4gSW5jbHVkZXMgaXRlbXMgbmVzdGVkIGluc2lkZSBhbm90aGVyIG1lbnUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TWVudUl0ZW0sIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9hbGxJdGVtczogUXVlcnlMaXN0PE1hdE1lbnVJdGVtPjtcblxuICAvKiogT25seSB0aGUgZGlyZWN0IGRlc2NlbmRhbnQgbWVudSBpdGVtcy4gKi9cbiAgX2RpcmVjdERlc2NlbmRhbnRJdGVtcyA9IG5ldyBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSBwYW5lbC4gKi9cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIHBhbmVsIGFuaW1hdGlvbi4gKi9cbiAgX3BhbmVsQW5pbWF0aW9uU3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgPSAndm9pZCc7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIGFuIGFuaW1hdGlvbiBvbiB0aGUgbWVudSBjb21wbGV0ZXMuICovXG4gIHJlYWRvbmx5IF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXMgYW5pbWF0aW5nLiAqL1xuICBfaXNBbmltYXRpbmc6IGJvb2xlYW47XG5cbiAgLyoqIFBhcmVudCBtZW51IG9mIHRoZSBjdXJyZW50IG1lbnUgcGFuZWwuICovXG4gIHBhcmVudE1lbnU6IE1hdE1lbnVQYW5lbCB8IHVuZGVmaW5lZDtcblxuICAvKiogTGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgbWVudS4gKi9cbiAgZGlyZWN0aW9uOiBEaXJlY3Rpb247XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhZGRlZCB0byB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKiBDbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3AgZWxlbWVudC4gKi9cbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWxhYmVsIGZvciB0aGUgbWVudSBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIGFyaWEtbGFiZWxsZWRieSBmb3IgdGhlIG1lbnUgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogYXJpYS1kZXNjcmliZWRieSBmb3IgdGhlIG1lbnUgcGFuZWwuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgbWVudSBpbiB0aGUgWCBheGlzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgeFBvc2l0aW9uKCk6IE1lbnVQb3NpdGlvblgge1xuICAgIHJldHVybiB0aGlzLl94UG9zaXRpb247XG4gIH1cbiAgc2V0IHhQb3NpdGlvbih2YWx1ZTogTWVudVBvc2l0aW9uWCkge1xuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSAnYmVmb3JlJyAmJlxuICAgICAgdmFsdWUgIT09ICdhZnRlcicgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgKSB7XG4gICAgICB0aHJvd01hdE1lbnVJbnZhbGlkUG9zaXRpb25YKCk7XG4gICAgfVxuICAgIHRoaXMuX3hQb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogUG9zaXRpb24gb2YgdGhlIG1lbnUgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHlQb3NpdGlvbigpOiBNZW51UG9zaXRpb25ZIHtcbiAgICByZXR1cm4gdGhpcy5feVBvc2l0aW9uO1xuICB9XG4gIHNldCB5UG9zaXRpb24odmFsdWU6IE1lbnVQb3NpdGlvblkpIHtcbiAgICBpZiAodmFsdWUgIT09ICdhYm92ZScgJiYgdmFsdWUgIT09ICdiZWxvdycgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93TWF0TWVudUludmFsaWRQb3NpdGlvblkoKTtcbiAgICB9XG4gICAgdGhpcy5feVBvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHRoZSBpdGVtcyBpbnNpZGUgb2YgYSBtZW51LlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE1lbnVJdGVtLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT47XG5cbiAgLyoqXG4gICAqIE1lbnUgY29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAQ29udGVudENoaWxkKE1BVF9NRU5VX0NPTlRFTlQpIGxhenlDb250ZW50OiBNYXRNZW51Q29udGVudDtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBzaG91bGQgb3ZlcmxhcCBpdHMgdHJpZ2dlci4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSBvdmVybGFwVHJpZ2dlcjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgbWVudSBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06ICh2YWx1ZTogYW55KSA9PiAodmFsdWUgPT0gbnVsbCA/IG51bGwgOiBib29sZWFuQXR0cmlidXRlKHZhbHVlKSl9KVxuICBoYXNCYWNrZHJvcD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1tZW51IGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSBvbiB0aGVcbiAgICogbWVudSB0ZW1wbGF0ZSB0aGF0IGRpc3BsYXlzIGluIHRoZSBvdmVybGF5IGNvbnRhaW5lci4gIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgbWVudSBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNsYXNzZXMgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBwYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZykge1xuICAgIGNvbnN0IHByZXZpb3VzUGFuZWxDbGFzcyA9IHRoaXMuX3ByZXZpb3VzUGFuZWxDbGFzcztcbiAgICBjb25zdCBuZXdDbGFzc0xpc3QgPSB7Li4udGhpcy5fY2xhc3NMaXN0fTtcblxuICAgIGlmIChwcmV2aW91c1BhbmVsQ2xhc3MgJiYgcHJldmlvdXNQYW5lbENsYXNzLmxlbmd0aCkge1xuICAgICAgcHJldmlvdXNQYW5lbENsYXNzLnNwbGl0KCcgJykuZm9yRWFjaCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgbmV3Q2xhc3NMaXN0W2NsYXNzTmFtZV0gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX3ByZXZpb3VzUGFuZWxDbGFzcyA9IGNsYXNzZXM7XG5cbiAgICBpZiAoY2xhc3NlcyAmJiBjbGFzc2VzLmxlbmd0aCkge1xuICAgICAgY2xhc3Nlcy5zcGxpdCgnICcpLmZvckVhY2goKGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIG5ld0NsYXNzTGlzdFtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gICAgfVxuXG4gICAgdGhpcy5fY2xhc3NMaXN0ID0gbmV3Q2xhc3NMaXN0O1xuICB9XG4gIHByaXZhdGUgX3ByZXZpb3VzUGFuZWxDbGFzczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtbWVudSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIG1lbnUgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuICBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIG1lbnUgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgcGFuZWxDbGFzc2AgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGNsYXNzTGlzdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhbmVsQ2xhc3M7XG4gIH1cbiAgc2V0IGNsYXNzTGlzdChjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhbmVsQ2xhc3MgPSBjbGFzc2VzO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWQ6IEV2ZW50RW1pdHRlcjxNZW51Q2xvc2VSZWFzb24+ID0gbmV3IEV2ZW50RW1pdHRlcjxNZW51Q2xvc2VSZWFzb24+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgbWVudSBpcyBjbG9zZWQuXG4gICAqIEBkZXByZWNhdGVkIFN3aXRjaCB0byBgY2xvc2VkYCBpbnN0ZWFkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZTogRXZlbnRFbWl0dGVyPE1lbnVDbG9zZVJlYXNvbj4gPSB0aGlzLmNsb3NlZDtcblxuICByZWFkb25seSBwYW5lbElkID0gYG1hdC1tZW51LXBhbmVsLSR7bWVudVBhbmVsVWlkKyt9YDtcblxuICBwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBfY2hhbmdlRGV0ZWN0b3JSZWZgIHRvIGJlY29tZSBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxNS4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIGRlZmF1bHRPcHRpb25zOiBNYXRNZW51RGVmYXVsdE9wdGlvbnMsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBVbnVzZWQgcGFyYW0sIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE5LjAuMFxuICAgICAqL1xuICAgIF91bnVzZWROZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KE1BVF9NRU5VX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdE9wdGlvbnM6IE1hdE1lbnVEZWZhdWx0T3B0aW9ucyxcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMCBgX2NoYW5nZURldGVjdG9yUmVmYCB0byBiZWNvbWUgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY/OiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7XG4gICAgdGhpcy5vdmVybGF5UGFuZWxDbGFzcyA9IGRlZmF1bHRPcHRpb25zLm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuICAgIHRoaXMuX3hQb3NpdGlvbiA9IGRlZmF1bHRPcHRpb25zLnhQb3NpdGlvbjtcbiAgICB0aGlzLl95UG9zaXRpb24gPSBkZWZhdWx0T3B0aW9ucy55UG9zaXRpb247XG4gICAgdGhpcy5iYWNrZHJvcENsYXNzID0gZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3BDbGFzcztcbiAgICB0aGlzLm92ZXJsYXBUcmlnZ2VyID0gZGVmYXVsdE9wdGlvbnMub3ZlcmxhcFRyaWdnZXI7XG4gICAgdGhpcy5oYXNCYWNrZHJvcCA9IGRlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpO1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAud2l0aFR5cGVBaGVhZCgpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZWQuZW1pdCgndGFiJykpO1xuXG4gICAgLy8gSWYgYSB1c2VyIG1hbnVhbGx5IChwcm9ncmFtbWF0aWNhbGx5KSBmb2N1c2VzIGEgbWVudSBpdGVtLCB3ZSBuZWVkIHRvIHJlZmxlY3QgdGhhdCBmb2N1c1xuICAgIC8vIGNoYW5nZSBiYWNrIHRvIHRoZSBrZXkgbWFuYWdlci4gTm90ZSB0aGF0IHdlIGRvbid0IG5lZWQgdG8gdW5zdWJzY3JpYmUgaGVyZSBiZWNhdXNlIF9mb2N1c2VkXG4gICAgLy8gaXMgaW50ZXJuYWwgYW5kIHdlIGtub3cgdGhhdCBpdCBnZXRzIGNvbXBsZXRlZCBvbiBkZXN0cm95LlxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcyksXG4gICAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9mb2N1c2VkKSkpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShmb2N1c2VkSXRlbSA9PiB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oZm9jdXNlZEl0ZW0gYXMgTWF0TWVudUl0ZW0pKTtcblxuICAgIHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzLnN1YnNjcmliZSgoaXRlbXNMaXN0OiBRdWVyeUxpc3Q8TWF0TWVudUl0ZW0+KSA9PiB7XG4gICAgICAvLyBNb3ZlIGZvY3VzIHRvIGFub3RoZXIgaXRlbSwgaWYgdGhlIGFjdGl2ZSBpdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgbGlzdC5cbiAgICAgIC8vIFdlIG5lZWQgdG8gZGVib3VuY2UgdGhlIGNhbGxiYWNrLCBiZWNhdXNlIG11bHRpcGxlIGl0ZW1zIG1pZ2h0IGJlIHJlbW92ZWRcbiAgICAgIC8vIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgICAgaWYgKHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPT09ICdlbnRlcicgJiYgbWFuYWdlci5hY3RpdmVJdGVtPy5faGFzRm9jdXMoKSkge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGl0ZW1zTGlzdC50b0FycmF5KCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oaXRlbXMubGVuZ3RoIC0gMSwgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMCkpO1xuXG4gICAgICAgIGlmIChpdGVtc1tpbmRleF0gJiYgIWl0ZW1zW2luZGV4XS5kaXNhYmxlZCkge1xuICAgICAgICAgIG1hbmFnZXIuc2V0QWN0aXZlSXRlbShpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFuYWdlci5zZXROZXh0SXRlbUFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmRlc3Ryb3koKTtcbiAgICB0aGlzLmNsb3NlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZpcnN0SXRlbUZvY3VzUmVmPy5kZXN0cm95KCk7XG4gIH1cblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGhvdmVyZWQgbWVudSBpdGVtIGNoYW5nZXMuICovXG4gIF9ob3ZlcmVkKCk6IE9ic2VydmFibGU8TWF0TWVudUl0ZW0+IHtcbiAgICAvLyBDb2VyY2UgdGhlIGBjaGFuZ2VzYCBwcm9wZXJ0eSBiZWNhdXNlIEFuZ3VsYXIgdHlwZXMgaXQgYXMgYE9ic2VydmFibGU8YW55PmBcbiAgICBjb25zdCBpdGVtQ2hhbmdlcyA9IHRoaXMuX2RpcmVjdERlc2NlbmRhbnRJdGVtcy5jaGFuZ2VzIGFzIE9ic2VydmFibGU8UXVlcnlMaXN0PE1hdE1lbnVJdGVtPj47XG4gICAgcmV0dXJuIGl0ZW1DaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zKSxcbiAgICAgIHN3aXRjaE1hcChpdGVtcyA9PiBtZXJnZSguLi5pdGVtcy5tYXAoKGl0ZW06IE1hdE1lbnVJdGVtKSA9PiBpdGVtLl9ob3ZlcmVkKSkpLFxuICAgICkgYXMgT2JzZXJ2YWJsZTxNYXRNZW51SXRlbT47XG4gIH1cblxuICAvKlxuICAgKiBSZWdpc3RlcnMgYSBtZW51IGl0ZW0gd2l0aCB0aGUgbWVudS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgKi9cbiAgYWRkSXRlbShfaXRlbTogTWF0TWVudUl0ZW0pIHt9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBtZW51LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAqL1xuICByZW1vdmVJdGVtKF9pdGVtOiBNYXRNZW51SXRlbSkge31cblxuICAvKiogSGFuZGxlIGEga2V5Ym9hcmQgZXZlbnQgZnJvbSB0aGUgbWVudSwgZGVsZWdhdGluZyB0byB0aGUgYXBwcm9wcmlhdGUgYWN0aW9uLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgaWYgKHRoaXMucGFyZW50TWVudSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ2x0cicpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlZC5lbWl0KCdrZXlkb3duJyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICBpZiAodGhpcy5wYXJlbnRNZW51ICYmIHRoaXMuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoJ2tleWRvd24nKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbigna2V5Ym9hcmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERvbid0IGFsbG93IHRoZSBldmVudCB0byBwcm9wYWdhdGUgaWYgd2UndmUgYWxyZWFkeSBoYW5kbGVkIGl0LCBvciBpdCBtYXlcbiAgICAvLyBlbmQgdXAgcmVhY2hpbmcgb3RoZXIgb3ZlcmxheXMgdGhhdCB3ZXJlIG9wZW5lZCBlYXJsaWVyIChzZWUgIzIyNjk0KS5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1cyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgbWVudS5cbiAgICogQHBhcmFtIG9yaWdpbiBBY3Rpb24gZnJvbSB3aGljaCB0aGUgZm9jdXMgb3JpZ2luYXRlZC4gVXNlZCB0byBzZXQgdGhlIGNvcnJlY3Qgc3R5bGluZy5cbiAgICovXG4gIGZvY3VzRmlyc3RJdGVtKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScpOiB2b2lkIHtcbiAgICAvLyBXYWl0IGZvciBgYWZ0ZXJOZXh0UmVuZGVyYCB0byBlbnN1cmUgaU9TIFZvaWNlT3ZlciBzY3JlZW4gcmVhZGVyIGZvY3VzZXMgdGhlIGZpcnN0IGl0ZW0gKCMyNDczNSkuXG4gICAgdGhpcy5fZmlyc3RJdGVtRm9jdXNSZWY/LmRlc3Ryb3koKTtcbiAgICB0aGlzLl9maXJzdEl0ZW1Gb2N1c1JlZiA9IGFmdGVyTmV4dFJlbmRlcihcbiAgICAgICgpID0+IHtcbiAgICAgICAgbGV0IG1lbnVQYW5lbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIC8vIEJlY2F1c2UgdGhlIGBtYXQtbWVudVBhbmVsYCBpcyBhdCB0aGUgRE9NIGluc2VydGlvbiBwb2ludCwgbm90IGluc2lkZSB0aGUgb3ZlcmxheSwgd2UgZG9uJ3RcbiAgICAgICAgICAvLyBoYXZlIGEgbmljZSB3YXkgb2YgZ2V0dGluZyBhIGhvbGQgb2YgdGhlIG1lbnVQYW5lbCBwYW5lbC4gV2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgZWl0aGVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGUgcGFuZWwgaXMgaW5zaWRlIGFuIGBuZy10ZW1wbGF0ZWAuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IHN0YXJ0aW5nIGZyb20gb25lIG9mXG4gICAgICAgICAgLy8gdGhlIGl0ZW1zIGFuZCB3YWxraW5nIHVwIHRoZSBET00uXG4gICAgICAgICAgbWVudVBhbmVsID0gdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLmZpcnN0IS5fZ2V0SG9zdEVsZW1lbnQoKS5jbG9zZXN0KCdbcm9sZT1cIm1lbnVcIl0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGFuIGl0ZW0gaW4gdGhlIG1lbnVQYW5lbCBpcyBhbHJlYWR5IGZvY3VzZWQsIGF2b2lkIG92ZXJyaWRpbmcgdGhlIGZvY3VzLlxuICAgICAgICBpZiAoIW1lbnVQYW5lbCB8fCAhbWVudVBhbmVsLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG4gICAgICAgICAgbWFuYWdlci5zZXRGb2N1c09yaWdpbihvcmlnaW4pLnNldEZpcnN0SXRlbUFjdGl2ZSgpO1xuXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhY3RpdmUgaXRlbSBhdCB0aGlzIHBvaW50LCBpdCBtZWFucyB0aGF0IGFsbCB0aGUgaXRlbXMgYXJlIGRpc2FibGVkLlxuICAgICAgICAgIC8vIE1vdmUgZm9jdXMgdG8gdGhlIG1lbnVQYW5lbCBwYW5lbCBzbyBrZXlib2FyZCBldmVudHMgbGlrZSBFc2NhcGUgc3RpbGwgd29yay4gQWxzbyB0aGlzIHdpbGxcbiAgICAgICAgICAvLyBnaXZlIF9zb21lXyBmZWVkYmFjayB0byBzY3JlZW4gcmVhZGVycy5cbiAgICAgICAgICBpZiAoIW1hbmFnZXIuYWN0aXZlSXRlbSAmJiBtZW51UGFuZWwpIHtcbiAgICAgICAgICAgIG1lbnVQYW5lbC5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtpbmplY3RvcjogdGhpcy5faW5qZWN0b3J9LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBhY3RpdmUgaXRlbSBpbiB0aGUgbWVudS4gVGhpcyBpcyB1c2VkIHdoZW4gdGhlIG1lbnUgaXMgb3BlbmVkLCBhbGxvd2luZ1xuICAgKiB0aGUgdXNlciB0byBzdGFydCBmcm9tIHRoZSBmaXJzdCBvcHRpb24gd2hlbiBwcmVzc2luZyB0aGUgZG93biBhcnJvdy5cbiAgICovXG4gIHJlc2V0QWN0aXZlSXRlbSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oLTEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1lbnUgcGFuZWwgZWxldmF0aW9uLlxuICAgKiBAcGFyYW0gZGVwdGggTnVtYmVyIG9mIHBhcmVudCBtZW51cyB0aGF0IGNvbWUgYmVmb3JlIHRoZSBtZW51LlxuICAgKi9cbiAgc2V0RWxldmF0aW9uKGRlcHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBUaGUgZWxldmF0aW9uIHN0YXJ0cyBhdCB0aGUgYmFzZSBhbmQgaW5jcmVhc2VzIGJ5IG9uZSBmb3IgZWFjaCBsZXZlbC5cbiAgICAvLyBDYXBwZWQgYXQgMjQgYmVjYXVzZSB0aGF0J3MgdGhlIG1heGltdW0gZWxldmF0aW9uIGRlZmluZWQgaW4gdGhlIE1hdGVyaWFsIGRlc2lnbiBzcGVjLlxuICAgIGNvbnN0IGVsZXZhdGlvbiA9IE1hdGgubWluKHRoaXMuX2Jhc2VFbGV2YXRpb24gKyBkZXB0aCwgMjQpO1xuICAgIGNvbnN0IG5ld0VsZXZhdGlvbiA9IGAke3RoaXMuX2VsZXZhdGlvblByZWZpeH0ke2VsZXZhdGlvbn1gO1xuICAgIGNvbnN0IGN1c3RvbUVsZXZhdGlvbiA9IE9iamVjdC5rZXlzKHRoaXMuX2NsYXNzTGlzdCkuZmluZChjbGFzc05hbWUgPT4ge1xuICAgICAgcmV0dXJuIGNsYXNzTmFtZS5zdGFydHNXaXRoKHRoaXMuX2VsZXZhdGlvblByZWZpeCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWN1c3RvbUVsZXZhdGlvbiB8fCBjdXN0b21FbGV2YXRpb24gPT09IHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICBjb25zdCBuZXdDbGFzc0xpc3QgPSB7Li4udGhpcy5fY2xhc3NMaXN0fTtcblxuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzRWxldmF0aW9uKSB7XG4gICAgICAgIG5ld0NsYXNzTGlzdFt0aGlzLl9wcmV2aW91c0VsZXZhdGlvbl0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgbmV3Q2xhc3NMaXN0W25ld0VsZXZhdGlvbl0gPSB0cnVlO1xuICAgICAgdGhpcy5fcHJldmlvdXNFbGV2YXRpb24gPSBuZXdFbGV2YXRpb247XG4gICAgICB0aGlzLl9jbGFzc0xpc3QgPSBuZXdDbGFzc0xpc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgY2xhc3NlcyB0byB0aGUgbWVudSBwYW5lbCBiYXNlZCBvbiBpdHMgcG9zaXRpb24uIENhbiBiZSB1c2VkIGJ5XG4gICAqIGNvbnN1bWVycyB0byBhZGQgc3BlY2lmaWMgc3R5bGluZyBiYXNlZCBvbiB0aGUgcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NYIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB4IGF4aXMuXG4gICAqIEBwYXJhbSBwb3NZIFBvc2l0aW9uIG9mIHRoZSBtZW51IGFsb25nIHRoZSB5IGF4aXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3NYOiBNZW51UG9zaXRpb25YID0gdGhpcy54UG9zaXRpb24sIHBvc1k6IE1lbnVQb3NpdGlvblkgPSB0aGlzLnlQb3NpdGlvbikge1xuICAgIHRoaXMuX2NsYXNzTGlzdCA9IHtcbiAgICAgIC4uLnRoaXMuX2NsYXNzTGlzdCxcbiAgICAgIFsnbWF0LW1lbnUtYmVmb3JlJ106IHBvc1ggPT09ICdiZWZvcmUnLFxuICAgICAgWydtYXQtbWVudS1hZnRlciddOiBwb3NYID09PSAnYWZ0ZXInLFxuICAgICAgWydtYXQtbWVudS1hYm92ZSddOiBwb3NZID09PSAnYWJvdmUnLFxuICAgICAgWydtYXQtbWVudS1iZWxvdyddOiBwb3NZID09PSAnYmVsb3cnLFxuICAgIH07XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDE1LjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9jaGFuZ2VEZXRlY3RvclJlZmAuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0aGUgZW50ZXIgYW5pbWF0aW9uLiAqL1xuICBfc3RhcnRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3Jlc2V0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgcGFuZWwgYW5pbWF0aW9uIHRvIGl0cyBpbml0aWFsIHN0YXRlLiAqL1xuICBfcmVzZXRBbmltYXRpb24oKSB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBDb21iaW5lIHdpdGggX3N0YXJ0QW5pbWF0aW9uLlxuICAgIHRoaXMuX3BhbmVsQW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gIH1cblxuICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIHBhbmVsIGFuaW1hdGlvbiBjb21wbGV0ZXMuICovXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5uZXh0KGV2ZW50KTtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgLy8gU2Nyb2xsIHRoZSBjb250ZW50IGVsZW1lbnQgdG8gdGhlIHRvcCBhcyBzb29uIGFzIHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGlzIGlzIG5lY2Vzc2FyeSxcbiAgICAvLyBiZWNhdXNlIHdlIG1vdmUgZm9jdXMgdG8gdGhlIGZpcnN0IGl0ZW0gd2hpbGUgaXQncyBzdGlsbCBiZWluZyBhbmltYXRlZCwgd2hpY2ggY2FuIHRocm93XG4gICAgLy8gdGhlIGJyb3dzZXIgb2ZmIHdoZW4gaXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIHBvc2l0aW9uLiBBbHRlcm5hdGl2ZWx5IHdlIGNhbiBtb3ZlIGZvY3VzXG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUsIGhvd2V2ZXIgbW92aW5nIGZvY3VzIGFzeW5jaHJvbm91c2x5IHdpbGwgaW50ZXJydXB0IHNjcmVlblxuICAgIC8vIHJlYWRlcnMgd2hpY2ggYXJlIGluIHRoZSBwcm9jZXNzIG9mIHJlYWRpbmcgb3V0IHRoZSBtZW51IGFscmVhZHkuIFdlIHRha2UgdGhlIGBlbGVtZW50YFxuICAgIC8vIGZyb20gdGhlIGBldmVudGAgc2luY2Ugd2UgY2FuJ3QgdXNlIGEgYFZpZXdDaGlsZGAgdG8gYWNjZXNzIHRoZSBwYW5lLlxuICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZW50ZXInICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ID09PSAwKSB7XG4gICAgICBldmVudC5lbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgYSBzdHJlYW0gdGhhdCB3aWxsIGtlZXAgdHJhY2sgb2YgYW55IG5ld2x5LWFkZGVkIG1lbnUgaXRlbXMgYW5kIHdpbGwgdXBkYXRlIHRoZSBsaXN0XG4gICAqIG9mIGRpcmVjdCBkZXNjZW5kYW50cy4gV2UgY29sbGVjdCB0aGUgZGVzY2VuZGFudHMgdGhpcyB3YXksIGJlY2F1c2UgYF9hbGxJdGVtc2AgY2FuIGluY2x1ZGVcbiAgICogaXRlbXMgdGhhdCBhcmUgcGFydCBvZiBjaGlsZCBtZW51cywgYW5kIHVzaW5nIGEgY3VzdG9tIHdheSBvZiByZWdpc3RlcmluZyBpdGVtcyBpcyB1bnJlbGlhYmxlXG4gICAqIHdoZW4gaXQgY29tZXMgdG8gbWFpbnRhaW5pbmcgdGhlIGl0ZW0gb3JkZXIuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXJlY3REZXNjZW5kYW50cygpIHtcbiAgICB0aGlzLl9hbGxJdGVtcy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsSXRlbXMpKVxuICAgICAgLnN1YnNjcmliZSgoaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT4pID0+IHtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLnJlc2V0KGl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX3BhcmVudE1lbnUgPT09IHRoaXMpKTtcbiAgICAgICAgdGhpcy5fZGlyZWN0RGVzY2VuZGFudEl0ZW1zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZT5cbiAgPGRpdlxuICAgIGNsYXNzPVwibWF0LW1kYy1tZW51LXBhbmVsIG1hdC1tZGMtZWxldmF0aW9uLXNwZWNpZmljXCJcbiAgICBbaWRdPVwicGFuZWxJZFwiXG4gICAgW2NsYXNzXT1cIl9jbGFzc0xpc3RcIlxuICAgIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIlxuICAgIChjbGljayk9XCJjbG9zZWQuZW1pdCgnY2xpY2snKVwiXG4gICAgW0B0cmFuc2Zvcm1NZW51XT1cIl9wYW5lbEFuaW1hdGlvblN0YXRlXCJcbiAgICAoQHRyYW5zZm9ybU1lbnUuc3RhcnQpPVwiX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgKEB0cmFuc2Zvcm1NZW51LmRvbmUpPVwiX29uQW5pbWF0aW9uRG9uZSgkZXZlbnQpXCJcbiAgICB0YWJpbmRleD1cIi0xXCJcbiAgICByb2xlPVwibWVudVwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWwgfHwgbnVsbFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZGJ5IHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiYXJpYURlc2NyaWJlZGJ5IHx8IG51bGxcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LW1kYy1tZW51LWNvbnRlbnRcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19