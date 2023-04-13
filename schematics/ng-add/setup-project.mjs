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
const components_1 = require("@schematics/angular/private/components");
const workspace_1 = require("@schematics/angular/utility/workspace");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
const material_fonts_1 = require("./fonts/material-fonts");
const theming_1 = require("./theming/theming");
const ts = require("typescript");
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
        const mainFilePath = (0, schematics_2.getProjectMainFile)(project);
        const mainSourceFile = ts.createSourceFile(mainFilePath, host.readText(mainFilePath), ts.ScriptTarget.Latest);
        if ((0, components_1.findBootstrapApplicationCall)(mainSourceFile)) {
            addAnimationsToStandaloneApp(host, mainFilePath, context, options);
        }
        else {
            addAnimationsToNonStandaloneApp(host, project, mainFilePath, context, options);
        }
    };
}
/** Adds the animations module to an app that is bootstrap using the standalone component APIs. */
function addAnimationsToStandaloneApp(host, mainFile, context, options) {
    const animationsFunction = 'provideAnimations';
    const noopAnimationsFunction = 'provideNoopAnimations';
    if (options.animations === 'enabled') {
        // In case the project explicitly uses provideNoopAnimations, we should print a warning
        // message that makes the user aware of the fact that we won't automatically set up
        // animations. If we would add provideAnimations while provideNoopAnimations
        // is already configured, we would cause unexpected behavior and runtime exceptions.
        if ((0, components_1.callsProvidersFunction)(host, mainFile, noopAnimationsFunction)) {
            context.logger.error(`Could not add "${animationsFunction}" ` +
                `because "${noopAnimationsFunction}" is already provided.`);
            context.logger.info(`Please manually set up browser animations.`);
        }
        else {
            (0, components_1.addFunctionalProvidersToStandaloneBootstrap)(host, mainFile, animationsFunction, '@angular/platform-browser/animations');
        }
    }
    else if (options.animations === 'disabled' &&
        !(0, components_1.importsProvidersFrom)(host, mainFile, animationsFunction)) {
        // Do not add the provideNoopAnimations if the project already explicitly uses
        // the provideAnimations.
        (0, components_1.addFunctionalProvidersToStandaloneBootstrap)(host, mainFile, noopAnimationsFunction, '@angular/platform-browser/animations');
    }
}
/**
 * Adds the animations module to an app that is bootstrap
 * using the non-standalone component APIs.
 */
function addAnimationsToNonStandaloneApp(host, project, mainFile, context, options) {
    const browserAnimationsModuleName = 'BrowserAnimationsModule';
    const noopAnimationsModuleName = 'NoopAnimationsModule';
    const appModulePath = (0, schematics_2.getAppModulePath)(host, mainFile);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQStFO0FBQy9FLHdEQU9pQztBQUNqQyx1RUFLZ0Q7QUFDaEQscUVBQXNGO0FBQ3RGLG1GQUF5RTtBQUN6RSwyREFBdUQ7QUFFdkQsK0NBQTBFO0FBQzFFLGlDQUFpQztBQUVqQzs7Ozs7R0FLRztBQUNILG1CQUF5QixPQUFlO0lBQ3RDLE9BQU8sS0FBSyxFQUFFLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDckQsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLHdCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQ0FBdUIsRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBFLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEtBQUssOEJBQVcsQ0FBQyxXQUFXLEVBQUU7WUFDOUQsT0FBTyxJQUFBLGtCQUFLLEVBQUM7Z0JBQ1gsbUJBQW1CLENBQUMsT0FBTyxDQUFDO2dCQUM1QixJQUFBLDZCQUFtQixFQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBQSxnQ0FBZSxFQUFDLE9BQU8sQ0FBQztnQkFDeEIsb0JBQW9CLENBQUMsT0FBTyxDQUFDO2dCQUM3QixJQUFBLDRCQUFrQixFQUFDLE9BQU8sQ0FBQzthQUM1QixDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNqQixtRkFBbUY7WUFDakYsc0VBQXNFO1lBQ3RFLG9GQUFvRjtZQUNwRixTQUFTLENBQ1osQ0FBQztRQUNGLE9BQU87SUFDVCxDQUFDLENBQUM7QUFDSixDQUFDO0FBdEJELDRCQXNCQztBQUVE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RyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLENBQUMsS0FBSyxDQUNWLDJEQUEyRCxHQUFHLElBQUksYUFBYSxHQUFHLENBQ25GLENBQUM7WUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDcEUsT0FBTztTQUNSO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUNiLElBQUk7WUFDSixnQ0FBZ0M7WUFDaEMsMEVBQTBFLENBQUM7UUFFN0UsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUsXG4gIGdldEFwcE1vZHVsZVBhdGgsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGhhc05nTW9kdWxlSW1wb3J0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBpbXBvcnRzUHJvdmlkZXJzRnJvbSxcbiAgZmluZEJvb3RzdHJhcEFwcGxpY2F0aW9uQ2FsbCxcbiAgYWRkRnVuY3Rpb25hbFByb3ZpZGVyc1RvU3RhbmRhbG9uZUJvb3RzdHJhcCxcbiAgY2FsbHNQcm92aWRlcnNGdW5jdGlvbixcbn0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci9wcml2YXRlL2NvbXBvbmVudHMnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2UsIFByb2plY3REZWZpbml0aW9ufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7UHJvamVjdFR5cGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UtbW9kZWxzJztcbmltcG9ydCB7YWRkRm9udHNUb0luZGV4fSBmcm9tICcuL2ZvbnRzL21hdGVyaWFsLWZvbnRzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge2FkZFRoZW1lVG9BcHBTdHlsZXMsIGFkZFR5cG9ncmFwaHlDbGFzc30gZnJvbSAnLi90aGVtaW5nL3RoZW1pbmcnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogU2NhZmZvbGRzIHRoZSBiYXNpY3Mgb2YgYSBBbmd1bGFyIE1hdGVyaWFsIGFwcGxpY2F0aW9uLCB0aGlzIGluY2x1ZGVzOlxuICogIC0gQWRkIFBhY2thZ2VzIHRvIHBhY2thZ2UuanNvblxuICogIC0gQWRkcyBwcmUtYnVpbHQgdGhlbWVzIHRvIHN0eWxlcy5leHRcbiAqICAtIEFkZHMgQnJvd3NlciBBbmltYXRpb24gdG8gYXBwLm1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuXG4gICAgaWYgKHByb2plY3QuZXh0ZW5zaW9ucy5wcm9qZWN0VHlwZSA9PT0gUHJvamVjdFR5cGUuQXBwbGljYXRpb24pIHtcbiAgICAgIHJldHVybiBjaGFpbihbXG4gICAgICAgIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9ucyksXG4gICAgICAgIGFkZFRoZW1lVG9BcHBTdHlsZXMob3B0aW9ucyksXG4gICAgICAgIGFkZEZvbnRzVG9JbmRleChvcHRpb25zKSxcbiAgICAgICAgYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9ucyksXG4gICAgICAgIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgJ0FuZ3VsYXIgTWF0ZXJpYWwgaGFzIGJlZW4gc2V0IHVwIGluIHlvdXIgd29ya3NwYWNlLiBUaGVyZSBpcyBubyBhZGRpdGlvbmFsIHNldHVwICcgK1xuICAgICAgICAncmVxdWlyZWQgZm9yIGNvbnN1bWluZyBBbmd1bGFyIE1hdGVyaWFsIGluIHlvdXIgbGlicmFyeSBwcm9qZWN0LlxcblxcbicgK1xuICAgICAgICAnSWYgeW91IGludGVuZGVkIHRvIHJ1biB0aGUgc2NoZW1hdGljIG9uIGEgZGlmZmVyZW50IHByb2plY3QsIHBhc3MgdGhlIGAtLXByb2plY3RgICcgK1xuICAgICAgICAnb3B0aW9uLicsXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH07XG59XG5cbi8qKlxuICogQWRkcyBhbiBhbmltYXRpb24gbW9kdWxlIHRvIHRoZSByb290IG1vZHVsZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuIEluIGNhc2UgdGhlIFwiYW5pbWF0aW9uc1wiXG4gKiBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB3ZSBzdGlsbCBhZGQgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgYmVjYXVzZSBvdGhlcndpc2UgdmFyaW91c1xuICogY29tcG9uZW50cyBvZiBBbmd1bGFyIE1hdGVyaWFsIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCk7XG4gICAgY29uc3QgbWFpblNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgICAgbWFpbkZpbGVQYXRoLFxuICAgICAgaG9zdC5yZWFkVGV4dChtYWluRmlsZVBhdGgpLFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICApO1xuXG4gICAgaWYgKGZpbmRCb290c3RyYXBBcHBsaWNhdGlvbkNhbGwobWFpblNvdXJjZUZpbGUpKSB7XG4gICAgICBhZGRBbmltYXRpb25zVG9TdGFuZGFsb25lQXBwKGhvc3QsIG1haW5GaWxlUGF0aCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEFuaW1hdGlvbnNUb05vblN0YW5kYWxvbmVBcHAoaG9zdCwgcHJvamVjdCwgbWFpbkZpbGVQYXRoLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKiBBZGRzIHRoZSBhbmltYXRpb25zIG1vZHVsZSB0byBhbiBhcHAgdGhhdCBpcyBib290c3RyYXAgdXNpbmcgdGhlIHN0YW5kYWxvbmUgY29tcG9uZW50IEFQSXMuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zVG9TdGFuZGFsb25lQXBwKFxuICBob3N0OiBUcmVlLFxuICBtYWluRmlsZTogc3RyaW5nLFxuICBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0LFxuICBvcHRpb25zOiBTY2hlbWEsXG4pIHtcbiAgY29uc3QgYW5pbWF0aW9uc0Z1bmN0aW9uID0gJ3Byb3ZpZGVBbmltYXRpb25zJztcbiAgY29uc3Qgbm9vcEFuaW1hdGlvbnNGdW5jdGlvbiA9ICdwcm92aWRlTm9vcEFuaW1hdGlvbnMnO1xuXG4gIGlmIChvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdlbmFibGVkJykge1xuICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHByb3ZpZGVOb29wQW5pbWF0aW9ucywgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgIC8vIG1lc3NhZ2UgdGhhdCBtYWtlcyB0aGUgdXNlciBhd2FyZSBvZiB0aGUgZmFjdCB0aGF0IHdlIHdvbid0IGF1dG9tYXRpY2FsbHkgc2V0IHVwXG4gICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHByb3ZpZGVBbmltYXRpb25zIHdoaWxlIHByb3ZpZGVOb29wQW5pbWF0aW9uc1xuICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgIGlmIChjYWxsc1Byb3ZpZGVyc0Z1bmN0aW9uKGhvc3QsIG1haW5GaWxlLCBub29wQW5pbWF0aW9uc0Z1bmN0aW9uKSkge1xuICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3IoXG4gICAgICAgIGBDb3VsZCBub3QgYWRkIFwiJHthbmltYXRpb25zRnVuY3Rpb259XCIgYCArXG4gICAgICAgICAgYGJlY2F1c2UgXCIke25vb3BBbmltYXRpb25zRnVuY3Rpb259XCIgaXMgYWxyZWFkeSBwcm92aWRlZC5gLFxuICAgICAgKTtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRGdW5jdGlvbmFsUHJvdmlkZXJzVG9TdGFuZGFsb25lQm9vdHN0cmFwKFxuICAgICAgICBob3N0LFxuICAgICAgICBtYWluRmlsZSxcbiAgICAgICAgYW5pbWF0aW9uc0Z1bmN0aW9uLFxuICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2Rpc2FibGVkJyAmJlxuICAgICFpbXBvcnRzUHJvdmlkZXJzRnJvbShob3N0LCBtYWluRmlsZSwgYW5pbWF0aW9uc0Z1bmN0aW9uKVxuICApIHtcbiAgICAvLyBEbyBub3QgYWRkIHRoZSBwcm92aWRlTm9vcEFuaW1hdGlvbnMgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAvLyB0aGUgcHJvdmlkZUFuaW1hdGlvbnMuXG4gICAgYWRkRnVuY3Rpb25hbFByb3ZpZGVyc1RvU3RhbmRhbG9uZUJvb3RzdHJhcChcbiAgICAgIGhvc3QsXG4gICAgICBtYWluRmlsZSxcbiAgICAgIG5vb3BBbmltYXRpb25zRnVuY3Rpb24sXG4gICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgdG8gYW4gYXBwIHRoYXQgaXMgYm9vdHN0cmFwXG4gKiB1c2luZyB0aGUgbm9uLXN0YW5kYWxvbmUgY29tcG9uZW50IEFQSXMuXG4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNUb05vblN0YW5kYWxvbmVBcHAoXG4gIGhvc3Q6IFRyZWUsXG4gIHByb2plY3Q6IFByb2plY3REZWZpbml0aW9uLFxuICBtYWluRmlsZTogc3RyaW5nLFxuICBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0LFxuICBvcHRpb25zOiBTY2hlbWEsXG4pIHtcbiAgY29uc3QgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlJztcbiAgY29uc3Qgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ05vb3BBbmltYXRpb25zTW9kdWxlJztcbiAgY29uc3QgYXBwTW9kdWxlUGF0aCA9IGdldEFwcE1vZHVsZVBhdGgoaG9zdCwgbWFpbkZpbGUpO1xuXG4gIGlmIChvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdlbmFibGVkJykge1xuICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSwgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgIC8vIG1lc3NhZ2UgdGhhdCBtYWtlcyB0aGUgdXNlciBhd2FyZSBvZiB0aGUgZmFjdCB0aGF0IHdlIHdvbid0IGF1dG9tYXRpY2FsbHkgc2V0IHVwXG4gICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB3aGlsZSB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGVcbiAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICBpZiAoaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lKSkge1xuICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3IoXG4gICAgICAgIGBDb3VsZCBub3Qgc2V0IHVwIFwiJHticm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgYCArXG4gICAgICAgICAgYGJlY2F1c2UgXCIke25vb3BBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBpcyBhbHJlYWR5IGltcG9ydGVkLmAsXG4gICAgICApO1xuICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IHNldCB1cCBicm93c2VyIGFuaW1hdGlvbnMuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShcbiAgICAgICAgaG9zdCxcbiAgICAgICAgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICAgICAgcHJvamVjdCxcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2Rpc2FibGVkJyAmJlxuICAgICFoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpXG4gICkge1xuICAgIC8vIERvIG5vdCBhZGQgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlIG1vZHVsZSBpZiB0aGUgcHJvamVjdCBhbHJlYWR5IGV4cGxpY2l0bHkgdXNlc1xuICAgIC8vIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZS5cbiAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoXG4gICAgICBob3N0LFxuICAgICAgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICBwcm9qZWN0LFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGN1c3RvbSBNYXRlcmlhbCBzdHlsZXMgdG8gdGhlIHByb2plY3Qgc3R5bGUgZmlsZS4gVGhlIGN1c3RvbSBDU1Mgc2V0cyB1cCB0aGUgUm9ib3RvIGZvbnRcbiAqIGFuZCByZXNldCB0aGUgZGVmYXVsdCBicm93c2VyIGJvZHkgbWFyZ2luLlxuICovXG5mdW5jdGlvbiBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3Qgc3R5bGVGaWxlUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCk7XG4gICAgY29uc3QgbG9nZ2VyID0gY29udGV4dC5sb2dnZXI7XG5cbiAgICBpZiAoIXN0eWxlRmlsZVBhdGgpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IGZpbmQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSBmb3IgdGhpcyBwcm9qZWN0LmApO1xuICAgICAgbG9nZ2VyLmluZm8oYENvbnNpZGVyIG1hbnVhbGx5IGFkZGluZyB0aGUgUm9ib3RvIGZvbnQgdG8geW91ciBDU1MuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgTW9yZSBpbmZvcm1hdGlvbiBhdCBodHRwczovL2ZvbnRzLmdvb2dsZS5jb20vc3BlY2ltZW4vUm9ib3RvYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCByZWFkIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgd2l0aGluIHRoZSBwcm9qZWN0IGAgKyBgKCR7c3R5bGVGaWxlUGF0aH0pYCxcbiAgICAgICk7XG4gICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90byBmb250LmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5zZXJ0aW9uID1cbiAgICAgICdcXG4nICtcbiAgICAgIGBodG1sLCBib2R5IHsgaGVpZ2h0OiAxMDAlOyB9XFxuYCArXG4gICAgICBgYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XFxuYDtcblxuICAgIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhpbnNlcnRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChodG1sQ29udGVudC5sZW5ndGgsIGluc2VydGlvbik7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICB9O1xufVxuIl19