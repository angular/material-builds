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
        define("@angular/material/schematics/ng-update/index", ["require", "exports", "@angular/cdk/schematics", "@angular/material/schematics/ng-update/upgrade-data", "@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/hammer-gestures-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-inheritance-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-imports-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule", "@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule", "@angular/material/schematics/ng-update/upgrade-rules/package-imports-v8/secondary-entry-points-rule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
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
    function onMigrationComplete(context, targetVersion, hasFailures) {
        context.logger.info('');
        context.logger.info(`  ✓  Updated Angular Material to ${targetVersion}`);
        context.logger.info('');
        if (hasFailures) {
            context.logger.warn('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
                'output above and fix these issues manually.');
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFBeUU7SUFFekUsc0ZBQW1EO0lBQ25ELHVJQUEyRjtJQUMzRiw4SUFBaUc7SUFDakcsa0lBQXFGO0lBQ3JGLDBIQUE4RTtJQUM5RSx3SUFBMkY7SUFDM0YsNEhBQWdGO0lBQ2hGLDRJQUErRjtJQUMvRixxSkFFd0U7SUFFeEUsTUFBTSxzQkFBc0IsR0FBRztRQUM3QixzREFBd0I7UUFDeEIsMENBQWtCO1FBQ2xCLG1DQUFlO1FBQ2YsZ0RBQXFCO1FBQ3JCLHFDQUFnQjtRQUNoQixnREFBcUI7UUFDckIsc0RBQXdCO1FBQ3hCLHlDQUFrQjtLQUNuQixDQUFDO0lBRUYsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyw4QkFBaUIsQ0FDcEIsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLDhCQUFpQixDQUNwQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8sOEJBQWlCLENBQ3BCLDBCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyw4QkFBaUIsQ0FDcEIsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxpRUFBaUU7SUFDakUsU0FBUyxtQkFBbUIsQ0FBQyxPQUF5QixFQUFFLGFBQTRCLEVBQ3ZELFdBQW9CO1FBQy9DLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhCLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLHdGQUF3RjtnQkFDeEYsNkNBQTZDLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSdWxlLCBTY2hlbWF0aWNDb250ZXh0fSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge2NyZWF0ZVVwZ3JhZGVSdWxlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbmltcG9ydCB7bWF0ZXJpYWxVcGdyYWRlRGF0YX0gZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuaW1wb3J0IHtIYW1tZXJHZXN0dXJlc1J1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLXJ1bGUnO1xuaW1wb3J0IHtNaXNjQ2xhc3NJbmhlcml0YW5jZVJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWNsYXNzLWluaGVyaXRhbmNlLXJ1bGUnO1xuaW1wb3J0IHtNaXNjQ2xhc3NOYW1lc1J1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWNsYXNzLW5hbWVzLXJ1bGUnO1xuaW1wb3J0IHtNaXNjSW1wb3J0c1J1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWltcG9ydHMtcnVsZSc7XG5pbXBvcnQge01pc2NQcm9wZXJ0eU5hbWVzUnVsZX0gZnJvbSAnLi91cGdyYWRlLXJ1bGVzL21pc2MtY2hlY2tzL21pc2MtcHJvcGVydHktbmFtZXMtcnVsZSc7XG5pbXBvcnQge01pc2NUZW1wbGF0ZVJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLXRlbXBsYXRlLXJ1bGUnO1xuaW1wb3J0IHtSaXBwbGVTcGVlZEZhY3RvclJ1bGV9IGZyb20gJy4vdXBncmFkZS1ydWxlcy9taXNjLXJpcHBsZXMtdjcvcmlwcGxlLXNwZWVkLWZhY3Rvci1ydWxlJztcbmltcG9ydCB7XG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzUnVsZVxufSBmcm9tICcuL3VwZ3JhZGUtcnVsZXMvcGFja2FnZS1pbXBvcnRzLXY4L3NlY29uZGFyeS1lbnRyeS1wb2ludHMtcnVsZSc7XG5cbmNvbnN0IG1hdGVyaWFsTWlncmF0aW9uUnVsZXMgPSBbXG4gIE1pc2NDbGFzc0luaGVyaXRhbmNlUnVsZSxcbiAgTWlzY0NsYXNzTmFtZXNSdWxlLFxuICBNaXNjSW1wb3J0c1J1bGUsXG4gIE1pc2NQcm9wZXJ0eU5hbWVzUnVsZSxcbiAgTWlzY1RlbXBsYXRlUnVsZSxcbiAgUmlwcGxlU3BlZWRGYWN0b3JSdWxlLFxuICBTZWNvbmRhcnlFbnRyeVBvaW50c1J1bGUsXG4gIEhhbW1lckdlc3R1cmVzUnVsZSxcbl07XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjYgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y2KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY2LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2NyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjcoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVVcGdyYWRlUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjcsIG1hdGVyaWFsTWlncmF0aW9uUnVsZXMsIG1hdGVyaWFsVXBncmFkZURhdGEsIG9uTWlncmF0aW9uQ29tcGxldGUpO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIE1hdGVyaWFsIHY4ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVG9WOCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZVVwZ3JhZGVSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WOCwgbWF0ZXJpYWxNaWdyYXRpb25SdWxlcywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjkgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y5KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlVXBncmFkZVJ1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlY5LCBtYXRlcmlhbE1pZ3JhdGlvblJ1bGVzLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgbWlncmF0aW9uIGNvbXBsZXRlZC4gKi9cbmZ1bmN0aW9uIG9uTWlncmF0aW9uQ29tcGxldGUoY29udGV4dDogU2NoZW1hdGljQ29udGV4dCwgdGFyZ2V0VmVyc2lvbjogVGFyZ2V0VmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzRmFpbHVyZXM6IGJvb2xlYW4pIHtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG4gIGNvbnRleHQubG9nZ2VyLmluZm8oYCAg4pyTICBVcGRhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgdG8gJHt0YXJnZXRWZXJzaW9ufWApO1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKCcnKTtcblxuICBpZiAoaGFzRmFpbHVyZXMpIHtcbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgJyAg4pqgICBTb21lIGlzc3VlcyB3ZXJlIGRldGVjdGVkIGJ1dCBjb3VsZCBub3QgYmUgZml4ZWQgYXV0b21hdGljYWxseS4gUGxlYXNlIGNoZWNrIHRoZSAnICtcbiAgICAgICdvdXRwdXQgYWJvdmUgYW5kIGZpeCB0aGVzZSBpc3N1ZXMgbWFudWFsbHkuJyk7XG4gIH1cbn1cbiJdfQ==