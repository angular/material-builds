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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9wYWNrYWdlLWltcG9ydHMtdjgvc2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUNqQyx1RkFBd0Y7QUFFeEYsTUFBTSwyQkFBMkIsR0FBRyxvREFBb0Q7SUFDcEYsNERBQTRELENBQUM7QUFFakUsTUFBTSxtQ0FBbUMsR0FBRyw4Q0FBOEM7SUFDdEYsNERBQTRELENBQUM7QUFFakU7OztHQUdHO0FBQ0gsTUFBTSwrQkFBK0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLDJDQUF1QixTQUFTLENBQUMsQ0FBQztBQUV4Rjs7O0dBR0c7QUFDSCxNQUFNLG9CQUFvQixHQUE2QixPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUUxRjs7O0dBR0c7QUFDSCxNQUFhLDZCQUE4QixTQUFRLHNCQUFlO0lBQWxFOztRQUNFLFlBQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFN0Isd0VBQXdFO1FBQ3hFLHNFQUFzRTtRQUN0RSxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO0lBdUcvRixDQUFDO0lBckdDLFNBQVMsQ0FBQyxXQUFvQjtRQUM1QixvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7WUFDcEMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3hE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YjtJQUVELE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFFekQsa0VBQWtFO0lBQ2xFLGtFQUFrRTtJQUNsRSx5QkFBeUI7SUFDekIsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWlncmF0aW9uLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9IGZyb20gJy4uLy4uLy4uL25nLXVwZGF0ZS90eXBlc2NyaXB0L21vZHVsZS1zcGVjaWZpZXJzJztcblxuY29uc3QgT05MWV9TVUJQQUNLQUdFX0ZBSUxVUkVfU1RSID0gYEltcG9ydGluZyBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIiBpcyBkZXByZWNhdGVkLiBgICtcbiAgICBgSW5zdGVhZCBpbXBvcnQgZnJvbSB0aGUgZW50cnktcG9pbnQgdGhlIHN5bWJvbCBiZWxvbmdzIHRvLmA7XG5cbmNvbnN0IE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSID0gYEltcG9ydHMgZnJvbSBBbmd1bGFyIE1hdGVyaWFsIHNob3VsZCBpbXBvcnQgYCArXG4gICAgYHNwZWNpZmljIHN5bWJvbHMgcmF0aGVyIHRoYW4gaW1wb3J0aW5nIHRoZSBlbnRpcmUgbGlicmFyeS5gO1xuXG4vKipcbiAqIFJlZ2V4IGZvciB0ZXN0aW5nIGZpbGUgcGF0aHMgYWdhaW5zdCB0byBkZXRlcm1pbmUgaWYgdGhlIGZpbGUgaXMgZnJvbSB0aGVcbiAqIEFuZ3VsYXIgTWF0ZXJpYWwgbGlicmFyeS5cbiAqL1xuY29uc3QgQU5HVUxBUl9NQVRFUklBTF9GSUxFUEFUSF9SRUdFWCA9IG5ldyBSZWdFeHAoYCR7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9LyguKj8pL2ApO1xuXG4vKipcbiAqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgc3ltYm9sIG5hbWVzIHRvIHRoZWlyIG1vZHVsZSBuYW1lcy4gVXNlZCBhcyBhIGZhbGxiYWNrIGlmXG4gKiB3ZSBkaWRuJ3QgbWFuYWdlIHRvIHJlc29sdmUgdGhlIG1vZHVsZSBuYW1lIG9mIGEgc3ltYm9sIHVzaW5nIHRoZSB0eXBlIGNoZWNrZXIuXG4gKi9cbmNvbnN0IEVOVFJZX1BPSU5UX01BUFBJTkdTOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gPSByZXF1aXJlKCcuL21hdGVyaWFsLXN5bWJvbHMuanNvbicpO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IHVwZGF0ZXMgaW1wb3J0cyB3aGljaCByZWZlciB0byB0aGUgcHJpbWFyeSBBbmd1bGFyIE1hdGVyaWFsXG4gKiBlbnRyeS1wb2ludCB0byB1c2UgdGhlIGFwcHJvcHJpYXRlIHNlY29uZGFyeSBlbnRyeSBwb2ludHMgKGUuZy4gQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlY29uZGFyeUVudHJ5UG9pbnRzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoKTtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gOC4gVGhlIHByaW1hcnlcbiAgLy8gZW50cnktcG9pbnQgb2YgTWF0ZXJpYWwgaGFzIGJlZW4gbWFya2VkIGFzIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiA4LlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY4IHx8IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WOTtcblxuICB2aXNpdE5vZGUoZGVjbGFyYXRpb246IHRzLk5vZGUpOiB2b2lkIHtcbiAgICAvLyBPbmx5IGxvb2sgYXQgaW1wb3J0IGRlY2xhcmF0aW9ucy5cbiAgICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24oZGVjbGFyYXRpb24pIHx8XG4gICAgICAgICF0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRMb2NhdGlvbiA9IGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci50ZXh0O1xuICAgIC8vIElmIHRoZSBpbXBvcnQgbW9kdWxlIGlzIG5vdCBAYW5ndWxhci9tYXRlcmlhbCwgc2tpcCB0aGUgY2hlY2suXG4gICAgaWYgKGltcG9ydExvY2F0aW9uICE9PSBtYXRlcmlhbE1vZHVsZVNwZWNpZmllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIG5vIGltcG9ydCBjbGF1c2UgaXMgZm91bmQsIG9yIG5vdGhpbmcgaXMgbmFtZWQgYXMgYSBiaW5kaW5nIGluIHRoZVxuICAgIC8vIGltcG9ydCwgYWRkIGZhaWx1cmUgc2F5aW5nIHRvIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZSB8fCAhZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFsbCBuYW1lZCBiaW5kaW5ncyBpbiBpbXBvcnQgY2xhdXNlcyBtdXN0IGJlIG5hbWVkIHN5bWJvbHMsIG90aGVyd2lzZSBhZGRcbiAgICAvLyBmYWlsdXJlIHNheWluZyB0byBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCF0cy5pc05hbWVkSW1wb3J0cyhkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIG5vIHN5bWJvbHMgYXJlIGluIHRoZSBuYW1lZCBiaW5kaW5ncyB0aGVuIGFkZCBmYWlsdXJlIHNheWluZyB0b1xuICAgIC8vIGltcG9ydCBzeW1ib2xzIGluIGNsYXVzZS5cbiAgICBpZiAoIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLCBOT19JTVBPUlRfTkFNRURfU1lNQk9MU19GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2hldGhlciB0aGUgZXhpc3RpbmcgaW1wb3J0IGRlY2xhcmF0aW9uIGlzIHVzaW5nIGEgc2luZ2xlIHF1b3RlIG1vZHVsZSBzcGVjaWZpZXIuXG4gICAgY29uc3Qgc2luZ2xlUXVvdGVJbXBvcnQgPSBkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0VGV4dCgpWzBdID09PSBgJ2A7XG5cbiAgICAvLyBNYXAgd2hpY2ggY29uc2lzdHMgb2Ygc2Vjb25kYXJ5IGVudHJ5LXBvaW50cyBhbmQgaW1wb3J0IHNwZWNpZmllcnMgd2hpY2ggYXJlIHVzZWRcbiAgICAvLyB3aXRoaW4gdGhlIGN1cnJlbnQgaW1wb3J0IGRlY2xhcmF0aW9uLlxuICAgIGNvbnN0IGltcG9ydE1hcCA9IG5ldyBNYXA8c3RyaW5nLCB0cy5JbXBvcnRTcGVjaWZpZXJbXT4oKTtcblxuICAgIC8vIERldGVybWluZSB0aGUgc3VicGFja2FnZSBlYWNoIHN5bWJvbCBpbiB0aGUgbmFtZWRCaW5kaW5nIGNvbWVzIGZyb20uXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQucHJvcGVydHlOYW1lID8gZWxlbWVudC5wcm9wZXJ0eU5hbWUgOiBlbGVtZW50Lm5hbWU7XG5cbiAgICAgIC8vIFRyeSB0byByZXNvbHZlIHRoZSBtb2R1bGUgbmFtZSB2aWEgdGhlIHR5cGUgY2hlY2tlciwgYW5kIGlmIGl0IGZhaWxzLCBmYWxsIGJhY2sgdG9cbiAgICAgIC8vIHJlc29sdmluZyBpdCBmcm9tIG91ciBsaXN0IG9mIHN5bWJvbCB0byBlbnRyeSBwb2ludCBtYXBwaW5ncy4gVXNpbmcgdGhlIHR5cGUgY2hlY2tlciBpc1xuICAgICAgLy8gbW9yZSBhY2N1cmF0ZSBhbmQgZG9lc24ndCByZXF1aXJlIHVzIHRvIGtlZXAgYSBsaXN0IG9mIHN5bWJvbHMsIGJ1dCBpdCB3b24ndCB3b3JrIGlmXG4gICAgICAvLyB0aGUgc3ltYm9scyBkb24ndCBleGlzdCBhbnltb3JlIChlLmcuIGFmdGVyIHdlIHJlbW92ZSB0aGUgdG9wLWxldmVsIEBhbmd1bGFyL21hdGVyaWFsKS5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSByZXNvbHZlTW9kdWxlTmFtZShlbGVtZW50TmFtZSwgdGhpcy50eXBlQ2hlY2tlcikgfHxcbiAgICAgICAgICBFTlRSWV9QT0lOVF9NQVBQSU5HU1tlbGVtZW50TmFtZS50ZXh0XSB8fCBudWxsO1xuXG4gICAgICBpZiAoIW1vZHVsZU5hbWUpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIGVsZW1lbnQsIGBcIiR7ZWxlbWVudC5nZXRUZXh0KCl9XCIgd2FzIG5vdCBmb3VuZCBpbiB0aGUgTWF0ZXJpYWwgbGlicmFyeS5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBtb2R1bGUgbmFtZSB3aGVyZSB0aGUgc3ltYm9sIGlzIGRlZmluZWQgZS5nLiBjYXJkLCBkaWFsb2cuIFRoZVxuICAgICAgICAvLyBmaXJzdCBjYXB0dXJlIGdyb3VwIGlzIGNvbnRhaW5zIHRoZSBtb2R1bGUgbmFtZS5cbiAgICAgICAgaWYgKGltcG9ydE1hcC5oYXMobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgICBpbXBvcnRNYXAuZ2V0KG1vZHVsZU5hbWUpIS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydE1hcC5zZXQobW9kdWxlTmFtZSwgW2VsZW1lbnRdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybXMgdGhlIGltcG9ydCBkZWNsYXJhdGlvbiBpbnRvIG11bHRpcGxlIGltcG9ydCBkZWNsYXJhdGlvbnMgdGhhdCBpbXBvcnRcbiAgICAvLyB0aGUgZ2l2ZW4gc3ltYm9scyBmcm9tIHRoZSBpbmRpdmlkdWFsIHNlY29uZGFyeSBlbnRyeS1wb2ludHMuIEZvciBleGFtcGxlOlxuICAgIC8vIGltcG9ydCB7TWF0Q2FyZE1vZHVsZSwgTWF0Q2FyZFRpdGxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jYXJkJztcbiAgICAvLyBpbXBvcnQge01hdFJhZGlvTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9yYWRpbyc7XG4gICAgY29uc3QgbmV3SW1wb3J0U3RhdGVtZW50cyA9XG4gICAgICAgIEFycmF5LmZyb20oaW1wb3J0TWFwLmVudHJpZXMoKSlcbiAgICAgICAgICAgIC5zb3J0KClcbiAgICAgICAgICAgIC5tYXAoKFtuYW1lLCBlbGVtZW50c10pID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3SW1wb3J0ID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgIHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhlbGVtZW50cykpLFxuICAgICAgICAgICAgICAgICAgY3JlYXRlU3RyaW5nTGl0ZXJhbChgJHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0vJHtuYW1lfWAsIHNpbmdsZVF1b3RlSW1wb3J0KSk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnByaW50ZXIucHJpbnROb2RlKFxuICAgICAgICAgICAgICAgICAgdHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIG5ld0ltcG9ydCwgZGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignXFxuJyk7XG5cbiAgICAvLyBXaXRob3V0IGFueSBpbXBvcnQgc3RhdGVtZW50cyB0aGF0IHdlcmUgZ2VuZXJhdGVkLCB3ZSBjYW4gYXNzdW1lIHRoYXQgdGhpcyB3YXMgYW4gZW1wdHlcbiAgICAvLyBpbXBvcnQgZGVjbGFyYXRpb24uIFdlIHN0aWxsIHdhbnQgdG8gYWRkIGEgZmFpbHVyZSBpbiBvcmRlciB0byBtYWtlIGRldmVsb3BlcnMgYXdhcmUgdGhhdFxuICAgIC8vIGltcG9ydGluZyBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIiBpcyBkZXByZWNhdGVkLlxuICAgIGlmICghbmV3SW1wb3J0U3RhdGVtZW50cykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllciwgT05MWV9TVUJQQUNLQUdFX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKFxuICAgICAgICBkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcblxuICAgIC8vIFBlcmZvcm0gdGhlIHJlcGxhY2VtZW50IHRoYXQgc3dpdGNoZXMgdGhlIHByaW1hcnkgZW50cnktcG9pbnQgaW1wb3J0IHRvXG4gICAgLy8gdGhlIGluZGl2aWR1YWwgc2Vjb25kYXJ5IGVudHJ5LXBvaW50IGltcG9ydHMuXG4gICAgcmVjb3JkZXIucmVtb3ZlKGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIGRlY2xhcmF0aW9uLmdldFdpZHRoKCkpO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGRlY2xhcmF0aW9uLmdldFN0YXJ0KCksIG5ld0ltcG9ydFN0YXRlbWVudHMpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0cmluZyBsaXRlcmFsIGZyb20gdGhlIHNwZWNpZmllZCB0ZXh0LlxuICogQHBhcmFtIHRleHQgVGV4dCBvZiB0aGUgc3RyaW5nIGxpdGVyYWwuXG4gKiBAcGFyYW0gc2luZ2xlUXVvdGVzIFdoZXRoZXIgc2luZ2xlIHF1b3RlcyBzaG91bGQgYmUgdXNlZCB3aGVuIHByaW50aW5nIHRoZSBsaXRlcmFsIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dDogc3RyaW5nLCBzaW5nbGVRdW90ZXM6IGJvb2xlYW4pOiB0cy5TdHJpbmdMaXRlcmFsIHtcbiAgY29uc3QgbGl0ZXJhbCA9IHRzLmNyZWF0ZVN0cmluZ0xpdGVyYWwodGV4dCk7XG4gIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2Jsb2IvbWFzdGVyL3NyYy9jb21waWxlci91dGlsaXRpZXMudHMjTDU4NC1MNTkwXG4gIGxpdGVyYWxbJ3NpbmdsZVF1b3RlJ10gPSBzaW5nbGVRdW90ZXM7XG4gIHJldHVybiBsaXRlcmFsO1xufVxuXG4vKiogR2V0cyB0aGUgc3ltYm9sIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlIGRlY2xhcmF0aW9uIG9mIHRoZSBnaXZlbiBub2RlLiAqL1xuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUobm9kZTogdHMuTm9kZSwgY2hlY2tlcjogdHMuVHlwZUNoZWNrZXIpOiB0cy5TeW1ib2x8dW5kZWZpbmVkIHtcbiAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpO1xuXG4gIC8vIFN5bWJvbHMgY2FuIGJlIGFsaWFzZXMgb2YgdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC4gZS5nLiBpbiBuYW1lZCBpbXBvcnQgc3BlY2lmaWVycy5cbiAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gIGlmIChzeW1ib2wgJiYgKHN5bWJvbC5mbGFncyAmIHRzLlN5bWJvbEZsYWdzLkFsaWFzKSAhPT0gMCkge1xuICAgIHJldHVybiBjaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgfVxuICByZXR1cm4gc3ltYm9sO1xufVxuXG5cbi8qKiBUcmllcyB0byByZXNvbHZlIHRoZSBuYW1lIG9mIHRoZSBNYXRlcmlhbCBtb2R1bGUgdGhhdCBhIG5vZGUgaXMgaW1wb3J0ZWQgZnJvbS4gKi9cbmZ1bmN0aW9uIHJlc29sdmVNb2R1bGVOYW1lKG5vZGU6IHRzLklkZW50aWZpZXIsIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IHN0cmluZ3xudWxsIHtcbiAgLy8gR2V0IHRoZSBzeW1ib2wgZm9yIHRoZSBuYW1lZCBiaW5kaW5nIGVsZW1lbnQuIE5vdGUgdGhhdCB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZVxuICAvLyB2YWx1ZSBkZWNsYXJhdGlvbiBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgZWxlbWVudCBhcyB0eXBlcyBhcmUgbm90IG5lY2Vzc2FyaWx5XG4gIC8vIHNwZWNpZmljIHRvIGEgZ2l2ZW4gc2Vjb25kYXJ5IGVudHJ5LXBvaW50IChlLmcuIGV4cG9ydHMgd2l0aCB0aGUgdHlwZSBvZiBcInN0cmluZ1wiKVxuICAvLyB3b3VsZCByZXNvbHZlIHRvIHRoZSBtb2R1bGUgdHlwZXMgcHJvdmlkZWQgYnkgVHlwZVNjcmlwdCBpdHNlbGYuXG4gIGNvbnN0IHN5bWJvbCA9IGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGUsIHR5cGVDaGVja2VyKTtcblxuICAvLyBJZiB0aGUgc3ltYm9sIGNhbid0IGJlIGZvdW5kLCBvciBubyBkZWNsYXJhdGlvbiBjb3VsZCBiZSBmb3VuZCB3aXRoaW5cbiAgLy8gdGhlIHN5bWJvbCwgYWRkIGZhaWx1cmUgdG8gcmVwb3J0IHRoYXQgdGhlIGdpdmVuIHN5bWJvbCBjYW4ndCBiZSBmb3VuZC5cbiAgaWYgKCFzeW1ib2wgfHxcbiAgICAgICEoc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gfHwgKHN5bWJvbC5kZWNsYXJhdGlvbnMgJiYgc3ltYm9sLmRlY2xhcmF0aW9ucy5sZW5ndGggIT09IDApKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gVGhlIGZpbGVuYW1lIGZvciB0aGUgc291cmNlIGZpbGUgb2YgdGhlIG5vZGUgdGhhdCBjb250YWlucyB0aGVcbiAgLy8gZmlyc3QgZGVjbGFyYXRpb24gb2YgdGhlIHN5bWJvbC4gQWxsIHN5bWJvbCBkZWNsYXJhdGlvbnMgbXVzdCBiZVxuICAvLyBwYXJ0IG9mIGEgZGVmaW5pbmcgbm9kZSwgc28gcGFyZW50IGNhbiBiZSBhc3NlcnRlZCB0byBiZSBkZWZpbmVkLlxuICBjb25zdCByZXNvbHZlZE5vZGUgPSBzeW1ib2wudmFsdWVEZWNsYXJhdGlvbiB8fCBzeW1ib2wuZGVjbGFyYXRpb25zPy5bMF07XG5cbiAgaWYgKHJlc29sdmVkTm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBzb3VyY2VGaWxlID0gcmVzb2x2ZWROb2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcblxuICAvLyBGaWxlIHRoZSBtb2R1bGUgdGhlIHN5bWJvbCBiZWxvbmdzIHRvIGZyb20gYSByZWdleCBtYXRjaCBvZiB0aGVcbiAgLy8gZmlsZW5hbWUuIFRoaXMgd2lsbCBhbHdheXMgbWF0Y2ggc2luY2Ugb25seSBcIkBhbmd1bGFyL21hdGVyaWFsXCJcbiAgLy8gZWxlbWVudHMgYXJlIGFuYWx5emVkLlxuICBjb25zdCBtYXRjaGVzID0gc291cmNlRmlsZS5tYXRjaChBTkdVTEFSX01BVEVSSUFMX0ZJTEVQQVRIX1JFR0VYKTtcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogbnVsbDtcbn1cbiJdfQ==