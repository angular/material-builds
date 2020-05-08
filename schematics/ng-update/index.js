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
    /** Entry point for the migration schematics with target of Angular Material v10 */
    function updateToV10() {
        return schematics_1.createMigrationSchematicRule(schematics_1.TargetVersion.V10, materialMigrations, upgrade_data_1.materialUpgradeData, onMigrationComplete);
    }
    exports.updateToV10 = updateToV10;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFHSCx3REFJaUM7SUFDakMsOElBQWtHO0lBQ2xHLGlJQUE4RjtJQUM5RixxSEFBa0Y7SUFDbEYsNkdBQTJFO0lBQzNFLDJIQUF3RjtJQUN4RiwrR0FBNkU7SUFDN0UsbUpBRW9FO0lBQ3BFLDRKQUUwRTtJQUUxRSxzRkFBbUQ7SUFFbkQsTUFBTSxrQkFBa0IsR0FBOEI7UUFDcEQsc0RBQTZCO1FBQzdCLDBDQUF1QjtRQUN2QixtQ0FBb0I7UUFDcEIsZ0RBQTBCO1FBQzFCLHFDQUFxQjtRQUNyQiwwREFBMEI7UUFDMUIsZ0VBQTZCO1FBQzdCLG1EQUF1QjtLQUN4QixDQUFDO0lBRUYsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyx5Q0FBNEIsQ0FDL0IsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxrRkFBa0Y7SUFDbEYsU0FBZ0IsVUFBVTtRQUN4QixPQUFPLHlDQUE0QixDQUMvQiwwQkFBYSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFIRCxnQ0FHQztJQUVELGtGQUFrRjtJQUNsRixTQUFnQixVQUFVO1FBQ3hCLE9BQU8seUNBQTRCLENBQy9CLDBCQUFhLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLGtDQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUhELGdDQUdDO0lBRUQsa0ZBQWtGO0lBQ2xGLFNBQWdCLFVBQVU7UUFDeEIsT0FBTyx5Q0FBNEIsQ0FDL0IsMEJBQWEsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsa0NBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBSEQsZ0NBR0M7SUFFRCxtRkFBbUY7SUFDbkYsU0FBZ0IsV0FBVztRQUN6QixPQUFPLHlDQUE0QixDQUMvQiwwQkFBYSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxrQ0FBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFIRCxrQ0FHQztJQUVELGlFQUFpRTtJQUNqRSxTQUFTLG1CQUFtQixDQUFDLE9BQXlCLEVBQUUsYUFBNEIsRUFDdkQsV0FBb0I7UUFDL0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDekUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFeEIsSUFBSSxXQUFXLEVBQUU7WUFDZixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDakIsd0ZBQXdGO2dCQUN4Riw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHR9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUsXG4gIE51bGxhYmxlRGV2a2l0TWlncmF0aW9uLFxuICBUYXJnZXRWZXJzaW9uXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7SGFtbWVyR2VzdHVyZXNNaWdyYXRpb259IGZyb20gJy4vbWlncmF0aW9ucy9oYW1tZXItZ2VzdHVyZXMtdjkvaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbic7XG5pbXBvcnQge01pc2NDbGFzc0luaGVyaXRhbmNlTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1pbmhlcml0YW5jZSc7XG5pbXBvcnQge01pc2NDbGFzc05hbWVzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1uYW1lcyc7XG5pbXBvcnQge01pc2NJbXBvcnRzTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1pbXBvcnRzJztcbmltcG9ydCB7TWlzY1Byb3BlcnR5TmFtZXNNaWdyYXRpb259IGZyb20gJy4vbWlncmF0aW9ucy9taXNjLWNoZWNrcy9taXNjLXByb3BlcnR5LW5hbWVzJztcbmltcG9ydCB7TWlzY1RlbXBsYXRlTWlncmF0aW9ufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy10ZW1wbGF0ZSc7XG5pbXBvcnQge1xuICBSaXBwbGVTcGVlZEZhY3Rvck1pZ3JhdGlvblxufSBmcm9tICcuL21pZ3JhdGlvbnMvbWlzYy1yaXBwbGVzLXY3L3JpcHBsZS1zcGVlZC1mYWN0b3ItbWlncmF0aW9uJztcbmltcG9ydCB7XG4gIFNlY29uZGFyeUVudHJ5UG9pbnRzTWlncmF0aW9uXG59IGZyb20gJy4vbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24nO1xuXG5pbXBvcnQge21hdGVyaWFsVXBncmFkZURhdGF9IGZyb20gJy4vdXBncmFkZS1kYXRhJztcblxuY29uc3QgbWF0ZXJpYWxNaWdyYXRpb25zOiBOdWxsYWJsZURldmtpdE1pZ3JhdGlvbltdID0gW1xuICBNaXNjQ2xhc3NJbmhlcml0YW5jZU1pZ3JhdGlvbixcbiAgTWlzY0NsYXNzTmFtZXNNaWdyYXRpb24sXG4gIE1pc2NJbXBvcnRzTWlncmF0aW9uLFxuICBNaXNjUHJvcGVydHlOYW1lc01pZ3JhdGlvbixcbiAgTWlzY1RlbXBsYXRlTWlncmF0aW9uLFxuICBSaXBwbGVTcGVlZEZhY3Rvck1pZ3JhdGlvbixcbiAgU2Vjb25kYXJ5RW50cnlQb2ludHNNaWdyYXRpb24sXG4gIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uLFxuXTtcblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2NiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjYoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WNiwgbWF0ZXJpYWxNaWdyYXRpb25zLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2NyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjcoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WNywgbWF0ZXJpYWxNaWdyYXRpb25zLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2OCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjgoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WOCwgbWF0ZXJpYWxNaWdyYXRpb25zLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2OSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjkoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgICAgVGFyZ2V0VmVyc2lvbi5WOSwgbWF0ZXJpYWxNaWdyYXRpb25zLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEVudHJ5IHBvaW50IGZvciB0aGUgbWlncmF0aW9uIHNjaGVtYXRpY3Mgd2l0aCB0YXJnZXQgb2YgQW5ndWxhciBNYXRlcmlhbCB2MTAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxMCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgICBUYXJnZXRWZXJzaW9uLlYxMCwgbWF0ZXJpYWxNaWdyYXRpb25zLCBtYXRlcmlhbFVwZ3JhZGVEYXRhLCBvbk1pZ3JhdGlvbkNvbXBsZXRlKTtcbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgbWlncmF0aW9uIGNvbXBsZXRlZC4gKi9cbmZ1bmN0aW9uIG9uTWlncmF0aW9uQ29tcGxldGUoY29udGV4dDogU2NoZW1hdGljQ29udGV4dCwgdGFyZ2V0VmVyc2lvbjogVGFyZ2V0VmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzRmFpbHVyZXM6IGJvb2xlYW4pIHtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG4gIGNvbnRleHQubG9nZ2VyLmluZm8oYCAg4pyTICBVcGRhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgdG8gJHt0YXJnZXRWZXJzaW9ufWApO1xuICBjb250ZXh0LmxvZ2dlci5pbmZvKCcnKTtcblxuICBpZiAoaGFzRmFpbHVyZXMpIHtcbiAgICBjb250ZXh0LmxvZ2dlci53YXJuKFxuICAgICAgJyAg4pqgICBTb21lIGlzc3VlcyB3ZXJlIGRldGVjdGVkIGJ1dCBjb3VsZCBub3QgYmUgZml4ZWQgYXV0b21hdGljYWxseS4gUGxlYXNlIGNoZWNrIHRoZSAnICtcbiAgICAgICdvdXRwdXQgYWJvdmUgYW5kIGZpeCB0aGVzZSBpc3N1ZXMgbWFudWFsbHkuJyk7XG4gIH1cbn1cbiJdfQ==