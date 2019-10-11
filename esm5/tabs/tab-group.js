/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewEncapsulation, Optional, Inject, InjectionToken, Directive, } from '@angular/core';
import { mixinColor, mixinDisableRipple, } from '@angular/material/core';
import { merge, Subscription } from 'rxjs';
import { MatTab } from './tab';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/** Used to generate unique ID's for each tab component */
var nextId = 0;
/** A simple change event emitted on focus or selection changes. */
var MatTabChangeEvent = /** @class */ (function () {
    function MatTabChangeEvent() {
    }
    return MatTabChangeEvent;
}());
export { MatTabChangeEvent };
/** Injection token that can be used to provide the default options the tabs module. */
export var MAT_TABS_CONFIG = new InjectionToken('MAT_TABS_CONFIG');
// Boilerplate for applying mixins to MatTabGroup.
/** @docs-private */
var MatTabGroupMixinBase = /** @class */ (function () {
    function MatTabGroupMixinBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatTabGroupMixinBase;
}());
var _MatTabGroupMixinBase = mixinColor(mixinDisableRipple(MatTabGroupMixinBase), 'primary');
/**
 * Base class with all of the `MatTabGroupBase` functionality.
 * @docs-private
 */
var _MatTabGroupBase = /** @class */ (function (_super) {
    tslib_1.__extends(_MatTabGroupBase, _super);
    function _MatTabGroupBase(elementRef, _changeDetectorRef, defaultConfig, _animationMode) {
        var _this = _super.call(this, elementRef) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._animationMode = _animationMode;
        /** The tab index that should be selected after the content has been checked. */
        _this._indexToSelect = 0;
        /** Snapshot of the height of the tab body wrapper before another tab is activated. */
        _this._tabBodyWrapperHeight = 0;
        /** Subscription to tabs being added/removed. */
        _this._tabsSubscription = Subscription.EMPTY;
        /** Subscription to changes in the tab labels. */
        _this._tabLabelSubscription = Subscription.EMPTY;
        _this._dynamicHeight = false;
        _this._selectedIndex = null;
        /** Position of the tab header. */
        _this.headerPosition = 'above';
        /** Output to enable support for two-way binding on `[(selectedIndex)]` */
        _this.selectedIndexChange = new EventEmitter();
        /** Event emitted when focus has changed within a tab group. */
        _this.focusChange = new EventEmitter();
        /** Event emitted when the body animation has completed */
        _this.animationDone = new EventEmitter();
        /** Event emitted when the tab selection has changed. */
        _this.selectedTabChange = new EventEmitter(true);
        _this._groupId = nextId++;
        _this.animationDuration = defaultConfig && defaultConfig.animationDuration ?
            defaultConfig.animationDuration : '500ms';
        return _this;
    }
    Object.defineProperty(_MatTabGroupBase.prototype, "dynamicHeight", {
        /** Whether the tab group should grow to the size of the active tab. */
        get: function () { return this._dynamicHeight; },
        set: function (value) { this._dynamicHeight = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatTabGroupBase.prototype, "selectedIndex", {
        /** The index of the active tab. */
        get: function () { return this._selectedIndex; },
        set: function (value) {
            this._indexToSelect = coerceNumberProperty(value, null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatTabGroupBase.prototype, "animationDuration", {
        /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
        get: function () { return this._animationDuration; },
        set: function (value) {
            this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_MatTabGroupBase.prototype, "backgroundColor", {
        /** Background color of the tab group. */
        get: function () { return this._backgroundColor; },
        set: function (value) {
            var nativeElement = this._elementRef.nativeElement;
            nativeElement.classList.remove("mat-background-" + this.backgroundColor);
            if (value) {
                nativeElement.classList.add("mat-background-" + value);
            }
            this._backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    _MatTabGroupBase.prototype.ngAfterContentChecked = function () {
        var _this = this;
        // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
        // the amount of tabs changes before the actual change detection runs.
        var indexToSelect = this._indexToSelect = this._clampTabIndex(this._indexToSelect);
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != indexToSelect) {
            var isFirstRun_1 = this._selectedIndex == null;
            if (!isFirstRun_1) {
                this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
            }
            // Changing these values after change detection has run
            // since the checked content may contain references to them.
            Promise.resolve().then(function () {
                _this._tabs.forEach(function (tab, index) { return tab.isActive = index === indexToSelect; });
                if (!isFirstRun_1) {
                    _this.selectedIndexChange.emit(indexToSelect);
                }
            });
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach(function (tab, index) {
            tab.position = index - indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (_this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = indexToSelect - _this._selectedIndex;
            }
        });
        if (this._selectedIndex !== indexToSelect) {
            this._selectedIndex = indexToSelect;
            this._changeDetectorRef.markForCheck();
        }
    };
    _MatTabGroupBase.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._subscribeToTabLabels();
        // Subscribe to changes in the amount of tabs, in order to be
        // able to re-render the content as new tabs are added or removed.
        this._tabsSubscription = this._tabs.changes.subscribe(function () {
            var indexToSelect = _this._clampTabIndex(_this._indexToSelect);
            // Maintain the previously-selected tab if a new tab is added or removed and there is no
            // explicit change that selects a different tab.
            if (indexToSelect === _this._selectedIndex) {
                var tabs = _this._tabs.toArray();
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].isActive) {
                        // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
                        // event, otherwise the consumer may end up in an infinite loop in some edge cases like
                        // adding a tab within the `selectedIndexChange` event.
                        _this._indexToSelect = _this._selectedIndex = i;
                        break;
                    }
                }
            }
            _this._subscribeToTabLabels();
            _this._changeDetectorRef.markForCheck();
        });
    };
    _MatTabGroupBase.prototype.ngOnDestroy = function () {
        this._tabsSubscription.unsubscribe();
        this._tabLabelSubscription.unsubscribe();
    };
    /** Re-aligns the ink bar to the selected tab element. */
    _MatTabGroupBase.prototype.realignInkBar = function () {
        if (this._tabHeader) {
            this._tabHeader._alignInkBarToSelectedTab();
        }
    };
    _MatTabGroupBase.prototype._focusChanged = function (index) {
        this.focusChange.emit(this._createChangeEvent(index));
    };
    _MatTabGroupBase.prototype._createChangeEvent = function (index) {
        var event = new MatTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /**
     * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
     * on the MatTab component, whereas the data binding is inside the MatTabGroup. In order for the
     * binding to be updated, we need to subscribe to changes in it and trigger change detection
     * manually.
     */
    _MatTabGroupBase.prototype._subscribeToTabLabels = function () {
        var _this = this;
        if (this._tabLabelSubscription) {
            this._tabLabelSubscription.unsubscribe();
        }
        this._tabLabelSubscription = merge.apply(void 0, tslib_1.__spread(this._tabs.map(function (tab) { return tab._stateChanges; }))).subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
    };
    /** Clamps the given index to the bounds of 0 and the tabs length. */
    _MatTabGroupBase.prototype._clampTabIndex = function (index) {
        // Note the `|| 0`, which ensures that values like NaN can't get through
        // and which would otherwise throw the component into an infinite loop
        // (since Math.max(NaN, 0) === NaN).
        return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
    };
    /** Returns a unique id for each tab label element */
    _MatTabGroupBase.prototype._getTabLabelId = function (i) {
        return "mat-tab-label-" + this._groupId + "-" + i;
    };
    /** Returns a unique id for each tab content element */
    _MatTabGroupBase.prototype._getTabContentId = function (i) {
        return "mat-tab-content-" + this._groupId + "-" + i;
    };
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    _MatTabGroupBase.prototype._setTabBodyWrapperHeight = function (tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        var wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.height = this._tabBodyWrapperHeight + 'px';
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            wrapper.style.height = tabHeight + 'px';
        }
    };
    /** Removes the height of the tab body wrapper. */
    _MatTabGroupBase.prototype._removeTabBodyWrapperHeight = function () {
        var wrapper = this._tabBodyWrapper.nativeElement;
        this._tabBodyWrapperHeight = wrapper.clientHeight;
        wrapper.style.height = '';
        this.animationDone.emit();
    };
    /** Handle click events, setting new selected index if appropriate. */
    _MatTabGroupBase.prototype._handleClick = function (tab, tabHeader, index) {
        if (!tab.disabled) {
            this.selectedIndex = tabHeader.focusIndex = index;
        }
    };
    /** Retrieves the tabindex for the tab. */
    _MatTabGroupBase.prototype._getTabIndex = function (tab, idx) {
        if (tab.disabled) {
            return null;
        }
        return this.selectedIndex === idx ? 0 : -1;
    };
    _MatTabGroupBase.decorators = [
        { type: Directive, args: [{
                    // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                    selector: 'do-not-use-abstract-mat-tab-group-base'
                },] }
    ];
    /** @nocollapse */
    _MatTabGroupBase.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_TABS_CONFIG,] }, { type: Optional }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    _MatTabGroupBase.propDecorators = {
        dynamicHeight: [{ type: Input }],
        selectedIndex: [{ type: Input }],
        headerPosition: [{ type: Input }],
        animationDuration: [{ type: Input }],
        backgroundColor: [{ type: Input }],
        selectedIndexChange: [{ type: Output }],
        focusChange: [{ type: Output }],
        animationDone: [{ type: Output }],
        selectedTabChange: [{ type: Output }]
    };
    return _MatTabGroupBase;
}(_MatTabGroupMixinBase));
export { _MatTabGroupBase };
/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
var MatTabGroup = /** @class */ (function (_super) {
    tslib_1.__extends(MatTabGroup, _super);
    function MatTabGroup(elementRef, changeDetectorRef, defaultConfig, animationMode) {
        return _super.call(this, elementRef, changeDetectorRef, defaultConfig, animationMode) || this;
    }
    MatTabGroup.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-tab-group',
                    exportAs: 'matTabGroup',
                    template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex\"\n               [disableRipple]=\"disableRipple\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex == i\"\n               [content]=\"tab.content\"\n               [position]=\"tab.position\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    inputs: ['color', 'disableRipple'],
                    host: {
                        'class': 'mat-tab-group',
                        '[class.mat-tab-group-dynamic-height]': 'dynamicHeight',
                        '[class.mat-tab-group-inverted-header]': 'headerPosition === "below"',
                    },
                    styles: [".mat-tab-group{display:flex;flex-direction:column}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}@media(-ms-high-contrast: active){.mat-tab-label:focus{outline:dotted 2px}}.mat-tab-label.mat-tab-disabled{cursor:default}@media(-ms-high-contrast: active){.mat-tab-label.mat-tab-disabled{opacity:.5}}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}@media(-ms-high-contrast: active){.mat-tab-label{opacity:1}}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"]
                }] }
    ];
    /** @nocollapse */
    MatTabGroup.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_TABS_CONFIG,] }, { type: Optional }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    MatTabGroup.propDecorators = {
        _tabs: [{ type: ContentChildren, args: [MatTab,] }],
        _tabBodyWrapper: [{ type: ViewChild, args: ['tabBodyWrapper', { static: false },] }],
        _tabHeader: [{ type: ViewChild, args: ['tabHeader', { static: false },] }]
    };
    return MatTabGroup;
}(_MatTabGroupBase));
export { MatTabGroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRixPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLGNBQWMsRUFDZCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUtMLFVBQVUsRUFDVixrQkFBa0IsR0FFbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzdCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLDBEQUEwRDtBQUMxRCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixtRUFBbUU7QUFDbkU7SUFBQTtJQUtBLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFMRCxJQUtDOztBQVdELHVGQUF1RjtBQUN2RixNQUFNLENBQUMsSUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWdCLGlCQUFpQixDQUFDLENBQUM7QUFFcEYsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQjtJQUNFLDhCQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7SUFDaEQsMkJBQUM7QUFBRCxDQUFDLEFB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KiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIERpcmVjdGl2ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0VGFifSBmcm9tICcuL3RhYic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSUQncyBmb3IgZWFjaCB0YWIgY29tcG9uZW50ICovXG5sZXQgbmV4dElkID0gMDtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIG9uIGZvY3VzIG9yIHNlbGVjdGlvbiBjaGFuZ2VzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRhYkNoYW5nZUV2ZW50IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICBpbmRleDogbnVtYmVyO1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHktc2VsZWN0ZWQgdGFiLiAqL1xuICB0YWI6IE1hdFRhYjtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIHRhYiBoZWFkZXIuICovXG5leHBvcnQgdHlwZSBNYXRUYWJIZWFkZXJQb3NpdGlvbiA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSB0YWJzIG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0VGFic0NvbmZpZyB7XG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYiBhbmltYXRpb24uIE11c3QgYmUgYSB2YWxpZCBDU1MgdmFsdWUgKGUuZy4gNjAwbXMpLiAqL1xuICBhbmltYXRpb25EdXJhdGlvbj86IHN0cmluZztcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgdGFicyBtb2R1bGUuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQlNfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPE1hdFRhYnNDb25maWc+KCdNQVRfVEFCU19DT05GSUcnKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRUYWJHcm91cC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRUYWJHcm91cE1peGluQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRUYWJHcm91cE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0VGFiR3JvdXBNaXhpbkJhc2UgPVxuICAgIG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKE1hdFRhYkdyb3VwTWl4aW5CYXNlKSwgJ3ByaW1hcnknKTtcblxuaW50ZXJmYWNlIE1hdFRhYkdyb3VwQmFzZUhlYWRlciB7XG4gIF9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWI6ICgpID0+IHZvaWQ7XG4gIGZvY3VzSW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiR3JvdXBCYXNlYCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2VsZWN0b3IgY2FuIGJlIHJlbW92ZWQgd2hlbiB3ZSB1cGRhdGUgdG8gQW5ndWxhciA5LjAuXG4gIHNlbGVjdG9yOiAnZG8tbm90LXVzZS1hYnN0cmFjdC1tYXQtdGFiLWdyb3VwLWJhc2UnXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiR3JvdXBCYXNlIGV4dGVuZHMgX01hdFRhYkdyb3VwTWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3ksIENhbkNvbG9yLCBDYW5EaXNhYmxlUmlwcGxlIHtcbiAgYWJzdHJhY3QgX3RhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+O1xuICBhYnN0cmFjdCBfdGFiQm9keVdyYXBwZXI6IEVsZW1lbnRSZWY7XG4gIGFic3RyYWN0IF90YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlcjtcblxuICAvKiogVGhlIHRhYiBpbmRleCB0aGF0IHNob3VsZCBiZSBzZWxlY3RlZCBhZnRlciB0aGUgY29udGVudCBoYXMgYmVlbiBjaGVja2VkLiAqL1xuICBwcml2YXRlIF9pbmRleFRvU2VsZWN0OiBudW1iZXIgfCBudWxsID0gMDtcblxuICAvKiogU25hcHNob3Qgb2YgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGJvZHkgd3JhcHBlciBiZWZvcmUgYW5vdGhlciB0YWIgaXMgYWN0aXZhdGVkLiAqL1xuICBwcml2YXRlIF90YWJCb2R5V3JhcHBlckhlaWdodDogbnVtYmVyID0gMDtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRhYnMgYmVpbmcgYWRkZWQvcmVtb3ZlZC4gKi9cbiAgcHJpdmF0ZSBfdGFic1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIGNoYW5nZXMgaW4gdGhlIHRhYiBsYWJlbHMuICovXG4gIHByaXZhdGUgX3RhYkxhYmVsU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgZ3JvdXAgc2hvdWxkIGdyb3cgdG8gdGhlIHNpemUgb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkeW5hbWljSGVpZ2h0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZHluYW1pY0hlaWdodDsgfVxuICBzZXQgZHluYW1pY0hlaWdodCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9keW5hbWljSGVpZ2h0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9keW5hbWljSGVpZ2h0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpbmRleCBvZiB0aGUgYWN0aXZlIHRhYi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHwgbnVsbCB7IHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4OyB9XG4gIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBudW1iZXIgfCBudWxsKSB7XG4gICAgdGhpcy5faW5kZXhUb1NlbGVjdCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCBudWxsKTtcbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZEluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIHRhYiBoZWFkZXIuICovXG4gIEBJbnB1dCgpIGhlYWRlclBvc2l0aW9uOiBNYXRUYWJIZWFkZXJQb3NpdGlvbiA9ICdhYm92ZSc7XG5cbiAgLyoqIER1cmF0aW9uIGZvciB0aGUgdGFiIGFuaW1hdGlvbi4gV2lsbCBiZSBub3JtYWxpemVkIHRvIG1pbGxpc2Vjb25kcyBpZiBubyB1bml0cyBhcmUgc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYW5pbWF0aW9uRHVyYXRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uOyB9XG4gIHNldCBhbmltYXRpb25EdXJhdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gPSAvXlxcZCskLy50ZXN0KHZhbHVlKSA/IHZhbHVlICsgJ21zJyA6IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2FuaW1hdGlvbkR1cmF0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIHRhYiBncm91cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGJhY2tncm91bmRDb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yOyB9XG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGBtYXQtYmFja2dyb3VuZC0ke3RoaXMuYmFja2dyb3VuZENvbG9yfWApO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1iYWNrZ3JvdW5kLSR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfYmFja2dyb3VuZENvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIE91dHB1dCB0byBlbmFibGUgc3VwcG9ydCBmb3IgdHdvLXdheSBiaW5kaW5nIG9uIGBbKHNlbGVjdGVkSW5kZXgpXWAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkSW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBmb2N1cyBoYXMgY2hhbmdlZCB3aXRoaW4gYSB0YWIgZ3JvdXAuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBmb2N1c0NoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFRhYkNoYW5nZUV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGJvZHkgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0YWIgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRUYWJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4odHJ1ZSk7XG5cbiAgcHJpdmF0ZSBfZ3JvdXBJZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfVEFCU19DT05GSUcpIEBPcHRpb25hbCgpIGRlZmF1bHRDb25maWc/OiBNYXRUYWJzQ29uZmlnLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZ3JvdXBJZCA9IG5leHRJZCsrO1xuICAgIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gPSBkZWZhdWx0Q29uZmlnICYmIGRlZmF1bHRDb25maWcuYW5pbWF0aW9uRHVyYXRpb24gP1xuICAgICAgICBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uIDogJzUwMG1zJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZnRlciB0aGUgY29udGVudCBpcyBjaGVja2VkLCB0aGlzIGNvbXBvbmVudCBrbm93cyB3aGF0IHRhYnMgaGF2ZSBiZWVuIGRlZmluZWRcbiAgICogYW5kIHdoYXQgdGhlIHNlbGVjdGVkIGluZGV4IHNob3VsZCBiZS4gVGhpcyBpcyB3aGVyZSB3ZSBjYW4ga25vdyBleGFjdGx5IHdoYXQgcG9zaXRpb25cbiAgICogZWFjaCB0YWIgc2hvdWxkIGJlIGluIGFjY29yZGluZyB0byB0aGUgbmV3IHNlbGVjdGVkIGluZGV4LCBhbmQgYWRkaXRpb25hbGx5IHdlIGtub3cgaG93XG4gICAqIGEgbmV3IHNlbGVjdGVkIHRhYiBzaG91bGQgdHJhbnNpdGlvbiBpbiAoZnJvbSB0aGUgbGVmdCBvciByaWdodCkuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gRG9uJ3QgY2xhbXAgdGhlIGBpbmRleFRvU2VsZWN0YCBpbW1lZGlhdGVseSBpbiB0aGUgc2V0dGVyIGJlY2F1c2UgaXQgY2FuIGhhcHBlbiB0aGF0XG4gICAgLy8gdGhlIGFtb3VudCBvZiB0YWJzIGNoYW5nZXMgYmVmb3JlIHRoZSBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zLlxuICAgIGNvbnN0IGluZGV4VG9TZWxlY3QgPSB0aGlzLl9pbmRleFRvU2VsZWN0ID0gdGhpcy5fY2xhbXBUYWJJbmRleCh0aGlzLl9pbmRleFRvU2VsZWN0KTtcblxuICAgIC8vIElmIHRoZXJlIGlzIGEgY2hhbmdlIGluIHNlbGVjdGVkIGluZGV4LCBlbWl0IGEgY2hhbmdlIGV2ZW50LiBTaG91bGQgbm90IHRyaWdnZXIgaWZcbiAgICAvLyB0aGUgc2VsZWN0ZWQgaW5kZXggaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPSBpbmRleFRvU2VsZWN0KSB7XG4gICAgICBjb25zdCBpc0ZpcnN0UnVuID0gdGhpcy5fc2VsZWN0ZWRJbmRleCA9PSBudWxsO1xuXG4gICAgICBpZiAoIWlzRmlyc3RSdW4pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhYkNoYW5nZS5lbWl0KHRoaXMuX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4VG9TZWxlY3QpKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hhbmdpbmcgdGhlc2UgdmFsdWVzIGFmdGVyIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHJ1blxuICAgICAgLy8gc2luY2UgdGhlIGNoZWNrZWQgY29udGVudCBtYXkgY29udGFpbiByZWZlcmVuY2VzIHRvIHRoZW0uXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB0YWIuaXNBY3RpdmUgPSBpbmRleCA9PT0gaW5kZXhUb1NlbGVjdCk7XG5cbiAgICAgICAgaWYgKCFpc0ZpcnN0UnVuKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4Q2hhbmdlLmVtaXQoaW5kZXhUb1NlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFNldHVwIHRoZSBwb3NpdGlvbiBmb3IgZWFjaCB0YWIgYW5kIG9wdGlvbmFsbHkgc2V0dXAgYW4gb3JpZ2luIG9uIHRoZSBuZXh0IHNlbGVjdGVkIHRhYi5cbiAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYjogTWF0VGFiLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0YWIucG9zaXRpb24gPSBpbmRleCAtIGluZGV4VG9TZWxlY3Q7XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSBzZWxlY3RlZCB0YWIsIHRoZW4gc2V0IHVwIGFuIG9yaWdpbiBmb3IgdGhlIG5leHQgc2VsZWN0ZWQgdGFiXG4gICAgICAvLyBpZiBpdCBkb2Vzbid0IGhhdmUgb25lIGFscmVhZHkuXG4gICAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPSBudWxsICYmIHRhYi5wb3NpdGlvbiA9PSAwICYmICF0YWIub3JpZ2luKSB7XG4gICAgICAgIHRhYi5vcmlnaW4gPSBpbmRleFRvU2VsZWN0IC0gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9PSBpbmRleFRvU2VsZWN0KSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZEluZGV4ID0gaW5kZXhUb1NlbGVjdDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmVUb1RhYkxhYmVscygpO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIGFtb3VudCBvZiB0YWJzLCBpbiBvcmRlciB0byBiZVxuICAgIC8vIGFibGUgdG8gcmUtcmVuZGVyIHRoZSBjb250ZW50IGFzIG5ldyB0YWJzIGFyZSBhZGRlZCBvciByZW1vdmVkLlxuICAgIHRoaXMuX3RhYnNTdWJzY3JpcHRpb24gPSB0aGlzLl90YWJzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4VG9TZWxlY3QgPSB0aGlzLl9jbGFtcFRhYkluZGV4KHRoaXMuX2luZGV4VG9TZWxlY3QpO1xuXG4gICAgICAvLyBNYWludGFpbiB0aGUgcHJldmlvdXNseS1zZWxlY3RlZCB0YWIgaWYgYSBuZXcgdGFiIGlzIGFkZGVkIG9yIHJlbW92ZWQgYW5kIHRoZXJlIGlzIG5vXG4gICAgICAvLyBleHBsaWNpdCBjaGFuZ2UgdGhhdCBzZWxlY3RzIGEgZGlmZmVyZW50IHRhYi5cbiAgICAgIGlmIChpbmRleFRvU2VsZWN0ID09PSB0aGlzLl9zZWxlY3RlZEluZGV4KSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLl90YWJzLnRvQXJyYXkoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGFic1tpXS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgLy8gQXNzaWduIGJvdGggdG8gdGhlIGBfaW5kZXhUb1NlbGVjdGAgYW5kIGBfc2VsZWN0ZWRJbmRleGAgc28gd2UgZG9uJ3QgZmlyZSBhIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIGV2ZW50LCBvdGhlcndpc2UgdGhlIGNvbnN1bWVyIG1heSBlbmQgdXAgaW4gYW4gaW5maW5pdGUgbG9vcCBpbiBzb21lIGVkZ2UgY2FzZXMgbGlrZVxuICAgICAgICAgICAgLy8gYWRkaW5nIGEgdGFiIHdpdGhpbiB0aGUgYHNlbGVjdGVkSW5kZXhDaGFuZ2VgIGV2ZW50LlxuICAgICAgICAgICAgdGhpcy5faW5kZXhUb1NlbGVjdCA9IHRoaXMuX3NlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvVGFiTGFiZWxzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3RhYnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFJlLWFsaWducyB0aGUgaW5rIGJhciB0byB0aGUgc2VsZWN0ZWQgdGFiIGVsZW1lbnQuICovXG4gIHJlYWxpZ25JbmtCYXIoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkhlYWRlcikge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICB9XG4gIH1cblxuICBfZm9jdXNDaGFuZ2VkKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmZvY3VzQ2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXgpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4OiBudW1iZXIpOiBNYXRUYWJDaGFuZ2VFdmVudCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0VGFiQ2hhbmdlRXZlbnQ7XG4gICAgZXZlbnQuaW5kZXggPSBpbmRleDtcbiAgICBpZiAodGhpcy5fdGFicyAmJiB0aGlzLl90YWJzLmxlbmd0aCkge1xuICAgICAgZXZlbnQudGFiID0gdGhpcy5fdGFicy50b0FycmF5KClbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiBUaGlzIGlzIG5lZWRlZCwgYmVjYXVzZSB0aGUgQElucHV0IGZvciB0aGUgbGFiZWwgaXNcbiAgICogb24gdGhlIE1hdFRhYiBjb21wb25lbnQsIHdoZXJlYXMgdGhlIGRhdGEgYmluZGluZyBpcyBpbnNpZGUgdGhlIE1hdFRhYkdyb3VwLiBJbiBvcmRlciBmb3IgdGhlXG4gICAqIGJpbmRpbmcgdG8gYmUgdXBkYXRlZCwgd2UgbmVlZCB0byBzdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiBpdCBhbmQgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAqIG1hbnVhbGx5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9UYWJMYWJlbHMoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4udGhpcy5fdGFicy5tYXAodGFiID0+IHRhYi5fc3RhdGVDaGFuZ2VzKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICB9XG5cbiAgLyoqIENsYW1wcyB0aGUgZ2l2ZW4gaW5kZXggdG8gdGhlIGJvdW5kcyBvZiAwIGFuZCB0aGUgdGFicyBsZW5ndGguICovXG4gIHByaXZhdGUgX2NsYW1wVGFiSW5kZXgoaW5kZXg6IG51bWJlciB8IG51bGwpOiBudW1iZXIge1xuICAgIC8vIE5vdGUgdGhlIGB8fCAwYCwgd2hpY2ggZW5zdXJlcyB0aGF0IHZhbHVlcyBsaWtlIE5hTiBjYW4ndCBnZXQgdGhyb3VnaFxuICAgIC8vIGFuZCB3aGljaCB3b3VsZCBvdGhlcndpc2UgdGhyb3cgdGhlIGNvbXBvbmVudCBpbnRvIGFuIGluZmluaXRlIGxvb3BcbiAgICAvLyAoc2luY2UgTWF0aC5tYXgoTmFOLCAwKSA9PT0gTmFOKS5cbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5fdGFicy5sZW5ndGggLSAxLCBNYXRoLm1heChpbmRleCB8fCAwLCAwKSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB0YWIgbGFiZWwgZWxlbWVudCAqL1xuICBfZ2V0VGFiTGFiZWxJZChpOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbWF0LXRhYi1sYWJlbC0ke3RoaXMuX2dyb3VwSWR9LSR7aX1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggdGFiIGNvbnRlbnQgZWxlbWVudCAqL1xuICBfZ2V0VGFiQ29udGVudElkKGk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBtYXQtdGFiLWNvbnRlbnQtJHt0aGlzLl9ncm91cElkfS0ke2l9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIGJvZHkgd3JhcHBlciB0byB0aGUgaGVpZ2h0IG9mIHRoZSBhY3RpdmF0aW5nIHRhYiBpZiBkeW5hbWljXG4gICAqIGhlaWdodCBwcm9wZXJ0eSBpcyB0cnVlLlxuICAgKi9cbiAgX3NldFRhYkJvZHlXcmFwcGVySGVpZ2h0KHRhYkhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9keW5hbWljSGVpZ2h0IHx8ICF0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHdyYXBwZXI6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcblxuICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gVGhpcyBjb25kaXRpb25hbCBmb3JjZXMgdGhlIGJyb3dzZXIgdG8gcGFpbnQgdGhlIGhlaWdodCBzbyB0aGF0XG4gICAgLy8gdGhlIGFuaW1hdGlvbiB0byB0aGUgbmV3IGhlaWdodCBjYW4gaGF2ZSBhbiBvcmlnaW4uXG4gICAgaWYgKHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IHRhYkhlaWdodCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGJvZHkgd3JhcHBlci4gKi9cbiAgX3JlbW92ZVRhYkJvZHlXcmFwcGVySGVpZ2h0KCk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQ7XG4gICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBjbGljayBldmVudHMsIHNldHRpbmcgbmV3IHNlbGVjdGVkIGluZGV4IGlmIGFwcHJvcHJpYXRlLiAqL1xuICBfaGFuZGxlQ2xpY2sodGFiOiBNYXRUYWIsIHRhYkhlYWRlcjogTWF0VGFiR3JvdXBCYXNlSGVhZGVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0YWIuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRhYkhlYWRlci5mb2N1c0luZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgdGFiaW5kZXggZm9yIHRoZSB0YWIuICovXG4gIF9nZXRUYWJJbmRleCh0YWI6IE1hdFRhYiwgaWR4OiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAodGFiLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gaWR4ID8gMCA6IC0xO1xuICB9XG59XG5cbi8qKlxuICogTWF0ZXJpYWwgZGVzaWduIHRhYi1ncm91cCBjb21wb25lbnQuIFN1cHBvcnRzIGJhc2ljIHRhYiBwYWlycyAobGFiZWwgKyBjb250ZW50KSBhbmQgaW5jbHVkZXNcbiAqIGFuaW1hdGVkIGluay1iYXIsIGtleWJvYXJkIG5hdmlnYXRpb24sIGFuZCBzY3JlZW4gcmVhZGVyLlxuICogU2VlOiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi9jb21wb25lbnRzL3RhYnMuaHRtbFxuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtdGFiLWdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJHcm91cCcsXG4gIHRlbXBsYXRlVXJsOiAndGFiLWdyb3VwLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGFiLWdyb3VwLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGlucHV0czogWydjb2xvcicsICdkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1ncm91cCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWR5bmFtaWMtaGVpZ2h0XSc6ICdkeW5hbWljSGVpZ2h0JyxcbiAgICAnW2NsYXNzLm1hdC10YWItZ3JvdXAtaW52ZXJ0ZWQtaGVhZGVyXSc6ICdoZWFkZXJQb3NpdGlvbiA9PT0gXCJiZWxvd1wiJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiR3JvdXAgZXh0ZW5kcyBfTWF0VGFiR3JvdXBCYXNlIHtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRUYWIpIF90YWJzOiBRdWVyeUxpc3Q8TWF0VGFiPjtcbiAgQFZpZXdDaGlsZCgndGFiQm9keVdyYXBwZXInLCB7c3RhdGljOiBmYWxzZX0pIF90YWJCb2R5V3JhcHBlcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGFiSGVhZGVyJywge3N0YXRpYzogZmFsc2V9KSBfdGFiSGVhZGVyOiBNYXRUYWJHcm91cEJhc2VIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9UQUJTX0NPTkZJRykgQE9wdGlvbmFsKCkgZGVmYXVsdENvbmZpZz86IE1hdFRhYnNDb25maWcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgY2hhbmdlRGV0ZWN0b3JSZWYsIGRlZmF1bHRDb25maWcsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG59XG4iXX0=