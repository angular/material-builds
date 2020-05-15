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
        define("@angular/material/schematics/ng-update/migrations/package-imports-v8/secondary-entry-points-migration", ["require", "exports", "@angular/cdk/schematics", "typescript", "@angular/material/schematics/ng-update/typescript/module-specifiers"], factory);
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
     * Migration that updates imports which refer to the primary Angular Material
     * entry-point to use the appropriate secondary entry points (e.g. @angular/material/button).
     */
    class SecondaryEntryPointsMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            this.printer = ts.createPrinter();
            // Only enable this rule if the migration targets version 8. The primary
            // entry-point of Material has been marked as deprecated in version 8.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V8 || this.targetVersion === schematics_1.TargetVersion.V9;
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
            const filePath = this.fileSystem.resolve(declaration.moduleSpecifier.getSourceFile().fileName);
            const recorder = this.fileSystem.edit(filePath);
            // Perform the replacement that switches the primary entry-point import to
            // the individual secondary entry-point imports.
            recorder.remove(declaration.getStart(), declaration.getWidth());
            recorder.insertRight(declaration.getStart(), newImportStatements);
        }
    }
    exports.SecondaryEntryPointsMigration = SecondaryEntryPointsMigration;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBaUU7SUFDakUsaUNBQWlDO0lBQ2pDLDJHQUF3RjtJQUV4RixNQUFNLDJCQUEyQixHQUFHLG9EQUFvRDtRQUNwRiw0REFBNEQsQ0FBQztJQUVqRSxNQUFNLG1DQUFtQyxHQUFHLDhDQUE4QztRQUN0Riw0REFBNEQsQ0FBQztJQUVqRTs7O09BR0c7SUFDSCxNQUFNLCtCQUErQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsMkNBQXVCLFNBQVMsQ0FBQyxDQUFDO0lBRXhGOzs7T0FHRztJQUNILE1BQU0sb0JBQW9CLEdBQTZCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBRTFGOzs7T0FHRztJQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7UUFBbEU7O1lBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU3Qix3RUFBd0U7WUFDeEUsc0VBQXNFO1lBQ3RFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7UUF1Ry9GLENBQUM7UUFyR0MsU0FBUyxDQUFDLFdBQW9CO1lBQzVCLG9DQUFvQztZQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztnQkFDcEMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxF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LGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUV6RCxrRUFBa0U7UUFDbEUsa0VBQWtFO1FBQ2xFLHlCQUF5QjtRQUN6QixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDbEUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb24sIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0gZnJvbSAnLi4vLi4vLi4vbmctdXBkYXRlL3R5cGVzY3JpcHQvbW9kdWxlLXNwZWNpZmllcnMnO1xuXG5jb25zdCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIgPSBgSW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIGAgK1xuICAgIGBJbnN0ZWFkIGltcG9ydCBmcm9tIHRoZSBlbnRyeS1wb2ludCB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8uYDtcblxuY29uc3QgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIgPSBgSW1wb3J0cyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgc2hvdWxkIGltcG9ydCBgICtcbiAgICBgc3BlY2lmaWMgc3ltYm9scyByYXRoZXIgdGhhbiBpbXBvcnRpbmcgdGhlIGVudGlyZSBsaWJyYXJ5LmA7XG5cbi8qKlxuICogUmVnZXggZm9yIHRlc3RpbmcgZmlsZSBwYXRocyBhZ2FpbnN0IHRvIGRldGVybWluZSBpZiB0aGUgZmlsZSBpcyBmcm9tIHRoZVxuICogQW5ndWxhciBNYXRlcmlhbCBsaWJyYXJ5LlxuICovXG5jb25zdCBBTkdVTEFSX01BVEVSSUFMX0ZJTEVQQVRIX1JFR0VYID0gbmV3IFJlZ0V4cChgJHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0vKC4qPykvYCk7XG5cbi8qKlxuICogTWFwcGluZyBvZiBNYXRlcmlhbCBzeW1ib2wgbmFtZXMgdG8gdGhlaXIgbW9kdWxlIG5hbWVzLiBVc2VkIGFzIGEgZmFsbGJhY2sgaWZcbiAqIHdlIGRpZG4ndCBtYW5hZ2UgdG8gcmVzb2x2ZSB0aGUgbW9kdWxlIG5hbWUgb2YgYSBzeW1ib2wgdXNpbmcgdGhlIHR5cGUgY2hlY2tlci5cbiAqL1xuY29uc3QgRU5UUllfUE9JTlRfTUFQUElOR1M6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHJlcXVpcmUoJy4vbWF0ZXJpYWwtc3ltYm9scy5qc29uJyk7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgdXBkYXRlcyBpbXBvcnRzIHdoaWNoIHJlZmVyIHRvIHRoZSBwcmltYXJ5IEFuZ3VsYXIgTWF0ZXJpYWxcbiAqIGVudHJ5LXBvaW50IHRvIHVzZSB0aGUgYXBwcm9wcmlhdGUgc2Vjb25kYXJ5IGVudHJ5IHBvaW50cyAoZS5nLiBAYW5ndWxhci9tYXRlcmlhbC9idXR0b24pLlxuICovXG5leHBvcnQgY2xhc3MgU2Vjb25kYXJ5RW50cnlQb2ludHNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuICBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA4LiBUaGUgcHJpbWFyeVxuICAvLyBlbnRyeS1wb2ludCBvZiBNYXRlcmlhbCBoYXMgYmVlbiBtYXJrZWQgYXMgZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDguXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjggfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY5O1xuXG4gIHZpc2l0Tm9kZShkZWNsYXJhdGlvbjogdHMuTm9kZSk6IHZvaWQge1xuICAgIC8vIE9ubHkgbG9vayBhdCBpbXBvcnQgZGVjbGFyYXRpb25zLlxuICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHxcbiAgICAgICAgIXRzLmlzU3RyaW5nTGl0ZXJhbExpa2UoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydExvY2F0aW9uID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG4gICAgLy8gSWYgdGhlIGltcG9ydCBtb2R1bGUgaXMgbm90IEBhbmd1bGFyL21hdGVyaWFsLCBza2lwIHRoZSBjaGVjay5cbiAgICBpZiAoaW1wb3J0TG9jYXRpb24gIT09IG1hdGVyaWFsTW9kdWxlU3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gaW1wb3J0IGNsYXVzZSBpcyBmb3VuZCwgb3Igbm90aGluZyBpcyBuYW1lZCBhcyBhIGJpbmRpbmcgaW4gdGhlXG4gICAgLy8gaW1wb3J0LCBhZGQgZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlIHx8ICFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWxsIG5hbWVkIGJpbmRpbmdzIGluIGltcG9ydCBjbGF1c2VzIG11c3QgYmUgbmFtZWQgc3ltYm9scywgb3RoZXJ3aXNlIGFkZFxuICAgIC8vIGZhaWx1cmUgc2F5aW5nIHRvIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIXRzLmlzTmFtZWRJbXBvcnRzKGRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gc3ltYm9scyBhcmUgaW4gdGhlIG5hbWVkIGJpbmRpbmdzIHRoZW4gYWRkIGZhaWx1cmUgc2F5aW5nIHRvXG4gICAgLy8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXaGV0aGVyIHRoZSBleGlzdGluZyBpbXBvcnQgZGVjbGFyYXRpb24gaXMgdXNpbmcgYSBzaW5nbGUgcXVvdGUgbW9kdWxlIHNwZWNpZmllci5cbiAgICBjb25zdCBzaW5nbGVRdW90ZUltcG9ydCA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRUZXh0KClbMF0gPT09IGAnYDtcblxuICAgIC8vIE1hcCB3aGljaCBjb25zaXN0cyBvZiBzZWNvbmRhcnkgZW50cnktcG9pbnRzIGFuZCBpbXBvcnQgc3BlY2lmaWVycyB3aGljaCBhcmUgdXNlZFxuICAgIC8vIHdpdGhpbiB0aGUgY3VycmVudCBpbXBvcnQgZGVjbGFyYXRpb24uXG4gICAgY29uc3QgaW1wb3J0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHRzLkltcG9ydFNwZWNpZmllcltdPigpO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBzdWJwYWNrYWdlIGVhY2ggc3ltYm9sIGluIHRoZSBuYW1lZEJpbmRpbmcgY29tZXMgZnJvbS5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5wcm9wZXJ0eU5hbWUgPyBlbGVtZW50LnByb3BlcnR5TmFtZSA6IGVsZW1lbnQubmFtZTtcblxuICAgICAgLy8gVHJ5IHRvIHJlc29sdmUgdGhlIG1vZHVsZSBuYW1lIHZpYSB0aGUgdHlwZSBjaGVja2VyLCBhbmQgaWYgaXQgZmFpbHMsIGZhbGwgYmFjayB0b1xuICAgICAgLy8gcmVzb2x2aW5nIGl0IGZyb20gb3VyIGxpc3Qgb2Ygc3ltYm9sIHRvIGVudHJ5IHBvaW50IG1hcHBpbmdzLiBVc2luZyB0aGUgdHlwZSBjaGVja2VyIGlzXG4gICAgICAvLyBtb3JlIGFjY3VyYXRlIGFuZCBkb2Vzbid0IHJlcXVpcmUgdXMgdG8ga2VlcCBhIGxpc3Qgb2Ygc3ltYm9scywgYnV0IGl0IHdvbid0IHdvcmsgaWZcbiAgICAgIC8vIHRoZSBzeW1ib2xzIGRvbid0IGV4aXN0IGFueW1vcmUgKGUuZy4gYWZ0ZXIgd2UgcmVtb3ZlIHRoZSB0b3AtbGV2ZWwgQGFuZ3VsYXIvbWF0ZXJpYWwpLlxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IHJlc29sdmVNb2R1bGVOYW1lKGVsZW1lbnROYW1lLCB0aGlzLnR5cGVDaGVja2VyKSB8fFxuICAgICAgICAgIEVOVFJZX1BPSU5UX01BUFBJTkdTW2VsZW1lbnROYW1lLnRleHRdIHx8IG51bGw7XG5cbiAgICAgIGlmICghbW9kdWxlTmFtZSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgZWxlbWVudCwgYFwiJHtlbGVtZW50LmdldFRleHQoKX1cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBNYXRlcmlhbCBsaWJyYXJ5LmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgICAgLy8gVGhlIG1vZHVsZSBuYW1lIHdoZXJlIHRoZSBzeW1ib2wgaXMgZGVmaW5lZCBlLmcuIGNhcmQsIGRpYWxvZy4gVGhlXG4gICAgICAgIC8vIGZpcnN0IGNhcHR1cmUgZ3JvdXAgaXMgY29udGFpbnMgdGhlIG1vZHVsZSBuYW1lLlxuICAgICAgICBpZiAoaW1wb3J0TWFwLmhhcyhtb2R1bGVOYW1lKSkge1xuICAgICAgICAgIGltcG9ydE1hcC5nZXQobW9kdWxlTmFtZSkhLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0TWFwLnNldChtb2R1bGVOYW1lLCBbZWxlbWVudF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3JtcyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGludG8gbXVsdGlwbGUgaW1wb3J0IGRlY2xhcmF0aW9ucyB0aGF0IGltcG9ydFxuICAgIC8vIHRoZSBnaXZlbiBzeW1ib2xzIGZyb20gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50cy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gaW1wb3J0IHtNYXRDYXJkTW9kdWxlLCBNYXRDYXJkVGl0bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NhcmQnO1xuICAgIC8vIGltcG9ydCB7TWF0UmFkaW9Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3JhZGlvJztcbiAgICBjb25zdCBuZXdJbXBvcnRTdGF0ZW1lbnRzID1cbiAgICAgICAgQXJyYXkuZnJvbShpbXBvcnRNYXAuZW50cmllcygpKVxuICAgICAgICAgICAgLnNvcnQoKVxuICAgICAgICAgICAgLm1hcCgoW25hbWUsIGVsZW1lbnRzXSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdJbXBvcnQgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgdHMuY3JlYXRlTmFtZWRJbXBvcnRzKGVsZW1lbnRzKSksXG4gICAgICAgICAgICAgICAgICBjcmVhdGVTdHJpbmdMaXRlcmFsKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8ke25hbWV9YCwgc2luZ2xlUXVvdGVJbXBvcnQpKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgICAgICAgICB0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgbmV3SW1wb3J0LCBkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcblxuICAgIC8vIFdpdGhvdXQgYW55IGltcG9ydCBzdGF0ZW1lbnRzIHRoYXQgd2VyZSBnZW5lcmF0ZWQsIHdlIGNhbiBhc3N1bWUgdGhhdCB0aGlzIHdhcyBhbiBlbXB0eVxuICAgIC8vIGltcG9ydCBkZWNsYXJhdGlvbi4gV2Ugc3RpbGwgd2FudCB0byBhZGQgYSBmYWlsdXJlIGluIG9yZGVyIHRvIG1ha2UgZGV2ZWxvcGVycyBhd2FyZSB0aGF0XG4gICAgLy8gaW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuXG4gICAgaWYgKCFuZXdJbXBvcnRTdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoXG4gICAgICAgIGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQoZmlsZVBhdGgpO1xuXG4gICAgLy8gUGVyZm9ybSB0aGUgcmVwbGFjZW1lbnQgdGhhdCBzd2l0Y2hlcyB0aGUgcHJpbWFyeSBlbnRyeS1wb2ludCBpbXBvcnQgdG9cbiAgICAvLyB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnQgaW1wb3J0cy5cbiAgICByZWNvcmRlci5yZW1vdmUoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgZGVjbGFyYXRpb24uZ2V0V2lkdGgoKSk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgbmV3SW1wb3J0U3RhdGVtZW50cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RyaW5nIGxpdGVyYWwgZnJvbSB0aGUgc3BlY2lmaWVkIHRleHQuXG4gKiBAcGFyYW0gdGV4dCBUZXh0IG9mIHRoZSBzdHJpbmcgbGl0ZXJhbC5cbiAqIEBwYXJhbSBzaW5nbGVRdW90ZXMgV2hldGhlciBzaW5nbGUgcXVvdGVzIHNob3VsZCBiZSB1c2VkIHdoZW4gcHJpbnRpbmcgdGhlIGxpdGVyYWwgbm9kZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3RyaW5nTGl0ZXJhbCh0ZXh0OiBzdHJpbmcsIHNpbmdsZVF1b3RlczogYm9vbGVhbik6IHRzLlN0cmluZ0xpdGVyYWwge1xuICBjb25zdCBsaXRlcmFsID0gdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbCh0ZXh0KTtcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvYmxvYi9tYXN0ZXIvc3JjL2NvbXBpbGVyL3V0aWxpdGllcy50cyNMNTg0LUw1OTBcbiAgbGl0ZXJhbFsnc2luZ2xlUXVvdGUnXSA9IHNpbmdsZVF1b3RlcztcbiAgcmV0dXJuIGxpdGVyYWw7XG59XG5cbi8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuICovXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICBjb25zdCBzeW1ib2wgPSBjaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgLy8gU3ltYm9scyBjYW4gYmUgYWxpYXNlcyBvZiB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLiBlLmcuIGluIG5hbWVkIGltcG9ydCBzcGVjaWZpZXJzLlxuICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgaWYgKHN5bWJvbCAmJiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpICE9PSAwKSB7XG4gICAgcmV0dXJuIGNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICB9XG4gIHJldHVybiBzeW1ib2w7XG59XG5cblxuLyoqIFRyaWVzIHRvIHJlc29sdmUgdGhlIG5hbWUgb2YgdGhlIE1hdGVyaWFsIG1vZHVsZSB0aGF0IGEgbm9kZSBpcyBpbXBvcnRlZCBmcm9tLiAqL1xuZnVuY3Rpb24gcmVzb2x2ZU1vZHVsZU5hbWUobm9kZTogdHMuSWRlbnRpZmllciwgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKSB7XG4gIC8vIEdldCB0aGUgc3ltYm9sIGZvciB0aGUgbmFtZWQgYmluZGluZyBlbGVtZW50LiBOb3RlIHRoYXQgd2UgY2Fubm90IGRldGVybWluZSB0aGVcbiAgLy8gdmFsdWUgZGVjbGFyYXRpb24gYmFzZWQgb24gdGhlIHR5cGUgb2YgdGhlIGVsZW1lbnQgYXMgdHlwZXMgYXJlIG5vdCBuZWNlc3NhcmlseVxuICAvLyBzcGVjaWZpYyB0byBhIGdpdmVuIHNlY29uZGFyeSBlbnRyeS1wb2ludCAoZS5nLiBleHBvcnRzIHdpdGggdGhlIHR5cGUgb2YgXCJzdHJpbmdcIilcbiAgLy8gd291bGQgcmVzb2x2ZSB0byB0aGUgbW9kdWxlIHR5cGVzIHByb3ZpZGVkIGJ5IFR5cGVTY3JpcHQgaXRzZWxmLlxuICBjb25zdCBzeW1ib2wgPSBnZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlLCB0eXBlQ2hlY2tlcik7XG5cbiAgLy8gSWYgdGhlIHN5bWJvbCBjYW4ndCBiZSBmb3VuZCwgb3Igbm8gZGVjbGFyYXRpb24gY291bGQgYmUgZm91bmQgd2l0aGluXG4gIC8vIHRoZSBzeW1ib2wsIGFkZCBmYWlsdXJlIHRvIHJlcG9ydCB0aGF0IHRoZSBnaXZlbiBzeW1ib2wgY2FuJ3QgYmUgZm91bmQuXG4gIGlmICghc3ltYm9sIHx8XG4gICAgICAhKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IChzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAwKSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFRoZSBmaWxlbmFtZSBmb3IgdGhlIHNvdXJjZSBmaWxlIG9mIHRoZSBub2RlIHRoYXQgY29udGFpbnMgdGhlXG4gIC8vIGZpcnN0IGRlY2xhcmF0aW9uIG9mIHRoZSBzeW1ib2wuIEFsbCBzeW1ib2wgZGVjbGFyYXRpb25zIG11c3QgYmVcbiAgLy8gcGFydCBvZiBhIGRlZmluaW5nIG5vZGUsIHNvIHBhcmVudCBjYW4gYmUgYXNzZXJ0ZWQgdG8gYmUgZGVmaW5lZC5cbiAgY29uc3QgcmVzb2x2ZWROb2RlID0gc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gfHwgc3ltYm9sLmRlY2xhcmF0aW9uc1swXTtcbiAgY29uc3Qgc291cmNlRmlsZSA9IHJlc29sdmVkTm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG5cbiAgLy8gRmlsZSB0aGUgbW9kdWxlIHRoZSBzeW1ib2wgYmVsb25ncyB0byBmcm9tIGEgcmVnZXggbWF0Y2ggb2YgdGhlXG4gIC8vIGZpbGVuYW1lLiBUaGlzIHdpbGwgYWx3YXlzIG1hdGNoIHNpbmNlIG9ubHkgXCJAYW5ndWxhci9tYXRlcmlhbFwiXG4gIC8vIGVsZW1lbnRzIGFyZSBhbmFseXplZC5cbiAgY29uc3QgbWF0Y2hlcyA9IHNvdXJjZUZpbGUubWF0Y2goQU5HVUxBUl9NQVRFUklBTF9GSUxFUEFUSF9SRUdFWCk7XG4gIHJldHVybiBtYXRjaGVzID8gbWF0Y2hlc1sxXSA6IG51bGw7XG59XG4iXX0=