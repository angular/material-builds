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
        define("@angular/material/schematics/ng-add/setup-project", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics", "chalk", "@schematics/angular/utility/config", "@schematics/angular/utility/ng-ast-utils", "@angular/material/schematics/ng-add/fonts/material-fonts", "@angular/material/schematics/ng-add/gestures/hammerjs-import", "@angular/material/schematics/ng-add/theming/theming"], factory);
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
    const hammerjs_import_1 = require("@angular/material/schematics/ng-add/gestures/hammerjs-import");
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
            options && options.gestures ? hammerjs_import_1.addHammerJsToMain(options) : schematics_1.noop(),
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
                    return console.warn(chalk_1.red(`Could not set up "${chalk_1.bold(browserAnimationsModuleName)}" ` +
                        `because "${chalk_1.bold(noopAnimationsModuleName)}" is already imported. Please manually ` +
                        `set up browser animations.`));
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
                console.warn(chalk_1.red(`Could not find the default style file for this project.`));
                console.warn(chalk_1.red(`Please consider manually setting up the Roboto font in your CSS.`));
                return;
            }
            const buffer = host.read(styleFilePath);
            if (!buffer) {
                console.warn(chalk_1.red(`Could not read the default style file within the project ` +
                    `(${chalk_1.italic(styleFilePath)})`));
                console.warn(chalk_1.red(`Please consider manually setting up the Robot font.`));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQW1FO0lBQ25FLHdEQU1pQztJQUNqQyxpQ0FBd0M7SUFDeEMsK0RBQWdFO0lBQ2hFLDJFQUEwRTtJQUMxRSw2RkFBdUQ7SUFDdkQsa0dBQTZEO0lBRTdELGlGQUFzRDtJQUV0RCwwRUFBMEU7SUFDMUUsTUFBTSwyQkFBMkIsR0FBRyx5QkFBeUIsQ0FBQztJQUU5RCxvRkFBb0Y7SUFDcEYsTUFBTSx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQztJQUV4RDs7Ozs7T0FLRztJQUNILG1CQUF3QixPQUFlO1FBQ3JDLE9BQU8sa0JBQUssQ0FBQztZQUNYLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQ0FBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQUksRUFBRTtZQUNqRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7WUFDNUIsNkJBQW1CLENBQUMsT0FBTyxDQUFDO1lBQzVCLGdDQUFlLENBQUMsT0FBTyxDQUFDO1lBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBUkQsNEJBUUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxPQUFlO1FBQzFDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtZQUNwQixNQUFNLFNBQVMsR0FBRyxxQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sT0FBTyxHQUFHLG9DQUF1QixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEUsTUFBTSxhQUFhLEdBQUcsK0JBQWdCLENBQUMsSUFBSSxFQUFFLCtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFMUUsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUN0QiwwRkFBMEY7Z0JBQzFGLG1GQUFtRjtnQkFDbkYseUZBQXlGO2dCQUN6RixvRkFBb0Y7Z0JBQ3BGLElBQUksOEJBQWlCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQyxFQUFFO29CQUNwRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLHFCQUFxQixZQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSTt3QkFDOUUsWUFBWSxZQUFJLENBQUMsd0JBQXdCLENBQUMseUNBQXlDO3dCQUNuRiw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7aUJBQ3BDO2dCQUVELHdDQUEyQixDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFDekQsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDdEQ7aUJBQU0sSUFBSSxDQUFDLDhCQUFpQixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsMkJBQTJCLENBQUMsRUFBRTtnQkFDL0Usb0ZBQW9GO2dCQUNwRiwrQkFBK0I7Z0JBQy9CLHdDQUEyQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFDeEQsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDcEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLG9CQUFvQixDQUFDLE9BQWU7UUFDM0MsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGFBQWEsR0FBRyxnQ0FBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLGtFQUFrRSxDQUFDLENBQUMsQ0FBQztnQkFDdEYsT0FBTzthQUNSO1lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUV4QyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLDJEQUEyRDtvQkFDMUUsSUFBSSxjQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUMsQ0FBQztnQkFDekUsT0FBTzthQUNSO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUk7Z0JBQ3BCLGdDQUFnQztnQkFDaEMsMEVBQTBFLENBQUM7WUFFN0UsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPO2FBQ1I7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWpELFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgbm9vcCwgUnVsZSwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtyZWQsIGJvbGQsIGl0YWxpY30gZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHtnZXRBcHBNb2R1bGVQYXRofSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvbmctYXN0LXV0aWxzJztcbmltcG9ydCB7YWRkRm9udHNUb0luZGV4fSBmcm9tICcuL2ZvbnRzL21hdGVyaWFsLWZvbnRzJztcbmltcG9ydCB7YWRkSGFtbWVySnNUb01haW59IGZyb20gJy4vZ2VzdHVyZXMvaGFtbWVyanMtaW1wb3J0JztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2FkZFRoZW1lVG9BcHBTdHlsZXN9IGZyb20gJy4vdGhlbWluZy90aGVtaW5nJztcblxuLyoqIE5hbWUgb2YgdGhlIEFuZ3VsYXIgbW9kdWxlIHRoYXQgZW5hYmxlcyBBbmd1bGFyIGJyb3dzZXIgYW5pbWF0aW9ucy4gKi9cbmNvbnN0IGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdCcm93c2VyQW5pbWF0aW9uc01vZHVsZSc7XG5cbi8qKiBOYW1lIG9mIHRoZSBtb2R1bGUgdGhhdCBzd2l0Y2hlcyBBbmd1bGFyIGFuaW1hdGlvbnMgdG8gYSBub29wIGltcGxlbWVudGF0aW9uLiAqL1xuY29uc3Qgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ05vb3BBbmltYXRpb25zTW9kdWxlJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgdGhlIGJhc2ljcyBvZiBhIEFuZ3VsYXIgTWF0ZXJpYWwgYXBwbGljYXRpb24sIHRoaXMgaW5jbHVkZXM6XG4gKiAgLSBBZGQgUGFja2FnZXMgdG8gcGFja2FnZS5qc29uXG4gKiAgLSBBZGRzIHByZS1idWlsdCB0aGVtZXMgdG8gc3R5bGVzLmV4dFxuICogIC0gQWRkcyBCcm93c2VyIEFuaW1hdGlvbiB0byBhcHAubW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5nZXN0dXJlcyA/IGFkZEhhbW1lckpzVG9NYWluKG9wdGlvbnMpIDogbm9vcCgpLFxuICAgIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9ucyksXG4gICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICBhZGRGb250c1RvSW5kZXgob3B0aW9ucyksXG4gICAgYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9ucyksXG4gIF0pO1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYW5pbWF0aW9uIG1vZHVsZSB0byB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIHNwZWNpZmllZCBwcm9qZWN0LiBJbiBjYXNlIHRoZSBcImFuaW1hdGlvbnNcIlxuICogb3B0aW9uIGlzIHNldCB0byBmYWxzZSwgd2Ugc3RpbGwgYWRkIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGJlY2F1c2Ugb3RoZXJ3aXNlIHZhcmlvdXNcbiAqIGNvbXBvbmVudHMgb2YgQW5ndWxhciBNYXRlcmlhbCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgYXBwTW9kdWxlUGF0aCA9IGdldEFwcE1vZHVsZVBhdGgoaG9zdCwgZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpKTtcblxuICAgIGlmIChvcHRpb25zLmFuaW1hdGlvbnMpIHtcbiAgICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSwgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICAgIGlmIChoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4ocmVkKGBDb3VsZCBub3Qgc2V0IHVwIFwiJHtib2xkKGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSl9XCIgYCArXG4gICAgICAgICAgICBgYmVjYXVzZSBcIiR7Ym9sZChub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuIFBsZWFzZSBtYW51YWxseSBgICtcbiAgICAgICAgICAgIGBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApKTtcbiAgICAgIH1cblxuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKGhvc3QsIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJywgcHJvamVjdCk7XG4gICAgfSBlbHNlIGlmICghaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKSkge1xuICAgICAgLy8gRG8gbm90IGFkZCB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUgbW9kdWxlIGlmIHRoZSBwcm9qZWN0IGFscmVhZHkgZXhwbGljaXRseSB1c2VzXG4gICAgICAvLyB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUuXG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoaG9zdCwgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJywgcHJvamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbi8qKlxuICogQWRkcyBjdXN0b20gTWF0ZXJpYWwgc3R5bGVzIHRvIHRoZSBwcm9qZWN0IHN0eWxlIGZpbGUuIFRoZSBjdXN0b20gQ1NTIHNldHMgdXAgdGhlIFJvYm90byBmb250XG4gKiBhbmQgcmVzZXQgdGhlIGRlZmF1bHQgYnJvd3NlciBib2R5IG1hcmdpbi5cbiAqL1xuZnVuY3Rpb24gYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHN0eWxlRmlsZVBhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QpO1xuXG4gICAgaWYgKCFzdHlsZUZpbGVQYXRoKSB7XG4gICAgICBjb25zb2xlLndhcm4ocmVkKGBDb3VsZCBub3QgZmluZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIGZvciB0aGlzIHByb2plY3QuYCkpO1xuICAgICAgY29uc29sZS53YXJuKHJlZChgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90byBmb250IGluIHlvdXIgQ1NTLmApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgY29uc29sZS53YXJuKHJlZChgQ291bGQgbm90IHJlYWQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSB3aXRoaW4gdGhlIHByb2plY3QgYCArXG4gICAgICAgIGAoJHtpdGFsaWMoc3R5bGVGaWxlUGF0aCl9KWApKTtcbiAgICAgIGNvbnNvbGUud2FybihyZWQoYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdCBmb250LmApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBodG1sQ29udGVudCA9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgIGNvbnN0IGluc2VydGlvbiA9ICdcXG4nICtcbiAgICAgIGBodG1sLCBib2R5IHsgaGVpZ2h0OiAxMDAlOyB9XFxuYCArXG4gICAgICBgYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XFxuYDtcblxuICAgIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhpbnNlcnRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChodG1sQ29udGVudC5sZW5ndGgsIGluc2VydGlvbik7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICB9O1xufVxuIl19