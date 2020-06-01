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
let MatStep = /** @class */ (() => {
    class MatStep extends CdkStep {
        /** @breaking-change 8.0.0 remove the `?` after `stepperOptions` */
        constructor(stepper, _errorStateMatcher, stepperOptions) {
            super(stepper, stepperOptions);
            this._errorStateMatcher = _errorStateMatcher;
        }
        /** Custom error state matcher that additionally checks for validity of interacted form. */
        isErrorState(control, form) {
            const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
            // Custom error state checks for the validity of form that is not submitted or touched
            // since user can trigger a form change by calling for another step without directly
            // interacting with the current form.
            const customErrorState = !!(control && control.invalid && this.interacted);
            return originalErrorState || customErrorState;
        }
    }
    MatStep.decorators = [
        { type: Component, args: [{
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
    MatStep.ctorParameters = () => [
        { type: MatStepper, decorators: [{ type: Inject, args: [forwardRef(() => MatStepper),] }] },
        { type: ErrorStateMatcher, decorators: [{ type: SkipSelf }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [STEPPER_GLOBAL_OPTIONS,] }] }
    ];
    MatStep.propDecorators = {
        stepLabel: [{ type: ContentChild, args: [MatStepLabel,] }]
    };
    return MatStep;
})();
export { MatStep };
let MatStepper = /** @class */ (() => {
    class MatStepper extends CdkStepper {
        constructor() {
            super(...arguments);
            /** Event emitted when the current step is done transitioning in. */
            this.animationDone = new EventEmitter();
            /** Consumer-specified template-refs to be used to override the header icons. */
            this._iconOverrides = {};
            /** Stream of animation `done` events when the body expands/collapses. */
            this._animationDone = new Subject();
        }
        ngAfterContentInit() {
            this._icons.forEach(({ name, templateRef }) => this._iconOverrides[name] = templateRef);
            // Mark the component for change detection whenever the content children query changes
            this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
                this._stateChanged();
            });
            this._animationDone.pipe(
            // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
            // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
            // See https://github.com/angular/angular/issues/24084
            distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState), takeUntil(this._destroyed)).subscribe(event => {
                if (event.toState === 'current') {
                    this.animationDone.emit();
                }
            });
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
    return MatStepper;
})();
export { MatStepper };
let MatHorizontalStepper = /** @class */ (() => {
    class MatHorizontalStepper extends MatStepper {
        constructor() {
            super(...arguments);
            /** Whether the label should display in bottom or end position. */
            this.labelPosition = 'end';
        }
    }
    MatHorizontalStepper.decorators = [
        { type: Component, args: [{
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
                    styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                }] }
    ];
    MatHorizontalStepper.propDecorators = {
        labelPosition: [{ type: Input }]
    };
    return MatHorizontalStepper;
})();
export { MatHorizontalStepper };
let MatVerticalStepper = /** @class */ (() => {
    class MatVerticalStepper extends MatStepper {
        constructor(dir, changeDetectorRef, 
        // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
        elementRef, _document) {
            super(dir, changeDetectorRef, elementRef, _document);
            this._orientation = 'vertical';
        }
    }
    MatVerticalStepper.decorators = [
        { type: Component, args: [{
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
                    styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                }] }
    ];
    /** @nocollapse */
    MatVerticalStepper.ctorParameters = () => [
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ];
    return MatVerticalStepper;
})();
export { MatVerticalStepper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWpELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUVWLHNCQUFzQixFQUV2QixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFFUixZQUFZLEVBQ1osaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGNBQWMsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyRTtJQUFBLE1BV2EsT0FBUSxTQUFRLE9BQU87UUFJbEMsbUVBQW1FO1FBQ25FLFlBQWtELE9BQW1CLEVBQ3JDLGtCQUFxQyxF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QUFXakM7SUFBQSxNQW1CYSxrQkFBbUIsU0FBUSxVQUFVO1FBQ2hELFlBQ2MsR0FBbUIsRUFDL0IsaUJBQW9DO1FBQ3BDLHFGQUFxRjtRQUNyRixVQUFvQyxFQUNsQixTQUFlO1lBQ2pDLEtBQUssQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO1FBQ2pDLENBQUM7OztnQkE1QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLHc4REFBb0M7b0JBRXBDLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDekIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLGtCQUFrQixFQUFFLFVBQVU7d0JBQzlCLE1BQU0sRUFBRSxTQUFTO3FCQUNsQjtvQkFDRCxVQUFVLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQztvQkFDekQsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUM7d0JBQ3RELEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUM7cUJBQ3ZEO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7O2dCQWxMTyxjQUFjLHVCQXFMakIsUUFBUTtnQkF4S1gsaUJBQWlCO2dCQUtqQixVQUFVO2dEQXVLUCxNQUFNLFNBQUMsUUFBUTs7SUFTcEIseUJBQUM7S0FBQTtTQWZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENka1N0ZXAsXG4gIENka1N0ZXBwZXIsXG4gIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSxcbiAgU1RFUFBFUl9HTE9CQUxfT1BUSU9OUyxcbiAgU3RlcHBlck9wdGlvbnNcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdFN0ZXBIZWFkZXJ9IGZyb20gJy4vc3RlcC1oZWFkZXInO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge21hdFN0ZXBwZXJBbmltYXRpb25zfSBmcm9tICcuL3N0ZXBwZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uLCBNYXRTdGVwcGVySWNvbkNvbnRleHR9IGZyb20gJy4vc3RlcHBlci1pY29uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXN0ZXAnLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBFcnJvclN0YXRlTWF0Y2hlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXB9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwLCB1c2VFeGlzdGluZzogTWF0U3RlcH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0U3RlcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyIHtcbiAgLyoqIENvbnRlbnQgZm9yIHN0ZXAgbGFiZWwgZ2l2ZW4gYnkgYDxuZy10ZW1wbGF0ZSBtYXRTdGVwTGFiZWw+YC4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRTdGVwTGFiZWwpIHN0ZXBMYWJlbDogTWF0U3RlcExhYmVsO1xuXG4gIC8qKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIHJlbW92ZSB0aGUgYD9gIGFmdGVyIGBzdGVwcGVyT3B0aW9uc2AgKi9cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFN0ZXBwZXIpKSBzdGVwcGVyOiBNYXRTdGVwcGVyLFxuICAgICAgICAgICAgICBAU2tpcFNlbGYoKSBwcml2YXRlIF9lcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoU1RFUFBFUl9HTE9CQUxfT1BUSU9OUykgc3RlcHBlck9wdGlvbnM/OiBTdGVwcGVyT3B0aW9ucykge1xuICAgIHN1cGVyKHN0ZXBwZXIsIHN0ZXBwZXJPcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDdXN0b20gZXJyb3Igc3RhdGUgbWF0Y2hlciB0aGF0IGFkZGl0aW9uYWxseSBjaGVja3MgZm9yIHZhbGlkaXR5IG9mIGludGVyYWN0ZWQgZm9ybS4gKi9cbiAgaXNFcnJvclN0YXRlKGNvbnRyb2w6IEZvcm1Db250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRXJyb3JTdGF0ZSA9IHRoaXMuX2Vycm9yU3RhdGVNYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBmb3JtKTtcblxuICAgIC8vIEN1c3RvbSBlcnJvciBzdGF0ZSBjaGVja3MgZm9yIHRoZSB2YWxpZGl0eSBvZiBmb3JtIHRoYXQgaXMgbm90IHN1Ym1pdHRlZCBvciB0b3VjaGVkXG4gICAgLy8gc2luY2UgdXNlciBjYW4gdHJpZ2dlciBhIGZvcm0gY2hhbmdlIGJ5IGNhbGxpbmcgZm9yIGFub3RoZXIgc3RlcCB3aXRob3V0IGRpcmVjdGx5XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY3VycmVudCBmb3JtLlxuICAgIGNvbnN0IGN1c3RvbUVycm9yU3RhdGUgPSAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiB0aGlzLmludGVyYWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyb3JTdGF0ZSB8fCBjdXN0b21FcnJvclN0YXRlO1xuICB9XG59XG5cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbWF0U3RlcHBlcl0nLCBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXBwZXJ9XX0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlciBleHRlbmRzIENka1N0ZXBwZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgLyoqIFRoZSBsaXN0IG9mIHN0ZXAgaGVhZGVycyBvZiB0aGUgc3RlcHMgaW4gdGhlIHN0ZXBwZXIuICovXG4gIEBWaWV3Q2hpbGRyZW4oTWF0U3RlcEhlYWRlcikgX3N0ZXBIZWFkZXI6IFF1ZXJ5TGlzdDxNYXRTdGVwSGVhZGVyPjtcblxuICAvKiogU3RlcHMgdGhhdCB0aGUgc3RlcHBlciBob2xkcy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3RlcHM6IFF1ZXJ5TGlzdDxNYXRTdGVwPjtcblxuICAvKiogQ3VzdG9tIGljb24gb3ZlcnJpZGVzIHBhc3NlZCBpbiBieSB0aGUgY29uc3VtZXIuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0U3RlcHBlckljb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9pY29uczogUXVlcnlMaXN0PE1hdFN0ZXBwZXJJY29uPjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjdXJyZW50IHN0ZXAgaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYW5pbWF0aW9uRG9uZTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgc2hvdWxkIGJlIGRpc2FibGVkIGZvciB0aGUgc3RlcCBoZWFkZXJzLiAqL1xuICBASW5wdXQoKSBkaXNhYmxlUmlwcGxlOiBib29sZWFuO1xuXG4gIC8qKiBDb25zdW1lci1zcGVjaWZpZWQgdGVtcGxhdGUtcmVmcyB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBoZWFkZXIgaWNvbnMuICovXG4gIF9pY29uT3ZlcnJpZGVzOiB7W2tleTogc3RyaW5nXTogVGVtcGxhdGVSZWY8TWF0U3RlcHBlckljb25Db250ZXh0Pn0gPSB7fTtcblxuICAvKiogU3RyZWFtIG9mIGFuaW1hdGlvbiBgZG9uZWAgZXZlbnRzIHdoZW4gdGhlIGJvZHkgZXhwYW5kcy9jb2xsYXBzZXMuICovXG4gIF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2ljb25zLmZvckVhY2goKHtuYW1lLCB0ZW1wbGF0ZVJlZn0pID0+IHRoaXMuX2ljb25PdmVycmlkZXNbbmFtZV0gPSB0ZW1wbGF0ZVJlZik7XG5cbiAgICAvLyBNYXJrIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24gd2hlbmV2ZXIgdGhlIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkgY2hhbmdlc1xuICAgIHRoaXMuX3N0ZXBzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5waXBlKFxuICAgICAgLy8gVGhpcyBuZWVkcyBhIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaW4gb3JkZXIgdG8gYXZvaWQgZW1pdHRpbmcgdGhlIHNhbWUgZXZlbnQgdHdpY2UgZHVlXG4gICAgICAvLyB0byBhIGJ1ZyBpbiBhbmltYXRpb25zIHdoZXJlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGdldHMgaW52b2tlZCB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKChldmVudC50b1N0YXRlIGFzIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSkgPT09ICdjdXJyZW50Jykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbkRvbmUuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2VkaXRhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcHRpb25hbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29tcGxldGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNFcnJvcjogQm9vbGVhbklucHV0O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtaG9yaXpvbnRhbC1zdGVwcGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRIb3Jpem9udGFsU3RlcHBlcicsXG4gIHRlbXBsYXRlVXJsOiAnc3RlcHBlci1ob3Jpem9udGFsLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcHBlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RlcHBlci1ob3Jpem9udGFsJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWVuZF0nOiAnbGFiZWxQb3NpdGlvbiA9PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWJvdHRvbV0nOiAnbGFiZWxQb3NpdGlvbiA9PSBcImJvdHRvbVwiJyxcbiAgICAnYXJpYS1vcmllbnRhdGlvbic6ICdob3Jpem9udGFsJyxcbiAgICAncm9sZSc6ICd0YWJsaXN0JyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdFN0ZXBwZXJBbmltYXRpb25zLmhvcml6b250YWxTdGVwVHJhbnNpdGlvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0SG9yaXpvbnRhbFN0ZXBwZXJ9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0SG9yaXpvbnRhbFN0ZXBwZXJ9XG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRIb3Jpem9udGFsU3RlcHBlciBleHRlbmRzIE1hdFN0ZXBwZXIge1xuICAvKiogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGRpc3BsYXkgaW4gYm90dG9tIG9yIGVuZCBwb3NpdGlvbi4gKi9cbiAgQElucHV0KClcbiAgbGFiZWxQb3NpdGlvbjogJ2JvdHRvbScgfCAnZW5kJyA9ICdlbmQnO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9lZGl0YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IEJvb2xlYW5JbnB1dDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXZlcnRpY2FsLXN0ZXBwZXInLFxuICBleHBvcnRBczogJ21hdFZlcnRpY2FsU3RlcHBlcicsXG4gIHRlbXBsYXRlVXJsOiAnc3RlcHBlci12ZXJ0aWNhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItdmVydGljYWwnLFxuICAgICdhcmlhLW9yaWVudGF0aW9uJzogJ3ZlcnRpY2FsJyxcbiAgICAncm9sZSc6ICd0YWJsaXN0JyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdFN0ZXBwZXJBbmltYXRpb25zLnZlcnRpY2FsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdFZlcnRpY2FsU3RlcHBlcn0sXG4gICAge3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRWZXJ0aWNhbFN0ZXBwZXJ9XG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRWZXJ0aWNhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBgZWxlbWVudFJlZmAgYW5kIGBfZG9jdW1lbnRgIHBhcmFtZXRlcnMgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgIGVsZW1lbnRSZWY/OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ/OiBhbnkpIHtcbiAgICBzdXBlcihkaXIsIGNoYW5nZURldGVjdG9yUmVmLCBlbGVtZW50UmVmLCBfZG9jdW1lbnQpO1xuICAgIHRoaXMuX29yaWVudGF0aW9uID0gJ3ZlcnRpY2FsJztcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9lZGl0YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==