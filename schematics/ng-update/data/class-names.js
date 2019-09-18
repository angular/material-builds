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
        define("@angular/material/schematics/ng-update/data/class-names", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    exports.classNames = {
        [schematics_1.TargetVersion.V6]: [
            {
                pr: 'https://github.com/angular/components/pull/10291',
                changes: [
                    { replace: 'FloatPlaceholderType', replaceWith: 'FloatLabelType' },
                    { replace: 'MAT_PLACEHOLDER_GLOBAL_OPTIONS', replaceWith: 'MAT_LABEL_GLOBAL_OPTIONS' },
                    { replace: 'PlaceholderOptions', replaceWith: 'LabelOptions' }
                ]
            },
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9jbGFzcy1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUE0RjtJQUUvRSxRQUFBLFVBQVUsR0FBeUM7UUFDOUQsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCO2dCQUNFLEVBQUUsRUFBRSxrREFBa0Q7Z0JBQ3RELE9BQU8sRUFBRTtvQkFDUCxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUM7b0JBQ2hFLEVBQUMsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLFdBQVcsRUFBRSwwQkFBMEIsRUFBQztvQkFDcEYsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQztpQkFDN0Q7YUFDRjtTQUNGO0tBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NsYXNzTmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lczogVmVyc2lvbkNoYW5nZXM8Q2xhc3NOYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5MScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnRmxvYXRQbGFjZWhvbGRlclR5cGUnLCByZXBsYWNlV2l0aDogJ0Zsb2F0TGFiZWxUeXBlJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnTUFUX1BMQUNFSE9MREVSX0dMT0JBTF9PUFRJT05TJywgcmVwbGFjZVdpdGg6ICdNQVRfTEFCRUxfR0xPQkFMX09QVElPTlMnfSxcbiAgICAgICAge3JlcGxhY2U6ICdQbGFjZWhvbGRlck9wdGlvbnMnLCByZXBsYWNlV2l0aDogJ0xhYmVsT3B0aW9ucyd9XG4gICAgICBdXG4gICAgfSxcbiAgXVxufTtcbiJdfQ==