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
import * as i3 from "@angular/common";
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
}
MatExpansionPanelHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelHeader, deps: [{ token: i1.MatExpansionPanel, host: true }, { token: i0.ElementRef }, { token: i2.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component });
MatExpansionPanelHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: { tabIndex: "tabIndex", expandedHeight: "expandedHeight", collapsedHeight: "collapsedHeight" }, host: { attributes: { "role": "button" }, listeners: { "click": "_toggle()", "keydown": "_keydown($event)" }, properties: { "attr.id": "panel._headerId", "attr.tabindex": "tabIndex", "attr.aria-controls": "_getPanelId()", "attr.aria-expanded": "_isExpanded()", "attr.aria-disabled": "panel.disabled", "class.mat-expanded": "_isExpanded()", "class.mat-expansion-toggle-indicator-after": "_getTogglePosition() === 'after'", "class.mat-expansion-toggle-indicator-before": "_getTogglePosition() === 'before'", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "style.height": "_getHeaderHeight()" }, classAttribute: "mat-expansion-panel-header mat-focus-indicator" }, usesInheritance: true, ngImport: i0, template: "<span class=\"mat-content\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n<span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\"\n      class=\"mat-expansion-indicator\"></span>\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}.cdk-high-contrast-active .mat-expansion-panel .mat-expansion-panel-header.cdk-keyboard-focused:not([aria-disabled=true])::before,.cdk-high-contrast-active .mat-expansion-panel .mat-expansion-panel-header.cdk-program-focused:not([aria-disabled=true])::before,.cdk-high-contrast-active .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:hover:not([aria-disabled=true])::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;border:3px solid;border-radius:4px;content:\"\"}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}\n"], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], animations: [matExpansionAnimations.indicatorRotate], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelHeader, decorators: [{
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
                    }, template: "<span class=\"mat-content\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n<span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\"\n      class=\"mat-expansion-indicator\"></span>\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}.cdk-high-contrast-active .mat-expansion-panel .mat-expansion-panel-header.cdk-keyboard-focused:not([aria-disabled=true])::before,.cdk-high-contrast-active .mat-expansion-panel .mat-expansion-panel-header.cdk-program-focused:not([aria-disabled=true])::before,.cdk-high-contrast-active .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:hover:not([aria-disabled=true])::before{top:0;left:0;right:0;bottom:0;position:absolute;box-sizing:border-box;pointer-events:none;border:3px solid;border-radius:4px;content:\"\"}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatExpansionPanel, decorators: [{
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
                }] }]; }, propDecorators: { expandedHeight: [{
                type: Input
            }], collapsedHeight: [{
                type: Input
            }] } });
/**
 * Description element of a `<mat-expansion-panel-header>`.
 */
export class MatExpansionPanelDescription {
}
MatExpansionPanelDescription.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelDescription, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatExpansionPanelDescription.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatExpansionPanelDescription, selector: "mat-panel-description", host: { classAttribute: "mat-expansion-panel-header-description" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelDescription, decorators: [{
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
}
MatExpansionPanelTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatExpansionPanelTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatExpansionPanelTitle, selector: "mat-panel-title", host: { classAttribute: "mat-expansion-panel-header-title" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatExpansionPanelTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-panel-title',
                    host: {
                        class: 'mat-expansion-panel-header-title',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbkUsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFjLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRWxFLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUQsT0FBTyxFQUNMLGlCQUFpQixFQUVqQixtQ0FBbUMsR0FDcEMsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7QUFFM0IsOERBQThEO0FBQzlELG9CQUFvQjtBQUNwQixNQUFlLDJCQUEyQjtDQUV6QztBQUNELE1BQU0saUNBQWlDLEdBQUcsYUFBYSxDQUFDLDJCQUEyQixD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dkMsc0JBQXNCLEVBQUUsZ0JBQWdCO3dCQUN4QyxzQkFBc0IsRUFBRSxlQUFlO3dCQUN2Qyw4Q0FBOEMsRUFBRSxrQ0FBa0M7d0JBQ2xGLCtDQUErQyxFQUFFLG1DQUFtQzt3QkFDcEYsaUNBQWlDLEVBQUUscUNBQXFDO3dCQUN4RSxnQkFBZ0IsRUFBRSxvQkFBb0I7d0JBQ3RDLFNBQVMsRUFBRSxXQUFXO3dCQUN0QixXQUFXLEVBQUUsa0JBQWtCO3FCQUNoQzs7MEJBU0UsSUFBSTs7MEJBSUosTUFBTTsyQkFBQyxtQ0FBbUM7OzBCQUMxQyxRQUFROzswQkFFUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs7MEJBQ3hDLFNBQVM7MkJBQUMsVUFBVTs0Q0FtQ2QsY0FBYztzQkFBdEIsS0FBSztnQkFHRyxlQUFlO3NCQUF2QixLQUFLOztBQTBHUjs7R0FFRztBQU9ILE1BQU0sT0FBTyw0QkFBNEI7OzhIQUE1Qiw0QkFBNEI7a0hBQTVCLDRCQUE0QjtnR0FBNUIsNEJBQTRCO2tCQU54QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsd0NBQXdDO3FCQUNoRDtpQkFDRjs7QUFHRDs7R0FFRztBQU9ILE1BQU0sT0FBTyxzQkFBc0I7O3dIQUF0QixzQkFBc0I7NEdBQXRCLHNCQUFzQjtnR0FBdEIsc0JBQXNCO2tCQU5sQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsa0NBQWtDO3FCQUMxQztpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtFTlRFUiwgaGFzTW9kaWZpZXJLZXksIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7SGFzVGFiSW5kZXgsIG1peGluVGFiSW5kZXh9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RU1QVFksIG1lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb259IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuaW1wb3J0IHttYXRFeHBhbnNpb25BbmltYXRpb25zfSBmcm9tICcuL2V4cGFuc2lvbi1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1hdEV4cGFuc2lvblBhbmVsLFxuICBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zLFxuICBNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUyxcbn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmFic3RyYWN0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyQmFzZSB7XG4gIGFic3RyYWN0IHJlYWRvbmx5IGRpc2FibGVkOiBib29sZWFuO1xufVxuY29uc3QgX01hdEV4cGFuc2lvblBhbmVsSGVhZGVyTWl4aW5CYXNlID0gbWl4aW5UYWJJbmRleChNYXRFeHBhbnNpb25QYW5lbEhlYWRlckJhc2UpO1xuXG4vKipcbiAqIEhlYWRlciBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcbiAgc3R5bGVVcmxzOiBbJ2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWyd0YWJJbmRleCddLFxuICBhbmltYXRpb25zOiBbbWF0RXhwYW5zaW9uQW5pbWF0aW9ucy5pbmRpY2F0b3JSb3RhdGVdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdyb2xlJzogJ2J1dHRvbicsXG4gICAgJ1thdHRyLmlkXSc6ICdwYW5lbC5faGVhZGVySWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdfZ2V0UGFuZWxJZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ3BhbmVsLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYWZ0ZXJdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYWZ0ZXInYCxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1iZWZvcmVdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYmVmb3JlJ2AsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ19nZXRIZWFkZXJIZWlnaHQoKScsXG4gICAgJyhjbGljayknOiAnX3RvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhlYWRlclxuICBleHRlbmRzIF9NYXRFeHBhbnNpb25QYW5lbEhlYWRlck1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRm9jdXNhYmxlT3B0aW9uLCBIYXNUYWJJbmRleFxue1xuICBwcml2YXRlIF9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEhvc3QoKSBwdWJsaWMgcGFuZWw6IE1hdEV4cGFuc2lvblBhbmVsLFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpXG4gICAgQE9wdGlvbmFsKClcbiAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4Pzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IGFjY29yZGlvbkhpZGVUb2dnbGVDaGFuZ2UgPSBwYW5lbC5hY2NvcmRpb25cbiAgICAgID8gcGFuZWwuYWNjb3JkaW9uLl9zdGF0ZUNoYW5nZXMucGlwZShcbiAgICAgICAgICBmaWx0ZXIoY2hhbmdlcyA9PiAhIShjaGFuZ2VzWydoaWRlVG9nZ2xlJ10gfHwgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSkpLFxuICAgICAgICApXG4gICAgICA6IEVNUFRZO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCB8fCAnJykgfHwgMDtcblxuICAgIC8vIFNpbmNlIHRoZSB0b2dnbGUgc3RhdGUgZGVwZW5kcyBvbiBhbiBASW5wdXQgb24gdGhlIHBhbmVsLCB3ZVxuICAgIC8vIG5lZWQgdG8gc3Vic2NyaWJlIGFuZCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHkuXG4gICAgdGhpcy5fcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gbWVyZ2UoXG4gICAgICBwYW5lbC5vcGVuZWQsXG4gICAgICBwYW5lbC5jbG9zZWQsXG4gICAgICBhY2NvcmRpb25IaWRlVG9nZ2xlQ2hhbmdlLFxuICAgICAgcGFuZWwuX2lucHV0Q2hhbmdlcy5waXBlKFxuICAgICAgICBmaWx0ZXIoY2hhbmdlcyA9PiB7XG4gICAgICAgICAgcmV0dXJuICEhKGNoYW5nZXNbJ2hpZGVUb2dnbGUnXSB8fCBjaGFuZ2VzWydkaXNhYmxlZCddIHx8IGNoYW5nZXNbJ3RvZ2dsZVBvc2l0aW9uJ10pO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuXG4gICAgLy8gQXZvaWRzIGZvY3VzIGJlaW5nIGxvc3QgaWYgdGhlIHBhbmVsIGNvbnRhaW5lZCB0aGUgZm9jdXNlZCBlbGVtZW50IGFuZCB3YXMgY2xvc2VkLlxuICAgIHBhbmVsLmNsb3NlZFxuICAgICAgLnBpcGUoZmlsdGVyKCgpID0+IHBhbmVsLl9jb250YWluc0ZvY3VzKCkpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiBfZm9jdXNNb25pdG9yLmZvY3VzVmlhKF9lbGVtZW50LCAncHJvZ3JhbScpKTtcblxuICAgIGlmIChkZWZhdWx0T3B0aW9ucykge1xuICAgICAgdGhpcy5leHBhbmRlZEhlaWdodCA9IGRlZmF1bHRPcHRpb25zLmV4cGFuZGVkSGVpZ2h0O1xuICAgICAgdGhpcy5jb2xsYXBzZWRIZWlnaHQgPSBkZWZhdWx0T3B0aW9ucy5jb2xsYXBzZWRIZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgQElucHV0KCkgZXhwYW5kZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC4gKi9cbiAgQElucHV0KCkgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFzc29jaWF0ZWQgcGFuZWwgaXMgZGlzYWJsZWQuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBwYW5lbC4gKi9cbiAgX3RvZ2dsZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZWwudG9nZ2xlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIF9pc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmV4cGFuZGVkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZyBvZiB0aGUgcGFuZWwuICovXG4gIF9nZXRFeHBhbmRlZFN0YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuX2dldEV4cGFuZGVkU3RhdGUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBwYW5lbCBpZC4gKi9cbiAgX2dldFBhbmVsSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5pZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0b2dnbGUgcG9zaXRpb24gZm9yIHRoZSBoZWFkZXIuICovXG4gIF9nZXRUb2dnbGVQb3NpdGlvbigpOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwudG9nZ2xlUG9zaXRpb247XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBleHBhbmQgaW5kaWNhdG9yIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgX3Nob3dUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnBhbmVsLmhpZGVUb2dnbGUgJiYgIXRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBoZWlnaHQgb2YgdGhlIGhlYWRlci4gTnVsbCBpZiBubyBjdXN0b20gaGVpZ2h0IGhhcyBiZWVuXG4gICAqIHNwZWNpZmllZCwgYW5kIGlmIHRoZSBkZWZhdWx0IGhlaWdodCBmcm9tIHRoZSBzdHlsZXNoZWV0IHNob3VsZCBiZSB1c2VkLlxuICAgKi9cbiAgX2dldEhlYWRlckhlaWdodCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBpc0V4cGFuZGVkID0gdGhpcy5faXNFeHBhbmRlZCgpO1xuICAgIGlmIChpc0V4cGFuZGVkICYmIHRoaXMuZXhwYW5kZWRIZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZGVkSGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAoIWlzRXhwYW5kZWQgJiYgdGhpcy5jb2xsYXBzZWRIZWlnaHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlZEhlaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogSGFuZGxlIGtleWRvd24gZXZlbnQgY2FsbGluZyB0byB0b2dnbGUoKSBpZiBhcHByb3ByaWF0ZS4gKi9cbiAgX2tleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIC8vIFRvZ2dsZSBmb3Igc3BhY2UgYW5kIGVudGVyIGtleXMuXG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3RvZ2dsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAodGhpcy5wYW5lbC5hY2NvcmRpb24pIHtcbiAgICAgICAgICB0aGlzLnBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyS2V5ZG93bihldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHBhbmVsIGhlYWRlci4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAcGFyYW0gb3JpZ2luIE9yaWdpbiBvZiB0aGUgYWN0aW9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBmb2N1cy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50KS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGlmIChvcmlnaW4gJiYgdGhpcy5wYW5lbC5hY2NvcmRpb24pIHtcbiAgICAgICAgdGhpcy5wYW5lbC5hY2NvcmRpb24uX2hhbmRsZUhlYWRlckZvY3VzKHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqXG4gKiBEZXNjcmlwdGlvbiBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtZGVzY3JpcHRpb24nLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24ge31cblxuLyoqXG4gKiBUaXRsZSBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtdGl0bGUnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci10aXRsZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUge31cbiIsIjxzcGFuIGNsYXNzPVwibWF0LWNvbnRlbnRcIj5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LXBhbmVsLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtcGFuZWwtZGVzY3JpcHRpb25cIj48L25nLWNvbnRlbnQ+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvc3Bhbj5cbjxzcGFuIFtAaW5kaWNhdG9yUm90YXRlXT1cIl9nZXRFeHBhbmRlZFN0YXRlKClcIiAqbmdJZj1cIl9zaG93VG9nZ2xlKClcIlxuICAgICAgY2xhc3M9XCJtYXQtZXhwYW5zaW9uLWluZGljYXRvclwiPjwvc3Bhbj5cbiJdfQ==