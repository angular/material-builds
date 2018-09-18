"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const glob_1 = require("glob");
const project_tsconfig_paths_1 = require("./project-tsconfig-paths");
const tslint_config_1 = require("./tslint-config");
/** Entry point for `ng update` from Angular CLI. */
function createUpdateRule(targetVersion) {
    return (tree, context) => {
        const projectTsConfigPaths = project_tsconfig_paths_1.getProjectTsConfigPaths(tree);
        const tslintFixTasks = [];
        if (!projectTsConfigPaths.length) {
            throw new Error('Could not find any tsconfig file. Please submit an issue on the Angular ' +
                'Material repository that includes the name of your TypeScript configuration.');
        }
        // In some applications, developers will have global stylesheets which are not specified in any
        // Angular component. Therefore we glob up all CSS and SCSS files outside of node_modules and
        // dist. The files will be read by the individual stylesheet rules and checked.
        const extraStyleFiles = glob_1.sync('!(node_modules|dist)/**/*.+(css|scss)', { absolute: true });
        const tslintConfig = tslint_config_1.createTslintConfig(targetVersion, extraStyleFiles);
        for (const tsconfig of projectTsConfigPaths) {
            // Run the update tslint rules.
            tslintFixTasks.push(context.addTask(new tasks_1.TslintFixTask(tslintConfig, {
                silent: false,
                ignoreErrors: true,
                tsConfigPath: tsconfig,
            })));
        }
        // Delete the temporary schematics directory.
        context.addTask(new tasks_1.RunSchematicTask('ng-post-update', {}), tslintFixTasks);
    };
}
exports.createUpdateRule = createUpdateRule;
//# sourceMappingURL=update.js.map