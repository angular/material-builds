import * as i0 from '@angular/core';
import { Injectable } from '@angular/core';

/** Error state matcher that matches when a control is invalid and dirty. */
class ShowOnDirtyErrorStateMatcher {
    isErrorState(control, form) {
        return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ShowOnDirtyErrorStateMatcher, decorators: [{
            type: Injectable
        }] });
/** Provider that defines how form controls behave with regards to displaying error messages. */
class ErrorStateMatcher {
    isErrorState(control, form) {
        return !!(control && control.invalid && (control.touched || (form && form.submitted)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ErrorStateMatcher, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ErrorStateMatcher, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: ErrorStateMatcher, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

export { ErrorStateMatcher as E, ShowOnDirtyErrorStateMatcher as S };
//# sourceMappingURL=error-options-aca21924.mjs.map
