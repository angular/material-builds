"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Create a base app used for testing. */
function createTestApp(runner, appOptions = {}) {
    const workspaceTree = runner.runExternalSchematic('@schematics/angular', 'workspace', {
        name: 'workspace',
        version: '6.0.0',
        newProjectRoot: 'projects',
    });
    return runner.runExternalSchematic('@schematics/angular', 'application', Object.assign({}, appOptions, { name: 'material' }), workspaceTree);
}
exports.createTestApp = createTestApp;
//# sourceMappingURL=test-app.js.map