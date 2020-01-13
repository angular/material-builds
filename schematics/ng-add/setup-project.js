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
        define("@angular/material/schematics/ng-add/setup-project", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics", "@schematics/angular/utility/config", "@angular/material/schematics/ng-add/fonts/material-fonts", "@angular/material/schematics/ng-add/theming/theming"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    const config_1 = require("@schematics/angular/utility/config");
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
        return (host, context) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const appModulePath = schematics_2.getAppModulePath(host, schematics_2.getProjectMainFile(project));
            if (options.animations) {
                // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
                // message that makes the user aware of the fact that we won't automatically set up
                // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
                // is already configured, we would cause unexpected behavior and runtime exceptions.
                if (schematics_2.hasNgModuleImport(host, appModulePath, noopAnimationsModuleName)) {
                    context.logger.error(`Could not set up "${browserAnimationsModuleName}" ` +
                        `because "${noopAnimationsModuleName}" is already imported.`);
                    context.logger.info(`Please manually set up browser animations.`);
                    return;
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
        return (host, context) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const styleFilePath = schematics_2.getProjectStyleFile(project);
            const logger = context.logger;
            if (!styleFilePath) {
                logger.error(`Could not find the default style file for this project.`);
                logger.info(`Please consider manually setting up the Roboto font in your CSS.`);
                return;
            }
            const buffer = host.read(styleFilePath);
            if (!buffer) {
                logger.error(`Could not read the default style file within the project ` +
                    `(${styleFilePath})`);
                logger.info(`Please consider manually setting up the Robot font.`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQStFO0lBQy9FLHdEQU9pQztJQUNqQywrREFBZ0U7SUFDaEUsNkZBQXVEO0lBRXZELGlGQUEwRTtJQUUxRSwwRUFBMEU7SUFDMUUsTUFBTSwyQkFBMkIsR0FBRyx5QkFBeUIsQ0FBQztJQUU5RCxvRkFBb0Y7SUFDcEYsTUFBTSx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQztJQUV4RDs7Ozs7T0FLRztJQUNILG1CQUF3QixPQUFlO1FBQ3JDLE9BQU8sa0JBQUssQ0FBQztZQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztZQUM1Qiw2QkFBbUIsQ0FBQyxPQUFPLENBQUM7WUFDNUIsZ0NBQWUsQ0FBQyxPQUFPLENBQUM7WUFDeEIsb0JBQW9CLENBQUMsT0FBTyxDQUFDO1lBQzdCLDRCQUFrQixDQUFDLE9BQU8sQ0FBQztTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBUkQsNEJBUUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyxtQkFBbUIsQ0FBQyxPQUFlO1FBQzFDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1lBQy9DLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLGFBQWEsR0FBRyw2QkFBZ0IsQ0FBQyxJQUFJLEVBQUUsK0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUUxRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3RCLDBGQUEwRjtnQkFDMUYsbUZBQW1GO2dCQUNuRix5RkFBeUY7Z0JBQ3pGLG9GQUFvRjtnQkFDcEYsSUFBSSw4QkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixDQUFDLEVBQUU7b0JBQ3BFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNoQixxQkFBcUIsMkJBQTJCLElBQUk7d0JBQ3BELFlBQVksd0JBQXdCLHdCQUF3QixDQUFDLENBQUM7b0JBQ2xFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7b0JBQ2xFLE9BQU87aUJBQ1I7Z0JBRUQsd0NBQTJCLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUN6RCxzQ0FBc0MsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN0RDtpQkFBTSxJQUFJLENBQUMsOEJBQWlCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxFQUFFO2dCQUMvRSxvRkFBb0Y7Z0JBQ3BGLCtCQUErQjtnQkFDL0Isd0NBQTJCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUN4RCxzQ0FBc0MsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNwRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsb0JBQW9CLENBQUMsT0FBZTtRQUMzQyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUMvQyxNQUFNLFNBQVMsR0FBRyxxQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sT0FBTyxHQUFHLG9DQUF1QixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEUsTUFBTSxhQUFhLEdBQUcsZ0NBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUU5QixJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0VBQWtFLENBQUMsQ0FBQztnQkFDaEYsT0FBTzthQUNSO1lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUV4QyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkRBQTJEO29CQUN0RSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztnQkFDbkUsT0FBTzthQUNSO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUk7Z0JBQ3BCLGdDQUFnQztnQkFDaEMsMEVBQTBFLENBQUM7WUFFN0UsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPO2FBQ1I7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWpELFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRBcHBNb2R1bGVQYXRoLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHthZGRGb250c1RvSW5kZXh9IGZyb20gJy4vZm9udHMvbWF0ZXJpYWwtZm9udHMnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7YWRkVGhlbWVUb0FwcFN0eWxlcywgYWRkVHlwb2dyYXBoeUNsYXNzfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5cbi8qKiBOYW1lIG9mIHRoZSBBbmd1bGFyIG1vZHVsZSB0aGF0IGVuYWJsZXMgQW5ndWxhciBicm93c2VyIGFuaW1hdGlvbnMuICovXG5jb25zdCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKiogTmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgc3dpdGNoZXMgQW5ndWxhciBhbmltYXRpb25zIHRvIGEgbm9vcCBpbXBsZW1lbnRhdGlvbi4gKi9cbmNvbnN0IG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdOb29wQW5pbWF0aW9uc01vZHVsZSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIHRoZSBiYXNpY3Mgb2YgYSBBbmd1bGFyIE1hdGVyaWFsIGFwcGxpY2F0aW9uLCB0aGlzIGluY2x1ZGVzOlxuICogIC0gQWRkIFBhY2thZ2VzIHRvIHBhY2thZ2UuanNvblxuICogIC0gQWRkcyBwcmUtYnVpbHQgdGhlbWVzIHRvIHN0eWxlcy5leHRcbiAqICAtIEFkZHMgQnJvd3NlciBBbmltYXRpb24gdG8gYXBwLm1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGNoYWluKFtcbiAgICBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnMpLFxuICAgIGFkZFRoZW1lVG9BcHBTdHlsZXMob3B0aW9ucyksXG4gICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zKSxcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyBhbiBhbmltYXRpb24gbW9kdWxlIHRvIHRoZSByb290IG1vZHVsZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuIEluIGNhc2UgdGhlIFwiYW5pbWF0aW9uc1wiXG4gKiBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB3ZSBzdGlsbCBhZGQgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgYmVjYXVzZSBvdGhlcndpc2UgdmFyaW91c1xuICogY29tcG9uZW50cyBvZiBBbmd1bGFyIE1hdGVyaWFsIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBhcHBNb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aChob3N0LCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuXG4gICAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucykge1xuICAgICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB3aGlsZSB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGVcbiAgICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgICAgaWYgKGhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7YnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGAgK1xuICAgICAgICAgICAgYGJlY2F1c2UgXCIke25vb3BBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBpcyBhbHJlYWR5IGltcG9ydGVkLmApO1xuICAgICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoaG9zdCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9IGVsc2UgaWYgKCFoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAgIC8vIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZS5cbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShob3N0LCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGN1c3RvbSBNYXRlcmlhbCBzdHlsZXMgdG8gdGhlIHByb2plY3Qgc3R5bGUgZmlsZS4gVGhlIGN1c3RvbSBDU1Mgc2V0cyB1cCB0aGUgUm9ib3RvIGZvbnRcbiAqIGFuZCByZXNldCB0aGUgZGVmYXVsdCBicm93c2VyIGJvZHkgbWFyZ2luLlxuICovXG5mdW5jdGlvbiBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3Qgc3R5bGVGaWxlUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCk7XG4gICAgY29uc3QgbG9nZ2VyID0gY29udGV4dC5sb2dnZXI7XG5cbiAgICBpZiAoIXN0eWxlRmlsZVBhdGgpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IGZpbmQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSBmb3IgdGhpcyBwcm9qZWN0LmApO1xuICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdG8gZm9udCBpbiB5b3VyIENTUy5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgbG9nZ2VyLmVycm9yKGBDb3VsZCBub3QgcmVhZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIHdpdGhpbiB0aGUgcHJvamVjdCBgICtcbiAgICAgICAgYCgke3N0eWxlRmlsZVBhdGh9KWApO1xuICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdCBmb250LmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5zZXJ0aW9uID0gJ1xcbicgK1xuICAgICAgYGh0bWwsIGJvZHkgeyBoZWlnaHQ6IDEwMCU7IH1cXG5gICtcbiAgICAgIGBib2R5IHsgbWFyZ2luOiAwOyBmb250LWZhbWlseTogUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7IH1cXG5gO1xuXG4gICAgaWYgKGh0bWxDb250ZW50LmluY2x1ZGVzKGluc2VydGlvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGh0bWxDb250ZW50Lmxlbmd0aCwgaW5zZXJ0aW9uKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG4iXX0=