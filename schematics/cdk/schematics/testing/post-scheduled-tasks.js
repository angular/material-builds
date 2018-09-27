"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
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
    const createTaskExecutor = (name) => host.createTaskExecutor(name);
    return rxjs_1.from(tasks).pipe(operators_1.concatMap(scheduler => scheduler.finalize()), operators_1.filter(task => task.configuration.name === taskName), operators_1.concatMap(task => {
        return createTaskExecutor(task.configuration.name)
            .pipe(operators_1.concatMap(executor => executor(task.configuration.options, task.context)));
    }), 
    // Only emit the last emitted value because there can be multiple tasks with the same name.
    // The observable should only emit a value if all tasks completed.
    operators_1.last());
}
exports.runPostScheduledTasks = runPostScheduledTasks;
//# sourceMappingURL=post-scheduled-tasks.js.map