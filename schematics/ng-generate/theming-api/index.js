"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const migration_1 = require("./migration");
function default_1(_options) {
    return (tree) => {
        tree.visit((path, entry) => {
            if (core_1.extname(path) === '.scss' && path.indexOf('node_modules') === -1) {
                const content = entry === null || entry === void 0 ? void 0 : entry.content.toString();
                const migratedContent = content ? migration_1.migrateFileContent(content, '~@angular/material/', '~@angular/cdk/', '~@angular/material', '~@angular/cdk') : content;
                if (migratedContent && migratedContent !== content) {
                    tree.overwrite(path, migratedContent);
                }
            }
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90aGVtaW5nLWFwaS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtDQUE2QztBQUc3QywyQ0FBK0M7QUFFL0MsbUJBQXdCLFFBQWdCO0lBQ3RDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pCLElBQUksY0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxNQUFNLE9BQU8sR0FBRyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMxQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhCQUFrQixDQUFDLE9BQU8sRUFDMUQscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFFNUYsSUFBSSxlQUFlLElBQUksZUFBZSxLQUFLLE9BQU8sRUFBRTtvQkFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUM7QUFkRCw0QkFjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7UnVsZSwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7bWlncmF0ZUZpbGVDb250ZW50fSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF9vcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlKSA9PiB7XG4gICAgdHJlZS52aXNpdCgocGF0aCwgZW50cnkpID0+IHtcbiAgICAgIGlmIChleHRuYW1lKHBhdGgpID09PSAnLnNjc3MnICYmIHBhdGguaW5kZXhPZignbm9kZV9tb2R1bGVzJykgPT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBlbnRyeT8uY29udGVudC50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBtaWdyYXRlZENvbnRlbnQgPSBjb250ZW50ID8gbWlncmF0ZUZpbGVDb250ZW50KGNvbnRlbnQsXG4gICAgICAgICAgJ35AYW5ndWxhci9tYXRlcmlhbC8nLCAnfkBhbmd1bGFyL2Nkay8nLCAnfkBhbmd1bGFyL21hdGVyaWFsJywgJ35AYW5ndWxhci9jZGsnKSA6IGNvbnRlbnQ7XG5cbiAgICAgICAgaWYgKG1pZ3JhdGVkQ29udGVudCAmJiBtaWdyYXRlZENvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgICB0cmVlLm92ZXJ3cml0ZShwYXRoLCBtaWdyYXRlZENvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG4iXX0=