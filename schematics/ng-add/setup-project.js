"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");
const utility_1 = require("@schematics/angular/utility");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
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
                addAnimations(options),
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
/** Adds the animations package to the project based on the conffiguration. */
function addAnimations(options) {
    return (host, context) => {
        const animationsRule = options.animations === 'excluded'
            ? (0, schematics_1.noop)()
            : (0, utility_1.addRootProvider)(options.project, ({ code, external }) => {
                return code `${external('provideAnimationsAsync', '@angular/platform-browser/animations/async')}(${options.animations === 'disabled' ? `'noop'` : ''})`;
            });
        // The `addRootProvider` rule can throw in some custom scenarios (see #28640).
        // Add some error handling around it so the setup isn't interrupted.
        return (0, schematics_1.callRule)(animationsRule, host, context).pipe((0, operators_1.catchError)(() => {
            context.logger.error('Failed to add animations to project. Continuing with the Angular Material setup.');
            context.logger.info('Read more about setting up the animations manually: https://angular.dev/guide/animations');
            return (0, rxjs_1.of)(host);
        }));
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC9zZXR1cC1wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBbUJILDRCQXNCQztBQXZDRCwyREFBK0Y7QUFDL0Ysd0RBQXFGO0FBQ3JGLHFFQUFtRTtBQUNuRSx5REFBNEQ7QUFDNUQsbUZBQXlFO0FBQ3pFLCtCQUF3QztBQUN4Qyw4Q0FBMEM7QUFDMUMsMkRBQXVEO0FBRXZELCtDQUEwRTtBQUUxRTs7Ozs7R0FLRztBQUNILG1CQUF5QixPQUFlO0lBQ3RDLE9BQU8sS0FBSyxFQUFFLElBQVUsRUFBRSxPQUF5QixFQUFFLEVBQUU7UUFDckQsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLHdCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQ0FBdUIsRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBFLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyw4QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xFLE9BQU8sSUFBQSxrQkFBSyxFQUFDO2dCQUNYLGFBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLElBQUEsNkJBQW1CLEVBQUMsT0FBTyxDQUFDO2dCQUM1QixJQUFBLGdDQUFlLEVBQUMsT0FBTyxDQUFDO2dCQUN4QixvQkFBb0IsQ0FBQyxPQUFPLENBQUM7Z0JBQzdCLElBQUEsNEJBQWtCLEVBQUMsT0FBTyxDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsbUZBQW1GO1lBQ2pGLHNFQUFzRTtZQUN0RSxvRkFBb0Y7WUFDcEYsU0FBUyxDQUNaLENBQUM7UUFDRixPQUFPO0lB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Q0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmRldi9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgbm9vcCwgUnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZSwgY2FsbFJ1bGV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsIGdldFByb2plY3RTdHlsZUZpbGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7YWRkUm9vdFByb3ZpZGVyfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHknO1xuaW1wb3J0IHtQcm9qZWN0VHlwZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjYXRjaEVycm9yfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge2FkZEZvbnRzVG9JbmRleH0gZnJvbSAnLi9mb250cy9tYXRlcmlhbC1mb250cyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHthZGRUaGVtZVRvQXBwU3R5bGVzLCBhZGRUeXBvZ3JhcGh5Q2xhc3N9IGZyb20gJy4vdGhlbWluZy90aGVtaW5nJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgdGhlIGJhc2ljcyBvZiBhIEFuZ3VsYXIgTWF0ZXJpYWwgYXBwbGljYXRpb24sIHRoaXMgaW5jbHVkZXM6XG4gKiAgLSBBZGQgUGFja2FnZXMgdG8gcGFja2FnZS5qc29uXG4gKiAgLSBBZGRzIHByZS1idWlsdCB0aGVtZXMgdG8gc3R5bGVzLmV4dFxuICogIC0gQWRkcyBCcm93c2VyIEFuaW1hdGlvbiB0byBhcHAubW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG5cbiAgICBpZiAocHJvamVjdC5leHRlbnNpb25zWydwcm9qZWN0VHlwZSddID09PSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIGNoYWluKFtcbiAgICAgICAgYWRkQW5pbWF0aW9ucyhvcHRpb25zKSxcbiAgICAgICAgYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkRm9udHNUb0luZGV4KG9wdGlvbnMpLFxuICAgICAgICBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zKSxcbiAgICAgICAgYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnMpLFxuICAgICAgXSk7XG4gICAgfVxuICAgIGNvbnRleHQubG9nZ2VyLndhcm4oXG4gICAgICAnQW5ndWxhciBNYXRlcmlhbCBoYXMgYmVlbiBzZXQgdXAgaW4geW91ciB3b3Jrc3BhY2UuIFRoZXJlIGlzIG5vIGFkZGl0aW9uYWwgc2V0dXAgJyArXG4gICAgICAgICdyZXF1aXJlZCBmb3IgY29uc3VtaW5nIEFuZ3VsYXIgTWF0ZXJpYWwgaW4geW91ciBsaWJyYXJ5IHByb2plY3QuXFxuXFxuJyArXG4gICAgICAgICdJZiB5b3UgaW50ZW5kZWQgdG8gcnVuIHRoZSBzY2hlbWF0aWMgb24gYSBkaWZmZXJlbnQgcHJvamVjdCwgcGFzcyB0aGUgYC0tcHJvamVjdGAgJyArXG4gICAgICAgICdvcHRpb24uJyxcbiAgICApO1xuICAgIHJldHVybjtcbiAgfTtcbn1cblxuLyoqXG4gKiBBZGRzIGN1c3RvbSBNYXRlcmlhbCBzdHlsZXMgdG8gdGhlIHByb2plY3Qgc3R5bGUgZmlsZS4gVGhlIGN1c3RvbSBDU1Mgc2V0cyB1cCB0aGUgUm9ib3RvIGZvbnRcbiAqIGFuZCByZXNldCB0aGUgZGVmYXVsdCBicm93c2VyIGJvZHkgbWFyZ2luLlxuICovXG5mdW5jdGlvbiBhZGRNYXRlcmlhbEFwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3Qgc3R5bGVGaWxlUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCk7XG4gICAgY29uc3QgbG9nZ2VyID0gY29udGV4dC5sb2dnZXI7XG5cbiAgICBpZiAoIXN0eWxlRmlsZVBhdGgpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgQ291bGQgbm90IGZpbmQgdGhlIGRlZmF1bHQgc3R5bGUgZmlsZSBmb3IgdGhpcyBwcm9qZWN0LmApO1xuICAgICAgbG9nZ2VyLmluZm8oYENvbnNpZGVyIG1hbnVhbGx5IGFkZGluZyB0aGUgUm9ib3RvIGZvbnQgdG8geW91ciBDU1MuYCk7XG4gICAgICBsb2dnZXIuaW5mbyhgTW9yZSBpbmZvcm1hdGlvbiBhdCBodHRwczovL2ZvbnRzLmdvb2dsZS5jb20vc3BlY2ltZW4vUm9ib3RvYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCByZWFkIHRoZSBkZWZhdWx0IHN0eWxlIGZpbGUgd2l0aGluIHRoZSBwcm9qZWN0IGAgKyBgKCR7c3R5bGVGaWxlUGF0aH0pYCxcbiAgICAgICk7XG4gICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIGNvbnNpZGVyIG1hbnVhbGx5IHNldHRpbmcgdXAgdGhlIFJvYm90byBmb250LmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5zZXJ0aW9uID1cbiAgICAgICdcXG4nICtcbiAgICAgIGBodG1sLCBib2R5IHsgaGVpZ2h0OiAxMDAlOyB9XFxuYCArXG4gICAgICBgYm9keSB7IG1hcmdpbjogMDsgZm9udC1mYW1pbHk6IFJvYm90bywgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmOyB9XFxuYDtcblxuICAgIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhpbnNlcnRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChodG1sQ29udGVudC5sZW5ndGgsIGluc2VydGlvbik7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgYW5pbWF0aW9ucyBwYWNrYWdlIHRvIHRoZSBwcm9qZWN0IGJhc2VkIG9uIHRoZSBjb25mZmlndXJhdGlvbi4gKi9cbmZ1bmN0aW9uIGFkZEFuaW1hdGlvbnMob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGFuaW1hdGlvbnNSdWxlID1cbiAgICAgIG9wdGlvbnMuYW5pbWF0aW9ucyA9PT0gJ2V4Y2x1ZGVkJ1xuICAgICAgICA/IG5vb3AoKVxuICAgICAgICA6IGFkZFJvb3RQcm92aWRlcihvcHRpb25zLnByb2plY3QsICh7Y29kZSwgZXh0ZXJuYWx9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29kZWAke2V4dGVybmFsKFxuICAgICAgICAgICAgICAncHJvdmlkZUFuaW1hdGlvbnNBc3luYycsXG4gICAgICAgICAgICAgICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMvYXN5bmMnLFxuICAgICAgICAgICAgKX0oJHtvcHRpb25zLmFuaW1hdGlvbnMgPT09ICdkaXNhYmxlZCcgPyBgJ25vb3AnYCA6ICcnfSlgO1xuICAgICAgICAgIH0pO1xuXG4gICAgLy8gVGhlIGBhZGRSb290UHJvdmlkZXJgIHJ1bGUgY2FuIHRocm93IGluIHNvbWUgY3VzdG9tIHNjZW5hcmlvcyAoc2VlICMyODY0MCkuXG4gICAgLy8gQWRkIHNvbWUgZXJyb3IgaGFuZGxpbmcgYXJvdW5kIGl0IHNvIHRoZSBzZXR1cCBpc24ndCBpbnRlcnJ1cHRlZC5cbiAgICByZXR1cm4gY2FsbFJ1bGUoYW5pbWF0aW9uc1J1bGUsIGhvc3QsIGNvbnRleHQpLnBpcGUoXG4gICAgICBjYXRjaEVycm9yKCgpID0+IHtcbiAgICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3IoXG4gICAgICAgICAgJ0ZhaWxlZCB0byBhZGQgYW5pbWF0aW9ucyB0byBwcm9qZWN0LiBDb250aW51aW5nIHdpdGggdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2V0dXAuJyxcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgICAnUmVhZCBtb3JlIGFib3V0IHNldHRpbmcgdXAgdGhlIGFuaW1hdGlvbnMgbWFudWFsbHk6IGh0dHBzOi8vYW5ndWxhci5kZXYvZ3VpZGUvYW5pbWF0aW9ucycsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoaG9zdCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9O1xufVxuIl19