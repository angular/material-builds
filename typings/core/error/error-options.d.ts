import { FormGroupDirective, NgForm, NgControl } from '@angular/forms';
/** Error state matcher that matches when a control is invalid and dirty. */
export declare class ShowOnDirtyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: NgControl | null, form: FormGroupDirective | NgForm | null): boolean;
}
/** Provider that defines how form controls behave with regards to displaying error messages. */
export declare class ErrorStateMatcher {
    isErrorState(control: NgControl | null, form: FormGroupDirective | NgForm | null): boolean;
}
