/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/common';
import '@angular/core';
import '@angular/cdk/collections';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@angular/animations';
import { mixinDisabled } from '@angular/material/core';
import 'rxjs/Subject';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators/filter';
import { merge } from 'rxjs/observable/merge';
import 'rxjs/Subscription';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _CdkAccordion = CdkAccordion;
/**
 * Directive for a Material Design Accordion.
 */
class MatAccordion extends _CdkAccordion {
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    get hideToggle() { return this._hideToggle; }
    /**
     * @param {?} show
     * @return {?}
     */
    set hideToggle(show) { this._hideToggle = coerceBooleanProperty(show); }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Workaround for https://github.com/angular/angular/issues/17849
 */
const _CdkAccordionItem = CdkAccordionItem;
/**
 * Time and timing curve for expansion panel animations.
 */
const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * \@docs-private
 */
class MatExpansionPanelBase extends _CdkAccordionItem {
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     */
    constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
    }
}
const _MatExpansionPanelMixinBase = mixinDisabled(MatExpansionPanelBase);
/**
 * <mat-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MdAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
class MatExpansionPanel extends _MatExpansionPanelMixinBase {
    /**
     * Whether the toggle indicator should be hidden.
     * @return {?}
     */
    get hideToggle() {
        return this._hideToggle;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideToggle(value) {
        this._hideToggle = coerceBooleanProperty(value);
    }
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     */
    constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher) {
        super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
        this.accordion = accordion;
    }
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    _getHideToggle() {
        if (this.accordion) {
            return this.accordion.hideToggle;
        }
        return this.hideToggle;
    }
    /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    _hasSpacing() {
        if (this.accordion) {
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    }
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    _getExpandedState() {
        return this.expanded ? 'expanded' : 'collapsed';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._inputChanges.next(changes);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._inputChanges.complete();
    }
}
class MatExpansionPanelActionRow {
}

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
class MatExpansionPanelHeader {
    /**
     * @param {?} panel
     * @param {?} _element
     * @param {?} _focusMonitor
     * @param {?} _changeDetectorRef
     */
    constructor(panel, _element, _focusMonitor, _changeDetectorRef) {
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        // Since the toggle state depends on an @Input on the panel, we
        // need to  subscribe and trigger change detection manually.
        this._parentChangeSubscription = merge(panel.opened, panel.closed, panel._inputChanges.pipe(filter(changes => !!(changes["hideToggle"] || changes["disabled"]))))
            .subscribe(() => this._changeDetectorRef.markForCheck());
        _focusMonitor.monitor(_element.nativeElement, false);
    }
    /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    _toggle() {
        if (!this.panel.disabled) {
            this.panel.toggle();
        }
    }
    /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    _isExpanded() {
        return this.panel.expanded;
    }
    /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    _getExpandedState() {
        return this.panel._getExpandedState();
    }
    /**
     * Gets the panel id.
     * @return {?}
     */
    _getPanelId() {
        return this.panel.id;
    }
    /**
     * Gets whether the expand indicator should be shown.
     * @return {?}
     */
    _showToggle() {
        return !this.panel.hideToggle && !this.panel.disabled;
    }
    /**
     * Handle keyup event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    _keyup(event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case SPACE:
            case ENTER:
                event.preventDefault();
                this._toggle();
                break;
            default:
                return;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._parentChangeSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element.nativeElement);
    }
}
/**
 * <mat-panel-description> directive.
 *
 * This direction is to be used inside of the MatExpansionPanelHeader component.
 */
class MatExpansionPanelDescription {
}
/**
 * <mat-panel-title> directive.
 *
 * This direction is to be used inside of the MatExpansionPanelHeader component.
 */
class MatExpansionPanelTitle {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatExpansionModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatExpansionModule, _CdkAccordion, MatAccordion, _CdkAccordionItem, EXPANSION_PANEL_ANIMATION_TIMING, MatExpansionPanelBase, _MatExpansionPanelMixinBase, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelDescription, MatExpansionPanelTitle };
//# sourceMappingURL=expansion.js.map
