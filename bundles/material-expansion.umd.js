/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/cdk/collections'), require('@angular/cdk/accordion'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion'), require('@angular/animations'), require('@angular/material/core'), require('rxjs/Subject'), require('@angular/cdk/keycodes'), require('rxjs/operators/filter'), require('rxjs/observable/merge'), require('rxjs/Subscription')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/cdk/collections', '@angular/cdk/accordion', '@angular/cdk/a11y', '@angular/cdk/coercion', '@angular/animations', '@angular/material/core', 'rxjs/Subject', '@angular/cdk/keycodes', 'rxjs/operators/filter', 'rxjs/observable/merge', 'rxjs/Subscription'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.expansion = global.ng.material.expansion || {}),global.ng.common,global.ng.core,global.ng.cdk.collections,global.ng.cdk.accordion,global.ng.cdk.a11y,global.ng.cdk.coercion,global.ng.animations,global.ng.material.core,global.Rx,global.ng.cdk.keycodes,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_common,_angular_core,_angular_cdk_collections,_angular_cdk_accordion,_angular_cdk_a11y,_angular_cdk_coercion,_angular_animations,_angular_material_core,rxjs_Subject,_angular_cdk_keycodes,rxjs_operators_filter,rxjs_observable_merge) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _CdkAccordion = _angular_cdk_accordion.CdkAccordion;
/**
 * Directive for a Material Design Accordion.
 */
var MatAccordion = /** @class */ (function (_super) {
    __extends(MatAccordion, _super);
    function MatAccordion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MatAccordion.prototype, "hideToggle", {
        get: /**
         * Whether the expansion indicator should be hidden.
         * @return {?}
         */
        function () { return this._hideToggle; },
        set: /**
         * @param {?} show
         * @return {?}
         */
        function (show) { this._hideToggle = _angular_cdk_coercion.coerceBooleanProperty(show); },
        enumerable: true,
        configurable: true
    });
    return MatAccordion;
}(_CdkAccordion));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
var _CdkAccordionItem = _angular_cdk_accordion.CdkAccordionItem;
/**
 * Time and timing curve for expansion panel animations.
 */
var EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * \@docs-private
 */
var MatExpansionPanelBase = /** @class */ (function (_super) {
    __extends(MatExpansionPanelBase, _super);
    function MatExpansionPanelBase(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        return _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
    }
    return MatExpansionPanelBase;
}(_CdkAccordionItem));
var _MatExpansionPanelMixinBase = _angular_material_core.mixinDisabled(MatExpansionPanelBase);
/**
 * <mat-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MdAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MatExpansionPanel = /** @class */ (function (_super) {
    __extends(MatExpansionPanel, _super);
    function MatExpansionPanel(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        _this.accordion = accordion;
        return _this;
    }
    Object.defineProperty(MatExpansionPanel.prototype, "hideToggle", {
        get: /**
         * Whether the toggle indicator should be hidden.
         * @return {?}
         */
        function () {
            return this._hideToggle;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._hideToggle = _angular_cdk_coercion.coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /** Whether the expansion indicator should be hidden. */
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    MatExpansionPanel.prototype._getHideToggle = /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    function () {
        if (this.accordion) {
            return this.accordion.hideToggle;
        }
        return this.hideToggle;
    };
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    MatExpansionPanel.prototype._hasSpacing = /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    function () {
        if (this.accordion) {
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    };
    /** Gets the expanded state string. */
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    MatExpansionPanel.prototype._getExpandedState = /**
     * Gets the expanded state string.
     * @return {?}
     */
    function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    MatExpansionPanel.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this._inputChanges.next(changes);
    };
    /**
     * @return {?}
     */
    MatExpansionPanel.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._inputChanges.complete();
    };
    return MatExpansionPanel;
}(_MatExpansionPanelMixinBase));
var MatExpansionPanelActionRow = /** @class */ (function () {
    function MatExpansionPanelActionRow() {
    }
    return MatExpansionPanelActionRow;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * <mat-expansion-panel-header> component.
 *
 * This component corresponds to the header element of an <mat-expansion-panel>.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MatExpansionPanelHeader = /** @class */ (function () {
    function MatExpansionPanelHeader(panel, _element, _focusMonitor, _changeDetectorRef) {
        var _this = this;
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        // Since the toggle state depends on an @Input on the panel, we
        // need to  subscribe and trigger change detection manually.
        this._parentChangeSubscription = rxjs_observable_merge.merge(panel.opened, panel.closed, panel._inputChanges.pipe(rxjs_operators_filter.filter(function (changes) { return !!(changes["hideToggle"] || changes["disabled"]); })))
            .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        _focusMonitor.monitor(_element.nativeElement, false);
    }
    /** Toggles the expanded state of the panel. */
    /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._toggle = /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    function () {
        if (!this.panel.disabled) {
            this.panel.toggle();
        }
    };
    /** Gets whether the panel is expanded. */
    /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._isExpanded = /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    function () {
        return this.panel.expanded;
    };
    /** Gets the expanded state string of the panel. */
    /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._getExpandedState = /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    function () {
        return this.panel._getExpandedState();
    };
    /** Gets the panel id. */
    /**
     * Gets the panel id.
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._getPanelId = /**
     * Gets the panel id.
     * @return {?}
     */
    function () {
        return this.panel.id;
    };
    /** Gets whether the expand indicator should be shown. */
    /**
     * Gets whether the expand indicator should be shown.
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._showToggle = /**
     * Gets whether the expand indicator should be shown.
     * @return {?}
     */
    function () {
        return !this.panel.hideToggle && !this.panel.disabled;
    };
    /** Handle keyup event calling to toggle() if appropriate. */
    /**
     * Handle keyup event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    MatExpansionPanelHeader.prototype._keyup = /**
     * Handle keyup event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case _angular_cdk_keycodes.SPACE:
            case _angular_cdk_keycodes.ENTER:
                event.preventDefault();
                this._toggle();
                break;
            default:
                return;
        }
    };
    /**
     * @return {?}
     */
    MatExpansionPanelHeader.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._parentChangeSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element.nativeElement);
    };
    return MatExpansionPanelHeader;
}());
/**
 * <mat-panel-description> directive.
 *
 * This direction is to be used inside of the MatExpansionPanelHeader component.
 */
var MatExpansionPanelDescription = /** @class */ (function () {
    function MatExpansionPanelDescription() {
    }
    return MatExpansionPanelDescription;
}());
/**
 * <mat-panel-title> directive.
 *
 * This direction is to be used inside of the MatExpansionPanelHeader component.
 */
var MatExpansionPanelTitle = /** @class */ (function () {
    function MatExpansionPanelTitle() {
    }
    return MatExpansionPanelTitle;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatExpansionModule = /** @class */ (function () {
    function MatExpansionModule() {
    }
    return MatExpansionModule;
}());

exports.MatExpansionModule = MatExpansionModule;
exports._CdkAccordion = _CdkAccordion;
exports.MatAccordion = MatAccordion;
exports._CdkAccordionItem = _CdkAccordionItem;
exports.EXPANSION_PANEL_ANIMATION_TIMING = EXPANSION_PANEL_ANIMATION_TIMING;
exports.MatExpansionPanelBase = MatExpansionPanelBase;
exports._MatExpansionPanelMixinBase = _MatExpansionPanelMixinBase;
exports.MatExpansionPanel = MatExpansionPanel;
exports.MatExpansionPanelActionRow = MatExpansionPanelActionRow;
exports.MatExpansionPanelHeader = MatExpansionPanelHeader;
exports.MatExpansionPanelDescription = MatExpansionPanelDescription;
exports.MatExpansionPanelTitle = MatExpansionPanelTitle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-expansion.umd.js.map
