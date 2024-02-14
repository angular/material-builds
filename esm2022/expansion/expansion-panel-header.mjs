/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, Host, Inject, Input, numberAttribute, Optional, ViewEncapsulation, ANIMATION_MODULE_TYPE, } from '@angular/core';
import { EMPTY, merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanel, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, } from './expansion-panel';
import * as i0 from "@angular/core";
import * as i1 from "./expansion-panel";
import * as i2 from "@angular/cdk/a11y";
/**
 * Header element of a `<mat-expansion-panel>`.
 */
export class MatExpansionPanelHeader {
    constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions, _animationMode, tabIndex) {
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._animationMode = _animationMode;
        this._parentChangeSubscription = Subscription.EMPTY;
        /** Tab index of the header. */
        this.tabIndex = 0;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelHeader, deps: [{ token: i1.MatExpansionPanel, host: true }, { token: i0.ElementRef }, { token: i2.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.0", type: MatExpansionPanelHeader, isStandalone: true, selector: "mat-expansion-panel-header", inputs: { expandedHeight: "expandedHeight", collapsedHeight: "collapsedHeight", tabIndex: ["tabIndex", "tabIndex", (value) => (value == null ? 0 : numberAttribute(value))] }, host: { attributes: { "role": "button" }, listeners: { "click": "_toggle()", "keydown": "_keydown($event)" }, properties: { "attr.id": "panel._headerId", "attr.tabindex": "disabled ? -1 : tabIndex", "attr.aria-controls": "_getPanelId()", "attr.aria-expanded": "_isExpanded()", "attr.aria-disabled": "panel.disabled", "class.mat-expanded": "_isExpanded()", "class.mat-expansion-toggle-indicator-after": "_getTogglePosition() === 'after'", "class.mat-expansion-toggle-indicator-before": "_getTogglePosition() === 'before'", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "style.height": "_getHeaderHeight()" }, classAttribute: "mat-expansion-panel-header mat-focus-indicator" }, ngImport: i0, template: "<span class=\"mat-content\" [class.mat-content-hide-toggle]=\"!_showToggle()\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span [@indicatorRotate]=\"_getExpandedState()\" class=\"mat-expansion-indicator\"></span>\n}\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}"], animations: [matExpansionAnimations.indicatorRotate], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-expansion-panel-header', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, animations: [matExpansionAnimations.indicatorRotate], host: {
                        'class': 'mat-expansion-panel-header mat-focus-indicator',
                        'role': 'button',
                        '[attr.id]': 'panel._headerId',
                        '[attr.tabindex]': 'disabled ? -1 : tabIndex',
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
                    }, standalone: true, template: "<span class=\"mat-content\" [class.mat-content-hide-toggle]=\"!_showToggle()\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span [@indicatorRotate]=\"_getExpandedState()\" class=\"mat-expansion-indicator\"></span>\n}\n", styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}"] }]
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
            }], tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => (value == null ? 0 : numberAttribute(value)),
                    }]
            }] } });
/**
 * Description element of a `<mat-expansion-panel-header>`.
 */
export class MatExpansionPanelDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelDescription, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatExpansionPanelDescription, isStandalone: true, selector: "mat-panel-description", host: { classAttribute: "mat-expansion-panel-header-description" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelDescription, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-panel-description',
                    host: {
                        class: 'mat-expansion-panel-header-description',
                    },
                    standalone: true,
                }]
        }] });
/**
 * Title element of a `<mat-expansion-panel-header>`.
 */
export class MatExpansionPanelTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0", type: MatExpansionPanelTitle, isStandalone: true, selector: "mat-panel-title", host: { classAttribute: "mat-expansion-panel-header-title" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: MatExpansionPanelTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-panel-title',
                    host: {
                        class: 'mat-expansion-panel-header-title',
                    },
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbkUsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sS0FBSyxFQUNMLGVBQWUsRUFFZixRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLHFCQUFxQixHQUN0QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFDTCxpQkFBaUIsRUFFakIsbUNBQW1DLEdBQ3BDLE1BQU0sbUJBQW1CLENBQUM7Ozs7QUFFM0I7O0dBRUc7QUEwQkgsTUFBTSxPQUFPLHVCQUF1QjtJQUdsQyxZQUNpQixLQUF3QixFQUMvQixRQUFvQixFQUNwQixhQUEyQixFQUMzQixrQkFBcUMsRUFHN0MsY0FBZ0QsRUFDRSxjQUF1QixFQUNsRCxRQUFpQjtRQVJ6QixVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUMv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SixLQUFLLEVBQUUsa0NBQWtDO3FCQUMxQztvQkFDRCxVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RU5URVIsIGhhc01vZGlmaWVyS2V5LCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSG9zdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgbnVtYmVyQXR0cmlidXRlLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RU1QVFksIG1lcmdlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb259IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuaW1wb3J0IHttYXRFeHBhbnNpb25BbmltYXRpb25zfSBmcm9tICcuL2V4cGFuc2lvbi1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1hdEV4cGFuc2lvblBhbmVsLFxuICBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zLFxuICBNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUyxcbn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwnO1xuXG4vKipcbiAqIEhlYWRlciBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcbiAgc3R5bGVVcmxzOiBbJ2V4cGFuc2lvbi1wYW5lbC1oZWFkZXIuY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnZXhwYW5zaW9uLXBhbmVsLWhlYWRlci5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGFuaW1hdGlvbnM6IFttYXRFeHBhbnNpb25BbmltYXRpb25zLmluZGljYXRvclJvdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXIgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ3JvbGUnOiAnYnV0dG9uJyxcbiAgICAnW2F0dHIuaWRdJzogJ3BhbmVsLl9oZWFkZXJJZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogdGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdfZ2V0UGFuZWxJZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ3BhbmVsLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbmRlZF0nOiAnX2lzRXhwYW5kZWQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXRvZ2dsZS1pbmRpY2F0b3ItYWZ0ZXJdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYWZ0ZXInYCxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1iZWZvcmVdJzogYF9nZXRUb2dnbGVQb3NpdGlvbigpID09PSAnYmVmb3JlJ2AsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ19nZXRIZWFkZXJIZWlnaHQoKScsXG4gICAgJyhjbGljayknOiAnX3RvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19rZXlkb3duKCRldmVudCknLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhlYWRlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRm9jdXNhYmxlT3B0aW9uIHtcbiAgcHJpdmF0ZSBfcGFyZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBIb3N0KCkgcHVibGljIHBhbmVsOiBNYXRFeHBhbnNpb25QYW5lbCxcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TKVxuICAgIEBPcHRpb25hbCgpXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleD86IHN0cmluZyxcbiAgKSB7XG4gICAgY29uc3QgYWNjb3JkaW9uSGlkZVRvZ2dsZUNoYW5nZSA9IHBhbmVsLmFjY29yZGlvblxuICAgICAgPyBwYW5lbC5hY2NvcmRpb24uX3N0YXRlQ2hhbmdlcy5waXBlKFxuICAgICAgICAgIGZpbHRlcihjaGFuZ2VzID0+ICEhKGNoYW5nZXNbJ2hpZGVUb2dnbGUnXSB8fCBjaGFuZ2VzWyd0b2dnbGVQb3NpdGlvbiddKSksXG4gICAgICAgIClcbiAgICAgIDogRU1QVFk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4IHx8ICcnKSB8fCAwO1xuXG4gICAgLy8gU2luY2UgdGhlIHRvZ2dsZSBzdGF0ZSBkZXBlbmRzIG9uIGFuIEBJbnB1dCBvbiB0aGUgcGFuZWwsIHdlXG4gICAgLy8gbmVlZCB0byBzdWJzY3JpYmUgYW5kIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseS5cbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPSBtZXJnZShcbiAgICAgIHBhbmVsLm9wZW5lZCxcbiAgICAgIHBhbmVsLmNsb3NlZCxcbiAgICAgIGFjY29yZGlvbkhpZGVUb2dnbGVDaGFuZ2UsXG4gICAgICBwYW5lbC5faW5wdXRDaGFuZ2VzLnBpcGUoXG4gICAgICAgIGZpbHRlcihjaGFuZ2VzID0+IHtcbiAgICAgICAgICByZXR1cm4gISEoY2hhbmdlc1snaGlkZVRvZ2dsZSddIHx8IGNoYW5nZXNbJ2Rpc2FibGVkJ10gfHwgY2hhbmdlc1sndG9nZ2xlUG9zaXRpb24nXSk7XG4gICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICAvLyBBdm9pZHMgZm9jdXMgYmVpbmcgbG9zdCBpZiB0aGUgcGFuZWwgY29udGFpbmVkIHRoZSBmb2N1c2VkIGVsZW1lbnQgYW5kIHdhcyBjbG9zZWQuXG4gICAgcGFuZWwuY2xvc2VkXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gcGFuZWwuX2NvbnRhaW5zRm9jdXMoKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IF9mb2N1c01vbml0b3IuZm9jdXNWaWEoX2VsZW1lbnQsICdwcm9ncmFtJykpO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmV4cGFuZGVkSGVpZ2h0ID0gZGVmYXVsdE9wdGlvbnMuZXhwYW5kZWRIZWlnaHQ7XG4gICAgICB0aGlzLmNvbGxhcHNlZEhlaWdodCA9IGRlZmF1bHRPcHRpb25zLmNvbGxhcHNlZEhlaWdodDtcbiAgICB9XG4gIH1cblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGV4cGFuZGVkLiAqL1xuICBASW5wdXQoKSBleHBhbmRlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgY29sbGFwc2VkLiAqL1xuICBASW5wdXQoKSBjb2xsYXBzZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogVGFiIGluZGV4IG9mIHRoZSBoZWFkZXIuICovXG4gIEBJbnB1dCh7XG4gICAgdHJhbnNmb3JtOiAodmFsdWU6IHVua25vd24pID0+ICh2YWx1ZSA9PSBudWxsID8gMCA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSkpLFxuICB9KVxuICB0YWJJbmRleDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXNzb2NpYXRlZCBwYW5lbCBpcyBkaXNhYmxlZC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIGBGb2N1c2FibGVPcHRpb25gLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHBhbmVsLiAqL1xuICBfdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5wYW5lbC50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgX2lzRXhwYW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwuZXhwYW5kZWQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nIG9mIHRoZSBwYW5lbC4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC5fZ2V0RXhwYW5kZWRTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhbmVsIGlkLiAqL1xuICBfZ2V0UGFuZWxJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnBhbmVsLmlkO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRvZ2dsZSBwb3NpdGlvbiBmb3IgdGhlIGhlYWRlci4gKi9cbiAgX2dldFRvZ2dsZVBvc2l0aW9uKCk6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbC50b2dnbGVQb3NpdGlvbjtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGV4cGFuZCBpbmRpY2F0b3Igc2hvdWxkIGJlIHNob3duLiAqL1xuICBfc2hvd1RvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucGFuZWwuaGlkZVRvZ2dsZSAmJiAhdGhpcy5wYW5lbC5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGhlaWdodCBvZiB0aGUgaGVhZGVyLiBOdWxsIGlmIG5vIGN1c3RvbSBoZWlnaHQgaGFzIGJlZW5cbiAgICogc3BlY2lmaWVkLCBhbmQgaWYgdGhlIGRlZmF1bHQgaGVpZ2h0IGZyb20gdGhlIHN0eWxlc2hlZXQgc2hvdWxkIGJlIHVzZWQuXG4gICAqL1xuICBfZ2V0SGVhZGVySGVpZ2h0KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGlzRXhwYW5kZWQgPSB0aGlzLl9pc0V4cGFuZGVkKCk7XG4gICAgaWYgKGlzRXhwYW5kZWQgJiYgdGhpcy5leHBhbmRlZEhlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5kZWRIZWlnaHQ7XG4gICAgfSBlbHNlIGlmICghaXNFeHBhbmRlZCAmJiB0aGlzLmNvbGxhcHNlZEhlaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGFwc2VkSGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBIYW5kbGUga2V5ZG93biBldmVudCBjYWxsaW5nIHRvIHRvZ2dsZSgpIGlmIGFwcHJvcHJpYXRlLiAqL1xuICBfa2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgLy8gVG9nZ2xlIGZvciBzcGFjZSBhbmQgZW50ZXIga2V5cy5cbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5fdG9nZ2xlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLmFjY29yZGlvbikge1xuICAgICAgICAgIHRoaXMucGFuZWwuYWNjb3JkaW9uLl9oYW5kbGVIZWFkZXJLZXlkb3duKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgcGFuZWwgaGVhZGVyLiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgYEZvY3VzYWJsZU9wdGlvbmAuXG4gICAqIEBwYXJhbSBvcmlnaW4gT3JpZ2luIG9mIHRoZSBhY3Rpb24gdGhhdCB0cmlnZ2VyZWQgdGhlIGZvY3VzLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBmb2N1cyhvcmlnaW4/OiBGb2N1c09yaWdpbiwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmIChvcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9lbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnQpLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgaWYgKG9yaWdpbiAmJiB0aGlzLnBhbmVsLmFjY29yZGlvbikge1xuICAgICAgICB0aGlzLnBhbmVsLmFjY29yZGlvbi5faGFuZGxlSGVhZGVyRm9jdXModGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9wYXJlbnRDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXNjcmlwdGlvbiBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtZGVzY3JpcHRpb24nLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsRGVzY3JpcHRpb24ge31cblxuLyoqXG4gKiBUaXRsZSBlbGVtZW50IG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcj5gLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFuZWwtdGl0bGUnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci10aXRsZScsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUge31cbiIsIjxzcGFuIGNsYXNzPVwibWF0LWNvbnRlbnRcIiBbY2xhc3MubWF0LWNvbnRlbnQtaGlkZS10b2dnbGVdPVwiIV9zaG93VG9nZ2xlKClcIj5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LXBhbmVsLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtcGFuZWwtZGVzY3JpcHRpb25cIj48L25nLWNvbnRlbnQ+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvc3Bhbj5cblxuQGlmIChfc2hvd1RvZ2dsZSgpKSB7XG4gIDxzcGFuIFtAaW5kaWNhdG9yUm90YXRlXT1cIl9nZXRFeHBhbmRlZFN0YXRlKClcIiBjbGFzcz1cIm1hdC1leHBhbnNpb24taW5kaWNhdG9yXCI+PC9zcGFuPlxufVxuIl19