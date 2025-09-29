import { BidiModule } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatRippleModule } from './ripple-module-C79kN6V8.mjs';
import { MatPseudoCheckboxModule } from './pseudo-checkbox-module-BP0OHQy7.mjs';
import { MatOption, MatOptgroup } from './option-Dlr72ivf.mjs';

class MatOptionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup], exports: [MatOption, MatOptgroup, BidiModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, BidiModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
                    exports: [MatOption, MatOptgroup, BidiModule],
                }]
        }] });

export { MatOptionModule };
//# sourceMappingURL=option-module--xFmbRdb.mjs.map
