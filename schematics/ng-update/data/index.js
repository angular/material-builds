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
        define("@angular/material/schematics/ng-update/data/index", ["require", "exports", "@angular/material/schematics/ng-update/data/attribute-selectors", "@angular/material/schematics/ng-update/data/class-names", "@angular/material/schematics/ng-update/data/constructor-checks", "@angular/material/schematics/ng-update/data/css-selectors", "@angular/material/schematics/ng-update/data/element-selectors", "@angular/material/schematics/ng-update/data/input-names", "@angular/material/schematics/ng-update/data/method-call-checks", "@angular/material/schematics/ng-update/data/output-names", "@angular/material/schematics/ng-update/data/property-names"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("@angular/material/schematics/ng-update/data/attribute-selectors"));
    __export(require("@angular/material/schematics/ng-update/data/class-names"));
    __export(require("@angular/material/schematics/ng-update/data/constructor-checks"));
    __export(require("@angular/material/schematics/ng-update/data/css-selectors"));
    __export(require("@angular/material/schematics/ng-update/data/element-selectors"));
    __export(require("@angular/material/schematics/ng-update/data/input-names"));
    __export(require("@angular/material/schematics/ng-update/data/method-call-checks"));
    __export(require("@angular/material/schematics/ng-update/data/output-names"));
    __export(require("@angular/material/schematics/ng-update/data/property-names"));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7OztJQUVILHFGQUFzQztJQUN0Qyw2RUFBOEI7SUFDOUIsb0ZBQXFDO0lBQ3JDLCtFQUFnQztJQUNoQyxtRkFBb0M7SUFDcEMsNkVBQThCO0lBQzlCLG9GQUFxQztJQUNyQyw4RUFBK0I7SUFDL0IsZ0ZBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vYXR0cmlidXRlLXNlbGVjdG9ycyc7XG5leHBvcnQgKiBmcm9tICcuL2NsYXNzLW5hbWVzJztcbmV4cG9ydCAqIGZyb20gJy4vY29uc3RydWN0b3ItY2hlY2tzJztcbmV4cG9ydCAqIGZyb20gJy4vY3NzLXNlbGVjdG9ycyc7XG5leHBvcnQgKiBmcm9tICcuL2VsZW1lbnQtc2VsZWN0b3JzJztcbmV4cG9ydCAqIGZyb20gJy4vaW5wdXQtbmFtZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9tZXRob2QtY2FsbC1jaGVja3MnO1xuZXhwb3J0ICogZnJvbSAnLi9vdXRwdXQtbmFtZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9wcm9wZXJ0eS1uYW1lcyc7XG4iXX0=