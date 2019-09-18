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
            // In order to align the Material and CDK version with the other Angular dependencies,
            // we use tilde instead of caret. This is default for Angular dependencies in new CLI projects.
            package_config_1.addPackageToPackageJson(host, '@angular/cdk', `~${version_names_1.materialVersion}`);
            package_config_1.addPackageToPackageJson(host, '@angular/material', `~${version_names_1.materialVersion}`);
            package_config_1.addPackageToPackageJson(host, '@angular/forms', angularDependencyVersion);
            package_config_1.addPackageToPackageJson(host, '@angular/animations', angularDependencyVersion);
            if (options.gestures) {
                package_config_1.addPackageToPackageJson(host, 'hammerjs', version_names_1.hammerjsVersion);
            }
            // Since the Angular Material schematics depend on the schematic utility functions from the
            // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
            const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
            context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCw0REFBMEY7SUFDMUYsdUZBQTJGO0lBRTNGLHFGQUE4RjtJQUU5Rjs7Ozs7O09BTUc7SUFDSCxtQkFBd0IsT0FBZTtRQUNyQyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyw2RkFBNkY7WUFDN0YsMkZBQTJGO1lBQzNGLHlDQUF5QztZQUN6QyxNQUFNLGdCQUFnQixHQUFHLGlEQUFnQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNqRixNQUFNLHdCQUF3QixHQUFHLGdCQUFnQixJQUFJLDJDQUEyQixDQUFDO1lBRWpGLHNGQUFzRjtZQUN0RiwrRkFBK0Y7WUFDL0Ysd0NBQXVCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLCtCQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLHdDQUF1QixDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLCtCQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLHdDQUF1QixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQzFFLHdDQUF1QixDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBRS9FLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDcEIsd0NBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSwrQkFBZSxDQUFDLENBQUM7YUFDNUQ7WUFFRCwyRkFBMkY7WUFDM0YsK0ZBQStGO1lBQy9GLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7WUFFcEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUM7SUFDSixDQUFDO0lBekJELDRCQXlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Tm9kZVBhY2thZ2VJbnN0YWxsVGFzaywgUnVuU2NoZW1hdGljVGFza30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHthZGRQYWNrYWdlVG9QYWNrYWdlSnNvbiwgZ2V0UGFja2FnZVZlcnNpb25Gcm9tUGFja2FnZUpzb259IGZyb20gJy4vcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7aGFtbWVyanNWZXJzaW9uLCBtYXRlcmlhbFZlcnNpb24sIHJlcXVpcmVkQW5ndWxhclZlcnNpb25SYW5nZX0gZnJvbSAnLi92ZXJzaW9uLW5hbWVzJztcblxuLyoqXG4gKiBTY2hlbWF0aWMgZmFjdG9yeSBlbnRyeS1wb2ludCBmb3IgdGhlIGBuZy1hZGRgIHNjaGVtYXRpYy4gVGhlIG5nLWFkZCBzY2hlbWF0aWMgd2lsbCBiZVxuICogYXV0b21hdGljYWxseSBleGVjdXRlZCBpZiBkZXZlbG9wZXJzIHJ1biBgbmcgYWRkIEBhbmd1bGFyL21hdGVyaWFsYC5cbiAqXG4gKiBTaW5jZSB0aGUgQW5ndWxhciBNYXRlcmlhbCBzY2hlbWF0aWNzIGRlcGVuZCBvbiB0aGUgc2NoZW1hdGljIHV0aWxpdHkgZnVuY3Rpb25zIGZyb20gdGhlIENESyxcbiAqIHdlIG5lZWQgdG8gaW5zdGFsbCB0aGUgQ0RLIGJlZm9yZSBsb2FkaW5nIHRoZSBzY2hlbWF0aWMgZmlsZXMgdGhhdCBpbXBvcnQgZnJvbSB0aGUgQ0RLLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgLy8gVmVyc2lvbiB0YWcgb2YgdGhlIGBAYW5ndWxhci9jb3JlYCBkZXBlbmRlbmN5IHRoYXQgaGFzIGJlZW4gbG9hZGVkIGZyb20gdGhlIGBwYWNrYWdlLmpzb25gXG4gICAgLy8gb2YgdGhlIENMSSBwcm9qZWN0LiBUaGlzIHRhZyBzaG91bGQgYmUgcHJlZmVycmVkIGJlY2F1c2UgYWxsIEFuZ3VsYXIgZGVwZW5kZW5jaWVzIHNob3VsZFxuICAgIC8vIGhhdmUgdGhlIHNhbWUgdmVyc2lvbiB0YWcgaWYgcG9zc2libGUuXG4gICAgY29uc3QgbmdDb3JlVmVyc2lvblRhZyA9IGdldFBhY2thZ2VWZXJzaW9uRnJvbVBhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9jb3JlJyk7XG4gICAgY29uc3QgYW5ndWxhckRlcGVuZGVuY3lWZXJzaW9uID0gbmdDb3JlVmVyc2lvblRhZyB8fCByZXF1aXJlZEFuZ3VsYXJWZXJzaW9uUmFuZ2U7XG5cbiAgICAvLyBJbiBvcmRlciB0byBhbGlnbiB0aGUgTWF0ZXJpYWwgYW5kIENESyB2ZXJzaW9uIHdpdGggdGhlIG90aGVyIEFuZ3VsYXIgZGVwZW5kZW5jaWVzLFxuICAgIC8vIHdlIHVzZSB0aWxkZSBpbnN0ZWFkIG9mIGNhcmV0LiBUaGlzIGlzIGRlZmF1bHQgZm9yIEFuZ3VsYXIgZGVwZW5kZW5jaWVzIGluIG5ldyBDTEkgcHJvamVjdHMuXG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2NkaycsIGB+JHttYXRlcmlhbFZlcnNpb259YCk7XG4gICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL21hdGVyaWFsJywgYH4ke21hdGVyaWFsVmVyc2lvbn1gKTtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvZm9ybXMnLCBhbmd1bGFyRGVwZW5kZW5jeVZlcnNpb24pO1xuICAgIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uKGhvc3QsICdAYW5ndWxhci9hbmltYXRpb25zJywgYW5ndWxhckRlcGVuZGVuY3lWZXJzaW9uKTtcblxuICAgIGlmIChvcHRpb25zLmdlc3R1cmVzKSB7XG4gICAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0LCAnaGFtbWVyanMnLCBoYW1tZXJqc1ZlcnNpb24pO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBBbmd1bGFyIE1hdGVyaWFsIHNjaGVtYXRpY3MgZGVwZW5kIG9uIHRoZSBzY2hlbWF0aWMgdXRpbGl0eSBmdW5jdGlvbnMgZnJvbSB0aGVcbiAgICAvLyBDREssIHdlIG5lZWQgdG8gaW5zdGFsbCB0aGUgQ0RLIGJlZm9yZSBsb2FkaW5nIHRoZSBzY2hlbWF0aWMgZmlsZXMgdGhhdCBpbXBvcnQgZnJvbSB0aGUgQ0RLLlxuICAgIGNvbnN0IGluc3RhbGxUYXNrSWQgPSBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG5cbiAgICBjb250ZXh0LmFkZFRhc2sobmV3IFJ1blNjaGVtYXRpY1Rhc2soJ25nLWFkZC1zZXR1cC1wcm9qZWN0Jywgb3B0aW9ucyksIFtpbnN0YWxsVGFza0lkXSk7XG4gIH07XG59XG4iXX0=