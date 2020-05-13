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
        define("@angular/material/schematics/ng-update/data/constructor-checks", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /**
     * List of class names for which the constructor signature has been changed. The new constructor
     * signature types don't need to be stored here because the signature will be determined
     * automatically through type checking.
     */
    exports.constructorChecks = {
        [schematics_1.TargetVersion.V10]: [
            {
                pr: 'https://github.com/angular/components/pull/19307',
                changes: ['MatSlideToggle']
            }
        ],
        [schematics_1.TargetVersion.V9]: [
            {
                pr: 'https://github.com/angular/components/pull/17230',
                changes: ['MatSelect']
            },
            {
                pr: 'https://github.com/angular/components/pull/17333',
                changes: ['MatDialogRef']
            }
        ],
        [schematics_1.TargetVersion.V8]: [
            {
                pr: 'https://github.com/angular/components/pull/15647',
                changes: ['MatFormField', 'MatTabLink', 'MatVerticalStepper']
            },
            { pr: 'https://github.com/angular/components/pull/15757', changes: ['MatBadge'] },
            { pr: 'https://github.com/angular/components/issues/15734', changes: ['MatButton', 'MatAnchor'] },
            {
                pr: 'https://github.com/angular/components/pull/15761',
                changes: ['MatSpinner', 'MatProgressSpinner']
            },
            { pr: 'https://github.com/angular/components/pull/15723', changes: ['MatList', 'MatListItem'] },
            { pr: 'https://github.com/angular/components/pull/15722', changes: ['MatExpansionPanel'] }, {
                pr: 'https://github.com/angular/components/pull/15737',
                changes: ['MatTabHeader', 'MatTabBody']
            },
            { pr: 'https://github.com/angular/components/pull/15806', changes: ['MatSlideToggle'] },
            { pr: 'https://github.com/angular/components/pull/15773', changes: ['MatDrawerContainer'] }
        ],
        [schematics_1.TargetVersion.V7]: [
            {
                pr: 'https://github.com/angular/components/pull/11706',
                changes: ['MatDrawerContent'],
            },
            { pr: 'https://github.com/angular/components/pull/11706', changes: ['MatSidenavContent'] }
        ],
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/9190',
                changes: ['NativeDateAdapter'],
            },
            {
                pr: 'https://github.com/angular/components/pull/10319',
                changes: ['MatAutocomplete'],
            },
            {
                pr: 'https://github.com/angular/components/pull/10344',
                changes: ['MatTooltip'],
            },
            {
                pr: 'https://github.com/angular/components/pull/10389',
                changes: ['MatIconRegistry'],
            },
            {
                pr: 'https://github.com/angular/components/pull/9775',
                changes: ['MatCalendar'],
            },
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQW9HO0lBRXBHOzs7O09BSUc7SUFDVSxRQUFBLGlCQUFpQixHQUFpRDtRQUM3RSxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7YUFDNUI7U0FDRjtRQUNELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNsQjtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDdkI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7YUFDMUI7U0FDRjtRQUNELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNsQjtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixDQUFDO2FBQzlEO1lBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUM7WUFDL0UsRUFBQyxFQUFFLEVBQUUsb0RBQW9ELEVBQUUsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFDO1lBQy9GO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxvQkFBb0IsQ0FBQzthQUM5QztZQUNELEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsRUFBQztZQUM3RixFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLEVBQUU7Z0JBQ3hGLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUM7YUFDeEM7WUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDO1lBQ3JGLEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUM7U0FDMUY7UUFFRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7YUFDOUI7WUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO1NBQ3pGO1FBRUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxpREFBaUQ7Z0JBQ3JELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2FBQy9CO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7YUFDN0I7WUFDRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDeEI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzthQUM3QjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxpREFBaUQ7Z0JBQ3JELE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQzthQUN6QjtTQUNGO0tBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnN0cnVjdG9yQ2hlY2tzVXBncmFkZURhdGEsIFRhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogTGlzdCBvZiBjbGFzcyBuYW1lcyBmb3Igd2hpY2ggdGhlIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSBoYXMgYmVlbiBjaGFuZ2VkLiBUaGUgbmV3IGNvbnN0cnVjdG9yXG4gKiBzaWduYXR1cmUgdHlwZXMgZG9uJ3QgbmVlZCB0byBiZSBzdG9yZWQgaGVyZSBiZWNhdXNlIHRoZSBzaWduYXR1cmUgd2lsbCBiZSBkZXRlcm1pbmVkXG4gKiBhdXRvbWF0aWNhbGx5IHRocm91Z2ggdHlwZSBjaGVja2luZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdG9yQ2hlY2tzOiBWZXJzaW9uQ2hhbmdlczxDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzA3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXVxuICAgIH1cbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjldOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTcyMzAnLFxuICAgICAgY2hhbmdlczogWydNYXRTZWxlY3QnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTczMzMnLFxuICAgICAgY2hhbmdlczogWydNYXREaWFsb2dSZWYnXVxuICAgIH1cbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjhdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU2NDcnLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnLCAnTWF0VGFiTGluaycsICdNYXRWZXJ0aWNhbFN0ZXBwZXInXVxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzU3JywgY2hhbmdlczogWydNYXRCYWRnZSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNTczNCcsIGNoYW5nZXM6IFsnTWF0QnV0dG9uJywgJ01hdEFuY2hvciddfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc2MScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNwaW5uZXInLCAnTWF0UHJvZ3Jlc3NTcGlubmVyJ11cbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTcyMycsIGNoYW5nZXM6IFsnTWF0TGlzdCcsICdNYXRMaXN0SXRlbSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MjInLCBjaGFuZ2VzOiBbJ01hdEV4cGFuc2lvblBhbmVsJ119LCB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTczNycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFRhYkhlYWRlcicsICdNYXRUYWJCb2R5J11cbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTgwNicsIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzczJywgY2hhbmdlczogWydNYXREcmF3ZXJDb250YWluZXInXX1cbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRlbnQnXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsIGNoYW5nZXM6IFsnTWF0U2lkZW5hdkNvbnRlbnQnXX1cbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC85MTkwJyxcbiAgICAgIGNoYW5nZXM6IFsnTmF0aXZlRGF0ZUFkYXB0ZXInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzE5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0QXV0b2NvbXBsZXRlJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM0NCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFRvb2x0aXAnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzg5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0SWNvblJlZ2lzdHJ5J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC85Nzc1JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q2FsZW5kYXInXSxcbiAgICB9LFxuICBdXG59O1xuIl19