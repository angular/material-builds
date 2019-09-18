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
        define("@angular/material/schematics/ng-update/data/input-names", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    exports.inputNames = {
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/10218',
                changes: [{
                        replace: 'align',
                        replaceWith: 'labelPosition',
                        whitelist: { elements: ['mat-radio-group', 'mat-radio-button'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10279',
                changes: [{
                        replace: 'align',
                        replaceWith: 'position',
                        whitelist: { elements: ['mat-drawer', 'mat-sidenav'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10294',
                changes: [
                    { replace: 'dividerColor', replaceWith: 'color', whitelist: { elements: ['mat-form-field'] } },
                    {
                        replace: 'floatPlaceholder',
                        replaceWith: 'floatLabel',
                        whitelist: { elements: ['mat-form-field'] }
                    }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10309',
                changes: [{
                        replace: 'mat-dynamic-height',
                        replaceWith: 'dynamicHeight',
                        whitelist: { elements: ['mat-tab-group'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10342',
                changes: [
                    { replace: 'align', replaceWith: 'labelPosition', whitelist: { elements: ['mat-checkbox'] } }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10344',
                changes: [{
                        replace: 'tooltip-position',
                        replaceWith: 'matTooltipPosition',
                        whitelist: { attributes: ['matTooltip'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10373',
                changes: [
                    { replace: 'thumb-label', replaceWith: 'thumbLabel', whitelist: { elements: ['mat-slider'] } },
                    {
                        replace: 'tick-interval',
                        replaceWith: 'tickInterval',
                        whitelist: { elements: ['mat-slider'] }
                    }
                ]
            }
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9pbnB1dC1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUE0RjtJQUUvRSxRQUFBLFVBQVUsR0FBeUM7UUFDOUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixXQUFXLEVBQUUsZUFBZTt3QkFDNUIsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLENBQUMsRUFBQztxQkFDL0QsQ0FBQzthQUNIO1lBRUQ7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUM7d0JBQ1IsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLFdBQVcsRUFBRSxVQUFVO3dCQUN2QixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLEVBQUM7cUJBQ3JELENBQUM7YUFDSDtZQUVEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEVBQUM7b0JBQzFGO3dCQUNFLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLFdBQVcsRUFBRSxZQUFZO3dCQUN6QixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDO3FCQUMxQztpQkFDRjthQUNGO1lBRUQ7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFLENBQUM7d0JBQ1IsT0FBTyxFQUFFLG9CQUFvQjt3QkFDN0IsV0FBVyxFQUFFLGVBQWU7d0JBQzVCLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFDO3FCQUN6QyxDQUFDO2FBQ0g7WUFFRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUU7b0JBQ1AsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUMsRUFBQztpQkFDMUY7YUFDRjtZQUVEO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLFdBQVcsRUFBRSxvQkFBb0I7d0JBQ2pDLFNBQVMsRUFBRSxFQUFDLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDO3FCQUN4QyxDQUFDO2FBQ0g7WUFFRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUU7b0JBQ1AsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUMsRUFBQztvQkFDMUY7d0JBQ0UsT0FBTyxFQUFFLGVBQWU7d0JBQ3hCLFdBQVcsRUFBRSxjQUFjO3dCQUMzQixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBQztxQkFDdEM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0lucHV0TmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3QgaW5wdXROYW1lczogVmVyc2lvbkNoYW5nZXM8SW5wdXROYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDIxOCcsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAnYWxpZ24nLFxuICAgICAgICByZXBsYWNlV2l0aDogJ2xhYmVsUG9zaXRpb24nLFxuICAgICAgICB3aGl0ZWxpc3Q6IHtlbGVtZW50czogWydtYXQtcmFkaW8tZ3JvdXAnLCAnbWF0LXJhZGlvLWJ1dHRvbiddfVxuICAgICAgfV1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyNzknLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJ2FsaWduJyxcbiAgICAgICAgcmVwbGFjZVdpdGg6ICdwb3NpdGlvbicsXG4gICAgICAgIHdoaXRlbGlzdDoge2VsZW1lbnRzOiBbJ21hdC1kcmF3ZXInLCAnbWF0LXNpZGVuYXYnXX1cbiAgICAgIH1dXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjk0JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdkaXZpZGVyQ29sb3InLCByZXBsYWNlV2l0aDogJ2NvbG9yJywgd2hpdGVsaXN0OiB7ZWxlbWVudHM6IFsnbWF0LWZvcm0tZmllbGQnXX19LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2Zsb2F0UGxhY2Vob2xkZXInLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnZmxvYXRMYWJlbCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7ZWxlbWVudHM6IFsnbWF0LWZvcm0tZmllbGQnXX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMwOScsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAnbWF0LWR5bmFtaWMtaGVpZ2h0JyxcbiAgICAgICAgcmVwbGFjZVdpdGg6ICdkeW5hbWljSGVpZ2h0JyxcbiAgICAgICAgd2hpdGVsaXN0OiB7ZWxlbWVudHM6IFsnbWF0LXRhYi1ncm91cCddfVxuICAgICAgfV1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDInLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ2FsaWduJywgcmVwbGFjZVdpdGg6ICdsYWJlbFBvc2l0aW9uJywgd2hpdGVsaXN0OiB7ZWxlbWVudHM6IFsnbWF0LWNoZWNrYm94J119fVxuICAgICAgXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM0NCcsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAndG9vbHRpcC1wb3NpdGlvbicsXG4gICAgICAgIHJlcGxhY2VXaXRoOiAnbWF0VG9vbHRpcFBvc2l0aW9uJyxcbiAgICAgICAgd2hpdGVsaXN0OiB7YXR0cmlidXRlczogWydtYXRUb29sdGlwJ119XG4gICAgICB9XVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM3MycsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAndGh1bWItbGFiZWwnLCByZXBsYWNlV2l0aDogJ3RodW1iTGFiZWwnLCB3aGl0ZWxpc3Q6IHtlbGVtZW50czogWydtYXQtc2xpZGVyJ119fSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICd0aWNrLWludGVydmFsJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3RpY2tJbnRlcnZhbCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7ZWxlbWVudHM6IFsnbWF0LXNsaWRlciddfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuIl19