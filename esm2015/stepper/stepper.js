/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
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
    var MatStep_1;
    let MatStep = MatStep_1 = class MatStep extends CdkStep {
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
    };
    __decorate([
        ContentChild(MatStepLabel),
        __metadata("design:type", MatStepLabel)
    ], MatStep.prototype, "stepLabel", void 0);
    MatStep = MatStep_1 = __decorate([
        Component({
            selector: 'mat-step',
            template: "<ng-template><ng-content></ng-content></ng-template>\n",
            providers: [
                { provide: ErrorStateMatcher, useExisting: MatStep_1 },
                { provide: CdkStep, useExisting: MatStep_1 },
            ],
            encapsulation: ViewEncapsulation.None,
            exportAs: 'matStep',
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __param(0, Inject(forwardRef(() => MatStepper))),
        __param(1, SkipSelf()),
        __param(2, Optional()), __param(2, Inject(STEPPER_GLOBAL_OPTIONS)),
        __metadata("design:paramtypes", [MatStepper,
            ErrorStateMatcher, Object])
    ], MatStep);
    return MatStep;
})();
export { MatStep };
let MatStepper = /** @class */ (() => {
    var MatStepper_1;
    let MatStepper = MatStepper_1 = class MatStepper extends CdkStepper {
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
    };
    __decorate([
        ViewChildren(MatStepHeader),
        __metadata("design:type", QueryList)
    ], MatStepper.prototype, "_stepHeader", void 0);
    __decorate([
        ContentChildren(MatStep, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatStepper.prototype, "_steps", void 0);
    __decorate([
        ContentChildren(MatStepperIcon, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatStepper.prototype, "_icons", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatStepper.prototype, "animationDone", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepper.prototype, "disableRipple", void 0);
    MatStepper = MatStepper_1 = __decorate([
        Directive({ selector: '[matStepper]', providers: [{ provide: CdkStepper, useExisting: MatStepper_1 }] })
    ], MatStepper);
    return MatStepper;
})();
export { MatStepper };
let MatHorizontalStepper = /** @class */ (() => {
    var MatHorizontalStepper_1;
    let MatHorizontalStepper = MatHorizontalStepper_1 = class MatHorizontalStepper extends MatStepper {
        constructor() {
            super(...arguments);
            /** Whether the label should display in bottom or end position. */
            this.labelPosition = 'end';
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatHorizontalStepper.prototype, "labelPosition", void 0);
    MatHorizontalStepper = MatHorizontalStepper_1 = __decorate([
        Component({
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
                { provide: MatStepper, useExisting: MatHorizontalStepper_1 },
                { provide: CdkStepper, useExisting: MatHorizontalStepper_1 }
            ],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
        })
    ], MatHorizontalStepper);
    return MatHorizontalStepper;
})();
export { MatHorizontalStepper };
let MatVerticalStepper = /** @class */ (() => {
    var MatVerticalStepper_1;
    let MatVerticalStepper = MatVerticalStepper_1 = class MatVerticalStepper extends MatStepper {
        constructor(dir, changeDetectorRef, 
        // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
        elementRef, _document) {
            super(dir, changeDetectorRef, elementRef, _document);
            this._orientation = 'vertical';
        }
    };
    MatVerticalStepper = MatVerticalStepper_1 = __decorate([
        Component({
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
                { provide: MatStepper, useExisting: MatVerticalStepper_1 },
                { provide: CdkStepper, useExisting: MatVerticalStepper_1 }
            ],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
        }),
        __param(0, Optional()),
        __param(3, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Directionality,
            ChangeDetectorRef,
            ElementRef, Object])
    ], MatVerticalStepper);
    return MatVerticalStepper;
})();
export { MatVerticalStepper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFFVixzQkFBc0IsRUFFdkIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBRVIsWUFBWSxFQUNaLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFELE9BQU8sRUFBQyxjQUFjLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFhckU7O0lBQUEsSUFBYSxPQUFPLGVBQXBCLE1BQWEsT0FBUSxTQUFRLE9BQU87UUFJbEMsbUVBQW1FO1FBQ25FLFlBQWtELE9B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QUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBQztnQkFDdEQsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxvQkFBa0IsRUFBQzthQUN2RDtZQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztTQUNoRCxDQUFDO1FBR0csV0FBQSxRQUFRLEVBQUUsQ0FBQTtRQUlWLFdBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3lDQUpBLGNBQWM7WUFDWixpQkFBaUI7WUFFdkIsVUFBVTtPQUxkLGtCQUFrQixDQWU5QjtJQUFELHlCQUFDO0tBQUE7U0FmWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDZGtTdGVwLFxuICBDZGtTdGVwcGVyLFxuICBTdGVwQ29udGVudFBvc2l0aW9uU3RhdGUsXG4gIFNURVBQRVJfR0xPQkFMX09QVElPTlMsXG4gIFN0ZXBwZXJPcHRpb25zXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTa2lwU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRTdGVwSGVhZGVyfSBmcm9tICcuL3N0ZXAtaGVhZGVyJztcbmltcG9ydCB7TWF0U3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHttYXRTdGVwcGVyQW5pbWF0aW9uc30gZnJvbSAnLi9zdGVwcGVyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRTdGVwcGVySWNvbiwgTWF0U3RlcHBlckljb25Db250ZXh0fSBmcm9tICcuL3N0ZXBwZXItaWNvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zdGVwJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwLmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogRXJyb3JTdGF0ZU1hdGNoZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcCwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXB9LFxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFN0ZXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcCBleHRlbmRzIENka1N0ZXAgaW1wbGVtZW50cyBFcnJvclN0YXRlTWF0Y2hlciB7XG4gIC8qKiBDb250ZW50IGZvciBzdGVwIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0U3RlcExhYmVsPmAuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0U3RlcExhYmVsKSBzdGVwTGFiZWw6IE1hdFN0ZXBMYWJlbDtcblxuICAvKiogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCByZW1vdmUgdGhlIGA/YCBhZnRlciBgc3RlcHBlck9wdGlvbnNgICovXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRTdGVwcGVyKSkgc3RlcHBlcjogTWF0U3RlcHBlcixcbiAgICAgICAgICAgICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBfZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFNURVBQRVJfR0xPQkFMX09QVElPTlMpIHN0ZXBwZXJPcHRpb25zPzogU3RlcHBlck9wdGlvbnMpIHtcbiAgICBzdXBlcihzdGVwcGVyLCBzdGVwcGVyT3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ3VzdG9tIGVycm9yIHN0YXRlIG1hdGNoZXIgdGhhdCBhZGRpdGlvbmFsbHkgY2hlY2tzIGZvciB2YWxpZGl0eSBvZiBpbnRlcmFjdGVkIGZvcm0uICovXG4gIGlzRXJyb3JTdGF0ZShjb250cm9sOiBGb3JtQ29udHJvbCB8IG51bGwsIGZvcm06IEZvcm1Hcm91cERpcmVjdGl2ZSB8IE5nRm9ybSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBjb25zdCBvcmlnaW5hbEVycm9yU3RhdGUgPSB0aGlzLl9lcnJvclN0YXRlTWF0Y2hlci5pc0Vycm9yU3RhdGUoY29udHJvbCwgZm9ybSk7XG5cbiAgICAvLyBDdXN0b20gZXJyb3Igc3RhdGUgY2hlY2tzIGZvciB0aGUgdmFsaWRpdHkgb2YgZm9ybSB0aGF0IGlzIG5vdCBzdWJtaXR0ZWQgb3IgdG91Y2hlZFxuICAgIC8vIHNpbmNlIHVzZXIgY2FuIHRyaWdnZXIgYSBmb3JtIGNoYW5nZSBieSBjYWxsaW5nIGZvciBhbm90aGVyIHN0ZXAgd2l0aG91dCBkaXJlY3RseVxuICAgIC8vIGludGVyYWN0aW5nIHdpdGggdGhlIGN1cnJlbnQgZm9ybS5cbiAgICBjb25zdCBjdXN0b21FcnJvclN0YXRlID0gISEoY29udHJvbCAmJiBjb250cm9sLmludmFsaWQgJiYgdGhpcy5pbnRlcmFjdGVkKTtcblxuICAgIHJldHVybiBvcmlnaW5hbEVycm9yU3RhdGUgfHwgY3VzdG9tRXJyb3JTdGF0ZTtcbiAgfVxufVxuXG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW21hdFN0ZXBwZXJdJywgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwcGVyfV19KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXIgZXh0ZW5kcyBDZGtTdGVwcGVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKiBUaGUgbGlzdCBvZiBzdGVwIGhlYWRlcnMgb2YgdGhlIHN0ZXBzIGluIHRoZSBzdGVwcGVyLiAqL1xuICBAVmlld0NoaWxkcmVuKE1hdFN0ZXBIZWFkZXIpIF9zdGVwSGVhZGVyOiBRdWVyeUxpc3Q8TWF0U3RlcEhlYWRlcj47XG5cbiAgLyoqIFN0ZXBzIHRoYXQgdGhlIHN0ZXBwZXIgaG9sZHMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0U3RlcCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3N0ZXBzOiBRdWVyeUxpc3Q8TWF0U3RlcD47XG5cbiAgLyoqIEN1c3RvbSBpY29uIG92ZXJyaWRlcyBwYXNzZWQgaW4gYnkgdGhlIGNvbnN1bWVyLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXBwZXJJY29uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaWNvbnM6IFF1ZXJ5TGlzdDxNYXRTdGVwcGVySWNvbj47XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY3VycmVudCBzdGVwIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbi4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZCBmb3IgdGhlIHN0ZXAgaGVhZGVycy4gKi9cbiAgQElucHV0KCkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogQ29uc3VtZXItc3BlY2lmaWVkIHRlbXBsYXRlLXJlZnMgdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgaGVhZGVyIGljb25zLiAqL1xuICBfaWNvbk92ZXJyaWRlczoge1trZXk6IHN0cmluZ106IFRlbXBsYXRlUmVmPE1hdFN0ZXBwZXJJY29uQ29udGV4dD59ID0ge307XG5cbiAgLyoqIFN0cmVhbSBvZiBhbmltYXRpb24gYGRvbmVgIGV2ZW50cyB3aGVuIHRoZSBib2R5IGV4cGFuZHMvY29sbGFwc2VzLiAqL1xuICBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pY29ucy5mb3JFYWNoKCh7bmFtZSwgdGVtcGxhdGVSZWZ9KSA9PiB0aGlzLl9pY29uT3ZlcnJpZGVzW25hbWVdID0gdGVtcGxhdGVSZWYpO1xuXG4gICAgLy8gTWFyayB0aGUgY29tcG9uZW50IGZvciBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW5ldmVyIHRoZSBjb250ZW50IGNoaWxkcmVuIHF1ZXJ5IGNoYW5nZXNcbiAgICB0aGlzLl9zdGVwcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9zdGF0ZUNoYW5nZWQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUucGlwZShcbiAgICAgIC8vIFRoaXMgbmVlZHMgYSBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGluIG9yZGVyIHRvIGF2b2lkIGVtaXR0aW5nIHRoZSBzYW1lIGV2ZW50IHR3aWNlIGR1ZVxuICAgICAgLy8gdG8gYSBidWcgaW4gYW5pbWF0aW9ucyB3aGVyZSB0aGUgYC5kb25lYCBjYWxsYmFjayBnZXRzIGludm9rZWQgdHdpY2Ugb24gc29tZSBicm93c2Vycy5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmICgoZXZlbnQudG9TdGF0ZSBhcyBTdGVwQ29udGVudFBvc2l0aW9uU3RhdGUpID09PSAnY3VycmVudCcpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Eb25lLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9lZGl0YWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3B0aW9uYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBsZXRlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzRXJyb3I6IEJvb2xlYW5JbnB1dDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWhvcml6b250YWwtc3RlcHBlcicsXG4gIGV4cG9ydEFzOiAnbWF0SG9yaXpvbnRhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItaG9yaXpvbnRhbC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3N0ZXBwZXIuY3NzJ10sXG4gIGlucHV0czogWydzZWxlY3RlZEluZGV4J10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItaG9yaXpvbnRhbCcsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1lbmRdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1ib3R0b21dJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJib3R0b21cIicsXG4gICAgJ2FyaWEtb3JpZW50YXRpb24nOiAnaG9yaXpvbnRhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy5ob3Jpem9udGFsU3RlcFRyYW5zaXRpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0U3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogQ2RrU3RlcHBlciwgdXNlRXhpc3Rpbmc6IE1hdEhvcml6b250YWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0SG9yaXpvbnRhbFN0ZXBwZXIgZXh0ZW5kcyBNYXRTdGVwcGVyIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBkaXNwbGF5IGluIGJvdHRvbSBvciBlbmQgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGxhYmVsUG9zaXRpb246ICdib3R0b20nIHwgJ2VuZCcgPSAnZW5kJztcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZWRpdGFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wdGlvbmFsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0Vycm9yOiBCb29sZWFuSW5wdXQ7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC12ZXJ0aWNhbC1zdGVwcGVyJyxcbiAgZXhwb3J0QXM6ICdtYXRWZXJ0aWNhbFN0ZXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXBwZXItdmVydGljYWwuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzdGVwcGVyLmNzcyddLFxuICBpbnB1dHM6IFsnc2VsZWN0ZWRJbmRleCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwcGVyLXZlcnRpY2FsJyxcbiAgICAnYXJpYS1vcmllbnRhdGlvbic6ICd2ZXJ0aWNhbCcsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTdGVwcGVyQW5pbWF0aW9ucy52ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdFN0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRWZXJ0aWNhbFN0ZXBwZXJ9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0VmVydGljYWxTdGVwcGVyfVxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VmVydGljYWxTdGVwcGVyIGV4dGVuZHMgTWF0U3RlcHBlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgYGVsZW1lbnRSZWZgIGFuZCBgX2RvY3VtZW50YCBwYXJhbWV0ZXJzIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICBlbGVtZW50UmVmPzogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoZGlyLCBjaGFuZ2VEZXRlY3RvclJlZiwgZWxlbWVudFJlZiwgX2RvY3VtZW50KTtcbiAgICB0aGlzLl9vcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZWRpdGFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wdGlvbmFsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb21wbGV0ZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0Vycm9yOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=