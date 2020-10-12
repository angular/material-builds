"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return (host, context) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        if (project.extensions.projectType === workspace_models_1.ProjectType.Application) {
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
        return;
    });
}
exports.default = default_1;
/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addAnimationsModule(options) {
    return (host, context) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
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
    });
}
/**
 * Adds custom Material styles to the project style file. The custom CSS sets up the Roboto font
 * and reset the default browser body margin.
 */
function addMaterialAppStyles(options) {
    return (host, context) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
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
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMkRBQStFO0FBQy9FLHdEQU9pQztBQUNqQyxxRUFBbUU7QUFDbkUsbUZBQXlFO0FBQ3pFLDJEQUF1RDtBQUV2RCwrQ0FBMEU7QUFFMUUsMEVBQTBFO0FBQzFFLE1BQU0sMkJBQTJCLEdBQUcseUJBQXlCLENBQUM7QUFFOUQsb0ZBQW9GO0FBQ3BGLE1BQU0sd0JBQXdCLEdBQUcsc0JBQXNCLENBQUM7QUFFeEQ7Ozs7O0dBS0c7QUFDSCxtQkFBd0IsT0FBZTtJQUNyQyxPQUFPLENBQU8sSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUNyRCxNQUFNLFNBQVMsR0FBRyxNQUFNLHdCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxLQUFLLDhCQUFXLENBQUMsV0FBVyxFQUFFO1lBQzlELE9BQU8sa0JBQUssQ0FBQztnQkFDWCxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7Z0JBQzVCLDZCQUFtQixDQUFDLE9BQU8sQ0FBQztnQkFDNUIsZ0NBQWUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztnQkFDN0IsNEJBQWtCLENBQUMsT0FBTyxDQUFDO2FBQzVCLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2YsbUZBQW1GO1lBQ25GLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFDcEYsU0FBUyxDQUFDLENBQUM7UUFDZixPQUFP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bkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUEsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlLFxuICBnZXRBcHBNb2R1bGVQYXRoLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdE1haW5GaWxlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBoYXNOZ01vZHVsZUltcG9ydCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtQcm9qZWN0VHlwZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHthZGRGb250c1RvSW5kZXh9IGZyb20gJy4vZm9udHMvbWF0ZXJpYWwtZm9udHMnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7YWRkVGhlbWVUb0FwcFN0eWxlcywgYWRkVHlwb2dyYXBoeUNsYXNzfSBmcm9tICcuL3RoZW1pbmcvdGhlbWluZyc7XG5cbi8qKiBOYW1lIG9mIHRoZSBBbmd1bGFyIG1vZHVsZSB0aGF0IGVuYWJsZXMgQW5ndWxhciBicm93c2VyIGFuaW1hdGlvbnMuICovXG5jb25zdCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUgPSAnQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUnO1xuXG4vKiogTmFtZSBvZiB0aGUgbW9kdWxlIHRoYXQgc3dpdGNoZXMgQW5ndWxhciBhbmltYXRpb25zIHRvIGEgbm9vcCBpbXBsZW1lbnRhdGlvbi4gKi9cbmNvbnN0IG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSA9ICdOb29wQW5pbWF0aW9uc01vZHVsZSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIHRoZSBiYXNpY3Mgb2YgYSBBbmd1bGFyIE1hdGVyaWFsIGFwcGxpY2F0aW9uLCB0aGlzIGluY2x1ZGVzOlxuICogIC0gQWRkIFBhY2thZ2VzIHRvIHBhY2thZ2UuanNvblxuICogIC0gQWRkcyBwcmUtYnVpbHQgdGhlbWVzIHRvIHN0eWxlcy5leHRcbiAqICAtIEFkZHMgQnJvd3NlciBBbmltYXRpb24gdG8gYXBwLm1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICBpZiAocHJvamVjdC5leHRlbnNpb25zLnByb2plY3RUeXBlID09PSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIGNoYWluKFtcbiAgICAgICAgYWRkQW5pbWF0aW9uc01vZHVsZShvcHRpb25zKSxcbiAgICAgICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgICAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnMpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGNvbnRleHQubG9nZ2VyLndhcm4oXG4gICAgICAgICdBbmd1bGFyIE1hdGVyaWFsIGhhcyBiZWVuIHNldCB1cCBpbiB5b3VyIHdvcmtzcGFjZS4gVGhlcmUgaXMgbm8gYWRkaXRpb25hbCBzZXR1cCAnICtcbiAgICAgICAgJ3JlcXVpcmVkIGZvciBjb25zdW1pbmcgQW5ndWxhciBNYXRlcmlhbCBpbiB5b3VyIGxpYnJhcnkgcHJvamVjdC5cXG5cXG4nICtcbiAgICAgICAgJ0lmIHlvdSBpbnRlbmRlZCB0byBydW4gdGhlIHNjaGVtYXRpYyBvbiBhIGRpZmZlcmVudCBwcm9qZWN0LCBwYXNzIHRoZSBgLS1wcm9qZWN0YCAnICtcbiAgICAgICAgJ29wdGlvbi4nKTtcbiAgICByZXR1cm47XG4gIH07XG59XG5cbi8qKlxuICogQWRkcyBhbiBhbmltYXRpb24gbW9kdWxlIHRvIHRoZSByb290IG1vZHVsZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuIEluIGNhc2UgdGhlIFwiYW5pbWF0aW9uc1wiXG4gKiBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB3ZSBzdGlsbCBhZGQgdGhlIGBOb29wQW5pbWF0aW9uc01vZHVsZWAgYmVjYXVzZSBvdGhlcndpc2UgdmFyaW91c1xuICogY29tcG9uZW50cyBvZiBBbmd1bGFyIE1hdGVyaWFsIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRBbmltYXRpb25zTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBhcHBNb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aChob3N0LCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuXG4gICAgaWYgKG9wdGlvbnMuYW5pbWF0aW9ucykge1xuICAgICAgLy8gSW4gY2FzZSB0aGUgcHJvamVjdCBleHBsaWNpdGx5IHVzZXMgdGhlIE5vb3BBbmltYXRpb25zTW9kdWxlLCB3ZSBzaG91bGQgcHJpbnQgYSB3YXJuaW5nXG4gICAgICAvLyBtZXNzYWdlIHRoYXQgbWFrZXMgdGhlIHVzZXIgYXdhcmUgb2YgdGhlIGZhY3QgdGhhdCB3ZSB3b24ndCBhdXRvbWF0aWNhbGx5IHNldCB1cFxuICAgICAgLy8gYW5pbWF0aW9ucy4gSWYgd2Ugd291bGQgYWRkIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB3aGlsZSB0aGUgTm9vcEFuaW1hdGlvbnNNb2R1bGVcbiAgICAgIC8vIGlzIGFscmVhZHkgY29uZmlndXJlZCwgd2Ugd291bGQgY2F1c2UgdW5leHBlY3RlZCBiZWhhdmlvciBhbmQgcnVudGltZSBleGNlcHRpb25zLlxuICAgICAgaWYgKGhhc05nTW9kdWxlSW1wb3J0KGhvc3QsIGFwcE1vZHVsZVBhdGgsIG5vb3BBbmltYXRpb25zTW9kdWxlTmFtZSkpIHtcbiAgICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICBgQ291bGQgbm90IHNldCB1cCBcIiR7YnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lfVwiIGAgK1xuICAgICAgICAgICAgYGJlY2F1c2UgXCIke25vb3BBbmltYXRpb25zTW9kdWxlTmFtZX1cIiBpcyBhbHJlYWR5IGltcG9ydGVkLmApO1xuICAgICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBQbGVhc2UgbWFudWFsbHkgc2V0IHVwIGJyb3dzZXIgYW5pbWF0aW9ucy5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb1Jvb3RNb2R1bGUoaG9zdCwgYnJvd3NlckFuaW1hdGlvbnNNb2R1bGVOYW1lLFxuICAgICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9IGVsc2UgaWYgKCFoYXNOZ01vZHVsZUltcG9ydChob3N0LCBhcHBNb2R1bGVQYXRoLCBicm93c2VyQW5pbWF0aW9uc01vZHVsZU5hbWUpKSB7XG4gICAgICAvLyBEbyBub3QgYWRkIHRoZSBOb29wQW5pbWF0aW9uc01vZHVsZSBtb2R1bGUgaWYgdGhlIHByb2plY3QgYWxyZWFkeSBleHBsaWNpdGx5IHVzZXNcbiAgICAgIC8vIHRoZSBCcm93c2VyQW5pbWF0aW9uc01vZHVsZS5cbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShob3N0LCBub29wQW5pbWF0aW9uc01vZHVsZU5hbWUsXG4gICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnLCBwcm9qZWN0KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQWRkcyBjdXN0b20gTWF0ZXJpYWwgc3R5bGVzIHRvIHRoZSBwcm9qZWN0IHN0eWxlIGZpbGUuIFRoZSBjdXN0b20gQ1NTIHNldHMgdXAgdGhlIFJvYm90byBmb250XG4gKiBhbmQgcmVzZXQgdGhlIGRlZmF1bHQgYnJvd3NlciBib2R5IG1hcmdpbi5cbiAqL1xuZnVuY3Rpb24gYWRkTWF0ZXJpYWxBcHBTdHlsZXMob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHN0eWxlRmlsZVBhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QpO1xuICAgIGNvbnN0IGxvZ2dlciA9IGNvbnRleHQubG9nZ2VyO1xuXG4gICAgaWYgKCFzdHlsZUZpbGVQYXRoKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoYENvdWxkIG5vdCBmaW5kIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgZm9yIHRoaXMgcHJvamVjdC5gKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3RvIGZvbnQgaW4geW91ciBDU1MuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IHJlYWQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSB3aXRoaW4gdGhlIHByb2plY3QgYCArXG4gICAgICAgIGAoJHtzdHlsZUZpbGVQYXRofSlgKTtcbiAgICAgIGxvZ2dlci5pbmZvKGBQbGVhc2UgY29uc2lkZXIgbWFudWFsbHkgc2V0dGluZyB1cCB0aGUgUm9ib3QgZm9udC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBodG1sQ29udGVudCA9IGJ1ZmZlci50b1N0cmluZygpO1xuICAgIGNvbnN0IGluc2VydGlvbiA9ICdcXG4nICtcbiAgICAgIGBodG1sLCBib2R5IHsgaGVpZ2h0OiAxMDAlOyB9XFxuYCArXG4gICAgICBgYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XFxuYDtcblxuICAgIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhpbnNlcnRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChodG1sQ29udGVudC5sZW5ndGgsIGluc2VydGlvbik7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICB9O1xufVxuIl19