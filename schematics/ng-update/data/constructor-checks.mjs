"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructorChecks = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/**
 * List of class names for which the constructor signature has been changed. The new constructor
 * signature types don't need to be stored here because the signature will be determined
 * automatically through type checking.
 */
exports.constructorChecks = {
    [schematics_1.TargetVersion.V14]: [
        {
            pr: 'https://github.com/angular/components/pull/23327',
            changes: ['MatSelectionList', 'MatSelectionListChange'],
        },
    ],
    [schematics_1.TargetVersion.V13]: [
        {
            pr: 'https://github.com/angular/components/pull/23389',
            changes: ['MatFormField'],
        },
        {
            pr: 'https://github.com/angular/components/pull/23573',
            changes: ['MatDatepicker', 'MatDateRangePicker'],
        },
        {
            pr: 'https://github.com/angular/components/pull/23328',
            changes: ['MatStepper'],
        },
    ],
    [schematics_1.TargetVersion.V12]: [
        {
            pr: 'https://github.com/angular/components/pull/21897',
            changes: ['MatTooltip'],
        },
        {
            pr: 'https://github.com/angular/components/pull/21952',
            changes: ['MatDatepickerContent'],
        },
        {
            pr: 'https://github.com/angular/components/issues/21900',
            changes: ['MatVerticalStepper', 'MatStep'],
        },
    ],
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/issues/20463',
            changes: ['MatChip', 'MatChipRemove'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20449',
            changes: ['MatDatepickerContent'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20545',
            changes: ['MatBottomSheet', 'MatBottomSheetRef'],
        },
        {
            pr: 'https://github.com/angular/components/issues/20535',
            changes: ['MatCheckbox'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20499',
            changes: ['MatPaginatedTabHeader', 'MatTabBodyPortal', 'MatTabNav', 'MatTab'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20479',
            changes: ['MatCommonModule'],
        },
    ],
    [schematics_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19307',
            changes: ['MatSlideToggle'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19379',
            changes: ['MatSlider'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19372',
            changes: ['MatSortHeader'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19324',
            changes: ['MatAutocompleteTrigger'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19363',
            changes: ['MatTooltip'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19323',
            changes: ['MatIcon', 'MatIconRegistry'],
        },
    ],
    [schematics_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17230',
            changes: ['MatSelect'],
        },
        {
            pr: 'https://github.com/angular/components/pull/17333',
            changes: ['MatDialogRef'],
        },
    ],
    [schematics_1.TargetVersion.V8]: [
        {
            pr: 'https://github.com/angular/components/pull/15647',
            changes: ['MatFormField', 'MatTabLink', 'MatVerticalStepper'],
        },
        { pr: 'https://github.com/angular/components/pull/15757', changes: ['MatBadge'] },
        { pr: 'https://github.com/angular/components/issues/15734', changes: ['MatButton', 'MatAnchor'] },
        {
            pr: 'https://github.com/angular/components/pull/15761',
            changes: ['MatSpinner', 'MatProgressSpinner'],
        },
        { pr: 'https://github.com/angular/components/pull/15723', changes: ['MatList', 'MatListItem'] },
        { pr: 'https://github.com/angular/components/pull/15722', changes: ['MatExpansionPanel'] },
        {
            pr: 'https://github.com/angular/components/pull/15737',
            changes: ['MatTabHeader', 'MatTabBody'],
        },
        { pr: 'https://github.com/angular/components/pull/15806', changes: ['MatSlideToggle'] },
        { pr: 'https://github.com/angular/components/pull/15773', changes: ['MatDrawerContainer'] },
    ],
    [schematics_1.TargetVersion.V7]: [
        {
            pr: 'https://github.com/angular/components/pull/11706',
            changes: ['MatDrawerContent'],
        },
        { pr: 'https://github.com/angular/components/pull/11706', changes: ['MatSidenavContent'] },
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
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUFvRztBQUVwRzs7OztHQUlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBaUQ7SUFDN0UsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSx3QkFBd0IsQ0FBQztTQUN4RDtLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDMUI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDO1NBQ2pEO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDbEM7UUFDRDtZQUNFLEVBQUUsRUFBRSxvREFBb0Q7WUFDeEQsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDO1NBQzNDO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7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QUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1NBQzlCO1FBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBQztLQUN6RjtJQUVELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxpREFBaUQ7WUFDckQsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7U0FDL0I7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7U0FDN0I7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3hCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO1NBQzdCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsaURBQWlEO1lBQ3JELE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztTQUN6QjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnN0cnVjdG9yQ2hlY2tzVXBncmFkZURhdGEsIFRhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogTGlzdCBvZiBjbGFzcyBuYW1lcyBmb3Igd2hpY2ggdGhlIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSBoYXMgYmVlbiBjaGFuZ2VkLiBUaGUgbmV3IGNvbnN0cnVjdG9yXG4gKiBzaWduYXR1cmUgdHlwZXMgZG9uJ3QgbmVlZCB0byBiZSBzdG9yZWQgaGVyZSBiZWNhdXNlIHRoZSBzaWduYXR1cmUgd2lsbCBiZSBkZXRlcm1pbmVkXG4gKiBhdXRvbWF0aWNhbGx5IHRocm91Z2ggdHlwZSBjaGVja2luZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdG9yQ2hlY2tzOiBWZXJzaW9uQ2hhbmdlczxDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjE0XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIzMzI3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2VsZWN0aW9uTGlzdCcsICdNYXRTZWxlY3Rpb25MaXN0Q2hhbmdlJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjEzXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIzMzg5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Rm9ybUZpZWxkJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMzU3MycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERhdGVwaWNrZXInLCAnTWF0RGF0ZVJhbmdlUGlja2VyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMzMyOCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFN0ZXBwZXInXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WMTJdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjE4OTcnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMTk1MicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERhdGVwaWNrZXJDb250ZW50J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIxOTAwJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0VmVydGljYWxTdGVwcGVyJywgJ01hdFN0ZXAnXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WMTFdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDQ2MycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENoaXAnLCAnTWF0Q2hpcFJlbW92ZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA0NDknLFxuICAgICAgY2hhbmdlczogWydNYXREYXRlcGlja2VyQ29udGVudCddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA1NDUnLFxuICAgICAgY2hhbmdlczogWydNYXRCb3R0b21TaGVldCcsICdNYXRCb3R0b21TaGVldFJlZiddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDUzNScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENoZWNrYm94J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDQ5OScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFBhZ2luYXRlZFRhYkhlYWRlcicsICdNYXRUYWJCb2R5UG9ydGFsJywgJ01hdFRhYk5hdicsICdNYXRUYWInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNDc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q29tbW9uTW9kdWxlJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzA3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5Mzc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTM3MicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNvcnRIZWFkZXInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzI0JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzNjMnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTMyMycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEljb24nLCAnTWF0SWNvblJlZ2lzdHJ5J10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjldOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTcyMzAnLFxuICAgICAgY2hhbmdlczogWydNYXRTZWxlY3QnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MzMzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGlhbG9nUmVmJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjhdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU2NDcnLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnLCAnTWF0VGFiTGluaycsICdNYXRWZXJ0aWNhbFN0ZXBwZXInXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc1NycsIGNoYW5nZXM6IFsnTWF0QmFkZ2UnXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTU3MzQnLCBjaGFuZ2VzOiBbJ01hdEJ1dHRvbicsICdNYXRBbmNob3InXX0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NjEnLFxuICAgICAgY2hhbmdlczogWydNYXRTcGlubmVyJywgJ01hdFByb2dyZXNzU3Bpbm5lciddLFxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzIzJywgY2hhbmdlczogWydNYXRMaXN0JywgJ01hdExpc3RJdGVtJ119LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTcyMicsIGNoYW5nZXM6IFsnTWF0RXhwYW5zaW9uUGFuZWwnXX0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MzcnLFxuICAgICAgY2hhbmdlczogWydNYXRUYWJIZWFkZXInLCAnTWF0VGFiQm9keSddLFxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1ODA2JywgY2hhbmdlczogWydNYXRTbGlkZVRvZ2dsZSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NzMnLCBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRhaW5lciddfSxcbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRlbnQnXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsIGNoYW5nZXM6IFsnTWF0U2lkZW5hdkNvbnRlbnQnXX0sXG4gIF0sXG5cbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTE5MCcsXG4gICAgICBjaGFuZ2VzOiBbJ05hdGl2ZURhdGVBZGFwdGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMxOScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEF1dG9jb21wbGV0ZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDQnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM4OScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEljb25SZWdpc3RyeSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTc3NScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENhbGVuZGFyJ10sXG4gICAgfSxcbiAgXSxcbn07XG4iXX0=