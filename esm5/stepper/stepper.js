/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
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
    __extends(MatStep, _super);
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
                    providers: [
                        { provide: ErrorStateMatcher, useExisting: MatStep },
                        { provide: CdkStep, useExisting: MatStep },
                    ],
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
        stepLabel: [{ type: ContentChild, args: [MatStepLabel,] }]
    };
    return MatStep;
}(CdkStep));
export { MatStep };
var MatStepper = /** @class */ (function (_super) {
    __extends(MatStepper, _super);
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
        _steps: [{ type: ContentChildren, args: [MatStep, { descendants: true },] }],
        _icons: [{ type: ContentChildren, args: [MatStepperIcon, { descendants: true },] }],
        animationDone: [{ type: Output }],
        disableRipple: [{ type: Input }]
    };
    return MatStepper;
}(CdkStepper));
export { MatStepper };
var MatHorizontalStepper = /** @class */ (function (_super) {
    __extends(MatHorizontalStepper, _super);
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
    __extends(MatVerticalStepper, _super);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFFVixzQkFBc0IsRUFFdkIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBRVIsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFELE9BQU8sRUFBQyxjQUFjLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFckU7SUFZNkIsMkJBQU87SUFJbEMsbUVBQW1FO0lBQ25FLGlCQUFrRCxPQUFtQixFQUNyQyxrQkFBcUMs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LGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQS9MTyxjQUFjLHVCQWtNakIsUUFBUTtnQkF0TFgsaUJBQWlCO2dCQUtqQixVQUFVO2dEQXFMUCxNQUFNLFNBQUMsUUFBUTs7SUFXcEIseUJBQUM7Q0FBQSxBQXJDRCxDQW9Cd0MsVUFBVSxHQWlCakQ7U0FqQlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENka1N0ZXAsXG4gIENka1N0ZXBwZXIsXG4gIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSxcbiAgU1RFUFBFUl9HTE9CQUxfT1BUSU9OUyxcbiAgU3RlcHBlck9wdGlvbnNcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdFN0ZXBIZWFkZXJ9IGZyb20gJy4vc3RlcC1oZWFkZXInO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge21hdFN0ZXBwZXJBbmltYXRpb25zfSBmcm9tICcuL3N0ZXBwZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uLCBNYXRTdGVwcGVySWNvbkNvbnRleHR9IGZyb20gJy4vc3RlcHBlci1pY29uJztcblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LXN0ZXAnLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBFcnJvclN0YXRlTWF0Y2hlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXB9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwLCB1c2VFeGlzdGluZzogTWF0U3RlcH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0U3RlcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyIHtcbiAgLyoqIENvbnRlbnQgZm9yIHN0ZXAgbGFiZWwgZ2l2ZW4gYnkgYDxuZy10ZW1wbGF0ZSBtYXRTdGVwTGFiZWw+YC4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRTdGVwTGFiZWwpIHN0ZXBMYWJlbDogTWF0U3RlcExhYmVsO1xuXG4gIC8qKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSB0aGUgYD9gIGFmdGVyIGBzdGVwcGVyT3B0aW9uc2AgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFN0ZXBwZXIpKSBzdGVwcGVyOiBNYXRTdGVwcGVyLFxuICAgICAgICAgICAgICBAU2tpcFNlbGYoKSBwcml2YXRlIF9lcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoU1RFUFBFUl9HTE9CQUxfT1BUSU9OUykgc3RlcHBlck9wdGlvbnM/OiBTdGVwcGVyT3B0aW9ucykge1xuICAgIHN1cGVyKHN0ZXBwZXIsIHN0ZXBwZXJPcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDdXN0b20gZXJyb3Igc3RhdGUgbWF0Y2hlciB0aGF0IGFkZGl0aW9uYWxseSBjaGVja3MgZm9yIHZhbGlkaXR5IG9mIGludGVyYWN0ZWQgZm9ybS4gKi9cbiAgaXNFcnJvclN0YXRlKGNvbnRyb2w6IEZvcm1Db250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRXJyb3JTdGF0ZSA9IHRoaXMuX2Vycm9yU3RhdGVNYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBmb3JtKTtcblxuICAgIC8vIEN1c3RvbSBlcnJvciBzdGF0ZSBjaGVja3MgZm9yIHRoZSB2YWxpZGl0eSBvZiBmb3JtIHRoYXQgaXMgbm90IHN1Ym1pdHRlZCBvciB0b3VjaGVkXG4gICAgLy8gc2luY2UgdXNlciBjYW4gdHJpZ2dlciBhIGZvcm0gY2hhbmdlIGJ5IGNhbGxpbmcgZm9yIGFub3RoZXIgc3RlcCB3aXRob3V0IGRpcmVjdGx5XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY3VycmVudCBmb3JtLlxuICAgIGNvbnN0IGN1c3RvbUVycm9yU3RhdGUgPSAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiB0aGlzLmludGVyYWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyb3JTdGF0ZSB8fCBjdXN0b21FcnJvclN0YXRlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogYm9vbGVhbiB8IHN0cmluZztcbn1cblxuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1ttYXRTdGVwcGVyXScsIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0U3RlcHBlcn1dfSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyIGV4dGVuZHMgQ2RrU3RlcHBlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAvKiogVGhlIGxpc3Qgb2Ygc3RlcCBoZWFkZXJzIG9mIHRoZSBzdGVwcyBpbiB0aGUgc3RlcHBlci4gKi9cbiAgQFZpZXdDaGlsZHJlbihNYXRTdGVwSGVhZGVyKSBfc3RlcEhlYWRlcjogUXVlcnlMaXN0PE1hdFN0ZXBIZWFkZXI+O1xuXG4gIC8qKiBTdGVwcyB0aGF0IHRoZSBzdGVwcGVyIGhvbGRzLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9zdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+O1xuXG4gIC8qKiBDdXN0b20gaWNvbiBvdmVycmlkZXMgcGFzc2VkIGluIGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwcGVySWNvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2ljb25zOiBRdWVyeUxpc3Q8TWF0U3RlcHBlckljb24+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGN1cnJlbnQgc3RlcCBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQgZm9yIHRoZSBzdGVwIGhlYWRlcnMuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIENvbnN1bWVyLXNwZWNpZmllZCB0ZW1wbGF0ZS1yZWZzIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGhlYWRlciBpY29ucy4gKi9cbiAgX2ljb25PdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+fSA9IHt9O1xuXG4gIC8qKiBTdHJlYW0gb2YgYW5pbWF0aW9uIGBkb25lYCBldmVudHMgd2hlbiB0aGUgYm9keSBleHBhbmRzL2NvbGxhcHNlcy4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3RlcHNBcnJheSA9IHRoaXMuc3RlcHMudG9BcnJheSgpO1xuICAgIHRoaXMuX2ljb25zLmZvckVhY2goKHtuYW1lLCB0ZW1wbGF0ZVJlZn0pID0+IHRoaXMuX2ljb25PdmVycmlkZXNbbmFtZV0gPSB0ZW1wbGF0ZVJlZik7XG5cbiAgICAvLyBNYXJrIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24gd2hlbmV2ZXIgdGhlIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkgY2hhbmdlc1xuICAgIHRoaXMuX3N0ZXBzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0ZXBzQXJyYXkgPSB0aGlzLnN0ZXBzLnRvQXJyYXkoKTtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5waXBlKFxuICAgICAgLy8gVGhpcyBuZWVkcyBhIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaW4gb3JkZXIgdG8gYXZvaWQgZW1pdHRpbmcgdGhlIHNhbWUgZXZlbnQgdHdpY2UgZHVlXG4gICAgICAvLyB0byBhIGJ1ZyBpbiBhbmltYXRpb25zIHdoZXJlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGdldHMgaW52b2tlZCB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKChldmVudC50b1N0YXRlIGFzIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSkgPT09ICdjdXJyZW50Jykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNFcnJvcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xpbmVhcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IHN0cmluZztcbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWhvcml6b250YWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0SG9yaXpvbnRhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItaG9yaXpvbnRhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItaG9yaXpvbnRhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1lbmRdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1ib3R0b21dJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJib3R0b21cIicsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAnaG9yaXpvbnRhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy5ob3Jpem9udGFsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SG9yaXpvbnRhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBkaXNwbGF5IGluIGJvdHRvbSBvciBlbmQgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGxhYmVsUG9zaXRpb246ICdib3R0b20nIHwgJ2VuZCcgPSAnZW5kJztcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZWRpdGFibGU6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0Vycm9yOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbGluZWFyOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtdmVydGljYWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0VmVydGljYWxTdGVwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLXZlcnRpY2FsLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcHBlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RlcHBlci12ZXJ0aWNhbCcsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAndmVydGljYWwnLFxuICAgICdyb2xlJzogJ3RhYmxpc3QnLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0U3RlcHBlckFuaW1hdGlvbnMudmVydGljYWxTdGVwVHJhbnNpdGlvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0VmVydGljYWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFZlcnRpY2FsU3RlcHBlcn1cbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFZlcnRpY2FsU3RlcHBlciBleHRlbmRzIE1hdFN0ZXBwZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBlbGVtZW50UmVmYCBhbmQgYF9kb2N1bWVudGAgcGFyYW1ldGVycyB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgZWxlbWVudFJlZj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGRpciwgY2hhbmdlRGV0ZWN0b3JSZWYsIGVsZW1lbnRSZWYsIF9kb2N1bWVudCk7XG4gICAgdGhpcy5fb3JpZW50YXRpb24gPSAndmVydGljYWwnO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNFcnJvcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xpbmVhcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IHN0cmluZztcbn1cbiJdfQ==