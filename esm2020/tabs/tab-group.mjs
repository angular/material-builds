/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Inject, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MAT_TAB_GROUP, MatTab } from './tab';
import { MAT_TABS_CONFIG } from './tab-config';
import * as i0 from "@angular/core";
import * as i1 from "./tab-header";
import * as i2 from "./tab-body";
import * as i3 from "@angular/common";
import * as i4 from "./tab-label-wrapper";
import * as i5 from "@angular/material/core";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/cdk/portal";
/** Used to generate unique ID's for each tab component */
let nextId = 0;
/** A simple change event emitted on focus or selection changes. */
export class MatTabChangeEvent {
}
// Boilerplate for applying mixins to MatTabGroup.
/** @docs-private */
const _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}), 'primary');
/**
 * Base class with all of the `MatTabGroupBase` functionality.
 * @docs-private
 */
export class _MatTabGroupBase extends _MatTabGroupMixinBase {
    constructor(elementRef, _changeDetectorRef, defaultConfig, _animationMode) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /** All of the tabs that belong to the group. */
        this._tabs = new QueryList();
        /** The tab index that should be selected after the content has been checked. */
        this._indexToSelect = 0;
        /** Snapshot of the height of the tab body wrapper before another tab is activated. */
        this._tabBodyWrapperHeight = 0;
        /** Subscription to tabs being added/removed. */
        this._tabsSubscription = Subscription.EMPTY;
        /** Subscription to changes in the tab labels. */
        this._tabLabelSubscription = Subscription.EMPTY;
        this._selectedIndex = null;
        /** Position of the tab header. */
        this.headerPosition = 'above';
        /** Output to enable support for two-way binding on `[(selectedIndex)]` */
        this.selectedIndexChange = new EventEmitter();
        /** Event emitted when focus has changed within a tab group. */
        this.focusChange = new EventEmitter();
        /** Event emitted when the body animation has completed */
        this.animationDone = new EventEmitter();
        /** Event emitted when the tab selection has changed. */
        this.selectedTabChange = new EventEmitter(true);
        this._groupId = nextId++;
        this.animationDuration =
            defaultConfig && defaultConfig.animationDuration ? defaultConfig.animationDuration : '500ms';
        this.disablePagination =
            defaultConfig && defaultConfig.disablePagination != null
                ? defaultConfig.disablePagination
                : false;
        this.dynamicHeight =
            defaultConfig && defaultConfig.dynamicHeight != null ? defaultConfig.dynamicHeight : false;
        this.contentTabIndex = defaultConfig?.contentTabIndex ?? null;
    }
    /** Whether the tab group should grow to the size of the active tab. */
    get dynamicHeight() {
        return this._dynamicHeight;
    }
    set dynamicHeight(value) {
        this._dynamicHeight = coerceBooleanProperty(value);
    }
    /** The index of the active tab. */
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        this._indexToSelect = coerceNumberProperty(value, null);
    }
    /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
    get animationDuration() {
        return this._animationDuration;
    }
    set animationDuration(value) {
        this._animationDuration = /^\d+$/.test(value + '') ? value + 'ms' : value;
    }
    /**
     * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
     * accessibility when the tab does not have focusable elements or if it has scrollable content.
     * The `tabindex` will be removed automatically for inactive tabs.
     * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
     */
    get contentTabIndex() {
        return this._contentTabIndex;
    }
    set contentTabIndex(value) {
        this._contentTabIndex = coerceNumberProperty(value, null);
    }
    /** Background color of the tab group. */
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(value) {
        const nativeElement = this._elementRef.nativeElement;
        nativeElement.classList.remove(`mat-background-${this.backgroundColor}`);
        if (value) {
            nativeElement.classList.add(`mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    ngAfterContentChecked() {
        // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
        // the amount of tabs changes before the actual change detection runs.
        const indexToSelect = (this._indexToSelect = this._clampTabIndex(this._indexToSelect));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect) {
            const isFirstRun = this._selectedIndex == null;
            if (!isFirstRun) {
                this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
                // Preserve the height so page doesn't scroll up during tab change.
                // Fixes https://stackblitz.com/edit/mat-tabs-scroll-page-top-on-tab-change
                const wrapper = this._tabBodyWrapper.nativeElement;
                wrapper.style.minHeight = wrapper.clientHeight + 'px';
            }
            // Changing these values after change detection has run
            // since the checked content may contain references to them.
            Promise.resolve().then(() => {
                this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));
                if (!isFirstRun) {
                    this.selectedIndexChange.emit(indexToSelect);
                    // Clear the min-height, this was needed during tab change to avoid
                    // unnecessary scrolling.
                    this._tabBodyWrapper.nativeElement.style.minHeight = '';
                }
            });
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach((tab, index) => {
            tab.position = index - indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - this._selectedIndex;
            }
        });
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._changeDetectorRef.markForCheck();
        }
    }
    ngAfterContentInit() {
        this._subscribeToAllTabChanges();
        this._subscribeToTabLabels();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe(() => {
            const indexToSelect = this._clampTabIndex(this._indexToSelect);
            // Maintain the previously-selected tab if a new tab is added or removed and there is no
            // explicit change that selects a different tab.
            if (indexToSelect === this._selectedIndex) {
                const tabs = this._tabs.toArray();
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].isActive) {
                        // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
                        // event, otherwise the consumer may end up in an infinite loop in some edge cases like
                        // adding a tab within the `selectedIndexChange` event.
                        this._indexToSelect = this._selectedIndex = i;
                        break;
                    }
                }
            }
            this._changeDetectorRef.markForCheck();
        });
    }
    /** Listens to changes in all of the tabs. */
    _subscribeToAllTabChanges() {
        // Since we use a query with `descendants: true` to pick up the tabs, we may end up catching
        // some that are inside of nested tab groups. We filter them out manually by checking that
        // the closest group to the tab is the current one.
        this._allTabs.changes.pipe(startWith(this._allTabs)).subscribe((tabs) => {
            this._tabs.reset(tabs.filter(tab => {
                return tab._closestTabGroup === this || !tab._closestTabGroup;
            }));
            this._tabs.notifyOnChanges();
        });
    }
    ngOnDestroy() {
        this._tabs.destroy();
        this._tabsSubscription.unsubscribe();
        this._tabLabelSubscription.unsubscribe();
    }
    /** Re-aligns the ink bar to the selected tab element. */
    realignInkBar() {
        if (this._tabHeader) {
            this._tabHeader._alignInkBarToSelectedTab();
        }
    }
    /**
     * Sets focus to a particular tab.
     * @param index Index of the tab to be focused.
     */
    focusTab(index) {
        const header = this._tabHeader;
        if (header) {
            header.focusIndex = index;
        }
    }
    _focusChanged(index) {
        this.focusChange.emit(this._createChangeEvent(index));
    }
    _createChangeEvent(index) {
        const event = new MatTabChangeEvent();
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    }
    /**
     * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     */
    _subscribeToTabLabels() {
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges)).subscribe(() => this._changeDetectorRef.markForCheck());
    }
    /** Clamps the given index to the bounds of 0 and the tabs length. */
    _clampTabIndex(index) {
        // Note the `|| 0`, which ensures that values like NaN can't get through
        // and which would otherwise throw the component into an infinite loop
        // (since Math.max(NaN, 0) === NaN).
        return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
    }
    /** Returns a unique id for each tab label element */
    _getTabLabelId(i) {
        return `mat-tab-label-${this._groupId}-${i}`;
    }
    /** Returns a unique id for each tab content element */
    _getTabContentId(i) {
        return `mat-tab-content-${this._groupId}-${i}`;
    }
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    _setTabBodyWrapperHeight(tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        const wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.height = this._tabBodyWrapperHeight + 'px';
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            wrapper.style.height = tabHeight + 'px';
        }
    }
    /** Removes the height of the tab body wrapper. */
    _removeTabBodyWrapperHeight() {
        const wrapper = this._tabBodyWrapper.nativeElement;
        this._tabBodyWrapperHeight = wrapper.clientHeight;
        wrapper.style.height = '';
        this.animationDone.emit();
    }
    /** Handle click events, setting new selected index if appropriate. */
    _handleClick(tab, tabHeader, index) {
        if (!tab.disabled) {
            this.selectedIndex = tabHeader.focusIndex = index;
        }
    }
    /** Retrieves the tabindex for the tab. */
    _getTabIndex(tab, idx) {
        if (tab.disabled) {
            return null;
        }
        return this.selectedIndex === idx ? 0 : -1;
    }
    /** Callback for when the focused state of a tab has changed. */
    _tabFocusChanged(focusOrigin, index) {
        // Mouse/touch focus happens during the `mousedown`/`touchstart` phase which
        // can cause the tab to be moved out from under the pointer, interrupting the
        // click sequence (see #21898). We don't need to scroll the tab into view for
        // such cases anyway, because it will be done when the tab becomes selected.
        if (focusOrigin && focusOrigin !== 'mouse' && focusOrigin !== 'touch') {
            this._tabHeader.focusIndex = index;
        }
    }
}
_MatTabGroupBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: _MatTabGroupBase, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_TABS_CONFIG, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatTabGroupBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0", type: _MatTabGroupBase, inputs: { dynamicHeight: "dynamicHeight", selectedIndex: "selectedIndex", headerPosition: "headerPosition", animationDuration: "animationDuration", contentTabIndex: "contentTabIndex", disablePagination: "disablePagination", backgroundColor: "backgroundColor" }, outputs: { selectedIndexChange: "selectedIndexChange", focusChange: "focusChange", animationDone: "animationDone", selectedTabChange: "selectedTabChange" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: _MatTabGroupBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TABS_CONFIG]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { dynamicHeight: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], headerPosition: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }], contentTabIndex: [{
                type: Input
            }], disablePagination: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], selectedIndexChange: [{
                type: Output
            }], focusChange: [{
                type: Output
            }], animationDone: [{
                type: Output
            }], selectedTabChange: [{
                type: Output
            }] } });
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
export class MatTabGroup extends _MatTabGroupBase {
    constructor(elementRef, changeDetectorRef, defaultConfig, animationMode) {
        super(elementRef, changeDetectorRef, defaultConfig, animationMode);
    }
}
MatTabGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatTabGroup, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_TABS_CONFIG, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTabGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.0", type: MatTabGroup, selector: "mat-tab-group", inputs: { color: "color", disableRipple: "disableRipple" }, host: { properties: { "class.mat-tab-group-dynamic-height": "dynamicHeight", "class.mat-tab-group-inverted-header": "headerPosition === \"below\"" }, classAttribute: "mat-tab-group" }, providers: [
        {
            provide: MAT_TAB_GROUP,
            useExisting: MatTabGroup,
        },
    ], queries: [{ propertyName: "_allTabs", predicate: MatTab, descendants: true }], viewQueries: [{ propertyName: "_tabBodyWrapper", first: true, predicate: ["tabBodyWrapper"], descendants: true }, { propertyName: "_tabHeader", first: true, predicate: ["tabHeader"], descendants: true }], exportAs: ["matTabGroup"], usesInheritance: true, ngImport: i0, template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\"\n       (cdkFocusChange)=\"_tabFocusChanged($event, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.tabindex]=\"(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex === i\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n", styles: [".mat-tab-group{display:flex;flex-direction:column;max-width:100%}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"], components: [{ type: i1.MatTabHeader, selector: "mat-tab-header", inputs: ["selectedIndex"], outputs: ["selectFocusedIndex", "indexFocused"] }, { type: i2.MatTabBody, selector: "mat-tab-body" }], directives: [{ type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i4.MatTabLabelWrapper, selector: "[matTabLabelWrapper]", inputs: ["disabled"] }, { type: i5.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i6.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i7.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0", ngImport: i0, type: MatTabGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab-group', exportAs: 'matTabGroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, inputs: ['color', 'disableRipple'], providers: [
                        {
                            provide: MAT_TAB_GROUP,
                            useExisting: MatTabGroup,
                        },
                    ], host: {
                        'class': 'mat-tab-group',
                        '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                        '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                    }, template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\"\n       (cdkFocusChange)=\"_tabFocusChanged($event, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.tabindex]=\"(contentTabIndex != null && selectedIndex === i) ? contentTabIndex : null\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex === i\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n", styles: [".mat-tab-group{display:flex;flex-direction:column;max-width:100%}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;outline:0;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TABS_CONFIG]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _allTabs: [{
                type: ContentChildren,
                args: [MatTab, { descendants: true }]
            }], _tabBodyWrapper: [{
                type: ViewChild,
                args: ['tabBodyWrapper']
            }], _tabHeader: [{
                type: ViewChild,
                args: ['tabHeader']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBR0wsVUFBVSxFQUNWLGtCQUFrQixHQUVuQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsYUFBYSxFQUFFLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM1QyxPQUFPLEVBQUMsZUFBZSxFQUFnQixNQUFNLGNBQWMsQ0FBQzs7Ozs7Ozs7O0FBRTVELDBEQUEwRDtBQUMxRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLGlCQUFpQjtDQUs3QjtBQUtELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQ3RDLGtCQUFrQixDQUNoQjtJQUNF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QUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRSxDQUFDOzt3R0FaVSxXQUFXLDZFQVFaLGVBQWUsNkJBQ0gscUJBQXFCOzRGQVRoQyxXQUFXLDZSQVpYO1FBQ1Q7WUFDRSxPQUFPLEVBQUUsYUFBYTtZQUN0QixXQUFXLEVBQUUsV0FBVztTQUN6QjtLQUNGLG1EQVFnQixNQUFNLCtTQ3RkekIsODdFQXFEQTsyRkRnYWEsV0FBVztrQkFyQnZCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGFBQWEsaUJBR1IsaUJBQWlCLENBQUMsSUFBSSxtQkFFcEIsdUJBQXVCLENBQUMsT0FBTyxVQUN4QyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsYUFDdkI7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGFBQWE7NEJBQ3RCLFdBQVcsYUFBYTt5QkFDekI7cUJBQ0YsUUFDSzt3QkFDSixPQUFPLEVBQUUsZUFBZTt3QkFDeEIsc0NBQXNDLEVBQUUsZUFBZTt3QkFDdkQsdUNBQXVDLEVBQUUsNEJBQTRCO3FCQUN0RTs7MEJBVUUsTUFBTTsyQkFBQyxlQUFlOzswQkFBRyxRQUFROzswQkFDakMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBUkcsUUFBUTtzQkFBckQsZUFBZTt1QkFBQyxNQUFNLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUNmLGVBQWU7c0JBQTNDLFNBQVM7dUJBQUMsZ0JBQWdCO2dCQUNILFVBQVU7c0JBQWpDLFNBQVM7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNQVRfVEFCX0dST1VQLCBNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TUFUX1RBQlNfQ09ORklHLCBNYXRUYWJzQ29uZmlnfSBmcm9tICcuL3RhYi1jb25maWcnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSUQncyBmb3IgZWFjaCB0YWIgY29tcG9uZW50ICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIG9uIGZvY3VzIG9yIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkNoYW5nZUV2ZW50IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICB0YWI6IE1hdFRhYjtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIHRhYiBoZWFkZXIuICovXG5leHBvcnQgdHlwZSBNYXRUYWJIZWFkZXJQb3NpdGlvbiA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYkdyb3VwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRUYWJHcm91cE1peGluQmFzZSA9IG1peGluQ29sb3IoXG4gIG1peGluRGlzYWJsZVJpcHBsZShcbiAgICBjbGFzcyB7XG4gICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gICAgfSxcbiAgKSxcbiAgJ3ByaW1hcnknLFxuKTtcblxuaW50ZXJmYWNlIE1hdFRhYkdyb3VwQmFzZUhlYWRlciB7XG4gIF9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWI6ICgpID0+IHZvaWQ7XG4gIGZvY3VzSW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiR3JvdXBCYXNlYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiR3JvdXBCYXNlXG4gIGV4dGVuZHMgX01hdFRhYkdyb3VwTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95LCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZVxue1xuICAvKipcbiAgICogQWxsIHRhYnMgaW5zaWRlIHRoZSB0YWIgZ3JvdXAuIFRoaXMgaW5jbHVkZXMgdGFicyB0aGF0IGJlbG9uZyB0byBncm91cHMgdGhhdCBhcmUgbmVzdGVkXG4gICAqIGluc2lkZSB0aGUgY3VycmVudCBvbmUuIFdlIGZpbHRlciBvdXQgb25seSB0aGUgdGFicyB0aGF0IGJlbG9uZyB0byB0aGlzIGdyb3VwIGluIGBfdGFic2AuXG4gICAqL1xuICBhYnN0cmFjdCBfYWxsVGFiczogUXVlcnlMaXN0PE1hdFRhYj47XG4gIGFic3RyYWN0IF90YWJCb2R5V3JhcHBlcjogRWxlbWVudFJlZjtcbiAgYWJzdHJhY3QgX3RhYkhlYWRlcjogTWF0VGFiR3JvdXBCYXNlSGVhZGVyO1xuXG4gIC8qKiBBbGwgb2YgdGhlIHRhYnMgdGhhdCBiZWxvbmcgdG8gdGhlIGdyb3VwLiAqL1xuICBfdGFiczogUXVlcnlMaXN0PE1hdFRhYj4gPSBuZXcgUXVlcnlMaXN0PE1hdFRhYj4oKTtcblxuICAvKiogVGhlIHRhYiBpbmRleCB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBhZnRlciB0aGUgY29udGVudCBoYXMgYmVlbiBjaGVja2VkLiAqL1xuICBwcml2YXRlIF9pbmRleFRvU2VsZWN0OiBudW1iZXIgfCBudWxsID0gMDtcblxuICAvKiogU25hcHNob3Qgb2YgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGJvZHkgd3JhcHBlciBiZWZvcmUgYW5vdGhlciB0YWIgaXMgYWN0aXZhdGVkLiAqL1xuICBwcml2YXRlIF90YWJCb2R5V3JhcHBlckhlaWdodDogbnVtYmVyID0gMDtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRhYnMgYmVpbmcgYWRkZWQvcmVtb3ZlZC4gKi9cbiAgcHJpdmF0ZSBfdGFic1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIGNoYW5nZXMgaW4gdGhlIHRhYiBsYWJlbHMuICovXG4gIHByaXZhdGUgX3RhYkxhYmVsU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgZ3JvdXAgc2hvdWxkIGdyb3cgdG8gdGhlIHNpemUgb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkeW5hbWljSGVpZ2h0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9keW5hbWljSGVpZ2h0O1xuICB9XG4gIHNldCBkeW5hbWljSGVpZ2h0KHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9keW5hbWljSGVpZ2h0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9keW5hbWljSGVpZ2h0OiBib29sZWFuO1xuXG4gIC8qKiBUaGUgaW5kZXggb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICB9XG4gIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2luZGV4VG9TZWxlY3QgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgbnVsbCk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSB0YWIgaGVhZGVyLiAqL1xuICBASW5wdXQoKSBoZWFkZXJQb3NpdGlvbjogTWF0VGFiSGVhZGVyUG9zaXRpb24gPSAnYWJvdmUnO1xuXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYiBhbmltYXRpb24uIFdpbGwgYmUgbm9ybWFsaXplZCB0byBtaWxsaXNlY29uZHMgaWYgbm8gdW5pdHMgYXJlIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uO1xuICB9XG4gIHNldCBhbmltYXRpb25EdXJhdGlvbih2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9hbmltYXRpb25EdXJhdGlvbiA9IC9eXFxkKyQvLnRlc3QodmFsdWUgKyAnJykgPyB2YWx1ZSArICdtcycgOiAodmFsdWUgYXMgc3RyaW5nKTtcbiAgfVxuICBwcml2YXRlIF9hbmltYXRpb25EdXJhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgdGFiaW5kZXhgIHRvIGJlIHNldCBvbiB0aGUgaW5uZXIgZWxlbWVudCB0aGF0IHdyYXBzIHRoZSB0YWIgY29udGVudC4gQ2FuIGJlIHVzZWQgZm9yIGltcHJvdmVkXG4gICAqIGFjY2Vzc2liaWxpdHkgd2hlbiB0aGUgdGFiIGRvZXMgbm90IGhhdmUgZm9jdXNhYmxlIGVsZW1lbnRzIG9yIGlmIGl0IGhhcyBzY3JvbGxhYmxlIGNvbnRlbnQuXG4gICAqIFRoZSBgdGFiaW5kZXhgIHdpbGwgYmUgcmVtb3ZlZCBhdXRvbWF0aWNhbGx5IGZvciBpbmFjdGl2ZSB0YWJzLlxuICAgKiBSZWFkIG1vcmUgYXQgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLXByYWN0aWNlcy9leGFtcGxlcy90YWJzL3RhYnMtMi90YWJzLmh0bWxcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb250ZW50VGFiSW5kZXgoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRUYWJJbmRleDtcbiAgfVxuICBzZXQgY29udGVudFRhYkluZGV4KHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2NvbnRlbnRUYWJJbmRleCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCBudWxsKTtcbiAgfVxuICBwcml2YXRlIF9jb250ZW50VGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgcGFnaW5hdGlvbiBzaG91bGQgYmUgZGlzYWJsZWQuIFRoaXMgY2FuIGJlIHVzZWQgdG8gYXZvaWQgdW5uZWNlc3NhcnlcbiAgICogbGF5b3V0IHJlY2FsY3VsYXRpb25zIGlmIGl0J3Mga25vd24gdGhhdCBwYWdpbmF0aW9uIHdvbid0IGJlIHJlcXVpcmVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZGlzYWJsZVBhZ2luYXRpb246IGJvb2xlYW47XG5cbiAgLyoqIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQ29sb3I7XG4gIH1cbiAgc2V0IGJhY2tncm91bmRDb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWNrZ3JvdW5kLSR7dGhpcy5iYWNrZ3JvdW5kQ29sb3J9YCk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9iYWNrZ3JvdW5kQ29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogT3V0cHV0IHRvIGVuYWJsZSBzdXBwb3J0IGZvciB0d28td2F5IGJpbmRpbmcgb24gYFsoc2VsZWN0ZWRJbmRleCldYCAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRJbmRleENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGZvY3VzIGhhcyBjaGFuZ2VkIHdpdGhpbiBhIHRhYiBncm91cC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGZvY3VzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGJvZHkgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0YWIgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRUYWJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+KHRydWUpO1xuXG4gIHByaXZhdGUgX2dyb3VwSWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoTUFUX1RBQlNfQ09ORklHKSBAT3B0aW9uYWwoKSBkZWZhdWx0Q29uZmlnPzogTWF0VGFic0NvbmZpZyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9ncm91cElkID0gbmV4dElkKys7XG4gICAgdGhpcy5hbmltYXRpb25EdXJhdGlvbiA9XG4gICAgICBkZWZhdWx0Q29uZmlnICYmIGRlZmF1bHRDb25maWcuYW5pbWF0aW9uRHVyYXRpb24gPyBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uIDogJzUwMG1zJztcbiAgICB0aGlzLmRpc2FibGVQYWdpbmF0aW9uID1cbiAgICAgIGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiAhPSBudWxsXG4gICAgICAgID8gZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvblxuICAgICAgICA6IGZhbHNlO1xuICAgIHRoaXMuZHluYW1pY0hlaWdodCA9XG4gICAgICBkZWZhdWx0Q29uZmlnICYmIGRlZmF1bHRDb25maWcuZHluYW1pY0hlaWdodCAhPSBudWxsID8gZGVmYXVsdENvbmZpZy5keW5hbWljSGVpZ2h0IDogZmFsc2U7XG4gICAgdGhpcy5jb250ZW50VGFiSW5kZXggPSBkZWZhdWx0Q29uZmlnPy5jb250ZW50VGFiSW5kZXggPz8gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZnRlciB0aGUgY29udGVudCBpcyBjaGVja2VkLCB0aGlzIGNvbXBvbmVudCBrbm93cyB3aGF0IHRhYnMgaGF2ZSBiZWVuIGRlZmluZWRcbiAgICogYW5kIHdoYXQgdGhlIHNlbGVjdGVkIGluZGV4IHNob3VsZCBiZS4gVGhpcyBpcyB3aGVyZSB3ZSBjYW4ga25vdyBleGFjdGx5IHdoYXQgcG9zaXRpb25cbiAgICogZWFjaCB0YWIgc2hvdWxkIGJlIGluIGFjY29yZGluZyB0byB0aGUgbmV3IHNlbGVjdGVkIGluZGV4LCBhbmQgYWRkaXRpb25hbGx5IHdlIGtub3cgaG93XG4gICAqIGEgbmV3IHNlbGVjdGVkIHRhYiBzaG91bGQgdHJhbnNpdGlvbiBpbiAoZnJvbSB0aGUgbGVmdCBvciByaWdodCkuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gRG9uJ3QgY2xhbXAgdGhlIGBpbmRleFRvU2VsZWN0YCBpbW1lZGlhdGVseSBpbiB0aGUgc2V0dGVyIGJlY2F1c2UgaXQgY2FuIGhhcHBlbiB0aGF0XG4gICAgLy8gdGhlIGFtb3VudCBvZiB0YWJzIGNoYW5nZXMgYmVmb3JlIHRoZSBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zLlxuICAgIGNvbnN0IGluZGV4VG9TZWxlY3QgPSAodGhpcy5faW5kZXhUb1NlbGVjdCA9IHRoaXMuX2NsYW1wVGFiSW5kZXgodGhpcy5faW5kZXhUb1NlbGVjdCkpO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBjaGFuZ2UgaW4gc2VsZWN0ZWQgaW5kZXgsIGVtaXQgYSBjaGFuZ2UgZXZlbnQuIFNob3VsZCBub3QgdHJpZ2dlciBpZlxuICAgIC8vIHRoZSBzZWxlY3RlZCBpbmRleCBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIGNvbnN0IGlzRmlyc3RSdW4gPSB0aGlzLl9zZWxlY3RlZEluZGV4ID09IG51bGw7XG5cbiAgICAgIGlmICghaXNGaXJzdFJ1bikge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGFiQ2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXhUb1NlbGVjdCkpO1xuICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgaGVpZ2h0IHNvIHBhZ2UgZG9lc24ndCBzY3JvbGwgdXAgZHVyaW5nIHRhYiBjaGFuZ2UuXG4gICAgICAgIC8vIEZpeGVzIGh0dHBzOi8vc3RhY2tibGl0ei5jb20vZWRpdC9tYXQtdGFicy1zY3JvbGwtcGFnZS10b3Atb24tdGFiLWNoYW5nZVxuICAgICAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcbiAgICAgICAgd3JhcHBlci5zdHlsZS5taW5IZWlnaHQgPSB3cmFwcGVyLmNsaWVudEhlaWdodCArICdweCc7XG4gICAgICB9XG5cbiAgICAgIC8vIENoYW5naW5nIHRoZXNlIHZhbHVlcyBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBydW5cbiAgICAgIC8vIHNpbmNlIHRoZSBjaGVja2VkIGNvbnRlbnQgbWF5IGNvbnRhaW4gcmVmZXJlbmNlcyB0byB0aGVtLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4gKHRhYi5pc0FjdGl2ZSA9IGluZGV4ID09PSBpbmRleFRvU2VsZWN0KSk7XG5cbiAgICAgICAgaWYgKCFpc0ZpcnN0UnVuKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4Q2hhbmdlLmVtaXQoaW5kZXhUb1NlbGVjdCk7XG4gICAgICAgICAgLy8gQ2xlYXIgdGhlIG1pbi1oZWlnaHQsIHRoaXMgd2FzIG5lZWRlZCBkdXJpbmcgdGFiIGNoYW5nZSB0byBhdm9pZFxuICAgICAgICAgIC8vIHVubmVjZXNzYXJ5IHNjcm9sbGluZy5cbiAgICAgICAgICB0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9ICcnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXR1cCB0aGUgcG9zaXRpb24gZm9yIGVhY2ggdGFiIGFuZCBvcHRpb25hbGx5IHNldHVwIGFuIG9yaWdpbiBvbiB0aGUgbmV4dCBzZWxlY3RlZCB0YWIuXG4gICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWI6IE1hdFRhYiwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgdGFiLnBvc2l0aW9uID0gaW5kZXggLSBpbmRleFRvU2VsZWN0O1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGEgc2VsZWN0ZWQgdGFiLCB0aGVuIHNldCB1cCBhbiBvcmlnaW4gZm9yIHRoZSBuZXh0IHNlbGVjdGVkIHRhYlxuICAgICAgLy8gaWYgaXQgZG9lc24ndCBoYXZlIG9uZSBhbHJlYWR5LlxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gbnVsbCAmJiB0YWIucG9zaXRpb24gPT0gMCAmJiAhdGFiLm9yaWdpbikge1xuICAgICAgICB0YWIub3JpZ2luID0gaW5kZXhUb1NlbGVjdCAtIHRoaXMuX3NlbGVjdGVkSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPT0gaW5kZXhUb1NlbGVjdCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleCA9IGluZGV4VG9TZWxlY3Q7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9BbGxUYWJDaGFuZ2VzKCk7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9UYWJMYWJlbHMoKTtcblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBhbW91bnQgb2YgdGFicywgaW4gb3JkZXIgdG8gYmVcbiAgICAvLyBhYmxlIHRvIHJlLXJlbmRlciB0aGUgY29udGVudCBhcyBuZXcgdGFicyBhcmUgYWRkZWQgb3IgcmVtb3ZlZC5cbiAgICB0aGlzLl90YWJzU3Vic2NyaXB0aW9uID0gdGhpcy5fdGFicy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvU2VsZWN0ID0gdGhpcy5fY2xhbXBUYWJJbmRleCh0aGlzLl9pbmRleFRvU2VsZWN0KTtcblxuICAgICAgLy8gTWFpbnRhaW4gdGhlIHByZXZpb3VzbHktc2VsZWN0ZWQgdGFiIGlmIGEgbmV3IHRhYiBpcyBhZGRlZCBvciByZW1vdmVkIGFuZCB0aGVyZSBpcyBub1xuICAgICAgLy8gZXhwbGljaXQgY2hhbmdlIHRoYXQgc2VsZWN0cyBhIGRpZmZlcmVudCB0YWIuXG4gICAgICBpZiAoaW5kZXhUb1NlbGVjdCA9PT0gdGhpcy5fc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICBjb25zdCB0YWJzID0gdGhpcy5fdGFicy50b0FycmF5KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRhYnNbaV0uaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIC8vIEFzc2lnbiBib3RoIHRvIHRoZSBgX2luZGV4VG9TZWxlY3RgIGFuZCBgX3NlbGVjdGVkSW5kZXhgIHNvIHdlIGRvbid0IGZpcmUgYSBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBldmVudCwgb3RoZXJ3aXNlIHRoZSBjb25zdW1lciBtYXkgZW5kIHVwIGluIGFuIGluZmluaXRlIGxvb3AgaW4gc29tZSBlZGdlIGNhc2VzIGxpa2VcbiAgICAgICAgICAgIC8vIGFkZGluZyBhIHRhYiB3aXRoaW4gdGhlIGBzZWxlY3RlZEluZGV4Q2hhbmdlYCBldmVudC5cbiAgICAgICAgICAgIHRoaXMuX2luZGV4VG9TZWxlY3QgPSB0aGlzLl9zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gYWxsIG9mIHRoZSB0YWJzLiAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0FsbFRhYkNoYW5nZXMoKSB7XG4gICAgLy8gU2luY2Ugd2UgdXNlIGEgcXVlcnkgd2l0aCBgZGVzY2VuZGFudHM6IHRydWVgIHRvIHBpY2sgdXAgdGhlIHRhYnMsIHdlIG1heSBlbmQgdXAgY2F0Y2hpbmdcbiAgICAvLyBzb21lIHRoYXQgYXJlIGluc2lkZSBvZiBuZXN0ZWQgdGFiIGdyb3Vwcy4gV2UgZmlsdGVyIHRoZW0gb3V0IG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoYXRcbiAgICAvLyB0aGUgY2xvc2VzdCBncm91cCB0byB0aGUgdGFiIGlzIHRoZSBjdXJyZW50IG9uZS5cbiAgICB0aGlzLl9hbGxUYWJzLmNoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5fYWxsVGFicykpLnN1YnNjcmliZSgodGFiczogUXVlcnlMaXN0PE1hdFRhYj4pID0+IHtcbiAgICAgIHRoaXMuX3RhYnMucmVzZXQoXG4gICAgICAgIHRhYnMuZmlsdGVyKHRhYiA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRhYi5fY2xvc2VzdFRhYkdyb3VwID09PSB0aGlzIHx8ICF0YWIuX2Nsb3Nlc3RUYWJHcm91cDtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgdGhpcy5fdGFicy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3RhYnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFJlLWFsaWducyB0aGUgaW5rIGJhciB0byB0aGUgc2VsZWN0ZWQgdGFiIGVsZW1lbnQuICovXG4gIHJlYWxpZ25JbmtCYXIoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkhlYWRlcikge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb2N1cyB0byBhIHBhcnRpY3VsYXIgdGFiLlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIHRhYiB0byBiZSBmb2N1c2VkLlxuICAgKi9cbiAgZm9jdXNUYWIoaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuX3RhYkhlYWRlcjtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGhlYWRlci5mb2N1c0luZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgX2ZvY3VzQ2hhbmdlZChpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5mb2N1c0NoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4KSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVDaGFuZ2VFdmVudChpbmRleDogbnVtYmVyKTogTWF0VGFiQ2hhbmdlRXZlbnQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdFRhYkNoYW5nZUV2ZW50KCk7XG4gICAgZXZlbnQuaW5kZXggPSBpbmRleDtcbiAgICBpZiAodGhpcy5fdGFicyAmJiB0aGlzLl90YWJzLmxlbmd0aCkge1xuICAgICAgZXZlbnQudGFiID0gdGhpcy5fdGFicy50b0FycmF5KClbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiBUaGlzIGlzIG5lZWRlZCwgYmVjYXVzZSB0aGUgQElucHV0IGZvciB0aGUgbGFiZWwgaXNcbiAgICogb24gdGhlIE1hdFRhYiBjb21wb25lbnQsIHdoZXJlYXMgdGhlIGRhdGEgYmluZGluZyBpcyBpbnNpZGUgdGhlIE1hdFRhYkdyb3VwLiBJbiBvcmRlciBmb3IgdGhlXG4gICAqIGJpbmRpbmcgdG8gYmUgdXBkYXRlZCwgd2UgbmVlZCB0byBzdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiBpdCBhbmQgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAqIG1hbnVhbGx5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9UYWJMYWJlbHMoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4udGhpcy5fdGFicy5tYXAodGFiID0+IHRhYi5fc3RhdGVDaGFuZ2VzKSkuc3Vic2NyaWJlKCgpID0+XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIENsYW1wcyB0aGUgZ2l2ZW4gaW5kZXggdG8gdGhlIGJvdW5kcyBvZiAwIGFuZCB0aGUgdGFicyBsZW5ndGguICovXG4gIHByaXZhdGUgX2NsYW1wVGFiSW5kZXgoaW5kZXg6IG51bWJlciB8IG51bGwpOiBudW1iZXIge1xuICAgIC8vIE5vdGUgdGhlIGB8fCAwYCwgd2hpY2ggZW5zdXJlcyB0aGF0IHZhbHVlcyBsaWtlIE5hTiBjYW4ndCBnZXQgdGhyb3VnaFxuICAgIC8vIGFuZCB3aGljaCB3b3VsZCBvdGhlcndpc2UgdGhyb3cgdGhlIGNvbXBvbmVudCBpbnRvIGFuIGluZmluaXRlIGxvb3BcbiAgICAvLyAoc2luY2UgTWF0aC5tYXgoTmFOLCAwKSA9PT0gTmFOKS5cbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5fdGFicy5sZW5ndGggLSAxLCBNYXRoLm1heChpbmRleCB8fCAwLCAwKSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB0YWIgbGFiZWwgZWxlbWVudCAqL1xuICBfZ2V0VGFiTGFiZWxJZChpOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbWF0LXRhYi1sYWJlbC0ke3RoaXMuX2dyb3VwSWR9LSR7aX1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggdGFiIGNvbnRlbnQgZWxlbWVudCAqL1xuICBfZ2V0VGFiQ29udGVudElkKGk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBtYXQtdGFiLWNvbnRlbnQtJHt0aGlzLl9ncm91cElkfS0ke2l9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIGJvZHkgd3JhcHBlciB0byB0aGUgaGVpZ2h0IG9mIHRoZSBhY3RpdmF0aW5nIHRhYiBpZiBkeW5hbWljXG4gICAqIGhlaWdodCBwcm9wZXJ0eSBpcyB0cnVlLlxuICAgKi9cbiAgX3NldFRhYkJvZHlXcmFwcGVySGVpZ2h0KHRhYkhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9keW5hbWljSGVpZ2h0IHx8ICF0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdyYXBwZXI6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcblxuICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gVGhpcyBjb25kaXRpb25hbCBmb3JjZXMgdGhlIGJyb3dzZXIgdG8gcGFpbnQgdGhlIGhlaWdodCBzbyB0aGF0XG4gICAgLy8gdGhlIGFuaW1hdGlvbiB0byB0aGUgbmV3IGhlaWdodCBjYW4gaGF2ZSBhbiBvcmlnaW4uXG4gICAgaWYgKHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IHRhYkhlaWdodCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGJvZHkgd3JhcHBlci4gKi9cbiAgX3JlbW92ZVRhYkJvZHlXcmFwcGVySGVpZ2h0KCk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQ7XG4gICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBjbGljayBldmVudHMsIHNldHRpbmcgbmV3IHNlbGVjdGVkIGluZGV4IGlmIGFwcHJvcHJpYXRlLiAqL1xuICBfaGFuZGxlQ2xpY2sodGFiOiBNYXRUYWIsIHRhYkhlYWRlcjogTWF0VGFiR3JvdXBCYXNlSGVhZGVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0YWIuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRhYkhlYWRlci5mb2N1c0luZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgdGFiaW5kZXggZm9yIHRoZSB0YWIuICovXG4gIF9nZXRUYWJJbmRleCh0YWI6IE1hdFRhYiwgaWR4OiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAodGFiLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gaWR4ID8gMCA6IC0xO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIGZvciB3aGVuIHRoZSBmb2N1c2VkIHN0YXRlIG9mIGEgdGFiIGhhcyBjaGFuZ2VkLiAqL1xuICBfdGFiRm9jdXNDaGFuZ2VkKGZvY3VzT3JpZ2luOiBGb2N1c09yaWdpbiwgaW5kZXg6IG51bWJlcikge1xuICAgIC8vIE1vdXNlL3RvdWNoIGZvY3VzIGhhcHBlbnMgZHVyaW5nIHRoZSBgbW91c2Vkb3duYC9gdG91Y2hzdGFydGAgcGhhc2Ugd2hpY2hcbiAgICAvLyBjYW4gY2F1c2UgdGhlIHRhYiB0byBiZSBtb3ZlZCBvdXQgZnJvbSB1bmRlciB0aGUgcG9pbnRlciwgaW50ZXJydXB0aW5nIHRoZVxuICAgIC8vIGNsaWNrIHNlcXVlbmNlIChzZWUgIzIxODk4KS4gV2UgZG9uJ3QgbmVlZCB0byBzY3JvbGwgdGhlIHRhYiBpbnRvIHZpZXcgZm9yXG4gICAgLy8gc3VjaCBjYXNlcyBhbnl3YXksIGJlY2F1c2UgaXQgd2lsbCBiZSBkb25lIHdoZW4gdGhlIHRhYiBiZWNvbWVzIHNlbGVjdGVkLlxuICAgIGlmIChmb2N1c09yaWdpbiAmJiBmb2N1c09yaWdpbiAhPT0gJ21vdXNlJyAmJiBmb2N1c09yaWdpbiAhPT0gJ3RvdWNoJykge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLmZvY3VzSW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gdGFiLWdyb3VwIGNvbXBvbmVudC4gU3VwcG9ydHMgYmFzaWMgdGFiIHBhaXJzIChsYWJlbCArIGNvbnRlbnQpIGFuZCBpbmNsdWRlc1xuICogYW5pbWF0ZWQgaW5rLWJhciwga2V5Ym9hcmQgbmF2aWdhdGlvbiwgYW5kIHNjcmVlbiByZWFkZXIuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdGFicy5odG1sXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFRhYkdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItZ3JvdXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTUFUX1RBQl9HUk9VUCxcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXRUYWJHcm91cCxcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItZ3JvdXAnLFxuICAgICdbY2xhc3MubWF0LXRhYi1ncm91cC1keW5hbWljLWhlaWdodF0nOiAnZHluYW1pY0hlaWdodCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWludmVydGVkLWhlYWRlcl0nOiAnaGVhZGVyUG9zaXRpb24gPT09IFwiYmVsb3dcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwIGV4dGVuZHMgX01hdFRhYkdyb3VwQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsVGFiczogUXVlcnlMaXN0PE1hdFRhYj47XG4gIEBWaWV3Q2hpbGQoJ3RhYkJvZHlXcmFwcGVyJykgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJIZWFkZXInKSBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfVEFCU19DT05GSUcpIEBPcHRpb25hbCgpIGRlZmF1bHRDb25maWc/OiBNYXRUYWJzQ29uZmlnLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvclJlZiwgZGVmYXVsdENvbmZpZywgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiIsIjxtYXQtdGFiLWhlYWRlciAjdGFiSGVhZGVyXG4gICAgICAgICAgICAgICBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4IHx8IDBcIlxuICAgICAgICAgICAgICAgW2Rpc2FibGVSaXBwbGVdPVwiZGlzYWJsZVJpcHBsZVwiXG4gICAgICAgICAgICAgICBbZGlzYWJsZVBhZ2luYXRpb25dPVwiZGlzYWJsZVBhZ2luYXRpb25cIlxuICAgICAgICAgICAgICAgKGluZGV4Rm9jdXNlZCk9XCJfZm9jdXNDaGFuZ2VkKCRldmVudClcIlxuICAgICAgICAgICAgICAgKHNlbGVjdEZvY3VzZWRJbmRleCk9XCJzZWxlY3RlZEluZGV4ID0gJGV2ZW50XCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWxhYmVsIG1hdC1mb2N1cy1pbmRpY2F0b3JcIiByb2xlPVwidGFiXCIgbWF0VGFiTGFiZWxXcmFwcGVyIG1hdC1yaXBwbGUgY2RrTW9uaXRvckVsZW1lbnRGb2N1c1xuICAgICAgICpuZ0Zvcj1cImxldCB0YWIgb2YgX3RhYnM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgIFtpZF09XCJfZ2V0VGFiTGFiZWxJZChpKVwiXG4gICAgICAgW2F0dHIudGFiSW5kZXhdPVwiX2dldFRhYkluZGV4KHRhYiwgaSlcIlxuICAgICAgIFthdHRyLmFyaWEtcG9zaW5zZXRdPVwiaSArIDFcIlxuICAgICAgIFthdHRyLmFyaWEtc2V0c2l6ZV09XCJfdGFicy5sZW5ndGhcIlxuICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiX2dldFRhYkNvbnRlbnRJZChpKVwiXG4gICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJzZWxlY3RlZEluZGV4ID09IGlcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwidGFiLmFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiKCF0YWIuYXJpYUxhYmVsICYmIHRhYi5hcmlhTGFiZWxsZWRieSkgPyB0YWIuYXJpYUxhYmVsbGVkYnkgOiBudWxsXCJcbiAgICAgICBbY2xhc3MubWF0LXRhYi1sYWJlbC1hY3RpdmVdPVwic2VsZWN0ZWRJbmRleCA9PSBpXCJcbiAgICAgICBbZGlzYWJsZWRdPVwidGFiLmRpc2FibGVkXCJcbiAgICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwidGFiLmRpc2FibGVkIHx8IGRpc2FibGVSaXBwbGVcIlxuICAgICAgIChjbGljayk9XCJfaGFuZGxlQ2xpY2sodGFiLCB0YWJIZWFkZXIsIGkpXCJcbiAgICAgICAoY2RrRm9jdXNDaGFuZ2UpPVwiX3RhYkZvY3VzQ2hhbmdlZCgkZXZlbnQsIGkpXCI+XG5cblxuICAgIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWxhYmVsLWNvbnRlbnRcIj5cbiAgICAgIDwhLS0gSWYgdGhlcmUgaXMgYSBsYWJlbCB0ZW1wbGF0ZSwgdXNlIGl0LiAtLT5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJ0YWIudGVtcGxhdGVMYWJlbFwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF09XCJ0YWIudGVtcGxhdGVMYWJlbFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICA8IS0tIElmIHRoZXJlIGlzIG5vdCBhIGxhYmVsIHRlbXBsYXRlLCBmYWxsIGJhY2sgdG8gdGhlIHRleHQgbGFiZWwuIC0tPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cIiF0YWIudGVtcGxhdGVMYWJlbFwiPnt7dGFiLnRleHRMYWJlbH19PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L21hdC10YWItaGVhZGVyPlxuXG48ZGl2XG4gIGNsYXNzPVwibWF0LXRhYi1ib2R5LXdyYXBwZXJcIlxuICBbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdPVwiX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydcIlxuICAjdGFiQm9keVdyYXBwZXI+XG4gIDxtYXQtdGFiLWJvZHkgcm9sZT1cInRhYnBhbmVsXCJcbiAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCB0YWIgb2YgX3RhYnM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgW2lkXT1cIl9nZXRUYWJDb250ZW50SWQoaSlcIlxuICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiKGNvbnRlbnRUYWJJbmRleCAhPSBudWxsICYmIHNlbGVjdGVkSW5kZXggPT09IGkpID8gY29udGVudFRhYkluZGV4IDogbnVsbFwiXG4gICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFRhYkxhYmVsSWQoaSlcIlxuICAgICAgICAgICAgICAgW2NsYXNzLm1hdC10YWItYm9keS1hY3RpdmVdPVwic2VsZWN0ZWRJbmRleCA9PT0gaVwiXG4gICAgICAgICAgICAgICBbY29udGVudF09XCJ0YWIuY29udGVudCFcIlxuICAgICAgICAgICAgICAgW3Bvc2l0aW9uXT1cInRhYi5wb3NpdGlvbiFcIlxuICAgICAgICAgICAgICAgW29yaWdpbl09XCJ0YWIub3JpZ2luXCJcbiAgICAgICAgICAgICAgIFthbmltYXRpb25EdXJhdGlvbl09XCJhbmltYXRpb25EdXJhdGlvblwiXG4gICAgICAgICAgICAgICAoX29uQ2VudGVyZWQpPVwiX3JlbW92ZVRhYkJvZHlXcmFwcGVySGVpZ2h0KClcIlxuICAgICAgICAgICAgICAgKF9vbkNlbnRlcmluZyk9XCJfc2V0VGFiQm9keVdyYXBwZXJIZWlnaHQoJGV2ZW50KVwiPlxuICA8L21hdC10YWItYm9keT5cbjwvZGl2PlxuIl19