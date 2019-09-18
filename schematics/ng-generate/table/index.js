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
        define("@angular/material/schematics/ng-generate/table/index", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    /**
     * Scaffolds a new table component.
     * Internally it bootstraps the base component schematic
     */
    function default_1(options) {
        return schematics_1.chain([
            schematics_2.buildComponent(Object.assign({}, options), {
                template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
                stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template'
            }),
            options.skipImport ? schematics_1.noop() : addTableModulesToModule(options)
        ]);
    }
    exports.default = default_1;
    /**
     * Adds the required modules to the relative module.
     */
    function addTableModulesToModule(options) {
        return (host) => {
            const modulePath = schematics_2.findModuleFromOptions(host, options);
            schematics_2.addModuleImportToModule(host, modulePath, 'MatTableModule', '@angular/material/table');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatPaginatorModule', '@angular/material/paginator');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatSortModule', '@angular/material/sort');
            return host;
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILDJEQUFtRTtJQUNuRSx3REFJaUM7SUFHakM7OztPQUdHO0lBQ0gsbUJBQXdCLE9BQWU7UUFDckMsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsMkJBQWMsbUJBQUssT0FBTyxHQUFHO2dCQUMzQixRQUFRLEVBQUUsa0ZBQWtGO2dCQUM1RixVQUFVLEVBQ04sdUZBQXVGO2FBQzVGLENBQUM7WUFDRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxpQkFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztTQUMvRCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBVEQsNEJBU0M7SUFFRDs7T0FFRztJQUNILFNBQVMsdUJBQXVCLENBQUMsT0FBZTtRQUM5QyxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxVQUFVLEdBQUcsa0NBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBRSxDQUFDO1lBQ3pELG9DQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUN2RixvQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDL0Ysb0NBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUNyRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgbm9vcCwgUnVsZSwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUsXG4gIGJ1aWxkQ29tcG9uZW50LFxuICBmaW5kTW9kdWxlRnJvbU9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIGEgbmV3IHRhYmxlIGNvbXBvbmVudC5cbiAqIEludGVybmFsbHkgaXQgYm9vdHN0cmFwcyB0aGUgYmFzZSBjb21wb25lbnQgc2NoZW1hdGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIGJ1aWxkQ29tcG9uZW50KHsuLi5vcHRpb25zfSwge1xuICAgICAgdGVtcGxhdGU6ICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuaHRtbC50ZW1wbGF0ZScsXG4gICAgICBzdHlsZXNoZWV0OlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuX19zdHlsZV9fLnRlbXBsYXRlJ1xuICAgIH0pLFxuICAgIG9wdGlvbnMuc2tpcEltcG9ydCA/IG5vb3AoKSA6IGFkZFRhYmxlTW9kdWxlc1RvTW9kdWxlKG9wdGlvbnMpXG4gIF0pO1xufVxuXG4vKipcbiAqIEFkZHMgdGhlIHJlcXVpcmVkIG1vZHVsZXMgdG8gdGhlIHJlbGF0aXZlIG1vZHVsZS5cbiAqL1xuZnVuY3Rpb24gYWRkVGFibGVNb2R1bGVzVG9Nb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucykhO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRUYWJsZU1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC90YWJsZScpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRQYWdpbmF0b3JNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdFNvcnRNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCcpO1xuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuIl19