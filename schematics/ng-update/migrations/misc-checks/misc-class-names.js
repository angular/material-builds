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
        define("@angular/material/schematics/ng-update/migrations/misc-checks/misc-class-names", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Migration that looks for class name identifiers that have been removed but
     * cannot be automatically migrated.
     */
    class MiscClassNamesMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
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
    exports.MiscClassNamesMigration = MiscClassNamesMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBaUU7SUFDakUsaUNBQWlDO0lBRWpDOzs7T0FHRztJQUNILE1BQWEsdUJBQXdCLFNBQVEsc0JBQWU7UUFBNUQ7O1lBRUUscUVBQXFFO1lBQ3JFLDBEQUEwRDtZQUMxRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQXlCcEQsQ0FBQztRQXZCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUM7UUFFTyxnQkFBZ0IsQ0FBQyxVQUF5QjtZQUNoRCx1RUFBdUU7WUFDdkUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssdUJBQXVCLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsVUFBVSxFQUNWLGdGQUFnRjtvQkFDNUUsaURBQWlELENBQUMsQ0FBQzthQUM1RDtZQUVELHVFQUF1RTtZQUN2RSxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxxQkFBcUIsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixVQUFVLEVBQ1YsaUZBQWlGO29CQUM3RSxrREFBa0QsQ0FBQyxDQUFDO2FBQzdEO1FBQ0gsQ0FBQztLQUNGO0lBN0JELDBEQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgbG9va3MgZm9yIGNsYXNzIG5hbWUgaWRlbnRpZmllcnMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCBidXRcbiAqIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IG1pZ3JhdGVkLlxuICovXG5leHBvcnQgY2xhc3MgTWlzY0NsYXNzTmFtZXNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICB0aGlzLl92aXNpdElkZW50aWZpZXIobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRJZGVudGlmaWVyKGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIpIHtcbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyNzkgKHY2KVxuICAgIGlmIChpZGVudGlmaWVyLmdldFRleHQoKSA9PT0gJ01hdERyYXdlclRvZ2dsZVJlc3VsdCcpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgIGBGb3VuZCBcIk1hdERyYXdlclRvZ2dsZVJlc3VsdFwiIHdoaWNoIGhhcyBjaGFuZ2VkIGZyb20gYSBjbGFzcyB0eXBlIHRvIGEgc3RyaW5nIGAgK1xuICAgICAgICAgICAgICBgbGl0ZXJhbCB0eXBlLiBZb3VyIGNvZGUgbWF5IG5lZWQgdG8gYmUgdXBkYXRlZC5gKTtcbiAgICB9XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzOTggKHY2KVxuICAgIGlmIChpZGVudGlmaWVyLmdldFRleHQoKSA9PT0gJ01hdExpc3RPcHRpb25DaGFuZ2UnKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICBgRm91bmQgdXNhZ2Ugb2YgXCJNYXRMaXN0T3B0aW9uQ2hhbmdlXCIgd2hpY2ggaGFzIGJlZW4gcmVtb3ZlZC4gUGxlYXNlIGxpc3RlbiBmb3IgYCArXG4gICAgICAgICAgICAgIGBcInNlbGVjdGlvbkNoYW5nZVwiIG9uIFwiTWF0U2VsZWN0aW9uTGlzdFwiIGluc3RlYWQuYCk7XG4gICAgfVxuICB9XG59XG4iXX0=