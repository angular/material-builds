import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { M as MatRippleModule } from './index-8309af79.mjs';
import { M as MatCommonModule } from './common-module-2d64df09.mjs';
import { a as MatOption, e as MatOptgroup } from './option-636f0562.mjs';
import { M as MatPseudoCheckboxModule } from './pseudo-checkbox-module-89d964bd.mjs';

class MatOptionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-next.1", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.0.0-next.1", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup], exports: [MatOption, MatOptgroup] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.0.0-next.1", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-next.1", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
                    exports: [MatOption, MatOptgroup],
                }]
        }] });

export { MatOptionModule as M };
//# sourceMappingURL=index-26a22e6d.mjs.map
