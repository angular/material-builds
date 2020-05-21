import { __decorate, __metadata } from 'tslib';
import { Input, Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatCommonModule } from '@angular/material/core';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let MatDivider = /** @class */ (() => {
    let MatDivider = class MatDivider {
        constructor() {
            this._vertical = false;
            this._inset = false;
        }
        /** Whether the divider is vertically aligned. */
        get vertical() { return this._vertical; }
        set vertical(value) { this._vertical = coerceBooleanProperty(value); }
        /** Whether the divider is an inset divider. */
        get inset() { return this._inset; }
        set inset(value) { this._inset = coerceBooleanProperty(value); }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDivider.prototype, "vertical", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDivider.prototype, "inset", null);
    MatDivider = __decorate([
        Component({
            selector: 'mat-divider',
            host: {
                'role': 'separator',
                '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                '[class.mat-divider-vertical]': 'vertical',
                '[class.mat-divider-horizontal]': '!vertical',
                '[class.mat-divider-inset]': 'inset',
                'class': 'mat-divider'
            },
            template: '',
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".mat-divider{display:block;margin:0;border-top-width:1px;border-top-style:solid}.mat-divider.mat-divider-vertical{border-top:0;border-right-width:1px;border-right-style:solid}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}\n"]
        })
    ], MatDivider);
    return MatDivider;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let MatDividerModule = /** @class */ (() => {
    let MatDividerModule = class MatDividerModule {
    };
    MatDividerModule = __decorate([
        NgModule({
            imports: [MatCommonModule],
            exports: [MatDivider, MatCommonModule],
            declarations: [MatDivider],
        })
    ], MatDividerModule);
    return MatDividerModule;
})();

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

export { MatDivider, MatDividerModule };
//# sourceMappingURL=divider.js.map
