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
            theming_1.addTypographyClass(options),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQTZEO0lBQzdELHdEQU1pQztJQUNqQyxpQ0FBMEI7SUFDMUIsK0RBQWdFO0lBQ2hFLDJFQUEwRTtJQUMxRSw2RkFBdUQ7SUFFdkQsaUZBQTBFO0lBRTFFLDBFQUEwRTtJQUMxRSxNQUFNLDJCQUEyQixHQUFHLHlCQUF5QixDQUFDO0lBRTlELG9GQUFvRjtJQUNwRixNQUFNLHdCQUF3QixHQUFHLHNCQUFzQixDQUFDO0lBRXhEOzs7OztPQUtHO0lBQ0gsbUJBQXdCLE9BQWU7UUFDckMsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsbUJBQW1CLENBQUMsT0FBTyxDQUFDO1lBQzVCLDZCQUFtQixDQUFDLE9BQU8sQ0FBQztZQUM1QixnQ0FBZSxDQUFDLE9BQU8sQ0FBQztZQUN4QixvQkFBb0IsQ0FBQyxPQUFPLENBQUM7WUFDN0IsNEJBQWtCLENBQUMsT0FBTyxDQUFDO1NBQzVCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFSRCw0QkFRQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTLG1CQUFtQixDQUFDLE9BQWU7UUFDMUMsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGFBQWEsR0FBRywrQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsK0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUUxRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3RCLDBGQUEwRjtnQkFDMUYsbUZBQW1GO2dCQUNuRix5RkFBeUY7Z0JBQ3pGLG9GQUFvRjtnQkFDcEYsSUFBSSw4QkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixDQUFDLEVBQUU7b0JBQ3BFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUN6QixxQkFBcUIsZUFBSyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJO3dCQUNoRSxZQUFZLGVBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsZ0NBQWdDO3dCQUNoRixxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7aUJBQzdDO2dCQUVELHdDQUEyQixDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFDekQsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDdEQ7aUJBQU0sSUFBSSxDQUFDLDhCQUFpQixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsMkJBQTJCLENBQUMsRUFBRTtnQkFDL0Usb0ZBQW9GO2dCQUNwRiwrQkFBK0I7Z0JBQy9CLHdDQUEyQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFDeEQsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDcEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLG9CQUFvQixDQUFDLE9BQWU7UUFDM0MsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGFBQWEsR0FBRyxnQ0FBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMseURBQXlELENBQUMsQ0FBQyxDQUFDO2dCQUNuRixPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsa0VBQWtFLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixPQUFPO2FBQ1I7WUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXhDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLDJEQUEyRDtvQkFDaEYsSUFBSSxlQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQyxDQUFDO2dCQUMvRSxPQUFPO2FBQ1I7WUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEMsTUFBTSxTQUFTLEdBQUcsSUFBSTtnQkFDcEIsZ0NBQWdDO2dCQUNoQywwRUFBMEUsQ0FBQztZQUU3RSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ25DLE9BQU87YUFDUjtZQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBSdWxlLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGhhc05nTW9kdWxlSW1wb3J0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtnZXRBcHBNb2R1bGVQYXRofSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvbmctYXN0LXV0aWxzJztcbmltcG9ydCB7YWRkRm9udHNUb0luZGV4fSBmcm9tICcuL2ZvbnRzL21hdGVyaWFsLWZvbnRzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2FkZFRoZW1lVG9BcHBTdHlsZXMsIGFkZFR5cG9ncmFwaHlDbGFzc30gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuXG4vKiogTmFtZSBvZiB0aGUgQW5ndWxhciBtb2R1bGUgdGhhdCBlbmFibGVzIEFuZ3VsYXIgYnJvd3NlciBhbmltYXRpb25zLiAqL1xuY29uc3QgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlJztcblxuLyoqIE5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IHN3aXRjaGVzIEFuZ3VsYXIgYW5pbWF0aW9ucyB0byBhIG5vb3AgaW1wbGVtZW50YXRpb24uICovXG5jb25zdCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnTm9vcEFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyB0aGUgYmFzaWNzIG9mIGEgQW5ndWxhciBNYXRlcmlhbCBhcHBsaWNhdGlvbiwgdGhpcyBpbmNsdWRlczpcbiAqICAtIEFkZCBQYWNrYWdlcyB0byBwYWNrYWdlLmpzb25cbiAqICAtIEFkZHMgcHJlLWJ1aWx0IHRoZW1lcyB0byBzdHlsZXMuZXh0XG4gKiAgLSBBZGRzIEJyb3dzZXIgQW5pbWF0aW9uIHRvIGFwcC5tb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBjaGFpbihbXG4gICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgIGFkZEZvbnRzVG9JbmRleChvcHRpb25zKSxcbiAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9ucyksXG4gIF0pO1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYW5pbWF0aW9uIG1vZHVsZSB0byB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIHNwZWNpZmllZCBwcm9qZWN0LiBJbiBjYXNlIHRoZSBcImFuaW1hdGlvbnNcIlxuICogb3B0aW9uIGlzIHNldCB0byBmYWxzZSwgd2Ugc3RpbGwgYWRkIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGJlY2F1c2Ugb3RoZXJ3aXNlIHZhcmlvdXNcbiAqIGNvbXBvbmVudHMgb2YgQW5ndWxhciBNYXRlcmlhbCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgYXBwTW9kdWxlUGF0aCA9IGdldEFwcE1vZHVsZVBhdGgoaG9zdCwgZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpKTtcblxuICAgIGlmIChvcHRpb25zLmFuaW1hdGlvbnMpIHtcbiAgICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSwgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICAgIGlmIChoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oY2hhbGsucmVkKFxuICAgICAgICAgICAgYENvdWxkIG5vdCBzZXQgdXAgXCIke2NoYWxrLmJvbGQoYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKX1cIiBgICtcbiAgICAgICAgICAgIGBiZWNhdXNlIFwiJHtjaGFsay5ib2xkKG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSl9XCIgaXMgYWxyZWFkeSBpbXBvcnRlZC4gUGxlYXNlIGAgK1xuICAgICAgICAgICAgYG1hbnVhbGx5IHNldCB1cCBicm93c2VyIGFuaW1hdGlvbnMuYCkpO1xuICAgICAgfVxuXG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoaG9zdCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9IGVsc2UgaWYgKCFoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAgIC8vIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZS5cbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShob3N0LCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGN1c3RvbSBNYXRlcmlhbCBzdHlsZXMgdG8gdGhlIHByb2plY3Qgc3R5bGUgZmlsZS4gVGhlIGN1c3RvbSBDU1Mgc2V0cyB1cCB0aGUgUm9ib3RvIGZvbnRcbiAqIGFuZCByZXNldCB0aGUgZGVmYXVsdCBicm93c2VyIGJvZHkgbWFyZ2luLlxuICovXG5mdW5jdGlvbiBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3Qgc3R5bGVGaWxlUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCk7XG5cbiAgICBpZiAoIXN0eWxlRmlsZVBhdGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihjaGFsay5yZWQoYENvdWxkIG5vdCBmaW5kIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgZm9yIHRoaXMgcHJvamVjdC5gKSk7XG4gICAgICBjb25zb2xlLndhcm4oY2hhbGsucmVkKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3RvIGZvbnQgaW4geW91ciBDU1MuYCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChzdHlsZUZpbGVQYXRoKTtcblxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBjb25zb2xlLndhcm4oY2hhbGsucmVkKGBDb3VsZCBub3QgcmVhZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIHdpdGhpbiB0aGUgcHJvamVjdCBgICtcbiAgICAgICAgYCgke2NoYWxrLml0YWxpYyhzdHlsZUZpbGVQYXRoKX0pYCkpO1xuICAgICAgY29uc29sZS53YXJuKGNoYWxrLnJlZChgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90IGZvbnQuYCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5zZXJ0aW9uID0gJ1xcbicgK1xuICAgICAgYGh0bWwsIGJvZHkgeyBoZWlnaHQ6IDEwMCU7IH1cXG5gICtcbiAgICAgIGBib2R5IHsgbWFyZ2luOiAwOyBmb250LWZhbWlseTogUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7IH1cXG5gO1xuXG4gICAgaWYgKGh0bWxDb250ZW50LmluY2x1ZGVzKGluc2VydGlvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGh0bWxDb250ZW50Lmxlbmd0aCwgaW5zZXJ0aW9uKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG4iXX0=