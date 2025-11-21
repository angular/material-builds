import { BidiModule } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatRippleModule } from './_ripple-module-chunk.mjs';
import { MatPseudoCheckboxModule } from './_pseudo-checkbox-module-chunk.mjs';
import { MatOption, MatOptgroup } from './_option-chunk.mjs';

class MatOptionModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatOptionModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatOptionModule,
    imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
    exports: [MatOption, MatOptgroup, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatOptionModule,
    imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatOptionModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
      exports: [MatOption, MatOptgroup, BidiModule]
    }]
  }]
});

export { MatOptionModule };
//# sourceMappingURL=_option-module-chunk.mjs.map
