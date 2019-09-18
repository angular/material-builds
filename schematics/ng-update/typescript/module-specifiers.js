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
        define("@angular/material/schematics/ng-update/typescript/module-specifiers", ["require", "exports", "@angular/cdk/schematics"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    /** Name of the Angular Material module specifier. */
    exports.materialModuleSpecifier = '@angular/material';
    /** Name of the Angular CDK module specifier. */
    exports.cdkModuleSpecifier = '@angular/cdk';
    /** Whether the specified node is part of an Angular Material or CDK import declaration. */
    function isMaterialImportDeclaration(node) {
        return isMaterialDeclaration(schematics_1.getImportDeclaration(node));
    }
    exports.isMaterialImportDeclaration = isMaterialImportDeclaration;
    /** Whether the specified node is part of an Angular Material or CDK import declaration. */
    function isMaterialExportDeclaration(node) {
        return isMaterialDeclaration(schematics_1.getExportDeclaration(node));
    }
    exports.isMaterialExportDeclaration = isMaterialExportDeclaration;
    /** Whether the declaration is part of Angular Material. */
    function isMaterialDeclaration(declaration) {
        if (!declaration.moduleSpecifier) {
            return false;
        }
        const moduleSpecifier = declaration.moduleSpecifier.getText();
        return moduleSpecifier.indexOf(exports.materialModuleSpecifier) !== -1 ||
            moduleSpecifier.indexOf(exports.cdkModuleSpecifier) !== -1;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLXNwZWNpZmllcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvdHlwZXNjcmlwdC9tb2R1bGUtc3BlY2lmaWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUFtRjtJQUduRixxREFBcUQ7SUFDeEMsUUFBQSx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQztJQUUzRCxnREFBZ0Q7SUFDbkMsUUFBQSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7SUFFakQsMkZBQTJGO0lBQzNGLFNBQWdCLDJCQUEyQixDQUFDLElBQWE7UUFDdkQsT0FBTyxxQkFBcUIsQ0FBQyxpQ0FBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFGRCxrRUFFQztJQUVELDJGQUEyRjtJQUMzRixTQUFnQiwyQkFBMkIsQ0FBQyxJQUFhO1FBQ3ZELE9BQU8scUJBQXFCLENBQUMsaUNBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRkQsa0VBRUM7SUFFRCwyREFBMkQ7SUFDM0QsU0FBUyxxQkFBcUIsQ0FBQyxXQUFzRDtRQUNuRixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRTtZQUNoQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5RCxPQUFPLGVBQWUsQ0FBQyxPQUFPLENBQUMsK0JBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUQsZUFBZSxDQUFDLE9BQU8sQ0FBQywwQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtnZXRFeHBvcnREZWNsYXJhdGlvbiwgZ2V0SW1wb3J0RGVjbGFyYXRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKiogTmFtZSBvZiB0aGUgQW5ndWxhciBNYXRlcmlhbCBtb2R1bGUgc3BlY2lmaWVyLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsTW9kdWxlU3BlY2lmaWVyID0gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuLyoqIE5hbWUgb2YgdGhlIEFuZ3VsYXIgQ0RLIG1vZHVsZSBzcGVjaWZpZXIuICovXG5leHBvcnQgY29uc3QgY2RrTW9kdWxlU3BlY2lmaWVyID0gJ0Bhbmd1bGFyL2Nkayc7XG5cbi8qKiBXaGV0aGVyIHRoZSBzcGVjaWZpZWQgbm9kZSBpcyBwYXJ0IG9mIGFuIEFuZ3VsYXIgTWF0ZXJpYWwgb3IgQ0RLIGltcG9ydCBkZWNsYXJhdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24obm9kZTogdHMuTm9kZSkge1xuICByZXR1cm4gaXNNYXRlcmlhbERlY2xhcmF0aW9uKGdldEltcG9ydERlY2xhcmF0aW9uKG5vZGUpKTtcbn1cblxuLyoqIFdoZXRoZXIgdGhlIHNwZWNpZmllZCBub2RlIGlzIHBhcnQgb2YgYW4gQW5ndWxhciBNYXRlcmlhbCBvciBDREsgaW1wb3J0IGRlY2xhcmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTWF0ZXJpYWxFeHBvcnREZWNsYXJhdGlvbihub2RlOiB0cy5Ob2RlKSB7XG4gIHJldHVybiBpc01hdGVyaWFsRGVjbGFyYXRpb24oZ2V0RXhwb3J0RGVjbGFyYXRpb24obm9kZSkpO1xufVxuXG4vKiogV2hldGhlciB0aGUgZGVjbGFyYXRpb24gaXMgcGFydCBvZiBBbmd1bGFyIE1hdGVyaWFsLiAqL1xuZnVuY3Rpb24gaXNNYXRlcmlhbERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uOiB0cy5JbXBvcnREZWNsYXJhdGlvbnx0cy5FeHBvcnREZWNsYXJhdGlvbikge1xuICBpZiAoIWRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IG1vZHVsZVNwZWNpZmllciA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRUZXh0KCk7XG4gIHJldHVybiBtb2R1bGVTcGVjaWZpZXIuaW5kZXhPZihtYXRlcmlhbE1vZHVsZVNwZWNpZmllcikgIT09IC0xIHx8XG4gICAgICBtb2R1bGVTcGVjaWZpZXIuaW5kZXhPZihjZGtNb2R1bGVTcGVjaWZpZXIpICE9PSAtMTtcbn1cbiJdfQ==