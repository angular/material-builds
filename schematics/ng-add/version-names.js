/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-add/version-names", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Name of the Material version that is shipped together with the schematics. */
    exports.materialVersion = '9.0.0-rc.8-sha-a15473b6a';
    /**
     * Range of Angular versions that can be used together with the Angular Material version
     * that provides these schematics.
     */
    exports.requiredAngularVersionRange = '^9.0.0-0 || ^10.0.0-0';
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC92ZXJzaW9uLW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUZBQWlGO0lBQ3BFLFFBQUEsZUFBZSxHQUFHLG1CQUFtQixDQUFDO0lBRW5EOzs7T0FHRztJQUNVLFFBQUEsMkJBQTJCLEdBQUcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBOYW1lIG9mIHRoZSBNYXRlcmlhbCB2ZXJzaW9uIHRoYXQgaXMgc2hpcHBlZCB0b2dldGhlciB3aXRoIHRoZSBzY2hlbWF0aWNzLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsVmVyc2lvbiA9ICcwLjAuMC1QTEFDRUhPTERFUic7XG5cbi8qKlxuICogUmFuZ2Ugb2YgQW5ndWxhciB2ZXJzaW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvblxuICogdGhhdCBwcm92aWRlcyB0aGVzZSBzY2hlbWF0aWNzLlxuICovXG5leHBvcnQgY29uc3QgcmVxdWlyZWRBbmd1bGFyVmVyc2lvblJhbmdlID0gJzAuMC4wLU5HJztcbiJdfQ==