import { ObserversModule } from '@angular/cdk/observers';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix } from './form-field-CTjHMEpL.mjs';
import { MatCommonModule } from './common-module-BTLyTce6.mjs';

class MatFormFieldModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule,
            MatFormField,
            MatLabel,
            MatError,
            MatHint,
            MatPrefix,
            MatSuffix], exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatFormFieldModule, imports: [MatCommonModule,
            ObserversModule,
            MatFormField, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatFormFieldModule, decorators: [{
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

export { MatFormFieldModule };
//# sourceMappingURL=module-Dxc8MBPS.mjs.map
