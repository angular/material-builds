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
        define("@angular/material/schematics/ng-add/fonts/project-index-html", ["require", "exports", "@angular-devkit/schematics", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_2 = require("@angular/cdk/schematics");
    /** Looks for the index HTML file in the given project and returns its path. */
    function getIndexHtmlPath(project) {
        const buildOptions = schematics_2.getProjectTargetOptions(project, 'build');
        if (!buildOptions.index) {
            throw new schematics_1.SchematicsException('No project "index.html" file could be found.');
        }
        return buildOptions.index;
    }
    exports.getIndexHtmlPath = getIndexHtmlPath;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC1pbmRleC1odG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctYWRkL2ZvbnRzL3Byb2plY3QtaW5kZXgtaHRtbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUdILDJEQUErRDtJQUMvRCx3REFBZ0U7SUFHaEUsK0VBQStFO0lBQy9FLFNBQWdCLGdCQUFnQixDQUFDLE9BQXlCO1FBQ3hELE1BQU0sWUFBWSxHQUFHLG9DQUF1QixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUvRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUN2QixNQUFNLElBQUksZ0NBQW1CLENBQUMsOENBQThDLENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBUkQsNENBUUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtXb3Jrc3BhY2VQcm9qZWN0fSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9zcmMvZXhwZXJpbWVudGFsL3dvcmtzcGFjZSc7XG5pbXBvcnQge1NjaGVtYXRpY3NFeGNlcHRpb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0UHJvamVjdFRhcmdldE9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuXG4vKiogTG9va3MgZm9yIHRoZSBpbmRleCBIVE1MIGZpbGUgaW4gdGhlIGdpdmVuIHByb2plY3QgYW5kIHJldHVybnMgaXRzIHBhdGguICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kZXhIdG1sUGF0aChwcm9qZWN0OiBXb3Jrc3BhY2VQcm9qZWN0KTogc3RyaW5nIHtcbiAgY29uc3QgYnVpbGRPcHRpb25zID0gZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMocHJvamVjdCwgJ2J1aWxkJyk7XG5cbiAgaWYgKCFidWlsZE9wdGlvbnMuaW5kZXgpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignTm8gcHJvamVjdCBcImluZGV4Lmh0bWxcIiBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICB9XG5cbiAgcmV0dXJuIGJ1aWxkT3B0aW9ucy5pbmRleDtcbn1cbiJdfQ==