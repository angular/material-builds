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
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQStFO0FBQy9FLHdEQU9pQztBQUNqQyxxRUFBbUU7QUFDbkUsbUZBQXlFO0FBQ3pFLDJEQUF1RDtBQUV2RCwrQ0FBMEU7QUFFMUUsMEVBQTBFO0FBQzFFLE1BQU0sMkJBQTJCLEdBQUcseUJBQXlCLENBQUM7QUFFOUQsb0ZBQW9GO0FBQ3BGLE1BQU0sd0JBQXdCLEdBQUcsc0JBQXNCLENBQUM7QUFFeEQ7Ozs7O0dBS0c7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQ3JELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSx3QkFBWSxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUEsb0NBQXVCLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxLQUFLLDhCQUFXLENBQUMsV0FBVyxFQUFFO1lBQzlELE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLG1CQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBQSw2QkFBbUIsRUFBQyxPQUFPLENBQUM7Z0JBQzVCLElBQUEsZ0NBQWUsRUFBQyxPQUFPLENBQUM7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztnQkFDN0IsSUFBQSw0QkFBa0IsRUFBQyxPQUFPLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsbUZBQW1GO1lBQ2pGLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFD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LENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ25DLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFakQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBSdWxlLCBTY2hlbWF0aWNDb250ZXh0LCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUsXG4gIGdldEFwcE1vZHVsZVBhdGgsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0TWFpbkZpbGUsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGhhc05nTW9kdWxlSW1wb3J0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge1Byb2plY3RUeXBlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlLW1vZGVscyc7XG5pbXBvcnQge2FkZEZvbnRzVG9JbmRleH0gZnJvbSAnLi9mb250cy9tYXRlcmlhbC1mb250cyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHthZGRUaGVtZVRvQXBwU3R5bGVzLCBhZGRUeXBvZ3JhcGh5Q2xhc3N9IGZyb20gJy4vdGhlbWluZy90aGVtaW5nJztcblxuLyoqIE5hbWUgb2YgdGhlIEFuZ3VsYXIgbW9kdWxlIHRoYXQgZW5hYmxlcyBBbmd1bGFyIGJyb3dzZXIgYW5pbWF0aW9ucy4gKi9cbmNvbnN0IGJyb3dzZXJBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdCcm93c2VyQW5pbWF0aW9uc01vZHVsZSc7XG5cbi8qKiBOYW1lIG9mIHRoZSBtb2R1bGUgdGhhdCBzd2l0Y2hlcyBBbmd1bGFyIGFuaW1hdGlvbnMgdG8gYSBub29wIGltcGxlbWVudGF0aW9uLiAqL1xuY29uc3Qgbm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lID0gJ05vb3BBbmltYXRpb25zTW9kdWxlJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgdGhlIGJhc2ljcyBvZiBhIEFuZ3VsYXIgTWF0ZXJpYWwgYXBwbGljYXRpb24sIHRoaXMgaW5jbHVkZXM6XG4gKiAgLSBBZGQgUGFja2FnZXMgdG8gcGFja2FnZS5qc29uXG4gKiAgLSBBZGRzIHByZS1idWlsdCB0aGVtZXMgdG8gc3R5bGVzLmV4dFxuICogIC0gQWRkcyBCcm93c2VyIEFuaW1hdGlvbiB0byBhcHAubW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICBpZiAocHJvamVjdC5leHRlbnNpb25zLnByb2plY3RUeXBlID09PSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIGNoYWluKFtcbiAgICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICAgICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgICAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnMpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGNvbnRleHQubG9nZ2VyLndhcm4oXG4gICAgICAnQW5ndWxhciBNYXRlcmlhbCBoYXMgYmVlbiBzZXQgdXAgaW4geW91ciB3b3Jrc3BhY2UuIFRoZXJlIGlzIG5vIGFkZGl0aW9uYWwgc2V0dXAgJyArXG4gICAgICAgICdyZXF1aXJlZCBmb3IgY29uc3VtaW5nIEFuZ3VsYXIgTWF0ZXJpYWwgaW4geW91ciBsaWJyYXJ5IHByb2plY3QuXFxuXFxuJyArXG4gICAgICAgICdJZiB5b3UgaW50ZW5kZWQgdG8gcnVuIHRoZSBzY2hlbWF0aWMgb24gYSBkaWZmZXJlbnQgcHJvamVjdCwgcGFzcyB0aGUgYC0tcHJvamVjdGAgJyArXG4gICAgICAgICdvcHRpb24uJyxcbiAgICApO1xuICAgIHJldHVybjtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGFuaW1hdGlvbiBtb2R1bGUgdG8gdGhlIHJvb3QgbW9kdWxlIG9mIHRoZSBzcGVjaWZpZWQgcHJvamVjdC4gSW4gY2FzZSB0aGUgXCJhbmltYXRpb25zXCJcbiAqIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHdlIHN0aWxsIGFkZCB0aGUgYE5vb3BBbmltYXRpb25zTW9kdWxlYCBiZWNhdXNlIG90aGVyd2lzZSB2YXJpb3VzXG4gKiBjb21wb25lbnRzIG9mIEFuZ3VsYXIgTWF0ZXJpYWwgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnNNb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IGFwcE1vZHVsZVBhdGggPSBnZXRBcHBNb2R1bGVQYXRoKGhvc3QsIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0KSk7XG5cbiAgICBpZiAob3B0aW9ucy5hbmltYXRpb25zID09PSAnZW5hYmxlZCcpIHtcbiAgICAgIC8vIEluIGNhc2UgdGhlIHByb2plY3QgZXhwbGljaXRseSB1c2VzIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSwgd2Ugc2hvdWxkIHByaW50IGEgd2FybmluZ1xuICAgICAgLy8gbWVzc2FnZSB0aGF0IG1ha2VzIHRoZSB1c2VyIGF3YXJlIG9mIHRoZSBmYWN0IHRoYXQgd2Ugd29uJ3QgYXV0b21hdGljYWxseSBzZXQgdXBcbiAgICAgIC8vIGFuaW1hdGlvbnMuIElmIHdlIHdvdWxkIGFkZCB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgd2hpbGUgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlXG4gICAgICAvLyBpcyBhbHJlYWR5IGNvbmZpZ3VyZWQsIHdlIHdvdWxkIGNhdXNlIHVuZXhwZWN0ZWQgYmVoYXZpb3IgYW5kIHJ1bnRpbWUgZXhjZXB0aW9ucy5cbiAgICAgIGlmIChoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAgIGNvbnRleHQubG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBDb3VsZCBub3Qgc2V0IHVwIFwiJHticm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWV9XCIgYCArXG4gICAgICAgICAgICBgYmVjYXVzZSBcIiR7bm9vcEFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGlzIGFscmVhZHkgaW1wb3J0ZWQuYCxcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IHNldCB1cCBicm93c2VyIGFuaW1hdGlvbnMuYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoXG4gICAgICAgICAgaG9zdCxcbiAgICAgICAgICBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3B0aW9ucy5hbmltYXRpb25zID09PSAnZGlzYWJsZWQnICYmXG4gICAgICAhaGFzTmdNb2R1bGVJbXBvcnQoaG9zdCwgYXBwTW9kdWxlUGF0aCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lKVxuICAgICkge1xuICAgICAgLy8gRG8gbm90IGFkZCB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGUgbW9kdWxlIGlmIHRoZSBwcm9qZWN0IGFscmVhZHkgZXhwbGljaXRseSB1c2VzXG4gICAgICAvLyB0aGUgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUuXG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoXG4gICAgICAgIGhvc3QsXG4gICAgICAgIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSxcbiAgICAgICAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucycsXG4gICAgICAgIHByb2plY3QsXG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGN1c3RvbSBNYXRlcmlhbCBzdHlsZXMgdG8gdGhlIHByb2plY3Qgc3R5bGUgZmlsZS4gVGhlIGN1c3RvbSBDU1Mgc2V0cyB1cCB0aGUgUm9ib3RvIGZvbnRcbiAqIGFuZCByZXNldCB0aGUgZGVmYXVsdCBicm93c2VyIGJvZHkgbWFyZ2luLlxuICovXG5mdW5jdGlvbiBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3Qgc3R5bGVGaWxlUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCk7XG4gICAgY29uc3QgbG9nZ2VyID0gY29udGV4dC5sb2dnZXI7XG5cbiAgICBpZiAoIXN0eWxlRmlsZVBhdGgpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IGZpbmQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSBmb3IgdGhpcyBwcm9qZWN0LmApO1xuICAgICAgbG9nZ2VyLmluZm8oYENvbnNpZGVyIG1hbnVhbGx5IGFkZGluZyB0aGUgUm9ib3RvIGZvbnQgdG8geW91ciBDU1MuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgTW9yZSBpbmZvcm1hdGlvbiBhdCBodHRwczovL2ZvbnRzLmdvb2dsZS5jb20vc3BlY2ltZW4vUm9ib3RvYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCByZWFkIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgd2l0aGluIHRoZSBwcm9qZWN0IGAgKyBgKCR7c3R5bGVGaWxlUGF0aH0pYCxcbiAgICAgICk7XG4gICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90byBmb250LmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5zZXJ0aW9uID1cbiAgICAgICdcXG4nICtcbiAgICAgIGBodG1sLCBib2R5IHsgaGVpZ2h0OiAxMDAlOyB9XFxuYCArXG4gICAgICBgYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XFxuYDtcblxuICAgIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhpbnNlcnRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChodG1sQ29udGVudC5sZW5ndGgsIGluc2VydGlvbik7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICB9O1xufVxuIl19