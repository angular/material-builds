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
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewEncapsulation, Optional, Inject, InjectionToken, Directive, } from '@angular/core';
import { mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatTab, MAT_TAB_GROUP } from './tab';
/**
 * Used to generate unique ID's for each tab component
 * @type {?}
 */
let nextId = 0;
/**
 * A simple change event emitted on focus or selection changes.
 */
export class MatTabChangeEvent {
}
if (false) {
    /**
     * Index of the currently-selected tab.
     * @type {?}
     */
    MatTabChangeEvent.prototype.index;
    /**
     * Reference to the currently-selected tab.
     * @type {?}
     */
    MatTabChangeEvent.prototype.tab;
}
/**
 * Object that can be used to configure the default options for the tabs module.
 * @record
 */
export function MatTabsConfig() { }
if (false) {
    /**
     * Duration for the tab animation. Must be a valid CSS value (e.g. 600ms).
     * @type {?|undefined}
     */
    MatTabsConfig.prototype.animationDuration;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     * @type {?|undefined}
     */
    MatTabsConfig.prototype.disablePagination;
}
/**
 * Injection token that can be used to provide the default options the tabs module.
 * @type {?}
 */
export const MAT_TABS_CONFIG = new InjectionToken('MAT_TABS_CONFIG');
// Boilerplate for applying mixins to MatTabGroup.
/**
 * \@docs-private
 */
class MatTabGroupMixinBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatTabGroupMixinBase.prototype._elementRef;
}
/** @type {?} */
const _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(MatTabGroupMixinBase), 'primary');
/**
 * @record
 */
function MatTabGroupBaseHeader() { }
if (false) {
    /** @type {?} */
    MatTabGroupBaseHeader.prototype._alignInkBarToSelectedTab;
    /** @type {?} */
    MatTabGroupBaseHeader.prototype.focusIndex;
}
/**
 * Base class with all of the `MatTabGroupBase` functionality.
 * \@docs-private
 * @abstract
 */
// tslint:disable-next-line:class-name
export class _MatTabGroupBase extends _MatTabGroupMixinBase {
    /**
     * @param {?} elementRef
     * @param {?} _changeDetectorRef
     * @param {?=} defaultConfig
     * @param {?=} _animationMode
     */
    constructor(elementRef, _changeDetectorRef, defaultConfig, _animationMode) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        /**
         * All of the tabs that belong to the group.
         */
        this._tabs = new QueryList();
        /**
         * We need to store the tabs in an Iterable due to strict template type checking with *ngFor and
         * https://github.com/angular/angular/issues/29842.
         */
        this._tabsArray = [];
        /**
         * The tab index that should be selected after the content has been checked.
         */
        this._indexToSelect = 0;
        /**
         * Snapshot of the height of the tab body wrapper before another tab is activated.
         */
        this._tabBodyWrapperHeight = 0;
        /**
         * Subscription to tabs being added/removed.
         */
        this._tabsSubscription = Subscription.EMPTY;
        /**
         * Subscription to changes in the tab labels.
         */
        this._tabLabelSubscription = Subscription.EMPTY;
        this._dynamicHeight = false;
        this._selectedIndex = null;
        /**
         * Position of the tab header.
         */
        this.headerPosition = 'above';
        /**
         * Output to enable support for two-way binding on `[(selectedIndex)]`
         */
        this.selectedIndexChange = new EventEmitter();
        /**
         * Event emitted when focus has changed within a tab group.
         */
        this.focusChange = new EventEmitter();
        /**
         * Event emitted when the body animation has completed
         */
        this.animationDone = new EventEmitter();
        /**
         * Event emitted when the tab selection has changed.
         */
        this.selectedTabChange = new EventEmitter(true);
        this._groupId = nextId++;
        this.animationDuration = defaultConfig && defaultConfig.animationDuration ?
            defaultConfig.animationDuration : '500ms';
        this.disablePagination = defaultConfig && defaultConfig.disablePagination != null ?
            defaultConfig.disablePagination : false;
    }
    /**
     * Whether the tab group should grow to the size of the active tab.
     * @return {?}
     */
    get dynamicHeight() { return this._dynamicHeight; }
    /**
     * @param {?} value
     * @return {?}
     */
    set dynamicHeight(value) { this._dynamicHeight = coerceBooleanProperty(value); }
    /**
     * The index of the active tab.
     * @return {?}
     */
    get selectedIndex() { return this._selectedIndex; }
    /**
     * @param {?} value
     * @return {?}
     */
    set selectedIndex(value) {
        this._indexToSelect = coerceNumberProperty(value, null);
    }
    /**
     * Duration for the tab animation. Will be normalized to milliseconds if no units are set.
     * @return {?}
     */
    get animationDuration() { return this._animationDuration; }
    /**
     * @param {?} value
     * @return {?}
     */
    set animationDuration(value) {
        this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
    }
    /**
     * Background color of the tab group.
     * @return {?}
     */
    get backgroundColor() { return this._backgroundColor; }
    /**
     * @param {?} value
     * @return {?}
     */
    set backgroundColor(value) {
        /** @type {?} */
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
     * @return {?}
     */
    ngAfterContentChecked() {
        // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
        // the amount of tabs changes before the actual change detection runs.
        /** @type {?} */
        const indexToSelect = this._indexToSelect = this._clampTabIndex(this._indexToSelect);
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect) {
            /** @type {?} */
            const isFirstRun = this._selectedIndex == null;
            if (!isFirstRun) {
                this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
            }
            // Changing these values after change detection has run
            // since the checked content may contain references to them.
            Promise.resolve().then((/**
             * @return {?}
             */
            () => {
                this._tabs.forEach((/**
                 * @param {?} tab
                 * @param {?} index
                 * @return {?}
                 */
                (tab, index) => tab.isActive = index === indexToSelect));
                if (!isFirstRun) {
                    this.selectedIndexChange.emit(indexToSelect);
                }
            }));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach((/**
         * @param {?} tab
         * @param {?} index
         * @return {?}
         */
        (tab, index) => {
            tab.position = index - indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - this._selectedIndex;
            }
        }));
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._subscribeToAllTabChanges();
        this._subscribeToTabLabels();
        this._tabsArray = this._tabs.toArray();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const indexToSelect = this._clampTabIndex(this._indexToSelect);
            this._tabsArray = this._tabs.toArray();
            // Maintain the previously-selected tab if a new tab is added or removed and there is no
            // explicit change that selects a different tab.
            if (indexToSelect === this._selectedIndex) {
                for (let i = 0; i < this._tabsArray.length; i++) {
                    if (this._tabsArray[i].isActive) {
                        // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
                        // event, otherwise the consumer may end up in an infinite loop in some edge cases like
                        // adding a tab within the `selectedIndexChange` event.
                        this._indexToSelect = this._selectedIndex = i;
                        break;
                    }
                }
            }
            this._changeDetectorRef.markForCheck();
        }));
    }
    /**
     * Listens to changes in all of the tabs.
     * @private
     * @return {?}
     */
    _subscribeToAllTabChanges() {
        // Since we use a query with `descendants: true` to pick up the tabs, we may end up catching
        // some that are inside of nested tab groups. We filter them out manually by checking that
        // the closest group to the tab is the current one.
        this._allTabs.changes
            .pipe(startWith(this._allTabs))
            .subscribe((/**
         * @param {?} tabs
         * @return {?}
         */
        (tabs) => {
            this._tabs.reset(tabs.filter((/**
             * @param {?} tab
             * @return {?}
             */
            tab => {
                // @breaking-change 10.0.0 Remove null check for `_closestTabGroup`
                // once it becomes a required parameter in MatTab.
                return !tab._closestTabGroup || tab._closestTabGroup === this;
            })));
            this._tabs.notifyOnChanges();
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._tabsSubscription.unsubscribe();
        this._tabLabelSubscription.unsubscribe();
    }
    /**
     * Re-aligns the ink bar to the selected tab element.
     * @return {?}
     */
    realignInkBar() {
        if (this._tabHeader) {
            this._tabHeader._alignInkBarToSelectedTab();
        }
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _focusChanged(index) {
        this.focusChange.emit(this._createChangeEvent(index));
    }
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    _createChangeEvent(index) {
        /** @type {?} */
        const event = new MatTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    }
    /**
     * Subscribes to changes in the tab labels. This is needed, because the \@Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     * @private
     * @return {?}
     */
    _subscribeToTabLabels() {
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge(...this._tabs.map((/**
         * @param {?} tab
         * @return {?}
         */
        tab => tab._stateChanges)))
            .subscribe((/**
         * @return {?}
         */
        () => this._changeDetectorRef.markForCheck()));
    }
    /**
     * Clamps the given index to the bounds of 0 and the tabs length.
     * @private
     * @param {?} index
     * @return {?}
     */
    _clampTabIndex(index) {
        // Note the `|| 0`, which ensures that values like NaN can't get through
        // and which would otherwise throw the component into an infinite loop
        // (since Math.max(NaN, 0) === NaN).
        return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
    }
    /**
     * Returns a unique id for each tab label element
     * @param {?} i
     * @return {?}
     */
    _getTabLabelId(i) {
        return `mat-tab-label-${this._groupId}-${i}`;
    }
    /**
     * Returns a unique id for each tab content element
     * @param {?} i
     * @return {?}
     */
    _getTabContentId(i) {
        return `mat-tab-content-${this._groupId}-${i}`;
    }
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     * @param {?} tabHeight
     * @return {?}
     */
    _setTabBodyWrapperHeight(tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        /** @type {?} */
        const wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.height = this._tabBodyWrapperHeight + 'px';
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            wrapper.style.height = tabHeight + 'px';
        }
    }
    /**
     * Removes the height of the tab body wrapper.
     * @return {?}
     */
    _removeTabBodyWrapperHeight() {
        /** @type {?} */
        const wrapper = this._tabBodyWrapper.nativeElement;
        this._tabBodyWrapperHeight = wrapper.clientHeight;
        wrapper.style.height = '';
        this.animationDone.emit();
    }
    /**
     * Handle click events, setting new selected index if appropriate.
     * @param {?} tab
     * @param {?} tabHeader
     * @param {?} index
     * @return {?}
     */
    _handleClick(tab, tabHeader, index) {
        if (!tab.disabled) {
            this.selectedIndex = tabHeader.focusIndex = index;
        }
    }
    /**
     * Retrieves the tabindex for the tab.
     * @param {?} tab
     * @param {?} idx
     * @return {?}
     */
    _getTabIndex(tab, idx) {
        if (tab.disabled) {
            return null;
        }
        return this.selectedIndex === idx ? 0 : -1;
    }
}
_MatTabGroupBase.decorators = [
    { type: Directive, args: [{
                // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                selector: 'do-not-use-abstract-mat-tab-group-base'
            },] }
];
/** @nocollapse */
_MatTabGroupBase.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_TABS_CONFIG,] }, { type: Optional }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
_MatTabGroupBase.propDecorators = {
    dynamicHeight: [{ type: Input }],
    selectedIndex: [{ type: Input }],
    headerPosition: [{ type: Input }],
    animationDuration: [{ type: Input }],
    disablePagination: [{ type: Input }],
    backgroundColor: [{ type: Input }],
    selectedIndexChange: [{ type: Output }],
    focusChange: [{ type: Output }],
    animationDone: [{ type: Output }],
    selectedTabChange: [{ type: Output }]
};
if (false) {
    /**
     * All tabs inside the tab group. This includes tabs that belong to groups that are nested
     * inside the current one. We filter out only the tabs that belong to this group in `_tabs`.
     * @type {?}
     */
    _MatTabGroupBase.prototype._allTabs;
    /** @type {?} */
    _MatTabGroupBase.prototype._tabBodyWrapper;
    /** @type {?} */
    _MatTabGroupBase.prototype._tabHeader;
    /**
     * All of the tabs that belong to the group.
     * @type {?}
     */
    _MatTabGroupBase.prototype._tabs;
    /**
     * We need to store the tabs in an Iterable due to strict template type checking with *ngFor and
     * https://github.com/angular/angular/issues/29842.
     * @type {?}
     */
    _MatTabGroupBase.prototype._tabsArray;
    /**
     * The tab index that should be selected after the content has been checked.
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._indexToSelect;
    /**
     * Snapshot of the height of the tab body wrapper before another tab is activated.
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._tabBodyWrapperHeight;
    /**
     * Subscription to tabs being added/removed.
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._tabsSubscription;
    /**
     * Subscription to changes in the tab labels.
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._tabLabelSubscription;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._dynamicHeight;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._selectedIndex;
    /**
     * Position of the tab header.
     * @type {?}
     */
    _MatTabGroupBase.prototype.headerPosition;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._animationDuration;
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     * @type {?}
     */
    _MatTabGroupBase.prototype.disablePagination;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._backgroundColor;
    /**
     * Output to enable support for two-way binding on `[(selectedIndex)]`
     * @type {?}
     */
    _MatTabGroupBase.prototype.selectedIndexChange;
    /**
     * Event emitted when focus has changed within a tab group.
     * @type {?}
     */
    _MatTabGroupBase.prototype.focusChange;
    /**
     * Event emitted when the body animation has completed
     * @type {?}
     */
    _MatTabGroupBase.prototype.animationDone;
    /**
     * Event emitted when the tab selection has changed.
     * @type {?}
     */
    _MatTabGroupBase.prototype.selectedTabChange;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._groupId;
    /**
     * @type {?}
     * @private
     */
    _MatTabGroupBase.prototype._changeDetectorRef;
    /** @type {?} */
    _MatTabGroupBase.prototype._animationMode;
}
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
export class MatTabGroup extends _MatTabGroupBase {
    /**
     * @param {?} elementRef
     * @param {?} changeDetectorRef
     * @param {?=} defaultConfig
     * @param {?=} animationMode
     */
    constructor(elementRef, changeDetectorRef, defaultConfig, animationMode) {
        super(elementRef, changeDetectorRef, defaultConfig, animationMode);
    }
}
MatTabGroup.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-tab-group',
                exportAs: 'matTabGroup',
                template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabsArray; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabsArray; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex == i\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                inputs: ['color', 'disableRipple'],
                providers: [{
                        provide: MAT_TAB_GROUP,
                        useExisting: MatTabGroup
                    }],
                host: {
                    'class': 'mat-tab-group',
                    '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                    '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                },
                styles: [".mat-tab-group{display:flex;flex-direction:column}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}@media(-ms-high-contrast: active){.mat-tab-label:focus{outline:dotted 2px}}.mat-tab-label.mat-tab-disabled{cursor:default}@media(-ms-high-contrast: active){.mat-tab-label.mat-tab-disabled{opacity:.5}}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}@media(-ms-high-contrast: active){.mat-tab-label{opacity:1}}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"]
            }] }
];
/** @nocollapse */
MatTabGroup.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_TABS_CONFIG,] }, { type: Optional }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatTabGroup.propDecorators = {
    _allTabs: [{ type: ContentChildren, args: [MatTab, { descendants: true },] }],
    _tabBodyWrapper: [{ type: ViewChild, args: ['tabBodyWrapper',] }],
    _tabHeader: [{ type: ViewChild, args: ['tabHeader',] }]
};
if (false) {
    /** @type {?} */
    MatTabGroup.ngAcceptInputType_dynamicHeight;
    /** @type {?} */
    MatTabGroup.ngAcceptInputType_animationDuration;
    /** @type {?} */
    MatTabGroup.ngAcceptInputType_selectedIndex;
    /** @type {?} */
    MatTabGroup.ngAcceptInputType_disableRipple;
    /** @type {?} */
    MatTabGroup.prototype._allTabs;
    /** @type {?} */
    MatTabGroup.prototype._tabBodyWrapper;
    /** @type {?} */
    MatTabGroup.prototype._tabHeader;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixjQUFjLEVBQ2QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCxVQUFVLEVBQ1Ysa0JBQWtCLEdBRW5CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsYUFBYSxFQUFDLE1BQU0sT0FBTyxDQUFDOzs7OztJQUl4QyxNQUFNLEdBQUcsQ0FBQzs7OztBQUdkLE1BQU0sT0FBTyxpQkFBaUI7Q0FLN0I7Ozs7OztJQUhDLGtDQUFjOzs7OztJQUVkLGdDQUFZOzs7Ozs7QUFPZCxtQ0FTQzs7Ozs7O0lBUEMsMENBQTJCOzs7Ozs7SUFNM0IsMENBQTRCOzs7Ozs7QUFJOUIsTUFBTSxPQUFPLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBZ0IsaUJBQWlCLENBQUM7Ozs7O0FBSW5GLE1BQU0sb0JBQW9COzs7O0lBQ3hCLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FB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QkFBZ0I7Ozs7Ozs7SUFLL0MsWUFBWSxVQUFzQixFQUN0QixpQkFBb0MsRUFDQyxhQUE2QixFQUN2QixhQUFzQjtRQUMzRSxLQUFLLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs7WUE5QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixzeEVBQTZCO2dCQUU3QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7Z0JBRXJDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO2dCQUNsQyxTQUFTLEVBQUUsQ0FBQzt3QkFDVixPQUFPLEVBQUUsYUFBYTt3QkFDdEIsV0FBVyxFQUFFLFdBQVc7cUJBQ3pCLENBQUM7Z0JBQ0YsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxlQUFlO29CQUN4QixzQ0FBc0MsRUFBRSxlQUFlO29CQUN2RCx1Q0FBdUMsRUFBRSw0QkFBNEI7aUJBQ3RFOzthQUNGOzs7O1lBdFpDLFVBQVU7WUFIVixpQkFBaUI7NENBaWFKLE1BQU0sU0FBQyxlQUFlLGNBQUcsUUFBUTt5Q0FDakMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt1QkFQcEQsZUFBZSxTQUFDLE1BQU0sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBQzNDLFNBQVMsU0FBQyxnQkFBZ0I7eUJBQzFCLFNBQVMsU0FBQyxXQUFXOzs7O0lBU3RCLDRDQUF5RDs7SUFDekQsZ0RBQTREOztJQUM1RCw0Q0FBd0Q7O0lBQ3hELDRDQUF5RDs7SUFkekQsK0JBQTBFOztJQUMxRSxzQ0FBeUQ7O0lBQ3pELGlDQUEwRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRUYWIsIE1BVF9UQUJfR1JPVVB9IGZyb20gJy4vdGFiJztcblxuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSUQncyBmb3IgZWFjaCB0YWIgY29tcG9uZW50ICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIG9uIGZvY3VzIG9yIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkNoYW5nZUV2ZW50IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICB0YWI6IE1hdFRhYjtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIHRhYiBoZWFkZXIuICovXG5leHBvcnQgdHlwZSBNYXRUYWJIZWFkZXJQb3NpdGlvbiA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSB0YWJzIG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VGFic0NvbmZpZyB7XG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYiBhbmltYXRpb24uIE11c3QgYmUgYSB2YWxpZCBDU1MgdmFsdWUgKGUuZy4gNjAwbXMpLiAqL1xuICBhbmltYXRpb25EdXJhdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBwYWdpbmF0aW9uIHNob3VsZCBiZSBkaXNhYmxlZC4gVGhpcyBjYW4gYmUgdXNlZCB0byBhdm9pZCB1bm5lY2Vzc2FyeVxuICAgKiBsYXlvdXQgcmVjYWxjdWxhdGlvbnMgaWYgaXQncyBrbm93biB0aGF0IHBhZ2luYXRpb24gd29uJ3QgYmUgcmVxdWlyZWQuXG4gICAqL1xuICBkaXNhYmxlUGFnaW5hdGlvbj86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgdGhlIHRhYnMgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UQUJTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRUYWJzQ29uZmlnPignTUFUX1RBQlNfQ09ORklHJyk7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiR3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0VGFiR3JvdXBNaXhpbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0VGFiR3JvdXBNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdFRhYkdyb3VwTWl4aW5CYXNlID1cbiAgICBtaXhpbkNvbG9yKG1peGluRGlzYWJsZVJpcHBsZShNYXRUYWJHcm91cE1peGluQmFzZSksICdwcmltYXJ5Jyk7XG5cbmludGVyZmFjZSBNYXRUYWJHcm91cEJhc2VIZWFkZXIge1xuICBfYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiOiAoKSA9PiB2b2lkO1xuICBmb2N1c0luZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkdyb3VwQmFzZWAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNlbGVjdG9yIGNhbiBiZSByZW1vdmVkIHdoZW4gd2UgdXBkYXRlIHRvIEFuZ3VsYXIgOS4wLlxuICBzZWxlY3RvcjogJ2RvLW5vdC11c2UtYWJzdHJhY3QtbWF0LXRhYi1ncm91cC1iYXNlJ1xufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkdyb3VwQmFzZSBleHRlbmRzIF9NYXRUYWJHcm91cE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95LCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZSB7XG5cbiAgLyoqXG4gICAqIEFsbCB0YWJzIGluc2lkZSB0aGUgdGFiIGdyb3VwLiBUaGlzIGluY2x1ZGVzIHRhYnMgdGhhdCBiZWxvbmcgdG8gZ3JvdXBzIHRoYXQgYXJlIG5lc3RlZFxuICAgKiBpbnNpZGUgdGhlIGN1cnJlbnQgb25lLiBXZSBmaWx0ZXIgb3V0IG9ubHkgdGhlIHRhYnMgdGhhdCBiZWxvbmcgdG8gdGhpcyBncm91cCBpbiBgX3RhYnNgLlxuICAgKi9cbiAgYWJzdHJhY3QgX2FsbFRhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+O1xuICBhYnN0cmFjdCBfdGFiQm9keVdyYXBwZXI6IEVsZW1lbnRSZWY7XG4gIGFic3RyYWN0IF90YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlcjtcblxuICAvKiogQWxsIG9mIHRoZSB0YWJzIHRoYXQgYmVsb25nIHRvIHRoZSBncm91cC4gKi9cbiAgX3RhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+ID0gbmV3IFF1ZXJ5TGlzdDxNYXRUYWI+KCk7XG5cbiAgLyoqXG4gICAqIFdlIG5lZWQgdG8gc3RvcmUgdGhlIHRhYnMgaW4gYW4gSXRlcmFibGUgZHVlIHRvIHN0cmljdCB0ZW1wbGF0ZSB0eXBlIGNoZWNraW5nIHdpdGggKm5nRm9yIGFuZFxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yOTg0Mi5cbiAgICovXG4gIF90YWJzQXJyYXk6IE1hdFRhYltdID0gW107XG5cbiAgLyoqIFRoZSB0YWIgaW5kZXggdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgYWZ0ZXIgdGhlIGNvbnRlbnQgaGFzIGJlZW4gY2hlY2tlZC4gKi9cbiAgcHJpdmF0ZSBfaW5kZXhUb1NlbGVjdDogbnVtYmVyIHwgbnVsbCA9IDA7XG5cbiAgLyoqIFNuYXBzaG90IG9mIHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBib2R5IHdyYXBwZXIgYmVmb3JlIGFub3RoZXIgdGFiIGlzIGFjdGl2YXRlZC4gKi9cbiAgcHJpdmF0ZSBfdGFiQm9keVdyYXBwZXJIZWlnaHQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0YWJzIGJlaW5nIGFkZGVkL3JlbW92ZWQuICovXG4gIHByaXZhdGUgX3RhYnNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiAqL1xuICBwcml2YXRlIF90YWJMYWJlbFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGdyb3VwIHNob3VsZCBncm93IHRvIHRoZSBzaXplIG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZHluYW1pY0hlaWdodCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2R5bmFtaWNIZWlnaHQ7IH1cbiAgc2V0IGR5bmFtaWNIZWlnaHQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZHluYW1pY0hlaWdodCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZHluYW1pY0hlaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaW5kZXggb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDsgfVxuICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX2luZGV4VG9TZWxlY3QgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgbnVsbCk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSB0YWIgaGVhZGVyLiAqL1xuICBASW5wdXQoKSBoZWFkZXJQb3NpdGlvbjogTWF0VGFiSGVhZGVyUG9zaXRpb24gPSAnYWJvdmUnO1xuXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYiBhbmltYXRpb24uIFdpbGwgYmUgbm9ybWFsaXplZCB0byBtaWxsaXNlY29uZHMgaWYgbm8gdW5pdHMgYXJlIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hbmltYXRpb25EdXJhdGlvbjsgfVxuICBzZXQgYW5pbWF0aW9uRHVyYXRpb24odmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uID0gL15cXGQrJC8udGVzdCh2YWx1ZSkgPyB2YWx1ZSArICdtcycgOiB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9hbmltYXRpb25EdXJhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVQYWdpbmF0aW9uOiBib29sZWFuO1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgZ3JvdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjsgfVxuICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhY2tncm91bmQtJHt0aGlzLmJhY2tncm91bmRDb2xvcn1gKTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtYmFja2dyb3VuZC0ke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIHRoaXMuX2JhY2tncm91bmRDb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2JhY2tncm91bmRDb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBPdXRwdXQgdG8gZW5hYmxlIHN1cHBvcnQgZm9yIHR3by13YXkgYmluZGluZyBvbiBgWyhzZWxlY3RlZEluZGV4KV1gICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZEluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gZm9jdXMgaGFzIGNoYW5nZWQgd2l0aGluIGEgdGFiIGdyb3VwLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZm9jdXNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBib2R5IGFuaW1hdGlvbiBoYXMgY29tcGxldGVkICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIHNlbGVjdGlvbiBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+KHRydWUpO1xuXG4gIHByaXZhdGUgX2dyb3VwSWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX1RBQlNfQ09ORklHKSBAT3B0aW9uYWwoKSBkZWZhdWx0Q29uZmlnPzogTWF0VGFic0NvbmZpZyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2dyb3VwSWQgPSBuZXh0SWQrKztcbiAgICB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uID0gZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uID9cbiAgICAgICAgZGVmYXVsdENvbmZpZy5hbmltYXRpb25EdXJhdGlvbiA6ICc1MDBtcyc7XG4gICAgdGhpcy5kaXNhYmxlUGFnaW5hdGlvbiA9IGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiAhPSBudWxsID9cbiAgICAgICAgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIHRoZSBjb250ZW50IGlzIGNoZWNrZWQsIHRoaXMgY29tcG9uZW50IGtub3dzIHdoYXQgdGFicyBoYXZlIGJlZW4gZGVmaW5lZFxuICAgKiBhbmQgd2hhdCB0aGUgc2VsZWN0ZWQgaW5kZXggc2hvdWxkIGJlLiBUaGlzIGlzIHdoZXJlIHdlIGNhbiBrbm93IGV4YWN0bHkgd2hhdCBwb3NpdGlvblxuICAgKiBlYWNoIHRhYiBzaG91bGQgYmUgaW4gYWNjb3JkaW5nIHRvIHRoZSBuZXcgc2VsZWN0ZWQgaW5kZXgsIGFuZCBhZGRpdGlvbmFsbHkgd2Uga25vdyBob3dcbiAgICogYSBuZXcgc2VsZWN0ZWQgdGFiIHNob3VsZCB0cmFuc2l0aW9uIGluIChmcm9tIHRoZSBsZWZ0IG9yIHJpZ2h0KS5cbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBEb24ndCBjbGFtcCB0aGUgYGluZGV4VG9TZWxlY3RgIGltbWVkaWF0ZWx5IGluIHRoZSBzZXR0ZXIgYmVjYXVzZSBpdCBjYW4gaGFwcGVuIHRoYXRcbiAgICAvLyB0aGUgYW1vdW50IG9mIHRhYnMgY2hhbmdlcyBiZWZvcmUgdGhlIGFjdHVhbCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bnMuXG4gICAgY29uc3QgaW5kZXhUb1NlbGVjdCA9IHRoaXMuX2luZGV4VG9TZWxlY3QgPSB0aGlzLl9jbGFtcFRhYkluZGV4KHRoaXMuX2luZGV4VG9TZWxlY3QpO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBjaGFuZ2UgaW4gc2VsZWN0ZWQgaW5kZXgsIGVtaXQgYSBjaGFuZ2UgZXZlbnQuIFNob3VsZCBub3QgdHJpZ2dlciBpZlxuICAgIC8vIHRoZSBzZWxlY3RlZCBpbmRleCBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIGNvbnN0IGlzRmlyc3RSdW4gPSB0aGlzLl9zZWxlY3RlZEluZGV4ID09IG51bGw7XG5cbiAgICAgIGlmICghaXNGaXJzdFJ1bikge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGFiQ2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXhUb1NlbGVjdCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGFuZ2luZyB0aGVzZSB2YWx1ZXMgYWZ0ZXIgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuXG4gICAgICAvLyBzaW5jZSB0aGUgY2hlY2tlZCBjb250ZW50IG1heSBjb250YWluIHJlZmVyZW5jZXMgdG8gdGhlbS5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHRhYi5pc0FjdGl2ZSA9IGluZGV4ID09PSBpbmRleFRvU2VsZWN0KTtcblxuICAgICAgICBpZiAoIWlzRmlyc3RSdW4pIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2UuZW1pdChpbmRleFRvU2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0dXAgdGhlIHBvc2l0aW9uIGZvciBlYWNoIHRhYiBhbmQgb3B0aW9uYWxseSBzZXR1cCBhbiBvcmlnaW4gb24gdGhlIG5leHQgc2VsZWN0ZWQgdGFiLlxuICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiOiBNYXRUYWIsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHRhYi5wb3NpdGlvbiA9IGluZGV4IC0gaW5kZXhUb1NlbGVjdDtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYiwgdGhlbiBzZXQgdXAgYW4gb3JpZ2luIGZvciB0aGUgbmV4dCBzZWxlY3RlZCB0YWJcbiAgICAgIC8vIGlmIGl0IGRvZXNuJ3QgaGF2ZSBvbmUgYWxyZWFkeS5cbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IG51bGwgJiYgdGFiLnBvc2l0aW9uID09IDAgJiYgIXRhYi5vcmlnaW4pIHtcbiAgICAgICAgdGFiLm9yaWdpbiA9IGluZGV4VG9TZWxlY3QgLSB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT09IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSBpbmRleFRvU2VsZWN0O1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3N1YnNjcmliZVRvQWxsVGFiQ2hhbmdlcygpO1xuICAgIHRoaXMuX3N1YnNjcmliZVRvVGFiTGFiZWxzKCk7XG4gICAgdGhpcy5fdGFic0FycmF5ID0gdGhpcy5fdGFicy50b0FycmF5KCk7XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgYW1vdW50IG9mIHRhYnMsIGluIG9yZGVyIHRvIGJlXG4gICAgLy8gYWJsZSB0byByZS1yZW5kZXIgdGhlIGNvbnRlbnQgYXMgbmV3IHRhYnMgYXJlIGFkZGVkIG9yIHJlbW92ZWQuXG4gICAgdGhpcy5fdGFic1N1YnNjcmlwdGlvbiA9IHRoaXMuX3RhYnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXhUb1NlbGVjdCA9IHRoaXMuX2NsYW1wVGFiSW5kZXgodGhpcy5faW5kZXhUb1NlbGVjdCk7XG4gICAgICB0aGlzLl90YWJzQXJyYXkgPSB0aGlzLl90YWJzLnRvQXJyYXkoKTtcblxuICAgICAgLy8gTWFpbnRhaW4gdGhlIHByZXZpb3VzbHktc2VsZWN0ZWQgdGFiIGlmIGEgbmV3IHRhYiBpcyBhZGRlZCBvciByZW1vdmVkIGFuZCB0aGVyZSBpcyBub1xuICAgICAgLy8gZXhwbGljaXQgY2hhbmdlIHRoYXQgc2VsZWN0cyBhIGRpZmZlcmVudCB0YWIuXG4gICAgICBpZiAoaW5kZXhUb1NlbGVjdCA9PT0gdGhpcy5fc2VsZWN0ZWRJbmRleCkge1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGFic0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3RhYnNBcnJheVtpXS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgLy8gQXNzaWduIGJvdGggdG8gdGhlIGBfaW5kZXhUb1NlbGVjdGAgYW5kIGBfc2VsZWN0ZWRJbmRleGAgc28gd2UgZG9uJ3QgZmlyZSBhIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGV2ZW50LCBvdGhlcndpc2UgdGhlIGNvbnN1bWVyIG1heSBlbmQgdXAgaW4gYW4gaW5maW5pdGUgbG9vcCBpbiBzb21lIGVkZ2UgY2FzZXMgbGlrZVxuICAgICAgICAgICAgLy8gYWRkaW5nIGEgdGFiIHdpdGhpbiB0aGUgYHNlbGVjdGVkSW5kZXhDaGFuZ2VgIGV2ZW50LlxuICAgICAgICAgICAgdGhpcy5faW5kZXhUb1NlbGVjdCA9IHRoaXMuX3NlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiBhbGwgb2YgdGhlIHRhYnMuICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvQWxsVGFiQ2hhbmdlcygpIHtcbiAgICAvLyBTaW5jZSB3ZSB1c2UgYSBxdWVyeSB3aXRoIGBkZXNjZW5kYW50czogdHJ1ZWAgdG8gcGljayB1cCB0aGUgdGFicywgd2UgbWF5IGVuZCB1cCBjYXRjaGluZ1xuICAgIC8vIHNvbWUgdGhhdCBhcmUgaW5zaWRlIG9mIG5lc3RlZCB0YWIgZ3JvdXBzLiBXZSBmaWx0ZXIgdGhlbSBvdXQgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhhdFxuICAgIC8vIHRoZSBjbG9zZXN0IGdyb3VwIHRvIHRoZSB0YWIgaXMgdGhlIGN1cnJlbnQgb25lLlxuICAgIHRoaXMuX2FsbFRhYnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2FsbFRhYnMpKVxuICAgICAgLnN1YnNjcmliZSgodGFiczogUXVlcnlMaXN0PE1hdFRhYj4pID0+IHtcbiAgICAgICAgdGhpcy5fdGFicy5yZXNldCh0YWJzLmZpbHRlcih0YWIgPT4ge1xuICAgICAgICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgX2Nsb3Nlc3RUYWJHcm91cGBcbiAgICAgICAgICAvLyBvbmNlIGl0IGJlY29tZXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIgaW4gTWF0VGFiLlxuICAgICAgICAgIHJldHVybiAhdGFiLl9jbG9zZXN0VGFiR3JvdXAgfHwgdGFiLl9jbG9zZXN0VGFiR3JvdXAgPT09IHRoaXM7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5fdGFicy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdGFic1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogUmUtYWxpZ25zIHRoZSBpbmsgYmFyIHRvIHRoZSBzZWxlY3RlZCB0YWIgZWxlbWVudC4gKi9cbiAgcmVhbGlnbklua0JhcigpIHtcbiAgICBpZiAodGhpcy5fdGFiSGVhZGVyKSB7XG4gICAgICB0aGlzLl90YWJIZWFkZXIuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgIH1cbiAgfVxuXG4gIF9mb2N1c0NoYW5nZWQoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuZm9jdXNDaGFuZ2UuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudChpbmRleCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXg6IG51bWJlcik6IE1hdFRhYkNoYW5nZUV2ZW50IHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRUYWJDaGFuZ2VFdmVudDtcbiAgICBldmVudC5pbmRleCA9IGluZGV4O1xuICAgIGlmICh0aGlzLl90YWJzICYmIHRoaXMuX3RhYnMubGVuZ3RoKSB7XG4gICAgICBldmVudC50YWIgPSB0aGlzLl90YWJzLnRvQXJyYXkoKVtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gdGhlIHRhYiBsYWJlbHMuIFRoaXMgaXMgbmVlZGVkLCBiZWNhdXNlIHRoZSBASW5wdXQgZm9yIHRoZSBsYWJlbCBpc1xuICAgKiBvbiB0aGUgTWF0VGFiIGNvbXBvbmVudCwgd2hlcmVhcyB0aGUgZGF0YSBiaW5kaW5nIGlzIGluc2lkZSB0aGUgTWF0VGFiR3JvdXAuIEluIG9yZGVyIGZvciB0aGVcbiAgICogYmluZGluZyB0byBiZSB1cGRhdGVkLCB3ZSBuZWVkIHRvIHN1YnNjcmliZSB0byBjaGFuZ2VzIGluIGl0IGFuZCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb25cbiAgICogbWFudWFsbHkuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb1RhYkxhYmVscygpIHtcbiAgICBpZiAodGhpcy5fdGFiTGFiZWxTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdGFiTGFiZWxTdWJzY3JpcHRpb24gPSBtZXJnZSguLi50aGlzLl90YWJzLm1hcCh0YWIgPT4gdGFiLl9zdGF0ZUNoYW5nZXMpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cblxuICAvKiogQ2xhbXBzIHRoZSBnaXZlbiBpbmRleCB0byB0aGUgYm91bmRzIG9mIDAgYW5kIHRoZSB0YWJzIGxlbmd0aC4gKi9cbiAgcHJpdmF0ZSBfY2xhbXBUYWJJbmRleChpbmRleDogbnVtYmVyIHwgbnVsbCk6IG51bWJlciB7XG4gICAgLy8gTm90ZSB0aGUgYHx8IDBgLCB3aGljaCBlbnN1cmVzIHRoYXQgdmFsdWVzIGxpa2UgTmFOIGNhbid0IGdldCB0aHJvdWdoXG4gICAgLy8gYW5kIHdoaWNoIHdvdWxkIG90aGVyd2lzZSB0aHJvdyB0aGUgY29tcG9uZW50IGludG8gYW4gaW5maW5pdGUgbG9vcFxuICAgIC8vIChzaW5jZSBNYXRoLm1heChOYU4sIDApID09PSBOYU4pLlxuICAgIHJldHVybiBNYXRoLm1pbih0aGlzLl90YWJzLmxlbmd0aCAtIDEsIE1hdGgubWF4KGluZGV4IHx8IDAsIDApKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgdW5pcXVlIGlkIGZvciBlYWNoIHRhYiBsYWJlbCBlbGVtZW50ICovXG4gIF9nZXRUYWJMYWJlbElkKGk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBtYXQtdGFiLWxhYmVsLSR7dGhpcy5fZ3JvdXBJZH0tJHtpfWA7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB0YWIgY29udGVudCBlbGVtZW50ICovXG4gIF9nZXRUYWJDb250ZW50SWQoaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYG1hdC10YWItY29udGVudC0ke3RoaXMuX2dyb3VwSWR9LSR7aX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGhlaWdodCBvZiB0aGUgYm9keSB3cmFwcGVyIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGFjdGl2YXRpbmcgdGFiIGlmIGR5bmFtaWNcbiAgICogaGVpZ2h0IHByb3BlcnR5IGlzIHRydWUuXG4gICAqL1xuICBfc2V0VGFiQm9keVdyYXBwZXJIZWlnaHQodGFiSGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2R5bmFtaWNIZWlnaHQgfHwgIXRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3Qgd3JhcHBlcjogSFRNTEVsZW1lbnQgPSB0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50O1xuXG4gICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSB0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCArICdweCc7XG5cbiAgICAvLyBUaGlzIGNvbmRpdGlvbmFsIGZvcmNlcyB0aGUgYnJvd3NlciB0byBwYWludCB0aGUgaGVpZ2h0IHNvIHRoYXRcbiAgICAvLyB0aGUgYW5pbWF0aW9uIHRvIHRoZSBuZXcgaGVpZ2h0IGNhbiBoYXZlIGFuIG9yaWdpbi5cbiAgICBpZiAodGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQpIHtcbiAgICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gdGFiSGVpZ2h0ICsgJ3B4JztcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgaGVpZ2h0IG9mIHRoZSB0YWIgYm9keSB3cmFwcGVyLiAqL1xuICBfcmVtb3ZlVGFiQm9keVdyYXBwZXJIZWlnaHQoKTogdm9pZCB7XG4gICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQgPSB3cmFwcGVyLmNsaWVudEhlaWdodDtcbiAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcnO1xuICAgIHRoaXMuYW5pbWF0aW9uRG9uZS5lbWl0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlIGNsaWNrIGV2ZW50cywgc2V0dGluZyBuZXcgc2VsZWN0ZWQgaW5kZXggaWYgYXBwcm9wcmlhdGUuICovXG4gIF9oYW5kbGVDbGljayh0YWI6IE1hdFRhYiwgdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXIsIGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRhYi5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGFiSGVhZGVyLmZvY3VzSW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0cmlldmVzIHRoZSB0YWJpbmRleCBmb3IgdGhlIHRhYi4gKi9cbiAgX2dldFRhYkluZGV4KHRhYjogTWF0VGFiLCBpZHg6IG51bWJlcik6IG51bWJlciB8IG51bGwge1xuICAgIGlmICh0YWIuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEluZGV4ID09PSBpZHggPyAwIDogLTE7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gdGFiLWdyb3VwIGNvbXBvbmVudC4gU3VwcG9ydHMgYmFzaWMgdGFiIHBhaXJzIChsYWJlbCArIGNvbnRlbnQpIGFuZCBpbmNsdWRlc1xuICogYW5pbWF0ZWQgaW5rLWJhciwga2V5Ym9hcmQgbmF2aWdhdGlvbiwgYW5kIHNjcmVlbiByZWFkZXIuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdGFicy5odG1sXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10YWItZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFRhYkdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItZ3JvdXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9UQUJfR1JPVVAsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdFRhYkdyb3VwXG4gIH1dLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItZ3JvdXAnLFxuICAgICdbY2xhc3MubWF0LXRhYi1ncm91cC1keW5hbWljLWhlaWdodF0nOiAnZHluYW1pY0hlaWdodCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWludmVydGVkLWhlYWRlcl0nOiAnaGVhZGVyUG9zaXRpb24gPT09IFwiYmVsb3dcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwIGV4dGVuZHMgX01hdFRhYkdyb3VwQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsVGFiczogUXVlcnlMaXN0PE1hdFRhYj47XG4gIEBWaWV3Q2hpbGQoJ3RhYkJvZHlXcmFwcGVyJykgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJIZWFkZXInKSBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9UQUJTX0NPTkZJRykgQE9wdGlvbmFsKCkgZGVmYXVsdENvbmZpZz86IE1hdFRhYnNDb25maWcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIGRlZmF1bHRDb25maWcsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2R5bmFtaWNIZWlnaHQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hbmltYXRpb25EdXJhdGlvbjogbnVtYmVyIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiB8IHN0cmluZztcbn1cbiJdfQ==