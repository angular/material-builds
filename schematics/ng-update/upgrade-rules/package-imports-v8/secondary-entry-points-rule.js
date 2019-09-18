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
     * A migration rule that updates imports which refer to the primary Angular Material
     * entry-point to use the appropriate secondary entry points (e.g. @angular/material/button).
     */
    class SecondaryEntryPointsRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            this.printer = ts.createPrinter();
            // Only enable this rule if the migration targets version 8. The primary
            // entry-point of Material has been marked as deprecated in version 8.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V8;
        }
        visitNode(declaration) {
            // Only look at import declarations.
            if (!ts.isImportDeclaration(declaration) ||
                !ts.isStringLiteralLike(declaration.moduleSpecifier)) {
                return;
            }
            const importLocation = declaration.moduleSpecifier.text;
            // If the import module is not @angular/material, skip check.
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
                // Get the symbol for the named binding element. Note that we cannot determine the
                // value declaration based on the type of the element as types are not necessarily
                // specific to a given secondary entry-point (e.g. exports with the type of "string")
                // would resolve to the module types provided by TypeScript itself.
                const symbol = getDeclarationSymbolOfNode(elementName, this.typeChecker);
                // If the symbol can't be found, or no declaration could be found within
                // the symbol, add failure to report that the given symbol can't be found.
                if (!symbol ||
                    !(symbol.valueDeclaration || (symbol.declarations && symbol.declarations.length !== 0))) {
                    this.createFailureAtNode(element, `"${element.getText()}" was not found in the Material library.`);
                    return;
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
                if (!matches) {
                    this.createFailureAtNode(element, `"${element.getText()}" was found to be imported ` +
                        `from a file outside the Material library.`);
                    return;
                }
                const [, moduleName] = matches;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vjb25kYXJ5LWVudHJ5LXBvaW50cy1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvcGFja2FnZS1pbXBvcnRzLXY4L3NlY29uZGFyeS1lbnRyeS1wb2ludHMtcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUFxRTtJQUNyRSxpQ0FBaUM7SUFDakMsMkdBQXdGO0lBRXhGLE1BQU0sMkJBQTJCLEdBQUcsb0RBQW9EO1FBQ3BGLDREQUE0RCxDQUFDO0lBRWpFLE1BQU0sbUNBQW1DLEdBQUcsOENBQThDO1FBQ3RGLDREQUE0RCxDQUFDO0lBRWpFOzs7T0FHRztJQUNILE1BQU0sK0JBQStCLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRywyQ0FBdUIsU0FBUyxDQUFDLENBQUM7SUFFeEY7OztPQUdHO0lBQ0gsTUFBYSx3QkFBeUIsU0FBUSwwQkFBbUI7UUFBakU7O1lBQ0UsWUFBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUU3Qix3RUFBd0U7WUFDeEUsc0VBQXNFO1lBQ3RFLGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQTBIeEQsQ0FBQztRQXhIQyxTQUFTLENBQUMsV0FBb0I7WUFDNUIsb0NBQW9DO1lBQ3BDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDO2dCQUNwQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3hELE9BQU87YUFDUjtZQUVELE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO1lBQ3hELDZEQUE2RDtZQUM3RCxJQUFJLGNBQWMsS0FBSywyQ0FBdUIsRUFBRTtnQkFDOUMsT0FBTzthQUNSO1lBRUQsd0VBQXdFO1lBQ3hFLDBEQUEwRDtZQUMxRCxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO2dCQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7Z0JBQzNFLE9BQU87YUFDUjtZQUVELDRFQUE0RTtZQUM1RSw4Q0FBOEM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDOUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO2dCQUMzRSxPQUFPO2FBQ1I7WUFFRCxxRUFBcUU7WUFDckUsNEJBQTRCO1lBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUMzRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7Z0JBQzNFLE9BQU87YUFDUjtZQUVELG9GQUFvRjtZQUNwRixNQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO1lBRTNFLG9GQUFvRjtZQUNwRix5Q0FBeUM7WUFDekMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWdDLENBQUM7WUFFMUQsdUVBQXVFO1lBQ3ZFLEtBQUssTUFBTSxPQUFPLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO2dCQUNyRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUUvRSxrRkFBa0Y7Z0JBQ2xGLGtGQUFrRjtnQkFDbEYscUZBQXFGO2dCQUNyRixtRUFBbUU7Z0JBQ25FLE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRXpFLHdFQUF3RTtnQkFDeEUsMEVBQTBFO2dCQUMxRSxJQUFJLENBQUMsTUFBTTtvQkFDUCxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUMzRixJQUFJLENBQUMsbUJBQW1CLENBQ3BCLE9BQU8sRUFBRSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsMENBQTBDLENBQUMsQ0FBQztvQkFDOUUsT0FBTztpQkFDUjtnQkFFRCxpRUFBaUU7Z0JBQ2pFLG1FQUFtRTtnQkFDbkUsb0VBQW9FO2dCQUNwRSxNQUFNLFlBQVksR0FBWSxNQUFNLENBQUMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxVQUFVLEdBQVcsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFFakUsa0VBQWtFO2dCQUNsRSxrRUFBa0U7Z0JBQ2xFLHlCQUF5QjtnQkFDekIsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsT0FBTyxFQUNQLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSw2QkFBNkI7d0JBQzlDLDJDQUEyQyxDQUFDLENBQUM7b0JBQ3JELE9BQU87aUJBQ1I7Z0JBQ0QsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUUvQixxRUFBcUU7Z0JBQ3JFLG1EQUFtRDtnQkFDbkQsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUM3QixTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDMUM7cUJBQU07b0JBQ0wsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUN0QzthQUNGO1lBRUQsa0ZBQWtGO1lBQ2xGLDZFQUE2RTtZQUM3RSxzRUFBc0U7WUFDdEUsMERBQTBEO1lBQzFELE1BQU0sbUJBQW1CLEdBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUMxQixJQUFJLEVBQUU7aUJBQ04sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUN4QyxTQUFTLEVBQUUsU0FBUyxFQUNwQixFQUFFLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUNqRSxtQkFBbUIsQ0FBQyxHQUFHLDJDQUF1QixJQUFJLElBQUksRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDbEYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FDekIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZFLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEIsMEZBQTBGO1lBQzFGLDRGQUE0RjtZQUM1RixvREFBb0Q7WUFDcEQsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUN4QixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO2dCQUNuRixPQUFPO2FBQ1I7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5RiwwRUFBMEU7WUFDMUUsZ0RBQWdEO1lBQ2hELFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDcEUsQ0FBQztLQUNGO0lBL0hELDREQStIQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTLG1CQUFtQixDQUFDLElBQVksRUFBRSxZQUFxQjtRQUM5RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsK0ZBQStGO1FBQy9GLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDdEMsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELDZFQUE2RTtJQUM3RSxTQUFTLDBCQUEwQixDQUFDLElBQWEsRUFBRSxPQUF1QjtRQUN4RSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakQscUZBQXFGO1FBQ3JGLHdFQUF3RTtRQUN4RSxzQ0FBc0M7UUFDdEMsSUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pELE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvblJ1bGUsIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0gZnJvbSAnLi4vLi4vLi4vbmctdXBkYXRlL3R5cGVzY3JpcHQvbW9kdWxlLXNwZWNpZmllcnMnO1xuXG5jb25zdCBPTkxZX1NVQlBBQ0tBR0VfRkFJTFVSRV9TVFIgPSBgSW1wb3J0aW5nIGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIGAgK1xuICAgIGBJbnN0ZWFkIGltcG9ydCBmcm9tIHRoZSBlbnRyeS1wb2ludCB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8uYDtcblxuY29uc3QgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIgPSBgSW1wb3J0cyBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgc2hvdWxkIGltcG9ydCBgICtcbiAgICBgc3BlY2lmaWMgc3ltYm9scyByYXRoZXIgdGhhbiBpbXBvcnRpbmcgdGhlIGVudGlyZSBsaWJyYXJ5LmA7XG5cbi8qKlxuICogUmVnZXggZm9yIHRlc3RpbmcgZmlsZSBwYXRocyBhZ2FpbnN0IHRvIGRldGVybWluZSBpZiB0aGUgZmlsZSBpcyBmcm9tIHRoZVxuICogQW5ndWxhciBNYXRlcmlhbCBsaWJyYXJ5LlxuICovXG5jb25zdCBBTkdVTEFSX01BVEVSSUFMX0ZJTEVQQVRIX1JFR0VYID0gbmV3IFJlZ0V4cChgJHttYXRlcmlhbE1vZHVsZVNwZWNpZmllcn0vKC4qPykvYCk7XG5cbi8qKlxuICogQSBtaWdyYXRpb24gcnVsZSB0aGF0IHVwZGF0ZXMgaW1wb3J0cyB3aGljaCByZWZlciB0byB0aGUgcHJpbWFyeSBBbmd1bGFyIE1hdGVyaWFsXG4gKiBlbnRyeS1wb2ludCB0byB1c2UgdGhlIGFwcHJvcHJpYXRlIHNlY29uZGFyeSBlbnRyeSBwb2ludHMgKGUuZy4gQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNlY29uZGFyeUVudHJ5UG9pbnRzUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuICBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA4LiBUaGUgcHJpbWFyeVxuICAvLyBlbnRyeS1wb2ludCBvZiBNYXRlcmlhbCBoYXMgYmVlbiBtYXJrZWQgYXMgZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDguXG4gIHJ1bGVFbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY4O1xuXG4gIHZpc2l0Tm9kZShkZWNsYXJhdGlvbjogdHMuTm9kZSk6IHZvaWQge1xuICAgIC8vIE9ubHkgbG9vayBhdCBpbXBvcnQgZGVjbGFyYXRpb25zLlxuICAgIGlmICghdHMuaXNJbXBvcnREZWNsYXJhdGlvbihkZWNsYXJhdGlvbikgfHxcbiAgICAgICAgIXRzLmlzU3RyaW5nTGl0ZXJhbExpa2UoZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydExvY2F0aW9uID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLnRleHQ7XG4gICAgLy8gSWYgdGhlIGltcG9ydCBtb2R1bGUgaXMgbm90IEBhbmd1bGFyL21hdGVyaWFsLCBza2lwIGNoZWNrLlxuICAgIGlmIChpbXBvcnRMb2NhdGlvbiAhPT0gbWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBpbXBvcnQgY2xhdXNlIGlzIGZvdW5kLCBvciBub3RoaW5nIGlzIG5hbWVkIGFzIGEgYmluZGluZyBpbiB0aGVcbiAgICAvLyBpbXBvcnQsIGFkZCBmYWlsdXJlIHNheWluZyB0byBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UgfHwgIWRlY2xhcmF0aW9uLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBbGwgbmFtZWQgYmluZGluZ3MgaW4gaW1wb3J0IGNsYXVzZXMgbXVzdCBiZSBuYW1lZCBzeW1ib2xzLCBvdGhlcndpc2UgYWRkXG4gICAgLy8gZmFpbHVyZSBzYXlpbmcgdG8gaW1wb3J0IHN5bWJvbHMgaW4gY2xhdXNlLlxuICAgIGlmICghdHMuaXNOYW1lZEltcG9ydHMoZGVjbGFyYXRpb24uaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZGVjbGFyYXRpb24sIE5PX0lNUE9SVF9OQU1FRF9TWU1CT0xTX0ZBSUxVUkVfU1RSKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBubyBzeW1ib2xzIGFyZSBpbiB0aGUgbmFtZWQgYmluZGluZ3MgdGhlbiBhZGQgZmFpbHVyZSBzYXlpbmcgdG9cbiAgICAvLyBpbXBvcnQgc3ltYm9scyBpbiBjbGF1c2UuXG4gICAgaWYgKCFkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbiwgTk9fSU1QT1JUX05BTUVEX1NZTUJPTFNfRkFJTFVSRV9TVFIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdoZXRoZXIgdGhlIGV4aXN0aW5nIGltcG9ydCBkZWNsYXJhdGlvbiBpcyB1c2luZyBhIHNpbmdsZSBxdW90ZSBtb2R1bGUgc3BlY2lmaWVyLlxuICAgIGNvbnN0IHNpbmdsZVF1b3RlSW1wb3J0ID0gZGVjbGFyYXRpb24ubW9kdWxlU3BlY2lmaWVyLmdldFRleHQoKVswXSA9PT0gYCdgO1xuXG4gICAgLy8gTWFwIHdoaWNoIGNvbnNpc3RzIG9mIHNlY29uZGFyeSBlbnRyeS1wb2ludHMgYW5kIGltcG9ydCBzcGVjaWZpZXJzIHdoaWNoIGFyZSB1c2VkXG4gICAgLy8gd2l0aGluIHRoZSBjdXJyZW50IGltcG9ydCBkZWNsYXJhdGlvbi5cbiAgICBjb25zdCBpbXBvcnRNYXAgPSBuZXcgTWFwPHN0cmluZywgdHMuSW1wb3J0U3BlY2lmaWVyW10+KCk7XG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHN1YnBhY2thZ2UgZWFjaCBzeW1ib2wgaW4gdGhlIG5hbWVkQmluZGluZyBjb21lcyBmcm9tLlxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkZWNsYXJhdGlvbi5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cykge1xuICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LnByb3BlcnR5TmFtZSA/IGVsZW1lbnQucHJvcGVydHlOYW1lIDogZWxlbWVudC5uYW1lO1xuXG4gICAgICAvLyBHZXQgdGhlIHN5bWJvbCBmb3IgdGhlIG5hbWVkIGJpbmRpbmcgZWxlbWVudC4gTm90ZSB0aGF0IHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlXG4gICAgICAvLyB2YWx1ZSBkZWNsYXJhdGlvbiBiYXNlZCBvbiB0aGUgdHlwZSBvZiB0aGUgZWxlbWVudCBhcyB0eXBlcyBhcmUgbm90IG5lY2Vzc2FyaWx5XG4gICAgICAvLyBzcGVjaWZpYyB0byBhIGdpdmVuIHNlY29uZGFyeSBlbnRyeS1wb2ludCAoZS5nLiBleHBvcnRzIHdpdGggdGhlIHR5cGUgb2YgXCJzdHJpbmdcIilcbiAgICAgIC8vIHdvdWxkIHJlc29sdmUgdG8gdGhlIG1vZHVsZSB0eXBlcyBwcm92aWRlZCBieSBUeXBlU2NyaXB0IGl0c2VsZi5cbiAgICAgIGNvbnN0IHN5bWJvbCA9IGdldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKGVsZW1lbnROYW1lLCB0aGlzLnR5cGVDaGVja2VyKTtcblxuICAgICAgLy8gSWYgdGhlIHN5bWJvbCBjYW4ndCBiZSBmb3VuZCwgb3Igbm8gZGVjbGFyYXRpb24gY291bGQgYmUgZm91bmQgd2l0aGluXG4gICAgICAvLyB0aGUgc3ltYm9sLCBhZGQgZmFpbHVyZSB0byByZXBvcnQgdGhhdCB0aGUgZ2l2ZW4gc3ltYm9sIGNhbid0IGJlIGZvdW5kLlxuICAgICAgaWYgKCFzeW1ib2wgfHxcbiAgICAgICAgICAhKHN5bWJvbC52YWx1ZURlY2xhcmF0aW9uIHx8IChzeW1ib2wuZGVjbGFyYXRpb25zICYmIHN5bWJvbC5kZWNsYXJhdGlvbnMubGVuZ3RoICE9PSAwKSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgICAgZWxlbWVudCwgYFwiJHtlbGVtZW50LmdldFRleHQoKX1cIiB3YXMgbm90IGZvdW5kIGluIHRoZSBNYXRlcmlhbCBsaWJyYXJ5LmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBmaWxlbmFtZSBmb3IgdGhlIHNvdXJjZSBmaWxlIG9mIHRoZSBub2RlIHRoYXQgY29udGFpbnMgdGhlXG4gICAgICAvLyBmaXJzdCBkZWNsYXJhdGlvbiBvZiB0aGUgc3ltYm9sLiBBbGwgc3ltYm9sIGRlY2xhcmF0aW9ucyBtdXN0IGJlXG4gICAgICAvLyBwYXJ0IG9mIGEgZGVmaW5pbmcgbm9kZSwgc28gcGFyZW50IGNhbiBiZSBhc3NlcnRlZCB0byBiZSBkZWZpbmVkLlxuICAgICAgY29uc3QgcmVzb2x2ZWROb2RlOiB0cy5Ob2RlID0gc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gfHwgc3ltYm9sLmRlY2xhcmF0aW9uc1swXTtcbiAgICAgIGNvbnN0IHNvdXJjZUZpbGU6IHN0cmluZyA9IHJlc29sdmVkTm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG5cbiAgICAgIC8vIEZpbGUgdGhlIG1vZHVsZSB0aGUgc3ltYm9sIGJlbG9uZ3MgdG8gZnJvbSBhIHJlZ2V4IG1hdGNoIG9mIHRoZVxuICAgICAgLy8gZmlsZW5hbWUuIFRoaXMgd2lsbCBhbHdheXMgbWF0Y2ggc2luY2Ugb25seSBcIkBhbmd1bGFyL21hdGVyaWFsXCJcbiAgICAgIC8vIGVsZW1lbnRzIGFyZSBhbmFseXplZC5cbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBzb3VyY2VGaWxlLm1hdGNoKEFOR1VMQVJfTUFURVJJQUxfRklMRVBBVEhfUkVHRVgpO1xuICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICBgXCIke2VsZW1lbnQuZ2V0VGV4dCgpfVwiIHdhcyBmb3VuZCB0byBiZSBpbXBvcnRlZCBgICtcbiAgICAgICAgICAgICAgICBgZnJvbSBhIGZpbGUgb3V0c2lkZSB0aGUgTWF0ZXJpYWwgbGlicmFyeS5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgWywgbW9kdWxlTmFtZV0gPSBtYXRjaGVzO1xuXG4gICAgICAvLyBUaGUgbW9kdWxlIG5hbWUgd2hlcmUgdGhlIHN5bWJvbCBpcyBkZWZpbmVkIGUuZy4gY2FyZCwgZGlhbG9nLiBUaGVcbiAgICAgIC8vIGZpcnN0IGNhcHR1cmUgZ3JvdXAgaXMgY29udGFpbnMgdGhlIG1vZHVsZSBuYW1lLlxuICAgICAgaWYgKGltcG9ydE1hcC5oYXMobW9kdWxlTmFtZSkpIHtcbiAgICAgICAgaW1wb3J0TWFwLmdldChtb2R1bGVOYW1lKSEucHVzaChlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltcG9ydE1hcC5zZXQobW9kdWxlTmFtZSwgW2VsZW1lbnRdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zIHRoZSBpbXBvcnQgZGVjbGFyYXRpb24gaW50byBtdWx0aXBsZSBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgaW1wb3J0XG4gICAgLy8gdGhlIGdpdmVuIHN5bWJvbHMgZnJvbSB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnRzLiBGb3IgZXhhbXBsZTpcbiAgICAvLyBpbXBvcnQge01hdENhcmRNb2R1bGUsIE1hdENhcmRUaXRsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCc7XG4gICAgLy8gaW1wb3J0IHtNYXRSYWRpb01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcmFkaW8nO1xuICAgIGNvbnN0IG5ld0ltcG9ydFN0YXRlbWVudHMgPVxuICAgICAgICBBcnJheS5mcm9tKGltcG9ydE1hcC5lbnRyaWVzKCkpXG4gICAgICAgICAgICAuc29ydCgpXG4gICAgICAgICAgICAubWFwKChbbmFtZSwgZWxlbWVudHNdKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydCA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCB0cy5jcmVhdGVOYW1lZEltcG9ydHMoZWxlbWVudHMpKSxcbiAgICAgICAgICAgICAgICAgIGNyZWF0ZVN0cmluZ0xpdGVyYWwoYCR7bWF0ZXJpYWxNb2R1bGVTcGVjaWZpZXJ9LyR7bmFtZX1gLCBzaW5nbGVRdW90ZUltcG9ydCkpO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcmludGVyLnByaW50Tm9kZShcbiAgICAgICAgICAgICAgICAgIHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBuZXdJbXBvcnQsIGRlY2xhcmF0aW9uLmdldFNvdXJjZUZpbGUoKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oJ1xcbicpO1xuXG4gICAgLy8gV2l0aG91dCBhbnkgaW1wb3J0IHN0YXRlbWVudHMgdGhhdCB3ZXJlIGdlbmVyYXRlZCwgd2UgY2FuIGFzc3VtZSB0aGF0IHRoaXMgd2FzIGFuIGVtcHR5XG4gICAgLy8gaW1wb3J0IGRlY2xhcmF0aW9uLiBXZSBzdGlsbCB3YW50IHRvIGFkZCBhIGZhaWx1cmUgaW4gb3JkZXIgdG8gbWFrZSBkZXZlbG9wZXJzIGF3YXJlIHRoYXRcbiAgICAvLyBpbXBvcnRpbmcgZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCIgaXMgZGVwcmVjYXRlZC5cbiAgICBpZiAoIW5ld0ltcG9ydFN0YXRlbWVudHMpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShkZWNsYXJhdGlvbi5tb2R1bGVTcGVjaWZpZXIsIE9OTFlfU1VCUEFDS0FHRV9GQUlMVVJFX1NUUik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmdldFVwZGF0ZVJlY29yZGVyKGRlY2xhcmF0aW9uLm1vZHVsZVNwZWNpZmllci5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgLy8gUGVyZm9ybSB0aGUgcmVwbGFjZW1lbnQgdGhhdCBzd2l0Y2hlcyB0aGUgcHJpbWFyeSBlbnRyeS1wb2ludCBpbXBvcnQgdG9cbiAgICAvLyB0aGUgaW5kaXZpZHVhbCBzZWNvbmRhcnkgZW50cnktcG9pbnQgaW1wb3J0cy5cbiAgICByZWNvcmRlci5yZW1vdmUoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgZGVjbGFyYXRpb24uZ2V0V2lkdGgoKSk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoZGVjbGFyYXRpb24uZ2V0U3RhcnQoKSwgbmV3SW1wb3J0U3RhdGVtZW50cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RyaW5nIGxpdGVyYWwgZnJvbSB0aGUgc3BlY2lmaWVkIHRleHQuXG4gKiBAcGFyYW0gdGV4dCBUZXh0IG9mIHRoZSBzdHJpbmcgbGl0ZXJhbC5cbiAqIEBwYXJhbSBzaW5nbGVRdW90ZXMgV2hldGhlciBzaW5nbGUgcXVvdGVzIHNob3VsZCBiZSB1c2VkIHdoZW4gcHJpbnRpbmcgdGhlIGxpdGVyYWwgbm9kZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU3RyaW5nTGl0ZXJhbCh0ZXh0OiBzdHJpbmcsIHNpbmdsZVF1b3RlczogYm9vbGVhbik6IHRzLlN0cmluZ0xpdGVyYWwge1xuICBjb25zdCBsaXRlcmFsID0gdHMuY3JlYXRlU3RyaW5nTGl0ZXJhbCh0ZXh0KTtcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvYmxvYi9tYXN0ZXIvc3JjL2NvbXBpbGVyL3V0aWxpdGllcy50cyNMNTg0LUw1OTBcbiAgbGl0ZXJhbFsnc2luZ2xlUXVvdGUnXSA9IHNpbmdsZVF1b3RlcztcbiAgcmV0dXJuIGxpdGVyYWw7XG59XG5cbi8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIGdpdmVuIG5vZGUuICovXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlLCBjaGVja2VyOiB0cy5UeXBlQ2hlY2tlcik6IHRzLlN5bWJvbHx1bmRlZmluZWQge1xuICBjb25zdCBzeW1ib2wgPSBjaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgLy8gU3ltYm9scyBjYW4gYmUgYWxpYXNlcyBvZiB0aGUgZGVjbGFyYXRpb24gc3ltYm9sLiBlLmcuIGluIG5hbWVkIGltcG9ydCBzcGVjaWZpZXJzLlxuICAvLyBXZSBuZWVkIHRvIHJlc29sdmUgdGhlIGFsaWFzZWQgc3ltYm9sIGJhY2sgdG8gdGhlIGRlY2xhcmF0aW9uIHN5bWJvbC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgaWYgKHN5bWJvbCAmJiAoc3ltYm9sLmZsYWdzICYgdHMuU3ltYm9sRmxhZ3MuQWxpYXMpICE9PSAwKSB7XG4gICAgcmV0dXJuIGNoZWNrZXIuZ2V0QWxpYXNlZFN5bWJvbChzeW1ib2wpO1xuICB9XG4gIHJldHVybiBzeW1ib2w7XG59XG4iXX0=