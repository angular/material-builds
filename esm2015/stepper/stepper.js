/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
export class MatStep extends CdkStep {
    /**
     * \@breaking-change 8.0.0 remove the `?` after `stepperOptions`
     * @param {?} stepper
     * @param {?} _errorStateMatcher
     * @param {?=} stepperOptions
     */
    constructor(stepper, _errorStateMatcher, stepperOptions) {
        super(stepper, stepperOptions);
        this._errorStateMatcher = _errorStateMatcher;
    }
    /**
     * Custom error state matcher that additionally checks for validity of interacted form.
     * @param {?} control
     * @param {?} form
     * @return {?}
     */
    isErrorState(control, form) {
        /** @type {?} */
        const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
        // Custom error state checks for the validity of form that is not submitted or touched
        // since user can trigger a form change by calling for another step without directly
        // interacting with the current form.
        /** @type {?} */
        const customErrorState = !!(control && control.invalid && this.interacted);
        return originalErrorState || customErrorState;
    }
}
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
MatStep.ctorParameters = () => [
    { type: MatStepper, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatStepper)),] }] },
    { type: ErrorStateMatcher, decorators: [{ type: SkipSelf }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [STEPPER_GLOBAL_OPTIONS,] }] }
];
MatStep.propDecorators = {
    stepLabel: [{ type: ContentChild, args: [MatStepLabel,] }]
};
if (false) {
    /** @type {?} */
    MatStep.ngAcceptInputType_editable;
    /** @type {?} */
    MatStep.ngAcceptInputType_hasError;
    /** @type {?} */
    MatStep.ngAcceptInputType_optional;
    /** @type {?} */
    MatStep.ngAcceptInputType_completed;
    /**
     * Content for step label given by `<ng-template matStepLabel>`.
     * @type {?}
     */
    MatStep.prototype.stepLabel;
    /**
     * @type {?}
     * @private
     */
    MatStep.prototype._errorStateMatcher;
}
export class MatStepper extends CdkStepper {
    constructor() {
        super(...arguments);
        /**
         * Event emitted when the current step is done transitioning in.
         */
        this.animationDone = new EventEmitter();
        /**
         * Consumer-specified template-refs to be used to override the header icons.
         */
        this._iconOverrides = {};
        /**
         * Stream of animation `done` events when the body expands/collapses.
         */
        this._animationDone = new Subject();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._stepsArray = this.steps.toArray();
        this._icons.forEach((/**
         * @param {?} __0
         * @return {?}
         */
        ({ name, templateRef }) => this._iconOverrides[name] = templateRef));
        // Mark the component for change detection whenever the content children query changes
        this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @return {?}
         */
        () => {
            this._stepsArray = this.steps.toArray();
            this._stateChanged();
        }));
        this._animationDone.pipe(
        // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
        // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
        // See https://github.com/angular/angular/issues/24084
        distinctUntilChanged((/**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        (x, y) => x.fromState === y.fromState && x.toState === y.toState)), takeUntil(this._destroyed)).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (((/** @type {?} */ (event.toState))) === 'current') {
                this.animationDone.emit();
            }
        }));
    }
}
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
if (false) {
    /** @type {?} */
    MatStepper.ngAcceptInputType_editable;
    /** @type {?} */
    MatStepper.ngAcceptInputType_optional;
    /** @type {?} */
    MatStepper.ngAcceptInputType_completed;
    /** @type {?} */
    MatStepper.ngAcceptInputType_hasError;
    /** @type {?} */
    MatStepper.ngAcceptInputType_linear;
    /** @type {?} */
    MatStepper.ngAcceptInputType_selectedIndex;
    /**
     * The list of step headers of the steps in the stepper.
     * @type {?}
     */
    MatStepper.prototype._stepHeader;
    /**
     * Steps that the stepper holds.
     * @type {?}
     */
    MatStepper.prototype._steps;
    /**
     * Custom icon overrides passed in by the consumer.
     * @type {?}
     */
    MatStepper.prototype._icons;
    /**
     * Event emitted when the current step is done transitioning in.
     * @type {?}
     */
    MatStepper.prototype.animationDone;
    /**
     * Whether ripples should be disabled for the step headers.
     * @type {?}
     */
    MatStepper.prototype.disableRipple;
    /**
     * Consumer-specified template-refs to be used to override the header icons.
     * @type {?}
     */
    MatStepper.prototype._iconOverrides;
    /**
     * Stream of animation `done` events when the body expands/collapses.
     * @type {?}
     */
    MatStepper.prototype._animationDone;
}
export class MatHorizontalStepper extends MatStepper {
    constructor() {
        super(...arguments);
        /**
         * Whether the label should display in bottom or end position.
         */
        this.labelPosition = 'end';
    }
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
if (false) {
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_editable;
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_optional;
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_completed;
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_hasError;
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_linear;
    /** @type {?} */
    MatHorizontalStepper.ngAcceptInputType_selectedIndex;
    /**
     * Whether the label should display in bottom or end position.
     * @type {?}
     */
    MatHorizontalStepper.prototype.labelPosition;
}
export class MatVerticalStepper extends MatStepper {
    /**
     * @param {?} dir
     * @param {?} changeDetectorRef
     * @param {?=} elementRef
     * @param {?=} _document
     */
    constructor(dir, changeDetectorRef, 
    // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
    elementRef, _document) {
        super(dir, changeDetectorRef, elementRef, _document);
        this._orientation = 'vertical';
    }
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
MatVerticalStepper.ctorParameters = () => [
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
if (false) {
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_editable;
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_optional;
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_completed;
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_hasError;
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_linear;
    /** @type {?} */
    MatVerticalStepper.ngAcceptInputType_selectedIndex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBRVYsc0JBQXNCLEVBRXZCLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsUUFBUSxFQUVSLFlBQVksRUFDWixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsY0FBYyxFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBV3JFLE1BQU0sT0FBTyxPQUFRLFNBQVEsT0FBTzs7Ozs7OztJQUtsQyxZQUFrRCxPQUFtQixFQUNyQyxrQkFBcUMsRUFDYixjQUErQjtRQUNyRixLQUFLLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRkQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtJQUdyRSxDQUFDOzs7Ozs7O0lBR0QsWUFBWSxDQUFDLE9BQTJCLEVBQUUsSUFBd0M7O2NBQzFFLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQzs7Ozs7Y0FLeEUsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUUxRSxPQUFPLGtCQUFrQixJQUFJLGdCQUFnQixDQUFDO0lBQ2hELENBQUM7OztZQTlCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsa0VBQXdCO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDLENBQUM7Z0JBQy9ELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsU0FBUztnQkFDbkIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7Ozs7WUFNNEQsVUFBVSx1QkFBeEQsTUFBTSxTQUFDLFVBQVU7OztvQkFBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7WUF2QjFDLGlCQUFpQix1QkF3QlYsUUFBUTs0Q0FDUixRQUFRLFlBQUksTUFBTSxTQUFDLHNCQUFzQjs7O3dCQUxyRCxZQUFZLFNBQUMsWUFBWTs7OztJQXFCMUIsbUNBQW9EOztJQUNwRCxtQ0FBb0Q7O0lBQ3BELG1DQUFvRDs7SUFDcEQsb0NBQXFEOzs7OztJQXhCckQsNEJBQW9EOzs7OztJQUl4QyxxQ0FBeUQ7O0FBeUJ2RSxNQUFNLE9BQU8sVUFBVyxTQUFRLFVBQVU7SUFEMUM7Ozs7O1FBWXFCLGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7Ozs7UUFNaEYsbUJBQWMsR0FBd0QsRUFBRSxDQUFDOzs7O1FBR3pFLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7SUErQmpELENBQUM7Ozs7SUE3QkMsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsRUFBQyxDQUFDO1FBRXRGLHNGQUFzRjtRQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRTtZQUNsRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsRUFBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJO1FBQ3RCLDBGQUEwRjtRQUMxRix5RkFBeUY7UUFDekYsc0RBQXNEO1FBQ3RELG9CQUFvQjs7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUMsRUFDdEYsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDM0IsQ0FBQyxTQUFTOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLG1CQUFBLEtBQUssQ0FBQyxPQUFPLEVBQTRCLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzdELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0I7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7OztZQTVDRixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFBQzs7OzBCQUcvRixZQUFZLFNBQUMsYUFBYTtxQkFHMUIsZUFBZSxTQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7cUJBRzVDLGVBQWUsU0FBQyxjQUFjLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQUduRCxNQUFNOzRCQUdOLEtBQUs7Ozs7SUErQk4sc0NBQW9EOztJQUNwRCxzQ0FBb0Q7O0lBQ3BELHVDQUFxRDs7SUFDckQsc0NBQW9EOztJQUNwRCxvQ0FBa0Q7O0lBQ2xELDJDQUF3RDs7Ozs7SUFoRHhELGlDQUFtRTs7Ozs7SUFHbkUsNEJBQTBFOzs7OztJQUcxRSw0QkFBd0Y7Ozs7O0lBR3hGLG1DQUFnRjs7Ozs7SUFHaEYsbUNBQWdDOzs7OztJQUdoQyxvQ0FBeUU7Ozs7O0lBR3pFLG9DQUErQzs7QUF1RGpELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxVQUFVO0lBdEJwRDs7Ozs7UUF5QkUsa0JBQWEsR0FBcUIsS0FBSyxDQUFDO0lBUTFDLENBQUM7OztZQWpDQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxxa0VBQXNDO2dCQUV0QyxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQ3pCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyx3Q0FBd0MsRUFBRSx3QkFBd0I7b0JBQ2xFLDJDQUEyQyxFQUFFLDJCQUEyQjtvQkFDeEUsa0JBQWtCLEVBQUUsWUFBWTtvQkFDaEMsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2dCQUNELFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDO2dCQUMzRCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBQztvQkFDeEQsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBQztpQkFDekQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OzRCQUdFLEtBQUs7Ozs7SUFHTixnREFBb0Q7O0lBQ3BELGdEQUFvRDs7SUFDcEQsaURBQXFEOztJQUNyRCxnREFBb0Q7O0lBQ3BELDhDQUFrRDs7SUFDbEQscURBQXdEOzs7OztJQVJ4RCw2Q0FDd0M7O0FBOEIxQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsVUFBVTs7Ozs7OztJQUNoRCxZQUNjLEdBQW1CLEVBQy9CLGlCQUFvQztJQUNwQyxxRkFBcUY7SUFDckYsVUFBb0MsRUFDbEIsU0FBZTtRQUNqQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQztJQUNqQyxDQUFDOzs7WUE3QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsODhEQUFvQztnQkFFcEMsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUN6QixJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLHNCQUFzQjtvQkFDL0Isa0JBQWtCLEVBQUUsVUFBVTtvQkFDOUIsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2dCQUNELFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLHNCQUFzQixDQUFDO2dCQUN6RCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQztvQkFDdEQsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQztpQkFDdkQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQTVMTyxjQUFjLHVCQStMakIsUUFBUTtZQW5MWCxpQkFBaUI7WUFLakIsVUFBVTs0Q0FrTFAsTUFBTSxTQUFDLFFBQVE7Ozs7SUFLbEIsOENBQW9EOztJQUNwRCw4Q0FBb0Q7O0lBQ3BELCtDQUFxRDs7SUFDckQsOENBQW9EOztJQUNwRCw0Q0FBa0Q7O0lBQ2xELG1EQUF3RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBDZGtTdGVwLFxuICBDZGtTdGVwcGVyLFxuICBTdGVwQ29udGVudFBvc2l0aW9uU3RhdGUsXG4gIFNURVBQRVJfR0xPQkFMX09QVElPTlMsXG4gIFN0ZXBwZXJPcHRpb25zXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRTdGVwSGVhZGVyfSBmcm9tICcuL3N0ZXAtaGVhZGVyJztcbmltcG9ydCB7TWF0U3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHttYXRTdGVwcGVyQW5pbWF0aW9uc30gZnJvbSAnLi9zdGVwcGVyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTdGVwcGVySWNvbiwgTWF0U3RlcHBlckljb25Db250ZXh0fSBmcm9tICcuL3N0ZXBwZXItaWNvbic7XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1zdGVwJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwLmh0bWwnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogRXJyb3JTdGF0ZU1hdGNoZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwfV0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0U3RlcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyIHtcbiAgLyoqIENvbnRlbnQgZm9yIHN0ZXAgbGFiZWwgZ2l2ZW4gYnkgYDxuZy10ZW1wbGF0ZSBtYXRTdGVwTGFiZWw+YC4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRTdGVwTGFiZWwpIHN0ZXBMYWJlbDogTWF0U3RlcExhYmVsO1xuXG4gIC8qKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSB0aGUgYD9gIGFmdGVyIGBzdGVwcGVyT3B0aW9uc2AgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFN0ZXBwZXIpKSBzdGVwcGVyOiBNYXRTdGVwcGVyLFxuICAgICAgICAgICAgICBAU2tpcFNlbGYoKSBwcml2YXRlIF9lcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoU1RFUFBFUl9HTE9CQUxfT1BUSU9OUykgc3RlcHBlck9wdGlvbnM/OiBTdGVwcGVyT3B0aW9ucykge1xuICAgIHN1cGVyKHN0ZXBwZXIsIHN0ZXBwZXJPcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDdXN0b20gZXJyb3Igc3RhdGUgbWF0Y2hlciB0aGF0IGFkZGl0aW9uYWxseSBjaGVja3MgZm9yIHZhbGlkaXR5IG9mIGludGVyYWN0ZWQgZm9ybS4gKi9cbiAgaXNFcnJvclN0YXRlKGNvbnRyb2w6IEZvcm1Db250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRXJyb3JTdGF0ZSA9IHRoaXMuX2Vycm9yU3RhdGVNYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBmb3JtKTtcblxuICAgIC8vIEN1c3RvbSBlcnJvciBzdGF0ZSBjaGVja3MgZm9yIHRoZSB2YWxpZGl0eSBvZiBmb3JtIHRoYXQgaXMgbm90IHN1Ym1pdHRlZCBvciB0b3VjaGVkXG4gICAgLy8gc2luY2UgdXNlciBjYW4gdHJpZ2dlciBhIGZvcm0gY2hhbmdlIGJ5IGNhbGxpbmcgZm9yIGFub3RoZXIgc3RlcCB3aXRob3V0IGRpcmVjdGx5XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY3VycmVudCBmb3JtLlxuICAgIGNvbnN0IGN1c3RvbUVycm9yU3RhdGUgPSAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiB0aGlzLmludGVyYWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyb3JTdGF0ZSB8fCBjdXN0b21FcnJvclN0YXRlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogYm9vbGVhbiB8IHN0cmluZztcbn1cblxuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1ttYXRTdGVwcGVyXScsIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0U3RlcHBlcn1dfSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyIGV4dGVuZHMgQ2RrU3RlcHBlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAvKiogVGhlIGxpc3Qgb2Ygc3RlcCBoZWFkZXJzIG9mIHRoZSBzdGVwcyBpbiB0aGUgc3RlcHBlci4gKi9cbiAgQFZpZXdDaGlsZHJlbihNYXRTdGVwSGVhZGVyKSBfc3RlcEhlYWRlcjogUXVlcnlMaXN0PE1hdFN0ZXBIZWFkZXI+O1xuXG4gIC8qKiBTdGVwcyB0aGF0IHRoZSBzdGVwcGVyIGhvbGRzLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9zdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+O1xuXG4gIC8qKiBDdXN0b20gaWNvbiBvdmVycmlkZXMgcGFzc2VkIGluIGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwcGVySWNvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2ljb25zOiBRdWVyeUxpc3Q8TWF0U3RlcHBlckljb24+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGN1cnJlbnQgc3RlcCBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4uICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBzaG91bGQgYmUgZGlzYWJsZWQgZm9yIHRoZSBzdGVwIGhlYWRlcnMuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIENvbnN1bWVyLXNwZWNpZmllZCB0ZW1wbGF0ZS1yZWZzIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGhlYWRlciBpY29ucy4gKi9cbiAgX2ljb25PdmVycmlkZXM6IHtba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVJlZjxNYXRTdGVwcGVySWNvbkNvbnRleHQ+fSA9IHt9O1xuXG4gIC8qKiBTdHJlYW0gb2YgYW5pbWF0aW9uIGBkb25lYCBldmVudHMgd2hlbiB0aGUgYm9keSBleHBhbmRzL2NvbGxhcHNlcy4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fc3RlcHNBcnJheSA9IHRoaXMuc3RlcHMudG9BcnJheSgpO1xuICAgIHRoaXMuX2ljb25zLmZvckVhY2goKHtuYW1lLCB0ZW1wbGF0ZVJlZn0pID0+IHRoaXMuX2ljb25PdmVycmlkZXNbbmFtZV0gPSB0ZW1wbGF0ZVJlZik7XG5cbiAgICAvLyBNYXJrIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24gd2hlbmV2ZXIgdGhlIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkgY2hhbmdlc1xuICAgIHRoaXMuX3N0ZXBzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0ZXBzQXJyYXkgPSB0aGlzLnN0ZXBzLnRvQXJyYXkoKTtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5waXBlKFxuICAgICAgLy8gVGhpcyBuZWVkcyBhIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaW4gb3JkZXIgdG8gYXZvaWQgZW1pdHRpbmcgdGhlIHNhbWUgZXZlbnQgdHdpY2UgZHVlXG4gICAgICAvLyB0byBhIGJ1ZyBpbiBhbmltYXRpb25zIHdoZXJlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGdldHMgaW52b2tlZCB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKChldmVudC50b1N0YXRlIGFzIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSkgPT09ICdjdXJyZW50Jykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNFcnJvcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xpbmVhcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IHN0cmluZztcbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWhvcml6b250YWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0SG9yaXpvbnRhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItaG9yaXpvbnRhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItaG9yaXpvbnRhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1lbmRdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1ib3R0b21dJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJib3R0b21cIicsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAnaG9yaXpvbnRhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy5ob3Jpem9udGFsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SG9yaXpvbnRhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBkaXNwbGF5IGluIGJvdHRvbSBvciBlbmQgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGxhYmVsUG9zaXRpb246ICdib3R0b20nIHwgJ2VuZCcgPSAnZW5kJztcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZWRpdGFibGU6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0Vycm9yOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbGluZWFyOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWRJbmRleDogbnVtYmVyIHwgc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtdmVydGljYWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0VmVydGljYWxTdGVwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLXZlcnRpY2FsLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcHBlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RlcHBlci12ZXJ0aWNhbCcsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAndmVydGljYWwnLFxuICAgICdyb2xlJzogJ3RhYmxpc3QnLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0U3RlcHBlckFuaW1hdGlvbnMudmVydGljYWxTdGVwVHJhbnNpdGlvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0VmVydGljYWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFZlcnRpY2FsU3RlcHBlcn1cbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFZlcnRpY2FsU3RlcHBlciBleHRlbmRzIE1hdFN0ZXBwZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIGBlbGVtZW50UmVmYCBhbmQgYF9kb2N1bWVudGAgcGFyYW1ldGVycyB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgZWxlbWVudFJlZj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGRpciwgY2hhbmdlRGV0ZWN0b3JSZWYsIGVsZW1lbnRSZWYsIF9kb2N1bWVudCk7XG4gICAgdGhpcy5fb3JpZW50YXRpb24gPSAndmVydGljYWwnO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNFcnJvcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xpbmVhcjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IG51bWJlciB8IHN0cmluZztcbn1cbiJdfQ==