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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/identifier-imports", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    /** Resolves the import of the specified identifier. */
    function getImportOfIdentifier(node, typeChecker) {
        const directImport = getSpecificImportOfIdentifier(node, typeChecker);
        if (directImport !== null) {
            return directImport;
        }
        else if (ts.isQualifiedName(node.parent) && node.parent.right === node) {
            const qualifierRoot = getQualifiedNameRoot(node.parent);
            if (qualifierRoot) {
                const moduleName = getImportOfNamespacedIdentifier(qualifierRoot, typeChecker);
                if (moduleName) {
                    return { moduleName, symbolName: node.text };
                }
            }
        }
        else if (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) {
            const rootIdentifier = getPropertyAccessRoot(node.parent);
            if (rootIdentifier) {
                const moduleName = getImportOfNamespacedIdentifier(rootIdentifier, typeChecker);
                if (moduleName) {
                    return { moduleName, symbolName: node.text };
                }
            }
        }
        return null;
    }
    exports.getImportOfIdentifier = getImportOfIdentifier;
    /**
     * Resolves the import of the specified identifier. Expects the identifier to resolve
     * to a fine-grained import declaration with import specifiers.
     */
    function getSpecificImportOfIdentifier(node, typeChecker) {
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!symbol || !symbol.declarations || !symbol.declarations.length) {
            return null;
        }
        const declaration = symbol.declarations[0];
        if (!ts.isImportSpecifier(declaration)) {
            return null;
        }
        const importDecl = declaration.parent.parent.parent;
        if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
            return null;
        }
        return {
            moduleName: importDecl.moduleSpecifier.text,
            symbolName: declaration.propertyName ? declaration.propertyName.text : declaration.name.text
        };
    }
    /**
     * Resolves the import of the specified identifier. Expects the identifier to
     * resolve to a namespaced import declaration. e.g. "import * as core from ...".
     */
    function getImportOfNamespacedIdentifier(node, typeChecker) {
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!symbol || !symbol.declarations || !symbol.declarations.length) {
            return null;
        }
        const declaration = symbol.declarations[0];
        if (!ts.isNamespaceImport(declaration)) {
            return null;
        }
        const importDecl = declaration.parent.parent;
        if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
            return null;
        }
        return importDecl.moduleSpecifier.text;
    }
    /**
     * Gets the root identifier of a qualified type chain. For example: "core.GestureConfig"
     * will return the "matCore" identifier. Allowing us to find the import of "core".
     */
    function getQualifiedNameRoot(name) {
        while (ts.isQualifiedName(name.left)) {
            name = name.left;
        }
        return ts.isIdentifier(name.left) ? name.left : null;
    }
    /**
     * Gets the root identifier of a property access chain. For example: "core.GestureConfig"
     * will return the "matCore" identifier. Allowing us to find the import of "core".
     */
    function getPropertyAccessRoot(node) {
        while (ts.isPropertyAccessExpression(node.expression)) {
            node = node.expression;
        }
        return ts.isIdentifier(node.expression) ? node.expression : null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvaGFtbWVyLWdlc3R1cmVzLXY5L2lkZW50aWZpZXItaW1wb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILGlDQUFpQztJQVdqQyx1REFBdUQ7SUFDdkQsU0FBZ0IscUJBQXFCLENBQUMsSUFBbUIsRUFBRSxXQUEyQjtRQUVwRixNQUFNLFlBQVksR0FBRyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEUsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO1lBQ3pCLE9BQU8sWUFBWSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDeEUsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksYUFBYSxFQUFFO2dCQUNqQixNQUFNLFVBQVUsR0FBRywrQkFBK0IsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9FLElBQUksVUFBVSxFQUFFO29CQUNkLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQztpQkFDNUM7YUFDRjtTQUNGO2FBQU0sSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUNsRixNQUFNLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLE1BQU0sVUFBVSxHQUFHLCtCQUErQixDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDaEYsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsT0FBTyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDO2lCQUM1QzthQUNGO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUF2QkQsc0RBdUJDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyw2QkFBNkIsQ0FBQyxJQUFtQixFQUFFLFdBQTJCO1FBRXJGLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ2xFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNwRCxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbkQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU87WUFDTCxVQUFVLEVBQUUsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJO1lBQzNDLFVBQVUsRUFBRSxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJO1NBQzdGLENBQUM7SUFDSixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUywrQkFBK0IsQ0FBQyxJQUFtQixFQUFFLFdBQTJCO1FBRXZGLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ2xFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzdDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUNuRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsU0FBUyxvQkFBb0IsQ0FBQyxJQUFzQjtRQUNsRCxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLHFCQUFxQixDQUFDLElBQWlDO1FBQzlELE9BQU8sRUFBRSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyRCxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUN4QjtRQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNuRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgYSByZXNvbHZlZCBpbXBvcnQuICovXG5leHBvcnQgaW50ZXJmYWNlIEltcG9ydCB7XG4gIC8qKiBOYW1lIG9mIHRoZSBpbXBvcnRlZCBzeW1ib2wuICovXG4gIHN5bWJvbE5hbWU6IHN0cmluZztcbiAgLyoqIE1vZHVsZSBuYW1lIGZyb20gd2hpY2ggdGhlIHN5bWJvbCBoYXMgYmVlbiBpbXBvcnRlZC4gKi9cbiAgbW9kdWxlTmFtZTogc3RyaW5nO1xufVxuXG5cbi8qKiBSZXNvbHZlcyB0aGUgaW1wb3J0IG9mIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbXBvcnRPZklkZW50aWZpZXIobm9kZTogdHMuSWRlbnRpZmllciwgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKTogSW1wb3J0fFxuICAgIG51bGwge1xuICBjb25zdCBkaXJlY3RJbXBvcnQgPSBnZXRTcGVjaWZpY0ltcG9ydE9mSWRlbnRpZmllcihub2RlLCB0eXBlQ2hlY2tlcik7XG4gIGlmIChkaXJlY3RJbXBvcnQgIT09IG51bGwpIHtcbiAgICByZXR1cm4gZGlyZWN0SW1wb3J0O1xuICB9IGVsc2UgaWYgKHRzLmlzUXVhbGlmaWVkTmFtZShub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnQucmlnaHQgPT09IG5vZGUpIHtcbiAgICBjb25zdCBxdWFsaWZpZXJSb290ID0gZ2V0UXVhbGlmaWVkTmFtZVJvb3Qobm9kZS5wYXJlbnQpO1xuICAgIGlmIChxdWFsaWZpZXJSb290KSB7XG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gZ2V0SW1wb3J0T2ZOYW1lc3BhY2VkSWRlbnRpZmllcihxdWFsaWZpZXJSb290LCB0eXBlQ2hlY2tlcik7XG4gICAgICBpZiAobW9kdWxlTmFtZSkge1xuICAgICAgICByZXR1cm4ge21vZHVsZU5hbWUsIHN5bWJvbE5hbWU6IG5vZGUudGV4dH07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudC5uYW1lID09PSBub2RlKSB7XG4gICAgY29uc3Qgcm9vdElkZW50aWZpZXIgPSBnZXRQcm9wZXJ0eUFjY2Vzc1Jvb3Qobm9kZS5wYXJlbnQpO1xuICAgIGlmIChyb290SWRlbnRpZmllcikge1xuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IGdldEltcG9ydE9mTmFtZXNwYWNlZElkZW50aWZpZXIocm9vdElkZW50aWZpZXIsIHR5cGVDaGVja2VyKTtcbiAgICAgIGlmIChtb2R1bGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB7bW9kdWxlTmFtZSwgc3ltYm9sTmFtZTogbm9kZS50ZXh0fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuIEV4cGVjdHMgdGhlIGlkZW50aWZpZXIgdG8gcmVzb2x2ZVxuICogdG8gYSBmaW5lLWdyYWluZWQgaW1wb3J0IGRlY2xhcmF0aW9uIHdpdGggaW1wb3J0IHNwZWNpZmllcnMuXG4gKi9cbmZ1bmN0aW9uIGdldFNwZWNpZmljSW1wb3J0T2ZJZGVudGlmaWVyKG5vZGU6IHRzLklkZW50aWZpZXIsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IEltcG9ydHxcbiAgICBudWxsIHtcbiAgY29uc3Qgc3ltYm9sID0gdHlwZUNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcbiAgaWYgKCFzeW1ib2wgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMgfHwgIXN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZGVjbGFyYXRpb24gPSBzeW1ib2wuZGVjbGFyYXRpb25zWzBdO1xuICBpZiAoIXRzLmlzSW1wb3J0U3BlY2lmaWVyKGRlY2xhcmF0aW9uKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGltcG9ydERlY2wgPSBkZWNsYXJhdGlvbi5wYXJlbnQucGFyZW50LnBhcmVudDtcbiAgaWYgKCF0cy5pc1N0cmluZ0xpdGVyYWwoaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb2R1bGVOYW1lOiBpbXBvcnREZWNsLm1vZHVsZVNwZWNpZmllci50ZXh0LFxuICAgIHN5bWJvbE5hbWU6IGRlY2xhcmF0aW9uLnByb3BlcnR5TmFtZSA/IGRlY2xhcmF0aW9uLnByb3BlcnR5TmFtZS50ZXh0IDogZGVjbGFyYXRpb24ubmFtZS50ZXh0XG4gIH07XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuIEV4cGVjdHMgdGhlIGlkZW50aWZpZXIgdG9cbiAqIHJlc29sdmUgdG8gYSBuYW1lc3BhY2VkIGltcG9ydCBkZWNsYXJhdGlvbi4gZS5nLiBcImltcG9ydCAqIGFzIGNvcmUgZnJvbSAuLi5cIi5cbiAqL1xuZnVuY3Rpb24gZ2V0SW1wb3J0T2ZOYW1lc3BhY2VkSWRlbnRpZmllcihub2RlOiB0cy5JZGVudGlmaWVyLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiBzdHJpbmd8XG4gICAgbnVsbCB7XG4gIGNvbnN0IHN5bWJvbCA9IHR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG4gIGlmICghc3ltYm9sIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGRlY2xhcmF0aW9uID0gc3ltYm9sLmRlY2xhcmF0aW9uc1swXTtcbiAgaWYgKCF0cy5pc05hbWVzcGFjZUltcG9ydChkZWNsYXJhdGlvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBpbXBvcnREZWNsID0gZGVjbGFyYXRpb24ucGFyZW50LnBhcmVudDtcbiAgaWYgKCF0cy5pc1N0cmluZ0xpdGVyYWwoaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIudGV4dDtcbn1cblxuXG4vKipcbiAqIEdldHMgdGhlIHJvb3QgaWRlbnRpZmllciBvZiBhIHF1YWxpZmllZCB0eXBlIGNoYWluLiBGb3IgZXhhbXBsZTogXCJjb3JlLkdlc3R1cmVDb25maWdcIlxuICogd2lsbCByZXR1cm4gdGhlIFwibWF0Q29yZVwiIGlkZW50aWZpZXIuIEFsbG93aW5nIHVzIHRvIGZpbmQgdGhlIGltcG9ydCBvZiBcImNvcmVcIi5cbiAqL1xuZnVuY3Rpb24gZ2V0UXVhbGlmaWVkTmFtZVJvb3QobmFtZTogdHMuUXVhbGlmaWVkTmFtZSk6IHRzLklkZW50aWZpZXJ8bnVsbCB7XG4gIHdoaWxlICh0cy5pc1F1YWxpZmllZE5hbWUobmFtZS5sZWZ0KSkge1xuICAgIG5hbWUgPSBuYW1lLmxlZnQ7XG4gIH1cbiAgcmV0dXJuIHRzLmlzSWRlbnRpZmllcihuYW1lLmxlZnQpID8gbmFtZS5sZWZ0IDogbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGlkZW50aWZpZXIgb2YgYSBwcm9wZXJ0eSBhY2Nlc3MgY2hhaW4uIEZvciBleGFtcGxlOiBcImNvcmUuR2VzdHVyZUNvbmZpZ1wiXG4gKiB3aWxsIHJldHVybiB0aGUgXCJtYXRDb3JlXCIgaWRlbnRpZmllci4gQWxsb3dpbmcgdXMgdG8gZmluZCB0aGUgaW1wb3J0IG9mIFwiY29yZVwiLlxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eUFjY2Vzc1Jvb3Qobm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKTogdHMuSWRlbnRpZmllcnxudWxsIHtcbiAgd2hpbGUgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikpIHtcbiAgICBub2RlID0gbm9kZS5leHByZXNzaW9uO1xuICB9XG4gIHJldHVybiB0cy5pc0lkZW50aWZpZXIobm9kZS5leHByZXNzaW9uKSA/IG5vZGUuZXhwcmVzc2lvbiA6IG51bGw7XG59XG4iXX0=