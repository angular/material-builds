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
        if ((0, core_1.extname)(stylesheet.filePath) === '.scss') {
            const content = stylesheet.content;
            const migratedContent = content ? (0, migration_1.migrateFileContent)(content, '@angular/material/', '@angular/cdk/', '@angular/material', '@angular/cdk', undefined, /material\/prebuilt-themes|cdk\/.*-prebuilt/) : content;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy1hcGktbWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL3RoZW1pbmctYXBpLW1pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCwrQ0FBNkM7QUFFN0Msd0RBQXlGO0FBQ3pGLDJDQUErQztBQUUvQyxvRkFBb0Y7QUFDcEYsTUFBYSxtQkFBb0IsU0FBUSw0QkFBcUI7SUFBOUQ7O1FBSUUsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxHQUFHLENBQUM7SUE0QnJELENBQUM7SUExQlUsZUFBZSxDQUFDLFVBQTRCO1FBQ25ELElBQUksSUFBQSxjQUFPLEVBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU8sRUFBRTtZQUM1QyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQ25DLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBQSw4QkFBa0IsRUFBQyxPQUFPLEVBQzFELG9CQUFvQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQzFFLFNBQVMsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFFckUsSUFBSSxlQUFlLElBQUksZUFBZSxLQUFLLE9BQU8sRUFBRTtnQkFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztxQkFDdEMsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztxQkFDcEMsVUFBVSxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDbEMsbUJBQW1CLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUN6QztTQUNGO0lBQ0gsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxNQUFNLENBQVUsbUJBQW1CLENBQUMsS0FBYyxFQUFFLE9BQXlCO1FBQzNFLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDO1FBRXBELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssUUFBUSxVQUFVO2dCQUMvRCxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3pELG1CQUFtQixDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7O0FBL0JILGtEQWdDQztBQS9CQywrQ0FBK0M7QUFDeEMscUNBQWlCLEdBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZXh0bmFtZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtTY2hlbWF0aWNDb250ZXh0fSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge0RldmtpdE1pZ3JhdGlvbiwgUmVzb2x2ZWRSZXNvdXJjZSwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHttaWdyYXRlRmlsZUNvbnRlbnR9IGZyb20gJy4vbWlncmF0aW9uJztcblxuLyoqIE1pZ3JhdGlvbiB0aGF0IHN3aXRjaGVzIGFsbCBTYXNzIGZpbGVzIHVzaW5nIE1hdGVyaWFsIHRoZW1pbmcgQVBJcyB0byBgQHVzZWAuICovXG5leHBvcnQgY2xhc3MgVGhlbWluZ0FwaU1pZ3JhdGlvbiBleHRlbmRzIERldmtpdE1pZ3JhdGlvbjxudWxsPiB7XG4gIC8qKiBOdW1iZXIgb2YgZmlsZXMgdGhhdCBoYXZlIGJlZW4gbWlncmF0ZWQuICovXG4gIHN0YXRpYyBtaWdyYXRlZEZpbGVDb3VudCA9IDA7XG5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WMTI7XG5cbiAgb3ZlcnJpZGUgdmlzaXRTdHlsZXNoZWV0KHN0eWxlc2hlZXQ6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAoZXh0bmFtZShzdHlsZXNoZWV0LmZpbGVQYXRoKSA9PT0gJy5zY3NzJykge1xuICAgICAgY29uc3QgY29udGVudCA9IHN0eWxlc2hlZXQuY29udGVudDtcbiAgICAgIGNvbnN0IG1pZ3JhdGVkQ29udGVudCA9IGNvbnRlbnQgPyBtaWdyYXRlRmlsZUNvbnRlbnQoY29udGVudCxcbiAgICAgICAgJ0Bhbmd1bGFyL21hdGVyaWFsLycsICdAYW5ndWxhci9jZGsvJywgJ0Bhbmd1bGFyL21hdGVyaWFsJywgJ0Bhbmd1bGFyL2NkaycsXG4gICAgICAgIHVuZGVmaW5lZCwgL21hdGVyaWFsXFwvcHJlYnVpbHQtdGhlbWVzfGNka1xcLy4qLXByZWJ1aWx0LykgOiBjb250ZW50O1xuXG4gICAgICBpZiAobWlncmF0ZWRDb250ZW50ICYmIG1pZ3JhdGVkQ29udGVudCAhPT0gY29udGVudCkge1xuICAgICAgICB0aGlzLmZpbGVTeXN0ZW0uZWRpdChzdHlsZXNoZWV0LmZpbGVQYXRoKVxuICAgICAgICAgIC5yZW1vdmUoMCwgc3R5bGVzaGVldC5jb250ZW50Lmxlbmd0aClcbiAgICAgICAgICAuaW5zZXJ0TGVmdCgwLCBtaWdyYXRlZENvbnRlbnQpO1xuICAgICAgICBUaGVtaW5nQXBpTWlncmF0aW9uLm1pZ3JhdGVkRmlsZUNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIExvZ3Mgb3V0IHRoZSBudW1iZXIgb2YgbWlncmF0ZWQgZmlsZXMgYXQgdGhlIGVuZCBvZiB0aGUgbWlncmF0aW9uLiAqL1xuICBzdGF0aWMgb3ZlcnJpZGUgZ2xvYmFsUG9zdE1pZ3JhdGlvbihfdHJlZTogdW5rbm93biwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ID0gVGhlbWluZ0FwaU1pZ3JhdGlvbi5taWdyYXRlZEZpbGVDb3VudDtcblxuICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oYE1pZ3JhdGVkICR7Y291bnQgPT09IDEgPyBgMSBmaWxlYCA6IGAke2NvdW50fSBmaWxlc2B9IHRvIHRoZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYG5ldyBBbmd1bGFyIE1hdGVyaWFsIHRoZW1pbmcgQVBJLmApO1xuICAgICAgVGhlbWluZ0FwaU1pZ3JhdGlvbi5taWdyYXRlZEZpbGVDb3VudCA9IDA7XG4gICAgfVxuICB9XG59XG4iXX0=