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
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-class-names-rule", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Rule that looks for class name identifiers that have been removed but
     * cannot be automatically migrated.
     */
    class MiscClassNamesRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
        }
        visitNode(node) {
            if (ts.isIdentifier(node)) {
                this._visitIdentifier(node);
            }
        }
        _visitIdentifier(identifier) {
            // Migration for: https://github.com/angular/components/pull/10279 (v6)
            if (identifier.getText() === 'MatDrawerToggleResult') {
                this.createFailureAtNode(identifier, `Found "MatDrawerToggleResult" which has changed from a class type to a string ` +
                    `literal type. Your code may need to be updated.`);
            }
            // Migration for: https://github.com/angular/components/pull/10398 (v6)
            if (identifier.getText() === 'MatListOptionChange') {
                this.createFailureAtNode(identifier, `Found usage of "MatListOptionChange" which has been removed. Please listen for ` +
                    `"selectionChange" on "MatSelectionList" instead.`);
            }
        }
    }
    exports.MiscClassNamesRule = MiscClassNamesRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1uYW1lcy1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy1jbGFzcy1uYW1lcy1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQXFFO0lBQ3JFLGlDQUFpQztJQUVqQzs7O09BR0c7SUFDSCxNQUFhLGtCQUFtQixTQUFRLDBCQUFtQjtRQUEzRDs7WUFFRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQXlCeEQsQ0FBQztRQXZCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUM7UUFFTyxnQkFBZ0IsQ0FBQyxVQUF5QjtZQUNoRCx1RUFBdUU7WUFDdkUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssdUJBQXVCLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsVUFBVSxFQUNWLGdGQUFnRjtvQkFDNUUsaURBQWlELENBQUMsQ0FBQzthQUM1RDtZQUVELHVFQUF1RTtZQUN2RSxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxxQkFBcUIsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixVQUFVLEVBQ1YsaUZBQWlGO29CQUM3RSxrREFBa0QsQ0FBQyxDQUFDO2FBQzdEO1FBQ0gsQ0FBQztLQUNGO0lBN0JELGdEQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvblJ1bGUsIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKipcbiAqIFJ1bGUgdGhhdCBsb29rcyBmb3IgY2xhc3MgbmFtZSBpZGVudGlmaWVycyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGJ1dFxuICogY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgbWlncmF0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNjQ2xhc3NOYW1lc1J1bGUgZXh0ZW5kcyBNaWdyYXRpb25SdWxlPG51bGw+IHtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gNi4gVGhlIHJ1bGVcbiAgLy8gY3VycmVudGx5IG9ubHkgaW5jbHVkZXMgbWlncmF0aW9ucyBmb3IgVjYgZGVwcmVjYXRpb25zLlxuICBydWxlRW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0SWRlbnRpZmllcihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdElkZW50aWZpZXIoaWRlbnRpZmllcjogdHMuSWRlbnRpZmllcikge1xuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI3OSAodjYpXG4gICAgaWYgKGlkZW50aWZpZXIuZ2V0VGV4dCgpID09PSAnTWF0RHJhd2VyVG9nZ2xlUmVzdWx0Jykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgYEZvdW5kIFwiTWF0RHJhd2VyVG9nZ2xlUmVzdWx0XCIgd2hpY2ggaGFzIGNoYW5nZWQgZnJvbSBhIGNsYXNzIHR5cGUgdG8gYSBzdHJpbmcgYCArXG4gICAgICAgICAgICAgIGBsaXRlcmFsIHR5cGUuIFlvdXIgY29kZSBtYXkgbmVlZCB0byBiZSB1cGRhdGVkLmApO1xuICAgIH1cblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM5OCAodjYpXG4gICAgaWYgKGlkZW50aWZpZXIuZ2V0VGV4dCgpID09PSAnTWF0TGlzdE9wdGlvbkNoYW5nZScpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgIGBGb3VuZCB1c2FnZSBvZiBcIk1hdExpc3RPcHRpb25DaGFuZ2VcIiB3aGljaCBoYXMgYmVlbiByZW1vdmVkLiBQbGVhc2UgbGlzdGVuIGZvciBgICtcbiAgICAgICAgICAgICAgYFwic2VsZWN0aW9uQ2hhbmdlXCIgb24gXCJNYXRTZWxlY3Rpb25MaXN0XCIgaW5zdGVhZC5gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==