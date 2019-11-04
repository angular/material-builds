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
    /** Adds the global typography class to the body element. */
    function addTypographyClass(options) {
        return function (host) {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
            const projectIndexFiles = schematics_2.getProjectIndexFiles(project);
            if (!projectIndexFiles.length) {
                throw new schematics_1.SchematicsException('No project index HTML file could be found.');
            }
            projectIndexFiles.forEach(indexFilePath => schematics_2.addBodyClass(host, indexFilePath, 'mat-typography'));
            return host;
        };
    }
    exports.addTypographyClass = addTypographyClass;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBK0M7SUFFL0MsMkRBQXFFO0lBQ3JFLHdEQU9pQztJQUNqQywrREFBZ0U7SUFDaEUsK0RBQWdFO0lBQ2hFLGlDQUEwQjtJQUMxQiwrQkFBMEI7SUFFMUIseUdBQXdEO0lBRXhELDhFQUE4RTtJQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0lBRXJFLG1FQUFtRTtJQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0lBRXZELDJEQUEyRDtJQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO1FBQ2pELE9BQU8sVUFBUyxJQUFVO1lBQ3hCLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQztZQUVqRCxJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM5RDtpQkFBTTtnQkFDTCxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMxRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQWRELGtEQWNDO0lBRUQsNERBQTREO0lBQzVELFNBQWdCLGtCQUFrQixDQUFDLE9BQWU7UUFD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Z0IsQ0FBQztJQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3QsIFdvcmtzcGFjZVNjaGVtYX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL2V4cGVyaW1lbnRhbC93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRCb2R5Q2xhc3MsXG4gIGRlZmF1bHRUYXJnZXRCdWlsZGVycyxcbiAgZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2UsXG4gIGdldFByb2plY3RTdHlsZUZpbGUsXG4gIGdldFByb2plY3RUYXJnZXRPcHRpb25zLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtJbnNlcnRDaGFuZ2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jaGFuZ2UnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIEFkZCBwcmUtYnVpbHQgc3R5bGVzIHRvIHRoZSBtYWluIHByb2plY3Qgc3R5bGUgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSk6IChob3N0OiBUcmVlKSA9PiBUcmVlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGhvc3Q6IFRyZWUpOiBUcmVlIHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCB0aGVtZU5hbWUgPSBvcHRpb25zLnRoZW1lIHx8ICdpbmRpZ28tcGluayc7XG5cbiAgICBpZiAodGhlbWVOYW1lID09PSAnY3VzdG9tJykge1xuICAgICAgaW5zZXJ0Q3VzdG9tVGhlbWUocHJvamVjdCwgb3B0aW9ucy5wcm9qZWN0LCBob3N0LCB3b3Jrc3BhY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRQcmVidWlsdFRoZW1lKHByb2plY3QsIGhvc3QsIHRoZW1lTmFtZSwgd29ya3NwYWNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuLyoqIEFkZHMgdGhlIGdsb2JhbCB0eXBvZ3JhcGh5IGNsYXNzIHRvIHRoZSBib2R5IGVsZW1lbnQuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVHlwb2dyYXBoeUNsYXNzKG9wdGlvbnM6IFNjaGVtYSk6IChob3N0OiBUcmVlKSA9PiBUcmVlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGhvc3Q6IFRyZWUpOiBUcmVlIHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IGdldFByb2plY3RGcm9tV29ya3NwYWNlKHdvcmtzcGFjZSwgb3B0aW9ucy5wcm9qZWN0KTtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXhGaWxlcyA9IGdldFByb2plY3RJbmRleEZpbGVzKHByb2plY3QpO1xuXG4gICAgaWYgKCFwcm9qZWN0SW5kZXhGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdObyBwcm9qZWN0IGluZGV4IEhUTUwgZmlsZSBjb3VsZCBiZSBmb3VuZC4nKTtcbiAgICB9XG5cbiAgICBwcm9qZWN0SW5kZXhGaWxlcy5mb3JFYWNoKGluZGV4RmlsZVBhdGggPT4gYWRkQm9keUNsYXNzKGhvc3QsIGluZGV4RmlsZVBhdGgsICdtYXQtdHlwb2dyYXBoeScpKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG4vKipcbiAqIEluc2VydCBhIGN1c3RvbSB0aGVtZSB0byBwcm9qZWN0IHN0eWxlIGZpbGUuIElmIG5vIHZhbGlkIHN0eWxlIGZpbGUgY291bGQgYmUgZm91bmQsIGEgbmV3XG4gKiBTY3NzIGZpbGUgZm9yIHRoZSBjdXN0b20gdGhlbWUgd2lsbCBiZSBjcmVhdGVkLlxuICovXG5mdW5jdGlvbiBpbnNlcnRDdXN0b21UaGVtZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCBwcm9qZWN0TmFtZTogc3RyaW5nLCBob3N0OiBUcmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya3NwYWNlOiBXb3Jrc3BhY2VTY2hlbWEpIHtcblxuICBjb25zdCBzdHlsZXNQYXRoID0gZ2V0UHJvamVjdFN0eWxlRmlsZShwcm9qZWN0LCAnc2NzcycpO1xuICBjb25zdCB0aGVtZUNvbnRlbnQgPSBjcmVhdGVDdXN0b21UaGVtZShwcm9qZWN0TmFtZSk7XG5cbiAgaWYgKCFzdHlsZXNQYXRoKSB7XG4gICAgaWYgKCFwcm9qZWN0LnNvdXJjZVJvb3QpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDb3VsZCBub3QgZmluZCBzb3VyY2Ugcm9vdCBmb3IgcHJvamVjdDogXCIke3Byb2plY3ROYW1lfVwiLiBgICtcbiAgICAgICAgYFBsZWFzZSBtYWtlIHN1cmUgdGhhdCB0aGUgXCJzb3VyY2VSb290XCIgcHJvcGVydHkgaXMgc2V0IGluIHRoZSB3b3Jrc3BhY2UgY29uZmlnLmApO1xuICAgIH1cblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aCB0aHJvdWdoIHRoZSBkZXZraXQgdXRpbGl0aWVzIGJlY2F1c2Ugd2Ugd2FudCB0byBhdm9pZCBoYXZpbmdcbiAgICAvLyB1bm5lY2Vzc2FyeSBwYXRoIHNlZ21lbnRzIGFuZCB3aW5kb3dzIGJhY2tzbGFzaCBkZWxpbWl0ZXJzLlxuICAgIGNvbnN0IGN1c3RvbVRoZW1lUGF0aCA9IG5vcm1hbGl6ZShqb2luKHByb2plY3Quc291cmNlUm9vdCwgZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUpKTtcblxuICAgIGlmIChob3N0LmV4aXN0cyhjdXN0b21UaGVtZVBhdGgpKSB7XG4gICAgICBjb25zb2xlLndhcm4oY2hhbGsueWVsbG93KGBDYW5ub3QgY3JlYXRlIGEgY3VzdG9tIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgYmVjYXVzZVxuICAgICAgICAgICR7Y2hhbGsuYm9sZChjdXN0b21UaGVtZVBhdGgpfSBhbHJlYWR5IGV4aXN0cy4gU2tpcHBpbmcgY3VzdG9tIHRoZW1lIGdlbmVyYXRpb24uYCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhvc3QuY3JlYXRlKGN1c3RvbVRoZW1lUGF0aCwgdGhlbWVDb250ZW50KTtcbiAgICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ2J1aWxkJywgaG9zdCwgY3VzdG9tVGhlbWVQYXRoLCB3b3Jrc3BhY2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGluc2VydGlvbiA9IG5ldyBJbnNlcnRDaGFuZ2Uoc3R5bGVzUGF0aCwgMCwgdGhlbWVDb250ZW50KTtcbiAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKHN0eWxlc1BhdGgpO1xuXG4gIHJlY29yZGVyLmluc2VydExlZnQoaW5zZXJ0aW9uLnBvcywgaW5zZXJ0aW9uLnRvQWRkKTtcbiAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xufVxuXG4vKiogSW5zZXJ0IGEgcHJlLWJ1aWx0IHRoZW1lIGludG8gdGhlIGFuZ3VsYXIuanNvbiBmaWxlLiAqL1xuZnVuY3Rpb24gaW5zZXJ0UHJlYnVpbHRUaGVtZShwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCBob3N0OiBUcmVlLCB0aGVtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZVNjaGVtYSkge1xuXG4gIC8vIFBhdGggbmVlZHMgdG8gYmUgYWx3YXlzIHJlbGF0aXZlIHRvIHRoZSBgcGFja2FnZS5qc29uYCBvciB3b3Jrc3BhY2Ugcm9vdC5cbiAgY29uc3QgdGhlbWVQYXRoID0gIGAuL25vZGVfbW9kdWxlcy9AYW5ndWxhci9tYXRlcmlhbC9wcmVidWlsdC10aGVtZXMvJHt0aGVtZX0uY3NzYDtcblxuICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ2J1aWxkJywgaG9zdCwgdGhlbWVQYXRoLCB3b3Jrc3BhY2UpO1xuICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ3Rlc3QnLCBob3N0LCB0aGVtZVBhdGgsIHdvcmtzcGFjZSk7XG59XG5cbi8qKiBBZGRzIGEgdGhlbWluZyBzdHlsZSBlbnRyeSB0byB0aGUgZ2l2ZW4gcHJvamVjdCB0YXJnZXQgb3B0aW9ucy4gKi9cbmZ1bmN0aW9uIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0LCB0YXJnZXROYW1lOiAndGVzdCcgfCAnYnVpbGQnLCBob3N0OiBUcmVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0UGF0aDogc3RyaW5nLCB3b3Jrc3BhY2U6IFdvcmtzcGFjZVNjaGVtYSkge1xuICAvLyBEbyBub3QgdXBkYXRlIHRoZSBidWlsZGVyIG9wdGlvbnMgaW4gY2FzZSB0aGUgdGFyZ2V0IGRvZXMgbm90IHVzZSB0aGUgZGVmYXVsdCBDTEkgYnVpbGRlci5cbiAgaWYgKCF2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKHByb2plY3QsIHRhcmdldE5hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGdldFByb2plY3RUYXJnZXRPcHRpb25zKHByb2plY3QsIHRhcmdldE5hbWUpO1xuXG4gIGlmICghdGFyZ2V0T3B0aW9ucy5zdHlsZXMpIHtcbiAgICB0YXJnZXRPcHRpb25zLnN0eWxlcyA9IFthc3NldFBhdGhdO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGV4aXN0aW5nU3R5bGVzID0gdGFyZ2V0T3B0aW9ucy5zdHlsZXMubWFwKHMgPT4gdHlwZW9mIHMgPT09ICdzdHJpbmcnID8gcyA6IHMuaW5wdXQpO1xuXG4gICAgZm9yIChsZXQgW2luZGV4LCBzdHlsZVBhdGhdIG9mIGV4aXN0aW5nU3R5bGVzLmVudHJpZXMoKSkge1xuICAgICAgLy8gSWYgdGhlIGdpdmVuIGFzc2V0IGlzIGFscmVhZHkgc3BlY2lmaWVkIGluIHRoZSBzdHlsZXMsIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcuXG4gICAgICBpZiAoc3R5bGVQYXRoID09PSBhc3NldFBhdGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBjYXNlIGEgcHJlYnVpbHQgdGhlbWUgaXMgYWxyZWFkeSBzZXQgdXAsIHdlIGNhbiBzYWZlbHkgcmVwbGFjZSB0aGUgdGhlbWUgd2l0aCB0aGUgbmV3XG4gICAgICAvLyB0aGVtZSBmaWxlLiBJZiBhIGN1c3RvbSB0aGVtZSBpcyBzZXQgdXAsIHdlIGFyZSBub3QgYWJsZSB0byBzYWZlbHkgcmVwbGFjZSB0aGUgY3VzdG9tXG4gICAgICAvLyB0aGVtZSBiZWNhdXNlIHRoZXNlIGZpbGVzIGNhbiBjb250YWluIGN1c3RvbSBzdHlsZXMsIHdoaWxlIHByZWJ1aWx0IHRoZW1lcyBhcmVcbiAgICAgIC8vIGFsd2F5cyBwYWNrYWdlZCBhbmQgY29uc2lkZXJlZCByZXBsYWNlYWJsZS5cbiAgICAgIGlmIChzdHlsZVBhdGguaW5jbHVkZXMoZGVmYXVsdEN1c3RvbVRoZW1lRmlsZW5hbWUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihjaGFsay5yZWQoYENvdWxkIG5vdCBhZGQgdGhlIHNlbGVjdGVkIHRoZW1lIHRvIHRoZSBDTEkgcHJvamVjdCBgICtcbiAgICAgICAgICAgIGBjb25maWd1cmF0aW9uIGJlY2F1c2UgdGhlcmUgaXMgYWxyZWFkeSBhIGN1c3RvbSB0aGVtZSBmaWxlIHJlZmVyZW5jZWQuYCkpO1xuICAgICAgICBjb25zb2xlLndhcm4oY2hhbGsucmVkKFxuICAgICAgICAgICAgYFBsZWFzZSBtYW51YWxseSBhZGQgdGhlIGZvbGxvd2luZyBzdHlsZSBmaWxlIHRvIHlvdXIgY29uZmlndXJhdGlvbjpgKSk7XG4gICAgICAgIGNvbnNvbGUud2FybihjaGFsay55ZWxsb3coYCAgICAke2NoYWxrLmJvbGQoYXNzZXRQYXRoKX1gKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoc3R5bGVQYXRoLmluY2x1ZGVzKHByZWJ1aWx0VGhlbWVQYXRoU2VnbWVudCkpIHtcbiAgICAgICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YXJnZXRPcHRpb25zLnN0eWxlcy51bnNoaWZ0KGFzc2V0UGF0aCk7XG4gIH1cblxuICBob3N0Lm92ZXJ3cml0ZSgnYW5ndWxhci5qc29uJywgSlNPTi5zdHJpbmdpZnkod29ya3NwYWNlLCBudWxsLCAyKSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoYXQgdGhlIHNwZWNpZmllZCBwcm9qZWN0IHRhcmdldCBpcyBjb25maWd1cmVkIHdpdGggdGhlIGRlZmF1bHQgYnVpbGRlcnMgd2hpY2ggYXJlXG4gKiBwcm92aWRlZCBieSB0aGUgQW5ndWxhciBDTEkuIElmIHRoZSBjb25maWd1cmVkIGJ1aWxkZXIgZG9lcyBub3QgbWF0Y2ggdGhlIGRlZmF1bHQgYnVpbGRlcixcbiAqIHRoaXMgZnVuY3Rpb24gY2FuIGVpdGhlciB0aHJvdyBvciBqdXN0IHNob3cgYSB3YXJuaW5nLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIHRhcmdldE5hbWU6ICdidWlsZCcgfCAndGVzdCcpIHtcbiAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBkZWZhdWx0VGFyZ2V0QnVpbGRlcnNbdGFyZ2V0TmFtZV07XG4gIGNvbnN0IHRhcmdldENvbmZpZyA9IHByb2plY3QuYXJjaGl0ZWN0ICYmIHByb2plY3QuYXJjaGl0ZWN0W3RhcmdldE5hbWVdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHByb2plY3QudGFyZ2V0cyAmJiBwcm9qZWN0LnRhcmdldHNbdGFyZ2V0TmFtZV07XG4gIGNvbnN0IGlzRGVmYXVsdEJ1aWxkZXIgPSB0YXJnZXRDb25maWcgJiYgdGFyZ2V0Q29uZmlnWydidWlsZGVyJ10gPT09IGRlZmF1bHRCdWlsZGVyO1xuXG4gIC8vIEJlY2F1c2UgdGhlIGJ1aWxkIHNldHVwIGZvciB0aGUgQW5ndWxhciBDTEkgY2FuIGJlIGN1c3RvbWl6ZWQgYnkgZGV2ZWxvcGVycywgd2UgY2FuJ3Qga25vd1xuICAvLyB3aGVyZSB0byBwdXQgdGhlIHRoZW1lIGZpbGUgaW4gdGhlIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGlmIGN1c3RvbSBidWlsZGVycyBhcmUgYmVpbmdcbiAgLy8gdXNlZC4gSW4gY2FzZSB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkIGZvciB0aGUgXCJidWlsZFwiIHRhcmdldCwgd2UgdGhyb3cgYW4gZXJyb3IgYW5kXG4gIC8vIGV4aXQgYmVjYXVzZSBzZXR0aW5nIHVwIGEgdGhlbWUgaXMgYSBwcmltYXJ5IGdvYWwgb2YgYG5nLWFkZGAuIE90aGVyd2lzZSBpZiBqdXN0IHRoZSBcInRlc3RcIlxuICAvLyBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQsIHdlIHdhcm4gYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHNcbiAgLy8gd2l0aCBNYXRlcmlhbC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNDE3NlxuICBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIgJiYgdGFyZ2V0TmFtZSA9PT0gJ2J1aWxkJykge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgIGBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBjYW5ub3QgYWRkIGEgdGhlbWUgdG8gdGhlIHdvcmtzcGFjZSBgICtcbiAgICAgIGBjb25maWd1cmF0aW9uIGlmIHRoZSBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQuYCk7XG4gIH0gZWxzZSBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIpIHtcbiAgICBjb25zb2xlLndhcm4oYFlvdXIgcHJvamVjdCBpcyBub3QgdXNpbmcgdGhlIGRlZmF1bHQgYnVpbGRlcnMgZm9yIFwiJHt0YXJnZXROYW1lfVwiLiBUaGlzIGAgK1xuICAgICAgYG1lYW5zIHRoYXQgd2UgY2Fubm90IGFkZCB0aGUgY29uZmlndXJlZCB0aGVtZSB0byB0aGUgXCIke3RhcmdldE5hbWV9XCIgdGFyZ2V0LmApO1xuICB9XG5cbiAgcmV0dXJuIGlzRGVmYXVsdEJ1aWxkZXI7XG59XG4iXX0=