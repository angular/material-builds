/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Inject, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MAT_TAB_GROUP, MatTab } from './tab';
import { MAT_TABS_CONFIG } from './tab-config';
/** Used to generate unique ID's for each tab component */
let nextId = 0;
/** A simple change event emitted on focus or selection changes. */
export class MatTabChangeEvent {
}
// Boilerplate for applying mixins to MatTabGroup.
/** @docs-private */
class MatTabGroupMixinBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(MatTabGroupMixinBase), 'primary');
/**
 * Base class with all of the `MatTabGroupBase` functionality.
 * @docs-private
 */
let _MatTabGroupBase = /** @class */ (() => {
    let _MatTabGroupBase = 
    // tslint:disable-next-line:class-name
    class _MatTabGroupBase extends _MatTabGroupMixinBase {
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
            this._dynamicHeight = false;
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
            this.animationDuration = defaultConfig && defaultConfig.animationDuration ?
                defaultConfig.animationDuration : '500ms';
            this.disablePagination = defaultConfig && defaultConfig.disablePagination != null ?
                defaultConfig.disablePagination : false;
        }
        /** Whether the tab group should grow to the size of the active tab. */
        get dynamicHeight() { return this._dynamicHeight; }
        set dynamicHeight(value) { this._dynamicHeight = coerceBooleanProperty(value); }
        /** The index of the active tab. */
        get selectedIndex() { return this._selectedIndex; }
        set selectedIndex(value) {
            this._indexToSelect = coerceNumberProperty(value, null);
        }
        /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
        get animationDuration() { return this._animationDuration; }
        set animationDuration(value) {
            this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
        }
        /** Background color of the tab group. */
        get backgroundColor() { return this._backgroundColor; }
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
            const indexToSelect = this._indexToSelect = this._clampTabIndex(this._indexToSelect);
            // If there is a change in selected index, emit a change event. Should not trigger if
            // the selected index has not yet been initialized.
            if (this._selectedIndex != indexToSelect) {
                const isFirstRun = this._selectedIndex == null;
                if (!isFirstRun) {
                    this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
                }
                // Changing these values after change detection has run
                // since the checked content may contain references to them.
                Promise.resolve().then(() => {
                    this._tabs.forEach((tab, index) => tab.isActive = index === indexToSelect);
                    if (!isFirstRun) {
                        this.selectedIndexChange.emit(indexToSelect);
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
            this._allTabs.changes
                .pipe(startWith(this._allTabs))
                .subscribe((tabs) => {
                this._tabs.reset(tabs.filter(tab => {
                    // @breaking-change 10.0.0 Remove null check for `_closestTabGroup`
                    // once it becomes a required parameter in MatTab.
                    return !tab._closestTabGroup || tab._closestTabGroup === this;
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
        _focusChanged(index) {
            this.focusChange.emit(this._createChangeEvent(index));
        }
        _createChangeEvent(index) {
            const event = new MatTabChangeEvent;
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
            this._tabLabelSubscription = merge(...this._tabs.map(tab => tab._stateChanges))
                .subscribe(() => this._changeDetectorRef.markForCheck());
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], _MatTabGroupBase.prototype, "dynamicHeight", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], _MatTabGroupBase.prototype, "selectedIndex", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], _MatTabGroupBase.prototype, "headerPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], _MatTabGroupBase.prototype, "animationDuration", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], _MatTabGroupBase.prototype, "disablePagination", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], _MatTabGroupBase.prototype, "backgroundColor", null);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], _MatTabGroupBase.prototype, "selectedIndexChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], _MatTabGroupBase.prototype, "focusChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], _MatTabGroupBase.prototype, "animationDone", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], _MatTabGroupBase.prototype, "selectedTabChange", void 0);
    _MatTabGroupBase = __decorate([
        Directive()
        // tslint:disable-next-line:class-name
        ,
        __param(2, Inject(MAT_TABS_CONFIG)), __param(2, Optional()),
        __param(3, Optional()), __param(3, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [ElementRef,
            ChangeDetectorRef, Object, String])
    ], _MatTabGroupBase);
    return _MatTabGroupBase;
})();
export { _MatTabGroupBase };
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
let MatTabGroup = /** @class */ (() => {
    var MatTabGroup_1;
    let MatTabGroup = MatTabGroup_1 = class MatTabGroup extends _MatTabGroupBase {
        constructor(elementRef, changeDetectorRef, defaultConfig, animationMode) {
            super(elementRef, changeDetectorRef, defaultConfig, animationMode);
        }
    };
    __decorate([
        ContentChildren(MatTab, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatTabGroup.prototype, "_allTabs", void 0);
    __decorate([
        ViewChild('tabBodyWrapper'),
        __metadata("design:type", ElementRef)
    ], MatTabGroup.prototype, "_tabBodyWrapper", void 0);
    __decorate([
        ViewChild('tabHeader'),
        __metadata("design:type", Object)
    ], MatTabGroup.prototype, "_tabHeader", void 0);
    MatTabGroup = MatTabGroup_1 = __decorate([
        Component({
            selector: 'mat-tab-group',
            exportAs: 'matTabGroup',
            template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex == i\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n",
            encapsulation: ViewEncapsulation.None,
            // tslint:disable-next-line:validate-decorators
            changeDetection: ChangeDetectionStrategy.Default,
            inputs: ['color', 'disableRipple'],
            providers: [{
                    provide: MAT_TAB_GROUP,
                    useExisting: MatTabGroup_1
                }],
            host: {
                'class': 'mat-tab-group',
                '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
            },
            styles: [".mat-tab-group{display:flex;flex-direction:column}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"]
        }),
        __param(2, Inject(MAT_TABS_CONFIG)), __param(2, Optional()),
        __param(3, Optional()), __param(3, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [ElementRef,
            ChangeDetectorRef, Object, String])
    ], MatTabGroup);
    return MatTabGroup;
})();
export { MatTabGroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFLTCxVQUFVLEVBQ1Ysa0JBQWtCLEdBRW5CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxhQUFhLEVBQUUsTUFBTSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQWdCLE1BQU0sY0FBYyxDQUFDO0FBRzVELDBEQUEwRDtBQUMxRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixtRUFBbUU7QUFDbkUsTUFBTSxPQUFPLGlCQUFpQjtDQUs3QjtBQUtELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxvQkFBb0I7SUFDeEIsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0NBQy9DO0FBQ0QsTUFBTSxxQkFBcUIsR0FDdkIsVUFBVSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFPcEU7OztHQUdHO0FBR0g7SUFBQSxJQUFzQixnQkFBZ0I7SUFEdEMsc0NBQXNDO0lBQ3RDLE1BQXNCLGdCQUFpQixTQUFRLHFCQUFxQjtRQTBGbEUsWUFBWSxVQUFzQixFQUNaLGtCQUFxQyxFQUNWLGFBQTZCLEVBQ2hCLGNBQXVCO1lBQ25GLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUhFLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7WUFFRyxtQkFBYyxHQUFkLGNBQWMsQ0FBUztZQWxGckYsZ0RBQWdEO1lBQ2hELFVBQUssR0FBc0IsSUFBSSxTQUFTLEVBQVUsQ0FBQztZQUVuRCxnRkFBZ0Y7WUFDeEUsbUJBQWMsR0FBa0IsQ0FBQyxDQUFDO1lBRTFDLHNGQUFzRjtZQUM5RSwwQkFBcUIsR0FBVyxDQUFDLENBQUM7WUFFMUMsZ0RBQWdEO1lBQ3hDLHNCQUFpQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFFL0MsaURBQWlEO1lBQ3pDLDBCQUFxQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFNM0MsbUJBQWMsR0FBWSxLQUFLLENBQUM7WUFRaEMsbUJBQWMsR0FBa0IsSUFBSSxDQUFDO1lBRTdDLGtDQUFrQztZQUN6QixtQkFBYyxHQUF5QixPQUFPLENBQUM7WUFpQ3hELDBFQUEwRTtZQUN2RCx3QkFBbUIsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztZQUUxRiwrREFBK0Q7WUFDNUMsZ0JBQVcsR0FDMUIsSUFBSSxZQUFZLEVBQXFCLENBQUM7WUFFMUMsMERBQTBEO1lBQ3ZDLGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7WUFFaEYsd0RBQXdEO1lBQ3JDLHNCQUFpQixHQUNoQyxJQUFJLFlBQVksQ0FBb0IsSUFBSSxDQUFDLENBQUM7WUFTNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUN2RSxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM5QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsQ0FBQztnQkFDL0UsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUMsQ0FBQztRQTFFRCx1RUFBdUU7UUFFdkUsSUFBSSxhQUFhLEtBQWMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLGFBQWEsQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHekYsbUNBQW1DO1FBRW5DLElBQUksYUFBYSxLQUFvQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksYUFBYSxDQUFDLEtBQW9CO1lBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFNRCw4RkFBOEY7UUFFOUYsSUFBSSxpQkFBaUIsS0FBYSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxpQkFBaUIsQ0FBQyxLQUFhO1lBQ2pDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdkUsQ0FBQztRQVVELHlDQUF5QztRQUV6QyxJQUFJLGVBQWUsS0FBbUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksZUFBZSxDQUFDLEtBQW1CO1lBQ3JDLE1BQU0sYUFBYSxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztZQUVsRSxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFFekUsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDeEQ7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLENBQUM7UUErQkQ7Ozs7O1dBS0c7UUFDSCxxQkFBcUI7WUFDbkIsdUZBQXVGO1lBQ3ZGLHNFQUFzRTtZQUN0RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXJGLHFGQUFxRjtZQUNyRixtREFBbUQ7WUFDbkQsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLGFBQWEsRUFBRTtnQkFDeEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7Z0JBRS9DLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDckU7Z0JBRUQsdURBQXVEO2dCQUN2RCw0REFBNEQ7Z0JBQzVELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxLQUFLLGFBQWEsQ0FBQyxDQUFDO29CQUUzRSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNmLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7cUJBQzlDO2dCQUNILENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCwyRkFBMkY7WUFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLEVBQUU7Z0JBQ2hELEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxHQUFHLGFBQWEsQ0FBQztnQkFFckMsc0ZBQXNGO2dCQUN0RixrQ0FBa0M7Z0JBQ2xDLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUNuRSxHQUFHLENBQUMsTUFBTSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUNsRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGFBQWEsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUN4QztRQUNILENBQUM7UUFFRCxrQkFBa0I7WUFDaEIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFN0IsNkRBQTZEO1lBQzdELGtFQUFrRTtZQUNsRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDekQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRS9ELHdGQUF3RjtnQkFDeEYsZ0RBQWdEO2dCQUNoRCxJQUFJLGFBQWEsS0FBSyxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN6QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDcEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFOzRCQUNwQixzRkFBc0Y7NEJBQ3RGLHVGQUF1Rjs0QkFDdkYsdURBQXVEOzRCQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDOzRCQUM5QyxNQUFNO3lCQUNQO3FCQUNGO2lCQUNGO2dCQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCw2Q0FBNkM7UUFDckMseUJBQXlCO1lBQy9CLDRGQUE0RjtZQUM1RiwwRkFBMEY7WUFDMUYsbURBQW1EO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztpQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzlCLFNBQVMsQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDakMsbUVBQW1FO29CQUNuRSxrREFBa0Q7b0JBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLElBQUksR0FBRyxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQztnQkFDaEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELFdBQVc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsQ0FBQztRQUVELHlEQUF5RDtRQUN6RCxhQUFhO1lBQ1gsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFFLENBQUM7YUFDN0M7UUFDSCxDQUFDO1FBRUQsYUFBYSxDQUFDLEtBQWE7WUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVPLGtCQUFrQixDQUFDLEtBQWE7WUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztZQUNwQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ25DLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN6QztZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0sscUJBQXFCO1lBQzNCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO2dCQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDMUM7WUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQzVFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQscUVBQXFFO1FBQzdELGNBQWMsQ0FBQyxLQUFvQjtZQUN6Qyx3RUFBd0U7WUFDeEUsc0VBQXNFO1lBQ3RFLG9DQUFvQztZQUNwQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFFRCxxREFBcUQ7UUFDckQsY0FBYyxDQUFDLENBQVM7WUFDdEIsT0FBTyxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMvQyxDQUFDO1FBRUQsdURBQXVEO1FBQ3ZELGdCQUFnQixDQUFDLENBQVM7WUFDeEIsT0FBTyxtQkFBbUIsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNqRCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsd0JBQXdCLENBQUMsU0FBaUI7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRXBFLE1BQU0sT0FBTyxHQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztZQUVoRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1lBRXpELGtFQUFrRTtZQUNsRSxzREFBc0Q7WUFDdEQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ25ELE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUM7YUFDekM7UUFDSCxDQUFDO1FBRUQsa0RBQWtEO1FBQ2xELDJCQUEyQjtZQUN6QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztZQUNuRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUNsRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBRUQsc0VBQXNFO1FBQ3RFLFlBQVksQ0FBQyxHQUFXLEVBQUUsU0FBZ0MsRUFBRSxLQUFhO1lBQ3ZFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQ25EO1FBQ0gsQ0FBQztRQUVELDBDQUEwQztRQUMxQyxZQUFZLENBQUMsR0FBVyxFQUFFLEdBQVc7WUFDbkMsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNoQixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBTUYsQ0FBQTtJQWhSQztRQURDLEtBQUssRUFBRTs7O3lEQUNvRDtJQU01RDtRQURDLEtBQUssRUFBRTs7O3lEQUMwRDtJQU96RDtRQUFSLEtBQUssRUFBRTs7NERBQWdEO0lBSXhEO1FBREMsS0FBSyxFQUFFOzs7NkRBQzJEO0lBV25FO1FBREMsS0FBSyxFQUFFOzsrREFDbUI7SUFJM0I7UUFEQyxLQUFLLEVBQUU7OzsyREFDNkQ7SUFlM0Q7UUFBVCxNQUFNLEVBQUU7a0NBQStCLFlBQVk7aUVBQXNDO0lBR2hGO1FBQVQsTUFBTSxFQUFFO2tDQUF1QixZQUFZO3lEQUNGO0lBR2hDO1FBQVQsTUFBTSxFQUFFO2tDQUF5QixZQUFZOzJEQUFrQztJQUd0RTtRQUFULE1BQU0sRUFBRTtrQ0FBNkIsWUFBWTsrREFDSjtJQXRGMUIsZ0JBQWdCO1FBRnJDLFNBQVMsRUFBRTtRQUNaLHNDQUFzQzs7UUE2RnZCLFdBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFBLEVBQUUsV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUNuQyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTt5Q0FIOUIsVUFBVTtZQUNRLGlCQUFpQjtPQTNGdkMsZ0JBQWdCLENBNFNyQztJQUFELHVCQUFDO0tBQUE7U0E1U3FCLGdCQUFnQjtBQThTdEM7Ozs7R0FJRztBQW9CSDs7SUFBQSxJQUFhLFdBQVcsbUJBQXhCLE1BQWEsV0FBWSxTQUFRLGdCQUFnQjtRQUsvQyxZQUFZLFVBQXNCLEVBQ3RCLGlCQUFvQyxFQUNDLGFBQTZCLEVBQ3ZCLGFBQXNCO1lBQzNFLEtBQUssQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7S0FDRixDQUFBO0lBVitDO1FBQTdDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQVcsU0FBUztpREFBUztJQUM3QztRQUE1QixTQUFTLENBQUMsZ0JBQWdCLENBQUM7a0NBQWtCLFVBQVU7d0RBQUM7SUFDakM7UUFBdkIsU0FBUyxDQUFDLFdBQVcsQ0FBQzs7bURBQW1DO0lBSC9DLFdBQVc7UUFuQnZCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLGd5RUFBNkI7WUFFN0IsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7WUFDckMsK0NBQStDO1lBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO1lBQ2hELE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUM7WUFDbEMsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFdBQVcsRUFBRSxhQUFXO2lCQUN6QixDQUFDO1lBQ0YsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixzQ0FBc0MsRUFBRSxlQUFlO2dCQUN2RCx1Q0FBdUMsRUFBRSw0QkFBNEI7YUFDdEU7O1NBQ0YsQ0FBQztRQVFhLFdBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFBLEVBQUUsV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUNuQyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTt5Q0FIOUIsVUFBVTtZQUNILGlCQUFpQjtPQU5yQyxXQUFXLENBV3ZCO0lBQUQsa0JBQUM7S0FBQTtTQVhZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNQVRfVEFCX0dST1VQLCBNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TUFUX1RBQlNfQ09ORklHLCBNYXRUYWJzQ29uZmlnfSBmcm9tICcuL3RhYi1jb25maWcnO1xuXG5cbi8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRCdzIGZvciBlYWNoIHRhYiBjb21wb25lbnQgKi9cbmxldCBuZXh0SWQgPSAwO1xuXG4vKiogQSBzaW1wbGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgb24gZm9jdXMgb3Igc2VsZWN0aW9uIGNoYW5nZXMuICovXG5leHBvcnQgY2xhc3MgTWF0VGFiQ2hhbmdlRXZlbnQge1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB0YWIuICovXG4gIGluZGV4OiBudW1iZXI7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB0YWIuICovXG4gIHRhYjogTWF0VGFiO1xufVxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgdGFiIGhlYWRlci4gKi9cbmV4cG9ydCB0eXBlIE1hdFRhYkhlYWRlclBvc2l0aW9uID0gJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiR3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0VGFiR3JvdXBNaXhpbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0VGFiR3JvdXBNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdFRhYkdyb3VwTWl4aW5CYXNlID1cbiAgICBtaXhpbkNvbG9yKG1peGluRGlzYWJsZVJpcHBsZShNYXRUYWJHcm91cE1peGluQmFzZSksICdwcmltYXJ5Jyk7XG5cbmludGVyZmFjZSBNYXRUYWJHcm91cEJhc2VIZWFkZXIge1xuICBfYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiOiAoKSA9PiB2b2lkO1xuICBmb2N1c0luZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkdyb3VwQmFzZWAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJHcm91cEJhc2UgZXh0ZW5kcyBfTWF0VGFiR3JvdXBNaXhpbkJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyQ29udGVudENoZWNrZWQsIE9uRGVzdHJveSwgQ2FuQ29sb3IsIENhbkRpc2FibGVSaXBwbGUge1xuXG4gIC8qKlxuICAgKiBBbGwgdGFicyBpbnNpZGUgdGhlIHRhYiBncm91cC4gVGhpcyBpbmNsdWRlcyB0YWJzIHRoYXQgYmVsb25nIHRvIGdyb3VwcyB0aGF0IGFyZSBuZXN0ZWRcbiAgICogaW5zaWRlIHRoZSBjdXJyZW50IG9uZS4gV2UgZmlsdGVyIG91dCBvbmx5IHRoZSB0YWJzIHRoYXQgYmVsb25nIHRvIHRoaXMgZ3JvdXAgaW4gYF90YWJzYC5cbiAgICovXG4gIGFic3RyYWN0IF9hbGxUYWJzOiBRdWVyeUxpc3Q8TWF0VGFiPjtcbiAgYWJzdHJhY3QgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBhYnN0cmFjdCBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgLyoqIEFsbCBvZiB0aGUgdGFicyB0aGF0IGJlbG9uZyB0byB0aGUgZ3JvdXAuICovXG4gIF90YWJzOiBRdWVyeUxpc3Q8TWF0VGFiPiA9IG5ldyBRdWVyeUxpc3Q8TWF0VGFiPigpO1xuXG4gIC8qKiBUaGUgdGFiIGluZGV4IHRoYXQgc2hvdWxkIGJlIHNlbGVjdGVkIGFmdGVyIHRoZSBjb250ZW50IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX2luZGV4VG9TZWxlY3Q6IG51bWJlciB8IG51bGwgPSAwO1xuXG4gIC8qKiBTbmFwc2hvdCBvZiB0aGUgaGVpZ2h0IG9mIHRoZSB0YWIgYm9keSB3cmFwcGVyIGJlZm9yZSBhbm90aGVyIHRhYiBpcyBhY3RpdmF0ZWQuICovXG4gIHByaXZhdGUgX3RhYkJvZHlXcmFwcGVySGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGFicyBiZWluZyBhZGRlZC9yZW1vdmVkLiAqL1xuICBwcml2YXRlIF90YWJzU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gY2hhbmdlcyBpbiB0aGUgdGFiIGxhYmVscy4gKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRhYiBncm91cCBzaG91bGQgZ3JvdyB0byB0aGUgc2l6ZSBvZiB0aGUgYWN0aXZlIHRhYi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGR5bmFtaWNIZWlnaHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9keW5hbWljSGVpZ2h0OyB9XG4gIHNldCBkeW5hbWljSGVpZ2h0KHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2R5bmFtaWNIZWlnaHQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX2R5bmFtaWNIZWlnaHQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGluZGV4IG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWRJbmRleCgpOiBudW1iZXIgfCBudWxsIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkSW5kZXg7IH1cbiAgc2V0IHNlbGVjdGVkSW5kZXgodmFsdWU6IG51bWJlciB8IG51bGwpIHtcbiAgICB0aGlzLl9pbmRleFRvU2VsZWN0ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIG51bGwpO1xuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgdGFiIGhlYWRlci4gKi9cbiAgQElucHV0KCkgaGVhZGVyUG9zaXRpb246IE1hdFRhYkhlYWRlclBvc2l0aW9uID0gJ2Fib3ZlJztcblxuICAvKiogRHVyYXRpb24gZm9yIHRoZSB0YWIgYW5pbWF0aW9uLiBXaWxsIGJlIG5vcm1hbGl6ZWQgdG8gbWlsbGlzZWNvbmRzIGlmIG5vIHVuaXRzIGFyZSBzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhbmltYXRpb25EdXJhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYW5pbWF0aW9uRHVyYXRpb247IH1cbiAgc2V0IGFuaW1hdGlvbkR1cmF0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hbmltYXRpb25EdXJhdGlvbiA9IC9eXFxkKyQvLnRlc3QodmFsdWUpID8gdmFsdWUgKyAnbXMnIDogdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBwYWdpbmF0aW9uIHNob3VsZCBiZSBkaXNhYmxlZC4gVGhpcyBjYW4gYmUgdXNlZCB0byBhdm9pZCB1bm5lY2Vzc2FyeVxuICAgKiBsYXlvdXQgcmVjYWxjdWxhdGlvbnMgaWYgaXQncyBrbm93biB0aGF0IHBhZ2luYXRpb24gd29uJ3QgYmUgcmVxdWlyZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBkaXNhYmxlUGFnaW5hdGlvbjogYm9vbGVhbjtcblxuICAvKiogQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgdGFiIGdyb3VwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYmFja2dyb3VuZENvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9iYWNrZ3JvdW5kQ29sb3I7IH1cbiAgc2V0IGJhY2tncm91bmRDb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWNrZ3JvdW5kLSR7dGhpcy5iYWNrZ3JvdW5kQ29sb3J9YCk7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9iYWNrZ3JvdW5kQ29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogT3V0cHV0IHRvIGVuYWJsZSBzdXBwb3J0IGZvciB0d28td2F5IGJpbmRpbmcgb24gYFsoc2VsZWN0ZWRJbmRleCldYCAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRJbmRleENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGZvY3VzIGhhcyBjaGFuZ2VkIHdpdGhpbiBhIHRhYiBncm91cC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGZvY3VzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYm9keSBhbmltYXRpb24gaGFzIGNvbXBsZXRlZCAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYW5pbWF0aW9uRG9uZTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRhYiBzZWxlY3Rpb24gaGFzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZFRhYkNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50Pih0cnVlKTtcblxuICBwcml2YXRlIF9ncm91cElkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX1RBQlNfQ09ORklHKSBAT3B0aW9uYWwoKSBkZWZhdWx0Q29uZmlnPzogTWF0VGFic0NvbmZpZyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2dyb3VwSWQgPSBuZXh0SWQrKztcbiAgICB0aGlzLmFuaW1hdGlvbkR1cmF0aW9uID0gZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uID9cbiAgICAgICAgZGVmYXVsdENvbmZpZy5hbmltYXRpb25EdXJhdGlvbiA6ICc1MDBtcyc7XG4gICAgdGhpcy5kaXNhYmxlUGFnaW5hdGlvbiA9IGRlZmF1bHRDb25maWcgJiYgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiAhPSBudWxsID9cbiAgICAgICAgZGVmYXVsdENvbmZpZy5kaXNhYmxlUGFnaW5hdGlvbiA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIHRoZSBjb250ZW50IGlzIGNoZWNrZWQsIHRoaXMgY29tcG9uZW50IGtub3dzIHdoYXQgdGFicyBoYXZlIGJlZW4gZGVmaW5lZFxuICAgKiBhbmQgd2hhdCB0aGUgc2VsZWN0ZWQgaW5kZXggc2hvdWxkIGJlLiBUaGlzIGlzIHdoZXJlIHdlIGNhbiBrbm93IGV4YWN0bHkgd2hhdCBwb3NpdGlvblxuICAgKiBlYWNoIHRhYiBzaG91bGQgYmUgaW4gYWNjb3JkaW5nIHRvIHRoZSBuZXcgc2VsZWN0ZWQgaW5kZXgsIGFuZCBhZGRpdGlvbmFsbHkgd2Uga25vdyBob3dcbiAgICogYSBuZXcgc2VsZWN0ZWQgdGFiIHNob3VsZCB0cmFuc2l0aW9uIGluIChmcm9tIHRoZSBsZWZ0IG9yIHJpZ2h0KS5cbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBEb24ndCBjbGFtcCB0aGUgYGluZGV4VG9TZWxlY3RgIGltbWVkaWF0ZWx5IGluIHRoZSBzZXR0ZXIgYmVjYXVzZSBpdCBjYW4gaGFwcGVuIHRoYXRcbiAgICAvLyB0aGUgYW1vdW50IG9mIHRhYnMgY2hhbmdlcyBiZWZvcmUgdGhlIGFjdHVhbCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bnMuXG4gICAgY29uc3QgaW5kZXhUb1NlbGVjdCA9IHRoaXMuX2luZGV4VG9TZWxlY3QgPSB0aGlzLl9jbGFtcFRhYkluZGV4KHRoaXMuX2luZGV4VG9TZWxlY3QpO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBjaGFuZ2UgaW4gc2VsZWN0ZWQgaW5kZXgsIGVtaXQgYSBjaGFuZ2UgZXZlbnQuIFNob3VsZCBub3QgdHJpZ2dlciBpZlxuICAgIC8vIHRoZSBzZWxlY3RlZCBpbmRleCBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIGNvbnN0IGlzRmlyc3RSdW4gPSB0aGlzLl9zZWxlY3RlZEluZGV4ID09IG51bGw7XG5cbiAgICAgIGlmICghaXNGaXJzdFJ1bikge1xuICAgICAgICB0aGlzLnNlbGVjdGVkVGFiQ2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXhUb1NlbGVjdCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGFuZ2luZyB0aGVzZSB2YWx1ZXMgYWZ0ZXIgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuXG4gICAgICAvLyBzaW5jZSB0aGUgY2hlY2tlZCBjb250ZW50IG1heSBjb250YWluIHJlZmVyZW5jZXMgdG8gdGhlbS5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHRhYi5pc0FjdGl2ZSA9IGluZGV4ID09PSBpbmRleFRvU2VsZWN0KTtcblxuICAgICAgICBpZiAoIWlzRmlyc3RSdW4pIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2UuZW1pdChpbmRleFRvU2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0dXAgdGhlIHBvc2l0aW9uIGZvciBlYWNoIHRhYiBhbmQgb3B0aW9uYWxseSBzZXR1cCBhbiBvcmlnaW4gb24gdGhlIG5leHQgc2VsZWN0ZWQgdGFiLlxuICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiOiBNYXRUYWIsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHRhYi5wb3NpdGlvbiA9IGluZGV4IC0gaW5kZXhUb1NlbGVjdDtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYiwgdGhlbiBzZXQgdXAgYW4gb3JpZ2luIGZvciB0aGUgbmV4dCBzZWxlY3RlZCB0YWJcbiAgICAgIC8vIGlmIGl0IGRvZXNuJ3QgaGF2ZSBvbmUgYWxyZWFkeS5cbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IG51bGwgJiYgdGFiLnBvc2l0aW9uID09IDAgJiYgIXRhYi5vcmlnaW4pIHtcbiAgICAgICAgdGFiLm9yaWdpbiA9IGluZGV4VG9TZWxlY3QgLSB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT09IGluZGV4VG9TZWxlY3QpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSBpbmRleFRvU2VsZWN0O1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3N1YnNjcmliZVRvQWxsVGFiQ2hhbmdlcygpO1xuICAgIHRoaXMuX3N1YnNjcmliZVRvVGFiTGFiZWxzKCk7XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgYW1vdW50IG9mIHRhYnMsIGluIG9yZGVyIHRvIGJlXG4gICAgLy8gYWJsZSB0byByZS1yZW5kZXIgdGhlIGNvbnRlbnQgYXMgbmV3IHRhYnMgYXJlIGFkZGVkIG9yIHJlbW92ZWQuXG4gICAgdGhpcy5fdGFic1N1YnNjcmlwdGlvbiA9IHRoaXMuX3RhYnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXhUb1NlbGVjdCA9IHRoaXMuX2NsYW1wVGFiSW5kZXgodGhpcy5faW5kZXhUb1NlbGVjdCk7XG5cbiAgICAgIC8vIE1haW50YWluIHRoZSBwcmV2aW91c2x5LXNlbGVjdGVkIHRhYiBpZiBhIG5ldyB0YWIgaXMgYWRkZWQgb3IgcmVtb3ZlZCBhbmQgdGhlcmUgaXMgbm9cbiAgICAgIC8vIGV4cGxpY2l0IGNoYW5nZSB0aGF0IHNlbGVjdHMgYSBkaWZmZXJlbnQgdGFiLlxuICAgICAgaWYgKGluZGV4VG9TZWxlY3QgPT09IHRoaXMuX3NlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgY29uc3QgdGFicyA9IHRoaXMuX3RhYnMudG9BcnJheSgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0YWJzW2ldLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAvLyBBc3NpZ24gYm90aCB0byB0aGUgYF9pbmRleFRvU2VsZWN0YCBhbmQgYF9zZWxlY3RlZEluZGV4YCBzbyB3ZSBkb24ndCBmaXJlIGEgY2hhbmdlZFxuICAgICAgICAgICAgLy8gZXZlbnQsIG90aGVyd2lzZSB0aGUgY29uc3VtZXIgbWF5IGVuZCB1cCBpbiBhbiBpbmZpbml0ZSBsb29wIGluIHNvbWUgZWRnZSBjYXNlcyBsaWtlXG4gICAgICAgICAgICAvLyBhZGRpbmcgYSB0YWIgd2l0aGluIHRoZSBgc2VsZWN0ZWRJbmRleENoYW5nZWAgZXZlbnQuXG4gICAgICAgICAgICB0aGlzLl9pbmRleFRvU2VsZWN0ID0gdGhpcy5fc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogTGlzdGVucyB0byBjaGFuZ2VzIGluIGFsbCBvZiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9BbGxUYWJDaGFuZ2VzKCkge1xuICAgIC8vIFNpbmNlIHdlIHVzZSBhIHF1ZXJ5IHdpdGggYGRlc2NlbmRhbnRzOiB0cnVlYCB0byBwaWNrIHVwIHRoZSB0YWJzLCB3ZSBtYXkgZW5kIHVwIGNhdGNoaW5nXG4gICAgLy8gc29tZSB0aGF0IGFyZSBpbnNpZGUgb2YgbmVzdGVkIHRhYiBncm91cHMuIFdlIGZpbHRlciB0aGVtIG91dCBtYW51YWxseSBieSBjaGVja2luZyB0aGF0XG4gICAgLy8gdGhlIGNsb3Nlc3QgZ3JvdXAgdG8gdGhlIHRhYiBpcyB0aGUgY3VycmVudCBvbmUuXG4gICAgdGhpcy5fYWxsVGFicy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWxsVGFicykpXG4gICAgICAuc3Vic2NyaWJlKCh0YWJzOiBRdWVyeUxpc3Q8TWF0VGFiPikgPT4ge1xuICAgICAgICB0aGlzLl90YWJzLnJlc2V0KHRhYnMuZmlsdGVyKHRhYiA9PiB7XG4gICAgICAgICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMC4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBfY2xvc2VzdFRhYkdyb3VwYFxuICAgICAgICAgIC8vIG9uY2UgaXQgYmVjb21lcyBhIHJlcXVpcmVkIHBhcmFtZXRlciBpbiBNYXRUYWIuXG4gICAgICAgICAgcmV0dXJuICF0YWIuX2Nsb3Nlc3RUYWJHcm91cCB8fCB0YWIuX2Nsb3Nlc3RUYWJHcm91cCA9PT0gdGhpcztcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLl90YWJzLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl90YWJzLmRlc3Ryb3koKTtcbiAgICB0aGlzLl90YWJzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fdGFiTGFiZWxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBSZS1hbGlnbnMgdGhlIGluayBiYXIgdG8gdGhlIHNlbGVjdGVkIHRhYiBlbGVtZW50LiAqL1xuICByZWFsaWduSW5rQmFyKCkge1xuICAgIGlmICh0aGlzLl90YWJIZWFkZXIpIHtcbiAgICAgIHRoaXMuX3RhYkhlYWRlci5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgfVxuICB9XG5cbiAgX2ZvY3VzQ2hhbmdlZChpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5mb2N1c0NoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4KSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVDaGFuZ2VFdmVudChpbmRleDogbnVtYmVyKTogTWF0VGFiQ2hhbmdlRXZlbnQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdFRhYkNoYW5nZUV2ZW50O1xuICAgIGV2ZW50LmluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHRoaXMuX3RhYnMgJiYgdGhpcy5fdGFicy5sZW5ndGgpIHtcbiAgICAgIGV2ZW50LnRhYiA9IHRoaXMuX3RhYnMudG9BcnJheSgpW2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gY2hhbmdlcyBpbiB0aGUgdGFiIGxhYmVscy4gVGhpcyBpcyBuZWVkZWQsIGJlY2F1c2UgdGhlIEBJbnB1dCBmb3IgdGhlIGxhYmVsIGlzXG4gICAqIG9uIHRoZSBNYXRUYWIgY29tcG9uZW50LCB3aGVyZWFzIHRoZSBkYXRhIGJpbmRpbmcgaXMgaW5zaWRlIHRoZSBNYXRUYWJHcm91cC4gSW4gb3JkZXIgZm9yIHRoZVxuICAgKiBiaW5kaW5nIHRvIGJlIHVwZGF0ZWQsIHdlIG5lZWQgdG8gc3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gaXQgYW5kIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvblxuICAgKiBtYW51YWxseS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvVGFiTGFiZWxzKCkge1xuICAgIGlmICh0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fdGFiTGFiZWxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLnRoaXMuX3RhYnMubWFwKHRhYiA9PiB0YWIuX3N0YXRlQ2hhbmdlcykpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIC8qKiBDbGFtcHMgdGhlIGdpdmVuIGluZGV4IHRvIHRoZSBib3VuZHMgb2YgMCBhbmQgdGhlIHRhYnMgbGVuZ3RoLiAqL1xuICBwcml2YXRlIF9jbGFtcFRhYkluZGV4KGluZGV4OiBudW1iZXIgfCBudWxsKTogbnVtYmVyIHtcbiAgICAvLyBOb3RlIHRoZSBgfHwgMGAsIHdoaWNoIGVuc3VyZXMgdGhhdCB2YWx1ZXMgbGlrZSBOYU4gY2FuJ3QgZ2V0IHRocm91Z2hcbiAgICAvLyBhbmQgd2hpY2ggd291bGQgb3RoZXJ3aXNlIHRocm93IHRoZSBjb21wb25lbnQgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gKHNpbmNlIE1hdGgubWF4KE5hTiwgMCkgPT09IE5hTikuXG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuX3RhYnMubGVuZ3RoIC0gMSwgTWF0aC5tYXgoaW5kZXggfHwgMCwgMCkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggdGFiIGxhYmVsIGVsZW1lbnQgKi9cbiAgX2dldFRhYkxhYmVsSWQoaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYG1hdC10YWItbGFiZWwtJHt0aGlzLl9ncm91cElkfS0ke2l9YDtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGEgdW5pcXVlIGlkIGZvciBlYWNoIHRhYiBjb250ZW50IGVsZW1lbnQgKi9cbiAgX2dldFRhYkNvbnRlbnRJZChpOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbWF0LXRhYi1jb250ZW50LSR7dGhpcy5fZ3JvdXBJZH0tJHtpfWA7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIHRoZSBib2R5IHdyYXBwZXIgdG8gdGhlIGhlaWdodCBvZiB0aGUgYWN0aXZhdGluZyB0YWIgaWYgZHluYW1pY1xuICAgKiBoZWlnaHQgcHJvcGVydHkgaXMgdHJ1ZS5cbiAgICovXG4gIF9zZXRUYWJCb2R5V3JhcHBlckhlaWdodCh0YWJIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZHluYW1pY0hlaWdodCB8fCAhdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB3cmFwcGVyOiBIVE1MRWxlbWVudCA9IHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IHRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0ICsgJ3B4JztcblxuICAgIC8vIFRoaXMgY29uZGl0aW9uYWwgZm9yY2VzIHRoZSBicm93c2VyIHRvIHBhaW50IHRoZSBoZWlnaHQgc28gdGhhdFxuICAgIC8vIHRoZSBhbmltYXRpb24gdG8gdGhlIG5ldyBoZWlnaHQgY2FuIGhhdmUgYW4gb3JpZ2luLlxuICAgIGlmICh0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSB0YWJIZWlnaHQgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBib2R5IHdyYXBwZXIuICovXG4gIF9yZW1vdmVUYWJCb2R5V3JhcHBlckhlaWdodCgpOiB2b2lkIHtcbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCA9IHdyYXBwZXIuY2xpZW50SGVpZ2h0O1xuICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgdGhpcy5hbmltYXRpb25Eb25lLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgY2xpY2sgZXZlbnRzLCBzZXR0aW5nIG5ldyBzZWxlY3RlZCBpbmRleCBpZiBhcHByb3ByaWF0ZS4gKi9cbiAgX2hhbmRsZUNsaWNrKHRhYjogTWF0VGFiLCB0YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlciwgaW5kZXg6IG51bWJlcikge1xuICAgIGlmICghdGFiLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0YWJIZWFkZXIuZm9jdXNJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXRyaWV2ZXMgdGhlIHRhYmluZGV4IGZvciB0aGUgdGFiLiAqL1xuICBfZ2V0VGFiSW5kZXgodGFiOiBNYXRUYWIsIGlkeDogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKHRhYi5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSW5kZXggPT09IGlkeCA/IDAgOiAtMTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9keW5hbWljSGVpZ2h0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hbmltYXRpb25EdXJhdGlvbjogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zZWxlY3RlZEluZGV4OiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gdGFiLWdyb3VwIGNvbXBvbmVudC4gU3VwcG9ydHMgYmFzaWMgdGFiIHBhaXJzIChsYWJlbCArIGNvbnRlbnQpIGFuZCBpbmNsdWRlc1xuICogYW5pbWF0ZWQgaW5rLWJhciwga2V5Ym9hcmQgbmF2aWdhdGlvbiwgYW5kIHNjcmVlbiByZWFkZXIuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvdGFicy5odG1sXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItZ3JvdXAnLFxuICBleHBvcnRBczogJ21hdFRhYkdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItZ3JvdXAuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgaW5wdXRzOiBbJ2NvbG9yJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9UQUJfR1JPVVAsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdFRhYkdyb3VwXG4gIH1dLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItZ3JvdXAnLFxuICAgICdbY2xhc3MubWF0LXRhYi1ncm91cC1keW5hbWljLWhlaWdodF0nOiAnZHluYW1pY0hlaWdodCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWludmVydGVkLWhlYWRlcl0nOiAnaGVhZGVyUG9zaXRpb24gPT09IFwiYmVsb3dcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkdyb3VwIGV4dGVuZHMgX01hdFRhYkdyb3VwQmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VGFiLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfYWxsVGFiczogUXVlcnlMaXN0PE1hdFRhYj47XG4gIEBWaWV3Q2hpbGQoJ3RhYkJvZHlXcmFwcGVyJykgX3RhYkJvZHlXcmFwcGVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJIZWFkZXInKSBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9UQUJTX0NPTkZJRykgQE9wdGlvbmFsKCkgZGVmYXVsdENvbmZpZz86IE1hdFRhYnNDb25maWcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIGRlZmF1bHRDb25maWcsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG59XG4iXX0=