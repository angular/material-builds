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
    exports.materialVersion = loadPackageVersionGracefully('@angular/cdk') ||
        loadPackageVersionGracefully('@angular/material');
    /**
     * Range of Angular versions that can be used together with the Angular Material version
     * that provides these schematics.
     */
    exports.requiredAngularVersionRange = '^9.0.0-0 || ^10.0.0-0';
    /** Loads the full version from the given Angular package gracefully. */
    function loadPackageVersionGracefully(packageName) {
        try {
            return require(`${packageName}/package.json`).version;
        }
        catch (_a) {
            return null;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC92ZXJzaW9uLW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUZBQWlGO0lBQ3BFLFFBQUEsZUFBZSxHQUMxQiw0QkFBNEIsQ0FBQyxjQUFjLENBQUM7UUFDNUMsNEJBQTRCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUVwRDs7O09BR0c7SUFDVSxRQUFBLDJCQUEyQixHQUFHLFVBQVUsQ0FBQztJQUV0RCx3RUFBd0U7SUFDeEUsU0FBUyw0QkFBNEIsQ0FBQyxXQUFtQjtRQUN2RCxJQUFJO1lBQ0YsT0FBTyxPQUFPLENBQUMsR0FBRyxXQUFXLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUN2RDtRQUFDLFdBQU07WUFDTixPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogTmFtZSBvZiB0aGUgTWF0ZXJpYWwgdmVyc2lvbiB0aGF0IGlzIHNoaXBwZWQgdG9nZXRoZXIgd2l0aCB0aGUgc2NoZW1hdGljcy4gKi9cbmV4cG9ydCBjb25zdCBtYXRlcmlhbFZlcnNpb24gPVxuICBsb2FkUGFja2FnZVZlcnNpb25HcmFjZWZ1bGx5KCdAYW5ndWxhci9jZGsnKSB8fFxuICBsb2FkUGFja2FnZVZlcnNpb25HcmFjZWZ1bGx5KCdAYW5ndWxhci9tYXRlcmlhbCcpO1xuXG4vKipcbiAqIFJhbmdlIG9mIEFuZ3VsYXIgdmVyc2lvbnMgdGhhdCBjYW4gYmUgdXNlZCB0b2dldGhlciB3aXRoIHRoZSBBbmd1bGFyIE1hdGVyaWFsIHZlcnNpb25cbiAqIHRoYXQgcHJvdmlkZXMgdGhlc2Ugc2NoZW1hdGljcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlcXVpcmVkQW5ndWxhclZlcnNpb25SYW5nZSA9ICcwLjAuMC1ORyc7XG5cbi8qKiBMb2FkcyB0aGUgZnVsbCB2ZXJzaW9uIGZyb20gdGhlIGdpdmVuIEFuZ3VsYXIgcGFja2FnZSBncmFjZWZ1bGx5LiAqL1xuZnVuY3Rpb24gbG9hZFBhY2thZ2VWZXJzaW9uR3JhY2VmdWxseShwYWNrYWdlTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoYCR7cGFja2FnZU5hbWV9L3BhY2thZ2UuanNvbmApLnZlcnNpb247XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=