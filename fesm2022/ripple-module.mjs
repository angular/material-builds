import { BidiModule } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatRipple } from './ripple.mjs';

class MatRippleModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, imports: [MatRipple], exports: [MatRipple, BidiModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, imports: [BidiModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRipple],
                    exports: [MatRipple, BidiModule],
                }]
        }] });

export { MatRippleModule };
//# sourceMappingURL=ripple-module.mjs.map
