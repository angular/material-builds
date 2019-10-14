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
        if (!symbol || !symbol.declarations.length) {
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
        if (!symbol || !symbol.declarations.length) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllci1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvaGFtbWVyLWdlc3R1cmVzLXY5L2lkZW50aWZpZXItaW1wb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILGlDQUFpQztJQVdqQyx1REFBdUQ7SUFDdkQsU0FBZ0IscUJBQXFCLENBQUMsSUFBbUIsRUFBRSxXQUEyQjtRQUVwRixNQUFNLFlBQVksR0FBRyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEUsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO1lBQ3pCLE9BQU8sWUFBWSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDeEUsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksYUFBYSxFQUFFO2dCQUNqQixNQUFNLFVBQVUsR0FBRywrQkFBK0IsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9FLElBQUksVUFBVSxFQUFFO29CQUNkLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQztpQkFDNUM7YUFDRjtTQUNGO2FBQU0sSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUNsRixNQUFNLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxD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eEI7UUFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbkUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqIEludGVyZmFjZSBkZXNjcmliaW5nIGEgcmVzb2x2ZWQgaW1wb3J0LiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbXBvcnQge1xuICAvKiogTmFtZSBvZiB0aGUgaW1wb3J0ZWQgc3ltYm9sLiAqL1xuICBzeW1ib2xOYW1lOiBzdHJpbmc7XG4gIC8qKiBNb2R1bGUgbmFtZSBmcm9tIHdoaWNoIHRoZSBzeW1ib2wgaGFzIGJlZW4gaW1wb3J0ZWQuICovXG4gIG1vZHVsZU5hbWU6IHN0cmluZztcbn1cblxuXG4vKiogUmVzb2x2ZXMgdGhlIGltcG9ydCBvZiB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGU6IHRzLklkZW50aWZpZXIsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IEltcG9ydHxcbiAgICBudWxsIHtcbiAgY29uc3QgZGlyZWN0SW1wb3J0ID0gZ2V0U3BlY2lmaWNJbXBvcnRPZklkZW50aWZpZXIobm9kZSwgdHlwZUNoZWNrZXIpO1xuICBpZiAoZGlyZWN0SW1wb3J0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRpcmVjdEltcG9ydDtcbiAgfSBlbHNlIGlmICh0cy5pc1F1YWxpZmllZE5hbWUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50LnJpZ2h0ID09PSBub2RlKSB7XG4gICAgY29uc3QgcXVhbGlmaWVyUm9vdCA9IGdldFF1YWxpZmllZE5hbWVSb290KG5vZGUucGFyZW50KTtcbiAgICBpZiAocXVhbGlmaWVyUm9vdCkge1xuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IGdldEltcG9ydE9mTmFtZXNwYWNlZElkZW50aWZpZXIocXVhbGlmaWVyUm9vdCwgdHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHttb2R1bGVOYW1lLCBzeW1ib2xOYW1lOiBub2RlLnRleHR9O1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnQubmFtZSA9PT0gbm9kZSkge1xuICAgIGNvbnN0IHJvb3RJZGVudGlmaWVyID0gZ2V0UHJvcGVydHlBY2Nlc3NSb290KG5vZGUucGFyZW50KTtcbiAgICBpZiAocm9vdElkZW50aWZpZXIpIHtcbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBnZXRJbXBvcnRPZk5hbWVzcGFjZWRJZGVudGlmaWVyKHJvb3RJZGVudGlmaWVyLCB0eXBlQ2hlY2tlcik7XG4gICAgICBpZiAobW9kdWxlTmFtZSkge1xuICAgICAgICByZXR1cm4ge21vZHVsZU5hbWUsIHN5bWJvbE5hbWU6IG5vZGUudGV4dH07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBpbXBvcnQgb2YgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyLiBFeHBlY3RzIHRoZSBpZGVudGlmaWVyIHRvIHJlc29sdmVcbiAqIHRvIGEgZmluZS1ncmFpbmVkIGltcG9ydCBkZWNsYXJhdGlvbiB3aXRoIGltcG9ydCBzcGVjaWZpZXJzLlxuICovXG5mdW5jdGlvbiBnZXRTcGVjaWZpY0ltcG9ydE9mSWRlbnRpZmllcihub2RlOiB0cy5JZGVudGlmaWVyLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiBJbXBvcnR8XG4gICAgbnVsbCB7XG4gIGNvbnN0IHN5bWJvbCA9IHR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG4gIGlmICghc3ltYm9sIHx8ICFzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGRlY2xhcmF0aW9uID0gc3ltYm9sLmRlY2xhcmF0aW9uc1swXTtcbiAgaWYgKCF0cy5pc0ltcG9ydFNwZWNpZmllcihkZWNsYXJhdGlvbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBpbXBvcnREZWNsID0gZGVjbGFyYXRpb24ucGFyZW50LnBhcmVudC5wYXJlbnQ7XG4gIGlmICghdHMuaXNTdHJpbmdMaXRlcmFsKGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW9kdWxlTmFtZTogaW1wb3J0RGVjbC5tb2R1bGVTcGVjaWZpZXIudGV4dCxcbiAgICBzeW1ib2xOYW1lOiBkZWNsYXJhdGlvbi5wcm9wZXJ0eU5hbWUgPyBkZWNsYXJhdGlvbi5wcm9wZXJ0eU5hbWUudGV4dCA6IGRlY2xhcmF0aW9uLm5hbWUudGV4dFxuICB9O1xufVxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBpbXBvcnQgb2YgdGhlIHNwZWNpZmllZCBpZGVudGlmaWVyLiBFeHBlY3RzIHRoZSBpZGVudGlmaWVyIHRvXG4gKiByZXNvbHZlIHRvIGEgbmFtZXNwYWNlZCBpbXBvcnQgZGVjbGFyYXRpb24uIGUuZy4gXCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gLi4uXCIuXG4gKi9cbmZ1bmN0aW9uIGdldEltcG9ydE9mTmFtZXNwYWNlZElkZW50aWZpZXIobm9kZTogdHMuSWRlbnRpZmllciwgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKTogc3RyaW5nfFxuICAgIG51bGwge1xuICBjb25zdCBzeW1ib2wgPSB0eXBlQ2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuICBpZiAoIXN5bWJvbCB8fCAhc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBkZWNsYXJhdGlvbiA9IHN5bWJvbC5kZWNsYXJhdGlvbnNbMF07XG4gIGlmICghdHMuaXNOYW1lc3BhY2VJbXBvcnQoZGVjbGFyYXRpb24pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgaW1wb3J0RGVjbCA9IGRlY2xhcmF0aW9uLnBhcmVudC5wYXJlbnQ7XG4gIGlmICghdHMuaXNTdHJpbmdMaXRlcmFsKGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGltcG9ydERlY2wubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG59XG5cblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGlkZW50aWZpZXIgb2YgYSBxdWFsaWZpZWQgdHlwZSBjaGFpbi4gRm9yIGV4YW1wbGU6IFwiY29yZS5HZXN0dXJlQ29uZmlnXCJcbiAqIHdpbGwgcmV0dXJuIHRoZSBcIm1hdENvcmVcIiBpZGVudGlmaWVyLiBBbGxvd2luZyB1cyB0byBmaW5kIHRoZSBpbXBvcnQgb2YgXCJjb3JlXCIuXG4gKi9cbmZ1bmN0aW9uIGdldFF1YWxpZmllZE5hbWVSb290KG5hbWU6IHRzLlF1YWxpZmllZE5hbWUpOiB0cy5JZGVudGlmaWVyfG51bGwge1xuICB3aGlsZSAodHMuaXNRdWFsaWZpZWROYW1lKG5hbWUubGVmdCkpIHtcbiAgICBuYW1lID0gbmFtZS5sZWZ0O1xuICB9XG4gIHJldHVybiB0cy5pc0lkZW50aWZpZXIobmFtZS5sZWZ0KSA/IG5hbWUubGVmdCA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgcm9vdCBpZGVudGlmaWVyIG9mIGEgcHJvcGVydHkgYWNjZXNzIGNoYWluLiBGb3IgZXhhbXBsZTogXCJjb3JlLkdlc3R1cmVDb25maWdcIlxuICogd2lsbCByZXR1cm4gdGhlIFwibWF0Q29yZVwiIGlkZW50aWZpZXIuIEFsbG93aW5nIHVzIHRvIGZpbmQgdGhlIGltcG9ydCBvZiBcImNvcmVcIi5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvcGVydHlBY2Nlc3NSb290KG5vZGU6IHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbik6IHRzLklkZW50aWZpZXJ8bnVsbCB7XG4gIHdoaWxlICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pKSB7XG4gICAgbm9kZSA9IG5vZGUuZXhwcmVzc2lvbjtcbiAgfVxuICByZXR1cm4gdHMuaXNJZGVudGlmaWVyKG5vZGUuZXhwcmVzc2lvbikgPyBub2RlLmV4cHJlc3Npb24gOiBudWxsO1xufVxuIl19