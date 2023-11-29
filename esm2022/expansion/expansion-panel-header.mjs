/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Host, Inject, Input, Optional, ViewEncapsulation, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { mixinTabIndex } from '@angular/material/core';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanel, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, } from './expansion-panel';
import * as i0 from "@angular/core";
import * as i1 from "./expansion-panel";
import * as i2 from "@angular/cdk/a11y";
// Boilerplate for applying mixins to MatExpansionPanelHeader.
/** @docs-private */
class MatExpansionPanelHeaderBase {
}
const _MatExpansionPanelHeaderMixinBase = mixinTabIndex(MatExpansionPanelHeaderBase);
/**
 * Header element of a `<mat-expansion-panel>`.
 */
export class MatExpansionPanelHeader extends _MatExpansionPanelHeaderMixinBase {
    constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions, _animationMode, tabIndex) {
        super();
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        this._parentChangeSubscription = Subscription.EMPTY;
        const accordionHideToggleChange = panel.accordion
            ? panel.accordion._stateChanges.pipe(filter(changes => !!(changes['hideToggle'] || changes['togglePosition'])))
            : EMPTY;
        this.tabIndex = parseInt(tabIndex || '') || 0;
        // Since the toggle state depends on an @Input on the panel, we
        // need to subscribe and trigger change detection manually.
        this._parentChangeSubscription = merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter(changes => {
            return !!(changes['hideToggle'] || changes['disabled'] || changes['togglePosition']);
        }))).subscribe(() => this._changeDetectorRef.markForCheck());
        // Avoids focus being lost if the panel contained the focused element and was closed.
        panel.closed
            .pipe(filter(() => panel._containsFocus()))
            .subscribe(() => _focusMonitor.focusVia(_element, 'program'));
        if (defaultOptions) {
            this.expandedHeight = defaultOptions.expandedHeight;
            this.collapsedHeight = defaultOptions.collapsedHeight;
        }
    }
    /**
     * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
     * @docs-private
     */
    get disabled() {
        return this.panel.disabled;
    }
    /** Toggles the expanded state of the panel. */
    _toggle() {
        if (!this.disabled) {
            this.panel.toggle();
        }
    }
    /** Gets whether the panel is expanded. */
    _isExpanded() {
        return this.panel.expanded;
    }
    /** Gets the expanded state string of the panel. */
    _getExpandedState() {
        return this.panel._getExpandedState();
    }
    /** Gets the panel id. */
    _getPanelId() {
        return this.panel.id;
    }
    /** Gets the toggle position for the header. */
    _getTogglePosition() {
        return this.panel.togglePosition;
    }
    /** Gets whether the expand indicator should be shown. */
    _showToggle() {
        return !this.panel.hideToggle && !this.panel.disabled;
    }
    /**
     * Gets the current height of the header. Null if no custom height has been
     * specified, and if the default height from the stylesheet should be used.
     */
    _getHeaderHeight() {
        const isExpanded = this._isExpanded();
        if (isExpanded && this.expandedHeight) {
            return this.expandedHeight;
        }
        else if (!isExpanded && this.collapsedHeight) {
            return this.collapsedHeight;
        }
        return null;
    }
    /** Handle keydown event calling to toggle() if appropriate. */
    _keydown(event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case SPACE:
            case ENTER:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this._toggle();
                }
                break;
            default:
                if (this.panel.accordion) {
                    this.panel.accordion._handleHeaderKeydown(event);
                }
                return;
        }
    }
    /**
     * Focuses the panel header. Implemented as a part of `FocusableOption`.
     * @param origin Origin of the action that triggered the focus.
     * @docs-private
     */
    focus(origin, options) {
        if (origin) {
            this._focusMonitor.focusVia(this._element, origin, options);
        }
        else {
            this._element.nativeElement.focus(options);
        }
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._element).subscribe(origin => {
            if (origin && this.panel.accordion) {
                this.panel.accordion._handleHeaderFocus(this);
            }
        });
    }
    ngOnDestroy() {
        this._parentChangeSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelHeader, deps: [{ token: i1.MatExpansionPanel, host: true }, { token: i0.ElementRef }, { token: i2.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.0.4", type: MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: { tabIndex: "tabIndex", expandedHeight: "expandedHeight", collapsedHeight: "collapsedHeight" }, host: { attributes: { "role": "button" }, listeners: { "click": "_toggle()", "keydown": "_keydown($event)" }, properties: { "attr.id": "panel._headerId", "attr.tabindex": "tabIndex", "attr.aria-controls": "_getPanelId()", "attr.aria-expanded": "_isExpanded()", "attr.aria-disabled": "panel.disabled", "class.mat-expanded": "_isExpanded()", "class.mat-expansion-toggle-indicator-after": "_getTogglePosition() === 'after'", "class.mat-expansion-toggle-indicator-before": "_getTogglePosition() === 'before'", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "style.height": "_getHeaderHeight()" }, classAttribute: "mat-expansion-panel-header mat-focus-indicator" }, usesInheritance: true, ngImport: i0, template: "<span class=\"mat-content\" [class.mat-content-hide-toggle]=\"!_showToggle()\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span [@indicatorRotate]=\"_getExpandedState()\" class=\"mat-expansion-indicator\"></span>\n}\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}"], animations: [matExpansionAnimations.indicatorRotate], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-expansion-panel-header', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['tabIndex'], animations: [matExpansionAnimations.indicatorRotate], host: {
                        'class': 'mat-expansion-panel-header mat-focus-indicator',
                        'role': 'button',
                        '[attr.id]': 'panel._headerId',
                        '[attr.tabindex]': 'tabIndex',
                        '[attr.aria-controls]': '_getPanelId()',
                        '[attr.aria-expanded]': '_isExpanded()',
                        '[attr.aria-disabled]': 'panel.disabled',
                        '[class.mat-expanded]': '_isExpanded()',
                        '[class.mat-expansion-toggle-indicator-after]': `_getTogglePosition() === 'after'`,
                        '[class.mat-expansion-toggle-indicator-before]': `_getTogglePosition() === 'before'`,
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '[style.height]': '_getHeaderHeight()',
                        '(click)': '_toggle()',
                        '(keydown)': '_keydown($event)',
                    }, template: "<span class=\"mat-content\" [class.mat-content-hide-toggle]=\"!_showToggle()\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span [@indicatorRotate]=\"_getExpandedState()\" class=\"mat-expansion-indicator\"></span>\n}\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}"] }]
        }], ctorParameters: () => [{ type: i1.MatExpansionPanel, decorators: [{
                    type: Host
                }] }, { type: i0.ElementRef }, { type: i2.FocusMonitor }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }], propDecorators: { expandedHeight: [{
                type: Input
            }], collapsedHeight: [{
                type: Input
            }] } });
/**
 * Description element of a `<mat-expansion-panel-header>`.
 */
export class MatExpansionPanelDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelDescription, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatExpansionPanelDescription, selector: "mat-panel-description", host: { classAttribute: "mat-expansion-panel-header-description" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelDescription, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-panel-description',
                    host: {
                        class: 'mat-expansion-panel-header-description',
                    },
                }]
        }] });
/**
 * Title element of a `<mat-expansion-panel-header>`.
 */
export class MatExpansionPanelTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatExpansionPanelTitle, selector: "mat-panel-title", host: { classAttribute: "mat-expansion-panel-header-title" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatExpansionPanelTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-panel-title',
                    host: {
                        class: 'mat-expansion-panel-header-title',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbkUsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFjLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUQsT0FBTyxFQUNMLGlCQUFpQixFQUVqQixtQ0FBbUMsR0FDcEMsTUFBTSxtQkFBbUIsQ0FBQzs7OztBQUUzQiw4REFBOEQ7QUFDOUQsb0JBQW9CO0FBQ3BCLE1BQWUsMkJBQTJCO0NBRXpDO0FBQ0QsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUMsMkJBQTJCLENB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QyxzQkFBc0IsRUFBRSxnQkFBZ0I7d0JBQ3hDLHNCQUFzQixFQUFFLGVBQWU7d0JBQ3ZDLDhDQUE4QyxFQUFFLGtDQUFrQzt3QkFDbEYsK0NBQStDLEVBQUUsbUNBQW1DO3dCQUNwRixpQ0FBaUMsRUFBRSxxQ0FBcUM7d0JBQ3hFLGdCQUFnQixFQUFFLG9CQUFvQjt3QkFDdEMsU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLFdBQVcsRUFBRSxrQkFBa0I7cUJBQ2hDOzswQkFTRSxJQUFJOzswQkFJSixNQUFNOzJCQUFDLG1DQUFtQzs7MEJBQzFDLFFBQVE7OzBCQUVSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzswQkFDeEMsU0FBUzsyQkFBQyxVQUFVO3lDQW1DZCxjQUFjO3NCQUF0QixLQUFLO2dCQUdHLGVBQWU7c0JBQXZCLEtBQUs7O0FBd0dSOztHQUVHO0FBT0gsTUFBTSxPQUFPLDRCQUE0Qjs4R0FBNUIsNEJBQTRCO2tHQUE1Qiw0QkFBNEI7OzJGQUE1Qiw0QkFBNEI7a0JBTnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSx3Q0FBd0M7cUJBQ2hEO2lCQUNGOztBQUdEOztHQUVHO0FBT0gsTUFBTSxPQUFPLHNCQUFzQjs4R0FBdEIsc0JBQXNCO2tHQUF0QixzQkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBTmxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxrQ0FBa0M7cUJBQzFDO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9uLCBGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBoYXNNb2RpZmllcktleSwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3QsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtIYXNUYWJJbmRleCwgbWl4aW5UYWJJbmRleH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0VNUFRZLCBtZXJnZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9ufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcbmltcG9ydCB7bWF0RXhwYW5zaW9uQW5pbWF0aW9uc30gZnJvbSAnLi9leHBhbnNpb24tYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBNYXRFeHBhbnNpb25QYW5lbCxcbiAgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyxcbiAgTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMsXG59IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsJztcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRFeHBhbnNpb25QYW5lbEhlYWRlci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5hYnN0cmFjdCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhlYWRlckJhc2Uge1xuICBhYnN0cmFjdCByZWFkb25seSBkaXNhYmxlZDogYm9vbGVhbjtcbn1cbmNvbnN0IF9NYXRFeHBhbnNpb25QYW5lbEhlYWRlck1peGluQmFzZSA9IG1peGluVGFiSW5kZXgoTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJCYXNlKTtcblxuLyoqXG4gKiBIZWFkZXIgZWxlbWVudCBvZiBhIGA8bWF0LWV4cGFuc2lvbi1wYW5lbD5gLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsXG4gIHN0eWxlVXJsczogWydleHBhbnNpb24tcGFuZWwtaGVhZGVyLmNzcyddLFxuICB0ZW1wbGF0ZVVybDogJ2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsndGFiSW5kZXgnXSxcbiAgYW5pbWF0aW9uczogW21hdEV4cGFuc2lvbkFuaW1hdGlvbnMuaW5kaWNhdG9yUm90YXRlXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlciBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAncm9sZSc6ICdidXR0b24nLFxuICAgICdbYXR0ci5pZF0nOiAncGFuZWwuX2hlYWRlcklkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnX2dldFBhbmVsSWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ19pc0V4cGFuZGVkKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdwYW5lbC5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5kZWRdJzogJ19pc0V4cGFuZGVkKCknLFxuICAgICdbY2xhc3MubWF0LWV4cGFuc2lvbi10b2dnbGUtaW5kaWNhdG9yLWFmdGVyXSc6IGBfZ2V0VG9nZ2xlUG9zaXRpb24oKSA9PT0gJ2FmdGVyJ2AsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYmVmb3JlXSc6IGBfZ2V0VG9nZ2xlUG9zaXRpb24oKSA9PT0gJ2JlZm9yZSdgLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICdbc3R5bGUuaGVpZ2h0XSc6ICdfZ2V0SGVhZGVySGVpZ2h0KCknLFxuICAgICcoY2xpY2spJzogJ190b2dnbGUoKScsXG4gICAgJyhrZXlkb3duKSc6ICdfa2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJcbiAgZXh0ZW5kcyBfTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJNaXhpbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIEZvY3VzYWJsZU9wdGlvbiwgSGFzVGFiSW5kZXhcbntcbiAgcHJpdmF0ZSBfcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBIb3N0KCkgcHVibGljIHBhbmVsOiBNYXRFeHBhbnNpb25QYW5lbCxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TKVxuICAgIEBPcHRpb25hbCgpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleD86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBhY2NvcmRpb25IaWRlVG9nZ2xlQ2hhbmdlID0gcGFuZWwuYWNjb3JkaW9uXG4gICAgICA/IHBhbmVsLmFjY29yZGlvbi5fc3RhdGVDaGFuZ2VzLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGNoYW5nZXMgPT4gISEoY2hhbmdlc1snaGlkZVRvZ2dsZSddIHx8IGNoYW5nZXNbJ3RvZ2dsZVBvc2l0aW9uJ10pKSxcbiAgICAgICAgKVxuICAgICAgOiBFTVBUWTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXggfHwgJycpIHx8IDA7XG5cbiAgICAvLyBTaW5jZSB0aGUgdG9nZ2xlIHN0YXRlIGRlcGVuZHMgb24gYW4gQElucHV0IG9uIHRoZSBwYW5lbCwgd2VcbiAgICAvLyBuZWVkIHRvIHN1YnNjcmliZSBhbmQgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LlxuICAgIHRoaXMuX3BhcmVudENoYW5nZVN1YnNjcmlwdGlvbiA9IG1lcmdlKFxuICAgICAgcGFuZWwub3BlbmVkLFxuICAgICAgcGFuZWwuY2xvc2VkLFxuICAgICAgYWNjb3JkaW9uSGlkZVRvZ2dsZUNoYW5nZSxcbiAgICAgIHBhbmVsLl9pbnB1dENoYW5nZXMucGlwZShcbiAgICAgICAgZmlsdGVyKGNoYW5nZXMgPT4ge1xuICAgICAgICAgIHJldHVybiAhIShjaGFuZ2VzWydoaWRlVG9nZ2xlJ10gfHwgY2hhbmdlc1snZGlzYWJsZWQnXSB8fCBjaGFuZ2VzWyd0b2dnbGVQb3NpdGlvbiddKTtcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcblxuICAgIC8vIEF2b2lkcyBmb2N1cyBiZWluZyBsb3N0IGlmIHRoZSBwYW5lbCBjb250YWluZWQgdGhlIGZvY3VzZWQgZWxlbWVudCBhbmQgd2FzIGNsb3NlZC5cbiAgICBwYW5lbC5jbG9zZWRcbiAgICAgIC5waXBlKGZpbHRlcigoKSA9PiBwYW5lbC5fY29udGFpbnNGb2N1cygpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYShfZWxlbWVudCwgJ3Byb2dyYW0nKSk7XG5cbiAgICBpZiAoZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZXhwYW5kZWRIZWlnaHQgPSBkZWZhdWx0T3B0aW9ucy5leHBhbmRlZEhlaWdodDtcbiAgICAgIHRoaXMuY29sbGFwc2VkSGVpZ2h0ID0gZGVmYXVsdE9wdGlvbnMuY29sbGFwc2VkSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIEBJbnB1dCgpIGV4cGFuZGVkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBjb2xsYXBzZWQuICovXG4gIEBJbnB1dCgpIGNvbGxhcHNlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhc3NvY2lhdGVkIHBhbmVsIGlzIGRpc2FibGVkLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYEZvY3VzYWJsZU9wdGlvbmAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcGFuZWwuICovXG4gIF90b2dnbGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnBhbmVsLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHBhbmVsIGlzIGV4cGFuZGVkLiAqL1xuICBfaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5leHBhbmRlZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBleHBhbmRlZCBzdGF0ZSBzdHJpbmcgb2YgdGhlIHBhbmVsLiAqL1xuICBfZ2V0RXhwYW5kZWRTdGF0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLl9nZXRFeHBhbmRlZFN0YXRlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGFuZWwgaWQuICovXG4gIF9nZXRQYW5lbElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuaWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdG9nZ2xlIHBvc2l0aW9uIGZvciB0aGUgaGVhZGVyLiAqL1xuICBfZ2V0VG9nZ2xlUG9zaXRpb24oKTogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24ge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLnRvZ2dsZVBvc2l0aW9uO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgZXhwYW5kIGluZGljYXRvciBzaG91bGQgYmUgc2hvd24uICovXG4gIF9zaG93VG9nZ2xlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5wYW5lbC5oaWRlVG9nZ2xlICYmICF0aGlzLnBhbmVsLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBoZWFkZXIuIE51bGwgaWYgbm8gY3VzdG9tIGhlaWdodCBoYXMgYmVlblxuICAgKiBzcGVjaWZpZWQsIGFuZCBpZiB0aGUgZGVmYXVsdCBoZWlnaHQgZnJvbSB0aGUgc3R5bGVzaGVldCBzaG91bGQgYmUgdXNlZC5cbiAgICovXG4gIF9nZXRIZWFkZXJIZWlnaHQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgaXNFeHBhbmRlZCA9IHRoaXMuX2lzRXhwYW5kZWQoKTtcbiAgICBpZiAoaXNFeHBhbmRlZCAmJiB0aGlzLmV4cGFuZGVkSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRlZEhlaWdodDtcbiAgICB9IGVsc2UgaWYgKCFpc0V4cGFuZGVkICYmIHRoaXMuY29sbGFwc2VkSGVpZ2h0KSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZWRIZWlnaHQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBrZXlkb3duIGV2ZW50IGNhbGxpbmcgdG8gdG9nZ2xlKCkgaWYgYXBwcm9wcmlhdGUuICovXG4gIF9rZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAvLyBUb2dnbGUgZm9yIHNwYWNlIGFuZCBlbnRlciBrZXlzLlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl90b2dnbGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHRoaXMucGFuZWwuYWNjb3JkaW9uKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbC5hY2NvcmRpb24uX2hhbmRsZUhlYWRlcktleWRvd24oZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwYW5lbCBoZWFkZXIuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICogQHBhcmFtIG9yaWdpbiBPcmlnaW4gb2YgdGhlIGFjdGlvbiB0aGF0IHRyaWdnZXJlZCB0aGUgZm9jdXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudCkuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICBpZiAob3JpZ2luICYmIHRoaXMucGFuZWwuYWNjb3JkaW9uKSB7XG4gICAgICAgIHRoaXMucGFuZWwuYWNjb3JkaW9uLl9oYW5kbGVIZWFkZXJGb2N1cyh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3BhcmVudENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIERlc2NyaXB0aW9uIGVsZW1lbnQgb2YgYSBgPG1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyPmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1wYW5lbC1kZXNjcmlwdGlvbicsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWRlc2NyaXB0aW9uJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbiB7fVxuXG4vKipcbiAqIFRpdGxlIGVsZW1lbnQgb2YgYSBgPG1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyPmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1wYW5lbC10aXRsZScsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLXRpdGxlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxUaXRsZSB7fVxuIiwiPHNwYW4gY2xhc3M9XCJtYXQtY29udGVudFwiIFtjbGFzcy5tYXQtY29udGVudC1oaWRlLXRvZ2dsZV09XCIhX3Nob3dUb2dnbGUoKVwiPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtcGFuZWwtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1wYW5lbC1kZXNjcmlwdGlvblwiPjwvbmctY29udGVudD5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9zcGFuPlxuXG5AaWYgKF9zaG93VG9nZ2xlKCkpIHtcbiAgPHNwYW4gW0BpbmRpY2F0b3JSb3RhdGVdPVwiX2dldEV4cGFuZGVkU3RhdGUoKVwiIGNsYXNzPVwibWF0LWV4cGFuc2lvbi1pbmRpY2F0b3JcIj48L3NwYW4+XG59XG4iXX0=