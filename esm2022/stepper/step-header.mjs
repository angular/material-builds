/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation, } from '@angular/core';
import { MatStepLabel } from './step-label';
import { MatStepperIntl } from './stepper-intl';
import { CdkStepHeader } from '@angular/cdk/stepper';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./stepper-intl";
import * as i2 from "@angular/cdk/a11y";
export class MatStepHeader extends CdkStepHeader {
    constructor(_intl, _focusMonitor, _elementRef, changeDetectorRef) {
        super(_elementRef);
        this._intl = _intl;
        this._focusMonitor = _focusMonitor;
        this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true);
    }
    ngOnDestroy() {
        this._intlSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Focuses the step header. */
    focus(origin, options) {
        if (origin) {
            this._focusMonitor.focusVia(this._elementRef, origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    /** Returns string label of given step if it is a text label. */
    _stringLabel() {
        return this.label instanceof MatStepLabel ? null : this.label;
    }
    /** Returns MatStepLabel if the label of given step is a template label. */
    _templateLabel() {
        return this.label instanceof MatStepLabel ? this.label : null;
    }
    /** Returns the host HTML element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Template context variables that are exposed to the `matStepperIcon` instances. */
    _getIconContext() {
        return {
            index: this.index,
            active: this.active,
            optional: this.optional,
        };
    }
    _getDefaultTextForState(state) {
        if (state == 'number') {
            return `${this.index + 1}`;
        }
        if (state == 'edit') {
            return 'create';
        }
        if (state == 'error') {
            return 'warning';
        }
        return state;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatStepHeader, deps: [{ token: i1.MatStepperIntl }, { token: i2.FocusMonitor }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.1.0-next.5", type: MatStepHeader, isStandalone: true, selector: "mat-step-header", inputs: { state: "state", label: "label", errorMessage: "errorMessage", iconOverrides: "iconOverrides", index: "index", selected: "selected", active: "active", optional: "optional", disableRipple: "disableRipple", color: "color" }, host: { attributes: { "role": "tab" }, properties: { "class": "\"mat-\" + (color || \"primary\")" }, classAttribute: "mat-step-header" }, usesInheritance: true, ngImport: i0, template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (optional && state != 'error') {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (state === 'error') {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n", styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color)}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color)}@media(hover: none){.mat-step-header:hover{background:none}}.cdk-high-contrast-active .mat-step-header{outline:solid 1px}.cdk-high-contrast-active .mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.cdk-high-contrast-active .mat-step-header[aria-disabled=true]{outline-color:GrayText}.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-label,.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-icon,.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color)}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color);background-color:var(--mat-stepper-header-icon-background-color)}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color);color:var(--mat-stepper-header-error-state-icon-foreground-color)}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font);font-size:var(--mat-stepper-header-label-text-size);font-weight:var(--mat-stepper-header-label-text-weight);color:var(--mat-stepper-header-label-text-color)}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color)}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color);font-size:var(--mat-stepper-header-error-state-label-text-size)}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size);font-weight:var(--mat-stepper-header-selected-state-label-text-weight)}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color);color:var(--mat-stepper-header-selected-state-icon-foreground-color)}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color);color:var(--mat-stepper-header-done-state-icon-foreground-color)}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color);color:var(--mat-stepper-header-edit-state-icon-foreground-color)}"], dependencies: [{ kind: "directive", type: MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatStepHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-step-header', host: {
                        'class': 'mat-step-header',
                        '[class]': '"mat-" + (color || "primary")',
                        'role': 'tab',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [MatRipple, NgTemplateOutlet, MatIcon], template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (optional && state != 'error') {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (state === 'error') {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n", styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color)}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color)}@media(hover: none){.mat-step-header:hover{background:none}}.cdk-high-contrast-active .mat-step-header{outline:solid 1px}.cdk-high-contrast-active .mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.cdk-high-contrast-active .mat-step-header[aria-disabled=true]{outline-color:GrayText}.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-label,.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-icon,.cdk-high-contrast-active .mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color)}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color);background-color:var(--mat-stepper-header-icon-background-color)}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color);color:var(--mat-stepper-header-error-state-icon-foreground-color)}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font);font-size:var(--mat-stepper-header-label-text-size);font-weight:var(--mat-stepper-header-label-text-weight);color:var(--mat-stepper-header-label-text-color)}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color)}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color);font-size:var(--mat-stepper-header-error-state-label-text-size)}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size);font-weight:var(--mat-stepper-header-selected-state-label-text-weight)}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color);color:var(--mat-stepper-header-selected-state-icon-foreground-color)}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color);color:var(--mat-stepper-header-done-state-icon-foreground-color)}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color);color:var(--mat-stepper-header-edit-state-icon-foreground-color)}"] }]
        }], ctorParameters: () => [{ type: i1.MatStepperIntl }, { type: i2.FocusMonitor }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }], propDecorators: { state: [{
                type: Input
            }], label: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], iconOverrides: [{
                type: Input
            }], index: [{
                type: Input
            }], selected: [{
                type: Input
            }], active: [{
                type: Input
            }], optional: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwLWhlYWRlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXAtaGVhZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUVMLGlCQUFpQixHQUdsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUMsYUFBYSxFQUFZLE1BQU0sc0JBQXNCLENBQUM7QUFDOUQsT0FBTyxFQUFDLFNBQVMsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQWdCakQsTUFBTSxPQUFPLGFBQWMsU0FBUSxhQUFhO0lBaUM5QyxZQUNTLEtBQXFCLEVBQ3BCLGFBQTJCLEVBQ25DLFdBQW9DLEVBQ3BDLGlCQUFvQztRQUVwQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFMWixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNwQixrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUtuQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUMz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b29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVGVtcGxhdGVSZWYsXG4gIEFmdGVyVmlld0luaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJbnRsfSBmcm9tICcuL3N0ZXBwZXItaW50bCc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uQ29udGV4dH0gZnJvbSAnLi9zdGVwcGVyLWljb24nO1xuaW1wb3J0IHtDZGtTdGVwSGVhZGVyLCBTdGVwU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7TWF0UmlwcGxlLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRJY29ufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcbmltcG9ydCB7TmdUZW1wbGF0ZU91dGxldH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXN0ZXAtaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwLWhlYWRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXAtaGVhZGVyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwLWhlYWRlcicsXG4gICAgJ1tjbGFzc10nOiAnXCJtYXQtXCIgKyAoY29sb3IgfHwgXCJwcmltYXJ5XCIpJyxcbiAgICAncm9sZSc6ICd0YWInLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdFJpcHBsZSwgTmdUZW1wbGF0ZU91dGxldCwgTWF0SWNvbl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBIZWFkZXIgZXh0ZW5kcyBDZGtTdGVwSGVhZGVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfaW50bFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgZ2l2ZW4gc3RlcC4gKi9cbiAgQElucHV0KCkgc3RhdGU6IFN0ZXBTdGF0ZTtcblxuICAvKiogTGFiZWwgb2YgdGhlIGdpdmVuIHN0ZXAuICovXG4gIEBJbnB1dCgpIGxhYmVsOiBNYXRTdGVwTGFiZWwgfCBzdHJpbmc7XG5cbiAgLyoqIEVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheSB3aGVuIHRoZXJlJ3MgYW4gZXJyb3IuICovXG4gIEBJbnB1dCgpIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKiBPdmVycmlkZXMgZm9yIHRoZSBoZWFkZXIgaWNvbnMsIHBhc3NlZCBpbiB2aWEgdGhlIHN0ZXBwZXIuICovXG4gIEBJbnB1dCgpIGljb25PdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+fTtcblxuICAvKiogSW5kZXggb2YgdGhlIGdpdmVuIHN0ZXAuICovXG4gIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHN0ZXAgaXMgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpIHNlbGVjdGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiBzdGVwIGxhYmVsIGlzIGFjdGl2ZS4gKi9cbiAgQElucHV0KCkgYWN0aXZlOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiBzdGVwIGlzIG9wdGlvbmFsLiAqL1xuICBASW5wdXQoKSBvcHRpb25hbDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgQElucHV0KCkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogVGhlbWUgcGFsZXR0ZSBjb2xvciBvZiB0aGUgc3RlcCBoZWFkZXIuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9pbnRsOiBNYXRTdGVwcGVySW50bCxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG4gICAgdGhpcy5faW50bFN1YnNjcmlwdGlvbiA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc3RlcCBoZWFkZXIuICovXG4gIG92ZXJyaWRlIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKSB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyBzdHJpbmcgbGFiZWwgb2YgZ2l2ZW4gc3RlcCBpZiBpdCBpcyBhIHRleHQgbGFiZWwuICovXG4gIF9zdHJpbmdMYWJlbCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCBpbnN0YW5jZW9mIE1hdFN0ZXBMYWJlbCA/IG51bGwgOiB0aGlzLmxhYmVsO1xuICB9XG5cbiAgLyoqIFJldHVybnMgTWF0U3RlcExhYmVsIGlmIHRoZSBsYWJlbCBvZiBnaXZlbiBzdGVwIGlzIGEgdGVtcGxhdGUgbGFiZWwuICovXG4gIF90ZW1wbGF0ZUxhYmVsKCk6IE1hdFN0ZXBMYWJlbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmxhYmVsIGluc3RhbmNlb2YgTWF0U3RlcExhYmVsID8gdGhpcy5sYWJlbCA6IG51bGw7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaG9zdCBIVE1MIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFRlbXBsYXRlIGNvbnRleHQgdmFyaWFibGVzIHRoYXQgYXJlIGV4cG9zZWQgdG8gdGhlIGBtYXRTdGVwcGVySWNvbmAgaW5zdGFuY2VzLiAqL1xuICBfZ2V0SWNvbkNvbnRleHQoKTogTWF0U3RlcHBlckljb25Db250ZXh0IHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICBhY3RpdmU6IHRoaXMuYWN0aXZlLFxuICAgICAgb3B0aW9uYWw6IHRoaXMub3B0aW9uYWwsXG4gICAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0VGV4dEZvclN0YXRlKHN0YXRlOiBTdGVwU3RhdGUpOiBzdHJpbmcge1xuICAgIGlmIChzdGF0ZSA9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGAke3RoaXMuaW5kZXggKyAxfWA7XG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PSAnZWRpdCcpIHtcbiAgICAgIHJldHVybiAnY3JlYXRlJztcbiAgICB9XG4gICAgaWYgKHN0YXRlID09ICdlcnJvcicpIHtcbiAgICAgIHJldHVybiAnd2FybmluZyc7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1zdGVwLWhlYWRlci1yaXBwbGUgbWF0LWZvY3VzLWluZGljYXRvclwiIG1hdFJpcHBsZVxuICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJkaXNhYmxlUmlwcGxlXCI+PC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJtYXQtc3RlcC1pY29uLXN0YXRlLXt7c3RhdGV9fSBtYXQtc3RlcC1pY29uXCIgW2NsYXNzLm1hdC1zdGVwLWljb24tc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zdGVwLWljb24tY29udGVudFwiPlxuICAgIEBpZiAoaWNvbk92ZXJyaWRlcyAmJiBpY29uT3ZlcnJpZGVzW3N0YXRlXSkge1xuICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpY29uT3ZlcnJpZGVzW3N0YXRlXVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJfZ2V0SWNvbkNvbnRleHQoKVwiPjwvbmctY29udGFpbmVyPlxuICAgIH0gQGVsc2Uge1xuICAgICAgQHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgQGNhc2UgKCdudW1iZXInKSB7XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e3tfZ2V0RGVmYXVsdFRleHRGb3JTdGF0ZShzdGF0ZSl9fTwvc3Bhbj5cbiAgICAgICAgfVxuXG4gICAgICAgIEBkZWZhdWx0IHtcbiAgICAgICAgICBAaWYgKHN0YXRlID09PSAnZG9uZScpIHtcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2RrLXZpc3VhbGx5LWhpZGRlblwiPnt7X2ludGwuY29tcGxldGVkTGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICB9IEBlbHNlIGlmIChzdGF0ZSA9PT0gJ2VkaXQnKSB7XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNkay12aXN1YWxseS1oaWRkZW5cIj57e19pbnRsLmVkaXRhYmxlTGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICA8bWF0LWljb24gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e3tfZ2V0RGVmYXVsdFRleHRGb3JTdGF0ZShzdGF0ZSl9fTwvbWF0LWljb24+XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIDwvZGl2PlxuPC9kaXY+XG48ZGl2IGNsYXNzPVwibWF0LXN0ZXAtbGFiZWxcIlxuICAgICBbY2xhc3MubWF0LXN0ZXAtbGFiZWwtYWN0aXZlXT1cImFjdGl2ZVwiXG4gICAgIFtjbGFzcy5tYXQtc3RlcC1sYWJlbC1zZWxlY3RlZF09XCJzZWxlY3RlZFwiXG4gICAgIFtjbGFzcy5tYXQtc3RlcC1sYWJlbC1lcnJvcl09XCJzdGF0ZSA9PSAnZXJyb3InXCI+XG4gIEBpZiAoX3RlbXBsYXRlTGFiZWwoKTsgYXMgdGVtcGxhdGVMYWJlbCkge1xuICAgIDwhLS0gSWYgdGhlcmUgaXMgYSBsYWJlbCB0ZW1wbGF0ZSwgdXNlIGl0LiAtLT5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXN0ZXAtdGV4dC1sYWJlbFwiPlxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZUxhYmVsLnRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG4gIH0gQGVsc2UgaWYgKF9zdHJpbmdMYWJlbCgpKSB7XG4gICAgPCEtLSBJZiB0aGVyZSBpcyBubyBsYWJlbCB0ZW1wbGF0ZSwgZmFsbCBiYWNrIHRvIHRoZSB0ZXh0IGxhYmVsLiAtLT5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXN0ZXAtdGV4dC1sYWJlbFwiPnt7bGFiZWx9fTwvZGl2PlxuICB9XG5cbiAgQGlmIChvcHRpb25hbCAmJiBzdGF0ZSAhPSAnZXJyb3InKSB7XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zdGVwLW9wdGlvbmFsXCI+e3tfaW50bC5vcHRpb25hbExhYmVsfX08L2Rpdj5cbiAgfVxuXG4gIEBpZiAoc3RhdGUgPT09ICdlcnJvcicpIHtcbiAgICA8ZGl2IGNsYXNzPVwibWF0LXN0ZXAtc3ViLWxhYmVsLWVycm9yXCI+e3tlcnJvck1lc3NhZ2V9fTwvZGl2PlxuICB9XG48L2Rpdj5cblxuIl19