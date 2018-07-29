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
/** Path to the test collection file for the Material schematics */
exports.collectionPath = path_1.join(__dirname, '..', 'test-collection.json');
/** Path to the test migration file for the Material update schematics */
exports.migrationCollection = path_1.join(__dirname, '..', 'test-migration.json');
/**
 * Create a base app used for testing.
 */
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
//# sourceMappingURL=testing.js.map