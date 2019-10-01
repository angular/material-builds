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
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-imports-rule", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Rule that detects import declarations that refer to outdated identifiers from
     * Angular Material which cannot be updated automatically.
     */
    class MiscImportsRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
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
    exports.MiscImportsRule = MiscImportsRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1pbXBvcnRzLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9taXNjLWNoZWNrcy9taXNjLWltcG9ydHMtcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUFrRztJQUNsRyxpQ0FBaUM7SUFFakM7OztPQUdHO0lBQ0gsTUFBYSxlQUFnQixTQUFRLDBCQUFtQjtRQUF4RDs7WUFFRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQW9DeEQsQ0FBQztRQWxDQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQztRQUVPLHVCQUF1QixDQUFDLElBQTBCO1lBQ3hELElBQUksQ0FBQyx3Q0FBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO2dCQUN4RCxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO2dCQUNwQyxPQUFPO2FBQ1I7WUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztZQUV0RCxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3BDLHVFQUF1RTtnQkFDdkUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzlDO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNLLHdCQUF3QixDQUFDLFlBQTZCO1lBQzVELFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3ZGLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUVyQyxJQUFJLFVBQVUsS0FBSyxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7b0JBQ3RFLElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsT0FBTyxFQUFFLDRCQUE0QixVQUFVLDBCQUEwQixDQUFDLENBQUM7aUJBQ2hGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUF4Q0QsMENBd0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aXNNYXRlcmlhbEltcG9ydERlY2xhcmF0aW9uLCBNaWdyYXRpb25SdWxlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBSdWxlIHRoYXQgZGV0ZWN0cyBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgcmVmZXIgdG8gb3V0ZGF0ZWQgaWRlbnRpZmllcnMgZnJvbVxuICogQW5ndWxhciBNYXRlcmlhbCB3aGljaCBjYW5ub3QgYmUgdXBkYXRlZCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgY2xhc3MgTWlzY0ltcG9ydHNSdWxlIGV4dGVuZHMgTWlncmF0aW9uUnVsZTxudWxsPiB7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgcnVsZUVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRJbXBvcnREZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdEltcG9ydERlY2xhcmF0aW9uKG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgaWYgKCFpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIW5vZGUuaW1wb3J0Q2xhdXNlIHx8XG4gICAgICAgICFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZWRCaW5kaW5ncyA9IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3M7XG5cbiAgICBpZiAodHMuaXNOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDQwNSAodjYpXG4gICAgICB0aGlzLl9jaGVja0FuaW1hdGlvbkNvbnN0YW50cyhuYW1lZEJpbmRpbmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBuYW1lZCBpbXBvcnRzIHRoYXQgcmVmZXIgdG8gdGhlIGRlbGV0ZWQgYW5pbWF0aW9uIGNvbnN0YW50cy5cbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9jb21taXQvOWYzYmYyNzRjNGYxNWYwYjBmYmQ4YWI3ZGJmMWE0NTMwNzZlNjZkOVxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tBbmltYXRpb25Db25zdGFudHMobmFtZWRJbXBvcnRzOiB0cy5OYW1lZEltcG9ydHMpIHtcbiAgICBuYW1lZEltcG9ydHMuZWxlbWVudHMuZmlsdGVyKGVsZW1lbnQgPT4gdHMuaXNJZGVudGlmaWVyKGVsZW1lbnQubmFtZSkpLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gZWxlbWVudC5uYW1lLnRleHQ7XG5cbiAgICAgIGlmIChpbXBvcnROYW1lID09PSAnU0hPV19BTklNQVRJT04nIHx8IGltcG9ydE5hbWUgPT09ICdISURFX0FOSU1BVElPTicpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgICAgZWxlbWVudCwgYEZvdW5kIGRlcHJlY2F0ZWQgc3ltYm9sIFwiJHtpbXBvcnROYW1lfVwiIHdoaWNoIGhhcyBiZWVuIHJlbW92ZWRgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19