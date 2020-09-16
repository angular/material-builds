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
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/issues/20463',
            changes: ['MatChip', 'MatChipRemove']
        },
        {
            pr: 'https://github.com/angular/components/pull/20449',
            changes: ['MatDatepickerContent']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUFvRztBQUVwRzs7OztHQUlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBaUQ7SUFDN0UsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLG9EQUFvRDtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO1NBQ3RDO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO1NBQ2xDO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO1NBQzVCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUN2QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7U0FDM0I7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDcEM7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3hCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQztTQUN4QztLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDdkI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1NBQzFCO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLENBQUM7U0FDOUQ7UUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBQztRQUMvRSxFQUFDLEVBQUUsRUFBRSxvREFBb0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLEVBQUM7UUFDL0Y7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxvQkFBb0IsQ0FBQztTQUM5QztRQUNELEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsRUFBQztRQUM3RixFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLEVBQUU7WUFDeEYsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDO1NBQ3hDO1FBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQztRQUNyRixFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFDO0tBQzFGO0lBRUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztTQUM5QjtRQUNELEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7S0FDekY7SUFFRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsaURBQWlEO1lBQ3JELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO1NBQy9CO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO1NBQzdCO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztTQUM3QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGlEQUFpRDtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7U0FDekI7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG4vKipcbiAqIExpc3Qgb2YgY2xhc3MgbmFtZXMgZm9yIHdoaWNoIHRoZSBjb25zdHJ1Y3RvciBzaWduYXR1cmUgaGFzIGJlZW4gY2hhbmdlZC4gVGhlIG5ldyBjb25zdHJ1Y3RvclxuICogc2lnbmF0dXJlIHR5cGVzIGRvbid0IG5lZWQgdG8gYmUgc3RvcmVkIGhlcmUgYmVjYXVzZSB0aGUgc2lnbmF0dXJlIHdpbGwgYmUgZGV0ZXJtaW5lZFxuICogYXV0b21hdGljYWxseSB0aHJvdWdoIHR5cGUgY2hlY2tpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RvckNoZWNrczogVmVyc2lvbkNoYW5nZXM8Q29uc3RydWN0b3JDaGVja3NVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlYxMV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNDYzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q2hpcCcsICdNYXRDaGlwUmVtb3ZlJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNDQ5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGF0ZXBpY2tlckNvbnRlbnQnXVxuICAgIH1cbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzA3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzNzknLFxuICAgICAgY2hhbmdlczogWydNYXRTbGlkZXInXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzNzInLFxuICAgICAgY2hhbmdlczogWydNYXRTb3J0SGVhZGVyJ11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzI0JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciddXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTM2MycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFRvb2x0aXAnXVxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzMjMnLFxuICAgICAgY2hhbmdlczogWydNYXRJY29uJywgJ01hdEljb25SZWdpc3RyeSddXG4gICAgfVxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzIzMCcsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNlbGVjdCddXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzMzMycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERpYWxvZ1JlZiddXG4gICAgfVxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOF06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTY0NycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEZvcm1GaWVsZCcsICdNYXRUYWJMaW5rJywgJ01hdFZlcnRpY2FsU3RlcHBlciddXG4gICAgfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NTcnLCBjaGFuZ2VzOiBbJ01hdEJhZGdlJ119LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE1NzM0JywgY2hhbmdlczogWydNYXRCdXR0b24nLCAnTWF0QW5jaG9yJ119LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzYxJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U3Bpbm5lcicsICdNYXRQcm9ncmVzc1NwaW5uZXInXVxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzIzJywgY2hhbmdlczogWydNYXRMaXN0JywgJ01hdExpc3RJdGVtJ119LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTcyMicsIGNoYW5nZXM6IFsnTWF0RXhwYW5zaW9uUGFuZWwnXX0sIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzM3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0VGFiSGVhZGVyJywgJ01hdFRhYkJvZHknXVxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1ODA2JywgY2hhbmdlczogWydNYXRTbGlkZVRvZ2dsZSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NzMnLCBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRhaW5lciddfVxuICBdLFxuXG4gIFtUYXJnZXRWZXJzaW9uLlY3XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzExNzA2JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RHJhd2VyQ29udGVudCddLFxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzExNzA2JywgY2hhbmdlczogWydNYXRTaWRlbmF2Q29udGVudCddfVxuICBdLFxuXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzkxOTAnLFxuICAgICAgY2hhbmdlczogWydOYXRpdmVEYXRlQWRhcHRlciddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMTknLFxuICAgICAgY2hhbmdlczogWydNYXRBdXRvY29tcGxldGUnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzQ0JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0VG9vbHRpcCddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzODknLFxuICAgICAgY2hhbmdlczogWydNYXRJY29uUmVnaXN0cnknXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzk3NzUnLFxuICAgICAgY2hhbmdlczogWydNYXRDYWxlbmRhciddLFxuICAgIH0sXG4gIF1cbn07XG4iXX0=