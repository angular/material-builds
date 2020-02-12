(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/portal'), require('@angular/cdk/stepper'), require('@angular/common'), require('@angular/core'), require('@angular/material/button'), require('@angular/material/core'), require('@angular/material/icon'), require('tslib'), require('@angular/cdk/a11y'), require('rxjs'), require('@angular/cdk/bidi'), require('rxjs/operators'), require('@angular/animations')) :
    typeof define === 'function' && define.amd ? define('@angular/material/stepper', ['exports', '@angular/cdk/portal', '@angular/cdk/stepper', '@angular/common', '@angular/core', '@angular/material/button', '@angular/material/core', '@angular/material/icon', 'tslib', '@angular/cdk/a11y', 'rxjs', '@angular/cdk/bidi', 'rxjs/operators', '@angular/animations'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.stepper = {}), global.ng.cdk.portal, global.ng.cdk.stepper, global.ng.common, global.ng.core, global.ng.material.button, global.ng.material.core, global.ng.material.icon, global.tslib, global.ng.cdk.a11y, global.rxjs, global.ng.cdk.bidi, global.rxjs.operators, global.ng.animations));
}(this, (function (exports, portal, stepper, common, i0, button, core, icon, tslib, a11y, rxjs, bidi, operators, animations) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatStepLabel = /** @class */ (function (_super) {
        tslib.__extends(MatStepLabel, _super);
        function MatStepLabel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatStepLabel.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[matStepLabel]',
                    },] }
        ];
        return MatStepLabel;
    }(stepper.CdkStepLabel));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Stepper data that is required for internationalization. */
    var MatStepperIntl = /** @class */ (function () {
        function MatStepperIntl() {
            /**
             * Stream that emits whenever the labels here are changed. Use this to notify
             * components if the labels have changed after initialization.
             */
            this.changes = new rxjs.Subject();
            /** Label that is rendered below optional steps. */
            this.optionalLabel = 'Optional';
        }
        MatStepperIntl.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] }
        ];
        MatStepperIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function MatStepperIntl_Factory() { return new MatStepperIntl(); }, token: MatStepperIntl, providedIn: "root" });
        return MatStepperIntl;
    }());
    /** @docs-private */
    function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
        return parentIntl || new MatStepperIntl();
    }
    /** @docs-private */
    var MAT_STEPPER_INTL_PROVIDER = {
        provide: MatStepperIntl,
        deps: [[new i0.Optional(), new i0.SkipSelf(), MatStepperIntl]],
        useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatStepHeader = /** @class */ (function (_super) {
        tslib.__extends(MatStepHeader, _super);
        function MatStepHeader(_intl, _focusMonitor, _elementRef, changeDetectorRef) {
            var _this = _super.call(this, _elementRef) || this;
            _this._intl = _intl;
            _this._focusMonitor = _focusMonitor;
            _focusMonitor.monitor(_elementRef, true);
            _this._intlSubscription = _intl.changes.subscribe(function () { return changeDetectorRef.markForCheck(); });
            return _this;
        }
        MatStepHeader.prototype.ngOnDestroy = function () {
            this._intlSubscription.unsubscribe();
            this._focusMonitor.stopMonitoring(this._elementRef);
        };
        /** Focuses the step header. */
        MatStepHeader.prototype.focus = function () {
            this._focusMonitor.focusVia(this._elementRef, 'program');
        };
        /** Returns string label of given step if it is a text label. */
        MatStepHeader.prototype._stringLabel = function () {
            return this.label instanceof MatStepLabel ? null : this.label;
        };
        /** Returns MatStepLabel if the label of given step is a template label. */
        MatStepHeader.prototype._templateLabel = function () {
            return this.label instanceof MatStepLabel ? this.label : null;
        };
        /** Returns the host HTML element. */
        MatStepHeader.prototype._getHostElement = function () {
            return this._elementRef.nativeElement;
        };
        /** Template context variables that are exposed to the `matStepperIcon` instances. */
        MatStepHeader.prototype._getIconContext = function () {
            return {
                index: this.index,
                active: this.active,
                optional: this.optional
            };
        };
        MatStepHeader.prototype._getDefaultTextForState = function (state) {
            if (state == 'number') {
                return "" + (this.index + 1);
            }
            if (state == 'edit') {
                return 'create';
            }
            if (state == 'error') {
                return 'warning';
            }
            return state;
        };
        MatStepHeader.decorators = [
            { type: i0.Component, args: [{
                        selector: 'mat-step-header',
                        template: "<div class=\"mat-step-header-ripple\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\" [ngSwitch]=\"!!(iconOverrides && iconOverrides[state])\">\n    <ng-container\n      *ngSwitchCase=\"true\"\n      [ngTemplateOutlet]=\"iconOverrides[state]\"\n      [ngTemplateOutletContext]=\"_getIconContext()\"></ng-container>\n    <ng-container *ngSwitchDefault [ngSwitch]=\"state\">\n      <span *ngSwitchCase=\"'number'\">{{_getDefaultTextForState(state)}}</span>\n      <mat-icon *ngSwitchDefault>{{_getDefaultTextForState(state)}}</mat-icon>\n    </ng-container>\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  <!-- If there is a label template, use it. -->\n  <ng-container *ngIf=\"_templateLabel()\" [ngTemplateOutlet]=\"_templateLabel()!.template\">\n  </ng-container>\n  <!-- If there is no label template, fall back to the text label. -->\n  <div class=\"mat-step-text-label\" *ngIf=\"_stringLabel()\">{{label}}</div>\n\n  <div class=\"mat-step-optional\" *ngIf=\"optional && state != 'error'\">{{_intl.optionalLabel}}</div>\n  <div class=\"mat-step-sub-label-error\" *ngIf=\"state == 'error'\">{{errorMessage}}</div>\n</div>\n\n",
                        host: {
                            'class': 'mat-step-header mat-focus-indicator',
                            'role': 'tab',
                        },
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:transparent}.mat-step-optional,.mat-step-sub-label-error{font-size:12px}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative}.mat-step-icon-content,.mat-step-icon .mat-icon{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatStepHeader.ctorParameters = function () { return [
            { type: MatStepperIntl },
            { type: a11y.FocusMonitor },
            { type: i0.ElementRef },
            { type: i0.ChangeDetectorRef }
        ]; };
        MatStepHeader.propDecorators = {
            state: [{ type: i0.Input }],
            label: [{ type: i0.Input }],
            errorMessage: [{ type: i0.Input }],
            iconOverrides: [{ type: i0.Input }],
            index: [{ type: i0.Input }],
            selected: [{ type: i0.Input }],
            active: [{ type: i0.Input }],
            optional: [{ type: i0.Input }],
            disableRipple: [{ type: i0.Input }]
        };
        return MatStepHeader;
    }(stepper.CdkStepHeader));

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
    var matStepperAnimations = {
        /** Animation that transitions the step along the X axis in a horizontal stepper. */
        horizontalStepTransition: animations.trigger('stepTransition', [
            animations.state('previous', animations.style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
            animations.state('current', animations.style({ transform: 'none', visibility: 'visible' })),
            animations.state('next', animations.style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
            animations.transition('* => *', animations.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
        ]),
        /** Animation that transitions the step along the Y axis in a vertical stepper. */
        verticalStepTransition: animations.trigger('stepTransition', [
            animations.state('previous', animations.style({ height: '0px', visibility: 'hidden' })),
            animations.state('next', animations.style({ height: '0px', visibility: 'hidden' })),
            animations.state('current', animations.style({ height: '*', visibility: 'visible' })),
            animations.transition('* <=> current', animations.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
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
    var MatStepperIcon = /** @class */ (function () {
        function MatStepperIcon(templateRef) {
            this.templateRef = templateRef;
        }
        MatStepperIcon.decorators = [
            { type: i0.Directive, args: [{
                        selector: 'ng-template[matStepperIcon]',
                    },] }
        ];
        /** @nocollapse */
        MatStepperIcon.ctorParameters = function () { return [
            { type: i0.TemplateRef }
        ]; };
        MatStepperIcon.propDecorators = {
            name: [{ type: i0.Input, args: ['matStepperIcon',] }]
        };
        return MatStepperIcon;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatStep = /** @class */ (function (_super) {
        tslib.__extends(MatStep, _super);
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
            { type: i0.Component, args: [{
                        selector: 'mat-step',
                        template: "<ng-template><ng-content></ng-content></ng-template>\n",
                        providers: [
                            { provide: core.ErrorStateMatcher, useExisting: MatStep },
                            { provide: stepper.CdkStep, useExisting: MatStep },
                        ],
                        encapsulation: i0.ViewEncapsulation.None,
                        exportAs: 'matStep',
                        changeDetection: i0.ChangeDetectionStrategy.OnPush
                    }] }
        ];
        /** @nocollapse */
        MatStep.ctorParameters = function () { return [
            { type: MatStepper, decorators: [{ type: i0.Inject, args: [i0.forwardRef(function () { return MatStepper; }),] }] },
            { type: core.ErrorStateMatcher, decorators: [{ type: i0.SkipSelf }] },
            { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [stepper.STEPPER_GLOBAL_OPTIONS,] }] }
        ]; };
        MatStep.propDecorators = {
            stepLabel: [{ type: i0.ContentChild, args: [MatStepLabel,] }]
        };
        return MatStep;
    }(stepper.CdkStep));
    var MatStepper = /** @class */ (function (_super) {
        tslib.__extends(MatStepper, _super);
        function MatStepper() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Event emitted when the current step is done transitioning in. */
            _this.animationDone = new i0.EventEmitter();
            /** Consumer-specified template-refs to be used to override the header icons. */
            _this._iconOverrides = {};
            /** Stream of animation `done` events when the body expands/collapses. */
            _this._animationDone = new rxjs.Subject();
            return _this;
        }
        MatStepper.prototype.ngAfterContentInit = function () {
            var _this = this;
            this._icons.forEach(function (_a) {
                var name = _a.name, templateRef = _a.templateRef;
                return _this._iconOverrides[name] = templateRef;
            });
            // Mark the component for change detection whenever the content children query changes
            this._steps.changes.pipe(operators.takeUntil(this._destroyed)).subscribe(function () {
                _this._stateChanged();
            });
            this._animationDone.pipe(
            // This needs a `distinctUntilChanged` in order to avoid emitting the same event twice due
            // to a bug in animations where the `.done` callback gets invoked twice on some browsers.
            // See https://github.com/angular/angular/issues/24084
            operators.distinctUntilChanged(function (x, y) { return x.fromState === y.fromState && x.toState === y.toState; }), operators.takeUntil(this._destroyed)).subscribe(function (event) {
                if (event.toState === 'current') {
                    _this.animationDone.emit();
                }
            });
        };
        MatStepper.decorators = [
            { type: i0.Directive, args: [{ selector: '[matStepper]', providers: [{ provide: stepper.CdkStepper, useExisting: MatStepper }] },] }
        ];
        MatStepper.propDecorators = {
            _stepHeader: [{ type: i0.ViewChildren, args: [MatStepHeader,] }],
            _steps: [{ type: i0.ContentChildren, args: [MatStep, { descendants: true },] }],
            _icons: [{ type: i0.ContentChildren, args: [MatStepperIcon, { descendants: true },] }],
            animationDone: [{ type: i0.Output }],
            disableRipple: [{ type: i0.Input }]
        };
        return MatStepper;
    }(stepper.CdkStepper));
    var MatHorizontalStepper = /** @class */ (function (_super) {
        tslib.__extends(MatHorizontalStepper, _super);
        function MatHorizontalStepper() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Whether the label should display in bottom or end position. */
            _this.labelPosition = 'end';
            return _this;
        }
        MatHorizontalStepper.decorators = [
            { type: i0.Component, args: [{
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
                            { provide: stepper.CdkStepper, useExisting: MatHorizontalStepper }
                        ],
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:36px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;top:36px;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto;padding:24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                    }] }
        ];
        MatHorizontalStepper.propDecorators = {
            labelPosition: [{ type: i0.Input }]
        };
        return MatHorizontalStepper;
    }(MatStepper));
    var MatVerticalStepper = /** @class */ (function (_super) {
        tslib.__extends(MatVerticalStepper, _super);
        function MatVerticalStepper(dir, changeDetectorRef, 
        // @breaking-change 8.0.0 `elementRef` and `_document` parameters to become required.
        elementRef, _document) {
            var _this = _super.call(this, dir, changeDetectorRef, elementRef, _document) || this;
            _this._orientation = 'vertical';
            return _this;
        }
        MatVerticalStepper.decorators = [
            { type: i0.Component, args: [{
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
                            { provide: stepper.CdkStepper, useExisting: MatVerticalStepper }
                        ],
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:36px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;top:36px;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto;padding:24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;padding:24px;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:\"\";position:absolute;top:-16px;bottom:-16px;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatVerticalStepper.ctorParameters = function () { return [
            { type: bidi.Directionality, decorators: [{ type: i0.Optional }] },
            { type: i0.ChangeDetectorRef },
            { type: i0.ElementRef },
            { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] }
        ]; };
        return MatVerticalStepper;
    }(MatStepper));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Button that moves to the next step in a stepper workflow. */
    var MatStepperNext = /** @class */ (function (_super) {
        tslib.__extends(MatStepperNext, _super);
        function MatStepperNext() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatStepperNext.decorators = [
            { type: i0.Directive, args: [{
                        selector: 'button[matStepperNext]',
                        host: {
                            '[type]': 'type',
                        },
                        inputs: ['type']
                    },] }
        ];
        return MatStepperNext;
    }(stepper.CdkStepperNext));
    /** Button that moves to the previous step in a stepper workflow. */
    var MatStepperPrevious = /** @class */ (function (_super) {
        tslib.__extends(MatStepperPrevious, _super);
        function MatStepperPrevious() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatStepperPrevious.decorators = [
            { type: i0.Directive, args: [{
                        selector: 'button[matStepperPrevious]',
                        host: {
                            '[type]': 'type',
                        },
                        inputs: ['type']
                    },] }
        ];
        return MatStepperPrevious;
    }(stepper.CdkStepperPrevious));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatStepperModule = /** @class */ (function () {
        function MatStepperModule() {
        }
        MatStepperModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            core.MatCommonModule,
                            common.CommonModule,
                            portal.PortalModule,
                            button.MatButtonModule,
                            stepper.CdkStepperModule,
                            icon.MatIconModule,
                            core.MatRippleModule,
                        ],
                        exports: [
                            core.MatCommonModule,
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
                        providers: [MAT_STEPPER_INTL_PROVIDER, core.ErrorStateMatcher],
                    },] }
        ];
        return MatStepperModule;
    }());

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

    exports.MAT_STEPPER_INTL_PROVIDER = MAT_STEPPER_INTL_PROVIDER;
    exports.MAT_STEPPER_INTL_PROVIDER_FACTORY = MAT_STEPPER_INTL_PROVIDER_FACTORY;
    exports.MatHorizontalStepper = MatHorizontalStepper;
    exports.MatStep = MatStep;
    exports.MatStepHeader = MatStepHeader;
    exports.MatStepLabel = MatStepLabel;
    exports.MatStepper = MatStepper;
    exports.MatStepperIcon = MatStepperIcon;
    exports.MatStepperIntl = MatStepperIntl;
    exports.MatStepperModule = MatStepperModule;
    exports.MatStepperNext = MatStepperNext;
    exports.MatStepperPrevious = MatStepperPrevious;
    exports.MatVerticalStepper = MatVerticalStepper;
    exports.matStepperAnimations = matStepperAnimations;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-stepper.umd.js.map
