/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
}
_MatTabGroupBase.decorators = [
    { type: Directive }
];
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
MatTabGroup.decorators = [
    { type: Component, args: [{
                selector: 'mat-tab-group',
                exportAs: 'matTabGroup',
                template: "<mat-tab-header #tabHeader\n               [selectedIndex]=\"selectedIndex || 0\"\n               [disableRipple]=\"disableRipple\"\n               [disablePagination]=\"disablePagination\"\n               (indexFocused)=\"_focusChanged($event)\"\n               (selectFocusedIndex)=\"selectedIndex = $event\">\n  <div class=\"mat-tab-label mat-focus-indicator\" role=\"tab\" matTabLabelWrapper mat-ripple cdkMonitorElementFocus\n       *ngFor=\"let tab of _tabs; let i = index\"\n       [id]=\"_getTabLabelId(i)\"\n       [attr.tabIndex]=\"_getTabIndex(tab, i)\"\n       [attr.aria-posinset]=\"i + 1\"\n       [attr.aria-setsize]=\"_tabs.length\"\n       [attr.aria-controls]=\"_getTabContentId(i)\"\n       [attr.aria-selected]=\"selectedIndex == i\"\n       [attr.aria-label]=\"tab.ariaLabel || null\"\n       [attr.aria-labelledby]=\"(!tab.ariaLabel && tab.ariaLabelledby) ? tab.ariaLabelledby : null\"\n       [class.mat-tab-label-active]=\"selectedIndex == i\"\n       [disabled]=\"tab.disabled\"\n       [matRippleDisabled]=\"tab.disabled || disableRipple\"\n       (click)=\"_handleClick(tab, tabHeader, i)\">\n\n\n    <div class=\"mat-tab-label-content\">\n      <!-- If there is a label template, use it. -->\n      <ng-template [ngIf]=\"tab.templateLabel\">\n        <ng-template [cdkPortalOutlet]=\"tab.templateLabel\"></ng-template>\n      </ng-template>\n\n      <!-- If there is not a label template, fall back to the text label. -->\n      <ng-template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</ng-template>\n    </div>\n  </div>\n</mat-tab-header>\n\n<div\n  class=\"mat-tab-body-wrapper\"\n  [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n  #tabBodyWrapper>\n  <mat-tab-body role=\"tabpanel\"\n               *ngFor=\"let tab of _tabs; let i = index\"\n               [id]=\"_getTabContentId(i)\"\n               [attr.aria-labelledby]=\"_getTabLabelId(i)\"\n               [class.mat-tab-body-active]=\"selectedIndex == i\"\n               [content]=\"tab.content!\"\n               [position]=\"tab.position!\"\n               [origin]=\"tab.origin\"\n               [animationDuration]=\"animationDuration\"\n               (_onCentered)=\"_removeTabBodyWrapperHeight()\"\n               (_onCentering)=\"_setTabBodyWrapperHeight($event)\">\n  </mat-tab-body>\n</div>\n",
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
                styles: [".mat-tab-group{display:flex;flex-direction:column}.mat-tab-group.mat-tab-group-inverted-header{flex-direction:column-reverse}.mat-tab-label{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;position:relative}.mat-tab-label:focus{outline:none}.mat-tab-label:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-label:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-label.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-label.mat-tab-disabled{opacity:.5}.mat-tab-label .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-label{opacity:1}@media(max-width: 599px){.mat-tab-label{padding:0 12px}}@media(max-width: 959px){.mat-tab-label{padding:0 12px}}.mat-tab-group[mat-stretch-tabs]>.mat-tab-header .mat-tab-label{flex-basis:0;flex-grow:1}.mat-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height 500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-tab-body-wrapper{transition:none;animation:none}.mat-tab-body{top:0;left:0;right:0;bottom:0;position:absolute;display:block;overflow:hidden;flex-basis:100%}.mat-tab-body.mat-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}.mat-tab-group.mat-tab-group-dynamic-height .mat-tab-body.mat-tab-body-active{overflow-y:hidden}\n"]
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsb0JBQW9CLEVBRXJCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUtMLFVBQVUsRUFDVixrQkFBa0IsR0FFbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDNUMsT0FBTyxFQUFDLGVBQWUsRUFBZ0IsTUFBTSxjQUFjLENBQUM7QUFHNUQsMERBQTBEO0FBQzFELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLG1FQUFtRTtBQUNuRSxNQUFNLE9BQU8saUJBQWlCO0NBSzdCO0FBS0Qsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLG9CQUFvQjtJQUN4QixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7QUFDRCxNQUFNLHFCQUFxQixHQUN2QixVQUFVLENBQUMs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QUUsQ0FBQzt3QkFDVixPQUFPLEVBQUUsYUFBYTt3QkFDdEIsV0FBVyxFQUFFLFdBQVc7cUJBQ3pCLENBQUM7Z0JBQ0YsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxlQUFlO29CQUN4QixzQ0FBc0MsRUFBRSxlQUFlO29CQUN2RCx1Q0FBdUMsRUFBRSw0QkFBNEI7aUJBQ3RFOzthQUNGOzs7WUFoWUMsVUFBVTtZQUpWLGlCQUFpQjs0Q0E0WUosTUFBTSxTQUFDLGVBQWUsY0FBRyxRQUFRO3lDQUNqQyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3VCQVBwRCxlQUFlLFNBQUMsTUFBTSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs4QkFDM0MsU0FBUyxTQUFDLGdCQUFnQjt5QkFDMUIsU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNQVRfVEFCX0dST1VQLCBNYXRUYWJ9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7TUFUX1RBQlNfQ09ORklHLCBNYXRUYWJzQ29uZmlnfSBmcm9tICcuL3RhYi1jb25maWcnO1xuXG5cbi8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRCdzIGZvciBlYWNoIHRhYiBjb21wb25lbnQgKi9cbmxldCBuZXh0SWQgPSAwO1xuXG4vKiogQSBzaW1wbGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgb24gZm9jdXMgb3Igc2VsZWN0aW9uIGNoYW5nZXMuICovXG5leHBvcnQgY2xhc3MgTWF0VGFiQ2hhbmdlRXZlbnQge1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB0YWIuICovXG4gIGluZGV4OiBudW1iZXI7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB0YWIuICovXG4gIHRhYjogTWF0VGFiO1xufVxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgdGFiIGhlYWRlci4gKi9cbmV4cG9ydCB0eXBlIE1hdFRhYkhlYWRlclBvc2l0aW9uID0gJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiR3JvdXAuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0VGFiR3JvdXBNaXhpbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0VGFiR3JvdXBNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdFRhYkdyb3VwTWl4aW5CYXNlID1cbiAgICBtaXhpbkNvbG9yKG1peGluRGlzYWJsZVJpcHBsZShNYXRUYWJHcm91cE1peGluQmFzZSksICdwcmltYXJ5Jyk7XG5cbmludGVyZmFjZSBNYXRUYWJHcm91cEJhc2VIZWFkZXIge1xuICBfYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiOiAoKSA9PiB2b2lkO1xuICBmb2N1c0luZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkdyb3VwQmFzZWAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkdyb3VwQmFzZSBleHRlbmRzIF9NYXRUYWJHcm91cE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95LCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZSB7XG5cbiAgLyoqXG4gICAqIEFsbCB0YWJzIGluc2lkZSB0aGUgdGFiIGdyb3VwLiBUaGlzIGluY2x1ZGVzIHRhYnMgdGhhdCBiZWxvbmcgdG8gZ3JvdXBzIHRoYXQgYXJlIG5lc3RlZFxuICAgKiBpbnNpZGUgdGhlIGN1cnJlbnQgb25lLiBXZSBmaWx0ZXIgb3V0IG9ubHkgdGhlIHRhYnMgdGhhdCBiZWxvbmcgdG8gdGhpcyBncm91cCBpbiBgX3RhYnNgLlxuICAgKi9cbiAgYWJzdHJhY3QgX2FsbFRhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+O1xuICBhYnN0cmFjdCBfdGFiQm9keVdyYXBwZXI6IEVsZW1lbnRSZWY7XG4gIGFic3RyYWN0IF90YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlcjtcblxuICAvKiogQWxsIG9mIHRoZSB0YWJzIHRoYXQgYmVsb25nIHRvIHRoZSBncm91cC4gKi9cbiAgX3RhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+ID0gbmV3IFF1ZXJ5TGlzdDxNYXRUYWI+KCk7XG5cbiAgLyoqIFRoZSB0YWIgaW5kZXggdGhhdCBzaG91bGQgYmUgc2VsZWN0ZWQgYWZ0ZXIgdGhlIGNvbnRlbnQgaGFzIGJlZW4gY2hlY2tlZC4gKi9cbiAgcHJpdmF0ZSBfaW5kZXhUb1NlbGVjdDogbnVtYmVyIHwgbnVsbCA9IDA7XG5cbiAgLyoqIFNuYXBzaG90IG9mIHRoZSBoZWlnaHQgb2YgdGhlIHRhYiBib2R5IHdyYXBwZXIgYmVmb3JlIGFub3RoZXIgdGFiIGlzIGFjdGl2YXRlZC4gKi9cbiAgcHJpdmF0ZSBfdGFiQm9keVdyYXBwZXJIZWlnaHQ6IG51bWJlciA9IDA7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0YWJzIGJlaW5nIGFkZGVkL3JlbW92ZWQuICovXG4gIHByaXZhdGUgX3RhYnNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiAqL1xuICBwcml2YXRlIF90YWJMYWJlbFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGdyb3VwIHNob3VsZCBncm93IHRvIHRoZSBzaXplIG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZHluYW1pY0hlaWdodCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2R5bmFtaWNIZWlnaHQ7IH1cbiAgc2V0IGR5bmFtaWNIZWlnaHQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fZHluYW1pY0hlaWdodCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7IH1cbiAgcHJpdmF0ZSBfZHluYW1pY0hlaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaW5kZXggb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlciB8IG51bGwgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDsgfVxuICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX2luZGV4VG9TZWxlY3QgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgbnVsbCk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSB0YWIgaGVhZGVyLiAqL1xuICBASW5wdXQoKSBoZWFkZXJQb3NpdGlvbjogTWF0VGFiSGVhZGVyUG9zaXRpb24gPSAnYWJvdmUnO1xuXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYiBhbmltYXRpb24uIFdpbGwgYmUgbm9ybWFsaXplZCB0byBtaWxsaXNlY29uZHMgaWYgbm8gdW5pdHMgYXJlIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGlvbkR1cmF0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hbmltYXRpb25EdXJhdGlvbjsgfVxuICBzZXQgYW5pbWF0aW9uRHVyYXRpb24odmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2FuaW1hdGlvbkR1cmF0aW9uID0gL15cXGQrJC8udGVzdCh2YWx1ZSkgPyB2YWx1ZSArICdtcycgOiB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9hbmltYXRpb25EdXJhdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVQYWdpbmF0aW9uOiBib29sZWFuO1xuXG4gIC8qKiBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSB0YWIgZ3JvdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjsgfVxuICBzZXQgYmFja2dyb3VuZENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhY2tncm91bmQtJHt0aGlzLmJhY2tncm91bmRDb2xvcn1gKTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtYmFja2dyb3VuZC0ke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIHRoaXMuX2JhY2tncm91bmRDb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2JhY2tncm91bmRDb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBPdXRwdXQgdG8gZW5hYmxlIHN1cHBvcnQgZm9yIHR3by13YXkgYmluZGluZyBvbiBgWyhzZWxlY3RlZEluZGV4KV1gICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3RlZEluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gZm9jdXMgaGFzIGNoYW5nZWQgd2l0aGluIGEgdGFiIGdyb3VwLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZm9jdXNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRUYWJDaGFuZ2VFdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBib2R5IGFuaW1hdGlvbiBoYXMgY29tcGxldGVkICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIHNlbGVjdGlvbiBoYXMgY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0VGFiQ2hhbmdlRXZlbnQ+KHRydWUpO1xuXG4gIHByaXZhdGUgX2dyb3VwSWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfVEFCU19DT05GSUcpIEBPcHRpb25hbCgpIGRlZmF1bHRDb25maWc/OiBNYXRUYWJzQ29uZmlnLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZ3JvdXBJZCA9IG5leHRJZCsrO1xuICAgIHRoaXMuYW5pbWF0aW9uRHVyYXRpb24gPSBkZWZhdWx0Q29uZmlnICYmIGRlZmF1bHRDb25maWcuYW5pbWF0aW9uRHVyYXRpb24gP1xuICAgICAgICBkZWZhdWx0Q29uZmlnLmFuaW1hdGlvbkR1cmF0aW9uIDogJzUwMG1zJztcbiAgICB0aGlzLmRpc2FibGVQYWdpbmF0aW9uID0gZGVmYXVsdENvbmZpZyAmJiBkZWZhdWx0Q29uZmlnLmRpc2FibGVQYWdpbmF0aW9uICE9IG51bGwgP1xuICAgICAgICBkZWZhdWx0Q29uZmlnLmRpc2FibGVQYWdpbmF0aW9uIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgdGhlIGNvbnRlbnQgaXMgY2hlY2tlZCwgdGhpcyBjb21wb25lbnQga25vd3Mgd2hhdCB0YWJzIGhhdmUgYmVlbiBkZWZpbmVkXG4gICAqIGFuZCB3aGF0IHRoZSBzZWxlY3RlZCBpbmRleCBzaG91bGQgYmUuIFRoaXMgaXMgd2hlcmUgd2UgY2FuIGtub3cgZXhhY3RseSB3aGF0IHBvc2l0aW9uXG4gICAqIGVhY2ggdGFiIHNob3VsZCBiZSBpbiBhY2NvcmRpbmcgdG8gdGhlIG5ldyBzZWxlY3RlZCBpbmRleCwgYW5kIGFkZGl0aW9uYWxseSB3ZSBrbm93IGhvd1xuICAgKiBhIG5ldyBzZWxlY3RlZCB0YWIgc2hvdWxkIHRyYW5zaXRpb24gaW4gKGZyb20gdGhlIGxlZnQgb3IgcmlnaHQpLlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIERvbid0IGNsYW1wIHRoZSBgaW5kZXhUb1NlbGVjdGAgaW1tZWRpYXRlbHkgaW4gdGhlIHNldHRlciBiZWNhdXNlIGl0IGNhbiBoYXBwZW4gdGhhdFxuICAgIC8vIHRoZSBhbW91bnQgb2YgdGFicyBjaGFuZ2VzIGJlZm9yZSB0aGUgYWN0dWFsIGNoYW5nZSBkZXRlY3Rpb24gcnVucy5cbiAgICBjb25zdCBpbmRleFRvU2VsZWN0ID0gdGhpcy5faW5kZXhUb1NlbGVjdCA9IHRoaXMuX2NsYW1wVGFiSW5kZXgodGhpcy5faW5kZXhUb1NlbGVjdCk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYW5nZSBpbiBzZWxlY3RlZCBpbmRleCwgZW1pdCBhIGNoYW5nZSBldmVudC4gU2hvdWxkIG5vdCB0cmlnZ2VyIGlmXG4gICAgLy8gdGhlIHNlbGVjdGVkIGluZGV4IGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gaW5kZXhUb1NlbGVjdCkge1xuICAgICAgY29uc3QgaXNGaXJzdFJ1biA9IHRoaXMuX3NlbGVjdGVkSW5kZXggPT0gbnVsbDtcblxuICAgICAgaWYgKCFpc0ZpcnN0UnVuKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWJDaGFuZ2UuZW1pdCh0aGlzLl9jcmVhdGVDaGFuZ2VFdmVudChpbmRleFRvU2VsZWN0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoYW5naW5nIHRoZXNlIHZhbHVlcyBhZnRlciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBydW5cbiAgICAgIC8vIHNpbmNlIHRoZSBjaGVja2VkIGNvbnRlbnQgbWF5IGNvbnRhaW4gcmVmZXJlbmNlcyB0byB0aGVtLlxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4gdGFiLmlzQWN0aXZlID0gaW5kZXggPT09IGluZGV4VG9TZWxlY3QpO1xuXG4gICAgICAgIGlmICghaXNGaXJzdFJ1bikge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleENoYW5nZS5lbWl0KGluZGV4VG9TZWxlY3QpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXR1cCB0aGUgcG9zaXRpb24gZm9yIGVhY2ggdGFiIGFuZCBvcHRpb25hbGx5IHNldHVwIGFuIG9yaWdpbiBvbiB0aGUgbmV4dCBzZWxlY3RlZCB0YWIuXG4gICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWI6IE1hdFRhYiwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgdGFiLnBvc2l0aW9uID0gaW5kZXggLSBpbmRleFRvU2VsZWN0O1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGEgc2VsZWN0ZWQgdGFiLCB0aGVuIHNldCB1cCBhbiBvcmlnaW4gZm9yIHRoZSBuZXh0IHNlbGVjdGVkIHRhYlxuICAgICAgLy8gaWYgaXQgZG9lc24ndCBoYXZlIG9uZSBhbHJlYWR5LlxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gbnVsbCAmJiB0YWIucG9zaXRpb24gPT0gMCAmJiAhdGFiLm9yaWdpbikge1xuICAgICAgICB0YWIub3JpZ2luID0gaW5kZXhUb1NlbGVjdCAtIHRoaXMuX3NlbGVjdGVkSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPT0gaW5kZXhUb1NlbGVjdCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleCA9IGluZGV4VG9TZWxlY3Q7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9BbGxUYWJDaGFuZ2VzKCk7XG4gICAgdGhpcy5fc3Vic2NyaWJlVG9UYWJMYWJlbHMoKTtcblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBhbW91bnQgb2YgdGFicywgaW4gb3JkZXIgdG8gYmVcbiAgICAvLyBhYmxlIHRvIHJlLXJlbmRlciB0aGUgY29udGVudCBhcyBuZXcgdGFicyBhcmUgYWRkZWQgb3IgcmVtb3ZlZC5cbiAgICB0aGlzLl90YWJzU3Vic2NyaXB0aW9uID0gdGhpcy5fdGFicy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRvU2VsZWN0ID0gdGhpcy5fY2xhbXBUYWJJbmRleCh0aGlzLl9pbmRleFRvU2VsZWN0KTtcblxuICAgICAgLy8gTWFpbnRhaW4gdGhlIHByZXZpb3VzbHktc2VsZWN0ZWQgdGFiIGlmIGEgbmV3IHRhYiBpcyBhZGRlZCBvciByZW1vdmVkIGFuZCB0aGVyZSBpcyBub1xuICAgICAgLy8gZXhwbGljaXQgY2hhbmdlIHRoYXQgc2VsZWN0cyBhIGRpZmZlcmVudCB0YWIuXG4gICAgICBpZiAoaW5kZXhUb1NlbGVjdCA9PT0gdGhpcy5fc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICBjb25zdCB0YWJzID0gdGhpcy5fdGFicy50b0FycmF5KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRhYnNbaV0uaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIC8vIEFzc2lnbiBib3RoIHRvIHRoZSBgX2luZGV4VG9TZWxlY3RgIGFuZCBgX3NlbGVjdGVkSW5kZXhgIHNvIHdlIGRvbid0IGZpcmUgYSBjaGFuZ2VkXG4gICAgICAgICAgICAvLyBldmVudCwgb3RoZXJ3aXNlIHRoZSBjb25zdW1lciBtYXkgZW5kIHVwIGluIGFuIGluZmluaXRlIGxvb3AgaW4gc29tZSBlZGdlIGNhc2VzIGxpa2VcbiAgICAgICAgICAgIC8vIGFkZGluZyBhIHRhYiB3aXRoaW4gdGhlIGBzZWxlY3RlZEluZGV4Q2hhbmdlYCBldmVudC5cbiAgICAgICAgICAgIHRoaXMuX2luZGV4VG9TZWxlY3QgPSB0aGlzLl9zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gYWxsIG9mIHRoZSB0YWJzLiAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0FsbFRhYkNoYW5nZXMoKSB7XG4gICAgLy8gU2luY2Ugd2UgdXNlIGEgcXVlcnkgd2l0aCBgZGVzY2VuZGFudHM6IHRydWVgIHRvIHBpY2sgdXAgdGhlIHRhYnMsIHdlIG1heSBlbmQgdXAgY2F0Y2hpbmdcbiAgICAvLyBzb21lIHRoYXQgYXJlIGluc2lkZSBvZiBuZXN0ZWQgdGFiIGdyb3Vwcy4gV2UgZmlsdGVyIHRoZW0gb3V0IG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoYXRcbiAgICAvLyB0aGUgY2xvc2VzdCBncm91cCB0byB0aGUgdGFiIGlzIHRoZSBjdXJyZW50IG9uZS5cbiAgICB0aGlzLl9hbGxUYWJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9hbGxUYWJzKSlcbiAgICAgIC5zdWJzY3JpYmUoKHRhYnM6IFF1ZXJ5TGlzdDxNYXRUYWI+KSA9PiB7XG4gICAgICAgIHRoaXMuX3RhYnMucmVzZXQodGFicy5maWx0ZXIodGFiID0+IHtcbiAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9jbG9zZXN0VGFiR3JvdXBgXG4gICAgICAgICAgLy8gb25jZSBpdCBiZWNvbWVzIGEgcmVxdWlyZWQgcGFyYW1ldGVyIGluIE1hdFRhYi5cbiAgICAgICAgICByZXR1cm4gIXRhYi5fY2xvc2VzdFRhYkdyb3VwIHx8IHRhYi5fY2xvc2VzdFRhYkdyb3VwID09PSB0aGlzO1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuX3RhYnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3RhYnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX3RhYnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIFJlLWFsaWducyB0aGUgaW5rIGJhciB0byB0aGUgc2VsZWN0ZWQgdGFiIGVsZW1lbnQuICovXG4gIHJlYWxpZ25JbmtCYXIoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkhlYWRlcikge1xuICAgICAgdGhpcy5fdGFiSGVhZGVyLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICB9XG4gIH1cblxuICBfZm9jdXNDaGFuZ2VkKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLmZvY3VzQ2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoaW5kZXgpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KGluZGV4OiBudW1iZXIpOiBNYXRUYWJDaGFuZ2VFdmVudCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0VGFiQ2hhbmdlRXZlbnQ7XG4gICAgZXZlbnQuaW5kZXggPSBpbmRleDtcbiAgICBpZiAodGhpcy5fdGFicyAmJiB0aGlzLl90YWJzLmxlbmd0aCkge1xuICAgICAgZXZlbnQudGFiID0gdGhpcy5fdGFicy50b0FycmF5KClbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIHRoZSB0YWIgbGFiZWxzLiBUaGlzIGlzIG5lZWRlZCwgYmVjYXVzZSB0aGUgQElucHV0IGZvciB0aGUgbGFiZWwgaXNcbiAgICogb24gdGhlIE1hdFRhYiBjb21wb25lbnQsIHdoZXJlYXMgdGhlIGRhdGEgYmluZGluZyBpcyBpbnNpZGUgdGhlIE1hdFRhYkdyb3VwLiBJbiBvcmRlciBmb3IgdGhlXG4gICAqIGJpbmRpbmcgdG8gYmUgdXBkYXRlZCwgd2UgbmVlZCB0byBzdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiBpdCBhbmQgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAqIG1hbnVhbGx5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9UYWJMYWJlbHMoKSB7XG4gICAgaWYgKHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl90YWJMYWJlbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3RhYkxhYmVsU3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4udGhpcy5fdGFicy5tYXAodGFiID0+IHRhYi5fc3RhdGVDaGFuZ2VzKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICB9XG5cbiAgLyoqIENsYW1wcyB0aGUgZ2l2ZW4gaW5kZXggdG8gdGhlIGJvdW5kcyBvZiAwIGFuZCB0aGUgdGFicyBsZW5ndGguICovXG4gIHByaXZhdGUgX2NsYW1wVGFiSW5kZXgoaW5kZXg6IG51bWJlciB8IG51bGwpOiBudW1iZXIge1xuICAgIC8vIE5vdGUgdGhlIGB8fCAwYCwgd2hpY2ggZW5zdXJlcyB0aGF0IHZhbHVlcyBsaWtlIE5hTiBjYW4ndCBnZXQgdGhyb3VnaFxuICAgIC8vIGFuZCB3aGljaCB3b3VsZCBvdGhlcndpc2UgdGhyb3cgdGhlIGNvbXBvbmVudCBpbnRvIGFuIGluZmluaXRlIGxvb3BcbiAgICAvLyAoc2luY2UgTWF0aC5tYXgoTmFOLCAwKSA9PT0gTmFOKS5cbiAgICByZXR1cm4gTWF0aC5taW4odGhpcy5fdGFicy5sZW5ndGggLSAxLCBNYXRoLm1heChpbmRleCB8fCAwLCAwKSk7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB0YWIgbGFiZWwgZWxlbWVudCAqL1xuICBfZ2V0VGFiTGFiZWxJZChpOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbWF0LXRhYi1sYWJlbC0ke3RoaXMuX2dyb3VwSWR9LSR7aX1gO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSB1bmlxdWUgaWQgZm9yIGVhY2ggdGFiIGNvbnRlbnQgZWxlbWVudCAqL1xuICBfZ2V0VGFiQ29udGVudElkKGk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBtYXQtdGFiLWNvbnRlbnQtJHt0aGlzLl9ncm91cElkfS0ke2l9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIGJvZHkgd3JhcHBlciB0byB0aGUgaGVpZ2h0IG9mIHRoZSBhY3RpdmF0aW5nIHRhYiBpZiBkeW5hbWljXG4gICAqIGhlaWdodCBwcm9wZXJ0eSBpcyB0cnVlLlxuICAgKi9cbiAgX3NldFRhYkJvZHlXcmFwcGVySGVpZ2h0KHRhYkhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9keW5hbWljSGVpZ2h0IHx8ICF0aGlzLl90YWJCb2R5V3JhcHBlckhlaWdodCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHdyYXBwZXI6IEhUTUxFbGVtZW50ID0gdGhpcy5fdGFiQm9keVdyYXBwZXIubmF0aXZlRWxlbWVudDtcblxuICAgIHdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5fdGFiQm9keVdyYXBwZXJIZWlnaHQgKyAncHgnO1xuXG4gICAgLy8gVGhpcyBjb25kaXRpb25hbCBmb3JjZXMgdGhlIGJyb3dzZXIgdG8gcGFpbnQgdGhlIGhlaWdodCBzbyB0aGF0XG4gICAgLy8gdGhlIGFuaW1hdGlvbiB0byB0aGUgbmV3IGhlaWdodCBjYW4gaGF2ZSBhbiBvcmlnaW4uXG4gICAgaWYgKHRoaXMuX3RhYkJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KSB7XG4gICAgICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IHRhYkhlaWdodCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgdGhlIGhlaWdodCBvZiB0aGUgdGFiIGJvZHkgd3JhcHBlci4gKi9cbiAgX3JlbW92ZVRhYkJvZHlXcmFwcGVySGVpZ2h0KCk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLl90YWJCb2R5V3JhcHBlci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX3RhYkJvZHlXcmFwcGVySGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQ7XG4gICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBjbGljayBldmVudHMsIHNldHRpbmcgbmV3IHNlbGVjdGVkIGluZGV4IGlmIGFwcHJvcHJpYXRlLiAqL1xuICBfaGFuZGxlQ2xpY2sodGFiOiBNYXRUYWIsIHRhYkhlYWRlcjogTWF0VGFiR3JvdXBCYXNlSGVhZGVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKCF0YWIuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRhYkhlYWRlci5mb2N1c0luZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgdGFiaW5kZXggZm9yIHRoZSB0YWIuICovXG4gIF9nZXRUYWJJbmRleCh0YWI6IE1hdFRhYiwgaWR4OiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAodGFiLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gaWR4ID8gMCA6IC0xO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2R5bmFtaWNIZWlnaHQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2FuaW1hdGlvbkR1cmF0aW9uOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xufVxuXG4vKipcbiAqIE1hdGVyaWFsIGRlc2lnbiB0YWItZ3JvdXAgY29tcG9uZW50LiBTdXBwb3J0cyBiYXNpYyB0YWIgcGFpcnMgKGxhYmVsICsgY29udGVudCkgYW5kIGluY2x1ZGVzXG4gKiBhbmltYXRlZCBpbmstYmFyLCBrZXlib2FyZCBuYXZpZ2F0aW9uLCBhbmQgc2NyZWVuIHJlYWRlci5cbiAqIFNlZTogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy90YWJzLmh0bWxcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1ncm91cCcsXG4gIGV4cG9ydEFzOiAnbWF0VGFiR3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi1ncm91cC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1ncm91cC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBpbnB1dHM6IFsnY29sb3InLCAnZGlzYWJsZVJpcHBsZSddLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX1RBQl9HUk9VUCxcbiAgICB1c2VFeGlzdGluZzogTWF0VGFiR3JvdXBcbiAgfV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYi1ncm91cCcsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWdyb3VwLWR5bmFtaWMtaGVpZ2h0XSc6ICdkeW5hbWljSGVpZ2h0JyxcbiAgICAnW2NsYXNzLm1hdC10YWItZ3JvdXAtaW52ZXJ0ZWQtaGVhZGVyXSc6ICdoZWFkZXJQb3NpdGlvbiA9PT0gXCJiZWxvd1wiJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiR3JvdXAgZXh0ZW5kcyBfTWF0VGFiR3JvdXBCYXNlIHtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRUYWIsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9hbGxUYWJzOiBRdWVyeUxpc3Q8TWF0VGFiPjtcbiAgQFZpZXdDaGlsZCgndGFiQm9keVdyYXBwZXInKSBfdGFiQm9keVdyYXBwZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYkhlYWRlcicpIF90YWJIZWFkZXI6IE1hdFRhYkdyb3VwQmFzZUhlYWRlcjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX1RBQlNfQ09ORklHKSBAT3B0aW9uYWwoKSBkZWZhdWx0Q29uZmlnPzogTWF0VGFic0NvbmZpZyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBjaGFuZ2VEZXRlY3RvclJlZiwgZGVmYXVsdENvbmZpZywgYW5pbWF0aW9uTW9kZSk7XG4gIH1cbn1cbiJdfQ==