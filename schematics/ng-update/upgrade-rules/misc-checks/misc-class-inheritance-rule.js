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
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-inheritance-rule", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Rule that checks for classes that extend Angular Material classes which
     * have changed their API.
     */
    class MiscClassInheritanceRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
        }
        visitNode(node) {
            if (ts.isClassDeclaration(node)) {
                this._visitClassDeclaration(node);
            }
        }
        _visitClassDeclaration(node) {
            const baseTypes = schematics_1.determineBaseTypes(node);
            const className = node.name ? node.name.text : '{unknown-name}';
            if (!baseTypes) {
                return;
            }
            // Migration for: https://github.com/angular/components/pull/10293 (v6)
            if (baseTypes.includes('MatFormFieldControl')) {
                const hasFloatLabelMember = node.members.filter(member => member.name)
                    .find(member => member.name.getText() === 'shouldLabelFloat');
                if (!hasFloatLabelMember) {
                    this.createFailureAtNode(node, `Found class "${className}" which extends ` +
                        `"${'MatFormFieldControl'}". This class must define ` +
                        `"${'shouldLabelFloat'}" which is now a required property.`);
                }
            }
        }
    }
    exports.MiscClassInheritanceRule = MiscClassInheritanceRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1pbmhlcml0YW5jZS1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1pbmhlcml0YW5jZS1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQXlGO0lBQ3pGLGlDQUFpQztJQUVqQzs7O09BR0c7SUFDSCxNQUFhLHdCQUF5QixTQUFRLDBCQUFtQjtRQUFqRTs7WUFFRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQStCeEQsQ0FBQztRQTdCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztRQUVPLHNCQUFzQixDQUFDLElBQXlCO1lBQ3RELE1BQU0sU0FBUyxHQUFHLCtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUVoRSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE9BQU87YUFDUjtZQUVELHVFQUF1RTtZQUN2RSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBRTtnQkFDN0MsTUFBTSxtQkFBbUIsR0FDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3FCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLGtCQUFrQixDQUFDLENBQUM7Z0JBRXZFLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixJQUFJLEVBQ0osZ0JBQWdCLFNBQVMsa0JBQWtCO3dCQUN2QyxJQUFJLHFCQUFxQiw0QkFBNEI7d0JBQ3JELElBQUksa0JBQWtCLHFDQUFxQyxDQUFDLENBQUM7aUJBQ3RFO2FBQ0Y7UUFDSCxDQUFDO0tBQ0Y7SUFuQ0QsNERBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZGV0ZXJtaW5lQmFzZVR5cGVzLCBNaWdyYXRpb25SdWxlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBSdWxlIHRoYXQgY2hlY2tzIGZvciBjbGFzc2VzIHRoYXQgZXh0ZW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY2xhc3NlcyB3aGljaFxuICogaGF2ZSBjaGFuZ2VkIHRoZWlyIEFQSS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1pc2NDbGFzc0luaGVyaXRhbmNlUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIHJ1bGVFbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY2O1xuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgYmFzZVR5cGVzID0gZGV0ZXJtaW5lQmFzZVR5cGVzKG5vZGUpO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IG5vZGUubmFtZSA/IG5vZGUubmFtZS50ZXh0IDogJ3t1bmtub3duLW5hbWV9JztcblxuICAgIGlmICghYmFzZVR5cGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjkzICh2NilcbiAgICBpZiAoYmFzZVR5cGVzLmluY2x1ZGVzKCdNYXRGb3JtRmllbGRDb250cm9sJykpIHtcbiAgICAgIGNvbnN0IGhhc0Zsb2F0TGFiZWxNZW1iZXIgPVxuICAgICAgICAgIG5vZGUubWVtYmVycy5maWx0ZXIobWVtYmVyID0+IG1lbWJlci5uYW1lKVxuICAgICAgICAgICAgICAuZmluZChtZW1iZXIgPT4gbWVtYmVyLm5hbWUhLmdldFRleHQoKSA9PT0gJ3Nob3VsZExhYmVsRmxvYXQnKTtcblxuICAgICAgaWYgKCFoYXNGbG9hdExhYmVsTWVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBgRm91bmQgY2xhc3MgXCIke2NsYXNzTmFtZX1cIiB3aGljaCBleHRlbmRzIGAgK1xuICAgICAgICAgICAgICAgIGBcIiR7J01hdEZvcm1GaWVsZENvbnRyb2wnfVwiLiBUaGlzIGNsYXNzIG11c3QgZGVmaW5lIGAgK1xuICAgICAgICAgICAgICAgIGBcIiR7J3Nob3VsZExhYmVsRmxvYXQnfVwiIHdoaWNoIGlzIG5vdyBhIHJlcXVpcmVkIHByb3BlcnR5LmApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19