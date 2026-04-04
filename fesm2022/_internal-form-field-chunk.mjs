import * as i0 from '@angular/core';
import { Input, ChangeDetectionStrategy, ViewEncapsulation, Component } from '@angular/core';

class _MatInternalFormField {
  labelPosition = 'after';
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: _MatInternalFormField,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: _MatInternalFormField,
    isStandalone: true,
    selector: "div[mat-internal-form-field]",
    inputs: {
      labelPosition: "labelPosition"
    },
    host: {
      properties: {
        "class.mdc-form-field--align-end": "labelPosition === \"before\""
      },
      classAttribute: "mdc-form-field mat-internal-form-field"
    },
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: _MatInternalFormField,
  decorators: [{
    type: Component,
    args: [{
      selector: 'div[mat-internal-form-field]',
      template: '<ng-content></ng-content>',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        'class': 'mdc-form-field mat-internal-form-field',
        '[class.mdc-form-field--align-end]': 'labelPosition === "before"'
      },
      styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"]
    }]
  }],
  propDecorators: {
    labelPosition: [{
      type: Input,
      args: [{
        required: true
      }]
    }]
  }
});

export { _MatInternalFormField };
//# sourceMappingURL=_internal-form-field-chunk.mjs.map
