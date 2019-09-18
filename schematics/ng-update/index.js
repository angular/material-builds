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
        console.log(chalk_1.green(`  ✓  Updated Angular Material to ${targetVersion}`));
        console.log();
        if (hasFailures) {
            console.log(chalk_1.yellow('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
                'output above and fix these issues manually.'));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFBeUU7SUFDekUsaUNBQW9DO0lBRXBDLHNGQUFtRDtJQUNuRCw4SUFBaUc7SUFDakcsa0lBQXFGO0lBQ3JGLDBIQUE4RTtJQUM5RSx3SUFBMkY7SUFDM0YsNEhBQWdGO0lBQ2hGLDRJQUErRjtJQUMvRixxSkFFd0U7SUFFeEUsTUFBTSxzQkFBc0IsR0FBRztRQUM3QixzREFBd0I7UUFDeEIsMENBQWtCO1FBQ2xCLG1DQUFlO1FBQ2YsZ0RBQXFCO1FBQ3JCLHFDQUFnQjtRQUNoQixnREFBcUI7UUFDckIsc0RBQXdCO0tBQ3pCLENBQUM7SUFFRixrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8sOEJBQWlCLENBQ3BCLDBCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyw4QkFBaUIsQ0FDcEIsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGlFQUFpRTtJQUNqRSxTQUFTLG1CQUFtQixDQUFDLGFBQTRCLEVBQUUsV0FBb0I7UUFDN0UsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFLLENBQUMsb0NBQW9DLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFZCxJQUFJLFdBQVcsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUNoQix3RkFBd0Y7Z0JBQ3hGLDZDQUE2QyxDQUFDLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSdWxlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge2NyZWF0ZVVwZ3JhZGVSdWxlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2dyZWVuLCB5ZWxsb3d9IGZyb20gJ2NoYWxrJztcblxuaW1wb3J0IHttYXRlcmlhbFVwZ3JhZGVEYXRhfSBmcm9tICcuL3VwZ3JhZGUtZGF0YSc7XG5pbXBvcnQge01pc2NDbGFzc0luaGVyaXRhbmNlUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UtcnVsZSc7XG5pbXBvcnQge01pc2NDbGFzc05hbWVzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtbmFtZXMtcnVsZSc7XG5pbXBvcnQge01pc2NJbXBvcnRzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtaW1wb3J0cy1ydWxlJztcbmltcG9ydCB7TWlzY1Byb3BlcnR5TmFtZXNSdWxlfSBmcm9tICcuL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy1wcm9wZXJ0eS1uYW1lcy1ydWxlJztcbmltcG9ydCB7TWlzY1RlbXBsYXRlUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtdGVtcGxhdGUtcnVsZSc7XG5pbXBvcnQge1JpcHBsZVNwZWVkRmFjdG9yUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtcmlwcGxlcy12Ny9yaXBwbGUtc3BlZWQtZmFjdG9yLXJ1bGUnO1xuaW1wb3J0IHtcbiAgU2Vjb25kYXJ5RW50cnlQb2ludHNSdWxlXG59IGZyb20gJy4vdXBncmFkZS1ydWxlcy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1ydWxlJztcblxuY29uc3QgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcyA9IFtcbiAgTWlzY0NsYXNzSW5oZXJpdGFuY2VSdWxlLFxuICBNaXNjQ2xhc3NOYW1lc1J1bGUsXG4gIE1pc2NJbXBvcnRzUnVsZSxcbiAgTWlzY1Byb3BlcnR5TmFtZXNSdWxlLFxuICBNaXNjVGVtcGxhdGVSdWxlLFxuICBSaXBwbGVTcGVlZEZhY3RvclJ1bGUsXG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzUnVsZSxcbl07XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjYgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y2KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY2LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2NyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjcoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVVcGdyYWRlUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjcsIG1hdGVyaWFsTWlncmF0aW9uUnVsZXMsIG1hdGVyaWFsVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY4ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZVVwZ3JhZGVSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WOCwgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjkgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y5KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY5LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgbWlncmF0aW9uIGNvbXBsZXRlZC4gKi9cbmZ1bmN0aW9uIG9uTWlncmF0aW9uQ29tcGxldGUodGFyZ2V0VmVyc2lvbjogVGFyZ2V0VmVyc2lvbiwgaGFzRmFpbHVyZXM6IGJvb2xlYW4pIHtcbiAgY29uc29sZS5sb2coKTtcbiAgY29uc29sZS5sb2coZ3JlZW4oYCAg4pyTICBVcGRhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgdG8gJHt0YXJnZXRWZXJzaW9ufWApKTtcbiAgY29uc29sZS5sb2coKTtcblxuICBpZiAoaGFzRmFpbHVyZXMpIHtcbiAgICBjb25zb2xlLmxvZyh5ZWxsb3coXG4gICAgICAnICDimqAgIFNvbWUgaXNzdWVzIHdlcmUgZGV0ZWN0ZWQgYnV0IGNvdWxkIG5vdCBiZSBmaXhlZCBhdXRvbWF0aWNhbGx5LiBQbGVhc2UgY2hlY2sgdGhlICcgK1xuICAgICAgJ291dHB1dCBhYm92ZSBhbmQgZml4IHRoZXNlIGlzc3VlcyBtYW51YWxseS4nKSk7XG4gIH1cbn1cbiJdfQ==