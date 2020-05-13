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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQW9HO0lBRXBHOzs7O09BSUc7SUFDVSxRQUFBLGlCQUFpQixHQUFpRDtRQUM3RSxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO2FBQ3ZCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2FBQzFCO1NBQ0Y7UUFDRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsQ0FBQzthQUM5RDtZQUNELEVBQUMsRUFBRSxFQUFFLGtEQUFrRCxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDO1lBQy9FLEVBQUMsRUFBRSxFQUFFLG9EQUFvRCxFQUFFLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBQztZQUMvRjtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUM7YUFDOUM7WUFDRCxFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUM7WUFDN0YsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBQyxFQUFFO2dCQUN4RixFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDO2FBQ3hDO1lBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQztZQUNyRixFQUFDLEVBQUUsRUFBRSxrREFBa0QsRUFBRSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFDO1NBQzFGO1FBRUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO2FBQzlCO1lBQ0QsRUFBQyxFQUFFLEVBQUUsa0RBQWtELEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBQztTQUN6RjtRQUVELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNsQjtnQkFDRSxFQUFFLEVBQUUsaURBQWlEO2dCQUNyRCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzthQUMvQjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO2FBQzdCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQ3hCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7YUFDN0I7WUFDRDtnQkFDRSxFQUFFLEVBQUUsaURBQWlEO2dCQUNyRCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7YUFDekI7U0FDRjtLQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG4vKipcbiAqIExpc3Qgb2YgY2xhc3MgbmFtZXMgZm9yIHdoaWNoIHRoZSBjb25zdHJ1Y3RvciBzaWduYXR1cmUgaGFzIGJlZW4gY2hhbmdlZC4gVGhlIG5ldyBjb25zdHJ1Y3RvclxuICogc2lnbmF0dXJlIHR5cGVzIGRvbid0IG5lZWQgdG8gYmUgc3RvcmVkIGhlcmUgYmVjYXVzZSB0aGUgc2lnbmF0dXJlIHdpbGwgYmUgZGV0ZXJtaW5lZFxuICogYXV0b21hdGljYWxseSB0aHJvdWdoIHR5cGUgY2hlY2tpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBjb25zdHJ1Y3RvckNoZWNrczogVmVyc2lvbkNoYW5nZXM8Q29uc3RydWN0b3JDaGVja3NVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlY5XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MjMwJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2VsZWN0J11cbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MzMzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGlhbG9nUmVmJ11cbiAgICB9XG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY4XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NjQ3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Rm9ybUZpZWxkJywgJ01hdFRhYkxpbmsnLCAnTWF0VmVydGljYWxTdGVwcGVyJ11cbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc1NycsIGNoYW5nZXM6IFsnTWF0QmFkZ2UnXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTU3MzQnLCBjaGFuZ2VzOiBbJ01hdEJ1dHRvbicsICdNYXRBbmNob3InXX0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NjEnLFxuICAgICAgY2hhbmdlczogWydNYXRTcGlubmVyJywgJ01hdFByb2dyZXNzU3Bpbm5lciddXG4gICAgfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MjMnLCBjaGFuZ2VzOiBbJ01hdExpc3QnLCAnTWF0TGlzdEl0ZW0nXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzIyJywgY2hhbmdlczogWydNYXRFeHBhbnNpb25QYW5lbCddfSwge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MzcnLFxuICAgICAgY2hhbmdlczogWydNYXRUYWJIZWFkZXInLCAnTWF0VGFiQm9keSddXG4gICAgfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU4MDYnLCBjaGFuZ2VzOiBbJ01hdFNsaWRlVG9nZ2xlJ119LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc3MycsIGNoYW5nZXM6IFsnTWF0RHJhd2VyQ29udGFpbmVyJ119XG4gIF0sXG5cbiAgW1RhcmdldFZlcnNpb24uVjddOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTE3MDYnLFxuICAgICAgY2hhbmdlczogWydNYXREcmF3ZXJDb250ZW50J10sXG4gICAgfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTE3MDYnLCBjaGFuZ2VzOiBbJ01hdFNpZGVuYXZDb250ZW50J119XG4gIF0sXG5cbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTE5MCcsXG4gICAgICBjaGFuZ2VzOiBbJ05hdGl2ZURhdGVBZGFwdGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMxOScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEF1dG9jb21wbGV0ZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDQnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM4OScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEljb25SZWdpc3RyeSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTc3NScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENhbGVuZGFyJ10sXG4gICAgfSxcbiAgXVxufTtcbiJdfQ==