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
        define("@angular/material/schematics/ng-update/migrations/misc-checks/misc-template", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /**
     * Migration that walks through every inline or external template and reports if there
     * are outdated usages of the Angular Material API that needs to be updated manually.
     */
    class MiscTemplateMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
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
    exports.MiscTemplateMigration = MiscTemplateMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy10ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFNaUM7SUFFakM7OztPQUdHO0lBQ0gsTUFBYSxxQkFBc0IsU0FBUSxzQkFBZTtRQUExRDs7WUFFRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO1FBd0NwRCxDQUFDO1FBdENDLGFBQWEsQ0FBQyxRQUEwQjtZQUV0Qyx1RUFBdUU7WUFDdkUsd0NBQTJCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0QsaUJBQWlCO2FBQ2xCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7b0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSwwRUFBMEU7d0JBQy9FLHdEQUF3RDtpQkFDN0QsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCx1RUFBdUU7WUFDdkUsd0NBQTJCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0QsZ0JBQWdCO2FBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7b0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSx5RUFBeUU7d0JBQzlFLHVFQUF1RTtpQkFDNUUsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCwyRUFBMkU7WUFDM0UsdUNBQTBCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUU7Z0JBQ3ZELHlCQUF5QjthQUMxQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDakIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO29CQUMzQixRQUFRLEVBQUUsUUFBUSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO29CQUN6RSxPQUFPLEVBQUUseUVBQXlFO3dCQUM5RSxzQkFBc0I7aUJBQzNCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBNUNELHNEQTRDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBmaW5kSW5wdXRzT25FbGVtZW50V2l0aFRhZyxcbiAgZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoVGFnLFxuICBNaWdyYXRpb24sXG4gIFJlc29sdmVkUmVzb3VyY2UsXG4gIFRhcmdldFZlcnNpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB3YWxrcyB0aHJvdWdoIGV2ZXJ5IGlubGluZSBvciBleHRlcm5hbCB0ZW1wbGF0ZSBhbmQgcmVwb3J0cyBpZiB0aGVyZVxuICogYXJlIG91dGRhdGVkIHVzYWdlcyBvZiB0aGUgQW5ndWxhciBNYXRlcmlhbCBBUEkgdGhhdCBuZWVkcyB0byBiZSB1cGRhdGVkIG1hbnVhbGx5LlxuICovXG5leHBvcnQgY2xhc3MgTWlzY1RlbXBsYXRlTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gNi4gVGhlIHJ1bGVcbiAgLy8gY3VycmVudGx5IG9ubHkgaW5jbHVkZXMgbWlncmF0aW9ucyBmb3IgVjYgZGVwcmVjYXRpb25zLlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY2O1xuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM5OCAodjYpXG4gICAgZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoVGFnKHRlbXBsYXRlLmNvbnRlbnQsICdzZWxlY3Rpb25DaGFuZ2UnLCBbXG4gICAgICAnbWF0LWxpc3Qtb3B0aW9uJ1xuICAgIF0pLmZvckVhY2gob2Zmc2V0ID0+IHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiB0ZW1wbGF0ZS5maWxlUGF0aCxcbiAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgbWVzc2FnZTogYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvdXRwdXQgYmluZGluZyBvbiBcIm1hdC1saXN0LW9wdGlvblwiLiBgICtcbiAgICAgICAgICAgIGBVc2UgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvbiBcIm1hdC1zZWxlY3Rpb24tbGlzdFwiIGluc3RlYWQuYFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MTMgKHY2KVxuICAgIGZpbmRPdXRwdXRzT25FbGVtZW50V2l0aFRhZyh0ZW1wbGF0ZS5jb250ZW50LCAnc2VsZWN0ZWRDaGFuZ2VkJywgW1xuICAgICAgJ21hdC1kYXRlcGlja2VyJ1xuICAgIF0pLmZvckVhY2gob2Zmc2V0ID0+IHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiB0ZW1wbGF0ZS5maWxlUGF0aCxcbiAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgbWVzc2FnZTogYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3RlZENoYW5nZWRcIiBvdXRwdXQgYmluZGluZyBvbiBcIm1hdC1kYXRlcGlja2VyXCIuIGAgK1xuICAgICAgICAgICAgYFVzZSBcImRhdGVDaGFuZ2VcIiBvciBcImRhdGVJbnB1dFwiIG9uIFwiPGlucHV0IFttYXREYXRlcGlja2VyXT5cIiBpbnN0ZWFkLmBcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9jb21taXQvZjBiZjZlNyAodjYpXG4gICAgZmluZElucHV0c09uRWxlbWVudFdpdGhUYWcodGVtcGxhdGUuY29udGVudCwgJ3NlbGVjdGVkJywgW1xuICAgICAgJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJ1xuICAgIF0pLmZvckVhY2gob2Zmc2V0ID0+IHtcbiAgICAgIHRoaXMuZmFpbHVyZXMucHVzaCh7XG4gICAgICAgIGZpbGVQYXRoOiB0ZW1wbGF0ZS5maWxlUGF0aCxcbiAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgbWVzc2FnZTogYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3RlZFwiIGlucHV0IGJpbmRpbmcgb24gXCJtYXQtcmFkaW8tYnV0dG9uLWdyb3VwXCIuIGAgK1xuICAgICAgICAgICAgYFVzZSBcInZhbHVlXCIgaW5zdGVhZC5gXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19