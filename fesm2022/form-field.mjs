import { MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix } from './_form-field-chunk.mjs';
export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatFormFieldControl, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError } from './_form-field-chunk.mjs';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import '@angular/cdk/a11y';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './_animation-chunk.mjs';
import '@angular/cdk/layout';

class MatFormFieldModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFormFieldModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFormFieldModule,
    imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
    exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatFormFieldModule,
    imports: [ObserversModule, MatFormField, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatFormFieldModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
      exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
    }]
  }]
});

export { MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel, MatPrefix, MatSuffix };
//# sourceMappingURL=form-field.mjs.map
