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
        define("@angular/material/schematics/ng-update/index", ["require", "exports", "@angular/cdk/schematics", "chalk", "@angular/material/schematics/ng-update/upgrade-data", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-inheritance-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-imports-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule", "@angular/material/schematics/ng-update/upgrade-rules/package-imports-v8/secondary-entry-points-rule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const chalk_1 = require("chalk");
    const upgrade_data_1 = require("@angular/material/schematics/ng-update/upgrade-data");
    const hammer_gestures_rule_1 = require("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule");
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
        hammer_gestures_rule_1.HammerGesturesRule,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFBeUU7SUFDekUsaUNBQTBCO0lBRTFCLHNGQUFtRDtJQUNuRCx1SUFBMkY7SUFDM0YsOElBQWlHO0lBQ2pHLGtJQUFxRjtJQUNyRiwwSEFBOEU7SUFDOUUsd0lBQTJGO0lBQzNGLDRIQUFnRjtJQUNoRiw0SUFBK0Y7SUFDL0YscUpBRXdFO0lBRXhFLE1BQU0sc0JBQXNCLEdBQUc7UUFDN0Isc0RBQXdCO1FBQ3hCLDBDQUFrQjtRQUNsQixtQ0FBZTtRQUNmLGdEQUFxQjtRQUNyQixxQ0FBZ0I7UUFDaEIsZ0RBQXFCO1FBQ3JCLHNEQUF3QjtRQUN4Qix5Q0FBa0I7S0FDbkIsQ0FBQztJQUVGLGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8sOEJBQWlCLENBQ3BCLDBCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyw4QkFBaUIsQ0FDcEIsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8sOEJBQWlCLENBQ3BCLDBCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUhELGdDQUdDO0lBRUQsaUVBQWlFO0lBQ2pFLFNBQVMsbUJBQW1CLENBQUMsYUFBNEIsRUFBRSxXQUFvQjtRQUM3RSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsb0NBQW9DLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxJQUFJLFdBQVcsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FDdEIsd0ZBQXdGO2dCQUN4Riw2Q0FBNkMsQ0FBQyxDQUFDLENBQUM7U0FDbkQ7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtjcmVhdGVVcGdyYWRlUnVsZSwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcblxuaW1wb3J0IHttYXRlcmlhbFVwZ3JhZGVEYXRhfSBmcm9tICcuL3VwZ3JhZGUtZGF0YSc7XG5pbXBvcnQge0hhbW1lckdlc3R1cmVzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtcnVsZSc7XG5pbXBvcnQge01pc2NDbGFzc0luaGVyaXRhbmNlUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UtcnVsZSc7XG5pbXBvcnQge01pc2NDbGFzc05hbWVzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtbmFtZXMtcnVsZSc7XG5pbXBvcnQge01pc2NJbXBvcnRzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtaW1wb3J0cy1ydWxlJztcbmltcG9ydCB7TWlzY1Byb3BlcnR5TmFtZXNSdWxlfSBmcm9tICcuL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy1wcm9wZXJ0eS1uYW1lcy1ydWxlJztcbmltcG9ydCB7TWlzY1RlbXBsYXRlUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtdGVtcGxhdGUtcnVsZSc7XG5pbXBvcnQge1JpcHBsZVNwZWVkRmFjdG9yUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtcmlwcGxlcy12Ny9yaXBwbGUtc3BlZWQtZmFjdG9yLXJ1bGUnO1xuaW1wb3J0IHtcbiAgU2Vjb25kYXJ5RW50cnlQb2ludHNSdWxlXG59IGZyb20gJy4vdXBncmFkZS1ydWxlcy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1ydWxlJztcblxuY29uc3QgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcyA9IFtcbiAgTWlzY0NsYXNzSW5oZXJpdGFuY2VSdWxlLFxuICBNaXNjQ2xhc3NOYW1lc1J1bGUsXG4gIE1pc2NJbXBvcnRzUnVsZSxcbiAgTWlzY1Byb3BlcnR5TmFtZXNSdWxlLFxuICBNaXNjVGVtcGxhdGVSdWxlLFxuICBSaXBwbGVTcGVlZEZhY3RvclJ1bGUsXG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzUnVsZSxcbiAgSGFtbWVyR2VzdHVyZXNSdWxlLFxuXTtcblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2NiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjYoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVVcGdyYWRlUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjYsIG1hdGVyaWFsTWlncmF0aW9uUnVsZXMsIG1hdGVyaWFsVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY3ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WNygpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZVVwZ3JhZGVSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WNywgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjggKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y4KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY4LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2OSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjkoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVVcGdyYWRlUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjksIG1hdGVyaWFsTWlncmF0aW9uUnVsZXMsIG1hdGVyaWFsVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBtaWdyYXRpb24gY29tcGxldGVkLiAqL1xuZnVuY3Rpb24gb25NaWdyYXRpb25Db21wbGV0ZSh0YXJnZXRWZXJzaW9uOiBUYXJnZXRWZXJzaW9uLCBoYXNGYWlsdXJlczogYm9vbGVhbikge1xuICBjb25zb2xlLmxvZygpO1xuICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihgICDinJMgIFVwZGF0ZWQgQW5ndWxhciBNYXRlcmlhbCB0byAke3RhcmdldFZlcnNpb259YCkpO1xuICBjb25zb2xlLmxvZygpO1xuXG4gIGlmIChoYXNGYWlsdXJlcykge1xuICAgIGNvbnNvbGUubG9nKGNoYWxrLnllbGxvdyhcbiAgICAgICcgIOKaoCAgU29tZSBpc3N1ZXMgd2VyZSBkZXRlY3RlZCBidXQgY291bGQgbm90IGJlIGZpeGVkIGF1dG9tYXRpY2FsbHkuIFBsZWFzZSBjaGVjayB0aGUgJyArXG4gICAgICAnb3V0cHV0IGFib3ZlIGFuZCBmaXggdGhlc2UgaXNzdWVzIG1hbnVhbGx5LicpKTtcbiAgfVxufVxuIl19