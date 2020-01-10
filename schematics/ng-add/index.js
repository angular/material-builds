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
        define("@angular/material/schematics/ng-add/index", ["require", "exports", "@angular-devkit/schematics/tasks", "@angular/material/schematics/ng-add/package-config", "@angular/material/schematics/ng-add/version-names"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const package_config_1 = require("@angular/material/schematics/ng-add/package-config");
    const version_names_1 = require("@angular/material/schematics/ng-add/version-names");
    /**
     * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
     * automatically executed if developers run `ng add @angular/material`.
     *
     * Since the Angular Material schematics depend on the schematic utility functions from the CDK,
     * we need to install the CDK before loading the schematic files that import from the CDK.
     */
    function default_1(options) {
        return (host, context) => {
            // Version tag of the `@angular/core` dependency that has been loaded from the `package.json`
            // of the CLI project. This tag should be preferred because all Angular dependencies should
            // have the same version tag if possible.
            const ngCoreVersionTag = package_config_1.getPackageVersionFromPackageJson(host, '@angular/core');
            const angularDependencyVersion = ngCoreVersionTag || version_names_1.requiredAngularVersionRange;
            // In order to align the Material and CDK version with other Angular dependencies that
            // are setup by "@schematics/angular", we use tilde instead of caret. This is default for
            // Angular dependencies in new CLI projects.
            package_config_1.addPackageToPackageJson(host, '@angular/cdk', `~${version_names_1.materialVersion}`);
            package_config_1.addPackageToPackageJson(host, '@angular/material', `~${version_names_1.materialVersion}`);
            package_config_1.addPackageToPackageJson(host, '@angular/forms', angularDependencyVersion);
            package_config_1.addPackageToPackageJson(host, '@angular/animations', angularDependencyVersion);
            // Since the Angular Material schematics depend on the schematic utility functions from the
            // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
            const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
            context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCw0REFBMEY7SUFDMUYsdUZBQTJGO0lBRTNGLHFGQUE2RTtJQUU3RTs7Ozs7O09BTUc7SUFDSCxtQkFBd0IsT0FBZTtRQUNyQyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyw2RkFBNkY7WUFDN0YsMkZBQTJGO1lBQzNGLHlDQUF5QztZQUN6QyxNQUFNLGdCQUFnQixHQUFHLGlEQUFnQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNqRixNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixJQUFJLDJDQUEyQixDQUFDO1lBRWpGLHNGQUFzRjtZQUN0Rix5RkFBeUY7WUFDekYsNENBQTRDO1lBQzVDLHdDQUF1QixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSwrQkFBZSxFQUFFLENBQUMsQ0FBQztZQUNyRSx3Q0FBdUIsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSwrQkFBZSxFQUFFLENBQUMsQ0FBQztZQUMxRSx3Q0FBdUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUMxRSx3Q0FBdUIsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUUvRSwyRkFBMkY7WUFDM0YsK0ZBQStGO1lBQy9GLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7WUFFcEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUM7SUFDSixDQUFDO0lBdEJELDRCQXNCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFzaywgUnVuU2NoZW1hdGljVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiwgZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb259IGZyb20gJy4vcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7bWF0ZXJpYWxWZXJzaW9uLCByZXF1aXJlZEFuZ3VsYXJWZXJzaW9uUmFuZ2V9IGZyb20gJy4vdmVyc2lvbi1uYW1lcyc7XG5cbi8qKlxuICogU2NoZW1hdGljIGZhY3RvcnkgZW50cnktcG9pbnQgZm9yIHRoZSBgbmctYWRkYCBzY2hlbWF0aWMuIFRoZSBuZy1hZGQgc2NoZW1hdGljIHdpbGwgYmVcbiAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZWQgaWYgZGV2ZWxvcGVycyBydW4gYG5nIGFkZCBAYW5ndWxhci9tYXRlcmlhbGAuXG4gKlxuICogU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZSBDREssXG4gKiB3ZSBuZWVkIHRvIGluc3RhbGwgdGhlIENESyBiZWZvcmUgbG9hZGluZyB0aGUgc2NoZW1hdGljIGZpbGVzIHRoYXQgaW1wb3J0IGZyb20gdGhlIENESy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIC8vIFZlcnNpb24gdGFnIG9mIHRoZSBgQGFuZ3VsYXIvY29yZWAgZGVwZW5kZW5jeSB0aGF0IGhhcyBiZWVuIGxvYWRlZCBmcm9tIHRoZSBgcGFja2FnZS5qc29uYFxuICAgIC8vIG9mIHRoZSBDTEkgcHJvamVjdC4gVGhpcyB0YWcgc2hvdWxkIGJlIHByZWZlcnJlZCBiZWNhdXNlIGFsbCBBbmd1bGFyIGRlcGVuZGVuY2llcyBzaG91bGRcbiAgICAvLyBoYXZlIHRoZSBzYW1lIHZlcnNpb24gdGFnIGlmIHBvc3NpYmxlLlxuICAgIGNvbnN0IG5nQ29yZVZlcnNpb25UYWcgPSBnZXRQYWNrYWdlVmVyc2lvbkZyb21QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvY29yZScpO1xuICAgIGNvbnN0IGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbiA9IG5nQ29yZVZlcnNpb25UYWcgfHwgcmVxdWlyZWRBbmd1bGFyVmVyc2lvblJhbmdlO1xuXG4gICAgLy8gSW4gb3JkZXIgdG8gYWxpZ24gdGhlIE1hdGVyaWFsIGFuZCBDREsgdmVyc2lvbiB3aXRoIG90aGVyIEFuZ3VsYXIgZGVwZW5kZW5jaWVzIHRoYXRcbiAgICAvLyBhcmUgc2V0dXAgYnkgXCJAc2NoZW1hdGljcy9hbmd1bGFyXCIsIHdlIHVzZSB0aWxkZSBpbnN0ZWFkIG9mIGNhcmV0LiBUaGlzIGlzIGRlZmF1bHQgZm9yXG4gICAgLy8gQW5ndWxhciBkZXBlbmRlbmNpZXMgaW4gbmV3IENMSSBwcm9qZWN0cy5cbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvY2RrJywgYH4ke21hdGVyaWFsVmVyc2lvbn1gKTtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvbWF0ZXJpYWwnLCBgfiR7bWF0ZXJpYWxWZXJzaW9ufWApO1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9mb3JtcycsIGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbik7XG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnLCBhbmd1bGFyRGVwZW5kZW5jeVZlcnNpb24pO1xuXG4gICAgLy8gU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZVxuICAgIC8vIENESywgd2UgbmVlZCB0byBpbnN0YWxsIHRoZSBDREsgYmVmb3JlIGxvYWRpbmcgdGhlIHNjaGVtYXRpYyBmaWxlcyB0aGF0IGltcG9ydCBmcm9tIHRoZSBDREsuXG4gICAgY29uc3QgaW5zdGFsbFRhc2tJZCA9IGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcblxuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgUnVuU2NoZW1hdGljVGFzaygnbmctYWRkLXNldHVwLXByb2plY3QnLCBvcHRpb25zKSwgW2luc3RhbGxUYXNrSWRdKTtcbiAgfTtcbn1cbiJdfQ==