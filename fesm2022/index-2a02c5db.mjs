import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { M as MatRippleModule } from './index-d1184401.mjs';
import { M as MatCommonModule } from './common-module-90645281.mjs';
import { a as MatOption, e as MatOptgroup } from './option-99dcb8a5.mjs';
import { M as MatPseudoCheckboxModule } from './pseudo-checkbox-module-a7946385.mjs';

class MatOptionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup], exports: [MatOption, MatOptgroup] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-next.5", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
                    exports: [MatOption, MatOptgroup],
                }]
        }] });

export { MatOptionModule as M };
//# sourceMappingURL=index-2a02c5db.mjs.map
