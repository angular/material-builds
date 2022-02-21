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
    var _a;
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
    const resolvedNode = symbol.valueDeclaration || ((_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUNqQyx1RkFBd0Y7QUFFeEYsTUFBTSwyQkFBMkIsR0FDL0Isb0RBQW9EO0lBQ3BELDREQUE0RCxDQUFDO0FBRS9ELE1BQU0sbUNBQW1DLEdBQ3ZDLDhDQUE4QztJQUM5Qyw0REFBNEQsQ0FBQztBQUUvRDs7O0dBR0c7QUFDSCxNQUFNLCtCQUErQixHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsMkNBQXVCLFNBQVMsQ0FBQyxDQUFDO0FBRXhGOzs7R0FHRztBQUNILE1BQU0sb0JBQW9CLEdBQTZCLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRTFGOzs7R0FHRztBQUNILE1BQWEsNkJBQThCLFNBQVEsc0JBQWU7SUFBbEU7O1FBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUU3Qix3RUFBd0U7UUFDeEUsc0VBQXNFO1FBQ3RFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFnSC9GLENBQUM7SUE5R1UsU0FBUyxDQUFDLFdBQW9CO1FBQ3JDLG9DQUFvQztRQUNwQyxJQUNFLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztZQUNwQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQ3BEO1lB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QywrQkFBK0IsQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWlncmF0aW9uLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9IGZyb20gJy4uLy4uLy4uL25nLXVwZGF0ZS90eXBlc2NyaXB0L21vZHVsZS1zcGVjaWZpZXJzJztcblxuY29uc3QgT05MWV9TVUJQQUNLQUdFX0ZBSUxVUkVfU1RSID1cbiAgYEltcG9ydGluZyBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIiBpcyBkZXByZWNhdGVkLiBgICtcbiAgYEluc3RlYWQgaW1wb3J0IGZyb20gdGhlIGVudHJ5LXBvaW50IHRoZSBzeW1ib2wgYmVsb25ncyB0by5gO1xuXG5jb25zdCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUiA9XG4gIGBJbXBvcnRzIGZyb20gQW5ndWxhciBNYXRlcmlhbCBzaG91bGQgaW1wb3J0IGAgK1xuICBgc3BlY2lmaWMgc3ltYm9scyByYXRoZXIgdGhhbiBpbXBvcnRpbmcgdGhlIGVudGlyZSBsaWJyYXJ5LmA7XG5cbi8qKlxuICogUmVnZXggZm9yIHRlc3RpbmcgZmlsZSBwYXRocyBhZ2FpbnN0IHRvIGRldGVybWluZSBpZiB0aGUgZmlsZSBpcyBmcm9tIHRoZVxuICogQW5ndWxhciBNYXRlcmlhbCBsaWJyYXJ5LlxuICovXG5jb25zdCBBTkdVTEFSX01BVEVSSUFMX0ZJTEVQQVRIX1JFR0VYID0gbmV3IFJlZ0V4cChgJHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0vKC4qPykvYCk7XG5cbi8qKlxuICogTWFwcGluZyBvZiBNYXRlcmlhbCBzeW1ib2wgbmFtZXMgdG8gdGhlaXIgbW9kdWxlIG5hbWVzLiBVc2VkIGFzIGEgZmFsbGJhY2sgaWZcbiAqIHdlIGRpZG4ndCBtYW5hZ2UgdG8gcmVzb2x2ZSB0aGUgbW9kdWxlIG5hbWUgb2YgYSBzeW1ib2wgdXNpbmcgdGhlIHR5cGUgY2hlY2tlci5cbiAqL1xuY29uc3QgRU5UUllfUE9JTlRfTUFQUElOR1M6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHJlcXVpcmUoJy4vbWF0ZXJpYWwtc3ltYm9scy5qc29uJyk7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgdXBkYXRlcyBpbXBvcnRzIHdoaWNoIHJlZmVyIHRvIHRoZSBwcmltYXJ5IEFuZ3VsYXIgTWF0ZXJpYWxcbiAqIGVudHJ5LXBvaW50IHRvIHVzZSB0aGUgYXBwcm9wcmlhdGUgc2Vjb25kYXJ5IGVudHJ5IHBvaW50cyAoZS5nLiBAYW5ndWxhci9tYXRlcmlhbC9idXR0b24pLlxuICovXG5leHBvcnQgY2xhc3MgU2Vjb25kYXJ5RW50cnlQb2ludHNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuICBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA4LiBUaGUgcHJpbWFyeVxuICAvLyBlbnRyeS1wb2ludCBvZiBNYXRlcmlhbCBoYXMgYmVlbiBtYXJrZWQgYXMgZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDguXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjggfHwgdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY5O1xuXG4gIG92ZXJyaWRlIHZpc2l0Tm9kZShkZWNsYXJhdGlvbjogdHMuTm9kZSk6IHZvaWQge1xuICAgIC8vIE9ubHkgbG9vayBhdCBpbXBvcnQgZGVjbGFyYXRpb25zLlxuICAgIGlmIChcbiAgICAgICF0cy5pc0ltcG9ydERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSB8fFxuICAgICAgIXRzLmlzU3RyaW5nTGl0ZXJhbExpa2UoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydExvY2F0aW9uID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG4gICAgLy8gSWYgdGhlIGltcG9ydCBtb2R1bGUgaXMgbm90IEBhbmd1bGFyL21hdGVyaWFsLCBza2lwIHRoZSBjaGVjay5cbiAgICBpZiAoaW1wb3J0TG9jYXRpb24gIT09IG1hdGVyaWFsTW9kdWxlU3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gaW1wb3J0IGNsYXVzZSBpcyBmb3VuZCwgb3Igbm90aGluZyBpcyBuYW1lZCBhcyBhIGJpbmRpbmcgaW4gdGhlXG4gICAgLy8gaW1wb3J0LCBhZGQgZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlIHx8ICFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWxsIG5hbWVkIGJpbmRpbmdzIGluIGltcG9ydCBjbGF1c2VzIG11c3QgYmUgbmFtZWQgc3ltYm9scywgb3RoZXJ3aXNlIGFkZFxuICAgIC8vIGZhaWx1cmUgc2F5aW5nIHRvIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIXRzLmlzTmFtZWRJbXBvcnRzKGRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSkge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gc3ltYm9scyBhcmUgaW4gdGhlIG5hbWVkIGJpbmRpbmdzIHRoZW4gYWRkIGZhaWx1cmUgc2F5aW5nIHRvXG4gICAgLy8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXaGV0aGVyIHRoZSBleGlzdGluZyBpbXBvcnQgZGVjbGFyYXRpb24gaXMgdXNpbmcgYSBzaW5nbGUgcXVvdGUgbW9kdWxlIHNwZWNpZmllci5cbiAgICBjb25zdCBzaW5nbGVRdW90ZUltcG9ydCA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRUZXh0KClbMF0gPT09IGAnYDtcblxuICAgIC8vIE1hcCB3aGljaCBjb25zaXN0cyBvZiBzZWNvbmRhcnkgZW50cnktcG9pbnRzIGFuZCBpbXBvcnQgc3BlY2lmaWVycyB3aGljaCBhcmUgdXNlZFxuICAgIC8vIHdpdGhpbiB0aGUgY3VycmVudCBpbXBvcnQgZGVjbGFyYXRpb24uXG4gICAgY29uc3QgaW1wb3J0TWFwID0gbmV3IE1hcDxzdHJpbmcsIHRzLkltcG9ydFNwZWNpZmllcltdPigpO1xuXG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBzdWJwYWNrYWdlIGVhY2ggc3ltYm9sIGluIHRoZSBuYW1lZEJpbmRpbmcgY29tZXMgZnJvbS5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5wcm9wZXJ0eU5hbWUgPyBlbGVtZW50LnByb3BlcnR5TmFtZSA6IGVsZW1lbnQubmFtZTtcblxuICAgICAgLy8gVHJ5IHRvIHJlc29sdmUgdGhlIG1vZHVsZSBuYW1lIHZpYSB0aGUgdHlwZSBjaGVja2VyLCBhbmQgaWYgaXQgZmFpbHMsIGZhbGwgYmFjayB0b1xuICAgICAgLy8gcmVzb2x2aW5nIGl0IGZyb20gb3VyIGxpc3Qgb2Ygc3ltYm9sIHRvIGVudHJ5IHBvaW50IG1hcHBpbmdzLiBVc2luZyB0aGUgdHlwZSBjaGVja2VyIGlzXG4gICAgICAvLyBtb3JlIGFjY3VyYXRlIGFuZCBkb2Vzbid0IHJlcXVpcmUgdXMgdG8ga2VlcCBhIGxpc3Qgb2Ygc3ltYm9scywgYnV0IGl0IHdvbid0IHdvcmsgaWZcbiAgICAgIC8vIHRoZSBzeW1ib2xzIGRvbid0IGV4aXN0IGFueW1vcmUgKGUuZy4gYWZ0ZXIgd2UgcmVtb3ZlIHRoZSB0b3AtbGV2ZWwgQGFuZ3VsYXIvbWF0ZXJpYWwpLlxuICAgICAgY29uc3QgbW9kdWxlTmFtZSA9XG4gICAgICAgIHJlc29sdmVNb2R1bGVOYW1lKGVsZW1lbnROYW1lLCB0aGlzLnR5cGVDaGVja2VyKSB8fFxuICAgICAgICBFTlRSWV9QT0lOVF9NQVBQSU5HU1tlbGVtZW50TmFtZS50ZXh0XSB8fFxuICAgICAgICBudWxsO1xuXG4gICAgICBpZiAoIW1vZHVsZU5hbWUpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgYFwiJHtlbGVtZW50LmdldFRleHQoKX1cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBNYXRlcmlhbCBsaWJyYXJ5LmAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIG1vZHVsZSBuYW1lIHdoZXJlIHRoZSBzeW1ib2wgaXMgZGVmaW5lZCBlLmcuIGNhcmQsIGRpYWxvZy4gVGhlXG4gICAgICAvLyBmaXJzdCBjYXB0dXJlIGdyb3VwIGlzIGNvbnRhaW5zIHRoZSBtb2R1bGUgbmFtZS5cbiAgICAgIGlmIChpbXBvcnRNYXAuaGFzKG1vZHVsZU5hbWUpKSB7XG4gICAgICAgIGltcG9ydE1hcC5nZXQobW9kdWxlTmFtZSkhLnB1c2goZWxlbWVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbXBvcnRNYXAuc2V0KG1vZHVsZU5hbWUsIFtlbGVtZW50XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3JtcyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGludG8gbXVsdGlwbGUgaW1wb3J0IGRlY2xhcmF0aW9ucyB0aGF0IGltcG9ydFxuICAgIC8vIHRoZSBnaXZlbiBzeW1ib2xzIGZyb20gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50cy4gRm9yIGV4YW1wbGU6XG4gICAgLy8gaW1wb3J0IHtNYXRDYXJkTW9kdWxlLCBNYXRDYXJkVGl0bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NhcmQnO1xuICAgIC8vIGltcG9ydCB7TWF0UmFkaW9Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3JhZGlvJztcbiAgICBjb25zdCBuZXdJbXBvcnRTdGF0ZW1lbnRzID0gQXJyYXkuZnJvbShpbXBvcnRNYXAuZW50cmllcygpKVxuICAgICAgLnNvcnQoKVxuICAgICAgLm1hcCgoW25hbWUsIGVsZW1lbnRzXSkgPT4ge1xuICAgICAgICBjb25zdCBuZXdJbXBvcnQgPSB0cy5mYWN0b3J5LmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgdHMuZmFjdG9yeS5jcmVhdGVJbXBvcnRDbGF1c2UoZmFsc2UsIHVuZGVmaW5lZCwgdHMuZmFjdG9yeS5jcmVhdGVOYW1lZEltcG9ydHMoZWxlbWVudHMpKSxcbiAgICAgICAgICB0cy5mYWN0b3J5LmNyZWF0ZVN0cmluZ0xpdGVyYWwoYCR7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9LyR7bmFtZX1gLCBzaW5nbGVRdW90ZUltcG9ydCksXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLnByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLFxuICAgICAgICAgIG5ld0ltcG9ydCxcbiAgICAgICAgICBkZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCksXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgLy8gV2l0aG91dCBhbnkgaW1wb3J0IHN0YXRlbWVudHMgdGhhdCB3ZXJlIGdlbmVyYXRlZCwgd2UgY2FuIGFzc3VtZSB0aGF0IHRoaXMgd2FzIGFuIGVtcHR5XG4gICAgLy8gaW1wb3J0IGRlY2xhcmF0aW9uLiBXZSBzdGlsbCB3YW50IHRvIGFkZCBhIGZhaWx1cmUgaW4gb3JkZXIgdG8gbWFrZSBkZXZlbG9wZXJzIGF3YXJlIHRoYXRcbiAgICAvLyBpbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC5cbiAgICBpZiAoIW5ld0ltcG9ydFN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIsIE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcblxuICAgIC8vIFBlcmZvcm0gdGhlIHJlcGxhY2VtZW50IHRoYXQgc3dpdGNoZXMgdGhlIHByaW1hcnkgZW50cnktcG9pbnQgaW1wb3J0IHRvXG4gICAgLy8gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50IGltcG9ydHMuXG4gICAgcmVjb3JkZXIucmVtb3ZlKGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIGRlY2xhcmF0aW9uLmdldFdpZHRoKCkpO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIG5ld0ltcG9ydFN0YXRlbWVudHMpO1xuICB9XG59XG5cbi8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuICovXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IHRzLlN5bWJvbCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHN5bWJvbCA9IGNoZWNrZXIuZ2V0U3ltYm9sQXRMb2NhdGlvbihub2RlKTtcblxuICAvLyBTeW1ib2xzIGNhbiBiZSBhbGlhc2VzIG9mIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuIGUuZy4gaW4gbmFtZWQgaW1wb3J0IHNwZWNpZmllcnMuXG4gIC8vIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgYWxpYXNlZCBzeW1ib2wgYmFjayB0byB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxuICBpZiAoc3ltYm9sICYmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykgIT09IDApIHtcbiAgICByZXR1cm4gY2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKHN5bWJvbCk7XG4gIH1cbiAgcmV0dXJuIHN5bWJvbDtcbn1cblxuLyoqIFRyaWVzIHRvIHJlc29sdmUgdGhlIG5hbWUgb2YgdGhlIE1hdGVyaWFsIG1vZHVsZSB0aGF0IGEgbm9kZSBpcyBpbXBvcnRlZCBmcm9tLiAqL1xuZnVuY3Rpb24gcmVzb2x2ZU1vZHVsZU5hbWUobm9kZTogdHMuSWRlbnRpZmllciwgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyKTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEdldCB0aGUgc3ltYm9sIGZvciB0aGUgbmFtZWQgYmluZGluZyBlbGVtZW50LiBOb3RlIHRoYXQgd2UgY2Fubm90IGRldGVybWluZSB0aGVcbiAgLy8gdmFsdWUgZGVjbGFyYXRpb24gYmFzZWQgb24gdGhlIHR5cGUgb2YgdGhlIGVsZW1lbnQgYXMgdHlwZXMgYXJlIG5vdCBuZWNlc3NhcmlseVxuICAvLyBzcGVjaWZpYyB0byBhIGdpdmVuIHNlY29uZGFyeSBlbnRyeS1wb2ludCAoZS5nLiBleHBvcnRzIHdpdGggdGhlIHR5cGUgb2YgXCJzdHJpbmdcIilcbiAgLy8gd291bGQgcmVzb2x2ZSB0byB0aGUgbW9kdWxlIHR5cGVzIHByb3ZpZGVkIGJ5IFR5cGVTY3JpcHQgaXRzZWxmLlxuICBjb25zdCBzeW1ib2wgPSBnZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlLCB0eXBlQ2hlY2tlcik7XG5cbiAgLy8gSWYgdGhlIHN5bWJvbCBjYW4ndCBiZSBmb3VuZCwgb3Igbm8gZGVjbGFyYXRpb24gY291bGQgYmUgZm91bmQgd2l0aGluXG4gIC8vIHRoZSBzeW1ib2wsIGFkZCBmYWlsdXJlIHRvIHJlcG9ydCB0aGF0IHRoZSBnaXZlbiBzeW1ib2wgY2FuJ3QgYmUgZm91bmQuXG4gIGlmIChcbiAgICAhc3ltYm9sIHx8XG4gICAgIShzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCAoc3ltYm9sLmRlY2xhcmF0aW9ucyAmJiBzeW1ib2wuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMCkpXG4gICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gVGhlIGZpbGVuYW1lIGZvciB0aGUgc291cmNlIGZpbGUgb2YgdGhlIG5vZGUgdGhhdCBjb250YWlucyB0aGVcbiAgLy8gZmlyc3QgZGVjbGFyYXRpb24gb2YgdGhlIHN5bWJvbC4gQWxsIHN5bWJvbCBkZWNsYXJhdGlvbnMgbXVzdCBiZVxuICAvLyBwYXJ0IG9mIGEgZGVmaW5pbmcgbm9kZSwgc28gcGFyZW50IGNhbiBiZSBhc3NlcnRlZCB0byBiZSBkZWZpbmVkLlxuICBjb25zdCByZXNvbHZlZE5vZGUgPSBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCBzeW1ib2wuZGVjbGFyYXRpb25zPy5bMF07XG5cbiAgaWYgKHJlc29sdmVkTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBzb3VyY2VGaWxlID0gcmVzb2x2ZWROb2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcblxuICAvLyBGaWxlIHRoZSBtb2R1bGUgdGhlIHN5bWJvbCBiZWxvbmdzIHRvIGZyb20gYSByZWdleCBtYXRjaCBvZiB0aGVcbiAgLy8gZmlsZW5hbWUuIFRoaXMgd2lsbCBhbHdheXMgbWF0Y2ggc2luY2Ugb25seSBcIkBhbmd1bGFyL21hdGVyaWFsXCJcbiAgLy8gZWxlbWVudHMgYXJlIGFuYWx5emVkLlxuICBjb25zdCBtYXRjaGVzID0gc291cmNlRmlsZS5tYXRjaChBTkdVTEFSX01BVEVSSUFMX0ZJTEVQQVRIX1JFR0VYKTtcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogbnVsbDtcbn1cbiJdfQ==