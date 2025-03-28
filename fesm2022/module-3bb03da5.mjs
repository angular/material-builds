import { ObserversModule } from '@angular/cdk/observers';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { k as MatFormField, b as MatLabel, d as MatError, e as MatHint, g as MatPrefix, i as MatSuffix } from './form-field-0a6b3078.mjs';
import { M as MatCommonModule } from './common-module-5a9c16bb.mjs';

class MatFormFieldModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.0", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule,
            MatFormField,
            MatLabel,
            MatError,
            MatHint,
            MatPrefix,
            MatSuffix], exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatFormFieldModule, decorators: [{
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

export { MatFormFieldModule as M };
//# sourceMappingURL=module-3bb03da5.mjs.map
