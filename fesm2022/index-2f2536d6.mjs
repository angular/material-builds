import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { M as MatRippleModule } from './index-a36e3c7c.mjs';
import { M as MatCommonModule } from './common-module-a39ee957.mjs';
import { a as MatOption, e as MatOptgroup } from './option-cb353f7a.mjs';
import { M as MatPseudoCheckboxModule } from './pseudo-checkbox-module-31a58606.mjs';

class MatOptionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.0", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup], exports: [MatOption, MatOptgroup] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatOptionModule, imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
                    exports: [MatOption, MatOptgroup],
                }]
        }] });

export { MatOptionModule as M };
//# sourceMappingURL=index-2f2536d6.mjs.map
