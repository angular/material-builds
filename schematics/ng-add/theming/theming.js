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
        define("@angular/material/schematics/ng-add/theming/theming", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "@angular/cdk/schematics", "@schematics/angular/utility/change", "@schematics/angular/utility/config", "chalk", "path", "@angular/material/schematics/ng-add/theming/create-custom-theme"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    const change_1 = require("@schematics/angular/utility/change");
    const config_1 = require("@schematics/angular/utility/config");
    const chalk_1 = require("chalk");
    const path_1 = require("path");
    const create_custom_theme_1 = require("@angular/material/schematics/ng-add/theming/create-custom-theme");
    /** Path segment that can be found in paths that refer to a prebuilt theme. */
    const prebuiltThemePathSegment = '@angular/material/prebuilt-themes';
    /** Default file name of the custom theme that can be generated. */
    const defaultCustomThemeFilename = 'custom-theme.scss';
    /** Add pre-built styles to the main project style file. */
    function addThemeToAppStyles(options) {
        return function (host) {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const themeName = options.theme || 'indigo-pink';
            if (themeName === 'custom') {
                insertCustomTheme(project, options.project, host, workspace);
            }
            else {
                insertPrebuiltTheme(project, host, themeName, workspace);
            }
            return host;
        };
    }
    exports.addThemeToAppStyles = addThemeToAppStyles;
    /**
     * Insert a custom theme to project style file. If no valid style file could be found, a new
     * Scss file for the custom theme will be created.
     */
    function insertCustomTheme(project, projectName, host, workspace) {
        const stylesPath = schematics_2.getProjectStyleFile(project, 'scss');
        const themeContent = create_custom_theme_1.createCustomTheme(projectName);
        if (!stylesPath) {
            if (!project.sourceRoot) {
                throw new schematics_1.SchematicsException(`Could not find source root for project: "${projectName}". ` +
                    `Please make sure that the "sourceRoot" property is set in the workspace config.`);
            }
            // Normalize the path through the devkit utilities because we want to avoid having
            // unnecessary path segments and windows backslash delimiters.
            const customThemePath = core_1.normalize(path_1.join(project.sourceRoot, defaultCustomThemeFilename));
            if (host.exists(customThemePath)) {
                console.warn(chalk_1.default.yellow(`Cannot create a custom Angular Material theme because
          ${chalk_1.default.bold(customThemePath)} already exists. Skipping custom theme generation.`));
                return;
            }
            host.create(customThemePath, themeContent);
            addThemeStyleToTarget(project, 'build', host, customThemePath, workspace);
            return;
        }
        const insertion = new change_1.InsertChange(stylesPath, 0, themeContent);
        const recorder = host.beginUpdate(stylesPath);
        recorder.insertLeft(insertion.pos, insertion.toAdd);
        host.commitUpdate(recorder);
    }
    /** Insert a pre-built theme into the angular.json file. */
    function insertPrebuiltTheme(project, host, theme, workspace) {
        // Path needs to be always relative to the `package.json` or workspace root.
        const themePath = `./node_modules/@angular/material/prebuilt-themes/${theme}.css`;
        addThemeStyleToTarget(project, 'build', host, themePath, workspace);
        addThemeStyleToTarget(project, 'test', host, themePath, workspace);
    }
    /** Adds a theming style entry to the given project target options. */
    function addThemeStyleToTarget(project, targetName, host, assetPath, workspace) {
        // Do not update the builder options in case the target does not use the default CLI builder.
        if (!validateDefaultTargetBuilder(project, targetName)) {
            return;
        }
        const targetOptions = schematics_2.getProjectTargetOptions(project, targetName);
        if (!targetOptions.styles) {
            targetOptions.styles = [assetPath];
        }
        else {
            const existingStyles = targetOptions.styles.map(s => typeof s === 'string' ? s : s.input);
            for (let [index, stylePath] of existingStyles.entries()) {
                // If the given asset is already specified in the styles, we don't need to do anything.
                if (stylePath === assetPath) {
                    return;
                }
                // In case a prebuilt theme is already set up, we can safely replace the theme with the new
                // theme file. If a custom theme is set up, we are not able to safely replace the custom
                // theme because these files can contain custom styles, while prebuilt themes are
                // always packaged and considered replaceable.
                if (stylePath.includes(defaultCustomThemeFilename)) {
                    console.warn(chalk_1.default.red(`Could not add the selected theme to the CLI project ` +
                        `configuration because there is already a custom theme file referenced.`));
                    console.warn(chalk_1.default.red(`Please manually add the following style file to your configuration:`));
                    console.warn(chalk_1.default.yellow(`    ${chalk_1.default.bold(assetPath)}`));
                    return;
                }
                else if (stylePath.includes(prebuiltThemePathSegment)) {
                    targetOptions.styles.splice(index, 1);
                }
            }
            targetOptions.styles.unshift(assetPath);
        }
        host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
    }
    /**
     * Validates that the specified project target is configured with the default builders which are
     * provided by the Angular CLI. If the configured builder does not match the default builder,
     * this function can either throw or just show a warning.
     */
    function validateDefaultTargetBuilder(project, targetName) {
        const defaultBuilder = schematics_2.defaultTargetBuilders[targetName];
        const targetConfig = project.architect && project.architect[targetName] ||
            project.targets && project.targets[targetName];
        const isDefaultBuilder = targetConfig && targetConfig['builder'] === defaultBuilder;
        // Because the build setup for the Angular CLI can be customized by developers, we can't know
        // where to put the theme file in the workspace configuration if custom builders are being
        // used. In case the builder has been changed for the "build" target, we throw an error and
        // exit because setting up a theme is a primary goal of `ng-add`. Otherwise if just the "test"
        // builder has been changed, we warn because a theme is not mandatory for running tests
        // with Material. See: https://github.com/angular/components/issues/14176
        if (!isDefaultBuilder && targetName === 'build') {
            throw new schematics_1.SchematicsException(`Your project is not using the default builders for ` +
                `"${targetName}". The Angular Material schematics cannot add a theme to the workspace ` +
                `configuration if the builder has been changed.`);
        }
        else if (!isDefaultBuilder) {
            console.warn(`Your project is not using the default builders for "${targetName}". This ` +
                `means that we cannot add the configured theme to the "${targetName}" target.`);
        }
        return isDefaultBuilder;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBK0M7SUFFL0MsMkRBQXFFO0lBQ3JFLHdEQUtpQztJQUNqQywrREFBZ0U7SUFDaEUsK0RBQWdFO0lBQ2hFLGlDQUEwQjtJQUMxQiwrQkFBMEI7SUFFMUIseUdBQXdEO0lBRXhELDhFQUE4RTtJQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0lBRXJFLG1FQUFtRTtJQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0lBRXZELDJEQUEyRDtJQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO1FBQ2pELE9BQU8sVUFBUyxJQUFVO1lBQ3hCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQztZQUVqRCxJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM5RDtpQkFBTTtnQkFDTCxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMxRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQWRELGtEQWNDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxPQUF5QixFQUFF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QUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxjQUFjLENBQUM7UUFFcEYsNkZBQTZGO1FBQzdGLDBGQUEwRjtRQUMxRiwyRkFBMkY7UUFDM0YsOEZBQThGO1FBQzlGLHVGQUF1RjtRQUN2Rix5RUFBeUU7UUFDekUsSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsS0FBSyxPQUFPLEVBQUU7WUFDL0MsTUFBTSxJQUFJLGdDQUFtQixDQUFDLHFEQUFxRDtnQkFDakYsSUFBSSxVQUFVLHlFQUF5RTtnQkFDdkYsZ0RBQWdELENBQUMsQ0FBQztTQUNyRDthQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxVQUFVLFVBQVU7Z0JBQ3RGLHlEQUF5RCxVQUFVLFdBQVcsQ0FBQyxDQUFDO1NBQ25GO1FBRUQsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3QsIFdvcmtzcGFjZVNjaGVtYX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL2V4cGVyaW1lbnRhbC93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBkZWZhdWx0VGFyZ2V0QnVpbGRlcnMsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0U3R5bGVGaWxlLFxuICBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIEFkZCBwcmUtYnVpbHQgc3R5bGVzIHRvIHRoZSBtYWluIHByb2plY3Qgc3R5bGUgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSk6IChob3N0OiBUcmVlKSA9PiBUcmVlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGhvc3Q6IFRyZWUpOiBUcmVlIHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCB0aGVtZU5hbWUgPSBvcHRpb25zLnRoZW1lIHx8ICdpbmRpZ28tcGluayc7XG5cbiAgICBpZiAodGhlbWVOYW1lID09PSAnY3VzdG9tJykge1xuICAgICAgaW5zZXJ0Q3VzdG9tVGhlbWUocHJvamVjdCwgb3B0aW9ucy5wcm9qZWN0LCBob3N0LCB3b3Jrc3BhY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRQcmVidWlsdFRoZW1lKHByb2plY3QsIGhvc3QsIHRoZW1lTmFtZSwgd29ya3NwYWNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBjdXN0b20gdGhlbWUgdG8gcHJvamVjdCBzdHlsZSBmaWxlLiBJZiBubyB2YWxpZCBzdHlsZSBmaWxlIGNvdWxkIGJlIGZvdW5kLCBhIG5ld1xuICogU2NzcyBmaWxlIGZvciB0aGUgY3VzdG9tIHRoZW1lIHdpbGwgYmUgY3JlYXRlZC5cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0Q3VzdG9tVGhlbWUocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCwgcHJvamVjdE5hbWU6IHN0cmluZywgaG9zdDogVHJlZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZTogV29ya3NwYWNlU2NoZW1hKSB7XG5cbiAgY29uc3Qgc3R5bGVzUGF0aCA9IGdldFByb2plY3RTdHlsZUZpbGUocHJvamVjdCwgJ3Njc3MnKTtcbiAgY29uc3QgdGhlbWVDb250ZW50ID0gY3JlYXRlQ3VzdG9tVGhlbWUocHJvamVjdE5hbWUpO1xuXG4gIGlmICghc3R5bGVzUGF0aCkge1xuICAgIGlmICghcHJvamVjdC5zb3VyY2VSb290KSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IGZpbmQgc291cmNlIHJvb3QgZm9yIHByb2plY3Q6IFwiJHtwcm9qZWN0TmFtZX1cIi4gYCArXG4gICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgdGhlIFwic291cmNlUm9vdFwiIHByb3BlcnR5IGlzIHNldCBpbiB0aGUgd29ya3NwYWNlIGNvbmZpZy5gKTtcbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGggdGhyb3VnaCB0aGUgZGV2a2l0IHV0aWxpdGllcyBiZWNhdXNlIHdlIHdhbnQgdG8gYXZvaWQgaGF2aW5nXG4gICAgLy8gdW5uZWNlc3NhcnkgcGF0aCBzZWdtZW50cyBhbmQgd2luZG93cyBiYWNrc2xhc2ggZGVsaW1pdGVycy5cbiAgICBjb25zdCBjdXN0b21UaGVtZVBhdGggPSBub3JtYWxpemUoam9pbihwcm9qZWN0LnNvdXJjZVJvb3QsIGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSk7XG5cbiAgICBpZiAoaG9zdC5leGlzdHMoY3VzdG9tVGhlbWVQYXRoKSkge1xuICAgICAgY29uc29sZS53YXJuKGNoYWxrLnllbGxvdyhgQ2Fubm90IGNyZWF0ZSBhIGN1c3RvbSBBbmd1bGFyIE1hdGVyaWFsIHRoZW1lIGJlY2F1c2VcbiAgICAgICAgICAke2NoYWxrLmJvbGQoY3VzdG9tVGhlbWVQYXRoKX0gYWxyZWFkeSBleGlzdHMuIFNraXBwaW5nIGN1c3RvbSB0aGVtZSBnZW5lcmF0aW9uLmApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBob3N0LmNyZWF0ZShjdXN0b21UaGVtZVBhdGgsIHRoZW1lQ29udGVudCk7XG4gICAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICdidWlsZCcsIGhvc3QsIGN1c3RvbVRoZW1lUGF0aCwgd29ya3NwYWNlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBpbnNlcnRpb24gPSBuZXcgSW5zZXJ0Q2hhbmdlKHN0eWxlc1BhdGgsIDAsIHRoZW1lQ29udGVudCk7XG4gIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZXNQYXRoKTtcblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KGluc2VydGlvbi5wb3MsIGluc2VydGlvbi50b0FkZCk7XG4gIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbn1cblxuLyoqIEluc2VydCBhIHByZS1idWlsdCB0aGVtZSBpbnRvIHRoZSBhbmd1bGFyLmpzb24gZmlsZS4gKi9cbmZ1bmN0aW9uIGluc2VydFByZWJ1aWx0VGhlbWUocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCwgaG9zdDogVHJlZSwgdGhlbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlOiBXb3Jrc3BhY2VTY2hlbWEpIHtcblxuICAvLyBQYXRoIG5lZWRzIHRvIGJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgYHBhY2thZ2UuanNvbmAgb3Igd29ya3NwYWNlIHJvb3QuXG4gIGNvbnN0IHRoZW1lUGF0aCA9ICBgLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvbWF0ZXJpYWwvcHJlYnVpbHQtdGhlbWVzLyR7dGhlbWV9LmNzc2A7XG5cbiAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICdidWlsZCcsIGhvc3QsIHRoZW1lUGF0aCwgd29ya3NwYWNlKTtcbiAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICd0ZXN0JywgaG9zdCwgdGhlbWVQYXRoLCB3b3Jrc3BhY2UpO1xufVxuXG4vKiogQWRkcyBhIHRoZW1pbmcgc3R5bGUgZW50cnkgdG8gdGhlIGdpdmVuIHByb2plY3QgdGFyZ2V0IG9wdGlvbnMuICovXG5mdW5jdGlvbiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdDogV29ya3NwYWNlUHJvamVjdCwgdGFyZ2V0TmFtZTogJ3Rlc3QnIHwgJ2J1aWxkJywgaG9zdDogVHJlZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldFBhdGg6IHN0cmluZywgd29ya3NwYWNlOiBXb3Jrc3BhY2VTY2hlbWEpIHtcbiAgLy8gRG8gbm90IHVwZGF0ZSB0aGUgYnVpbGRlciBvcHRpb25zIGluIGNhc2UgdGhlIHRhcmdldCBkb2VzIG5vdCB1c2UgdGhlIGRlZmF1bHQgQ0xJIGJ1aWxkZXIuXG4gIGlmICghdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihwcm9qZWN0LCB0YXJnZXROYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldE9wdGlvbnMgPSBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyhwcm9qZWN0LCB0YXJnZXROYW1lKTtcblxuICBpZiAoIXRhcmdldE9wdGlvbnMuc3R5bGVzKSB7XG4gICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMgPSBbYXNzZXRQYXRoXTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBleGlzdGluZ1N0eWxlcyA9IHRhcmdldE9wdGlvbnMuc3R5bGVzLm1hcChzID0+IHR5cGVvZiBzID09PSAnc3RyaW5nJyA/IHMgOiBzLmlucHV0KTtcblxuICAgIGZvciAobGV0IFtpbmRleCwgc3R5bGVQYXRoXSBvZiBleGlzdGluZ1N0eWxlcy5lbnRyaWVzKCkpIHtcbiAgICAgIC8vIElmIHRoZSBnaXZlbiBhc3NldCBpcyBhbHJlYWR5IHNwZWNpZmllZCBpbiB0aGUgc3R5bGVzLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLlxuICAgICAgaWYgKHN0eWxlUGF0aCA9PT0gYXNzZXRQYXRoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSW4gY2FzZSBhIHByZWJ1aWx0IHRoZW1lIGlzIGFscmVhZHkgc2V0IHVwLCB3ZSBjYW4gc2FmZWx5IHJlcGxhY2UgdGhlIHRoZW1lIHdpdGggdGhlIG5ld1xuICAgICAgLy8gdGhlbWUgZmlsZS4gSWYgYSBjdXN0b20gdGhlbWUgaXMgc2V0IHVwLCB3ZSBhcmUgbm90IGFibGUgdG8gc2FmZWx5IHJlcGxhY2UgdGhlIGN1c3RvbVxuICAgICAgLy8gdGhlbWUgYmVjYXVzZSB0aGVzZSBmaWxlcyBjYW4gY29udGFpbiBjdXN0b20gc3R5bGVzLCB3aGlsZSBwcmVidWlsdCB0aGVtZXMgYXJlXG4gICAgICAvLyBhbHdheXMgcGFja2FnZWQgYW5kIGNvbnNpZGVyZWQgcmVwbGFjZWFibGUuXG4gICAgICBpZiAoc3R5bGVQYXRoLmluY2x1ZGVzKGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oY2hhbGsucmVkKGBDb3VsZCBub3QgYWRkIHRoZSBzZWxlY3RlZCB0aGVtZSB0byB0aGUgQ0xJIHByb2plY3QgYCArXG4gICAgICAgICAgICBgY29uZmlndXJhdGlvbiBiZWNhdXNlIHRoZXJlIGlzIGFscmVhZHkgYSBjdXN0b20gdGhlbWUgZmlsZSByZWZlcmVuY2VkLmApKTtcbiAgICAgICAgY29uc29sZS53YXJuKGNoYWxrLnJlZChcbiAgICAgICAgICAgIGBQbGVhc2UgbWFudWFsbHkgYWRkIHRoZSBmb2xsb3dpbmcgc3R5bGUgZmlsZSB0byB5b3VyIGNvbmZpZ3VyYXRpb246YCkpO1xuICAgICAgICBjb25zb2xlLndhcm4oY2hhbGsueWVsbG93KGAgICAgJHtjaGFsay5ib2xkKGFzc2V0UGF0aCl9YCkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQpKSB7XG4gICAgICAgIHRhcmdldE9wdGlvbnMuc3R5bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMudW5zaGlmdChhc3NldFBhdGgpO1xuICB9XG5cbiAgaG9zdC5vdmVyd3JpdGUoJ2FuZ3VsYXIuanNvbicsIEpTT04uc3RyaW5naWZ5KHdvcmtzcGFjZSwgbnVsbCwgMikpO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBzcGVjaWZpZWQgcHJvamVjdCB0YXJnZXQgaXMgY29uZmlndXJlZCB3aXRoIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIHdoaWNoIGFyZVxuICogcHJvdmlkZWQgYnkgdGhlIEFuZ3VsYXIgQ0xJLiBJZiB0aGUgY29uZmlndXJlZCBidWlsZGVyIGRvZXMgbm90IG1hdGNoIHRoZSBkZWZhdWx0IGJ1aWxkZXIsXG4gKiB0aGlzIGZ1bmN0aW9uIGNhbiBlaXRoZXIgdGhyb3cgb3IganVzdCBzaG93IGEgd2FybmluZy5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCB0YXJnZXROYW1lOiAnYnVpbGQnIHwgJ3Rlc3QnKSB7XG4gIGNvbnN0IGRlZmF1bHRCdWlsZGVyID0gZGVmYXVsdFRhcmdldEJ1aWxkZXJzW3RhcmdldE5hbWVdO1xuICBjb25zdCB0YXJnZXRDb25maWcgPSBwcm9qZWN0LmFyY2hpdGVjdCAmJiBwcm9qZWN0LmFyY2hpdGVjdFt0YXJnZXROYW1lXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0LnRhcmdldHMgJiYgcHJvamVjdC50YXJnZXRzW3RhcmdldE5hbWVdO1xuICBjb25zdCBpc0RlZmF1bHRCdWlsZGVyID0gdGFyZ2V0Q29uZmlnICYmIHRhcmdldENvbmZpZ1snYnVpbGRlciddID09PSBkZWZhdWx0QnVpbGRlcjtcblxuICAvLyBCZWNhdXNlIHRoZSBidWlsZCBzZXR1cCBmb3IgdGhlIEFuZ3VsYXIgQ0xJIGNhbiBiZSBjdXN0b21pemVkIGJ5IGRldmVsb3BlcnMsIHdlIGNhbid0IGtub3dcbiAgLy8gd2hlcmUgdG8gcHV0IHRoZSB0aGVtZSBmaWxlIGluIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBpZiBjdXN0b20gYnVpbGRlcnMgYXJlIGJlaW5nXG4gIC8vIHVzZWQuIEluIGNhc2UgdGhlIGJ1aWxkZXIgaGFzIGJlZW4gY2hhbmdlZCBmb3IgdGhlIFwiYnVpbGRcIiB0YXJnZXQsIHdlIHRocm93IGFuIGVycm9yIGFuZFxuICAvLyBleGl0IGJlY2F1c2Ugc2V0dGluZyB1cCBhIHRoZW1lIGlzIGEgcHJpbWFyeSBnb2FsIG9mIGBuZy1hZGRgLiBPdGhlcndpc2UgaWYganVzdCB0aGUgXCJ0ZXN0XCJcbiAgLy8gYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLCB3ZSB3YXJuIGJlY2F1c2UgYSB0aGVtZSBpcyBub3QgbWFuZGF0b3J5IGZvciBydW5uaW5nIHRlc3RzXG4gIC8vIHdpdGggTWF0ZXJpYWwuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTQxNzZcbiAgaWYgKCFpc0RlZmF1bHRCdWlsZGVyICYmIHRhcmdldE5hbWUgPT09ICdidWlsZCcpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgWW91ciBwcm9qZWN0IGlzIG5vdCB1c2luZyB0aGUgZGVmYXVsdCBidWlsZGVycyBmb3IgYCArXG4gICAgICBgXCIke3RhcmdldE5hbWV9XCIuIFRoZSBBbmd1bGFyIE1hdGVyaWFsIHNjaGVtYXRpY3MgY2Fubm90IGFkZCBhIHRoZW1lIHRvIHRoZSB3b3Jrc3BhY2UgYCArXG4gICAgICBgY29uZmlndXJhdGlvbiBpZiB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLmApO1xuICB9IGVsc2UgaWYgKCFpc0RlZmF1bHRCdWlsZGVyKSB7XG4gICAgY29uc29sZS53YXJuKGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhpcyBgICtcbiAgICAgIGBtZWFucyB0aGF0IHdlIGNhbm5vdCBhZGQgdGhlIGNvbmZpZ3VyZWQgdGhlbWUgdG8gdGhlIFwiJHt0YXJnZXROYW1lfVwiIHRhcmdldC5gKTtcbiAgfVxuXG4gIHJldHVybiBpc0RlZmF1bHRCdWlsZGVyO1xufVxuIl19