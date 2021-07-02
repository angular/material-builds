/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { CdkStep, CdkStepper, STEPPER_GLOBAL_OPTIONS, } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, QueryList, SkipSelf, ViewChildren, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatStepHeader } from './step-header';
import { MatStepLabel } from './step-label';
import { matStepperAnimations } from './stepper-animations';
import { MatStepperIcon } from './stepper-icon';
import { MatStepContent } from './step-content';
export class MatStep extends CdkStep {
    constructor(stepper, _errorStateMatcher, _viewContainerRef, stepperOptions) {
        super(stepper, stepperOptions);
        this._errorStateMatcher = _errorStateMatcher;
        this._viewContainerRef = _viewContainerRef;
        this._isSelected = Subscription.EMPTY;
    }
    ngAfterContentInit() {
        this._isSelected = this._stepper.steps.changes.pipe(switchMap(() => {
            return this._stepper.selectionChange.pipe(map(event => event.selectedStep === this), startWith(this._stepper.selected === this));
        })).subscribe(isSelected => {
            if (isSelected && this._lazyContent && !this._portal) {
                this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
            }
        });
    }
    ngOnDestroy() {
        this._isSelected.unsubscribe();
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
                template: "<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n</ng-template>\n",
                providers: [
                    { provide: ErrorStateMatcher, useExisting: MatStep },
                    { provide: CdkStep, useExisting: MatStep },
                ],
                encapsulation: ViewEncapsulation.None,
                exportAs: 'matStep',
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
MatStep.ctorParameters = () => [
    { type: MatStepper, decorators: [{ type: Inject, args: [forwardRef(() => MatStepper),] }] },
    { type: ErrorStateMatcher, decorators: [{ type: SkipSelf }] },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [STEPPER_GLOBAL_OPTIONS,] }] }
];
MatStep.propDecorators = {
    stepLabel: [{ type: ContentChild, args: [MatStepLabel,] }],
    color: [{ type: Input }],
    _lazyContent: [{ type: ContentChild, args: [MatStepContent, { static: false },] }]
};
/**
 * Proxies the public APIs from `MatStepper` to the deprecated `MatHorizontalStepper` and
 * `MatVerticalStepper`.
 * @deprecated Use `MatStepper` instead.
 * @breaking-change 13.0.0
 * @docs-private
 */
class _MatProxyStepperBase extends CdkStepper {
}
_MatProxyStepperBase.decorators = [
    { type: Directive }
];
/**
 * @deprecated Use `MatStepper` instead.
 * @breaking-change 13.0.0
 */
export class MatHorizontalStepper extends _MatProxyStepperBase {
}
MatHorizontalStepper.decorators = [
    { type: Directive, args: [{ selector: 'mat-horizontal-stepper' },] }
];
/**
 * @deprecated Use `MatStepper` instead.
 * @breaking-change 13.0.0
 */
export class MatVerticalStepper extends _MatProxyStepperBase {
}
MatVerticalStepper.decorators = [
    { type: Directive, args: [{ selector: 'mat-vertical-stepper' },] }
];
export class MatStepper extends CdkStepper {
    constructor(dir, changeDetectorRef, elementRef, _document) {
        super(dir, changeDetectorRef, elementRef, _document);
        /** Steps that belong to the current stepper, excluding ones from nested steppers. */
        this.steps = new QueryList();
        /** Event emitted when the current step is done transitioning in. */
        this.animationDone = new EventEmitter();
        /**
         * Whether the label should display in bottom or end position.
         * Only applies in the `horizontal` orientation.
         */
        this.labelPosition = 'end';
        /** Consumer-specified template-refs to be used to override the header icons. */
        this._iconOverrides = {};
        /** Stream of animation `done` events when the body expands/collapses. */
        this._animationDone = new Subject();
        const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
        this.orientation = nodeName === 'mat-vertical-stepper' ? 'vertical' : 'horizontal';
    }
    ngAfterContentInit() {
        super.ngAfterContentInit();
        this._icons.forEach(({ name, templateRef }) => this._iconOverrides[name] = templateRef);
        // Mark the component for change detection whenever the content children query changes
        this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
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
    _stepIsNavigable(index, step) {
        return step.completed || this.selectedIndex === index || !this.linear;
    }
}
MatStepper.decorators = [
    { type: Component, args: [{
                selector: 'mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]',
                exportAs: 'matStepper, matVerticalStepper, matHorizontalStepper',
                template: "<ng-container [ngSwitch]=\"orientation\">\n  <!-- Horizontal stepper -->\n  <ng-container *ngSwitchCase=\"'horizontal'\">\n    <div class=\"mat-horizontal-stepper-header-container\">\n      <ng-container *ngFor=\"let step of steps; let i = index; let isLast = last\">\n        <ng-container\n          [ngTemplateOutlet]=\"stepTemplate\"\n          [ngTemplateOutletContext]=\"{step: step, i: i}\"></ng-container>\n        <div *ngIf=\"!isLast\" class=\"mat-stepper-horizontal-line\"></div>\n      </ng-container>\n    </div>\n\n    <div class=\"mat-horizontal-content-container\">\n      <div *ngFor=\"let step of steps; let i = index\"\n           class=\"mat-horizontal-stepper-content\" role=\"tabpanel\"\n           [@horizontalStepTransition]=\"_getAnimationDirection(i)\"\n           (@horizontalStepTransition.done)=\"_animationDone.next($event)\"\n           [id]=\"_getStepContentId(i)\"\n           [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n           [attr.aria-expanded]=\"selectedIndex === i\">\n        <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n      </div>\n    </div>\n  </ng-container>\n\n  <!-- Vertical stepper -->\n  <ng-container *ngSwitchCase=\"'vertical'\">\n    <div class=\"mat-step\" *ngFor=\"let step of steps; let i = index; let isLast = last\">\n      <ng-container\n        [ngTemplateOutlet]=\"stepTemplate\"\n        [ngTemplateOutletContext]=\"{step: step, i: i}\"></ng-container>\n      <div class=\"mat-vertical-content-container\" [class.mat-stepper-vertical-line]=\"!isLast\">\n        <div class=\"mat-vertical-stepper-content\" role=\"tabpanel\"\n             [@verticalStepTransition]=\"_getAnimationDirection(i)\"\n             (@verticalStepTransition.done)=\"_animationDone.next($event)\"\n             [id]=\"_getStepContentId(i)\"\n             [attr.aria-labelledby]=\"_getStepLabelId(i)\"\n             [attr.aria-expanded]=\"selectedIndex === i\">\n          <div class=\"mat-vertical-content\">\n            <ng-container [ngTemplateOutlet]=\"step.content\"></ng-container>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-container>\n\n</ng-container>\n\n<!-- Common step templating -->\n<ng-template let-step=\"step\" let-i=\"i\" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]=\"orientation === 'horizontal'\"\n    [class.mat-vertical-stepper-header]=\"orientation === 'vertical'\"\n    (click)=\"step.select()\"\n    (keydown)=\"_onKeydown($event)\"\n    [tabIndex]=\"_getFocusIndex() === i ? 0 : -1\"\n    [id]=\"_getStepLabelId(i)\"\n    [attr.aria-posinset]=\"i + 1\"\n    [attr.aria-setsize]=\"steps.length\"\n    [attr.aria-controls]=\"_getStepContentId(i)\"\n    [attr.aria-selected]=\"selectedIndex == i\"\n    [attr.aria-label]=\"step.ariaLabel || null\"\n    [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n    [attr.aria-disabled]=\"_stepIsNavigable(i, step) ? null : true\"\n    [index]=\"i\"\n    [state]=\"_getIndicatorType(i, step.state)\"\n    [label]=\"step.stepLabel || step.label\"\n    [selected]=\"selectedIndex === i\"\n    [active]=\"_stepIsNavigable(i, step)\"\n    [optional]=\"step.optional\"\n    [errorMessage]=\"step.errorMessage\"\n    [iconOverrides]=\"_iconOverrides\"\n    [disableRipple]=\"disableRipple\"\n    [color]=\"step.color || color\"></mat-step-header>\n</ng-template>\n",
                inputs: ['selectedIndex'],
                host: {
                    '[class.mat-stepper-horizontal]': 'orientation === "horizontal"',
                    '[class.mat-stepper-vertical]': 'orientation === "vertical"',
                    '[class.mat-stepper-label-position-end]': 'orientation === "horizontal" && labelPosition == "end"',
                    '[class.mat-stepper-label-position-bottom]': 'orientation === "horizontal" && labelPosition == "bottom"',
                    '[attr.aria-orientation]': 'orientation',
                    'role': 'tablist',
                },
                animations: [
                    matStepperAnimations.horizontalStepTransition,
                    matStepperAnimations.verticalStepTransition,
                ],
                providers: [
                    { provide: CdkStepper, useExisting: MatStepper },
                    { provide: MatHorizontalStepper, useExisting: MatStepper },
                    { provide: MatVerticalStepper, useExisting: MatStepper },
                ],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
            },] }
];
MatStepper.ctorParameters = () => [
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
MatStepper.propDecorators = {
    _stepHeader: [{ type: ViewChildren, args: [MatStepHeader,] }],
    _steps: [{ type: ContentChildren, args: [MatStep, { descendants: true },] }],
    _icons: [{ type: ContentChildren, args: [MatStepperIcon, { descendants: true },] }],
    animationDone: [{ type: Output }],
    disableRipple: [{ type: Input }],
    color: [{ type: Input }],
    labelPosition: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUVWLHNCQUFzQixHQUV2QixNQUFNLHNCQUFzQixDQUFDO0FBRTlCLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFFUixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDdkUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGNBQWMsRUFB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QUEyRDtvQkFDL0QseUJBQXlCLEVBQUUsYUFBYTtvQkFDeEMsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2dCQUNELFVBQVUsRUFBRTtvQkFDVixvQkFBb0IsQ0FBQyx3QkFBd0I7b0JBQzdDLG9CQUFvQixDQUFDLHNCQUFzQjtpQkFDNUM7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDO29CQUM5QyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDO29CQUN4RCxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDO2lCQUN2RDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUF0S08sY0FBYyx1QkEyTWpCLFFBQVE7WUEvTFgsaUJBQWlCO1lBS2pCLFVBQVU7NENBNkxQLE1BQU0sU0FBQyxRQUFROzs7MEJBckNqQixZQUFZLFNBQUMsYUFBYTtxQkFHMUIsZUFBZSxTQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7cUJBTTVDLGVBQWUsU0FBQyxjQUFjLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQUduRCxNQUFNOzRCQUdOLEtBQUs7b0JBR0wsS0FBSzs0QkFNTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENka1N0ZXAsXG4gIENka1N0ZXBwZXIsXG4gIFN0ZXBDb250ZW50UG9zaXRpb25TdGF0ZSxcbiAgU1RFUFBFUl9HTE9CQUxfT1BUSU9OUyxcbiAgU3RlcHBlck9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXIsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7U3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01hdFN0ZXBIZWFkZXJ9IGZyb20gJy4vc3RlcC1oZWFkZXInO1xuaW1wb3J0IHtNYXRTdGVwTGFiZWx9IGZyb20gJy4vc3RlcC1sYWJlbCc7XG5pbXBvcnQge21hdFN0ZXBwZXJBbmltYXRpb25zfSBmcm9tICcuL3N0ZXBwZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdFN0ZXBwZXJJY29uLCBNYXRTdGVwcGVySWNvbkNvbnRleHR9IGZyb20gJy4vc3RlcHBlci1pY29uJztcbmltcG9ydCB7TWF0U3RlcENvbnRlbnR9IGZyb20gJy4vc3RlcC1jb250ZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXN0ZXAnLFxuICB0ZW1wbGF0ZVVybDogJ3N0ZXAuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBFcnJvclN0YXRlTWF0Y2hlciwgdXNlRXhpc3Rpbmc6IE1hdFN0ZXB9LFxuICAgIHtwcm92aWRlOiBDZGtTdGVwLCB1c2VFeGlzdGluZzogTWF0U3RlcH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0U3RlcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwIGV4dGVuZHMgQ2RrU3RlcCBpbXBsZW1lbnRzIEVycm9yU3RhdGVNYXRjaGVyLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9pc1NlbGVjdGVkID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDb250ZW50IGZvciBzdGVwIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0U3RlcExhYmVsPmAuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0U3RlcExhYmVsKSBvdmVycmlkZSBzdGVwTGFiZWw6IE1hdFN0ZXBMYWJlbDtcblxuICAvKiogVGhlbWUgY29sb3IgZm9yIHRoZSBwYXJ0aWN1bGFyIHN0ZXAuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIENvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRTdGVwQ29udGVudCwge3N0YXRpYzogZmFsc2V9KSBfbGF6eUNvbnRlbnQ6IE1hdFN0ZXBDb250ZW50O1xuXG4gIC8qKiBDdXJyZW50bHktYXR0YWNoZWQgcG9ydGFsIGNvbnRhaW5pbmcgdGhlIGxhenkgY29udGVudC4gKi9cbiAgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFN0ZXBwZXIpKSBzdGVwcGVyOiBNYXRTdGVwcGVyLFxuICAgICAgICAgICAgICBAU2tpcFNlbGYoKSBwcml2YXRlIF9lcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoU1RFUFBFUl9HTE9CQUxfT1BUSU9OUykgc3RlcHBlck9wdGlvbnM/OiBTdGVwcGVyT3B0aW9ucykge1xuICAgIHN1cGVyKHN0ZXBwZXIsIHN0ZXBwZXJPcHRpb25zKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pc1NlbGVjdGVkID0gdGhpcy5fc3RlcHBlci5zdGVwcy5jaGFuZ2VzLnBpcGUoc3dpdGNoTWFwKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGVwcGVyLnNlbGVjdGlvbkNoYW5nZS5waXBlKFxuICAgICAgICBtYXAoZXZlbnQgPT4gZXZlbnQuc2VsZWN0ZWRTdGVwID09PSB0aGlzKSxcbiAgICAgICAgc3RhcnRXaXRoKHRoaXMuX3N0ZXBwZXIuc2VsZWN0ZWQgPT09IHRoaXMpXG4gICAgICApO1xuICAgIH0pKS5zdWJzY3JpYmUoaXNTZWxlY3RlZCA9PiB7XG4gICAgICBpZiAoaXNTZWxlY3RlZCAmJiB0aGlzLl9sYXp5Q29udGVudCAmJiAhdGhpcy5fcG9ydGFsKSB7XG4gICAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLl9sYXp5Q29udGVudC5fdGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2lzU2VsZWN0ZWQudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBDdXN0b20gZXJyb3Igc3RhdGUgbWF0Y2hlciB0aGF0IGFkZGl0aW9uYWxseSBjaGVja3MgZm9yIHZhbGlkaXR5IG9mIGludGVyYWN0ZWQgZm9ybS4gKi9cbiAgaXNFcnJvclN0YXRlKGNvbnRyb2w6IEZvcm1Db250cm9sIHwgbnVsbCwgZm9ybTogRm9ybUdyb3VwRGlyZWN0aXZlIHwgTmdGb3JtIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRXJyb3JTdGF0ZSA9IHRoaXMuX2Vycm9yU3RhdGVNYXRjaGVyLmlzRXJyb3JTdGF0ZShjb250cm9sLCBmb3JtKTtcblxuICAgIC8vIEN1c3RvbSBlcnJvciBzdGF0ZSBjaGVja3MgZm9yIHRoZSB2YWxpZGl0eSBvZiBmb3JtIHRoYXQgaXMgbm90IHN1Ym1pdHRlZCBvciB0b3VjaGVkXG4gICAgLy8gc2luY2UgdXNlciBjYW4gdHJpZ2dlciBhIGZvcm0gY2hhbmdlIGJ5IGNhbGxpbmcgZm9yIGFub3RoZXIgc3RlcCB3aXRob3V0IGRpcmVjdGx5XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgY3VycmVudCBmb3JtLlxuICAgIGNvbnN0IGN1c3RvbUVycm9yU3RhdGUgPSAhIShjb250cm9sICYmIGNvbnRyb2wuaW52YWxpZCAmJiB0aGlzLmludGVyYWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsRXJyb3JTdGF0ZSB8fCBjdXN0b21FcnJvclN0YXRlO1xuICB9XG59XG5cbi8qKlxuICogUHJveGllcyB0aGUgcHVibGljIEFQSXMgZnJvbSBgTWF0U3RlcHBlcmAgdG8gdGhlIGRlcHJlY2F0ZWQgYE1hdEhvcml6b250YWxTdGVwcGVyYCBhbmRcbiAqIGBNYXRWZXJ0aWNhbFN0ZXBwZXJgLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTdGVwcGVyYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBfTWF0UHJveHlTdGVwcGVyQmFzZSBleHRlbmRzIENka1N0ZXBwZXIge1xuICBvdmVycmlkZSByZWFkb25seSBzdGVwczogUXVlcnlMaXN0PE1hdFN0ZXA+O1xuICByZWFkb25seSBhbmltYXRpb25Eb25lOiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG4gIGxhYmVsUG9zaXRpb246ICdib3R0b20nIHwgJ2VuZCc7XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTdGVwcGVyYCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdtYXQtaG9yaXpvbnRhbC1zdGVwcGVyJ30pXG5leHBvcnQgY2xhc3MgTWF0SG9yaXpvbnRhbFN0ZXBwZXIgZXh0ZW5kcyBfTWF0UHJveHlTdGVwcGVyQmFzZSB7fVxuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U3RlcHBlcmAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTMuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbWF0LXZlcnRpY2FsLXN0ZXBwZXInfSlcbmV4cG9ydCBjbGFzcyBNYXRWZXJ0aWNhbFN0ZXBwZXIgZXh0ZW5kcyBfTWF0UHJveHlTdGVwcGVyQmFzZSB7fVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zdGVwcGVyLCBtYXQtdmVydGljYWwtc3RlcHBlciwgbWF0LWhvcml6b250YWwtc3RlcHBlciwgW21hdFN0ZXBwZXJdJyxcbiAgZXhwb3J0QXM6ICdtYXRTdGVwcGVyLCBtYXRWZXJ0aWNhbFN0ZXBwZXIsIG1hdEhvcml6b250YWxTdGVwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdzdGVwcGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc3RlcHBlci5jc3MnXSxcbiAgaW5wdXRzOiBbJ3NlbGVjdGVkSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubWF0LXN0ZXBwZXItaG9yaXpvbnRhbF0nOiAnb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLXZlcnRpY2FsXSc6ICdvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWVuZF0nOlxuICAgICAgICAnb3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIGxhYmVsUG9zaXRpb24gPT0gXCJlbmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtc3RlcHBlci1sYWJlbC1wb3NpdGlvbi1ib3R0b21dJzpcbiAgICAgICAgJ29yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBsYWJlbFBvc2l0aW9uID09IFwiYm90dG9tXCInLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6ICdvcmllbnRhdGlvbicsXG4gICAgJ3JvbGUnOiAndGFibGlzdCcsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTdGVwcGVyQW5pbWF0aW9ucy5ob3Jpem9udGFsU3RlcFRyYW5zaXRpb24sXG4gICAgbWF0U3RlcHBlckFuaW1hdGlvbnMudmVydGljYWxTdGVwVHJhbnNpdGlvbixcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IENka1N0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogTWF0SG9yaXpvbnRhbFN0ZXBwZXIsIHVzZUV4aXN0aW5nOiBNYXRTdGVwcGVyfSxcbiAgICB7cHJvdmlkZTogTWF0VmVydGljYWxTdGVwcGVyLCB1c2VFeGlzdGluZzogTWF0U3RlcHBlcn0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyIGV4dGVuZHMgQ2RrU3RlcHBlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAvKiogVGhlIGxpc3Qgb2Ygc3RlcCBoZWFkZXJzIG9mIHRoZSBzdGVwcyBpbiB0aGUgc3RlcHBlci4gKi9cbiAgQFZpZXdDaGlsZHJlbihNYXRTdGVwSGVhZGVyKSBvdmVycmlkZSBfc3RlcEhlYWRlcjogUXVlcnlMaXN0PE1hdFN0ZXBIZWFkZXI+O1xuXG4gIC8qKiBGdWxsIGxpc3Qgb2Ygc3RlcHMgaW5zaWRlIHRoZSBzdGVwcGVyLCBpbmNsdWRpbmcgaW5zaWRlIG5lc3RlZCBzdGVwcGVycy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdGVwLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvdmVycmlkZSBfc3RlcHM6IFF1ZXJ5TGlzdDxNYXRTdGVwPjtcblxuICAvKiogU3RlcHMgdGhhdCBiZWxvbmcgdG8gdGhlIGN1cnJlbnQgc3RlcHBlciwgZXhjbHVkaW5nIG9uZXMgZnJvbSBuZXN0ZWQgc3RlcHBlcnMuICovXG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN0ZXBzOiBRdWVyeUxpc3Q8TWF0U3RlcD4gPSBuZXcgUXVlcnlMaXN0PE1hdFN0ZXA+KCk7XG5cbiAgLyoqIEN1c3RvbSBpY29uIG92ZXJyaWRlcyBwYXNzZWQgaW4gYnkgdGhlIGNvbnN1bWVyLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN0ZXBwZXJJY29uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaWNvbnM6IFF1ZXJ5TGlzdDxNYXRTdGVwcGVySWNvbj47XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY3VycmVudCBzdGVwIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbi4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIHNob3VsZCBiZSBkaXNhYmxlZCBmb3IgdGhlIHN0ZXAgaGVhZGVycy4gKi9cbiAgQElucHV0KCkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogVGhlbWUgY29sb3IgZm9yIGFsbCBvZiB0aGUgc3RlcHMgaW4gc3RlcHBlci4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGRpc3BsYXkgaW4gYm90dG9tIG9yIGVuZCBwb3NpdGlvbi5cbiAgICogT25seSBhcHBsaWVzIGluIHRoZSBgaG9yaXpvbnRhbGAgb3JpZW50YXRpb24uXG4gICAqL1xuICBASW5wdXQoKVxuICBsYWJlbFBvc2l0aW9uOiAnYm90dG9tJyB8ICdlbmQnID0gJ2VuZCc7XG5cbiAgLyoqIENvbnN1bWVyLXNwZWNpZmllZCB0ZW1wbGF0ZS1yZWZzIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGhlYWRlciBpY29ucy4gKi9cbiAgX2ljb25PdmVycmlkZXM6IFJlY29yZDxzdHJpbmcsIFRlbXBsYXRlUmVmPE1hdFN0ZXBwZXJJY29uQ29udGV4dD4+ID0ge307XG5cbiAgLyoqIFN0cmVhbSBvZiBhbmltYXRpb24gYGRvbmVgIGV2ZW50cyB3aGVuIHRoZSBib2R5IGV4cGFuZHMvY29sbGFwc2VzLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55KSB7XG4gICAgc3VwZXIoZGlyLCBjaGFuZ2VEZXRlY3RvclJlZiwgZWxlbWVudFJlZiwgX2RvY3VtZW50KTtcbiAgICBjb25zdCBub2RlTmFtZSA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBub2RlTmFtZSA9PT0gJ21hdC12ZXJ0aWNhbC1zdGVwcGVyJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gICAgdGhpcy5faWNvbnMuZm9yRWFjaCgoe25hbWUsIHRlbXBsYXRlUmVmfSkgPT4gdGhpcy5faWNvbk92ZXJyaWRlc1tuYW1lXSA9IHRlbXBsYXRlUmVmKTtcblxuICAgIC8vIE1hcmsgdGhlIGNvbXBvbmVudCBmb3IgY2hhbmdlIGRldGVjdGlvbiB3aGVuZXZlciB0aGUgY29udGVudCBjaGlsZHJlbiBxdWVyeSBjaGFuZ2VzXG4gICAgdGhpcy5zdGVwcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9zdGF0ZUNoYW5nZWQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUucGlwZShcbiAgICAgIC8vIFRoaXMgbmVlZHMgYSBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGluIG9yZGVyIHRvIGF2b2lkIGVtaXR0aW5nIHRoZSBzYW1lIGV2ZW50IHR3aWNlIGR1ZVxuICAgICAgLy8gdG8gYSBidWcgaW4gYW5pbWF0aW9ucyB3aGVyZSB0aGUgYC5kb25lYCBjYWxsYmFjayBnZXRzIGludm9rZWQgdHdpY2Ugb24gc29tZSBicm93c2Vycy5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKVxuICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmICgoZXZlbnQudG9TdGF0ZSBhcyBTdGVwQ29udGVudFBvc2l0aW9uU3RhdGUpID09PSAnY3VycmVudCcpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25Eb25lLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9zdGVwSXNOYXZpZ2FibGUoaW5kZXg6IG51bWJlciwgc3RlcDogTWF0U3RlcCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdGVwLmNvbXBsZXRlZCB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPT09IGluZGV4IHx8ICF0aGlzLmxpbmVhcjtcbiAgfVxufVxuIl19