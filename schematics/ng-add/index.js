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
        define("@angular/material/schematics/ng-add/index", ["require", "exports", "@angular-devkit/schematics/tasks", "@angular/material/schematics/ng-add/package-config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tasks_1 = require("@angular-devkit/schematics/tasks");
    const package_config_1 = require("@angular/material/schematics/ng-add/package-config");
    /**
     * Version range that will be used for the Angular CDK and Angular Material if this
     * schematic has been run outside of the CLI `ng add` command. In those cases, there
     * can be no dependency on `@angular/material` in the `package.json` file, and we need
     * to manually insert the dependency based on the build version placeholder.
     *
     * Note that the fallback version range does not use caret, but tilde because that is
     * the default for Angular framework dependencies in CLI projects.
     */
    const fallbackMaterialVersionRange = `~9.0.0-sha-198911f5c`;
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
            const materialVersionRange = package_config_1.getPackageVersionFromPackageJson(host, '@angular/material');
            const angularDependencyVersion = ngCoreVersionTag || `^9.0.0-sha-198911f5c-0 || ^10.0.0-0`;
            // The CLI inserts `@angular/material` into the `package.json` before this schematic runs.
            // This means that we do not need to insert Angular Material into `package.json` files again.
            // In some cases though, it could happen that this schematic runs outside of the CLI `ng add`
            // command, or Material is only listed a dev dependency. If that is the case, we insert a
            // version based on the current build version (substituted version placeholder).
            if (materialVersionRange === null) {
                package_config_1.addPackageToPackageJson(host, '@angular/material', fallbackMaterialVersionRange);
            }
            package_config_1.addPackageToPackageJson(host, '@angular/cdk', materialVersionRange || fallbackMaterialVersionRange);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCw0REFBMEY7SUFDMUYsdUZBQTJGO0lBRzNGOzs7Ozs7OztPQVFHO0lBQ0gsTUFBTSw0QkFBNEIsR0FBRyxvQkFBb0IsQ0FBQztJQUUxRDs7Ozs7O09BTUc7SUFDSCxtQkFBd0IsT0FBZTtRQUNyQyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyw2RkFBNkY7WUFDN0YsMkZBQTJGO1lBQzNGLHlDQUF5QztZQUN6QyxNQUFNLGdCQUFnQixHQUFHLGlEQUFnQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNqRixNQUFNLG9CQUFvQixHQUFHLGlEQUFnQyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3pGLE1BQU0sd0JBQXdCLEdBQUcsZ0JBQWdCLElBQUksVUFBVSxDQUFDO1lBRWhFLDBGQUEwRjtZQUMxRiw2RkFBNkY7WUFDN0YsNkZBQTZGO1lBQzdGLHlGQUF5RjtZQUN6RixnRkFBZ0Y7WUFDaEYsSUFBSSxvQkFBb0IsS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLHdDQUF1QixDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO2FBQ2xGO1lBRUQsd0NBQXVCLENBQ25CLElBQUksRUFBRSxjQUFjLEVBQUUsb0JBQW9CLElBQUksNEJBQTRCLENBQUMsQ0FBQztZQUNoRix3Q0FBdUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUMxRSx3Q0FBdUIsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUUvRSwyRkFBMkY7WUFDM0YsK0ZBQStGO1lBQy9GLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7WUFFcEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUM7SUFDSixDQUFDO0lBN0JELDRCQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFzaywgUnVuU2NoZW1hdGljVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiwgZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb259IGZyb20gJy4vcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBWZXJzaW9uIHJhbmdlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgQW5ndWxhciBDREsgYW5kIEFuZ3VsYXIgTWF0ZXJpYWwgaWYgdGhpc1xuICogc2NoZW1hdGljIGhhcyBiZWVuIHJ1biBvdXRzaWRlIG9mIHRoZSBDTEkgYG5nIGFkZGAgY29tbWFuZC4gSW4gdGhvc2UgY2FzZXMsIHRoZXJlXG4gKiBjYW4gYmUgbm8gZGVwZW5kZW5jeSBvbiBgQGFuZ3VsYXIvbWF0ZXJpYWxgIGluIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLCBhbmQgd2UgbmVlZFxuICogdG8gbWFudWFsbHkgaW5zZXJ0IHRoZSBkZXBlbmRlbmN5IGJhc2VkIG9uIHRoZSBidWlsZCB2ZXJzaW9uIHBsYWNlaG9sZGVyLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgZmFsbGJhY2sgdmVyc2lvbiByYW5nZSBkb2VzIG5vdCB1c2UgY2FyZXQsIGJ1dCB0aWxkZSBiZWNhdXNlIHRoYXQgaXNcbiAqIHRoZSBkZWZhdWx0IGZvciBBbmd1bGFyIGZyYW1ld29yayBkZXBlbmRlbmNpZXMgaW4gQ0xJIHByb2plY3RzLlxuICovXG5jb25zdCBmYWxsYmFja01hdGVyaWFsVmVyc2lvblJhbmdlID0gYH4wLjAuMC1QTEFDRUhPTERFUmA7XG5cbi8qKlxuICogU2NoZW1hdGljIGZhY3RvcnkgZW50cnktcG9pbnQgZm9yIHRoZSBgbmctYWRkYCBzY2hlbWF0aWMuIFRoZSBuZy1hZGQgc2NoZW1hdGljIHdpbGwgYmVcbiAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZWQgaWYgZGV2ZWxvcGVycyBydW4gYG5nIGFkZCBAYW5ndWxhci9tYXRlcmlhbGAuXG4gKlxuICogU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZSBDREssXG4gKiB3ZSBuZWVkIHRvIGluc3RhbGwgdGhlIENESyBiZWZvcmUgbG9hZGluZyB0aGUgc2NoZW1hdGljIGZpbGVzIHRoYXQgaW1wb3J0IGZyb20gdGhlIENESy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIC8vIFZlcnNpb24gdGFnIG9mIHRoZSBgQGFuZ3VsYXIvY29yZWAgZGVwZW5kZW5jeSB0aGF0IGhhcyBiZWVuIGxvYWRlZCBmcm9tIHRoZSBgcGFja2FnZS5qc29uYFxuICAgIC8vIG9mIHRoZSBDTEkgcHJvamVjdC4gVGhpcyB0YWcgc2hvdWxkIGJlIHByZWZlcnJlZCBiZWNhdXNlIGFsbCBBbmd1bGFyIGRlcGVuZGVuY2llcyBzaG91bGRcbiAgICAvLyBoYXZlIHRoZSBzYW1lIHZlcnNpb24gdGFnIGlmIHBvc3NpYmxlLlxuICAgIGNvbnN0IG5nQ29yZVZlcnNpb25UYWcgPSBnZXRQYWNrYWdlVmVyc2lvbkZyb21QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvY29yZScpO1xuICAgIGNvbnN0IG1hdGVyaWFsVmVyc2lvblJhbmdlID0gZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL21hdGVyaWFsJyk7XG4gICAgY29uc3QgYW5ndWxhckRlcGVuZGVuY3lWZXJzaW9uID0gbmdDb3JlVmVyc2lvblRhZyB8fCBgMC4wLjAtTkdgO1xuXG4gICAgLy8gVGhlIENMSSBpbnNlcnRzIGBAYW5ndWxhci9tYXRlcmlhbGAgaW50byB0aGUgYHBhY2thZ2UuanNvbmAgYmVmb3JlIHRoaXMgc2NoZW1hdGljIHJ1bnMuXG4gICAgLy8gVGhpcyBtZWFucyB0aGF0IHdlIGRvIG5vdCBuZWVkIHRvIGluc2VydCBBbmd1bGFyIE1hdGVyaWFsIGludG8gYHBhY2thZ2UuanNvbmAgZmlsZXMgYWdhaW4uXG4gICAgLy8gSW4gc29tZSBjYXNlcyB0aG91Z2gsIGl0IGNvdWxkIGhhcHBlbiB0aGF0IHRoaXMgc2NoZW1hdGljIHJ1bnMgb3V0c2lkZSBvZiB0aGUgQ0xJIGBuZyBhZGRgXG4gICAgLy8gY29tbWFuZCwgb3IgTWF0ZXJpYWwgaXMgb25seSBsaXN0ZWQgYSBkZXYgZGVwZW5kZW5jeS4gSWYgdGhhdCBpcyB0aGUgY2FzZSwgd2UgaW5zZXJ0IGFcbiAgICAvLyB2ZXJzaW9uIGJhc2VkIG9uIHRoZSBjdXJyZW50IGJ1aWxkIHZlcnNpb24gKHN1YnN0aXR1dGVkIHZlcnNpb24gcGxhY2Vob2xkZXIpLlxuICAgIGlmIChtYXRlcmlhbFZlcnNpb25SYW5nZSA9PT0gbnVsbCkge1xuICAgICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL21hdGVyaWFsJywgZmFsbGJhY2tNYXRlcmlhbFZlcnNpb25SYW5nZSk7XG4gICAgfVxuXG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oXG4gICAgICAgIGhvc3QsICdAYW5ndWxhci9jZGsnLCBtYXRlcmlhbFZlcnNpb25SYW5nZSB8fCBmYWxsYmFja01hdGVyaWFsVmVyc2lvblJhbmdlKTtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvZm9ybXMnLCBhbmd1bGFyRGVwZW5kZW5jeVZlcnNpb24pO1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9hbmltYXRpb25zJywgYW5ndWxhckRlcGVuZGVuY3lWZXJzaW9uKTtcblxuICAgIC8vIFNpbmNlIHRoZSBBbmd1bGFyIE1hdGVyaWFsIHNjaGVtYXRpY3MgZGVwZW5kIG9uIHRoZSBzY2hlbWF0aWMgdXRpbGl0eSBmdW5jdGlvbnMgZnJvbSB0aGVcbiAgICAvLyBDREssIHdlIG5lZWQgdG8gaW5zdGFsbCB0aGUgQ0RLIGJlZm9yZSBsb2FkaW5nIHRoZSBzY2hlbWF0aWMgZmlsZXMgdGhhdCBpbXBvcnQgZnJvbSB0aGUgQ0RLLlxuICAgIGNvbnN0IGluc3RhbGxUYXNrSWQgPSBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG5cbiAgICBjb250ZXh0LmFkZFRhc2sobmV3IFJ1blNjaGVtYXRpY1Rhc2soJ25nLWFkZC1zZXR1cC1wcm9qZWN0Jywgb3B0aW9ucyksIFtpbnN0YWxsVGFza0lkXSk7XG4gIH07XG59XG4iXX0=