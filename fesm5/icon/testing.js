import { Injectable, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { of } from 'rxjs';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:enable:no-any
/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
var FakeMatIconRegistry = /** @class */ (function () {
    function FakeMatIconRegistry() {
    }
    FakeMatIconRegistry.prototype.addSvgIcon = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconLiteral = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconLiteralInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSet = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetLiteral = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.addSvgIconSetLiteralInNamespace = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.registerFontClassAlias = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return alias;
    };
    FakeMatIconRegistry.prototype.getDefaultFontSetClass = function () {
        return 'material-icons';
    };
    FakeMatIconRegistry.prototype.getSvgIconFromUrl = function () {
        return of(this._generateEmptySvg());
    };
    FakeMatIconRegistry.prototype.getNamedSvgIcon = function () {
        return of(this._generateEmptySvg());
    };
    FakeMatIconRegistry.prototype.setDefaultFontSetClass = function () {
        return this;
    };
    FakeMatIconRegistry.prototype.ngOnDestroy = function () { };
    FakeMatIconRegistry.prototype._generateEmptySvg = function () {
        var emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        emptySvg.classList.add('fake-testing-svg');
        // Emulate real icon characteristics from `MatIconRegistry` so size remains consistent in tests.
        emptySvg.setAttribute('fit', '');
        emptySvg.setAttribute('height', '100%');
        emptySvg.setAttribute('width', '100%');
        emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        emptySvg.setAttribute('focusable', 'false');
        return emptySvg;
    };
    FakeMatIconRegistry.decorators = [
        { type: Injectable }
    ];
    return FakeMatIconRegistry;
}());
/** Import this module in tests to install the null icon registry. */
var MatIconTestingModule = /** @class */ (function () {
    function MatIconTestingModule() {
    }
    MatIconTestingModule.decorators = [
        { type: NgModule, args: [{
                    providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }]
                },] }
    ];
    return MatIconTestingModule;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FakeMatIconRegistry, MatIconTestingModule };
//# sourceMappingURL=testing.js.map
