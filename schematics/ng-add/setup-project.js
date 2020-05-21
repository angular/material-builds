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
        return (host, context) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            if (project.projectType === 'application') {
                return schematics_1.chain([
                    addAnimationsModule(options),
                    theming_1.addThemeToAppStyles(options),
                    material_fonts_1.addFontsToIndex(options),
                    addMaterialAppStyles(options),
                    theming_1.addTypographyClass(options),
                ]);
            }
            context.logger.warn('Angular Material has been set up in your workspace. There is no additional setup ' +
                'required for consuming Angular Material in your library project.\n\n' +
                'If you intended to run the schematic on a different project, pass the `--project` ' +
                'option.');
            return host;
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQStFO0lBQy9FLHdEQU9pQztJQUNqQywrREFBZ0U7SUFDaEUsNkZBQXVEO0lBRXZELGlGQUEwRTtJQUUxRSwwRUFBMEU7SUFDMUUsTUFBTSwyQkFBMkIsR0FBRyx5QkFBeUIsQ0FBQztJQUU5RCxvRkFBb0Y7SUFDcEYsTUFBTSx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQztJQUV4RDs7Ozs7T0FLRztJQUNILG1CQUF3QixPQUFlO1FBQ3JDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1lBQy9DLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVwRSxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssYUFBYSxFQUFFO2dCQUN6QyxPQUFPLGtCQUFLLENBQUM7b0JBQ1gsbUJBQW1CLENBQUMsT0FBTyxDQUFDO29CQUM1Qiw2QkFBbUIsQ0FBQyxPQUFPLENBQUM7b0JBQzVCLGdDQUFlLENBQUMsT0FBTyxDQUFDO29CQUN4QixvQkFBb0IsQ0FBQyxPQUFPLENBQUM7b0JBQzdCLDRCQUFrQixDQUFDLE9BQU8sQ0FBQztpQkFDNUIsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDZixtRkFBbUY7Z0JBQ25GLHNFQUFzRTtnQkFDdEUsb0ZBQW9GO2dCQUNwRixTQUFTLENBQUMsQ0FBQztZQUNmLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FB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QUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRBcHBNb2R1bGVQYXRoLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHthZGRGb250c1RvSW5kZXh9IGZyb20gJy4vZm9udHMvbWF0ZXJpYWwtZm9udHMnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7YWRkVGhlbWVUb0FwcFN0eWxlcywgYWRkVHlwb2dyYXBoeUNsYXNzfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5cbi8qKiBOYW1lIG9mIHRoZSBBbmd1bGFyIG1vZHVsZSB0aGF0IGVuYWJsZXMgQW5ndWxhciBicm93c2VyIGFuaW1hdGlvbnMuICovXG5jb25zdCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKiogTmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgc3dpdGNoZXMgQW5ndWxhciBhbmltYXRpb25zIHRvIGEgbm9vcCBpbXBsZW1lbnRhdGlvbi4gKi9cbmNvbnN0IG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdOb29wQW5pbWF0aW9uc01vZHVsZSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIHRoZSBiYXNpY3Mgb2YgYSBBbmd1bGFyIE1hdGVyaWFsIGFwcGxpY2F0aW9uLCB0aGlzIGluY2x1ZGVzOlxuICogIC0gQWRkIFBhY2thZ2VzIHRvIHBhY2thZ2UuanNvblxuICogIC0gQWRkcyBwcmUtYnVpbHQgdGhlbWVzIHRvIHN0eWxlcy5leHRcbiAqICAtIEFkZHMgQnJvd3NlciBBbmltYXRpb24gdG8gYXBwLm1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICBpZiAocHJvamVjdC5wcm9qZWN0VHlwZSA9PT0gJ2FwcGxpY2F0aW9uJykge1xuICAgICAgcmV0dXJuIGNoYWluKFtcbiAgICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICAgICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgICAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnMpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGNvbnRleHQubG9nZ2VyLndhcm4oXG4gICAgICAgICdBbmd1bGFyIE1hdGVyaWFsIGhhcyBiZWVuIHNldCB1cCBpbiB5b3VyIHdvcmtzcGFjZS4gVGhlcmUgaXMgbm8gYWRkaXRpb25hbCBzZXR1cCAnICtcbiAgICAgICAgJ3JlcXVpcmVkIGZvciBjb25zdW1pbmcgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGxpYnJhcnkgcHJvamVjdC5cXG5cXG4nICtcbiAgICAgICAgJ0lmIHlvdSBpbnRlbmRlZCB0byBydW4gdGhlIHNjaGVtYXRpYyBvbiBhIGRpZmZlcmVudCBwcm9qZWN0LCBwYXNzIHRoZSBgLS1wcm9qZWN0YCAnICtcbiAgICAgICAgJ29wdGlvbi4nKTtcbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGFuaW1hdGlvbiBtb2R1bGUgdG8gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBzcGVjaWZpZWQgcHJvamVjdC4gSW4gY2FzZSB0aGUgXCJhbmltYXRpb25zXCJcbiAqIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHdlIHN0aWxsIGFkZCB0aGUgYE5vb3BBbmltYXRpb25zTW9kdWxlYCBiZWNhdXNlIG90aGVyd2lzZSB2YXJpb3VzXG4gKiBjb21wb25lbnRzIG9mIEFuZ3VsYXIgTWF0ZXJpYWwgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IGFwcE1vZHVsZVBhdGggPSBnZXRBcHBNb2R1bGVQYXRoKGhvc3QsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG5cbiAgICBpZiAob3B0aW9ucy5hbmltYXRpb25zKSB7XG4gICAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IGV4cGxpY2l0bHkgdXNlcyB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUsIHdlIHNob3VsZCBwcmludCBhIHdhcm5pbmdcbiAgICAgIC8vIG1lc3NhZ2UgdGhhdCBtYWtlcyB0aGUgdXNlciBhd2FyZSBvZiB0aGUgZmFjdCB0aGF0IHdlIHdvbid0IGF1dG9tYXRpY2FsbHkgc2V0IHVwXG4gICAgICAvLyBhbmltYXRpb25zLiBJZiB3ZSB3b3VsZCBhZGQgdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIHdoaWxlIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZVxuICAgICAgLy8gaXMgYWxyZWFkeSBjb25maWd1cmVkLCB3ZSB3b3VsZCBjYXVzZSB1bmV4cGVjdGVkIGJlaGF2aW9yIGFuZCBydW50aW1lIGV4Y2VwdGlvbnMuXG4gICAgICBpZiAoaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lKSkge1xuICAgICAgICBjb250ZXh0LmxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgIGBDb3VsZCBub3Qgc2V0IHVwIFwiJHticm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgYCArXG4gICAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuYCk7XG4gICAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShob3N0LCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsIHByb2plY3QpO1xuICAgIH0gZWxzZSBpZiAoIWhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgIC8vIERvIG5vdCBhZGQgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlIG1vZHVsZSBpZiB0aGUgcHJvamVjdCBhbHJlYWR5IGV4cGxpY2l0bHkgdXNlc1xuICAgICAgLy8gdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLlxuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKGhvc3QsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsIHByb2plY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG4vKipcbiAqIEFkZHMgY3VzdG9tIE1hdGVyaWFsIHN0eWxlcyB0byB0aGUgcHJvamVjdCBzdHlsZSBmaWxlLiBUaGUgY3VzdG9tIENTUyBzZXRzIHVwIHRoZSBSb2JvdG8gZm9udFxuICogYW5kIHJlc2V0IHRoZSBkZWZhdWx0IGJyb3dzZXIgYm9keSBtYXJnaW4uXG4gKi9cbmZ1bmN0aW9uIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZ2V0UHJvamVjdFN0eWxlRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCBsb2dnZXIgPSBjb250ZXh0LmxvZ2dlcjtcblxuICAgIGlmICghc3R5bGVGaWxlUGF0aCkge1xuICAgICAgbG9nZ2VyLmVycm9yKGBDb3VsZCBub3QgZmluZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIGZvciB0aGlzIHByb2plY3QuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90byBmb250IGluIHlvdXIgQ1NTLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChzdHlsZUZpbGVQYXRoKTtcblxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoYENvdWxkIG5vdCByZWFkIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgd2l0aGluIHRoZSBwcm9qZWN0IGAgK1xuICAgICAgICBgKCR7c3R5bGVGaWxlUGF0aH0pYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90IGZvbnQuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbENvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCBpbnNlcnRpb24gPSAnXFxuJyArXG4gICAgICBgaHRtbCwgYm9keSB7IGhlaWdodDogMTAwJTsgfVxcbmAgK1xuICAgICAgYGJvZHkgeyBtYXJnaW46IDA7IGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjsgfVxcbmA7XG5cbiAgICBpZiAoaHRtbENvbnRlbnQuaW5jbHVkZXMoaW5zZXJ0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZUZpbGVQYXRoKTtcblxuICAgIHJlY29yZGVyLmluc2VydExlZnQoaHRtbENvbnRlbnQubGVuZ3RoLCBpbnNlcnRpb24pO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgfTtcbn1cbiJdfQ==