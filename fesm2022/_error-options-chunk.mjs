import * as i0 from '@angular/core';
import { Service } from '@angular/core';

class ShowOnDirtyErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.dirty || form && form.submitted));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: ShowOnDirtyErrorStateMatcher,
    deps: [],
    target: i0.ɵɵFactoryTarget.Service
  });
  static ɵprov = i0.ɵɵngDeclareService({
    minVersion: "22.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: ShowOnDirtyErrorStateMatcher,
    autoProvided: false
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: ShowOnDirtyErrorStateMatcher,
  decorators: [{
    type: Service,
    args: [{
      autoProvided: false
    }]
  }]
});
class ErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.touched || form && form.submitted));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: ErrorStateMatcher,
    deps: [],
    target: i0.ɵɵFactoryTarget.Service
  });
  static ɵprov = i0.ɵɵngDeclareService({
    minVersion: "22.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: ErrorStateMatcher
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: ErrorStateMatcher,
  decorators: [{
    type: Service
  }]
});

export { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher };
//# sourceMappingURL=_error-options-chunk.mjs.map
