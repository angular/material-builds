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
            if (core_1.extname(path) === '.scss') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90aGVtaW5nLWFwaS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtDQUE2QztBQUc3QywyQ0FBK0M7QUFFL0MsbUJBQXdCLFFBQWdCO0lBQ3RDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pCLElBQUksY0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFDN0IsTUFBTSxPQUFPLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDMUMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyw4QkFBa0IsQ0FBQyxPQUFPLEVBQzFELHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBRTVGLElBQUksZUFBZSxJQUFJLGVBQWUsS0FBSyxPQUFPLEVBQUU7b0JBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO2lCQUN2QzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBZEQsNEJBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtleHRuYW1lfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1J1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQge21pZ3JhdGVGaWxlQ29udGVudH0gZnJvbSAnLi9taWdyYXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfb3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSkgPT4ge1xuICAgIHRyZWUudmlzaXQoKHBhdGgsIGVudHJ5KSA9PiB7XG4gICAgICBpZiAoZXh0bmFtZShwYXRoKSA9PT0gJy5zY3NzJykge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gZW50cnk/LmNvbnRlbnQudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgbWlncmF0ZWRDb250ZW50ID0gY29udGVudCA/IG1pZ3JhdGVGaWxlQ29udGVudChjb250ZW50LFxuICAgICAgICAgICd+QGFuZ3VsYXIvbWF0ZXJpYWwvJywgJ35AYW5ndWxhci9jZGsvJywgJ35AYW5ndWxhci9tYXRlcmlhbCcsICd+QGFuZ3VsYXIvY2RrJykgOiBjb250ZW50O1xuXG4gICAgICAgIGlmIChtaWdyYXRlZENvbnRlbnQgJiYgbWlncmF0ZWRDb250ZW50ICE9PSBjb250ZW50KSB7XG4gICAgICAgICAgdHJlZS5vdmVyd3JpdGUocGF0aCwgbWlncmF0ZWRDb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuIl19