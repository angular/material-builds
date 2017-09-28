import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { ElementRef, QueryList } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorOptions } from '@angular/material/core';
import { MatStepLabel } from './step-label';
/** Workaround for https://github.com/angular/angular/issues/17849 */
export declare const _MatStep: typeof CdkStep;
export declare const _MatStepper: typeof CdkStepper;
export declare class MatStep extends _MatStep implements ErrorOptions {
    /** Content for step label given by <ng-template matStepLabel>. */
    stepLabel: MatStepLabel;
    /** Original ErrorStateMatcher that checks the validity of form control. */
    private _originalErrorStateMatcher;
    constructor(stepper: MatStepper, errorOptions: ErrorOptions);
    /** Custom error state matcher that additionally checks for validity of interacted form. */
    errorStateMatcher: (control: FormControl, form: FormGroupDirective | NgForm) => boolean;
}
export declare class MatStepper extends _MatStepper {
    /** The list of step headers of the steps in the stepper. */
    _stepHeader: QueryList<ElementRef>;
    /** Steps that the stepper holds. */
    _steps: QueryList<MatStep>;
}
export declare class MatHorizontalStepper extends MatStepper {
}
export declare class MatVerticalStepper extends MatStepper {
}
