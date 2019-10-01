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
        define("@angular/material/schematics/ng-add/fonts/material-fonts", ["require", "exports", "@angular/cdk/schematics", "@schematics/angular/utility/config", "@angular/material/schematics/ng-add/fonts/project-index-html"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const config_1 = require("@schematics/angular/utility/config");
    const project_index_html_1 = require("@angular/material/schematics/ng-add/fonts/project-index-html");
    /** Adds the Material Design fonts to the index HTML file. */
    function addFontsToIndex(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_1.getProjectFromWorkspace(workspace, options.project);
            const projectIndexHtmlPath = project_index_html_1.getIndexHtmlPath(project);
            const fonts = [
                'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
            ];
            fonts.forEach(f => {
                schematics_1.appendHtmlElementToHead(host, projectIndexHtmlPath, `<link href="${f}" rel="stylesheet">`);
            });
            return host;
        };
    }
    exports.addFontsToIndex = addFontsToIndex;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvZm9udHMvbWF0ZXJpYWwtZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFBeUY7SUFDekYsK0RBQWdFO0lBRWhFLHFHQUFzRDtJQUV0RCw2REFBNkQ7SUFDN0QsU0FBZ0IsZUFBZSxDQUFDLE9BQWU7UUFDN0MsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLG9CQUFvQixHQUFHLHFDQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXZELE1BQU0sS0FBSyxHQUFHO2dCQUNaLHlFQUF5RTtnQkFDekUseURBQXlEO2FBQzFELENBQUM7WUFFRixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoQixvQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDN0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNKLENBQUM7SUFqQkQsMENBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHthcHBlbmRIdG1sRWxlbWVudFRvSGVhZCwgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuLi9zY2hlbWEnO1xuaW1wb3J0IHtnZXRJbmRleEh0bWxQYXRofSBmcm9tICcuL3Byb2plY3QtaW5kZXgtaHRtbCc7XG5cbi8qKiBBZGRzIHRoZSBNYXRlcmlhbCBEZXNpZ24gZm9udHMgdG8gdGhlIGluZGV4IEhUTUwgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRGb250c1RvSW5kZXgob3B0aW9uczogU2NoZW1hKTogKGhvc3Q6IFRyZWUpID0+IFRyZWUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXhIdG1sUGF0aCA9IGdldEluZGV4SHRtbFBhdGgocHJvamVjdCk7XG5cbiAgICBjb25zdCBmb250cyA9IFtcbiAgICAgICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjMwMCw0MDAsNTAwJmRpc3BsYXk9c3dhcCcsXG4gICAgICAnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9pY29uP2ZhbWlseT1NYXRlcmlhbCtJY29ucycsXG4gICAgXTtcblxuICAgIGZvbnRzLmZvckVhY2goZiA9PiB7XG4gICAgICBhcHBlbmRIdG1sRWxlbWVudFRvSGVhZChob3N0LCBwcm9qZWN0SW5kZXhIdG1sUGF0aCwgYDxsaW5rIGhyZWY9XCIke2Z9XCIgcmVsPVwic3R5bGVzaGVldFwiPmApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG4iXX0=