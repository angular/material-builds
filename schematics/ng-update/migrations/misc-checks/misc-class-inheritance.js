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
        define("@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-inheritance", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Migration that checks for classes that extend Angular Material classes which
     * have changed their API.
     */
    class MiscClassInheritanceMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
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
    exports.MiscClassInheritanceMigration = MiscClassInheritanceMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1pbmhlcml0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBcUY7SUFDckYsaUNBQWlDO0lBRWpDOzs7T0FHRztJQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7UUFBbEU7O1lBRUUscUVBQXFFO1lBQ3JFLDBEQUEwRDtZQUMxRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQStCcEQsQ0FBQztRQTdCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztRQUVPLHNCQUFzQixDQUFDLElBQXlCO1lBQ3RELE1BQU0sU0FBUyxHQUFHLCtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUVoRSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE9BQU87YUFDUjtZQUVELHVFQUF1RTtZQUN2RSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBRTtnQkFDN0MsTUFBTSxtQkFBbUIsR0FDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3FCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLGtCQUFrQixDQUFDLENBQUM7Z0JBRXZFLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixJQUFJLEVBQ0osZ0JBQWdCLFNBQVMsa0JBQWtCO3dCQUN2QyxJQUFJLHFCQUFxQiw0QkFBNEI7d0JBQ3JELElBQUksa0JBQWtCLHFDQUFxQyxDQUFDLENBQUM7aUJBQ3RFO2FBQ0Y7UUFDSCxDQUFDO0tBQ0Y7SUFuQ0Qsc0VBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ZGV0ZXJtaW5lQmFzZVR5cGVzLCBNaWdyYXRpb24sIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IGNoZWNrcyBmb3IgY2xhc3NlcyB0aGF0IGV4dGVuZCBBbmd1bGFyIE1hdGVyaWFsIGNsYXNzZXMgd2hpY2hcbiAqIGhhdmUgY2hhbmdlZCB0aGVpciBBUEkuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNjQ2xhc3NJbmhlcml0YW5jZU1pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0NsYXNzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZTogdHMuQ2xhc3NEZWNsYXJhdGlvbikge1xuICAgIGNvbnN0IGJhc2VUeXBlcyA9IGRldGVybWluZUJhc2VUeXBlcyhub2RlKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBub2RlLm5hbWUgPyBub2RlLm5hbWUudGV4dCA6ICd7dW5rbm93bi1uYW1lfSc7XG5cbiAgICBpZiAoIWJhc2VUeXBlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5MyAodjYpXG4gICAgaWYgKGJhc2VUeXBlcy5pbmNsdWRlcygnTWF0Rm9ybUZpZWxkQ29udHJvbCcpKSB7XG4gICAgICBjb25zdCBoYXNGbG9hdExhYmVsTWVtYmVyID1cbiAgICAgICAgICBub2RlLm1lbWJlcnMuZmlsdGVyKG1lbWJlciA9PiBtZW1iZXIubmFtZSlcbiAgICAgICAgICAgICAgLmZpbmQobWVtYmVyID0+IG1lbWJlci5uYW1lIS5nZXRUZXh0KCkgPT09ICdzaG91bGRMYWJlbEZsb2F0Jyk7XG5cbiAgICAgIGlmICghaGFzRmxvYXRMYWJlbE1lbWJlcikge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgYEZvdW5kIGNsYXNzIFwiJHtjbGFzc05hbWV9XCIgd2hpY2ggZXh0ZW5kcyBgICtcbiAgICAgICAgICAgICAgICBgXCIkeydNYXRGb3JtRmllbGRDb250cm9sJ31cIi4gVGhpcyBjbGFzcyBtdXN0IGRlZmluZSBgICtcbiAgICAgICAgICAgICAgICBgXCIkeydzaG91bGRMYWJlbEZsb2F0J31cIiB3aGljaCBpcyBub3cgYSByZXF1aXJlZCBwcm9wZXJ0eS5gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==