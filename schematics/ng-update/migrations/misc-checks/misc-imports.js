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
        define("@angular/material/schematics/ng-update/migrations/misc-checks/misc-imports", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Migration that detects import declarations that refer to outdated identifiers from
     * Angular Material which cannot be updated automatically.
     */
    class MiscImportsMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
        }
        visitNode(node) {
            if (ts.isImportDeclaration(node)) {
                this._visitImportDeclaration(node);
            }
        }
        _visitImportDeclaration(node) {
            if (!schematics_1.isMaterialImportDeclaration(node) || !node.importClause ||
                !node.importClause.namedBindings) {
                return;
            }
            const namedBindings = node.importClause.namedBindings;
            if (ts.isNamedImports(namedBindings)) {
                // Migration for: https://github.com/angular/components/pull/10405 (v6)
                this._checkAnimationConstants(namedBindings);
            }
        }
        /**
         * Checks for named imports that refer to the deleted animation constants.
         * https://github.com/angular/components/commit/9f3bf274c4f15f0b0fbd8ab7dbf1a453076e66d9
         */
        _checkAnimationConstants(namedImports) {
            namedImports.elements.filter(element => ts.isIdentifier(element.name)).forEach(element => {
                const importName = element.name.text;
                if (importName === 'SHOW_ANIMATION' || importName === 'HIDE_ANIMATION') {
                    this.createFailureAtNode(element, `Found deprecated symbol "${importName}" which has been removed`);
                }
            });
        }
    }
    exports.MiscImportsMigration = MiscImportsMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQThGO0lBQzlGLGlDQUFpQztJQUVqQzs7O09BR0c7SUFDSCxNQUFhLG9CQUFxQixTQUFRLHNCQUFlO1FBQXpEOztZQUVFLHFFQUFxRTtZQUNyRSwwREFBMEQ7WUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7UUFvQ3BELENBQUM7UUFsQ0MsU0FBUyxDQUFDLElBQWE7WUFDckIsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwQztRQUNILENBQUM7UUFFTyx1QkFBdUIsQ0FBQyxJQUEwQjtZQUN4RCxJQUFJLENBQUMsd0NBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtnQkFDeEQsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRTtnQkFDcEMsT0FBTzthQUNSO1lBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7WUFFdEQsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNwQyx1RUFBdUU7Z0JBQ3ZFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUM5QztRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSyx3QkFBd0IsQ0FBQyxZQUE2QjtZQUM1RCxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN2RixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFFckMsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLElBQUksVUFBVSxLQUFLLGdCQUFnQixFQUFFO29CQUN0RSxJQUFJLENBQUMsbUJBQW1CLENBQ3BCLE9BQU8sRUFBRSw0QkFBNEIsVUFBVSwwQkFBMEIsQ0FBQyxDQUFDO2lCQUNoRjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBeENELG9EQXdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzTWF0ZXJpYWxJbXBvcnREZWNsYXJhdGlvbiwgTWlncmF0aW9uLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCBkZXRlY3RzIGltcG9ydCBkZWNsYXJhdGlvbnMgdGhhdCByZWZlciB0byBvdXRkYXRlZCBpZGVudGlmaWVycyBmcm9tXG4gKiBBbmd1bGFyIE1hdGVyaWFsIHdoaWNoIGNhbm5vdCBiZSB1cGRhdGVkIGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNjSW1wb3J0c01pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0ltcG9ydERlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICB0aGlzLl92aXNpdEltcG9ydERlY2xhcmF0aW9uKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0SW1wb3J0RGVjbGFyYXRpb24obm9kZTogdHMuSW1wb3J0RGVjbGFyYXRpb24pIHtcbiAgICBpZiAoIWlzTWF0ZXJpYWxJbXBvcnREZWNsYXJhdGlvbihub2RlKSB8fCAhbm9kZS5pbXBvcnRDbGF1c2UgfHxcbiAgICAgICAgIW5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcblxuICAgIGlmICh0cy5pc05hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzKSkge1xuICAgICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwNDA1ICh2NilcbiAgICAgIHRoaXMuX2NoZWNrQW5pbWF0aW9uQ29uc3RhbnRzKG5hbWVkQmluZGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIG5hbWVkIGltcG9ydHMgdGhhdCByZWZlciB0byB0aGUgZGVsZXRlZCBhbmltYXRpb24gY29uc3RhbnRzLlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2NvbW1pdC85ZjNiZjI3NGM0ZjE1ZjBiMGZiZDhhYjdkYmYxYTQ1MzA3NmU2NmQ5XG4gICAqL1xuICBwcml2YXRlIF9jaGVja0FuaW1hdGlvbkNvbnN0YW50cyhuYW1lZEltcG9ydHM6IHRzLk5hbWVkSW1wb3J0cykge1xuICAgIG5hbWVkSW1wb3J0cy5lbGVtZW50cy5maWx0ZXIoZWxlbWVudCA9PiB0cy5pc0lkZW50aWZpZXIoZWxlbWVudC5uYW1lKSkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBlbGVtZW50Lm5hbWUudGV4dDtcblxuICAgICAgaWYgKGltcG9ydE5hbWUgPT09ICdTSE9XX0FOSU1BVElPTicgfHwgaW1wb3J0TmFtZSA9PT0gJ0hJREVfQU5JTUFUSU9OJykge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgICBlbGVtZW50LCBgRm91bmQgZGVwcmVjYXRlZCBzeW1ib2wgXCIke2ltcG9ydE5hbWV9XCIgd2hpY2ggaGFzIGJlZW4gcmVtb3ZlZGApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=