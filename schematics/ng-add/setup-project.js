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
            if (e instanceof schematics_1.SchematicsException && e.message.includes('Bootstrap call not found')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQW9HO0FBQ3BHLHdEQVNpQztBQUNqQyxxRUFBc0Y7QUFDdEYsbUZBQXlFO0FBQ3pFLDJEQUF1RDtBQUV2RCwrQ0FBMEU7QUFFMUUsMEVBQTBFO0FBQzFFLE1BQU0sMkJBQTJCLEdBQUcseUJBQXlCLENBQUM7QUFFOUQsb0ZBQW9GO0FBQ3BGLE1BQU0sd0JBQXdCLEdBQUcsc0JBQXNCLENBQUM7QUFFeEQ7Ozs7O0dBS0c7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQ3JELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSx3QkFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUEsb0NBQXVCLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxLQUFLLDhCQUFXLENBQUMsV0FBVyxFQUFFO1lBQzlELE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBQSw2QkFBbUIsRUFBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUEsZ0NBQWUsRUFBQyxPQUFPLENBQUM7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztnQkFDN0IsSUFBQSw0QkFBa0IsRUFBQyxPQUFPLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsbUZBQW1GO1lBQ2pGLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFD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R0FBRyxJQUFJLGFBQWEsR0FBRyxDQUNuRixDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1lBQ3BFLE9BQU87U0FDUjtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxNQUFNLFNBQVMsR0FDYixJQUFJO1lBQ0osZ0NBQWdDO1lBQ2hDLDBFQUEwRSxDQUFDO1FBRTdFLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNuQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRWpELFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRBcHBNb2R1bGVQYXRoLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbiAgaW1wb3J0c1Byb3ZpZGVyc0Zyb20sXG4gIGFkZE1vZHVsZUltcG9ydFRvU3RhbmRhbG9uZUJvb3RzdHJhcCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2UsIFByb2plY3REZWZpbml0aW9ufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7UHJvamVjdFR5cGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCB7YWRkRm9udHNUb0luZGV4fSBmcm9tICcuL2ZvbnRzL21hdGVyaWFsLWZvbnRzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2FkZFRoZW1lVG9BcHBTdHlsZXMsIGFkZFR5cG9ncmFwaHlDbGFzc30gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuXG4vKiogTmFtZSBvZiB0aGUgQW5ndWxhciBtb2R1bGUgdGhhdCBlbmFibGVzIEFuZ3VsYXIgYnJvd3NlciBhbmltYXRpb25zLiAqL1xuY29uc3QgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlJztcblxuLyoqIE5hbWUgb2YgdGhlIG1vZHVsZSB0aGF0IHN3aXRjaGVzIEFuZ3VsYXIgYW5pbWF0aW9ucyB0byBhIG5vb3AgaW1wbGVtZW50YXRpb24uICovXG5jb25zdCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnTm9vcEFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyB0aGUgYmFzaWNzIG9mIGEgQW5ndWxhciBNYXRlcmlhbCBhcHBsaWNhdGlvbiwgdGhpcyBpbmNsdWRlczpcbiAqICAtIEFkZCBQYWNrYWdlcyB0byBwYWNrYWdlLmpzb25cbiAqICAtIEFkZHMgcHJlLWJ1aWx0IHRoZW1lcyB0byBzdHlsZXMuZXh0XG4gKiAgLSBBZGRzIEJyb3dzZXIgQW5pbWF0aW9uIHRvIGFwcC5tb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcblxuICAgIGlmIChwcm9qZWN0LmV4dGVuc2lvbnMucHJvamVjdFR5cGUgPT09IFByb2plY3RUeXBlLkFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgICBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnMpLFxuICAgICAgICBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgICAgICBhZGRGb250c1RvSW5kZXgob3B0aW9ucyksXG4gICAgICAgIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnMpLFxuICAgICAgICBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9ucyksXG4gICAgICBdKTtcbiAgICB9XG4gICAgY29udGV4dC5sb2dnZXIud2FybihcbiAgICAgICdBbmd1bGFyIE1hdGVyaWFsIGhhcyBiZWVuIHNldCB1cCBpbiB5b3VyIHdvcmtzcGFjZS4gVGhlcmUgaXMgbm8gYWRkaXRpb25hbCBzZXR1cCAnICtcbiAgICAgICAgJ3JlcXVpcmVkIGZvciBjb25zdW1pbmcgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGxpYnJhcnkgcHJvamVjdC5cXG5cXG4nICtcbiAgICAgICAgJ0lmIHlvdSBpbnRlbmRlZCB0byBydW4gdGhlIHNjaGVtYXRpYyBvbiBhIGRpZmZlcmVudCBwcm9qZWN0LCBwYXNzIHRoZSBgLS1wcm9qZWN0YCAnICtcbiAgICAgICAgJ29wdGlvbi4nLFxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9O1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYW5pbWF0aW9uIG1vZHVsZSB0byB0aGUgcm9vdCBtb2R1bGUgb2YgdGhlIHNwZWNpZmllZCBwcm9qZWN0LiBJbiBjYXNlIHRoZSBcImFuaW1hdGlvbnNcIlxuICogb3B0aW9uIGlzIHNldCB0byBmYWxzZSwgd2Ugc3RpbGwgYWRkIHRoZSBgTm9vcEFuaW1hdGlvbnNNb2R1bGVgIGJlY2F1c2Ugb3RoZXJ3aXNlIHZhcmlvdXNcbiAqIGNvbXBvbmVudHMgb2YgQW5ndWxhciBNYXRlcmlhbCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICB0cnkge1xuICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZVRvTm9uU3RhbmRhbG9uZUFwcChob3N0LCBwcm9qZWN0LCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIFNjaGVtYXRpY3NFeGNlcHRpb24gJiYgZS5tZXNzYWdlLmluY2x1ZGVzKCdCb290c3RyYXAgY2FsbCBub3QgZm91bmQnKSkge1xuICAgICAgICBhZGRBbmltYXRpb25zTW9kdWxlVG9TdGFuZGFsb25lQXBwKGhvc3QsIHByb2plY3QsIGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKiBBZGRzIHRoZSBhbmltYXRpb25zIG1vZHVsZSB0byBhbiBhcHAgdGhhdCBpcyBib290c3RyYXAgdXNpbmcgdGhlIHN0YW5kYWxvbmUgY29tcG9uZW50IEFQSXMuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlVG9TdGFuZGFsb25lQXBwKFxuICBob3N0OiBUcmVlLFxuICBwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbixcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgb3B0aW9uczogU2NoZW1hLFxuKSB7XG4gIGNvbnN0IG1haW5GaWxlID0gZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpO1xuXG4gIGlmIChvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdlbmFibGVkJykge1xuICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSwgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgIC8vIG1lc3NhZ2UgdGhhdCBtYWtlcyB0aGUgdXNlciBhd2FyZSBvZiB0aGUgZmFjdCB0aGF0IHdlIHdvbid0IGF1dG9tYXRpY2FsbHkgc2V0IHVwXG4gICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB3aGlsZSB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGVcbiAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICBpZiAoaW1wb3J0c1Byb3ZpZGVyc0Zyb20oaG9zdCwgbWFpbkZpbGUsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7YnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGAgK1xuICAgICAgICAgIGBiZWNhdXNlIFwiJHtub29wQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgaXMgYWxyZWFkeSBpbXBvcnRlZC5gLFxuICAgICAgKTtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1N0YW5kYWxvbmVCb290c3RyYXAoXG4gICAgICAgIGhvc3QsXG4gICAgICAgIG1haW5GaWxlLFxuICAgICAgICBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5hbmltYXRpb25zID09PSAnZGlzYWJsZWQnICYmXG4gICAgIWltcG9ydHNQcm92aWRlcnNGcm9tKGhvc3QsIG1haW5GaWxlLCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpXG4gICkge1xuICAgIC8vIERvIG5vdCBhZGQgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlIG1vZHVsZSBpZiB0aGUgcHJvamVjdCBhbHJlYWR5IGV4cGxpY2l0bHkgdXNlc1xuICAgIC8vIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZS5cbiAgICBhZGRNb2R1bGVJbXBvcnRUb1N0YW5kYWxvbmVCb290c3RyYXAoXG4gICAgICBob3N0LFxuICAgICAgbWFpbkZpbGUsXG4gICAgICBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgdG8gYW4gYXBwIHRoYXQgaXMgYm9vdHN0cmFwXG4gKiB1c2luZyB0aGUgbm9uLXN0YW5kYWxvbmUgY29tcG9uZW50IEFQSXMuXG4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNNb2R1bGVUb05vblN0YW5kYWxvbmVBcHAoXG4gIGhvc3Q6IFRyZWUsXG4gIHByb2plY3Q6IFByb2plY3REZWZpbml0aW9uLFxuICBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0LFxuICBvcHRpb25zOiBTY2hlbWEsXG4pIHtcbiAgY29uc3QgYXBwTW9kdWxlUGF0aCA9IGdldEFwcE1vZHVsZVBhdGgoaG9zdCwgZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpKTtcblxuICBpZiAob3B0aW9ucy5hbmltYXRpb25zID09PSAnZW5hYmxlZCcpIHtcbiAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IGV4cGxpY2l0bHkgdXNlcyB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUsIHdlIHNob3VsZCBwcmludCBhIHdhcm5pbmdcbiAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgLy8gaXMgYWxyZWFkeSBjb25maWd1cmVkLCB3ZSB3b3VsZCBjYXVzZSB1bmV4cGVjdGVkIGJlaGF2aW9yIGFuZCBydW50aW1lIGV4Y2VwdGlvbnMuXG4gICAgaWYgKGhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7YnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGAgK1xuICAgICAgICAgIGBiZWNhdXNlIFwiJHtub29wQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgaXMgYWxyZWFkeSBpbXBvcnRlZC5gLFxuICAgICAgKTtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoXG4gICAgICAgIGhvc3QsXG4gICAgICAgIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICAgIHByb2plY3QsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICBvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdkaXNhYmxlZCcgJiZcbiAgICAhaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKVxuICApIHtcbiAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAvLyB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUuXG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKFxuICAgICAgaG9zdCxcbiAgICAgIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgcHJvamVjdCxcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBjdXN0b20gTWF0ZXJpYWwgc3R5bGVzIHRvIHRoZSBwcm9qZWN0IHN0eWxlIGZpbGUuIFRoZSBjdXN0b20gQ1NTIHNldHMgdXAgdGhlIFJvYm90byBmb250XG4gKiBhbmQgcmVzZXQgdGhlIGRlZmF1bHQgYnJvd3NlciBib2R5IG1hcmdpbi5cbiAqL1xuZnVuY3Rpb24gYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHN0eWxlRmlsZVBhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QpO1xuICAgIGNvbnN0IGxvZ2dlciA9IGNvbnRleHQubG9nZ2VyO1xuXG4gICAgaWYgKCFzdHlsZUZpbGVQYXRoKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoYENvdWxkIG5vdCBmaW5kIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgZm9yIHRoaXMgcHJvamVjdC5gKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBDb25zaWRlciBtYW51YWxseSBhZGRpbmcgdGhlIFJvYm90byBmb250IHRvIHlvdXIgQ1NTLmApO1xuICAgICAgbG9nZ2VyLmluZm8oYE1vcmUgaW5mb3JtYXRpb24gYXQgaHR0cHM6Ly9mb250cy5nb29nbGUuY29tL3NwZWNpbWVuL1JvYm90b2ApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChzdHlsZUZpbGVQYXRoKTtcblxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIGBDb3VsZCBub3QgcmVhZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIHdpdGhpbiB0aGUgcHJvamVjdCBgICsgYCgke3N0eWxlRmlsZVBhdGh9KWAsXG4gICAgICApO1xuICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdG8gZm9udC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBodG1sQ29udGVudCA9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgIGNvbnN0IGluc2VydGlvbiA9XG4gICAgICAnXFxuJyArXG4gICAgICBgaHRtbCwgYm9keSB7IGhlaWdodDogMTAwJTsgfVxcbmAgK1xuICAgICAgYGJvZHkgeyBtYXJnaW46IDA7IGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjsgfVxcbmA7XG5cbiAgICBpZiAoaHRtbENvbnRlbnQuaW5jbHVkZXMoaW5zZXJ0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZUZpbGVQYXRoKTtcblxuICAgIHJlY29yZGVyLmluc2VydExlZnQoaHRtbENvbnRlbnQubGVuZ3RoLCBpbnNlcnRpb24pO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgfTtcbn1cbiJdfQ==