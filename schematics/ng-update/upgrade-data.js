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
        define("@angular/material/schematics/ng-update/upgrade-data", ["require", "exports", "@angular/material/schematics/ng-update/data/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const data_1 = require("@angular/material/schematics/ng-update/data/index");
    /** Upgrade data that will be used for the Angular Material ng-update schematic. */
    exports.materialUpgradeData = {
        attributeSelectors: data_1.attributeSelectors,
        classNames: data_1.classNames,
        constructorChecks: data_1.constructorChecks,
        cssSelectors: data_1.cssSelectors,
        elementSelectors: data_1.elementSelectors,
        inputNames: data_1.inputNames,
        methodCallChecks: data_1.methodCallChecks,
        outputNames: data_1.outputNames,
        propertyNames: data_1.propertyNames,
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUdILDRFQVVnQjtJQUVoQixtRkFBbUY7SUFDdEUsUUFBQSxtQkFBbUIsR0FBZ0I7UUFDOUMsa0JBQWtCLEVBQWxCLHlCQUFrQjtRQUNsQixVQUFVLEVBQVYsaUJBQVU7UUFDVixpQkFBaUIsRUFBakIsd0JBQWlCO1FBQ2pCLFlBQVksRUFBWixtQkFBWTtRQUNaLGdCQUFnQixFQUFoQix1QkFBZ0I7UUFDaEIsVUFBVSxFQUFWLGlCQUFVO1FBQ1YsZ0JBQWdCLEVBQWhCLHVCQUFnQjtRQUNoQixXQUFXLEVBQVgsa0JBQVc7UUFDWCxhQUFhLEVBQWIsb0JBQWE7S0FDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VXBncmFkZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGF0dHJpYnV0ZVNlbGVjdG9ycyxcbiAgY2xhc3NOYW1lcyxcbiAgY29uc3RydWN0b3JDaGVja3MsXG4gIGNzc1NlbGVjdG9ycyxcbiAgZWxlbWVudFNlbGVjdG9ycyxcbiAgaW5wdXROYW1lcyxcbiAgbWV0aG9kQ2FsbENoZWNrcyxcbiAgb3V0cHV0TmFtZXMsXG4gIHByb3BlcnR5TmFtZXMsXG59IGZyb20gJy4vZGF0YSc7XG5cbi8qKiBVcGdyYWRlIGRhdGEgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSBBbmd1bGFyIE1hdGVyaWFsIG5nLXVwZGF0ZSBzY2hlbWF0aWMuICovXG5leHBvcnQgY29uc3QgbWF0ZXJpYWxVcGdyYWRlRGF0YTogVXBncmFkZURhdGEgPSB7XG4gIGF0dHJpYnV0ZVNlbGVjdG9ycyxcbiAgY2xhc3NOYW1lcyxcbiAgY29uc3RydWN0b3JDaGVja3MsXG4gIGNzc1NlbGVjdG9ycyxcbiAgZWxlbWVudFNlbGVjdG9ycyxcbiAgaW5wdXROYW1lcyxcbiAgbWV0aG9kQ2FsbENoZWNrcyxcbiAgb3V0cHV0TmFtZXMsXG4gIHByb3BlcnR5TmFtZXMsXG59O1xuIl19