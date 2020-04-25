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
        define("@angular/material/schematics/ng-update/index", ["require", "exports", "@angular/cdk/schematics", "@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-gestures-migration", "@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-inheritance", "@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-names", "@angular/material/schematics/ng-update/migrations/misc-checks/misc-imports", "@angular/material/schematics/ng-update/migrations/misc-checks/misc-property-names", "@angular/material/schematics/ng-update/migrations/misc-checks/misc-template", "@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor-migration", "@angular/material/schematics/ng-update/migrations/package-imports-v8/secondary-entry-points-migration", "@angular/material/schematics/ng-update/upgrade-data"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const hammer_gestures_migration_1 = require("@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-gestures-migration");
    const misc_class_inheritance_1 = require("@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-inheritance");
    const misc_class_names_1 = require("@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-names");
    const misc_imports_1 = require("@angular/material/schematics/ng-update/migrations/misc-checks/misc-imports");
    const misc_property_names_1 = require("@angular/material/schematics/ng-update/migrations/misc-checks/misc-property-names");
    const misc_template_1 = require("@angular/material/schematics/ng-update/migrations/misc-checks/misc-template");
    const ripple_speed_factor_migration_1 = require("@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor-migration");
    const secondary_entry_points_migration_1 = require("@angular/material/schematics/ng-update/migrations/package-imports-v8/secondary-entry-points-migration");
    const upgrade_data_1 = require("@angular/material/schematics/ng-update/upgrade-data");
    const materialMigrations = [
        misc_class_inheritance_1.MiscClassInheritanceMigration,
        misc_class_names_1.MiscClassNamesMigration,
        misc_imports_1.MiscImportsMigration,
        misc_property_names_1.MiscPropertyNamesMigration,
        misc_template_1.MiscTemplateMigration,
        ripple_speed_factor_migration_1.RippleSpeedFactorMigration,
        secondary_entry_points_migration_1.SecondaryEntryPointsMigration,
        hammer_gestures_migration_1.HammerGesturesMigration,
    ];
    /** Entry point for the migration schematics with target of Angular Material v6 */
    function updateToV6() {
        return schematics_1.createMigrationSchematicRule(schematics_1.TargetVersion.V6, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
    }
    exports.updateToV6 = updateToV6;
    /** Entry point for the migration schematics with target of Angular Material v7 */
    function updateToV7() {
        return schematics_1.createMigrationSchematicRule(schematics_1.TargetVersion.V7, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
    }
    exports.updateToV7 = updateToV7;
    /** Entry point for the migration schematics with target of Angular Material v8 */
    function updateToV8() {
        return schematics_1.createMigrationSchematicRule(schematics_1.TargetVersion.V8, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
    }
    exports.updateToV8 = updateToV8;
    /** Entry point for the migration schematics with target of Angular Material v9 */
    function updateToV9() {
        return schematics_1.createMigrationSchematicRule(schematics_1.TargetVersion.V9, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFJaUM7SUFDakMsOElBQWtHO0lBQ2xHLGlJQUE4RjtJQUM5RixxSEFBa0Y7SUFDbEYsNkdBQTJFO0lBQzNFLDJIQUF3RjtJQUN4RiwrR0FBNkU7SUFDN0UsbUpBRW9FO0lBQ3BFLDRKQUUwRTtJQUUxRSxzRkFBbUQ7SUFFbkQsTUFBTSxrQkFBa0IsR0FBOEI7UUFDcEQsc0RBQTZCO1FBQzdCLDBDQUF1QjtRQUN2QixtQ0FBb0I7UUFDcEIsZ0RBQTBCO1FBQzFCLHFDQUFxQjtRQUNyQiwwREFBMEI7UUFDMUIsZ0VBQTZCO1FBQzdCLG1EQUF1QjtLQUN4QixDQUFDO0lBRUYsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyx5Q0FBNEIsQ0FDL0IsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLHlDQUE0QixDQUMvQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8seUNBQTRCLENBQy9CLDBCQUFhLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyx5Q0FBNEIsQ0FDL0IsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxpRUFBaUU7SUFDakUsU0FBUyxtQkFBbUIsQ0FBQyxPQUF5QixFQUFFLGFBQTRCLEVBQ3ZELFdBQW9CO1FBQy9DLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhCLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLHdGQUF3RjtnQkFDeEYsNkNBQTZDLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSdWxlLCBTY2hlbWF0aWNDb250ZXh0fSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlLFxuICBOdWxsYWJsZURldmtpdE1pZ3JhdGlvbixcbiAgVGFyZ2V0VmVyc2lvblxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0hhbW1lckdlc3R1cmVzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci1nZXN0dXJlcy1taWdyYXRpb24nO1xuaW1wb3J0IHtNaXNjQ2xhc3NJbmhlcml0YW5jZU1pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UnO1xuaW1wb3J0IHtNaXNjQ2xhc3NOYW1lc01pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtbmFtZXMnO1xuaW1wb3J0IHtNaXNjSW1wb3J0c01pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtaW1wb3J0cyc7XG5pbXBvcnQge01pc2NQcm9wZXJ0eU5hbWVzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1wcm9wZXJ0eS1uYW1lcyc7XG5pbXBvcnQge01pc2NUZW1wbGF0ZU1pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtdGVtcGxhdGUnO1xuaW1wb3J0IHtcbiAgUmlwcGxlU3BlZWRGYWN0b3JNaWdyYXRpb25cbn0gZnJvbSAnLi9taWdyYXRpb25zL21pc2MtcmlwcGxlcy12Ny9yaXBwbGUtc3BlZWQtZmFjdG9yLW1pZ3JhdGlvbic7XG5pbXBvcnQge1xuICBTZWNvbmRhcnlFbnRyeVBvaW50c01pZ3JhdGlvblxufSBmcm9tICcuL21pZ3JhdGlvbnMvcGFja2FnZS1pbXBvcnRzLXY4L3NlY29uZGFyeS1lbnRyeS1wb2ludHMtbWlncmF0aW9uJztcblxuaW1wb3J0IHttYXRlcmlhbFVwZ3JhZGVEYXRhfSBmcm9tICcuL3VwZ3JhZGUtZGF0YSc7XG5cbmNvbnN0IG1hdGVyaWFsTWlncmF0aW9uczogTnVsbGFibGVEZXZraXRNaWdyYXRpb25bXSA9IFtcbiAgTWlzY0NsYXNzSW5oZXJpdGFuY2VNaWdyYXRpb24sXG4gIE1pc2NDbGFzc05hbWVzTWlncmF0aW9uLFxuICBNaXNjSW1wb3J0c01pZ3JhdGlvbixcbiAgTWlzY1Byb3BlcnR5TmFtZXNNaWdyYXRpb24sXG4gIE1pc2NUZW1wbGF0ZU1pZ3JhdGlvbixcbiAgUmlwcGxlU3BlZWRGYWN0b3JNaWdyYXRpb24sXG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzTWlncmF0aW9uLFxuICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbixcbl07XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjYgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y2KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjYsIG1hdGVyaWFsTWlncmF0aW9ucywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjcgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y3KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjcsIG1hdGVyaWFsTWlncmF0aW9ucywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjggKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y4KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjgsIG1hdGVyaWFsTWlncmF0aW9ucywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIG1pZ3JhdGlvbiBzY2hlbWF0aWNzIHdpdGggdGFyZ2V0IG9mIEFuZ3VsYXIgTWF0ZXJpYWwgdjkgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1Y5KCk6IFJ1bGUge1xuICByZXR1cm4gY3JlYXRlTWlncmF0aW9uU2NoZW1hdGljUnVsZShcbiAgICAgIFRhcmdldFZlcnNpb24uVjksIG1hdGVyaWFsTWlncmF0aW9ucywgbWF0ZXJpYWxVcGdyYWRlRGF0YSwgb25NaWdyYXRpb25Db21wbGV0ZSk7XG59XG5cbi8qKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIG1pZ3JhdGlvbiBjb21wbGV0ZWQuICovXG5mdW5jdGlvbiBvbk1pZ3JhdGlvbkNvbXBsZXRlKGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsIHRhcmdldFZlcnNpb246IFRhcmdldFZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ZhaWx1cmVzOiBib29sZWFuKSB7XG4gIGNvbnRleHQubG9nZ2VyLmluZm8oJycpO1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKGAgIOKckyAgVXBkYXRlZCBBbmd1bGFyIE1hdGVyaWFsIHRvICR7dGFyZ2V0VmVyc2lvbn1gKTtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG5cbiAgaWYgKGhhc0ZhaWx1cmVzKSB7XG4gICAgY29udGV4dC5sb2dnZXIud2FybihcbiAgICAgICcgIOKaoCAgU29tZSBpc3N1ZXMgd2VyZSBkZXRlY3RlZCBidXQgY291bGQgbm90IGJlIGZpeGVkIGF1dG9tYXRpY2FsbHkuIFBsZWFzZSBjaGVjayB0aGUgJyArXG4gICAgICAnb3V0cHV0IGFib3ZlIGFuZCBmaXggdGhlc2UgaXNzdWVzIG1hbnVhbGx5LicpO1xuICB9XG59XG4iXX0=