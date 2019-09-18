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
        define("@angular/material/schematics/ng-update/data/output-names", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    exports.outputNames = {
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/10163',
                changes: [
                    {
                        replace: 'change',
                        replaceWith: 'selectionChange',
                        whitelist: {
                            elements: ['mat-select'],
                        },
                    },
                    {
                        replace: 'onClose',
                        replaceWith: 'closed',
                        whitelist: {
                            elements: ['mat-select'],
                        },
                    },
                    {
                        replace: 'onOpen',
                        replaceWith: 'opened',
                        whitelist: {
                            elements: ['mat-select'],
                        },
                    },
                ],
            },
            {
                pr: 'https://github.com/angular/components/pull/10279',
                changes: [
                    {
                        replace: 'align-changed',
                        replaceWith: 'positionChanged',
                        whitelist: {
                            elements: ['mat-drawer', 'mat-sidenav'],
                        },
                    },
                    {
                        replace: 'close',
                        replaceWith: 'closed',
                        whitelist: {
                            elements: ['mat-drawer', 'mat-sidenav'],
                        },
                    },
                    {
                        replace: 'open',
                        replaceWith: 'opened',
                        whitelist: {
                            elements: ['mat-drawer', 'mat-sidenav'],
                        },
                    },
                ],
            },
            {
                pr: 'https://github.com/angular/components/pull/10309',
                changes: [
                    {
                        replace: 'selectChange',
                        replaceWith: 'selectedTabChange',
                        whitelist: {
                            elements: ['mat-tab-group'],
                        },
                    },
                ],
            },
            {
                pr: 'https://github.com/angular/components/pull/10311',
                changes: [
                    {
                        replace: 'remove',
                        replaceWith: 'removed',
                        whitelist: {
                            attributes: ['mat-chip', 'mat-basic-chip'],
                            elements: ['mat-chip', 'mat-basic-chip'],
                        },
                    },
                    {
                        replace: 'destroy',
                        replaceWith: 'destroyed',
                        whitelist: {
                            attributes: ['mat-chip', 'mat-basic-chip'],
                            elements: ['mat-chip', 'mat-basic-chip'],
                        },
                    },
                ],
            },
        ],
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LW5hbWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvb3V0cHV0LW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQTZGO0lBRWhGLFFBQUEsV0FBVyxHQUEwQztRQUNoRSxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFO29CQUNQO3dCQUNFLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixXQUFXLEVBQUUsaUJBQWlCO3dCQUM5QixTQUFTLEVBQUU7NEJBQ1QsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDO3lCQUN6QjtxQkFDRjtvQkFDRDt3QkFDRSxPQUFPLEVBQUUsU0FBUzt3QkFDbEIsV0FBVyxFQUFFLFFBQVE7d0JBQ3JCLFNBQVMsRUFBRTs0QkFDVCxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUM7eUJBQ3pCO3FCQUNGO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixXQUFXLEVBQUUsUUFBUTt3QkFDckIsU0FBUyxFQUFFOzRCQUNULFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQzt5QkFDekI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxPQUFPLEVBQUUsZUFBZTt3QkFDeEIsV0FBVyxFQUFFLGlCQUFpQjt3QkFDOUIsU0FBUyxFQUFFOzRCQUNULFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7eUJBQ3hDO3FCQUNGO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixXQUFXLEVBQUUsUUFBUTt3QkFDckIsU0FBUyxFQUFFOzRCQUNULFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7eUJBQ3hDO3FCQUNGO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxNQUFNO3dCQUNmLFdBQVcsRUFBRSxRQUFRO3dCQUNyQixTQUFTLEVBQUU7NEJBQ1QsUUFBUSxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQzt5QkFDeEM7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxPQUFPLEVBQUUsY0FBYzt3QkFDdkIsV0FBVyxFQUFFLG1CQUFtQjt3QkFDaEMsU0FBUyxFQUFFOzRCQUNULFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQzt5QkFDNUI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxPQUFPLEVBQUUsUUFBUTt3QkFDakIsV0FBVyxFQUFFLFNBQVM7d0JBQ3RCLFNBQVMsRUFBRTs0QkFDVCxVQUFVLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7NEJBQzFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQzt5QkFDekM7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLFNBQVM7d0JBQ2xCLFdBQVcsRUFBRSxXQUFXO3dCQUN4QixTQUFTLEVBQUU7NEJBQ1QsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDOzRCQUMxQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7eUJBQ3pDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPdXRwdXROYW1lVXBncmFkZURhdGEsIFRhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbmV4cG9ydCBjb25zdCBvdXRwdXROYW1lczogVmVyc2lvbkNoYW5nZXM8T3V0cHV0TmFtZVVwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAxNjMnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2NoYW5nZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdzZWxlY3Rpb25DaGFuZ2UnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LXNlbGVjdCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25DbG9zZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdjbG9zZWQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LXNlbGVjdCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25PcGVuJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7XG4gICAgICAgICAgICBlbGVtZW50czogWydtYXQtc2VsZWN0J10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjc5JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdhbGlnbi1jaGFuZ2VkJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3Bvc2l0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7XG4gICAgICAgICAgICBlbGVtZW50czogWydtYXQtZHJhd2VyJywgJ21hdC1zaWRlbmF2J10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdjbG9zZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdjbG9zZWQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LWRyYXdlcicsICdtYXQtc2lkZW5hdiddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb3BlbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuZWQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LWRyYXdlcicsICdtYXQtc2lkZW5hdiddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMwOScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnc2VsZWN0Q2hhbmdlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3NlbGVjdGVkVGFiQ2hhbmdlJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC10YWItZ3JvdXAnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMTEnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ3JlbW92ZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdyZW1vdmVkJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnbWF0LWNoaXAnLCAnbWF0LWJhc2ljLWNoaXAnXSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC1jaGlwJywgJ21hdC1iYXNpYy1jaGlwJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdkZXN0cm95JyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2Rlc3Ryb3llZCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ21hdC1jaGlwJywgJ21hdC1iYXNpYy1jaGlwJ10sXG4gICAgICAgICAgICBlbGVtZW50czogWydtYXQtY2hpcCcsICdtYXQtYmFzaWMtY2hpcCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59O1xuIl19