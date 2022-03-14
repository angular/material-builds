"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondaryEntryPointsMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
const module_specifiers_1 = require("../../../ng-update/typescript/module-specifiers");
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
                ENTRY_POINT_MAPPINGS[elementName.text] ||
                null;
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
            const newImport = ts.factory.createImportDeclaration(undefined, undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports(elements)), ts.factory.createStringLiteral(`${module_specifiers_1.materialModuleSpecifier}/${name}`, singleQuoteImport));
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
    const resolvedNode = symbol.valueDeclaration || symbol.declarations?.[0];
    if (resolvedNode === undefined) {
        return null;
    }
    const sourceFile = resolvedNode.getSourceFile().fileName;
    // File the module the symbol belongs to from a regex match of the
    // filename. This will always match since only "@angular/material"
    // elements are analyzed.
    const matches = sourceFile.match(ANGULAR_MATERIAL_FILEPATH_REGEX);
    return matches ? matches[1] : null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUNqQyx1RkFBd0Y7QUFFeEYsTUFBTSwyQkFBMkIsR0FDL0Isb0RBQW9EO0lBQ3BELDREQUE0RCxDQUFDO0FBRS9ELE1BQU0sbUNBQW1DLEdBQ3ZDLDhDQUE4QztJQUM5Qyw0REFBNEQsQ0FBQztBQUUvRDs7O0dBR0c7QUFDSCxNQUFNLCtCQUErQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsMkNBQXVCLFNBQVMsQ0FBQyxDQUFDO0FBRXhGOzs7R0FHRztBQUNILE1BQU0sb0JBQW9CLEdBQTZCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRTFGOzs7R0FHRztBQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7SUFBbEU7O1FBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUU3Qix3RUFBd0U7UUFDeEUsc0VBQXNFO1FBQ3RFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFnSC9GLENBQUM7SUE5R1UsU0FBUyxDQUFDLFdBQW9CO1FBQ3JDLG9DQUFvQztRQUNwQyxJQUNFLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztZQUNwQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQ3BEO1lB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QixDQUFDLENBQUM7SUFDbEUsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb24sIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0gZnJvbSAnLi4vLi4vLi4vbmctdXBkYXRlL3R5cGVzY3JpcHQvbW9kdWxlLXNwZWNpZmllcnMnO1xuXG5jb25zdCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIgPVxuICBgSW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIGAgK1xuICBgSW5zdGVhZCBpbXBvcnQgZnJvbSB0aGUgZW50cnktcG9pbnQgdGhlIHN5bWJvbCBiZWxvbmdzIHRvLmA7XG5cbmNvbnN0IE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSID1cbiAgYEltcG9ydHMgZnJvbSBBbmd1bGFyIE1hdGVyaWFsIHNob3VsZCBpbXBvcnQgYCArXG4gIGBzcGVjaWZpYyBzeW1ib2xzIHJhdGhlciB0aGFuIGltcG9ydGluZyB0aGUgZW50aXJlIGxpYnJhcnkuYDtcblxuLyoqXG4gKiBSZWdleCBmb3IgdGVzdGluZyBmaWxlIHBhdGhzIGFnYWluc3QgdG8gZGV0ZXJtaW5lIGlmIHRoZSBmaWxlIGlzIGZyb20gdGhlXG4gKiBBbmd1bGFyIE1hdGVyaWFsIGxpYnJhcnkuXG4gKi9cbmNvbnN0IEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVggPSBuZXcgUmVnRXhwKGAke21hdGVyaWFsTW9kdWxlU3BlY2lmaWVyfS8oLio/KS9gKTtcblxuLyoqXG4gKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHN5bWJvbCBuYW1lcyB0byB0aGVpciBtb2R1bGUgbmFtZXMuIFVzZWQgYXMgYSBmYWxsYmFjayBpZlxuICogd2UgZGlkbid0IG1hbmFnZSB0byByZXNvbHZlIHRoZSBtb2R1bGUgbmFtZSBvZiBhIHN5bWJvbCB1c2luZyB0aGUgdHlwZSBjaGVja2VyLlxuICovXG5jb25zdCBFTlRSWV9QT0lOVF9NQVBQSU5HUzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9ID0gcmVxdWlyZSgnLi9tYXRlcmlhbC1zeW1ib2xzLmpzb24nKTtcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB1cGRhdGVzIGltcG9ydHMgd2hpY2ggcmVmZXIgdG8gdGhlIHByaW1hcnkgQW5ndWxhciBNYXRlcmlhbFxuICogZW50cnktcG9pbnQgdG8gdXNlIHRoZSBhcHByb3ByaWF0ZSBzZWNvbmRhcnkgZW50cnkgcG9pbnRzIChlLmcuIEBhbmd1bGFyL21hdGVyaWFsL2J1dHRvbikuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWNvbmRhcnlFbnRyeVBvaW50c01pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG4gIHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKCk7XG5cbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDguIFRoZSBwcmltYXJ5XG4gIC8vIGVudHJ5LXBvaW50IG9mIE1hdGVyaWFsIGhhcyBiZWVuIG1hcmtlZCBhcyBkZXByZWNhdGVkIGluIHZlcnNpb24gOC5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOCB8fCB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjk7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKGRlY2xhcmF0aW9uOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgLy8gT25seSBsb29rIGF0IGltcG9ydCBkZWNsYXJhdGlvbnMuXG4gICAgaWYgKFxuICAgICAgIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24oZGVjbGFyYXRpb24pIHx8XG4gICAgICAhdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0TG9jYXRpb24gPSBkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIudGV4dDtcbiAgICAvLyBJZiB0aGUgaW1wb3J0IG1vZHVsZSBpcyBub3QgQGFuZ3VsYXIvbWF0ZXJpYWwsIHNraXAgdGhlIGNoZWNrLlxuICAgIGlmIChpbXBvcnRMb2NhdGlvbiAhPT0gbWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBpbXBvcnQgY2xhdXNlIGlzIGZvdW5kLCBvciBub3RoaW5nIGlzIG5hbWVkIGFzIGEgYmluZGluZyBpbiB0aGVcbiAgICAvLyBpbXBvcnQsIGFkZCBmYWlsdXJlIHNheWluZyB0byBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UgfHwgIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBbGwgbmFtZWQgYmluZGluZ3MgaW4gaW1wb3J0IGNsYXVzZXMgbXVzdCBiZSBuYW1lZCBzeW1ib2xzLCBvdGhlcndpc2UgYWRkXG4gICAgLy8gZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghdHMuaXNOYW1lZEltcG9ydHMoZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBzeW1ib2xzIGFyZSBpbiB0aGUgbmFtZWQgYmluZGluZ3MgdGhlbiBhZGQgZmFpbHVyZSBzYXlpbmcgdG9cbiAgICAvLyBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdoZXRoZXIgdGhlIGV4aXN0aW5nIGltcG9ydCBkZWNsYXJhdGlvbiBpcyB1c2luZyBhIHNpbmdsZSBxdW90ZSBtb2R1bGUgc3BlY2lmaWVyLlxuICAgIGNvbnN0IHNpbmdsZVF1b3RlSW1wb3J0ID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLmdldFRleHQoKVswXSA9PT0gYCdgO1xuXG4gICAgLy8gTWFwIHdoaWNoIGNvbnNpc3RzIG9mIHNlY29uZGFyeSBlbnRyeS1wb2ludHMgYW5kIGltcG9ydCBzcGVjaWZpZXJzIHdoaWNoIGFyZSB1c2VkXG4gICAgLy8gd2l0aGluIHRoZSBjdXJyZW50IGltcG9ydCBkZWNsYXJhdGlvbi5cbiAgICBjb25zdCBpbXBvcnRNYXAgPSBuZXcgTWFwPHN0cmluZywgdHMuSW1wb3J0U3BlY2lmaWVyW10+KCk7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN1YnBhY2thZ2UgZWFjaCBzeW1ib2wgaW4gdGhlIG5hbWVkQmluZGluZyBjb21lcyBmcm9tLlxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cykge1xuICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LnByb3BlcnR5TmFtZSA/IGVsZW1lbnQucHJvcGVydHlOYW1lIDogZWxlbWVudC5uYW1lO1xuXG4gICAgICAvLyBUcnkgdG8gcmVzb2x2ZSB0aGUgbW9kdWxlIG5hbWUgdmlhIHRoZSB0eXBlIGNoZWNrZXIsIGFuZCBpZiBpdCBmYWlscywgZmFsbCBiYWNrIHRvXG4gICAgICAvLyByZXNvbHZpbmcgaXQgZnJvbSBvdXIgbGlzdCBvZiBzeW1ib2wgdG8gZW50cnkgcG9pbnQgbWFwcGluZ3MuIFVzaW5nIHRoZSB0eXBlIGNoZWNrZXIgaXNcbiAgICAgIC8vIG1vcmUgYWNjdXJhdGUgYW5kIGRvZXNuJ3QgcmVxdWlyZSB1cyB0byBrZWVwIGEgbGlzdCBvZiBzeW1ib2xzLCBidXQgaXQgd29uJ3Qgd29yayBpZlxuICAgICAgLy8gdGhlIHN5bWJvbHMgZG9uJ3QgZXhpc3QgYW55bW9yZSAoZS5nLiBhZnRlciB3ZSByZW1vdmUgdGhlIHRvcC1sZXZlbCBAYW5ndWxhci9tYXRlcmlhbCkuXG4gICAgICBjb25zdCBtb2R1bGVOYW1lID1cbiAgICAgICAgcmVzb2x2ZU1vZHVsZU5hbWUoZWxlbWVudE5hbWUsIHRoaXMudHlwZUNoZWNrZXIpIHx8XG4gICAgICAgIEVOVFJZX1BPSU5UX01BUFBJTkdTW2VsZW1lbnROYW1lLnRleHRdIHx8XG4gICAgICAgIG51bGw7XG5cbiAgICAgIGlmICghbW9kdWxlTmFtZSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICBgXCIke2VsZW1lbnQuZ2V0VGV4dCgpfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIE1hdGVyaWFsIGxpYnJhcnkuYCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgbW9kdWxlIG5hbWUgd2hlcmUgdGhlIHN5bWJvbCBpcyBkZWZpbmVkIGUuZy4gY2FyZCwgZGlhbG9nLiBUaGVcbiAgICAgIC8vIGZpcnN0IGNhcHR1cmUgZ3JvdXAgaXMgY29udGFpbnMgdGhlIG1vZHVsZSBuYW1lLlxuICAgICAgaWYgKGltcG9ydE1hcC5oYXMobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgaW1wb3J0TWFwLmdldChtb2R1bGVOYW1lKSEucHVzaChlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltcG9ydE1hcC5zZXQobW9kdWxlTmFtZSwgW2VsZW1lbnRdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gaW50byBtdWx0aXBsZSBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgaW1wb3J0XG4gICAgLy8gdGhlIGdpdmVuIHN5bWJvbHMgZnJvbSB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzLiBGb3IgZXhhbXBsZTpcbiAgICAvLyBpbXBvcnQge01hdENhcmRNb2R1bGUsIE1hdENhcmRUaXRsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCc7XG4gICAgLy8gaW1wb3J0IHtNYXRSYWRpb01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcmFkaW8nO1xuICAgIGNvbnN0IG5ld0ltcG9ydFN0YXRlbWVudHMgPSBBcnJheS5mcm9tKGltcG9ydE1hcC5lbnRyaWVzKCkpXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKChbbmFtZSwgZWxlbWVudHNdKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0ltcG9ydCA9IHRzLmZhY3RvcnkuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydENsYXVzZShmYWxzZSwgdW5kZWZpbmVkLCB0cy5mYWN0b3J5LmNyZWF0ZU5hbWVkSW1wb3J0cyhlbGVtZW50cykpLFxuICAgICAgICAgIHRzLmZhY3RvcnkuY3JlYXRlU3RyaW5nTGl0ZXJhbChgJHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0vJHtuYW1lfWAsIHNpbmdsZVF1b3RlSW1wb3J0KSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbnRlci5wcmludE5vZGUoXG4gICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsXG4gICAgICAgICAgbmV3SW1wb3J0LFxuICAgICAgICAgIGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSxcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAuam9pbignXFxuJyk7XG5cbiAgICAvLyBXaXRob3V0IGFueSBpbXBvcnQgc3RhdGVtZW50cyB0aGF0IHdlcmUgZ2VuZXJhdGVkLCB3ZSBjYW4gYXNzdW1lIHRoYXQgdGhpcyB3YXMgYW4gZW1wdHlcbiAgICAvLyBpbXBvcnQgZGVjbGFyYXRpb24uIFdlIHN0aWxsIHdhbnQgdG8gYWRkIGEgZmFpbHVyZSBpbiBvcmRlciB0byBtYWtlIGRldmVsb3BlcnMgYXdhcmUgdGhhdFxuICAgIC8vIGltcG9ydGluZyBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIiBpcyBkZXByZWNhdGVkLlxuICAgIGlmICghbmV3SW1wb3J0U3RhdGVtZW50cykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllciwgT05MWV9TVUJQQUNLQUdFX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQoZmlsZVBhdGgpO1xuXG4gICAgLy8gUGVyZm9ybSB0aGUgcmVwbGFjZW1lbnQgdGhhdCBzd2l0Y2hlcyB0aGUgcHJpbWFyeSBlbnRyeS1wb2ludCBpbXBvcnQgdG9cbiAgICAvLyB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnQgaW1wb3J0cy5cbiAgICByZWNvcmRlci5yZW1vdmUoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgZGVjbGFyYXRpb24uZ2V0V2lkdGgoKSk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgbmV3SW1wb3J0U3RhdGVtZW50cyk7XG4gIH1cbn1cblxuLyoqIEdldHMgdGhlIHN5bWJvbCB0aGF0IGNvbnRhaW5zIHRoZSB2YWx1ZSBkZWNsYXJhdGlvbiBvZiB0aGUgZ2l2ZW4gbm9kZS4gKi9cbmZ1bmN0aW9uIGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGU6IHRzLk5vZGUsIGNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKTogdHMuU3ltYm9sIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgIHJldHVybiBjaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuICByZXR1cm4gc3ltYm9sO1xufVxuXG4vKiogVHJpZXMgdG8gcmVzb2x2ZSB0aGUgbmFtZSBvZiB0aGUgTWF0ZXJpYWwgbW9kdWxlIHRoYXQgYSBub2RlIGlzIGltcG9ydGVkIGZyb20uICovXG5mdW5jdGlvbiByZXNvbHZlTW9kdWxlTmFtZShub2RlOiB0cy5JZGVudGlmaWVyLCB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gR2V0IHRoZSBzeW1ib2wgZm9yIHRoZSBuYW1lZCBiaW5kaW5nIGVsZW1lbnQuIE5vdGUgdGhhdCB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZVxuICAvLyB2YWx1ZSBkZWNsYXJhdGlvbiBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgZWxlbWVudCBhcyB0eXBlcyBhcmUgbm90IG5lY2Vzc2FyaWx5XG4gIC8vIHNwZWNpZmljIHRvIGEgZ2l2ZW4gc2Vjb25kYXJ5IGVudHJ5LXBvaW50IChlLmcuIGV4cG9ydHMgd2l0aCB0aGUgdHlwZSBvZiBcInN0cmluZ1wiKVxuICAvLyB3b3VsZCByZXNvbHZlIHRvIHRoZSBtb2R1bGUgdHlwZXMgcHJvdmlkZWQgYnkgVHlwZVNjcmlwdCBpdHNlbGYuXG4gIGNvbnN0IHN5bWJvbCA9IGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGUsIHR5cGVDaGVja2VyKTtcblxuICAvLyBJZiB0aGUgc3ltYm9sIGNhbid0IGJlIGZvdW5kLCBvciBubyBkZWNsYXJhdGlvbiBjb3VsZCBiZSBmb3VuZCB3aXRoaW5cbiAgLy8gdGhlIHN5bWJvbCwgYWRkIGZhaWx1cmUgdG8gcmVwb3J0IHRoYXQgdGhlIGdpdmVuIHN5bWJvbCBjYW4ndCBiZSBmb3VuZC5cbiAgaWYgKFxuICAgICFzeW1ib2wgfHxcbiAgICAhKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IChzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAwKSlcbiAgKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBUaGUgZmlsZW5hbWUgZm9yIHRoZSBzb3VyY2UgZmlsZSBvZiB0aGUgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZVxuICAvLyBmaXJzdCBkZWNsYXJhdGlvbiBvZiB0aGUgc3ltYm9sLiBBbGwgc3ltYm9sIGRlY2xhcmF0aW9ucyBtdXN0IGJlXG4gIC8vIHBhcnQgb2YgYSBkZWZpbmluZyBub2RlLCBzbyBwYXJlbnQgY2FuIGJlIGFzc2VydGVkIHRvIGJlIGRlZmluZWQuXG4gIGNvbnN0IHJlc29sdmVkTm9kZSA9IHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IHN5bWJvbC5kZWNsYXJhdGlvbnM/LlswXTtcblxuICBpZiAocmVzb2x2ZWROb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZUZpbGUgPSByZXNvbHZlZE5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuXG4gIC8vIEZpbGUgdGhlIG1vZHVsZSB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8gZnJvbSBhIHJlZ2V4IG1hdGNoIG9mIHRoZVxuICAvLyBmaWxlbmFtZS4gVGhpcyB3aWxsIGFsd2F5cyBtYXRjaCBzaW5jZSBvbmx5IFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIlxuICAvLyBlbGVtZW50cyBhcmUgYW5hbHl6ZWQuXG4gIGNvbnN0IG1hdGNoZXMgPSBzb3VyY2VGaWxlLm1hdGNoKEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVgpO1xuICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXNbMV0gOiBudWxsO1xufVxuIl19