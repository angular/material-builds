var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, ViewChild, Component, Input, Output, EventEmitter, QueryList, ContentChildren, ElementRef, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule, coerceBooleanProperty } from '../core';
import { MdTabLabel } from './tab-label';
import { MdTabLabelWrapper } from './tab-label-wrapper';
import { MdTabNavBar, MdTabLink, MdTabLinkRipple } from './tab-nav-bar/tab-nav-bar';
import { MdInkBar } from './ink-bar';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MdRippleModule } from '../core/ripple/ripple';
import { ObserveContentModule } from '../core/observe-content/observe-content';
import { MdTab } from './tab';
import { MdTabBody } from './tab-body';
import { ViewportRuler } from '../core/overlay/position/viewport-ruler';
import { MdTabHeader } from './tab-header';
/** Used to generate unique ID's for each tab component */
var nextId = 0;
/** A simple change event emitted on focus or selection changes. */
export var MdTabChangeEvent = (function () {
    function MdTabChangeEvent() {
    }
    return MdTabChangeEvent;
}());
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
export var MdTabGroup = (function () {
    function MdTabGroup(_renderer) {
        this._renderer = _renderer;
        /** Whether this component has been initialized. */
        this._isInitialized = false;
        /** The tab index that should be selected after the content has been checked. */
        this._indexToSelect = 0;
        /** Snapshot of the height of the tab body wrapper before another tab is activated. */
        this._tabBodyWrapperHeight = null;
        /** Whether the tab group should grow to the size of the active tab */
        this._dynamicHeight = false;
        this._selectedIndex = null;
        this._onFocusChange = new EventEmitter();
        this._onSelectChange = new EventEmitter(true);
        this._groupId = nextId++;
    }
    Object.defineProperty(MdTabGroup.prototype, "dynamicHeight", {
        get: function () { return this._dynamicHeight; },
        set: function (value) { this._dynamicHeight = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "_dynamicHeightDeprecated", {
        /** @deprecated */
        get: function () { return this._dynamicHeight; },
        set: function (value) { this._dynamicHeight = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndex", {
        get: function () { return this._selectedIndex; },
        /** The index of the active tab. */
        set: function (value) { this._indexToSelect = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndexChange", {
        /** Output to enable support for two-way binding on `selectedIndex`. */
        get: function () {
            return this.selectChange.map(function (event) { return event.index; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "focusChange", {
        /** Event emitted when focus has changed within a tab group. */
        get: function () {
            return this._onFocusChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectChange", {
        /** Event emitted when the tab selection has changed. */
        get: function () {
            return this._onSelectChange.asObservable();
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
    MdTabGroup.prototype.ngAfterContentChecked = function () {
        var _this = this;
        // Clamp the next selected index to the bounds of 0 and the tabs length.
        this._indexToSelect =
            Math.min(this._tabs.length - 1, Math.max(this._indexToSelect, 0));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != this._indexToSelect && this._selectedIndex != null) {
            this._onSelectChange.emit(this._createChangeEvent(this._indexToSelect));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach(function (tab, index) {
            tab.position = index - _this._indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (_this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = _this._indexToSelect - _this._selectedIndex;
            }
        });
        this._selectedIndex = this._indexToSelect;
    };
    /**
     * Waits one frame for the view to update, then updates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop.
     */
    MdTabGroup.prototype.ngAfterViewChecked = function () {
        this._isInitialized = true;
    };
    MdTabGroup.prototype._focusChanged = function (index) {
        this._onFocusChange.emit(this._createChangeEvent(index));
    };
    MdTabGroup.prototype._createChangeEvent = function (index) {
        var event = new MdTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /** Returns a unique id for each tab label element */
    MdTabGroup.prototype._getTabLabelId = function (i) {
        return "md-tab-label-" + this._groupId + "-" + i;
    };
    /** Returns a unique id for each tab content element */
    MdTabGroup.prototype._getTabContentId = function (i) {
        return "md-tab-content-" + this._groupId + "-" + i;
    };
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    MdTabGroup.prototype._setTabBodyWrapperHeight = function (tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', this._tabBodyWrapperHeight + 'px');
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', tabHeight + 'px');
        }
    };
    /** Removes the height of the tab body wrapper. */
    MdTabGroup.prototype._removeTabBodyWrapperHeight = function () {
        this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
        this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', '');
    };
    __decorate([
        ContentChildren(MdTab), 
        __metadata('design:type', QueryList)
    ], MdTabGroup.prototype, "_tabs", void 0);
    __decorate([
        ViewChild('tabBodyWrapper'), 
        __metadata('design:type', ElementRef)
    ], MdTabGroup.prototype, "_tabBodyWrapper", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdTabGroup.prototype, "dynamicHeight", null);
    __decorate([
        Input('md-dynamic-height'), 
        __metadata('design:type', Boolean)
    ], MdTabGroup.prototype, "_dynamicHeightDeprecated", null);
    __decorate([
        Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], MdTabGroup.prototype, "selectedIndex", null);
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdTabGroup.prototype, "selectedIndexChange", null);
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdTabGroup.prototype, "focusChange", null);
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdTabGroup.prototype, "selectChange", null);
    MdTabGroup = __decorate([
        Component({selector: 'md-tab-group',
            template: "<md-tab-header [selectedIndex]=\"selectedIndex\" #tabHeader (indexFocused)=\"_focusChanged($event)\" (selectFocusedIndex)=\"selectedIndex = $event\"><div class=\"md-tab-label\" role=\"tab\" md-tab-label-wrapper md-ripple *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabLabelId(i)\" [tabIndex]=\"selectedIndex == i ? 0 : -1\" [attr.aria-controls]=\"_getTabContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [class.md-tab-label-active]=\"selectedIndex == i\" [disabled]=\"tab.disabled\" (click)=\"tabHeader.focusIndex = selectedIndex = i\"><template [ngIf]=\"tab.templateLabel\"><template [cdkPortalHost]=\"tab.templateLabel\"></template></template><template [ngIf]=\"!tab.templateLabel\">{{tab.textLabel}}</template></div></md-tab-header><div class=\"md-tab-body-wrapper\" #tabBodyWrapper><md-tab-body role=\"tabpanel\" *ngFor=\"let tab of _tabs; let i = index\" [id]=\"_getTabContentId(i)\" [attr.aria-labelledby]=\"_getTabLabelId(i)\" [class.md-tab-body-active]=\"selectedIndex == i\" [content]=\"tab.content\" [position]=\"tab.position\" [origin]=\"tab.origin\" (onCentered)=\"_removeTabBodyWrapperHeight()\" (onCentering)=\"_setTabBodyWrapperHeight($event)\"></md-tab-body></div>",
            styles: [":host{display:flex;flex-direction:column;font-family:Roboto,\"Helvetica Neue\",sans-serif}.md-tab-label{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;position:relative}.md-tab-label:focus{outline:0;opacity:1}@media (max-width:600px){.md-tab-label{min-width:72px}}:host[md-stretch-tabs] .md-tab-label{flex-basis:0;flex-grow:1}.md-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height .5s cubic-bezier(.35,0,.25,1)}md-tab-body{position:absolute;top:0;left:0;right:0;bottom:0;display:block;overflow:hidden}md-tab-body.md-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}:host.md-tab-group-dynamic-height md-tab-body.md-tab-body-active{overflow-y:hidden}.md-tab-disabled{cursor:default;pointer-events:none}"],
            host: { '[class.md-tab-group-dynamic-height]': 'dynamicHeight' }
        }), 
        __metadata('design:paramtypes', [Renderer])
    ], MdTabGroup);
    return MdTabGroup;
}());
export var MdTabsModule = (function () {
    function MdTabsModule() {
    }
    MdTabsModule.forRoot = function () {
        return {
            ngModule: MdTabsModule,
            providers: [ViewportRuler]
        };
    };
    MdTabsModule = __decorate([
        NgModule({
            imports: [CommonModule, PortalModule, MdRippleModule, ObserveContentModule],
            // Don't export all components because some are only to be used internally.
            exports: [MdTabGroup, MdTabLabel, MdTab, MdTabNavBar, MdTabLink, MdTabLinkRipple],
            declarations: [MdTabGroup, MdTabLabel, MdTab, MdInkBar, MdTabLabelWrapper,
                MdTabNavBar, MdTabLink, MdTabBody, MdTabLinkRipple, MdTabHeader],
        }), 
        __metadata('design:paramtypes', [])
    ], MdTabsModule);
    return MdTabsModule;
}());

//# sourceMappingURL=tab-group.js.map
