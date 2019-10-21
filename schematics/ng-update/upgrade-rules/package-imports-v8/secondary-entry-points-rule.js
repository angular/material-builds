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
        define("@angular/material/schematics/ng-update/upgrade-rules/package-imports-v8/secondary-entry-points-rule", ["require", "exports", "@angular/cdk/schematics", "typescript", "@angular/material/schematics/ng-update/typescript/module-specifiers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    const module_specifiers_1 = require("@angular/material/schematics/ng-update/typescript/module-specifiers");
    const ONLY_SUBPACKAGE_FAILURE_STR = `Importing from "@angular/material" is deprecated. ` +
        `Instead import from the entry-point the symbol belongs to.`;
    const NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR = `Imports from Angular Material should import ` +
        `specific symbols rather than importing the entire library.`;
    /**
     * Regex for testing file paths against to determine if the file is from the
     * Angular Material library.
     */
    const ANGULAR_MATERIAL_FILEPATH_REGEX = new RegExp(`${module_specifiers_1.materialModuleSpecifier}/(.*?)/`);
    /**
     * Mapping of Material symbol names to their module names. Used as a fallback if
     * we didn't manage to resolve the module name of a symbol using the type checker.
     */
    const ENTRY_POINT_MAPPINGS = require('./material-symbols.json');
    /**
     * A migration rule that updates imports which refer to the primary Angular Material
     * entry-point to use the appropriate secondary entry points (e.g. @angular/material/button).
     */
    class SecondaryEntryPointsRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            this.printer = ts.createPrinter();
            // Only enable this rule if the migration targets version 8. The primary
            // entry-point of Material has been marked as deprecated in version 8.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V8 || this.targetVersion === schematics_1.TargetVersion.V9;
        }
        visitNode(declaration) {
            // Only look at import declarations.
            if (!ts.isImportDeclaration(declaration) ||
                !ts.isStringLiteralLike(declaration.moduleSpecifier)) {
                return;
            }
            const importLocation = declaration.moduleSpecifier.text;
            // If the import module is not @angular/material, skip the check.
            if (importLocation !== module_specifiers_1.materialModuleSpecifier) {
                return;
            }
            // If no import clause is found, or nothing is named as a binding in the
            // import, add failure saying to import symbols in clause.
            if (!declaration.importClause || !declaration.importClause.namedBindings) {
                this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
                return;
            }
            // All named bindings in import clauses must be named symbols, otherwise add
            // failure saying to import symbols in clause.
            if (!ts.isNamedImports(declaration.importClause.namedBindings)) {
                this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
                return;
            }
            // If no symbols are in the named bindings then add failure saying to
            // import symbols in clause.
            if (!declaration.importClause.namedBindings.elements.length) {
                this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
                return;
            }
            // Whether the existing import declaration is using a single quote module specifier.
            const singleQuoteImport = declaration.moduleSpecifier.getText()[0] === `'`;
            // Map which consists of secondary entry-points and import specifiers which are used
            // within the current import declaration.
            const importMap = new Map();
            // Determine the subpackage each symbol in the namedBinding comes from.
            for (const element of declaration.importClause.namedBindings.elements) {
                const elementName = element.propertyName ? element.propertyName : element.name;
                // Try to resolve the module name via the type checker, and if it fails, fall back to
                // resolving it from our list of symbol to entry point mappings. Using the type checker is
                // more accurate and doesn't require us to keep a list of symbols, but it won't work if
                // the symbols don't exist anymore (e.g. after we remove the top-level @angular/material).
                const moduleName = resolveModuleName(elementName, this.typeChecker) ||
                    ENTRY_POINT_MAPPINGS[elementName.text] || null;
                if (!moduleName) {
                    this.createFailureAtNode(element, `"${element.getText()}" was not found in the Material library.`);
                    return;
                }
                // The module name where the symbol is defined e.g. card, dialog. The
                // first capture group is contains the module name.
                if (importMap.has(moduleName)) {
                    importMap.get(moduleName).push(element);
                }
                else {
                    importMap.set(moduleName, [element]);
                }
            }
            // Transforms the import declaration into multiple import declarations that import
            // the given symbols from the individual secondary entry-points. For example:
            // import {MatCardModule, MatCardTitle} from '@angular/material/card';
            // import {MatRadioModule} from '@angular/material/radio';
            const newImportStatements = Array.from(importMap.entries())
                .sort()
                .map(([name, elements]) => {
                const newImport = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports(elements)), createStringLiteral(`${module_specifiers_1.materialModuleSpecifier}/${name}`, singleQuoteImport));
                return this.printer.printNode(ts.EmitHint.Unspecified, newImport, declaration.getSourceFile());
            })
                .join('\n');
            // Without any import statements that were generated, we can assume that this was an empty
            // import declaration. We still want to add a failure in order to make developers aware that
            // importing from "@angular/material" is deprecated.
            if (!newImportStatements) {
                this.createFailureAtNode(declaration.moduleSpecifier, ONLY_SUBPACKAGE_FAILURE_STR);
                return;
            }
            const recorder = this.getUpdateRecorder(declaration.moduleSpecifier.getSourceFile().fileName);
            // Perform the replacement that switches the primary entry-point import to
            // the individual secondary entry-point imports.
            recorder.remove(declaration.getStart(), declaration.getWidth());
            recorder.insertRight(declaration.getStart(), newImportStatements);
        }
    }
    exports.SecondaryEntryPointsRule = SecondaryEntryPointsRule;
    /**
     * Creates a string literal from the specified text.
     * @param text Text of the string literal.
     * @param singleQuotes Whether single quotes should be used when printing the literal node.
     */
    function createStringLiteral(text, singleQuotes) {
        const literal = ts.createStringLiteral(text);
        // See: https://github.com/microsoft/TypeScript/blob/master/src/compiler/utilities.ts#L584-L590
        literal['singleQuote'] = singleQuotes;
        return literal;
    }
    /** Gets the symbol that contains the value declaration of the given node. */
    function getDeclarationSymbolOfNode(node, checker) {
        const symbol = checker.getSymbolAtLocation(node);
        // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
        // We need to resolve the aliased symbol back to the declaration symbol.
        // tslint:disable-next-line:no-bitwise
        if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
            return checker.getAliasedSymbol(symbol);
        }
        return symbol;
    }
    /** Tries to resolve the name of the Material module that a node is imported from. */
    function resolveModuleName(node, typeChecker) {
        // Get the symbol for the named binding element. Note that we cannot determine the
        // value declaration based on the type of the element as types are not necessarily
        // specific to a given secondary entry-point (e.g. exports with the type of "string")
        // would resolve to the module types provided by TypeScript itself.
        const symbol = getDeclarationSymbolOfNode(node, typeChecker);
        // If the symbol can't be found, or no declaration could be found within
        // the symbol, add failure to report that the given symbol can't be found.
        if (!symbol ||
            !(symbol.valueDeclaration || (symbol.declarations && symbol.declarations.length !== 0))) {
            return null;
        }
        // The filename for the source file of the node that contains the
        // first declaration of the symbol. All symbol declarations must be
        // part of a defining node, so parent can be asserted to be defined.
        const resolvedNode = symbol.valueDeclaration || symbol.declarations[0];
        const sourceFile = resolvedNode.getSourceFile().fileName;
        // File the module the symbol belongs to from a regex match of the
        // filename. This will always match since only "@angular/material"
        // elements are analyzed.
        const matches = sourceFile.match(ANGULAR_MATERIAL_FILEPATH_REGEX);
        return matches ? matches[1] : null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvcGFja2FnZS1pbXBvcnRzLXY4L3NlY29uZGFyeS1lbnRyeS1wb2ludHMtcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUFxRTtJQUNyRSxpQ0FBaUM7SUFDakMsMkdBQXdGO0lBRXhGLE1BQU0sMkJBQTJCLEdBQUcsb0RBQW9EO1FBQ3BGLDREQUE0RCxDQUFDO0lBRWpFLE1BQU0sbUNBQW1DLEdBQUcsOENBQThDO1FBQ3RGLDREQUE0RCxDQUFDO0lBRWpFOzs7T0FHRztJQUNILE1BQU0sK0JBQStCLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRywyQ0FBdUIsU0FBUyxDQUFDLENBQUM7SUFFeEY7OztPQUdHO0lBQ0gsTUFBTSxvQkFBb0IsR0FBNkIsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFFMUY7OztPQUdHO0lBQ0gsTUFBYSx3QkFBeUIsU0FBUSwwQkFBbUI7UUFBakU7O1lBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU3Qix3RUFBd0U7WUFDeEUsc0VBQXNFO1lBQ3RFLGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO1FBcUduRyxDQUFDO1FBbkdDLFNBQVMsQ0FBQyxXQUFvQjtZQUM1QixvQ0FBb0M7WUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7Z0JBQ3BDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsRUFBRTtn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LEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWlncmF0aW9uUnVsZSwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfSBmcm9tICcuLi8uLi8uLi9uZy11cGRhdGUvdHlwZXNjcmlwdC9tb2R1bGUtc3BlY2lmaWVycyc7XG5cbmNvbnN0IE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUiA9IGBJbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC4gYCArXG4gICAgYEluc3RlYWQgaW1wb3J0IGZyb20gdGhlIGVudHJ5LXBvaW50IHRoZSBzeW1ib2wgYmVsb25ncyB0by5gO1xuXG5jb25zdCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUiA9IGBJbXBvcnRzIGZyb20gQW5ndWxhciBNYXRlcmlhbCBzaG91bGQgaW1wb3J0IGAgK1xuICAgIGBzcGVjaWZpYyBzeW1ib2xzIHJhdGhlciB0aGFuIGltcG9ydGluZyB0aGUgZW50aXJlIGxpYnJhcnkuYDtcblxuLyoqXG4gKiBSZWdleCBmb3IgdGVzdGluZyBmaWxlIHBhdGhzIGFnYWluc3QgdG8gZGV0ZXJtaW5lIGlmIHRoZSBmaWxlIGlzIGZyb20gdGhlXG4gKiBBbmd1bGFyIE1hdGVyaWFsIGxpYnJhcnkuXG4gKi9cbmNvbnN0IEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVggPSBuZXcgUmVnRXhwKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8oLio/KS9gKTtcblxuLyoqXG4gKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHN5bWJvbCBuYW1lcyB0byB0aGVpciBtb2R1bGUgbmFtZXMuIFVzZWQgYXMgYSBmYWxsYmFjayBpZlxuICogd2UgZGlkbid0IG1hbmFnZSB0byByZXNvbHZlIHRoZSBtb2R1bGUgbmFtZSBvZiBhIHN5bWJvbCB1c2luZyB0aGUgdHlwZSBjaGVja2VyLlxuICovXG5jb25zdCBFTlRSWV9QT0lOVF9NQVBQSU5HUzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9ID0gcmVxdWlyZSgnLi9tYXRlcmlhbC1zeW1ib2xzLmpzb24nKTtcblxuLyoqXG4gKiBBIG1pZ3JhdGlvbiBydWxlIHRoYXQgdXBkYXRlcyBpbXBvcnRzIHdoaWNoIHJlZmVyIHRvIHRoZSBwcmltYXJ5IEFuZ3VsYXIgTWF0ZXJpYWxcbiAqIGVudHJ5LXBvaW50IHRvIHVzZSB0aGUgYXBwcm9wcmlhdGUgc2Vjb25kYXJ5IGVudHJ5IHBvaW50cyAoZS5nLiBAYW5ndWxhci9tYXRlcmlhbC9idXR0b24pLlxuICovXG5leHBvcnQgY2xhc3MgU2Vjb25kYXJ5RW50cnlQb2ludHNSdWxlIGV4dGVuZHMgTWlncmF0aW9uUnVsZTxudWxsPiB7XG4gIHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDguIFRoZSBwcmltYXJ5XG4gIC8vIGVudHJ5LXBvaW50IG9mIE1hdGVyaWFsIGhhcyBiZWVuIG1hcmtlZCBhcyBkZXByZWNhdGVkIGluIHZlcnNpb24gOC5cbiAgcnVsZUVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjggfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY5O1xuXG4gIHZpc2l0Tm9kZShkZWNsYXJhdGlvbjogdHMuTm9kZSk6IHZvaWQge1xuICAgIC8vIE9ubHkgbG9vayBhdCBpbXBvcnQgZGVjbGFyYXRpb25zLlxuICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHxcbiAgICAgICAgIXRzLmlzU3RyaW5nTGl0ZXJhbExpa2UoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydExvY2F0aW9uID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG4gICAgLy8gSWYgdGhlIGltcG9ydCBtb2R1bGUgaXMgbm90IEBhbmd1bGFyL21hdGVyaWFsLCBza2lwIHRoZSBjaGVjay5cbiAgICBpZiAoaW1wb3J0TG9jYXRpb24gIT09IG1hdGVyaWFsTW9kdWxlU3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gaW1wb3J0IGNsYXVzZSBpcyBmb3VuZCwgb3Igbm90aGluZyBpcyBuYW1lZCBhcyBhIGJpbmRpbmcgaW4gdGhlXG4gICAgLy8gaW1wb3J0LCBhZGQgZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlIHx8ICFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWxsIG5hbWVkIGJpbmRpbmdzIGluIGltcG9ydCBjbGF1c2VzIG11c3QgYmUgbmFtZWQgc3ltYm9scywgb3RoZXJ3aXNlIGFkZFxuICAgIC8vIGZhaWx1cmUgc2F5aW5nIHRvIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIXRzLmlzTmFtZWRJbXBvcnRzKGRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gc3ltYm9scyBhcmUgaW4gdGhlIG5hbWVkIGJpbmRpbmdzIHRoZW4gYWRkIGZhaWx1cmUgc2F5aW5nIHRvXG4gICAgLy8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXaGV0aGVyIHRoZSBleGlzdGluZyBpbXBvcnQgZGVjbGFyYXRpb24gaXMgdXNpbmcgYSBzaW5nbGUgcXVvdGUgbW9kdWxlIHNwZWNpZmllci5cbiAgICBjb25zdCBzaW5nbGVRdW90ZUltcG9ydCA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRUZXh0KClbMF0gPT09IGAnYDtcblxuICAgIC8vIE1hcCB3aGljaCBjb25zaXN0cyBvZiBzZWNvbmRhcnkgZW50cnktcG9pbnRzIGFuZCBpbXBvcnQgc3BlY2lmaWVycyB3aGljaCBhcmUgdXNlZFxuICAgIC8vIHdpdGhpbiB0aGUgY3VycmVudCBpbXBvcnQgZGVjbGFyYXRpb24uXG4gICAgY29uc3QgaW1wb3J0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHRzLkltcG9ydFNwZWNpZmllcltdPigpO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBzdWJwYWNrYWdlIGVhY2ggc3ltYm9sIGluIHRoZSBuYW1lZEJpbmRpbmcgY29tZXMgZnJvbS5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5wcm9wZXJ0eU5hbWUgPyBlbGVtZW50LnByb3BlcnR5TmFtZSA6IGVsZW1lbnQubmFtZTtcblxuICAgICAgLy8gVHJ5IHRvIHJlc29sdmUgdGhlIG1vZHVsZSBuYW1lIHZpYSB0aGUgdHlwZSBjaGVja2VyLCBhbmQgaWYgaXQgZmFpbHMsIGZhbGwgYmFjayB0b1xuICAgICAgLy8gcmVzb2x2aW5nIGl0IGZyb20gb3VyIGxpc3Qgb2Ygc3ltYm9sIHRvIGVudHJ5IHBvaW50IG1hcHBpbmdzLiBVc2luZyB0aGUgdHlwZSBjaGVja2VyIGlzXG4gICAgICAvLyBtb3JlIGFjY3VyYXRlIGFuZCBkb2Vzbid0IHJlcXVpcmUgdXMgdG8ga2VlcCBhIGxpc3Qgb2Ygc3ltYm9scywgYnV0IGl0IHdvbid0IHdvcmsgaWZcbiAgICAgIC8vIHRoZSBzeW1ib2xzIGRvbid0IGV4aXN0IGFueW1vcmUgKGUuZy4gYWZ0ZXIgd2UgcmVtb3ZlIHRoZSB0b3AtbGV2ZWwgQGFuZ3VsYXIvbWF0ZXJpYWwpLlxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IHJlc29sdmVNb2R1bGVOYW1lKGVsZW1lbnROYW1lLCB0aGlzLnR5cGVDaGVja2VyKSB8fFxuICAgICAgICAgIEVOVFJZX1BPSU5UX01BUFBJTkdTW2VsZW1lbnROYW1lLnRleHRdIHx8IG51bGw7XG5cbiAgICAgIGlmICghbW9kdWxlTmFtZSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgZWxlbWVudCwgYFwiJHtlbGVtZW50LmdldFRleHQoKX1cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBNYXRlcmlhbCBsaWJyYXJ5LmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICAgLy8gVGhlIG1vZHVsZSBuYW1lIHdoZXJlIHRoZSBzeW1ib2wgaXMgZGVmaW5lZCBlLmcuIGNhcmQsIGRpYWxvZy4gVGhlXG4gICAgICAgIC8vIGZpcnN0IGNhcHR1cmUgZ3JvdXAgaXMgY29udGFpbnMgdGhlIG1vZHVsZSBuYW1lLlxuICAgICAgICBpZiAoaW1wb3J0TWFwLmhhcyhtb2R1bGVOYW1lKSkge1xuICAgICAgICAgIGltcG9ydE1hcC5nZXQobW9kdWxlTmFtZSkhLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0TWFwLnNldChtb2R1bGVOYW1lLCBbZWxlbWVudF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3JtcyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGludG8gbXVsdGlwbGUgaW1wb3J0IGRlY2xhcmF0aW9ucyB0aGF0IGltcG9ydFxuICAgIC8vIHRoZSBnaXZlbiBzeW1ib2xzIGZyb20gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50cy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gaW1wb3J0IHtNYXRDYXJkTW9kdWxlLCBNYXRDYXJkVGl0bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NhcmQnO1xuICAgIC8vIGltcG9ydCB7TWF0UmFkaW9Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3JhZGlvJztcbiAgICBjb25zdCBuZXdJbXBvcnRTdGF0ZW1lbnRzID1cbiAgICAgICAgQXJyYXkuZnJvbShpbXBvcnRNYXAuZW50cmllcygpKVxuICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgLm1hcCgoW25hbWUsIGVsZW1lbnRzXSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdJbXBvcnQgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdHMuY3JlYXRlTmFtZWRJbXBvcnRzKGVsZW1lbnRzKSksXG4gICAgICAgICAgICAgICAgICBjcmVhdGVTdHJpbmdMaXRlcmFsKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8ke25hbWV9YCwgc2luZ2xlUXVvdGVJbXBvcnQpKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbmV3SW1wb3J0LCBkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgIC8vIFdpdGhvdXQgYW55IGltcG9ydCBzdGF0ZW1lbnRzIHRoYXQgd2VyZSBnZW5lcmF0ZWQsIHdlIGNhbiBhc3N1bWUgdGhhdCB0aGlzIHdhcyBhbiBlbXB0eVxuICAgIC8vIGltcG9ydCBkZWNsYXJhdGlvbi4gV2Ugc3RpbGwgd2FudCB0byBhZGQgYSBmYWlsdXJlIGluIG9yZGVyIHRvIG1ha2UgZGV2ZWxvcGVycyBhd2FyZSB0aGF0XG4gICAgLy8gaW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuXG4gICAgaWYgKCFuZXdJbXBvcnRTdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcblxuICAgIC8vIFBlcmZvcm0gdGhlIHJlcGxhY2VtZW50IHRoYXQgc3dpdGNoZXMgdGhlIHByaW1hcnkgZW50cnktcG9pbnQgaW1wb3J0IHRvXG4gICAgLy8gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50IGltcG9ydHMuXG4gICAgcmVjb3JkZXIucmVtb3ZlKGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIGRlY2xhcmF0aW9uLmdldFdpZHRoKCkpO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIG5ld0ltcG9ydFN0YXRlbWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0cmluZyBsaXRlcmFsIGZyb20gdGhlIHNwZWNpZmllZCB0ZXh0LlxuICogQHBhcmFtIHRleHQgVGV4dCBvZiB0aGUgc3RyaW5nIGxpdGVyYWwuXG4gKiBAcGFyYW0gc2luZ2xlUXVvdGVzIFdoZXRoZXIgc2luZ2xlIHF1b3RlcyBzaG91bGQgYmUgdXNlZCB3aGVuIHByaW50aW5nIHRoZSBsaXRlcmFsIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dDogc3RyaW5nLCBzaW5nbGVRdW90ZXM6IGJvb2xlYW4pOiB0cy5TdHJpbmdMaXRlcmFsIHtcbiAgY29uc3QgbGl0ZXJhbCA9IHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dCk7XG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL3NyYy9jb21waWxlci91dGlsaXRpZXMudHMjTDU4NC1MNTkwXG4gIGxpdGVyYWxbJ3NpbmdsZVF1b3RlJ10gPSBzaW5nbGVRdW90ZXM7XG4gIHJldHVybiBsaXRlcmFsO1xufVxuXG4vKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiAqL1xuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSwgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiB0cy5TeW1ib2x8dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgIHJldHVybiBjaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuICByZXR1cm4gc3ltYm9sO1xufVxuXG5cbi8qKiBUcmllcyB0byByZXNvbHZlIHRoZSBuYW1lIG9mIHRoZSBNYXRlcmlhbCBtb2R1bGUgdGhhdCBhIG5vZGUgaXMgaW1wb3J0ZWQgZnJvbS4gKi9cbmZ1bmN0aW9uIHJlc29sdmVNb2R1bGVOYW1lKG5vZGU6IHRzLklkZW50aWZpZXIsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcikge1xuICAvLyBHZXQgdGhlIHN5bWJvbCBmb3IgdGhlIG5hbWVkIGJpbmRpbmcgZWxlbWVudC4gTm90ZSB0aGF0IHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlXG4gIC8vIHZhbHVlIGRlY2xhcmF0aW9uIGJhc2VkIG9uIHRoZSB0eXBlIG9mIHRoZSBlbGVtZW50IGFzIHR5cGVzIGFyZSBub3QgbmVjZXNzYXJpbHlcbiAgLy8gc3BlY2lmaWMgdG8gYSBnaXZlbiBzZWNvbmRhcnkgZW50cnktcG9pbnQgKGUuZy4gZXhwb3J0cyB3aXRoIHRoZSB0eXBlIG9mIFwic3RyaW5nXCIpXG4gIC8vIHdvdWxkIHJlc29sdmUgdG8gdGhlIG1vZHVsZSB0eXBlcyBwcm92aWRlZCBieSBUeXBlU2NyaXB0IGl0c2VsZi5cbiAgY29uc3Qgc3ltYm9sID0gZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSwgdHlwZUNoZWNrZXIpO1xuXG4gIC8vIElmIHRoZSBzeW1ib2wgY2FuJ3QgYmUgZm91bmQsIG9yIG5vIGRlY2xhcmF0aW9uIGNvdWxkIGJlIGZvdW5kIHdpdGhpblxuICAvLyB0aGUgc3ltYm9sLCBhZGQgZmFpbHVyZSB0byByZXBvcnQgdGhhdCB0aGUgZ2l2ZW4gc3ltYm9sIGNhbid0IGJlIGZvdW5kLlxuICBpZiAoIXN5bWJvbCB8fFxuICAgICAgIShzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCAoc3ltYm9sLmRlY2xhcmF0aW9ucyAmJiBzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMCkpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBUaGUgZmlsZW5hbWUgZm9yIHRoZSBzb3VyY2UgZmlsZSBvZiB0aGUgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAvLyBmaXJzdCBkZWNsYXJhdGlvbiBvZiB0aGUgc3ltYm9sLiBBbGwgc3ltYm9sIGRlY2xhcmF0aW9ucyBtdXN0IGJlXG4gIC8vIHBhcnQgb2YgYSBkZWZpbmluZyBub2RlLCBzbyBwYXJlbnQgY2FuIGJlIGFzc2VydGVkIHRvIGJlIGRlZmluZWQuXG4gIGNvbnN0IHJlc29sdmVkTm9kZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlZE5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuXG4gIC8vIEZpbGUgdGhlIG1vZHVsZSB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8gZnJvbSBhIHJlZ2V4IG1hdGNoIG9mIHRoZVxuICAvLyBmaWxlbmFtZS4gVGhpcyB3aWxsIGFsd2F5cyBtYXRjaCBzaW5jZSBvbmx5IFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIlxuICAvLyBlbGVtZW50cyBhcmUgYW5hbHl6ZWQuXG4gIGNvbnN0IG1hdGNoZXMgPSBzb3VyY2VGaWxlLm1hdGNoKEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVgpO1xuICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xufVxuIl19