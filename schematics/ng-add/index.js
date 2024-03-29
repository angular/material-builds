"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const package_config_1 = require("./package-config");
/**
 * Version range that will be used for the Angular CDK and Angular Material if this
 * schematic has been run outside of the CLI `ng add` command. In those cases, there
 * can be no dependency on `@angular/material` in the `package.json` file, and we need
 * to manually insert the dependency based on the build version placeholder.
 *
 * Note that the fallback version range does not use caret, but tilde because that is
 * the default for Angular framework dependencies in CLI projects.
 */
const fallbackMaterialVersionRange = `~18.0.0-next.1`;
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
        const ngCoreVersionTag = (0, package_config_1.getPackageVersionFromPackageJson)(host, '@angular/core');
        const materialVersionRange = (0, package_config_1.getPackageVersionFromPackageJson)(host, '@angular/material');
        const angularDependencyVersion = ngCoreVersionTag || `^18.0.0-0 || ^18.1.0-0 || ^18.2.0-0 || ^18.3.0-0 || ^19.0.0-0`;
        // The CLI inserts `@angular/material` into the `package.json` before this schematic runs.
        // This means that we do not need to insert Angular Material into `package.json` files again.
        // In some cases though, it could happen that this schematic runs outside of the CLI `ng add`
        // command, or Material is only listed a dev dependency. If that is the case, we insert a
        // version based on the current build version (substituted version placeholder).
        if (materialVersionRange === null) {
            (0, package_config_1.addPackageToPackageJson)(host, '@angular/material', fallbackMaterialVersionRange);
        }
        (0, package_config_1.addPackageToPackageJson)(host, '@angular/cdk', materialVersionRange || fallbackMaterialVersionRange);
        (0, package_config_1.addPackageToPackageJson)(host, '@angular/forms', angularDependencyVersion);
        (0, package_config_1.addPackageToPackageJson)(host, '@angular/animations', angularDependencyVersion);
        // Since the Angular Material schematics depend on the schematic utility functions from the
        // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
        const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
        context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCw0REFBMEY7QUFDMUYscURBQTJGO0FBRzNGOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSw0QkFBNEIsR0FBRyxvQkFBb0IsQ0FBQztBQUUxRDs7Ozs7O0dBTUc7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMvQyw2RkFBNkY7UUFDN0YsMkZBQTJGO1FBQzNGLHlDQUF5QztRQUN6QyxNQUFNLGdCQUFnQixHQUFHLElBQUEsaURBQWdDLEVBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxpREFBZ0MsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUN6RixNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixJQUFJLFVBQVUsQ0FBQztRQUVoRSwwRkFBMEY7UUFDMUYsNkZBQTZGO1FBQzdGLDZGQUE2RjtRQUM3Rix5RkFBeUY7UUFDekYsZ0ZBQWdGO1FBQ2hGLElBQUksb0JBQW9CLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDbEMsSUFBQSx3Q0FBdUIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUNuRixDQUFDO1FBRUQsSUFBQSx3Q0FBdUIsRUFDckIsSUFBSSxFQUNKLGNBQWMsRUFDZCxvQkFBb0IsSUFBSSw0QkFBNEIsQ0FDckQsQ0FBQztRQUNGLElBQUEsd0NBQXVCLEVBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDMUUsSUFBQSx3Q0FBdUIsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUUvRSwyRkFBMkY7UUFDM0YsK0ZBQStGO1FBQy9GLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFcEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUM7QUFDSixDQUFDO0FBaENELDRCQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFzaywgUnVuU2NoZW1hdGljVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiwgZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb259IGZyb20gJy4vcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBWZXJzaW9uIHJhbmdlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgQW5ndWxhciBDREsgYW5kIEFuZ3VsYXIgTWF0ZXJpYWwgaWYgdGhpc1xuICogc2NoZW1hdGljIGhhcyBiZWVuIHJ1biBvdXRzaWRlIG9mIHRoZSBDTEkgYG5nIGFkZGAgY29tbWFuZC4gSW4gdGhvc2UgY2FzZXMsIHRoZXJlXG4gKiBjYW4gYmUgbm8gZGVwZW5kZW5jeSBvbiBgQGFuZ3VsYXIvbWF0ZXJpYWxgIGluIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLCBhbmQgd2UgbmVlZFxuICogdG8gbWFudWFsbHkgaW5zZXJ0IHRoZSBkZXBlbmRlbmN5IGJhc2VkIG9uIHRoZSBidWlsZCB2ZXJzaW9uIHBsYWNlaG9sZGVyLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgZmFsbGJhY2sgdmVyc2lvbiByYW5nZSBkb2VzIG5vdCB1c2UgY2FyZXQsIGJ1dCB0aWxkZSBiZWNhdXNlIHRoYXQgaXNcbiAqIHRoZSBkZWZhdWx0IGZvciBBbmd1bGFyIGZyYW1ld29yayBkZXBlbmRlbmNpZXMgaW4gQ0xJIHByb2plY3RzLlxuICovXG5jb25zdCBmYWxsYmFja01hdGVyaWFsVmVyc2lvblJhbmdlID0gYH4wLjAuMC1QTEFDRUhPTERFUmA7XG5cbi8qKlxuICogU2NoZW1hdGljIGZhY3RvcnkgZW50cnktcG9pbnQgZm9yIHRoZSBgbmctYWRkYCBzY2hlbWF0aWMuIFRoZSBuZy1hZGQgc2NoZW1hdGljIHdpbGwgYmVcbiAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZWQgaWYgZGV2ZWxvcGVycyBydW4gYG5nIGFkZCBAYW5ndWxhci9tYXRlcmlhbGAuXG4gKlxuICogU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZSBDREssXG4gKiB3ZSBuZWVkIHRvIGluc3RhbGwgdGhlIENESyBiZWZvcmUgbG9hZGluZyB0aGUgc2NoZW1hdGljIGZpbGVzIHRoYXQgaW1wb3J0IGZyb20gdGhlIENESy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAvLyBWZXJzaW9uIHRhZyBvZiB0aGUgYEBhbmd1bGFyL2NvcmVgIGRlcGVuZGVuY3kgdGhhdCBoYXMgYmVlbiBsb2FkZWQgZnJvbSB0aGUgYHBhY2thZ2UuanNvbmBcbiAgICAvLyBvZiB0aGUgQ0xJIHByb2plY3QuIFRoaXMgdGFnIHNob3VsZCBiZSBwcmVmZXJyZWQgYmVjYXVzZSBhbGwgQW5ndWxhciBkZXBlbmRlbmNpZXMgc2hvdWxkXG4gICAgLy8gaGF2ZSB0aGUgc2FtZSB2ZXJzaW9uIHRhZyBpZiBwb3NzaWJsZS5cbiAgICBjb25zdCBuZ0NvcmVWZXJzaW9uVGFnID0gZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2NvcmUnKTtcbiAgICBjb25zdCBtYXRlcmlhbFZlcnNpb25SYW5nZSA9IGdldFBhY2thZ2VWZXJzaW9uRnJvbVBhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9tYXRlcmlhbCcpO1xuICAgIGNvbnN0IGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbiA9IG5nQ29yZVZlcnNpb25UYWcgfHwgYDAuMC4wLU5HYDtcblxuICAgIC8vIFRoZSBDTEkgaW5zZXJ0cyBgQGFuZ3VsYXIvbWF0ZXJpYWxgIGludG8gdGhlIGBwYWNrYWdlLmpzb25gIGJlZm9yZSB0aGlzIHNjaGVtYXRpYyBydW5zLlxuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgQW5ndWxhciBNYXRlcmlhbCBpbnRvIGBwYWNrYWdlLmpzb25gIGZpbGVzIGFnYWluLlxuICAgIC8vIEluIHNvbWUgY2FzZXMgdGhvdWdoLCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGlzIHNjaGVtYXRpYyBydW5zIG91dHNpZGUgb2YgdGhlIENMSSBgbmcgYWRkYFxuICAgIC8vIGNvbW1hbmQsIG9yIE1hdGVyaWFsIGlzIG9ubHkgbGlzdGVkIGEgZGV2IGRlcGVuZGVuY3kuIElmIHRoYXQgaXMgdGhlIGNhc2UsIHdlIGluc2VydCBhXG4gICAgLy8gdmVyc2lvbiBiYXNlZCBvbiB0aGUgY3VycmVudCBidWlsZCB2ZXJzaW9uIChzdWJzdGl0dXRlZCB2ZXJzaW9uIHBsYWNlaG9sZGVyKS5cbiAgICBpZiAobWF0ZXJpYWxWZXJzaW9uUmFuZ2UgPT09IG51bGwpIHtcbiAgICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9tYXRlcmlhbCcsIGZhbGxiYWNrTWF0ZXJpYWxWZXJzaW9uUmFuZ2UpO1xuICAgIH1cblxuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKFxuICAgICAgaG9zdCxcbiAgICAgICdAYW5ndWxhci9jZGsnLFxuICAgICAgbWF0ZXJpYWxWZXJzaW9uUmFuZ2UgfHwgZmFsbGJhY2tNYXRlcmlhbFZlcnNpb25SYW5nZSxcbiAgICApO1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9mb3JtcycsIGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbik7XG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnLCBhbmd1bGFyRGVwZW5kZW5jeVZlcnNpb24pO1xuXG4gICAgLy8gU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZVxuICAgIC8vIENESywgd2UgbmVlZCB0byBpbnN0YWxsIHRoZSBDREsgYmVmb3JlIGxvYWRpbmcgdGhlIHNjaGVtYXRpYyBmaWxlcyB0aGF0IGltcG9ydCBmcm9tIHRoZSBDREsuXG4gICAgY29uc3QgaW5zdGFsbFRhc2tJZCA9IGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcblxuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgUnVuU2NoZW1hdGljVGFzaygnbmctYWRkLXNldHVwLXByb2plY3QnLCBvcHRpb25zKSwgW2luc3RhbGxUYXNrSWRdKTtcbiAgfTtcbn1cbiJdfQ==