import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatCommonModule } from '@angular/material/core';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatDivider = /** @class */ (function () {
    function MatDivider() {
        this._vertical = false;
        this._inset = false;
    }
    Object.defineProperty(MatDivider.prototype, "vertical", {
        /** Whether the divider is vertically aligned. */
        get: function () { return this._vertical; },
        set: function (value) { this._vertical = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDivider.prototype, "inset", {
        /** Whether the divider is an inset divider. */
        get: function () { return this._inset; },
        set: function (value) { this._inset = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MatDivider.decorators = [
        { type: Component, args: [{
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
                }] }
    ];
    MatDivider.propDecorators = {
        vertical: [{ type: Input }],
        inset: [{ type: Input }]
    };
    return MatDivider;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatDividerModule = /** @class */ (function () {
    function MatDividerModule() {
    }
    MatDividerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [MatCommonModule],
                    exports: [MatDivider, MatCommonModule],
                    declarations: [MatDivider],
                },] }
    ];
    return MatDividerModule;
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

export { MatDivider, MatDividerModule };
//# sourceMappingURL=divider.js.map
