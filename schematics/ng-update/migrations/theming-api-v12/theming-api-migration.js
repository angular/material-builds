"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemingApiMigration = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular/cdk/schematics");
const migration_1 = require("./migration");
/** Migration that switches all Sass files using Material theming APIs to `@use`. */
class ThemingApiMigration extends schematics_1.DevkitMigration {
    constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V12;
    }
    visitStylesheet(stylesheet) {
        if (core_1.extname(stylesheet.filePath) === '.scss') {
            const content = stylesheet.content;
            const migratedContent = content ? migration_1.migrateFileContent(content, '~@angular/material/', '~@angular/cdk/', '~@angular/material', '~@angular/cdk', undefined, /material\/prebuilt-themes|cdk\/.*-prebuilt/) : content;
            if (migratedContent && migratedContent !== content) {
                this.fileSystem.edit(stylesheet.filePath)
                    .remove(0, stylesheet.content.length)
                    .insertLeft(0, migratedContent);
                ThemingApiMigration.migratedFileCount++;
            }
        }
    }
    /** Logs out the number of migrated files at the end of the migration. */
    static globalPostMigration(_tree, context) {
        const count = ThemingApiMigration.migratedFileCount;
        if (count > 0) {
            context.logger.info(`Migrated ${count === 1 ? `1 file` : `${count} files`} to the ` +
                `new Angular Material theming API.`);
            ThemingApiMigration.migratedFileCount = 0;
        }
    }
}
exports.ThemingApiMigration = ThemingApiMigration;
/** Number of files that have been migrated. */
ThemingApiMigration.migratedFileCount = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy1hcGktbWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL3RoZW1pbmctYXBpLW1pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCwrQ0FBNkM7QUFFN0Msd0RBQXlGO0FBQ3pGLDJDQUErQztBQUUvQyxvRkFBb0Y7QUFDcEYsTUFBYSxtQkFBb0IsU0FBUSw0QkFBcUI7SUFBOUQ7O1FBSUUsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxHQUFHLENBQUM7SUE0QnJELENBQUM7SUExQlUsZUFBZSxDQUFDLFVBQTRCO1FBQ25ELElBQUksY0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxPQUFPLEVBQUU7WUFDNUMsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUNuQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhCQUFrQixDQUFDLE9BQU8sRUFDMUQscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxFQUM5RSxTQUFTLEVBQUUsNENBQTRDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBRXJFLElBQUksZUFBZSxJQUFJLGVBQWUsS0FBSyxPQUFPLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7cUJBQ3RDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7cUJBQ3BDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQ2xDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDekM7U0FDRjtJQUNILENBQUM7SUFFRCx5RUFBeUU7SUFDekUsTUFBTSxDQUFVLG1CQUFtQixDQUFDLEtBQWMsRUFBRSxPQUF5QjtRQUMzRSxNQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUVwRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsVUFBVTtnQkFDL0QsbUNBQW1DLENBQUMsQ0FBQztZQUN6RCxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDOztBQS9CSCxrREFnQ0M7QUEvQkMsK0NBQStDO0FBQ3hDLHFDQUFpQixHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtEZXZraXRNaWdyYXRpb24sIFJlc29sdmVkUmVzb3VyY2UsIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7bWlncmF0ZUZpbGVDb250ZW50fSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbi8qKiBNaWdyYXRpb24gdGhhdCBzd2l0Y2hlcyBhbGwgU2FzcyBmaWxlcyB1c2luZyBNYXRlcmlhbCB0aGVtaW5nIEFQSXMgdG8gYEB1c2VgLiAqL1xuZXhwb3J0IGNsYXNzIFRoZW1pbmdBcGlNaWdyYXRpb24gZXh0ZW5kcyBEZXZraXRNaWdyYXRpb248bnVsbD4ge1xuICAvKiogTnVtYmVyIG9mIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIG1pZ3JhdGVkLiAqL1xuICBzdGF0aWMgbWlncmF0ZWRGaWxlQ291bnQgPSAwO1xuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjEyO1xuXG4gIG92ZXJyaWRlIHZpc2l0U3R5bGVzaGVldChzdHlsZXNoZWV0OiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKGV4dG5hbWUoc3R5bGVzaGVldC5maWxlUGF0aCkgPT09ICcuc2NzcycpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdHlsZXNoZWV0LmNvbnRlbnQ7XG4gICAgICBjb25zdCBtaWdyYXRlZENvbnRlbnQgPSBjb250ZW50ID8gbWlncmF0ZUZpbGVDb250ZW50KGNvbnRlbnQsXG4gICAgICAgICd+QGFuZ3VsYXIvbWF0ZXJpYWwvJywgJ35AYW5ndWxhci9jZGsvJywgJ35AYW5ndWxhci9tYXRlcmlhbCcsICd+QGFuZ3VsYXIvY2RrJyxcbiAgICAgICAgdW5kZWZpbmVkLCAvbWF0ZXJpYWxcXC9wcmVidWlsdC10aGVtZXN8Y2RrXFwvLiotcHJlYnVpbHQvKSA6IGNvbnRlbnQ7XG5cbiAgICAgIGlmIChtaWdyYXRlZENvbnRlbnQgJiYgbWlncmF0ZWRDb250ZW50ICE9PSBjb250ZW50KSB7XG4gICAgICAgIHRoaXMuZmlsZVN5c3RlbS5lZGl0KHN0eWxlc2hlZXQuZmlsZVBhdGgpXG4gICAgICAgICAgLnJlbW92ZSgwLCBzdHlsZXNoZWV0LmNvbnRlbnQubGVuZ3RoKVxuICAgICAgICAgIC5pbnNlcnRMZWZ0KDAsIG1pZ3JhdGVkQ29udGVudCk7XG4gICAgICAgIFRoZW1pbmdBcGlNaWdyYXRpb24ubWlncmF0ZWRGaWxlQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogTG9ncyBvdXQgdGhlIG51bWJlciBvZiBtaWdyYXRlZCBmaWxlcyBhdCB0aGUgZW5kIG9mIHRoZSBtaWdyYXRpb24uICovXG4gIHN0YXRpYyBvdmVycmlkZSBnbG9iYWxQb3N0TWlncmF0aW9uKF90cmVlOiB1bmtub3duLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KTogdm9pZCB7XG4gICAgY29uc3QgY291bnQgPSBUaGVtaW5nQXBpTWlncmF0aW9uLm1pZ3JhdGVkRmlsZUNvdW50O1xuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhgTWlncmF0ZWQgJHtjb3VudCA9PT0gMSA/IGAxIGZpbGVgIDogYCR7Y291bnR9IGZpbGVzYH0gdG8gdGhlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBgbmV3IEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWluZyBBUEkuYCk7XG4gICAgICBUaGVtaW5nQXBpTWlncmF0aW9uLm1pZ3JhdGVkRmlsZUNvdW50ID0gMDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==