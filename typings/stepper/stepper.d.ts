/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { ElementRef, QueryList } from '@angular/core';
import { MdStepLabel } from './step-label';
import { ErrorOptions } from '../core/error/error-options';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MdStep: typeof CdkStep;
export declare const _MdStepper: typeof CdkStepper;
export declare class MdStep extends _MdStep implements ErrorOptions {
    /** Content for step label given by <ng-template matStepLabel> or <ng-template mdStepLabel>. */
    stepLabel: MdStepLabel;
    /** Original ErrorStateMatcher that checks the validity of form control. */
    private _originalErrorStateMatcher;
    constructor(mdStepper: MdStepper, errorOptions: ErrorOptions);
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    errorStateMatcher: (control: FormControl, form: FormGroupDirective | NgForm) => boolean;
}
export declare class MdStepper extends _MdStepper {
    /** The list of step headers of the steps in the stepper. */
    _stepHeader: QueryList<ElementRef>;
    /** Steps that the stepper holds. */
    _steps: QueryList<MdStep>;
}
export declare class MdHorizontalStepper extends MdStepper {
}
export declare class MdVerticalStepper extends MdStepper {
}
