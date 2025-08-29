import { MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix } from './form-field2.mjs';
export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatFormFieldControl, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError } from './form-field2.mjs';
import { ObserversModule } from '@angular/cdk/observers';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatCommonModule } from './common-module.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './animation.mjs';
import '@angular/cdk/layout';

class MatFormFieldModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule,
            MatFormField,
            MatLabel,
            MatError,
            MatHint,
            MatPrefix,
            MatSuffix], exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule,
            MatFormField, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MatCommonModule,
                        ObserversModule,
                        MatFormField,
                        MatLabel,
                        MatError,
                        MatHint,
                        MatPrefix,
                        MatSuffix,
                    ],
                    exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule],
                }]
        }] });

export { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel, MatPrefix, MatSuffix };
//# sourceMappingURL=form-field.mjs.map
