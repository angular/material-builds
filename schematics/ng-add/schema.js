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
        define("@angular/material/schematics/ng-add/schema", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctYWRkL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBTY2hlbWEge1xuICAvKiogTmFtZSBvZiB0aGUgcHJvamVjdC4gKi9cbiAgcHJvamVjdDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIEFuZ3VsYXIgYnJvd3NlciBhbmltYXRpb25zIHNob3VsZCBiZSBzZXQgdXAuICovXG4gIGFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgLyoqIE5hbWUgb2YgcHJlLWJ1aWx0IHRoZW1lIHRvIGluc3RhbGwuICovXG4gIHRoZW1lOiAnaW5kaWdvLXBpbmsnIHwgJ2RlZXBwdXJwbGUtYW1iZXInIHwgJ3BpbmstYmx1ZWdyZXknIHwgJ3B1cnBsZS1ncmVlbicgfCAnY3VzdG9tJztcblxuICAvKiogV2hldGhlciB0byBzZXQgdXAgZ2xvYmFsIHR5cG9ncmFwaHkgc3R5bGVzLiAqL1xuICB0eXBvZ3JhcGh5OiBib29sZWFuO1xufVxuIl19