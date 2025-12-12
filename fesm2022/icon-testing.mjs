import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import { of } from 'rxjs';
import { MatIconRegistry } from './_icon-registry-chunk.mjs';
import '@angular/cdk/private';
import '@angular/common/http';
import '@angular/platform-browser';
import 'rxjs/operators';

var IconType;
(function (IconType) {
  IconType[IconType["SVG"] = 0] = "SVG";
  IconType[IconType["FONT"] = 1] = "FONT";
})(IconType || (IconType = {}));

class MatIconHarness extends ComponentHarness {
  static hostSelector = '.mat-icon';
  static with(options = {}) {
    return new HarnessPredicate(MatIconHarness, options).addOption('type', options.type, async (harness, type) => (await harness.getType()) === type).addOption('name', options.name, (harness, text) => HarnessPredicate.stringMatches(harness.getName(), text)).addOption('namespace', options.namespace, (harness, text) => HarnessPredicate.stringMatches(harness.getNamespace(), text));
  }
  async getType() {
    const type = await (await this.host()).getAttribute('data-mat-icon-type');
    return type === 'svg' ? IconType.SVG : IconType.FONT;
  }
  async getName() {
    const host = await this.host();
    const nameFromDom = await host.getAttribute('data-mat-icon-name');
    if (nameFromDom) {
      return nameFromDom;
    }
    if ((await this.getType()) === IconType.FONT) {
      const text = await host.text({
        exclude: '*'
      });
      return text.length > 0 ? text : host.text();
    }
    return null;
  }
  async getNamespace() {
    return (await this.host()).getAttribute('data-mat-icon-namespace');
  }
  async isInline() {
    return (await this.host()).hasClass('mat-icon-inline');
  }
}

class FakeMatIconRegistry {
  addSvgIcon() {
    return this;
  }
  addSvgIconLiteral() {
    return this;
  }
  addSvgIconInNamespace() {
    return this;
  }
  addSvgIconLiteralInNamespace() {
    return this;
  }
  addSvgIconSet() {
    return this;
  }
  addSvgIconSetLiteral() {
    return this;
  }
  addSvgIconSetInNamespace() {
    return this;
  }
  addSvgIconSetLiteralInNamespace() {
    return this;
  }
  registerFontClassAlias() {
    return this;
  }
  classNameForFontAlias(alias) {
    return alias;
  }
  getDefaultFontSetClass() {
    return ['material-icons'];
  }
  getSvgIconFromUrl() {
    return of(this._generateEmptySvg());
  }
  getNamedSvgIcon() {
    return of(this._generateEmptySvg());
  }
  setDefaultFontSetClass() {
    return this;
  }
  addSvgIconResolver() {
    return this;
  }
  ngOnDestroy() {}
  _generateEmptySvg() {
    const emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    emptySvg.classList.add('fake-testing-svg');
    emptySvg.setAttribute('fit', '');
    emptySvg.setAttribute('height', '100%');
    emptySvg.setAttribute('width', '100%');
    emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    emptySvg.setAttribute('focusable', 'false');
    return emptySvg;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: FakeMatIconRegistry,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: FakeMatIconRegistry
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: FakeMatIconRegistry,
  decorators: [{
    type: Injectable
  }]
});
class MatIconTestingModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatIconTestingModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatIconTestingModule
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatIconTestingModule,
    providers: [{
      provide: MatIconRegistry,
      useClass: FakeMatIconRegistry
    }]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatIconTestingModule,
  decorators: [{
    type: NgModule,
    args: [{
      providers: [{
        provide: MatIconRegistry,
        useClass: FakeMatIconRegistry
      }]
    }]
  }]
});

export { FakeMatIconRegistry, IconType, MatIconHarness, MatIconTestingModule };
//# sourceMappingURL=icon-testing.mjs.map
