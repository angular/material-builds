import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { M as MatRippleModule } from './index-5ac4af9b.mjs';
import { M as MatCommonModule } from './common-module-727dea0d.mjs';
import { a as MatOption, e as MatOptgroup } from './option-5eb4c8e5.mjs';
import { M as MatPseudoCheckboxModule } from './pseudo-checkbox-module-fc4975bd.mjs';

class MatOptionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-next.4", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.0.0-next.4", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup], exports: [MatOption, MatOptgroup] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.0.0-next.4", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-next.4", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
                    exports: [MatOption, MatOptgroup],
                }]
        }] });

export { MatOptionModule as M };
//# sourceMappingURL=index-24de77b5.mjs.map
