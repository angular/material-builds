/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { CdkStep, CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, QueryList, SkipSelf, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { MatStepHeader } from './step-header';
import { MatStepLabel } from './step-label';
import { matStepperAnimations } from './stepper-animations';
import { MatStepperIcon } from './stepper-icon';
var MatStep = /** @class */ (function (_super) {
    tslib_1.__extends(MatStep, _super);
    /** @breaking-change 8.0.0 remove the `?` after `stepperOptions` */
    function MatStep(stepper, _errorStateMatcher, stepperOptions) {
        var _this = _super.call(this, stepper, stepperOptions) || this;
        _this._errorStateMatcher = _errorStateMatcher;
        return _this;
    }
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    MatStep.prototype.isErrorState = function (control, form) {
        var originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        var customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    };
    MatStep.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-step',
                    template: "<ng-template><ng-content></ng-content></ng-template>\n",
                    providers: [{ provide: ErrorStateMatcher, useExisting: MatStep }],
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matStep',
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    MatStep.ctorParameters = function () { return [
        { type: MatStepper, decorators: [{ type: Inject, args: [forwardRef(function () { return MatStepper; }),] }] },
        { type: ErrorStateMatcher, decorators: [{ type: SkipSelf }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [STEPPER_GLOBAL_OPTIONS,] }] }
    ]; };
    MatStep.propDecorators = {
        stepLabel: [{ type: ContentChild, args: [MatStepLabel, { static: false },] }]
    };
    return MatStep;
}(CdkStep));
export { MatStep };
var MatStepper = /** @class */ (function (_super) {
    tslib_1.__extends(MatStepper, _super);
    function MatStepper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Event emitted when the current step is done transitioning in. */
        _this.animationDone = new EventEmitter();
        /** Consumer-specified template-refs to be used to override the header icons. */
        _this._iconOverrides = {};
        /** Stream of animation `done` events when the body expands/collapses. */
        _this._animationDone = new Subject();
        return _this;
    }
    MatStepper.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._stepsArray = this.steps.toArray();
        this._icons.forEach(function (_a) {
            var name = _a.name, templateRef = _a.templateRef;
            return _this._iconOverrides[name] = templateRef;
        });
        // Mark the component for change detection whenever the content children query changes
        this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe(function () {
            _this._stepsArray = _this.steps.toArray();
            _this._stateChanged();
        });
        this._animationDone.pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged(function (x, y) { return x.fromState === y.fromState && x.toState === y.toState; }), takeUntil(this._destroyed)).subscribe(function (event) {
            if (event.toState === 'current') {
                _this.animationDone.emit();
            }
        });
    };
    MatStepper.decorators = [
        { type: Directive, args: [{ selector: '[matStepper]', providers: [{ provide: CdkStepper, useExisting: MatStepper }] },] }
    ];
    MatStepper.propDecorators = {
        _stepHeader: [{ type: ViewChildren, args: [MatStepHeader,] }],
        _steps: [{ type: ContentChildren, args: [MatStep,] }],
        _icons: [{ type: ContentChildren, args: [MatStepperIcon,] }],
        animationDone: [{ type: Output }],
        disableRipple: [{ type: Input }]
    };
    return MatStepper;
}(CdkStepper));
export { MatStepper };
var MatHorizontalStepper = /** @class */ (function (_super) {
    tslib_1.__extends(MatHorizontalStepper, _super);
    function MatHorizontalStepper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Whether the label should display in bottom or end position. */
        _this.labelPosition = 'end';
        return _this;
    }
    MatHorizontalStepper.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-horizontal-stepper',
                    exportAs: 'matHorizontalStepper',
                    template: "<div class=\"mat-horizontal-stepper-header-container\">\n  <ng-container *ngFor=\"let step of _stepsArray; let i = index; let isLast = last\">\n    <mat-step-header class=\"mat-horizontal-stepper-header\"\n                     (click)=\"step.select()\"\n                     (keydown)=\"_onKeydown($event)\"\n                     [tabIndex]=\"_getFocusIndex() === i ? 0 : -1\"\n                     [id]=\"_getStepLabelId(i)\"\n                     [attr.aria-posinset]=\"i + 1\"\n                     [attr.aria-setsize]=\"steps.length\"\n                     [attr.aria-controls]=\"_getStepContentId(i)\"\n                     [attr.aria-selected]=\"selectedIndex == i\"\n                     [attr.aria-label]=\"step.ariaLabel || null\"\n                     [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n                     [index]=\"i\"\n                     [state]=\"_getIndicatorType(i, step.state)\"\n                     [label]=\"step.stepLabel || step.label\"\n                     [selected]=\"selectedIndex === i\"\n                     [active]=\"step.completed || selectedIndex === i || !linear\"\n                     [optional]=\"step.optional\"\n                     [errorMessage]=\"step.errorMessage\"\n                     [iconOverrides]=\"_iconOverrides\"\n                     [disableRipple]=\"disableRipple\">\n    </mat-step-header>\n    <div *ngIf=\"!isLast\" class=\"mat-stepper-horizontal-line\"></div>\n  </ng-container>\n</div>\n\n<div class=\"mat-horizontal-content-container\">\n  <div *ngFor=\"let step of _stepsArray; let i = index\"\n       [attr.tabindex]=\"selectedIndex === i ? 0 : null\"\n       class=\"mat-horizontal-stepper-content\" role=\"tabpanel\"\n       [@stepTransition]=\"_getAnimationDirection(i)\"\n       (@stepTransition.done)=\"_animationDone.next($event)\"\n       [id]=\"_getStepContentId(i)\"\n       [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n       [attr.aria-expanded]=\"selectedIndex === i\">\n    <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n  </div>\n</div>\n",
                    inputs: ['selectedIndex'],
                    host: {
                        'class': 'mat-stepper-horizontal',
                        '[class.mat-stepper-label-position-end]': 'labelPosition == "end"',
                        '[class.mat-stepper-label-position-bottom]': 'labelPosition == "bottom"',
                        'aria-orientation': 'horizontal',
                        'role': 'tablist',
                    },
                    animations: [matStepperAnimations.horizontalStepTransition],
                    providers: [
                        { provide: MatStepper, useExisting: MatHorizontalStepper },
                        { provide: CdkStepper, useExisting: MatHorizontalStepper }
                    ],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:36px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;top:36px;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto;padding:24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                }] }
    ];
    MatHorizontalStepper.propDecorators = {
        labelPosition: [{ type: Input }]
    };
    return MatHorizontalStepper;
}(MatStepper));
export { MatHorizontalStepper };
var MatVerticalStepper = /** @class */ (function (_super) {
    tslib_1.__extends(MatVerticalStepper, _super);
    function MatVerticalStepper(dir, changeDetectorRef, 
    // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
    elementRef, _document) {
        var _this = _super.call(this, dir, changeDetectorRef, elementRef, _document) || this;
        _this._orientation = 'vertical';
        return _this;
    }
    MatVerticalStepper.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-vertical-stepper',
                    exportAs: 'matVerticalStepper',
                    template: "<div class=\"mat-step\" *ngFor=\"let step of _stepsArray; let i = index; let isLast = last\">\n  <mat-step-header class=\"mat-vertical-stepper-header\"\n                   (click)=\"step.select()\"\n                   (keydown)=\"_onKeydown($event)\"\n                   [tabIndex]=\"_getFocusIndex() == i ? 0 : -1\"\n                   [id]=\"_getStepLabelId(i)\"\n                   [attr.aria-posinset]=\"i + 1\"\n                   [attr.aria-setsize]=\"steps.length\"\n                   [attr.aria-controls]=\"_getStepContentId(i)\"\n                   [attr.aria-selected]=\"selectedIndex === i\"\n                   [attr.aria-label]=\"step.ariaLabel || null\"\n                   [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n                   [index]=\"i\"\n                   [state]=\"_getIndicatorType(i, step.state)\"\n                   [label]=\"step.stepLabel || step.label\"\n                   [selected]=\"selectedIndex === i\"\n                   [active]=\"step.completed || selectedIndex === i || !linear\"\n                   [optional]=\"step.optional\"\n                   [errorMessage]=\"step.errorMessage\"\n                   [iconOverrides]=\"_iconOverrides\"\n                   [disableRipple]=\"disableRipple\">\n  </mat-step-header>\n\n  <div class=\"mat-vertical-content-container\" [class.mat-stepper-vertical-line]=\"!isLast\">\n    <div class=\"mat-vertical-stepper-content\" role=\"tabpanel\"\n         [attr.tabindex]=\"selectedIndex === i ? 0 : null\"\n         [@stepTransition]=\"_getAnimationDirection(i)\"\n         (@stepTransition.done)=\"_animationDone.next($event)\"\n         [id]=\"_getStepContentId(i)\"\n         [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n         [attr.aria-expanded]=\"selectedIndex === i\">\n      <div class=\"mat-vertical-content\">\n        <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n",
                    inputs: ['selectedIndex'],
                    host: {
                        'class': 'mat-stepper-vertical',
                        'aria-orientation': 'vertical',
                        'role': 'tablist',
                    },
                    animations: [matStepperAnimations.verticalStepTransition],
                    providers: [
                        { provide: MatStepper, useExisting: MatVerticalStepper },
                        { provide: CdkStepper, useExisting: MatVerticalStepper }
                    ],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:36px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;top:36px;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto;padding:24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                }] }
    ];
    /** @nocollapse */
    MatVerticalStepper.ctorParameters = function () { return [
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    return MatVerticalStepper;
}(MatStepper));
export { MatVerticalStepper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFFVixzQkFBc0IsRUFFdkIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBRVIsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFELE9BQU8sRUFBQyxjQUFjLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFckU7SUFTNkIsbUNBQU87SUFJbEMsbUVBQW1FO0lBQ25FLGlCQUFrRCxPQUFtQixFQUNyQyxrQkFBcUMs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LHVCQTRLakIsUUFBUTtnQkFoS1gsaUJBQWlCO2dCQUtqQixVQUFVO2dEQStKUCxNQUFNLFNBQUMsUUFBUTs7SUFJcEIseUJBQUM7Q0FBQSxBQTlCRCxDQW9Cd0MsVUFBVSxHQVVqRDtTQVZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBDZGtTdGVwLFxuICBDZGtTdGVwcGVyLFxuICBTdGVwQ29udGVudFBvc2l0aW9uU3RhdGUsXG4gIFNURVBQRVJfR0xPQkFMX09QVElPTlMsXG4gIFN0ZXBwZXJPcHRpb25zXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRTdGVwSGVhZGVyfSBmcm9tICcuL3N0ZXAtaGVhZGVyJztcbmltcG9ydCB7TWF0U3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHttYXRTdGVwcGVyQW5pbWF0aW9uc30gZnJvbSAnLi9zdGVwcGVyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTdGVwcGVySWNvbiwgTWF0U3RlcHBlckljb25Db250ZXh0fSBmcm9tICcuL3N0ZXBwZXItaWNvbic7XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1zdGVwJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwLmh0bWwnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogRXJyb3JTdGF0ZU1hdGNoZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwfV0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0U3RlcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyIHtcbiAgLyoqIENvbnRlbnQgZm9yIHN0ZXAgbGFiZWwgZ2l2ZW4gYnkgYDxuZy10ZW1wbGF0ZSBtYXRTdGVwTGFiZWw+YC4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRTdGVwTGFiZWwsIHtzdGF0aWM6IGZhbHNlfSkgc3RlcExhYmVsOiBNYXRTdGVwTGFiZWw7XG5cbiAgLyoqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgcmVtb3ZlIHRoZSBgP2AgYWZ0ZXIgYHN0ZXBwZXJPcHRpb25zYCAqL1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0U3RlcHBlcikpIHN0ZXBwZXI6IE1hdFN0ZXBwZXIsXG4gICAgICAgICAgICAgIEBTa2lwU2VsZigpIHByaXZhdGUgX2Vycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChTVEVQUEVSX0dMT0JBTF9PUFRJT05TKSBzdGVwcGVyT3B0aW9ucz86IFN0ZXBwZXJPcHRpb25zKSB7XG4gICAgc3VwZXIoc3RlcHBlciwgc3RlcHBlck9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEN1c3RvbSBlcnJvciBzdGF0ZSBtYXRjaGVyIHRoYXQgYWRkaXRpb25hbGx5IGNoZWNrcyBmb3IgdmFsaWRpdHkgb2YgaW50ZXJhY3RlZCBmb3JtLiAqL1xuICBpc0Vycm9yU3RhdGUoY29udHJvbDogRm9ybUNvbnRyb2wgfCBudWxsLCBmb3JtOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBOZ0Zvcm0gfCBudWxsKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgb3JpZ2luYWxFcnJvclN0YXRlID0gdGhpcy5fZXJyb3JTdGF0ZU1hdGNoZXIuaXNFcnJvclN0YXRlKGNvbnRyb2wsIGZvcm0pO1xuXG4gICAgLy8gQ3VzdG9tIGVycm9yIHN0YXRlIGNoZWNrcyBmb3IgdGhlIHZhbGlkaXR5IG9mIGZvcm0gdGhhdCBpcyBub3Qgc3VibWl0dGVkIG9yIHRvdWNoZWRcbiAgICAvLyBzaW5jZSB1c2VyIGNhbiB0cmlnZ2VyIGEgZm9ybSBjaGFuZ2UgYnkgY2FsbGluZyBmb3IgYW5vdGhlciBzdGVwIHdpdGhvdXQgZGlyZWN0bHlcbiAgICAvLyBpbnRlcmFjdGluZyB3aXRoIHRoZSBjdXJyZW50IGZvcm0uXG4gICAgY29uc3QgY3VzdG9tRXJyb3JTdGF0ZSA9ICEhKGNvbnRyb2wgJiYgY29udHJvbC5pbnZhbGlkICYmIHRoaXMuaW50ZXJhY3RlZCk7XG5cbiAgICByZXR1cm4gb3JpZ2luYWxFcnJvclN0YXRlIHx8IGN1c3RvbUVycm9yU3RhdGU7XG4gIH1cbn1cblxuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1ttYXRTdGVwcGVyXScsIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0U3RlcHBlcn1dfSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyIGV4dGVuZHMgQ2RrU3RlcHBlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAvKiogVGhlIGxpc3Qgb2Ygc3RlcCBoZWFkZXJzIG9mIHRoZSBzdGVwcyBpbiB0aGUgc3RlcHBlci4gKi9cbiAgQFZpZXdDaGlsZHJlbihNYXRTdGVwSGVhZGVyKSBfc3RlcEhlYWRlcjogUXVlcnlMaXN0PE1hdFN0ZXBIZWFkZXI+O1xuXG4gIC8qKiBTdGVwcyB0aGF0IHRoZSBzdGVwcGVyIGhvbGRzLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXApIF9zdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+O1xuXG4gIC8qKiBDdXN0b20gaWNvbiBvdmVycmlkZXMgcGFzc2VkIGluIGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwcGVySWNvbikgX2ljb25zOiBRdWVyeUxpc3Q8TWF0U3RlcHBlckljb24+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGN1cnJlbnQgc3RlcCBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQgZm9yIHRoZSBzdGVwIGhlYWRlcnMuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIENvbnN1bWVyLXNwZWNpZmllZCB0ZW1wbGF0ZS1yZWZzIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGhlYWRlciBpY29ucy4gKi9cbiAgX2ljb25PdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+fSA9IHt9O1xuXG4gIC8qKiBTdHJlYW0gb2YgYW5pbWF0aW9uIGBkb25lYCBldmVudHMgd2hlbiB0aGUgYm9keSBleHBhbmRzL2NvbGxhcHNlcy4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3RlcHNBcnJheSA9IHRoaXMuc3RlcHMudG9BcnJheSgpO1xuICAgIHRoaXMuX2ljb25zLmZvckVhY2goKHtuYW1lLCB0ZW1wbGF0ZVJlZn0pID0+IHRoaXMuX2ljb25PdmVycmlkZXNbbmFtZV0gPSB0ZW1wbGF0ZVJlZik7XG5cbiAgICAvLyBNYXJrIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24gd2hlbmV2ZXIgdGhlIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkgY2hhbmdlc1xuICAgIHRoaXMuX3N0ZXBzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0ZXBzQXJyYXkgPSB0aGlzLnN0ZXBzLnRvQXJyYXkoKTtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5waXBlKFxuICAgICAgLy8gVGhpcyBuZWVkcyBhIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaW4gb3JkZXIgdG8gYXZvaWQgZW1pdHRpbmcgdGhlIHNhbWUgZXZlbnQgdHdpY2UgZHVlXG4gICAgICAvLyB0byBhIGJ1ZyBpbiBhbmltYXRpb25zIHdoZXJlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGdldHMgaW52b2tlZCB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKChldmVudC50b1N0YXRlIGFzIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSkgPT09ICdjdXJyZW50Jykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1ob3Jpem9udGFsLXN0ZXBwZXInLFxuICBleHBvcnRBczogJ21hdEhvcml6b250YWxTdGVwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLWhvcml6b250YWwuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzdGVwcGVyLmNzcyddLFxuICBpbnB1dHM6IFsnc2VsZWN0ZWRJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwcGVyLWhvcml6b250YWwnLFxuICAgICdbY2xhc3MubWF0LXN0ZXBwZXItbGFiZWwtcG9zaXRpb24tZW5kXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiZW5kXCInLFxuICAgICdbY2xhc3MubWF0LXN0ZXBwZXItbGFiZWwtcG9zaXRpb24tYm90dG9tXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiYm90dG9tXCInLFxuICAgICdhcmlhLW9yaWVudGF0aW9uJzogJ2hvcml6b250YWwnLFxuICAgICdyb2xlJzogJ3RhYmxpc3QnLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0U3RlcHBlckFuaW1hdGlvbnMuaG9yaXpvbnRhbFN0ZXBUcmFuc2l0aW9uXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdFN0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRIb3Jpem9udGFsU3RlcHBlcn0sXG4gICAge3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRIb3Jpem9udGFsU3RlcHBlcn1cbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEhvcml6b250YWxTdGVwcGVyIGV4dGVuZHMgTWF0U3RlcHBlciB7XG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgZGlzcGxheSBpbiBib3R0b20gb3IgZW5kIHBvc2l0aW9uLiAqL1xuICBASW5wdXQoKVxuICBsYWJlbFBvc2l0aW9uOiAnYm90dG9tJyB8ICdlbmQnID0gJ2VuZCc7XG59XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC12ZXJ0aWNhbC1zdGVwcGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRWZXJ0aWNhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItdmVydGljYWwuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzdGVwcGVyLmNzcyddLFxuICBpbnB1dHM6IFsnc2VsZWN0ZWRJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwcGVyLXZlcnRpY2FsJyxcbiAgICAnYXJpYS1vcmllbnRhdGlvbic6ICd2ZXJ0aWNhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy52ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdFN0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRWZXJ0aWNhbFN0ZXBwZXJ9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0VmVydGljYWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VmVydGljYWxTdGVwcGVyIGV4dGVuZHMgTWF0U3RlcHBlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYGVsZW1lbnRSZWZgIGFuZCBgX2RvY3VtZW50YCBwYXJhbWV0ZXJzIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICBlbGVtZW50UmVmPzogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoZGlyLCBjaGFuZ2VEZXRlY3RvclJlZiwgZWxlbWVudFJlZiwgX2RvY3VtZW50KTtcbiAgICB0aGlzLl9vcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gIH1cbn1cbiJdfQ==