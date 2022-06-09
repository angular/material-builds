"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
const material_fonts_1 = require("./fonts/material-fonts");
const theming_1 = require("./theming/theming");
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
    return async (host, context) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        if (project.extensions.projectType === workspace_models_1.ProjectType.Application) {
            return (0, schematics_1.chain)([
                addAnimationsModule(options),
                (0, theming_1.addThemeToAppStyles)(options),
                (0, material_fonts_1.addFontsToIndex)(options),
                addMaterialAppStyles(options),
                (0, theming_1.addTypographyClass)(options),
            ]);
        }
        context.logger.warn('Angular Material has been set up in your workspace. There is no additional setup ' +
            'required for consuming Angular Material in your library project.\n\n' +
            'If you intended to run the schematic on a different project, pass the `--project` ' +
            'option.');
        return;
    };
}
exports.default = default_1;
/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addAnimationsModule(options) {
    return async (host, context) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        try {
            addAnimationsModuleToNonStandaloneApp(host, project, context, options);
        }
        catch (e) {
            if (e.message?.includes('Bootstrap call not found')) {
                addAnimationsModuleToStandaloneApp(host, project, context, options);
            }
            else {
                throw e;
            }
        }
    };
}
/** Adds the animations module to an app that is bootstrap using the standalone component APIs. */
function addAnimationsModuleToStandaloneApp(host, project, context, options) {
    const mainFile = (0, schematics_2.getProjectMainFile)(project);
    if (options.animations === 'enabled') {
        // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
        // message that makes the user aware of the fact that we won't automatically set up
        // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
        // is already configured, we would cause unexpected behavior and runtime exceptions.
        if ((0, schematics_2.importsProvidersFrom)(host, mainFile, noopAnimationsModuleName)) {
            context.logger.error(`Could not set up "${browserAnimationsModuleName}" ` +
                `because "${noopAnimationsModuleName}" is already imported.`);
            context.logger.info(`Please manually set up browser animations.`);
        }
        else {
            (0, schematics_2.addModuleImportToStandaloneBootstrap)(host, mainFile, browserAnimationsModuleName, '@angular/platform-browser/animations');
        }
    }
    else if (options.animations === 'disabled' &&
        !(0, schematics_2.importsProvidersFrom)(host, mainFile, browserAnimationsModuleName)) {
        // Do not add the NoopAnimationsModule module if the project already explicitly uses
        // the BrowserAnimationsModule.
        (0, schematics_2.addModuleImportToStandaloneBootstrap)(host, mainFile, noopAnimationsModuleName, '@angular/platform-browser/animations');
    }
}
/**
 * Adds the animations module to an app that is bootstrap
 * using the non-standalone component APIs.
 */
function addAnimationsModuleToNonStandaloneApp(host, project, context, options) {
    const appModulePath = (0, schematics_2.getAppModulePath)(host, (0, schematics_2.getProjectMainFile)(project));
    if (options.animations === 'enabled') {
        // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
        // message that makes the user aware of the fact that we won't automatically set up
        // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
        // is already configured, we would cause unexpected behavior and runtime exceptions.
        if ((0, schematics_2.hasNgModuleImport)(host, appModulePath, noopAnimationsModuleName)) {
            context.logger.error(`Could not set up "${browserAnimationsModuleName}" ` +
                `because "${noopAnimationsModuleName}" is already imported.`);
            context.logger.info(`Please manually set up browser animations.`);
        }
        else {
            (0, schematics_2.addModuleImportToRootModule)(host, browserAnimationsModuleName, '@angular/platform-browser/animations', project);
        }
    }
    else if (options.animations === 'disabled' &&
        !(0, schematics_2.hasNgModuleImport)(host, appModulePath, browserAnimationsModuleName)) {
        // Do not add the NoopAnimationsModule module if the project already explicitly uses
        // the BrowserAnimationsModule.
        (0, schematics_2.addModuleImportToRootModule)(host, noopAnimationsModuleName, '@angular/platform-browser/animations', project);
    }
}
/**
 * Adds custom Material styles to the project style file. The custom CSS sets up the Roboto font
 * and reset the default browser body margin.
 */
function addMaterialAppStyles(options) {
    return async (host, context) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        const styleFilePath = (0, schematics_2.getProjectStyleFile)(project);
        const logger = context.logger;
        if (!styleFilePath) {
            logger.error(`Could not find the default style file for this project.`);
            logger.info(`Consider manually adding the Roboto font to your CSS.`);
            logger.info(`More information at https://fonts.google.com/specimen/Roboto`);
            return;
        }
        const buffer = host.read(styleFilePath);
        if (!buffer) {
            logger.error(`Could not read the default style file within the project ` + `(${styleFilePath})`);
            logger.info(`Please consider manually setting up the Roboto font.`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQStFO0FBQy9FLHdEQVNpQztBQUNqQyxxRUFBc0Y7QUFDdEYsbUZBQXlFO0FBQ3pFLDJEQUF1RDtBQUV2RCwrQ0FBMEU7QUFFMUUsMEVBQTBFO0FBQzFFLE1BQU0sMkJBQTJCLEdBQUcseUJBQXlCLENBQUM7QUFFOUQsb0ZBQW9GO0FBQ3BGLE1BQU0sd0JBQXdCLEdBQUcsc0JBQXNCLENBQUM7QUFFeEQ7Ozs7O0dBS0c7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQ3JELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSx3QkFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUEsb0NBQXVCLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxLQUFLLDhCQUFXLENBQUMsV0FBVyxFQUFFO1lBQzlELE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBQSw2QkFBbUIsRUFBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUEsZ0NBQWUsRUFBQyxPQUFPLENBQUM7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztnQkFDN0IsSUFBQSw0QkFBa0IsRUFBQyxPQUFPLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsbUZBQW1GO1lBQ2pGLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFD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QUNuRixDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1lBQ3BFLE9BQU87U0FDUjtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxNQUFNLFNBQVMsR0FDYixJQUFJO1lBQ0osZ0NBQWdDO1lBQ2hDLDBFQUEwRSxDQUFDO1FBRTdFLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNuQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWpELFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRBcHBNb2R1bGVQYXRoLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbiAgaW1wb3J0c1Byb3ZpZGVyc0Zyb20sXG4gIGFkZE1vZHVsZUltcG9ydFRvU3RhbmRhbG9uZUJvb3RzdHJhcCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2UsIFByb2plY3REZWZpbml0aW9ufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7UHJvamVjdFR5cGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCB7YWRkRm9udHNUb0luZGV4fSBmcm9tICcuL2ZvbnRzL21hdGVyaWFsLWZvbnRzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2FkZFRoZW1lVG9BcHBTdHlsZXMsIGFkZFR5cG9ncmFwaHlDbGFzc30gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuXG4vKiogTmFtZSBvZiB0aGUgQW5ndWxhciBtb2R1bGUgdGhhdCBlbmFibGVzIEFuZ3VsYXIgYnJvd3NlciBhbmltYXRpb25zLiAqL1xuY29uc3QgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlJztcblxuLyoqIE5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IHN3aXRjaGVzIEFuZ3VsYXIgYW5pbWF0aW9ucyB0byBhIG5vb3AgaW1wbGVtZW50YXRpb24uICovXG5jb25zdCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnTm9vcEFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyB0aGUgYmFzaWNzIG9mIGEgQW5ndWxhciBNYXRlcmlhbCBhcHBsaWNhdGlvbiwgdGhpcyBpbmNsdWRlczpcbiAqICAtIEFkZCBQYWNrYWdlcyB0byBwYWNrYWdlLmpzb25cbiAqICAtIEFkZHMgcHJlLWJ1aWx0IHRoZW1lcyB0byBzdHlsZXMuZXh0XG4gKiAgLSBBZGRzIEJyb3dzZXIgQW5pbWF0aW9uIHRvIGFwcC5tb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcblxuICAgIGlmIChwcm9qZWN0LmV4dGVuc2lvbnMucHJvamVjdFR5cGUgPT09IFByb2plY3RUeXBlLkFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgICBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnMpLFxuICAgICAgICBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgICAgICBhZGRGb250c1RvSW5kZXgob3B0aW9ucyksXG4gICAgICAgIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgICAgICBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9ucyksXG4gICAgICBdKTtcbiAgICB9XG4gICAgY29udGV4dC5sb2dnZXIud2FybihcbiAgICAgICdBbmd1bGFyIE1hdGVyaWFsIGhhcyBiZWVuIHNldCB1cCBpbiB5b3VyIHdvcmtzcGFjZS4gVGhlcmUgaXMgbm8gYWRkaXRpb25hbCBzZXR1cCAnICtcbiAgICAgICAgJ3JlcXVpcmVkIGZvciBjb25zdW1pbmcgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGxpYnJhcnkgcHJvamVjdC5cXG5cXG4nICtcbiAgICAgICAgJ0lmIHlvdSBpbnRlbmRlZCB0byBydW4gdGhlIHNjaGVtYXRpYyBvbiBhIGRpZmZlcmVudCBwcm9qZWN0LCBwYXNzIHRoZSBgLS1wcm9qZWN0YCAnICtcbiAgICAgICAgJ29wdGlvbi4nLFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9O1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYW5pbWF0aW9uIG1vZHVsZSB0byB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIHNwZWNpZmllZCBwcm9qZWN0LiBJbiBjYXNlIHRoZSBcImFuaW1hdGlvbnNcIlxuICogb3B0aW9uIGlzIHNldCB0byBmYWxzZSwgd2Ugc3RpbGwgYWRkIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGJlY2F1c2Ugb3RoZXJ3aXNlIHZhcmlvdXNcbiAqIGNvbXBvbmVudHMgb2YgQW5ndWxhciBNYXRlcmlhbCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICB0cnkge1xuICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZVRvTm9uU3RhbmRhbG9uZUFwcChob3N0LCBwcm9qZWN0LCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoKGUgYXMge21lc3NhZ2U/OiBzdHJpbmd9KS5tZXNzYWdlPy5pbmNsdWRlcygnQm9vdHN0cmFwIGNhbGwgbm90IGZvdW5kJykpIHtcbiAgICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZVRvU3RhbmRhbG9uZUFwcChob3N0LCBwcm9qZWN0LCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgdG8gYW4gYXBwIHRoYXQgaXMgYm9vdHN0cmFwIHVzaW5nIHRoZSBzdGFuZGFsb25lIGNvbXBvbmVudCBBUElzLiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc01vZHVsZVRvU3RhbmRhbG9uZUFwcChcbiAgaG9zdDogVHJlZSxcbiAgcHJvamVjdDogUHJvamVjdERlZmluaXRpb24sXG4gIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsXG4gIG9wdGlvbnM6IFNjaGVtYSxcbikge1xuICBjb25zdCBtYWluRmlsZSA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcblxuICBpZiAob3B0aW9ucy5hbmltYXRpb25zID09PSAnZW5hYmxlZCcpIHtcbiAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IGV4cGxpY2l0bHkgdXNlcyB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUsIHdlIHNob3VsZCBwcmludCBhIHdhcm5pbmdcbiAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgLy8gaXMgYWxyZWFkeSBjb25maWd1cmVkLCB3ZSB3b3VsZCBjYXVzZSB1bmV4cGVjdGVkIGJlaGF2aW9yIGFuZCBydW50aW1lIGV4Y2VwdGlvbnMuXG4gICAgaWYgKGltcG9ydHNQcm92aWRlcnNGcm9tKGhvc3QsIG1haW5GaWxlLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICBjb250ZXh0LmxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCBzZXQgdXAgXCIke2Jyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBgICtcbiAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuYCxcbiAgICAgICk7XG4gICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9TdGFuZGFsb25lQm9vdHN0cmFwKFxuICAgICAgICBob3N0LFxuICAgICAgICBtYWluRmlsZSxcbiAgICAgICAgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2Rpc2FibGVkJyAmJlxuICAgICFpbXBvcnRzUHJvdmlkZXJzRnJvbShob3N0LCBtYWluRmlsZSwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKVxuICApIHtcbiAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAvLyB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUuXG4gICAgYWRkTW9kdWxlSW1wb3J0VG9TdGFuZGFsb25lQm9vdHN0cmFwKFxuICAgICAgaG9zdCxcbiAgICAgIG1haW5GaWxlLFxuICAgICAgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIGFuaW1hdGlvbnMgbW9kdWxlIHRvIGFuIGFwcCB0aGF0IGlzIGJvb3RzdHJhcFxuICogdXNpbmcgdGhlIG5vbi1zdGFuZGFsb25lIGNvbXBvbmVudCBBUElzLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlVG9Ob25TdGFuZGFsb25lQXBwKFxuICBob3N0OiBUcmVlLFxuICBwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbixcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgb3B0aW9uczogU2NoZW1hLFxuKSB7XG4gIGNvbnN0IGFwcE1vZHVsZVBhdGggPSBnZXRBcHBNb2R1bGVQYXRoKGhvc3QsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG5cbiAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2VuYWJsZWQnKSB7XG4gICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAvLyBhbmltYXRpb25zLiBJZiB3ZSB3b3VsZCBhZGQgdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIHdoaWxlIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZVxuICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgIGlmIChoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICBjb250ZXh0LmxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCBzZXQgdXAgXCIke2Jyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBgICtcbiAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuYCxcbiAgICAgICk7XG4gICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKFxuICAgICAgICBob3N0LFxuICAgICAgICBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgICBwcm9qZWN0LFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5hbmltYXRpb25zID09PSAnZGlzYWJsZWQnICYmXG4gICAgIWhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSlcbiAgKSB7XG4gICAgLy8gRG8gbm90IGFkZCB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUgbW9kdWxlIGlmIHRoZSBwcm9qZWN0IGFscmVhZHkgZXhwbGljaXRseSB1c2VzXG4gICAgLy8gdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLlxuICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShcbiAgICAgIGhvc3QsXG4gICAgICBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICAgIHByb2plY3QsXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgY3VzdG9tIE1hdGVyaWFsIHN0eWxlcyB0byB0aGUgcHJvamVjdCBzdHlsZSBmaWxlLiBUaGUgY3VzdG9tIENTUyBzZXRzIHVwIHRoZSBSb2JvdG8gZm9udFxuICogYW5kIHJlc2V0IHRoZSBkZWZhdWx0IGJyb3dzZXIgYm9keSBtYXJnaW4uXG4gKi9cbmZ1bmN0aW9uIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZ2V0UHJvamVjdFN0eWxlRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCBsb2dnZXIgPSBjb250ZXh0LmxvZ2dlcjtcblxuICAgIGlmICghc3R5bGVGaWxlUGF0aCkge1xuICAgICAgbG9nZ2VyLmVycm9yKGBDb3VsZCBub3QgZmluZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIGZvciB0aGlzIHByb2plY3QuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgQ29uc2lkZXIgbWFudWFsbHkgYWRkaW5nIHRoZSBSb2JvdG8gZm9udCB0byB5b3VyIENTUy5gKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBNb3JlIGluZm9ybWF0aW9uIGF0IGh0dHBzOi8vZm9udHMuZ29vZ2xlLmNvbS9zcGVjaW1lbi9Sb2JvdG9gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IHJlYWQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSB3aXRoaW4gdGhlIHByb2plY3QgYCArIGAoJHtzdHlsZUZpbGVQYXRofSlgLFxuICAgICAgKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3RvIGZvbnQuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbENvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCBpbnNlcnRpb24gPVxuICAgICAgJ1xcbicgK1xuICAgICAgYGh0bWwsIGJvZHkgeyBoZWlnaHQ6IDEwMCU7IH1cXG5gICtcbiAgICAgIGBib2R5IHsgbWFyZ2luOiAwOyBmb250LWZhbWlseTogUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7IH1cXG5gO1xuXG4gICAgaWYgKGh0bWxDb250ZW50LmluY2x1ZGVzKGluc2VydGlvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGh0bWxDb250ZW50Lmxlbmd0aCwgaW5zZXJ0aW9uKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG4iXX0=