(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/testing')) :
    typeof define === 'function' && define.amd ? define('@angular/material/form-field/testing/control', ['exports', 'tslib', '@angular/cdk/testing'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.formField = global.ng.material.formField || {}, global.ng.material.formField.testing = global.ng.material.formField.testing || {}, global.ng.material.formField.testing.control = {}), global.tslib, global.ng.cdk.testing));
}(this, (function (exports, tslib, testing) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Base class for custom form-field control harnesses. Harnesses for
     * custom controls with form-fields need to implement this interface.
     */
    var MatFormFieldControlHarness = /** @class */ (function (_super) {
        tslib.__extends(MatFormFieldControlHarness, _super);
        function MatFormFieldControlHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MatFormFieldControlHarness;
    }(testing.ComponentHarness));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    exports.MatFormFieldControlHarness = MatFormFieldControlHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-form-field-testing-control.umd.js.map
