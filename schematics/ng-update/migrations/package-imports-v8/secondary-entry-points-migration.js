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
            const recorder = this.fileSystem.edit(declaration.moduleSpecifier.getSourceFile().fileName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBaUU7SUFDakUsaUNBQWlDO0lBQ2pDLDJHQUF3RjtJQUV4RixNQUFNLDJCQUEyQixHQUFHLG9EQUFvRDtRQUNwRiw0REFBNEQsQ0FBQztJQUVqRSxNQUFNLG1DQUFtQyxHQUFHLDhDQUE4QztRQUN0Riw0REFBNEQsQ0FBQztJQUVqRTs7O09BR0c7SUFDSCxNQUFNLCtCQUErQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsMkNBQXVCLFNBQVMsQ0FBQyxDQUFDO0lBRXhGOzs7T0FHRztJQUNILE1BQU0sb0JBQW9CLEdBQTZCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBRTFGOzs7T0FHRztJQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7UUFBbEU7O1lBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU3Qix3RUFBd0U7WUFDeEUsc0VBQXNFO1lBQ3RFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7UUFxRy9GLENBQUM7UUFuR0MsU0FBUyxDQUFDLFdBQW9CO1lBQzVCLG9DQUFvQztZQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztnQkFDcEMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxF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Q3pCLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNsRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfSBmcm9tICcuLi8uLi8uLi9uZy11cGRhdGUvdHlwZXNjcmlwdC9tb2R1bGUtc3BlY2lmaWVycyc7XG5cbmNvbnN0IE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUiA9IGBJbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC4gYCArXG4gICAgYEluc3RlYWQgaW1wb3J0IGZyb20gdGhlIGVudHJ5LXBvaW50IHRoZSBzeW1ib2wgYmVsb25ncyB0by5gO1xuXG5jb25zdCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUiA9IGBJbXBvcnRzIGZyb20gQW5ndWxhciBNYXRlcmlhbCBzaG91bGQgaW1wb3J0IGAgK1xuICAgIGBzcGVjaWZpYyBzeW1ib2xzIHJhdGhlciB0aGFuIGltcG9ydGluZyB0aGUgZW50aXJlIGxpYnJhcnkuYDtcblxuLyoqXG4gKiBSZWdleCBmb3IgdGVzdGluZyBmaWxlIHBhdGhzIGFnYWluc3QgdG8gZGV0ZXJtaW5lIGlmIHRoZSBmaWxlIGlzIGZyb20gdGhlXG4gKiBBbmd1bGFyIE1hdGVyaWFsIGxpYnJhcnkuXG4gKi9cbmNvbnN0IEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVggPSBuZXcgUmVnRXhwKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8oLio/KS9gKTtcblxuLyoqXG4gKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHN5bWJvbCBuYW1lcyB0byB0aGVpciBtb2R1bGUgbmFtZXMuIFVzZWQgYXMgYSBmYWxsYmFjayBpZlxuICogd2UgZGlkbid0IG1hbmFnZSB0byByZXNvbHZlIHRoZSBtb2R1bGUgbmFtZSBvZiBhIHN5bWJvbCB1c2luZyB0aGUgdHlwZSBjaGVja2VyLlxuICovXG5jb25zdCBFTlRSWV9QT0lOVF9NQVBQSU5HUzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9ID0gcmVxdWlyZSgnLi9tYXRlcmlhbC1zeW1ib2xzLmpzb24nKTtcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB1cGRhdGVzIGltcG9ydHMgd2hpY2ggcmVmZXIgdG8gdGhlIHByaW1hcnkgQW5ndWxhciBNYXRlcmlhbFxuICogZW50cnktcG9pbnQgdG8gdXNlIHRoZSBhcHByb3ByaWF0ZSBzZWNvbmRhcnkgZW50cnkgcG9pbnRzIChlLmcuIEBhbmd1bGFyL21hdGVyaWFsL2J1dHRvbikuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWNvbmRhcnlFbnRyeVBvaW50c01pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG4gIHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDguIFRoZSBwcmltYXJ5XG4gIC8vIGVudHJ5LXBvaW50IG9mIE1hdGVyaWFsIGhhcyBiZWVuIG1hcmtlZCBhcyBkZXByZWNhdGVkIGluIHZlcnNpb24gOC5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOCB8fCB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjk7XG5cbiAgdmlzaXROb2RlKGRlY2xhcmF0aW9uOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgLy8gT25seSBsb29rIGF0IGltcG9ydCBkZWNsYXJhdGlvbnMuXG4gICAgaWYgKCF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSB8fFxuICAgICAgICAhdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0TG9jYXRpb24gPSBkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIudGV4dDtcbiAgICAvLyBJZiB0aGUgaW1wb3J0IG1vZHVsZSBpcyBub3QgQGFuZ3VsYXIvbWF0ZXJpYWwsIHNraXAgdGhlIGNoZWNrLlxuICAgIGlmIChpbXBvcnRMb2NhdGlvbiAhPT0gbWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBpbXBvcnQgY2xhdXNlIGlzIGZvdW5kLCBvciBub3RoaW5nIGlzIG5hbWVkIGFzIGEgYmluZGluZyBpbiB0aGVcbiAgICAvLyBpbXBvcnQsIGFkZCBmYWlsdXJlIHNheWluZyB0byBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UgfHwgIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBbGwgbmFtZWQgYmluZGluZ3MgaW4gaW1wb3J0IGNsYXVzZXMgbXVzdCBiZSBuYW1lZCBzeW1ib2xzLCBvdGhlcndpc2UgYWRkXG4gICAgLy8gZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghdHMuaXNOYW1lZEltcG9ydHMoZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBzeW1ib2xzIGFyZSBpbiB0aGUgbmFtZWQgYmluZGluZ3MgdGhlbiBhZGQgZmFpbHVyZSBzYXlpbmcgdG9cbiAgICAvLyBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdoZXRoZXIgdGhlIGV4aXN0aW5nIGltcG9ydCBkZWNsYXJhdGlvbiBpcyB1c2luZyBhIHNpbmdsZSBxdW90ZSBtb2R1bGUgc3BlY2lmaWVyLlxuICAgIGNvbnN0IHNpbmdsZVF1b3RlSW1wb3J0ID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLmdldFRleHQoKVswXSA9PT0gYCdgO1xuXG4gICAgLy8gTWFwIHdoaWNoIGNvbnNpc3RzIG9mIHNlY29uZGFyeSBlbnRyeS1wb2ludHMgYW5kIGltcG9ydCBzcGVjaWZpZXJzIHdoaWNoIGFyZSB1c2VkXG4gICAgLy8gd2l0aGluIHRoZSBjdXJyZW50IGltcG9ydCBkZWNsYXJhdGlvbi5cbiAgICBjb25zdCBpbXBvcnRNYXAgPSBuZXcgTWFwPHN0cmluZywgdHMuSW1wb3J0U3BlY2lmaWVyW10+KCk7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN1YnBhY2thZ2UgZWFjaCBzeW1ib2wgaW4gdGhlIG5hbWVkQmluZGluZyBjb21lcyBmcm9tLlxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cykge1xuICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LnByb3BlcnR5TmFtZSA/IGVsZW1lbnQucHJvcGVydHlOYW1lIDogZWxlbWVudC5uYW1lO1xuXG4gICAgICAvLyBUcnkgdG8gcmVzb2x2ZSB0aGUgbW9kdWxlIG5hbWUgdmlhIHRoZSB0eXBlIGNoZWNrZXIsIGFuZCBpZiBpdCBmYWlscywgZmFsbCBiYWNrIHRvXG4gICAgICAvLyByZXNvbHZpbmcgaXQgZnJvbSBvdXIgbGlzdCBvZiBzeW1ib2wgdG8gZW50cnkgcG9pbnQgbWFwcGluZ3MuIFVzaW5nIHRoZSB0eXBlIGNoZWNrZXIgaXNcbiAgICAgIC8vIG1vcmUgYWNjdXJhdGUgYW5kIGRvZXNuJ3QgcmVxdWlyZSB1cyB0byBrZWVwIGEgbGlzdCBvZiBzeW1ib2xzLCBidXQgaXQgd29uJ3Qgd29yayBpZlxuICAgICAgLy8gdGhlIHN5bWJvbHMgZG9uJ3QgZXhpc3QgYW55bW9yZSAoZS5nLiBhZnRlciB3ZSByZW1vdmUgdGhlIHRvcC1sZXZlbCBAYW5ndWxhci9tYXRlcmlhbCkuXG4gICAgICBjb25zdCBtb2R1bGVOYW1lID0gcmVzb2x2ZU1vZHVsZU5hbWUoZWxlbWVudE5hbWUsIHRoaXMudHlwZUNoZWNrZXIpIHx8XG4gICAgICAgICAgRU5UUllfUE9JTlRfTUFQUElOR1NbZWxlbWVudE5hbWUudGV4dF0gfHwgbnVsbDtcblxuICAgICAgaWYgKCFtb2R1bGVOYW1lKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBlbGVtZW50LCBgXCIke2VsZW1lbnQuZ2V0VGV4dCgpfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIE1hdGVyaWFsIGxpYnJhcnkuYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgICAvLyBUaGUgbW9kdWxlIG5hbWUgd2hlcmUgdGhlIHN5bWJvbCBpcyBkZWZpbmVkIGUuZy4gY2FyZCwgZGlhbG9nLiBUaGVcbiAgICAgICAgLy8gZmlyc3QgY2FwdHVyZSBncm91cCBpcyBjb250YWlucyB0aGUgbW9kdWxlIG5hbWUuXG4gICAgICAgIGlmIChpbXBvcnRNYXAuaGFzKG1vZHVsZU5hbWUpKSB7XG4gICAgICAgICAgaW1wb3J0TWFwLmdldChtb2R1bGVOYW1lKSEucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbXBvcnRNYXAuc2V0KG1vZHVsZU5hbWUsIFtlbGVtZW50XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gaW50byBtdWx0aXBsZSBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgaW1wb3J0XG4gICAgLy8gdGhlIGdpdmVuIHN5bWJvbHMgZnJvbSB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzLiBGb3IgZXhhbXBsZTpcbiAgICAvLyBpbXBvcnQge01hdENhcmRNb2R1bGUsIE1hdENhcmRUaXRsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCc7XG4gICAgLy8gaW1wb3J0IHtNYXRSYWRpb01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcmFkaW8nO1xuICAgIGNvbnN0IG5ld0ltcG9ydFN0YXRlbWVudHMgPVxuICAgICAgICBBcnJheS5mcm9tKGltcG9ydE1hcC5lbnRyaWVzKCkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAubWFwKChbbmFtZSwgZWxlbWVudHNdKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydCA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB0cy5jcmVhdGVOYW1lZEltcG9ydHMoZWxlbWVudHMpKSxcbiAgICAgICAgICAgICAgICAgIGNyZWF0ZVN0cmluZ0xpdGVyYWwoYCR7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9LyR7bmFtZX1gLCBzaW5nbGVRdW90ZUltcG9ydCkpO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBuZXdJbXBvcnQsIGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgLy8gV2l0aG91dCBhbnkgaW1wb3J0IHN0YXRlbWVudHMgdGhhdCB3ZXJlIGdlbmVyYXRlZCwgd2UgY2FuIGFzc3VtZSB0aGF0IHRoaXMgd2FzIGFuIGVtcHR5XG4gICAgLy8gaW1wb3J0IGRlY2xhcmF0aW9uLiBXZSBzdGlsbCB3YW50IHRvIGFkZCBhIGZhaWx1cmUgaW4gb3JkZXIgdG8gbWFrZSBkZXZlbG9wZXJzIGF3YXJlIHRoYXRcbiAgICAvLyBpbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC5cbiAgICBpZiAoIW5ld0ltcG9ydFN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIsIE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcblxuICAgIC8vIFBlcmZvcm0gdGhlIHJlcGxhY2VtZW50IHRoYXQgc3dpdGNoZXMgdGhlIHByaW1hcnkgZW50cnktcG9pbnQgaW1wb3J0IHRvXG4gICAgLy8gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50IGltcG9ydHMuXG4gICAgcmVjb3JkZXIucmVtb3ZlKGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIGRlY2xhcmF0aW9uLmdldFdpZHRoKCkpO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIG5ld0ltcG9ydFN0YXRlbWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0cmluZyBsaXRlcmFsIGZyb20gdGhlIHNwZWNpZmllZCB0ZXh0LlxuICogQHBhcmFtIHRleHQgVGV4dCBvZiB0aGUgc3RyaW5nIGxpdGVyYWwuXG4gKiBAcGFyYW0gc2luZ2xlUXVvdGVzIFdoZXRoZXIgc2luZ2xlIHF1b3RlcyBzaG91bGQgYmUgdXNlZCB3aGVuIHByaW50aW5nIHRoZSBsaXRlcmFsIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dDogc3RyaW5nLCBzaW5nbGVRdW90ZXM6IGJvb2xlYW4pOiB0cy5TdHJpbmdMaXRlcmFsIHtcbiAgY29uc3QgbGl0ZXJhbCA9IHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dCk7XG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL3NyYy9jb21waWxlci91dGlsaXRpZXMudHMjTDU4NC1MNTkwXG4gIGxpdGVyYWxbJ3NpbmdsZVF1b3RlJ10gPSBzaW5nbGVRdW90ZXM7XG4gIHJldHVybiBsaXRlcmFsO1xufVxuXG4vKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiAqL1xuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSwgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiB0cy5TeW1ib2x8dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgIHJldHVybiBjaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuICByZXR1cm4gc3ltYm9sO1xufVxuXG5cbi8qKiBUcmllcyB0byByZXNvbHZlIHRoZSBuYW1lIG9mIHRoZSBNYXRlcmlhbCBtb2R1bGUgdGhhdCBhIG5vZGUgaXMgaW1wb3J0ZWQgZnJvbS4gKi9cbmZ1bmN0aW9uIHJlc29sdmVNb2R1bGVOYW1lKG5vZGU6IHRzLklkZW50aWZpZXIsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcikge1xuICAvLyBHZXQgdGhlIHN5bWJvbCBmb3IgdGhlIG5hbWVkIGJpbmRpbmcgZWxlbWVudC4gTm90ZSB0aGF0IHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlXG4gIC8vIHZhbHVlIGRlY2xhcmF0aW9uIGJhc2VkIG9uIHRoZSB0eXBlIG9mIHRoZSBlbGVtZW50IGFzIHR5cGVzIGFyZSBub3QgbmVjZXNzYXJpbHlcbiAgLy8gc3BlY2lmaWMgdG8gYSBnaXZlbiBzZWNvbmRhcnkgZW50cnktcG9pbnQgKGUuZy4gZXhwb3J0cyB3aXRoIHRoZSB0eXBlIG9mIFwic3RyaW5nXCIpXG4gIC8vIHdvdWxkIHJlc29sdmUgdG8gdGhlIG1vZHVsZSB0eXBlcyBwcm92aWRlZCBieSBUeXBlU2NyaXB0IGl0c2VsZi5cbiAgY29uc3Qgc3ltYm9sID0gZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZSwgdHlwZUNoZWNrZXIpO1xuXG4gIC8vIElmIHRoZSBzeW1ib2wgY2FuJ3QgYmUgZm91bmQsIG9yIG5vIGRlY2xhcmF0aW9uIGNvdWxkIGJlIGZvdW5kIHdpdGhpblxuICAvLyB0aGUgc3ltYm9sLCBhZGQgZmFpbHVyZSB0byByZXBvcnQgdGhhdCB0aGUgZ2l2ZW4gc3ltYm9sIGNhbid0IGJlIGZvdW5kLlxuICBpZiAoIXN5bWJvbCB8fFxuICAgICAgIShzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCAoc3ltYm9sLmRlY2xhcmF0aW9ucyAmJiBzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMCkpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBUaGUgZmlsZW5hbWUgZm9yIHRoZSBzb3VyY2UgZmlsZSBvZiB0aGUgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAvLyBmaXJzdCBkZWNsYXJhdGlvbiBvZiB0aGUgc3ltYm9sLiBBbGwgc3ltYm9sIGRlY2xhcmF0aW9ucyBtdXN0IGJlXG4gIC8vIHBhcnQgb2YgYSBkZWZpbmluZyBub2RlLCBzbyBwYXJlbnQgY2FuIGJlIGFzc2VydGVkIHRvIGJlIGRlZmluZWQuXG4gIGNvbnN0IHJlc29sdmVkTm9kZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlZE5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuXG4gIC8vIEZpbGUgdGhlIG1vZHVsZSB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8gZnJvbSBhIHJlZ2V4IG1hdGNoIG9mIHRoZVxuICAvLyBmaWxlbmFtZS4gVGhpcyB3aWxsIGFsd2F5cyBtYXRjaCBzaW5jZSBvbmx5IFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIlxuICAvLyBlbGVtZW50cyBhcmUgYW5hbHl6ZWQuXG4gIGNvbnN0IG1hdGNoZXMgPSBzb3VyY2VGaWxlLm1hdGNoKEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVgpO1xuICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xufVxuIl19