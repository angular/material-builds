"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
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
const fallbackMaterialVersionRange = `~20.0.0-next.3`;
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
        const angularDependencyVersion = ngCoreVersionTag || `^20.0.0-0 || ^20.1.0-0 || ^20.2.0-0 || ^20.3.0-0 || ^21.0.0-0`;
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
        // Since the Angular Material schematics depend on the schematic utility functions from the
        // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
        const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
        context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUF5QkgsNEJBK0JDO0FBckRELDREQUEwRjtBQUMxRixxREFBMkY7QUFHM0Y7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLDRCQUE0QixHQUFHLG9CQUFvQixDQUFDO0FBRTFEOzs7Ozs7R0FNRztBQUNILG1CQUF5QixPQUFlO0lBQ3RDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLDZGQUE2RjtRQUM3RiwyRkFBMkY7UUFDM0YseUNBQXlDO1FBQ3pDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxpREFBZ0MsRUFBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDakYsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLGlEQUFnQyxFQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sd0JBQXdCLEdBQUcsZ0JBQWdCLElBQUksVUFBVSxDQUFDO1FBRWhFLDBGQUEwRjtRQUMxRiw2RkFBNkY7UUFDN0YsNkZBQTZGO1FBQzdGLHlGQUF5RjtRQUN6RixnRkFBZ0Y7UUFDaEYsSUFBSSxvQkFBb0IsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFBLHdDQUF1QixFQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFFRCxJQUFBLHdDQUF1QixFQUNyQixJQUFJLEVBQ0osY0FBYyxFQUNkLG9CQUFvQixJQUFJLDRCQUE0QixDQUNyRCxDQUFDO1FBQ0YsSUFBQSx3Q0FBdUIsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUUxRSwyRkFBMkY7UUFDM0YsK0ZBQStGO1FBQy9GLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFcEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuZGV2L2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFzaywgUnVuU2NoZW1hdGljVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiwgZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb259IGZyb20gJy4vcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBWZXJzaW9uIHJhbmdlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgQW5ndWxhciBDREsgYW5kIEFuZ3VsYXIgTWF0ZXJpYWwgaWYgdGhpc1xuICogc2NoZW1hdGljIGhhcyBiZWVuIHJ1biBvdXRzaWRlIG9mIHRoZSBDTEkgYG5nIGFkZGAgY29tbWFuZC4gSW4gdGhvc2UgY2FzZXMsIHRoZXJlXG4gKiBjYW4gYmUgbm8gZGVwZW5kZW5jeSBvbiBgQGFuZ3VsYXIvbWF0ZXJpYWxgIGluIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLCBhbmQgd2UgbmVlZFxuICogdG8gbWFudWFsbHkgaW5zZXJ0IHRoZSBkZXBlbmRlbmN5IGJhc2VkIG9uIHRoZSBidWlsZCB2ZXJzaW9uIHBsYWNlaG9sZGVyLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgZmFsbGJhY2sgdmVyc2lvbiByYW5nZSBkb2VzIG5vdCB1c2UgY2FyZXQsIGJ1dCB0aWxkZSBiZWNhdXNlIHRoYXQgaXNcbiAqIHRoZSBkZWZhdWx0IGZvciBBbmd1bGFyIGZyYW1ld29yayBkZXBlbmRlbmNpZXMgaW4gQ0xJIHByb2plY3RzLlxuICovXG5jb25zdCBmYWxsYmFja01hdGVyaWFsVmVyc2lvblJhbmdlID0gYH4wLjAuMC1QTEFDRUhPTERFUmA7XG5cbi8qKlxuICogU2NoZW1hdGljIGZhY3RvcnkgZW50cnktcG9pbnQgZm9yIHRoZSBgbmctYWRkYCBzY2hlbWF0aWMuIFRoZSBuZy1hZGQgc2NoZW1hdGljIHdpbGwgYmVcbiAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZWQgaWYgZGV2ZWxvcGVycyBydW4gYG5nIGFkZCBAYW5ndWxhci9tYXRlcmlhbGAuXG4gKlxuICogU2luY2UgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBkZXBlbmQgb24gdGhlIHNjaGVtYXRpYyB1dGlsaXR5IGZ1bmN0aW9ucyBmcm9tIHRoZSBDREssXG4gKiB3ZSBuZWVkIHRvIGluc3RhbGwgdGhlIENESyBiZWZvcmUgbG9hZGluZyB0aGUgc2NoZW1hdGljIGZpbGVzIHRoYXQgaW1wb3J0IGZyb20gdGhlIENESy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICAvLyBWZXJzaW9uIHRhZyBvZiB0aGUgYEBhbmd1bGFyL2NvcmVgIGRlcGVuZGVuY3kgdGhhdCBoYXMgYmVlbiBsb2FkZWQgZnJvbSB0aGUgYHBhY2thZ2UuanNvbmBcbiAgICAvLyBvZiB0aGUgQ0xJIHByb2plY3QuIFRoaXMgdGFnIHNob3VsZCBiZSBwcmVmZXJyZWQgYmVjYXVzZSBhbGwgQW5ndWxhciBkZXBlbmRlbmNpZXMgc2hvdWxkXG4gICAgLy8gaGF2ZSB0aGUgc2FtZSB2ZXJzaW9uIHRhZyBpZiBwb3NzaWJsZS5cbiAgICBjb25zdCBuZ0NvcmVWZXJzaW9uVGFnID0gZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2NvcmUnKTtcbiAgICBjb25zdCBtYXRlcmlhbFZlcnNpb25SYW5nZSA9IGdldFBhY2thZ2VWZXJzaW9uRnJvbVBhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9tYXRlcmlhbCcpO1xuICAgIGNvbnN0IGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbiA9IG5nQ29yZVZlcnNpb25UYWcgfHwgYDAuMC4wLU5HYDtcblxuICAgIC8vIFRoZSBDTEkgaW5zZXJ0cyBgQGFuZ3VsYXIvbWF0ZXJpYWxgIGludG8gdGhlIGBwYWNrYWdlLmpzb25gIGJlZm9yZSB0aGlzIHNjaGVtYXRpYyBydW5zLlxuICAgIC8vIFRoaXMgbWVhbnMgdGhhdCB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgQW5ndWxhciBNYXRlcmlhbCBpbnRvIGBwYWNrYWdlLmpzb25gIGZpbGVzIGFnYWluLlxuICAgIC8vIEluIHNvbWUgY2FzZXMgdGhvdWdoLCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGlzIHNjaGVtYXRpYyBydW5zIG91dHNpZGUgb2YgdGhlIENMSSBgbmcgYWRkYFxuICAgIC8vIGNvbW1hbmQsIG9yIE1hdGVyaWFsIGlzIG9ubHkgbGlzdGVkIGEgZGV2IGRlcGVuZGVuY3kuIElmIHRoYXQgaXMgdGhlIGNhc2UsIHdlIGluc2VydCBhXG4gICAgLy8gdmVyc2lvbiBiYXNlZCBvbiB0aGUgY3VycmVudCBidWlsZCB2ZXJzaW9uIChzdWJzdGl0dXRlZCB2ZXJzaW9uIHBsYWNlaG9sZGVyKS5cbiAgICBpZiAobWF0ZXJpYWxWZXJzaW9uUmFuZ2UgPT09IG51bGwpIHtcbiAgICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9tYXRlcmlhbCcsIGZhbGxiYWNrTWF0ZXJpYWxWZXJzaW9uUmFuZ2UpO1xuICAgIH1cblxuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKFxuICAgICAgaG9zdCxcbiAgICAgICdAYW5ndWxhci9jZGsnLFxuICAgICAgbWF0ZXJpYWxWZXJzaW9uUmFuZ2UgfHwgZmFsbGJhY2tNYXRlcmlhbFZlcnNpb25SYW5nZSxcbiAgICApO1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9mb3JtcycsIGFuZ3VsYXJEZXBlbmRlbmN5VmVyc2lvbik7XG5cbiAgICAvLyBTaW5jZSB0aGUgQW5ndWxhciBNYXRlcmlhbCBzY2hlbWF0aWNzIGRlcGVuZCBvbiB0aGUgc2NoZW1hdGljIHV0aWxpdHkgZnVuY3Rpb25zIGZyb20gdGhlXG4gICAgLy8gQ0RLLCB3ZSBuZWVkIHRvIGluc3RhbGwgdGhlIENESyBiZWZvcmUgbG9hZGluZyB0aGUgc2NoZW1hdGljIGZpbGVzIHRoYXQgaW1wb3J0IGZyb20gdGhlIENESy5cbiAgICBjb25zdCBpbnN0YWxsVGFza0lkID0gY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuXG4gICAgY29udGV4dC5hZGRUYXNrKG5ldyBSdW5TY2hlbWF0aWNUYXNrKCduZy1hZGQtc2V0dXAtcHJvamVjdCcsIG9wdGlvbnMpLCBbaW5zdGFsbFRhc2tJZF0pO1xuICB9O1xufVxuIl19