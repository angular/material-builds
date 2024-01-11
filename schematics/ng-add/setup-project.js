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
        if ((0, schematics_2.isStandaloneApp)(host, mainFilePath)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQStFO0FBQy9FLHdEQVFpQztBQUNqQyx1RUFJZ0Q7QUFDaEQscUVBQXNGO0FBQ3RGLG1GQUF5RTtBQUN6RSwyREFBdUQ7QUFFdkQsK0NBQTBFO0FBRTFFOzs7OztHQUtHO0FBQ0gsbUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxLQUFLLEVBQUUsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUNyRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsS0FBSyw4QkFBVyxDQUFDLFdBQVcsRUFBRTtZQUM5RCxPQUFPLElBQUEsa0JBQUssRUFBQztnQkFDWCxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUEsNkJBQW1CLEVBQUMsT0FBTyxDQUFDO2dCQUM1QixJQUFBLGdDQUFlLEVBQUMsT0FBTyxDQUFDO2dCQUN4QixvQkFBb0IsQ0FBQyxPQUFPLENBQUM7Z0JBQzdCLElBQUEsNEJBQWtCLEVBQUMsT0FBTyxDQUFDO2FBQzVCLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLG1GQUFtRjtZQUNqRixzRUFBc0U7WUFDdEUsb0ZBQW9GO1lBQ3BGLFNBQVMsQ0FDWixDQUFDO1FBQ0YsT0FBTztJQUNULENBQUMsQ0FBQztBQUNKLENBQUM7QUF0QkQsNEJBc0JDO0FBRUQ7Ozs7R0FJRztBQUNI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RixNQUFNLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDcEUsT0FBTztTQUNSO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUNiLElBQUk7WUFDSixnQ0FBZ0M7WUFDaEMsMEVBQTBFLENBQUM7UUFFN0UsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUsXG4gIGdldEFwcE1vZHVsZVBhdGgsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGhhc05nTW9kdWxlSW1wb3J0LFxuICBpc1N0YW5kYWxvbmVBcHAsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGltcG9ydHNQcm92aWRlcnNGcm9tLFxuICBhZGRGdW5jdGlvbmFsUHJvdmlkZXJzVG9TdGFuZGFsb25lQm9vdHN0cmFwLFxuICBjYWxsc1Byb3ZpZGVyc0Z1bmN0aW9uLFxufSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3ByaXZhdGUvY29tcG9uZW50cyc7XG5pbXBvcnQge2dldFdvcmtzcGFjZSwgUHJvamVjdERlZmluaXRpb259IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtQcm9qZWN0VHlwZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHthZGRGb250c1RvSW5kZXh9IGZyb20gJy4vZm9udHMvbWF0ZXJpYWwtZm9udHMnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7YWRkVGhlbWVUb0FwcFN0eWxlcywgYWRkVHlwb2dyYXBoeUNsYXNzfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5cbi8qKlxuICogU2NhZmZvbGRzIHRoZSBiYXNpY3Mgb2YgYSBBbmd1bGFyIE1hdGVyaWFsIGFwcGxpY2F0aW9uLCB0aGlzIGluY2x1ZGVzOlxuICogIC0gQWRkIFBhY2thZ2VzIHRvIHBhY2thZ2UuanNvblxuICogIC0gQWRkcyBwcmUtYnVpbHQgdGhlbWVzIHRvIHN0eWxlcy5leHRcbiAqICAtIEFkZHMgQnJvd3NlciBBbmltYXRpb24gdG8gYXBwLm1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuXG4gICAgaWYgKHByb2plY3QuZXh0ZW5zaW9ucy5wcm9qZWN0VHlwZSA9PT0gUHJvamVjdFR5cGUuQXBwbGljYXRpb24pIHtcbiAgICAgIHJldHVybiBjaGFpbihbXG4gICAgICAgIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9ucyksXG4gICAgICAgIGFkZFRoZW1lVG9BcHBTdHlsZXMob3B0aW9ucyksXG4gICAgICAgIGFkZEZvbnRzVG9JbmRleChvcHRpb25zKSxcbiAgICAgICAgYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9ucyksXG4gICAgICAgIGFkZFR5cG9ncmFwaHlDbGFzcyhvcHRpb25zKSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgJ0FuZ3VsYXIgTWF0ZXJpYWwgaGFzIGJlZW4gc2V0IHVwIGluIHlvdXIgd29ya3NwYWNlLiBUaGVyZSBpcyBubyBhZGRpdGlvbmFsIHNldHVwICcgK1xuICAgICAgICAncmVxdWlyZWQgZm9yIGNvbnN1bWluZyBBbmd1bGFyIE1hdGVyaWFsIGluIHlvdXIgbGlicmFyeSBwcm9qZWN0LlxcblxcbicgK1xuICAgICAgICAnSWYgeW91IGludGVuZGVkIHRvIHJ1biB0aGUgc2NoZW1hdGljIG9uIGEgZGlmZmVyZW50IHByb2plY3QsIHBhc3MgdGhlIGAtLXByb2plY3RgICcgK1xuICAgICAgICAnb3B0aW9uLicsXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH07XG59XG5cbi8qKlxuICogQWRkcyBhbiBhbmltYXRpb24gbW9kdWxlIHRvIHRoZSByb290IG1vZHVsZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuIEluIGNhc2UgdGhlIFwiYW5pbWF0aW9uc1wiXG4gKiBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB3ZSBzdGlsbCBhZGQgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgYmVjYXVzZSBvdGhlcndpc2UgdmFyaW91c1xuICogY29tcG9uZW50cyBvZiBBbmd1bGFyIE1hdGVyaWFsIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCk7XG5cbiAgICBpZiAoaXNTdGFuZGFsb25lQXBwKGhvc3QsIG1haW5GaWxlUGF0aCkpIHtcbiAgICAgIGFkZEFuaW1hdGlvbnNUb1N0YW5kYWxvbmVBcHAoaG9zdCwgbWFpbkZpbGVQYXRoLCBjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkQW5pbWF0aW9uc1RvTm9uU3RhbmRhbG9uZUFwcChob3N0LCBwcm9qZWN0LCBtYWluRmlsZVBhdGgsIGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqIEFkZHMgdGhlIGFuaW1hdGlvbnMgbW9kdWxlIHRvIGFuIGFwcCB0aGF0IGlzIGJvb3RzdHJhcCB1c2luZyB0aGUgc3RhbmRhbG9uZSBjb21wb25lbnQgQVBJcy4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNUb1N0YW5kYWxvbmVBcHAoXG4gIGhvc3Q6IFRyZWUsXG4gIG1haW5GaWxlOiBzdHJpbmcsXG4gIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsXG4gIG9wdGlvbnM6IFNjaGVtYSxcbikge1xuICBjb25zdCBhbmltYXRpb25zRnVuY3Rpb24gPSAncHJvdmlkZUFuaW1hdGlvbnMnO1xuICBjb25zdCBub29wQW5pbWF0aW9uc0Z1bmN0aW9uID0gJ3Byb3ZpZGVOb29wQW5pbWF0aW9ucyc7XG5cbiAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2VuYWJsZWQnKSB7XG4gICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgcHJvdmlkZU5vb3BBbmltYXRpb25zLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAvLyBhbmltYXRpb25zLiBJZiB3ZSB3b3VsZCBhZGQgcHJvdmlkZUFuaW1hdGlvbnMgd2hpbGUgcHJvdmlkZU5vb3BBbmltYXRpb25zXG4gICAgLy8gaXMgYWxyZWFkeSBjb25maWd1cmVkLCB3ZSB3b3VsZCBjYXVzZSB1bmV4cGVjdGVkIGJlaGF2aW9yIGFuZCBydW50aW1lIGV4Y2VwdGlvbnMuXG4gICAgaWYgKGNhbGxzUHJvdmlkZXJzRnVuY3Rpb24oaG9zdCwgbWFpbkZpbGUsIG5vb3BBbmltYXRpb25zRnVuY3Rpb24pKSB7XG4gICAgICBjb250ZXh0LmxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCBhZGQgXCIke2FuaW1hdGlvbnNGdW5jdGlvbn1cIiBgICtcbiAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNGdW5jdGlvbn1cIiBpcyBhbHJlYWR5IHByb3ZpZGVkLmAsXG4gICAgICApO1xuICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IHNldCB1cCBicm93c2VyIGFuaW1hdGlvbnMuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEZ1bmN0aW9uYWxQcm92aWRlcnNUb1N0YW5kYWxvbmVCb290c3RyYXAoXG4gICAgICAgIGhvc3QsXG4gICAgICAgIG1haW5GaWxlLFxuICAgICAgICBhbmltYXRpb25zRnVuY3Rpb24sXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5hbmltYXRpb25zID09PSAnZGlzYWJsZWQnICYmXG4gICAgIWltcG9ydHNQcm92aWRlcnNGcm9tKGhvc3QsIG1haW5GaWxlLCBhbmltYXRpb25zRnVuY3Rpb24pXG4gICkge1xuICAgIC8vIERvIG5vdCBhZGQgdGhlIHByb3ZpZGVOb29wQW5pbWF0aW9ucyBpZiB0aGUgcHJvamVjdCBhbHJlYWR5IGV4cGxpY2l0bHkgdXNlc1xuICAgIC8vIHRoZSBwcm92aWRlQW5pbWF0aW9ucy5cbiAgICBhZGRGdW5jdGlvbmFsUHJvdmlkZXJzVG9TdGFuZGFsb25lQm9vdHN0cmFwKFxuICAgICAgaG9zdCxcbiAgICAgIG1haW5GaWxlLFxuICAgICAgbm9vcEFuaW1hdGlvbnNGdW5jdGlvbixcbiAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBhbmltYXRpb25zIG1vZHVsZSB0byBhbiBhcHAgdGhhdCBpcyBib290c3RyYXBcbiAqIHVzaW5nIHRoZSBub24tc3RhbmRhbG9uZSBjb21wb25lbnQgQVBJcy5cbiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc1RvTm9uU3RhbmRhbG9uZUFwcChcbiAgaG9zdDogVHJlZSxcbiAgcHJvamVjdDogUHJvamVjdERlZmluaXRpb24sXG4gIG1haW5GaWxlOiBzdHJpbmcsXG4gIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsXG4gIG9wdGlvbnM6IFNjaGVtYSxcbikge1xuICBjb25zdCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUnO1xuICBjb25zdCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnTm9vcEFuaW1hdGlvbnNNb2R1bGUnO1xuICBjb25zdCBhcHBNb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aChob3N0LCBtYWluRmlsZSk7XG5cbiAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2VuYWJsZWQnKSB7XG4gICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAvLyBhbmltYXRpb25zLiBJZiB3ZSB3b3VsZCBhZGQgdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlIHdoaWxlIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZVxuICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgIGlmIChoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICBjb250ZXh0LmxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCBzZXQgdXAgXCIke2Jyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBgICtcbiAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuYCxcbiAgICAgICk7XG4gICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKFxuICAgICAgICBob3N0LFxuICAgICAgICBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgICBwcm9qZWN0LFxuICAgICAgKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgb3B0aW9ucy5hbmltYXRpb25zID09PSAnZGlzYWJsZWQnICYmXG4gICAgIWhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSlcbiAgKSB7XG4gICAgLy8gRG8gbm90IGFkZCB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUgbW9kdWxlIGlmIHRoZSBwcm9qZWN0IGFscmVhZHkgZXhwbGljaXRseSB1c2VzXG4gICAgLy8gdGhlIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLlxuICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShcbiAgICAgIGhvc3QsXG4gICAgICBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJyxcbiAgICAgIHByb2plY3QsXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgY3VzdG9tIE1hdGVyaWFsIHN0eWxlcyB0byB0aGUgcHJvamVjdCBzdHlsZSBmaWxlLiBUaGUgY3VzdG9tIENTUyBzZXRzIHVwIHRoZSBSb2JvdG8gZm9udFxuICogYW5kIHJlc2V0IHRoZSBkZWZhdWx0IGJyb3dzZXIgYm9keSBtYXJnaW4uXG4gKi9cbmZ1bmN0aW9uIGFkZE1hdGVyaWFsQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZ2V0UHJvamVjdFN0eWxlRmlsZShwcm9qZWN0KTtcbiAgICBjb25zdCBsb2dnZXIgPSBjb250ZXh0LmxvZ2dlcjtcblxuICAgIGlmICghc3R5bGVGaWxlUGF0aCkge1xuICAgICAgbG9nZ2VyLmVycm9yKGBDb3VsZCBub3QgZmluZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIGZvciB0aGlzIHByb2plY3QuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgQ29uc2lkZXIgbWFudWFsbHkgYWRkaW5nIHRoZSBSb2JvdG8gZm9udCB0byB5b3VyIENTUy5gKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBNb3JlIGluZm9ybWF0aW9uIGF0IGh0dHBzOi8vZm9udHMuZ29vZ2xlLmNvbS9zcGVjaW1lbi9Sb2JvdG9gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IHJlYWQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSB3aXRoaW4gdGhlIHByb2plY3QgYCArIGAoJHtzdHlsZUZpbGVQYXRofSlgLFxuICAgICAgKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3RvIGZvbnQuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbENvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCBpbnNlcnRpb24gPVxuICAgICAgJ1xcbicgK1xuICAgICAgYGh0bWwsIGJvZHkgeyBoZWlnaHQ6IDEwMCU7IH1cXG5gICtcbiAgICAgIGBib2R5IHsgbWFyZ2luOiAwOyBmb250LWZhbWlseTogUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7IH1cXG5gO1xuXG4gICAgaWYgKGh0bWxDb250ZW50LmluY2x1ZGVzKGluc2VydGlvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUoc3R5bGVGaWxlUGF0aCk7XG5cbiAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGh0bWxDb250ZW50Lmxlbmd0aCwgaW5zZXJ0aW9uKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG4iXX0=