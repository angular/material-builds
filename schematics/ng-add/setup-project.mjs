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
        if (project.extensions['projectType'] === workspace_models_1.ProjectType.Application) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQStFO0FBQy9FLHdEQVFpQztBQUNqQyx1RUFJZ0Q7QUFDaEQscUVBQXNGO0FBQ3RGLG1GQUF5RTtBQUN6RSwyREFBdUQ7QUFFdkQsK0NBQTBFO0FBRTFFOzs7OztHQUtHO0FBQ0gsbUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxLQUFLLEVBQUUsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUNyRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLDhCQUFXLENBQUMsV0FBVyxFQUFFO1lBQ2pFLE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBQSw2QkFBbUIsRUFBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUEsZ0NBQWUsRUFBQyxPQUFPLENBQUM7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztnQkFDN0IsSUFBQSw0QkFBa0IsRUFBQyxPQUFPLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsbUZBQW1GO1lBQ2pGLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFDcEYsU0FBUyxDQUNaLENBQUM7UUFDRixPQUFPO0lBQ1QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXRCRCw0QkFzQkM7QUFFRDs7OztHQUlH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QztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUNwRSxPQUFPO1NBQ1I7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsTUFBTSxTQUFTLEdBQ2IsSUFBSTtZQUNKLGdDQUFnQztZQUNoQywwRUFBMEUsQ0FBQztRQUU3RSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsT0FBTztTQUNSO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZSxcbiAgZ2V0QXBwTW9kdWxlUGF0aCxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgZ2V0UHJvamVjdFN0eWxlRmlsZSxcbiAgaGFzTmdNb2R1bGVJbXBvcnQsXG4gIGlzU3RhbmRhbG9uZUFwcCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgaW1wb3J0c1Byb3ZpZGVyc0Zyb20sXG4gIGFkZEZ1bmN0aW9uYWxQcm92aWRlcnNUb1N0YW5kYWxvbmVCb290c3RyYXAsXG4gIGNhbGxzUHJvdmlkZXJzRnVuY3Rpb24sXG59IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvcHJpdmF0ZS9jb21wb25lbnRzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlLCBQcm9qZWN0RGVmaW5pdGlvbn0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge1Byb2plY3RUeXBlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlLW1vZGVscyc7XG5pbXBvcnQge2FkZEZvbnRzVG9JbmRleH0gZnJvbSAnLi9mb250cy9tYXRlcmlhbC1mb250cyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHthZGRUaGVtZVRvQXBwU3R5bGVzLCBhZGRUeXBvZ3JhcGh5Q2xhc3N9IGZyb20gJy4vdGhlbWluZy90aGVtaW5nJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgdGhlIGJhc2ljcyBvZiBhIEFuZ3VsYXIgTWF0ZXJpYWwgYXBwbGljYXRpb24sIHRoaXMgaW5jbHVkZXM6XG4gKiAgLSBBZGQgUGFja2FnZXMgdG8gcGFja2FnZS5qc29uXG4gKiAgLSBBZGRzIHByZS1idWlsdCB0aGVtZXMgdG8gc3R5bGVzLmV4dFxuICogIC0gQWRkcyBCcm93c2VyIEFuaW1hdGlvbiB0byBhcHAubW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICBpZiAocHJvamVjdC5leHRlbnNpb25zWydwcm9qZWN0VHlwZSddID09PSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIGNoYWluKFtcbiAgICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICAgICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgICAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnMpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGNvbnRleHQubG9nZ2VyLndhcm4oXG4gICAgICAnQW5ndWxhciBNYXRlcmlhbCBoYXMgYmVlbiBzZXQgdXAgaW4geW91ciB3b3Jrc3BhY2UuIFRoZXJlIGlzIG5vIGFkZGl0aW9uYWwgc2V0dXAgJyArXG4gICAgICAgICdyZXF1aXJlZCBmb3IgY29uc3VtaW5nIEFuZ3VsYXIgTWF0ZXJpYWwgaW4geW91ciBsaWJyYXJ5IHByb2plY3QuXFxuXFxuJyArXG4gICAgICAgICdJZiB5b3UgaW50ZW5kZWQgdG8gcnVuIHRoZSBzY2hlbWF0aWMgb24gYSBkaWZmZXJlbnQgcHJvamVjdCwgcGFzcyB0aGUgYC0tcHJvamVjdGAgJyArXG4gICAgICAgICdvcHRpb24uJyxcbiAgICApO1xuICAgIHJldHVybjtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGFuaW1hdGlvbiBtb2R1bGUgdG8gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBzcGVjaWZpZWQgcHJvamVjdC4gSW4gY2FzZSB0aGUgXCJhbmltYXRpb25zXCJcbiAqIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHdlIHN0aWxsIGFkZCB0aGUgYE5vb3BBbmltYXRpb25zTW9kdWxlYCBiZWNhdXNlIG90aGVyd2lzZSB2YXJpb3VzXG4gKiBjb21wb25lbnRzIG9mIEFuZ3VsYXIgTWF0ZXJpYWwgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IG1haW5GaWxlUGF0aCA9IGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KTtcblxuICAgIGlmIChpc1N0YW5kYWxvbmVBcHAoaG9zdCwgbWFpbkZpbGVQYXRoKSkge1xuICAgICAgYWRkQW5pbWF0aW9uc1RvU3RhbmRhbG9uZUFwcChob3N0LCBtYWluRmlsZVBhdGgsIGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRBbmltYXRpb25zVG9Ob25TdGFuZGFsb25lQXBwKGhvc3QsIHByb2plY3QsIG1haW5GaWxlUGF0aCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgdG8gYW4gYXBwIHRoYXQgaXMgYm9vdHN0cmFwIHVzaW5nIHRoZSBzdGFuZGFsb25lIGNvbXBvbmVudCBBUElzLiAqL1xuZnVuY3Rpb24gYWRkQW5pbWF0aW9uc1RvU3RhbmRhbG9uZUFwcChcbiAgaG9zdDogVHJlZSxcbiAgbWFpbkZpbGU6IHN0cmluZyxcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgb3B0aW9uczogU2NoZW1hLFxuKSB7XG4gIGNvbnN0IGFuaW1hdGlvbnNGdW5jdGlvbiA9ICdwcm92aWRlQW5pbWF0aW9ucyc7XG4gIGNvbnN0IG5vb3BBbmltYXRpb25zRnVuY3Rpb24gPSAncHJvdmlkZU5vb3BBbmltYXRpb25zJztcblxuICBpZiAob3B0aW9ucy5hbmltYXRpb25zID09PSAnZW5hYmxlZCcpIHtcbiAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IGV4cGxpY2l0bHkgdXNlcyBwcm92aWRlTm9vcEFuaW1hdGlvbnMsIHdlIHNob3VsZCBwcmludCBhIHdhcm5pbmdcbiAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCBwcm92aWRlQW5pbWF0aW9ucyB3aGlsZSBwcm92aWRlTm9vcEFuaW1hdGlvbnNcbiAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICBpZiAoY2FsbHNQcm92aWRlcnNGdW5jdGlvbihob3N0LCBtYWluRmlsZSwgbm9vcEFuaW1hdGlvbnNGdW5jdGlvbikpIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IGFkZCBcIiR7YW5pbWF0aW9uc0Z1bmN0aW9ufVwiIGAgK1xuICAgICAgICAgIGBiZWNhdXNlIFwiJHtub29wQW5pbWF0aW9uc0Z1bmN0aW9ufVwiIGlzIGFscmVhZHkgcHJvdmlkZWQuYCxcbiAgICAgICk7XG4gICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWRkRnVuY3Rpb25hbFByb3ZpZGVyc1RvU3RhbmRhbG9uZUJvb3RzdHJhcChcbiAgICAgICAgaG9zdCxcbiAgICAgICAgbWFpbkZpbGUsXG4gICAgICAgIGFuaW1hdGlvbnNGdW5jdGlvbixcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICBvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdkaXNhYmxlZCcgJiZcbiAgICAhaW1wb3J0c1Byb3ZpZGVyc0Zyb20oaG9zdCwgbWFpbkZpbGUsIGFuaW1hdGlvbnNGdW5jdGlvbilcbiAgKSB7XG4gICAgLy8gRG8gbm90IGFkZCB0aGUgcHJvdmlkZU5vb3BBbmltYXRpb25zIGlmIHRoZSBwcm9qZWN0IGFscmVhZHkgZXhwbGljaXRseSB1c2VzXG4gICAgLy8gdGhlIHByb3ZpZGVBbmltYXRpb25zLlxuICAgIGFkZEZ1bmN0aW9uYWxQcm92aWRlcnNUb1N0YW5kYWxvbmVCb290c3RyYXAoXG4gICAgICBob3N0LFxuICAgICAgbWFpbkZpbGUsXG4gICAgICBub29wQW5pbWF0aW9uc0Z1bmN0aW9uLFxuICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIGFuaW1hdGlvbnMgbW9kdWxlIHRvIGFuIGFwcCB0aGF0IGlzIGJvb3RzdHJhcFxuICogdXNpbmcgdGhlIG5vbi1zdGFuZGFsb25lIGNvbXBvbmVudCBBUElzLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zVG9Ob25TdGFuZGFsb25lQXBwKFxuICBob3N0OiBUcmVlLFxuICBwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbixcbiAgbWFpbkZpbGU6IHN0cmluZyxcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgb3B0aW9uczogU2NoZW1hLFxuKSB7XG4gIGNvbnN0IGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdCcm93c2VyQW5pbWF0aW9uc01vZHVsZSc7XG4gIGNvbnN0IG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdOb29wQW5pbWF0aW9uc01vZHVsZSc7XG4gIGNvbnN0IGFwcE1vZHVsZVBhdGggPSBnZXRBcHBNb2R1bGVQYXRoKGhvc3QsIG1haW5GaWxlKTtcblxuICBpZiAob3B0aW9ucy5hbmltYXRpb25zID09PSAnZW5hYmxlZCcpIHtcbiAgICAvLyBJbiBjYXNlIHRoZSBwcm9qZWN0IGV4cGxpY2l0bHkgdXNlcyB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUsIHdlIHNob3VsZCBwcmludCBhIHdhcm5pbmdcbiAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgLy8gaXMgYWxyZWFkeSBjb25maWd1cmVkLCB3ZSB3b3VsZCBjYXVzZSB1bmV4cGVjdGVkIGJlaGF2aW9yIGFuZCBydW50aW1lIGV4Y2VwdGlvbnMuXG4gICAgaWYgKGhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmVycm9yKFxuICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7YnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGAgK1xuICAgICAgICAgIGBiZWNhdXNlIFwiJHtub29wQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgaXMgYWxyZWFkeSBpbXBvcnRlZC5gLFxuICAgICAgKTtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYFBsZWFzZSBtYW51YWxseSBzZXQgdXAgYnJvd3NlciBhbmltYXRpb25zLmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoXG4gICAgICAgIGhvc3QsXG4gICAgICAgIGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICAgIHByb2plY3QsXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICBvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdkaXNhYmxlZCcgJiZcbiAgICAhaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKVxuICApIHtcbiAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAvLyB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUuXG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKFxuICAgICAgaG9zdCxcbiAgICAgIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLFxuICAgICAgcHJvamVjdCxcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBjdXN0b20gTWF0ZXJpYWwgc3R5bGVzIHRvIHRoZSBwcm9qZWN0IHN0eWxlIGZpbGUuIFRoZSBjdXN0b20gQ1NTIHNldHMgdXAgdGhlIFJvYm90byBmb250XG4gKiBhbmQgcmVzZXQgdGhlIGRlZmF1bHQgYnJvd3NlciBib2R5IG1hcmdpbi5cbiAqL1xuZnVuY3Rpb24gYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHN0eWxlRmlsZVBhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QpO1xuICAgIGNvbnN0IGxvZ2dlciA9IGNvbnRleHQubG9nZ2VyO1xuXG4gICAgaWYgKCFzdHlsZUZpbGVQYXRoKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoYENvdWxkIG5vdCBmaW5kIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgZm9yIHRoaXMgcHJvamVjdC5gKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBDb25zaWRlciBtYW51YWxseSBhZGRpbmcgdGhlIFJvYm90byBmb250IHRvIHlvdXIgQ1NTLmApO1xuICAgICAgbG9nZ2VyLmluZm8oYE1vcmUgaW5mb3JtYXRpb24gYXQgaHR0cHM6Ly9mb250cy5nb29nbGUuY29tL3NwZWNpbWVuL1JvYm90b2ApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChzdHlsZUZpbGVQYXRoKTtcblxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIGBDb3VsZCBub3QgcmVhZCB0aGUgZGVmYXVsdCBzdHlsZSBmaWxlIHdpdGhpbiB0aGUgcHJvamVjdCBgICsgYCgke3N0eWxlRmlsZVBhdGh9KWAsXG4gICAgICApO1xuICAgICAgbG9nZ2VyLmluZm8oYFBsZWFzZSBjb25zaWRlciBtYW51YWxseSBzZXR0aW5nIHVwIHRoZSBSb2JvdG8gZm9udC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBodG1sQ29udGVudCA9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgIGNvbnN0IGluc2VydGlvbiA9XG4gICAgICAnXFxuJyArXG4gICAgICBgaHRtbCwgYm9keSB7IGhlaWdodDogMTAwJTsgfVxcbmAgK1xuICAgICAgYGJvZHkgeyBtYXJnaW46IDA7IGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjsgfVxcbmA7XG5cbiAgICBpZiAoaHRtbENvbnRlbnQuaW5jbHVkZXMoaW5zZXJ0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZUZpbGVQYXRoKTtcblxuICAgIHJlY29yZGVyLmluc2VydExlZnQoaHRtbENvbnRlbnQubGVuZ3RoLCBpbnNlcnRpb24pO1xuICAgIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgfTtcbn1cbiJdfQ==