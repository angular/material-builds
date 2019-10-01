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
    exports.requiredAngularVersionRange = '^8.0.0 || ^9.0.0-0';
    /** HammerJS version that should be installed if gestures will be set up. */
    exports.hammerjsVersion = '^2.0.8';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC92ZXJzaW9uLW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUZBQWlGO0lBQ3BFLFFBQUEsZUFBZSxHQUMxQiw0QkFBNEIsQ0FBQyxjQUFjLENBQUM7UUFDNUMsNEJBQTRCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUVwRDs7O09BR0c7SUFDVSxRQUFBLDJCQUEyQixHQUFHLFVBQVUsQ0FBQztJQUV0RCw0RUFBNEU7SUFDL0QsUUFBQSxlQUFlLEdBQUcsUUFBUSxDQUFDO0lBRXhDLHdFQUF3RTtJQUN4RSxTQUFTLDRCQUE0QixDQUFDLFdBQW1CO1FBQ3ZELElBQUk7WUFDRixPQUFPLE9BQU8sQ0FBQyxHQUFHLFdBQVcsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDO1NBQ3ZEO1FBQUMsV0FBTTtZQUNOLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBOYW1lIG9mIHRoZSBNYXRlcmlhbCB2ZXJzaW9uIHRoYXQgaXMgc2hpcHBlZCB0b2dldGhlciB3aXRoIHRoZSBzY2hlbWF0aWNzLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsVmVyc2lvbiA9XG4gIGxvYWRQYWNrYWdlVmVyc2lvbkdyYWNlZnVsbHkoJ0Bhbmd1bGFyL2NkaycpIHx8XG4gIGxvYWRQYWNrYWdlVmVyc2lvbkdyYWNlZnVsbHkoJ0Bhbmd1bGFyL21hdGVyaWFsJyk7XG5cbi8qKlxuICogUmFuZ2Ugb2YgQW5ndWxhciB2ZXJzaW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvblxuICogdGhhdCBwcm92aWRlcyB0aGVzZSBzY2hlbWF0aWNzLlxuICovXG5leHBvcnQgY29uc3QgcmVxdWlyZWRBbmd1bGFyVmVyc2lvblJhbmdlID0gJzAuMC4wLU5HJztcblxuLyoqIEhhbW1lckpTIHZlcnNpb24gdGhhdCBzaG91bGQgYmUgaW5zdGFsbGVkIGlmIGdlc3R1cmVzIHdpbGwgYmUgc2V0IHVwLiAqL1xuZXhwb3J0IGNvbnN0IGhhbW1lcmpzVmVyc2lvbiA9ICdeMi4wLjgnO1xuXG4vKiogTG9hZHMgdGhlIGZ1bGwgdmVyc2lvbiBmcm9tIHRoZSBnaXZlbiBBbmd1bGFyIHBhY2thZ2UgZ3JhY2VmdWxseS4gKi9cbmZ1bmN0aW9uIGxvYWRQYWNrYWdlVmVyc2lvbkdyYWNlZnVsbHkocGFja2FnZU5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKGAke3BhY2thZ2VOYW1lfS9wYWNrYWdlLmpzb25gKS52ZXJzaW9uO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19