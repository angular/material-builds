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
        define("@angular/material/schematics/ng-update/index", ["require", "exports", "@angular/cdk/schematics", "chalk", "@angular/material/schematics/ng-update/upgrade-data", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-inheritance-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-imports-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule", "@angular/material/schematics/ng-update/upgrade-rules/package-imports-v8/secondary-entry-points-rule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const chalk_1 = require("chalk");
    const upgrade_data_1 = require("@angular/material/schematics/ng-update/upgrade-data");
    const misc_class_inheritance_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-inheritance-rule");
    const misc_class_names_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule");
    const misc_imports_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-imports-rule");
    const misc_property_names_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule");
    const misc_template_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule");
    const ripple_speed_factor_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule");
    const secondary_entry_points_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/package-imports-v8/secondary-entry-points-rule");
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
    /** Entry point for the migration schematics with target of Angular Material v9 */
    function updateToV9() {
        return schematics_1.createUpgradeRule(schematics_1.TargetVersion.V9, materialMigrationRules, upgrade_data_1.materialUpgradeData, onMigrationComplete);
    }
    exports.updateToV9 = updateToV9;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFBeUU7SUFDekUsaUNBQTBCO0lBRTFCLHNGQUFtRDtJQUNuRCw4SUFBaUc7SUFDakcsa0lBQXFGO0lBQ3JGLDBIQUE4RTtJQUM5RSx3SUFBMkY7SUFDM0YsNEhBQWdGO0lBQ2hGLDRJQUErRjtJQUMvRixxSkFFd0U7SUFFeEUsTUFBTSxzQkFBc0IsR0FBRztRQUM3QixzREFBd0I7UUFDeEIsMENBQWtCO1FBQ2xCLG1DQUFlO1FBQ2YsZ0RBQXFCO1FBQ3JCLHFDQUFnQjtRQUNoQixnREFBcUI7UUFDckIsc0RBQXdCO0tBQ3pCLENBQUM7SUFFRixrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8sOEJBQWlCLENBQ3BCLDBCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyw4QkFBaUIsQ0FDcEIsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGlFQUFpRTtJQUNqRSxTQUFTLG1CQUFtQixDQUFDLGFBQTRCLEVBQUUsV0FBb0I7UUFDN0UsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWQsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQ3RCLHdGQUF3RjtnQkFDeEYsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Y3JlYXRlVXBncmFkZVJ1bGUsIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmltcG9ydCB7bWF0ZXJpYWxVcGdyYWRlRGF0YX0gZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuaW1wb3J0IHtNaXNjQ2xhc3NJbmhlcml0YW5jZVJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWNsYXNzLWluaGVyaXRhbmNlLXJ1bGUnO1xuaW1wb3J0IHtNaXNjQ2xhc3NOYW1lc1J1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWNsYXNzLW5hbWVzLXJ1bGUnO1xuaW1wb3J0IHtNaXNjSW1wb3J0c1J1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWltcG9ydHMtcnVsZSc7XG5pbXBvcnQge01pc2NQcm9wZXJ0eU5hbWVzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtcHJvcGVydHktbmFtZXMtcnVsZSc7XG5pbXBvcnQge01pc2NUZW1wbGF0ZVJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLXRlbXBsYXRlLXJ1bGUnO1xuaW1wb3J0IHtSaXBwbGVTcGVlZEZhY3RvclJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLXJpcHBsZXMtdjcvcmlwcGxlLXNwZWVkLWZhY3Rvci1ydWxlJztcbmltcG9ydCB7XG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzUnVsZVxufSBmcm9tICcuL3VwZ3JhZGUtcnVsZXMvcGFja2FnZS1pbXBvcnRzLXY4L3NlY29uZGFyeS1lbnRyeS1wb2ludHMtcnVsZSc7XG5cbmNvbnN0IG1hdGVyaWFsTWlncmF0aW9uUnVsZXMgPSBbXG4gIE1pc2NDbGFzc0luaGVyaXRhbmNlUnVsZSxcbiAgTWlzY0NsYXNzTmFtZXNSdWxlLFxuICBNaXNjSW1wb3J0c1J1bGUsXG4gIE1pc2NQcm9wZXJ0eU5hbWVzUnVsZSxcbiAgTWlzY1RlbXBsYXRlUnVsZSxcbiAgUmlwcGxlU3BlZWRGYWN0b3JSdWxlLFxuICBTZWNvbmRhcnlFbnRyeVBvaW50c1J1bGUsXG5dO1xuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY2ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WNigpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZVVwZ3JhZGVSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WNiwgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjcgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y3KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY3LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2OCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjgoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVVcGdyYWRlUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjgsIG1hdGVyaWFsTWlncmF0aW9uUnVsZXMsIG1hdGVyaWFsVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY5ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOSgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZVVwZ3JhZGVSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WOSwgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIG1pZ3JhdGlvbiBjb21wbGV0ZWQuICovXG5mdW5jdGlvbiBvbk1pZ3JhdGlvbkNvbXBsZXRlKHRhcmdldFZlcnNpb246IFRhcmdldFZlcnNpb24sIGhhc0ZhaWx1cmVzOiBib29sZWFuKSB7XG4gIGNvbnNvbGUubG9nKCk7XG4gIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKGAgIOKckyAgVXBkYXRlZCBBbmd1bGFyIE1hdGVyaWFsIHRvICR7dGFyZ2V0VmVyc2lvbn1gKSk7XG4gIGNvbnNvbGUubG9nKCk7XG5cbiAgaWYgKGhhc0ZhaWx1cmVzKSB7XG4gICAgY29uc29sZS5sb2coY2hhbGsueWVsbG93KFxuICAgICAgJyAg4pqgICBTb21lIGlzc3VlcyB3ZXJlIGRldGVjdGVkIGJ1dCBjb3VsZCBub3QgYmUgZml4ZWQgYXV0b21hdGljYWxseS4gUGxlYXNlIGNoZWNrIHRoZSAnICtcbiAgICAgICdvdXRwdXQgYWJvdmUgYW5kIGZpeCB0aGVzZSBpc3N1ZXMgbWFudWFsbHkuJykpO1xuICB9XG59XG4iXX0=