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
        this._icons.forEach(function (_a) {
            var name = _a.name, templateRef = _a.templateRef;
            return _this._iconOverrides[name] = templateRef;
        });
        // Mark the component for change detection whenever the content children query changes
        this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe(function () { return _this._stateChanged(); });
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
                    template: "<div class=\"mat-horizontal-stepper-header-container\">\n  <ng-container *ngFor=\"let step of steps; let i = index; let isLast = last\">\n    <mat-step-header class=\"mat-horizontal-stepper-header\"\n                     (click)=\"step.select()\"\n                     (keydown)=\"_onKeydown($event)\"\n                     [tabIndex]=\"_getFocusIndex() === i ? 0 : -1\"\n                     [id]=\"_getStepLabelId(i)\"\n                     [attr.aria-posinset]=\"i + 1\"\n                     [attr.aria-setsize]=\"steps.length\"\n                     [attr.aria-controls]=\"_getStepContentId(i)\"\n                     [attr.aria-selected]=\"selectedIndex == i\"\n                     [attr.aria-label]=\"step.ariaLabel || null\"\n                     [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n                     [index]=\"i\"\n                     [state]=\"_getIndicatorType(i, step.state)\"\n                     [label]=\"step.stepLabel || step.label\"\n                     [selected]=\"selectedIndex === i\"\n                     [active]=\"step.completed || selectedIndex === i || !linear\"\n                     [optional]=\"step.optional\"\n                     [errorMessage]=\"step.errorMessage\"\n                     [iconOverrides]=\"_iconOverrides\"\n                     [disableRipple]=\"disableRipple\">\n    </mat-step-header>\n    <div *ngIf=\"!isLast\" class=\"mat-stepper-horizontal-line\"></div>\n  </ng-container>\n</div>\n\n<div class=\"mat-horizontal-content-container\">\n  <div *ngFor=\"let step of steps; let i = index\"\n       [attr.tabindex]=\"selectedIndex === i ? 0 : null\"\n       class=\"mat-horizontal-stepper-content\" role=\"tabpanel\"\n       [@stepTransition]=\"_getAnimationDirection(i)\"\n       (@stepTransition.done)=\"_animationDone.next($event)\"\n       [id]=\"_getStepContentId(i)\"\n       [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n       [attr.aria-expanded]=\"selectedIndex === i\">\n    <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n  </div>\n</div>\n",
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
                    template: "<div class=\"mat-step\" *ngFor=\"let step of steps; let i = index; let isLast = last\">\n  <mat-step-header class=\"mat-vertical-stepper-header\"\n                   (click)=\"step.select()\"\n                   (keydown)=\"_onKeydown($event)\"\n                   [tabIndex]=\"_getFocusIndex() == i ? 0 : -1\"\n                   [id]=\"_getStepLabelId(i)\"\n                   [attr.aria-posinset]=\"i + 1\"\n                   [attr.aria-setsize]=\"steps.length\"\n                   [attr.aria-controls]=\"_getStepContentId(i)\"\n                   [attr.aria-selected]=\"selectedIndex === i\"\n                   [attr.aria-label]=\"step.ariaLabel || null\"\n                   [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n                   [index]=\"i\"\n                   [state]=\"_getIndicatorType(i, step.state)\"\n                   [label]=\"step.stepLabel || step.label\"\n                   [selected]=\"selectedIndex === i\"\n                   [active]=\"step.completed || selectedIndex === i || !linear\"\n                   [optional]=\"step.optional\"\n                   [errorMessage]=\"step.errorMessage\"\n                   [iconOverrides]=\"_iconOverrides\"\n                   [disableRipple]=\"disableRipple\">\n  </mat-step-header>\n\n  <div class=\"mat-vertical-content-container\" [class.mat-stepper-vertical-line]=\"!isLast\">\n    <div class=\"mat-vertical-stepper-content\" role=\"tabpanel\"\n         [attr.tabindex]=\"selectedIndex === i ? 0 : null\"\n         [@stepTransition]=\"_getAnimationDirection(i)\"\n         (@stepTransition.done)=\"_animationDone.next($event)\"\n         [id]=\"_getStepContentId(i)\"\n         [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n         [attr.aria-expanded]=\"selectedIndex === i\">\n      <div class=\"mat-vertical-content\">\n        <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n      </div>\n    </div>\n  </div>\n</div>\n",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFFVixzQkFBc0IsRUFFdkIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBRVIsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFELE9BQU8sRUFBQyxjQUFjLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFckU7SUFTNkIsbUNBQU87SUFJbEMsbUVBQW1FO0lBQ25FLGlCQUFrRCxPQUFtQixFQUNyQyxrQkFBcUMs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cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENka1N0ZXAsXG4gIENka1N0ZXBwZXIsXG4gIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSxcbiAgU1RFUFBFUl9HTE9CQUxfT1BUSU9OUyxcbiAgU3RlcHBlck9wdGlvbnNcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdFN0ZXBIZWFkZXJ9IGZyb20gJy4vc3RlcC1oZWFkZXInO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge21hdFN0ZXBwZXJBbmltYXRpb25zfSBmcm9tICcuL3N0ZXBwZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uLCBNYXRTdGVwcGVySWNvbkNvbnRleHR9IGZyb20gJy4vc3RlcHBlci1pY29uJztcblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LXN0ZXAnLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAuaHRtbCcsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBFcnJvclN0YXRlTWF0Y2hlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXB9XSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRTdGVwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXAgZXh0ZW5kcyBDZGtTdGVwIGltcGxlbWVudHMgRXJyb3JTdGF0ZU1hdGNoZXIge1xuICAvKiogQ29udGVudCBmb3Igc3RlcCBsYWJlbCBnaXZlbiBieSBgPG5nLXRlbXBsYXRlIG1hdFN0ZXBMYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1hdFN0ZXBMYWJlbCwge3N0YXRpYzogZmFsc2V9KSBzdGVwTGFiZWw6IE1hdFN0ZXBMYWJlbDtcblxuICAvKiogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgdGhlIGA/YCBhZnRlciBgc3RlcHBlck9wdGlvbnNgICovXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTdGVwcGVyKSkgc3RlcHBlcjogTWF0U3RlcHBlcixcbiAgICAgICAgICAgICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBfZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFNURVBQRVJfR0xPQkFMX09QVElPTlMpIHN0ZXBwZXJPcHRpb25zPzogU3RlcHBlck9wdGlvbnMpIHtcbiAgICBzdXBlcihzdGVwcGVyLCBzdGVwcGVyT3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ3VzdG9tIGVycm9yIHN0YXRlIG1hdGNoZXIgdGhhdCBhZGRpdGlvbmFsbHkgY2hlY2tzIGZvciB2YWxpZGl0eSBvZiBpbnRlcmFjdGVkIGZvcm0uICovXG4gIGlzRXJyb3JTdGF0ZShjb250cm9sOiBGb3JtQ29udHJvbCB8IG51bGwsIGZvcm06IEZvcm1Hcm91cERpcmVjdGl2ZSB8IE5nRm9ybSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBjb25zdCBvcmlnaW5hbEVycm9yU3RhdGUgPSB0aGlzLl9lcnJvclN0YXRlTWF0Y2hlci5pc0Vycm9yU3RhdGUoY29udHJvbCwgZm9ybSk7XG5cbiAgICAvLyBDdXN0b20gZXJyb3Igc3RhdGUgY2hlY2tzIGZvciB0aGUgdmFsaWRpdHkgb2YgZm9ybSB0aGF0IGlzIG5vdCBzdWJtaXR0ZWQgb3IgdG91Y2hlZFxuICAgIC8vIHNpbmNlIHVzZXIgY2FuIHRyaWdnZXIgYSBmb3JtIGNoYW5nZSBieSBjYWxsaW5nIGZvciBhbm90aGVyIHN0ZXAgd2l0aG91dCBkaXJlY3RseVxuICAgIC8vIGludGVyYWN0aW5nIHdpdGggdGhlIGN1cnJlbnQgZm9ybS5cbiAgICBjb25zdCBjdXN0b21FcnJvclN0YXRlID0gISEoY29udHJvbCAmJiBjb250cm9sLmludmFsaWQgJiYgdGhpcy5pbnRlcmFjdGVkKTtcblxuICAgIHJldHVybiBvcmlnaW5hbEVycm9yU3RhdGUgfHwgY3VzdG9tRXJyb3JTdGF0ZTtcbiAgfVxufVxuXG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW21hdFN0ZXBwZXJdJywgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwcGVyfV19KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXIgZXh0ZW5kcyBDZGtTdGVwcGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKiBUaGUgbGlzdCBvZiBzdGVwIGhlYWRlcnMgb2YgdGhlIHN0ZXBzIGluIHRoZSBzdGVwcGVyLiAqL1xuICBAVmlld0NoaWxkcmVuKE1hdFN0ZXBIZWFkZXIpIF9zdGVwSGVhZGVyOiBRdWVyeUxpc3Q8TWF0U3RlcEhlYWRlcj47XG5cbiAgLyoqIFN0ZXBzIHRoYXQgdGhlIHN0ZXBwZXIgaG9sZHMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0U3RlcCkgX3N0ZXBzOiBRdWVyeUxpc3Q8TWF0U3RlcD47XG5cbiAgLyoqIEN1c3RvbSBpY29uIG92ZXJyaWRlcyBwYXNzZWQgaW4gYnkgdGhlIGNvbnN1bWVyLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXBwZXJJY29uKSBfaWNvbnM6IFF1ZXJ5TGlzdDxNYXRTdGVwcGVySWNvbj47XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY3VycmVudCBzdGVwIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbi4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZCBmb3IgdGhlIHN0ZXAgaGVhZGVycy4gKi9cbiAgQElucHV0KCkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogQ29uc3VtZXItc3BlY2lmaWVkIHRlbXBsYXRlLXJlZnMgdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgaGVhZGVyIGljb25zLiAqL1xuICBfaWNvbk92ZXJyaWRlczoge1trZXk6IHN0cmluZ106IFRlbXBsYXRlUmVmPE1hdFN0ZXBwZXJJY29uQ29udGV4dD59ID0ge307XG5cbiAgLyoqIFN0cmVhbSBvZiBhbmltYXRpb24gYGRvbmVgIGV2ZW50cyB3aGVuIHRoZSBib2R5IGV4cGFuZHMvY29sbGFwc2VzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pY29ucy5mb3JFYWNoKCh7bmFtZSwgdGVtcGxhdGVSZWZ9KSA9PiB0aGlzLl9pY29uT3ZlcnJpZGVzW25hbWVdID0gdGVtcGxhdGVSZWYpO1xuXG4gICAgLy8gTWFyayB0aGUgY29tcG9uZW50IGZvciBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW5ldmVyIHRoZSBjb250ZW50IGNoaWxkcmVuIHF1ZXJ5IGNoYW5nZXNcbiAgICB0aGlzLl9zdGVwcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9zdGF0ZUNoYW5nZWQoKSk7XG5cbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLnBpcGUoXG4gICAgICAvLyBUaGlzIG5lZWRzIGEgYGRpc3RpbmN0VW50aWxDaGFuZ2VkYCBpbiBvcmRlciB0byBhdm9pZCBlbWl0dGluZyB0aGUgc2FtZSBldmVudCB0d2ljZSBkdWVcbiAgICAgIC8vIHRvIGEgYnVnIGluIGFuaW1hdGlvbnMgd2hlcmUgdGhlIGAuZG9uZWAgY2FsbGJhY2sgZ2V0cyBpbnZva2VkIHR3aWNlIG9uIHNvbWUgYnJvd3NlcnMuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB4LmZyb21TdGF0ZSA9PT0geS5mcm9tU3RhdGUgJiYgeC50b1N0YXRlID09PSB5LnRvU3RhdGUpLFxuICAgICAgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZClcbiAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoKGV2ZW50LnRvU3RhdGUgYXMgU3RlcENvbnRlbnRQb3NpdGlvblN0YXRlKSA9PT0gJ2N1cnJlbnQnKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRG9uZS5lbWl0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWhvcml6b250YWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0SG9yaXpvbnRhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItaG9yaXpvbnRhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItaG9yaXpvbnRhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1lbmRdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1ib3R0b21dJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJib3R0b21cIicsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAnaG9yaXpvbnRhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy5ob3Jpem9udGFsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SG9yaXpvbnRhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBkaXNwbGF5IGluIGJvdHRvbSBvciBlbmQgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGxhYmVsUG9zaXRpb246ICdib3R0b20nIHwgJ2VuZCcgPSAnZW5kJztcbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LXZlcnRpY2FsLXN0ZXBwZXInLFxuICBleHBvcnRBczogJ21hdFZlcnRpY2FsU3RlcHBlcicsXG4gIHRlbXBsYXRlVXJsOiAnc3RlcHBlci12ZXJ0aWNhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItdmVydGljYWwnLFxuICAgICdhcmlhLW9yaWVudGF0aW9uJzogJ3ZlcnRpY2FsJyxcbiAgICAncm9sZSc6ICd0YWJsaXN0JyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdFN0ZXBwZXJBbmltYXRpb25zLnZlcnRpY2FsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFZlcnRpY2FsU3RlcHBlcn0sXG4gICAge3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRWZXJ0aWNhbFN0ZXBwZXJ9XG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRWZXJ0aWNhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgZWxlbWVudFJlZmAgYW5kIGBfZG9jdW1lbnRgIHBhcmFtZXRlcnMgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgIGVsZW1lbnRSZWY/OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICBzdXBlcihkaXIsIGNoYW5nZURldGVjdG9yUmVmLCBlbGVtZW50UmVmLCBfZG9jdW1lbnQpO1xuICAgIHRoaXMuX29yaWVudGF0aW9uID0gJ3ZlcnRpY2FsJztcbiAgfVxufVxuIl19