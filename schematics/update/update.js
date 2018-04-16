"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const path = require("path");
const schematicsSrcPath = 'node_modules/@angular/material/schematics';
const schematicsTmpPath = 'node_modules/_tmp_angular_material_schematics';
/** Entry point for `ng update` from Angular CLI. */
function default_1() {
    return (tree, context) => {
        // Copy the update schematics to a temporary directory.
        const updateSrcs = [];
        tree.getDir(schematicsSrcPath).visit((_, entry) => updateSrcs.push(entry));
        for (let src of updateSrcs) {
            tree.create(src.path.replace(schematicsSrcPath, schematicsTmpPath), src.content);
        }
        // Downgrade @angular/cdk and @angular/material to 5.x. This allows us to use the 5.x type
        // information in the update script.
        const downgradeTask = context.addTask(new tasks_1.NodePackageInstallTask({
            packageName: '@angular/cdk@">=5 <6" @angular/material@">=5 <6"'
        }));
        // Run the update tslint rules.
        const updateTask = context.addTask(new tasks_1.TslintFixTask({
            rulesDirectory: path.join(schematicsTmpPath, 'update/rules'),
            rules: {
                // Automatic fixes.
                "switch-identifiers": true,
                "switch-property-names": true,
                "switch-string-literal-attribute-selectors": true,
                "switch-string-literal-css-names": true,
                "switch-string-literal-element-selectors": true,
                "switch-stylesheet-attribute-selectors": true,
                "switch-stylesheet-css-names": true,
                "switch-stylesheet-element-selectors": true,
                "switch-stylesheet-input-names": true,
                "switch-stylesheet-output-names": true,
                "switch-template-attribute-selectors": true,
                "switch-template-css-names": true,
                "switch-template-element-selectors": true,
                "switch-template-export-as-names": true,
                "switch-template-input-names": true,
                "switch-template-output-names": true,
                // Additional issues we can detect but not automatically fix.
                "check-class-declaration-misc": true,
                "check-identifier-misc": true,
                "check-import-misc": true,
                "check-inheritance": true,
                "check-method-calls": true,
                "check-property-access-misc": true,
                "check-template-misc": true
            }
        }, {
            silent: false,
            ignoreErrors: true,
            tsConfigPath: './src/tsconfig.json',
        }), [downgradeTask]);
        // Upgrade @angular/material back to 6.x.
        const upgradeTask = context.addTask(new tasks_1.NodePackageInstallTask({
            // TODO(mmalerba): Change "next" to ">=6 <7".
            packageName: '@angular/cdk@next @angular/material@next'
        }), [updateTask]);
        // Delete the temporary schematics directory.
        context.addTask(new tasks_1.RunSchematicTask('ng-post-update', {
            deleteFiles: updateSrcs
                .map(entry => entry.path.replace(schematicsSrcPath, schematicsTmpPath))
        }), [upgradeTask]);
    };
}
exports.default = default_1;
/** Post-update schematic to be called when ng update is finished. */
function postUpdate(options) {
    return (tree, context) => {
        for (let file of options.deleteFiles) {
            tree.delete(file);
        }
        context.addTask(new tasks_1.RunSchematicTask('ng-post-post-update', {}));
    };
}
exports.postUpdate = postUpdate;
/** Post-post-update schematic to be called when post-update is finished. */
function postPostUpdate() {
    return () => console.log('\nComplete! Please check the output above for any issues that were detected but could not' +
        ' be automatically fixed.');
}
exports.postPostUpdate = postPostUpdate;
//# sourceMappingURL=update.js.map