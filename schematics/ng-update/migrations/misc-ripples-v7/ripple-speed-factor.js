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
        define("@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Converts the specified speed factor into the exact static enter duration. */
    function convertSpeedFactorToDuration(factor) {
        // Based on the numeric speed factor value that only affected the `enterDuration` we can
        // now calculate the exact `enterDuration`. 450ms is the enter duration without factor.
        return 450 / (factor || 1);
    }
    exports.convertSpeedFactorToDuration = convertSpeedFactorToDuration;
    /**
     * Creates a runtime TypeScript expression that can be used in order to calculate the duration
     * from the speed factor expression that couldn't be statically analyzed.
     *
     * @param speedFactorValue Speed factor expression that couldn't be statically analyzed.
     */
    function createSpeedFactorConvertExpression(speedFactorValue) {
        // To be sure that the speed factor value expression is calculated properly, we need to add
        // the according parenthesis.
        return `450 / (${speedFactorValue})`;
    }
    exports.createSpeedFactorConvertExpression = createSpeedFactorConvertExpression;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXNwZWVkLWZhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtcmlwcGxlcy12Ny9yaXBwbGUtc3BlZWQtZmFjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsZ0ZBQWdGO0lBQ2hGLFNBQWdCLDRCQUE0QixDQUFDLE1BQWM7UUFDekQsd0ZBQXdGO1FBQ3hGLHVGQUF1RjtRQUN2RixPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBSkQsb0VBSUM7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLGtDQUFrQyxDQUFDLGdCQUF3QjtRQUN6RSwyRkFBMkY7UUFDM0YsNkJBQTZCO1FBQzdCLE9BQU8sVUFBVSxnQkFBZ0IsR0FBRyxDQUFDO0lBQ3ZDLENBQUM7SUFKRCxnRkFJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogQ29udmVydHMgdGhlIHNwZWNpZmllZCBzcGVlZCBmYWN0b3IgaW50byB0aGUgZXhhY3Qgc3RhdGljIGVudGVyIGR1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24oZmFjdG9yOiBudW1iZXIpIHtcbiAgLy8gQmFzZWQgb24gdGhlIG51bWVyaWMgc3BlZWQgZmFjdG9yIHZhbHVlIHRoYXQgb25seSBhZmZlY3RlZCB0aGUgYGVudGVyRHVyYXRpb25gIHdlIGNhblxuICAvLyBub3cgY2FsY3VsYXRlIHRoZSBleGFjdCBgZW50ZXJEdXJhdGlvbmAuIDQ1MG1zIGlzIHRoZSBlbnRlciBkdXJhdGlvbiB3aXRob3V0IGZhY3Rvci5cbiAgcmV0dXJuIDQ1MCAvIChmYWN0b3IgfHwgMSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJ1bnRpbWUgVHlwZVNjcmlwdCBleHByZXNzaW9uIHRoYXQgY2FuIGJlIHVzZWQgaW4gb3JkZXIgdG8gY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxuICogZnJvbSB0aGUgc3BlZWQgZmFjdG9yIGV4cHJlc3Npb24gdGhhdCBjb3VsZG4ndCBiZSBzdGF0aWNhbGx5IGFuYWx5emVkLlxuICpcbiAqIEBwYXJhbSBzcGVlZEZhY3RvclZhbHVlIFNwZWVkIGZhY3RvciBleHByZXNzaW9uIHRoYXQgY291bGRuJ3QgYmUgc3RhdGljYWxseSBhbmFseXplZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwZWVkRmFjdG9yQ29udmVydEV4cHJlc3Npb24oc3BlZWRGYWN0b3JWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gVG8gYmUgc3VyZSB0aGF0IHRoZSBzcGVlZCBmYWN0b3IgdmFsdWUgZXhwcmVzc2lvbiBpcyBjYWxjdWxhdGVkIHByb3Blcmx5LCB3ZSBuZWVkIHRvIGFkZFxuICAvLyB0aGUgYWNjb3JkaW5nIHBhcmVudGhlc2lzLlxuICByZXR1cm4gYDQ1MCAvICgke3NwZWVkRmFjdG9yVmFsdWV9KWA7XG59XG4iXX0=