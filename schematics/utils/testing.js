"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/schematics/testing");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/** Path to the test collection file for the Material schematics */
exports.collectionPath = path_1.join(__dirname, '..', 'test-collection.json');
/** Path to the test migration file for the Material update schematics */
exports.migrationCollection = path_1.join(__dirname, '..', 'test-migration.json');
/** Create a base app used for testing. */
function createTestApp() {
    const baseRunner = new testing_1.SchematicTestRunner('material-schematics', exports.collectionPath);
    const workspaceTree = baseRunner.runExternalSchematic('@schematics/angular', 'workspace', {
        name: 'workspace',
        version: '6.0.0',
        newProjectRoot: 'projects',
    });
    return baseRunner.runExternalSchematic('@schematics/angular', 'application', {
        name: 'material',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'scss',
        skipTests: false,
    }, workspaceTree);
}
exports.createTestApp = createTestApp;
/**
 * Due to the fact that the Angular devkit does not support running scheduled tasks from a
 * schematic that has been launched through the TestRunner, we need to manually find the task
 * executor for the given task name and run all scheduled instances.
 *
 * Note that this means that there can be multiple tasks with the same name. The observable emits
 * only when all tasks finished executing.
 */
function runPostScheduledTasks(runner, taskName) {
    // Workaround until there is a public API to run scheduled tasks in the @angular-devkit.
    // See: https://github.com/angular/angular-cli/issues/11739
    const host = runner.engine['_host'];
    const tasks = runner.engine['_taskSchedulers'];
    return rxjs_1.from(tasks).pipe(operators_1.concatMap(scheduler => scheduler.finalize()), operators_1.filter(task => task.configuration.name === taskName), operators_1.concatMap(task => {
        return host.createTaskExecutor(task.configuration.name)
            .pipe(operators_1.concatMap(executor => executor(task.configuration.options, task.context)));
    }), 
    // Only emit the last emitted value because there can be multiple tasks with the same name.
    // The observable should only emit a value if all tasks completed.
    operators_1.last());
}
exports.runPostScheduledTasks = runPostScheduledTasks;
//# sourceMappingURL=testing.js.map