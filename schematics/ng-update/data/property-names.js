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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9wcm9wZXJ0eS1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUErRjtJQUVsRixRQUFBLGFBQWEsR0FBNEM7UUFDcEUsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUCxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDLEVBQUMsRUFBRTt3QkFDeEYsT0FBTyxFQUFFLFFBQVE7d0JBQ2pCLFdBQVcsRUFBRSw2Q0FBNkM7d0JBQzFELFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO3FCQUNwQztvQkFDRDt3QkFDRSxPQUFPLEVBQUUsU0FBUzt3QkFDbEIsV0FBVyxFQUFFLDhDQUE4Qzt3QkFDM0QsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7cUJBQ3BDO2lCQUNGO2FBQ0Y7WUFFRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQzt3QkFDUixPQUFPLEVBQUUsT0FBTzt3QkFDaEIsV0FBVyxFQUFFLGVBQWU7d0JBQzVCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFDO3FCQUMxRCxDQUFDO2FBQ0g7WUFFRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQzt3QkFDUixPQUFPLEVBQUUsY0FBYzt3QkFD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TyxFQUFFLENBQUM7d0JBQ1IsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsV0FBVyxFQUFFLFVBQVU7d0JBQ3ZCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDO3FCQUNyQyxDQUFDO2FBQ0g7WUFFRDtnQkFDRSxFQUFFLEVBQUUsa0RBQWtEO2dCQUN0RCxPQUFPLEVBQUU7b0JBQ1A7d0JBQ0UsT0FBTyxFQUFFLHVCQUF1Qjt3QkFDaEMsV0FBVyxFQUFFLFlBQVk7d0JBQ3pCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO3FCQUNwQztvQkFDRDt3QkFDRSxPQUFPLEVBQUUseUJBQXlCO3dCQUNsQyxXQUFXLEVBQUUsY0FBYzt3QkFDM0IsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7cUJBQ3BDO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQcm9wZXJ0eU5hbWVVcGdyYWRlRGF0YSwgVGFyZ2V0VmVyc2lvbiwgVmVyc2lvbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGNvbnN0IHByb3BlcnR5TmFtZXM6IFZlcnNpb25DaGFuZ2VzPFByb3BlcnR5TmFtZVVwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAxNjMnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ2NoYW5nZScsIHJlcGxhY2VXaXRoOiAnc2VsZWN0aW9uQ2hhbmdlJywgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRTZWxlY3QnXX19LCB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uT3BlbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIoaXNPcGVuID0+IGlzT3BlbikpJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFNlbGVjdCddfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uQ2xvc2UnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKGlzT3BlbiA9PiAhaXNPcGVuKSknLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0U2VsZWN0J119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyMTgnLFxuICAgICAgY2hhbmdlczogW3tcbiAgICAgICAgcmVwbGFjZTogJ2FsaWduJyxcbiAgICAgICAgcmVwbGFjZVdpdGg6ICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRSYWRpb0dyb3VwJywgJ01hdFJhZGlvQnV0dG9uJ119XG4gICAgICB9XVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI1MycsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAnZXh0cmFDbGFzc2VzJyxcbiAgICAgICAgcmVwbGFjZVdpdGg6ICdwYW5lbENsYXNzJyxcbiAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRTbmFja0JhckNvbmZpZyddfVxuICAgICAgfV1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyNzknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2FsaWduJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdERyYXdlcicsICdNYXRTaWRlbmF2J119XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25BbGlnbkNoYW5nZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb25Qb3NpdGlvbkNoYW5nZWQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbk9wZW4nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKGlzT3BlbiA9PiBpc09wZW4pKScsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXREcmF3ZXInLCAnTWF0U2lkZW5hdiddfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uQ2xvc2UnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKGlzT3BlbiA9PiAhaXNPcGVuKSknLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5MycsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAnc2hvdWxkUGxhY2Vob2xkZXJGbG9hdCcsXG4gICAgICAgIHJlcGxhY2VXaXRoOiAnc2hvdWxkTGFiZWxGbG9hdCcsXG4gICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkQ29udHJvbCcsICdNYXRTZWxlY3QnXX1cbiAgICAgIH1dXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjk0JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdkaXZpZGVyQ29sb3InLCByZXBsYWNlV2l0aDogJ2NvbG9yJywgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRGb3JtRmllbGQnXX19LCB7XG4gICAgICAgICAgcmVwbGFjZTogJ2Zsb2F0UGxhY2Vob2xkZXInLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnZmxvYXRMYWJlbCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRGb3JtRmllbGQnXX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMwOScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnc2VsZWN0Q2hhbmdlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3NlbGVjdGVkVGFiQ2hhbmdlJyxcbiAgICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFRhYkdyb3VwJ119XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX2R5bmFtaWNIZWlnaHREZXByZWNhdGVkJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2R5bmFtaWNIZWlnaHQnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0VGFiR3JvdXAnXX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMxMScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnZGVzdHJveScsIHJlcGxhY2VXaXRoOiAnZGVzdHJveWVkJywgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRDaGlwJ119fSxcbiAgICAgICAge3JlcGxhY2U6ICdvblJlbW92ZScsIHJlcGxhY2VXaXRoOiAncmVtb3ZlZCcsIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Q2hpcCddfX1cbiAgICAgIF1cbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDInLFxuICAgICAgY2hhbmdlczpcbiAgICAgICAgICBbe3JlcGxhY2U6ICdhbGlnbicsIHJlcGxhY2VXaXRoOiAnbGFiZWxQb3NpdGlvbicsIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0Q2hlY2tib3gnXX19XVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM0NCcsXG4gICAgICBjaGFuZ2VzOiBbe1xuICAgICAgICByZXBsYWNlOiAnX3Bvc2l0aW9uRGVwcmVjYXRlZCcsXG4gICAgICAgIHJlcGxhY2VXaXRoOiAncG9zaXRpb24nLFxuICAgICAgICB3aGl0ZWxpc3Q6IHtjbGFzc2VzOiBbJ01hdFRvb2x0aXAnXX1cbiAgICAgIH1dXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzczJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfdGh1bWJMYWJlbERlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAndGh1bWJMYWJlbCcsXG4gICAgICAgICAgd2hpdGVsaXN0OiB7Y2xhc3NlczogWydNYXRTbGlkZXInXX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfdGlja0ludGVydmFsRGVwcmVjYXRlZCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICd0aWNrSW50ZXJ2YWwnLFxuICAgICAgICAgIHdoaXRlbGlzdDoge2NsYXNzZXM6IFsnTWF0U2xpZGVyJ119XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICBdXG59O1xuIl19