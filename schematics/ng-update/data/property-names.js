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
        define("@angular/material/schematics/ng-update/data/property-names", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    exports.propertyNames = {
        [schematics_1.TargetVersion.V9]: [
            {
                pr: 'https://github.com/angular/components/pull/17333',
                changes: [
                    {
                        replace: 'afterOpen',
                        replaceWith: 'afterOpened',
                        whitelist: { classes: ['MatDialogRef'] }
                    },
                    {
                        replace: 'beforeClose',
                        replaceWith: 'beforeClosed',
                        whitelist: { classes: ['MatDialogRef'] }
                    },
                    {
                        replace: 'afterOpen',
                        replaceWith: 'afterOpened',
                        whitelist: { classes: ['MatDialog'] }
                    }
                ]
            }
        ],
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/10163',
                changes: [
                    { replace: 'change', replaceWith: 'selectionChange', whitelist: { classes: ['MatSelect'] } }, {
                        replace: 'onOpen',
                        replaceWith: 'openedChange.pipe(filter(isOpen => isOpen))',
                        whitelist: { classes: ['MatSelect'] }
                    },
                    {
                        replace: 'onClose',
                        replaceWith: 'openedChange.pipe(filter(isOpen => !isOpen))',
                        whitelist: { classes: ['MatSelect'] }
                    }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10218',
                changes: [{
                        replace: 'align',
                        replaceWith: 'labelPosition',
                        whitelist: { classes: ['MatRadioGroup', 'MatRadioButton'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10253',
                changes: [{
                        replace: 'extraClasses',
                        replaceWith: 'panelClass',
                        whitelist: { classes: ['MatSnackBarConfig'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10279',
                changes: [
                    {
                        replace: 'align',
                        replaceWith: 'position',
                        whitelist: { classes: ['MatDrawer', 'MatSidenav'] }
                    },
                    {
                        replace: 'onAlignChanged',
                        replaceWith: 'onPositionChanged',
                        whitelist: { classes: ['MatDrawer', 'MatSidenav'] }
                    },
                    {
                        replace: 'onOpen',
                        replaceWith: 'openedChange.pipe(filter(isOpen => isOpen))',
                        whitelist: { classes: ['MatDrawer', 'MatSidenav'] }
                    },
                    {
                        replace: 'onClose',
                        replaceWith: 'openedChange.pipe(filter(isOpen => !isOpen))',
                        whitelist: { classes: ['MatDrawer', 'MatSidenav'] }
                    }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10293',
                changes: [{
                        replace: 'shouldPlaceholderFloat',
                        replaceWith: 'shouldLabelFloat',
                        whitelist: { classes: ['MatFormFieldControl', 'MatSelect'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10294',
                changes: [
                    { replace: 'dividerColor', replaceWith: 'color', whitelist: { classes: ['MatFormField'] } }, {
                        replace: 'floatPlaceholder',
                        replaceWith: 'floatLabel',
                        whitelist: { classes: ['MatFormField'] }
                    }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10309',
                changes: [
                    {
                        replace: 'selectChange',
                        replaceWith: 'selectedTabChange',
                        whitelist: { classes: ['MatTabGroup'] }
                    },
                    {
                        replace: '_dynamicHeightDeprecated',
                        replaceWith: 'dynamicHeight',
                        whitelist: { classes: ['MatTabGroup'] }
                    }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10311',
                changes: [
                    { replace: 'destroy', replaceWith: 'destroyed', whitelist: { classes: ['MatChip'] } },
                    { replace: 'onRemove', replaceWith: 'removed', whitelist: { classes: ['MatChip'] } }
                ]
            },
            {
                pr: 'https://github.com/angular/components/pull/10342',
                changes: [{ replace: 'align', replaceWith: 'labelPosition', whitelist: { classes: ['MatCheckbox'] } }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10344',
                changes: [{
                        replace: '_positionDeprecated',
                        replaceWith: 'position',
                        whitelist: { classes: ['MatTooltip'] }
                    }]
            },
            {
                pr: 'https://github.com/angular/components/pull/10373',
                changes: [
                    {
                        replace: '_thumbLabelDeprecated',
                        replaceWith: 'thumbLabel',
                        whitelist: { classes: ['MatSlider'] }
                    },
                    {
                        replace: '_tickIntervalDeprecated',
                        replaceWith: 'tickInterval',
                        whitelist: { classes: ['MatSlider'] }
                    }
                ]
            },
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9wcm9wZXJ0eS1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUErRjtJQUVsRixRQUFBLGFBQWEsR0FBNEM7UUFDcEUsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxPQUFPLEVBQUUsV0FBVzt3QkFDcEIsV0FBVyxFQUFFLGFBQWE7d0JBQzFCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFDO3FCQUN2QztvQkFDRDt3QkFDRSxPQUFPLEVBQUUsYUFBYTt3QkFDdEIsV0FBVyxFQUFFLGNBQWM7d0JBQzNCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFDO3FCQUN2QztvQkFDRDt3QkFDRSxPQUFPLEVBQUUsV0FBVzt3QkFDcEIsV0FBVyxFQUFFLGFBQWE7d0JBQzFCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO3FCQUNwQztpQkFDRjthQUNGO1NBQ0Y7UUFDRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbEI7Z0JBQ0UsRUFBRSxFQUFFLGtEQUFrRDtnQkFDdEQsT0FBTyxFQUFFO29CQUNQLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUMsRUFBQyxFQUFFO3dCQUN4RixPQUFPLEVBQUUsUUFBUTt3QkFDakIsV0FBVyxFQUFFLDZDQUE2Qzt3QkFDMUQs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IEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1Byb3BlcnR5TmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3QgcHJvcGVydHlOYW1lczogVmVyc2lvbkNoYW5nZXM8UHJvcGVydHlOYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WOV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzMzMycsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWZ0ZXJPcGVuJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2FmdGVyT3BlbmVkJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdERpYWxvZ1JlZiddfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2JlZm9yZUNsb3NlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2JlZm9yZUNsb3NlZCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXREaWFsb2dSZWYnXX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdhZnRlck9wZW4nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnYWZ0ZXJPcGVuZWQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0RGlhbG9nJ119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMTYzJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdjaGFuZ2UnLCByZXBsYWNlV2l0aDogJ3NlbGVjdGlvbkNoYW5nZScsIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0U2VsZWN0J119fSwge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbk9wZW4nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKGlzT3BlbiA9PiBpc09wZW4pKScsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRTZWxlY3QnXX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbkNsb3NlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZENoYW5nZS5waXBlKGZpbHRlcihpc09wZW4gPT4gIWlzT3BlbikpJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFNlbGVjdCddfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjE4JyxcbiAgICAgIGNoYW5nZXM6IFt7XG4gICAgICAgIHJlcGxhY2U6ICdhbGlnbicsXG4gICAgICAgIHJlcGxhY2VXaXRoOiAnbGFiZWxQb3NpdGlvbicsXG4gICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0UmFkaW9Hcm91cCcsICdNYXRSYWRpb0J1dHRvbiddfVxuICAgICAgfV1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyNTMnLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJ2V4dHJhQ2xhc3NlcycsXG4gICAgICAgIHJlcGxhY2VXaXRoOiAncGFuZWxDbGFzcycsXG4gICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0U25hY2tCYXJDb25maWcnXX1cbiAgICAgIH1dXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjc5JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdhbGlnbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdwb3NpdGlvbicsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXREcmF3ZXInLCAnTWF0U2lkZW5hdiddfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uQWxpZ25DaGFuZ2VkJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29uUG9zaXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdERyYXdlcicsICdNYXRTaWRlbmF2J119XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25PcGVuJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZENoYW5nZS5waXBlKGZpbHRlcihpc09wZW4gPT4gaXNPcGVuKSknLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbkNsb3NlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZENoYW5nZS5waXBlKGZpbHRlcihpc09wZW4gPT4gIWlzT3BlbikpJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdERyYXdlcicsICdNYXRTaWRlbmF2J119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyOTMnLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJ3Nob3VsZFBsYWNlaG9sZGVyRmxvYXQnLFxuICAgICAgICByZXBsYWNlV2l0aDogJ3Nob3VsZExhYmVsRmxvYXQnLFxuICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdEZvcm1GaWVsZENvbnRyb2wnLCAnTWF0U2VsZWN0J119XG4gICAgICB9XVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5NCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnZGl2aWRlckNvbG9yJywgcmVwbGFjZVdpdGg6ICdjb2xvcicsIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkJ119fSwge1xuICAgICAgICAgIHJlcGxhY2U6ICdmbG9hdFBsYWNlaG9sZGVyJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2Zsb2F0TGFiZWwnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkJ119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMDknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ3NlbGVjdENoYW5nZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdzZWxlY3RlZFRhYkNoYW5nZScsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRUYWJHcm91cCddfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19keW5hbWljSGVpZ2h0RGVwcmVjYXRlZCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdkeW5hbWljSGVpZ2h0JyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFRhYkdyb3VwJ119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMTEnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ2Rlc3Ryb3knLCByZXBsYWNlV2l0aDogJ2Rlc3Ryb3llZCcsIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Q2hpcCddfX0sXG4gICAgICAgIHtyZXBsYWNlOiAnb25SZW1vdmUnLCByZXBsYWNlV2l0aDogJ3JlbW92ZWQnLCB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdENoaXAnXX19XG4gICAgICBdXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzQyJyxcbiAgICAgIGNoYW5nZXM6XG4gICAgICAgICAgW3tyZXBsYWNlOiAnYWxpZ24nLCByZXBsYWNlV2l0aDogJ2xhYmVsUG9zaXRpb24nLCB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdENoZWNrYm94J119fV1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDQnLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJ19wb3NpdGlvbkRlcHJlY2F0ZWQnLFxuICAgICAgICByZXBsYWNlV2l0aDogJ3Bvc2l0aW9uJyxcbiAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRUb29sdGlwJ119XG4gICAgICB9XVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM3MycsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX3RodW1iTGFiZWxEZXByZWNhdGVkJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3RodW1iTGFiZWwnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0U2xpZGVyJ119XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX3RpY2tJbnRlcnZhbERlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAndGlja0ludGVydmFsJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFNsaWRlciddfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgXVxufTtcbiJdfQ==