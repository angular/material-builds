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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/find-main-module", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    /**
     * Finds the main Angular module within the specified source file. The first module
     * that is part of the "bootstrapModule" expression is returned.
     */
    function findMainModuleExpression(mainSourceFile) {
        let foundModule = null;
        const visitNode = (node) => {
            if (ts.isCallExpression(node) && node.arguments.length &&
                ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.name) &&
                node.expression.name.text === 'bootstrapModule') {
                foundModule = node.arguments[0];
            }
            else {
                ts.forEachChild(node, visitNode);
            }
        };
        ts.forEachChild(mainSourceFile, visitNode);
        return foundModule;
    }
    exports.findMainModuleExpression = findMainModuleExpression;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1tYWluLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS91cGdyYWRlLXJ1bGVzL2hhbW1lci1nZXN0dXJlcy12OS9maW5kLW1haW4tbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsaUNBQWlDO0lBRWpDOzs7T0FHRztJQUNILFNBQWdCLHdCQUF3QixDQUFDLGNBQTZCO1FBQ3BFLElBQUksV0FBVyxHQUF1QixJQUFJLENBQUM7UUFDM0MsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTtZQUNsQyxJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07Z0JBQ2xELEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDdkYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFO2dCQUNuRCxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNsQztRQUNILENBQUMsQ0FBQztRQUVGLEVBQUUsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTNDLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFmRCw0REFlQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWFpbiBBbmd1bGFyIG1vZHVsZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS4gVGhlIGZpcnN0IG1vZHVsZVxuICogdGhhdCBpcyBwYXJ0IG9mIHRoZSBcImJvb3RzdHJhcE1vZHVsZVwiIGV4cHJlc3Npb24gaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb24obWFpblNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5FeHByZXNzaW9ufG51bGwge1xuICBsZXQgZm91bmRNb2R1bGU6IHRzLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gIGNvbnN0IHZpc2l0Tm9kZSA9IChub2RlOiB0cy5Ob2RlKSA9PiB7XG4gICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5hcmd1bWVudHMubGVuZ3RoICYmXG4gICAgICAgIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikgJiYgdHMuaXNJZGVudGlmaWVyKG5vZGUuZXhwcmVzc2lvbi5uYW1lKSAmJlxuICAgICAgICBub2RlLmV4cHJlc3Npb24ubmFtZS50ZXh0ID09PSAnYm9vdHN0cmFwTW9kdWxlJykge1xuICAgICAgZm91bmRNb2R1bGUgPSBub2RlLmFyZ3VtZW50c1swXSE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCB2aXNpdE5vZGUpO1xuICAgIH1cbiAgfTtcblxuICB0cy5mb3JFYWNoQ2hpbGQobWFpblNvdXJjZUZpbGUsIHZpc2l0Tm9kZSk7XG5cbiAgcmV0dXJuIGZvdW5kTW9kdWxlO1xufVxuIl19