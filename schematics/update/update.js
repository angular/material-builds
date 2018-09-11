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
const project_tsconfig_paths_1 = require("./project-tsconfig-paths");
const tslint_update_1 = require("./tslint-update");
/** Entry point for `ng update` from Angular CLI. */
function createUpdateRule(targetVersion) {
    return (tree, context) => {
        const projectTsConfigPaths = project_tsconfig_paths_1.getProjectTsConfigPaths(tree);
        const tslintFixTasks = [];
        if (!projectTsConfigPaths.length) {
            throw new Error('Could not find any tsconfig file. Please submit an issue on the Angular ' +
                'Material repository that includes the name of your TypeScript configuration.');
        }
        const tslintConfig = tslint_update_1.createTslintConfig(targetVersion);
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