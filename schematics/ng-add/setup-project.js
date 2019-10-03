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
        define("@angular/material/schematics/ng-add/setup-project", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics", "chalk", "@schematics/angular/utility/config", "@schematics/angular/utility/ng-ast-utils", "@angular/material/schematics/ng-add/fonts/material-fonts", "@angular/material/schematics/ng-add/theming/theming"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    const chalk_1 = require("chalk");
    const config_1 = require("@schematics/angular/utility/config");
    const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
    const material_fonts_1 = require("@angular/material/schematics/ng-add/fonts/material-fonts");
    const theming_1 = require("@angular/material/schematics/ng-add/theming/theming");
    /** Name of the Angular module that enables Angular browser animations. */
    const browserAnimationsModuleName = 'BrowserAnimationsModule';
    /** Name of the module that switches Angular animations to a noop implementation. */
    const noopAnimationsModuleName = 'NoopAnimationsModule';
    /**
     * Scaffolds the basics of a Angular Material application, this includes:
     *  - Add Packages to package.json
     *  - Adds pre-built themes to styles.ext
     *  - Adds Browser Animation to app.module
     */
    function default_1(options) {
        return schematics_1.chain([
            addAnimationsModule(options),
            theming_1.addThemeToAppStyles(options),
            material_fonts_1.addFontsToIndex(options),
            addMaterialAppStyles(options),
        ]);
    }
    exports.default = default_1;
    /**
     * Adds an animation module to the root module of the specified project. In case the "animations"
     * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
     * components of Angular Material will throw an exception.
     */
    function addAnimationsModule(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const appModulePath = ng_ast_utils_1.getAppModulePath(host, schematics_2.getProjectMainFile(project));
            if (options.animations) {
                // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
                // message that makes the user aware of the fact that we won't automatically set up
                // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
                // is already configured, we would cause unexpected behavior and runtime exceptions.
                if (schematics_2.hasNgModuleImport(host, appModulePath, noopAnimationsModuleName)) {
                    return console.warn(chalk_1.default.red(`Could not set up "${chalk_1.default.bold(browserAnimationsModuleName)}" ` +
                        `because "${chalk_1.default.bold(noopAnimationsModuleName)}" is already imported. Please ` +
                        `manually set up browser animations.`));
                }
                schematics_2.addModuleImportToRootModule(host, browserAnimationsModuleName, '@angular/platform-browser/animations', project);
            }
            else if (!schematics_2.hasNgModuleImport(host, appModulePath, browserAnimationsModuleName)) {
                // Do not add the NoopAnimationsModule module if the project already explicitly uses
                // the BrowserAnimationsModule.
                schematics_2.addModuleImportToRootModule(host, noopAnimationsModuleName, '@angular/platform-browser/animations', project);
            }
            return host;
        };
    }
    /**
     * Adds custom Material styles to the project style file. The custom CSS sets up the Roboto font
     * and reset the default browser body margin.
     */
    function addMaterialAppStyles(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const styleFilePath = schematics_2.getProjectStyleFile(project);
            if (!styleFilePath) {
                console.warn(chalk_1.default.red(`Could not find the default style file for this project.`));
                console.warn(chalk_1.default.red(`Please consider manually setting up the Roboto font in your CSS.`));
                return;
            }
            const buffer = host.read(styleFilePath);
            if (!buffer) {
                console.warn(chalk_1.default.red(`Could not read the default style file within the project ` +
                    `(${chalk_1.default.italic(styleFilePath)})`));
                console.warn(chalk_1.default.red(`Please consider manually setting up the Robot font.`));
                return;
            }
            const htmlContent = buffer.toString();
            const insertion = '\n' +
                `html, body { height: 100%; }\n` +
                `body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }\n`;
            if (htmlContent.includes(insertion)) {
                return;
            }
            const recorder = host.beginUpdate(styleFilePath);
            recorder.insertLeft(htmlContent.length, insertion);
            host.commitUpdate(recorder);
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQTZEO0lBQzdELHdEQU1pQztJQUNqQyxpQ0FBMEI7SUFDMUIsK0RBQWdFO0lBQ2hFLDJFQUEwRTtJQUMxRSw2RkFBdUQ7SUFFdkQsaUZBQXNEO0lBRXRELDBFQUEwRTtJQUMxRSxNQUFNLDJCQUEyQixHQUFHLHlCQUF5QixDQUFDO0lBRTlELG9GQUFvRjtJQUNwRixNQUFNLHdCQUF3QixHQUFHLHNCQUFzQixDQUFDO0lBRXhEOzs7OztPQUtHO0lBQ0gsbUJBQXdCLE9BQWU7UUFDckMsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsbUJBQW1CLENBQUMsT0FBTyxDQUFDO1lBQzVCLDZCQUFtQixDQUFDLE9BQU8sQ0FBQztZQUM1QixnQ0FBZSxDQUFDLE9BQU8sQ0FBQztZQUN4QixvQkFBb0IsQ0FBQyxPQUFPLENBQUM7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVBELDRCQU9DO0lBRUQ7Ozs7T0FJRztJQUNILFNBQVMsbUJBQW1CLENBQUMsT0FBZTtRQUMxQyxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxvQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sYUFBYSxHQUFHLCtCQUFnQixDQUFDLElBQUksRUFBRSwrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTFFLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtnQkFDdEIsMEZBQTBGO2dCQUMxRixtRkFBbUY7Z0JBQ25GLHlGQUF5RjtnQkFDekYsb0ZBQW9GO2dCQUNwRixJQUFJLDhCQUFpQixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsd0JBQXdCLENBQUMsRUFBRTtvQkFDcEUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQ3pCLHFCQUFxQixlQUFLLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUk7d0JBQ2hFLFlBQVksZUFBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQ0FBZ0M7d0JBQ2hGLHFDQUFxQyxDQUFDLENBQUMsQ0FBQztpQkFDN0M7Z0JBRUQsd0NBQTJCLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUN6RCxzQ0FBc0MsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN0RDtpQkFBTSxJQUFJLENBQUMsOEJBQWlCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxFQUFFO2dCQUMvRSxvRkFBb0Y7Z0JBQ3BGLCtCQUErQjtnQkFDL0Isd0NBQTJCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUN4RCxzQ0FBc0MsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNwRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsb0JBQW9CLENBQUMsT0FBZTtRQUMzQyxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxvQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sYUFBYSxHQUFHLGdDQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLE9BQU87YUFDUjtZQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFeEMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsMkRBQTJEO29CQUNoRixJQUFJLGVBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxxREFBcUQsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLE9BQU87YUFDUjtZQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QyxNQUFNLFNBQVMsR0FBRyxJQUFJO2dCQUNwQixnQ0FBZ0M7Z0JBQ2hDLDBFQUEwRSxDQUFDO1lBRTdFLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDbkMsT0FBTzthQUNSO1lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVqRCxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7SUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIFJ1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZSxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgZ2V0UHJvamVjdFN0eWxlRmlsZSxcbiAgaGFzTmdNb2R1bGVJbXBvcnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NvbmZpZyc7XG5pbXBvcnQge2dldEFwcE1vZHVsZVBhdGh9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9uZy1hc3QtdXRpbHMnO1xuaW1wb3J0IHthZGRGb250c1RvSW5kZXh9IGZyb20gJy4vZm9udHMvbWF0ZXJpYWwtZm9udHMnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7YWRkVGhlbWVUb0FwcFN0eWxlc30gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuXG4vKiogTmFtZSBvZiB0aGUgQW5ndWxhciBtb2R1bGUgdGhhdCBlbmFibGVzIEFuZ3VsYXIgYnJvd3NlciBhbmltYXRpb25zLiAqL1xuY29uc3QgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlJztcblxuLyoqIE5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IHN3aXRjaGVzIEFuZ3VsYXIgYW5pbWF0aW9ucyB0byBhIG5vb3AgaW1wbGVtZW50YXRpb24uICovXG5jb25zdCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnTm9vcEFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyB0aGUgYmFzaWNzIG9mIGEgQW5ndWxhciBNYXRlcmlhbCBhcHBsaWNhdGlvbiwgdGhpcyBpbmNsdWRlczpcbiAqICAtIEFkZCBQYWNrYWdlcyB0byBwYWNrYWdlLmpzb25cbiAqICAtIEFkZHMgcHJlLWJ1aWx0IHRoZW1lcyB0byBzdHlsZXMuZXh0XG4gKiAgLSBBZGRzIEJyb3dzZXIgQW5pbWF0aW9uIHRvIGFwcC5tb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBjaGFpbihbXG4gICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgIGFkZEZvbnRzVG9JbmRleChvcHRpb25zKSxcbiAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyBhbiBhbmltYXRpb24gbW9kdWxlIHRvIHRoZSByb290IG1vZHVsZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuIEluIGNhc2UgdGhlIFwiYW5pbWF0aW9uc1wiXG4gKiBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB3ZSBzdGlsbCBhZGQgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgYmVjYXVzZSBvdGhlcndpc2UgdmFyaW91c1xuICogY29tcG9uZW50cyBvZiBBbmd1bGFyIE1hdGVyaWFsIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBhcHBNb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aChob3N0LCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuXG4gICAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucykge1xuICAgICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB3aGlsZSB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGVcbiAgICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgICAgaWYgKGhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihjaGFsay5yZWQoXG4gICAgICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7Y2hhbGsuYm9sZChicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpfVwiIGAgK1xuICAgICAgICAgICAgYGJlY2F1c2UgXCIke2NoYWxrLmJvbGQobm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lKX1cIiBpcyBhbHJlYWR5IGltcG9ydGVkLiBQbGVhc2UgYCArXG4gICAgICAgICAgICBgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKSk7XG4gICAgICB9XG5cbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShob3N0LCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsIHByb2plY3QpO1xuICAgIH0gZWxzZSBpZiAoIWhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgIC8vIERvIG5vdCBhZGQgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlIG1vZHVsZSBpZiB0aGUgcHJvamVjdCBhbHJlYWR5IGV4cGxpY2l0bHkgdXNlc1xuICAgICAgLy8gdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLlxuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKGhvc3QsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsIHByb2plY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG4vKipcbiAqIEFkZHMgY3VzdG9tIE1hdGVyaWFsIHN0eWxlcyB0byB0aGUgcHJvamVjdCBzdHlsZSBmaWxlLiBUaGUgY3VzdG9tIENTUyBzZXRzIHVwIHRoZSBSb2JvdG8gZm9udFxuICogYW5kIHJlc2V0IHRoZSBkZWZhdWx0IGJyb3dzZXIgYm9keSBtYXJnaW4uXG4gKi9cbmZ1bmN0aW9uIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZ2V0UHJvamVjdFN0eWxlRmlsZShwcm9qZWN0KTtcblxuICAgIGlmICghc3R5bGVGaWxlUGF0aCkge1xuICAgICAgY29uc29sZS53YXJuKGNoYWxrLnJlZChgQ291bGQgbm90IGZpbmQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSBmb3IgdGhpcyBwcm9qZWN0LmApKTtcbiAgICAgIGNvbnNvbGUud2FybihjaGFsay5yZWQoYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdG8gZm9udCBpbiB5b3VyIENTUy5gKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGNvbnNvbGUud2FybihjaGFsay5yZWQoYENvdWxkIG5vdCByZWFkIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgd2l0aGluIHRoZSBwcm9qZWN0IGAgK1xuICAgICAgICBgKCR7Y2hhbGsuaXRhbGljKHN0eWxlRmlsZVBhdGgpfSlgKSk7XG4gICAgICBjb25zb2xlLndhcm4oY2hhbGsucmVkKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3QgZm9udC5gKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbENvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCBpbnNlcnRpb24gPSAnXFxuJyArXG4gICAgICBgaHRtbCwgYm9keSB7IGhlaWdodDogMTAwJTsgfVxcbmAgK1xuICAgICAgYGJvZHkgeyBtYXJnaW46IDA7IGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjsgfVxcbmA7XG5cbiAgICBpZiAoaHRtbENvbnRlbnQuaW5jbHVkZXMoaW5zZXJ0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZUZpbGVQYXRoKTtcblxuICAgIHJlY29yZGVyLmluc2VydExlZnQoaHRtbENvbnRlbnQubGVuZ3RoLCBpbnNlcnRpb24pO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgfTtcbn1cbiJdfQ==