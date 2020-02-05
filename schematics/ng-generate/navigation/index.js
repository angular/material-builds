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
        define("@angular/material/schematics/ng-generate/navigation/index", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    /**
     * Scaffolds a new navigation component.
     * Internally it bootstraps the base component schematic
     */
    function default_1(options) {
        return schematics_1.chain([
            schematics_2.buildComponent(Object.assign({}, options), {
                template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
                stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
            }),
            options.skipImport ? schematics_1.noop() : addNavModulesToModule(options)
        ]);
    }
    exports.default = default_1;
    /**
     * Adds the required modules to the relative module.
     */
    function addNavModulesToModule(options) {
        return (host) => {
            const modulePath = schematics_2.findModuleFromOptions(host, options);
            schematics_2.addModuleImportToModule(host, modulePath, 'LayoutModule', '@angular/cdk/layout');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatToolbarModule', '@angular/material/toolbar');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatButtonModule', '@angular/material/button');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatSidenavModule', '@angular/material/sidenav');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatIconModule', '@angular/material/icon');
            schematics_2.addModuleImportToModule(host, modulePath, 'MatListModule', '@angular/material/list');
            return host;
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS9uYXZpZ2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQW1FO0lBQ25FLHdEQUlpQztJQUdqQzs7O09BR0c7SUFDSCxtQkFBd0IsT0FBZTtRQUNyQyxPQUFPLGtCQUFLLENBQUM7WUFDWCwyQkFBYyxtQkFBSyxPQUFPLEdBQUc7Z0JBQzNCLFFBQVEsRUFBRSxrRkFBa0Y7Z0JBQzVGLFVBQVUsRUFDTix1RkFBdUY7YUFDNUYsQ0FBQztZQUNGLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGlCQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1NBQzdELENBQUMsQ0FBQztJQUNMLENBQUM7SUFURCw0QkFTQztJQUVEOztPQUVHO0lBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxPQUFlO1FBQzVDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUNwQixNQUFNLFVBQVUsR0FBRyxrQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFFLENBQUM7WUFDekQsb0NBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUNqRixvQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7WUFDM0Ysb0NBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1lBQ3pGLG9DQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztZQUMzRixvQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3JGLG9DQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDckYsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7SUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlLFxuICBidWlsZENvbXBvbmVudCxcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyBhIG5ldyBuYXZpZ2F0aW9uIGNvbXBvbmVudC5cbiAqIEludGVybmFsbHkgaXQgYm9vdHN0cmFwcyB0aGUgYmFzZSBjb21wb25lbnQgc2NoZW1hdGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIGJ1aWxkQ29tcG9uZW50KHsuLi5vcHRpb25zfSwge1xuICAgICAgdGVtcGxhdGU6ICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuaHRtbC50ZW1wbGF0ZScsXG4gICAgICBzdHlsZXNoZWV0OlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuX19zdHlsZV9fLnRlbXBsYXRlJyxcbiAgICB9KSxcbiAgICBvcHRpb25zLnNraXBJbXBvcnQgPyBub29wKCkgOiBhZGROYXZNb2R1bGVzVG9Nb2R1bGUob3B0aW9ucylcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyB0aGUgcmVxdWlyZWQgbW9kdWxlcyB0byB0aGUgcmVsYXRpdmUgbW9kdWxlLlxuICovXG5mdW5jdGlvbiBhZGROYXZNb2R1bGVzVG9Nb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucykhO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdMYXlvdXRNb2R1bGUnLCAnQGFuZ3VsYXIvY2RrL2xheW91dCcpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRUb29sYmFyTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2xiYXInKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0QnV0dG9uTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbicpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRTaWRlbmF2TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3NpZGVuYXYnKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0SWNvbk1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdExpc3RNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGlzdCcpO1xuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuIl19