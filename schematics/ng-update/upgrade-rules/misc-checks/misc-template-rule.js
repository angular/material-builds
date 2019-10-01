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
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-template-rule", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /**
     * Rule that walks through every inline or external template and reports if there
     * are outdated usages of the Angular Material API that needs to be updated manually.
     */
    class MiscTemplateRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
        }
        visitTemplate(template) {
            // Migration for: https://github.com/angular/components/pull/10398 (v6)
            schematics_1.findOutputsOnElementWithTag(template.content, 'selectionChange', [
                'mat-list-option'
            ]).forEach(offset => {
                this.failures.push({
                    filePath: template.filePath,
                    position: template.getCharacterAndLineOfPosition(template.start + offset),
                    message: `Found deprecated "selectionChange" output binding on "mat-list-option". ` +
                        `Use "selectionChange" on "mat-selection-list" instead.`
                });
            });
            // Migration for: https://github.com/angular/components/pull/10413 (v6)
            schematics_1.findOutputsOnElementWithTag(template.content, 'selectedChanged', [
                'mat-datepicker'
            ]).forEach(offset => {
                this.failures.push({
                    filePath: template.filePath,
                    position: template.getCharacterAndLineOfPosition(template.start + offset),
                    message: `Found deprecated "selectedChanged" output binding on "mat-datepicker". ` +
                        `Use "dateChange" or "dateInput" on "<input [matDatepicker]>" instead.`
                });
            });
            // Migration for: https://github.com/angular/components/commit/f0bf6e7 (v6)
            schematics_1.findInputsOnElementWithTag(template.content, 'selected', [
                'mat-button-toggle-group'
            ]).forEach(offset => {
                this.failures.push({
                    filePath: template.filePath,
                    position: template.getCharacterAndLineOfPosition(template.start + offset),
                    message: `Found deprecated "selected" input binding on "mat-radio-button-group". ` +
                        `Use "value" instead.`
                });
            });
        }
    }
    exports.MiscTemplateRule = MiscTemplateRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy10ZW1wbGF0ZS1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy10ZW1wbGF0ZS1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBTWlDO0lBRWpDOzs7T0FHRztJQUNILE1BQWEsZ0JBQWlCLFNBQVEsMEJBQW1CO1FBQXpEOztZQUVFLHFFQUFxRTtZQUNyRSwwREFBMEQ7WUFDMUQsZ0JBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO1FBd0N4RCxDQUFDO1FBdENDLGFBQWEsQ0FBQyxRQUEwQjtZQUV0Qyx1RUFBdUU7WUFDdkUsd0NBQTJCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0QsaUJBQWlCO2FBQ2xCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7b0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSwwRUFBMEU7d0JBQy9FLHdEQUF3RDtpQkFDN0QsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCx1RUFBdUU7WUFDdkUsd0NBQTJCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0QsZ0JBQWdCO2FBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7b0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSx5RUFBeUU7d0JBQzlFLHVFQUF1RTtpQkFDNUUsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCwyRUFBMkU7WUFDM0UsdUNBQTBCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUU7Z0JBQ3ZELHlCQUF5QjthQUMxQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixRQUFRLEVBQUUsUUFBUSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO29CQUN6RSxPQUFPLEVBQUUseUVBQXlFO3dCQUM5RSxzQkFBc0I7aUJBQzNCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBNUNELDRDQTRDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBmaW5kSW5wdXRzT25FbGVtZW50V2l0aFRhZyxcbiAgZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoVGFnLFxuICBNaWdyYXRpb25SdWxlLFxuICBSZXNvbHZlZFJlc291cmNlLFxuICBUYXJnZXRWZXJzaW9uLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogUnVsZSB0aGF0IHdhbGtzIHRocm91Z2ggZXZlcnkgaW5saW5lIG9yIGV4dGVybmFsIHRlbXBsYXRlIGFuZCByZXBvcnRzIGlmIHRoZXJlXG4gKiBhcmUgb3V0ZGF0ZWQgdXNhZ2VzIG9mIHRoZSBBbmd1bGFyIE1hdGVyaWFsIEFQSSB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWQgbWFudWFsbHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNjVGVtcGxhdGVSdWxlIGV4dGVuZHMgTWlncmF0aW9uUnVsZTxudWxsPiB7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgcnVsZUVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuXG4gICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzk4ICh2NilcbiAgICBmaW5kT3V0cHV0c09uRWxlbWVudFdpdGhUYWcodGVtcGxhdGUuY29udGVudCwgJ3NlbGVjdGlvbkNoYW5nZScsIFtcbiAgICAgICdtYXQtbGlzdC1vcHRpb24nXG4gICAgXSkuZm9yRWFjaChvZmZzZXQgPT4ge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IHRlbXBsYXRlLmZpbGVQYXRoLFxuICAgICAgICBwb3NpdGlvbjogdGVtcGxhdGUuZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb24odGVtcGxhdGUuc3RhcnQgKyBvZmZzZXQpLFxuICAgICAgICBtZXNzYWdlOiBgRm91bmQgZGVwcmVjYXRlZCBcInNlbGVjdGlvbkNoYW5nZVwiIG91dHB1dCBiaW5kaW5nIG9uIFwibWF0LWxpc3Qtb3B0aW9uXCIuIGAgK1xuICAgICAgICAgICAgYFVzZSBcInNlbGVjdGlvbkNoYW5nZVwiIG9uIFwibWF0LXNlbGVjdGlvbi1saXN0XCIgaW5zdGVhZC5gXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDQxMyAodjYpXG4gICAgZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoVGFnKHRlbXBsYXRlLmNvbnRlbnQsICdzZWxlY3RlZENoYW5nZWQnLCBbXG4gICAgICAnbWF0LWRhdGVwaWNrZXInXG4gICAgXSkuZm9yRWFjaChvZmZzZXQgPT4ge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IHRlbXBsYXRlLmZpbGVQYXRoLFxuICAgICAgICBwb3NpdGlvbjogdGVtcGxhdGUuZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb24odGVtcGxhdGUuc3RhcnQgKyBvZmZzZXQpLFxuICAgICAgICBtZXNzYWdlOiBgRm91bmQgZGVwcmVjYXRlZCBcInNlbGVjdGVkQ2hhbmdlZFwiIG91dHB1dCBiaW5kaW5nIG9uIFwibWF0LWRhdGVwaWNrZXJcIi4gYCArXG4gICAgICAgICAgICBgVXNlIFwiZGF0ZUNoYW5nZVwiIG9yIFwiZGF0ZUlucHV0XCIgb24gXCI8aW5wdXQgW21hdERhdGVwaWNrZXJdPlwiIGluc3RlYWQuYFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2NvbW1pdC9mMGJmNmU3ICh2NilcbiAgICBmaW5kSW5wdXRzT25FbGVtZW50V2l0aFRhZyh0ZW1wbGF0ZS5jb250ZW50LCAnc2VsZWN0ZWQnLCBbXG4gICAgICAnbWF0LWJ1dHRvbi10b2dnbGUtZ3JvdXAnXG4gICAgXSkuZm9yRWFjaChvZmZzZXQgPT4ge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IHRlbXBsYXRlLmZpbGVQYXRoLFxuICAgICAgICBwb3NpdGlvbjogdGVtcGxhdGUuZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb24odGVtcGxhdGUuc3RhcnQgKyBvZmZzZXQpLFxuICAgICAgICBtZXNzYWdlOiBgRm91bmQgZGVwcmVjYXRlZCBcInNlbGVjdGVkXCIgaW5wdXQgYmluZGluZyBvbiBcIm1hdC1yYWRpby1idXR0b24tZ3JvdXBcIi4gYCArXG4gICAgICAgICAgICBgVXNlIFwidmFsdWVcIiBpbnN0ZWFkLmBcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=