import { BidiModule } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { Directive, NgModule } from '@angular/core';
import { startWith } from 'rxjs/operators';

class MatLine {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatLine,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatLine,
    isStandalone: true,
    selector: "[mat-line], [matLine]",
    host: {
      classAttribute: "mat-line"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatLine,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-line], [matLine]',
      host: {
        'class': 'mat-line'
      }
    }]
  }]
});
function setLines(lines, element, prefix = 'mat') {
  lines.changes.pipe(startWith(lines)).subscribe(({
    length
  }) => {
    setClass(element, `${prefix}-2-line`, false);
    setClass(element, `${prefix}-3-line`, false);
    setClass(element, `${prefix}-multi-line`, false);
    if (length === 2 || length === 3) {
      setClass(element, `${prefix}-${length}-line`, true);
    } else if (length > 3) {
      setClass(element, `${prefix}-multi-line`, true);
    }
  });
}
function setClass(element, className, isAdd) {
  element.nativeElement.classList.toggle(className, isAdd);
}
class MatLineModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatLineModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatLineModule,
    imports: [MatLine],
    exports: [MatLine, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatLineModule,
    imports: [BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatLineModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatLine],
      exports: [MatLine, BidiModule]
    }]
  }]
});

export { MatLine, MatLineModule, setLines };
//# sourceMappingURL=_line-chunk.mjs.map
