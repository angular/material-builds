import { __decorate, __metadata, __param } from 'tslib';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepLabel, CdkStepHeader, CdkStep, STEPPER_GLOBAL_OPTIONS, CdkStepper, CdkStepperNext, CdkStepperPrevious, CdkStepperModule } from '@angular/cdk/stepper';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Directive, ɵɵdefineInjectable, Injectable, Optional, SkipSelf, Input, Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, TemplateRef, ContentChild, Inject, forwardRef, EventEmitter, ViewChildren, QueryList, ContentChildren, Output, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let MatStepLabel = /** @class */ (() => {
    let MatStepLabel = class MatStepLabel extends CdkStepLabel {
    };
    MatStepLabel = __decorate([
        Directive({
            selector: '[matStepLabel]',
        })
    ], MatStepLabel);
    return MatStepLabel;
})();

/** Stepper data that is required for internationalization. */
let MatStepperIntl = /** @class */ (() => {
    let MatStepperIntl = class MatStepperIntl {
        constructor() {
            /**
             * Stream that emits whenever the labels here are changed. Use this to notify
             * components if the labels have changed after initialization.
             */
            this.changes = new Subject();
            /** Label that is rendered below optional steps. */
            this.optionalLabel = 'Optional';
        }
    };
    MatStepperIntl.ɵprov = ɵɵdefineInjectable({ factory: function MatStepperIntl_Factory() { return new MatStepperIntl(); }, token: MatStepperIntl, providedIn: "root" });
    MatStepperIntl = __decorate([
        Injectable({ providedIn: 'root' })
    ], MatStepperIntl);
    return MatStepperIntl;
})();
/** @docs-private */
function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/** @docs-private */
const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let MatStepHeader = /** @class */ (() => {
    let MatStepHeader = class MatStepHeader extends CdkStepHeader {
        constructor(_intl, _focusMonitor, _elementRef, changeDetectorRef) {
            super(_elementRef);
            this._intl = _intl;
            this._focusMonitor = _focusMonitor;
            _focusMonitor.monitor(_elementRef, true);
            this._intlSubscription = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
        }
        ngOnDestroy() {
            this._intlSubscription.unsubscribe();
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        /** Focuses the step header. */
        focus() {
            this._focusMonitor.focusVia(this._elementRef, 'program');
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
                optional: this.optional
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
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatStepHeader.prototype, "state", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatStepHeader.prototype, "label", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatStepHeader.prototype, "errorMessage", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatStepHeader.prototype, "iconOverrides", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], MatStepHeader.prototype, "index", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "selected", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "active", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "optional", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MatStepHeader.prototype, "disableRipple", void 0);
    MatStepHeader = __decorate([
        Component({
            selector: 'mat-step-header',
            template: "<div class=\"mat-step-header-ripple\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\" [ngSwitch]=\"!!(iconOverrides && iconOverrides[state])\">\n    <ng-container\n      *ngSwitchCase=\"true\"\n      [ngTemplateOutlet]=\"iconOverrides[state]\"\n      [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    <ng-container *ngSwitchDefault [ngSwitch]=\"state\">\n      <span *ngSwitchCase=\"'number'\">{{_getDefaultTextForState(state)}}</span>\n      <mat-icon *ngSwitchDefault>{{_getDefaultTextForState(state)}}</mat-icon>\n    </ng-container>\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  <!-- If there is a label template, use it. -->\n  <ng-container *ngIf=\"_templateLabel()\" [ngTemplateOutlet]=\"_templateLabel()!.template\">\n  </ng-container>\n  <!-- If there is no label template, fall back to the text label. -->\n  <div class=\"mat-step-text-label\" *ngIf=\"_stringLabel()\">{{label}}</div>\n\n  <div class=\"mat-step-optional\" *ngIf=\"optional && state != 'error'\">{{_intl.optionalLabel}}</div>\n  <div class=\"mat-step-sub-label-error\" *ngIf=\"state == 'error'\">{{errorMessage}}</div>\n</div>\n\n",
            host: {
                'class': 'mat-step-header mat-focus-indicator',
                'role': 'tab',
            },
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:transparent}.mat-step-optional,.mat-step-sub-label-error{font-size:12px}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative}.mat-step-icon-content,.mat-step-icon .mat-icon{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
        }),
        __metadata("design:paramtypes", [MatStepperIntl,
            FocusMonitor,
            ElementRef,
            ChangeDetectorRef])
    ], MatStepHeader);
    return MatStepHeader;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Animations used by the Material steppers.
 * @docs-private
 */
const matStepperAnimations = {
    /** Animation that transitions the step along the X axis in a horizontal stepper. */
    horizontalStepTransition: trigger('stepTransition', [
        state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
        state('current', style({ transform: 'none', visibility: 'visible' })),
        state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
        transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),
    /** Animation that transitions the step along the Y axis in a vertical stepper. */
    verticalStepTransition: trigger('stepTransition', [
        state('previous', style({ height: '0px', visibility: 'hidden' })),
        state('next', style({ height: '0px', visibility: 'hidden' })),
        state('current', style({ height: '*', visibility: 'visible' })),
        transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Template to be used to override the icons inside the step header.
 */
let MatStepperIcon = /** @class */ (() => {
    let MatStepperIcon = class MatStepperIcon {
        constructor(templateRef) {
            this.templateRef = templateRef;
        }
    };
    __decorate([
        Input('matStepperIcon'),
        __metadata("design:type", String)
    ], MatStepperIcon.prototype, "name", void 0);
    MatStepperIcon = __decorate([
        Directive({
            selector: 'ng-template[matStepperIcon]',
        }),
        __metadata("design:paramtypes", [TemplateRef])
    ], MatStepperIcon);
    return MatStepperIcon;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Button that moves to the next step in a stepper workflow. */
let MatStepperNext = /** @class */ (() => {
    let MatStepperNext = class MatStepperNext extends CdkStepperNext {
    };
    MatStepperNext = __decorate([
        Directive({
            selector: 'button[matStepperNext]',
            host: {
                '[type]': 'type',
            },
            inputs: ['type']
        })
    ], MatStepperNext);
    return MatStepperNext;
})();
/** Button that moves to the previous step in a stepper workflow. */
let MatStepperPrevious = /** @class */ (() => {
    let MatStepperPrevious = class MatStepperPrevious extends CdkStepperPrevious {
    };
    MatStepperPrevious = __decorate([
        Directive({
            selector: 'button[matStepperPrevious]',
            host: {
                '[type]': 'type',
            },
            inputs: ['type']
        })
    ], MatStepperPrevious);
    return MatStepperPrevious;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let MatStepperModule = /** @class */ (() => {
    let MatStepperModule = class MatStepperModule {
    };
    MatStepperModule = __decorate([
        NgModule({
            imports: [
                MatCommonModule,
                CommonModule,
                PortalModule,
                MatButtonModule,
                CdkStepperModule,
                MatIconModule,
                MatRippleModule,
            ],
            exports: [
                MatCommonModule,
                MatHorizontalStepper,
                MatVerticalStepper,
                MatStep,
                MatStepLabel,
                MatStepper,
                MatStepperNext,
                MatStepperPrevious,
                MatStepHeader,
                MatStepperIcon,
            ],
            declarations: [
                MatHorizontalStepper,
                MatVerticalStepper,
                MatStep,
                MatStepLabel,
                MatStepper,
                MatStepperNext,
                MatStepperPrevious,
                MatStepHeader,
                MatStepperIcon,
            ],
            providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher],
        })
    ], MatStepperModule);
    return MatStepperModule;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MAT_STEPPER_INTL_PROVIDER, MAT_STEPPER_INTL_PROVIDER_FACTORY, MatHorizontalStepper, MatStep, MatStepHeader, MatStepLabel, MatStepper, MatStepperIcon, MatStepperIntl, MatStepperModule, MatStepperNext, MatStepperPrevious, MatVerticalStepper, matStepperAnimations };
//# sourceMappingURL=stepper.js.map
