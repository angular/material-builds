/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinDisabled, mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';
import { MatInkBar, mixinInkBarItem } from '../ink-bar';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { SPACE } from '@angular/cdk/keycodes';
import { MAT_TABS_CONFIG } from '../tab-config';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/cdk/a11y";
import * as i5 from "@angular/material/core";
import * as i6 from "@angular/cdk/observers";
// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;
/**
 * Base class with all of the `MatTabNav` functionality.
 * @docs-private
 */
export class _MatTabNavBase extends MatPaginatedTabHeader {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
        this._disableRipple = false;
        /** Theme color of the nav bar. */
        this.color = 'primary';
    }
    /** Background color of the tab nav. */
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(value) {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove('mat-tabs-with-background', `mat-background-${this.backgroundColor}`);
        if (value) {
            classList.add('mat-tabs-with-background', `mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    _itemSelected() {
        // noop
    }
    ngAfterContentInit() {
        // We need this to run before the `changes` subscription in parent to ensure that the
        // selectedIndex is up-to-date by the time the super class starts looking for it.
        this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            this.updateActiveLink();
        });
        super.ngAfterContentInit();
    }
    /** Notifies the component that the active link has been changed. */
    updateActiveLink() {
        if (!this._items) {
            return;
        }
        const items = this._items.toArray();
        for (let i = 0; i < items.length; i++) {
            if (items[i].active) {
                this.selectedIndex = i;
                this._changeDetectorRef.markForCheck();
                if (this.tabPanel) {
                    this.tabPanel._activeTabId = items[i].id;
                }
                return;
            }
        }
        // The ink bar should hide itself if no items are active.
        this.selectedIndex = -1;
        this._inkBar.hide();
    }
    _getRole() {
        return this.tabPanel ? 'tablist' : this._elementRef.nativeElement.getAttribute('role');
    }
}
_MatTabNavBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: _MatTabNavBase, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabNavBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: _MatTabNavBase, inputs: { backgroundColor: "backgroundColor", disableRipple: "disableRipple", color: "color", tabPanel: "tabPanel" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: _MatTabNavBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { backgroundColor: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }], tabPanel: [{
                type: Input
            }] } });
// Boilerplate for applying mixins to MatTabLink.
const _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(class {
})));
/** Base class with all of the `MatTabLink` functionality. */
export class _MatTabLinkBase extends _MatTabLinkMixinBase {
    constructor(_tabNavBar, 
    /** @docs-private */ elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
        super();
        this._tabNavBar = _tabNavBar;
        this.elementRef = elementRef;
        this._focusMonitor = _focusMonitor;
        /** Whether the tab link is active or not. */
        this._isActive = false;
        /** Unique id for the tab. */
        this.id = `mat-tab-link-${nextUniqueId++}`;
        this.rippleConfig = globalRippleOptions || {};
        this.tabIndex = parseInt(tabIndex) || 0;
        if (animationMode === 'NoopAnimations') {
            this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
    }
    /** Whether the link is active. */
    get active() {
        return this._isActive;
    }
    set active(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._isActive) {
            this._isActive = newValue;
            this._tabNavBar.updateActiveLink();
        }
    }
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    get rippleDisabled() {
        return (this.disabled ||
            this.disableRipple ||
            this._tabNavBar.disableRipple ||
            !!this.rippleConfig.disabled);
    }
    /** Focuses the tab link. */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this.elementRef);
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this.elementRef);
    }
    _handleFocus() {
        // Since we allow navigation through tabbing in the nav bar, we
        // have to update the focused index whenever the link receives focus.
        this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
    }
    _handleKeydown(event) {
        if (this._tabNavBar.tabPanel && event.keyCode === SPACE) {
            this.elementRef.nativeElement.click();
        }
    }
    _getAriaControls() {
        return this._tabNavBar.tabPanel
            ? this._tabNavBar.tabPanel?.id
            : this.elementRef.nativeElement.getAttribute('aria-controls');
    }
    _getAriaSelected() {
        if (this._tabNavBar.tabPanel) {
            return this.active ? 'true' : 'false';
        }
        else {
            return this.elementRef.nativeElement.getAttribute('aria-selected');
        }
    }
    _getAriaCurrent() {
        return this.active && !this._tabNavBar.tabPanel ? 'page' : null;
    }
    _getRole() {
        return this._tabNavBar.tabPanel ? 'tab' : this.elementRef.nativeElement.getAttribute('role');
    }
    _getTabIndex() {
        if (this._tabNavBar.tabPanel) {
            return this._isActive && !this.disabled ? 0 : -1;
        }
        else {
            return this.tabIndex;
        }
    }
}
_MatTabLinkBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: _MatTabLinkBase, deps: [{ token: _MatTabNavBase }, { token: i0.ElementRef }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i4.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabLinkBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: _MatTabLinkBase, inputs: { active: "active", id: "id" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: _MatTabLinkBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: _MatTabNavBase }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i4.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { active: [{
                type: Input
            }], id: [{
                type: Input
            }] } });
const _MatTabLinkBaseWithInkBarItem = mixinInkBarItem(_MatTabLinkBase);
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export class MatTabNav extends _MatTabNavBase {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode, defaultConfig) {
        super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
        this._fitInkBarToContent = new BehaviorSubject(false);
        this._stretchTabs = true;
        this.disablePagination =
            defaultConfig && defaultConfig.disablePagination != null
                ? defaultConfig.disablePagination
                : false;
        this.fitInkBarToContent =
            defaultConfig && defaultConfig.fitInkBarToContent != null
                ? defaultConfig.fitInkBarToContent
                : false;
    }
    /** Whether the ink bar should fit its width to the size of the tab label content. */
    get fitInkBarToContent() {
        return this._fitInkBarToContent.value;
    }
    set fitInkBarToContent(v) {
        this._fitInkBarToContent.next(coerceBooleanProperty(v));
        this._changeDetectorRef.markForCheck();
    }
    /** Whether tabs should be stretched to fill the header. */
    get stretchTabs() {
        return this._stretchTabs;
    }
    set stretchTabs(v) {
        this._stretchTabs = coerceBooleanProperty(v);
    }
    ngAfterContentInit() {
        this._inkBar = new MatInkBar(this._items);
        super.ngAfterContentInit();
    }
    ngAfterViewInit() {
        if (!this.tabPanel && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw new Error('A mat-tab-nav-panel must be specified via [tabPanel].');
        }
    }
}
MatTabNav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabNav, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_TABS_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTabNav.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatTabNav, selector: "[mat-tab-nav-bar]", inputs: { color: "color", fitInkBarToContent: "fitInkBarToContent", stretchTabs: ["mat-stretch-tabs", "stretchTabs"] }, host: { properties: { "attr.role": "_getRole()", "class.mat-mdc-tab-header-pagination-controls-enabled": "_showPaginationControls", "class.mat-mdc-tab-header-rtl": "_getLayoutDirection() == 'rtl'", "class.mat-mdc-tab-nav-bar-stretch-tabs": "stretchTabs", "class.mat-primary": "color !== \"warn\" && color !== \"accent\"", "class.mat-accent": "color === \"accent\"", "class.mat-warn": "color === \"warn\"", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mat-mdc-tab-nav-bar mat-mdc-tab-header" }, queries: [{ propertyName: "_items", predicate: i0.forwardRef(function () { return MatTabLink; }), descendants: true }], viewQueries: [{ propertyName: "_tabListContainer", first: true, predicate: ["tabListContainer"], descendants: true, static: true }, { propertyName: "_tabList", first: true, predicate: ["tabList"], descendants: true, static: true }, { propertyName: "_tabListInner", first: true, predicate: ["tabListInner"], descendants: true, static: true }, { propertyName: "_nextPaginator", first: true, predicate: ["nextPaginator"], descendants: true }, { propertyName: "_previousPaginator", first: true, predicate: ["previousPaginator"], descendants: true }], exportAs: ["matTabNavBar", "matTabNav"], usesInheritance: true, ngImport: i0, template: "<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class=\"mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     tabindex=\"-1\"\n     [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-mdc-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     [disabled]=\"_disableScrollBefore || null\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-mdc-tab-header-pagination-chevron\"></div>\n</button>\n\n<div class=\"mat-mdc-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div class=\"mat-mdc-tab-list\" #tabList (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-mdc-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class=\"mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-mdc-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     [disabled]=\"_disableScrollAfter || null\"\n     tabindex=\"-1\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-mdc-tab-header-pagination-chevron\"></div>\n</button>\n", styles: [".mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab[hidden]{display:none}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-top-width:2px}.mdc-tab-indicator .mdc-tab-indicator__content--icon{height:34px;font-size:34px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mat-mdc-tab-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-links{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:flex-end}.mat-mdc-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination{background-color:var(--mat-mdc-tab-header-with-background-background-color, transparent)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab .mdc-tab__text-label,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab-indicator__content--underline,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-focus-indicator::before{border-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab__ripple::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mdc-tab__ripple::before{background-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron{border-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}"], dependencies: [{ kind: "directive", type: i5.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: i6.CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabNav, decorators: [{
            type: Component,
            args: [{ selector: '[mat-tab-nav-bar]', exportAs: 'matTabNavBar, matTabNav', inputs: ['color'], host: {
                        '[attr.role]': '_getRole()',
                        'class': 'mat-mdc-tab-nav-bar mat-mdc-tab-header',
                        '[class.mat-mdc-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                        '[class.mat-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                        '[class.mat-mdc-tab-nav-bar-stretch-tabs]': 'stretchTabs',
                        '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
                        '[class.mat-accent]': 'color === "accent"',
                        '[class.mat-warn]': 'color === "warn"',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, template: "<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class=\"mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-before\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     tabindex=\"-1\"\n     [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-mdc-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     [disabled]=\"_disableScrollBefore || null\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-mdc-tab-header-pagination-chevron\"></div>\n</button>\n\n<div class=\"mat-mdc-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div class=\"mat-mdc-tab-list\" #tabList (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-mdc-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n\n<!-- TODO: this also had `mat-elevation-z4`. Figure out what we should do with it. -->\n<button class=\"mat-mdc-tab-header-pagination mat-mdc-tab-header-pagination-after\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     type=\"button\"\n     mat-ripple\n     [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-mdc-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     [disabled]=\"_disableScrollAfter || null\"\n     tabindex=\"-1\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-mdc-tab-header-pagination-chevron\"></div>\n</button>\n", styles: [".mdc-tab{min-width:90px;padding-right:24px;padding-left:24px;display:flex;flex:1 0 auto;justify-content:center;box-sizing:border-box;margin:0;padding-top:0;padding-bottom:0;border:none;outline:none;text-align:center;white-space:nowrap;cursor:pointer;-webkit-appearance:none;z-index:1}.mdc-tab::-moz-focus-inner{padding:0;border:0}.mdc-tab[hidden]{display:none}.mdc-tab--min-width{flex:0 1 auto}.mdc-tab__content{display:flex;align-items:center;justify-content:center;height:inherit;pointer-events:none}.mdc-tab__text-label{transition:150ms color linear;display:inline-block;line-height:1;z-index:2}.mdc-tab__icon{transition:150ms color linear;z-index:2}.mdc-tab--stacked .mdc-tab__content{flex-direction:column;align-items:center;justify-content:center}.mdc-tab--stacked .mdc-tab__text-label{padding-top:6px;padding-bottom:4px}.mdc-tab--active .mdc-tab__text-label,.mdc-tab--active .mdc-tab__icon{transition-delay:100ms}.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label{padding-left:8px;padding-right:0}[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label,.mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl]{padding-left:0;padding-right:8px}.mdc-tab-indicator .mdc-tab-indicator__content--underline{border-top-width:2px}.mdc-tab-indicator .mdc-tab-indicator__content--icon{height:34px;font-size:34px}.mdc-tab-indicator{display:flex;position:absolute;top:0;left:0;justify-content:center;width:100%;height:100%;pointer-events:none;z-index:1}.mdc-tab-indicator__content{transform-origin:left;opacity:0}.mdc-tab-indicator__content--underline{align-self:flex-end;box-sizing:border-box;width:100%;border-top-style:solid}.mdc-tab-indicator__content--icon{align-self:center;margin:0 auto}.mdc-tab-indicator--active .mdc-tab-indicator__content{opacity:1}.mdc-tab-indicator .mdc-tab-indicator__content{transition:250ms transform cubic-bezier(0.4, 0, 0.2, 1)}.mdc-tab-indicator--no-transition .mdc-tab-indicator__content{transition:none}.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition:150ms opacity linear}.mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content{transition-delay:100ms}.mat-mdc-tab-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}.mat-mdc-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-mdc-tab-header-pagination{-webkit-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:none;box-sizing:content-box;background:none;border:none;outline:0;padding:0}.mat-mdc-tab-header-pagination::-moz-focus-inner{border:0}.mat-mdc-tab-header-pagination .mat-ripple-element{opacity:.12}.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination{display:flex}.mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after{padding-left:4px}.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,.mat-mdc-tab-header-pagination-after{padding-right:4px}.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-mdc-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;height:8px;width:8px}.mat-mdc-tab-header-pagination-disabled{box-shadow:none;cursor:default;pointer-events:none}.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron{opacity:.4}.mat-mdc-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-mdc-tab-list{transition:none}._mat-animation-noopable span.mdc-tab-indicator__content,._mat-animation-noopable span.mdc-tab__text-label{transition:none}.mat-mdc-tab-links{display:flex;flex:1 0 auto}[mat-align-tabs=center]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-mdc-tab-link-container .mat-mdc-tab-links{justify-content:flex-end}.mat-mdc-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination{background-color:var(--mat-mdc-tab-header-with-background-background-color, transparent)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab .mdc-tab__text-label,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-link .mdc-tab__text-label{color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab-indicator__content--underline,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-focus-indicator::before{border-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mdc-tab__ripple::before,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-ripple-element,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mdc-tab__ripple::before{background-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-link-container .mat-mdc-tab-header-pagination-chevron,.mat-mdc-tab-nav-bar.mat-tabs-with-background>.mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron{border-color:var(--mat-mdc-tab-header-with-background-foreground-color, inherit)}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_TABS_CONFIG]
                }] }]; }, propDecorators: { fitInkBarToContent: [{
                type: Input
            }], stretchTabs: [{
                type: Input,
                args: ['mat-stretch-tabs']
            }], _items: [{
                type: ContentChildren,
                args: [forwardRef(() => MatTabLink), { descendants: true }]
            }], _tabListContainer: [{
                type: ViewChild,
                args: ['tabListContainer', { static: true }]
            }], _tabList: [{
                type: ViewChild,
                args: ['tabList', { static: true }]
            }], _tabListInner: [{
                type: ViewChild,
                args: ['tabListInner', { static: true }]
            }], _nextPaginator: [{
                type: ViewChild,
                args: ['nextPaginator']
            }], _previousPaginator: [{
                type: ViewChild,
                args: ['previousPaginator']
            }] } });
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export class MatTabLink extends _MatTabLinkBaseWithInkBarItem {
    constructor(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
        super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
        this._destroyed = new Subject();
        tabNavBar._fitInkBarToContent.pipe(takeUntil(this._destroyed)).subscribe(fitInkBarToContent => {
            this.fitInkBarToContent = fitInkBarToContent;
        });
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        super.ngOnDestroy();
    }
}
MatTabLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabLink, deps: [{ token: MatTabNav }, { token: i0.ElementRef }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i4.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTabLink.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatTabLink, selector: "[mat-tab-link], [matTabLink]", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex", active: "active", id: "id" }, host: { listeners: { "focus": "_handleFocus()", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-controls": "_getAriaControls()", "attr.aria-current": "_getAriaCurrent()", "attr.aria-disabled": "disabled", "attr.aria-selected": "_getAriaSelected()", "attr.id": "id", "attr.tabIndex": "_getTabIndex()", "attr.role": "_getRole()", "class.mat-mdc-tab-disabled": "disabled", "class.mdc-tab--active": "active" }, classAttribute: "mdc-tab mat-mdc-tab-link mat-mdc-focus-indicator" }, exportAs: ["matTabLink"], usesInheritance: true, ngImport: i0, template: "<span class=\"mdc-tab__ripple\"></span>\n\n<div\n  class=\"mat-mdc-tab-ripple\"\n  mat-ripple\n  [matRippleTrigger]=\"elementRef.nativeElement\"\n  [matRippleDisabled]=\"rippleDisabled\"></div>\n\n<span class=\"mdc-tab__content\">\n  <span class=\"mdc-tab__text-label\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n", styles: [".mat-mdc-tab-link{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-tab-link.mdc-tab{height:48px;flex-grow:0}.mat-mdc-tab-link .mdc-tab__ripple::before{content:\"\";display:block;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;pointer-events:none}.mat-mdc-tab-link .mdc-tab__text-label{display:inline-flex;align-items:center}.mat-mdc-tab-link .mdc-tab__content{position:relative}.mat-mdc-tab-link:hover .mdc-tab__ripple::before{opacity:.04}.mat-mdc-tab-link.cdk-program-focused .mdc-tab__ripple::before,.mat-mdc-tab-link.cdk-keyboard-focused .mdc-tab__ripple::before{opacity:.12}.mat-mdc-tab-link .mat-ripple-element{opacity:.12}.mat-mdc-tab-link.mat-mdc-tab-disabled{pointer-events:none;opacity:.4}.mat-mdc-tab-header.mat-mdc-tab-nav-bar-stretch-tabs .mat-mdc-tab-link{flex-grow:1}.mat-mdc-tab-link::before{margin:5px}@media(max-width: 599px){.mat-mdc-tab-link{min-width:72px}}"], dependencies: [{ kind: "directive", type: i5.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabLink, decorators: [{
            type: Component,
            args: [{ selector: '[mat-tab-link], [matTabLink]', exportAs: 'matTabLink', inputs: ['disabled', 'disableRipple', 'tabIndex', 'active', 'id'], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'mdc-tab mat-mdc-tab-link mat-mdc-focus-indicator',
                        '[attr.aria-controls]': '_getAriaControls()',
                        '[attr.aria-current]': '_getAriaCurrent()',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.aria-selected]': '_getAriaSelected()',
                        '[attr.id]': 'id',
                        '[attr.tabIndex]': '_getTabIndex()',
                        '[attr.role]': '_getRole()',
                        '[class.mat-mdc-tab-disabled]': 'disabled',
                        '[class.mdc-tab--active]': 'active',
                        '(focus)': '_handleFocus()',
                        '(keydown)': '_handleKeydown($event)',
                    }, template: "<span class=\"mdc-tab__ripple\"></span>\n\n<div\n  class=\"mat-mdc-tab-ripple\"\n  mat-ripple\n  [matRippleTrigger]=\"elementRef.nativeElement\"\n  [matRippleDisabled]=\"rippleDisabled\"></div>\n\n<span class=\"mdc-tab__content\">\n  <span class=\"mdc-tab__text-label\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n", styles: [".mat-mdc-tab-link{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-tab-link.mdc-tab{height:48px;flex-grow:0}.mat-mdc-tab-link .mdc-tab__ripple::before{content:\"\";display:block;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;pointer-events:none}.mat-mdc-tab-link .mdc-tab__text-label{display:inline-flex;align-items:center}.mat-mdc-tab-link .mdc-tab__content{position:relative}.mat-mdc-tab-link:hover .mdc-tab__ripple::before{opacity:.04}.mat-mdc-tab-link.cdk-program-focused .mdc-tab__ripple::before,.mat-mdc-tab-link.cdk-keyboard-focused .mdc-tab__ripple::before{opacity:.12}.mat-mdc-tab-link .mat-ripple-element{opacity:.12}.mat-mdc-tab-link.mat-mdc-tab-disabled{pointer-events:none;opacity:.4}.mat-mdc-tab-header.mat-mdc-tab-nav-bar-stretch-tabs .mat-mdc-tab-link{flex-grow:1}.mat-mdc-tab-link::before{margin:5px}@media(max-width: 599px){.mat-mdc-tab-link{min-width:72px}}"] }]
        }], ctorParameters: function () { return [{ type: MatTabNav }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i4.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Tab panel component associated with MatTabNav.
 */
export class MatTabNavPanel {
    constructor() {
        /** Unique id for the tab panel. */
        this.id = `mat-tab-nav-panel-${nextUniqueId++}`;
    }
}
MatTabNavPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabNavPanel, deps: [], target: i0.ɵɵFactoryTarget.Component });
MatTabNavPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatTabNavPanel, selector: "mat-tab-nav-panel", inputs: { id: "id" }, host: { attributes: { "role": "tabpanel" }, properties: { "attr.aria-labelledby": "_activeTabId", "attr.id": "id" }, classAttribute: "mat-mdc-tab-nav-panel" }, exportAs: ["matTabNavPanel"], ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatTabNavPanel, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-tab-nav-panel',
                    exportAs: 'matTabNavPanel',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[attr.aria-labelledby]': '_activeTabId',
                        '[attr.id]': 'id',
                        'class': 'mat-mdc-tab-nav-panel',
                        'role': 'tabpanel',
                    },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1uYXYtYmFyL3RhYi1uYXYtYmFyLmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbGluay5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFJTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBSUwseUJBQXlCLEVBQ3pCLGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsYUFBYSxHQUtkLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFrQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsU0FBUyxFQUFpQixlQUFlLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDckUsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FB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QUFWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIEhhc1RhYkluZGV4LFxuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlVGFyZ2V0LFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdElua0JhciwgTWF0SW5rQmFySXRlbSwgbWl4aW5JbmtCYXJJdGVtfSBmcm9tICcuLi9pbmstYmFyJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1NQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtNQVRfVEFCU19DT05GSUcsIE1hdFRhYnNDb25maWd9IGZyb20gJy4uL3RhYi1jb25maWcnO1xuaW1wb3J0IHtNYXRQYWdpbmF0ZWRUYWJIZWFkZXIsIE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW19IGZyb20gJy4uL3BhZ2luYXRlZC10YWItaGVhZGVyJztcblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMgZm9yIHRhYiBuYXYgY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJOYXZgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJOYXZCYXNlXG4gIGV4dGVuZHMgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95XG57XG4gIC8qKiBRdWVyeSBsaXN0IG9mIGFsbCB0YWIgbGlua3Mgb2YgdGhlIHRhYiBuYXZpZ2F0aW9uLiAqL1xuICBhYnN0cmFjdCBvdmVycmlkZSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtICYge2FjdGl2ZTogYm9vbGVhbjsgaWQ6IHN0cmluZ30+O1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgbmF2LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjtcbiAgfVxuXG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZSgnbWF0LXRhYnMtd2l0aC1iYWNrZ3JvdW5kJywgYG1hdC1iYWNrZ3JvdW5kLSR7dGhpcy5iYWNrZ3JvdW5kQ29sb3J9YCk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoJ21hdC10YWJzLXdpdGgtYmFja2dyb3VuZCcsIGBtYXQtYmFja2dyb3VuZC0ke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIHRoaXMuX2JhY2tncm91bmRDb2xvciA9IHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmFja2dyb3VuZENvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJpcHBsZSBlZmZlY3QgaXMgZGlzYWJsZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTtcbiAgfVxuXG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlbWUgY29sb3Igb2YgdGhlIG5hdiBiYXIuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqXG4gICAqIEFzc29jaWF0ZWQgdGFiIHBhbmVsIGNvbnRyb2xsZWQgYnkgdGhlIG5hdiBiYXIuIElmIG5vdCBwcm92aWRlZCwgdGhlbiB0aGUgbmF2IGJhclxuICAgKiBmb2xsb3dzIHRoZSBBUklBIGxpbmsgLyBuYXZpZ2F0aW9uIGxhbmRtYXJrIHBhdHRlcm4uIElmIHByb3ZpZGVkLCBpdCBmb2xsb3dzIHRoZVxuICAgKiBBUklBIHRhYnMgZGVzaWduIHBhdHRlcm4uXG4gICAqL1xuICBASW5wdXQoKSB0YWJQYW5lbD86IE1hdFRhYk5hdlBhbmVsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pdGVtU2VsZWN0ZWQoKSB7XG4gICAgLy8gbm9vcFxuICB9XG5cbiAgb3ZlcnJpZGUgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhpcyB0byBydW4gYmVmb3JlIHRoZSBgY2hhbmdlc2Agc3Vic2NyaXB0aW9uIGluIHBhcmVudCB0byBlbnN1cmUgdGhhdCB0aGVcbiAgICAvLyBzZWxlY3RlZEluZGV4IGlzIHVwLXRvLWRhdGUgYnkgdGhlIHRpbWUgdGhlIHN1cGVyIGNsYXNzIHN0YXJ0cyBsb29raW5nIGZvciBpdC5cbiAgICB0aGlzLl9pdGVtcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlQWN0aXZlTGluaygpO1xuICAgIH0pO1xuXG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICAvKiogTm90aWZpZXMgdGhlIGNvbXBvbmVudCB0aGF0IHRoZSBhY3RpdmUgbGluayBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuICB1cGRhdGVBY3RpdmVMaW5rKCkge1xuICAgIGlmICghdGhpcy5faXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVtc1tpXS5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGFiUGFuZWwpIHtcbiAgICAgICAgICB0aGlzLnRhYlBhbmVsLl9hY3RpdmVUYWJJZCA9IGl0ZW1zW2ldLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBpbmsgYmFyIHNob3VsZCBoaWRlIGl0c2VsZiBpZiBubyBpdGVtcyBhcmUgYWN0aXZlLlxuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgIHRoaXMuX2lua0Jhci5oaWRlKCk7XG4gIH1cblxuICBfZ2V0Um9sZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy50YWJQYW5lbCA/ICd0YWJsaXN0JyA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKTtcbiAgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkxpbmsuXG5jb25zdCBfTWF0VGFiTGlua01peGluQmFzZSA9IG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoY2xhc3Mge30pKSk7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiTGlua2AgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRUYWJMaW5rQmFzZVxuICBleHRlbmRzIF9NYXRUYWJMaW5rTWl4aW5CYXNlXG4gIGltcGxlbWVudHNcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIE9uRGVzdHJveSxcbiAgICBDYW5EaXNhYmxlLFxuICAgIENhbkRpc2FibGVSaXBwbGUsXG4gICAgSGFzVGFiSW5kZXgsXG4gICAgUmlwcGxlVGFyZ2V0LFxuICAgIEZvY3VzYWJsZU9wdGlvblxue1xuICAvKiogV2hldGhlciB0aGUgdGFiIGxpbmsgaXMgYWN0aXZlIG9yIG5vdC4gKi9cbiAgcHJvdGVjdGVkIF9pc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaW5rIGlzIGFjdGl2ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNBY3RpdmU7XG4gIH1cblxuICBzZXQgYWN0aXZlKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fdGFiTmF2QmFyLnVwZGF0ZUFjdGl2ZUxpbmsoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIHRhYiBsaW5rIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLmRpc2FibGVSaXBwbGUgfHxcbiAgICAgIHRoaXMuX3RhYk5hdkJhci5kaXNhYmxlUmlwcGxlIHx8XG4gICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSB0YWIuICovXG4gIEBJbnB1dCgpIGlkID0gYG1hdC10YWItbGluay0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdGFiTmF2QmFyOiBfTWF0VGFiTmF2QmFzZSxcbiAgICAvKiogQGRvY3MtcHJpdmF0ZSAqLyBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpIGdsb2JhbFJpcHBsZU9wdGlvbnM6IFJpcHBsZUdsb2JhbE9wdGlvbnMgfCBudWxsLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5yaXBwbGVDb25maWcuYW5pbWF0aW9uID0ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH07XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHRhYiBsaW5rLiAqL1xuICBmb2N1cygpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuZWxlbWVudFJlZik7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5lbGVtZW50UmVmKTtcbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpIHtcbiAgICAvLyBTaW5jZSB3ZSBhbGxvdyBuYXZpZ2F0aW9uIHRocm91Z2ggdGFiYmluZyBpbiB0aGUgbmF2IGJhciwgd2VcbiAgICAvLyBoYXZlIHRvIHVwZGF0ZSB0aGUgZm9jdXNlZCBpbmRleCB3aGVuZXZlciB0aGUgbGluayByZWNlaXZlcyBmb2N1cy5cbiAgICB0aGlzLl90YWJOYXZCYXIuZm9jdXNJbmRleCA9IHRoaXMuX3RhYk5hdkJhci5faXRlbXMudG9BcnJheSgpLmluZGV4T2YodGhpcyk7XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwgJiYgZXZlbnQua2V5Q29kZSA9PT0gU1BBQ0UpIHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgX2dldEFyaWFDb250cm9scygpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsXG4gICAgICA/IHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbD8uaWRcbiAgICAgIDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XG4gIH1cblxuICBfZ2V0QXJpYVNlbGVjdGVkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZSA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0QXJpYUN1cnJlbnQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlICYmICF0aGlzLl90YWJOYXZCYXIudGFiUGFuZWwgPyAncGFnZScgOiBudWxsO1xuICB9XG5cbiAgX2dldFJvbGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RhYk5hdkJhci50YWJQYW5lbCA/ICd0YWInIDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJyk7XG4gIH1cblxuICBfZ2V0VGFiSW5kZXgoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fdGFiTmF2QmFyLnRhYlBhbmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXNBY3RpdmUgJiYgIXRoaXMuZGlzYWJsZWQgPyAwIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRhYkluZGV4O1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBfTWF0VGFiTGlua0Jhc2VXaXRoSW5rQmFySXRlbSA9IG1peGluSW5rQmFySXRlbShfTWF0VGFiTGlua0Jhc2UpO1xuXG4vKipcbiAqIE5hdmlnYXRpb24gY29tcG9uZW50IG1hdGNoaW5nIHRoZSBzdHlsZXMgb2YgdGhlIHRhYiBncm91cCBoZWFkZXIuXG4gKiBQcm92aWRlcyBhbmNob3JlZCBuYXZpZ2F0aW9uIHdpdGggYW5pbWF0ZWQgaW5rIGJhci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC10YWItbmF2LWJhcl0nLFxuICBleHBvcnRBczogJ21hdFRhYk5hdkJhciwgbWF0VGFiTmF2JyxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIHRlbXBsYXRlVXJsOiAndGFiLW5hdi1iYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItbmF2LWJhci5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdfZ2V0Um9sZSgpJyxcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy10YWItbmF2LWJhciBtYXQtbWRjLXRhYi1oZWFkZXInLFxuICAgICdbY2xhc3MubWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tY29udHJvbHMtZW5hYmxlZF0nOiAnX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMnLFxuICAgICdbY2xhc3MubWF0LW1kYy10YWItaGVhZGVyLXJ0bF0nOiBcIl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAncnRsJ1wiLFxuICAgICdbY2xhc3MubWF0LW1kYy10YWItbmF2LWJhci1zdHJldGNoLXRhYnNdJzogJ3N0cmV0Y2hUYWJzJyxcbiAgICAnW2NsYXNzLm1hdC1wcmltYXJ5XSc6ICdjb2xvciAhPT0gXCJ3YXJuXCIgJiYgY29sb3IgIT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09PSBcIndhcm5cIicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2IGV4dGVuZHMgX01hdFRhYk5hdkJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGluayBiYXIgc2hvdWxkIGZpdCBpdHMgd2lkdGggdG8gdGhlIHNpemUgb2YgdGhlIHRhYiBsYWJlbCBjb250ZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZml0SW5rQmFyVG9Db250ZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9maXRJbmtCYXJUb0NvbnRlbnQudmFsdWU7XG4gIH1cbiAgc2V0IGZpdElua0JhclRvQ29udGVudCh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9maXRJbmtCYXJUb0NvbnRlbnQubmV4dChjb2VyY2VCb29sZWFuUHJvcGVydHkodikpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIF9maXRJbmtCYXJUb0NvbnRlbnQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcblxuICAvKiogV2hldGhlciB0YWJzIHNob3VsZCBiZSBzdHJldGNoZWQgdG8gZmlsbCB0aGUgaGVhZGVyLiAqL1xuICBASW5wdXQoJ21hdC1zdHJldGNoLXRhYnMnKVxuICBnZXQgc3RyZXRjaFRhYnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hUYWJzO1xuICB9XG4gIHNldCBzdHJldGNoVGFicyh2OiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9zdHJldGNoVGFicyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2KTtcbiAgfVxuICBwcml2YXRlIF9zdHJldGNoVGFicyA9IHRydWU7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE1hdFRhYkxpbmspLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRUYWJMaW5rPjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdCcsIHtzdGF0aWM6IHRydWV9KSBfdGFiTGlzdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiTGlzdElubmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0SW5uZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25leHRQYWdpbmF0b3InKSBfbmV4dFBhZ2luYXRvcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpb3VzUGFnaW5hdG9yJykgX3ByZXZpb3VzUGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgX2lua0JhcjogTWF0SW5rQmFyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVEFCU19DT05GSUcpIGRlZmF1bHRDb25maWc/OiBNYXRUYWJzQ29uZmlnLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIG5nWm9uZSwgY2hhbmdlRGV0ZWN0b3JSZWYsIHZpZXdwb3J0UnVsZXIsIHBsYXRmb3JtLCBhbmltYXRpb25Nb2RlKTtcbiAgICB0aGlzLmRpc2FibGVQYWdpbmF0aW9uID1cbiAgICAgIGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiAhPSBudWxsXG4gICAgICAgID8gZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvblxuICAgICAgICA6IGZhbHNlO1xuICAgIHRoaXMuZml0SW5rQmFyVG9Db250ZW50ID1cbiAgICAgIGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5maXRJbmtCYXJUb0NvbnRlbnQgIT0gbnVsbFxuICAgICAgICA/IGRlZmF1bHRDb25maWcuZml0SW5rQmFyVG9Db250ZW50XG4gICAgICAgIDogZmFsc2U7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5rQmFyID0gbmV3IE1hdElua0Jhcih0aGlzLl9pdGVtcyk7XG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLnRhYlBhbmVsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbWF0LXRhYi1uYXYtcGFuZWwgbXVzdCBiZSBzcGVjaWZpZWQgdmlhIFt0YWJQYW5lbF0uJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTGluayBpbnNpZGUgb2YgYSBgbWF0LXRhYi1uYXYtYmFyYC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC10YWItbGlua10sIFttYXRUYWJMaW5rXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTGluaycsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4JywgJ2FjdGl2ZScsICdpZCddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGVVcmw6ICd0YWItbGluay5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1saW5rLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21kYy10YWIgbWF0LW1kYy10YWItbGluayBtYXQtbWRjLWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ19nZXRBcmlhQ29udHJvbHMoKScsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnX2dldEFyaWFDdXJyZW50KCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ19nZXRBcmlhU2VsZWN0ZWQoKScsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYkluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19nZXRSb2xlKCknLFxuICAgICdbY2xhc3MubWF0LW1kYy10YWItZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1kYy10YWItLWFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnKGZvY3VzKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTGluayBleHRlbmRzIF9NYXRUYWJMaW5rQmFzZVdpdGhJbmtCYXJJdGVtIGltcGxlbWVudHMgTWF0SW5rQmFySXRlbSwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YWJOYXZCYXI6IE1hdFRhYk5hdixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUykgZ2xvYmFsUmlwcGxlT3B0aW9uczogUmlwcGxlR2xvYmFsT3B0aW9ucyB8IG51bGwsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcih0YWJOYXZCYXIsIGVsZW1lbnRSZWYsIGdsb2JhbFJpcHBsZU9wdGlvbnMsIHRhYkluZGV4LCBmb2N1c01vbml0b3IsIGFuaW1hdGlvbk1vZGUpO1xuXG4gICAgdGFiTmF2QmFyLl9maXRJbmtCYXJUb0NvbnRlbnQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGZpdElua0JhclRvQ29udGVudCA9PiB7XG4gICAgICB0aGlzLmZpdElua0JhclRvQ29udGVudCA9IGZpdElua0JhclRvQ29udGVudDtcbiAgICB9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxufVxuXG4vKipcbiAqIFRhYiBwYW5lbCBjb21wb25lbnQgYXNzb2NpYXRlZCB3aXRoIE1hdFRhYk5hdi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1uYXYtcGFuZWwnLFxuICBleHBvcnRBczogJ21hdFRhYk5hdlBhbmVsJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19hY3RpdmVUYWJJZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtdGFiLW5hdi1wYW5lbCcsXG4gICAgJ3JvbGUnOiAndGFicGFuZWwnLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2UGFuZWwge1xuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgdGFiIHBhbmVsLiAqL1xuICBASW5wdXQoKSBpZCA9IGBtYXQtdGFiLW5hdi1wYW5lbC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIElkIG9mIHRoZSBhY3RpdmUgdGFiIGluIHRoZSBuYXYgYmFyLiAqL1xuICBfYWN0aXZlVGFiSWQ/OiBzdHJpbmc7XG59XG4iLCI8IS0tIFRPRE86IHRoaXMgYWxzbyBoYWQgYG1hdC1lbGV2YXRpb24tejRgLiBGaWd1cmUgb3V0IHdoYXQgd2Ugc2hvdWxkIGRvIHdpdGggaXQuIC0tPlxuPGJ1dHRvbiBjbGFzcz1cIm1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC1tZGMtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWJlZm9yZVwiXG4gICAgICNwcmV2aW91c1BhZ2luYXRvclxuICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgbWF0LXJpcHBsZVxuICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQmVmb3JlIHx8IGRpc2FibGVSaXBwbGVcIlxuICAgICBbY2xhc3MubWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmVcIlxuICAgICBbZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmUgfHwgbnVsbFwiXG4gICAgIChjbGljayk9XCJfaGFuZGxlUGFnaW5hdG9yQ2xpY2soJ2JlZm9yZScpXCJcbiAgICAgKG1vdXNlZG93bik9XCJfaGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2JlZm9yZScsICRldmVudClcIlxuICAgICAodG91Y2hlbmQpPVwiX3N0b3BJbnRlcnZhbCgpXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jaGV2cm9uXCI+PC9kaXY+XG48L2J1dHRvbj5cblxuPGRpdiBjbGFzcz1cIm1hdC1tZGMtdGFiLWxpbmstY29udGFpbmVyXCIgI3RhYkxpc3RDb250YWluZXIgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LW1kYy10YWItbGlzdFwiICN0YWJMaXN0IChjZGtPYnNlcnZlQ29udGVudCk9XCJfb25Db250ZW50Q2hhbmdlcygpXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtdGFiLWxpbmtzXCIgI3RhYkxpc3RJbm5lcj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPCEtLSBUT0RPOiB0aGlzIGFsc28gaGFkIGBtYXQtZWxldmF0aW9uLXo0YC4gRmlndXJlIG91dCB3aGF0IHdlIHNob3VsZCBkbyB3aXRoIGl0LiAtLT5cbjxidXR0b24gY2xhc3M9XCJtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbiBtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1hZnRlclwiXG4gICAgICNuZXh0UGFnaW5hdG9yXG4gICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgIHR5cGU9XCJidXR0b25cIlxuICAgICBtYXQtcmlwcGxlXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyIHx8IGRpc2FibGVSaXBwbGVcIlxuICAgICBbY2xhc3MubWF0LW1kYy10YWItaGVhZGVyLXBhZ2luYXRpb24tZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxBZnRlclwiXG4gICAgIFtkaXNhYmxlZF09XCJfZGlzYWJsZVNjcm9sbEFmdGVyIHx8IG51bGxcIlxuICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgKG1vdXNlZG93bik9XCJfaGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2FmdGVyJywgJGV2ZW50KVwiXG4gICAgIChjbGljayk9XCJfaGFuZGxlUGFnaW5hdG9yQ2xpY2soJ2FmdGVyJylcIlxuICAgICAodG91Y2hlbmQpPVwiX3N0b3BJbnRlcnZhbCgpXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jaGV2cm9uXCI+PC9kaXY+XG48L2J1dHRvbj5cbiIsIjxzcGFuIGNsYXNzPVwibWRjLXRhYl9fcmlwcGxlXCI+PC9zcGFuPlxuXG48ZGl2XG4gIGNsYXNzPVwibWF0LW1kYy10YWItcmlwcGxlXCJcbiAgbWF0LXJpcHBsZVxuICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcIlxuICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwicmlwcGxlRGlzYWJsZWRcIj48L2Rpdj5cblxuPHNwYW4gY2xhc3M9XCJtZGMtdGFiX19jb250ZW50XCI+XG4gIDxzcGFuIGNsYXNzPVwibWRjLXRhYl9fdGV4dC1sYWJlbFwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9zcGFuPlxuPC9zcGFuPlxuXG4iXX0=