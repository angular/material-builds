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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-hammer-script-tags", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /**
     * Parses the specified HTML content and looks for "script" elements which
     * potentially import HammerJS. These elements will be returned.
     */
    function findHammerScriptImportElements(htmlContent) {
        const document = schematics_1.parse5.parse(htmlContent, { sourceCodeLocationInfo: true });
        const nodeQueue = [...document.childNodes];
        const result = [];
        while (nodeQueue.length) {
            const node = nodeQueue.shift();
            if (node.childNodes) {
                nodeQueue.push(...node.childNodes);
            }
            if (node.nodeName.toLowerCase() === 'script' && node.attrs.length !== 0) {
                const srcAttribute = node.attrs.find(a => a.name === 'src');
                if (srcAttribute && isPotentialHammerScriptReference(srcAttribute.value)) {
                    result.push(node);
                }
            }
        }
        return result;
    }
    exports.findHammerScriptImportElements = findHammerScriptImportElements;
    /**
     * Checks whether the specified source path is potentially referring to the
     * HammerJS script output.
     */
    function isPotentialHammerScriptReference(srcPath) {
        return /\/hammer(\.min)?\.js($|\?)/.test(srcPath);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdXBncmFkZS1ydWxlcy9oYW1tZXItZ2VzdHVyZXMtdjkvZmluZC1oYW1tZXItc2NyaXB0LXRhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBK0M7SUFFL0M7OztPQUdHO0lBQ0gsU0FBZ0IsOEJBQThCLENBQUMsV0FBbUI7UUFDaEUsTUFBTSxRQUFRLEdBQ1YsbUJBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQStCLENBQUM7UUFDNUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxNQUFNLE1BQU0sR0FBZ0MsRUFBRSxDQUFDO1FBRS9DLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUN2QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxFQUErQixDQUFDO1lBRTVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNwQztZQUVELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN2RSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7Z0JBQzVELElBQUksWUFBWSxJQUFJLGdDQUFnQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkI7YUFDRjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQXJCRCx3RUFxQkM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLGdDQUFnQyxDQUFDLE9BQWU7UUFDdkQsT0FBTyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlNX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIEhUTUwgY29udGVudCBhbmQgbG9va3MgZm9yIFwic2NyaXB0XCIgZWxlbWVudHMgd2hpY2hcbiAqIHBvdGVudGlhbGx5IGltcG9ydCBIYW1tZXJKUy4gVGhlc2UgZWxlbWVudHMgd2lsbCBiZSByZXR1cm5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50cyhodG1sQ29udGVudDogc3RyaW5nKTogcGFyc2U1LkRlZmF1bHRUcmVlRWxlbWVudFtdIHtcbiAgY29uc3QgZG9jdW1lbnQgPVxuICAgICAgcGFyc2U1LnBhcnNlKGh0bWxDb250ZW50LCB7c291cmNlQ29kZUxvY2F0aW9uSW5mbzogdHJ1ZX0pIGFzIHBhcnNlNS5EZWZhdWx0VHJlZURvY3VtZW50O1xuICBjb25zdCBub2RlUXVldWUgPSBbLi4uZG9jdW1lbnQuY2hpbGROb2Rlc107XG4gIGNvbnN0IHJlc3VsdDogcGFyc2U1LkRlZmF1bHRUcmVlRWxlbWVudFtdID0gW107XG5cbiAgd2hpbGUgKG5vZGVRdWV1ZS5sZW5ndGgpIHtcbiAgICBjb25zdCBub2RlID0gbm9kZVF1ZXVlLnNoaWZ0KCkgYXMgcGFyc2U1LkRlZmF1bHRUcmVlRWxlbWVudDtcblxuICAgIGlmIChub2RlLmNoaWxkTm9kZXMpIHtcbiAgICAgIG5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuY2hpbGROb2Rlcyk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NjcmlwdCcgJiYgbm9kZS5hdHRycy5sZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnN0IHNyY0F0dHJpYnV0ZSA9IG5vZGUuYXR0cnMuZmluZChhID0+IGEubmFtZSA9PT0gJ3NyYycpO1xuICAgICAgaWYgKHNyY0F0dHJpYnV0ZSAmJiBpc1BvdGVudGlhbEhhbW1lclNjcmlwdFJlZmVyZW5jZShzcmNBdHRyaWJ1dGUudmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgc291cmNlIHBhdGggaXMgcG90ZW50aWFsbHkgcmVmZXJyaW5nIHRvIHRoZVxuICogSGFtbWVySlMgc2NyaXB0IG91dHB1dC5cbiAqL1xuZnVuY3Rpb24gaXNQb3RlbnRpYWxIYW1tZXJTY3JpcHRSZWZlcmVuY2Uoc3JjUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXFwvaGFtbWVyKFxcLm1pbik/XFwuanMoJHxcXD8pLy50ZXN0KHNyY1BhdGgpO1xufVxuIl19