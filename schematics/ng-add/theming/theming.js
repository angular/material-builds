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
    /** Object that maps a CLI target to its default builder name. */
    const defaultTargetBuilders = {
        build: '@angular-devkit/build-angular:browser',
        test: '@angular-devkit/build-angular:karma',
    };
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
                console.warn(chalk_1.yellow(`Cannot create a custom Angular Material theme because
          ${chalk_1.bold(customThemePath)} already exists. Skipping custom theme generation.`));
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
                    console.warn(chalk_1.red(`Could not add the selected theme to the CLI project configuration ` +
                        `because there is already a custom theme file referenced.`));
                    console.warn(chalk_1.red(`Please manually add the following style file to your configuration:`));
                    console.warn(chalk_1.yellow(`    ${chalk_1.bold(assetPath)}`));
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
        const defaultBuilder = defaultTargetBuilders[targetName];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCwrQ0FBK0M7SUFFL0MsMkRBQXFFO0lBQ3JFLHdEQUlpQztJQUNqQywrREFBZ0U7SUFDaEUsK0RBQWdFO0lBQ2hFLGlDQUF3QztJQUN4QywrQkFBMEI7SUFFMUIseUdBQXdEO0lBRXhELDhFQUE4RTtJQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0lBRXJFLG1FQUFtRTtJQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0lBRXZELGlFQUFpRTtJQUNqRSxNQUFNLHFCQUFxQixHQUFHO1FBQzVCLEtBQUssRUFBRSx1Q0FBdUM7UUFDOUMsSUFBSSxFQUFFLHFDQUFxQztLQUM1QyxDQUFDO0lBRUYsMkRBQTJEO0lBQzNELFNBQWdCLG1CQUFtQixDQUFDLE9BQWU7UUFDakQsT0FBTyxVQUFTLElBQVU7WUFDeEIsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxvQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDO1lBRWpELElBQUksU0FBUyxLQUFLLFFBQVEsRUFBRTtnQkFDMUIsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNMLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzFEO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7SUFDSixDQUFDO0lBZEQsa0RBY0M7SUFFRDs7O09BR0c7SUFDSCxTQUFTLGlCQUFpQixDQUFDLE9BQXlCLEVBQUUsV0FBbUIsRUFBRSxJQUFVLEVBQzFELFNBQTBCO1FBRW5ELE1BQU0sVUFBVSxHQUFHLGdDQUFtQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RCxNQUFNLFlBQVksR0FBRyx1Q0FBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyw0Q0FBNEMsV0FBVyxLQUFLO29CQUN4RixpRkFBaUYsQ0FBQyxDQUFDO2FBQ3RGO1lBRUQsa0ZBQWtGO1lBQ2xGLDhEQUE4RDtZQUM5RCxNQUFNLGVBQWUsR0FBRyxnQkFBUyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQztZQUV4RixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxDQUFDO1lBQ2QsWUFBSSxDQUFDLGVBQWUsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzNDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxRSxPQUFPO1NBQ1I7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNoRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTlDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsMkRBQTJEO0lBQzNELFNBQVMsbUJBQW1CLENBQUMsT0FBeUIsRUFBRSxJQUFVLEVBQUUsS0FBYSxFQUNwRCxTQUEwQjtRQUVyRCw0RUFBNEU7UUFDNUUsTUFBTSxTQUFTLEdBQUksb0RBQW9ELEtBQUssTUFBTSxDQUFDO1FBRW5GLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRSxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxTQUFTLHFCQUFxQixDQUFDLE9BQXlCLEVBQUUsVUFBNEIsRUFBRSxJQUFVLEVBQ25FLFNBQWlCLEVBQUUsU0FBMEI7UUFDMUUsNkZBQTZGO1FBQzdGLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFDdEQsT0FBTztTQUNSO1FBRUQsTUFBTSxhQUFhLEdBQUcsb0NBQXVCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRW5FLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3pCLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFGLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3ZELHVGQUF1RjtnQkFDdkYsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO29CQUMzQixPQUFPO2lCQUNSO2dCQUVELDJGQUEyRjtnQkFDM0Ysd0ZBQXdGO2dCQUN4RixpRkFBaUY7Z0JBQ2pGLDhDQUE4QztnQkFDOUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7b0JBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLG9FQUFvRTt3QkFDakYsMERBQTBELENBQUMsQ0FBQyxDQUFDO29CQUNqRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pGLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxDQUFDLE9BQU8sWUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxPQUFPO2lCQUNSO3FCQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO29CQUN2RCxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0Y7WUFFRCxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN6QztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsU0FBUyw0QkFBNEIsQ0FBQyxPQUF5QixFQUFFLFVBQTRCO1FBQzNGLE1BQU0sY0FBYyxHQUFHLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFDbEQsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxjQUFjLENBQUM7UUFFcEYsNkZBQTZGO1FBQzdGLDBGQUEwRjtRQUMxRiwyRkFBMkY7UUFDM0YsOEZBQThGO1FBQzlGLHVGQUF1RjtRQUN2Rix5RUFBeUU7UUFDekUsSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsS0FBSyxPQUFPLEVBQUU7WUFDL0MsTUFBTSxJQUFJLGdDQUFtQixDQUFDLHFEQUFxRDtnQkFDakYsSUFBSSxVQUFVLHlFQUF5RTtnQkFDdkYsZ0RBQWdELENBQUMsQ0FBQztTQUNyRDthQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxVQUFVLFVBQVU7Z0JBQ3RGLHlEQUF5RCxVQUFVLFdBQVcsQ0FBQyxDQUFDO1NBQ25GO1FBRUQsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3QsIFdvcmtzcGFjZVNjaGVtYX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL2V4cGVyaW1lbnRhbC93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdFN0eWxlRmlsZSxcbiAgZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7SW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7Ym9sZCwgcmVkLCB5ZWxsb3d9IGZyb20gJ2NoYWxrJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIE9iamVjdCB0aGF0IG1hcHMgYSBDTEkgdGFyZ2V0IHRvIGl0cyBkZWZhdWx0IGJ1aWxkZXIgbmFtZS4gKi9cbmNvbnN0IGRlZmF1bHRUYXJnZXRCdWlsZGVycyA9IHtcbiAgYnVpbGQ6ICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjpicm93c2VyJyxcbiAgdGVzdDogJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyOmthcm1hJyxcbn07XG5cbi8qKiBBZGQgcHJlLWJ1aWx0IHN0eWxlcyB0byB0aGUgbWFpbiBwcm9qZWN0IHN0eWxlIGZpbGUuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVGhlbWVUb0FwcFN0eWxlcyhvcHRpb25zOiBTY2hlbWEpOiAoaG9zdDogVHJlZSkgPT4gVHJlZSB7XG4gIHJldHVybiBmdW5jdGlvbihob3N0OiBUcmVlKTogVHJlZSB7XG4gICAgY29uc3Qgd29ya3NwYWNlID0gZ2V0V29ya3NwYWNlKGhvc3QpO1xuICAgIGNvbnN0IHByb2plY3QgPSBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSh3b3Jrc3BhY2UsIG9wdGlvbnMucHJvamVjdCk7XG4gICAgY29uc3QgdGhlbWVOYW1lID0gb3B0aW9ucy50aGVtZSB8fCAnaW5kaWdvLXBpbmsnO1xuXG4gICAgaWYgKHRoZW1lTmFtZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgIGluc2VydEN1c3RvbVRoZW1lKHByb2plY3QsIG9wdGlvbnMucHJvamVjdCwgaG9zdCwgd29ya3NwYWNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zZXJ0UHJlYnVpbHRUaGVtZShwcm9qZWN0LCBob3N0LCB0aGVtZU5hbWUsIHdvcmtzcGFjZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvc3Q7XG4gIH07XG59XG5cbi8qKlxuICogSW5zZXJ0IGEgY3VzdG9tIHRoZW1lIHRvIHByb2plY3Qgc3R5bGUgZmlsZS4gSWYgbm8gdmFsaWQgc3R5bGUgZmlsZSBjb3VsZCBiZSBmb3VuZCwgYSBuZXdcbiAqIFNjc3MgZmlsZSBmb3IgdGhlIGN1c3RvbSB0aGVtZSB3aWxsIGJlIGNyZWF0ZWQuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEN1c3RvbVRoZW1lKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIHByb2plY3ROYW1lOiBzdHJpbmcsIGhvc3Q6IFRyZWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZVNjaGVtYSkge1xuXG4gIGNvbnN0IHN0eWxlc1BhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QsICdzY3NzJyk7XG4gIGNvbnN0IHRoZW1lQ29udGVudCA9IGNyZWF0ZUN1c3RvbVRoZW1lKHByb2plY3ROYW1lKTtcblxuICBpZiAoIXN0eWxlc1BhdGgpIHtcbiAgICBpZiAoIXByb2plY3Quc291cmNlUm9vdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENvdWxkIG5vdCBmaW5kIHNvdXJjZSByb290IGZvciBwcm9qZWN0OiBcIiR7cHJvamVjdE5hbWV9XCIuIGAgK1xuICAgICAgICBgUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBcInNvdXJjZVJvb3RcIiBwcm9wZXJ0eSBpcyBzZXQgaW4gdGhlIHdvcmtzcGFjZSBjb25maWcuYCk7XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoIHRocm91Z2ggdGhlIGRldmtpdCB1dGlsaXRpZXMgYmVjYXVzZSB3ZSB3YW50IHRvIGF2b2lkIGhhdmluZ1xuICAgIC8vIHVubmVjZXNzYXJ5IHBhdGggc2VnbWVudHMgYW5kIHdpbmRvd3MgYmFja3NsYXNoIGRlbGltaXRlcnMuXG4gICAgY29uc3QgY3VzdG9tVGhlbWVQYXRoID0gbm9ybWFsaXplKGpvaW4ocHJvamVjdC5zb3VyY2VSb290LCBkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKGN1c3RvbVRoZW1lUGF0aCkpIHtcbiAgICAgIGNvbnNvbGUud2Fybih5ZWxsb3coYENhbm5vdCBjcmVhdGUgYSBjdXN0b20gQW5ndWxhciBNYXRlcmlhbCB0aGVtZSBiZWNhdXNlXG4gICAgICAgICAgJHtib2xkKGN1c3RvbVRoZW1lUGF0aCl9IGFscmVhZHkgZXhpc3RzLiBTa2lwcGluZyBjdXN0b20gdGhlbWUgZ2VuZXJhdGlvbi5gKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaG9zdC5jcmVhdGUoY3VzdG9tVGhlbWVQYXRoLCB0aGVtZUNvbnRlbnQpO1xuICAgIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAnYnVpbGQnLCBob3N0LCBjdXN0b21UaGVtZVBhdGgsIHdvcmtzcGFjZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0aW9uID0gbmV3IEluc2VydENoYW5nZShzdHlsZXNQYXRoLCAwLCB0aGVtZUNvbnRlbnQpO1xuICBjb25zdCByZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUoc3R5bGVzUGF0aCk7XG5cbiAgcmVjb3JkZXIuaW5zZXJ0TGVmdChpbnNlcnRpb24ucG9zLCBpbnNlcnRpb24udG9BZGQpO1xuICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG59XG5cbi8qKiBJbnNlcnQgYSBwcmUtYnVpbHQgdGhlbWUgaW50byB0aGUgYW5ndWxhci5qc29uIGZpbGUuICovXG5mdW5jdGlvbiBpbnNlcnRQcmVidWlsdFRoZW1lKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIGhvc3Q6IFRyZWUsIHRoZW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtzcGFjZTogV29ya3NwYWNlU2NoZW1hKSB7XG5cbiAgLy8gUGF0aCBuZWVkcyB0byBiZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlIGBwYWNrYWdlLmpzb25gIG9yIHdvcmtzcGFjZSByb290LlxuICBjb25zdCB0aGVtZVBhdGggPSAgYC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcy8ke3RoZW1lfS5jc3NgO1xuXG4gIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAnYnVpbGQnLCBob3N0LCB0aGVtZVBhdGgsIHdvcmtzcGFjZSk7XG4gIGFkZFRoZW1lU3R5bGVUb1RhcmdldChwcm9qZWN0LCAndGVzdCcsIGhvc3QsIHRoZW1lUGF0aCwgd29ya3NwYWNlKTtcbn1cblxuLyoqIEFkZHMgYSB0aGVtaW5nIHN0eWxlIGVudHJ5IHRvIHRoZSBnaXZlbiBwcm9qZWN0IHRhcmdldCBvcHRpb25zLiAqL1xuZnVuY3Rpb24gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIHRhcmdldE5hbWU6ICd0ZXN0JyB8ICdidWlsZCcsIGhvc3Q6IFRyZWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRQYXRoOiBzdHJpbmcsIHdvcmtzcGFjZTogV29ya3NwYWNlU2NoZW1hKSB7XG4gIC8vIERvIG5vdCB1cGRhdGUgdGhlIGJ1aWxkZXIgb3B0aW9ucyBpbiBjYXNlIHRoZSB0YXJnZXQgZG9lcyBub3QgdXNlIHRoZSBkZWZhdWx0IENMSSBidWlsZGVyLlxuICBpZiAoIXZhbGlkYXRlRGVmYXVsdFRhcmdldEJ1aWxkZXIocHJvamVjdCwgdGFyZ2V0TmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB0YXJnZXRPcHRpb25zID0gZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMocHJvamVjdCwgdGFyZ2V0TmFtZSk7XG5cbiAgaWYgKCF0YXJnZXRPcHRpb25zLnN0eWxlcykge1xuICAgIHRhcmdldE9wdGlvbnMuc3R5bGVzID0gW2Fzc2V0UGF0aF07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZXhpc3RpbmdTdHlsZXMgPSB0YXJnZXRPcHRpb25zLnN0eWxlcy5tYXAocyA9PiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgPyBzIDogcy5pbnB1dCk7XG5cbiAgICBmb3IgKGxldCBbaW5kZXgsIHN0eWxlUGF0aF0gb2YgZXhpc3RpbmdTdHlsZXMuZW50cmllcygpKSB7XG4gICAgICAvLyBJZiB0aGUgZ2l2ZW4gYXNzZXQgaXMgYWxyZWFkeSBzcGVjaWZpZWQgaW4gdGhlIHN0eWxlcywgd2UgZG9uJ3QgbmVlZCB0byBkbyBhbnl0aGluZy5cbiAgICAgIGlmIChzdHlsZVBhdGggPT09IGFzc2V0UGF0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGNhc2UgYSBwcmVidWlsdCB0aGVtZSBpcyBhbHJlYWR5IHNldCB1cCwgd2UgY2FuIHNhZmVseSByZXBsYWNlIHRoZSB0aGVtZSB3aXRoIHRoZSBuZXdcbiAgICAgIC8vIHRoZW1lIGZpbGUuIElmIGEgY3VzdG9tIHRoZW1lIGlzIHNldCB1cCwgd2UgYXJlIG5vdCBhYmxlIHRvIHNhZmVseSByZXBsYWNlIHRoZSBjdXN0b21cbiAgICAgIC8vIHRoZW1lIGJlY2F1c2UgdGhlc2UgZmlsZXMgY2FuIGNvbnRhaW4gY3VzdG9tIHN0eWxlcywgd2hpbGUgcHJlYnVpbHQgdGhlbWVzIGFyZVxuICAgICAgLy8gYWx3YXlzIHBhY2thZ2VkIGFuZCBjb25zaWRlcmVkIHJlcGxhY2VhYmxlLlxuICAgICAgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKHJlZChgQ291bGQgbm90IGFkZCB0aGUgc2VsZWN0ZWQgdGhlbWUgdG8gdGhlIENMSSBwcm9qZWN0IGNvbmZpZ3VyYXRpb24gYCArXG4gICAgICAgICAgICBgYmVjYXVzZSB0aGVyZSBpcyBhbHJlYWR5IGEgY3VzdG9tIHRoZW1lIGZpbGUgcmVmZXJlbmNlZC5gKSk7XG4gICAgICAgIGNvbnNvbGUud2FybihyZWQoYFBsZWFzZSBtYW51YWxseSBhZGQgdGhlIGZvbGxvd2luZyBzdHlsZSBmaWxlIHRvIHlvdXIgY29uZmlndXJhdGlvbjpgKSk7XG4gICAgICAgIGNvbnNvbGUud2Fybih5ZWxsb3coYCAgICAke2JvbGQoYXNzZXRQYXRoKX1gKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoc3R5bGVQYXRoLmluY2x1ZGVzKHByZWJ1aWx0VGhlbWVQYXRoU2VnbWVudCkpIHtcbiAgICAgICAgdGFyZ2V0T3B0aW9ucy5zdHlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YXJnZXRPcHRpb25zLnN0eWxlcy51bnNoaWZ0KGFzc2V0UGF0aCk7XG4gIH1cblxuICBob3N0Lm92ZXJ3cml0ZSgnYW5ndWxhci5qc29uJywgSlNPTi5zdHJpbmdpZnkod29ya3NwYWNlLCBudWxsLCAyKSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoYXQgdGhlIHNwZWNpZmllZCBwcm9qZWN0IHRhcmdldCBpcyBjb25maWd1cmVkIHdpdGggdGhlIGRlZmF1bHQgYnVpbGRlcnMgd2hpY2ggYXJlXG4gKiBwcm92aWRlZCBieSB0aGUgQW5ndWxhciBDTEkuIElmIHRoZSBjb25maWd1cmVkIGJ1aWxkZXIgZG9lcyBub3QgbWF0Y2ggdGhlIGRlZmF1bHQgYnVpbGRlcixcbiAqIHRoaXMgZnVuY3Rpb24gY2FuIGVpdGhlciB0aHJvdyBvciBqdXN0IHNob3cgYSB3YXJuaW5nLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZURlZmF1bHRUYXJnZXRCdWlsZGVyKHByb2plY3Q6IFdvcmtzcGFjZVByb2plY3QsIHRhcmdldE5hbWU6ICdidWlsZCcgfCAndGVzdCcpIHtcbiAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBkZWZhdWx0VGFyZ2V0QnVpbGRlcnNbdGFyZ2V0TmFtZV07XG4gIGNvbnN0IHRhcmdldENvbmZpZyA9IHByb2plY3QuYXJjaGl0ZWN0ICYmIHByb2plY3QuYXJjaGl0ZWN0W3RhcmdldE5hbWVdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIHByb2plY3QudGFyZ2V0cyAmJiBwcm9qZWN0LnRhcmdldHNbdGFyZ2V0TmFtZV07XG4gIGNvbnN0IGlzRGVmYXVsdEJ1aWxkZXIgPSB0YXJnZXRDb25maWcgJiYgdGFyZ2V0Q29uZmlnWydidWlsZGVyJ10gPT09IGRlZmF1bHRCdWlsZGVyO1xuXG4gIC8vIEJlY2F1c2UgdGhlIGJ1aWxkIHNldHVwIGZvciB0aGUgQW5ndWxhciBDTEkgY2FuIGJlIGN1c3RvbWl6ZWQgYnkgZGV2ZWxvcGVycywgd2UgY2FuJ3Qga25vd1xuICAvLyB3aGVyZSB0byBwdXQgdGhlIHRoZW1lIGZpbGUgaW4gdGhlIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGlmIGN1c3RvbSBidWlsZGVycyBhcmUgYmVpbmdcbiAgLy8gdXNlZC4gSW4gY2FzZSB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkIGZvciB0aGUgXCJidWlsZFwiIHRhcmdldCwgd2UgdGhyb3cgYW4gZXJyb3IgYW5kXG4gIC8vIGV4aXQgYmVjYXVzZSBzZXR0aW5nIHVwIGEgdGhlbWUgaXMgYSBwcmltYXJ5IGdvYWwgb2YgYG5nLWFkZGAuIE90aGVyd2lzZSBpZiBqdXN0IHRoZSBcInRlc3RcIlxuICAvLyBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQsIHdlIHdhcm4gYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHNcbiAgLy8gd2l0aCBNYXRlcmlhbC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNDE3NlxuICBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIgJiYgdGFyZ2V0TmFtZSA9PT0gJ2J1aWxkJykge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgIGBcIiR7dGFyZ2V0TmFtZX1cIi4gVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgc2NoZW1hdGljcyBjYW5ub3QgYWRkIGEgdGhlbWUgdG8gdGhlIHdvcmtzcGFjZSBgICtcbiAgICAgIGBjb25maWd1cmF0aW9uIGlmIHRoZSBidWlsZGVyIGhhcyBiZWVuIGNoYW5nZWQuYCk7XG4gIH0gZWxzZSBpZiAoIWlzRGVmYXVsdEJ1aWxkZXIpIHtcbiAgICBjb25zb2xlLndhcm4oYFlvdXIgcHJvamVjdCBpcyBub3QgdXNpbmcgdGhlIGRlZmF1bHQgYnVpbGRlcnMgZm9yIFwiJHt0YXJnZXROYW1lfVwiLiBUaGlzIGAgK1xuICAgICAgYG1lYW5zIHRoYXQgd2UgY2Fubm90IGFkZCB0aGUgY29uZmlndXJlZCB0aGVtZSB0byB0aGUgXCIke3RhcmdldE5hbWV9XCIgdGFyZ2V0LmApO1xuICB9XG5cbiAgcmV0dXJuIGlzRGVmYXVsdEJ1aWxkZXI7XG59XG4iXX0=