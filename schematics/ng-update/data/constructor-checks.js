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
    [schematics_1.TargetVersion.V13]: [
        {
            pr: 'https://github.com/angular/components/pull/23389',
            changes: ['MatFormField']
        },
        {
            pr: 'https://github.com/angular/components/pull/23573',
            changes: ['MatDatepicker', 'MatDateRangePicker']
        }
    ],
    [schematics_1.TargetVersion.V12]: [
        {
            pr: 'https://github.com/angular/components/pull/21897',
            changes: ['MatTooltip']
        },
        {
            pr: 'https://github.com/angular/components/pull/21952',
            changes: ['MatDatepickerContent']
        },
        {
            pr: 'https://github.com/angular/components/issues/21900',
            changes: ['MatVerticalStepper', 'MatStep']
        }
    ],
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/issues/20463',
            changes: ['MatChip', 'MatChipRemove']
        },
        {
            pr: 'https://github.com/angular/components/pull/20449',
            changes: ['MatDatepickerContent']
        },
        {
            pr: 'https://github.com/angular/components/pull/20545',
            changes: ['MatBottomSheet', 'MatBottomSheetRef']
        },
        {
            pr: 'https://github.com/angular/components/issues/20535',
            changes: ['MatCheckbox']
        },
        {
            pr: 'https://github.com/angular/components/pull/20499',
            changes: ['MatPaginatedTabHeader', 'MatTabBodyPortal', 'MatTabNav', 'MatTab']
        },
        {
            pr: 'https://github.com/angular/components/pull/20479',
            changes: ['MatCommonModule']
        }
    ],
    [schematics_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19307',
            changes: ['MatSlideToggle']
        },
        {
            pr: 'https://github.com/angular/components/pull/19379',
            changes: ['MatSlider']
        },
        {
            pr: 'https://github.com/angular/components/pull/19372',
            changes: ['MatSortHeader']
        },
        {
            pr: 'https://github.com/angular/components/pull/19324',
            changes: ['MatAutocompleteTrigger']
        },
        {
            pr: 'https://github.com/angular/components/pull/19363',
            changes: ['MatTooltip']
        },
        {
            pr: 'https://github.com/angular/components/pull/19323',
            changes: ['MatIcon', 'MatIconRegistry']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUFvRztBQUVwRzs7OztHQUlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBaUQ7SUFDN0UsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDMUI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDO1NBQ2pEO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNsQztRQUNEO1lBQ0UsRUFBRSxFQUFFLG9EQUFvRDtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUM7U0FDM0M7S0FDRjtJQUNELENBQUMsMEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxvREFBb0Q7WUFDeEQsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztTQUN0QztRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNsQztRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztTQUNqRDtRQUNEO1lBQ0UsRUFBRSxFQUFFLG9EQUFvRDtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7U0FDekI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQztTQUM5RTtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztTQUM3QjtLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUM1QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDdkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzNCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3BDO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUM7U0FDeEM7S0FDRjtJQUNELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO1NBQ3ZCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztTQUMxQjtLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixDQUFDO1NBQzlEO1FBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUM7UUFDL0UsRUFBQyxFQUFFLEVBQUUsb0RBQW9ELEVBQUUsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFDO1FBQy9GO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUM7U0FDOUM7UUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUM7UUFDN0YsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBQyxFQUFFO1lBQ3hGLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQztTQUN4QztRQUNELEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUM7UUFDckYsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBQztLQUMxRjtJQUVELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7U0FDOUI7UUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO0tBQ3pGO0lBRUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGlEQUFpRDtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztTQUMvQjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztTQUM3QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7U0FDN0I7UUFDRDtZQUNFLEVBQUUsRUFBRSxpREFBaUQ7WUFDckQsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RydWN0b3JDaGVja3NVcGdyYWRlRGF0YSwgVGFyZ2V0VmVyc2lvbiwgVmVyc2lvbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuLyoqXG4gKiBMaXN0IG9mIGNsYXNzIG5hbWVzIGZvciB3aGljaCB0aGUgY29uc3RydWN0b3Igc2lnbmF0dXJlIGhhcyBiZWVuIGNoYW5nZWQuIFRoZSBuZXcgY29uc3RydWN0b3JcbiAqIHNpZ25hdHVyZSB0eXBlcyBkb24ndCBuZWVkIHRvIGJlIHN0b3JlZCBoZXJlIGJlY2F1c2UgdGhlIHNpZ25hdHVyZSB3aWxsIGJlIGRldGVybWluZWRcbiAqIGF1dG9tYXRpY2FsbHkgdGhyb3VnaCB0eXBlIGNoZWNraW5nLlxuICovXG5leHBvcnQgY29uc3QgY29uc3RydWN0b3JDaGVja3M6IFZlcnNpb25DaGFuZ2VzPENvbnN0cnVjdG9yQ2hlY2tzVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WMTNdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjMzODknLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjM1NzMnLFxuICAgICAgY2hhbmdlczogWydNYXREYXRlcGlja2VyJywgJ01hdERhdGVSYW5nZVBpY2tlciddXG4gICAgfVxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WMTJdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjE4OTcnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIxOTUyJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGF0ZXBpY2tlckNvbnRlbnQnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMTkwMCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFZlcnRpY2FsU3RlcHBlcicsICdNYXRTdGVwJ11cbiAgICB9XG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlYxMV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNDYzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q2hpcCcsICdNYXRDaGlwUmVtb3ZlJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNDQ5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGF0ZXBpY2tlckNvbnRlbnQnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA1NDUnLFxuICAgICAgY2hhbmdlczogWydNYXRCb3R0b21TaGVldCcsICdNYXRCb3R0b21TaGVldFJlZiddXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNTM1JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q2hlY2tib3gnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA0OTknLFxuICAgICAgY2hhbmdlczogWydNYXRQYWdpbmF0ZWRUYWJIZWFkZXInLCAnTWF0VGFiQm9keVBvcnRhbCcsICdNYXRUYWJOYXYnLCAnTWF0VGFiJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNDc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q29tbW9uTW9kdWxlJ11cbiAgICB9XG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlYxMF06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTMwNycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNsaWRlVG9nZ2xlJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5Mzc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVyJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzcyJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U29ydEhlYWRlciddXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTMyNCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEF1dG9jb21wbGV0ZVRyaWdnZXInXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzNjMnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzIzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0SWNvbicsICdNYXRJY29uUmVnaXN0cnknXVxuICAgIH1cbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjldOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTcyMzAnLFxuICAgICAgY2hhbmdlczogWydNYXRTZWxlY3QnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTczMzMnLFxuICAgICAgY2hhbmdlczogWydNYXREaWFsb2dSZWYnXVxuICAgIH1cbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjhdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU2NDcnLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnLCAnTWF0VGFiTGluaycsICdNYXRWZXJ0aWNhbFN0ZXBwZXInXVxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzU3JywgY2hhbmdlczogWydNYXRCYWRnZSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNTczNCcsIGNoYW5nZXM6IFsnTWF0QnV0dG9uJywgJ01hdEFuY2hvciddfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc2MScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNwaW5uZXInLCAnTWF0UHJvZ3Jlc3NTcGlubmVyJ11cbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTcyMycsIGNoYW5nZXM6IFsnTWF0TGlzdCcsICdNYXRMaXN0SXRlbSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MjInLCBjaGFuZ2VzOiBbJ01hdEV4cGFuc2lvblBhbmVsJ119LCB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTczNycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFRhYkhlYWRlcicsICdNYXRUYWJCb2R5J11cbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTgwNicsIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzczJywgY2hhbmdlczogWydNYXREcmF3ZXJDb250YWluZXInXX1cbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRlbnQnXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsIGNoYW5nZXM6IFsnTWF0U2lkZW5hdkNvbnRlbnQnXX1cbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC85MTkwJyxcbiAgICAgIGNoYW5nZXM6IFsnTmF0aXZlRGF0ZUFkYXB0ZXInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzE5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0QXV0b2NvbXBsZXRlJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM0NCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFRvb2x0aXAnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzg5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0SWNvblJlZ2lzdHJ5J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC85Nzc1JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q2FsZW5kYXInXSxcbiAgICB9LFxuICBdXG59O1xuIl19