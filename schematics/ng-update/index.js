"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular/cdk/schematics");
const chalk_1 = require("chalk");
const upgrade_data_1 = require("./upgrade-data");
const misc_class_inheritance_rule_1 = require("./upgrade-rules/misc-checks/misc-class-inheritance-rule");
const misc_class_names_rule_1 = require("./upgrade-rules/misc-checks/misc-class-names-rule");
const misc_imports_rule_1 = require("./upgrade-rules/misc-checks/misc-imports-rule");
const misc_property_names_rule_1 = require("./upgrade-rules/misc-checks/misc-property-names-rule");
const misc_template_rule_1 = require("./upgrade-rules/misc-checks/misc-template-rule");
const ripple_speed_factor_rule_1 = require("./upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule");
const secondary_entry_points_rule_1 = require("./upgrade-rules/package-imports-v8/secondary-entry-points-rule");
const materialMigrationRules = [
    misc_class_inheritance_rule_1.MiscClassInheritanceRule,
    misc_class_names_rule_1.MiscClassNamesRule,
    misc_imports_rule_1.MiscImportsRule,
    misc_property_names_rule_1.MiscPropertyNamesRule,
    misc_template_rule_1.MiscTemplateRule,
    ripple_speed_factor_rule_1.RippleSpeedFactorRule,
    secondary_entry_points_rule_1.SecondaryEntryPointsRule,
];
/** Entry point for the migration schematics with target of Angular Material v6 */
function updateToV6() {
    return schematics_1.createUpgradeRule(schematics_1.TargetVersion.V6, materialMigrationRules, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular Material v7 */
function updateToV7() {
    return schematics_1.createUpgradeRule(schematics_1.TargetVersion.V7, materialMigrationRules, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV7 = updateToV7;
/** Entry point for the migration schematics with target of Angular Material v8 */
function updateToV8() {
    return schematics_1.createUpgradeRule(schematics_1.TargetVersion.V8, materialMigrationRules, upgrade_data_1.materialUpgradeData, onMigrationComplete);
}
exports.updateToV8 = updateToV8;
/** Function that will be called when the migration completed. */
function onMigrationComplete(targetVersion, hasFailures) {
    console.log();
    console.log(chalk_1.default.green(`  ✓  Updated Angular Material to ${targetVersion}`));
    console.log();
    if (hasFailures) {
        console.log(chalk_1.default.yellow('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
            'output above and fix these issues manually.'));
    }
}
//# sourceMappingURL=index.js.map